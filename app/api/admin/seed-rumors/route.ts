import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// ===========================================================================
// RUMORES CURADOS MANUALMENTE - Janeiro 2026
// Baseados em notícias reais do mercado brasileiro
// ===========================================================================

const CURATED_RUMORS = [
  // ===========================================================================
  // TRANSFERÊNCIAS CONFIRMADAS/QUENTES (baseado em Transfermarkt/90min)
  // ===========================================================================
  {
    playerName: 'Vitor Roque',
    fromTeam: 'Barcelona',
    toTeam: 'Palmeiras',
    title: 'Vitor Roque vai ficar no Palmeiras?',
    description: 'Após empréstimo do Barcelona, Palmeiras negocia compra definitiva do atacante de 20 anos.',
    category: 'transferencia',
    sentiment: 0.75,
  },
  {
    playerName: 'Arthur Cabral',
    fromTeam: 'Fiorentina',
    toTeam: 'Botafogo',
    title: 'Arthur Cabral é reforço do Botafogo?',
    description: 'Atacante brasileiro deixa a Fiorentina e negocia com o Fogão para a temporada 2026.',
    category: 'transferencia',
    sentiment: 0.85,
  },
  {
    playerName: 'Memphis Depay',
    fromTeam: 'Corinthians',
    toTeam: 'Europa',
    title: 'Memphis Depay deixa o Corinthians?',
    description: 'Holandês tem proposta do futebol europeu. Timão tenta segurar o craque.',
    category: 'transferencia',
    sentiment: 0.45,
  },
  {
    playerName: 'Emerson Royal',
    fromTeam: 'Milan',
    toTeam: 'Flamengo',
    title: 'Emerson Royal fecha com o Flamengo?',
    description: 'Lateral brasileiro deixa o Milan e pode reforçar o Rubro-Negro em 2026.',
    category: 'transferencia',
    sentiment: 0.70,
  },

  // ===========================================================================
  // TÉCNICOS
  // ===========================================================================
  {
    playerName: 'Tite',
    toTeam: 'Cruzeiro',
    title: 'Tite permanece no Cruzeiro até o fim do ano?',
    description: 'Após início irregular, técnico pode ser demitido se resultados não melhorarem.',
    category: 'tecnico',
    sentiment: 0.55,
  },
  {
    playerName: 'Abel Ferreira',
    toTeam: 'Palmeiras',
    title: 'Abel Ferreira renova com o Palmeiras?',
    description: 'Contrato do português termina em dezembro. Negociação de renovação em andamento.',
    category: 'tecnico',
    sentiment: 0.80,
  },
  {
    playerName: 'Fernando Diniz',
    toTeam: 'Santos',
    title: 'Fernando Diniz assume o Santos?',
    description: 'Técnico é especulado no Peixe caso resultados com Neymar não venham.',
    category: 'tecnico',
    sentiment: 0.35,
  },

  // ===========================================================================
  // TÍTULOS E COMPETIÇÕES
  // ===========================================================================
  {
    playerName: 'Flamengo',
    toTeam: 'Supercopa',
    title: 'Flamengo vence a Supercopa 2026?',
    description: 'Mengão enfrenta o Botafogo na decisão da Supercopa do Brasil.',
    category: 'titulo',
    sentiment: 0.60,
  },
  {
    playerName: 'Botafogo',
    toTeam: 'Libertadores',
    title: 'Botafogo chega à final da Libertadores 2026?',
    description: 'Atual campeão busca o bicampeonato. Elenco foi reforçado para a competição.',
    category: 'titulo',
    sentiment: 0.65,
  },
  {
    playerName: 'Palmeiras',
    toTeam: 'Brasileirão',
    title: 'Palmeiras é tricampeão brasileiro?',
    description: 'Verdão busca o terceiro título consecutivo do Campeonato Brasileiro.',
    category: 'titulo',
    sentiment: 0.55,
  },

  // ===========================================================================
  // SELEÇÃO BRASILEIRA
  // ===========================================================================
  {
    playerName: 'Kaio Jorge',
    toTeam: 'Seleção Brasileira',
    title: 'Kaio Jorge na próxima convocação da Seleção?',
    description: 'Atacante do Cruzeiro vive grande fase e pode ser chamado por Dorival Jr.',
    category: 'selecao',
    sentiment: 0.70,
  },
  {
    playerName: 'Breno Bidon',
    toTeam: 'Seleção Brasileira',
    title: 'Breno Bidon será convocado para a Copa do Mundo?',
    description: 'Volante do Corinthians é uma das joias do futebol brasileiro aos 18 anos.',
    category: 'selecao',
    sentiment: 0.50,
  },
  {
    playerName: 'Neymar',
    toTeam: 'Seleção Brasileira',
    title: 'Neymar joga a Copa do Mundo 2026?',
    description: 'Craque está de volta ao Santos e busca recuperar forma física para o Mundial.',
    category: 'selecao',
    sentiment: 0.65,
  },

  // ===========================================================================
  // OUTROS RUMORES QUENTES
  // ===========================================================================
  {
    playerName: 'Gabigol',
    fromTeam: 'Cruzeiro',
    toTeam: 'Santos',
    title: 'Gabigol troca o Cruzeiro pelo Santos?',
    description: 'Atacante não estaria feliz no Cruzeiro e Santos tenta repatriação.',
    category: 'transferencia',
    sentiment: 0.30,
  },
  {
    playerName: 'Dudu',
    fromTeam: 'Palmeiras',
    toTeam: 'Cruzeiro',
    title: 'Dudu sai do Palmeiras?',
    description: 'Ídolo alviverde pode deixar o clube após recuperação de lesão.',
    category: 'transferencia',
    sentiment: 0.40,
  },
  {
    playerName: 'Raphael Veiga',
    fromTeam: 'Palmeiras',
    toTeam: 'Flamengo',
    title: 'Raphael Veiga no Flamengo?',
    description: 'Meia do Palmeiras é especulado no rival. Contrato termina em 2026.',
    category: 'transferencia',
    sentiment: 0.25,
  },
]

