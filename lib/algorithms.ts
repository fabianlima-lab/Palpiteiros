/**
 * PRD v3: Algoritmos do Palpiteiro
 *
 * ALG-001: Probabilidade Real (fontes jornalísticas)
 * ALG-002: Sentimento da Torcida (reações dos usuários)
 * ALG-003: Divergência (diferença entre probabilidade e sentimento)
 * ALG-004: Relevância do Feed (ranking de cards)
 * ALG-005: Sentiment Analysis de Notícias
 */

import { EmojiReacao, FonteRumor, Jornalista } from '@prisma/client'

// ============================================
// CONSTANTES
// ============================================

export const EMOJI_VALUES: Record<EmojiReacao, number> = {
  FOGO: 2,       // 🔥 Quero muito
  AMOR: 1,       // 😍 Gosto
  NEUTRO: 0,     // 😐 Tanto faz
  NAO_GOSTO: -1, // 👎 Não gosto
  PESSIMO: -2,   // 💀 Péssima ideia
}

export const EMOJI_DISPLAY: Record<EmojiReacao, string> = {
  FOGO: '🔥',
  AMOR: '😍',
  NEUTRO: '😐',
  NAO_GOSTO: '👎',
  PESSIMO: '💀',
}

// ============================================
// ALG-001: PROBABILIDADE REAL
// Alimentado APENAS por fontes jornalísticas
// ============================================

interface FonteInput {
  tipo: 'jornalista' | 'veiculo' | 'clube_oficial' | 'agente'
  credibilidade: number // 0-100
  posicao: 'confirma' | 'nega' | 'neutro'
  intensidade: 'especula' | 'afirma' | 'crava'
  dataPublicacao: Date
}

/**
 * Calcula a probabilidade real de um rumor acontecer
 * baseado nas fontes jornalísticas
 *
 * @returns Probabilidade de 3-97% (nunca 0 ou 100 enquanto aberto)
 */
export function calcularProbabilidadeReal(fontes: FonteInput[]): number {
  if (fontes.length === 0) {
    return 50 // Sem fontes, probabilidade neutra
  }

  let scorePonderado = 0
  let pesoTotal = 0

  for (const fonte of fontes) {
    // Peso base = credibilidade da fonte (0-1)
    let peso = fonte.credibilidade / 100

    // Multiplicador por tipo
    const multTipo: Record<string, number> = {
      clube_oficial: 3.0,  // Comunicado oficial tem peso máximo
      agente: 2.0,         // Empresário do jogador
      jornalista: 1.5,     // Depende do histórico
      veiculo: 1.0,        // Veículo sem autor específico
    }
    peso *= multTipo[fonte.tipo] || 1.0

    // Multiplicador por intensidade
    const multIntensidade: Record<string, number> = {
      crava: 1.5,    // "FECHADO", "VAI ASSINAR"
      afirma: 1.2,   // "Está encaminhado"
      especula: 0.8, // "Existe a possibilidade"
    }
    peso *= multIntensidade[fonte.intensidade] || 1.0

    // Decay temporal: half-life de 3 dias (72 horas)
    const horas = (Date.now() - fonte.dataPublicacao.getTime()) / 3600000
    peso *= Math.pow(0.5, horas / 72)

    // Direção
    const direcao =
      fonte.posicao === 'confirma' ? 1 :
      fonte.posicao === 'nega' ? -1 : 0

    scorePonderado += direcao * peso
    pesoTotal += peso
  }

  // Normalizar para 0-100
  let score = pesoTotal > 0 ? scorePonderado / pesoTotal : 0
  let porcentagem = Math.round((score + 1) * 50)

  // Clampar entre 3-97 (nunca 0% nem 100% enquanto aberto)
  return Math.max(3, Math.min(97, porcentagem))
}

/**
 * Converte FonteRumor + Jornalista do banco para FonteInput
 */
export function fonteParaInput(
  fonte: FonteRumor & { jornalista: Jornalista }
): FonteInput {
  return {
    tipo: 'jornalista',
    credibilidade: fonte.jornalista.credibilidade,
    posicao: fonte.posicao as 'confirma' | 'nega' | 'neutro',
    intensidade: fonte.intensidade as 'especula' | 'afirma' | 'crava',
    dataPublicacao: fonte.dataPublicacao,
  }
}

// ============================================
// ALG-002: SENTIMENTO DA TORCIDA
// Alimentado APENAS por reações dos torcedores
// ============================================

export interface SentimentoOutput {
  score: number // -2.0 a +2.0
  label: 'positivo_forte' | 'positivo' | 'dividido' | 'negativo' | 'negativo_forte'
  distribuicao: Record<EmojiReacao, number>
  totalReacoes: number
}

/**
 * Calcula o sentimento da torcida para um rumor
 *
 * @param reacoes Array de reações (pode ser filtrado por time)
 * @returns Score de -2 a +2 com distribuição
 */
