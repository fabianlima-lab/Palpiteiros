'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '../../components/Header'
import { BottomNav } from '../../components/BottomNav'
import { PremiumPopup } from '../../components/PremiumPopup'

interface TeamData {
  name: string
  emoji: string
  color: string
  colorDark: string
}

interface Influencer {
  id: string
  name: string
  trustScore: number
}

interface User {
  id: string
  name: string
  points: number
}

interface TeamRumor {
  title: string
  category: string
  sentiment: number
}

interface TeamPageClientProps {
  teamId: string
  teamData: TeamData
  influencers: Influencer[]
  topUsers: User[]
  teamRumors: TeamRumor[]
  isPremium: boolean
}

export function TeamPageClient({
  teamId,
  teamData,
  influencers,
  topUsers,
  teamRumors,
  isPremium,
}: TeamPageClientProps) {
  const [showPremiumPopup, setShowPremiumPopup] = useState(!isPremium)

  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Team Header */}
      <div style={{
        background: `linear-gradient(135deg, ${teamData.colorDark} 0%, #0f0f1a 100%)`,
        padding: '24px 16px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          margin: '0 auto 12px',
          border: `3px solid ${teamData.color}`,
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}>
          {teamData.emoji}
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{teamData.name}</h1>
        <p style={{ fontSize: '13px', color: '#a0a0b0' }}>Rumores e palpites</p>
      </div>

      <div style={{
        padding: '16px',
        maxWidth: '800px',
        margin: '0 auto',
        filter: showPremiumPopup ? 'blur(4px)' : 'none',
        pointerEvents: showPremiumPopup ? 'none' : 'auto'
      }}>
        {/* Top Influenciadores */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
          📰 TOP INFLUENCIADORES
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '8px' }}>
          {influencers.map((inf, index) => (
            <Link key={inf.id} href={`/influenciador/${inf.id}`} style={{
              flexShrink: 0,
              backgroundColor: '#16162a',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              padding: '14px',
              minWidth: '100px',
              textAlign: 'center',
              textDecoration: 'none'
            }}>
              <div style={{ fontSize: '10px', color: '#666680', marginBottom: '8px' }}>#{index + 1}</div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ff1744, #8B0000)',
                color: 'white'
              }}>
                {inf.name.charAt(0)}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                {inf.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#00f5a0' }}>
                {Math.round(inf.trustScore * 100)}%
              </div>
              <div style={{ fontSize: '10px', color: '#666680' }}>acertos</div>
            </Link>
          ))}
        </div>

        {/* Top Palpiteiros */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
          🏆 TOP PALPITEIROS
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '8px' }}>
          {topUsers.map((user, index) => (
            <div key={user.id} style={{
              flexShrink: 0,
              backgroundColor: '#16162a',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              padding: '14px',
              minWidth: '100px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '10px', color: '#666680', marginBottom: '8px' }}>#{index + 1}</div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #00d9f5, #0088cc)',
                color: 'white'
              }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                {user.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#00f5a0' }}>
                {user.points.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#666680' }}>pontos</div>
            </div>
          ))}
        </div>

        {/* Rumores do Time */}
        <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>
          🔥 RUMORES QUENTES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {teamRumors.map((rumor, index) => (
            <div key={index} style={{
              backgroundColor: '#16162a',
              border: '1px solid #2a2a3e',
              borderRadius: '16px',
              padding: '16px'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#ff1744',
                  backgroundColor: 'rgba(255, 23, 68, 0.15)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{rumor.category}</span>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', margin: '8px 0 0' }}>{rumor.title}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#00f5a0' }}>{rumor.sentiment}%</div>
                <div>
                  <div style={{ fontSize: '11px', color: '#666680', marginBottom: '2px' }}>sentimento favorável</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                    <span style={{ color: '#00f5a0' }}>{Math.floor(rumor.sentiment / 10)} ✓</span>
                    <span style={{ color: '#ff1744' }}>{Math.floor((100 - rumor.sentiment) / 10)} ✗</span>
                  </div>
                </div>
              </div>
              <div style={{
                height: '6px',
                backgroundColor: '#2a2a3e',
                borderRadius: '3px',
                marginBottom: '16px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${rumor.sentiment}%`,
                  background: 'linear-gradient(90deg, #00f5a0, #00d9f5)',
                  borderRadius: '3px'
                }}></div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#1e2e25',
                  color: '#00f5a0',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  👍 Favorável
                </button>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#2e1e1e',
                  color: '#ff1744',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  👎 Desfavorável
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          backgroundColor: '#16162a',
          border: '1px solid #2a2a3e',
          borderRadius: '12px',
          padding: '14px',
          marginTop: '24px'
        }}>
          <div style={{ fontSize: '20px' }}>💡</div>
          <div style={{ fontSize: '12px', color: '#a0a0b0', lineHeight: '1.5' }}>
            Acompanhe todos os rumores do {teamData.name} e dê seu palpite!
            Os influenciadores mais confiáveis analisam cada transferência.
          </div>
        </div>
      </div>

      <BottomNav />

      {/* Premium Popup */}
      {showPremiumPopup && (
        <PremiumPopup
          teamName={teamData.name}
          onClose={() => setShowPremiumPopup(false)}
        />
      )}
    </main>
  )
}
