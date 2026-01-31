'use client'

import { useState } from 'react'
import { ReactionPicker, SentimentBar, REACTIONS, ReactionEmoji } from '../../components/ReactionPicker'

// Tipos
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
}

interface RumorData {
  id: string
  playerName: string
  playerImage?: string | null
  fromTeam?: string | null
  toTeam: string
  title: string
  description?: string | null
  category: string
  sentiment: number
  sentimentPercent: number
  status: string
  closesAt: string
  totalReactions: number
}

interface NewsData {
  twitter: NewsItem[]
  youtube: NewsItem[]
  articles: NewsItem[]
}

interface RumorDetailContentProps {
  rumor: RumorData
  news: NewsData
  hasContent: boolean
}

// Helpers
function formatTimeAgo(dateStr: string): string {
  const now = new Date()
  const past = new Date(dateStr)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `${diffMins}min`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function formatNumber(num: number | null | undefined): string {
  if (!num) return '0'
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}

// Categorias
const CATEGORY_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  transferencia: { label: 'Transferência', emoji: '⚽', color: '#ff1744' },
  tecnico: { label: 'Técnico', emoji: '📋', color: '#ffd700' },
  titulo: { label: 'Título', emoji: '🏆', color: '#00f5a0' },
  selecao: { label: 'Seleção', emoji: '🇧🇷', color: '#00d9f5' },
}