/**
 * POST /api/admin/seed-rumors
 * Adiciona rumores curados manualmente ao banco
 */
export async function POST() {
  try {
    let created = 0
    let skipped = 0

    for (const rumor of CURATED_RUMORS) {
      // Verificar se já existe rumor similar
      const existing = await prisma.rumor.findFirst({
        where: {
          OR: [
            {
              playerName: { contains: rumor.playerName, mode: 'insensitive' },
              toTeam: { contains: rumor.toTeam, mode: 'insensitive' },
            },
            {
              title: { contains: rumor.title.substring(0, 30), mode: 'insensitive' },
            },
          ],
        },
      })

      if (existing) {
        console.log(`⏭️ Já existe: ${rumor.title}`)
        skipped++
        continue
      }

      // Criar rumor com data de fechamento baseada na categoria
      const closesAt = new Date()
      switch (rumor.category) {
        case 'titulo':
          closesAt.setMonth(closesAt.getMonth() + 6) // 6 meses
          break
        case 'selecao':
          closesAt.setMonth(closesAt.getMonth() + 3) // 3 meses
          break
        case 'tecnico':
          closesAt.setMonth(closesAt.getMonth() + 2) // 2 meses
          break
        default:
          closesAt.setDate(closesAt.getDate() + 45) // 45 dias
      }

      await prisma.rumor.create({
        data: {
          playerName: rumor.playerName,
          fromTeam: rumor.fromTeam || null,
          toTeam: rumor.toTeam,
          title: rumor.title,
          description: rumor.description,
          category: rumor.category,
          sentiment: rumor.sentiment,
          signalScore: rumor.sentiment,
          status: 'open',
          closesAt,
        },
      })

      console.log(`✅ Criado: ${rumor.title}`)
      created++
    }

    return NextResponse.json({
      success: true,
      message: 'Rumores curados adicionados',
      stats: {
        total: CURATED_RUMORS.length,
        created,
        skipped,
      },
    })
  } catch (error) {
    console.error('Erro ao adicionar rumores:', error)
    return NextResponse.json(
      { error: 'Failed to seed rumors', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/seed-rumors
 * Lista os rumores que seriam adicionados
 */
export async function GET() {
  return NextResponse.json({
    rumors: CURATED_RUMORS,
    total: CURATED_RUMORS.length,
    categories: {
      transferencia: CURATED_RUMORS.filter(r => r.category === 'transferencia').length,
      tecnico: CURATED_RUMORS.filter(r => r.category === 'tecnico').length,
      titulo: CURATED_RUMORS.filter(r => r.category === 'titulo').length,
      selecao: CURATED_RUMORS.filter(r => r.category === 'selecao').length,
    },
  })
}
