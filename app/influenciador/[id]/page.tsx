import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '../../components/Header'
import { BottomNav } from '../../components/BottomNav'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function InfluencerProfilePage({ params }: PageProps) {
  const { id } = await params

  const influencer = await prisma.influencer.findUnique({
    where: { id },
    include: {
      signals: {
        include: {
          rumor: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!influencer) {
    notFound()
  }

  const accuracy = Math.round(influencer.trustScore * 100)
  const favorableSignals = influencer.signals.filter(s => s.signal === 'favoravel')
  const unfavorableSignals = influencer.signals.filter(s => s.signal === 'desfavoravel')

  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header title={influencer.name} showBack />

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Profile Hero */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff1744, #8B0000)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: '700',
            color: 'white',
            margin: '0 auto 12px',
            border: '3px solid #2a2a3e'
          }}>
            {influencer.name.charAt(0)}
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{influencer.name}</h1>
          <p style={{ fontSize: '14px', color: '#666680', marginBottom: '4px' }}>@{influencer.username}</p>
          <p style={{ fontSize: '13px', color: '#a0a0b0', marginBottom: '16px' }}>{influencer.outlet}</p>

          {/* Big Trust Score */}
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#00f5a0', marginBottom: '4px' }}>{accuracy}%</div>
            <div style={{ fontSize: '12px', color: '#666680' }}>Trust Score</div>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
            {influencer.twitter && (
              <a href={influencer.twitter} target="_blank" rel="noopener noreferrer" style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#16162a',
                border: '1px solid #2a2a3e',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                textDecoration: 'none'
              }}>𝕏</a>
            )}
            {influencer.instagram && (
              <a href={influencer.instagram} target="_blank" rel="noopener noreferrer" style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#16162a',
                border: '1px solid #2a2a3e',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                textDecoration: 'none'
              }}>📸</a>
            )}
            {influencer.youtube && (
              <a href={influencer.youtube} target="_blank" rel="noopener noreferrer" style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#16162a',
                border: '1px solid #2a2a3e',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                textDecoration: 'none'
              }}>▶️</a>
            )}
            {influencer.tiktok && (
              <a href={influencer.tiktok} target="_blank" rel="noopener noreferrer" style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#16162a',
                border: '1px solid #2a2a3e',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                textDecoration: 'none'
              }}>🎵</a>
            )}
          </div>

          <p style={{ fontSize: '13px', color: '#666680' }}>
            {influencer.followers.toLocaleString()} seguidores
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#00f5a0', marginBottom: '4px' }}>{influencer.totalHits}</div>
            <div style={{ fontSize: '11px', color: '#666680' }}>Acertos</div>
          </div>
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#ff1744', marginBottom: '4px' }}>{influencer.totalMisses}</div>
            <div style={{ fontSize: '11px', color: '#666680' }}>Erros</div>
          </div>
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{influencer.signals.length}</div>
            <div style={{ fontSize: '11px', color: '#666680' }}>Sinais</div>
          </div>
        </div>

        {/* Promo Area */}
        {influencer.promoTitle && influencer.promoUrl && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>🎯 CONTEÚDO EXCLUSIVO</div>
            <a
              href={influencer.promoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255, 23, 68, 0.1)',
                border: '1px solid rgba(255, 23, 68, 0.3)',
                borderRadius: '12px',
                padding: '14px',
                textDecoration: 'none'
              }}
            >
              <div style={{ fontSize: '24px' }}>🔗</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{influencer.promoTitle}</div>
                <div style={{ fontSize: '12px', color: '#666680' }}>Clique para acessar</div>
              </div>
              <div style={{ color: '#ff1744' }}>→</div>
            </a>
          </div>
        )}

        {/* Bio */}
        {influencer.bio && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>📝 SOBRE</div>
            <p style={{
              fontSize: '13px',
              color: '#a0a0b0',
              lineHeight: '1.6',
              backgroundColor: '#16162a',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              padding: '14px'
            }}>{influencer.bio}</p>
          </div>
        )}

        {/* Signal Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            backgroundColor: 'rgba(0, 245, 160, 0.1)',
            border: '1px solid rgba(0, 245, 160, 0.3)',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#00f5a0', marginBottom: '4px' }}>{favorableSignals.length}</div>
            <div style={{ fontSize: '11px', color: '#00f5a0' }}>Favoráveis</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 23, 68, 0.1)',
            border: '1px solid rgba(255, 23, 68, 0.3)',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#ff1744', marginBottom: '4px' }}>{unfavorableSignals.length}</div>
            <div style={{ fontSize: '11px', color: '#ff1744' }}>Desfavoráveis</div>
          </div>
        </div>

        {/* Recent Signals */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>📢 ÚLTIMOS SINAIS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {influencer.signals.map((signal) => (
            <Link
              key={signal.id}
              href={`/rumor/${signal.rumor.id}`}
              style={{
                backgroundColor: '#16162a',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                padding: '14px',
                textDecoration: 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  backgroundColor: signal.signal === 'favoravel' ? 'rgba(0, 245, 160, 0.15)' : 'rgba(255, 23, 68, 0.15)',
                  color: signal.signal === 'favoravel' ? '#00f5a0' : '#ff1744'
                }}>
                  {signal.signal === 'favoravel' ? '👍 FAVORÁVEL' : '👎 DESFAVORÁVEL'}
                </span>
                <span style={{ fontSize: '11px', color: '#666680' }}>
                  {new Date(signal.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </span>
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: '0 0 8px 0' }}>{signal.rumor.title}</h3>
              {signal.reasoning && (
                <p style={{ fontSize: '12px', color: '#a0a0b0', fontStyle: 'italic', margin: '0 0 8px 0' }}>
                  &quot;{signal.reasoning}&quot;
                </p>
              )}
              <div style={{ fontSize: '11px', color: '#666680' }}>
                Confiança: {Math.round(signal.confidence * 100)}%
              </div>
            </Link>
          ))}

          {influencer.signals.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>🤐</span>
              <span style={{ color: '#666680', fontSize: '14px' }}>Nenhum sinal ainda</span>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
