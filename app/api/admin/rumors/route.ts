import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/rumors
 * Lista todos os rumores com paginacao (para admin)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') // open, confirmed, denied, all
    const source = searchParams.get('source') // auto, manual, all
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Construir filtros
    const where: Record<string, unknown> = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (source && source !== 'all') {
      // Rumores automaticos tem description que comeca com [AUTO]
      if (source === 'auto') {
        where.description = { startsWith: '[AUTO]' }
      } else if (source === 'manual') {
        where.OR = [
          { description: { not: { startsWith: '[AUTO]' } } },
          { description: null },
          { description: '' }
        ]
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { playerName: { contains: search, mode: 'insensitive' } },
        { toTeam: { contains: search, mode: 'insensitive' } },
        { fromTeam: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [rumors, total] = await Promise.all([
      prisma.rumor.findMany({
        where,
        include: {
          _count: {
            select: {
              predictions: true,
              signals: true,
              newsItems: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.rumor.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    // Serializar datas
    const serializedRumors = rumors.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      closesAt: r.closesAt.toISOString(),
      resolvedAt: r.resolvedAt?.toISOString() || null,
      lastScraped: r.lastScraped?.toISOString() || null,
      isAutomatic: r.description?.startsWith('[AUTO]') || false,
    }))

    return NextResponse.json({
      rumors: serializedRumors,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar rumores (admin):', error)
    return NextResponse.json({ error: 'Erro ao buscar rumores' }, { status: 500 })
  }
}

/**
 * POST /api/admin/rumors
 * Cria um novo rumor manualmente
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, playerName, playerImage, fromTeam, toTeam, description, category, closesAt, status } = body

    if (!title || !playerName || !toTeam || !closesAt) {
      return NextResponse.json(
        { error: 'Campos obrigatorios: title, playerName, toTeam, closesAt' },
        { status: 400 }
      )
    }

    const rumor = await prisma.rumor.create({
      data: {
        title,
        playerName,
        playerImage: playerImage || null,
        fromTeam: fromTeam || null,
        toTeam,
        description: description || null,
        category: category || 'transferencia',
        closesAt: new Date(closesAt),
        status: status || 'open',
        sentiment: 0.5, // neutro inicialmente
      },
    })

    return NextResponse.json({
      success: true,
      rumor: {
        ...rumor,
        createdAt: rumor.createdAt.toISOString(),
        updatedAt: rumor.updatedAt.toISOString(),
        closesAt: rumor.closesAt.toISOString(),
        resolvedAt: rumor.resolvedAt?.toISOString() || null,
        lastScraped: rumor.lastScraped?.toISOString() || null,
      },
    })
  } catch (error) {
    console.error('Erro ao criar rumor:', error)
    return NextResponse.json({ error: 'Erro ao criar rumor' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/rumors
 * Atualiza um rumor existente
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do rumor e obrigatorio' }, { status: 400 })
    }

    // Campos permitidos para atualizacao
    const allowedFields = ['title', 'playerName', 'playerImage', 'fromTeam', 'toTeam', 'description', 'category', 'status', 'closesAt', 'sentiment', 'resolvedOutcome']
    const filteredData: Record<string, unknown> = {}

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        if (field === 'closesAt') {
          filteredData[field] = new Date(updateData[field])
        } else {
          filteredData[field] = updateData[field]
        }
      }
    }

    // Se estiver confirmando ou negando o rumor, definir resolvedAt
    if (updateData.status === 'confirmed' || updateData.status === 'denied') {
      filteredData.resolvedAt = new Date()
      filteredData.resolvedOutcome = updateData.status === 'confirmed'
    }

    const rumor = await prisma.rumor.update({
      where: { id },
      data: filteredData,
    })

    return NextResponse.json({
      success: true,
      rumor: {
        ...rumor,
        createdAt: rumor.createdAt.toISOString(),
        updatedAt: rumor.updatedAt.toISOString(),
        closesAt: rumor.closesAt.toISOString(),
        resolvedAt: rumor.resolvedAt?.toISOString() || null,
        lastScraped: rumor.lastScraped?.toISOString() || null,
      },
    })
  } catch (error) {
    console.error('Erro ao atualizar rumor:', error)
    return NextResponse.json({ error: 'Erro ao atualizar rumor' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/rumors
 * Remove um rumor (soft delete mudando status ou hard delete)
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const hardDelete = searchParams.get('hard') === 'true'

    if (!id) {
      return NextResponse.json({ error: 'ID do rumor e obrigatorio' }, { status: 400 })
    }

    if (hardDelete) {
      // Deletar previsoes e sinais relacionados primeiro
      await prisma.prediction.deleteMany({ where: { rumorId: id } })
      await prisma.signal.deleteMany({ where: { rumorId: id } })
      await prisma.socialPost.deleteMany({ where: { rumorId: id } })
      await prisma.rumorNewsItem.deleteMany({ where: { rumorId: id } })
      await prisma.rumorSignal.deleteMany({ where: { rumorId: id } })
      await prisma.rumor.delete({ where: { id } })
    } else {
      // Soft delete - mudar status para 'deleted'
      await prisma.rumor.update({
        where: { id },
        data: { status: 'deleted' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar rumor:', error)
    return NextResponse.json({ error: 'Erro ao deletar rumor' }, { status: 500 })
  }
}
