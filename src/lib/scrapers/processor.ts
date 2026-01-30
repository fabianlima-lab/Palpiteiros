import { Rumor } from '@prisma/client'
import {
  ExtractedEntities,
  RumorMatch,
  TEAMS_ALIASES,
  PLAYERS_ALIASES,
  ScrapedItem,
} from './types'

/**
 * Normaliza texto para matching (lowercase, remove acentos)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
}

/**
 * Extrai entidades (jogadores e times) do texto
 */
export function extractEntities(text: string): ExtractedEntities {
  const normalizedText = normalizeText(text)
  const players: string[] = []
  const teams: string[] = []

  // Buscar times
  for (const [teamId, aliases] of Object.entries(TEAMS_ALIASES)) {
    for (const alias of aliases) {
      const normalizedAlias = normalizeText(alias)
      if (normalizedText.includes(normalizedAlias)) {
        if (!teams.includes(teamId)) {
          teams.push(teamId)
        }
        break
      }
    }
  }

  // Buscar jogadores
  for (const [playerId, aliases] of Object.entries(PLAYERS_ALIASES)) {
    for (const alias of aliases) {
      const normalizedAlias = normalizeText(alias)
      if (normalizedText.includes(normalizedAlias)) {
        if (!players.includes(playerId)) {
          players.push(playerId)
        }
        break
      }
    }
  }

  return { players, teams }
}

/**
 * Palavras que indicam relevância para transferências
 */
const TRANSFER_KEYWORDS = [
  'acerto', 'fechado', 'negociacao', 'negociação', 'proposta', 'contrato',
  'transferencia', 'transferência', 'reforco', 'reforço', 'chegou', 'assinou',
  'anuncio', 'anúncio', 'oficial', 'interesse', 'sondagem', 'conversa',
  'negociar', 'contratar', 'comprar', 'vender', 'emprestar', 'emprestimo',
]

/**
 * Verifica se o texto contém palavras de transferência
 */
function hasTransferKeywords(text: string): boolean {
  const normalizedText = normalizeText(text)
  return TRANSFER_KEYWORDS.some(keyword =>
    normalizedText.includes(normalizeText(keyword))
  )
}

/**
 * Encontra rumores relacionados ao conteúdo
 */
export function matchRumors(
  entities: ExtractedEntities,
  activeRumors: Rumor[]
): RumorMatch[] {
  const matches: RumorMatch[] = []

  for (const rumor of activeRumors) {
    let relevance = 0

    // Normalizar nome do jogador do rumor
    const rumorPlayerNormalized = normalizeText(rumor.playerName)
    const rumorToTeamNormalized = normalizeText(rumor.toTeam)

    // Verificar se menciona o jogador
    const mentionsPlayer = entities.players.some(player => {
      const playerAliases = PLAYERS_ALIASES[player] || [player]
      return playerAliases.some(alias =>
        rumorPlayerNormalized.includes(normalizeText(alias)) ||
        normalizeText(alias).includes(rumorPlayerNormalized)
      )
    })

    // Verificar se menciona o time destino
    const mentionsToTeam = entities.teams.some(team => {
      const teamAliases = TEAMS_ALIASES[team] || [team]
      return teamAliases.some(alias =>
        rumorToTeamNormalized.includes(normalizeText(alias)) ||
        normalizeText(alias).includes(rumorToTeamNormalized)
      )
    })

    // Calcular relevância
    if (mentionsPlayer && mentionsToTeam) {
      relevance = 0.8
    } else if (mentionsPlayer) {
      relevance = 0.5
    } else if (mentionsToTeam && entities.players.length > 0) {
      relevance = 0.3
    }

    if (relevance > 0) {
      matches.push({
        rumorId: rumor.id,
        relevance,
      })
    }
  }

  return matches
}

/**
 * Calcula relevância de um NewsItem para um Rumor específico
 */
export function calculateRelevance(
  content: string,
  rumor: Rumor
): number {
  const normalizedContent = normalizeText(content)
  const rumorPlayerNormalized = normalizeText(rumor.playerName)
  const rumorToTeamNormalized = normalizeText(rumor.toTeam)

  let score = 0

  // Verifica se menciona o jogador
  if (normalizedContent.includes(rumorPlayerNormalized)) {
    score += 0.4
  }

  // Verifica se menciona o time destino
  if (normalizedContent.includes(rumorToTeamNormalized)) {
    score += 0.3
  }

  // Bonus se tiver palavras de transferência
  if (hasTransferKeywords(content)) {
    score += 0.3
  }

  return Math.min(score, 1.0)
}

/**
 * Gera keywords de busca baseadas nos rumores ativos
 */
export function generateKeywords(rumors: Rumor[]): string[] {
  const keywords: Set<string> = new Set()

  for (const rumor of rumors) {
    // Adiciona nome do jogador + time destino
    keywords.add(`${rumor.playerName} ${rumor.toTeam}`)

    // Adiciona só o nome do jogador
    keywords.add(rumor.playerName)

    // Adiciona jogador + "transferência"
    keywords.add(`${rumor.playerName} transferência`)
  }

  return Array.from(keywords)
}

/**
 * Gera resumo do conteúdo (primeiros 280 caracteres)
 */
export function generateSummary(content: string): string {
  if (content.length <= 280) {
    return content
  }
  return content.substring(0, 277) + '...'
}

/**
 * Detecta se é um spike de atividade
 * Retorna true se as menções atuais são > 2x as menções anteriores
 */
export function detectSpike(
  currentMentions: number,
  previousMentions: number,
  threshold: number = 50
): boolean {
  // Se as menções atuais > 2x menções anteriores
  if (previousMentions > 0 && currentMentions > previousMentions * 2) {
    return true
  }

  // Se > threshold em 1 hora
  if (currentMentions > threshold) {
    return true
  }

  return false
}

/**
 * Calcula velocidade de menções (taxa de crescimento)
 */
export function calculateVelocity(
  currentMentions: number,
  previousMentions: number
): number {
  if (previousMentions === 0) {
    return currentMentions > 0 ? 1.0 : 0
  }

  return (currentMentions - previousMentions) / previousMentions
}
