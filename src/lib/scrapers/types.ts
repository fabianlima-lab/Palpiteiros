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
  'sao-paulo': ['são paulo', 'sao paulo', 'spfc', 'tricolor paulista', 'soberano'],
  botafogo: ['botafogo', 'bota', 'fogão', 'fogao', 'bfr', 'glorioso'],
  fluminense: ['fluminense', 'flu', 'tricolor das laranjeiras', 'ffc'],
  vasco: ['vasco', 'vascão', 'vascao', 'crvg', 'gigante da colina'],
  'atletico-mg': ['atlético-mg', 'atletico-mg', 'galo', 'cam', 'atlético mineiro', 'atletico mineiro'],
  cruzeiro: ['cruzeiro', 'raposa', 'cabuloso', 'cec'],
  internacional: ['internacional', 'inter', 'colorado', 'sci'],
  gremio: ['grêmio', 'gremio', 'tricolor gaúcho', 'imortal', 'fbpa'],
  bahia: ['bahia', 'tricolor baiano', 'ecb', 'esquadrão'],
  bragantino: ['bragantino', 'rb bragantino', 'red bull bragantino', 'massa bruta'],
  fortaleza: ['fortaleza', 'leão', 'fortaleza ec'],
  athletico: ['athletico', 'athletico-pr', 'furacão', 'cap'],
}

// =============================================================================
// JOGADORES - DADOS DO TRANSFERMARKT (Janeiro 2026)
// Fonte: https://www.transfermarkt.com.br/campeonato-brasileiro-serie-a/marktwerte
// =============================================================================

