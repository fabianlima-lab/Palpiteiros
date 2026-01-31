'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { NewsItemCard } from '@/app/components/NewsItemCard'
import { TEAMS, findTeamByName, getTeamColor } from '@/lib/teams'
import { TeamButton, TeamLogo } from '@/app/components/TeamLogo'

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

interface Influencer {
  id: string
  name: string
  trustScore: number
}

interface Signal {
  id: string
  signal: string
  confidence: number
  influencer: Influencer
}

interface Prediction {
  id: string
  prediction: boolean
  userId: string
}

interface Rumor {
  id: string
  playerName: string
  toTeam: string
  fromTeam?: string | null
  title: string
  sentiment: number
  status: string
  createdAt: string
  signals: Signal[]
  predictions: Prediction[]
  signalScore?: number | null
}

interface User {
  id: string
  name: string
  username: string
  team?: string | null
  points: number
  isPremium: boolean
}

interface TopUser {
  id: string
  name: string
  username: string
  points: number
}

interface NewsItem {
  id: string
  source: string
  sourceUrl: string
  authorName?: string | null
  authorHandle?: string | null
  authorAvatar?: string | null
  content: string
  summary?: string | null
  imageUrl?: string | null
  publishedAt: string
  likes?: number | null
  retweets?: number | null
  views?: number | null
  relevance: number
}

interface FeedClientProps {
  initialRumors: Rumor[]
  user: User | null
  topUsers: TopUser[]
}

