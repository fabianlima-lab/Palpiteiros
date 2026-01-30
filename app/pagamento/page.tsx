'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '../components/Header'

export default function PagamentoPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card')

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handlePayment = () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      router.push('/pagamento/confirmacao')
    }, 2000)
  }

  const inputStyle = {
    width: '100%',
    backgroundColor: '#0f0f1a',
    border: '1px solid #2a2a3e',
    borderRadius: '12px',
    padding: '14px 16px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0f0f1a' }}>
      <Header title="Pagamento" showBack />

      <div style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
        {/* First Month Free Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #00f5a0 0%, #00d9f5 100%)',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f0f1a' }}>
            🎁 Primeiro mês GRÁTIS! Você só paga após 30 dias.
          </span>
        </div>

        {/* Order Summary */}
        <div style={{
          backgroundColor: '#16162a',
          borderRadius: '16px',
          border: '1px solid #2a2a3e',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#fff', fontWeight: '600', marginBottom: '16px', fontSize: '16px' }}>
            Resumo do pedido
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '12px',
            borderBottom: '1px solid #2a2a3e',
            marginBottom: '12px'
          }}>
            <div>
              <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>Palpiteiro Premium</div>
              <div style={{ color: '#666680', fontSize: '12px' }}>Acesso a todos os times</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#666680', fontSize: '12px', textDecoration: 'line-through' }}>R$ 49,00/mês</div>
              <div style={{ color: '#00f5a0', fontSize: '14px', fontWeight: '600' }}>R$ 0,00 hoje</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#a0a0b0', fontSize: '13px' }}>Após período gratuito</span>
            <span style={{ color: '#ff1744', fontWeight: '700', fontSize: '18px' }}>R$ 49,00/mês</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', fontWeight: '600', marginBottom: '12px', fontSize: '16px' }}>
            Método de pagamento
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => setPaymentMethod('card')}
              style={{
                width: '100%',
                backgroundColor: '#16162a',
                borderRadius: '14px',
                border: paymentMethod === 'card' ? '2px solid #ff1744' : '1px solid #2a2a3e',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '24px' }}>💳</span>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <p style={{ color: '#fff', fontWeight: '600', fontSize: '14px', margin: 0 }}>Cartão de crédito</p>
                <p style={{ color: '#666680', fontSize: '11px', margin: 0 }}>Visa, Mastercard, Elo, Amex</p>
              </div>
              {paymentMethod === 'card' && (
                <div style={{
                  width: '22px',
                  height: '22px',
                  backgroundColor: '#ff1744',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>
                </div>
              )}
            </button>

            <button
              onClick={() => setPaymentMethod('pix')}
              style={{
                width: '100%',
                backgroundColor: '#16162a',
                borderRadius: '14px',
                border: paymentMethod === 'pix' ? '2px solid #ff1744' : '1px solid #2a2a3e',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '24px' }}>📱</span>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <p style={{ color: '#fff', fontWeight: '600', fontSize: '14px', margin: 0 }}>PIX</p>
                <p style={{ color: '#666680', fontSize: '11px', margin: 0 }}>Pagamento instantâneo</p>
              </div>
              {paymentMethod === 'pix' && (
                <div style={{
                  width: '22px',
                  height: '22px',
                  backgroundColor: '#ff1744',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Card Form */}
        {paymentMethod === 'card' && (
          <div style={{
            backgroundColor: '#16162a',
            borderRadius: '16px',
            border: '1px solid #2a2a3e',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#a0a0b0', fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                  Número do cartão
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ color: '#a0a0b0', fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                    Validade
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ color: '#a0a0b0', fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="000"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: '#a0a0b0', fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                  Nome no cartão
                </label>
                <input
                  type="text"
                  placeholder="Como está no cartão"
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {/* PIX Info */}
        {paymentMethod === 'pix' && (
          <div style={{
            backgroundColor: '#16162a',
            borderRadius: '16px',
            border: '1px solid #2a2a3e',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '160px',
              height: '160px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '80px' }}>📱</span>
            </div>
            <p style={{ color: '#a0a0b0', fontSize: '13px', marginBottom: '8px' }}>
              O QR Code será gerado após confirmar
            </p>
            <p style={{ color: '#666680', fontSize: '11px' }}>
              Escaneie com o app do seu banco
            </p>
          </div>
        )}

        {/* Benefits Reminder */}
        <div style={{
          backgroundColor: 'rgba(255, 23, 68, 0.1)',
          border: '1px solid rgba(255, 23, 68, 0.2)',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '12px', color: '#a0a0b0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✅</span>
              <span>Cancele quando quiser, sem burocracia</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✅</span>
              <span>Você só será cobrado após 30 dias</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✅</span>
              <span>Acesso imediato a todos os benefícios</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '16px',
            background: isProcessing ? '#666680' : 'linear-gradient(135deg, #ff1744, #8B0000)',
            color: '#fff',
            fontWeight: '700',
            fontSize: '16px',
            borderRadius: '14px',
            border: 'none',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            boxShadow: isProcessing ? 'none' : '0 4px 20px rgba(255, 23, 68, 0.4)',
            transition: 'all 0.2s'
          }}
        >
          {isProcessing ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{
                width: '18px',
                height: '18px',
                border: '2px solid #fff',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Processando...
            </span>
          ) : (
            'Começar teste grátis de 30 dias'
          )}
        </button>

        <p style={{ textAlign: 'center', color: '#666680', fontSize: '11px', marginTop: '16px' }}>
          🔒 Seus dados estão seguros com criptografia SSL
        </p>

        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </main>
  )
}
