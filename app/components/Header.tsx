'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  title?: string
  showBack?: boolean
}

export function Header({ title, showBack = false }: HeaderProps) {
  const router = useRouter()

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
          <button
            onClick={() => router.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              padding: 0
            }}
          >
            <span style={{ fontSize: '18px' }}>←</span>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>{title || 'Voltar'}</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <img
                src="/logo.svg"
                alt="Palpiteiros"
                style={{
                  height: '32px',
                  width: 'auto'
                }}
              />
            </Link>
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
