import { ScrapedVideo, TRUSTED_YOUTUBE_CHANNELS } from './types'

// Canais do YouTube de esportes brasileiros (expandido)
const YOUTUBE_CHANNELS = [
  // === CANAIS OFICIAIS ===
  { id: 'UCIsbLox_y9dCIMLd8tdC6qg', name: 'ESPN Brasil' },
  { id: 'UC3ZKSW5a_VyXYmTnRcYoEyQ', name: 'Globo Esporte' },
  { id: 'UCl3sI6fAG_1t7VYJcU7Bwmg', name: 'TNT Sports Brasil' },
  { id: 'UCqkPNlBsOu-ljGzlczM6g9A', name: 'Cazé TV' },
  { id: 'UCFmw7EczVDSYhFYpCmRkzxg', name: 'Fred Bruno / Desimpedidos' },

  // === ANÁLISE E DEBATE ===
  { id: 'UCEG8ClYShs6O8gEgVNXDYMg', name: 'Pilhado' },
  { id: 'UC0k51gqP0nc5-S1Gp6w__Mg', name: 'Resenha ESPN' },
  { id: 'UCH4ixJlR_7I_9hL8N4wvRlw', name: 'Camisa 21' },
  { id: 'UCIc2cq0IZT2y-pI3MmJmKAQ', name: 'Donos da Bola Band' },
  { id: 'UCwQb0M3A_rgtD5Y_W4f6BqQ', name: 'SBT Sports' },
  { id: 'UCoBNF_tPMCnv5r8NKBD7kYw', name: 'Benjamin Back' },
  { id: 'UCm4_8HjT14zUWbKmQ1I0JnQ', name: 'Casimiro' },

  // === CANAIS DE TIMES (notícias e análises) ===
  { id: 'UC9_wWxqj-1vI0r3-mJBP2wA', name: 'Flamengo' },
  { id: 'UCVqL0pPG_vPNJDBvECOSLYg', name: 'Palmeiras' },
  { id: 'UCmRK-h6lJzr3iEXjLqvJPQg', name: 'Corinthians' },
  { id: 'UCJGgX5d9q58mzMjLj91ECPA', name: 'São Paulo FC' },
]

/**
 * YouTube disponibiliza RSS público para cada canal
 * Não precisa de API key!
 */
const getChannelRSSUrl = (channelId: string) =>
  `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`

/**
 * Parse RSS do YouTube
 */
function parseYouTubeRSS(xml: string, channelName: string): ScrapedVideo[] {
  const videos: ScrapedVideo[] = []

  // Regex para extrair entries
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi
  let entryMatch

  while ((entryMatch = entryRegex.exec(xml)) !== null) {
    const entryContent = entryMatch[1]

    try {
      // Extrair video ID
      const videoIdMatch = entryContent.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)
      if (!videoIdMatch) continue
      const videoId = videoIdMatch[1]

      // Extrair título
      const titleMatch = entryContent.match(/<title>([^<]+)<\/title>/)
      if (!titleMatch) continue
      const title = titleMatch[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")

      // Extrair data de publicação
      const publishedMatch = entryContent.match(/<published>([^<]+)<\/published>/)
      const publishedAt = publishedMatch ? new Date(publishedMatch[1]) : new Date()

      // Extrair autor/canal
      const authorMatch = entryContent.match(/<author>\s*<name>([^<]+)<\/name>/)
      const authorName = authorMatch ? authorMatch[1] : channelName

      // Extrair channel ID
      const channelIdMatch = entryContent.match(/<yt:channelId>([^<]+)<\/yt:channelId>/)
      const channelId = channelIdMatch ? channelIdMatch[1] : ''

      // Extrair views (se disponível)
      const viewsMatch = entryContent.match(/<media:statistics views="(\d+)"/)
      const views = viewsMatch ? parseInt(viewsMatch[1], 10) : 0

      // Extrair descrição
      const descMatch = entryContent.match(/<media:description>([^<]*)<\/media:description>/)
      const description = descMatch ? descMatch[1].substring(0, 280) : undefined

      // Thumbnail (formato padrão do YouTube)
      const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

      videos.push({
        source: 'youtube',
        sourceId: videoId,
        sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
        authorName,
        authorHandle: channelId,
        content: title,
        summary: description,
        imageUrl: thumbnail,
        thumbnail,
        publishedAt,
        views,
      })
    } catch (error) {
      console.error('Erro ao parsear vídeo do YouTube:', error)
      continue
    }
  }

  return videos
}

/**
 * Scrape vídeos de um canal específico via RSS
 */
export async function scrapeChannelVideos(
  channelId: string,
  channelName: string
): Promise<ScrapedVideo[]> {
  try {
    const rssUrl = getChannelRSSUrl(channelId)

    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Palpiteiro/1.0 RSS Reader',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    if (!response.ok) {
      console.error(`Erro ao buscar canal ${channelName}: ${response.status}`)
      return []
    }

    const xml = await response.text()
    return parseYouTubeRSS(xml, channelName)
  } catch (error) {
    console.error(`Erro ao fazer scrape do canal ${channelName}:`, error)
    return []
  }
}

/**
 * Scrape vídeos de todos os canais configurados
 */