export function RumorDetailContent({ rumor, news, hasContent }: RumorDetailContentProps) {
  const [activeTab, setActiveTab] = useState<'noticias' | 'twitter' | 'youtube'>('noticias')
  const [reactionCounts, setReactionCounts] = useState<Record<ReactionEmoji, number>>({
    '🔥': Math.floor(rumor.totalReactions * rumor.sentiment * 0.4),
    '👍': Math.ceil(rumor.totalReactions * rumor.sentiment * 0.6),
    '😐': 0,
    '😕': Math.ceil(rumor.totalReactions * (1 - rumor.sentiment) * 0.6),
    '💔': Math.floor(rumor.totalReactions * (1 - rumor.sentiment) * 0.4),
  })

  const categoryInfo = CATEGORY_LABELS[rumor.category] || CATEGORY_LABELS.transferencia
  const totalNews = news.twitter.length + news.youtube.length + news.articles.length

  const handleReaction = (emoji: ReactionEmoji) => {
    setReactionCounts(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }))
  }

  return (
    <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{
        backgroundColor: '#16162a',
        border: '1px solid #2a2a3e',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
      }}>
        {/* Category & Teams */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: categoryInfo.color,
            backgroundColor: `${categoryInfo.color}20`,
            padding: '4px 10px',
            borderRadius: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {categoryInfo.emoji} {categoryInfo.label}
          </span>

          {rumor.fromTeam && (
            <span style={{ fontSize: '12px', color: '#666680' }}>
              {rumor.fromTeam} → <span style={{ color: categoryInfo.color }}>{rumor.toTeam}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '8px',
          lineHeight: '1.4',
        }}>
          {rumor.title}
        </h1>

        {/* Description */}
        {rumor.description && (
          <p style={{
            fontSize: '14px',
            color: '#a0a0b0',
            lineHeight: '1.5',
            marginBottom: '16px',
          }}>
            {rumor.description}
          </p>
        )}

        {/* Sentiment Bar */}
        <div style={{ marginBottom: '16px' }}>
          <SentimentBar reactionCounts={reactionCounts} />
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          fontSize: '12px',
          color: '#666680',
        }}>
          <span>📰 {totalNews} notícias</span>
          <span>🐦 {news.twitter.length} tweets</span>
          <span>▶️ {news.youtube.length} vídeos</span>
        </div>
      </div>

      {/* Reaction Section */}
      <div style={{ marginBottom: '20px' }}>
        <ReactionPicker
          rumorId={rumor.id}
          reactionCounts={reactionCounts}
          onReact={handleReaction}
        />
      </div>

      {/* Content Validation Warning */}
      {!hasContent && (
        <div style={{
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>⚠️</span>
          <p style={{ fontSize: '14px', color: '#ffd700', fontWeight: '600', marginBottom: '4px' }}>
            Rumor sem fontes confirmadas
          </p>
          <p style={{ fontSize: '12px', color: '#a0a0b0' }}>
            Ainda não encontramos notícias ou tweets sobre este rumor.
          </p>
        </div>
      )}

      {/* Tabs */}
      {hasContent && (
        <>
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            borderBottom: '1px solid #2a2a3e',
            paddingBottom: '12px',
          }}>
            <TabButton
              active={activeTab === 'noticias'}
              onClick={() => setActiveTab('noticias')}
              icon="📰"
              label="Notícias"
              count={news.articles.length}
            />
            <TabButton
              active={activeTab === 'twitter'}
              onClick={() => setActiveTab('twitter')}
              icon="🐦"
              label="Twitter"
              count={news.twitter.length}
            />
            <TabButton
              active={activeTab === 'youtube'}
              onClick={() => setActiveTab('youtube')}
              icon="▶️"
              label="YouTube"
              count={news.youtube.length}
            />
          </div>

          {/* Tab Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeTab === 'noticias' && (
              news.articles.length > 0 ? (
                news.articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))
              ) : (
                <EmptyState icon="📰" message="Nenhuma notícia encontrada" />
              )
            )}

            {activeTab === 'twitter' && (
              news.twitter.length > 0 ? (
                news.twitter.map(tweet => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))
              ) : (
                <EmptyState icon="🐦" message="Nenhum tweet encontrado" />
              )
            )}

            {activeTab === 'youtube' && (
              news.youtube.length > 0 ? (
                news.youtube.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))
              ) : (
                <EmptyState icon="▶️" message="Nenhum vídeo encontrado" />
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Sub-components

function TabButton({ active, onClick, icon, label, count }: {
  active: boolean
  onClick: () => void
  icon: string
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '10px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: active ? '#1e2e25' : 'transparent',
        color: active ? '#00f5a0' : '#666680',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {count > 0 && (
        <span style={{
          fontSize: '10px',
          backgroundColor: active ? '#00f5a0' : '#2a2a3e',
          color: active ? '#000' : '#a0a0b0',
          padding: '2px 6px',
          borderRadius: '8px',
          fontWeight: '600',
        }}>
          {count}
        </span>
      )}
    </button>
  )
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: '#16162a',
      borderRadius: '12px',
    }}>
      <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px', opacity: 0.5 }}>{icon}</span>
      <p style={{ fontSize: '14px', color: '#666680' }}>{message}</p>
    </div>
  )
}

function ArticleCard({ article }: { article: NewsItem }) {
  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        backgroundColor: '#16162a',
        border: '1px solid #2a2a3e',
        borderRadius: '12px',
        padding: '14px',
        textDecoration: 'none',
        transition: 'border-color 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        {article.imageUrl && (
          <div style={{
            width: '80px',
            height: '60px',
            borderRadius: '8px',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            <img
              src={article.imageUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px',
          }}>
            <span style={{ fontSize: '12px' }}>📰</span>
            <span style={{ fontSize: '12px', color: '#a0a0b0' }}>
              {article.authorName || 'Notícia'}
            </span>
            <span style={{ fontSize: '11px', color: '#666680', marginLeft: 'auto' }}>
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
          <p style={{
            fontSize: '14px',
            color: '#fff',
            fontWeight: '500',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            margin: 0,
          }}>
            {article.content}
          </p>
        </div>
      </div>
    </a>
  )
}

function TweetCard({ tweet }: { tweet: NewsItem }) {
  return (
    <a
      href={tweet.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        backgroundColor: '#16162a',
        border: '1px solid #2a2a3e',
        borderRadius: '12px',
        padding: '14px',
        textDecoration: 'none',
        transition: 'border-color 0.15s ease',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#1DA1F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '700',
          color: 'white',
        }}>
          {tweet.authorName?.charAt(0) || '🐦'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
            {tweet.authorName || 'Twitter'}
          </div>
          {tweet.authorHandle && (
            <div style={{ fontSize: '12px', color: '#1DA1F2' }}>
              {tweet.authorHandle}
            </div>
          )}
        </div>
        <span style={{ fontSize: '11px', color: '#666680' }}>
          {formatTimeAgo(tweet.publishedAt)}
        </span>
      </div>

      {/* Content */}
      <p style={{
        fontSize: '14px',
        color: '#e0e0e0',
        lineHeight: '1.5',
        marginBottom: '12px',
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {tweet.content}
      </p>

      {/* Metrics */}
      <div style={{
        display: 'flex',
        gap: '16px',
        fontSize: '12px',
        color: '#666680',
      }}>
        {tweet.likes !== null && tweet.likes !== undefined && (
          <span>❤️ {formatNumber(tweet.likes)}</span>
        )}
        {tweet.retweets !== null && tweet.retweets !== undefined && (
          <span>🔁 {formatNumber(tweet.retweets)}</span>
        )}
      </div>
    </a>
  )
}

function VideoCard({ video }: { video: NewsItem }) {
  return (
    <a
      href={video.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        backgroundColor: '#16162a',
        border: '1px solid #2a2a3e',
        borderRadius: '12px',
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'border-color 0.15s ease',
      }}
    >
      {/* Thumbnail */}
      {video.imageUrl && (
        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%', // 16:9
          backgroundColor: '#000',
        }}>
          <img
            src={video.imageUrl}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Play button overlay */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: '20px', marginLeft: '3px' }}>▶</span>
          </div>
        </div>
      )}

      {/* Info */}
      <div style={{ padding: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '12px' }}>▶️</span>
          <span style={{ fontSize: '12px', color: '#ff0000', fontWeight: '500' }}>
            {video.authorName || 'YouTube'}
          </span>
          <span style={{ fontSize: '11px', color: '#666680', marginLeft: 'auto' }}>
            {formatTimeAgo(video.publishedAt)}
          </span>
        </div>
        <p style={{
          fontSize: '14px',
          color: '#fff',
          fontWeight: '500',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          margin: 0,
        }}>
          {video.content}
        </p>
        {video.views !== null && video.views !== undefined && (
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666680' }}>
            👁️ {formatNumber(video.views)} visualizações
          </div>
        )}
      </div>
    </a>
  )
}
