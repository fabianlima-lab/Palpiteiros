'use client'

import { useState } from 'react'
import Link from 'next/link'

// Design System do PRD
const COLORS = {
  bgPrimary: '#09090B',
  bgSecondary: '#18181B',
  bgTertiary: '#0F0F12',
  bgElevated: '#1F1F23',
  borderPrimary: '#27272A',
  textPrimary: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  accentGreen: '#10B981',
  accentGreenLight: '#34D399',
  accentGreenDark: '#059669',
  colorVai: '#10B981',
  colorNao: '#EF4444',
  colorQuente: '#F97316',
}

const TIMES = [
  { id: 'flamengo', nome: 'Flamengo', emoji: '🔴', cor: '#E11D48' },
  { id: 'corinthians', nome: 'Corinthians', emoji: '⚫', cor: '#18181B' },
  { id: 'palmeiras', nome: 'Palmeiras', emoji: '💚', cor: '#16A34A' },
  { id: 'santos', nome: 'Santos', emoji: '⚪', cor: '#E5E7EB' },
  { id: 'sao-paulo', nome: 'São Paulo', emoji: '🔴', cor: '#DC2626' },
  { id: 'botafogo', nome: 'Botafogo', emoji: '⭐', cor: '#FBBF24' },
  { id: 'fluminense', nome: 'Fluminense', emoji: '🟢', cor: '#7C3AED' },
  { id: 'vasco', nome: 'Vasco', emoji: '⚫', cor: '#1F2937' },
  { id: 'atletico-mg', nome: 'Atlético-MG', emoji: '⚫', cor: '#27272A' },
  { id: 'cruzeiro', nome: 'Cruzeiro', emoji: '💙', cor: '#2563EB' },
  { id: 'internacional', nome: 'Inter', emoji: '🔴', cor: '#B91C1C' },
  { id: 'gremio', nome: 'Grêmio', emoji: '💙', cor: '#0EA5E9' },
]

// Dados mockados de rumores
const RUMORES_MOCK = [
  {
    id: '1',
    time: 'Flamengo',
    timeId: 'flamengo',
    timeColor: '#E11D48',
    jogador: 'Neymar Jr.',
    titulo: 'Neymar fecha com o Flamengo em 2025?',
    percentualVai: 73,
    totalPalpites: 2847,
    comentarios: 156,
    tempo: '2h',
    quente: true,
    influenciadores: [
      { nome: 'Venê Casagrande', palpite: 'vai', acertos: 92 },
      { nome: 'Jorge Nicola', palpite: 'nao', acertos: 78 },
    ]
  },
  {
    id: '2',
    time: 'Cruzeiro',
    timeId: 'cruzeiro',
    timeColor: '#2563EB',
    jogador: 'Gabigol',
    titulo: 'Gabigol acerta com o Cruzeiro?',
    percentualVai: 89,
    totalPalpites: 4521,
    comentarios: 312,
    tempo: '45min',
    quente: true,
    influenciadores: [
      { nome: 'Venê Casagrande', palpite: 'vai', acertos: 92 },
      { nome: 'Raisa Simplicio', palpite: 'vai', acertos: 88 },
    ]
  },
  {
    id: '3',
    time: 'Palmeiras',
    timeId: 'palmeiras',
    timeColor: '#16A34A',
    jogador: 'Andreas Pereira',
    titulo: 'Andreas Pereira volta ao Brasil pelo Palmeiras?',
    percentualVai: 34,
    totalPalpites: 892,
    comentarios: 67,
    tempo: '5h',
    quente: false,
    influenciadores: [
      { nome: 'Jorge Nicola', palpite: 'nao', acertos: 78 },
    ]
  },
  {
    id: '4',
    time: 'Corinthians',
    timeId: 'corinthians',
    timeColor: '#18181B',
    jogador: 'Dudu',
    titulo: 'Dudu troca Palmeiras pelo Corinthians?',
    percentualVai: 12,
    totalPalpites: 3102,
    comentarios: 498,
    tempo: '1h',
    quente: true,
    influenciadores: [
      { nome: 'Marcelo Bechler', palpite: 'nao', acertos: 95 },
    ]
  },
  {
    id: '5',
    time: 'São Paulo',
    timeId: 'sao-paulo',
    timeColor: '#DC2626',
    jogador: 'Oscar',
    titulo: 'Oscar fecha retorno ao São Paulo?',
    percentualVai: 67,
    totalPalpites: 1876,
    comentarios: 89,
    tempo: '3h',
    quente: false,
    influenciadores: [
      { nome: 'Raisa Simplicio', palpite: 'vai', acertos: 88 },
    ]
  },
]