export function calcularSentimento(reacoes: { emoji: EmojiReacao }[]): SentimentoOutput {
  const total = reacoes.length

  if (total === 0) {
    return {
      score: 0,
      label: 'dividido',
      distribuicao: { FOGO: 0, AMOR: 0, NEUTRO: 0, NAO_GOSTO: 0, PESSIMO: 0 },
      totalReacoes: 0,
    }
  }

  // Contar por emoji
  const distribuicao: Record<EmojiReacao, number> = {
    FOGO: 0,
    AMOR: 0,
    NEUTRO: 0,
    NAO_GOSTO: 0,
    PESSIMO: 0,
  }
  let somaValores = 0

  for (const reacao of reacoes) {
    distribuicao[reacao.emoji]++
    somaValores += EMOJI_VALUES[reacao.emoji]
  }

  const score = Math.round((somaValores / total) * 100) / 100

  const label: SentimentoOutput['label'] =
    score >= 1.0 ? 'positivo_forte' :
    score >= 0.3 ? 'positivo' :
    score >= -0.3 ? 'dividido' :
    score >= -1.0 ? 'negativo' :
    'negativo_forte'

  return { score, label, distribuicao, totalReacoes: total }
}

// ============================================
// ALG-003: DIVERGÊNCIA
// Motor de viralidade - compara probabilidade vs sentimento
// ============================================

export interface DivergenciaOutput {
  tipo: 'sonhando' | 'resignados' | 'alinhados_positivo' | 'alinhados_negativo' | 'neutro'
  mensagem: string
  destaque: boolean // Se ganha badge ⚡ no card
}

/**
 * Calcula a divergência entre o que VAI acontecer e o que a torcida QUER
 *
 * @param probabilidade 0-100 (ALG-001)
 * @param sentimento -2 a +2 (ALG-002)
 */
export function calcularDivergencia(
  probabilidade: number,
  sentimento: number
): DivergenciaOutput {
  // Normalizar sentimento pra 0-100 pra comparar
  // -2 = 0, 0 = 50, +2 = 100
  const sentimentoNorm = (sentimento + 2) * 25

  const diff = sentimentoNorm - probabilidade
  const absDiff = Math.abs(diff)

  // Destaque se divergem mais que 25 pontos
  const destaque = absDiff >= 25

  let tipo: DivergenciaOutput['tipo']
  let mensagem: string

  if (absDiff < 15) {
    // Alinhados
    if (probabilidade > 55 && sentimentoNorm > 55) {
      tipo = 'alinhados_positivo'
      mensagem = 'Tudo indica que vai rolar'
    } else if (probabilidade < 45 && sentimentoNorm < 45) {
      tipo = 'alinhados_negativo'
      mensagem = 'Provavelmente não vai rolar'
    } else {
      tipo = 'neutro'
      mensagem = 'Cenário indefinido'
    }
  } else if (diff > 0) {
    // Torcida mais positiva que a mídia
    tipo = 'sonhando'
    mensagem = `Torcida quer, mas mídia diz ${probabilidade}%`
  } else {
    // Mídia mais positiva que a torcida
    tipo = 'resignados'
    mensagem = `${probabilidade}% de chance, mas torcida não quer`
  }

  return { tipo, mensagem, destaque }
}

// ============================================
// ALG-004: RELEVÂNCIA DO FEED
// Ordena os rumores no feed
// ============================================

interface RelevanciaInput {
  // Engajamento
  totalReacoes: number
  reacoesUltimas24h: number

  // Tempo
  criadoEm: Date
  ultimaAtividade: Date

  // Fontes
  qtdFontes: number
  fonteConfiavel: boolean
  qtdNoticias24h: number

  // Divisão (quanto mais dividido, mais interessante)
  divisaoSentimento: number // 0-1, onde 1 = perfeitamente dividido

  // Divergência entre eixos
  divergenciaDestaque: boolean
  divergenciaAbs: number // 0-100

  // Cross-torcida
  reacoesRival: number // Se torcida rival tá reagindo, é quente
}

/**
 * Calcula o score de relevância para ordenar o feed
 *
 * @returns Score de 0-100+ (mais alto = mais relevante)
 */
export function calcularRelevancia(input: RelevanciaInput): number {
  const agora = Date.now()

  // 1. DECAY TEMPORAL (half-life de 48h)
  const horas = (agora - input.ultimaAtividade.getTime()) / 3600000
  const decay = Math.pow(0.5, horas / 48)

  // 2. ENGAJAMENTO
  const scoreEngajamento =
    Math.log10(input.totalReacoes + 1) * 10 +
    Math.log10(input.reacoesUltimas24h + 1) * 20

  // 3. CREDIBILIDADE DAS FONTES
  const scoreFontes =
    (input.qtdFontes * 5) +
    (input.fonteConfiavel ? 20 : 0) +
    (input.qtdNoticias24h * 3)

  // 4. DIVISÃO DE SENTIMENTO (rumores divididos são mais interessantes)
  const scoreDivisao = input.divisaoSentimento * 25

  // 5. DIVERGÊNCIA (boost quando eixos discordam)
  const boostDivergencia = input.divergenciaDestaque ? (input.divergenciaAbs * 0.4) : 0

  // 6. BOOST CROSS-TORCIDA (rival reagindo = viral)
  const boostRival = Math.log10(input.reacoesRival + 1) * 8

  // 7. BOOST NOVO (primeiras 6 horas)
  const horasDesdeCreacao = (agora - input.criadoEm.getTime()) / 3600000
  const boostNovo = horasDesdeCreacao < 6 ? 20 : 0

  const scoreBase =
    scoreEngajamento +
    scoreFontes +
    scoreDivisao +
    boostDivergencia +
    boostRival +
    boostNovo

  return Math.round(scoreBase * decay * 100) / 100
}

