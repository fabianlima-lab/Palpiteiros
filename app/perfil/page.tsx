import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'

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

  const progressToNextLevel = (user.points % 500) / 5

  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header title="Perfil" />

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Profile Hero */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00d9f5, #0088cc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '700',
              color: 'white',
              border: '3px solid #ff1744'
            }}>
              {user.name.charAt(0)}
            </div>
            {user.isPremium && (
              <div style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '24px',
                height: '24px',
                backgroundColor: '#ffab00',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                border: '2px solid #0f0f1a'
              }}>⭐</div>
            )}
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{user.name}</h1>
          <p style={{ fontSize: '14px', color: '#666680', marginBottom: '12px' }}>@{user.username}</p>

          {user.team && (
            <div style={{
              display: 'inline-block',
              padding: '6px 14px',
              backgroundColor: 'rgba(255, 23, 68, 0.15)',
              borderRadius: '20px',
              fontSize: '13px',
              color: '#ff1744'
            }}>
              ❤️ {user.team}
            </div>
          )}

          {/* Level & Points */}
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            marginTop: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>Nível {user.level}</span>
              <span style={{ fontSize: '14px', color: '#ffab00', fontWeight: '700' }}>{user.points.toLocaleString()} pts</span>
            </div>
            <div style={{
              height: '8px',
              backgroundColor: '#2a2a3e',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '6px'
            }}>
              <div style={{
                height: '100%',
                width: `${progressToNextLevel}%`,
                background: 'linear-gradient(90deg, #ff1744, #ffab00)',
                borderRadius: '4px'
              }}></div>
            </div>
            <p style={{ fontSize: '11px', color: '#666680', margin: 0 }}>
              {500 - (user.points % 500)} pts para o próximo nível
            </p>
          </div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '11px', color: '#666680', marginBottom: '10px', letterSpacing: '1px' }}>🏅 CONQUISTAS</div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {user.badges.map((ub) => (
                  <div key={ub.id} style={{
                    backgroundColor: '#16162a',
                    border: '1px solid #2a2a3e',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }} title={ub.badge.description}>
                    <span>{ub.badge.emoji}</span>
                    <span style={{ color: '#fff' }}>{ub.badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
              {user.predictions.length}
            </div>
            <div style={{ fontSize: '12px', color: '#666680' }}>Palpites</div>
          </div>
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#00f5a0', marginBottom: '4px' }}>
              --%
            </div>
            <div style={{ fontSize: '12px', color: '#666680' }}>Taxa de acerto</div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <Link href="/historico" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textDecoration: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📜</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Histórico de palpites</span>
            </div>
            <span style={{ color: '#666680' }}>→</span>
          </Link>

          <Link href="/assinatura" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textDecoration: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>⭐</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Assinatura Premium</span>
            </div>
            <span style={{ color: '#666680' }}>→</span>
          </Link>

          <Link href="/configuracoes" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textDecoration: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>⚙️</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Configurações</span>
            </div>
            <span style={{ color: '#666680' }}>→</span>
          </Link>

          <Link href="/faq" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textDecoration: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>❓</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>FAQ</span>
            </div>
            <span style={{ color: '#666680' }}>→</span>
          </Link>
        </div>

        {/* Recent Predictions */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
          🎯 ÚLTIMOS PALPITES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {user.predictions.map((prediction) => (
            <Link
              key={prediction.id}
              href={`/rumor/${prediction.rumor.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#16162a',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                padding: '14px',
                textDecoration: 'none'
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#fff', margin: 0, marginBottom: '4px' }}>
                  {prediction.rumor.title}
                </p>
                <p style={{ fontSize: '11px', color: '#666680', margin: 0 }}>
                  {new Date(prediction.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <span style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: prediction.prediction ? 'rgba(0, 245, 160, 0.15)' : 'rgba(255, 23, 68, 0.15)'
              }}>
                {prediction.prediction ? '👍' : '👎'}
              </span>
            </Link>
          ))}

          {user.predictions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>🎯</span>
              <span style={{ color: '#666680', fontSize: '14px' }}>Nenhum palpite ainda</span>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
