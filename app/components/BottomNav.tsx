'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Mapeamento de times para emojis
const TEAM_EMOJIS: Record<string, string> = {
  'Flamengo': '🔴⚫',
  'Corinthians': '⚫⚪',
  'Palmeiras': '💚',
  'Santos': '⚪⚫',
  'São Paulo': '🔴⚪⚫',
  'Botafogo': '⭐⚫',
  'Fluminense': '🟢🟣⚪',
  'Vasco': '⚫⚪',
  'Atlético-MG': '⚫⚪',
  'Cruzeiro': '💙',
  'Internacional': '🔴⚪',
  'Grêmio': '💙🖤⚪',
}

export function BottomNav() {
  const pathname = usePathname()
  const [userTeam, setUserTeam] = useState<string | null>('Flamengo') // Default para demo

  // Em produção, isso viria de um contexto de usuário ou API
  useEffect(() => {
    // Simula buscar o time do usuário
    // Em produção: fetch('/api/user').then(res => res.json()).then(data => setUserTeam(data.team))
    setUserTeam('Flamengo')
  }, [])

  const teamEmoji = userTeam ? (TEAM_EMOJIS[userTeam] || '⚽') : '⚽'

  // Don't show on landing page or onboarding
  if (pathname === '/' || pathname === '/onboarding') {
    return null
  }

  const navItems = [
    { href: '/home', label: 'Meu Time', icon: teamEmoji, activeIcon: teamEmoji },
    { href: '/explorar', label: 'Explorar', icon: '🔍', activeIcon: '🔍' },
    { href: '/ranking', label: 'Ranking', icon: '🏆', activeIcon: '🏆' },
    { href: '/perfil', label: 'Perfil', icon: '👤', activeIcon: '👤' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(180deg, rgba(10, 10, 18, 0.95) 0%, rgba(10, 10, 18, 0.99) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(139, 92, 246, 0.2)',
      padding: '6px 8px',
      paddingBottom: 'max(6px, env(safe-area-inset-bottom))',
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '16px',
                minWidth: '64px',
                background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{
                fontSize: '22px',
                filter: isActive ? 'none' : 'grayscale(0.5)',
                opacity: isActive ? 1 : 0.6,
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}>
                {isActive ? item.activeIcon : item.icon}
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#8b5cf6' : '#666680',
                transition: 'all 0.2s ease'
              }}>
                {item.label}
              </span>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  width: '20px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                  borderRadius: '0 0 4px 4px'
                }} />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
