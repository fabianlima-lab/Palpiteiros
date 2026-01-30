import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'

export default async function RankingPage() {
  const influencers = await prisma.influencer.findMany({
    orderBy: { trustScore: 'desc' },
  })

  // Top 3 para o pódio
  const top3 = influencers.slice(0, 3)
  const rest = influencers.slice(3)

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return ''
  }

  const getPodiumStyle = (rank: number) => {
    if (rank === 1) return {
      borderColor: '#FFD700',
      bgGradient: 'linear-gradient(135deg, #2a2a15 0%, #1a1a0a 100%)',
      order: 2,
      height: '140px'
    }
    if (rank === 2) return {
      borderColor: '#C0C0C0',
      bgGradient: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
      order: 1,
      height: '120px'
    }
    if (rank === 3) return {
      borderColor: '#CD7F32',
      bgGradient: 'linear-gradient(135deg, #2a1a15 0%, #1a0f0a 100%)',
      order: 3,
      height: '100px'
    }
    return { borderColor: '#2a2a3e', bgGradient: '', order: 4, height: '80px' }
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
            backgroundColor: 'rgba(255, 23, 68, 0.2)',
            color: '#ff1744',
            border: '1px solid rgba(255, 23, 68, 0.3)',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            📰 Influenciadores
          </Link>
          <Link href="/ranking/usuarios" style={{
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
            👥 Usuários
          </Link>
        </div>

        {/* Podium Section */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
          🏆 TOP INFLUENCIADORES
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '8px',
          marginBottom: '24px'
        }}>
          {top3.map((influencer, index) => {
            const rank = index + 1
            const style = getPodiumStyle(rank)
            const accuracy = Math.round(influencer.trustScore * 100)

            return (
              <Link
                key={influencer.id}
                href={`/influenciador/${influencer.id}`}
                style={{
                  order: style.order,
                  flex: 1,
                  textDecoration: 'none'
                }}
              >
                <div style={{
                  background: style.bgGradient,
                  border: `2px solid ${style.borderColor}`,
                  borderRadius: '16px',
                  padding: '16px 12px',
                  textAlign: 'center',
                  minHeight: style.height
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{getMedalEmoji(rank)}</div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    margin: '0 auto 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #ff1744, #8B0000)',
                    color: 'white',
                    border: `2px solid ${style.borderColor}`
                  }}>
                    {influencer.name.charAt(0)}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>
                    {influencer.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666680', marginBottom: '6px' }}>
                    {influencer.outlet}
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#00f5a0', marginBottom: '4px' }}>
                    {accuracy}%
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '11px' }}>
                    <span style={{ color: '#00f5a0' }}>{influencer.totalHits}✓</span>
                    <span style={{ color: '#ff1744' }}>{influencer.totalMisses}✗</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Rest of Ranking */}
        {rest.length > 0 && (
          <>
            <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
              📊 RANKING COMPLETO
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rest.map((influencer, index) => {
                const rank = index + 4
                const accuracy = Math.round(influencer.trustScore * 100)

                return (
                  <Link
                    key={influencer.id}
                    href={`/influenciador/${influencer.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: '#16162a',
                      border: '1px solid #2a2a3e',
                      borderRadius: '12px',
                      padding: '12px',
                      textDecoration: 'none'
                    }}
                  >
                    <div style={{ width: '32px', textAlign: 'center', fontSize: '14px', color: '#666680', fontWeight: '600' }}>
                      #{rank}
                    </div>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                      background: 'linear-gradient(135deg, #ff1744, #8B0000)',
                      color: 'white'
                    }}>
                      {influencer.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                        {influencer.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666680' }}>
                        {influencer.outlet}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: accuracy >= 80 ? '#00f5a0' : accuracy >= 60 ? '#ffab00' : '#ff1744'
                      }}>
                        {accuracy}%
                      </div>
                      <div style={{ fontSize: '11px', color: '#666680' }}>
                        {influencer.totalHits}✓ {influencer.totalMisses}✗
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* Info Card */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          backgroundColor: '#16162a',
          border: '1px solid #2a2a3e',
          borderRadius: '12px',
          padding: '14px',
          marginTop: '24px'
        }}>
          <div style={{ fontSize: '20px' }}>💡</div>
          <div style={{ fontSize: '12px', color: '#a0a0b0', lineHeight: '1.5' }}>
            O Trust Score é calculado com base no histórico de acertos de cada influenciador.
            Quanto maior a porcentagem, mais confiável o influenciador tem sido.
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