export const PLAYERS_ALIASES: Record<string, string[]> = {
  // =========================================================================
  // TOP 25 MAIS VALIOSOS DO BRASILEIRÃO (€10M+)
  // =========================================================================

  // #1 - Lucas Paquetá - €35M - Flamengo
  lucas_paqueta: ['lucas paquetá', 'lucas paqueta', 'paquetá', 'paqueta'],

  // #2 - Vitor Roque - €35M - Palmeiras
  vitor_roque: ['vitor roque', 'vítor roque', 'roque'],

  // #3 - Danilo - €22M - Botafogo
  danilo_botafogo: ['danilo', 'danilo volante'],

  // #4 - Kaio Jorge - €22M - Cruzeiro
  kaio_jorge: ['kaio jorge'],

  // #5 - Yuri Alberto - €22M - Corinthians
  yuri_alberto: ['yuri alberto', 'yuri'],

  // #6 - Samuel Lino - €20M - Flamengo
  samuel_lino: ['samuel lino', 'lino'],

  // #7 - José Manuel López - €20M - Palmeiras (Flaco López)
  flaco_lopez: ['josé manuel lópez', 'jose manuel lopez', 'flaco lópez', 'flaco lopez', 'lópez', 'lopez palmeiras'],

  // #8 - Pedro - €18M - Flamengo
  pedro: ['pedro', 'pedro flamengo', 'pedro guilherme'],

  // #9 - Gerson - €18M - Cruzeiro
  gerson: ['gerson', 'gerson cruzeiro', 'gerson santos'],

  // #10 - Léo Ortiz - €15M - Flamengo
  leo_ortiz: ['léo ortiz', 'leo ortiz'],

  // #11 - Andreas Pereira - €15M - Palmeiras
  andreas_pereira: ['andreas pereira', 'andreas'],

  // #12 - Arrascaeta - €15M - Flamengo
  arrascaeta: ['arrascaeta', 'arrasca', 'de arrascaeta', 'giorgian de arrascaeta'],

  // #13 - Martinelli - €14M - Fluminense
  martinelli: ['martinelli', 'martinelli volante', 'martinelli flu'],

  // #14 - Piquerez - €14M - Palmeiras
  piquerez: ['piquerez', 'joaquín piquerez', 'joaquin piquerez'],

  // #15 - Breno Bidon - €14M - Corinthians
  breno_bidon: ['breno bidon', 'bidon'],

  // #16 - Matheus Pereira - €14M - Cruzeiro
  matheus_pereira: ['matheus pereira'],

  // #17 - Renan Lodi - €12M - Atlético-MG
  renan_lodi: ['renan lodi', 'lodi'],

  // #18 - Luis Sinisterra - €12M - Cruzeiro
  luis_sinisterra: ['luis sinisterra', 'sinisterra'],

  // #19 - Hércules - €12M - Fluminense
  hercules: ['hércules', 'hercules'],

  // #20 - Fabrício Bruno - €12M - Cruzeiro
  fabricio_bruno: ['fabrício bruno', 'fabricio bruno'],

  // #21 - Rodrigo Garro - €12M - Corinthians
  rodrigo_garro: ['rodrigo garro', 'garro'],

  // #22 - Paulinho - €12M - Palmeiras
  paulinho_palmeiras: ['paulinho', 'paulinho palmeiras'],

  // #23 - Maurício - €12M - Palmeiras
  mauricio: ['maurício', 'mauricio', 'mauricio palmeiras'],

  // #24 - Jean Lucas - €12M - Bahia
  jean_lucas: ['jean lucas'],

  // #25 - Erick Pulga - €11M - Bahia
  erick_pulga: ['erick pulga', 'pulga'],

  // =========================================================================
  // JOGADORES €9M - €11M
  // =========================================================================

  // Gabriel Brazão - €11M - Santos
  gabriel_brazao: ['gabriel brazão', 'gabriel brazao', 'brazão', 'brazao'],

  // Ramón Sosa - €11M - Palmeiras
  ramon_sosa: ['ramón sosa', 'ramon sosa', 'sosa'],

  // Agustín Giay - €11M - Palmeiras
  agustin_giay: ['agustín giay', 'agustin giay', 'giay'],

  // Luciano Juba - €11M - Bahia
  luciano_juba: ['luciano juba', 'juba'],

  // Santiago Ramos Mingo - €11M - Bahia
  ramos_mingo: ['santiago ramos mingo', 'ramos mingo', 'mingo'],

  // Tetê - €11M - Grêmio
  tete: ['tetê', 'tete'],

  // Christian - €10M - Cruzeiro
  christian: ['christian', 'christian cruzeiro'],

  // Álvaro Montoro - €10M - Botafogo
  alvaro_montoro: ['álvaro montoro', 'alvaro montoro', 'montoro'],

  // Vitão - €10M - Flamengo
  vitao: ['vitão', 'vitao'],

  // Agustín Rossi - €10M - Flamengo
  agustin_rossi: ['agustín rossi', 'agustin rossi', 'rossi'],

  // Raphael Veiga - €10M - Palmeiras
  raphael_veiga: ['raphael veiga', 'veiga'],

  // Léo Pereira - €10M - Flamengo
  leo_pereira: ['léo pereira', 'leo pereira'],

  // Neymar - €10M - Santos
  neymar: ['neymar', 'neymar jr', 'ney', 'menino ney', 'njr'],

  // Allan - €10M - Palmeiras
  allan_palmeiras: ['allan', 'allan palmeiras'],

  // Hugo Souza - €10M - Corinthians
  hugo_souza: ['hugo souza', 'hugo', 'neneca'],

  // Kaiki - €10M - Cruzeiro
  kaiki: ['kaiki', 'kaiki cruzeiro'],

  // Keny Arroyo - €9M - Cruzeiro
  keny_arroyo: ['keny arroyo', 'arroyo'],

  // Arthur Cabral - €9M - Botafogo
  arthur_cabral: ['arthur cabral', 'cabral'],

  // Mateo Cassierra - €9M - Atlético-MG
  mateo_cassierra: ['mateo cassierra', 'cassierra'],

  // Matheus França - €9M - Vasco
  matheus_franca: ['matheus frança', 'matheus franca'],

  // Robert Renan - €9M - Vasco
  robert_renan: ['robert renan'],

  // Nicolás de la Cruz - €9M - Flamengo
  de_la_cruz: ['nicolás de la cruz', 'nicolas de la cruz', 'de la cruz'],

  // Jorge Carrascal - €9M - Flamengo
  carrascal: ['jorge carrascal', 'carrascal'],

  // Emiliano Martínez - €9M - Palmeiras
  emiliano_martinez: ['emiliano martínez', 'emiliano martinez'],

  // Jefferson Savarino - €9M - Fluminense
  savarino: ['jefferson savarino', 'savarino'],

  // Marcos Antônio - €9M - São Paulo
  marcos_antonio: ['marcos antônio', 'marcos antonio'],

  // =========================================================================
  // JOGADORES €6M - €8M
  // =========================================================================

  // Vitinho - €8M - Botafogo
  vitinho_botafogo: ['vitinho', 'vitinho botafogo'],

  // Gui Negão - €8M - Corinthians
  gui_negao: ['gui negão', 'gui negao'],

  // Memphis Depay - €8M - Corinthians
  memphis: ['memphis depay', 'memphis', 'depay'],

  // Gonzalo Plata - €8M - Flamengo
  gonzalo_plata: ['gonzalo plata', 'plata'],

  // Emerson Royal - €8M - Flamengo
  emerson_royal: ['emerson royal', 'emerson'],

  // Isidro Pitta - €7.5M - Bragantino
  isidro_pitta: ['isidro pitta', 'pitta'],

  // Artur - €7M - Botafogo
  artur_botafogo: ['artur', 'artur botafogo'],

  // Rodrigo Nestor - €7M - Bahia
  rodrigo_nestor: ['rodrigo nestor', 'nestor'],

  // Everton Cebolinha - €7M - Flamengo
  everton: ['everton', 'everton cebolinha', 'cebolinha'],

  // Guilherme Arana - €7M - Fluminense
  guilherme_arana: ['guilherme arana', 'arana'],

  // Benjamín Rollheiser - €7M - Santos
  rollheiser: ['benjamín rollheiser', 'benjamin rollheiser', 'rollheiser'],

  // Andrew - €7M - Flamengo
  andrew: ['andrew', 'andrew goleiro'],

  // Álvaro Barreal - €7M - Santos
  barreal: ['álvaro barreal', 'alvaro barreal', 'barreal'],

  // Ferreirinha - €7M - São Paulo
  ferreirinha: ['ferreirinha'],

  // Pablo Maia - €7M - São Paulo
  pablo_maia: ['pablo maia', 'maia'],

  // Lucas Piton - €7M - Vasco
  lucas_piton: ['lucas piton', 'piton'],

  // Léo Jardim - €7M - Vasco
  leo_jardim: ['léo jardim', 'leo jardim'],

  // Carlos Cuesta - €7M - Vasco
  carlos_cuesta: ['carlos cuesta', 'cuesta'],

  // Luiz Araújo - €7M - Flamengo
  luiz_araujo: ['luiz araújo', 'luiz araujo'],

  // Caio Alexandre - €7M - Bahia
  caio_alexandre: ['caio alexandre'],

  // Ryan Francisco - €6M - São Paulo
  ryan_francisco: ['ryan francisco', 'ryan são paulo'],

  // Alexandro Bernabei - €6M - Internacional
  bernabei: ['alexandro bernabei', 'bernabei'],

  // Kauã Prates - €6M - Cruzeiro
  kaua_prates: ['kauã prates', 'kaua prates', 'prates'],

  // Wallace Yan - €6M - Flamengo
  wallace_yan: ['wallace yan', 'wallace'],

  // Khellven - €6M - Palmeiras
  khellven: ['khellven'],

  // Matheus Martins - €6M - Botafogo
  matheus_martins: ['matheus martins'],

  // Rodriguinho - €6M - Bragantino
  rodriguinho: ['rodriguinho'],

  // Agustín Canobbio - €6M - Fluminense
  canobbio: ['agustín canobbio', 'agustin canobbio', 'canobbio'],

  // Alexsander - €6M - Atlético-MG
  alexsander: ['alexsander'],

  // Marlon Freitas - €6M - Palmeiras
  marlon_freitas: ['marlon freitas', 'marlon'],

  // Kayky - €6M - Bahia
  kayky: ['kayky'],

  // Natanael - €6M - Atlético-MG
  natanael: ['natanael'],

  // Matheuzinho - €6M - Corinthians
  matheuzinho: ['matheuzinho'],

  // Gabriel Menino - €6M - Santos
  gabriel_menino: ['gabriel menino', 'menino'],

  // John Kennedy - €6M - Fluminense
  john_kennedy: ['john kennedy'],

  // Tomás Cuello - €6M - Atlético-MG
  tomas_cuello: ['tomás cuello', 'tomas cuello', 'cuello'],

  // Riquelme - €6M - Fluminense
  riquelme: ['riquelme'],

  // Paulo Henrique - €6M - Vasco
  paulo_henrique: ['paulo henrique'],

  // Facundo Bernal - €6M - Fluminense
  facundo_bernal: ['facundo bernal', 'bernal'],

  // Gustavo Scarpa - €6M - Atlético-MG
  gustavo_scarpa: ['gustavo scarpa', 'scarpa'],

  // Santiago Rodríguez - €5.5M - Botafogo
  santiago_rodriguez: ['santiago rodríguez', 'santiago rodriguez'],

  // Alexander Barboza - €5M - Botafogo
  alexander_barboza: ['alexander barboza', 'barboza'],

  // =========================================================================
  // JOGADORES NOTÁVEIS ADICIONAIS
  // =========================================================================

  // Calleri - São Paulo
  calleri: ['calleri', 'jonathan calleri'],

  // Luciano - São Paulo
  luciano: ['luciano', 'luciano são paulo'],

  // Hulk - Atlético-MG
  hulk: ['hulk', 'givanildo vieira'],

  // Cano - Fluminense
  cano: ['cano', 'germán cano', 'german cano'],

  // Vegetti - Vasco
  vegetti: ['vegetti', 'pablo vegetti'],

  // Gabigol - Cruzeiro
  gabigol: ['gabigol', 'gabriel barbosa', 'gabi'],
}

