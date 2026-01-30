import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/news/rumor?rumorId=xxx&limit=10&offset=0
 * Retorna notícias relacionadas a um rumor
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rumorId = searchParams.get('rumorId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!rumorId) {
      return NextResponse.json(
        { error: 'rumorId é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar notícias relacionadas ao rumor
    const rumorNewsItems = await prisma.rumorNewsItem.findMany({
      where: { rumorId },
      include: {
        newsItem: true,
      },
      orderBy: [
        { relevance: 'desc' },
        { newsItem: { publishedAt: 'desc' } },
      ],
      take: limit,
      skip: offset,
    })

    // Contar total
    const total = await prisma.rumorNewsItem.count({
      where: { rumorId },
    })

    const news = rumorNewsItems.map(rni => ({
      id: rni.newsItem.id,
      source: rni.newsItem.source,
      sourceUrl: rni.newsItem.sourceUrl,
      authorName: rni.newsItem.authorName,
      authorHandle: rni.newsItem.authorHandle,
      authorAvatar: rni.newsItem.authorAvatar,
      content: rni.newsItem.content,
      summary: rni.newsItem.summary,
      imageUrl: rni.newsItem.imageUrl,
      publishedAt: rni.newsItem.publishedAt,
      likes: rni.newsItem.likes,
      retweets: rni.newsItem.retweets,
      views: rni.newsItem.views,
      relevance: rni.relevance,
    }))

    return NextResponse.json({
      news,
      total,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Erro ao buscar notícias:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar notícias' },
      { status: 500 }
    )
  }
}
