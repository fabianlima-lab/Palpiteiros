import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'

export default async function HistoricoPage() {
  const demoUser = await prisma.user.findFirst({
    where: { username: 'torcedor_demo' },
    include: {
      predictions: {
        include: {
          rumor: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  const predictions = demoUser?.predictions || []

  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header title="Histórico" showBack />

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
              {predictions.length}
            </div>
            <div style={{ fontSize: '11px', color: '#666680' }}>Total</div>
          </div>
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#ffab00', marginBottom: '4px' }}>
              --
            </div>
            <div style={{ fontSize: '11px', color: '#666680' }}>Aguardando</div>
          </div>
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#00f5a0', marginBottom: '4px' }}>
              --%
            </div>
            <div style={{ fontSize: '11px', color: '#666680' }}>Acertos</div>
          </div>
        </div>

        {/* Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          marginBottom: '20px',
          paddingBottom: '8px'
        }}>
          {[
            { id: 'all', name: 'Todos', emoji: '🔥' },
            { id: 'waiting', name: 'Aguardando', emoji: '⏳' },
            { id: 'correct', name: 'Acertos', emoji: '✅' },
            { id: 'wrong', name: 'Erros', emoji: '❌' },
          ].map((filter) => (
            <button
              key={filter.id}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: filter.id === 'all' ? 'rgba(255, 23, 68, 0.2)' : '#16162a',
                color: filter.id === 'all' ? '#ff1744' : '#a0a0b0',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {filter.emoji} {filter.name}
            </button>
          ))}
        </div>

        {/* Predictions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {predictions.map((prediction) => {
            const isResolved = prediction.rumor.resolvedOutcome !== null
            const isCorrect = isResolved && prediction.prediction === prediction.rumor.resolvedOutcome

            return (
              <Link
                key={prediction.id}
                href={`/rumor/${prediction.rumor.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#16162a',
                  border: '1px solid #2a2a3e',
                  borderRadius: '12px',
                  padding: '14px',
                  textDecoration: 'none'
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', color: '#fff', margin: 0, marginBottom: '6px' }}>
                    {prediction.rumor.title}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#666680' }}>
                      {new Date(prediction.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <span style={{ color: '#666680' }}>•</span>
                    <span style={{
                      fontSize: '11px',
                      color: prediction.prediction ? '#00f5a0' : '#ff1744'
                    }}>
                      Você: {prediction.prediction ? '👍 Favorável' : '👎 Desfavorável'}
                    </span>
                  </div>
                </div>
                <div>
                  {isResolved ? (
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: isCorrect ? 'rgba(0, 245, 160, 0.15)' : 'rgba(255, 23, 68, 0.15)'
                    }}>
                      {isCorrect ? '✅' : '❌'}
                    </span>
                  ) : (
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'rgba(255, 171, 0, 0.15)'
                    }}>
                      ⏳
                    </span>
                  )}
                </div>
              </Link>
            )
          })}

          {predictions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 16px' }}>
              <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🎯</span>
              <span style={{ color: '#666680', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                Nenhum palpite ainda
              </span>
              <Link href="/home" style={{ color: '#ff1744', fontSize: '14px' }}>
                Começar a palpitar →
              </Link>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
