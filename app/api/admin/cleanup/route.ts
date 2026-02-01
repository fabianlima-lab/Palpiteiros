import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/cleanup
 * Limpa rumores antigos/inválidos e atualiza dados de seed
 */
export async function POST(request: Request) {
  try {
    const stats = {
      deleted: 0,
      updated: 0,
    }

    const now = new Date()

    // Encontrar IDs dos rumores a deletar
    const rumorsToDelete = await prisma.rumor.findMany({
      where: {
        OR: [
          // Rumores expirados
          { closesAt: { lt: now }, status: 'open' },
          // Rumores com 2025 no título
          { title: { contains: '2025' } },
          // Gabigol já foi pro Cruzeiro (dado antigo)
          { AND: [{ playerName: { contains: 'Gabigol' } }, { toTeam: { contains: 'Cruzeiro' } }] },
          // FALSO: Gabigol já está no Flamengo (voltou em Jan/2026)
          { AND: [{ playerName: { contains: 'Gabigol' } }, { toTeam: { contains: 'Flamengo' } }] },
          // FALSO: Lucas Paquetá NÃO está indo pro Corinthians
          { AND: [{ playerName: { contains: 'Paqueta' } }, { toTeam: { contains: 'Corinthians' } }] },
          { AND: [{ playerName: { contains: 'Paquetá' } }, { toTeam: { contains: 'Corinthians' } }] },
          // Nomes com underscore (bug antigo)
          { playerName: { contains: '_' } },
          // Jogadores indo para time que já estão (dados do Transfermarkt 2026)
          // Lucas Paquetá já está no Flamengo
          { AND: [{ playerName: { contains: 'Paqueta' } }, { toTeam: { contains: 'Flamengo' } }] },
          { AND: [{ playerName: { contains: 'Paquetá' } }, { toTeam: { contains: 'Flamengo' } }] },
          // Cano já está no Fluminense
          { AND: [{ playerName: { equals: 'Cano' } }, { toTeam: { contains: 'Fluminense' } }] },
          // Vinicius é muito genérico
          { playerName: { equals: 'Vinicius' } },
        ],
      },
      select: { id: true },
    })

    const rumorIds = rumorsToDelete.map(r => r.id)

    if (rumorIds.length > 0) {
      // Deletar relações primeiro
      await prisma.prediction.deleteMany({ where: { rumorId: { in: rumorIds } } })
      await prisma.signal.deleteMany({ where: { rumorId: { in: rumorIds } } })
      await prisma.socialPost.deleteMany({ where: { rumorId: { in: rumorIds } } })
      await prisma.rumorNewsItem.deleteMany({ where: { rumorId: { in: rumorIds } } })
      await prisma.rumorSignal.deleteMany({ where: { rumorId: { in: rumorIds } } })

      // Agora deletar os rumores
      const deleted = await prisma.rumor.deleteMany({
        where: { id: { in: rumorIds } },
      })
      stats.deleted = deleted.count
    }

    // 3. Deletar rumores sem sentido (jogador já está no time destino)
    // Por enquanto, vamos marcar para revisão manual

    // 4. Atualizar rumores existentes para ter datas válidas
    const openRumors = await prisma.rumor.findMany({
      where: { status: 'open' },
    })

    for (const rumor of openRumors) {
      // Se closesAt já passou, atualizar para 30 dias no futuro
      if (rumor.closesAt < now) {
        const newClosesAt = new Date()
        newClosesAt.setDate(newClosesAt.getDate() + 30)

        await prisma.rumor.update({
          where: { id: rumor.id },
          data: { closesAt: newClosesAt },
        })
        stats.updated++
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed',
      stats,
    })
  } catch (error) {
    console.error('Erro no cleanup:', error)
    return NextResponse.json(
      { error: 'Cleanup failed', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/cleanup
 * Lista rumores que podem ser problemáticos
 */
export async function GET() {
  try {
    const now = new Date()

    // Rumores com data expirada
    const expired = await prisma.rumor.findMany({
      where: {
        closesAt: { lt: now },
        status: 'open',
      },
      select: { id: true, title: true, closesAt: true },
    })

    // Rumores com "2025" no título (provavelmente antigos)
    const old2025 = await prisma.rumor.findMany({
      where: {
        title: { contains: '2025' },
      },
      select: { id: true, title: true },
    })

    // Todos os rumores para revisão
    const all = await prisma.rumor.findMany({
      select: {
        id: true,
        title: true,
        playerName: true,
        fromTeam: true,
        toTeam: true,
        status: true,
        closesAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      expired,
      old2025,
      all,
      totalRumors: all.length,
    })
  } catch (error) {
    console.error('Erro ao listar:', error)
    return NextResponse.json({ error: 'Failed to list' }, { status: 500 })
  }
}
