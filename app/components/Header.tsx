'use client'

import Link from 'next/link'

interface HeaderProps {
  title?: string
  showBack?: boolean
}

export function Header({ title, showBack = false }: HeaderProps) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      backgroundColor: 'rgba(15, 15, 26, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid #2a2a3e',
      padding: '12px 16px',
      zIndex: 50
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {showBack ? (
          <Link href="/home" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#fff'
          }}>
            <span style={{ fontSize: '18px' }}>←</span>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>{title || 'Voltar'}</span>
          </Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #8B0000, #000)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>🔴</div>
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ff1744, #fff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Palpiteiro</span>
          </div>
        )}

        <Link href="/perfil" style={{
          width: '36px',
          height: '36px',
          backgroundColor: '#1e2235',
          borderRadius: '50%',
          border: '2px solid #ff1744',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          textDecoration: 'none'
        }}>
          👤
        </Link>
      </div>
    </header>
  )
}
