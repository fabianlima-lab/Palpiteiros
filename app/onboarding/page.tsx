'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { TEAMS } from '@/lib/teams'

const BRAND = {
  primary: '#8b5cf6',
  primaryDark: '#6d28d9',
  secondary: '#06b6d4',
  accent: '#f59e0b',
  success: '#10b981',
}

// Usar times do arquivo centralizado
const teams = TEAMS.map(t => ({
  id: t.id,
  name: t.name,
  badge: t.logo,
}))

const socialNetworks = [
  { id: 'google', name: 'Google', icon: '🔵', color: '#4285F4' },
  { id: 'apple', name: 'Apple', icon: '🍎', color: '#000000' },
  { id: 'x', name: 'X (Twitter)', icon: '𝕏', color: '#000000' },
  { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E4405F' },
]

const newsCategories = [
  { id: 'transfers', name: 'Transferências', emoji: '🔄', desc: 'Contratações e saídas' },
  { id: 'injuries', name: 'Lesões', emoji: '🏥', desc: 'Boletim médico do elenco' },
  { id: 'matches', name: 'Jogos', emoji: '⚽', desc: 'Escalações e resultados' },
  { id: 'finances', name: 'Finanças', emoji: '💰', desc: 'Valores e contratos' },
  { id: 'youth', name: 'Base', emoji: '🌟', desc: 'Jovens promessas' },
  { id: 'international', name: 'Seleção', emoji: '🇧🇷', desc: 'Convocações e jogos' },
]

// Jogadores por time
const playersByTeam: Record<string, Array<{ id: string; name: string; position: string; number: string }>> = {
  flamengo: [
    { id: 'arrascaeta', name: 'Arrascaeta', position: 'Meia', number: '14' },
    { id: 'gerson', name: 'Gerson', position: 'Meia', number: '8' },
    { id: 'pedro', name: 'Pedro', position: 'Atacante', number: '9' },
    { id: 'everton-cebolinha', name: 'Everton Cebolinha', position: 'Atacante', number: '11' },
    { id: 'bruno-henrique', name: 'Bruno Henrique', position: 'Atacante', number: '27' },
    { id: 'de-la-cruz', name: 'De La Cruz', position: 'Meia', number: '18' },
    { id: 'pulgar', name: 'Pulgar', position: 'Volante', number: '5' },
    { id: 'rossi', name: 'Agustín Rossi', position: 'Goleiro', number: '1' },
  ],
  corinthians: [
    { id: 'yuri-alberto', name: 'Yuri Alberto', position: 'Atacante', number: '9' },
    { id: 'rodrigo-garro', name: 'Rodrigo Garro', position: 'Meia', number: '10' },
    { id: 'memphis', name: 'Memphis Depay', position: 'Atacante', number: '94' },
    { id: 'hugo-souza', name: 'Hugo Souza', position: 'Goleiro', number: '1' },
    { id: 'raniele', name: 'Raniele', position: 'Volante', number: '14' },
    { id: 'matheuzinho', name: 'Matheuzinho', position: 'Lateral', number: '2' },
  ],
  palmeiras: [
    { id: 'endrick', name: 'Endrick', position: 'Atacante', number: '9' },
    { id: 'raphael-veiga', name: 'Raphael Veiga', position: 'Meia', number: '23' },
    { id: 'dudu', name: 'Dudu', position: 'Atacante', number: '7' },
    { id: 'gustavo-gomez', name: 'Gustavo Gómez', position: 'Zagueiro', number: '15' },
    { id: 'weverton', name: 'Weverton', position: 'Goleiro', number: '21' },
    { id: 'rony', name: 'Rony', position: 'Atacante', number: '10' },
  ],
  saopaulo: [
    { id: 'lucas-moura', name: 'Lucas Moura', position: 'Atacante', number: '7' },
    { id: 'calleri', name: 'Calleri', position: 'Atacante', number: '9' },
    { id: 'james', name: 'James Rodríguez', position: 'Meia', number: '10' },
    { id: 'alisson', name: 'Alisson', position: 'Meia', number: '25' },
    { id: 'rafael', name: 'Rafael', position: 'Goleiro', number: '23' },
    { id: 'arboleda', name: 'Arboleda', position: 'Zagueiro', number: '5' },
  ],
  santos: [
    { id: 'neymar', name: 'Neymar Jr', position: 'Atacante', number: '10' },
    { id: 'soteldo', name: 'Soteldo', position: 'Atacante', number: '10' },
    { id: 'guilherme', name: 'Guilherme', position: 'Meia', number: '11' },
    { id: 'otero', name: 'Otero', position: 'Meia', number: '8' },
    { id: 'joao-paulo', name: 'João Paulo', position: 'Goleiro', number: '1' },
  ],
  fluminense: [
    { id: 'cano', name: 'Germán Cano', position: 'Atacante', number: '14' },
    { id: 'ganso', name: 'Paulo Henrique Ganso', position: 'Meia', number: '10' },
    { id: 'marcelo', name: 'Marcelo', position: 'Lateral', number: '12' },
    { id: 'andre', name: 'André', position: 'Volante', number: '7' },
    { id: 'fabio', name: 'Fábio', position: 'Goleiro', number: '1' },
  ],
  vasco: [
    { id: 'vegetti', name: 'Pablo Vegetti', position: 'Atacante', number: '99' },
    { id: 'payet', name: 'Dimitri Payet', position: 'Meia', number: '10' },
    { id: 'philippe-coutinho', name: 'Philippe Coutinho', position: 'Meia', number: '11' },
    { id: 'leo-jardim', name: 'Léo Jardim', position: 'Goleiro', number: '1' },
    { id: 'maicon', name: 'Maicon', position: 'Zagueiro', number: '4' },
  ],
  botafogo: [
    { id: 'luiz-henrique', name: 'Luiz Henrique', position: 'Atacante', number: '7' },
    { id: 'savarino', name: 'Savarino', position: 'Atacante', number: '10' },
    { id: 'igor-jesus', name: 'Igor Jesus', position: 'Atacante', number: '99' },
    { id: 'john', name: 'John', position: 'Goleiro', number: '1' },
    { id: 'marlon-freitas', name: 'Marlon Freitas', position: 'Volante', number: '17' },
  ],
  gremio: [
    { id: 'suarez', name: 'Luis Suárez', position: 'Atacante', number: '9' },
    { id: 'cristaldo', name: 'Cristaldo', position: 'Meia', number: '10' },
    { id: 'soteldo-gremio', name: 'Soteldo', position: 'Atacante', number: '7' },
    { id: 'marchesín', name: 'Marchesín', position: 'Goleiro', number: '1' },
    { id: 'villasanti', name: 'Villasanti', position: 'Volante', number: '14' },
  ],
  internacional: [
    { id: 'borre', name: 'Borré', position: 'Atacante', number: '9' },
    { id: 'alan-patrick', name: 'Alan Patrick', position: 'Meia', number: '10' },
    { id: 'enner-valencia', name: 'Enner Valencia', position: 'Atacante', number: '13' },
    { id: 'rochet', name: 'Rochet', position: 'Goleiro', number: '1' },
    { id: 'wesley', name: 'Wesley', position: 'Atacante', number: '11' },
  ],
  atleticomg: [
    { id: 'hulk', name: 'Hulk', position: 'Atacante', number: '7' },
    { id: 'paulinho', name: 'Paulinho', position: 'Atacante', number: '10' },
    { id: 'scarpa', name: 'Gustavo Scarpa', position: 'Meia', number: '14' },
    { id: 'everson', name: 'Everson', position: 'Goleiro', number: '22' },
    { id: 'otavio', name: 'Otávio', position: 'Meia', number: '8' },
  ],
  cruzeiro: [
    { id: 'gabigol', name: 'Gabigol', position: 'Atacante', number: '10' },
    { id: 'matheus-pereira', name: 'Matheus Pereira', position: 'Meia', number: '10' },
    { id: 'cássio', name: 'Cássio', position: 'Goleiro', number: '1' },
    { id: 'lucas-silva', name: 'Lucas Silva', position: 'Volante', number: '16' },
    { id: 'arthur-gomes', name: 'Arthur Gomes', position: 'Atacante', number: '7' },
  ],
}

// Avatares mais interessantes - organizados por categoria
const avatarCategories = [
  {
    name: 'Expressões',
    avatars: ['😎', '🤩', '😤', '🥳', '😈', '🤑', '😏', '🧐']
  },
  {
    name: 'Futebol',
    avatars: ['⚽', '🥅', '🏆', '🥇', '🎖️', '👟', '🧤', '📣']
  },
  {
    name: 'Animais',
    avatars: ['🦁', '🐯', '🦅', '🐺', '🦈', '🐉', '🦂', '🐊']
  },
  {
    name: 'Símbolos',
    avatars: ['👑', '💎', '🔥', '⭐', '💫', '⚡', '🎯', '💪']
  }
]

const TOTAL_STEPS = 6

export default function OnboardingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [connectedSocials, setConnectedSocials] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [username, setUsername] = useState('')
  const [selectedAvatarCategory, setSelectedAvatarCategory] = useState(0)

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    } else {
      // Salvar dados no localStorage para uso posterior
      localStorage.setItem('palpiteiro_user', JSON.stringify({
        team: selectedTeam,
        username,
        avatar: uploadedPhoto || profilePhoto,
        categories: selectedCategories,
        players: selectedPlayers,
      }))
      router.push('/feed')
    }
  }

  const handleSkip = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    } else {
      localStorage.setItem('palpiteiro_user', JSON.stringify({
        team: selectedTeam,
        username,
        avatar: uploadedPhoto || profilePhoto,
        categories: selectedCategories,
        players: selectedPlayers,
      }))
      router.push('/feed')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string)
        setProfilePhoto(null) // Limpar avatar selecionado
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const togglePlayer = (id: string) => {
    setSelectedPlayers(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const toggleSocial = (id: string) => {
    setConnectedSocials(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const selectAvatar = (emoji: string) => {
    setProfilePhoto(emoji)
    setUploadedPhoto(null) // Limpar foto uploadada
  }

  const canContinue = () => {
    switch (step) {
      case 1: return !!selectedTeam
      case 2: return username.length >= 3 // Username obrigatório com min 3 caracteres
      case 3: return true // social é opcional
      case 4: return selectedCategories.length > 0
      case 5: return true // jogadores é opcional
      case 6: return true
      default: return true
    }
  }

  // Pegar jogadores do time selecionado
  const teamPlayers = selectedTeam && selectedTeam !== 'outro'
    ? playersByTeam[selectedTeam] || []
    : []

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a12',
      display: 'flex',
      flexDirection: 'column',
      color: '#ffffff'
    }}>
      {/* Progress Bar */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '4px',
                backgroundColor: i < step ? BRAND.primary : 'rgba(255,255,255,0.1)',
                transition: 'background-color 0.3s ease'
              }}
            />
          ))}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <span>Passo {step} de {TOTAL_STEPS}</span>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Pular
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '20px',
        maxWidth: '440px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        {/* Step 1: Escolha do Time */}
        {step === 1 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>❤️</span>
              <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                Qual seu time do coração?
              </h1>
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                Personalizamos os rumores pra você
              </p>
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
                  style={{
                    padding: '12px 8px',
                    borderRadius: '14px',
                    border: selectedTeam === team.id
                      ? `2px solid ${BRAND.primary}`
                      : '2px solid rgba(255,255,255,0.1)',
                    backgroundColor: selectedTeam === team.id
                      ? `${BRAND.primary}20`
                      : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={team.badge}
                    alt={team.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      objectFit: 'contain',
                      marginBottom: '6px'
                    }}
                  />
                  <span style={{
                    fontSize: '10px',
                    color: selectedTeam === team.id ? BRAND.primary : '#9ca3af',
                    fontWeight: 600
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
                border: selectedTeam === 'outro'
                  ? `2px solid ${BRAND.primary}`
                  : '2px solid rgba(255,255,255,0.1)',
                backgroundColor: selectedTeam === 'outro'
                  ? `${BRAND.primary}20`
                  : 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                color: '#9ca3af',
                fontSize: '13px'
              }}
            >
              Outro time / Sem preferência
            </button>
          </>
        )}

        {/* Step 2: Foto de Perfil e Username */}
        {step === 2 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>✨</span>
              <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                Crie seu perfil
              </h1>
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                Escolha uma foto e seu nome de usuário
              </p>
            </div>

            {/* Avatar/Foto */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: uploadedPhoto
                    ? `url(${uploadedPhoto}) center/cover`
                    : profilePhoto
                      ? `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`
                      : 'rgba(255,255,255,0.05)',
                  border: `3px solid ${(uploadedPhoto || profilePhoto) ? BRAND.primary : 'rgba(255,255,255,0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexDirection: 'column',
                  gap: '4px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {uploadedPhoto ? (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.6)',
                    padding: '6px',
                    fontSize: '10px',
                    color: '#fff'
                  }}>
                    Trocar foto
                  </div>
                ) : profilePhoto ? (
                  <span style={{ fontSize: '52px' }}>{profilePhoto}</span>
                ) : (
                  <>
                    <span style={{ fontSize: '28px' }}>📷</span>
                    <span style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center', padding: '0 8px' }}>
                      Toque para adicionar foto
                    </span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>

            {/* Username */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                fontSize: '13px',
                color: '#fff',
                marginBottom: '8px',
                display: 'block',
                fontWeight: 600
              }}>
                Nome de usuário *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                placeholder="seunome"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: username.length >= 3
                    ? `2px solid ${BRAND.success}`
                    : '2px solid rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '6px',
                fontSize: '11px'
              }}>
                <span style={{ color: username.length >= 3 ? BRAND.success : '#6b7280' }}>
                  {username.length >= 3 ? '✓ Nome válido' : 'Mínimo 3 caracteres'}
                </span>
                <span style={{ color: '#6b7280' }}>
                  @{username || 'seunome'}
                </span>
              </div>
            </div>

            {/* Categorias de Avatar */}
            <div>
              <p style={{ fontSize: '13px', color: '#fff', marginBottom: '12px', fontWeight: 600 }}>
                Ou escolha um avatar:
              </p>

              {/* Tabs de categorias */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '12px',
                overflowX: 'auto',
                paddingBottom: '4px'
              }}>
                {avatarCategories.map((cat, idx) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedAvatarCategory(idx)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedAvatarCategory === idx
                        ? BRAND.primary
                        : 'rgba(255,255,255,0.1)',
                      color: selectedAvatarCategory === idx ? '#fff' : '#9ca3af',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Avatares da categoria selecionada */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px'
              }}>
                {avatarCategories[selectedAvatarCategory].avatars.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => selectAvatar(emoji)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '14px',
                      border: profilePhoto === emoji && !uploadedPhoto
                        ? `2px solid ${BRAND.primary}`
                        : '2px solid rgba(255,255,255,0.1)',
                      backgroundColor: profilePhoto === emoji && !uploadedPhoto
                        ? `${BRAND.primary}20`
                        : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      fontSize: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 3: Conectar Redes Sociais */}
        {step === 3 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🔗</span>
              <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                Conecte suas redes
              </h1>
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                Facilite o login e encontre amigos
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {socialNetworks.map((social) => (
                <button
                  key={social.id}
                  onClick={() => toggleSocial(social.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    borderRadius: '14px',
                    border: connectedSocials.includes(social.id)
                      ? `2px solid ${BRAND.success}`
                      : '2px solid rgba(255,255,255,0.1)',
                    backgroundColor: connectedSocials.includes(social.id)
                      ? `${BRAND.success}15`
                      : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{social.icon}</span>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>
                      {social.name}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '13px',
                    color: connectedSocials.includes(social.id) ? BRAND.success : '#6b7280',
                    fontWeight: 600
                  }}>
                    {connectedSocials.includes(social.id) ? '✓ Conectado' : 'Conectar'}
                  </span>
                </button>
              ))}
            </div>

            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              textAlign: 'center',
              marginTop: '20px'
            }}>
              Nunca publicaremos sem sua permissão
            </p>
          </>
        )}

        {/* Step 4: Tipos de Notícias */}
        {step === 4 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>📰</span>
              <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                O que te interessa?
              </h1>
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                Selecione pelo menos 1 categoria
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {newsCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: selectedCategories.includes(cat.id)
                      ? `2px solid ${BRAND.primary}`
                      : '2px solid rgba(255,255,255,0.1)',
                    backgroundColor: selectedCategories.includes(cat.id)
                      ? `${BRAND.primary}20`
                      : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>
                    {cat.emoji}
                  </span>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: selectedCategories.includes(cat.id) ? BRAND.primary : '#fff',
                    marginBottom: '4px'
                  }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    {cat.desc}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 5: Jogadores Favoritos (do time escolhido) */}
        {step === 5 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>⭐</span>
              <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                Jogadores favoritos
              </h1>
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                {selectedTeam && selectedTeam !== 'outro'
                  ? `Escolha seus craques do ${teams.find(t => t.id === selectedTeam)?.name}`
                  : 'Acompanhe rumores sobre eles'}
              </p>
            </div>

            {teamPlayers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {teamPlayers.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => togglePlayer(player.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      border: selectedPlayers.includes(player.id)
                        ? `2px solid ${BRAND.accent}`
                        : '2px solid rgba(255,255,255,0.1)',
                      backgroundColor: selectedPlayers.includes(player.id)
                        ? `${BRAND.accent}15`
                        : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${BRAND.primary}40, ${BRAND.secondary}40)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 800,
                        color: '#fff'
                      }}>
                        {player.number}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>
                          {player.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {player.position}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: selectedPlayers.includes(player.id)
                        ? `2px solid ${BRAND.accent}`
                        : '2px solid rgba(255,255,255,0.2)',
                      backgroundColor: selectedPlayers.includes(player.id)
                        ? BRAND.accent
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {selectedPlayers.includes(player.id) && (
                        <span style={{ color: '#fff', fontSize: '14px' }}>✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🌍</span>
                <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                  Você poderá seguir jogadores de qualquer time depois!
                </p>
              </div>
            )}

            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              textAlign: 'center',
              marginTop: '16px'
            }}>
              Você pode adicionar mais jogadores depois
            </p>
          </>
        )}

        {/* Step 6: Notificações */}
        {step === 6 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🔔</span>
              <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                Ative as notificações
              </h1>
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                Não perca nenhum rumor importante
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '🚨', title: 'Novos sinais', desc: 'Quando influenciadores se manifestam' },
                { icon: '📈', title: 'Rumores quentes', desc: 'Quando um rumor ganha força' },
                { icon: '✅', title: 'Resultados', desc: 'Saiba se você acertou seu palpite' },
                { icon: '🏆', title: 'Ranking', desc: 'Quando você subir de posição' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <span style={{ fontSize: '28px' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div style={{
              marginTop: '24px',
              padding: '16px',
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${BRAND.primary}15, ${BRAND.secondary}15)`,
              border: `1px solid ${BRAND.primary}30`
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: BRAND.primary, marginBottom: '8px' }}>
                Tudo pronto, @{username}! 🎉
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.5' }}>
                {selectedTeam && `Time: ${teams.find(t => t.id === selectedTeam)?.name || 'Outro'}`}
                {selectedCategories.length > 0 && ` • ${selectedCategories.length} categorias`}
                {selectedPlayers.length > 0 && ` • ${selectedPlayers.length} jogadores`}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(10, 10, 18, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <button
          onClick={handleNext}
          disabled={!canContinue()}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '14px',
            fontWeight: 700,
            fontSize: '16px',
            border: 'none',
            cursor: canContinue() ? 'pointer' : 'not-allowed',
            background: canContinue()
              ? `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`
              : 'rgba(255,255,255,0.1)',
            color: canContinue() ? '#fff' : '#6b7280',
            boxShadow: canContinue() ? `0 4px 20px ${BRAND.primary}40` : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          {step === TOTAL_STEPS ? 'Entrar no app 🎉' : 'Continuar'}
        </button>
      </div>
    </main>
  )
}
