'use client'

import Link from 'next/link'
import { useState } from 'react'

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
  category?: string
  sentiment: number
  closesAt: Date
  signals: Signal[]
  predictions: Prediction[]
  userPrediction?: boolean | null
  onVote?: (rumorId: string, prediction: boolean) => void
  showSignals?: boolean
}

export function RumorCard({
  id,
  title,
  category = 'Transferência',
  sentiment,
  signals,
  userPrediction,
  onVote,
  showSignals = true
}: RumorCardProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [localPrediction, setLocalPrediction] = useState(userPrediction)

  const sentimentPercent = Math.round(sentiment * 100)
  const favorableSignals = signals.filter(s => s.signal === 'favoravel')
  const unfavorableSignals = signals.filter(s => s.signal === 'desfavoravel')

  const handleVote = async (prediction: boolean) => {
    if (isVoting || localPrediction !== undefined) return
    setIsVoting(true)
    setLocalPrediction(prediction)
    onVote?.(id, prediction)
    setIsVoting(false)
  }

  const hasVoted = localPrediction !== undefined

  return (
    <div style={{
      backgroundColor: '#16162a',
      border: '1px solid #2a2a3e',
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Link href={`/rumor/${id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: '600',
            color: '#ff1744',
            backgroundColor: 'rgba(255, 23, 68, 0.15)',
            padding: '4px 10px',
            borderRadius: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>{category}</span>
          <span style={{ fontSize: '11px', color: '#666680' }}>
            {signals.length} {signals.length === 1 ? 'sinal' : 'sinais'}
          </span>
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: 0, lineHeight: '1.4' }}>{title}</h3>
      </Link>

      {/* Body */}
      <div style={{ padding: '0 16px 16px' }}>
        {/* Sentiment Display Compact */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#00f5a0' }}>{sentimentPercent}%</div>
          <div>
            <div style={{ fontSize: '11px', color: '#666680', marginBottom: '2px' }}>sentimento favorável</div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
              <span style={{ color: '#00f5a0' }}>{favorableSignals.length} ✓</span>
              <span style={{ color: '#ff1744' }}>{unfavorableSignals.length} ✗</span>
            </div>
          </div>
        </div>

        {/* Sentiment Bar */}
        <div style={{
          height: '6px',
          backgroundColor: '#2a2a3e',
          borderRadius: '3px',
          marginBottom: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${sentimentPercent}%`,
            background: 'linear-gradient(90deg, #00f5a0, #00d9f5)',
            borderRadius: '3px'
          }}></div>
        </div>

        {/* Vote Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleVote(true)}
            disabled={hasVoted || isVoting}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: hasVoted && localPrediction === true ? '1px solid #00f5a0' : '1px solid transparent',
              fontSize: '13px',
              fontWeight: '600',
              cursor: hasVoted ? 'default' : 'pointer',
              backgroundColor: hasVoted
                ? localPrediction === true
                  ? 'rgba(0, 245, 160, 0.2)'
                  : '#1e1e2e'
                : '#1e2e25',
              color: hasVoted
                ? localPrediction === true
                  ? '#00f5a0'
                  : '#666680'
                : '#00f5a0'
            }}
          >
            👍 Favorável
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={hasVoted || isVoting}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: hasVoted && localPrediction === false ? '1px solid #ff1744' : '1px solid transparent',
              fontSize: '13px',
              fontWeight: '600',
              cursor: hasVoted ? 'default' : 'pointer',
              backgroundColor: hasVoted
                ? localPrediction === false
                  ? 'rgba(255, 23, 68, 0.2)'
                  : '#1e1e2e'
                : '#2e1e1e',
              color: hasVoted
                ? localPrediction === false
                  ? '#ff1744'
                  : '#666680'
                : '#ff1744'
            }}
          >
            👎 Desfavorável
          </button>
        </div>
      </div>

      {/* Signals Preview */}
      {showSignals && signals.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderTop: '1px solid #2a2a3e',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex' }}>
            {signals.slice(0, 3).map((signal, i) => (
              <div
                key={signal.id}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '700',
                  marginLeft: i > 0 ? '-8px' : '0',
                  zIndex: 3 - i,
                  backgroundColor: signal.signal === 'favoravel' ? '#1e3e2e' : '#3e1e1e',
                  border: `2px solid ${signal.signal === 'favoravel' ? '#00f5a0' : '#ff1744'}`,
                  color: '#fff'
                }}
                title={signal.influencer.name}
              >
                {signal.influencer.name.charAt(0)}
              </div>
            ))}
          </div>
          <Link href={`/rumor/${id}`} style={{ fontSize: '12px', color: '#ff1744', textDecoration: 'none' }}>
            Ver {signals.length} {signals.length === 1 ? 'sinal' : 'sinais'} →
          </Link>
        </div>
      )}
    </div>
  )
}
