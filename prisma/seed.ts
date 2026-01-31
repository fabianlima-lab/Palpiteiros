import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpar dados existentes
  await prisma.rumorNewsItem.deleteMany()
  await prisma.rumorSignal.deleteMany()
  await prisma.newsItem.deleteMany()
  await prisma.signal.deleteMany()
  await prisma.prediction.deleteMany()
  await prisma.socialPost.deleteMany()
  await prisma.rumor.deleteMany()
  await prisma.influencer.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.user.deleteMany()

  // Criar badges
  const badges = await Promise.all([
    prisma.badge.create({
      data: { name: 'Novato', description: 'Fez seu primeiro palpite', emoji: '🎯' },
    }),
    prisma.badge.create({
      data: { name: 'Vidente', description: 'Acertou 10 palpites', emoji: '🔮' },
    }),
    prisma.badge.create({
      data: { name: 'Mestre dos Rumores', description: 'Acertou 50 palpites', emoji: '👑' },
    }),
    prisma.badge.create({
      data: { name: 'Flamenguista', description: 'Torcedor do Mengão', emoji: '🔴⚫' },
    }),
    prisma.badge.create({
      data: { name: 'Premium', description: 'Assinante premium', emoji: '⭐' },
    }),
  ])

  // Criar usuários
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Torcedor Demo',
        username: 'torcedor_demo',
        team: 'Flamengo',
        points: 1430,
        level: 5,
        isPremium: false,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maria Silva',
        username: 'maria_fla',
        team: 'Flamengo',
        points: 980,
        level: 4,
        isPremium: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'João Santos',
        username: 'joao_peixe',
        team: 'Santos',
        points: 1250,
        level: 5,
        isPremium: false,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Pedro Corinthiano',
        username: 'pedrao_sccp',
        team: 'Corinthians',
        points: 890,
        level: 3,
        isPremium: false,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ana Palmeirense',
        username: 'ana_verdao',
        team: 'Palmeiras',
        points: 1100,
        level: 4,
        isPremium: true,
      },
    }),
  ])

  // Criar influenciadores
  const vene = await prisma.influencer.create({
    data: {
      name: 'Venê Casagrande',
      username: 'venaborges',
      outlet: 'O Globo / SporTV',
      bio: 'Jornalista esportivo com mais de 15 anos cobrindo futebol brasileiro.',
      trustScore: 0.92,
      totalHits: 47,
      totalMisses: 4,
      followers: 850000,
      twitter: 'https://twitter.com/venaborges',
    },
  })

  const raisa = await prisma.influencer.create({
    data: {
      name: 'Raisa Simplicio',
      username: 'rfraisinha',
      outlet: 'TNT Sports',
      bio: 'Repórter da TNT Sports. Cobertura diária do Flamengo.',
      trustScore: 0.88,
      totalHits: 35,
      totalMisses: 5,
      followers: 420000,
      twitter: 'https://twitter.com/rfraisinha',
    },
  })

  const marcelo = await prisma.influencer.create({
    data: {
      name: 'Marcelo Bechler',
      username: 'marcelobechler',
      outlet: 'ESPN Brasil',
      bio: 'Correspondente internacional da ESPN.',
      trustScore: 0.95,
      totalHits: 62,
      totalMisses: 3,
      followers: 1200000,
      twitter: 'https://twitter.com/marcelobechler',
    },
  })

  const jorge = await prisma.influencer.create({
    data: {
      name: 'Jorge Nicola',
      username: 'jorgenicola',
      outlet: 'Yahoo Esportes',
      bio: 'Especialista em finanças do futebol.',
      trustScore: 0.78,
      totalHits: 28,
      totalMisses: 8,
      followers: 380000,
      youtube: 'https://youtube.com/@jorgenicola',
    },
  })

  const flazoeiro = await prisma.influencer.create({
    data: {
      name: 'Flazoeiro',
      username: 'flazoeiro',
      outlet: 'Canal Flazoeiro',
      bio: 'Maior canal do Flamengo no YouTube.',
      trustScore: 0.72,
      totalHits: 22,
      totalMisses: 9,
      followers: 950000,
      youtube: 'https://youtube.com/@flazoeiro',
    },
  })

  // Criar rumores variados
  const rumors = await Promise.all([
    // ===== SELEÇÃO BRASILEIRA =====
    prisma.rumor.create({
      data: {
        playerName: 'Neymar',
        fromTeam: 'Santos',
        toTeam: 'Seleção Brasileira',
        title: 'Neymar joga a Copa do Mundo 2026?',
        description: 'Craque está de volta ao Santos e busca recuperar forma física para o Mundial.',
        category: 'selecao',
        sentiment: 0.75,
        status: 'open',
        signalScore: 0.6,
        closesAt: new Date('2026-06-01'),
      },
    }),
    prisma.rumor.create({
      data: {
        playerName: 'Kaio Jorge',
        fromTeam: 'Juventus',
        toTeam: 'Seleção Brasileira',
        title: 'Kaio Jorge na próxima convocação da Seleção?',
        description: 'Atacante vive boa fase na Juventus e pode ganhar chance com Dorival.',
        category: 'selecao',
        sentiment: 0.45,
        status: 'open',
        signalScore: 0.3,
        closesAt: new Date('2026-03-15'),
      },
    }),
    prisma.rumor.create({
      data: {
        playerName: 'Breno Bidon',
        fromTeam: 'Corinthians',
        toTeam: 'Seleção Brasileira',
        title: 'Breno Bidon será convocado para a Copa do Mundo?',
        description: 'Jovem volante do Corinthians impressiona e entra no radar da Seleção.',
        category: 'selecao',
        sentiment: 0.38,
        status: 'open',
        signalScore: 0.25,
        closesAt: new Date('2026-05-01'),
      },
    }),

    // ===== CRUZEIRO =====
    prisma.rumor.create({
      data: {
        playerName: 'Tite',
        fromTeam: 'Sem clube',
        toTeam: 'Cruzeiro',
        title: 'Tite permanece no Cruzeiro até o fim do ano?',
        description: 'Treinador enfrenta pressão após resultados irregulares.',
        category: 'tecnico',
        sentiment: 0.52,
        status: 'open',
        signalScore: 0.4,
        closesAt: new Date('2026-12-31'),
      },
    }),

    // ===== BOTAFOGO =====
    prisma.rumor.create({
      data: {
        playerName: 'Arthur Cabral',
        fromTeam: 'Benfica',
        toTeam: 'Botafogo',
        title: 'Arthur Cabral é reforço do Botafogo?',
        description: 'Atacante brasileiro pode retornar ao país para vestir a camisa alvinegra.',
        category: 'transferencia',
        sentiment: 0.62,
        status: 'open',
        signalScore: 0.5,
        closesAt: new Date('2026-02-28'),
      },
    }),

    // ===== FLAMENGO =====
    prisma.rumor.create({
      data: {
        playerName: 'Flamengo',
        fromTeam: null,
        toTeam: 'Flamengo',
        title: 'Flamengo vence a Supercopa 2026?',
        description: 'Rubro-negro enfrenta o Botafogo na decisão da Supercopa do Brasil.',
        category: 'titulo',
        sentiment: 0.68,
        status: 'open',
        signalScore: 0.55,
        closesAt: new Date('2026-02-10'),
      },
    }),

    // ===== SANTOS =====
    prisma.rumor.create({
      data: {
        playerName: 'Fernando Diniz',
        fromTeam: 'Sem clube',
        toTeam: 'Santos',
        title: 'Fernando Diniz assume o Santos?',
        description: 'Treinador está em conversas avançadas com o Peixe.',
        category: 'tecnico',
        sentiment: 0.35,
        status: 'open',
        signalScore: 0.3,
        closesAt: new Date('2026-01-31'),
      },
    }),
    prisma.rumor.create({
      data: {
        playerName: 'Gabigol',
        fromTeam: 'Cruzeiro',
        toTeam: 'Santos',
        title: 'Gabigol troca o Cruzeiro pelo Santos?',
        description: 'Atacante pode voltar ao clube que o revelou após passagem frustrante em MG.',
        category: 'transferencia',
        sentiment: 0.28,
        status: 'open',
        signalScore: 0.2,
        closesAt: new Date('2026-07-31'),
      },
    }),

    // ===== PALMEIRAS =====
    prisma.rumor.create({
      data: {
        playerName: 'Palmeiras',
        fromTeam: null,
        toTeam: 'Palmeiras',
        title: 'Palmeiras será tricampeão do Brasileirão?',
        description: 'Verdão busca o terceiro título consecutivo do Campeonato Brasileiro.',
        category: 'titulo',
        sentiment: 0.58,
        status: 'open',
        signalScore: 0.45,
        closesAt: new Date('2026-12-08'),
      },
    }),
    prisma.rumor.create({
      data: {
        playerName: 'Estêvão',
        fromTeam: 'Palmeiras',
        toTeam: 'Chelsea',
        title: 'Estêvão vai para o Chelsea em 2026?',
        description: 'Joia palmeirense já tem acordo com o clube inglês e deve se transferir.',
        category: 'transferencia',
        sentiment: 0.88,
        status: 'open',
        signalScore: 0.9,
        closesAt: new Date('2026-07-01'),
      },
    }),

    // ===== CORINTHIANS =====
    prisma.rumor.create({
      data: {
        playerName: 'Memphis Depay',
        fromTeam: 'Corinthians',
        toTeam: 'Europa',
        title: 'Memphis Depay sai do Corinthians no meio do ano?',
        description: 'Atacante holandês pode retornar à Europa após sucesso no Brasil.',
        category: 'transferencia',
        sentiment: 0.42,
        status: 'open',
        signalScore: 0.35,
        closesAt: new Date('2026-06-30'),
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
        category: 'transferencia',
        sentiment: 0.55,
        status: 'open',
        signalScore: 0.4,
        closesAt: new Date('2026-12-31'),
      },
    }),
  ])

  // Criar sinais para os rumores
  await prisma.signal.createMany({
    data: [
      // Neymar Copa
      { rumorId: rumors[0].id, influencerId: vene.id, signal: 'favoravel', confidence: 0.8, reasoning: 'Neymar está focado em recuperação. Fontes confirmam dedicação total.', source: 'Twitter' },
      { rumorId: rumors[0].id, influencerId: marcelo.id, signal: 'favoravel', confidence: 0.7, reasoning: 'Staff da Seleção monitora evolução do jogador de perto.', source: 'ESPN' },
      { rumorId: rumors[0].id, influencerId: jorge.id, signal: 'desfavoravel', confidence: 0.6, reasoning: 'Histórico de lesões preocupa. Difícil estar 100% para Copa.', source: 'Yahoo' },

      // Kaio Jorge
      { rumorId: rumors[1].id, influencerId: marcelo.id, signal: 'favoravel', confidence: 0.5, reasoning: 'Dorival gosta do perfil do jogador. Pode ganhar chance.', source: 'ESPN' },
      { rumorId: rumors[1].id, influencerId: raisa.id, signal: 'desfavoravel', confidence: 0.6, reasoning: 'Concorrência pesada na posição. Endrick e Vini Jr na frente.', source: 'TNT' },

      // Breno Bidon
      { rumorId: rumors[2].id, influencerId: vene.id, signal: 'desfavoravel', confidence: 0.7, reasoning: 'Muito jovem ainda. Copa de 2030 é mais realista.', source: 'O Globo' },

      // Tite Cruzeiro
      { rumorId: rumors[3].id, influencerId: jorge.id, signal: 'favoravel', confidence: 0.55, reasoning: 'Diretoria bancando o trabalho apesar da pressão.', source: 'Yahoo' },
      { rumorId: rumors[3].id, influencerId: vene.id, signal: 'desfavoravel', confidence: 0.5, reasoning: 'Resultados não vêm. Clima tenso no vestiário.', source: 'O Globo' },

      // Arthur Cabral Botafogo
      { rumorId: rumors[4].id, influencerId: marcelo.id, signal: 'favoravel', confidence: 0.65, reasoning: 'Negociação avançada. Benfica aceita liberar.', source: 'ESPN' },

      // Flamengo Supercopa
      { rumorId: rumors[5].id, influencerId: flazoeiro.id, signal: 'favoravel', confidence: 0.75, reasoning: 'Time entrosado e motivado. Favoritismo claro!', source: 'YouTube' },
      { rumorId: rumors[5].id, influencerId: raisa.id, signal: 'favoravel', confidence: 0.6, reasoning: 'Elenco forte e bem preparado para decisão.', source: 'TNT' },

      // Estêvão Chelsea
      { rumorId: rumors[9].id, influencerId: marcelo.id, signal: 'favoravel', confidence: 0.95, reasoning: 'Acordo fechado. É questão de tempo.', source: 'ESPN' },
      { rumorId: rumors[9].id, influencerId: vene.id, signal: 'favoravel', confidence: 0.9, reasoning: 'Contrato assinado, só aguarda completar 18 anos.', source: 'O Globo' },
    ],
  })

  // Criar predictions variadas para ter sentimentos diferentes
  const predictionData: { rumorId: string; userId: string; prediction: boolean }[] = []

  // Neymar Copa - 75% favorável (15 sim, 5 não)
  for (let i = 0; i < 15; i++) predictionData.push({ rumorId: rumors[0].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 5; i++) predictionData.push({ rumorId: rumors[0].id, userId: users[(i + 2) % 5].id, prediction: false })

  // Kaio Jorge - 45% favorável (9 sim, 11 não)
  for (let i = 0; i < 9; i++) predictionData.push({ rumorId: rumors[1].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 11; i++) predictionData.push({ rumorId: rumors[1].id, userId: users[(i + 1) % 5].id, prediction: false })

  // Breno Bidon - 38% favorável
  for (let i = 0; i < 8; i++) predictionData.push({ rumorId: rumors[2].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 13; i++) predictionData.push({ rumorId: rumors[2].id, userId: users[(i + 2) % 5].id, prediction: false })

  // Tite Cruzeiro - 52% favorável
  for (let i = 0; i < 13; i++) predictionData.push({ rumorId: rumors[3].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 12; i++) predictionData.push({ rumorId: rumors[3].id, userId: users[(i + 1) % 5].id, prediction: false })

  // Arthur Cabral - 62% favorável
  for (let i = 0; i < 16; i++) predictionData.push({ rumorId: rumors[4].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 10; i++) predictionData.push({ rumorId: rumors[4].id, userId: users[(i + 2) % 5].id, prediction: false })

  // Flamengo Supercopa - 68% favorável
  for (let i = 0; i < 17; i++) predictionData.push({ rumorId: rumors[5].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 8; i++) predictionData.push({ rumorId: rumors[5].id, userId: users[(i + 1) % 5].id, prediction: false })

  // Fernando Diniz Santos - 35% favorável
  for (let i = 0; i < 7; i++) predictionData.push({ rumorId: rumors[6].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 13; i++) predictionData.push({ rumorId: rumors[6].id, userId: users[(i + 2) % 5].id, prediction: false })

  // Gabigol Santos - 28% favorável
  for (let i = 0; i < 6; i++) predictionData.push({ rumorId: rumors[7].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 15; i++) predictionData.push({ rumorId: rumors[7].id, userId: users[(i + 1) % 5].id, prediction: false })

  // Palmeiras tri - 58% favorável
  for (let i = 0; i < 14; i++) predictionData.push({ rumorId: rumors[8].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 10; i++) predictionData.push({ rumorId: rumors[8].id, userId: users[(i + 2) % 5].id, prediction: false })

  // Estêvão Chelsea - 88% favorável
  for (let i = 0; i < 22; i++) predictionData.push({ rumorId: rumors[9].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 3; i++) predictionData.push({ rumorId: rumors[9].id, userId: users[(i + 1) % 5].id, prediction: false })

  // Memphis saída - 42% favorável
  for (let i = 0; i < 10; i++) predictionData.push({ rumorId: rumors[10].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 14; i++) predictionData.push({ rumorId: rumors[10].id, userId: users[(i + 2) % 5].id, prediction: false })

  // Lucas aposentadoria - 55% favorável
  for (let i = 0; i < 11; i++) predictionData.push({ rumorId: rumors[11].id, userId: users[i % 5].id, prediction: true })
  for (let i = 0; i < 9; i++) predictionData.push({ rumorId: rumors[11].id, userId: users[(i + 1) % 5].id, prediction: false })

  // Deduplicate predictions (same rumorId + userId should be unique)
  const uniquePredictions = new Map<string, typeof predictionData[0]>()
  predictionData.forEach(p => {
    const key = `${p.rumorId}-${p.userId}`
    if (!uniquePredictions.has(key)) {
      uniquePredictions.set(key, p)
    }
  })

  await prisma.prediction.createMany({
    data: Array.from(uniquePredictions.values()),
  })

  // Atualizar o sentiment de cada rumor baseado nas predictions reais
  for (const rumor of rumors) {
    const predictions = await prisma.prediction.findMany({
      where: { rumorId: rumor.id },
    })
    const total = predictions.length
    const positives = predictions.filter(p => p.prediction).length
    const sentiment = total > 0 ? positives / total : 0.5

    await prisma.rumor.update({
      where: { id: rumor.id },
      data: { sentiment },
    })
  }

  // Criar posts sociais
  await prisma.socialPost.createMany({
    data: [
      {
        rumorId: rumors[0].id,
        platform: 'twitter',
        author: 'Venê Casagrande',
        username: 'venaborges',
        content: '🚨 NEYMAR: Jogador está focado em recuperação física. Treina em período integral no CT do Santos. Meta: voltar 100% para a Copa 2026.',
        likes: 15420,
        comments: 892,
        shares: 3200,
        postedAt: new Date('2026-01-28T14:30:00Z'),
      },
      {
        rumorId: rumors[5].id,
        platform: 'youtube',
        author: 'Flazoeiro',
        username: 'flazoeiro',
        content: '🔴⚫ SUPERCOPA É NOSSA! Análise completa do duelo contra o Botafogo. Mengão chega favorito!',
        likes: 42000,
        comments: 3200,
        shares: 890,
        postedAt: new Date('2026-01-27T18:00:00Z'),
      },
      {
        rumorId: rumors[9].id,
        platform: 'twitter',
        author: 'Marcelo Bechler',
        username: 'marcelobechler',
        content: 'Estêvão ao Chelsea: acordo 100% fechado. Transferência será concretizada assim que completar 18 anos. Valor: €65 milhões.',
        likes: 28300,
        comments: 1567,
        shares: 5100,
        postedAt: new Date('2026-01-29T16:45:00Z'),
      },
    ],
  })

  // Criar notícias de exemplo
  const newsItems = await Promise.all([
    prisma.newsItem.create({
      data: {
        source: 'globo',
        sourceId: 'ge-001',
        sourceUrl: 'https://ge.globo.com/futebol/selecao-brasileira/noticia/neymar-treina-normalmente.ghtml',
        authorName: 'Redação GE',
        content: 'Neymar treina normalmente e evolui na recuperação física no Santos',
        summary: 'Atacante faz trabalhos no campo e mostra evolução na preparação para a Copa 2026.',
        publishedAt: new Date('2026-01-28'),
      },
    }),
    prisma.newsItem.create({
      data: {
        source: 'uol',
        sourceId: 'uol-001',
        sourceUrl: 'https://www.uol.com.br/esporte/futebol/ultimas-noticias/estevao-chelsea.htm',
        authorName: 'UOL Esporte',
        content: 'Chelsea confirma acordo por Estêvão; Palmeiras receberá valor recorde',
        summary: 'Joia palmeirense vai para a Premier League por €65 milhões.',
        publishedAt: new Date('2026-01-29'),
      },
    }),
    prisma.newsItem.create({
      data: {
        source: 'twitter',
        sourceId: 'tw-001',
        sourceUrl: 'https://twitter.com/venaborges/status/123456',
        authorName: 'Venê Casagrande',
        authorHandle: 'venaborges',
        content: 'Arthur Cabral próximo do Botafogo. Benfica aceita proposta do clube brasileiro.',
        publishedAt: new Date('2026-01-27'),
      },
    }),
  ])

  // Linkar notícias aos rumores
  await prisma.rumorNewsItem.createMany({
    data: [
      { rumorId: rumors[0].id, newsItemId: newsItems[0].id, relevance: 0.95 },
      { rumorId: rumors[9].id, newsItemId: newsItems[1].id, relevance: 0.98 },
      { rumorId: rumors[4].id, newsItemId: newsItems[2].id, relevance: 0.85 },
    ],
  })

  console.log('✅ Seed completed!')
  console.log(`   - ${users.length} usuários criados`)
  console.log(`   - 5 influenciadores criados`)
  console.log(`   - ${rumors.length} rumores criados`)
  console.log(`   - 13 sinais criados`)
  console.log(`   - 3 posts sociais criados`)
  console.log(`   - ${newsItems.length} notícias criadas`)
  console.log(`   - ${uniquePredictions.size} predictions criadas`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