// Jornalistas e contas confiáveis para scraping
export const TRUSTED_JOURNALISTS = [
  // === JORNALISTAS DE TRANSFERÊNCIAS ===
  '@venecasagrande',      // Vene Casagrande - especialista em mercado
  '@jorgenicola',          // Jorge Nicola - mercado da bola
  '@FabrizioRomano',       // Fabrizio Romano - transferências internacionais
  '@gavaborba',            // Gabriel Boraschi - mercado Corinthians/SP
  '@andaborba',            // André Hernan - Band/CNN
  '@marcelo_hazan',        // Marcelo Hazan - SporTV
  '@Pasjornalista',        // PAS - jornalista esportivo

  // === PORTAIS E VEÍCULOS ===
  '@geglobo',              // GE Globo
  '@TNTSportsBR',          // TNT Sports Brasil
  '@ESPNBrasil',           // ESPN Brasil
  '@UOLEsporte',           // UOL Esporte
  '@Lancenet',             // Lance!
  '@CentralDoMercado',     // Central do Mercado
  '@FutTransferNews',      // Transferências

  // === CLUBES GRANDES (notícias oficiais) ===
  '@Flamengo',             // Flamengo oficial
  '@Palmeiras',            // Palmeiras oficial
  '@Corinthians',          // Corinthians oficial
  '@SaoPauloFC',           // São Paulo FC oficial
  '@SantosFC',             // Santos FC oficial
  '@Cruzeiro',             // Cruzeiro oficial
  '@Atletico',             // Atlético-MG oficial
  '@Gaborrecria',          // Grêmio oficial

  // === INFLUENCIADORES/ANÁLISE ===
  '@fredbruno',            // Fred Bruno - Desimpedidos
  '@Pilhado',              // Pilhado - comentarista
  '@benjaminback',         // Benjamin Back - Fox Sports
  '@CazeTVOficial',        // Cazé TV
]

