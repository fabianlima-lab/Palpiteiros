'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ReactionPicker, ReactionEmoji, REACTIONS } from './ReactionPicker'

interface Signal {
  id: string
  signal: string
  confidence: number
  influencer: {
    id: string
    name: string
    username?: string
    outlet?: string
    trustScore: number
  }
}

interface Fonte {
  id: string
  posicao: string
  intensidade: string
  jornalista: {
    nome: string
    handle?: string | null
    credibilidade: number
  }
}

interface Prediction {
  id: string
  prediction: boolean
}

// PRD v3: Estrutura de sentimento
interface Sentimento {
  geral: {
    score: number
    label: string
    distribuicao: Record<string, number>
    totalReacoes: number
  }
  porTime?: Record<string, {
    score: number
    label: string
    distribuicao: Record<string, number>
    totalReacoes: number
  }>
  distribuicaoDisplay?: Record<string, number>
}

interface Divergencia {
  tipo: 'sonhando' | 'resignados' | 'alinhados_positivo' | 'alinhados_negativo' | 'neutro'
  mensagem: string
  destaque: boolean
}

interface RumorCardProps {
  id: string
  playerName: string
  playerImage?: string | null
  fromTeam?: string | null
  toTeam: string
  title: string
  description?: string | null
  contexto?: string | null
  category?: string
  categoria?: string
  // PRD v3: Dois eixos
  probabilidade?: number
  probTrend?: string
  sentiment: number
  sentimento?: Sentimento
  divergencia?: Divergencia
  // Outros
  closesAt: Date
  signals: Signal[]
  fontes?: Fonte[]
  predictions: Prediction[]
  totalReacoes?: number
  userPrediction?: boolean | null
  isHot?: boolean
  onVote?: (rumorId: string, prediction: boolean) => void
  showSignals?: boolean
  newsCount?: number
}

// PRD v3: Categorias atualizadas
const CATEGORY_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  transferencia: { label: 'Reforco', emoji: '', color: '#10B981' },
  REFORCO: { label: 'Reforco', emoji: '', color: '#10B981' },
  SAIDA: { label: 'Saida', emoji: '', color: '#EF4444' },
  RENOVACAO: { label: 'Renovacao', emoji: '', color: '#F59E0B' },
  COMISSAO: { label: 'Comissao', emoji: '', color: '#8B5CF6' },
  ESCALACAO: { label: 'Escalacao', emoji: '', color: '#3B82F6' },
  LESAO: { label: 'Lesao', emoji: '', color: '#EF4444' },
  SELECAO: { label: 'Selecao', emoji: '', color: '#10B981' },
  PREMIO: { label: 'Premio', emoji: '', color: '#F59E0B' },
  CLUBE: { label: 'Clube', emoji: '', color: '#6B7280' },
  DISCIPLINA: { label: 'Disciplina', emoji: '', color: '#EF4444' },
  tecnico: { label: 'Tecnico', emoji: '', color: '#8B5CF6' },
  titulo: { label: 'Titulo', emoji: '', color: '#F59E0B' },
  selecao: { label: 'Selecao', emoji: '', color: '#10B981' },
}

// PRD v3: Cores dos emojis
const EMOJI_COLORS: Record<string, string> = {
  '🔥': '#F97316', // Laranja
  '😍': '#10B981', // Verde
  '😐': '#71717A', // Cinza
  '👎': '#EF4444', // Vermelho
  '💀': '#7C3AED', // Roxo
}

