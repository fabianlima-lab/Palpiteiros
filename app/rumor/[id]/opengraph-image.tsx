import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const alt = 'Palpiteiros - Rumor'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let rumor
  try {
    rumor = await prisma.rumor.findUnique({
      where: { id },
      select: {
        title: true,
        playerName: true,
        toTeam: true,
        fromTeam: true,
        categoria: true,
        category: true,
        probabilidade: true,
        sentiment: true,
      },
    })
  } catch (error) {
    console.error('OG Image error:', error)
  }

  if (!rumor) {
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
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: 72, color: '#10B981' }}>⚽</span>
            <span style={{ fontSize: 64, color: '#FAFAFA', fontWeight: 'bold' }}>
              Palpiteiros
            </span>
          </div>
          <span style={{ fontSize: 28, color: '#A1A1AA', marginTop: 24 }}>
            O termômetro dos rumores do futebol
          </span>
        </div>
      ),
      { ...size }
    )
  }

  const probabilidade = rumor.probabilidade ?? 50
  const sentimentPercent = Math.round((rumor.sentiment ?? 0.5) * 100)
  const categoria = rumor.categoria || rumor.category || 'REFORCO'

  const categoryConfig: Record<string, { label: string; color: string }> = {
    REFORCO: { label: '🔥 Reforço', color: '#10B981' },
    SAIDA: { label: '📤 Saída', color: '#EF4444' },
    RENOVACAO: { label: '📝 Renovação', color: '#F59E0B' },
    COMISSAO: { label: '👔 Comissão', color: '#8B5CF6' },
    SELECAO: { label: '🇧🇷 Seleção', color: '#10B981' },
    transferencia: { label: '🔥 Reforço', color: '#10B981' },
    selecao: { label: '🇧🇷 Seleção', color: '#10B981' },
  }

  const cat = categoryConfig[categoria] || categoryConfig.REFORCO

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          backgroundColor: '#09090B',
          padding: '48px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#18181B',
            borderRadius: '24px',
            border: '2px solid #27272A',
            padding: '40px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <span
              style={{
                backgroundColor: cat.color,
                color: '#FAFAFA',
                padding: '8px 20px',
                borderRadius: '999px',
                fontSize: 24,
                fontWeight: 'bold',
              }}
            >
              {cat.label}
            </span>
            <span style={{ color: '#71717A', fontSize: 24 }}>
              {rumor.fromTeam ? `${rumor.fromTeam} → ${rumor.toTeam}` : rumor.toTeam}
            </span>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <span style={{ fontSize: 52, fontWeight: 'bold', color: '#FAFAFA', lineHeight: 1.2 }}>
              {rumor.title}
            </span>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px' }}>
            <div style={{ display: 'flex', gap: '48px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ color: '#71717A', fontSize: 18 }}>📰 PROBABILIDADE</span>
                <span style={{ color: '#FAFAFA', fontSize: 44, fontWeight: 'bold' }}>{probabilidade}%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ color: '#71717A', fontSize: 18 }}>👥 SENTIMENTO</span>
                <span style={{ color: sentimentPercent >= 50 ? '#10B981' : '#EF4444', fontSize: 44, fontWeight: 'bold' }}>
                  {sentimentPercent}%
                  <span style={{ fontSize: 22, marginLeft: '8px' }}>
                    {sentimentPercent >= 50 ? 'positivo' : 'negativo'}
                  </span>
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: 32, color: '#10B981' }}>⚽</span>
              <span style={{ fontSize: 28, color: '#A1A1AA', fontWeight: 'bold' }}>Palpiteiros</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
