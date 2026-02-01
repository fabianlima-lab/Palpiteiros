'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TEAMS, findTeamByName } from '@/lib/teams'
import { TeamLogo } from '@/app/components/TeamLogo'

// Design System
const COLORS = {
  bgPrimary: '#09090B',
  bgSecondary: '#18181B',
  bgElevated: '#1F1F23',
  borderPrimary: '#27272A',
  textPrimary: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  accentGreen: '#10B981',
  accentGreenDark: '#059669',
  colorNao: '#EF4444',
}

interface TopFonte {
  id: string
  rank: number
  nome: string
  credibilidade: number
  totalPrevisoes: number
  taxaAcerto: string
}

interface TrendingRumor {
  id: string
  playerName: string
  toTeam: string
  predictionsCount: number
  sentiment: number
}

interface MobileMenuProps {
  filtro: 'quentes' | 'recentes' | 'fechando'
  setFiltro: (f: 'quentes' | 'recentes' | 'fechando') => void
  meuTime: string
  isPremium: boolean
  topFontes: TopFonte[]
  trendingRumors: TrendingRumor[]
  onUpsell: () => void
}

export function MobileMenu({
  filtro,
  setFiltro,
  meuTime,
  isPremium,
  topFontes,
  trendingRumors,
  onUpsell,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'menu' | 'trending' | 'fontes'>('menu')

  const meuTimeObj = findTeamByName(meuTime) || TEAMS[0]

  return (
    <>
      {/* Botao Hamburger - so aparece em mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="mobile-menu-button"
        style={{
          display: 'none', // Controlado por CSS
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          background: COLORS.bgSecondary,
          border: `1px solid ${COLORS.borderPrimary}`,
          borderRadius: '8px',
          cursor: 'pointer',
          color: COLORS.textPrimary,
          fontSize: '20px',
        }}
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 998,
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '85%',
          maxWidth: '320px',
          background: COLORS.bgPrimary,
          borderRight: `1px solid ${COLORS.borderPrimary}`,
          zIndex: 999,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Header do Drawer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          borderBottom: `1px solid ${COLORS.borderPrimary}`,
        }}>
          <img
            src="/logo.svg"
            alt="Palpiteiros"
            style={{ height: '28px', width: 'auto' }}
          />
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.textMuted,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${COLORS.borderPrimary}`,
        }}>
          {[
            { id: 'menu', label: 'Menu' },
            { id: 'trending', label: '📈 Trending' },
            { id: 'fontes', label: '🏆 Fontes' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                flex: 1,
                padding: '12px 8px',
                background: activeTab === tab.id ? COLORS.bgSecondary : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${COLORS.accentGreen}` : '2px solid transparent',
                color: activeTab === tab.id ? COLORS.textPrimary : COLORS.textMuted,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteudo */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {/* Tab Menu */}
          {activeTab === 'menu' && (
            <>
              {/* Filtrar */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: COLORS.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                }}>Filtrar</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { id: 'quentes', label: '🔥 Mais quentes' },
                    { id: 'recentes', label: '🆕 Mais recentes' },
                    { id: 'fechando', label: '⏰ Fechando logo' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFiltro(f.id as typeof filtro)
                        setIsOpen(false)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '15px',
                        cursor: 'pointer',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
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

              {/* Meu Time */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: COLORS.accentGreen,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                }}>Meu Time</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: COLORS.bgElevated,
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    width: '3px',
                    height: '28px',
                    background: meuTimeObj.color,
                    borderRadius: '0 2px 2px 0',
                  }} />
                  <TeamLogo teamName={meuTimeObj.name} size={28} />
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>{meuTimeObj.name}</span>
                </div>
              </div>

              {/* Outros Times */}
              {!isPremium && (
                <div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: COLORS.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '12px',
                  }}>Outros Times 🔒</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {TEAMS.filter(t => t.id !== meuTimeObj.id).slice(0, 5).map(time => (
                      <button
                        key={time.id}
                        onClick={onUpsell}
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
                          opacity: 0.6,
                        }}
                      >
                        <TeamLogo teamName={time.name} size={22} />
                        <span>{time.name}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px' }}>🔒</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={onUpsell}
                    style={{
                      width: '100%',
                      padding: '14px',
                      marginTop: '16px',
                      background: `linear-gradient(135deg, ${COLORS.accentGreen}20, ${COLORS.accentGreenDark}20)`,
                      border: `1px solid ${COLORS.accentGreen}40`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: COLORS.accentGreen,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    ✨ Liberar todos - R$ 14,90/mes
                  </button>
                </div>
              )}
            </>
          )}

          {/* Tab Trending */}
          {activeTab === 'trending' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trendingRumors.length > 0 ? (
                trendingRumors.map((r, i) => (
                  <Link
                    key={r.id}
                    href={`/rumor/${r.id}`}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      background: COLORS.bgSecondary,
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: i < 3 ? COLORS.accentGreen : COLORS.textMuted,
                      fontFamily: "'JetBrains Mono', monospace",
                      width: '24px',
                    }}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>
                        {r.playerName}
                      </div>
                      <div style={{ fontSize: '13px', color: COLORS.textMuted }}>
                        {r.toTeam} · {r.predictionsCount} palpites
                      </div>
                    </div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: COLORS.accentGreen,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>{Math.round(r.sentiment * 100)}%</span>
                  </Link>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: COLORS.textMuted, padding: '20px' }}>
                  Nenhum rumor em trending
                </div>
              )}
            </div>
          )}

          {/* Tab Fontes */}
          {activeTab === 'fontes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topFontes.length > 0 ? (
                topFontes.map((fonte, i) => (
                  <div
                    key={fonte.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: COLORS.bgSecondary,
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{
                      width: '28px',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: i < 3 ? COLORS.accentGreen : COLORS.textMuted,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {fonte.rank}.
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {fonte.nome}
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.textMuted }}>
                        {fonte.totalPrevisoes} previsoes
                      </div>
                    </div>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: fonte.credibilidade >= 80 ? COLORS.accentGreen :
                             fonte.credibilidade >= 60 ? '#F59E0B' : COLORS.colorNao,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {fonte.taxaAcerto}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: COLORS.textMuted, padding: '20px' }}>
                  Carregando fontes...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CSS para mostrar botao apenas em mobile */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-button {
            display: flex !important;
          }
        }
      `}</style>
    </>
  )
}
