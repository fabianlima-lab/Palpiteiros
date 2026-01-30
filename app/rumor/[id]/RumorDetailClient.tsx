'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'

interface RumorDetailClientProps {
  rumorId: string
  userId?: string
  userPrediction?: boolean
}

export function RumorDetailClient({ rumorId, userId, userPrediction }: RumorDetailClientProps) {
  const [localPrediction, setLocalPrediction] = useState(userPrediction)
  const [isVoting, setIsVoting] = useState(false)

  const voteMutation = trpc.rumors.vote.useMutation({
    onSuccess: () => {
      setIsVoting(false)
    },
    onError: () => {
      setIsVoting(false)
      setLocalPrediction(userPrediction)
    },
  })

  const handleVote = (prediction: boolean) => {
    if (!userId || isVoting || localPrediction !== undefined) return
    setIsVoting(true)
    setLocalPrediction(prediction)
    voteMutation.mutate({
      rumorId,
      prediction,
      userId,
    })
  }

  const hasVoted = localPrediction !== undefined

  return (
    <div style={{
      backgroundColor: '#16162a',
      border: '1px solid #2a2a3e',
      borderRadius: '16px',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600', marginBottom: '16px' }}>
        🎯 Qual é o seu palpite?
      </div>

      {hasVoted ? (
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: localPrediction ? 'rgba(0, 245, 160, 0.1)' : 'rgba(255, 23, 68, 0.1)',
          border: `1px solid ${localPrediction ? 'rgba(0, 245, 160, 0.3)' : 'rgba(255, 23, 68, 0.3)'}`
        }}>
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>
            {localPrediction ? '👍' : '👎'}
          </span>
          <p style={{ fontSize: '14px', color: '#fff', fontWeight: '600', marginBottom: '4px' }}>
            Você palpitou: {localPrediction ? 'Favorável' : 'Desfavorável'}
          </p>
          <p style={{ fontSize: '12px', color: '#666680', margin: 0 }}>Aguarde o resultado 🤞</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => handleVote(true)}
            disabled={isVoting}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#1e2e25',
              color: '#00f5a0',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isVoting ? 'not-allowed' : 'pointer',
              opacity: isVoting ? 0.7 : 1
            }}
          >
            👍 Favorável
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={isVoting}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#2e1e1e',
              color: '#ff1744',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isVoting ? 'not-allowed' : 'pointer',
              opacity: isVoting ? 0.7 : 1
            }}
          >
            👎 Desfavorável
          </button>
        </div>
      )}
    </div>
  )
}
