import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import { RumorCard } from '../components/RumorCard'
import { SmartSearch } from '../components/SmartSearch'

export default async function ExplorarPage() {
  const rumors = await prisma.rumor.findMany({
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

  const categories = [
    { id: 'all', name: 'Todos', emoji: '🔥' },
    { id: 'transferencia', name: 'Transferências', emoji: '✈️' },
    { id: 'contrato', name: 'Contratos', emoji: '📝' },
    { id: 'lesao', name: 'Lesões', emoji: '🏥' },
  ]

  const topInfluencers = await prisma.influencer.findMany({
    orderBy: { trustScore: 'desc' },
    take: 5,
  })

  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header title="Explorar" />

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Smart Search Bar */}
        <div style={{ marginBottom: '16px' }}>
          <SmartSearch placeholder="Buscar jogadores, times, rumores..." />
        </div>

        {/* Categories */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          marginBottom: '20px',
          paddingBottom: '8px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: cat.id === 'all' ? 'rgba(255, 23, 68, 0.2)' : '#16162a',
                color: cat.id === 'all' ? '#ff1744' : '#a0a0b0',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Featured Influencers */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
          🏆 INFLUENCIADORES EM DESTAQUE
        </div>
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          marginBottom: '24px',
          paddingBottom: '8px'
        }}>
          {topInfluencers.map((influencer) => (
            <Link
              key={influencer.id}
              href={`/influenciador/${influencer.id}`}
              style={{
                flexShrink: 0,
                backgroundColor: '#16162a',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                padding: '14px',
                minWidth: '100px',
                textAlign: 'center',
                textDecoration: 'none'
              }}
            >
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
                {influencer.name.charAt(0)}
              </div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                {influencer.name.split(' ')[0]}
              </p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#00f5a0', margin: 0 }}>
                {Math.round(influencer.trustScore * 100)}%
              </p>
            </Link>
          ))}
        </div>

        {/* All Rumors */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
          📊 TODOS OS RUMORES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rumors.map((rumor) => (
            <RumorCard
              key={rumor.id}
              id={rumor.id}
              playerName={rumor.playerName}
              playerImage={rumor.playerImage}
              fromTeam={rumor.fromTeam}
              toTeam={rumor.toTeam}
              title={rumor.title}
              sentiment={rumor.sentiment}
              closesAt={rumor.closesAt}
              signals={rumor.signals}
              predictions={rumor.predictions}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
