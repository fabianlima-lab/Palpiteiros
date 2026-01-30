'use client'

import { useState } from 'react'

interface PremiumPopupProps {
  teamName: string
  onClose?: () => void
}

export function PremiumPopup({ teamName, onClose }: PremiumPopupProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 200,
      opacity: isClosing ? 0 : 1,
      transition: 'opacity 0.3s'
    }}>
      <div style={{
        backgroundColor: '#16162a',
        border: '1px solid #2a2a3e',
        borderRadius: '20px',
        padding: '24px',
        maxWidth: '360px',
        width: '100%',
        textAlign: 'center',
        transform: isClosing ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.3s'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #ffab00, #ffd740)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          margin: '0 auto 16px'
        }}>⭐</div>

        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
          Desbloqueie o{' '}
          <span style={{
            background: 'linear-gradient(135deg, #ff1744, #fff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>{teamName}</span>
        </h2>

        <p style={{ fontSize: '13px', color: '#a0a0b0', marginBottom: '20px', lineHeight: '1.5' }}>
          Acesse rumores exclusivos, sinais de influenciadores e muito mais do seu time do coração!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', textAlign: 'left' }}>
          {[
            { icon: '🔓', text: 'Acesso a todos os times' },
            { icon: '📊', text: 'Estatísticas avançadas' },
            { icon: '🔔', text: 'Alertas de rumores em tempo real' },
            { icon: '🏆', text: 'Ranking de palpiteiros' },
          ].map((feature, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px'
            }}>
              <span style={{ fontSize: '16px' }}>{feature.icon}</span>
              <span style={{ fontSize: '13px', color: '#fff' }}>{feature.text}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #2a1515 0%, #1a0a0a 100%)',
          border: '1px solid #4a2020',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'inline-block',
            background: '#ff1744',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            🎁 Primeiro mês GRÁTIS
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
            <span style={{ fontSize: '16px', color: '#a0a0b0' }}>R$</span>
            <span style={{ fontSize: '40px', fontWeight: '800', color: '#ff1744' }}>49</span>
            <span style={{ fontSize: '14px', color: '#666680' }}>/mês</span>
          </div>
          <p style={{ fontSize: '11px', color: '#666680', margin: 0 }}>Cancele quando quiser</p>
        </div>

        <button style={{
          width: '100%',
          padding: '14px',
          background: 'linear-gradient(135deg, #ff1744, #8B0000)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '15px',
          fontWeight: '700',
          cursor: 'pointer',
          marginBottom: '12px'
        }}>
          Começar teste grátis
        </button>

        <button
          onClick={handleClose}
          style={{
            width: '100%',
            padding: '12px',
            background: 'transparent',
            border: 'none',
            color: '#666680',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Continuar sem Premium
        </button>
      </div>
    </div>
  )
}
