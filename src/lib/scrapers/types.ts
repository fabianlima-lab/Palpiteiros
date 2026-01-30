// Tipos para o sistema de agregação de notícias

export type NewsSource = 'twitter' | 'youtube' | 'globo' | 'uol'

export interface ScrapedItem {
  source: NewsSource
  sourceId: string
  sourceUrl: string
  authorName?: string
  authorHandle?: string
  authorAvatar?: string
  content: string
  summary?: string
  imageUrl?: string
  publishedAt: Date
  likes?: number
  retweets?: number
  views?: number
}

export interface ScrapedTweet extends ScrapedItem {
  source: 'twitter'
  likes: number
  retweets: number
}

export interface ScrapedVideo extends ScrapedItem {
  source: 'youtube'
  views: number
  thumbnail: string
}

export interface ScrapedArticle extends ScrapedItem {
  source: 'globo' | 'uol'
}

export interface ExtractedEntities {
  players: string[]
  teams: string[]
}

export interface RumorMatch {
  rumorId: string
  relevance: number
}

export interface ScraperConfig {
  keywords: string[]
  maxResults: number
}

export interface TwitterScraperConfig extends ScraperConfig {
  accounts: string[]
}

export interface YouTubeScraperConfig extends ScraperConfig {
  channels: string[]
}

// Lista de times brasileiros com variações
export const TEAMS_ALIASES: Record<string, string[]> = {
  flamengo: ['flamengo', 'mengão', 'mengao', 'fla', 'crf', 'rubro-negro', 'urubu'],
  corinthians: ['corinthians', 'timão', 'timao', 'sccp', 'coringão', 'coringao'],
  palmeiras: ['palmeiras', 'verdão', 'verdao', 'sep', 'porco', 'alviverde'],
  santos: ['santos', 'peixe', 'sfc', 'alvinegro praiano'],
  'sao-paulo': ['são paulo', 'sao paulo', 'spfc', 'tricolor', 'soberano'],
  botafogo: ['botafogo', 'bota', 'fogão', 'fogao', 'bfr', 'glorioso'],
  fluminense: ['fluminense', 'flu', 'tricolor das laranjeiras', 'ffc'],
  vasco: ['vasco', 'vascão', 'vascao', 'crvg', 'gigante da colina'],
  'atletico-mg': ['atlético-mg', 'atletico-mg', 'galo', 'cam', 'atlético mineiro'],
  cruzeiro: ['cruzeiro', 'raposa', 'cabuloso', 'cec'],
  internacional: ['internacional', 'inter', 'colorado', 'sci'],
  gremio: ['grêmio', 'gremio', 'tricolor gaúcho', 'imortal', 'fbpa'],
}

// Lista de jogadores com apelidos (expandir conforme necessário)
export const PLAYERS_ALIASES: Record<string, string[]> = {
  neymar: ['neymar', 'ney', 'menino ney', 'neymar jr', 'njr'],
  gabigol: ['gabigol', 'gabriel barbosa', 'gabi'],
  endrick: ['endrick', 'endrick felipe'],
  vinicius: ['vinicius jr', 'vini jr', 'vinicius junior'],
  rodrygo: ['rodrygo', 'rodrygo goes'],
  casemiro: ['casemiro', 'case'],
  paqueta: ['paquetá', 'paqueta', 'lucas paquetá'],
  richarlison: ['richarlison', 'pombo', 'richy'],
  raphinha: ['raphinha', 'raphael dias'],
  antony: ['antony', 'antony santos'],
}

// Jornalistas confiáveis para scraping
export const TRUSTED_JOURNALISTS = [
  '@venecasagrande',
  '@jorgenicola',
  '@mauriciosavarese',
  '@FabrizioRomano',
  '@geglobo',
  '@TNTSportsBR',
]

// Canais do YouTube confiáveis
export const TRUSTED_YOUTUBE_CHANNELS = [
  'UCIsbLox_y9dCIMLd8tdC6qg', // ESPN Brasil
  'UC3ZKSW5a_VyXYmTnRcYoEyQ', // Globo Esporte
  'UCl3sI6fAG_1t7VYJcU7Bwmg', // TNT Sports
]
