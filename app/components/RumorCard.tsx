'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ReactionPicker, SentimentBar, ReactionEmoji } from './ReactionPicker'

interface Signal {
  id: string
  signal: string
  confidence: number
  influencer: {
    id: string
    name: string
    username: string
    outlet: string
    trustScore: number
  }
}

interface Fonte {
  id: string
  posicao: string
  intensidade: string
  jornalista: {
    nome: string
    handle?: string
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
  transferencia: { label: 'Reforço', emoji: '⚽', color: '#10B981' },
  REFORCO: { label: 'Reforço', emoji: '⚽', color: '#10B981' },
  SAIDA: { label: 'Saída', emoji: '👋', color: '#EF4444' },
  RENOVACAO: { label: 'Renovação', emoji: '📝', color: '#F59E0B' },
  COMISSAO: { label: 'Comissão', emoji: '📋', color: '#8B5CF6' },
  ESCALACAO: { label: 'Escalação', emoji: '📊', color: '#3B82F6' },
  LESAO: { label: 'Lesão', emoji: '🏥', color: '#EF4444' },
  SELECAO: { label: 'Seleção', emoji: '🇧🇷', color: '#10B981' },
  PREMIO: { label: 'Prêmio', emoji: '🏆', color: '#F59E0B' },
  CLUBE: { label: 'Clube', emoji: '🏟️', color: '#6B7280' },
  DISCIPLINA: { label: 'Disciplina', emoji: '⚖️', color: '#EF4444' },
  tecnico: { label: 'Técnico', emoji: '📋', color: '#8B5CF6' },
  titulo: { label: 'Título', emoji: '🏆', color: '#F59E0B' },
  selecao: { label: 'Seleção', emoji: '🇧🇷', color: '#10B981' },
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

  // Usar categoria PRD v3 se disponível
  const categoryKey = categoria || category
  const categoryInfo = CATEGORY_LABELS[categoryKey] || CATEGORY_LABELS.transferencia

  // PRD v3: Total de reações do novo sistema
  const totalReactions = totalReacoesProp ?? sentimento?.geral?.totalReacoes ?? predictions.length

  // PRD v3: Usar distribuição do novo sistema ou calcular do antigo
  // Emojis PRD v3: 🔥 😍 😐 👎 💀
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
  const sentimentLabel = sentimento?.geral?.label ?? 'dividido'

  // Cor baseada no sentimento
  const getSentimentColor = (score: number) => {
    if (score >= 1.0) return '#10B981' // positivo_forte (verde)
    if (score >= 0.3) return '#34D399' // positivo (verde claro)
    if (score >= -0.3) return '#71717A' // dividido (cinza)
    if (score >= -1.0) return '#F97316' // negativo (laranja)
    return '#EF4444' // negativo_forte (vermelho)
  }

  // PRD v3: Cor da probabilidade
  const getProbabilidadeColor = (prob: number) => {
    if (prob >= 70) return '#10B981' // Alta
    if (prob >= 40) return '#F59E0B' // Média
    return '#EF4444' // Baixa
  }

  const handleReact = (emoji: ReactionEmoji) => {
    setSelectedReaction(emoji)
  }

  // PRD v3: Ícone de tendência
  const getTrendIcon = (trend: string) => {
    if (trend === 'subindo') return '↑'
    if (trend === 'caindo') return '↓'
    return ''
  }

  return (
    <div style={{
      backgroundColor: '#18181B',
      border: '1px solid #27272A',
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
        {/* Top row: Category + Hot badge + Probabilidade */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          gap: '8px',
        }}>
          {/* Left: Category */}
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
            {categoryInfo.emoji} {categoryInfo.label}
          </span>

          {/* Right: Hot badge + Probabilidade */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Hot/Cold badge */}
            {isHot !== undefined && (
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                color: isHot ? '#F97316' : '#71717A',
                backgroundColor: isHot ? '#F9731620' : '#71717A20',
                padding: '3px 8px',
                borderRadius: '4px',
                animation: isHot ? 'pulse 2s infinite' : 'none',
              }}>
                {isHot ? '🔥 QUENTE' : '❄️'}
              </span>
            )}

            {/* PRD v3: Probabilidade (das fontes) */}
            {probabilidade !== undefined && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#09090B',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #27272A',
              }}>
                <span style={{ fontSize: '12px', color: '#71717A' }}>📰</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: getProbabilidadeColor(probabilidade),
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {probabilidade}%
                </span>
                {probTrend && probTrend !== 'estavel' && (
                  <span style={{
                    fontSize: '12px',
                    color: probTrend === 'subindo' ? '#10B981' : '#EF4444',
                  }}>
                    {getTrendIcon(probTrend)}
                  </span>
                )}
              </div>
            )}
          </div>
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

        {/* PRD v3: Divergência badge (quando há destaque) */}
        {divergencia?.destaque && (
          <div style={{
            marginTop: '8px',
            padding: '6px 10px',
            backgroundColor: '#F9731615',
            border: '1px solid #F9731630',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#F97316',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>⚡</span>
            <span>{divergencia.mensagem}</span>
          </div>
        )}
      </Link>

      {/* PRD v3: Barra de Sentimento */}
      <div style={{ padding: '0 16px', marginBottom: '8px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px',
        }}>
          <span style={{ fontSize: '11px', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Sentimento da Torcida
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color: getSentimentColor(sentimentScore),
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            {sentimentScore > 0 ? '+' : ''}{sentimentScore.toFixed(1)}
          </span>
        </div>
        <SentimentBar reactionCounts={reactionCounts} showLabels={false} />
      </div>

      {/* Reactions - Compact */}
      <div style={{ padding: '0 16px 12px' }}>
        <ReactionPicker
          rumorId={id}
          userReaction={selectedReaction}
          reactionCounts={reactionCounts}
          onReact={handleReact}
          compact
        />
      </div>

      {/* Footer Stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderTop: '1px solid #27272A',
        backgroundColor: '#0F0F12',
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          fontSize: '12px',
          color: '#71717A',
        }}>
          {(fontes && fontes.length > 0) && (
            <span>📰 {fontes.length} fonte{fontes.length > 1 ? 's' : ''}</span>
          )}
          {signals.length > 0 && !fontes?.length && (
            <span>📢 {signals.length} sinal{signals.length > 1 ? 'is' : ''}</span>
          )}
          {totalReactions > 0 && (
            <span>👥 {totalReactions} reação{totalReactions > 1 ? 'ões' : ''}</span>
          )}
        </div>

        <Link
          href={`/rumor/${id}`}
          style={{
            fontSize: '12px',
            color: '#10B981',
            textDecoration: 'none',
            fontWeight: '500',
          }}
        >
          Ver mais →
        </Link>
      </div>

      {/* PRD v3: Fontes de Jornalistas (se disponível) */}
      {fontes && fontes.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 16px',
          borderTop: '1px solid #27272A',
          backgroundColor: '#0F0F10',
          gap: '8px',
        }}>
          <div style={{
            display: 'flex',
            marginRight: '6px',
          }}>
            {fontes.slice(0, 3).map((fonte, i) => (
              <div
                key={fonte.id}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '700',
                  marginLeft: i > 0 ? '-8px' : '0',
                  zIndex: 3 - i,
                  backgroundColor: fonte.posicao === 'confirma' ? '#10B98120' : fonte.posicao === 'nega' ? '#EF444420' : '#71717A20',
                  border: `2px solid ${fonte.posicao === 'confirma' ? '#10B981' : fonte.posicao === 'nega' ? '#EF4444' : '#71717A'}`,
                  color: '#FAFAFA',
                }}
                title={`${fonte.jornalista.nome} (${Math.round(fonte.jornalista.credibilidade)}%)`}
              >
                {fonte.jornalista.nome.charAt(0)}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '12px', color: '#A1A1AA' }}>
              {fontes[0]?.jornalista.nome}
              {fontes.length > 1 && ` e +${fontes.length - 1}`}
            </span>
            <span style={{
              fontSize: '11px',
              color: '#71717A',
              marginLeft: '6px',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {Math.round(fontes[0]?.jornalista.credibilidade || 0)}%
            </span>
          </div>
        </div>
      )}

      {/* Fallback: Influencer Signals Preview (sistema antigo) */}
      {showSignals && signals.length > 0 && (!fontes || fontes.length === 0) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 16px',
          borderTop: '1px solid #27272A',
          backgroundColor: '#0F0F10',
        }}>
          <div style={{
            display: 'flex',
            marginRight: '10px',
          }}>
            {signals.slice(0, 3).map((signal, i) => (
              <div
                key={signal.id}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '700',
                  marginLeft: i > 0 ? '-8px' : '0',
                  zIndex: 3 - i,
                  backgroundColor: signal.signal === 'favoravel' ? '#10B98120' : '#EF444420',
                  border: `2px solid ${signal.signal === 'favoravel' ? '#10B981' : '#EF4444'}`,
                  color: '#FAFAFA',
                }}
                title={signal.influencer.name}
              >
                {signal.influencer.name.charAt(0)}
              </div>
            ))}
          </div>
          <span style={{ fontSize: '12px', color: '#A1A1AA' }}>
            {signals[0]?.influencer.name}
            {signals.length > 1 && ` e mais ${signals.length - 1}`}
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
