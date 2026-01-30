import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpar dados existentes
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
      data: {
        name: 'Novato',
        description: 'Fez seu primeiro palpite',
        emoji: '🎯',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Vidente',
        description: 'Acertou 10 palpites',
        emoji: '🔮',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Mestre dos Rumores',
        description: 'Acertou 50 palpites',
        emoji: '👑',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Flamenguista',
        description: 'Torcedor do Mengão',
        emoji: '🔴⚫',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Premium',
        description: 'Assinante premium',
        emoji: '⭐',
      },
    }),
  ])

  // Criar usuário demo
  const demoUser = await prisma.user.create({
    data: {
      name: 'Torcedor Demo',
      username: 'torcedor_demo',
      team: 'Flamengo',
      points: 1250,
      level: 5,
      isPremium: false,
    },
  })

  // Dar badge de Flamenguista ao usuário demo
  await prisma.userBadge.create({
    data: {
      userId: demoUser.id,
      badgeId: badges[3].id,
    },
  })

  // Criar 5 influenciadores
  const vene = await prisma.influencer.create({
    data: {
      name: 'Venê Casagrande',
      username: 'venaborges',
      outlet: 'O Globo / SporTV',
      bio: 'Jornalista esportivo com mais de 15 anos cobrindo futebol brasileiro. Especialista em bastidores.',
      trustScore: 0.92,
      totalHits: 47,
      totalMisses: 4,
      followers: 850000,
      twitter: 'https://twitter.com/venaborges',
      instagram: 'https://instagram.com/venecasagrande',
    },
  })

  const raisa = await prisma.influencer.create({
    data: {
      name: 'Raisa Simplicio',
      username: 'rfraisinha',
      outlet: 'TNT Sports',
      bio: 'Repórter da TNT Sports. Cobertura diária do Flamengo e grandes clubes do RJ.',
      trustScore: 0.88,
      totalHits: 35,
      totalMisses: 5,
      followers: 420000,
      twitter: 'https://twitter.com/rfraisinha',
      instagram: 'https://instagram.com/raisasimplicio',
    },
  })

  const marcelo = await prisma.influencer.create({
    data: {
      name: 'Marcelo Bechler',
      username: 'marcelobechler',
      outlet: 'ESPN Brasil',
      bio: 'Correspondente internacional da ESPN. Fonte confiável para transferências europeias.',
      trustScore: 0.95,
      totalHits: 62,
      totalMisses: 3,
      followers: 1200000,
      twitter: 'https://twitter.com/marcelobechler',
      promoTitle: '📚 Meu novo livro sobre bastidores',
      promoUrl: 'https://amazon.com.br/livro-bechler',
    },
  })

  const jorge = await prisma.influencer.create({
    data: {
      name: 'Jorge Nicola',
      username: 'jorgenicola',
      outlet: 'Yahoo Esportes',
      bio: 'Colunista do Yahoo. Especialista em finanças do futebol e negociações.',
      trustScore: 0.78,
      totalHits: 28,
      totalMisses: 8,
      followers: 380000,
      twitter: 'https://twitter.com/jorgenicola',
      youtube: 'https://youtube.com/@jorgenicola',
    },
  })

  const flazoeiro = await prisma.influencer.create({
    data: {
      name: 'Flazoeiro',
      username: 'faborges',
      outlet: 'Canal Flazoeiro',
      bio: 'Maior canal do Flamengo no YouTube. Informações quentes direto da Gávea! 🔴⚫',
      trustScore: 0.72,
      totalHits: 22,
      totalMisses: 9,
      followers: 950000,
      youtube: 'https://youtube.com/@flazoeiro',
      tiktok: 'https://tiktok.com/@flazoeiro',
      promoTitle: '🎮 Grupo VIP no Telegram',
      promoUrl: 'https://t.me/flazoeirovip',
    },
  })

  // Criar 3 rumores
  const rumorNeymar = await prisma.rumor.create({
    data: {
      playerName: 'Neymar Jr',
      playerImage: '/players/neymar.jpg',
      fromTeam: 'Al-Hilal',
      toTeam: 'Flamengo',
      title: 'Neymar vai jogar no Flamengo em 2025?',
      description: 'O craque brasileiro pode estar próximo de um retorno ao Brasil. Negociações em andamento.',
      category: 'transferencia',
      sentiment: 0.42,
      status: 'open',
      closesAt: new Date('2025-06-30T23:59:59Z'),
    },
  })

  const rumorGabigol = await prisma.rumor.create({
    data: {
      playerName: 'Gabigol',
      playerImage: '/players/gabigol.jpg',
      fromTeam: 'Flamengo',
      toTeam: 'Cruzeiro',
      title: 'Gabigol vai deixar o Flamengo?',
      description: 'Contrato se encerra em dezembro. Cruzeiro e outros clubes monitoram situação.',
      category: 'transferencia',
      sentiment: 0.65,
      status: 'open',
      closesAt: new Date('2025-12-31T23:59:59Z'),
    },
  })

  const rumorArrascaeta = await prisma.rumor.create({
    data: {
      playerName: 'De Arrascaeta',
      playerImage: '/players/arrascaeta.jpg',
      fromTeam: 'Flamengo',
      toTeam: 'MLS',
      title: 'Arrascaeta vai para a MLS?',
      description: 'Inter Miami teria feito proposta milionária pelo meia uruguaio.',
      category: 'transferencia',
      sentiment: 0.28,
      status: 'open',
      closesAt: new Date('2025-08-31T23:59:59Z'),
    },
  })

  // Criar 8 sinais
  await prisma.signal.createMany({
    data: [
      // Sinais sobre Neymar
      {
        rumorId: rumorNeymar.id,
        influencerId: vene.id,
        signal: 'favoravel',
        confidence: 0.75,
        reasoning: 'Fontes no Flamengo confirmam interesse real. Conversas avançadas com representantes.',
        source: 'Twitter',
      },
      {
        rumorId: rumorNeymar.id,
        influencerId: raisa.id,
        signal: 'desfavoravel',
        confidence: 0.60,
        reasoning: 'Salário ainda é obstáculo. Flamengo não pode pagar valores do Al-Hilal.',
        source: 'Instagram',
      },
      {
        rumorId: rumorNeymar.id,
        influencerId: marcelo.id,
        signal: 'favoravel',
        confidence: 0.55,
        reasoning: 'Al-Hilal disposto a liberar. Questão é puramente financeira agora.',
        source: 'ESPN',
      },
      // Sinais sobre Gabigol
      {
        rumorId: rumorGabigol.id,
        influencerId: vene.id,
        signal: 'favoravel',
        confidence: 0.85,
        reasoning: 'Renovação praticamente descartada. Cruzeiro lidera corrida.',
        source: 'O Globo',
      },
      {
        rumorId: rumorGabigol.id,
        influencerId: flazoeiro.id,
        signal: 'desfavoravel',
        confidence: 0.70,
        reasoning: 'Gabigol quer ficar! Jogador pressiona diretoria por renovação.',
        source: 'YouTube',
      },
      {
        rumorId: rumorGabigol.id,
        influencerId: jorge.id,
        signal: 'favoravel',
        confidence: 0.65,
        reasoning: 'Cruzeiro oferece salário maior e projeto ambicioso para 2025.',
        source: 'Yahoo',
      },
      // Sinais sobre Arrascaeta
      {
        rumorId: rumorArrascaeta.id,
        influencerId: marcelo.id,
        signal: 'desfavoravel',
        confidence: 0.80,
        reasoning: 'Inter Miami focado em outros alvos. Proposta não foi formalizada.',
        source: 'ESPN',
      },
      {
        rumorId: rumorArrascaeta.id,
        influencerId: raisa.id,
        signal: 'desfavoravel',
        confidence: 0.90,
        reasoning: 'Arrascaeta feliz no Flamengo. Sem intenção de sair no momento.',
        source: 'TNT Sports',
      },
    ],
  })

  // Criar posts sociais de exemplo
  await prisma.socialPost.createMany({
    data: [
      {
        rumorId: rumorNeymar.id,
        platform: 'twitter',
        author: 'Venê Casagrande',
        username: 'venaborges',
        content: '🚨 ATUALIZAÇÃO: Representantes de Neymar estiveram na Gávea hoje. Reunião durou 3 horas. Flamengo apresentou projeto esportivo. Questão salarial ainda em discussão. #Neymar #Flamengo',
        likes: 15420,
        comments: 892,
        shares: 3200,
        postedAt: new Date('2025-01-28T14:30:00Z'),
      },
      {
        rumorId: rumorNeymar.id,
        platform: 'twitter',
        author: 'Raisa Simplicio',
        username: 'rfraisinha',
        content: 'Apurei que Flamengo ainda vê salário de Neymar como obstáculo MUITO grande. Clube não quer comprometer folha. Negócio só sai com renúncia significativa do jogador.',
        likes: 8900,
        comments: 445,
        shares: 1800,
        postedAt: new Date('2025-01-29T10:15:00Z'),
      },
      {
        rumorId: rumorGabigol.id,
        platform: 'youtube',
        author: 'Flazoeiro',
        username: 'flazoeiro',
        content: '🔴⚫ GABIGOL QUER FICAR! Informação EXCLUSIVA: jogador pediu reunião com diretoria. Quer renovar! Será que o Mengão vai segurar o artilheiro?',
        mediaUrl: 'https://youtube.com/watch?v=xxxxx',
        likes: 42000,
        comments: 3200,
        shares: 890,
        postedAt: new Date('2025-01-27T18:00:00Z'),
      },
      {
        rumorId: rumorArrascaeta.id,
        platform: 'twitter',
        author: 'Marcelo Bechler',
        username: 'marcelobechler',
        content: 'Sobre Arrascaeta: conversei com fonte próxima ao Inter Miami. Clube NÃO fez proposta formal. Foco do Miami é em outras posições. Uruguaio deve seguir no Fla.',
        likes: 12300,
        comments: 567,
        shares: 2100,
        postedAt: new Date('2025-01-29T16:45:00Z'),
      },
    ],
  })

  // Criar algumas notificações de exemplo
  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        type: 'signal',
        title: 'Novo sinal! 🚨',
        message: 'Venê Casagrande deu sinal FAVORÁVEL sobre Neymar no Flamengo',
        read: false,
      },
      {
        userId: demoUser.id,
        type: 'rumor',
        title: 'Rumor atualizado',
        message: 'O sentimento sobre Gabigol mudou: agora 65% favorável à saída',
        read: true,
      },
    ],
  })

  // Criar alguns palpites do usuário demo
  await prisma.prediction.createMany({
    data: [
      {
        rumorId: rumorNeymar.id,
        userId: demoUser.id,
        prediction: true,
      },
      {
        rumorId: rumorGabigol.id,
        userId: demoUser.id,
        prediction: true,
      },
    ],
  })

  console.log('✅ Seed completed!')
  console.log(`   - ${5} influenciadores criados`)
  console.log(`   - ${3} rumores criados`)
  console.log(`   - ${8} sinais criados`)
  console.log(`   - ${4} posts sociais criados`)
  console.log(`   - ${5} badges criados`)
  console.log(`   - ${1} usuário demo criado`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
