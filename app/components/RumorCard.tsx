'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ReactionPicker, SentimentBar, ReactionEmoji } from './ReactionPicker'

interface Signal {
  id: string
  signal: string
  confidence: number
  influencer: {
    id: string
    name: string
    username: string
    outlet: string
    trustScore: number
  }
}

interface Prediction {
  id: string
  prediction: boolean
}

interface RumorCardProps {
  id: string
  playerName: string
  playerImage?: string | null
  fromTeam?: string | null
  toTeam: string
  title: string
  description?: string | null
  category?: string
  sentiment: number
  closesAt: Date
  signals: Signal[]
  predictions: Prediction[]
  userPrediction?: boolean | null
  onVote?: (rumorId: string, prediction: boolean) => void
  showSignals?: boolean
  newsCount?: number
}

// Categorias
const CATEGORY_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  transferencia: { label: 'Transferência', emoji: '⚽', color: '#ff1744' },
  tecnico: { label: 'Técnico', emoji: '📋', color: '#ffd700' },
  titulo: { label: 'Título', emoji: '🏆', color: '#00f5a0' },
  selecao: { label: 'Seleção', emoji: '🇧🇷', color: '#00d9f5' },
}

export function RumorCard({
  id,
  title,
  description,
  category = 'transferencia',
  sentiment,
  signals,
  predictions,
  showSignals = true,
}: RumorCardProps) {
  const [selectedReaction, setSelectedReaction] = useState<ReactionEmoji | null>(null)

  const totalReactions = predictions.length
  const categoryInfo = CATEGORY_LABELS[category] || CATEGORY_LABELS.transferencia

  // Criar contagem de reações simulada baseada no sentimento
  const reactionCounts: Record<ReactionEmoji, number> = {
    '🔥': Math.floor(totalReactions * sentiment * 0.4),
    '👍': Math.ceil(totalReactions * sentiment * 0.6),
    '😐': 0,
    '😕': Math.ceil(totalReactions * (1 - sentiment) * 0.6),
    '💔': Math.floor(totalReactions * (1 - sentiment) * 0.4),
  }

  // Calcular sentimento em porcentagem
  const sentimentPercent = Math.round(sentiment * 100)
  const sentimentColor = sentiment >= 0.7 ? '#00f5a0' : sentiment >= 0.4 ? '#ffd700' : '#ff1744'

  const handleReact = (emoji: ReactionEmoji) => {
    setSelectedReaction(emoji)
    // A API é chamada pelo ReactionPicker
  }

  return (
    <div style={{
      backgroundColor: '#16162a',
      border: '1px solid #2a2a3e',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Header - Clickable */}
      <Link
        href={`/rumor/${id}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          padding: '16px',
          paddingBottom: '12px',
        }}
      >
        {/* Category & Sentiment Badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}>
          <span style={{
            fontSize: '10px',
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

          {/* Sentiment Score */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{
              fontSize: '18px',
              fontWeight: '800',
              color: sentimentColor,
            }}>
              {sentimentPercent}%
            </span>
            <span style={{ fontSize: '14px' }}>
              {sentiment >= 0.7 ? '🔥' : sentiment < 0.3 ? '💔' : ''}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#fff',
          margin: 0,
          lineHeight: '1.4',
          marginBottom: description ? '8px' : 0,
        }}>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p style={{
            fontSize: '13px',
            color: '#a0a0b0',
            lineHeight: '1.4',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {description}
          </p>
        )}
      </Link>

      {/* Sentiment Bar */}
      <div style={{ padding: '0 16px', marginBottom: '12px' }}>
        <SentimentBar reactionCounts={reactionCounts} showLabels={false} />
      </div>

      {/* Reactions - Compact */}
      <div style={{ padding: '0 16px 12px' }}>
        <ReactionPicker
          rumorId={id}
          userReaction={selectedReaction}
          reactionCounts={reactionCounts}
          onReact={handleReact}
          compact
        />
      </div>

      {/* Footer Stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderTop: '1px solid #2a2a3e',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          fontSize: '11px',
          color: '#666680',
        }}>
          {signals.length > 0 && <span>📢 {signals.length} sinais</span>}
          {totalReactions > 0 && <span>👥 {totalReactions} reações</span>}
        </div>

        <Link
          href={`/rumor/${id}`}
          style={{
            fontSize: '12px',
            color: '#00f5a0',
            textDecoration: 'none',
            fontWeight: '500',
          }}
        >
          Ver mais →
        </Link>
      </div>

      {/* Influencer Signals Preview */}
      {showSignals && signals.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 16px',
          borderTop: '1px solid #2a2a3e',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
        }}>
          <div style={{
            display: 'flex',
            marginRight: '10px',
          }}>
            {signals.slice(0, 3).map((signal, i) => (
              <div
                key={signal.id}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '700',
                  marginLeft: i > 0 ? '-8px' : '0',
                  zIndex: 3 - i,
                  backgroundColor: signal.signal === 'favoravel' ? '#1e3e2e' : '#3e1e1e',
                  border: `2px solid ${signal.signal === 'favoravel' ? '#00f5a0' : '#ff1744'}`,
                  color: '#fff',
                }}
                title={signal.influencer.name}
              >
                {signal.influencer.name.charAt(0)}
              </div>
            ))}
          </div>
          <span style={{ fontSize: '11px', color: '#a0a0b0' }}>
            {signals[0]?.influencer.name}
            {signals.length > 1 && ` e mais ${signals.length - 1}`}
          </span>
        </div>
      )}
    </div>
  )
}
