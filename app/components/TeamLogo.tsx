'use client'

import { useState } from 'react'
import { TEAMS, findTeamByName } from '@/lib/teams'

interface TeamLogoProps {
  teamName: string
  size?: number
  showName?: boolean
  className?: string
}

export function TeamLogo({ teamName, size = 24, showName = false }: TeamLogoProps) {
  const [hasError, setHasError] = useState(false)
  const team = findTeamByName(teamName)

  if (!team) {
    // Fallback para time não encontrado
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#27272A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.4,
          color: '#fff',
          fontWeight: 'bold',
        }}
      >
        {teamName.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: showName ? 8 : 0 }}>
      {hasError ? (
        // Fallback se imagem falhar
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: team.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.4,
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          {team.shortName.slice(0, 2)}
        </div>
      ) : (
        <img
          src={team.logo}
          alt={`${team.name} escudo`}
          width={size}
          height={size}
          style={{
            objectFit: 'contain',
            borderRadius: '4px',
          }}
          onError={() => setHasError(true)}
        />
      )}
      {showName && (
        <span style={{ fontSize: size * 0.6, fontWeight: 500 }}>
          {team.name}
        </span>
      )}
    </div>
  )
}

// Componente simplificado só para sidebar
interface TeamButtonProps {
  team: typeof TEAMS[0]
  isSelected?: boolean
  isLocked?: boolean
  onClick?: () => void
}

export function TeamButton({ team, isSelected, isLocked, onClick }: TeamButtonProps) {
  const [hasError, setHasError] = useState(false)

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        transition: 'all 0.15s ease',
        background: isSelected ? `${team.color}20` : 'transparent',
        color: isSelected ? '#fff' : isLocked ? '#71717A' : '#A1A1AA',
        fontWeight: isSelected ? 500 : 400,
        opacity: isLocked ? 0.5 : 1,
        position: 'relative',
      }}
    >
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: '3px',
            height: '24px',
            background: team.color,
            borderRadius: '0 2px 2px 0',
          }}
        />
      )}

      {hasError ? (
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: team.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          {team.shortName.slice(0, 2)}
        </div>
      ) : (
        <img
          src={team.logo}
          alt={team.name}
          width={24}
          height={24}
          style={{ objectFit: 'contain', borderRadius: 4 }}
          onError={() => setHasError(true)}
        />
      )}

      <span>{team.name}</span>

      {isLocked && (
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#71717A' }}>
          🔒
        </span>
      )}
    </button>
  )
}
