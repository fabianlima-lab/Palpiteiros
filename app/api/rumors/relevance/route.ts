import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Algoritmo de Relevância para Feed
 *
 * Fatores considerados:
 * 1. Meu Time (peso máximo) - Rumores sobre o time do usuário
 * 2. Engajamento Prévio - Rumores que o usuário já interagiu
 * 3. Buzz/Hype - Combinação de:
 *    - Quantidade de predictions
 *    - Quantidade de sinais de influenciadores
 *    - Signal score agregado
 *    - Recência (rumores mais novos)
 *    - Proximidade do fechamento (urgência)
 */

interface RelevanceScore {
  rumorId: string
  score: number
  factors: {
    myTeam: number
    engagement: number
    buzz: number
    recency: number
    urgency: number
  }
}

function calculateRecencyScore(createdAt: Date): number {
  const now = new Date()
  const hoursAgo = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

  // Score máximo para rumores das últimas 6h, decai gradualmente
  if (hoursAgo <= 6) return 1.0
  if (hoursAgo <= 24) return 0.8
  if (hoursAgo <= 48) return 0.6
  if (hoursAgo <= 72) return 0.4
  if (hoursAgo <= 168) return 0.2 // 1 semana
  return 0.1
}

function calculateUrgencyScore(closesAt: Date): number {
  const now = new Date()
  const hoursUntilClose = (closesAt.getTime() - now.getTime()) / (1000 * 60 * 60)

  // Rumores que fecham em breve tem prioridade
  if (hoursUntilClose <= 6) return 1.0
  if (hoursUntilClose <= 24) return 0.8
  if (hoursUntilClose <= 48) return 0.6
  if (hoursUntilClose <= 72) return 0.4
  return 0.2
}

function calculateBuzzScore(
  predictionsCount: number,
  signalsCount: number,
  signalScore: number | null,
  newsCount: number
): number {
  // Normalizar cada métrica (assumindo máximos razoáveis)
  const predScore = Math.min(predictionsCount / 100, 1) // 100+ predictions = score 1
  const sigScore = Math.min(signalsCount / 5, 1) // 5+ signals = score 1
  const aggScore = signalScore ?? 0 // já normalizado 0-1
  const newsScore = Math.min(newsCount / 10, 1) // 10+ news = score 1

  // Média ponderada
  return (predScore * 0.3) + (sigScore * 0.25) + (aggScore * 0.25) + (newsScore * 0.2)
}

/**
 * GET /api/rumors/relevance
 * Retorna rumores ordenados por relevância personalizada
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const userId = searchParams.get('userId')
    const userTeam = searchParams.get('userTeam')

    // Buscar todos os rumores abertos com relacionamentos
    const rumors = await prisma.rumor.findMany({
      where: { status: 'open' },
      include: {
        signals: {
          include: {
            influencer: true,
          },
        },
        predictions: {
          select: {
            id: true,
            prediction: true,
            userId: true,
          },
        },
        newsItems: {
          select: {
            id: true,
          },
        },
      },
    })

    // Buscar IDs de rumores que o usuário já interagiu
    const userEngagedRumorIds = new Set<string>()
    if (userId) {
      const userPredictions = await prisma.prediction.findMany({
        where: { userId },
        select: { rumorId: true },
      })
      userPredictions.forEach(p => userEngagedRumorIds.add(p.rumorId))
    }

    // Calcular scores de relevância para cada rumor
    const scoredRumors: (typeof rumors[0] & { relevanceScore: RelevanceScore })[] = rumors.map(rumor => {
      const factors = {
        // 1. Meu Time: peso 40 se é sobre meu time
        myTeam: 0,
        // 2. Engajamento prévio: peso 20 se já interagi
        engagement: 0,
        // 3. Buzz: peso 25 baseado em métricas
        buzz: 0,
        // 4. Recência: peso 10
        recency: 0,
        // 5. Urgência: peso 5
        urgency: 0,
      }

      // 1. Meu Time (40 pontos)
      if (userTeam) {
        const teamLower = userTeam.toLowerCase()
        const isMyTeam =
          rumor.toTeam.toLowerCase().includes(teamLower) ||
          rumor.fromTeam?.toLowerCase().includes(teamLower) ||
          teamLower.includes(rumor.toTeam.toLowerCase())

        factors.myTeam = isMyTeam ? 40 : 0
      }

      // 2. Engajamento prévio (20 pontos)
      factors.engagement = userEngagedRumorIds.has(rumor.id) ? 20 : 0

      // 3. Buzz (25 pontos)
      const buzzScore = calculateBuzzScore(
        rumor.predictions.length,
        rumor.signals.length,
        rumor.signalScore,
        rumor.newsItems.length
      )
      factors.buzz = buzzScore * 25

      // 4. Recência (10 pontos)
      factors.recency = calculateRecencyScore(rumor.createdAt) * 10

      // 5. Urgência (5 pontos)
      factors.urgency = calculateUrgencyScore(rumor.closesAt) * 5

      const totalScore = factors.myTeam + factors.engagement + factors.buzz + factors.recency + factors.urgency

      return {
        ...rumor,
        relevanceScore: {
          rumorId: rumor.id,
          score: totalScore,
          factors,
        },
      }
    })

    // Ordenar por score de relevância (decrescente)
    scoredRumors.sort((a, b) => b.relevanceScore.score - a.relevanceScore.score)

    // Aplicar paginação
    const paginatedRumors = scoredRumors.slice(offset, offset + limit)
    const total = scoredRumors.length

    // Serializar datas
    const serializedRumors = paginatedRumors.map(r => ({
      id: r.id,
      playerName: r.playerName,
      playerImage: r.playerImage,
      fromTeam: r.fromTeam,
      toTeam: r.toTeam,
      title: r.title,
      description: r.description,
      category: r.category,
      sentiment: r.sentiment,
      status: r.status,
      signalScore: r.signalScore,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      closesAt: r.closesAt.toISOString(),
      resolvedAt: r.resolvedAt?.toISOString() || null,
      lastScraped: r.lastScraped?.toISOString() || null,
      signals: r.signals.map(s => ({
        id: s.id,
        signal: s.signal,
        confidence: s.confidence,
        createdAt: s.createdAt.toISOString(),
        influencer: {
          id: s.influencer.id,
          name: s.influencer.name,
          username: s.influencer.username,
          outlet: s.influencer.outlet,
          trustScore: s.influencer.trustScore,
          createdAt: s.influencer.createdAt.toISOString(),
          updatedAt: s.influencer.updatedAt.toISOString(),
        },
      })),
      predictions: r.predictions.map(p => ({
        id: p.id,
        prediction: p.prediction,
        userId: p.userId,
        createdAt: '',
      })),
      // Incluir score de relevância para debug/transparência
      _relevance: r.relevanceScore,
    }))

    return NextResponse.json({
      rumors: serializedRumors,
      total,
      hasMore: offset + limit < total,
      nextOffset: offset + limit,
      // Meta info sobre o sorting
      _meta: {
        algorithm: 'relevance_v1',
        factors: {
          myTeam: { weight: 40, description: 'Rumor sobre o time do usuário' },
          engagement: { weight: 20, description: 'Usuário já interagiu com o rumor' },
          buzz: { weight: 25, description: 'Quantidade de predictions, signals, news' },
          recency: { weight: 10, description: 'Quão recente é o rumor' },
          urgency: { weight: 5, description: 'Proximidade do fechamento' },
        },
      },
    })
  } catch (error) {
    console.error('Erro ao calcular relevância:', error)
    return NextResponse.json({ error: 'Erro ao calcular relevância' }, { status: 500 })
  }
}
