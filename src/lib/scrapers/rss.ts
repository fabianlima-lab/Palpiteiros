import { ScrapedArticle } from './types'

// RSS Feeds das principais fontes
const RSS_FEEDS: Record<string, { url: string; source: 'globo' | 'uol' }> = {
  'globo-futebol': {
    url: 'https://ge.globo.com/rss/futebol/',
    source: 'globo',
  },
  'uol-esporte': {
    url: 'https://esporte.uol.com.br/futebol/ultimas/index.xml',
    source: 'uol',
  },
}

interface RSSItem {
  title: string
  link: string
  description?: string
  pubDate: string
  'media:thumbnail'?: { $: { url: string } }
  enclosure?: { $: { url: string } }
}

/**
 * Parse RSS XML para JSON
 * Implementação simples sem dependências externas
 */
function parseRSSXML(xml: string): RSSItem[] {
  const items: RSSItem[] = []

  // Regex para extrair items
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let itemMatch

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const itemContent = itemMatch[1]

    // Extrair campos
    const title = extractTag(itemContent, 'title')
    const link = extractTag(itemContent, 'link')
    const description = extractTag(itemContent, 'description')
    const pubDate = extractTag(itemContent, 'pubDate')

    // Extrair imagem (diferentes formatos)
    let imageUrl = ''
    const mediaMatch = itemContent.match(/<media:thumbnail[^>]*url="([^"]+)"/)
    if (mediaMatch) {
      imageUrl = mediaMatch[1]
    } else {
      const enclosureMatch = itemContent.match(/<enclosure[^>]*url="([^"]+)"/)
      if (enclosureMatch) {
        imageUrl = enclosureMatch[1]
      }
    }

    if (title && link) {
      items.push({
        title,
        link,
        description: description || undefined,
        pubDate: pubDate || new Date().toISOString(),
        'media:thumbnail': imageUrl ? { $: { url: imageUrl } } : undefined,
      })
    }
  }

  return items
}

/**
 * Extrai conteúdo de uma tag XML
 */
function extractTag(content: string, tag: string): string {
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i')
  const cdataMatch = content.match(cdataRegex)
  if (cdataMatch) {
    return cdataMatch[1].trim()
  }

  const simpleRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const simpleMatch = content.match(simpleRegex)
  if (simpleMatch) {
    return simpleMatch[1].trim()
  }

  return ''
}

/**
 * Limpa HTML do texto
 */
function stripHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

/**
 * Scrape RSS feed e retorna artigos
 */
export async function scrapeRSSFeed(
  feedKey: string
): Promise<ScrapedArticle[]> {
  const feed = RSS_FEEDS[feedKey]
  if (!feed) {
    console.error(`Feed não encontrado: ${feedKey}`)
    return []
  }

  try {
    const response = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Palpiteiro/1.0 RSS Reader',
      },
      next: { revalidate: 1800 }, // Cache por 30 min
    })

    if (!response.ok) {
      console.error(`Erro ao buscar feed ${feedKey}: ${response.status}`)
      return []
    }

    const xml = await response.text()
    const items = parseRSSXML(xml)

    const articles: ScrapedArticle[] = items.map(item => ({
      source: feed.source,
      sourceId: item.link, // URL como ID único
      sourceUrl: item.link,
      authorName: feed.source === 'globo' ? 'Globo Esporte' : 'UOL Esporte',
      content: stripHTML(item.title),
      summary: item.description ? stripHTML(item.description).substring(0, 280) : undefined,
      imageUrl: item['media:thumbnail']?.$?.url || item.enclosure?.$?.url,
      publishedAt: new Date(item.pubDate),
    }))

    return articles
  } catch (error) {
    console.error(`Erro ao fazer scrape do feed ${feedKey}:`, error)
    return []
  }
}

/**
 * Scrape todos os feeds RSS
 */
export async function scrapeAllRSSFeeds(): Promise<ScrapedArticle[]> {
  const feedKeys = Object.keys(RSS_FEEDS)

  const results = await Promise.all(
    feedKeys.map(key => scrapeRSSFeed(key))
  )

  // Flatten e remover duplicados por sourceId
  const allArticles = results.flat()
  const uniqueArticles = new Map<string, ScrapedArticle>()

  for (const article of allArticles) {
    if (!uniqueArticles.has(article.sourceId)) {
      uniqueArticles.set(article.sourceId, article)
    }
  }

  return Array.from(uniqueArticles.values())
}

/**
 * Scrape Globo Esporte
 */
export async function scrapeGlobo(): Promise<ScrapedArticle[]> {
  return scrapeRSSFeed('globo-futebol')
}

/**
 * Scrape UOL Esporte
 */
export async function scrapeUOL(): Promise<ScrapedArticle[]> {
  return scrapeRSSFeed('uol-esporte')
}
