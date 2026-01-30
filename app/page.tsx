import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BottomNav } from './components/BottomNav'

const TEAMS = [
  { id: 'flamengo', name: 'Flamengo', emoji: '🔴⚫' },
  { id: 'corinthians', name: 'Corinthians', emoji: '⚫⚪' },
  { id: 'palmeiras', name: 'Palmeiras', emoji: '💚' },
  { id: 'santos', name: 'Santos', emoji: '⚪⚫' },
  { id: 'sao-paulo', name: 'São Paulo', emoji: '🔴⚪⚫' },
  { id: 'botafogo', name: 'Botafogo', emoji: '⭐⚫' },
  { id: 'fluminense', name: 'Fluminense', emoji: '🟢🟣⚪' },
  { id: 'vasco', name: 'Vasco', emoji: '⚫⚪' },
  { id: 'atletico-mg', name: 'Atlético-MG', emoji: '⚫⚪' },
  { id: 'cruzeiro', name: 'Cruzeiro', emoji: '💙' },
  { id: 'internacional', name: 'Inter', emoji: '🔴⚪' },
  { id: 'gremio', name: 'Grêmio', emoji: '💙🖤⚪' },
]

const FAKE_TWEETS = [
  {
    id: 1,
    name: 'Pedro Torcedor',
    handle: '@pedrofla',
    avatar: 'P',
    content: 'Meu #palpite pro Gabigol: vai ficar no Flamengo sim! 🔴⚫',
    likes: 234,
    retweets: 45,
  },
  {
    id: 2,
    name: 'Maria Futebol',
    handle: '@mariafut',
    avatar: 'M',
    content: 'Neymar no Flamengo vai rolar! Meu #palpite é favorável 🔥',
    likes: 892,
    retweets: 156,
  },
]

