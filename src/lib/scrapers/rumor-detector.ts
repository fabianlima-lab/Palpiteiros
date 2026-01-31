import { prisma } from '@/lib/prisma'
import { TEAMS_ALIASES, PLAYERS_ALIASES } from './types'

// =============================================================================
// MAPA: TIME ATUAL DE CADA JOGADOR (baseado no Transfermarkt Janeiro 2026)
// Isso evita criar rumores falsos de jogador ir para o time que já está
// =============================================================================
const PLAYER_CURRENT_TEAMS: Record<string, string> = {
  // Flamengo
  lucas_paqueta: 'Flamengo',
  samuel_lino: 'Flamengo',
  pedro: 'Flamengo',
  leo_ortiz: 'Flamengo',
  arrascaeta: 'Flamengo',
  vitao: 'Flamengo',
  agustin_rossi: 'Flamengo',
  leo_pereira: 'Flamengo',
  de_la_cruz: 'Flamengo',
  carrascal: 'Flamengo',
  gonzalo_plata: 'Flamengo',
  emerson_royal: 'Flamengo',
  everton: 'Flamengo',
  andrew: 'Flamengo',
  luiz_araujo: 'Flamengo',
  wallace_yan: 'Flamengo',

  // Palmeiras
  vitor_roque: 'Palmeiras',
  flaco_lopez: 'Palmeiras',
  andreas_pereira: 'Palmeiras',
  piquerez: 'Palmeiras',
  paulinho_palmeiras: 'Palmeiras',
  mauricio: 'Palmeiras',
  ramon_sosa: 'Palmeiras',
  agustin_giay: 'Palmeiras',
  raphael_veiga: 'Palmeiras',
  allan_palmeiras: 'Palmeiras',
  emiliano_martinez: 'Palmeiras',
  khellven: 'Palmeiras',
  marlon_freitas: 'Palmeiras',

  // Corinthians
  yuri_alberto: 'Corinthians',
  breno_bidon: 'Corinthians',
  rodrigo_garro: 'Corinthians',
  gui_negao: 'Corinthians',
  memphis: 'Corinthians',
  hugo_souza: 'Corinthians',
  matheuzinho: 'Corinthians',

  // Botafogo
  danilo_botafogo: 'Botafogo',
  alvaro_montoro: 'Botafogo',
  arthur_cabral: 'Botafogo',
  vitinho_botafogo: 'Botafogo',
  artur_botafogo: 'Botafogo',
  matheus_martins: 'Botafogo',
  santiago_rodriguez: 'Botafogo',
  alexander_barboza: 'Botafogo',

  // Cruzeiro
  kaio_jorge: 'Cruzeiro',
  gerson: 'Cruzeiro',
  matheus_pereira: 'Cruzeiro',
  luis_sinisterra: 'Cruzeiro',
  fabricio_bruno: 'Cruzeiro',
  christian: 'Cruzeiro',
  kaiki: 'Cruzeiro',
  keny_arroyo: 'Cruzeiro',
  kaua_prates: 'Cruzeiro',
  gabigol: 'Cruzeiro',

  // Santos
  gabriel_brazao: 'Santos',
  neymar: 'Santos',
  rollheiser: 'Santos',
  barreal: 'Santos',
  gabriel_menino: 'Santos',

  // Fluminense
  martinelli: 'Fluminense',
  hercules: 'Fluminense',
  savarino: 'Fluminense',
  guilherme_arana: 'Fluminense',
  canobbio: 'Fluminense',
  john_kennedy: 'Fluminense',
  riquelme: 'Fluminense',
  facundo_bernal: 'Fluminense',
  cano: 'Fluminense',

  // São Paulo
  marcos_antonio: 'São Paulo',
  ferreirinha: 'São Paulo',
  pablo_maia: 'São Paulo',
  ryan_francisco: 'São Paulo',
  calleri: 'São Paulo',
  luciano: 'São Paulo',

  // Vasco
  matheus_franca: 'Vasco',
  robert_renan: 'Vasco',
  lucas_piton: 'Vasco',
  leo_jardim: 'Vasco',
  carlos_cuesta: 'Vasco',
  paulo_henrique: 'Vasco',
  vegetti: 'Vasco',

  // Atlético-MG
  renan_lodi: 'Atlético-MG',
  mateo_cassierra: 'Atlético-MG',
  alexsander: 'Atlético-MG',
  natanael: 'Atlético-MG',
  tomas_cuello: 'Atlético-MG',
  gustavo_scarpa: 'Atlético-MG',
  hulk: 'Atlético-MG',

  // Bahia
  jean_lucas: 'Bahia',
  erick_pulga: 'Bahia',
  luciano_juba: 'Bahia',
  ramos_mingo: 'Bahia',
  rodrigo_nestor: 'Bahia',
  caio_alexandre: 'Bahia',
  kayky: 'Bahia',

  // Grêmio
  tete: 'Grêmio',

  // Internacional
  bernabei: 'Internacional',

  // Bragantino
  isidro_pitta: 'Bragantino',
  rodriguinho: 'Bragantino',
}

