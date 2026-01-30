import { prisma } from '@/lib/prisma'
import { FeedClient } from './FeedClient'

export const dynamic = 'force-dynamic'

export default async function FeedPage() {
  // Buscar rumores ativos com sinais e previsões
  const rumors = await prisma.rumor.findMany({
    where: { status: 'open' },
    include: {
      signals: {
        include: {
          influencer: true,
        },
      },
      predictions: true,
    },
    orderBy: { sentiment: 'desc' },
  })

  // Buscar usuário demo (temporário até implementar auth)
  const user = await prisma.user.findFirst({
    where: { username: 'torcedor_demo' },
  })

  // Buscar top usuários
  const topUsers = await prisma.user.findMany({
    orderBy: { points: 'desc' },
    take: 5,
    select: {
      id: true,
      name: true,
      username: true,
      points: true,
    },
  })

  // Serializar datas para o cliente
  const serializedRumors = rumors.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    closesAt: r.closesAt.toISOString(),
    resolvedAt: r.resolvedAt?.toISOString() || null,
    lastScraped: r.lastScraped?.toISOString() || null,
    signals: r.signals.map(s => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      influencer: {
        ...s.influencer,
        createdAt: s.influencer.createdAt.toISOString(),
        updatedAt: s.influencer.updatedAt.toISOString(),
      },
    })),
    predictions: r.predictions.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    })),
  }))

  const serializedUser = user ? {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  } : null

  return (
    <FeedClient
      initialRumors={serializedRumors}
      user={serializedUser}
      topUsers={topUsers}
    />
  )
}
