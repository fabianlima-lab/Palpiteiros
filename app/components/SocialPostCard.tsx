interface SocialPostCardProps {
  platform: string
  author: string
  username: string
  content: string
  likes: number
  comments: number
  shares: number
  postedAt: Date
}

export function SocialPostCard({
  platform,
  author,
  username,
  content,
  likes,
  comments,
  shares,
  postedAt
}: SocialPostCardProps) {
  const getPlatformEmoji = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return '𝕏'
      case 'youtube': return '▶️'
      case 'tiktok': return '🎵'
      case 'instagram': return '📸'
      default: return '📱'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d`
    if (diffHours > 0) return `${diffHours}h`
    if (diffMins > 0) return `${diffMins}m`
    return 'agora'
  }

  return (
    <div style={{
      backgroundColor: '#16162a',
      borderRadius: '12px',
      border: '1px solid #2a2a3e',
      padding: '14px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #1a1a2e, #2a2a3e)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '700',
          fontSize: '14px'
        }}>
          {author.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              color: '#fff',
              fontWeight: '600',
              fontSize: '13px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>{author}</span>
            <span style={{ fontSize: '16px' }}>{getPlatformEmoji(platform)}</span>
          </div>
          <p style={{ color: '#666680', fontSize: '11px', margin: 0 }}>@{username} · {getTimeAgo(postedAt)}</p>
        </div>
      </div>

      {/* Content */}
      <p style={{ color: '#a0a0b0', fontSize: '13px', lineHeight: '1.5', marginBottom: '12px' }}>
        {content}
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: '#666680' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>❤️</span>
          <span>{formatNumber(likes)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>💬</span>
          <span>{formatNumber(comments)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>🔄</span>
          <span>{formatNumber(shares)}</span>
        </div>
      </div>
    </div>
  )
}
