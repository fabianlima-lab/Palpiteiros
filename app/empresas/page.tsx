'use client'

import Link from 'next/link'
import { useState } from 'react'

const BRAND = {
  primary: '#8b5cf6',
  primaryDark: '#6d28d9',
  secondary: '#06b6d4',
  accent: '#f59e0b',
  success: '#10b981',
}

export default function EmpresasPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Por enquanto, apenas simula o envio
    setSubmitted(true)
  }

  return (
    <main style={{ background: '#0a0a12', minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <img
            src="/logo.svg"
            alt="Palpiteiros"
            style={{
              height: '36px',
              width: 'auto'
            }}
          />
        </Link>
        <Link href="/" style={{
          color: '#9ca3af',
          fontSize: '14px',
          textDecoration: 'none'
        }}>
          ← Voltar
        </Link>
      </header>

      {/* Hero */}
      <section style={{
        padding: '60px 20px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 16px',
          background: `${BRAND.primary}20`,
          borderRadius: '20px',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '13px', color: BRAND.primary, fontWeight: '600' }}>
            Para Empresas
          </span>
        </div>

        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          marginBottom: '16px',
          lineHeight: '1.2'
        }}>
          Dados de probabilidade para sua{' '}
          <span style={{
            background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>redação, app ou transmissão</span>
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#9ca3af',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          O Palpiteiro oferece acesso a dados em tempo real sobre rumores e transferências do futebol brasileiro.
        </p>
      </section>

      {/* O que oferecemos */}
      <section style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          O que oferecemos
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {[
            {
              icon: '📡',
              title: 'API de Probabilidades',
              desc: 'Acesse dados de probabilidades em tempo real via REST API. Ideal para apps, sites de notícia e plataformas de análise.'
            },
            {
              icon: '📺',
              title: 'Licenciamento para TV',
              desc: 'Widgets e dados para exibição em programas esportivos. Probabilidades ao vivo durante transmissões.'
            },
            {
              icon: '📊',
              title: 'Relatórios Personalizados',
              desc: 'Análises sob demanda para clubes, agentes e veículos de mídia.'
            }
          ].map((item) => (
            <div key={item.title} style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <span style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}>
                {item.icon}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.6' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Para quem */}
      <section style={{
        padding: '40px 20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Para quem
        </h2>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          {[
            'Jornalistas e redações esportivas',
            'Apps e sites de futebol',
            'Canais de TV e streaming',
            'Clubes e departamentos de scout',
            'Casas de análise esportiva'
          ].map((item) => (
            <div key={item} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              <span style={{ color: BRAND.success }}>✓</span>
              <span style={{ fontSize: '15px', color: '#e5e7eb' }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Formulário de contato */}
      <section style={{
        padding: '60px 20px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${BRAND.primary}15, ${BRAND.secondary}15)`,
          border: `1px solid ${BRAND.primary}30`,
          borderRadius: '20px',
          padding: '32px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Interessado?
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            Entre em contato conosco
          </p>

          {submitted ? (
            <div style={{
              textAlign: 'center',
              padding: '20px'
            }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>✅</span>
              <p style={{ fontSize: '16px', fontWeight: '600', color: BRAND.success }}>
                Mensagem enviada!
              </p>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
                Entraremos em contato em breve.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '6px',
                  color: '#e5e7eb'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '6px',
                  color: '#e5e7eb'
                }}>
                  Mensagem
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Como podemos ajudar?"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Enviar
              </button>
            </form>
          )}

          <p style={{
            fontSize: '13px',
            color: '#6b7280',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            Ou mande email direto para:{' '}
            <a href="mailto:empresas@palpiteiro.com.br" style={{ color: BRAND.primary }}>
              empresas@palpiteiro.com.br
            </a>
          </p>
        </div>
      </section>

      {/* Footer simples */}
      <footer style={{
        textAlign: 'center',
        padding: '24px 20px',
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}>
        <p style={{ fontSize: '12px', color: '#4b5563' }}>
          © 2025 Palpiteiro. Feito para torcedores, por torcedores.
        </p>
      </footer>
    </main>
  )
}