// Canais do YouTube confiáveis
export const TRUSTED_YOUTUBE_CHANNELS = [
  // === CANAIS OFICIAIS ===
  'UCIsbLox_y9dCIMLd8tdC6qg', // ESPN Brasil
  'UC3ZKSW5a_VyXYmTnRcYoEyQ', // Globo Esporte
  'UCl3sI6fAG_1t7VYJcU7Bwmg', // TNT Sports Brasil
  'UCqkPNlBsOu-ljGzlczM6g9A', // Cazé TV
  'UCFmw7EczVDSYhFYpCmRkzxg', // Fred Bruno / Desimpedidos

  // === ANÁLISE E DEBATE ===
  'UCEG8ClYShs6O8gEgVNXDYMg', // Pilhado
  'UC0k51gqP0nc5-S1Gp6w__Mg', // Resenha ESPN
  'UCH4ixJlR_7I_9hL8N4wvRlw', // Camisa 21
  'UCIc2cq0IZT2y-pI3MmJmKAQ', // Donos da Bola Band
  'UCwQb0M3A_rgtD5Y_W4f6BqQ', // SBT Sports
  'UCoBNF_tPMCnv5r8NKBD7kYw', // Benjamin Back
  'UCm4_8HjT14zUWbKmQ1I0JnQ', // Casimiro
]
