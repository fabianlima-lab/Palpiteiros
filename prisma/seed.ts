import { PrismaClient, EmojiReacao, CategoriaRumor, StatusRumor } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpar dados existentes (ordem importa por FK)
  await prisma.tweetRumor.deleteMany()
  await prisma.fonteRumor.deleteMany()
  await prisma.reacao.deleteMany()
  await prisma.rumorNewsItem.deleteMany()
  await prisma.rumorSignal.deleteMany()
  await prisma.newsItem.deleteMany()
  await prisma.signal.deleteMany()
  await prisma.prediction.deleteMany()
  await prisma.socialPost.deleteMany()
  await prisma.rumor.deleteMany()
  await prisma.jornalista.deleteMany()
  await prisma.influencer.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Dados limpos')

  // Criar badges
  const badges = await Promise.all([
    prisma.badge.create({ data: { name: 'Novato', description: 'Fez seu primeiro palpite', emoji: '🎯' } }),
    prisma.badge.create({ data: { name: 'Vidente', description: 'Acertou 10 palpites', emoji: '🔮' } }),
    prisma.badge.create({ data: { name: 'Mestre dos Rumores', description: 'Acertou 50 palpites', emoji: '👑' } }),
    prisma.badge.create({ data: { name: 'Flamenguista', description: 'Torcedor do Mengão', emoji: '🔴⚫' } }),
    prisma.badge.create({ data: { name: 'Premium', description: 'Assinante premium', emoji: '⭐' } }),
  ])
  console.log('🏅 Badges criados')

  // Criar usuários
  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Torcedor Demo', username: 'torcedor_demo', team: 'Flamengo', points: 1430, level: 5, isPremium: false } }),
    prisma.user.create({ data: { name: 'Maria Silva', username: 'maria_fla', team: 'Flamengo', points: 980, level: 4, isPremium: true } }),
    prisma.user.create({ data: { name: 'João Santos', username: 'joao_peixe', team: 'Santos', points: 1250, level: 5, isPremium: false } }),
    prisma.user.create({ data: { name: 'Pedro Corinthiano', username: 'pedrao_sccp', team: 'Corinthians', points: 890, level: 3, isPremium: false } }),
    prisma.user.create({ data: { name: 'Ana Palmeirense', username: 'ana_verdao', team: 'Palmeiras', points: 1100, level: 4, isPremium: true } }),
  ])
  console.log('👥 Usuários criados')

  // Criar influenciadores (jornalistas reais do futebol brasileiro)
  const vene = await prisma.influencer.create({
    data: {
      name: 'Venê Casagrande', username: 'venaborges', outlet: 'O Globo / SporTV',
      bio: 'Jornalista esportivo com mais de 15 anos cobrindo futebol brasileiro.',
      trustScore: 0.92, totalHits: 87, totalMisses: 12, followers: 520000, twitter: '@venaborges',
    },
  })
  const raisa = await prisma.influencer.create({
    data: {
      name: 'Raisa Simplicio', username: 'rfraisinha', outlet: 'TNT Sports',
      bio: 'Setorista do Flamengo e comentarista.',
      trustScore: 0.88, totalHits: 65, totalMisses: 15, followers: 380000, twitter: '@rfraisinha',
    },
  })
  const bechler = await prisma.influencer.create({
    data: {
      name: 'Marcelo Bechler', username: 'marcelobechler', outlet: 'ESPN Brasil',
      bio: 'Especialista em transferências internacionais.',
      trustScore: 0.95, totalHits: 112, totalMisses: 8, followers: 890000, twitter: '@marcelobechler',
    },
  })
  const nicola = await prisma.influencer.create({
    data: {
      name: 'Jorge Nicola', username: 'jorgenicola', outlet: 'Yahoo Esportes',
      bio: 'Jornalista de mercado da bola.',
      trustScore: 0.78, totalHits: 56, totalMisses: 22, followers: 420000, twitter: '@jorgenicola',
    },
  })
  const flazoeiro = await prisma.influencer.create({
    data: {
      name: 'Flazoeiro', username: 'flazoeiro', outlet: 'Canal Flazoeiro',
      bio: 'Maior canal de notícias do Flamengo no YouTube.',
      trustScore: 0.72, totalHits: 45, totalMisses: 25, followers: 1200000, twitter: '@flazoeiro',
    },
  })
  const mauro = await prisma.influencer.create({
    data: {
      name: 'Mauro Cezar', username: 'maurocezar', outlet: 'UOL / Jovem Pan',
      bio: 'Comentarista esportivo e jornalista.',
      trustScore: 0.82, totalHits: 68, totalMisses: 18, followers: 750000, twitter: '@maurocezar',
    },
  })
  console.log('📰 Influenciadores criados')

  // =====================================
  // PRD v3: JORNALISTAS (nova tabela)
  // Credibilidade inicial por seguidores + seed manual
  // =====================================
  const jornalistas = await Promise.all([
    prisma.jornalista.create({
      data: {
        nome: 'Fabrizio Romano',
        handle: '@FabrizioRomano',
        veiculo: 'The Guardian / Sky Sports',
        seguidores: 20000000,
        credibilidade: 85,
        totalPrevisoes: 160,
        acertos: 147,
      },
    }),
    prisma.jornalista.create({
      data: {
        nome: 'Venê Casagrande',
        handle: '@venaborges',
        veiculo: 'O Globo / SporTV',
        seguidores: 520000,
        credibilidade: 80,
        totalPrevisoes: 114,
        acertos: 98,
      },
    }),
    prisma.jornalista.create({
      data: {
        nome: 'Bruno Andrade',
        handle: '@brunoandrd',
        veiculo: 'UOL Esporte',
        seguidores: 380000,
        credibilidade: 78,
        totalPrevisoes: 89,
        acertos: 72,
      },
    }),
    prisma.jornalista.create({
      data: {
        nome: 'André Hernan',
        handle: '@andrehernan',
        veiculo: 'UOL / Jovem Pan',
        seguidores: 420000,
        credibilidade: 76,
        totalPrevisoes: 95,
        acertos: 74,
      },
    }),
    prisma.jornalista.create({
      data: {
        nome: 'Jorge Nicola',
        handle: '@joraborges',
        veiculo: 'Yahoo Esportes',
        seguidores: 420000,
        credibilidade: 68,
        totalPrevisoes: 78,
        acertos: 56,
      },
    }),
    prisma.jornalista.create({
      data: {
        nome: 'Paulo Vinícius Coelho',
        handle: '@paborges',
        veiculo: 'ESPN Brasil',
        seguidores: 650000,
        credibilidade: 66,
        totalPrevisoes: 82,
        acertos: 58,
      },
    }),
    prisma.jornalista.create({
      data: {
        nome: 'Mauro Cezar Pereira',
        handle: '@maurocezar',
        veiculo: 'UOL / Jovem Pan',
        seguidores: 750000,
        credibilidade: 64,
        totalPrevisoes: 86,
        acertos: 68,
      },
    }),
    prisma.jornalista.create({
      data: {
        nome: 'Marcelo Bechler',
        handle: '@marcelobechler',
        veiculo: 'ESPN Brasil',
        seguidores: 890000,
        credibilidade: 82,
        totalPrevisoes: 120,
        acertos: 112,
      },
    }),
    prisma.jornalista.create({
      data: {
        nome: 'Raisa Simplicio',
        handle: '@rfraisinha',
        veiculo: 'TNT Sports',
        seguidores: 380000,
        credibilidade: 75,
        totalPrevisoes: 80,
        acertos: 65,
      },
    }),
    prisma.jornalista.create({
      data: {
        nome: 'Sávio Dota',
        handle: '@saviodota',
        veiculo: 'Flazoeiro',
        seguidores: 1200000,
        credibilidade: 58,
        totalPrevisoes: 70,
        acertos: 45,
      },
    }),
  ])
  console.log(`📰 ${jornalistas.length} jornalistas PRD v3 criados`)

  // =====================================
  // RUMORES - Janeiro/Fevereiro 2026
  // Foco em rumores ATUAIS e RELEVANTES
  // Prioridade para Flamengo (time do usuário)
  // =====================================

  const rumors = await Promise.all([
    // ===== FLAMENGO (5 rumores - maior prioridade) =====
    prisma.rumor.create({
      data: {
        playerName: 'Claudinho',
        fromTeam: 'Zenit',
        toTeam: 'Flamengo',
        title: 'Claudinho volta ao Brasil pelo Flamengo?',
        description: 'Meia do Zenit estaria em conversas avançadas com o Rubro-Negro para retorno ao futebol brasileiro.',
        contexto: 'Claudinho não vem tendo muito espaço no Zenit e sinalizou desejo de voltar ao Brasil.',
        categoria: CategoriaRumor.REFORCO,
        statusRumor: StatusRumor.ABERTO,
        category: 'transferencia',
        probabilidade: 58,
        probTrend: 'subindo',
        confianca: 'media',
        sentiment: 0.65,
        status: 'open',
        signalScore: 0.72,
        closesAt: new Date('2026-02-15'),
      },
    }),
    prisma.rumor.create({
      data: {
        playerName: 'Flamengo',
        fromTeam: null,
        toTeam: 'Flamengo',
        title: 'Flamengo vence a Supercopa 2026?',
        description: 'Rubro-negro enfrenta o Botafogo na decisão da Supercopa do Brasil dia 9 de fevereiro.',
        contexto: 'Fla e Botafogo se enfrentam na final. Flamengo é favorito mas rival está forte.',
        categoria: CategoriaRumor.PREMIO, // Usando PREMIO para títulos
        statusRumor: StatusRumor.ABERTO,
        category: 'titulo',
        probabilidade: 52,
        probTrend: 'estavel',
        confianca: 'baixa',
        sentiment: 0.58,
        status: 'open',
        signalScore: 0.55,
        closesAt: new Date('2026-02-09'),
      },
    }),
    prisma.rumor.create({
      data: {
        playerName: 'Filipe Luís',
        fromTeam: null,
        toTeam: 'Flamengo',
        title: 'Filipe Luís permanece no Flamengo em 2026?',
        description: 'Técnico teria sido sondado por clubes europeus mas deve seguir no comando do Mengão.',
        contexto: 'Filipe assumiu e conquistou títulos. Torcida apoia, diretoria quer renovar.',
        categoria: CategoriaRumor.COMISSAO,
        statusRumor: StatusRumor.ABERTO,
        category: 'tecnico',
        probabilidade: 85,
        probTrend: 'estavel',
        confianca: 'alta',
        sentiment: 0.82,
        status: 'open',
        signalScore: 0.85,
        closesAt: new Date('2026-03-01'),
      },
    }),
    prisma.rumor.create({
      data: {
        playerName: 'Dudu',
        fromTeam: 'Palmeiras',
        toTeam: 'Flamengo',
        title: 'Dudu troca o Palmeiras pelo Flamengo?',
        description: 'Atacante estaria insatisfeito no Verdão e Flamengo monitora situação.',
        contexto: 'Rivalidade histórica entre os clubes dificulta negociação.',
        categoria: CategoriaRumor.REFORCO,
        statusRumor: StatusRumor.ABERTO,
        category: 'transferencia',
        probabilidade: 15,
        probTrend: 'caindo',
        confianca: 'media',
        sentiment: 0.32,
        status: 'open',
        signalScore: 0.25,
        closesAt: new Date('2026-07-01'),
      },
    }),
    prisma.rumor.create({
      data: {
        playerName: 'Gerson',
        fromTeam: 'Marseille',
        toTeam: 'Flamengo',
        title: 'Gerson volta ao Flamengo em 2026?',
        description: 'Coringa da torcida pode retornar ao clube após passagem na França.',
        contexto: 'Torcida sonha com retorno do ídolo. Salário na Europa é obstáculo.',
        categoria: CategoriaRumor.REFORCO,
        statusRumor: StatusRumor.ABERTO,
        category: 'transferencia',
        probabilidade: 28,
        probTrend: 'estavel',
        confianca: 'baixa',
        sentiment: 0.45,
        status: 'open',
        signalScore: 0.38,
        closesAt: new Date('2026-06-30'),
      },
    }),

    // ===== PALMEIRAS =====
    prisma.rumor.create({
      data: {
        playerName: 'Vitor Roque',
        fromTeam: 'Barcelona',
        toTeam: 'Palmeiras',
        title: 'Vitor Roque retorna ao Palmeiras?',
        description: 'Atacante não se firmou no Barcelona e pode voltar ao Verdão por empréstimo.',
        contexto: 'Barça avalia liberar jovem brasileiro. Palmeiras tem prioridade de compra.',
        categoria: CategoriaRumor.REFORCO,
        statusRumor: StatusRumor.ABERTO,
        category: 'transferencia',
        probabilidade: 35,
        probTrend: 'subindo',
        confianca: 'media',
        sentiment: 0.45,
        status: 'open',
        signalScore: 0.38,
        closesAt: new Date('2026-02-28'),
      },
    }),
    prisma.rumor.create({
      data: {
        playerName: 'Palmeiras',
        fromTeam: null,
        toTeam: 'Palmeiras',
        title: 'Palmeiras é tricampeão brasileiro em 2026?',
        description: 'Verdão busca o terceiro título consecutivo do Brasileirão.',
        contexto: 'Abel Ferreira renovado e elenco forte. Competição equilibrada.',
        categoria: CategoriaRumor.PREMIO,
        statusRumor: StatusRumor.ABERTO,
        category: 'titulo',
        probabilidade: 45,
        probTrend: 'estavel',
        confianca: 'baixa',
        sentiment: 0.52,
        status: 'open',
        signalScore: 0.48,
        closesAt: new Date('2026-12-08'),
      },
    }),

    // ===== CORINTHIANS =====
    prisma.rumor.create({
      data: {
        playerName: 'Memphis Depay',
        fromTeam: 'Corinthians',
        toTeam: 'Europa',
        title: 'Memphis Depay deixa o Corinthians no meio do ano?',
        description: 'Holandês pode retornar à Europa se receber proposta após o Mundial de Clubes.',
        contexto: 'Contrato de Memphis permite saída. Clubes europeus monitoram.',
        categoria: CategoriaRumor.SAIDA,
        statusRumor: StatusRumor.ABERTO,
        category: 'transferencia',
        probabilidade: 42,
        probTrend: 'estavel',
        confianca: 'media',
        sentiment: 0.42,
        status: 'open',
        signalScore: 0.35,
        closesAt: new Date('2026-07-15'),
      },
    }),
    prisma.rumor.create({
      data: {
        playerName: 'Breno Bidon',
        fromTeam: 'Corinthians',
        toTeam: 'Seleção Brasileira',
        title: 'Breno Bidon será convocado para a Copa do Mundo?',
        description: 'Jovem volante do Corinthians impressiona e entra no radar de Dorival Jr.',
        contexto: 'Bidon se destacou no Timão. Precisa manter nível até convocação.',
        categoria: CategoriaRumor.SELECAO,
        statusRumor: StatusRumor.ABERTO,
        category: 'selecao',
        probabilidade: 32,
        probTrend: 'subindo',
        confianca: 'baixa',
        sentiment: 0.38,
        status: 'open',
        signalScore: 0.32,
        closesAt: new Date('2026-05-15'),
      },
    }),

    // ===== SANTOS =====
    prisma.rumor.create({
      data: {
        playerName: 'Neymar',
        fromTeam: 'Santos',
        toTeam: 'Seleção Brasileira',
        title: 'Neymar joga a Copa do Mundo 2026?',
        description: 'Craque está de volta ao Santos e busca recuperar forma física para o Mundial nos EUA.',
        contexto: 'Neymar treina no Santos focado na Copa. Histórico de lesões preocupa.',
        categoria: CategoriaRumor.SELECAO,
        statusRumor: StatusRumor.ABERTO,
        category: 'selecao',
        probabilidade: 62,
        probTrend: 'subindo',
        confianca: 'media',
        sentiment: 0.68,
        status: 'open',
        signalScore: 0.62,
        closesAt: new Date('2026-06-01'),
      },
    }),
    prisma.rumor.create({
      data: {
        playerName: 'Gabigol',
        fromTeam: 'Cruzeiro',
        toTeam: 'Santos',
        title: 'Gabigol troca o Cruzeiro pelo Santos?',
        description: 'Atacante pode voltar ao clube que o revelou se não emplacar em MG.',
        contexto: 'Gabigol não está bem no Cruzeiro. Santos é clube do coração.',
        categoria: CategoriaRumor.REFORCO,
        statusRumor: StatusRumor.ABERTO,
        category: 'transferencia',
        probabilidade: 18,
        probTrend: 'caindo',
        confianca: 'baixa',
        sentiment: 0.28,
        status: 'open',
        signalScore: 0.22,
        closesAt: new Date('2026-07-31'),
      },
    }),

    // ===== BOTAFOGO =====
    prisma.rumor.create({
      data: {
        playerName: 'Arthur Cabral',
        fromTeam: 'Benfica',
        toTeam: 'Botafogo',
        title: 'Arthur Cabral é reforço do Botafogo?',
        description: 'Atacante brasileiro pode retornar ao país para reforçar o atual campeão.',
        contexto: 'Botafogo busca centro-avante. Cabral tem mercado na Europa também.',
        categoria: CategoriaRumor.REFORCO,
        statusRumor: StatusRumor.ABERTO,
        category: 'transferencia',
        probabilidade: 48,
        probTrend: 'estavel',
        confianca: 'media',
        sentiment: 0.55,
        status: 'open',
        signalScore: 0.48,
        closesAt: new Date('2026-02-20'),
      },
    }),

    // ===== SÃO PAULO =====
    prisma.rumor.create({
      data: {
        playerName: 'Lucas Moura',
        fromTeam: 'São Paulo',
        toTeam: 'Aposentadoria',
        title: 'Lucas Moura se aposenta em 2026?',
        description: 'Ídolo tricolor pode encerrar a carreira no clube do coração.',
        contexto: 'Lucas já sinalizou que quer parar no SPFC. Torcida dividida.',
        categoria: CategoriaRumor.SAIDA,
        statusRumor: StatusRumor.ABERTO,
        category: 'transferencia',
        probabilidade: 55,
        probTrend: 'estavel',
        confianca: 'media',
        sentiment: 0.48,
        status: 'open',
        signalScore: 0.42,
        closesAt: new Date('2026-12-31'),
      },
    }),

    // ===== CRUZEIRO =====
    prisma.rumor.create({
      data: {
        playerName: 'Gabigol',
        fromTeam: 'Cruzeiro',
        toTeam: 'Cruzeiro',
        title: 'Gabigol recupera o bom futebol no Cruzeiro?',
        description: 'Atacante contratado como grande reforço ainda não correspondeu às expectativas.',
        contexto: 'Gabigol chegou com muita expectativa. Pressão aumenta a cada jogo.',
        categoria: CategoriaRumor.RENOVACAO, // Usando RENOVACAO para "permanece"
        statusRumor: StatusRumor.ABERTO,
        category: 'transferencia',
        probabilidade: 35,
        probTrend: 'caindo',
        confianca: 'baixa',
        sentiment: 0.35,
        status: 'open',
        signalScore: 0.28,
        closesAt: new Date('2026-06-30'),
      },
    }),
  ])
  console.log(`⚽ ${rumors.length} rumores criados`)

  // Criar sinais dos influenciadores
  await prisma.signal.createMany({
    data: [
      // Claudinho no Flamengo (índice 0)
      { rumorId: rumors[0].id, influencerId: vene.id, signal: 'favoravel', confidence: 0.85, reasoning: 'Conversas avançadas, falta acerto salarial.', source: 'O Globo' },
      { rumorId: rumors[0].id, influencerId: raisa.id, signal: 'favoravel', confidence: 0.78, reasoning: 'Flamengo vê Claudinho como prioridade para o meio.', source: 'TNT Sports' },
      { rumorId: rumors[0].id, influencerId: flazoeiro.id, signal: 'favoravel', confidence: 0.70, reasoning: 'Torcida aprova e diretoria trabalha forte.', source: 'YouTube' },

      // Supercopa Flamengo (índice 1)
      { rumorId: rumors[1].id, influencerId: mauro.id, signal: 'favoravel', confidence: 0.60, reasoning: 'Flamengo favorito mas Botafogo vem forte.', source: 'UOL' },
      { rumorId: rumors[1].id, influencerId: flazoeiro.id, signal: 'favoravel', confidence: 0.75, reasoning: 'Elenco confiante e focado no título.', source: 'YouTube' },

      // Filipe Luís permanece (índice 2)
      { rumorId: rumors[2].id, influencerId: raisa.id, signal: 'favoravel', confidence: 0.92, reasoning: 'Técnico já declarou que quer ficar.', source: 'TNT Sports' },
      { rumorId: rumors[2].id, influencerId: vene.id, signal: 'favoravel', confidence: 0.88, reasoning: 'Diretoria não cogita mudança.', source: 'O Globo' },

      // Dudu pro Flamengo (índice 3)
      { rumorId: rumors[3].id, influencerId: nicola.id, signal: 'desfavoravel', confidence: 0.72, reasoning: 'Palmeiras não libera, salário alto.', source: 'Yahoo' },
      { rumorId: rumors[3].id, influencerId: mauro.id, signal: 'desfavoravel', confidence: 0.68, reasoning: 'Rivalidade dificulta muito a negociação.', source: 'UOL' },

      // Gerson volta (índice 4)
      { rumorId: rumors[4].id, influencerId: vene.id, signal: 'neutro', confidence: 0.55, reasoning: 'Flamengo monitora mas não há proposta formal.', source: 'O Globo' },

      // Vitor Roque (índice 5)
      { rumorId: rumors[5].id, influencerId: bechler.id, signal: 'neutro', confidence: 0.55, reasoning: 'Barcelona avalia empréstimo mas há outros interessados.', source: 'ESPN' },

      // Palmeiras tricampeão (índice 6)
      { rumorId: rumors[6].id, influencerId: mauro.id, signal: 'neutro', confidence: 0.50, reasoning: 'Competição muito equilibrada para cravar.', source: 'UOL' },

      // Memphis sai (índice 7)
      { rumorId: rumors[7].id, influencerId: nicola.id, signal: 'favoravel', confidence: 0.62, reasoning: 'Clubes europeus monitoram situação.', source: 'Yahoo' },

      // Breno Bidon Copa (índice 8)
      { rumorId: rumors[8].id, influencerId: vene.id, signal: 'favoravel', confidence: 0.45, reasoning: 'No radar mas precisa manter nível.', source: 'O Globo' },

      // Neymar Copa (índice 9)
      { rumorId: rumors[9].id, influencerId: bechler.id, signal: 'favoravel', confidence: 0.75, reasoning: 'Dorival conta com Neymar se estiver bem fisicamente.', source: 'ESPN' },
      { rumorId: rumors[9].id, influencerId: vene.id, signal: 'favoravel', confidence: 0.68, reasoning: 'Neymar focado em chegar 100% na Copa.', source: 'O Globo' },
      { rumorId: rumors[9].id, influencerId: nicola.id, signal: 'desfavoravel', confidence: 0.55, reasoning: 'Histórico de lesões preocupa.', source: 'Yahoo' },

      // Gabigol Santos (índice 10)
      { rumorId: rumors[10].id, influencerId: nicola.id, signal: 'neutro', confidence: 0.40, reasoning: 'Depende do desempenho no Cruzeiro.', source: 'Yahoo' },

      // Arthur Cabral Botafogo (índice 11)
      { rumorId: rumors[11].id, influencerId: vene.id, signal: 'favoravel', confidence: 0.70, reasoning: 'Negociação em andamento.', source: 'O Globo' },

      // Lucas aposentadoria (índice 12)
      { rumorId: rumors[12].id, influencerId: mauro.id, signal: 'favoravel', confidence: 0.58, reasoning: 'Lucas já falou em encerrar no SP.', source: 'UOL' },

      // Gabigol no Cruzeiro (índice 13)
      { rumorId: rumors[13].id, influencerId: nicola.id, signal: 'desfavoravel', confidence: 0.65, reasoning: 'Momento ruim, precisa reagir.', source: 'Yahoo' },
    ],
  })
  console.log('📊 Sinais dos influenciadores criados')

  // Criar predictions com sentimentos variados
  const predictionData: { rumorId: string; userId: string; prediction: boolean }[] = []

  // Claudinho no Flamengo - 72% favorável
  for (let i = 0; i < 18; i++) predictionData.push({ rumorId: rumors[0].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 7; i++) predictionData.push({ rumorId: rumors[0].id, userId: users[(i + 2) % 5].id, prediction: false })

  // Supercopa Flamengo - 58% favorável
  for (let i = 0; i < 14; i++) predictionData.push({ rumorId: rumors[1].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 10; i++) predictionData.push({ rumorId: rumors[1].id, userId: users[(i + 1) % 5].id, prediction: false })

  // Filipe Luís permanece - 85% favorável
  for (let i = 0; i < 17; i++) predictionData.push({ rumorId: rumors[2].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 3; i++) predictionData.push({ rumorId: rumors[2].id, userId: users[(i + 3) % 5].id, prediction: false })

  // Dudu pro Flamengo - 25% favorável
  for (let i = 0; i < 6; i++) predictionData.push({ rumorId: rumors[3].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 18; i++) predictionData.push({ rumorId: rumors[3].id, userId: users[(i + 1) % 5].id, prediction: false })

  // Gerson volta - 45% favorável
  for (let i = 0; i < 9; i++) predictionData.push({ rumorId: rumors[4].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 11; i++) predictionData.push({ rumorId: rumors[4].id, userId: users[(i + 2) % 5].id, prediction: false })

  // Vitor Roque - 45% favorável
  for (let i = 0; i < 9; i++) predictionData.push({ rumorId: rumors[5].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 11; i++) predictionData.push({ rumorId: rumors[5].id, userId: users[(i + 1) % 5].id, prediction: false })

  // Palmeiras tricampeão - 52% favorável
  for (let i = 0; i < 13; i++) predictionData.push({ rumorId: rumors[6].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 12; i++) predictionData.push({ rumorId: rumors[6].id, userId: users[(i + 2) % 5].id, prediction: false })

  // Memphis sai - 42% favorável
  for (let i = 0; i < 10; i++) predictionData.push({ rumorId: rumors[7].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 14; i++) predictionData.push({ rumorId: rumors[7].id, userId: users[(i + 3) % 5].id, prediction: false })

  // Breno Bidon Copa - 38% favorável
  for (let i = 0; i < 8; i++) predictionData.push({ rumorId: rumors[8].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 13; i++) predictionData.push({ rumorId: rumors[8].id, userId: users[(i + 1) % 5].id, prediction: false })

  // Neymar Copa - 68% favorável
  for (let i = 0; i < 17; i++) predictionData.push({ rumorId: rumors[9].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 8; i++) predictionData.push({ rumorId: rumors[9].id, userId: users[(i + 2) % 5].id, prediction: false })

  // Gabigol Santos - 28% favorável
  for (let i = 0; i < 7; i++) predictionData.push({ rumorId: rumors[10].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 18; i++) predictionData.push({ rumorId: rumors[10].id, userId: users[(i + 1) % 5].id, prediction: false })

  // Arthur Cabral - 55% favorável
  for (let i = 0; i < 11; i++) predictionData.push({ rumorId: rumors[11].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 9; i++) predictionData.push({ rumorId: rumors[11].id, userId: users[(i + 2) % 5].id, prediction: false })

  // Lucas aposentadoria - 48% favorável
  for (let i = 0; i < 12; i++) predictionData.push({ rumorId: rumors[12].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 13; i++) predictionData.push({ rumorId: rumors[12].id, userId: users[(i + 1) % 5].id, prediction: false })

  // Gabigol Cruzeiro - 35% favorável
  for (let i = 0; i < 7; i++) predictionData.push({ rumorId: rumors[13].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 13; i++) predictionData.push({ rumorId: rumors[13].id, userId: users[(i + 3) % 5].id, prediction: false })

  // Deduplicate predictions
  const uniquePredictions = new Map<string, (typeof predictionData)[0]>()
  predictionData.forEach((p) => {
    const key = `${p.rumorId}-${p.userId}`
    if (!uniquePredictions.has(key)) {
      uniquePredictions.set(key, p)
    }
  })

  await prisma.prediction.createMany({ data: Array.from(uniquePredictions.values()) })
  console.log(`🎯 ${uniquePredictions.size} predictions criadas`)

  // Criar notícias relacionadas (simulando dados scrapeados)
  const newsItems = await Promise.all([
    prisma.newsItem.create({
      data: {
        source: 'globo',
        sourceId: 'globo-claudinho-fla-001',
        sourceUrl: 'https://ge.globo.com/futebol/times/flamengo/',
        authorName: 'Globo Esporte',
        authorHandle: '@geglobo',
        content: 'Flamengo avança em negociação com Claudinho, do Zenit. Meia brasileiro pode ser anunciado nos próximos dias.',
        summary: 'Flamengo negocia com Claudinho',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 1250,
        retweets: 320,
      },
    }),
    prisma.newsItem.create({
      data: {
        source: 'uol',
        sourceId: 'uol-supercopa-001',
        sourceUrl: 'https://www.uol.com.br/esporte/futebol/',
        authorName: 'UOL Esporte',
        authorHandle: '@uolesporte',
        content: 'Supercopa 2026: Flamengo e Botafogo se enfrentam dia 9 de fevereiro na decisão do primeiro título do ano.',
        summary: 'Supercopa Flamengo x Botafogo',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 890,
        retweets: 215,
      },
    }),
    prisma.newsItem.create({
      data: {
        source: 'twitter',
        sourceId: 'tw-vene-neymar-001',
        sourceUrl: 'https://twitter.com/venaborges/status/123456789',
        authorName: 'Venê Casagrande',
        authorHandle: '@venaborges',
        authorAvatar: 'https://pbs.twimg.com/profile_images/vene.jpg',
        content: 'Neymar treinou normalmente ontem no CT Rei Pelé. Staff do Santos está otimista com evolução física do craque. Copa do Mundo 2026 é o grande objetivo.',
        summary: 'Neymar treina bem no Santos',
        publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likes: 4500,
        retweets: 1200,
      },
    }),
    prisma.newsItem.create({
      data: {
        source: 'twitter',
        sourceId: 'tw-raisa-filipe-001',
        sourceUrl: 'https://twitter.com/rfraisinha/status/987654321',
        authorName: 'Raisa Simplicio',
        authorHandle: '@rfraisinha',
        authorAvatar: 'https://pbs.twimg.com/profile_images/raisa.jpg',
        content: 'Filipe Luís em entrevista: "Meu foco é o Flamengo. Estou muito feliz aqui e quero conquistar títulos importantes em 2026."',
        summary: 'Filipe Luís quer ficar no Flamengo',
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likes: 3200,
        retweets: 890,
      },
    }),
    prisma.newsItem.create({
      data: {
        source: 'twitter',
        sourceId: 'tw-mauro-gerson-001',
        sourceUrl: 'https://twitter.com/maurocezar/status/111222333',
        authorName: 'Mauro Cezar',
        authorHandle: '@maurocezar',
        content: 'Gerson no Flamengo? Torcida sonha, mas negócio é difícil. Salário na Europa é bem superior ao que o clube pode pagar.',
        summary: 'Gerson: sonho difícil para o Flamengo',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 2100,
        retweets: 540,
      },
    }),
  ])
  console.log(`📰 ${newsItems.length} notícias criadas`)

  // Relacionar notícias com rumores
  await prisma.rumorNewsItem.createMany({
    data: [
      { rumorId: rumors[0].id, newsItemId: newsItems[0].id, relevance: 0.95 }, // Claudinho
      { rumorId: rumors[1].id, newsItemId: newsItems[1].id, relevance: 0.90 }, // Supercopa
      { rumorId: rumors[9].id, newsItemId: newsItems[2].id, relevance: 0.85 }, // Neymar Copa
      { rumorId: rumors[2].id, newsItemId: newsItems[3].id, relevance: 0.92 }, // Filipe Luís
      { rumorId: rumors[4].id, newsItemId: newsItems[4].id, relevance: 0.88 }, // Gerson
    ],
  })
  console.log('🔗 Relações rumor-notícia criadas')

  // Posts sociais
  await prisma.socialPost.createMany({
    data: [
      {
        rumorId: rumors[0].id,
        platform: 'twitter',
        author: 'Venê Casagrande',
        username: 'venaborges',
        content: '🔴⚫ CLAUDINHO: Flamengo avança e meia do Zenit pode ser anunciado em breve. Negociação em estágio avançado.',
        likes: 8500,
        comments: 420,
        shares: 1800,
        postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        rumorId: rumors[1].id,
        platform: 'youtube',
        author: 'Flazoeiro',
        username: 'flazoeiro',
        content: '🏆 SUPERCOPA É NOSSA! Análise completa do duelo contra o Botafogo. Mengão chega favorito!',
        likes: 42000,
        comments: 3200,
        shares: 890,
        postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        rumorId: rumors[9].id,
        platform: 'twitter',
        author: 'Marcelo Bechler',
        username: 'marcelobechler',
        content: '🇧🇷 NEYMAR: Evolução física impressiona. Comissão técnica da Seleção vê com bons olhos a recuperação do craque.',
        likes: 15200,
        comments: 980,
        shares: 2400,
        postedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ],
  })
  console.log('📱 Posts sociais criados')

  // Atribuir badges aos usuários
  await prisma.userBadge.createMany({
    data: [
      { userId: users[0].id, badgeId: badges[0].id },
      { userId: users[0].id, badgeId: badges[3].id },
      { userId: users[1].id, badgeId: badges[0].id },
      { userId: users[1].id, badgeId: badges[1].id },
      { userId: users[1].id, badgeId: badges[3].id },
      { userId: users[1].id, badgeId: badges[4].id },
      { userId: users[2].id, badgeId: badges[0].id },
      { userId: users[2].id, badgeId: badges[1].id },
      { userId: users[3].id, badgeId: badges[0].id },
      { userId: users[4].id, badgeId: badges[0].id },
      { userId: users[4].id, badgeId: badges[4].id },
    ],
  })
  console.log('🎖️ Badges atribuídos')

  // =====================================
  // PRD v3: FONTES DOS JORNALISTAS
  // Alimenta o algoritmo de probabilidade (ALG-001)
  // =====================================
  await prisma.fonteRumor.createMany({
    data: [
      // Claudinho no Flamengo
      {
        rumorId: rumors[0].id,
        jornalistaId: jornalistas[1].id, // Venê
        posicao: 'confirma',
        intensidade: 'afirma',
        textoOriginal: 'Flamengo avança em negociação com Claudinho. Conversas em estágio avançado.',
        urlOriginal: 'https://ge.globo.com/futebol/times/flamengo/',
        dataPublicacao: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        rumorId: rumors[0].id,
        jornalistaId: jornalistas[8].id, // Raisa
        posicao: 'confirma',
        intensidade: 'especula',
        textoOriginal: 'Flamengo vê Claudinho como prioridade para o meio-campo.',
        urlOriginal: 'https://twitter.com/rfraisinha/',
        dataPublicacao: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      // Filipe Luís permanece
      {
        rumorId: rumors[2].id,
        jornalistaId: jornalistas[1].id, // Venê
        posicao: 'confirma',
        intensidade: 'crava',
        textoOriginal: 'Filipe Luís vai renovar com o Flamengo. Diretoria já sinalizou.',
        urlOriginal: 'https://ge.globo.com/futebol/times/flamengo/',
        dataPublicacao: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      // Neymar na Copa
      {
        rumorId: rumors[9].id,
        jornalistaId: jornalistas[7].id, // Bechler
        posicao: 'confirma',
        intensidade: 'afirma',
        textoOriginal: 'Dorival conta com Neymar se estiver bem fisicamente. Seleção monitora recuperação.',
        urlOriginal: 'https://espn.com.br/',
        dataPublicacao: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        rumorId: rumors[9].id,
        jornalistaId: jornalistas[4].id, // Nicola
        posicao: 'nega',
        intensidade: 'especula',
        textoOriginal: 'Histórico de lesões de Neymar preocupa comissão técnica.',
        urlOriginal: 'https://yahoo.com/esportes/',
        dataPublicacao: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      // Dudu pro Flamengo - maioria nega
      {
        rumorId: rumors[3].id,
        jornalistaId: jornalistas[4].id, // Nicola
        posicao: 'nega',
        intensidade: 'afirma',
        textoOriginal: 'Palmeiras não libera Dudu para o Flamengo. Rivalidade pesa.',
        urlOriginal: 'https://yahoo.com/esportes/',
        dataPublicacao: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
    ],
  })
  console.log('📰 Fontes dos jornalistas criadas')

  // =====================================
  // PRD v3: REAÇÕES (Sentimento da torcida)
  // AJUSTE-001: Variacao de distribuicoes, quantidades e timestamps
  // =====================================

  // Helper para criar ID de usuario anonimo
  const createAnonUserId = (i: number) => `anon_seed_${i}`

  // Helper para criar reacoes em massa com distribuicao especifica
  const createReacoesComDistribuicao = async (
    rumorId: string,
    timeId: string,
    distribuicao: { FOGO: number; AMOR: number; NEUTRO: number; NAO_GOSTO: number; PESSIMO: number },
    baseTimestamp: Date
  ) => {
    const reacoes: { userId: string; rumorId: string; timeId: string; emoji: EmojiReacao; criadoEm: Date }[] = []
    let counter = 0

    const emojis: EmojiReacao[] = [
      ...Array(distribuicao.FOGO).fill(EmojiReacao.FOGO),
      ...Array(distribuicao.AMOR).fill(EmojiReacao.AMOR),
      ...Array(distribuicao.NEUTRO).fill(EmojiReacao.NEUTRO),
      ...Array(distribuicao.NAO_GOSTO).fill(EmojiReacao.NAO_GOSTO),
      ...Array(distribuicao.PESSIMO).fill(EmojiReacao.PESSIMO),
    ]

    for (const emoji of emojis) {
      // Variar timestamp entre 0 e 72 horas atras
      const randomHours = Math.random() * 72
      const criadoEm = new Date(baseTimestamp.getTime() - randomHours * 60 * 60 * 1000)

      reacoes.push({
        userId: createAnonUserId(counter++),
        rumorId,
        timeId,
        emoji,
        criadoEm,
      })
    }

    return reacoes
  }

  // Criar usuarios anonimos para as reacoes
  const anonUsers: { id: string; name: string; username: string; team: string }[] = []
  for (let i = 0; i < 500; i++) {
    const teams = ['flamengo', 'palmeiras', 'corinthians', 'santos', 'botafogo', 'saopaulo', 'cruzeiro', 'gremio', 'internacional', 'atleticomg']
    anonUsers.push({
      id: createAnonUserId(i),
      name: `Torcedor ${i}`,
      username: `user_seed_${i}`,
      team: teams[i % teams.length],
    })
  }

  await prisma.user.createMany({
    data: anonUsers,
    skipDuplicates: true,
  })
  console.log(`👥 ${anonUsers.length} usuarios anonimos criados para reacoes`)

  const allReacoes: { userId: string; rumorId: string; timeId: string; emoji: EmojiReacao; criadoEm: Date }[] = []
  const agora = new Date()

  // Rumor 0: Claudinho no Flamengo - 156 reacoes, torcida MUITO positiva (divergencia baixa com prob 58%)
  // Fla: 40% FOGO, 35% AMOR, 10% NEUTRO, 10% NAO_GOSTO, 5% PESSIMO
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[0].id, 'flamengo',
    { FOGO: 50, AMOR: 44, NEUTRO: 12, NAO_GOSTO: 12, PESSIMO: 6 },
    agora
  ))
  // Outros times: menos entusiasmados
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[0].id, 'corinthians',
    { FOGO: 2, AMOR: 3, NEUTRO: 8, NAO_GOSTO: 10, PESSIMO: 9 },
    agora
  ))

  // Rumor 2: Filipe Luis permanece - 89 reacoes, MUITO positivo
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[2].id, 'flamengo',
    { FOGO: 35, AMOR: 30, NEUTRO: 10, NAO_GOSTO: 5, PESSIMO: 2 },
    new Date(agora.getTime() - 12 * 60 * 60 * 1000) // 12h atras
  ))
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[2].id, 'corinthians',
    { FOGO: 0, AMOR: 1, NEUTRO: 2, NAO_GOSTO: 2, PESSIMO: 2 },
    new Date(agora.getTime() - 12 * 60 * 60 * 1000)
  ))

  // Rumor 3: Dudu pro Fla - 78 reacoes, DIVERGENCIA ALTA! Prob baixa (15%) mas torcida quer
  // Este eh o rumor com divergencia que o PRD pede
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[3].id, 'flamengo',
    { FOGO: 25, AMOR: 20, NEUTRO: 5, NAO_GOSTO: 3, PESSIMO: 2 }, // Fla quer muito
    new Date(agora.getTime() - 36 * 60 * 60 * 1000) // 1.5 dias atras
  ))
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[3].id, 'palmeiras',
    { FOGO: 0, AMOR: 0, NEUTRO: 2, NAO_GOSTO: 8, PESSIMO: 13 }, // Palmeiras odeia
    new Date(agora.getTime() - 36 * 60 * 60 * 1000)
  ))

  // Rumor 4: Gerson volta - 45 reacoes, torcida SONHA mas prob baixa (28%)
  // Outro caso de divergencia: torcida quer mas midia diz que nao vai
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[4].id, 'flamengo',
    { FOGO: 20, AMOR: 12, NEUTRO: 5, NAO_GOSTO: 5, PESSIMO: 3 },
    new Date(agora.getTime() - 48 * 60 * 60 * 1000) // 2 dias atras
  ))

  // Rumor 7: Memphis sai - 67 reacoes, torcida NEGATIVA mas prob media (42%)
  // Caso de "resignados" - vai acontecer mas nao querem
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[7].id, 'corinthians',
    { FOGO: 3, AMOR: 5, NEUTRO: 8, NAO_GOSTO: 22, PESSIMO: 20 },
    new Date(agora.getTime() - 24 * 60 * 60 * 1000)
  ))
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[7].id, 'flamengo',
    { FOGO: 5, AMOR: 2, NEUTRO: 1, NAO_GOSTO: 0, PESSIMO: 1 }, // Rivais ironicos
    new Date(agora.getTime() - 24 * 60 * 60 * 1000)
  ))

  // Rumor 9: Neymar Copa - 198 reacoes (MUITO engajamento), Brasil todo quer
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[9].id, 'santos',
    { FOGO: 40, AMOR: 25, NEUTRO: 5, NAO_GOSTO: 3, PESSIMO: 2 },
    new Date(agora.getTime() - 6 * 60 * 60 * 1000)
  ))
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[9].id, 'flamengo',
    { FOGO: 30, AMOR: 20, NEUTRO: 8, NAO_GOSTO: 5, PESSIMO: 2 },
    new Date(agora.getTime() - 6 * 60 * 60 * 1000)
  ))
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[9].id, 'corinthians',
    { FOGO: 18, AMOR: 15, NEUTRO: 5, NAO_GOSTO: 3, PESSIMO: 2 },
    new Date(agora.getTime() - 6 * 60 * 60 * 1000)
  ))
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[9].id, 'palmeiras',
    { FOGO: 8, AMOR: 5, NEUTRO: 2, NAO_GOSTO: 0, PESSIMO: 0 },
    new Date(agora.getTime() - 6 * 60 * 60 * 1000)
  ))

  // Rumor 1: Supercopa - 112 reacoes, dividido entre torcidas
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[1].id, 'flamengo',
    { FOGO: 25, AMOR: 18, NEUTRO: 8, NAO_GOSTO: 3, PESSIMO: 2 },
    new Date(agora.getTime() - 3 * 60 * 60 * 1000)
  ))
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[1].id, 'botafogo',
    { FOGO: 22, AMOR: 15, NEUTRO: 6, NAO_GOSTO: 5, PESSIMO: 8 }, // Botafogo tb quer
    new Date(agora.getTime() - 3 * 60 * 60 * 1000)
  ))

  // Rumor 5: Vitor Roque - 34 reacoes, pouco engajamento
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[5].id, 'palmeiras',
    { FOGO: 10, AMOR: 8, NEUTRO: 6, NAO_GOSTO: 5, PESSIMO: 5 },
    new Date(agora.getTime() - 60 * 60 * 60 * 1000) // 2.5 dias
  ))

  // Rumor 6: Palmeiras tri - 52 reacoes
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[6].id, 'palmeiras',
    { FOGO: 20, AMOR: 12, NEUTRO: 5, NAO_GOSTO: 8, PESSIMO: 7 },
    new Date(agora.getTime() - 72 * 60 * 60 * 1000) // 3 dias
  ))

  // Rumor 8: Breno Bidon - 28 reacoes
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[8].id, 'corinthians',
    { FOGO: 12, AMOR: 8, NEUTRO: 4, NAO_GOSTO: 2, PESSIMO: 2 },
    new Date(agora.getTime() - 48 * 60 * 60 * 1000)
  ))

  // Rumor 10: Gabigol Santos - 18 reacoes, pouco interesse
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[10].id, 'santos',
    { FOGO: 5, AMOR: 4, NEUTRO: 3, NAO_GOSTO: 3, PESSIMO: 3 },
    new Date(agora.getTime() - 60 * 60 * 60 * 1000)
  ))

  // Rumor 11: Arthur Cabral - 42 reacoes
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[11].id, 'botafogo',
    { FOGO: 15, AMOR: 12, NEUTRO: 8, NAO_GOSTO: 4, PESSIMO: 3 },
    new Date(agora.getTime() - 18 * 60 * 60 * 1000)
  ))

  // Rumor 12: Lucas aposentadoria - 56 reacoes, torcida dividida
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[12].id, 'saopaulo',
    { FOGO: 8, AMOR: 10, NEUTRO: 12, NAO_GOSTO: 14, PESSIMO: 12 }, // Dividido, muitos nao querem
    new Date(agora.getTime() - 40 * 60 * 60 * 1000)
  ))

  // Rumor 13: Gabigol Cruzeiro - 38 reacoes, maioria negativa
  allReacoes.push(...await createReacoesComDistribuicao(
    rumors[13].id, 'cruzeiro',
    { FOGO: 4, AMOR: 5, NEUTRO: 6, NAO_GOSTO: 12, PESSIMO: 11 },
    new Date(agora.getTime() - 30 * 60 * 60 * 1000)
  ))

  // Inserir todas as reacoes
  await prisma.reacao.createMany({
    data: allReacoes.map(r => ({
      userId: r.userId,
      rumorId: r.rumorId,
      timeId: r.timeId,
      emoji: r.emoji,
      criadoEm: r.criadoEm,
    })),
    skipDuplicates: true,
  })
  console.log(`🎭 ${allReacoes.length} reacoes PRD v3 criadas com variacao`)

  console.log('\n✅ Seed completo!')
  console.log(`   - ${users.length} usuários`)
  console.log(`   - 6 influenciadores`)
  console.log(`   - ${rumors.length} rumores (5 do Flamengo)`)
  console.log(`   - ${uniquePredictions.size} predictions`)
  console.log(`   - ${newsItems.length} notícias`)
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