const TOP_PALPITEIROS = [
  { nome: 'pedrosilva', acertos: 94, palpites: 127 },
  { nome: 'mariacampos', acertos: 91, palpites: 98 },
  { nome: 'joaomengo', acertos: 89, palpites: 156 },
  { nome: 'rafinhatimao', acertos: 87, palpites: 203 },
  { nome: 'gabiverdao', acertos: 85, palpites: 89 },
]

// Componente Card de Rumor
function RumorCard({ rumor }: { rumor: typeof RUMORES_MOCK[0] }) {
  const [voted, setVoted] = useState<'vai' | 'nao' | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '20px',
        borderBottom: `1px solid ${COLORS.borderPrimary}`,
        cursor: 'pointer',
        position: 'relative',
        background: isHovered ? COLORS.bgTertiary : 'transparent',
        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Barra lateral colorida */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '3px',
        background: rumor.timeColor,
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
      }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: '4px',
          background: `${rumor.timeColor}20`,
          color: rumor.timeColor,
        }}>
          {rumor.time}
        </span>
        <span style={{ fontSize: '12px', color: COLORS.textMuted }}>{rumor.tempo}</span>
        {rumor.quente && (
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            color: COLORS.colorQuente,
            background: `${COLORS.colorQuente}20`,
            padding: '3px 8px',
            borderRadius: '4px',
            marginLeft: 'auto',
            animation: 'pulse 2s infinite',
          }}>
            🔥 QUENTE
          </span>
        )}
      </div>

      {/* Título */}
      <h3 style={{
        fontSize: '17px',
        fontWeight: 600,
        lineHeight: 1.4,
        marginBottom: '14px',
        color: COLORS.textPrimary,
      }}>
        {rumor.titulo}
      </h3>

      {/* Barra de Progresso */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{
          height: '8px',
          background: COLORS.borderPrimary,
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '6px',
        }}>
          <div style={{
            height: '100%',
            width: `${rumor.percentualVai}%`,
            background: rumor.percentualVai > 50
              ? `linear-gradient(90deg, ${COLORS.accentGreen}, ${COLORS.accentGreenLight})`
              : `linear-gradient(90deg, #6B7280, #9CA3AF)`,
            borderRadius: '4px',
            transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          fontFamily: "'JetBrains Mono', monospace",
          color: COLORS.textMuted,
        }}>
          <span style={{
            color: rumor.percentualVai > 50 ? COLORS.accentGreen : COLORS.textMuted,
            fontWeight: rumor.percentualVai > 50 ? 600 : 400,
          }}>
            {rumor.percentualVai}% VAI
          </span>
          <span style={{
            color: rumor.percentualVai <= 50 ? COLORS.colorNao : COLORS.textMuted,
            fontWeight: rumor.percentualVai <= 50 ? 600 : 400,
          }}>
            {100 - rumor.percentualVai}% NÃO VAI
          </span>
        </div>
      </div>

      {/* Badges de Influenciadores */}
      {rumor.influenciadores.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '14px',
        }}>
          {rumor.influenciadores.map((inf, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: COLORS.bgSecondary,
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
            }}>
              <span style={{
                color: COLORS.textSecondary,
                maxWidth: '100px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {inf.nome}
              </span>
              <span style={{
                fontWeight: 600,
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '3px',
                color: inf.palpite === 'vai' ? COLORS.colorVai : COLORS.colorNao,
                background: inf.palpite === 'vai' ? `${COLORS.colorVai}20` : `${COLORS.colorNao}20`,
              }}>
                {inf.palpite === 'vai' ? '✓ VAI' : '✗ NÃO'}
              </span>
              <span style={{
                color: COLORS.textMuted,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
              }}>
                {inf.acertos}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          fontSize: '13px',
          color: COLORS.textMuted,
        }}>
          <span>{rumor.totalPalpites.toLocaleString()} palpites</span>
          <span>·</span>
          <span>{rumor.comentarios} comentários</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setVoted('vai'); }}
            disabled={voted !== null}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: voted ? 'not-allowed' : 'pointer',
              border: `1px solid ${COLORS.colorVai}40`,
              background: voted === 'vai' ? COLORS.colorVai : `${COLORS.colorVai}20`,
              color: voted === 'vai' ? COLORS.textPrimary : COLORS.colorVai,
              opacity: voted === 'nao' ? 0.5 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            🎯 VAI
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setVoted('nao'); }}
            disabled={voted !== null}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: voted ? 'not-allowed' : 'pointer',
              border: `1px solid ${COLORS.colorNao}40`,
              background: voted === 'nao' ? COLORS.colorNao : `${COLORS.colorNao}20`,
              color: voted === 'nao' ? COLORS.textPrimary : COLORS.colorNao,
              opacity: voted === 'vai' ? 0.5 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            ✗ NÃO VAI
          </button>
        </div>
      </div>

      {/* Feedback de voto */}
      {voted && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: `${COLORS.colorVai}10`,
          border: `1px solid ${COLORS.colorVai}30`,
          borderRadius: '6px',
          fontSize: '13px',
          color: COLORS.colorVai,
          textAlign: 'center',
        }}>
          Palpite registrado! {voted === 'vai' ? '🎯' : '❌'}
        </div>
      )}
    </div>
  )
}

