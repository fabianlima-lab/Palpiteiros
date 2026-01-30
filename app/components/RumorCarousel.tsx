'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const BRAND = {
  primary: '#8b5cf6',
  primaryDark: '#6d28d9',
  secondary: '#06b6d4',
  accent: '#f59e0b',
  success: '#10b981',
}

type Rumor = {
  id: string
  title: string
  predictions: { id: string }[]
  signals: { signal: string }[]
}

const DEFAULT_RUMORS: Rumor[] = [
  { id: 'demo1', title: 'Neymar no Santos', predictions: Array(234).fill({ id: '1' }), signals: Array(10).fill({ signal: 'FAVORABLE' }).concat(Array(5).fill({ signal: 'SKEPTICAL' })) },
  { id: 'demo2', title: 'Gabigol no Cruzeiro', predictions: Array(189).fill({ id: '1' }), signals: Array(7).fill({ signal: 'FAVORABLE' }).concat(Array(8).fill({ signal: 'SKEPTICAL' })) },
  { id: 'demo3', title: 'Dudu no Flamengo', predictions: Array(156).fill({ id: '1' }), signals: Array(4).fill({ signal: 'FAVORABLE' }).concat(Array(6).fill({ signal: 'SKEPTICAL' })) },
  { id: 'demo4', title: 'Coutinho no Vasco', predictions: Array(98).fill({ id: '1' }), signals: Array(6).fill({ signal: 'FAVORABLE' }).concat(Array(4).fill({ signal: 'SKEPTICAL' })) },
]

export default function RumorCarousel({ rumors }: { rumors?: Rumor[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const displayRumors = rumors && rumors.length > 0 ? rumors : DEFAULT_RUMORS

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayRumors.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, displayRumors.length])

  const goTo = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goNext = () => goTo((currentIndex + 1) % displayRumors.length)
  const goPrev = () => goTo((currentIndex - 1 + displayRumors.length) % displayRumors.length)

  const currentRumor = displayRumors[currentIndex]
  const totalPreds = currentRumor.predictions?.length || 0
  const favorableSignals = currentRumor.signals?.filter((s) => s.signal === 'FAVORABLE').length || 0
  const totalSignals = currentRumor.signals?.length || 1
  const probability = totalSignals > 0 ? Math.round((favorableSignals / totalSignals) * 100) : 50

  return (
    <div style={{ marginTop: '32px', maxWidth: '400px', margin: '32px auto 0' }}>
      {/* Carrossel Container */}
      <div
        style={{
          position: 'relative',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(251, 146, 60, 0.05) 100%)',
          border: '1px solid rgba(251, 146, 60, 0.3)',
          borderRadius: '16px',
        }}
      >
        {/* Setas de navegação */}
        <button
          onClick={goPrev}
          style={{
            position: 'absolute',
            left: '-12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.9)',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 10,
          }}
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          onClick={goNext}
          style={{
            position: 'absolute',
            right: '-12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.9)',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 10,
          }}
          aria-label="Próximo"
        >
          ›
        </button>

        {/* Conteúdo do Card */}
        <Link
          href={rumors && rumors.length > 0 ? `/rumor/${currentRumor.id}` : '/onboarding'}
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '16px' }}>🔥</span>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              color: BRAND.accent,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Rumor Quente</span>
          </div>

          <h3 style={{
            fontSize: '20px',
            fontWeight: '800',
            color: '#fff',
            marginBottom: '16px',
            minHeight: '28px',
          }}>
            {currentRumor.title}
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px'
            }}>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>acham que acontece</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: BRAND.accent }}>{probability}%</span>
            </div>
            <div style={{
              height: '8px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${probability}%`,
                background: `linear-gradient(90deg, ${BRAND.accent}, #fb923c)`,
                borderRadius: '4px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              {totalPreds} palpites
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: BRAND.primary
            }}>
              Dar meu palpite →
            </span>
          </div>
        </Link>
      </div>

      {/* Indicadores (dots) */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '16px'
      }}>
        {displayRumors.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            style={{
              width: index === currentIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: index === currentIndex ? BRAND.accent : 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
            aria-label={`Ir para rumor ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
