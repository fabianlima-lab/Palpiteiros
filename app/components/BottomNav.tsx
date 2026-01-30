'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/home', label: 'Home', icon: '🏠' },
  { href: '/explorar', label: 'Explorar', icon: '🔍' },
  { href: '/ranking', label: 'Ranking', icon: '🏆' },
  { href: '/perfil', label: 'Perfil', icon: '👤' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(15, 15, 26, 0.98)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid #2a2a3e',
      padding: '8px 16px',
      paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '500px',
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
                gap: '4px',
                color: isActive ? '#ff1744' : '#666680',
                fontSize: '10px',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '12px',
                position: 'relative'
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '24px',
                  height: '3px',
                  background: '#ff1744',
                  borderRadius: '0 0 3px 3px'
                }} />
              )}
              <div style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                borderRadius: '10px',
                background: isActive ? 'rgba(255, 23, 68, 0.15)' : 'transparent'
              }}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
