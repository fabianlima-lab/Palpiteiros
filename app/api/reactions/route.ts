import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EmojiReacao } from '@prisma/client'

export const dynamic = 'force-dynamic'

// PRD v3: Valores dos emojis (-2 a +2)
const EMOJI_VALUES: Record<EmojiReacao, number> = {
  FOGO: 2,       // 🔥 Quero muito
  AMOR: 1,       // 😍 Gosto
  NEUTRO: 0,     // 😐 Tanto faz
  NAO_GOSTO: -1, // 👎 Não gosto
  PESSIMO: -2,   // 💀 Péssima ideia
}

// Mapeamento de emoji string para enum
const EMOJI_MAP: Record<string, EmojiReacao> = {
  '🔥': EmojiReacao.FOGO,
  '😍': EmojiReacao.AMOR,
  '😐': EmojiReacao.NEUTRO,
  '👎': EmojiReacao.NAO_GOSTO,
  '💀': EmojiReacao.PESSIMO,
  // Aliases para compatibilidade
  'FOGO': EmojiReacao.FOGO,
  'AMOR': EmojiReacao.AMOR,
  'NEUTRO': EmojiReacao.NEUTRO,
  'NAO_GOSTO': EmojiReacao.NAO_GOSTO,
  'PESSIMO': EmojiReacao.PESSIMO,
}

// Mapeamento reverso para exibição
const EMOJI_DISPLAY: Record<EmojiReacao, string> = {
  FOGO: '🔥',
  AMOR: '😍',
  NEUTRO: '😐',
  NAO_GOSTO: '👎',
  PESSIMO: '💀',
}

/**
 * ALG-002: Calcula sentimento da torcida (PRD v3)
 * Score: -2.0 a +2.0
 */
function calcularSentimento(reacoes: { emoji: EmojiReacao }[]): {
  score: number
  label: string
  distribuicao: Record<EmojiReacao, number>
  totalReacoes: number
} {
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

  const label =
    score >= 1.0 ? 'positivo_forte' :
    score >= 0.3 ? 'positivo' :
    score >= -0.3 ? 'dividido' :
    score >= -1.0 ? 'negativo' :
    'negativo_forte'

  return { score, label, distribuicao, totalReacoes: total }
}

/**
 * POST /api/reactions
 * Registra uma reação de sentimento para um rumor (PRD v3)
 *
 * Body: {
 *   rumorId: string
 *   userId: string
 *   timeId: string     // Time que o torcedor torce
 *   reaction: string   // Emoji (🔥, 😍, 😐, 👎, 💀) ou nome (FOGO, AMOR, etc)
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rumorId, userId, timeId, reaction } = body

    if (!rumorId || !reaction) {
      return NextResponse.json(
        { error: 'rumorId and reaction are required' },
        { status: 400 }
      )
    }

    // Converter reaction para enum
    const emoji = EMOJI_MAP[reaction]
    if (!emoji) {
      return NextResponse.json(
        { error: 'Invalid reaction. Use: 🔥, 😍, 😐, 👎, or 💀' },
        { status: 400 }
      )
    }

    // Verificar se o rumor existe
    const rumor = await prisma.rumor.findUnique({
      where: { id: rumorId },
    })

    if (!rumor) {
      return NextResponse.json(
        { error: 'Rumor not found' },
        { status: 404 }
      )
    }

    // Determinar userId e timeId
    const effectiveUserId = userId || `anon_${Date.now()}`
    const effectiveTimeId = timeId || rumor.toTeam?.toLowerCase() || 'brasil'

    // Garantir que o user existe
    let user = await prisma.user.findUnique({
      where: { id: effectiveUserId },
    })

    if (!user) {
      // Criar user anônimo temporário
      user = await prisma.user.create({
        data: {
          id: effectiveUserId,
          name: 'Torcedor Anônimo',
          username: `user_${Date.now()}`,
          team: effectiveTimeId,
        },
      })
    }

    // Upsert da reação (uma por usuário por rumor)
    await prisma.reacao.upsert({
      where: {
        userId_rumorId: {
          userId: effectiveUserId,
          rumorId,
        },
      },
      update: {
        emoji,
        timeId: effectiveTimeId,
        atualizadoEm: new Date(),
      },
      create: {
        userId: effectiveUserId,
        rumorId,
        timeId: effectiveTimeId,
        emoji,
      },
    })

    // Buscar todas as reações do rumor agrupadas por time
    const todasReacoes = await prisma.reacao.findMany({
      where: { rumorId },
    })

    // Calcular sentimento geral
    const sentimentoGeral = calcularSentimento(todasReacoes)

    // Calcular sentimento do time do usuário
    const reacoesDoTime = todasReacoes.filter(r => r.timeId === effectiveTimeId)
    const sentimentoDoTime = calcularSentimento(reacoesDoTime)

    return NextResponse.json({
      success: true,
      reaction: EMOJI_DISPLAY[emoji],
      userReaction: {
        emoji,
        emojiDisplay: EMOJI_DISPLAY[emoji],
        timeId: effectiveTimeId,
      },
      sentimento: {
        geral: sentimentoGeral,
        porTime: {
          [effectiveTimeId]: sentimentoDoTime,
        },
      },
      totalReacoes: todasReacoes.length,
    })
  } catch (error) {
    console.error('Erro ao registrar reação:', error)
    return NextResponse.json(
      { error: 'Failed to register reaction', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/reactions?rumorId=xxx
 * Retorna sentimento do rumor agrupado por time (PRD v3)
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const rumorId = url.searchParams.get('rumorId')
    const timeId = url.searchParams.get('timeId') // Opcional: filtrar por time

    if (!rumorId) {
      return NextResponse.json(
        { error: 'rumorId is required' },
        { status: 400 }
      )
    }

    // Buscar todas as reações
    const reacoes = await prisma.reacao.findMany({
      where: { rumorId },
    })

    // Agrupar por time
    const porTime: Record<string, { emoji: EmojiReacao }[]> = {}
    for (const reacao of reacoes) {
      if (!porTime[reacao.timeId]) {
        porTime[reacao.timeId] = []
      }
      porTime[reacao.timeId].push({ emoji: reacao.emoji })
    }

    // Calcular sentimento por time
    const sentimentoPorTime: Record<string, ReturnType<typeof calcularSentimento>> = {}
    for (const [time, reacoesTime] of Object.entries(porTime)) {
      sentimentoPorTime[time] = calcularSentimento(reacoesTime)
    }

    // Calcular sentimento geral
    const sentimentoGeral = calcularSentimento(reacoes.map(r => ({ emoji: r.emoji })))

    // Se pediu filtro por time específico
    if (timeId && sentimentoPorTime[timeId]) {
      return NextResponse.json({
        rumorId,
        timeId,
        sentimento: sentimentoPorTime[timeId],
        totalReacoes: reacoes.length,
      })
    }

    // Retornar todos os times
    return NextResponse.json({
      rumorId,
      sentimento: {
        geral: sentimentoGeral,
        porTime: sentimentoPorTime,
      },
      times: Object.keys(porTime),
      totalReacoes: reacoes.length,
      // Para compatibilidade com o frontend antigo
      reactionCounts: {
        '🔥': sentimentoGeral.distribuicao.FOGO,
        '😍': sentimentoGeral.distribuicao.AMOR,
        '😐': sentimentoGeral.distribuicao.NEUTRO,
        '👎': sentimentoGeral.distribuicao.NAO_GOSTO,
        '💀': sentimentoGeral.distribuicao.PESSIMO,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar reações:', error)
    return NextResponse.json(
      { error: 'Failed to get reactions' },
      { status: 500 }
    )
  }
}
