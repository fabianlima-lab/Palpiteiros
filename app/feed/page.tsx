import { prisma } from '@/lib/prisma'
import { FeedClient } from './FeedClient'

export const dynamic = 'force-dynamic'

/**
 * Algoritmo de Relevância para Feed
 *
 * Fatores considerados (em ordem de peso):
 * 1. Meu Time (40 pontos) - Rumores sobre o time do usuário
 * 2. Engajamento Prévio (20 pontos) - Rumores que o usuário já interagiu
 * 3. Buzz/Hype (25 pontos) - Predictions, signals, news
 * 4. Recência (10 pontos) - Rumores mais novos
 * 5. Urgência (5 pontos) - Proximidade do fechamento
 */

function calculateRecencyScore(createdAt: Date): number {
  const now = new Date()
  const hoursAgo = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

  if (hoursAgo <= 6) return 1.0
  if (hoursAgo <= 24) return 0.8
  if (hoursAgo <= 48) return 0.6
  if (hoursAgo <= 72) return 0.4
  if (hoursAgo <= 168) return 0.2
  return 0.1
}

function calculateUrgencyScore(closesAt: Date): number {
  const now = new Date()
  const hoursUntilClose = (closesAt.getTime() - now.getTime()) / (1000 * 60 * 60)

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
  const predScore = Math.min(predictionsCount / 100, 1)
  const sigScore = Math.min(signalsCount / 5, 1)
  const aggScore = signalScore ?? 0
  const newsScore = Math.min(newsCount / 10, 1)

  return (predScore * 0.3) + (sigScore * 0.25) + (aggScore * 0.25) + (newsScore * 0.2)
}

export default async function FeedPage() {
  try {
    // Buscar usuário demo (temporário até implementar auth)
    const user = await prisma.user.findFirst({
      where: { username: 'torcedor_demo' },
    })

    const userTeam = user?.team?.toLowerCase() || ''
    const userId = user?.id || ''

    // Buscar rumores ativos com relacionamentos
    const rumors = await prisma.rumor.findMany({
      where: { status: 'open' },
      include: {
        signals: {
          include: {
            influencer: true,
          },
        },
        predictions: true,
        newsItems: {
          select: { id: true },
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
    const scoredRumors = rumors.map(rumor => {
      const factors = {
        myTeam: 0,
        engagement: 0,
        buzz: 0,
        recency: 0,
        urgency: 0,
      }

      // 1. Meu Time (40 pontos)
      if (userTeam) {
        const isMyTeam =
          rumor.toTeam.toLowerCase().includes(userTeam) ||
          rumor.fromTeam?.toLowerCase().includes(userTeam) ||
          userTeam.includes(rumor.toTeam.toLowerCase())

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
        _relevanceScore: totalScore,
        _relevanceFactors: factors,
      }
    })

    // Ordenar por score de relevância (decrescente)
    scoredRumors.sort((a, b) => b._relevanceScore - a._relevanceScore)

    // Serializar datas para o cliente
    const serializedRumors = scoredRumors.map(r => ({
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
        createdAt: p.createdAt.toISOString(),
      })),
    }))

    // Buscar top usuários
    const topUsers = await prisma.user.findMany({
      orderBy: { points: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        username: true,
        points: true,
      },
    })

    const serializedUser = user ? {
      id: user.id,
      name: user.name,
      username: user.username,
      team: user.team,
      points: user.points,
      isPremium: user.isPremium,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    } : null

    return (
      <FeedClient
        initialRumors={serializedRumors}
        user={serializedUser}
        topUsers={topUsers}
      />
    )
  } catch (error) {
    console.error('Erro ao carregar feed:', error)
    return (
      <FeedClient
        initialRumors={[]}
        user={null}
        topUsers={[]}
      />
    )
  }
}
