import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeGlobo, scrapeUOL } from '@/src/lib/scrapers/rss'
import {
  extractEntities,
  matchRumors,
  calculateRelevance,
  generateSummary,
  detectSpike,
  calculateVelocity,
} from '@/src/lib/scrapers/processor'
import { ScrapedItem } from '@/src/lib/scrapers/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 segundos no Vercel Pro

/**
 * Cron job para agregar notícias
 * Executado a cada 30 minutos
 */
export async function GET(request: Request) {
  // Verificar autenticação do cron
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // Em desenvolvimento, permitir sem auth
  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    console.log('🔄 Iniciando scrape de notícias...')

    // 1. Buscar rumores ativos
    const activeRumors = await prisma.rumor.findMany({
      where: { status: 'open' },
    })

    console.log(`📰 ${activeRumors.length} rumores ativos encontrados`)

    // 2. Executar scrapers em paralelo
    const [globoArticles, uolArticles] = await Promise.all([
      scrapeGlobo(),
      scrapeUOL(),
    ])

    console.log(`📰 Globo: ${globoArticles.length} artigos`)
    console.log(`📰 UOL: ${uolArticles.length} artigos`)

    const allItems: ScrapedItem[] = [...globoArticles, ...uolArticles]

    // 3. Processar e salvar items
    let savedCount = 0
    let matchedCount = 0

    for (const item of allItems) {
      try {
        // Extrair entidades
        const entities = extractEntities(item.content)

        // Encontrar rumores relacionados
        const rumorMatches = matchRumors(entities, activeRumors)

        // Upsert NewsItem
        const newsItem = await prisma.newsItem.upsert({
          where: {
            source_sourceId: {
              source: item.source,
              sourceId: item.sourceId,
            },
          },
          update: {
            likes: item.likes,
            retweets: item.retweets,
            views: item.views,
            scrapedAt: new Date(),
          },
          create: {
            source: item.source,
            sourceId: item.sourceId,
            sourceUrl: item.sourceUrl,
            authorName: item.authorName,
            authorHandle: item.authorHandle,
            authorAvatar: item.authorAvatar,
            content: item.content,
            summary: item.summary || generateSummary(item.content),
            imageUrl: item.imageUrl,
            publishedAt: item.publishedAt,
            players: JSON.stringify(entities.players),
            teams: JSON.stringify(entities.teams),
            likes: item.likes,
            retweets: item.retweets,
            views: item.views,
          },
        })

        savedCount++

        // Criar relações com rumores
        for (const match of rumorMatches) {
          try {
            await prisma.rumorNewsItem.upsert({
              where: {
                rumorId_newsItemId: {
                  rumorId: match.rumorId,
                  newsItemId: newsItem.id,
                },
              },
              update: {
                relevance: match.relevance,
              },
              create: {
                rumorId: match.rumorId,
                newsItemId: newsItem.id,
                relevance: match.relevance,
              },
            })
            matchedCount++
          } catch (e) {
            // Ignorar erros de constraint (já existe)
          }
        }
      } catch (error) {
        console.error(`Erro ao processar item ${item.sourceId}:`, error)
      }
    }

    // 4. Recalcular sinais para cada rumor
    const currentPeriod = new Date()
    currentPeriod.setMinutes(0, 0, 0) // Arredondar para hora cheia

    for (const rumor of activeRumors) {
      try {
        // Contar menções no período atual
        const recentNews = await prisma.rumorNewsItem.count({
          where: {
            rumorId: rumor.id,
            createdAt: {
              gte: new Date(currentPeriod.getTime() - 60 * 60 * 1000), // Última hora
            },
          },
        })

        // Buscar menções do período anterior
        const previousSignal = await prisma.rumorSignal.findFirst({
          where: {
            rumorId: rumor.id,
            source: 'all',
            period: {
              lt: currentPeriod,
            },
          },
          orderBy: { period: 'desc' },
        })

        const previousMentions = previousSignal?.mentions || 0
        const velocity = calculateVelocity(recentNews, previousMentions)
        const isSpike = detectSpike(recentNews, previousMentions)

        // Salvar sinal
        await prisma.rumorSignal.upsert({
          where: {
            rumorId_period_source: {
              rumorId: rumor.id,
              period: currentPeriod,
              source: 'all',
            },
          },
          update: {
            mentions: recentNews,
            velocity,
          },
          create: {
            rumorId: rumor.id,
            period: currentPeriod,
            source: 'all',
            mentions: recentNews,
            velocity,
          },
        })

        // Atualizar signalScore do rumor
        if (isSpike) {
          await prisma.rumor.update({
            where: { id: rumor.id },
            data: {
              signalScore: Math.min((rumor.signalScore || 0) + 0.1, 1.0),
              lastScraped: new Date(),
            },
          })
        } else {
          await prisma.rumor.update({
            where: { id: rumor.id },
            data: {
              lastScraped: new Date(),
            },
          })
        }
      } catch (error) {
        console.error(`Erro ao calcular sinais para rumor ${rumor.id}:`, error)
      }
    }

    console.log(`✅ Scrape concluído: ${savedCount} items salvos, ${matchedCount} matches`)

    return NextResponse.json({
      success: true,
      processed: allItems.length,
      saved: savedCount,
      matched: matchedCount,
      rumorsProcessed: activeRumors.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Erro no cron de scrape:', error)
    return NextResponse.json(
      { error: 'Scrape failed', details: String(error) },
      { status: 500 }
    )
  }
}
