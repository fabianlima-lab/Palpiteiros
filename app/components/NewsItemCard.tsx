'use client'

import { useState } from 'react'

// Design System
const COLORS = {
  bgPrimary: '#09090B',
  bgSecondary: '#18181B',
  bgTertiary: '#0F0F12',
  borderPrimary: '#27272A',
  textPrimary: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  accentGreen: '#10B981',
}

interface NewsItemCardProps {
  id: string
  source: string
  sourceUrl: string
  authorName?: string | null
  authorHandle?: string | null
  authorAvatar?: string | null
  content: string
  summary?: string | null
  imageUrl?: string | null
  publishedAt: Date | string
  likes?: number | null
  retweets?: number | null
  views?: number | null
  relevance?: number
}

// Ícones por fonte
const SOURCE_ICONS: Record<string, { icon: string; label: string }> = {
  twitter: { icon: '🐦', label: 'Twitter' },
  youtube: { icon: '▶️', label: 'YouTube' },
  globo: { icon: '📰', label: 'Globo Esporte' },
  uol: { icon: '📰', label: 'UOL Esporte' },
}

// Formatar tempo relativo
function formatTimeAgo(date: Date | string): string {
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

// Formatar números grandes
function formatNumber(num: number | null | undefined): string {
  if (!num) return '0'
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}

export function NewsItemCard({
  source,
  sourceUrl,
  authorName,
  authorHandle,
  content,
  summary,
  imageUrl,
  publishedAt,
  likes,
  retweets,
  views,
}: NewsItemCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sourceInfo = SOURCE_ICONS[source] || { icon: '📰', label: source }

  const handleClick = () => {
    window.open(sourceUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered ? COLORS.bgSecondary : COLORS.bgTertiary,
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        {/* Ícone da fonte */}
        <span style={{ fontSize: '14px' }}>{sourceInfo.icon}</span>

        {/* Nome do autor */}
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: COLORS.textPrimary,
          }}
        >
          {authorName || sourceInfo.label}
        </span>

        {/* Handle (se Twitter) */}
        {authorHandle && (
          <span
            style={{
              fontSize: '12px',
              color: COLORS.textMuted,
            }}
          >
            {authorHandle}
          </span>
        )}

        {/* Timestamp */}
        <span
          style={{
            fontSize: '12px',
            color: COLORS.textMuted,
            marginLeft: 'auto',
          }}
        >
          {formatTimeAgo(publishedAt)}
        </span>
      </div>

      {/* Conteúdo */}
      <p
        style={{
          fontSize: '14px',
          color: COLORS.textSecondary,
          lineHeight: 1.4,
          marginBottom: imageUrl || likes || retweets || views ? '8px' : 0,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {summary || content}
      </p>

      {/* Thumbnail (se YouTube/Globo/UOL) */}
      {imageUrl && (
        <div
          style={{
            width: '100%',
            height: '120px',
            borderRadius: '6px',
            overflow: 'hidden',
            marginBottom: likes || retweets || views ? '8px' : 0,
          }}
        >
          <img
            src={imageUrl}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {/* Métricas (se Twitter/YouTube) */}
      {(likes || retweets || views) && (
        <div
          style={{
            display: 'flex',
            gap: '16px',
            fontSize: '12px',
            color: COLORS.textMuted,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {likes !== null && likes !== undefined && (
            <span>❤️ {formatNumber(likes)}</span>
          )}
          {retweets !== null && retweets !== undefined && (
            <span>🔁 {formatNumber(retweets)}</span>
          )}
          {views !== null && views !== undefined && (
            <span>👁️ {formatNumber(views)}</span>
          )}
        </div>
      )}
    </div>
  )
}

// Seção completa de notícias para o card expandido de rumor
interface NewsSectionProps {
  rumorId: string
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

export function NewsSection({ rumorId }: NewsSectionProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [initialized, setInitialized] = useState(false)

  const loadNews = async (reset = false) => {
    setLoading(true)
    try {
      const currentOffset = reset ? 0 : offset
      const response = await fetch(
        `/api/news/rumor?rumorId=${rumorId}&limit=5&offset=${currentOffset}`
      )
      const data = await response.json()

      if (reset) {
        setNews(data.news)
        setOffset(5)
      } else {
        setNews(prev => [...prev, ...data.news])
        setOffset(prev => prev + 5)
      }
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Erro ao carregar notícias:', error)
    } finally {
      setLoading(false)
      setInitialized(true)
    }
  }

  // Carregar na primeira renderização
  if (!initialized && !loading) {
    loadNews(true)
  }

  if (!initialized && loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: COLORS.textMuted }}>
          Carregando notícias...
        </div>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: COLORS.textMuted }}>
          Nenhuma notícia relacionada ainda
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Título da seção */}
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: COLORS.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '12px 0',
          borderTop: `1px solid ${COLORS.borderPrimary}`,
          marginTop: '12px',
        }}
      >
        📰 O QUE ESTÃO DIZENDO
      </div>

      {/* Lista de notícias */}
      {news.map(item => (
        <NewsItemCard
          key={item.id}
          {...item}
          publishedAt={item.publishedAt}
        />
      ))}

      {/* Botão carregar mais */}
      {hasMore && (
        <button
          onClick={() => loadNews()}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: 'transparent',
            border: `1px solid ${COLORS.borderPrimary}`,
            borderRadius: '6px',
            fontSize: '13px',
            color: loading ? COLORS.textMuted : COLORS.textSecondary,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {loading ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}
    </div>
  )
}