// Palavras-chave que indicam rumor de transferência
const TRANSFER_KEYWORDS = [
  // Negociação
  'negocia', 'negociando', 'negociação', 'negociar', 'negociações',
  'sondagem', 'sondou', 'sonda', 'sondado',
  'interesse', 'interessado', 'interessa',
  'proposta', 'oferta', 'oferece', 'oferecido',
  'conversa', 'conversas', 'conversando',
  'tratativas', 'tratando',
  // Confirmação
  'acerto', 'acertado', 'acertou', 'fechado', 'fechou',
  'assinou', 'assina', 'assinatura', 'assinando',
  'anunciado', 'anuncia', 'anúncio', 'oficial', 'oficializa',
  'contratou', 'contrata', 'contratação', 'contratado',
  'reforço', 'reforçar', 'reforçou',
  'confirmado', 'confirma',
  // Movimento
  'chega', 'chegou', 'chegando', 'chegada',
  'deixa', 'deixou', 'saída', 'sai', 'saindo',
  'empréstimo', 'emprestar', 'emprestado', 'emprestimo',
  'volta', 'voltar', 'retorno', 'retorna',
  'transferência', 'transferir', 'transferido',
  'vendido', 'venda', 'vender',
  'liberado', 'libera', 'liberação',
  // Especulação
  'pode', 'deve', 'vai', 'quer', 'deseja',
  'alvo', 'mira', 'busca', 'buscando',
  'pedido', 'pede', 'exige',
  'multa', 'valores', 'milhões', 'euros', 'dólares',
  'mercado', 'janela',
  'destino', 'rumo',
  // Verbos específicos
  'trocar', 'troca',
  'renovar', 'renovação', 'renovou',
]

// Palavras que indicam que NÃO é rumor
const NEGATIVE_KEYWORDS = [
  'resultado', 'placar', 'gol', 'gols',
  'vitória', 'derrota', 'empate',
  'campeonato', 'rodada', 'tabela',
  'escalação', 'relacionados',
  'lesão', 'lesionado', 'machucado',
  'suspenso', 'suspensão',
  'técnico demitido', 'treinador demitido',
]

interface DetectedRumor {
  playerName: string
  toTeam: string
  fromTeam?: string
  title: string
  confidence: number
  sourceUrl: string
  sourceContent: string
}

/**
 * Normaliza texto para comparação
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Encontra times mencionados no texto
 */
function findTeams(text: string): string[] {
  const normalizedText = normalize(text)
  const foundTeams: string[] = []

  for (const [teamId, aliases] of Object.entries(TEAMS_ALIASES)) {
    for (const alias of aliases) {
      if (normalizedText.includes(normalize(alias))) {
        // Converter teamId para nome bonito
        const teamName = teamId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace('Sao Paulo', 'São Paulo')
          .replace('Atletico Mg', 'Atlético-MG')
          .replace('Gremio', 'Grêmio')

        if (!foundTeams.includes(teamName)) {
          foundTeams.push(teamName)
        }
        break
      }
    }
  }

  return foundTeams
}

interface FoundPlayer {
  id: string        // ID interno (ex: "lucas_paqueta")
  name: string      // Nome bonito (ex: "Lucas Paquetá")
  currentTeam?: string  // Time atual se conhecido
}

/**
 * Encontra jogadores mencionados no texto
 * Retorna informações completas incluindo time atual
 */
function findPlayers(text: string): FoundPlayer[] {
  const normalizedText = normalize(text)
  const foundPlayers: FoundPlayer[] = []
  const foundIds = new Set<string>()

  for (const [playerId, aliases] of Object.entries(PLAYERS_ALIASES)) {
    for (const alias of aliases) {
      if (normalizedText.includes(normalize(alias))) {
        if (!foundIds.has(playerId)) {
          foundIds.add(playerId)

          // Converter ID para nome bonito
          // "lucas_paqueta" -> "Lucas Paquetá"
          let playerName = aliases[0] // Usar o primeiro alias como nome principal
          playerName = playerName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

          foundPlayers.push({
            id: playerId,
            name: playerName,
            currentTeam: PLAYER_CURRENT_TEAMS[playerId],
          })
        }
        break
      }
    }
  }

  return foundPlayers.slice(0, 3) // Max 3 jogadores
}

/**
 * Calcula score de confiança que é um rumor de transferência
 */
