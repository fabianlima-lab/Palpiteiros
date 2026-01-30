import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'

export default async function AssinaturaPage() {
  const user = await prisma.user.findFirst({
    where: { username: 'torcedor_demo' },
  })

  const isPremium = user?.isPremium || false

  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header title="Premium" showBack />

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        {isPremium ? (
          // Premium User View
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #ffab00, #ffd740)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '40px'
            }}>
              ⭐
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Você é Premium!</h1>
            <p style={{ color: '#a0a0b0', marginBottom: '24px' }}>Obrigado por apoiar o Palpiteiro</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#16162a',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <span style={{ color: '#a0a0b0', fontSize: '14px' }}>Plano</span>
                <span style={{ color: '#fff', fontSize: '14px' }}>Premium Mensal</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#16162a',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <span style={{ color: '#a0a0b0', fontSize: '14px' }}>Valor</span>
                <span style={{ color: '#fff', fontSize: '14px' }}>R$ 49/mês</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#16162a',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <span style={{ color: '#a0a0b0', fontSize: '14px' }}>Próxima cobrança</span>
                <span style={{ color: '#fff', fontSize: '14px' }}>15/03/2026</span>
              </div>
            </div>

            <button style={{
              width: '100%',
              padding: '16px',
              background: 'transparent',
              border: '1px solid #ff1744',
              borderRadius: '14px',
              color: '#ff1744',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Cancelar assinatura
            </button>
          </div>
        ) : (
          // Free User View
          <>
            {/* Hero */}
            <div style={{
              background: 'linear-gradient(135deg, #2a1515 0%, #1a0a0a 100%)',
              border: '1px solid #4a2020',
              borderRadius: '20px',
              textAlign: 'center',
              padding: '32px 20px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>⭐</div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '800',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #ff1744, #fff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Palpiteiro Premium
              </h1>
              <p style={{ color: '#a0a0b0', fontSize: '14px', lineHeight: '1.5' }}>
                Desbloqueie todos os times e recursos exclusivos
              </p>
            </div>

            {/* Features */}
            <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>✨ BENEFÍCIOS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {[
                { icon: '🔓', text: 'Acesso a todos os times' },
                { icon: '📊', text: 'Estatísticas avançadas' },
                { icon: '🔔', text: 'Alertas em tempo real' },
                { icon: '🏆', text: 'Ranking exclusivo' },
                { icon: '💬', text: 'Suporte prioritário' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#16162a',
                  border: '1px solid #2a2a3e',
                  borderRadius: '12px',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span style={{ fontSize: '14px', color: '#fff' }}>{item.text}</span>
                  </div>
                  <span style={{ color: '#00f5a0' }}>✓</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div style={{
              background: 'linear-gradient(135deg, #2a1515 0%, #1a0a0a 100%)',
              border: '2px solid #ff1744',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'inline-block',
                background: '#ff1744',
                color: 'white',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                🎁 PRIMEIRO MÊS GRÁTIS
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px', color: '#a0a0b0' }}>R$</span>
                <span style={{ fontSize: '56px', fontWeight: '800', color: '#ff1744' }}>49</span>
                <span style={{ fontSize: '16px', color: '#666680' }}>/mês</span>
              </div>

              <p style={{ fontSize: '13px', color: '#666680', marginBottom: '20px' }}>
                Cancele quando quiser • Sem compromisso
              </p>

              <button style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #ff1744, #8B0000)',
                border: 'none',
                borderRadius: '14px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer'
              }}>
                Começar teste grátis
              </button>
            </div>

            {/* Comparison */}
            <div style={{ fontSize: '11px', color: '#666680', marginBottom: '12px', letterSpacing: '1px' }}>📋 COMPARAÇÃO</div>
            <div style={{
              backgroundColor: '#16162a',
              border: '1px solid #2a2a3e',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 80px',
                padding: '12px 16px',
                borderBottom: '1px solid #2a2a3e',
                fontSize: '12px',
                color: '#666680'
              }}>
                <span>Recurso</span>
                <span style={{ textAlign: 'center' }}>Grátis</span>
                <span style={{ textAlign: 'center', color: '#ff1744' }}>Premium</span>
              </div>

              {[
                { feature: 'Seu time', free: true, premium: true },
                { feature: 'Todos os times', free: false, premium: true },
                { feature: 'Sinais básicos', free: true, premium: true },
                { feature: 'Estatísticas avançadas', free: false, premium: true },
                { feature: 'Alertas em tempo real', free: false, premium: true },
                { feature: 'Sem anúncios', free: false, premium: true },
              ].map((row, i, arr) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 80px',
                  padding: '12px 16px',
                  borderBottom: i < arr.length - 1 ? '1px solid #2a2a3e' : 'none',
                  fontSize: '13px'
                }}>
                  <span style={{ color: '#fff' }}>{row.feature}</span>
                  <span style={{ textAlign: 'center', color: row.free ? '#00f5a0' : '#666680' }}>
                    {row.free ? '✓' : '—'}
                  </span>
                  <span style={{ textAlign: 'center', color: '#00f5a0' }}>✓</span>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              backgroundColor: '#16162a',
              border: '1px solid #2a2a3e',
              borderRadius: '12px',
              padding: '14px'
            }}>
              <div style={{ fontSize: '20px' }}>❓</div>
              <div style={{ fontSize: '12px', color: '#a0a0b0', lineHeight: '1.5' }}>
                <strong style={{ color: '#fff' }}>Posso cancelar a qualquer momento?</strong><br />
                Sim! Cancele quando quiser, sem taxas ou multas. O acesso continua até o fim do período pago.
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
