'use client'

import { useState } from 'react'

// Sistema de reações tipo Slack para expressar sentimento
// Focado em SENTIMENTO, não em previsão binária

// PRD v3: Novos emojis com valores de -2 a +2
export const REACTIONS = [
  { emoji: '🔥', label: 'Quero muito', sentiment: 1.0, value: 2 },
  { emoji: '😍', label: 'Gosto', sentiment: 0.75, value: 1 },
  { emoji: '😐', label: 'Tanto faz', sentiment: 0.5, value: 0 },
  { emoji: '👎', label: 'Não gosto', sentiment: 0.25, value: -1 },
  { emoji: '💀', label: 'Péssima ideia', sentiment: 0.0, value: -2 },
] as const

export type ReactionEmoji = typeof REACTIONS[number]['emoji']

interface ReactionPickerProps {
  rumorId: string
  userId?: string
  userReaction?: ReactionEmoji | null
  reactionCounts?: Record<ReactionEmoji, number>
  onReact?: (emoji: ReactionEmoji) => void
  compact?: boolean
}

export function ReactionPicker({
  rumorId,
  userId,
  userReaction,
  reactionCounts = {} as Record<ReactionEmoji, number>,
  onReact,
  compact = false,
}: ReactionPickerProps) {
  const [selectedReaction, setSelectedReaction] = useState<ReactionEmoji | null>(userReaction || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  const handleReact = async (emoji: ReactionEmoji) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    setSelectedReaction(emoji)
    setShowPicker(false)

    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rumorId,
          userId: userId || 'anonymous',
          reaction: emoji,
        }),
      })
      onReact?.(emoji)
    } catch (error) {
      console.error('Erro ao reagir:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Total de reações
  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0)

  // Se compact, mostrar apenas as reações existentes + botão de adicionar
  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap',
      }}>
        {/* Reações existentes */}
        {REACTIONS.filter(r => (reactionCounts[r.emoji] || 0) > 0).map(reaction => (
          <button
            key={reaction.emoji}
            onClick={() => handleReact(reaction.emoji)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '16px',
              border: selectedReaction === reaction.emoji
                ? '1px solid #00f5a0'
                : '1px solid #2a2a3e',
              backgroundColor: selectedReaction === reaction.emoji
                ? 'rgba(0, 245, 160, 0.15)'
                : '#1a1a2e',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            <span>{reaction.emoji}</span>
            <span style={{
              color: selectedReaction === reaction.emoji ? '#00f5a0' : '#a0a0b0',
              fontSize: '12px',
              fontWeight: '500',
            }}>
              {reactionCounts[reaction.emoji] || 0}
            </span>
          </button>
        ))}

        {/* Botão de adicionar reação */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowPicker(!showPicker)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '14px',
              border: '1px solid #2a2a3e',
              backgroundColor: '#1a1a2e',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#666680',
            }}
          >
            +
          </button>

          {/* Picker dropdown */}
          {showPicker && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
              display: 'flex',
              gap: '4px',
              padding: '8px',
              backgroundColor: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 100,
            }}>
              {REACTIONS.map(reaction => (
                <button
                  key={reaction.emoji}
                  onClick={() => handleReact(reaction.emoji)}
                  title={reaction.label}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: '20px',
                    transition: 'transform 0.1s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {reaction.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {totalReactions > 0 && (
          <span style={{ fontSize: '11px', color: '#666680', marginLeft: '4px' }}>
            {totalReactions} reações
          </span>
        )}
      </div>
    )
  }

  // Versão completa para página de detalhes
  return (
    <div style={{
      backgroundColor: '#16162a',
      border: '1px solid #2a2a3e',
      borderRadius: '16px',
      padding: '20px',
    }}>
      <div style={{
        fontSize: '14px',
        color: '#fff',
        fontWeight: '600',
        marginBottom: '8px',
        textAlign: 'center',
      }}>
        Como você se sente sobre isso?
      </div>

      <div style={{
        fontSize: '12px',
        color: '#666680',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        Sua reação ajuda a medir o sentimento da torcida
      </div>

      {/* Grid de reações */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        marginBottom: '16px',
      }}>
        {REACTIONS.map(reaction => {
          const count = reactionCounts[reaction.emoji] || 0
          const isSelected = selectedReaction === reaction.emoji

          return (
            <button
              key={reaction.emoji}
              onClick={() => handleReact(reaction.emoji)}
              disabled={isSubmitting}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '12px 8px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #00f5a0' : '1px solid #2a2a3e',
                backgroundColor: isSelected ? 'rgba(0, 245, 160, 0.1)' : '#1a1a2e',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              <span style={{
                fontSize: '28px',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.15s ease',
              }}>
                {reaction.emoji}
              </span>
              <span style={{
                fontSize: '10px',
                color: isSelected ? '#00f5a0' : '#a0a0b0',
                fontWeight: isSelected ? '600' : '400',
              }}>
                {reaction.label}
              </span>
              {count > 0 && (
                <span style={{
                  fontSize: '11px',
                  color: isSelected ? '#00f5a0' : '#666680',
                  fontWeight: '600',
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Resumo do sentimento */}
      {totalReactions > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
        }}>
          <span style={{ fontSize: '12px', color: '#666680' }}>
            {totalReactions} {totalReactions === 1 ? 'torcedor reagiu' : 'torcedores reagiram'}
          </span>
        </div>
      )}

      {selectedReaction && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: 'rgba(0, 245, 160, 0.1)',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '12px', color: '#00f5a0' }}>
            ✓ Sua reação foi registrada!
          </span>
        </div>
      )}
    </div>
  )
}

// Barra de sentimento baseada em reações
interface SentimentBarProps {
  reactionCounts: Record<ReactionEmoji, number>
  showLabels?: boolean
}

export function SentimentBar({ reactionCounts, showLabels = true }: SentimentBarProps) {
  // Calcular sentimento médio ponderado
  let totalWeight = 0
  let weightedSum = 0

  for (const reaction of REACTIONS) {
    const count = reactionCounts[reaction.emoji] || 0
    totalWeight += count
    weightedSum += count * reaction.sentiment
  }

  const avgSentiment = totalWeight > 0 ? weightedSum / totalWeight : 0.5
  const sentimentPercent = Math.round(avgSentiment * 100)

  // Cor baseada no sentimento
  const getColor = (sentiment: number) => {
    if (sentiment >= 0.7) return '#00f5a0'
    if (sentiment >= 0.4) return '#ffd700'
    return '#ff1744'
  }

  const color = getColor(avgSentiment)

  return (
    <div>
      {showLabels && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '12px', color: '#666680' }}>Sentimento</span>
          <span style={{
            fontSize: '14px',
            fontWeight: '700',
            color,
          }}>
            {sentimentPercent}%
            {avgSentiment >= 0.7 && ' 🔥'}
            {avgSentiment < 0.3 && ' 💔'}
          </span>
        </div>
      )}

      <div style={{
        height: '8px',
        backgroundColor: '#2a2a3e',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${sentimentPercent}%`,
          backgroundColor: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  )
}
