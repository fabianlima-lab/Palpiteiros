import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Header } from '../../components/Header'
import { BottomNav } from '../../components/BottomNav'

export default async function UsersRankingPage() {
  const users = await prisma.user.findMany({
    include: {
      badges: {
        include: {
          badge: true,
        },
      },
      _count: {
        select: { predictions: true },
      },
    },
    orderBy: { points: 'desc' },
    take: 50,
  })

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header title="Ranking" />

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <Link href="/ranking" style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#16162a',
            color: '#666680',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '500',
            textDecoration: 'none'
          }}>
            📰 Influenciadores
          </Link>
          <Link href="/ranking/usuarios" style={{
            flex: 1,
            padding: '12px',
            backgroundColor: 'rgba(255, 23, 68, 0.2)',
            color: '#ff1744',
            border: '1px solid rgba(255, 23, 68, 0.3)',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            👥 Usuários
          </Link>
        </div>

        {/* Users Ranking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {users.map((user, index) => (
            <Link key={user.id} href={`/usuario/${user.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#16162a',
                borderRadius: '12px',
                border: '1px solid #2a2a3e',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {/* Rank */}
                <div style={{ width: '32px', textAlign: 'center', flexShrink: 0 }}>
                  <span style={{
                    fontSize: index < 3 ? '18px' : '13px',
                    color: index < 3 ? undefined : '#666680',
                    fontWeight: index < 3 ? undefined : '600'
                  }}>
                    {getRankEmoji(index + 1)}
                  </span>
                </div>

                {/* Avatar */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #00d9f5, #0088cc)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  {user.name.charAt(0)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '14px',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{user.name}</h3>
                    {user.isPremium && <span style={{ fontSize: '12px' }}>⭐</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    {user.badges.slice(0, 3).map((ub) => (
                      <span key={ub.id} style={{ fontSize: '12px' }} title={ub.badge.name}>
                        {ub.badge.emoji}
                      </span>
                    ))}
                    <span style={{ color: '#666680', fontSize: '11px' }}>Nível {user.level}</span>
                  </div>
                </div>

                {/* Points */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: '#ffab00', fontWeight: '700', fontSize: '18px' }}>
                    {user.points.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666680' }}>
                    {user._count.predictions} palpites
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