export default async function LandingPage() {
  const influencers = await prisma.influencer.findMany({
    orderBy: { trustScore: 'desc' },
    take: 5,
  })

  const topUsers = await prisma.user.findMany({
    orderBy: { points: 'desc' },
    take: 5,
  })

  const popularRumors = await prisma.rumor.findMany({
    where: { status: 'ACTIVE' },
    include: {
      signals: true,
      predictions: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  return (
    <main style={{ background: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero Section - Compacto */}
      <div style={{
        background: 'linear-gradient(180deg, #1a0a0a 0%, #0f0f1a 100%)',
        padding: '24px 16px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #8B0000, #000)',
          borderRadius: '16px',
          margin: '0 auto 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px'
        }}>🔴</div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', background: 'linear-gradient(135deg, #ff1744, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Palpiteiro
        </h1>
        <p style={{ fontSize: '14px', color: '#a0a0b0', marginBottom: '16px' }}>
          O termômetro dos rumores do futebol brasileiro
        </p>
        <Link href="/onboarding" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'linear-gradient(135deg, #ff1744, #8B0000)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none'
        }}>
          Escolher meu time 🚀
        </Link>
      </div>

      <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Teams Grid - 4 colunas */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>⚽ ESCOLHA SEU TIME</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: '20px'
        }}>
          {TEAMS.map((team) => (
            <Link
              key={team.id}
              href={team.id === 'flamengo' ? '/home' : `/time/${team.id}`}
              style={{
                background: '#16162a',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                padding: '12px 4px',
                textAlign: 'center',
                textDecoration: 'none'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{team.emoji}</div>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#fff' }}>{team.name}</div>
            </Link>
          ))}
        </div>

        {/* Top Influenciadores - Compacto */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '10px', letterSpacing: '1px' }}>📰 TOP INFLUENCIADORES</div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px' }}>
          {influencers.map((inf, index) => (
            <Link key={inf.id} href={`/influenciador/${inf.id}`} style={{
              flexShrink: 0,
              background: '#16162a',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              padding: '12px',
              minWidth: '90px',
              textAlign: 'center',
              textDecoration: 'none'
            }}>
              <div style={{ fontSize: '10px', color: '#666680', marginBottom: '6px' }}>#{index + 1}</div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                margin: '0 auto 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ff1744, #8B0000)',
                color: 'white'
              }}>
                {inf.name.charAt(0)}
              </div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>
                {inf.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#00f5a0' }}>
                {Math.round(inf.trustScore * 100)}%
              </div>
            </Link>
          ))}
        </div>

        {/* Top Palpiteiros - Compacto */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '10px', letterSpacing: '1px' }}>🏆 TOP PALPITEIROS</div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px' }}>
          {topUsers.map((user, index) => (
            <div key={user.id} style={{
              flexShrink: 0,
              background: '#16162a',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              padding: '12px',
              minWidth: '90px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '10px', color: '#666680', marginBottom: '6px' }}>#{index + 1}</div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                margin: '0 auto 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #00d9f5, #0088cc)',
                color: 'white'
              }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>
                {user.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#00f5a0' }}>
                {user.points.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Tweets - Compacto */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '10px', letterSpacing: '1px' }}>𝕏 PALPITEIROS NO X</div>
        <div style={{ marginBottom: '20px' }}>
          {FAKE_TWEETS.map((tweet) => (
            <div key={tweet.id} style={{
              background: '#16162a',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#1e2235',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>{tweet.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{tweet.name}</div>
                  <div style={{ fontSize: '11px', color: '#666680' }}>{tweet.handle}</div>
                </div>
                <span style={{ fontSize: '14px', color: '#666680' }}>𝕏</span>
              </div>
              <p style={{ fontSize: '13px', color: '#fff', lineHeight: '1.4', marginBottom: '8px' }}>
                {tweet.content.split('#palpite').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <span style={{ color: '#ff1744' }}>#palpite</span>}
                  </span>
                ))}
              </p>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#666680' }}>
                <span>❤️ {tweet.likes}</span>
                <span>🔄 {tweet.retweets}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Rumores - Compacto */}
        {popularRumors.length > 0 && (
          <>
            <div style={{ fontSize: '11px', color: '#666680', marginBottom: '10px', letterSpacing: '1px' }}>🔥 RUMORES QUENTES</div>
            <div style={{ marginBottom: '20px' }}>
              {popularRumors.map((rumor) => {
                const favorableSignals = rumor.signals.filter(s => s.sentiment === 'FAVORABLE').length
                const totalSignals = rumor.signals.length
                const sentimentPercent = totalSignals > 0 ? Math.round((favorableSignals / totalSignals) * 100) : 50

                return (
                  <Link key={rumor.id} href={`/rumor/${rumor.id}`} style={{
                    display: 'block',
                    background: '#16162a',
                    border: '1px solid #2a2a3e',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '8px',
                    textDecoration: 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '16px' }}>🔴⚫</span>
                      <span style={{
                        fontSize: '10px',
                        background: 'rgba(255, 23, 68, 0.15)',
                        color: '#ff1744',
                        padding: '3px 8px',
                        borderRadius: '10px'
                      }}>{rumor.category}</span>
                    </div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '6px', lineHeight: '1.3' }}>
                      {rumor.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                      <span style={{ color: '#00f5a0', fontWeight: '600' }}>{sentimentPercent}% favorável</span>
                      <span style={{ color: '#666680' }}>{rumor.predictions.length} palpites</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* CTA Final - Compacto */}
        <div style={{
          background: 'linear-gradient(135deg, #2a1515 0%, #1a0a0a 100%)',
          border: '1px solid #4a2020',
          borderRadius: '12px',
          padding: '20px 16px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#fff' }}>Pronto para começar?</h3>
          <p style={{ fontSize: '13px', color: '#a0a0b0', marginBottom: '16px' }}>
            Escolha seu time e mostre que você entende de futebol!
          </p>
          <Link href="/onboarding" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #ff1744, #8B0000)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Criar minha conta 🚀
          </Link>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
