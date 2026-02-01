import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPlayerTeam, TEAMS_ALIASES } from '@/src/lib/scrapers/types'
import {
  calcularSentimento,
  calcularDivergencia,
  calcularDivisaoSentimento,
  EMOJI_DISPLAY,
} from '@/lib/algorithms'

export const dynamic = 'force-dynamic'

/**
 * Verifica se um rumor é relevante para o time do usuário
 */
function isRumorRelevantForTeam(
  rumor: { playerName: string; toTeam: string; fromTeam: string | null },
  userTeam: string
): boolean {
  if (!userTeam) return true

  const userTeamLower = userTeam.toLowerCase()
  const toTeamLower = rumor.toTeam.toLowerCase()
  const fromTeamLower = rumor.fromTeam?.toLowerCase() || ''

  const userTeamAliases = TEAMS_ALIASES[userTeamLower] || [userTeamLower]

  // Destino é o time do usuário
  const isDestination = userTeamAliases.some(alias =>
    toTeamLower.includes(alias) || alias.includes(toTeamLower)
  )
  if (isDestination) return true

  // Origem é o time do usuário (só verifica se fromTeam existe)
  if (fromTeamLower) {
    const isOrigin = userTeamAliases.some(alias =>
      fromTeamLower.includes(alias) || alias.includes(fromTeamLower)
    )
    if (isOrigin) return true
  }

  // Jogador pertence ao elenco do time
  const playerTeam = getPlayerTeam(rumor.playerName)
  if (playerTeam && playerTeam === userTeamLower) return true

  return false
}

/**
 * Determina se um rumor está "quente" (atividade recente) ou "frio" (esfriou)
 */
function isRumorHot(
  recentSignals: { mentions: number; velocity: number }[],
  signalScore: number | null,
  createdAt: Date
): boolean {
  // Rumor novo (criado nas últimas 48h) é considerado quente
  const hours48ago = Date.now() - 48 * 60 * 60 * 1000
  if (createdAt.getTime() > hours48ago) return true

  // Se tem signalScore alto, está quente
  if ((signalScore ?? 0) > 0.3) return true

  // Se teve menções significativas nas últimas 24h
  const totalMentions = recentSignals.reduce((sum, s) => sum + s.mentions, 0)
  if (totalMentions >= 5) return true

  // Se teve crescimento positivo recente
  const avgVelocity = recentSignals.length > 0
    ? recentSignals.reduce((sum, s) => sum + s.velocity, 0) / recentSignals.length
    : 0
  if (avgVelocity > 0.3) return true

  return false
}

