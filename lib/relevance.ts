/**
 * =============================================================================
 * ALGORITMO DE RELEVÂNCIA PARA FEED - Palpiteiro
 * =============================================================================
 *
 * Este módulo contém a lógica de ordenação por relevância do feed.
 * O objetivo é mostrar os rumores mais relevantes para cada usuário primeiro.
 *
 * FATORES DE RELEVÂNCIA (Total: 100 pontos)
 * -----------------------------------------
 *
 * 1. MEU TIME (40 pontos) - Peso máximo
 *    Rumores que envolvem o time do coração do usuário aparecem primeiro.
 *    Verifica: toTeam, fromTeam
 *
 * 2. ENGAJAMENTO PRÉVIO (20 pontos)
 *    Rumores onde o usuário já votou/reagiu recebem boost.
 *    Mantém o usuário conectado aos rumores que ele acompanha.
 *
 * 3. BUZZ/HYPE (25 pontos)
 *    Combinação de:
 *    - Quantidade de predictions (30% do buzz)
 *    - Quantidade de signals de influenciadores (25% do buzz)
 *    - Signal score agregado (25% do buzz)
 *    - Quantidade de notícias relacionadas (20% do buzz)
 *
 * 4. RECÊNCIA (10 pontos)
 *    Rumores mais novos aparecem antes.
 *    Decay:
 *    - 0-6h: 100%
 *    - 6-24h: 80%
 *    - 24-48h: 60%
 *    - 48-72h: 40%
 *    - 72h-1w: 20%
 *    - >1w: 10%
 *
 * 5. URGÊNCIA (5 pontos)
 *    Rumores prestes a fechar aparecem com prioridade.
 *    Decay inverso (mais próximo = maior score):
 *    - <6h: 100%
 *    - 6-24h: 80%
 *    - 24-48h: 60%
 *    - 48-72h: 40%
 *    - >72h: 20%
 *
 * =============================================================================
 */

export interface RelevanceFactors {
  myTeam: number      // 0 ou 40
  engagement: number  // 0 ou 20
  buzz: number        // 0-25
  recency: number     // 0-10
  urgency: number     // 0-5
}

export interface RelevanceScore {
  total: number
  factors: RelevanceFactors
}

/**
 * Calcula score de recência baseado em quando o rumor foi criado
 */
export function calculateRecencyScore(createdAt: Date): number {
  const now = new Date()
  const hoursAgo = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

  if (hoursAgo <= 6) return 1.0
  if (hoursAgo <= 24) return 0.8
  if (hoursAgo <= 48) return 0.6
  if (hoursAgo <= 72) return 0.4
  if (hoursAgo <= 168) return 0.2 // 1 semana
  return 0.1
}

/**
 * Calcula score de urgência baseado em quando o rumor vai fechar
 */
export function calculateUrgencyScore(closesAt: Date): number {
  const now = new Date()
  const hoursUntilClose = (closesAt.getTime() - now.getTime()) / (1000 * 60 * 60)

  // Rumores que já fecharam não devem aparecer, mas por segurança
  if (hoursUntilClose <= 0) return 0

  if (hoursUntilClose <= 6) return 1.0
  if (hoursUntilClose <= 24) return 0.8
  if (hoursUntilClose <= 48) return 0.6
  if (hoursUntilClose <= 72) return 0.4
  return 0.2
}

/**
 * Calcula score de buzz baseado em métricas de engajamento
 */
export function calculateBuzzScore(
  predictionsCount: number,
  signalsCount: number,
  signalScore: number | null,
  newsCount: number
): number {
  // Normalizar cada métrica
  const predScore = Math.min(predictionsCount / 100, 1) // 100+ predictions = 1.0
  const sigScore = Math.min(signalsCount / 5, 1)        // 5+ signals = 1.0
  const aggScore = signalScore ?? 0                     // Já normalizado 0-1
  const newsScore = Math.min(newsCount / 10, 1)         // 10+ news = 1.0

  // Média ponderada
  return (predScore * 0.3) + (sigScore * 0.25) + (aggScore * 0.25) + (newsScore * 0.2)
}

/**
 * Verifica se o rumor é do time do usuário
 */
export function isUserTeamRumor(
  toTeam: string,
  fromTeam: string | null,
  userTeam: string
): boolean {
  const teamLower = userTeam.toLowerCase()

  return (
    toTeam.toLowerCase().includes(teamLower) ||
    fromTeam?.toLowerCase().includes(teamLower) ||
    teamLower.includes(toTeam.toLowerCase())
  )
}

/**
 * Calcula o score de relevância completo para um rumor
 */
export function calculateRelevanceScore(params: {
  toTeam: string
  fromTeam: string | null
  createdAt: Date
  closesAt: Date
  predictionsCount: number
  signalsCount: number
  signalScore: number | null
  newsCount: number
  userTeam?: string
  userEngaged?: boolean
}): RelevanceScore {
  const factors: RelevanceFactors = {
    myTeam: 0,
    engagement: 0,
    buzz: 0,
    recency: 0,
    urgency: 0,
  }

  // 1. Meu Time (40 pontos)
  if (params.userTeam && isUserTeamRumor(params.toTeam, params.fromTeam, params.userTeam)) {
    factors.myTeam = 40
  }

  // 2. Engajamento prévio (20 pontos)
  if (params.userEngaged) {
    factors.engagement = 20
  }

  // 3. Buzz (25 pontos)
  const buzzScore = calculateBuzzScore(
    params.predictionsCount,
    params.signalsCount,
    params.signalScore,
    params.newsCount
  )
  factors.buzz = buzzScore * 25

  // 4. Recência (10 pontos)
  factors.recency = calculateRecencyScore(params.createdAt) * 10

  // 5. Urgência (5 pontos)
  factors.urgency = calculateUrgencyScore(params.closesAt) * 5

  const total = factors.myTeam + factors.engagement + factors.buzz + factors.recency + factors.urgency

  return { total, factors }
}

/**
 * Ordena array de rumores por relevância
 */
export function sortByRelevance<T extends { _relevanceScore: number }>(rumors: T[]): T[] {
  return [...rumors].sort((a, b) => b._relevanceScore - a._relevanceScore)
}
