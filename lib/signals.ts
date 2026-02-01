/**
 * Sistema de Sinais Visuais - Palpiteiros
 *
 * Este arquivo contem a logica para converter valores numericos internos
 * em representacoes visuais qualitativas para o usuario.
 *
 * IMPORTANTE: O usuario NUNCA ve percentuais. Apenas sinais visuais.
 */

// ============================================
// SINAIS DE PROBABILIDADE/SENTIMENTO
// ============================================

export type SignalLevel =
  | 'very_positive'    // 🔥 + ↑
  | 'positive'         // 😍 + ↗
  | 'slightly_positive'// 😊 + ↗
  | 'neutral'          // 😐 + →
  | 'slightly_negative'// 😕 + ↘
  | 'negative'         // 😟 + ↘
  | 'very_negative'    // ❄️ + ↓

export interface SignalDisplay {
  level: SignalLevel
  emoji: string
  arrow: string
  label: string
  color: string
  bgColor: string
}

// Configuracao dos sinais visuais
export const SIGNAL_CONFIG: Record<SignalLevel, SignalDisplay> = {
  very_positive: {
    level: 'very_positive',
    emoji: '🔥',
    arrow: '↑',
    label: 'Muito provável',
    color: '#10B981', // Verde forte
    bgColor: '#10B98120',
  },
  positive: {
    level: 'positive',
    emoji: '😍',
    arrow: '↗',
    label: 'Provável',
    color: '#34D399', // Verde claro
    bgColor: '#34D39920',
  },
  slightly_positive: {
    level: 'slightly_positive',
    emoji: '😊',
    arrow: '↗',
    label: 'Tendência positiva',
    color: '#A3E635', // Lima
    bgColor: '#A3E63520',
  },
  neutral: {
    level: 'neutral',
    emoji: '😐',
    arrow: '→',
    label: 'Incerto',
    color: '#71717A', // Cinza
    bgColor: '#71717A20',
  },
  slightly_negative: {
    level: 'slightly_negative',
    emoji: '😕',
    arrow: '↘',
    label: 'Tendência negativa',
    color: '#FB923C', // Laranja
    bgColor: '#FB923C20',
  },
  negative: {
    level: 'negative',
    emoji: '😟',
    arrow: '↘',
    label: 'Improvável',
    color: '#F87171', // Vermelho claro
    bgColor: '#F8717120',
  },
  very_negative: {
    level: 'very_negative',
    emoji: '❄️',
    arrow: '↓',
    label: 'Muito improvável',
    color: '#EF4444', // Vermelho
    bgColor: '#EF444420',
  },
}

/**
 * Converte um percentual (0-100) em um sinal visual
 * O usuario nunca ve o percentual, apenas o sinal
 */
export function getSignalFromPercent(percent: number): SignalDisplay {
  if (percent >= 80) return SIGNAL_CONFIG.very_positive
  if (percent >= 65) return SIGNAL_CONFIG.positive
  if (percent >= 50) return SIGNAL_CONFIG.slightly_positive
  if (percent >= 40) return SIGNAL_CONFIG.neutral
  if (percent >= 30) return SIGNAL_CONFIG.slightly_negative
  if (percent >= 15) return SIGNAL_CONFIG.negative
  return SIGNAL_CONFIG.very_negative
}

/**
 * Converte um score de sentimento (-2 a +2) em um sinal visual
 */
export function getSignalFromScore(score: number): SignalDisplay {
  if (score >= 1.5) return SIGNAL_CONFIG.very_positive
  if (score >= 0.8) return SIGNAL_CONFIG.positive
  if (score >= 0.3) return SIGNAL_CONFIG.slightly_positive
  if (score >= -0.3) return SIGNAL_CONFIG.neutral
  if (score >= -0.8) return SIGNAL_CONFIG.slightly_negative
  if (score >= -1.5) return SIGNAL_CONFIG.negative
  return SIGNAL_CONFIG.very_negative
}

