'use client'

import { RumorCard } from '../components/RumorCard'
import { trpc } from '@/lib/trpc'

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
  userId: string
}

interface Rumor {
  id: string
  playerName: string
  playerImage: string | null
  fromTeam: string | null
  toTeam: string
  title: string
  category: string
  sentiment: number
  closesAt: Date
  signals: Signal[]
  predictions: Prediction[]
}

interface HomeClientProps {
  rumors: Rumor[]
  userId?: string
}

export function HomeClient({ rumors, userId }: HomeClientProps) {
  const utils = trpc.useUtils()
  const voteMutation = trpc.rumors.vote.useMutation({
    onSuccess: () => {
      utils.rumors.list.invalidate()
    },
  })

  const handleVote = (rumorId: string, prediction: boolean) => {
    if (!userId) return
    voteMutation.mutate({
      rumorId,
      prediction,
      userId,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {rumors.map((rumor) => {
        const userPrediction = rumor.predictions.find(p => p.userId === userId)
        return (
          <RumorCard
            key={rumor.id}
            id={rumor.id}
            playerName={rumor.playerName}
            playerImage={rumor.playerImage}
            fromTeam={rumor.fromTeam}
            toTeam={rumor.toTeam}
            title={rumor.title}
            category={rumor.category}
            sentiment={rumor.sentiment}
            closesAt={rumor.closesAt}
            signals={rumor.signals}
            predictions={rumor.predictions}
            userPrediction={userPrediction?.prediction}
            onVote={handleVote}
          />
        )
      })}

      {rumors.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 16px' }}>
          <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🤷</span>
          <span style={{ color: '#666680', fontSize: '14px' }}>Nenhum rumor no momento</span>
        </div>
      )}
    </div>
  )
}