// Helper para calcular tempo relativo
function formatTimeAgo(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `${diffMins}min`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return past.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

// Helper para cor do time - agora usa dados centralizados de @/lib/teams

// Skeleton Loader Component
function SkeletonCard() {
  return (
    <div style={{
      padding: '20px',
      borderBottom: `1px solid ${COLORS.borderPrimary}`,
    }}>
      {/* Header skeleton */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <div style={{
          width: '80px',
          height: '24px',
          background: `linear-gradient(90deg, ${COLORS.bgSecondary} 25%, ${COLORS.borderPrimary} 50%, ${COLORS.bgSecondary} 75%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
        }} />
        <div style={{
          width: '40px',
          height: '24px',
          background: `linear-gradient(90deg, ${COLORS.bgSecondary} 25%, ${COLORS.borderPrimary} 50%, ${COLORS.bgSecondary} 75%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
        }} />
      </div>

      {/* Title skeleton */}
      <div style={{
        width: '90%',
        height: '24px',
        background: `linear-gradient(90deg, ${COLORS.bgSecondary} 25%, ${COLORS.borderPrimary} 50%, ${COLORS.bgSecondary} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px',
        marginBottom: '14px',
      }} />

      {/* Progress bar skeleton */}
      <div style={{
        width: '100%',
        height: '8px',
        background: `linear-gradient(90deg, ${COLORS.bgSecondary} 25%, ${COLORS.borderPrimary} 50%, ${COLORS.bgSecondary} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px',
        marginBottom: '14px',
      }} />

      {/* Buttons skeleton */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <div style={{
          width: '100px',
          height: '36px',
          background: `linear-gradient(90deg, ${COLORS.bgSecondary} 25%, ${COLORS.borderPrimary} 50%, ${COLORS.bgSecondary} 75%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '6px',
        }} />
        <div style={{
          width: '100px',
          height: '36px',
          background: `linear-gradient(90deg, ${COLORS.bgSecondary} 25%, ${COLORS.borderPrimary} 50%, ${COLORS.bgSecondary} 75%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '6px',
        }} />
      </div>
    </div>
  )
}

// Componente Card de Rumor com votação real
function RumorCard({
  rumor,
  userId,
  userPrediction,
}: {
  rumor: Rumor
  userId?: string
  userPrediction?: boolean
}) {
  const [voted, setVoted] = useState<boolean | null>(userPrediction ?? null)
  const [isVoting, setIsVoting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [localSentiment, setLocalSentiment] = useState(rumor.sentiment)
  const [localPredictions, setLocalPredictions] = useState(rumor.predictions.length)

  // Estado para notícias relacionadas
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [newsExpanded, setNewsExpanded] = useState(false)
  const [newsLoaded, setNewsLoaded] = useState(false)
  const [totalNews, setTotalNews] = useState(0)

  // Buscar notícias relacionadas
  useEffect(() => {
    const fetchNews = async () => {
      if (newsLoaded) return
      setNewsLoading(true)
      try {
        const response = await fetch(`/api/news/rumor?rumorId=${rumor.id}&limit=5&offset=0`)
        const data = await response.json()
        setNewsItems(data.news || [])
        setTotalNews(data.total || 0)
      } catch (error) {
        console.error('Erro ao buscar notícias:', error)
      } finally {
        setNewsLoading(false)
        setNewsLoaded(true)
      }
    }
    fetchNews()
  }, [rumor.id, newsLoaded])

  const percentualVai = Math.round(localSentiment * 100)
  const isQuente = (rumor.signalScore ?? 0) > 0.3 || localPredictions > 100
  const teamColor = getTeamColor(rumor.toTeam)

  const handleVote = async (prediction: boolean) => {
    if (!userId || isVoting) return

    // Se já votou igual, não faz nada
    if (voted === prediction) return

    setIsVoting(true)
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rumorId: rumor.id, userId, prediction }),
      })

      if (response.ok) {
        const data = await response.json()
        setVoted(prediction)
        setLocalSentiment(data.newSentiment)
        setLocalPredictions(data.totalPredictions)
      }
    } catch (error) {
      console.error('Erro ao votar:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <Link
      href={`/rumor/${rumor.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'block',
        padding: '20px',
        borderBottom: `1px solid ${COLORS.borderPrimary}`,
        cursor: 'pointer',
        position: 'relative',
        background: isHovered ? COLORS.bgTertiary : 'transparent',
        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {/* Barra lateral colorida */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '3px',
        background: teamColor,
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
          background: `${teamColor}20`,
          color: teamColor,
        }}>
          {rumor.toTeam}
        </span>
        <span style={{ fontSize: '12px', color: COLORS.textMuted }}>
          {formatTimeAgo(rumor.createdAt)}
        </span>
        {isQuente && (
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
        {rumor.title}
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
            width: `${percentualVai}%`,
            background: percentualVai > 50
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
            color: percentualVai > 50 ? COLORS.accentGreen : COLORS.textMuted,
            fontWeight: percentualVai > 50 ? 600 : 400,
          }}>
            {percentualVai}% VAI
          </span>
          <span style={{
            color: percentualVai <= 50 ? COLORS.colorNao : COLORS.textMuted,
            fontWeight: percentualVai <= 50 ? 600 : 400,
          }}>
            {100 - percentualVai}% NÃO VAI
          </span>
        </div>
      </div>

      {/* Badges de Influenciadores */}
      {rumor.signals.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '14px',
        }}>
          {rumor.signals.slice(0, 3).map((signal) => (
            <div key={signal.id} style={{
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
                {signal.influencer.name.split(' ')[0]}
              </span>
              <span style={{
                fontWeight: 600,
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '3px',
                color: signal.signal === 'favoravel' ? COLORS.colorVai : COLORS.colorNao,
                background: signal.signal === 'favoravel' ? `${COLORS.colorVai}20` : `${COLORS.colorNao}20`,
              }}>
                {signal.signal === 'favoravel' ? '✓ VAI' : '✗ NÃO'}
              </span>
              <span style={{
                color: COLORS.textMuted,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
              }}>
                {Math.round(signal.influencer.trustScore * 100)}%
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
          <span>{localPredictions.toLocaleString()} palpites</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.preventDefault()}>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleVote(true); }}
            disabled={isVoting || !userId}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: !userId ? 'not-allowed' : 'pointer',
              border: `1px solid ${COLORS.colorVai}40`,
              background: voted === true ? COLORS.colorVai : `${COLORS.colorVai}20`,
              color: voted === true ? COLORS.textPrimary : COLORS.colorVai,
              opacity: voted === false ? 0.6 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {isVoting ? '...' : '🎯 VAI'}
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleVote(false); }}
            disabled={isVoting || !userId}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: !userId ? 'not-allowed' : 'pointer',
              border: `1px solid ${COLORS.colorNao}40`,
              background: voted === false ? COLORS.colorNao : `${COLORS.colorNao}20`,
              color: voted === false ? COLORS.textPrimary : COLORS.colorNao,
              opacity: voted === true ? 0.6 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {isVoting ? '...' : '✗ NÃO VAI'}
          </button>
        </div>
      </div>

      {/* Feedback de voto - agora permite mudar */}
      {voted !== null && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: voted ? `${COLORS.colorVai}10` : `${COLORS.colorNao}10`,
          border: `1px solid ${voted ? COLORS.colorVai : COLORS.colorNao}30`,
          borderRadius: '6px',
          fontSize: '13px',
          color: voted ? COLORS.colorVai : COLORS.colorNao,
          textAlign: 'center',
        }}>
          Seu palpite: {voted ? '🎯 VAI acontecer' : '❌ NÃO vai acontecer'} (clique para mudar)
        </div>
      )}

      {/* Seção de Notícias Relacionadas */}
      {newsLoaded && newsItems.length > 0 && (
        <div
          onClick={(e) => e.preventDefault()}
          style={{
            marginTop: '14px',
            borderTop: `1px solid ${COLORS.borderPrimary}`,
            paddingTop: '12px',
          }}
        >
          {/* Header da seção */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setNewsExpanded(!newsExpanded)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              marginBottom: '10px',
            }}
          >
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              📰 O que estão dizendo ({totalNews})
            </span>
            <span style={{
              fontSize: '12px',
              color: COLORS.textSecondary,
              transition: 'transform 0.2s ease',
              transform: newsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}>
              ▼
            </span>
          </button>

          {/* Lista de notícias */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}>
            {(newsExpanded ? newsItems : newsItems.slice(0, 2)).map((item) => (
              <NewsItemCard
                key={item.id}
                id={item.id}
                source={item.source}
                sourceUrl={item.sourceUrl}
                authorName={item.authorName}
                authorHandle={item.authorHandle}
                authorAvatar={item.authorAvatar}
                content={item.content}
                summary={item.summary}
                imageUrl={item.imageUrl}
                publishedAt={item.publishedAt}
                likes={item.likes}
                retweets={item.retweets}
                views={item.views}
              />
            ))}
          </div>

          {/* Botão ver mais */}
          {!newsExpanded && newsItems.length > 2 && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setNewsExpanded(true)
              }}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '4px',
                background: 'transparent',
                border: `1px dashed ${COLORS.borderPrimary}`,
                borderRadius: '6px',
                fontSize: '12px',
                color: COLORS.textSecondary,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Ver mais {newsItems.length - 2} notícias
            </button>
          )}
        </div>
      )}

      {/* Loading de notícias */}
      {newsLoading && (
        <div style={{
          marginTop: '14px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: '12px',
            color: COLORS.textMuted,
          }}>
            Carregando notícias...
          </span>
        </div>
      )}
    </Link>
  )
}

// TIMES agora vem de @/lib/teams com escudos reais

export function FeedClient({ initialRumors, user, topUsers }: FeedClientProps) {
  const [rumors, setRumors] = useState(initialRumors)
  const [filtro, setFiltro] = useState<'quentes' | 'recentes' | 'fechando'>('quentes')
  const [showUpsellModal, setShowUpsellModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(initialRumors.length)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Buscar palpites do usuário
  const userPredictions = new Map<string, boolean>()
  if (user) {
    rumors.forEach(r => {
      const pred = r.predictions.find(p => p.userId === user.id)
      if (pred) userPredictions.set(r.id, pred.prediction)
    })
  }

  const meuTime = user?.team || 'Flamengo'
  const meuTimeObj = findTeamByName(meuTime) || TEAMS[0]

  // Função para carregar mais rumores
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        limit: '10',
        offset: offset.toString(),
        order: filtro,
      })

      // Adicionar parâmetros de relevância para personalização
      if (user?.id) {
        params.set('userId', user.id)
      }
      if (user?.team) {
        params.set('userTeam', user.team)
      }

      const response = await fetch(`/api/rumors?${params}`)
      const data = await response.json()

      if (data.rumors && data.rumors.length > 0) {
        setRumors(prev => [...prev, ...data.rumors])
        setOffset(prev => prev + data.rumors.length)
        setHasMore(data.hasMore)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Erro ao carregar mais rumores:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, offset, filtro, user?.id, user?.team])

  // Configurar Intersection Observer para scroll infinito
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMore, hasMore, isLoading])

  // Reset quando muda o filtro
  useEffect(() => {
    setRumors(initialRumors)
    setOffset(initialRumors.length)
    setHasMore(true)
  }, [filtro, initialRumors])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

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

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bgPrimary}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.borderPrimary}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${COLORS.textMuted}; }

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
            <div style={{
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
            }}>
              <div style={{
                position: 'absolute',
                left: 0,
                width: '3px',
                height: '24px',
                background: meuTimeObj.color,
                borderRadius: '0 2px 2px 0',
              }} />
              <TeamLogo teamName={meuTimeObj.name} size={24} />
              <span>{meuTimeObj.name}</span>
            </div>
          </div>

          {/* Seção Outros Times (Bloqueados) */}
          {!user?.isPremium && (
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
                {TEAMS.filter(t => t.id !== meuTimeObj.id).slice(0, 5).map(time => (
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
                    <TeamLogo teamName={time.name} size={20} />
                    <span>{time.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: COLORS.textMuted }}>🔒</span>
                  </button>
                ))}
              </div>

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
                }}
              >
                ✨ Liberar todos<br />
                <span style={{ fontSize: '11px', fontWeight: 400, opacity: 0.8 }}>R$ 29,90/mês</span>
              </button>
            </div>
          )}
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
            {rumors.length > 0 ? (
              <>
                {rumors.map(rumor => (
                  <RumorCard
                    key={rumor.id}
                    rumor={rumor}
                    userId={user?.id}
                    userPrediction={userPredictions.get(rumor.id)}
                  />
                ))}

                {/* Loading indicator / Trigger para scroll infinito */}
                <div ref={loadMoreRef} style={{ padding: '20px', textAlign: 'center' }}>
                  {isLoading ? (
                    <>
                      <SkeletonCard />
                      <SkeletonCard />
                    </>
                  ) : hasMore ? (
                    <span style={{ color: COLORS.textMuted, fontSize: '13px' }}>
                      Carregando mais...
                    </span>
                  ) : (
                    <span style={{ color: COLORS.textMuted, fontSize: '13px' }}>
                      Você viu todos os rumores! 🎉
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: COLORS.textMuted,
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <p>Nenhum rumor encontrado para {meuTime}</p>
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
              {rumors.slice(0, 5).map((r, i) => (
                <Link key={r.id} href={`/rumor/${r.id}`} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  textDecoration: 'none',
                  color: 'inherit',
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
                      {r.playerName}
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.textMuted }}>
                      {r.toTeam} · {r.predictions.length} palpites
                    </div>
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: COLORS.accentGreen,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{Math.round(r.sentiment * 100)}%</span>
                </Link>
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
            {topUsers.map((p, i) => (
              <div key={p.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 0',
                borderBottom: i < topUsers.length - 1 ? `1px solid ${COLORS.borderPrimary}` : 'none',
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
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>@{p.username}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted }}>{p.points} pontos</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          {!user && (
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
                Dê seu palpite e suba no ranking
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
                textDecoration: 'none',
                textAlign: 'center',
              }}>
                Criar conta grátis
              </Link>
            </div>
          )}
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
                Com o Premium, você acompanha TODOS os 12 times.
              </div>
            </div>

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
                'Badge Premium no seu perfil',
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
              textDecoration: 'none',
              textAlign: 'center',
            }}>
              Assinar Premium - R$ 29,90/mês
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
