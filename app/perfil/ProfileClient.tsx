'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'

// Mapeamento de times para emojis
const TEAM_EMOJIS: Record<string, string> = {
  'Flamengo': '🔴⚫',
  'Corinthians': '⚫⚪',
  'Palmeiras': '💚',
  'Santos': '⚪⚫',
  'São Paulo': '🔴⚪⚫',
  'Botafogo': '⭐⚫',
  'Fluminense': '🟢🟣⚪',
  'Vasco': '⚫⚪',
  'Atlético-MG': '⚫⚪',
  'Cruzeiro': '💙',
  'Internacional': '🔴⚪',
  'Grêmio': '💙🖤⚪',
}

interface Badge {
  id: string
  name: string
  emoji: string
  description: string
}

interface UserBadge {
  id: string
  badge: Badge
}

interface Rumor {
  id: string
  title: string
}

interface Prediction {
  id: string
  prediction: boolean
  createdAt: Date
  rumor: Rumor
}

interface User {
  id: string
  name: string
  username: string
  email?: string | null
  team: string | null
  points: number
  level: number
  isPremium: boolean
  avatar?: string | null
  badges: UserBadge[]
  predictions: Prediction[]
}

interface ProfileClientProps {
  user: User
}

export function ProfileClient({ user }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [editData, setEditData] = useState({
    name: user.name,
    username: user.username,
    bio: '',
    twitter: '',
    instagram: '',
    tiktok: '',
  })
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(user.avatar || null)

  const progressToNextLevel = (user.points % 500) / 5
  const teamEmoji = user.team ? TEAM_EMOJIS[user.team] || '⚽' : '⚽'

  const avatarOptions = [
    '😎', '🤩', '😤', '🔥', '⚽', '🏆', '👑', '💪',
    '🦁', '🐯', '🦅', '🐺', '🦈', '🐉', '🦊', '🐻',
  ]

  const handleSave = () => {
    // Aqui salvaria no banco - por enquanto só fecha o modal
    setIsEditing(false)
    // TODO: Implementar API para salvar
  }

  return (
    <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
      <Header title="Perfil" />

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Profile Hero */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          {/* Avatar com botão de editar */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
            <div
              onClick={() => setShowAvatarModal(true)}
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: selectedAvatar ? '40px' : '36px',
                fontWeight: '700',
                color: 'white',
                border: '3px solid #8b5cf6',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
            >
              {selectedAvatar || user.name.charAt(0)}
            </div>
            <button
              onClick={() => setShowAvatarModal(true)}
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '28px',
                height: '28px',
                backgroundColor: '#8b5cf6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                border: '2px solid #0f0f1a',
                cursor: 'pointer'
              }}
            >
              📷
            </button>
            {user.isPremium && (
              <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '24px',
                height: '24px',
                backgroundColor: '#ffab00',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                border: '2px solid #0f0f1a'
              }}>⭐</div>
            )}
          </div>

          {/* Nome e username */}
          {isEditing ? (
            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                style={{
                  background: '#16162a',
                  border: '1px solid #8b5cf6',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '18px',
                  fontWeight: '700',
                  textAlign: 'center',
                  width: '200px',
                  marginBottom: '8px',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <span style={{ color: '#666680' }}>@</span>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  style={{
                    background: '#16162a',
                    border: '1px solid #2a2a3e',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    color: '#666680',
                    fontSize: '14px',
                    width: '140px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{editData.name}</h1>
              <p style={{ fontSize: '14px', color: '#666680', marginBottom: '12px' }}>@{editData.username}</p>
            </>
          )}

          {/* Time do coração */}
          {user.team && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              borderRadius: '20px',
              fontSize: '14px',
              color: '#8b5cf6',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '18px' }}>{teamEmoji}</span>
              <span>{user.team}</span>
            </div>
          )}

          {/* Botão Editar/Salvar */}
          <div style={{ marginTop: '12px' }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1px solid #666680',
                    borderRadius: '10px',
                    color: '#666680',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Salvar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '10px 24px',
                  background: 'transparent',
                  border: '1px solid #8b5cf6',
                  borderRadius: '10px',
                  color: '#8b5cf6',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✏️ Editar perfil
              </button>
            )}
          </div>
        </div>

        {/* Redes Sociais */}
        <div style={{
          backgroundColor: '#16162a',
          border: '1px solid #2a2a3e',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '12px', color: '#666680', marginBottom: '14px', fontWeight: '600' }}>
            📱 REDES SOCIAIS
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px', width: '28px' }}>𝕏</span>
                <input
                  type="text"
                  placeholder="@seu_twitter"
                  value={editData.twitter}
                  onChange={(e) => setEditData({ ...editData, twitter: e.target.value })}
                  style={{
                    flex: 1,
                    background: '#0f0f1a',
                    border: '1px solid #2a2a3e',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px', width: '28px' }}>📸</span>
                <input
                  type="text"
                  placeholder="@seu_instagram"
                  value={editData.instagram}
                  onChange={(e) => setEditData({ ...editData, instagram: e.target.value })}
                  style={{
                    flex: 1,
                    background: '#0f0f1a',
                    border: '1px solid #2a2a3e',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px', width: '28px' }}>🎵</span>
                <input
                  type="text"
                  placeholder="@seu_tiktok"
                  value={editData.tiktok}
                  onChange={(e) => setEditData({ ...editData, tiktok: e.target.value })}
                  style={{
                    flex: 1,
                    background: '#0f0f1a',
                    border: '1px solid #2a2a3e',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {editData.twitter ? (
                <a href={`https://twitter.com/${editData.twitter}`} target="_blank" rel="noopener noreferrer" style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#1DA1F2',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  textDecoration: 'none'
                }}>𝕏</a>
              ) : null}
              {editData.instagram ? (
                <a href={`https://instagram.com/${editData.instagram}`} target="_blank" rel="noopener noreferrer" style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  textDecoration: 'none'
                }}>📸</a>
              ) : null}
              {editData.tiktok ? (
                <a href={`https://tiktok.com/@${editData.tiktok}`} target="_blank" rel="noopener noreferrer" style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#000',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  textDecoration: 'none'
                }}>🎵</a>
              ) : null}
              {!editData.twitter && !editData.instagram && !editData.tiktok && (
                <p style={{ color: '#666680', fontSize: '13px', margin: 0 }}>
                  Clique em &quot;Editar perfil&quot; para adicionar suas redes
                </p>
              )}
            </div>
          )}
        </div>

        {/* Level & Points */}
        <div style={{
          backgroundColor: '#16162a',
          border: '1px solid #2a2a3e',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>🎮 Nível {user.level}</span>
            <span style={{ fontSize: '16px', color: '#ffab00', fontWeight: '700' }}>{user.points.toLocaleString()} pts</span>
          </div>
          <div style={{
            height: '10px',
            backgroundColor: '#2a2a3e',
            borderRadius: '5px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{
              height: '100%',
              width: `${progressToNextLevel}%`,
              background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
              borderRadius: '5px'
            }}></div>
          </div>
          <p style={{ fontSize: '12px', color: '#666680', margin: 0 }}>
            {500 - (user.points % 500)} pts para o próximo nível
          </p>
        </div>

        {/* Badges */}
        {user.badges.length > 0 && (
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '12px', color: '#666680', marginBottom: '14px', fontWeight: '600' }}>🏅 CONQUISTAS</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {user.badges.map((ub) => (
                <div key={ub.id} style={{
                  backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }} title={ub.badge.description}>
                  <span style={{ fontSize: '18px' }}>{ub.badge.emoji}</span>
                  <span style={{ color: '#fff' }}>{ub.badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '14px',
            padding: '18px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
              {user.predictions.length}
            </div>
            <div style={{ fontSize: '12px', color: '#666680' }}>Palpites</div>
          </div>
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '14px',
            padding: '18px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
              --%
            </div>
            <div style={{ fontSize: '12px', color: '#666680' }}>Taxa de acerto</div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <Link href="/historico" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textDecoration: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📜</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Histórico de palpites</span>
            </div>
            <span style={{ color: '#666680' }}>→</span>
          </Link>

          <Link href="/assinatura" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textDecoration: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>⭐</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Assinatura Premium</span>
            </div>
            <span style={{ color: '#666680' }}>→</span>
          </Link>

          <Link href="/configuracoes" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '12px',
            padding: '14px',
            textDecoration: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>⚙️</span>
              <span style={{ fontSize: '14px', color: '#fff' }}>Configurações</span>
            </div>
            <span style={{ color: '#666680' }}>→</span>
          </Link>
        </div>

        {/* Recent Predictions */}
        <div style={{ fontSize: '12px', color: '#666680', marginBottom: '12px', fontWeight: '600' }}>
          🎯 ÚLTIMOS PALPITES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {user.predictions.map((prediction) => (
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
                <p style={{ fontSize: '13px', color: '#fff', margin: 0, marginBottom: '4px' }}>
                  {prediction.rumor.title}
                </p>
                <p style={{ fontSize: '11px', color: '#666680', margin: 0 }}>
                  {new Date(prediction.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <span style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: prediction.prediction ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'
              }}>
                {prediction.prediction ? '👍' : '👎'}
              </span>
            </Link>
          ))}

          {user.predictions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>🎯</span>
              <span style={{ color: '#666680', fontSize: '14px' }}>Nenhum palpite ainda</span>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 200
        }}>
          <div style={{
            backgroundColor: '#16162a',
            border: '1px solid #2a2a3e',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '340px',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px', textAlign: 'center' }}>
              Escolha seu avatar
            </h3>
            <p style={{ fontSize: '13px', color: '#666680', marginBottom: '20px', textAlign: 'center' }}>
              Selecione um emoji para representar você
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginBottom: '20px'
            }}>
              {avatarOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedAvatar(emoji)}
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: selectedAvatar === emoji ? 'rgba(139, 92, 246, 0.3)' : '#0f0f1a',
                    border: selectedAvatar === emoji ? '2px solid #8b5cf6' : '1px solid #2a2a3e',
                    borderRadius: '14px',
                    fontSize: '28px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowAvatarModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: '1px solid #666680',
                  borderRadius: '12px',
                  color: '#666680',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowAvatarModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  )
}
