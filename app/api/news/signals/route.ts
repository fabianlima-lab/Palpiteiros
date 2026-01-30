import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/news/signals?rumorId=xxx
 * Retorna sinais de atividade de um rumor (para gráfico)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rumorId = searchParams.get('rumorId')
    const hours = parseInt(searchParams.get('hours') || '24')

    if (!rumorId) {
      return NextResponse.json(
        { error: 'rumorId é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar sinais das últimas X horas
    const since = new Date()
    since.setHours(since.getHours() - hours)

    const signals = await prisma.rumorSignal.findMany({
      where: {
        rumorId,
        period: { gte: since },
      },
      orderBy: { period: 'asc' },
    })

    // Calcular se está "quente"
    const recentSignals = signals.slice(-3) // Últimas 3 horas
    const totalRecentMentions = recentSignals.reduce((sum, s) => sum + s.mentions, 0)
    const avgVelocity = recentSignals.length > 0
      ? recentSignals.reduce((sum, s) => sum + s.velocity, 0) / recentSignals.length
      : 0

    const isHot = totalRecentMentions > 30 || avgVelocity > 0.5

    return NextResponse.json({
      signals: signals.map(s => ({
        period: s.period,
        source: s.source,
        mentions: s.mentions,
        velocity: s.velocity,
      })),
      summary: {
        totalMentions: signals.reduce((sum, s) => sum + s.mentions, 0),
        avgVelocity,
        isHot,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar sinais:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar sinais' },
      { status: 500 }
    )
  }
}
