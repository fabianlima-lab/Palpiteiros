import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * POST /api/vote
 * Registra ou atualiza o palpite de um usuário em um rumor
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rumorId, userId, prediction } = body

    if (!rumorId || !userId || prediction === undefined) {
      return NextResponse.json(
        { error: 'rumorId, userId e prediction são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o rumor existe e está aberto
    const rumor = await prisma.rumor.findUnique({
      where: { id: rumorId },
    })

    if (!rumor) {
      return NextResponse.json({ error: 'Rumor não encontrado' }, { status: 404 })
    }

    if (rumor.status !== 'open') {
      return NextResponse.json(
        { error: 'Este rumor já foi encerrado' },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Upsert do palpite
    const palpite = await prisma.prediction.upsert({
      where: {
        rumorId_userId: {
          rumorId,
          userId,
        },
      },
      update: {
        prediction: Boolean(prediction),
      },
      create: {
        rumorId,
        userId,
        prediction: Boolean(prediction),
      },
    })

    // Recalcular sentimento do rumor
    const allPredictions = await prisma.prediction.findMany({
      where: { rumorId },
    })

    const totalPredictions = allPredictions.length
    const positivePredictions = allPredictions.filter(p => p.prediction).length
    const newSentiment = totalPredictions > 0 ? positivePredictions / totalPredictions : 0.5

    await prisma.rumor.update({
      where: { id: rumorId },
      data: { sentiment: newSentiment },
    })

    // Dar pontos ao usuário (10 pontos por palpite)
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: { increment: 10 },
      },
    })

    return NextResponse.json({
      success: true,
      prediction: palpite,
      newSentiment,
      totalPredictions,
      percentVai: Math.round(newSentiment * 100),
      percentNao: Math.round((1 - newSentiment) * 100),
    })
  } catch (error) {
    console.error('Erro ao registrar voto:', error)
    return NextResponse.json({ error: 'Erro ao registrar voto' }, { status: 500 })
  }
}

/**
 * GET /api/vote?rumorId=xxx
 * Retorna estatísticas de votação de um rumor
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rumorId = searchParams.get('rumorId')

    if (!rumorId) {
      return NextResponse.json(
        { error: 'rumorId é obrigatório' },
        { status: 400 }
      )
    }

    const rumor = await prisma.rumor.findUnique({
      where: { id: rumorId },
      include: {
        predictions: true,
      },
    })

    if (!rumor) {
      return NextResponse.json({ error: 'Rumor não encontrado' }, { status: 404 })
    }

    const totalPredictions = rumor.predictions.length
    const positivePredictions = rumor.predictions.filter(p => p.prediction).length
    const negativePredictions = totalPredictions - positivePredictions

    return NextResponse.json({
      rumorId,
      sentiment: rumor.sentiment,
      totalPredictions,
      vai: positivePredictions,
      naoVai: negativePredictions,
      percentVai: Math.round(rumor.sentiment * 100),
      percentNao: Math.round((1 - rumor.sentiment) * 100),
    })
  } catch (error) {
    console.error('Erro ao buscar votos:', error)
    return NextResponse.json({ error: 'Erro ao buscar votos' }, { status: 500 })
  }
}