function calculateConfidence(text: string): number {
  const normalizedText = normalize(text)
  let score = 0

  // Pontos positivos por keywords de transferência
  for (const keyword of TRANSFER_KEYWORDS) {
    if (normalizedText.includes(normalize(keyword))) {
      score += 0.1
    }
  }

  // Pontos negativos por keywords que indicam não ser rumor
  for (const keyword of NEGATIVE_KEYWORDS) {
    if (normalizedText.includes(normalize(keyword))) {
      score -= 0.15
    }
  }

  // Bonus se menciona valores/milhões
  if (normalizedText.match(/\d+\s*(milh|mi\b|m\b)/)) {
    score += 0.2
  }

  // Bonus se tem padrão "JOGADOR + TIME"
  if (normalizedText.match(/no\s+(flamengo|palmeiras|corinthians|santos|são paulo|botafogo|fluminense|vasco|atlético|cruzeiro|internacional|grêmio)/)) {
    score += 0.15
  }

  return Math.max(0, Math.min(1, score))
}

/**
 * Normaliza nome de time para comparação
 */
function normalizeTeamName(team: string): string {
  return normalize(team)
    .replace('atletico mg', 'atletico-mg')
    .replace('sao paulo', 'sao-paulo')
}

/**
 * Verifica se dois nomes de time são o mesmo
 */
function isSameTeam(team1: string, team2: string): boolean {
  const t1 = normalizeTeamName(team1)
  const t2 = normalizeTeamName(team2)

  // Verifica se um está contido no outro ou se são iguais
  return t1 === t2 ||
    t1.includes(t2) ||
    t2.includes(t1) ||
    // Casos especiais
    (t1.includes('gremio') && t2.includes('gremio')) ||
    (t1.includes('inter') && t2.includes('inter')) ||
    (t1.includes('atletico') && t2.includes('atletico'))
}

/**
 * Extrai possíveis rumores de uma notícia
 */
function extractRumorsFromNews(
  content: string,
  sourceUrl: string
): DetectedRumor[] {
  const rumors: DetectedRumor[] = []

  const confidence = calculateConfidence(content)

  // Threshold para evitar falsos positivos
  // Só considera se confiança >= 0.35
  if (confidence < 0.35) {
    return []
  }

  const players = findPlayers(content)
  const teams = findTeams(content)

  // Precisa ter pelo menos 1 jogador e 1 time
  if (players.length === 0 || teams.length === 0) {
    return []
  }

  // Criar rumor para cada combinação válida jogador + time
  for (const player of players) {
    // Tentar encontrar o time de DESTINO (diferente do atual)
    let toTeam: string | null = null
    let fromTeam: string | undefined = undefined

    for (const team of teams) {
      // Se sabemos o time atual do jogador
      if (player.currentTeam) {
        if (isSameTeam(team, player.currentTeam)) {
          // Este time é o atual, usar como fromTeam
          fromTeam = player.currentTeam
        } else {
          // Time diferente, pode ser destino
          if (!toTeam) {
            toTeam = team
          }
        }
      } else {
        // Não sabemos o time atual, usar primeiro time como destino
        if (!toTeam) {
          toTeam = team
        } else if (!fromTeam) {
          fromTeam = team
        }
      }
    }

    // VALIDAÇÃO CRÍTICA: Pular se não temos um time de destino válido
    if (!toTeam) {
      console.log(`⏭️ Ignorando ${player.name}: mencionado apenas com time atual (${player.currentTeam})`)
      continue
    }

    // VALIDAÇÃO: Não criar rumor se destino = origem
    if (fromTeam && isSameTeam(toTeam, fromTeam)) {
      console.log(`⏭️ Ignorando ${player.name}: destino igual à origem`)
      continue
    }

    // VALIDAÇÃO: Se sabemos o time atual, usar ele como fromTeam
    if (player.currentTeam && !fromTeam) {
      fromTeam = player.currentTeam
    }

    // Gerar título com nome bonito
    const playerName = player.name
    let title = ''

    if (content.toLowerCase().includes('acerto') || content.toLowerCase().includes('fechado')) {
      title = `${playerName} acertado com ${toTeam}`
    } else if (content.toLowerCase().includes('negocia')) {
      title = `${toTeam} negocia com ${playerName}`
    } else if (content.toLowerCase().includes('interesse')) {
      title = `${toTeam} tem interesse em ${playerName}`
    } else if (content.toLowerCase().includes('proposta')) {
      title = `${toTeam} faz proposta por ${playerName}`
    } else if (content.toLowerCase().includes('sondagem') || content.toLowerCase().includes('sonda')) {
      title = `${toTeam} sonda ${playerName}`
    } else {
      title = `${playerName} pode ir para o ${toTeam}`
    }

    rumors.push({
      playerName,
      toTeam,
      fromTeam,
      title,
      confidence,
      sourceUrl,
      sourceContent: content.substring(0, 500),
    })
  }

  return rumors
}

/**
 * Processa notícias e cria/atualiza rumores automaticamente
 */
