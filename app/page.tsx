import Link from 'next/link'
import { prisma } from '@/lib/prisma'

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

// Cores neutras do Palpiteiro (não associadas a nenhum time)
const BRAND = {
  primary: '#8b5cf6', // Roxo
  primaryDark: '#6d28d9',
  secondary: '#06b6d4', // Cyan
  accent: '#f59e0b', // Âmbar/dourado
  success: '#10b981', // Verde esmeralda
}

export default async function LandingPage() {
  const influencers = await prisma.influencer.findMany({
    orderBy: { trustScore: 'desc' },
    take: 3,
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

  const totalPredictions = await prisma.prediction.count()
  const totalUsers = await prisma.user.count()

  return (
    <main style={{ background: '#0a0a12', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>⚽</div>
          <span style={{
            fontSize: '22px',
            fontWeight: '800',
            background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Palpiteiro</span>
        </div>
        <Link href="/home" style={{
          background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
          color: 'white',
          padding: '10px 20px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: '600',
          textDecoration: 'none'
        }}>
          Entrar
        </Link>
      </header>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, #0a0a12 100%)',
        padding: '48px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          marginBottom: '16px',
          lineHeight: '1.15',
          color: '#fff'
        }}>
          O termômetro dos<br />
          <span style={{
            background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>rumores do futebol</span>
        </h1>
        <p style={{ fontSize: '15px', color: '#9ca3af', marginBottom: '28px', maxWidth: '340px', margin: '0 auto 28px', lineHeight: '1.5' }}>
          Acompanhe transferências, veja o que os influenciadores dizem e dê seu palpite
        </p>

        {/* CTA principal */}
        <Link href="/onboarding" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
          color: 'white',
          padding: '16px 36px',
          borderRadius: '14px',
          fontSize: '16px',
          fontWeight: '700',
          textDecoration: 'none',
          boxShadow: `0 8px 32px rgba(139, 92, 246, 0.4)`
        }}>
          Começar agora — é grátis
        </Link>

        {/* Social proof */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '32px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '16px',
          maxWidth: '360px',
          margin: '32px auto 0'
        }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: BRAND.secondary }}>{totalUsers.toLocaleString()}+</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>palpiteiros</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: BRAND.secondary }}>{totalPredictions.toLocaleString()}+</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>palpites</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: BRAND.secondary }}>12</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>times</div>
          </div>
        </div>
      </section>

      <div style={{ padding: '32px 20px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Como funciona - Design horizontal melhorado */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '20px' }}>🎯</span>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>
              Como funciona
            </h2>
          </div>

          {/* Timeline visual */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {[
              { num: '1', title: 'Escolha seu time', desc: 'Siga os rumores do seu clube', icon: '⚽', color: BRAND.primary },
              { num: '2', title: 'Veja os sinais', desc: 'Opiniões dos influenciadores', icon: '📡', color: BRAND.secondary },
              { num: '3', title: 'Dê seu palpite', desc: 'Vote: vai acontecer ou não?', icon: '🎲', color: BRAND.accent },
              { num: '4', title: 'Ganhe pontos', desc: 'Suba no ranking de palpiteiros', icon: '🏆', color: BRAND.success },
            ].map((step) => (
              <div key={step.num} style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Número no fundo */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-5px',
                  fontSize: '80px',
                  fontWeight: '900',
                  color: step.color,
                  opacity: 0.08,
                  lineHeight: 1
                }}>{step.num}</div>

                <div style={{
                  width: '48px',
                  height: '48px',
                  background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '14px',
                  border: `1px solid ${step.color}30`
                }}>{step.icon}</div>

                <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.4' }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Times - Grid melhorado com hover effect */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🏟️</span>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>
                Escolha seu time
              </h2>
            </div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>12 disponíveis</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px'
          }}>
            {TEAMS.map((team) => (
              <Link
                key={team.id}
                href={team.id === 'flamengo' ? '/home' : `/time/${team.id}`}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  padding: '16px 8px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  fontSize: '28px',
                  marginBottom: '8px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}>{team.emoji}</div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#e5e7eb',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>{team.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Rumores Quentes */}
        {popularRumors.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '20px' }}>🔥</span>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>
                Rumores em alta
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {popularRumors.map((rumor) => {
                const favorableSignals = rumor.signals.filter(s => s.signal === 'FAVORABLE').length
                const totalSignals = rumor.signals.length
                const sentimentPercent = totalSignals > 0 ? Math.round((favorableSignals / totalSignals) * 100) : 50

                return (
                  <Link key={rumor.id} href={`/rumor/${rumor.id}`} style={{
                    display: 'block',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px',
                    padding: '16px',
                    textDecoration: 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '10px',
                        background: `rgba(139, 92, 246, 0.2)`,
                        color: BRAND.primary,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>{rumor.category}</span>
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>{rumor.predictions.length} palpites</span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '12px', lineHeight: '1.4' }}>
                      {rumor.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        flex: 1,
                        height: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${sentimentPercent}%`,
                          background: `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.secondary})`,
                          borderRadius: '4px'
                        }} />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: BRAND.secondary }}>{sentimentPercent}%</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Top Influenciadores */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '20px' }}>📰</span>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>
              Top influenciadores
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {influencers.map((inf, index) => (
              <Link key={inf.id} href={`/influenciador/${inf.id}`} style={{
                flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: '16px',
                minWidth: '120px',
                textAlign: 'center',
                textDecoration: 'none'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: index === 0 ? BRAND.accent : '#6b7280',
                  marginBottom: '10px',
                  fontWeight: index === 0 ? '700' : '400'
                }}>
                  {index === 0 ? '🥇 #1' : `#${index + 1}`}
                </div>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  margin: '0 auto 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '700',
                  background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`,
                  color: 'white'
                }}>
                  {inf.name.charAt(0)}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '6px' }}>
                  {inf.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: BRAND.success }}>
                  {Math.round(inf.trustScore * 100)}%
                </div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>acertos</div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section style={{
          background: `linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)`,
          border: `1px solid rgba(139, 92, 246, 0.3)`,
          borderRadius: '20px',
          padding: '32px 24px',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚽</div>
          <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px', color: '#fff' }}>
            Pronto para mostrar que você entende de futebol?
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>
            Crie sua conta grátis e comece a palpitar agora
          </p>
          <Link href="/onboarding" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
            color: 'white',
            padding: '16px 36px',
            borderRadius: '14px',
            fontSize: '16px',
            fontWeight: '700',
            textDecoration: 'none',
            boxShadow: `0 8px 32px rgba(139, 92, 246, 0.4)`
          }}>
            Criar conta grátis
          </Link>
        </section>

        {/* Footer simples */}
        <footer style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px' }}>
            <Link href="/faq" style={{ color: '#6b7280', fontSize: '13px', textDecoration: 'none' }}>FAQ</Link>
            <Link href="/politicas" style={{ color: '#6b7280', fontSize: '13px', textDecoration: 'none' }}>Políticas</Link>
          </div>
          <p style={{ fontSize: '12px', color: '#4b5563' }}>
            © 2025 Palpiteiro. Apenas entretenimento.
          </p>
        </footer>
      </div>
    </main>
  )
}
