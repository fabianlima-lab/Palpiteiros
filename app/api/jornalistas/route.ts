import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/jornalistas
 * PRD v3: Retorna top jornalistas por credibilidade (taxa de acerto)
 *
 * Query params:
 * - limit: numero de jornalistas (default: 5)
 * - orderBy: credibilidade (default) ou acertos
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '5')
    const orderBy = url.searchParams.get('orderBy') || 'credibilidade'

    // Buscar jornalistas ordenados por credibilidade (taxa de acerto)
    const jornalistas = await prisma.jornalista.findMany({
      orderBy: {
        credibilidade: 'desc',
      },
      take: limit,
      include: {
        _count: {
          select: {
            fontes: true,
          },
        },
      },
    })

    // Formatar resposta
    const topFontes = jornalistas.map((j, index) => ({
      id: j.id,
      rank: index + 1,
      nome: j.nome,
      handle: j.handle,
      veiculo: j.veiculo,
      credibilidade: Math.round(j.credibilidade),
      totalPrevisoes: j._count.fontes,
      // Taxa de acerto e formatada para exibicao
      taxaAcerto: `${Math.round(j.credibilidade)}%`,
    }))

    return NextResponse.json({
      topFontes,
      total: jornalistas.length,
    })
  } catch (error) {
    console.error('Erro ao buscar jornalistas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jornalistas', details: String(error) },
      { status: 500 }
    )
  }
}
