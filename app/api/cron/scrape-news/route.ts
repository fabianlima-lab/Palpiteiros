import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeGlobo, scrapeUOL } from '@/src/lib/scrapers/rss'
import { scrapeTwitter } from '@/src/lib/scrapers/twitter'
import { scrapeYouTube } from '@/src/lib/scrapers/youtube'
import {
  extractEntities,
  matchRumors,
  generateSummary,
  generateKeywords,
  detectSpike,
  calculateVelocity,
} from '@/src/lib/scrapers/processor'
import {
  processNewsAndCreateRumors,
  updateRumorStatus,
} from '@/src/lib/scrapers/rumor-detector'
import { ScrapedItem } from '@/src/lib/scrapers/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 segundos no Vercel Pro

/**
 * Cron job para agregar notícias de todas as fontes
 * Executado a cada 30 minutos
 *
 * Fontes:
 * - Globo Esporte (RSS)
 * - UOL Esporte (RSS)
 * - Twitter/X (via Nitter)
 * - YouTube (RSS + scraping)
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

  const startTime = Date.now()
  const stats = {
    globo: 0,
    uol: 0,
    twitter: 0,
    youtube: 0,
    total: 0,
    saved: 0,
    matched: 0,
    errors: [] as string[],
  }

  try {
    console.log('🔄 Iniciando scrape de notícias...')

    // 1. Buscar rumores ativos
    const activeRumors = await prisma.rumor.findMany({
      where: { status: 'open' },
    })

    console.log(`📰 ${activeRumors.length} rumores ativos encontrados`)

    // 2. Gerar keywords baseado nos rumores
    const keywords = generateKeywords(activeRumors)
    console.log(`🔑 Keywords geradas: ${keywords.slice(0, 5).join(', ')}...`)

    // 3. Executar scrapers em paralelo
    const [globoArticles, uolArticles, tweets, videos] = await Promise.allSettled([
      scrapeGlobo(),
      scrapeUOL(),
      scrapeTwitter(keywords),
      scrapeYouTube(keywords),
    ])

    // Processar resultados
    const allItems: ScrapedItem[] = []

    if (globoArticles.status === 'fulfilled') {
      stats.globo = globoArticles.value.length
      allItems.push(...globoArticles.value)
      console.log(`📰 Globo: ${stats.globo} artigos`)
    } else {
      stats.errors.push(`Globo: ${globoArticles.reason}`)
      console.error('❌ Erro no Globo:', globoArticles.reason)
    }

    if (uolArticles.status === 'fulfilled') {
      stats.uol = uolArticles.value.length
      allItems.push(...uolArticles.value)
      console.log(`📰 UOL: ${stats.uol} artigos`)
    } else {
      stats.errors.push(`UOL: ${uolArticles.reason}`)
      console.error('❌ Erro no UOL:', uolArticles.reason)
    }

    if (tweets.status === 'fulfilled') {
      stats.twitter = tweets.value.length
      allItems.push(...tweets.value)
      console.log(`🐦 Twitter: ${stats.twitter} tweets`)
    } else {
      stats.errors.push(`Twitter: ${tweets.reason}`)
      console.error('❌ Erro no Twitter:', tweets.reason)
    }

    if (videos.status === 'fulfilled') {
      stats.youtube = videos.value.length
      allItems.push(...videos.value)
      console.log(`▶️ YouTube: ${stats.youtube} vídeos`)
    } else {
      stats.errors.push(`YouTube: ${videos.reason}`)
      console.error('❌ Erro no YouTube:', videos.reason)
    }

    stats.total = allItems.length
    console.log(`📊 Total de items: ${stats.total}`)

    // 4. Processar e salvar items
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

        stats.saved++

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
            stats.matched++
          } catch {
            // Ignorar erros de constraint (já existe)
          }
        }
      } catch (error) {
        console.error(`Erro ao processar item ${item.sourceId}:`, error)
      }
    }

    // 5. Recalcular sinais para cada rumor
    const currentPeriod = new Date()
    currentPeriod.setMinutes(0, 0, 0) // Arredondar para hora cheia

    for (const rumor of activeRumors) {
      try {
        // Contar menções no período atual (por fonte)
        const recentNewsBySource = await prisma.rumorNewsItem.groupBy({
          by: ['newsItemId'],
          where: {
            rumorId: rumor.id,
            createdAt: {
              gte: new Date(currentPeriod.getTime() - 60 * 60 * 1000), // Última hora
            },
          },
        })

        const totalRecentMentions = recentNewsBySource.length

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
        const velocity = calculateVelocity(totalRecentMentions, previousMentions)
        const isSpike = detectSpike(totalRecentMentions, previousMentions)

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
            mentions: totalRecentMentions,
            velocity,
          },
          create: {
            rumorId: rumor.id,
            period: currentPeriod,
            source: 'all',
            mentions: totalRecentMentions,
            velocity,
          },
        })

        // Atualizar signalScore do rumor
        const newSignalScore = isSpike
          ? Math.min((rumor.signalScore || 0) + 0.1, 1.0)
          : Math.max((rumor.signalScore || 0) - 0.02, 0) // Decay lento

        await prisma.rumor.update({
          where: { id: rumor.id },
          data: {
            signalScore: newSignalScore,
            lastScraped: new Date(),
          },
        })
      } catch (error) {
        console.error(`Erro ao calcular sinais para rumor ${rumor.id}:`, error)
      }
    }

    // 6. NOVO: Detectar e criar rumores automaticamente das notícias
    console.log('🤖 Analisando notícias para detectar novos rumores...')
    const rumorStats = await processNewsAndCreateRumors()
    console.log(`   ✨ Rumores criados: ${rumorStats.created}`)
    console.log(`   📝 Rumores atualizados: ${rumorStats.updated}`)

    // 7. NOVO: Atualizar status de rumores (confirmados/desmentidos)
    const statusUpdates = await updateRumorStatus()
    console.log(`   🔄 Status atualizados: ${statusUpdates}`)

    const duration = Date.now() - startTime
    console.log(`✅ Scrape concluído em ${duration}ms`)
    console.log(`   📥 Salvos: ${stats.saved}`)
    console.log(`   🔗 Matches: ${stats.matched}`)

    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
      stats: {
        sources: {
          globo: stats.globo,
          uol: stats.uol,
          twitter: stats.twitter,
          youtube: stats.youtube,
        },
        total: stats.total,
        saved: stats.saved,
        matched: stats.matched,
        rumorsProcessed: activeRumors.length,
        rumorsCreated: rumorStats.created,
        rumorsUpdated: rumorStats.updated,
        statusUpdates,
      },
      errors: stats.errors.length > 0 ? stats.errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Erro no cron de scrape:', error)
    return NextResponse.json(
      {
        error: 'Scrape failed',
        details: String(error),
        duration: `${Date.now() - startTime}ms`,
      },
      { status: 500 }
    )
  }
}