// ============================================
// BADGES DE CREDIBILIDADE (INFLUENCIADORES/FONTES)
// ============================================

export type CredibilityTier =
  | 'diamond'   // 💎 Top 5%
  | 'gold'      // 🥇 Top 20%
  | 'silver'    // 🥈 Top 50%
  | 'bronze'    // 🥉 Top 80%
  | 'none'      // Sem badge (bottom 20%)

export interface CredibilityBadge {
  tier: CredibilityTier
  emoji: string
  label: string
  color: string
  bgColor: string
}

export const CREDIBILITY_BADGES: Record<CredibilityTier, CredibilityBadge> = {
  diamond: {
    tier: 'diamond',
    emoji: '💎',
    label: 'Elite',
    color: '#60A5FA', // Azul
    bgColor: '#60A5FA20',
  },
  gold: {
    tier: 'gold',
    emoji: '🥇',
    label: 'Ouro',
    color: '#FBBF24', // Dourado
    bgColor: '#FBBF2420',
  },
  silver: {
    tier: 'silver',
    emoji: '🥈',
    label: 'Prata',
    color: '#9CA3AF', // Prata
    bgColor: '#9CA3AF20',
  },
  bronze: {
    tier: 'bronze',
    emoji: '🥉',
    label: 'Bronze',
    color: '#CD7F32', // Bronze
    bgColor: '#CD7F3220',
  },
  none: {
    tier: 'none',
    emoji: '',
    label: 'Novato',
    color: '#52525B', // Cinza escuro
    bgColor: '#52525B20',
  },
}

/**
 * Converte credibilidade (0-100) em badge usando distribuicao normal
 *
 * Distribuicao:
 * - Diamante: >= 95 (top ~5%)
 * - Ouro: >= 80 (top ~20%)
 * - Prata: >= 60 (top ~50%)
 * - Bronze: >= 40 (top ~80%)
 * - Sem badge: < 40 (bottom ~20%)
 */
export function getCredibilityBadge(credibilidade: number): CredibilityBadge {
  if (credibilidade >= 95) return CREDIBILITY_BADGES.diamond
  if (credibilidade >= 80) return CREDIBILITY_BADGES.gold
  if (credibilidade >= 60) return CREDIBILITY_BADGES.silver
  if (credibilidade >= 40) return CREDIBILITY_BADGES.bronze
  return CREDIBILITY_BADGES.none
}

/**
 * Versao alternativa que usa percentil ao inves de valor absoluto
 * Util quando temos a lista completa de fontes para calcular distribuicao real
 */
export function getCredibilityBadgeByPercentile(percentile: number): CredibilityBadge {
  if (percentile >= 95) return CREDIBILITY_BADGES.diamond
  if (percentile >= 80) return CREDIBILITY_BADGES.gold
  if (percentile >= 50) return CREDIBILITY_BADGES.silver
  if (percentile >= 20) return CREDIBILITY_BADGES.bronze
  return CREDIBILITY_BADGES.none
}

// ============================================
// SINAIS DE TENDENCIA (para feedback de reacao)
// ============================================

export type TrendDirection = 'up' | 'down' | 'neutral'

export interface TrendSignal {
  direction: TrendDirection
  arrow: string
  color: string
}

export const TREND_SIGNALS: Record<TrendDirection, TrendSignal> = {
  up: {
    direction: 'up',
    arrow: '↑',
    color: '#10B981', // Verde
  },
  down: {
    direction: 'down',
    arrow: '↓',
    color: '#EF4444', // Vermelho
  },
  neutral: {
    direction: 'neutral',
    arrow: '→',
    color: '#71717A', // Cinza
  },
}

/**
 * Retorna apenas a seta de tendencia (sem percentual)
 * Usado no feedback apos usuario reagir
 */
export function getTrendSignal(direction: TrendDirection): TrendSignal {
  return TREND_SIGNALS[direction]
}