/**
 * Algoritmo de Relevância para Feed
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

/**
 * GET /api/rumors
 * Retorna rumores paginados com filtros e ordenação por relevância
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const team = searchParams.get('team') // filtrar por time
    const order = searchParams.get('order') || 'quentes' // quentes, recentes, fechando
    const userId = searchParams.get('userId')
    const userTeam = searchParams.get('userTeam')

    // Construir filtros
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { status: 'open' }

    if (team && team !== 'todos') {
      where.OR = [
        { toTeam: { contains: team, mode: 'insensitive' } },
        { fromTeam: { contains: team, mode: 'insensitive' } },
      ]
    }

    // Para 'recentes' e 'fechando', usar ordenação simples do Prisma
    if (order === 'recentes' || order === 'fechando') {
      const orderBy = order === 'recentes'
        ? [{ createdAt: 'desc' as const }]
        : [{ closesAt: 'asc' as const }]

      const [rumors, total] = await Promise.all([
        prisma.rumor.findMany({
          where,
          include: {
            signals: {
              include: { influencer: true },
              take: 3,
            },
            predictions: {
              select: { id: true, prediction: true, userId: true },
            },
            // PRD v3: Incluir reações e fontes
            reacoes: {
              select: { emoji: true, timeId: true },
            },
            fontes: {
              include: { jornalista: true },
              take: 3,
            },
          },
          orderBy,
          take: limit,
          skip: offset,
        }),
        prisma.rumor.count({ where }),
      ])

      const serializedRumors = rumors.map(r => {
        // PRD v3: Calcular sentimento
        const reacoesArray = r.reacoes || []
        const sentimentoGeral = calcularSentimento(reacoesArray)

        // Agrupar por time
        const reacoesPortime: Record<string, typeof reacoesArray> = {}
        for (const reacao of reacoesArray) {
          if (!reacoesPortime[reacao.timeId]) {
            reacoesPortime[reacao.timeId] = []
          }
          reacoesPortime[reacao.timeId].push(reacao)
        }
        const sentimentoPorTime: Record<string, ReturnType<typeof calcularSentimento>> = {}
        for (const [timeId, reacoes] of Object.entries(reacoesPortime)) {
          sentimentoPorTime[timeId] = calcularSentimento(reacoes)
        }

        const divergencia = calcularDivergencia(r.probabilidade, sentimentoGeral.score)

        return {
          id: r.id,
          playerName: r.playerName,
          playerImage: r.playerImage,
          fromTeam: r.fromTeam,
          toTeam: r.toTeam,
          title: r.title,
          description: r.description,
          contexto: r.contexto,
          category: r.category,
          categoria: r.categoria,
          statusRumor: r.statusRumor,
          probabilidade: r.probabilidade,
          probTrend: r.probTrend,
          confianca: r.confianca,
          sentiment: r.sentiment,
          sentimento: {
            geral: sentimentoGeral,
            porTime: sentimentoPorTime,
            distribuicaoDisplay: {
              '🔥': sentimentoGeral.distribuicao.FOGO,
              '😍': sentimentoGeral.distribuicao.AMOR,
              '😐': sentimentoGeral.distribuicao.NEUTRO,
              '👎': sentimentoGeral.distribuicao.NAO_GOSTO,
              '💀': sentimentoGeral.distribuicao.PESSIMO,
            },
          },
          divergencia,
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
          fontes: (r.fontes || []).map(f => ({
            id: f.id,
            posicao: f.posicao,
            intensidade: f.intensidade,
            textoOriginal: f.textoOriginal,
            dataPublicacao: f.dataPublicacao.toISOString(),
            jornalista: {
              id: f.jornalista.id,
              nome: f.jornalista.nome,
              handle: f.jornalista.handle,
              veiculo: f.jornalista.veiculo,
              credibilidade: f.jornalista.credibilidade,
            },
          })),
          predictions: r.predictions.map(p => ({
            id: p.id,
            prediction: p.prediction,
            userId: p.userId,
            createdAt: '',
          })),
          totalReacoes: reacoesArray.length,
        }
      })

      return NextResponse.json({
        rumors: serializedRumors,
        total,
        hasMore: offset + limit < total,
        nextOffset: offset + limit,
      })
    }

    // Data de 24h atrás para calcular atividade recente
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

    // Para 'quentes', usar algoritmo de relevância completo
    const rumors = await prisma.rumor.findMany({
      where,
      include: {
        signals: {
          include: { influencer: true },
          take: 3,
        },
        predictions: {
          select: { id: true, prediction: true, userId: true },
        },
        newsItems: {
          select: { id: true },
        },
        // Incluir sinais das últimas 24h para determinar se está "quente"
        rumorSignals: {
          where: { period: { gte: last24h } },
          select: { mentions: true, velocity: true },
        },
        // PRD v3: Incluir reações para calcular sentimento
        reacoes: {
          select: { emoji: true, timeId: true },
        },
        // PRD v3: Incluir fontes para mostrar jornalistas
        fontes: {
          include: { jornalista: true },
          take: 3,
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

    // FILTRAR: Apenas rumores relevantes para o time do usuário
    const relevantRumors = userTeam
      ? rumors.filter(rumor => isRumorRelevantForTeam(rumor, userTeam))
      : rumors

    // Calcular scores de relevância
    const scoredRumors = relevantRumors.map(rumor => {
      const factors = {
        myTeam: 0,
        engagement: 0,
        buzz: 0,
        recency: 0,
        urgency: 0,
      }

      // 1. Meu Time (40 pontos) - sempre true pois já filtramos
      factors.myTeam = userTeam ? 40 : 0

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

      // Determinar se está "quente" (atividade recente)
      const hot = isRumorHot(rumor.rumorSignals, rumor.signalScore, rumor.createdAt)

      return { ...rumor, _relevanceScore: totalScore, _isHot: hot }
    })

    // Ordenar: quentes primeiro, depois por score de relevância
    scoredRumors.sort((a, b) => {
      if (a._isHot && !b._isHot) return -1
      if (!a._isHot && b._isHot) return 1
      return b._relevanceScore - a._relevanceScore
    })
    const paginatedRumors = scoredRumors.slice(offset, offset + limit)
    const total = scoredRumors.length

    const serializedRumors = paginatedRumors.map(r => {
      // PRD v3: Calcular sentimento por time
      const reacoesArray = r.reacoes || []
      const sentimentoGeral = calcularSentimento(reacoesArray)

      // Agrupar reações por time
      const reacoesPortime: Record<string, typeof reacoesArray> = {}
      for (const reacao of reacoesArray) {
        if (!reacoesPortime[reacao.timeId]) {
          reacoesPortime[reacao.timeId] = []
        }
        reacoesPortime[reacao.timeId].push(reacao)
      }

      const sentimentoPorTime: Record<string, ReturnType<typeof calcularSentimento>> = {}
      for (const [timeId, reacoes] of Object.entries(reacoesPortime)) {
        sentimentoPorTime[timeId] = calcularSentimento(reacoes)
      }

      // PRD v3: Calcular divergência (probabilidade vs sentimento)
      const divergencia = calcularDivergencia(r.probabilidade, sentimentoGeral.score)

      // PRD v3: Calcular divisão de sentimento
      const divisaoSentimento = calcularDivisaoSentimento(sentimentoGeral.distribuicao)

      return {
        id: r.id,
        playerName: r.playerName,
        playerImage: r.playerImage,
        fromTeam: r.fromTeam,
        toTeam: r.toTeam,
        title: r.title,
        description: r.description,
        contexto: r.contexto,
        category: r.category,
        categoria: r.categoria,
        statusRumor: r.statusRumor,

        // PRD v3: Dois eixos separados
        probabilidade: r.probabilidade,
        probTrend: r.probTrend,
        confianca: r.confianca,

        // PRD v3: Sentimento (legado para compatibilidade)
        sentiment: r.sentiment,

        // PRD v3: Sentimento estruturado
        sentimento: {
          geral: sentimentoGeral,
          porTime: sentimentoPorTime,
          distribuicaoDisplay: {
            '🔥': sentimentoGeral.distribuicao.FOGO,
            '😍': sentimentoGeral.distribuicao.AMOR,
            '😐': sentimentoGeral.distribuicao.NEUTRO,
            '👎': sentimentoGeral.distribuicao.NAO_GOSTO,
            '💀': sentimentoGeral.distribuicao.PESSIMO,
          },
        },

        // PRD v3: Divergência
        divergencia,
        divisaoSentimento,

        status: r.status,
        signalScore: r.signalScore,
        isHot: r._isHot,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        closesAt: r.closesAt.toISOString(),
        resolvedAt: r.resolvedAt?.toISOString() || null,
        lastScraped: r.lastScraped?.toISOString() || null,

        // Sinais de influenciadores (legado)
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

        // PRD v3: Fontes de jornalistas
        fontes: (r.fontes || []).map(f => ({
          id: f.id,
          posicao: f.posicao,
          intensidade: f.intensidade,
          textoOriginal: f.textoOriginal,
          dataPublicacao: f.dataPublicacao.toISOString(),
          jornalista: {
            id: f.jornalista.id,
            nome: f.jornalista.nome,
            handle: f.jornalista.handle,
            veiculo: f.jornalista.veiculo,
            credibilidade: f.jornalista.credibilidade,
          },
        })),

        // Predictions (legado)
        predictions: r.predictions.map(p => ({
          id: p.id,
          prediction: p.prediction,
          userId: p.userId,
          createdAt: '',
        })),

        // Total de reações
        totalReacoes: reacoesArray.length,
      }
    })

    return NextResponse.json({
      rumors: serializedRumors,
      total,
      hasMore: offset + limit < total,
      nextOffset: offset + limit,
    })
  } catch (error) {
    console.error('Erro ao buscar rumores:', error)
    return NextResponse.json({ error: 'Erro ao buscar rumores' }, { status: 500 })
  }
}