export async function scrapeAllYouTubeChannels(): Promise<ScrapedVideo[]> {
  const allVideos: ScrapedVideo[] = []
  const seenIds = new Set<string>()

  // Scrape em paralelo
  const results = await Promise.all(
    YOUTUBE_CHANNELS.map(channel =>
      scrapeChannelVideos(channel.id, channel.name)
    )
  )

  // Flatten e remover duplicados
  for (const videos of results) {
    for (const video of videos) {
      if (!seenIds.has(video.sourceId)) {
        seenIds.add(video.sourceId)
        allVideos.push(video)
      }
    }
  }

  return allVideos
}

/**
 * Busca vídeos no YouTube por keyword via scraping da página de busca
 * (alternativa sem API)
 */
export async function scrapeYouTubeSearch(keyword: string): Promise<ScrapedVideo[]> {
  try {
    const encodedKeyword = encodeURIComponent(keyword)
    const searchUrl = `https://www.youtube.com/results?search_query=${encodedKeyword}&sp=CAI%253D` // Ordenado por data

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      console.error(`Erro ao buscar YouTube: ${response.status}`)
      return []
    }

    const html = await response.text()
    const videos: ScrapedVideo[] = []

    // Extrair dados do JSON embutido na página
    const jsonMatch = html.match(/var ytInitialData = ({.*?});/)
    if (!jsonMatch) {
      console.log('YouTube: não foi possível extrair dados JSON')
      return []
    }

    try {
      const data = JSON.parse(jsonMatch[1])

      // Navegar na estrutura do JSON do YouTube
      const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents
        ?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || []

      for (const item of contents.slice(0, 15)) {
        const videoRenderer = item.videoRenderer
        if (!videoRenderer) continue

        const videoId = videoRenderer.videoId
        if (!videoId) continue

        const title = videoRenderer.title?.runs?.[0]?.text || ''
        const channelName = videoRenderer.ownerText?.runs?.[0]?.text || 'Unknown'
        const viewCountText = videoRenderer.viewCountText?.simpleText || '0'
        const views = parseInt(viewCountText.replace(/[^\d]/g, ''), 10) || 0

        // Data aproximada baseada no texto "há X dias"
        const publishedText = videoRenderer.publishedTimeText?.simpleText || ''
        const publishedAt = parseRelativeDate(publishedText)

        videos.push({
          source: 'youtube',
          sourceId: videoId,
          sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
          authorName: channelName,
          content: title,
          imageUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          publishedAt,
          views,
        })
      }
    } catch (parseError) {
      console.error('Erro ao parsear JSON do YouTube:', parseError)
    }

    return videos
  } catch (error) {
    console.error(`Erro ao buscar YouTube para ${keyword}:`, error)
    return []
  }
}

/**
 * Converte texto relativo de data para Date
 * Ex: "há 2 dias", "há 3 horas", "há 1 semana"
 */
function parseRelativeDate(text: string): Date {
  const now = new Date()

  if (!text) return now

  const lowerText = text.toLowerCase()

  // Padrões em português
  const hoursMatch = lowerText.match(/(\d+)\s*(hora|horas|hour|hours)/)
  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1], 10)
    return new Date(now.getTime() - hours * 60 * 60 * 1000)
  }

  const daysMatch = lowerText.match(/(\d+)\s*(dia|dias|day|days)/)
  if (daysMatch) {
    const days = parseInt(daysMatch[1], 10)
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  }

  const weeksMatch = lowerText.match(/(\d+)\s*(semana|semanas|week|weeks)/)
  if (weeksMatch) {
    const weeks = parseInt(weeksMatch[1], 10)
    return new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000)
  }

  const monthsMatch = lowerText.match(/(\d+)\s*(m[eê]s|meses|month|months)/)
  if (monthsMatch) {
    const months = parseInt(monthsMatch[1], 10)
    return new Date(now.getTime() - months * 30 * 24 * 60 * 60 * 1000)
  }

  return now
}

// Keywords padrão para busca de transferências
const TRANSFER_KEYWORDS = [
  'transferência futebol brasileiro',
  'reforço 2026',
  'contratação brasileirão',
  'mercado da bola',
  'negociação futebol',
  'jogador pode sair',
]

/**
 * Scrape completo do YouTube: canais + keywords
 */
export async function scrapeYouTube(keywords: string[] = []): Promise<ScrapedVideo[]> {
  const allVideos: ScrapedVideo[] = []
  const seenIds = new Set<string>()

  // 1. Buscar vídeos dos canais configurados
  console.log('▶️ Buscando vídeos dos canais...')
  const channelVideos = await scrapeAllYouTubeChannels()

  for (const video of channelVideos) {
    if (!seenIds.has(video.sourceId)) {
      seenIds.add(video.sourceId)
      allVideos.push(video)
    }
  }
  console.log(`▶️ ${channelVideos.length} vídeos dos canais`)

  // 2. Buscar por keywords de transferências + keywords customizadas
  const allKeywords = [...TRANSFER_KEYWORDS, ...keywords]
  const topKeywords = allKeywords.slice(0, 6) // Aumentado de 3 para 6

  for (const keyword of topKeywords) {
    console.log(`▶️ Buscando vídeos para: ${keyword}`)
    const searchVideos = await scrapeYouTubeSearch(keyword)

    for (const video of searchVideos) {
      if (!seenIds.has(video.sourceId)) {
        seenIds.add(video.sourceId)
        allVideos.push(video)
      }
    }
  }

  console.log(`▶️ Total: ${allVideos.length} vídeos únicos`)
  return allVideos
}
