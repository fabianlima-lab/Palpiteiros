import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '../../components/Header'
import { BottomNav } from '../../components/BottomNav'
import { SocialPostCard } from '../../components/SocialPostCard'
import { RumorDetailClient } from './RumorDetailClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RumorDetailPage({ params }: PageProps) {
  const { id } = await params

  const rumor = await prisma.rumor.findUnique({
    where: { id },
    include: {
      signals: {
        include: {
          influencer: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      predictions: true,
      socialPosts: {
        orderBy: { postedAt: 'desc' },
      },
    },
  })

  if (!rumor) {
    notFound()
  }

  const demoUser = await prisma.user.findFirst({
    where: { username: 'torcedor_demo' },
  })

  const userPrediction = rumor.predictions.find(p => p.userId === demoUser?.id)
  const sentimentPercent = Math.round(rumor.sentiment * 100)
  const favorableSignals = rumor.signals.filter(s => s.signal === 'favoravel')
  const unfavorableSignals = rumor.signals.filter(s => s.signal === 'desfavoravel')

  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header title="Detalhes" showBack />

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Rumor Hero */}
        <div style={{
          backgroundColor: '#16162a',
          border: '1px solid #2a2a3e',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            {rumor.fromTeam && (
              <>
                <span style={{ fontSize: '13px', color: '#a0a0b0' }}>{rumor.fromTeam}</span>
                <span style={{ fontSize: '12px', color: '#666680' }}>→</span>
              </>
            )}
            <span style={{ fontSize: '13px', color: '#ff1744', fontWeight: '600' }}>{rumor.toTeam}</span>
          </div>

          <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '12px', lineHeight: '1.4' }}>{rumor.title}</h1>

          {rumor.description && (
            <p style={{ fontSize: '13px', color: '#a0a0b0', lineHeight: '1.5', marginBottom: '16px' }}>{rumor.description}</p>
          )}

          {/* Big Sentiment Number */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#00f5a0', marginBottom: '4px' }}>{sentimentPercent}%</div>
            <div style={{ fontSize: '12px', color: '#666680' }}>sentimento favorável</div>
          </div>

          {/* Sentiment Indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00f5a0' }}></div>
              <span style={{ color: '#00f5a0', fontSize: '12px' }}>{favorableSignals.length} favoráveis</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff1744' }}></div>
              <span style={{ color: '#ff1744', fontSize: '12px' }}>{unfavorableSignals.length} desfavoráveis</span>
            </div>
          </div>

          {/* Sentiment Bar */}
          <div style={{
            height: '8px',
            backgroundColor: '#2a2a3e',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '12px'
          }}>
            <div style={{
              height: '100%',
              width: `${sentimentPercent}%`,
              background: 'linear-gradient(90deg, #00f5a0, #00d9f5)',
              borderRadius: '4px'
            }}></div>
          </div>

          <p style={{ fontSize: '12px', color: '#666680', textAlign: 'center' }}>👥 {rumor.predictions.length} palpites</p>
        </div>

        {/* Vote Section */}
        <RumorDetailClient
          rumorId={rumor.id}
          userId={demoUser?.id}
          userPrediction={userPrediction?.prediction}
        />

        {/* Signals Section */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px', marginTop: '24px' }}>
          📢 SINAIS DOS INFLUENCIADORES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rumor.signals.map((signal) => (
            <Link
              key={signal.id}
              href={`/influenciador/${signal.influencer.id}`}
              style={{
                backgroundColor: '#16162a',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                padding: '14px',
                textDecoration: 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff1744, #8B0000)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'white'
                  }}>
                    {signal.influencer.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{signal.influencer.name}</div>
                    <div style={{ fontSize: '11px', color: '#666680' }}>{signal.influencer.outlet}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: '16px',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  backgroundColor: signal.signal === 'favoravel' ? 'rgba(0, 245, 160, 0.15)' : 'rgba(255, 23, 68, 0.15)'
                }}>
                  {signal.signal === 'favoravel' ? '👍' : '👎'}
                </span>
              </div>

              {signal.reasoning && (
                <p style={{ fontSize: '12px', color: '#a0a0b0', fontStyle: 'italic', marginBottom: '8px' }}>
                  &quot;{signal.reasoning}&quot;
                </p>
              )}

              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#666680' }}>
                <span>{Math.round(signal.confidence * 100)}% confiança</span>
                {signal.source && (
                  <span>via {signal.source}</span>
                )}
              </div>
            </Link>
          ))}

          {rumor.signals.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>🤐</span>
              <span style={{ color: '#666680', fontSize: '14px' }}>Nenhum sinal ainda</span>
            </div>
          )}
        </div>

        {/* Social Feed */}
        {rumor.socialPosts.length > 0 && (
          <>
            <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px', marginTop: '24px' }}>
              📱 FEED SOCIAL
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {rumor.socialPosts.map((post) => (
                <SocialPostCard
                  key={post.id}
                  platform={post.platform}
                  author={post.author}
                  username={post.username}
                  content={post.content}
                  likes={post.likes}
                  comments={post.comments}
                  shares={post.shares}
                  postedAt={post.postedAt}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
