import { ScrapedTweet, TRUSTED_JOURNALISTS } from './types'

// Bearer Token da API do Twitter/X (Basic tier - $100/mês)
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN

// Endpoint da API v2 do Twitter
const TWITTER_API_BASE = 'https://api.twitter.com/2'

// Keywords para busca de transferências
const SEARCH_QUERIES = [
  // Transferências gerais
  '(transferência OR contratação OR reforço) (futebol OR brasileirão) -is:retweet lang:pt',
  '(negocia OR acertou OR fechado) (jogador OR atacante OR meia) -is:retweet lang:pt',
  // Times específicos
  '(Flamengo OR Palmeiras OR Corinthians) (contrata OR negocia OR reforço) -is:retweet lang:pt',
  '(Santos OR São Paulo OR Cruzeiro) (jogador OR transferência) -is:retweet lang:pt',
]

interface TwitterUser {
  id: string
  name: string
  username: string
  profile_image_url?: string
}

interface TwitterTweet {
  id: string
  text: string
  created_at: string
  author_id: string
  public_metrics?: {
    retweet_count: number
    reply_count: number
    like_count: number
    quote_count: number
    impression_count?: number
  }
}

interface TwitterSearchResponse {
  data?: TwitterTweet[]
  includes?: {
    users?: TwitterUser[]
  }
  meta?: {
    result_count: number
    next_token?: string
  }
}

/**
 * Busca tweets usando a API v2 do Twitter (Recent Search)
 * Retorna tweets dos últimos 7 dias
 */
async function searchTweets(query: string, maxResults: number = 50): Promise<ScrapedTweet[]> {
  if (!TWITTER_BEARER_TOKEN) {
    console.error('❌ TWITTER_BEARER_TOKEN não configurado')
    return []
  }

  try {
    const params = new URLSearchParams({
      query,
      max_results: Math.min(maxResults, 100).toString(),
      'tweet.fields': 'created_at,public_metrics,author_id',
      'user.fields': 'name,username,profile_image_url',
      expansions: 'author_id',
    })

    const response = await fetch(`${TWITTER_API_BASE}/tweets/search/recent?${params}`, {
      headers: {
        Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Twitter API error ${response.status}: ${errorText}`)
      return []
    }

    const data: TwitterSearchResponse = await response.json()

    if (!data.data || data.data.length === 0) {
      return []
    }

    // Criar mapa de usuários para lookup rápido
    const usersMap = new Map<string, TwitterUser>()
    if (data.includes?.users) {
      for (const user of data.includes.users) {
        usersMap.set(user.id, user)
      }
    }

    // Converter para ScrapedTweet
    const tweets: ScrapedTweet[] = data.data.map((tweet) => {
      const author = usersMap.get(tweet.author_id)
      return {
        source: 'twitter' as const,
        sourceId: tweet.id,
        sourceUrl: `https://twitter.com/${author?.username || 'i'}/status/${tweet.id}`,
        authorName: author?.name || 'Unknown',
        authorHandle: author ? `@${author.username}` : undefined,
        authorAvatar: author?.profile_image_url,
        content: tweet.text,
        publishedAt: new Date(tweet.created_at),
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        views: tweet.public_metrics?.impression_count,
      }
    })

    console.log(`🐦 Query "${query.substring(0, 30)}...": ${tweets.length} tweets`)
    return tweets
  } catch (error) {
    console.error(`❌ Erro ao buscar tweets:`, error)
    return []
  }
}

/**
 * Busca tweets de um usuário específico
 */
async function getUserTweets(username: string, maxResults: number = 20): Promise<ScrapedTweet[]> {
  const cleanUsername = username.replace('@', '')
  const query = `from:${cleanUsername} -is:retweet`
  return searchTweets(query, maxResults)
}

/**
 * Busca tweets dos jornalistas confiáveis
 */
async function scrapeJournalistsTweets(): Promise<ScrapedTweet[]> {
  const allTweets: ScrapedTweet[] = []
  const seenIds = new Set<string>()

  // Buscar tweets de jornalistas em batches (para não exceder rate limit)
  // API Basic: 50 requests/15min
  const journalistBatches = chunkArray(TRUSTED_JOURNALISTS.slice(0, 15), 5)

  for (const batch of journalistBatches) {
    // Criar uma query combinada para múltiplos usuários
    const fromQuery = batch.map((u) => `from:${u.replace('@', '')}`).join(' OR ')
    const query = `(${fromQuery}) -is:retweet`

    const tweets = await searchTweets(query, 50)
    for (const tweet of tweets) {
      if (!seenIds.has(tweet.sourceId)) {
        seenIds.add(tweet.sourceId)
        allTweets.push(tweet)
      }
    }

    // Delay entre batches para respeitar rate limit
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return allTweets
}

/**
 * Divide array em chunks
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Scrape completo do Twitter usando API oficial
 */
export async function scrapeTwitter(keywords: string[] = []): Promise<ScrapedTweet[]> {
  console.log('🐦 Iniciando scrape do Twitter via API oficial...')

  if (!TWITTER_BEARER_TOKEN) {
    console.log('⚠️ TWITTER_BEARER_TOKEN não configurado, pulando Twitter')
    return []
  }

  const allTweets: ScrapedTweet[] = []
  const seenIds = new Set<string>()

  try {
    // 1. Buscar tweets dos jornalistas
    console.log('🐦 Buscando tweets dos jornalistas...')
    const journalistTweets = await scrapeJournalistsTweets()
    for (const tweet of journalistTweets) {
      if (!seenIds.has(tweet.sourceId)) {
        seenIds.add(tweet.sourceId)
        allTweets.push(tweet)
      }
    }
    console.log(`🐦 ${journalistTweets.length} tweets de jornalistas`)

    // 2. Buscar por queries de transferências
    console.log('🐦 Buscando por queries de transferências...')
    for (const query of SEARCH_QUERIES.slice(0, 3)) {
      const tweets = await searchTweets(query, 30)
      for (const tweet of tweets) {
        if (!seenIds.has(tweet.sourceId)) {
          seenIds.add(tweet.sourceId)
          allTweets.push(tweet)
        }
      }
      // Delay entre queries
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // 3. Buscar por keywords customizadas (se fornecidas)
    if (keywords.length > 0) {
      console.log('🐦 Buscando por keywords customizadas...')
      for (const keyword of keywords.slice(0, 3)) {
        const query = `${keyword} futebol -is:retweet lang:pt`
        const tweets = await searchTweets(query, 20)
        for (const tweet of tweets) {
          if (!seenIds.has(tweet.sourceId)) {
            seenIds.add(tweet.sourceId)
            allTweets.push(tweet)
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    console.log(`🐦 Total: ${allTweets.length} tweets únicos`)
    return allTweets
  } catch (error) {
    console.error('❌ Erro no scrape do Twitter:', error)
    return allTweets // Retorna o que conseguiu coletar
  }
}

// Exportar funções individuais para uso direto
export { searchTweets, getUserTweets, scrapeJournalistsTweets }
