'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const teams = [
  { id: 'flamengo', name: 'Flamengo', emoji: '🔴⚫' },
  { id: 'corinthians', name: 'Corinthians', emoji: '⚫⚪' },
  { id: 'palmeiras', name: 'Palmeiras', emoji: '💚' },
  { id: 'saopaulo', name: 'São Paulo', emoji: '🔴⚪⚫' },
  { id: 'santos', name: 'Santos', emoji: '⚪⚫' },
  { id: 'fluminense', name: 'Fluminense', emoji: '🟢🔴⚪' },
  { id: 'vasco', name: 'Vasco', emoji: '⚫⚪' },
  { id: 'botafogo', name: 'Botafogo', emoji: '⭐⚫' },
  { id: 'gremio', name: 'Grêmio', emoji: '💙🖤⚪' },
  { id: 'internacional', name: 'Inter', emoji: '🔴⚪' },
  { id: 'atleticomg', name: 'Atlético-MG', emoji: '⚫⚪' },
  { id: 'cruzeiro', name: 'Cruzeiro', emoji: '💙' },
]

const benefits = [
  { icon: '🚨', title: 'Novos sinais', desc: 'Saiba quando influenciadores se manifestam' },
  { icon: '📈', title: 'Mudanças de sentimento', desc: 'Alertas quando rumores esquentam' },
  { icon: '✅', title: 'Resultados', desc: 'Saiba se você acertou seu palpite' }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [step, setStep] = useState(1)

  const handleContinue = () => {
    if (step === 1 && selectedTeam) {
      setStep(2)
    } else if (step === 2) {
      router.push('/home')
    }
  }

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#0f0f1a',
    display: 'flex',
    flexDirection: 'column',
    color: '#ffffff'
  }

  const progressStyle: React.CSSProperties = {
    padding: '16px 20px'
  }

  const progressBarStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    height: '4px',
    borderRadius: '4px',
    backgroundColor: active ? '#ff1744' : '#2a2a3e'
  })

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  }

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '24px'
  }

  const teamButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '16px 8px',
    borderRadius: '12px',
    border: isSelected ? '2px solid #ff1744' : '2px solid #2a2a3e',
    backgroundColor: isSelected ? 'rgba(255, 23, 68, 0.15)' : '#16162a',
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  })

  const benefitCardStyle: React.CSSProperties = {
    backgroundColor: '#16162a',
    borderRadius: '12px',
    padding: '14px',
    border: '1px solid #2a2a3e',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '12px'
  }

  const ctaButtonStyle = (disabled: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '15px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#2a2a3e' : 'linear-gradient(135deg, #ff1744, #8B0000)',
    color: disabled ? '#666680' : '#fff'
  })

  return (
    <main style={containerStyle}>
      {/* Progress */}
      <div style={progressStyle}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={progressBarStyle(step >= 1)} />
          <div style={progressBarStyle(step >= 2)} />
        </div>
      </div>

      {step === 1 && (
        <div style={contentStyle}>
          <div style={headerStyle}>
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>❤️</span>
            <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
              Qual seu time do coração?
            </h1>
            <p style={{ fontSize: '14px', color: '#666680' }}>Personalizamos os rumores pra você</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '16px'
          }}>
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team.id)}
                style={teamButtonStyle(selectedTeam === team.id)}
              >
                <span style={{ fontSize: '24px', marginBottom: '6px' }}>{team.emoji}</span>
                <span style={{
                  fontSize: '11px',
                  color: selectedTeam === team.id ? '#ff1744' : '#a0a0b0',
                  fontWeight: 500
                }}>
                  {team.name}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setSelectedTeam('outro')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: selectedTeam === 'outro' ? '2px solid #ff1744' : '2px solid #2a2a3e',
              backgroundColor: selectedTeam === 'outro' ? 'rgba(255, 23, 68, 0.15)' : '#16162a',
              cursor: 'pointer',
              color: '#a0a0b0',
              fontSize: '13px'
            }}
          >
            Outro time / Sem preferência
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={contentStyle}>
          <div style={headerStyle}>
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🔔</span>
            <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
              Ative as notificações
            </h1>
            <p style={{ fontSize: '14px', color: '#666680' }}>Fique por dentro de cada novidade</p>
          </div>

          <div>
            {benefits.map((item, i) => (
              <div key={i} style={benefitCardStyle}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{item.title}</h3>
                  <p style={{ fontSize: '12px', color: '#666680', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #2a2a3e' }}>
        <button
          onClick={handleContinue}
          disabled={step === 1 && !selectedTeam}
          style={ctaButtonStyle(step === 1 && !selectedTeam)}
        >
          {step === 1 ? 'Continuar' : 'Entrar no app 🎉'}
        </button>

        {step === 2 && (
          <button
            onClick={() => router.push('/home')}
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#666680',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Pular por enquanto
          </button>
        )}
      </div>
    </main>
  )
}