export default function FeedPage() {
  const [timeSelecionado, setTimeSelecionado] = useState('flamengo') // Simula time do usuário
  const [filtro, setFiltro] = useState<'quentes' | 'recentes' | 'fechando'>('quentes')
  const [showUpsellModal, setShowUpsellModal] = useState(false)
  const isPremium = false // Simula usuário grátis

  // Filtra rumores pelo time do usuário (se não for premium)
  const rumoresFiltrados = isPremium
    ? RUMORES_MOCK
    : RUMORES_MOCK.filter(r => r.timeId === timeSelecionado)

  const meuTime = TIMES.find(t => t.id === timeSelecionado)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Space Grotesk', sans-serif;
          background: ${COLORS.bgPrimary};
          color: ${COLORS.textPrimary};
          min-height: 100vh;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Scrollbar personalizada */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${COLORS.bgPrimary};
        }
        ::-webkit-scrollbar-thumb {
          background: ${COLORS.borderPrimary};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${COLORS.textMuted};
        }

        @media (max-width: 1200px) {
          .sidebar-right { display: none !important; }
        }

        @media (max-width: 768px) {
          .sidebar-left { display: none !important; }
          .feed-container { border-right: none !important; }
        }
      `}</style>

      <div style={{
        display: 'flex',
        minHeight: '100vh',
        maxWidth: '1400px',
        margin: '0 auto',
        background: COLORS.bgPrimary,
      }}>
        {/* Sidebar Esquerda */}
        <aside className="sidebar-left" style={{
          width: '240px',
          borderRight: `1px solid ${COLORS.borderPrimary}`,
          padding: '20px 16px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            marginBottom: '32px',
            textDecoration: 'none',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: `linear-gradient(135deg, ${COLORS.accentGreen}, ${COLORS.accentGreenDark})`,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}>⚽</div>
            <span style={{
              fontSize: '22px',
              fontWeight: 700,
              background: `linear-gradient(90deg, ${COLORS.accentGreen}, ${COLORS.accentGreenLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Palpiteiro</span>
          </Link>

          {/* Seção Filtrar */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '0 12px',
              marginBottom: '12px',
            }}>Filtrar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { id: 'quentes', label: '🔥 Mais quentes' },
                { id: 'recentes', label: '🆕 Mais recentes' },
                { id: 'fechando', label: '⏰ Fechando logo' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFiltro(f.id as typeof filtro)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    background: filtro === f.id ? `${COLORS.accentGreen}20` : 'transparent',
                    color: filtro === f.id ? COLORS.accentGreen : COLORS.textSecondary,
                    fontWeight: filtro === f.id ? 500 : 400,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Seção Meu Time */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: COLORS.accentGreen,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '0 12px',
              marginBottom: '12px',
            }}>Meu Time</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {meuTime && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: COLORS.bgElevated,
                    color: COLORS.textPrimary,
                    fontWeight: 500,
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    width: '3px',
                    height: '24px',
                    background: COLORS.accentGreen,
                    borderRadius: '0 2px 2px 0',
                  }} />
                  <span style={{ fontSize: '16px' }}>{meuTime.emoji}</span>
                  <span>{meuTime.nome}</span>
                </div>
              )}
            </div>
          </div>

          {/* Seção Outros Times (Bloqueados) */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '0 12px',
              marginBottom: '12px',
            }}>Outros Times 🔒</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {TIMES.filter(t => t.id !== timeSelecionado).slice(0, 5).map(time => (
                <button
                  key={time.id}
                  onClick={() => setShowUpsellModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    color: COLORS.textSecondary,
                    opacity: 0.5,
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{time.emoji}</span>
                  <span>{time.nome}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: COLORS.textMuted }}>🔒</span>
                </button>
              ))}
            </div>

            {/* CTA Liberar todos */}
            <button
              onClick={() => setShowUpsellModal(true)}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '16px',
                background: `linear-gradient(135deg, ${COLORS.accentGreen}20, ${COLORS.accentGreenDark}20)`,
                border: `1px solid ${COLORS.accentGreen}40`,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: COLORS.accentGreen,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              ✨ Liberar todos<br />
              <span style={{ fontSize: '11px', fontWeight: 400, opacity: 0.8 }}>R$ 29,90/mês</span>
            </button>
          </div>
        </aside>

        {/* Feed Central */}
        <main className="feed-container" style={{
          flex: 1,
          borderRight: `1px solid ${COLORS.borderPrimary}`,
          minWidth: 0,
        }}>
          {/* Header Sticky */}
          <header style={{
            position: 'sticky',
            top: 0,
            background: `${COLORS.bgPrimary}ee`,
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${COLORS.borderPrimary}`,
            padding: '16px 20px',
            zIndex: 10,
          }}>
            <h1 style={{ fontSize: '20px', fontWeight: 600 }}>Rumores</h1>
            <div style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
              {[
                { id: 'quentes', label: '🔥 Quentes' },
                { id: 'recentes', label: 'Recentes' },
                { id: 'fechando', label: 'Fechando' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFiltro(tab.id as typeof filtro)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.15s ease',
                    background: filtro === tab.id ? COLORS.textPrimary : 'transparent',
                    color: filtro === tab.id ? COLORS.bgPrimary : COLORS.textMuted,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </header>

          {/* Lista de Rumores */}
          <div>
            {rumoresFiltrados.length > 0 ? (
              rumoresFiltrados.map(rumor => (
                <RumorCard key={rumor.id} rumor={rumor} />
              ))
            ) : (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: COLORS.textMuted,
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <p>Nenhum rumor encontrado para {meuTime?.nome}</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>
                  Novos rumores serão adicionados em breve!
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar Direita */}
        <aside className="sidebar-right" style={{
          width: '300px',
          padding: '20px 16px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          {/* Trending */}
          <div style={{
            background: COLORS.bgSecondary,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{
              fontSize: '15px',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              📈 Trending
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {RUMORES_MOCK.slice(0, 5).map((r, i) => (
                <div key={r.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: COLORS.textMuted,
                    fontFamily: "'JetBrains Mono', monospace",
                    width: '20px',
                  }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>
                      {r.jogador}
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.textMuted }}>
                      {r.time} · {r.totalPalpites.toLocaleString()} palpites
                    </div>
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: COLORS.accentGreen,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{r.percentualVai}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Palpiteiros */}
          <div style={{
            background: COLORS.bgSecondary,
            borderRadius: '12px',
            padding: '16px',
          }}>
            <div style={{
              fontSize: '15px',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              🏆 Top Palpiteiros
            </div>
            {TOP_PALPITEIROS.map((p, i) => (
              <div key={p.nome} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 0',
                borderBottom: i < TOP_PALPITEIROS.length - 1 ? `1px solid ${COLORS.borderPrimary}` : 'none',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.accentGreen}, ${COLORS.accentGreenDark})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 600,
                }}>
                  {p.nome.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>@{p.nome}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted }}>{p.palpites} palpites</div>
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: COLORS.accentGreen,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{p.acertos}%</span>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.accentGreen}20, ${COLORS.accentGreenDark}20)`,
            border: `1px solid ${COLORS.accentGreen}40`,
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
              Entre no jogo
            </div>
            <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginBottom: '16px' }}>
              Dê seu palpite e suba no ranking dos melhores palpiteiros do Brasil
            </div>
            <Link href="/onboarding" style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              background: COLORS.accentGreen,
              color: COLORS.textPrimary,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textDecoration: 'none',
              textAlign: 'center',
            }}>
              Criar conta grátis
            </Link>
          </div>
        </aside>
      </div>

      {/* Modal de Upsell */}
      {showUpsellModal && (
        <div
          onClick={() => setShowUpsellModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              background: COLORS.bgSecondary,
              border: `1px solid ${COLORS.borderPrimary}`,
              borderRadius: '16px',
              padding: '32px',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowUpsellModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: COLORS.textMuted,
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                🔓 Libere todos os times
              </div>
              <div style={{ fontSize: '14px', color: COLORS.textSecondary, lineHeight: 1.5 }}>
                Você está no plano grátis e só pode ver rumores do {meuTime?.nome}. Com o Premium, você acompanha TODOS os times.
              </div>
            </div>

            {/* Lista de benefícios */}
            <div style={{
              background: COLORS.bgPrimary,
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
            }}>
              {[
                'Acesso a todos os 12 times',
                'Trending geral do futebol brasileiro',
                'Troque de time quando quiser',
                'Notificações de todos os rumores',
                'Badge Premium no seu perfil',
                'Sem anúncios',
              ].map((b, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 0',
                  fontSize: '14px',
                }}>
                  <span style={{ color: COLORS.accentGreen, fontWeight: 'bold' }}>✓</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Cards de preço */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                flex: 1,
                background: COLORS.borderPrimary,
                border: `2px solid transparent`,
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: COLORS.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                }}>Mensal</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>R$ 29,90</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>/mês</div>
              </div>
              <div style={{
                flex: 1,
                background: `${COLORS.accentGreen}10`,
                border: `2px solid ${COLORS.accentGreen}`,
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: COLORS.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                }}>Anual</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>R$ 199,90</div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>/ano (R$ 16,66/mês)</div>
                <span style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: COLORS.accentGreen,
                  background: `${COLORS.accentGreen}20`,
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}>ECONOMIA 44%</span>
              </div>
            </div>

            <Link href="/assinatura" style={{
              display: 'block',
              width: '100%',
              padding: '16px',
              background: COLORS.accentGreen,
              color: COLORS.textPrimary,
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              textAlign: 'center',
            }}>
              Assinar Premium
            </Link>

            <div style={{
              fontSize: '12px',
              color: COLORS.textMuted,
              textAlign: 'center',
              marginTop: '12px',
            }}>
              Cancele quando quiser
            </div>
          </div>
        </div>
      )}
    </>
  )
}
