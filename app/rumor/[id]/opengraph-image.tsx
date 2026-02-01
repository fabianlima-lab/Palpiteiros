import { ImageResponse } from 'next/og'

// Usar Node runtime para poder usar Prisma
export const runtime = 'nodejs'
export const alt = 'Palpiteiros - Rumores do Futebol'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  // Importar prisma dinamicamente para funcionar com Node runtime
  const { prisma } = await import('@/lib/prisma')

  const rumor = await prisma.rumor.findUnique({
    where: { id: params.id },
    select: {
      title: true,
      playerName: true,
      toTeam: true,
      sentiment: true,
    },
  })

  const title = rumor?.title || 'Rumor do Futebol Brasileiro'
  const player = rumor?.playerName || ''
  const team = rumor?.toTeam || ''
  const sentiment = rumor?.sentiment ? Math.round(rumor.sentiment * 100) : 50

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090B',
          backgroundImage: 'linear-gradient(to bottom right, #09090B, #18181B)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              backgroundColor: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <span style={{ fontSize: 32, color: 'white' }}>💬</span>
          </div>
          <span
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: '#10B981',
            }}
          >
            palpiteiros
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 48,
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.3,
            marginBottom: 30,
          }}
        >
          {title}
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 20,
          }}
        >
          {/* Player */}
          {player && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 32px',
                backgroundColor: '#27272A',
                borderRadius: 12,
              }}
            >
              <span style={{ fontSize: 18, color: '#A1A1AA' }}>Jogador</span>
              <span style={{ fontSize: 28, fontWeight: 600, color: 'white' }}>
                {player}
              </span>
            </div>
          )}

          {/* Team */}
          {team && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 32px',
                backgroundColor: '#27272A',
                borderRadius: 12,
              }}
            >
              <span style={{ fontSize: 18, color: '#A1A1AA' }}>Destino</span>
              <span style={{ fontSize: 28, fontWeight: 600, color: 'white' }}>
                {team}
              </span>
            </div>
          )}

          {/* Sentiment */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 32px',
              backgroundColor: '#27272A',
              borderRadius: 12,
            }}
          >
            <span style={{ fontSize: 18, color: '#A1A1AA' }}>Probabilidade</span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: sentiment >= 60 ? '#10B981' : sentiment >= 40 ? '#F59E0B' : '#EF4444',
              }}
            >
              {sentiment}%
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 20,
            color: '#71717A',
          }}
        >
          palpiteiro-mvp.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