/**
 * Calcula a "divisão" do sentimento (0 = todo mundo igual, 1 = perfeitamente dividido)
 */
export function calcularDivisaoSentimento(distribuicao: Record<EmojiReacao, number>): number {
  const total =
    distribuicao.FOGO +
    distribuicao.AMOR +
    distribuicao.NEUTRO +
    distribuicao.NAO_GOSTO +
    distribuicao.PESSIMO

  if (total === 0) return 0

  // Calcular entropia normalizada (0-1)
  let entropia = 0
  for (const count of Object.values(distribuicao)) {
    if (count > 0) {
      const p = count / total
      entropia -= p * Math.log2(p)
    }
  }

  // Normalizar pela entropia máxima (log2(5) = 2.32)
  const maxEntropia = Math.log2(5)
  return entropia / maxEntropia
}

// ============================================
// ALG-005: SENTIMENT ANALYSIS DE NOTÍCIAS
// Analisa texto para determinar posição e intensidade
// ============================================

const PALAVRAS_CONFIRMA = [
  'encaminhado', 'fechado', 'acertado', 'vai assinar', 'acordo verbal',
  'exames marcados', 'deve ser anunciado', 'proposta aceita', 'negociação avançada',
  'tem acordo', 'vai fechar', 'praticamente definido', 'questão de tempo',
  'confirmado', 'oficial', 'assinado',
]

const PALAVRAS_NEGA = [
  'esfriou', 'não avança', 'descartado', 'desistiu', 'valores distantes',
  'sem acordo', 'não vai', 'caiu', 'inviável', 'fora do orçamento',
  'negou', 'desmentiu', 'não procede', 'fracassou',
]

const PALAVRAS_INTENSIDADE_ALTA = [
  'confirmado', 'fechado', 'certo', 'oficial', 'assinado',
  'crava', 'garante', 'certeza', 'garantido',
]

/**
 * Analisa o texto de uma notícia/tweet para determinar
 * posição (confirma/nega/neutro) e intensidade (especula/afirma/crava)
 */
export function analisarTexto(texto: string): {
  posicao: 'confirma' | 'nega' | 'neutro'
  intensidade: 'especula' | 'afirma' | 'crava'
} {
  const lower = texto.toLowerCase()

  const matchesConfirma = PALAVRAS_CONFIRMA.filter(p => lower.includes(p)).length
  const matchesNega = PALAVRAS_NEGA.filter(p => lower.includes(p)).length
  const temIntensidadeAlta = PALAVRAS_INTENSIDADE_ALTA.some(p => lower.includes(p))

  const posicao: 'confirma' | 'nega' | 'neutro' =
    matchesConfirma > matchesNega ? 'confirma' :
    matchesNega > matchesConfirma ? 'nega' : 'neutro'

  const intensidade: 'especula' | 'afirma' | 'crava' =
    temIntensidadeAlta ? 'crava' :
    (matchesConfirma + matchesNega >= 2) ? 'afirma' : 'especula'

  return { posicao, intensidade }
}

// ============================================
// HELPERS PARA CREDIBILIDADE DE JORNALISTAS
// ============================================

/**
 * Calcula credibilidade inicial baseado em seguidores (cold start)
 * Log scale: 1k = 30, 10k = 40, 100k = 50, 1M = 60
 * Nunca começa acima de 70 (últimos 30 pontos só vêm de acerto)
 */
export function credibilidadeInicial(seguidores: number): number {
  const base = Math.min(70, 20 + Math.log10(seguidores + 1) * 10)
  return Math.round(base)
}

/**
 * Atualiza credibilidade após resolução de rumor
 * Média móvel exponencial (últimos ~20 resultados)
 */
export function atualizarCredibilidade(
  credibilidadeAtual: number,
  acertou: boolean
): number {
  const alfa = 0.05
  const nova = credibilidadeAtual * (1 - alfa) + (acertou ? 100 : 0) * alfa
  return Math.round(nova)
}

// ============================================
// EXPIRAÇÃO POR CATEGORIA
// ============================================

export const EXPIRACAO_DIAS: Record<string, number> = {
  REFORCO: 90,
  SAIDA: 90,
  RENOVACAO: 60,
  COMISSAO: 30,
  ESCALACAO: 1,    // Expira no fim do jogo
  LESAO: 30,
  SELECAO: 14,
  PREMIO: 14,
  CLUBE: 60,
  DISCIPLINA: 30,
}
