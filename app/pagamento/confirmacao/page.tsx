'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ConfirmacaoPage() {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '-20px',
                left: `${Math.random() * 100}%`,
                width: '10px',
                height: '10px',
                backgroundColor: ['#ff1744', '#00f5a0', '#ffd740', '#00d9f5', '#ff6b6b'][i % 5],
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                animation: `confetti ${2 + Math.random() * 2}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        {/* Success Icon */}
        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #00f5a0 0%, #00d9f5 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 10px 40px rgba(0, 245, 160, 0.3)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <span style={{ fontSize: '50px' }}>✓</span>
        </div>

        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#fff',
          marginBottom: '8px'
        }}>
          Parabéns! 🎉
        </h1>

        <p style={{
          color: '#a0a0b0',
          fontSize: '16px',
          marginBottom: '8px'
        }}>
          Você agora é <span style={{ color: '#ffd740', fontWeight: '700' }}>Premium</span>!
        </p>

        <p style={{
          color: '#666680',
          fontSize: '13px',
          marginBottom: '32px'
        }}>
          Seu período gratuito de 30 dias já começou
        </p>

        {/* Premium Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #ffd740 0%, #ffab00 100%)',
          color: '#000',
          padding: '10px 20px',
          borderRadius: '30px',
          fontSize: '14px',
          fontWeight: '700',
          marginBottom: '32px'
        }}>
          <span>⭐</span>
          <span>PALPITEIRO PREMIUM</span>
          <span>⭐</span>
        </div>

        {/* Benefits */}
        <div style={{
          backgroundColor: '#16162a',
          borderRadius: '16px',
          border: '1px solid #2a2a3e',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <h3 style={{
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🎁</span>
            Seus benefícios estão ativos:
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '🔓', text: 'Acesso a todos os 12 times', color: '#00f5a0' },
              { icon: '📊', text: 'Estatísticas avançadas de rumores', color: '#00d9f5' },
              { icon: '🔔', text: 'Alertas em tempo real', color: '#ff6b6b' },
              { icon: '🏆', text: 'Ranking exclusivo de Premium', color: '#ffd740' },
              { icon: '🚫', text: 'Zero anúncios', color: '#a78bfa' },
            ].map((benefit, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  {benefit.icon}
                </div>
                <span style={{ color: '#fff', fontSize: '14px' }}>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Payment Info */}
        <div style={{
          backgroundColor: 'rgba(255, 23, 68, 0.1)',
          border: '1px solid rgba(255, 23, 68, 0.2)',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '24px'
        }}>
          <p style={{ color: '#a0a0b0', fontSize: '12px', margin: 0 }}>
            📅 Sua próxima cobrança será em <strong style={{ color: '#fff' }}>
              {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
            </strong>
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/home"
          style={{
            display: 'block',
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #ff1744, #8B0000)',
            color: '#fff',
            fontWeight: '700',
            fontSize: '16px',
            borderRadius: '14px',
            textDecoration: 'none',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(255, 23, 68, 0.4)'
          }}
        >
          Começar a usar ⭐
        </Link>

        <p style={{
          color: '#666680',
          fontSize: '11px',
          marginTop: '16px'
        }}>
          Você pode gerenciar sua assinatura a qualquer momento no Perfil
        </p>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </main>
  )
}