export async function processNewsAndCreateRumors(): Promise<{
  created: number
  updated: number
  skipped: number
}> {
  const stats = { created: 0, updated: 0, skipped: 0 }

  try {
    // Buscar notícias recentes não processadas (últimas 24h)
    const recentNews = await prisma.newsItem.findMany({
      where: {
        scrapedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: 100,
    })

    console.log(`🔍 Analisando ${recentNews.length} notícias recentes...`)

    const detectedRumors: DetectedRumor[] = []

    // Extrair rumores de cada notícia
    for (const news of recentNews) {
      const rumors = extractRumorsFromNews(news.content, news.sourceUrl)
      detectedRumors.push(...rumors)
    }

    console.log(`📊 ${detectedRumors.length} possíveis rumores detectados`)

    // Agrupar por jogador+time para evitar duplicados
    const uniqueRumors = new Map<string, DetectedRumor>()

    for (const rumor of detectedRumors) {
      const key = `${normalize(rumor.playerName)}-${normalize(rumor.toTeam)}`
      const existing = uniqueRumors.get(key)

      // Manter o de maior confiança
      if (!existing || rumor.confidence > existing.confidence) {
        uniqueRumors.set(key, rumor)
      }
    }

    console.log(`📊 ${uniqueRumors.size} rumores únicos após deduplicação`)

    // Criar/atualizar rumores no banco
    for (const rumor of uniqueRumors.values()) {
      // Só criar se confiança >= 0.4
      if (rumor.confidence < 0.4) {
        console.log(`⏭️ Baixa confiança (${rumor.confidence.toFixed(2)}): ${rumor.title}`)
        stats.skipped++
        continue
      }

      try {
        // Verificar se já existe rumor similar
        const existingRumor = await prisma.rumor.findFirst({
          where: {
            playerName: {
              contains: rumor.playerName.split(' ')[0], // Primeiro nome
              mode: 'insensitive',
            },
            toTeam: {
              contains: rumor.toTeam.split(' ')[0],
              mode: 'insensitive',
            },
            status: 'open',
          },
        })

        if (existingRumor) {
          // Atualizar signalScore se notícia nova
          await prisma.rumor.update({
            where: { id: existingRumor.id },
            data: {
              signalScore: Math.min((existingRumor.signalScore || 0) + 0.05, 1),
              lastScraped: new Date(),
            },
          })
          stats.updated++
          console.log(`📝 Atualizado: ${existingRumor.title}`)
        } else {
          // Criar novo rumor (fecha em 30 dias por padrão)
          const closesAt = new Date()
          closesAt.setDate(closesAt.getDate() + 30)

          await prisma.rumor.create({
            data: {
              playerName: rumor.playerName,
              toTeam: rumor.toTeam,
              fromTeam: rumor.fromTeam,
              title: rumor.title,
              category: 'transferencia',
              sentiment: 0.5, // Começa neutro
              signalScore: rumor.confidence,
              status: 'open',
              closesAt,
            },
          })
          stats.created++
          console.log(`✅ Criado: ${rumor.title}`)
        }
      } catch (error) {
        console.error(`Erro ao processar rumor ${rumor.title}:`, error)
        stats.skipped++
      }
    }

    return stats
  } catch (error) {
    console.error('Erro ao processar notícias:', error)
    return stats
  }
}

/**
 * Atualiza status de rumores baseado em notícias
 * (detecta se foi confirmado ou desmentido)
 */
export async function updateRumorStatus(): Promise<number> {
  let updated = 0

  try {
    const openRumors = await prisma.rumor.findMany({
      where: { status: 'open' },
    })

    for (const rumor of openRumors) {
      // Buscar notícias recentes relacionadas
      const relatedNews = await prisma.rumorNewsItem.findMany({
        where: {
          rumorId: rumor.id,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        include: { newsItem: true },
      })

      for (const { newsItem } of relatedNews) {
        const content = normalize(newsItem.content)

        // Detectar confirmação
        if (
          content.includes('oficial') ||
          content.includes('anunciado') ||
          content.includes('fechado') ||
          content.includes('assinou')
        ) {
          await prisma.rumor.update({
            where: { id: rumor.id },
            data: {
              status: 'confirmed',
              sentiment: 1.0,
            },
          })
          updated++
          console.log(`✅ Confirmado: ${rumor.title}`)
          break
        }

        // Detectar desmentido
        if (
          content.includes('desmente') ||
          content.includes('nega') ||
          content.includes('nao vai acontecer') ||
          content.includes('esfriou') ||
          content.includes('frustrada')
        ) {
          await prisma.rumor.update({
            where: { id: rumor.id },
            data: {
              status: 'denied',
              sentiment: 0.0,
            },
          })
          updated++
          console.log(`❌ Desmentido: ${rumor.title}`)
          break
        }
      }
    }

    return updated
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
    return updated
  }
}
