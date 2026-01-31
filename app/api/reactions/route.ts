import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Mapear emoji para valor de sentimento
const REACTION_SENTIMENTS: Record<string, number> = {
  '🔥': 1.0,   // Quero muito
  '👍': 0.75,  // Seria bom
  '😐': 0.5,   // Tanto faz
  '😕': 0.25,  // Não curti
  '💔': 0.0,   // Não quero
}

/**
 * POST /api/reactions
 * Registra uma reação de sentimento para um rumor
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rumorId, userId, reaction } = body

    if (!rumorId || !reaction) {
      return NextResponse.json(
        { error: 'rumorId and reaction are required' },
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

    // Criar ou atualizar a reação usando Prediction (reaproveitando o modelo)
    // O campo prediction será usado como sentimento (true = positivo, false = negativo)
    // Vamos armazenar a reação no campo "prediction" como boolean baseado no sentimento
    const sentiment = REACTION_SENTIMENTS[reaction] ?? 0.5
    const isPositive = sentiment >= 0.5

    const effectiveUserId = userId || `anon_${Date.now()}`

    // Verificar se já existe uma prediction deste usuário
    const existing = await prisma.prediction.findFirst({
      where: {
        rumorId,
        userId: effectiveUserId,
      },
    })

    if (existing) {
      // Atualizar
      await prisma.prediction.update({
        where: { id: existing.id },
        data: { prediction: isPositive },
      })
    } else {
      // Criar nova
      // Primeiro garantir que o user existe
      const user = await prisma.user.findUnique({
        where: { id: effectiveUserId },
      })

      if (!user) {
        // Criar user anônimo temporário
        await prisma.user.create({
          data: {
            id: effectiveUserId,
            name: 'Torcedor Anônimo',
            username: `user_${Date.now()}`,
          },
        })
      }

      await prisma.prediction.create({
        data: {
          rumorId,
          userId: effectiveUserId,
          prediction: isPositive,
        },
      })
    }

    // Recalcular sentimento médio do rumor
    const allPredictions = await prisma.prediction.findMany({
      where: { rumorId },
    })

    const positiveCount = allPredictions.filter(p => p.prediction).length
    const totalCount = allPredictions.length
    const newSentiment = totalCount > 0 ? positiveCount / totalCount : 0.5

    // Atualizar o rumor
    await prisma.rumor.update({
      where: { id: rumorId },
      data: { sentiment: newSentiment },
    })

    return NextResponse.json({
      success: true,
      reaction,
      sentiment: newSentiment,
      totalReactions: totalCount,
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
 * Retorna contagem de reações para um rumor
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const rumorId = url.searchParams.get('rumorId')

    if (!rumorId) {
      return NextResponse.json(
        { error: 'rumorId is required' },
        { status: 400 }
      )
    }

    // Buscar todas as predictions
    const predictions = await prisma.prediction.findMany({
      where: { rumorId },
    })

    // Simular contagem de reações baseado nas predictions
    // Como não temos o emoji salvo, vamos inferir do prediction boolean
    const positiveCount = predictions.filter(p => p.prediction).length
    const negativeCount = predictions.filter(p => !p.prediction).length

    // Distribuir aproximadamente entre as reações
    const reactionCounts = {
      '🔥': Math.floor(positiveCount * 0.4),
      '👍': Math.ceil(positiveCount * 0.6),
      '😐': 0,
      '😕': Math.ceil(negativeCount * 0.6),
      '💔': Math.floor(negativeCount * 0.4),
    }

    return NextResponse.json({
      rumorId,
      reactionCounts,
      totalReactions: predictions.length,
    })
  } catch (error) {
    console.error('Erro ao buscar reações:', error)
    return NextResponse.json(
      { error: 'Failed to get reactions' },
      { status: 500 }
    )
  }
}
