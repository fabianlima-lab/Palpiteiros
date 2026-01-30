import Link from 'next/link'

interface InfluencerCardProps {
  id: string
  name: string
  username: string
  outlet: string
  trustScore: number
  totalHits: number
  totalMisses: number
  rank?: number
}

export function InfluencerCard({
  id,
  name,
  username,
  outlet,
  trustScore,
  totalHits,
  totalMisses,
  rank
}: InfluencerCardProps) {
  const accuracy = Math.round(trustScore * 100)

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <Link href={`/influenciador/${id}`}>
      <div className="bg-[#16162a] rounded-xl border border-[#2a2a3e] p-4 card-hover">
        <div className="flex items-center gap-3">
          {/* Rank */}
          {rank && (
            <div className="w-8 text-center shrink-0">
              <span className={`text-lg ${rank <= 3 ? '' : 'text-[#6b6b7b] text-sm'}`}>
                {getRankEmoji(rank)}
              </span>
            </div>
          )}

          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff1744] to-[#ff4444] rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">
            {name.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">{name}</h3>
            <p className="text-[#6b6b7b] text-xs truncate">{outlet}</p>
          </div>

          {/* Stats */}
          <div className="text-right shrink-0">
            <div className={`text-lg font-bold ${
              accuracy >= 80 ? 'text-[#00e676]' :
              accuracy >= 60 ? 'text-[#ffab00]' : 'text-[#ff1744]'
            }`}>
              {accuracy}%
            </div>
            <div className="text-xs text-[#6b6b7b]">
              {totalHits}✅ {totalMisses}❌
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
