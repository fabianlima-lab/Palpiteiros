import { prisma } from '@/lib/prisma'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage() {
  const user = await prisma.user.findFirst({
    where: { username: 'torcedor_demo' },
    include: {
      badges: {
        include: {
          badge: true,
        },
      },
      predictions: {
        include: {
          rumor: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!user) {
    return (
      <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh' }}>
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🤔</span>
          <span style={{ color: '#666680', fontSize: '14px' }}>Usuário não encontrado</span>
        </div>
      </main>
    )
  }

  return <ProfileClient user={user} />
}
