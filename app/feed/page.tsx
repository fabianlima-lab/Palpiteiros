import { prisma } from '@/lib/prisma'
import { FeedClient } from './FeedClient'
import { getPlayerTeam, TEAMS_ALIASES } from '@/src/lib/scrapers/types'

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

/**
 * Verifica se um rumor é relevante para o time do usuário
 *
 * Um rumor é relevante se:
 * 1. toTeam é o time do usuário (jogador vindo pro time)
 * 2. fromTeam é o time do usuário (jogador saindo do time)
 * 3. O jogador pertence ao elenco atual do time do usuário
 */
function isRumorRelevantForTeam(
  rumor: { playerName: string; toTeam: string; fromTeam: string | null },
  userTeam: string
): boolean {
  if (!userTeam) return true // Sem time definido, mostra tudo

  const userTeamLower = userTeam.toLowerCase()
  const toTeamLower = rumor.toTeam.toLowerCase()
  const fromTeamLower = rumor.fromTeam?.toLowerCase() || ''

  // Pega aliases do time do usuário para matching mais flexível
  const userTeamAliases = TEAMS_ALIASES[userTeamLower] || [userTeamLower]

  // 1. Destino é o time do usuário (contratação)
  const isDestination = userTeamAliases.some(alias =>
    toTeamLower.includes(alias) || alias.includes(toTeamLower)
  )
  if (isDestination) return true

  // 2. Origem é o time do usuário (jogador saindo) - só verifica se fromTeam existe
  if (fromTeamLower) {
    const isOrigin = userTeamAliases.some(alias =>
      fromTeamLower.includes(alias) || alias.includes(fromTeamLower)
    )
    if (isOrigin) return true
  }

  // 3. Jogador pertence ao elenco do time
  const playerTeam = getPlayerTeam(rumor.playerName)
  if (playerTeam && playerTeam === userTeamLower) return true

  return false
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
 * Determina se um rumor está "quente" (atividade recente) ou "frio" (esfriou)
 *
 * Um rumor é QUENTE se:
 * 1. Teve menções nas últimas 24h (pelo menos 5 menções totais)
 * 2. OU signalScore > 0.3 (forte atividade agregada)
 * 3. OU foi criado nas últimas 48h (rumor novo)
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

export default async function FeedPage() {
  try {
    // Buscar usuário demo (temporário até implementar auth)
    const user = await prisma.user.findFirst({
      where: { username: 'torcedor_demo' },
    })

    const userTeam = user?.team?.toLowerCase() || ''
    const userId = user?.id || ''

    // Data de 24h atrás para calcular atividade recente
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

    // Buscar rumores ativos com relacionamentos (incluindo PRD v3)
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
        // Incluir sinais das últimas 24h para determinar se está "quente"
        rumorSignals: {
          where: {
            period: { gte: last24h },
          },
          select: {
            mentions: true,
            velocity: true,
          },
        },
        // PRD v3: Incluir fontes de jornalistas
        fontes: {
          include: {
            jornalista: true,
          },
        },
        // PRD v3: Incluir reacoes para sentimento
        reacoes: {
          select: {
            emoji: true,
            timeId: true,
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

    // FILTRAR: Apenas rumores relevantes para o time do usuário
    const relevantRumors = userTeam
      ? rumors.filter(rumor => isRumorRelevantForTeam(rumor, userTeam))
      : rumors

    // Calcular scores de relevância para cada rumor
    const scoredRumors = relevantRumors.map(rumor => {
      const factors = {
        myTeam: 0,
        engagement: 0,
        buzz: 0,
        recency: 0,
        urgency: 0,
      }

      // 1. Meu Time (40 pontos) - agora sempre true pois já filtramos
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

      // Determinar se o rumor está "quente" (atividade recente) ou "frio" (esfriou)
      const hot = isRumorHot(rumor.rumorSignals, rumor.signalScore, rumor.createdAt)

      return {
        ...rumor,
        _relevanceScore: totalScore,
        _relevanceFactors: factors,
        _isHot: hot,
      }
    })

    // Ordenar: rumores QUENTES primeiro, depois por score de relevância
    scoredRumors.sort((a, b) => {
      // Primeiro: quentes antes de frios
      if (a._isHot && !b._isHot) return -1
      if (!a._isHot && b._isHot) return 1
      // Depois: por score de relevância
      return b._relevanceScore - a._relevanceScore
    })

    // PRD v3: Calcular sentimento por emoji
    const calcularSentimento = (reacoes: { emoji: string; timeId: string }[]) => {
      const EMOJI_VALUES: Record<string, number> = {
        FOGO: 2, AMOR: 1, NEUTRO: 0, NAO_GOSTO: -1, PESSIMO: -2,
      }
      const EMOJI_DISPLAY: Record<string, string> = {
        FOGO: '🔥', AMOR: '😍', NEUTRO: '😐', NAO_GOSTO: '👎', PESSIMO: '💀',
      }

      const total = reacoes.length
      if (total === 0) {
        return {
          geral: { score: 0, label: 'dividido', distribuicao: {}, totalReacoes: 0 },
          distribuicaoDisplay: { '🔥': 0, '😍': 0, '😐': 0, '👎': 0, '💀': 0 },
        }
      }

      const distribuicao: Record<string, number> = { FOGO: 0, AMOR: 0, NEUTRO: 0, NAO_GOSTO: 0, PESSIMO: 0 }
      let somaValores = 0

      for (const reacao of reacoes) {
        distribuicao[reacao.emoji] = (distribuicao[reacao.emoji] || 0) + 1
        somaValores += EMOJI_VALUES[reacao.emoji] || 0
      }

      const score = Math.round((somaValores / total) * 100) / 100
      const label = score >= 1.0 ? 'positivo_forte' :
                    score >= 0.3 ? 'positivo' :
                    score >= -0.3 ? 'dividido' :
                    score >= -1.0 ? 'negativo' : 'negativo_forte'

      const distribuicaoDisplay: Record<string, number> = {}
      for (const [key, count] of Object.entries(distribuicao)) {
        distribuicaoDisplay[EMOJI_DISPLAY[key] || key] = count
      }

      return {
        geral: { score, label, distribuicao, totalReacoes: total },
        distribuicaoDisplay,
      }
    }

    // PRD v3: Calcular divergencia
    type DivergenciaTipo = 'sonhando' | 'resignados' | 'alinhados_positivo' | 'alinhados_negativo' | 'neutro'

    const calcularDivergencia = (probabilidade: number, sentimentScore: number): {
      tipo: DivergenciaTipo
      mensagem: string
      destaque: boolean
    } => {
      const sentimentoNorm = (sentimentScore + 2) * 25
      const diff = sentimentoNorm - probabilidade
      const absDiff = Math.abs(diff)
      const destaque = absDiff >= 25

      let tipo: DivergenciaTipo
      let mensagem: string

      if (absDiff < 15) {
        if (probabilidade > 55 && sentimentoNorm > 55) {
          tipo = 'alinhados_positivo'
          mensagem = 'Tudo indica que vai rolar'
        } else if (probabilidade < 45 && sentimentoNorm < 45) {
          tipo = 'alinhados_negativo'
          mensagem = 'Provavelmente nao vai rolar'
        } else {
          tipo = 'neutro'
          mensagem = 'Cenario indefinido'
        }
      } else if (diff > 0) {
        tipo = 'sonhando'
        mensagem = `Torcida quer, mas midia diz ${probabilidade}%`
      } else {
        tipo = 'resignados'
        mensagem = `${probabilidade}% de chance, mas torcida nao quer`
      }

      return { tipo, mensagem, destaque }
    }

    // Serializar datas para o cliente
    const serializedRumors = scoredRumors.map(r => {
      // PRD v3: Calcular sentimento e divergencia
      const sentimento = calcularSentimento(r.reacoes || [])
      const probabilidade = r.probabilidade ?? Math.round(r.sentiment * 100)
      const divergencia = calcularDivergencia(probabilidade, sentimento.geral.score)

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
        // PRD v3: Dois eixos
        probabilidade,
        probTrend: r.probTrend,
        sentiment: r.sentiment,
        sentimento,
        divergencia,
        status: r.status,
        signalScore: r.signalScore,
        isHot: r._isHot,
        totalReacoes: sentimento.geral.totalReacoes,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        closesAt: r.closesAt.toISOString(),
        resolvedAt: r.resolvedAt?.toISOString() || null,
        lastScraped: r.lastScraped?.toISOString() || null,
        // PRD v3: Fontes de jornalistas
        fontes: (r.fontes || []).map(f => ({
          id: f.id,
          posicao: f.posicao,
          intensidade: f.intensidade,
          jornalista: {
            nome: f.jornalista.nome,
            handle: f.jornalista.handle,
            credibilidade: f.jornalista.credibilidade,
          },
        })),
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
      }
    })

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

    // PRD v3: Buscar top jornalistas (fontes)
    const jornalistas = await prisma.jornalista.findMany({
      orderBy: { credibilidade: 'desc' },
      take: 5,
      include: {
        _count: {
          select: { fontes: true },
        },
      },
    })

    const topFontes = jornalistas.map((j, index) => ({
      id: j.id,
      rank: index + 1,
      nome: j.nome,
      handle: j.handle,
      veiculo: j.veiculo,
      credibilidade: Math.round(j.credibilidade),
      totalPrevisoes: j._count.fontes,
      taxaAcerto: `${Math.round(j.credibilidade)}%`,
    }))

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
        topFontes={topFontes}
      />
    )
  } catch (error) {
    console.error('Erro ao carregar feed:', error)
    return (
      <FeedClient
        initialRumors={[]}
        user={null}
        topUsers={[]}
        topFontes={[]}
      />
    )
  }
}
