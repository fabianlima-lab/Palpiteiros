import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/rumors
 * Retorna rumores paginados com filtros
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const team = searchParams.get('team') // filtrar por time
    const order = searchParams.get('order') || 'quentes' // quentes, recentes, fechando

    // Construir filtros
    const where: Record<string, unknown> = { status: 'open' }

    if (team && team !== 'todos') {
      where.OR = [
        { toTeam: { contains: team } },
        { fromTeam: { contains: team } },
      ]
    }

    // Construir ordenação
    let orderBy: Record<string, string>[] = []
    switch (order) {
      case 'recentes':
        orderBy = [{ createdAt: 'desc' }]
        break
      case 'fechando':
        orderBy = [{ closesAt: 'asc' }]
        break
      case 'quentes':
      default:
        orderBy = [{ sentiment: 'desc' }, { createdAt: 'desc' }]
        break
    }

    // Buscar rumores
    const [rumors, total] = await Promise.all([
      prisma.rumor.findMany({
        where,
        include: {
          signals: {
            include: {
              influencer: true,
            },
            take: 3,
          },
          predictions: {
            select: {
              id: true,
              prediction: true,
              userId: true,
            },
          },
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.rumor.count({ where }),
    ])

    // Serializar datas
    const serializedRumors = rumors.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      closesAt: r.closesAt.toISOString(),
      resolvedAt: r.resolvedAt?.toISOString() || null,
      lastScraped: r.lastScraped?.toISOString() || null,
      signals: r.signals.map(s => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
        influencer: {
          ...s.influencer,
          createdAt: s.influencer.createdAt.toISOString(),
          updatedAt: s.influencer.updatedAt.toISOString(),
        },
      })),
      predictions: r.predictions.map(p => ({
        ...p,
        createdAt: '',
      })),
    }))

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