export function RumorCard({
  id,
  title,
  description,
  contexto,
  category = 'transferencia',
  categoria,
  probabilidade,
  probTrend,
  sentiment,
  sentimento,
  divergencia,
  signals,
  fontes,
  predictions,
  totalReacoes: totalReacoesProp,
  isHot,
  showSignals = true,
}: RumorCardProps) {
  const [selectedReaction, setSelectedReaction] = useState<ReactionEmoji | null>(null)

  // Usar categoria PRD v3 se disponivel
  const categoryKey = categoria || category
  const categoryInfo = CATEGORY_LABELS[categoryKey] || CATEGORY_LABELS.transferencia

  // PRD v3: Total de reacoes do novo sistema
  const totalReactions = totalReacoesProp ?? sentimento?.geral?.totalReacoes ?? predictions.length

  // PRD v3: Usar distribuicao do novo sistema ou calcular do antigo
  const reactionCounts: Record<ReactionEmoji, number> = sentimento?.distribuicaoDisplay
    ? {
        '🔥': sentimento.distribuicaoDisplay['🔥'] || 0,
        '😍': sentimento.distribuicaoDisplay['😍'] || 0,
        '😐': sentimento.distribuicaoDisplay['😐'] || 0,
        '👎': sentimento.distribuicaoDisplay['👎'] || 0,
        '💀': sentimento.distribuicaoDisplay['💀'] || 0,
      } as Record<ReactionEmoji, number>
    : {
        '🔥': Math.floor(totalReactions * sentiment * 0.4),
        '😍': Math.ceil(totalReactions * sentiment * 0.6),
        '😐': 0,
        '👎': Math.ceil(totalReactions * (1 - sentiment) * 0.6),
        '💀': Math.floor(totalReactions * (1 - sentiment) * 0.4),
      } as Record<ReactionEmoji, number>

  // PRD v3: Score de sentimento (-2 a +2) ou converter do antigo (0-1)
  const sentimentScore = sentimento?.geral?.score ?? ((sentiment - 0.5) * 4)

  // PRD v3: Cor da probabilidade
  const getProbabilidadeColor = (prob: number) => {
    if (prob >= 60) return '#10B981' // Verde
    if (prob >= 40) return '#F59E0B' // Amarelo
    return '#EF4444' // Vermelho
  }

  // PRD v3: Label do sentimento
  const getSentimentLabel = (score: number) => {
    if (score >= 1.0) return 'Muito positivo'
    if (score >= 0.3) return 'Positivo'
    if (score >= -0.3) return 'Dividido'
    if (score >= -1.0) return 'Negativo'
    return 'Muito negativo'
  }

  const handleReact = (emoji: ReactionEmoji) => {
    setSelectedReaction(emoji)
  }

  // PRD v3: Icone de tendencia
  const getTrendIcon = (trend: string) => {
    if (trend === 'subindo') return '↑'
    if (trend === 'caindo') return '↓'
    return ''
  }

  // Calcular porcentagens para a barra de sentimento
  const totalForBar = Object.values(reactionCounts).reduce((a, b) => a + b, 0) || 1
  const percentages = REACTIONS.map(r => ({
    emoji: r.emoji,
    percent: Math.round((reactionCounts[r.emoji] || 0) / totalForBar * 100),
    count: reactionCounts[r.emoji] || 0,
  })).filter(p => p.percent > 0)

  // Probabilidade para exibicao (fallback para 50 se nao definida)
  const probDisplay = probabilidade ?? 50
  const qtdFontes = fontes?.length ?? 0

  return (
    <div style={{
      backgroundColor: '#18181B',
      border: divergencia?.destaque ? '1px solid #F9731650' : '1px solid #27272A',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}>
      {/* Header - Clickable */}
      <Link
        href={`/rumor/${id}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          padding: '16px',
          paddingBottom: '12px',
        }}
      >
        {/* Top row: Category + Time + Hot badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
        }}>
          {/* Category */}
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: categoryInfo.color,
            backgroundColor: `${categoryInfo.color}20`,
            padding: '4px 10px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {categoryInfo.label}
          </span>

          {/* Hot badge */}
          {isHot && (
            <span style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#F97316',
              backgroundColor: '#F9731620',
              padding: '3px 8px',
              borderRadius: '4px',
              animation: 'pulse 2s infinite',
            }}>
              🔥
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#FAFAFA',
          margin: 0,
          lineHeight: '1.4',
          marginBottom: (description || contexto) ? '8px' : 0,
        }}>
          {title}
        </h3>

        {/* Contexto (PRD v3) ou Description */}
        {(contexto || description) && (
          <p style={{
            fontSize: '13px',
            color: '#A1A1AA',
            lineHeight: '1.4',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {contexto || description}
          </p>
        )}
      </Link>

      {/* PRD v3: DOIS BLOCOS LADO A LADO - Probabilidade e Sentimento */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        padding: '0 16px 12px',
      }}>
        {/* BLOCO 1: Probabilidade (das fontes) */}
        <div style={{
          backgroundColor: '#09090B',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid #27272A',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '12px' }}>📰</span>
            <span style={{
              fontSize: '11px',
              color: '#71717A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
            }}>
              Probabilidade
            </span>
          </div>

          {/* Numero grande */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '4px',
            marginBottom: '8px',
          }}>
            <span style={{
              fontSize: '28px',
              fontWeight: '700',
              color: getProbabilidadeColor(probDisplay),
              fontFamily: 'JetBrains Mono, monospace',
              lineHeight: 1,
            }}>
              {probDisplay}%
            </span>
            {probTrend && probTrend !== 'estavel' && (
              <span style={{
                fontSize: '16px',
                color: probTrend === 'subindo' ? '#10B981' : '#EF4444',
                fontWeight: '600',
              }}>
                {getTrendIcon(probTrend)}
              </span>
            )}
          </div>

          {/* Barra de probabilidade */}
          <div style={{
            height: '6px',
            backgroundColor: '#27272A',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${probDisplay}%`,
              backgroundColor: getProbabilidadeColor(probDisplay),
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* BLOCO 2: Sentimento (da torcida) */}
        <div style={{
          backgroundColor: '#09090B',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid #27272A',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '12px' }}>👥</span>
            <span style={{
              fontSize: '11px',
              color: '#71717A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
            }}>
              Sentimento
            </span>
          </div>

          {/* Percentual de sentimento positivo (🔥 + 😍) */}
          {(() => {
            const positivo = (reactionCounts['🔥'] || 0) + (reactionCounts['😍'] || 0)
            const sentimentPercent = totalReactions > 0 ? Math.round((positivo / totalReactions) * 100) : 50
            const getSentimentoColor = (pct: number) => {
              if (pct >= 60) return '#10B981' // Verde
              if (pct >= 40) return '#F59E0B' // Amarelo
              return '#EF4444' // Vermelho
            }
            return (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px',
                  marginBottom: '8px',
                }}>
                  <span style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: getSentimentoColor(sentimentPercent),
                    fontFamily: 'JetBrains Mono, monospace',
                    lineHeight: 1,
                  }}>
                    {sentimentPercent}%
                  </span>
                  <span style={{ fontSize: '12px', color: '#71717A' }}>positivo</span>
                </div>

                {/* Barra de sentimento (igual à de probabilidade) */}
                <div style={{
                  height: '6px',
                  backgroundColor: '#27272A',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${sentimentPercent}%`,
                    backgroundColor: getSentimentoColor(sentimentPercent),
                    borderRadius: '3px',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </>
            )
          })()}
        </div>
      </div>

      {/* PRD v3: Badge de Divergencia (quando ha destaque) */}
      {divergencia?.destaque && (
        <div style={{
          margin: '0 16px 12px',
          padding: '8px 12px',
          backgroundColor: '#F9731610',
          border: '1px solid #F9731630',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '14px' }}>⚡</span>
          <span style={{
            fontSize: '12px',
            color: '#F97316',
            fontWeight: '500',
          }}>
            {divergencia.mensagem}
          </span>
        </div>
      )}

      {/* Reações inline elegantes */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 16px 12px',
      }}>
        {REACTIONS.map(reaction => {
          const isSelected = selectedReaction === reaction.emoji
          const count = reactionCounts[reaction.emoji] || 0

          return (
            <button
              key={reaction.emoji}
              onClick={() => handleReact(reaction.emoji)}
              title={reaction.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                opacity: isSelected ? 1 : 0.7,
                transition: 'opacity 0.15s ease',
              }}
            >
              <span style={{
                fontSize: '14px',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.15s ease',
              }}>
                {reaction.emoji}
              </span>
              {count > 0 && (
                <span style={{
                  fontSize: '11px',
                  color: isSelected ? '#FAFAFA' : '#71717A',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Footer: Fontes + Compartilhar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderTop: '1px solid #27272A',
        backgroundColor: '#0F0F12',
      }}>
        {/* Fontes de jornalistas */}
        {fontes && fontes.length > 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
          }}>
            {fontes.slice(0, 3).map((fonte, i) => (
              <span
                key={fonte.id}
                style={{
                  fontSize: '11px',
                  color: '#A1A1AA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <span style={{
                  color: fonte.posicao === 'confirma' ? '#10B981' : fonte.posicao === 'nega' ? '#EF4444' : '#71717A',
                }}>
                  {fonte.posicao === 'confirma' ? '✓' : fonte.posicao === 'nega' ? '✗' : '○'}
                </span>
                <span style={{ whiteSpace: 'nowrap' }}>
                  {fonte.jornalista.nome.split(' ')[0]}
                </span>
                <span style={{
                  color: '#71717A',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                }}>
                  {Math.round(fonte.jornalista.credibilidade)}%
                </span>
                {i < Math.min(fontes.length - 1, 2) && <span style={{ color: '#3F3F46' }}>·</span>}
              </span>
            ))}
            {fontes.length > 3 && (
              <span style={{ fontSize: '11px', color: '#71717A' }}>
                +{fontes.length - 3}
              </span>
            )}
          </div>
        ) : signals.length > 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: '#71717A',
          }}>
            <span>📢 {signals.length} sinal{signals.length > 1 ? 'is' : ''}</span>
          </div>
        ) : (
          <div style={{ fontSize: '11px', color: '#71717A' }}>
            Aguardando fontes
          </div>
        )}

        {/* Botoes de acao: Compartilhar + Ver mais */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {/* Botao WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${title} - Veja no Palpiteiros: ${typeof window !== 'undefined' ? window.location.origin : 'https://palpiteiros.com'}/rumor/${id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#25D36620',
              color: '#25D366',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            title="Compartilhar no WhatsApp"
          >
            📱
          </a>

          {/* Botao X/Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}`)}&url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : 'https://palpiteiros.com'}/rumor/${id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#1DA1F220',
              color: '#1DA1F2',
              fontSize: '12px',
              textDecoration: 'none',
              fontWeight: '700',
              transition: 'all 0.15s ease',
            }}
            title="Compartilhar no X"
          >
            𝕏
          </a>

          {/* Botao Copiar Link */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://palpiteiros.com'}/rumor/${id}`
              navigator.clipboard.writeText(url)
              // Poderia adicionar um toast aqui
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#71717A20',
              color: '#A1A1AA',
              fontSize: '12px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Copiar link"
          >
            🔗
          </button>

          <Link
            href={`/rumor/${id}`}
            style={{
              fontSize: '12px',
              color: '#10B981',
              textDecoration: 'none',
              fontWeight: '500',
              marginLeft: '4px',
            }}
          >
            Ver mais →
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
