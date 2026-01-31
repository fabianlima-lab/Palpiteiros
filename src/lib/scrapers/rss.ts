import { ScrapedArticle } from './types'

// RSS Feeds das principais fontes que funcionam
const RSS_FEEDS: Record<string, { url: string; source: 'globo' | 'uol'; name: string }> = {
  // === FONTES PRINCIPAIS ===
  'gazeta-esportiva': {
    url: 'https://www.gazetaesportiva.com/feed/',
    source: 'globo',
    name: 'Gazeta Esportiva',
  },
  'trivela': {
    url: 'https://trivela.com.br/feed/',
    source: 'globo',
    name: 'Trivela',
  },
  'espn-brasil': {
    url: 'https://www.espn.com.br/espn/rss/futebol/news',
    source: 'uol',
    name: 'ESPN Brasil',
  },
  'futebol-interior': {
    url: 'https://www.futebolinterior.com.br/rss',
    source: 'uol',
    name: 'Futebol Interior',
  },

  // === FONTES ADICIONAIS ===
  'sambafoot': {
    url: 'https://sambafoot.com/feed/',
    source: 'globo',
    name: 'Sambafoot',
  },
  'meu-timao': {
    url: 'https://www.meutimao.com.br/feed',
    source: 'globo',
    name: 'Meu Timão',
  },
  'netvasco': {
    url: 'https://www.netvasco.com.br/rss/',
    source: 'uol',
    name: 'NetVasco',
  },
  'flamengo-rss': {
    url: 'https://www.colframengo.com.br/feed/',
    source: 'globo',
    name: 'Coluna do Fla',
  },
  'palmeiras-online': {
    url: 'https://www.palmeirasonline.com/feed/',
    source: 'globo',
    name: 'Palmeiras Online',
  },
  'torcedores': {
    url: 'https://www.torcedores.com/feed',
    source: 'uol',
    name: 'Torcedores.com',
  },
  '90min-brasil': {
    url: 'https://www.90min.com/pt-BR/feed',
    source: 'uol',
    name: '90min Brasil',
  },
  'footstats': {
    url: 'https://footstats.com.br/feed/',
    source: 'uol',
    name: 'Footstats',
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
      } else {
        // Tentar extrair imagem do content:encoded
        const imgMatch = itemContent.match(/<img[^>]*src="([^"]+)"/)
        if (imgMatch) {
          imageUrl = imgMatch[1]
        }
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
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, ' ')
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(15000), // 15s timeout
    })

    if (!response.ok) {
      console.error(`Erro ao buscar feed ${feedKey}: ${response.status}`)
      return []
    }

    const xml = await response.text()

    // Verificar se é XML válido
    if (!xml.includes('<rss') && !xml.includes('<feed')) {
      console.error(`Feed ${feedKey} não retornou XML válido`)
      return []
    }

    const items = parseRSSXML(xml)

    const articles: ScrapedArticle[] = items.map(item => ({
      source: feed.source,
      sourceId: item.link, // URL como ID único
      sourceUrl: item.link,
      authorName: feed.name,
      content: stripHTML(item.title),
      summary: item.description ? stripHTML(item.description).substring(0, 280) : undefined,
      imageUrl: item['media:thumbnail']?.$?.url || item.enclosure?.$?.url,
      publishedAt: new Date(item.pubDate),
    }))

    console.log(`✅ ${feed.name}: ${articles.length} artigos`)
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

  const results = await Promise.allSettled(
    feedKeys.map(key => scrapeRSSFeed(key))
  )

  // Flatten e remover duplicados por sourceId
  const allArticles: ScrapedArticle[] = []
  const uniqueUrls = new Set<string>()

  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const article of result.value) {
        if (!uniqueUrls.has(article.sourceId)) {
          uniqueUrls.add(article.sourceId)
          allArticles.push(article)
        }
      }
    }
  }

  return allArticles
}

/**
 * Scrape Globo/Gazeta Esportiva
 */
export async function scrapeGlobo(): Promise<ScrapedArticle[]> {
  const results = await Promise.allSettled([
    scrapeRSSFeed('gazeta-esportiva'),
    scrapeRSSFeed('trivela'),
  ])

  const articles: ScrapedArticle[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value)
    }
  }
  return articles
}

/**
 * Scrape UOL/ESPN
 */
export async function scrapeUOL(): Promise<ScrapedArticle[]> {
  const results = await Promise.allSettled([
    scrapeRSSFeed('espn-brasil'),
    scrapeRSSFeed('futebol-interior'),
  ])

  const articles: ScrapedArticle[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value)
    }
  }
  return articles
}
