'use client'

import { useState } from 'react'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'

const faqs = [
  {
    question: 'O que é o Palpiteiro?',
    answer: 'O Palpiteiro é uma plataforma de entretenimento que agrega rumores de transferências do futebol brasileiro. Você pode acompanhar o que influenciadores estão dizendo e dar seu palpite sobre se uma transferência vai ou não acontecer.'
  },
  {
    question: 'Como funciona o sistema de sinais?',
    answer: 'Influenciadores (jornalistas, comentaristas, insiders) dão sinais "favoráveis" ou "desfavoráveis" sobre cada rumor. Cada influenciador tem um Trust Score baseado em seu histórico de acertos, que pesa no cálculo do sentimento geral.'
  },
  {
    question: 'Como são calculados os pontos?',
    answer: 'Você ganha pontos quando seu palpite está correto! Quanto mais cedo você palpitar e quanto mais confiante for seu palpite, mais pontos você pode ganhar. Palpites Premium dão pontos em dobro.'
  },
  {
    question: 'O que é o Trust Score?',
    answer: 'O Trust Score é a pontuação de confiabilidade de cada influenciador, calculada com base em quantas vezes seus sinais estavam corretos. Quanto maior o Trust Score, mais peso o sinal tem no sentimento geral.'
  },
  {
    question: 'Isso é uma casa de apostas?',
    answer: 'NÃO! O Palpiteiro é apenas uma plataforma de entretenimento. Não oferecemos apostas em dinheiro, odds ou prêmios monetários. É apenas uma forma divertida de acompanhar rumores do futebol.'
  },
  {
    question: 'Como funciona o Premium?',
    answer: 'Com o Premium você tem acesso a palpites ilimitados, estatísticas avançadas, alertas em tempo real, badge exclusivo e experiência sem anúncios. A assinatura é mensal e pode ser cancelada a qualquer momento.'
  },
  {
    question: 'Como cancelo minha assinatura?',
    answer: 'Você pode cancelar sua assinatura a qualquer momento através de Configurações > Assinatura Premium > Cancelar. Você continuará com acesso Premium até o fim do período já pago.'
  },
  {
    question: 'De onde vêm as informações?',
    answer: 'Agregamos informações de fontes públicas: posts de jornalistas no Twitter/X, vídeos no YouTube, reportagens, etc. Sempre indicamos a fonte de cada sinal.'
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header title="FAQ" showBack />

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ color: '#fff', fontWeight: '700', fontSize: '18px', marginBottom: '16px' }}>❓ Perguntas Frequentes</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#16162a',
                borderRadius: '12px',
                border: '1px solid #2a2a3e',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  width: '100%',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span style={{ color: '#fff', fontWeight: '500', fontSize: '14px', paddingRight: '16px' }}>{faq.question}</span>
                <span style={{
                  color: '#666680',
                  transition: 'transform 0.2s',
                  transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  ▼
                </span>
              </button>
              {openIndex === index && (
                <div style={{ padding: '0 14px 14px' }}>
                  <p style={{ color: '#a0a0b0', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: '#666680', fontSize: '13px', marginBottom: '8px' }}>Ainda tem dúvidas?</p>
          <a href="mailto:contato@palpiteiro.com" style={{ color: '#ff1744', fontSize: '14px' }}>
            Fale conosco →
          </a>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
