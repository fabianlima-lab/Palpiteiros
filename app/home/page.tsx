import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import { HomeClient } from './HomeClient'

export default async function HomePage() {
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

  const demoUser = await prisma.user.findFirst({
    where: { username: 'torcedor_demo' },
  })

  const influencers = await prisma.influencer.findMany({
    orderBy: { trustScore: 'desc' },
    take: 5,
  })

  const topUsers = await prisma.user.findMany({
    orderBy: { points: 'desc' },
    take: 5,
  })

  const myTeamRumors = rumors.filter(r => r.toTeam === 'Flamengo' || r.fromTeam === 'Flamengo')

  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header />

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Hot Topics */}
        <div style={{ fontSize: '12px', color: '#ff1744', marginBottom: '12px', letterSpacing: '1px', fontWeight: '600' }}>
          🔥 EM ALTA NO MENGÃO
        </div>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '8px' }}>
          {myTeamRumors.map((rumor) => (
            <Link
              key={rumor.id}
              href={`/rumor/${rumor.id}`}
              style={{
                flexShrink: 0,
                background: 'linear-gradient(135deg, #2a1515 0%, #1a0a0a 100%)',
                border: '1px solid #4a2020',
                borderRadius: '16px',
                padding: '20px',
                minWidth: '160px',
                textDecoration: 'none'
              }}
            >
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#ff1744', marginBottom: '8px' }}>
                {Math.round(rumor.sentiment * 100)}%
              </div>
              <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '12px' }}>
                {rumor.playerName} → {rumor.toTeam}
              </div>
              {rumor.signals.length > 0 && (
                <div style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  background: 'rgba(255, 23, 68, 0.2)',
                  color: '#ff1744',
                  padding: '5px 10px',
                  borderRadius: '20px'
                }}>
                  📰 {rumor.signals.length} {rumor.signals.length === 1 ? 'sinal' : 'sinais'}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Top Influenciadores */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
          📰 TOP INFLUENCIADORES
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '8px' }}>
          {influencers.map((inf, index) => (
            <Link key={inf.id} href={`/influenciador/${inf.id}`} style={{
              flexShrink: 0,
              backgroundColor: '#16162a',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              padding: '14px',
              minWidth: '100px',
              textAlign: 'center',
              textDecoration: 'none'
            }}>
              <div style={{ fontSize: '10px', color: '#666680', marginBottom: '8px' }}>#{index + 1}</div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ff1744, #8B0000)',
                color: 'white'
              }}>
                {inf.name.charAt(0)}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                {inf.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#00f5a0' }}>
                {Math.round(inf.trustScore * 100)}%
              </div>
              <div style={{ fontSize: '10px', color: '#666680' }}>acertos</div>
            </Link>
          ))}
        </div>

        {/* Top Palpiteiros */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
          🏆 TOP PALPITEIROS
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '8px' }}>
          {topUsers.map((user, index) => (
            <div key={user.id} style={{
              flexShrink: 0,
              backgroundColor: '#16162a',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              padding: '14px',
              minWidth: '100px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '10px', color: '#666680', marginBottom: '8px' }}>#{index + 1}</div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #00d9f5, #0088cc)',
                color: 'white'
              }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                {user.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#00f5a0' }}>
                {user.points.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#666680' }}>pontos</div>
            </div>
          ))}
        </div>

        {/* Rumores Ativos */}
        {myTeamRumors.length > 0 && (
          <>
            <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
              📊 RUMORES ATIVOS
            </div>
            <HomeClient rumors={myTeamRumors} userId={demoUser?.id} />
          </>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
