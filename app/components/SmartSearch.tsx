'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface SearchResult {
  type: 'team' | 'player' | 'influencer' | 'rumor'
  id: string
  title: string
  subtitle?: string
  emoji?: string
  href: string
}

// Mock data - in production this would come from API
const TEAMS = [
  { id: 'flamengo', name: 'Flamengo', emoji: '🔴⚫' },
  { id: 'corinthians', name: 'Corinthians', emoji: '⚫⚪' },
  { id: 'palmeiras', name: 'Palmeiras', emoji: '💚' },
  { id: 'santos', name: 'Santos', emoji: '⚪⚫' },
  { id: 'sao-paulo', name: 'São Paulo', emoji: '🔴⚪⚫' },
  { id: 'botafogo', name: 'Botafogo', emoji: '⭐⚫' },
  { id: 'fluminense', name: 'Fluminense', emoji: '🟢🟣⚪' },
  { id: 'vasco', name: 'Vasco', emoji: '⚫⚪' },
  { id: 'atletico-mg', name: 'Atlético-MG', emoji: '⚫⚪' },
  { id: 'cruzeiro', name: 'Cruzeiro', emoji: '💙' },
  { id: 'internacional', name: 'Internacional', emoji: '🔴⚪' },
  { id: 'gremio', name: 'Grêmio', emoji: '💙🖤⚪' },
  { id: 'athletico-pr', name: 'Athletico-PR', emoji: '🔴⚫' },
]

const PLAYERS = [
  { name: 'Gabigol', team: 'Flamengo' },
  { name: 'Neymar', team: 'Santos' },
  { name: 'Pedro', team: 'Flamengo' },
  { name: 'Arrascaeta', team: 'Flamengo' },
  { name: 'Endrick', team: 'Palmeiras' },
  { name: 'Memphis Depay', team: 'Corinthians' },
  { name: 'Yuri Alberto', team: 'Corinthians' },
  { name: 'Hulk', team: 'Atlético-MG' },
  { name: 'Suárez', team: 'Grêmio' },
  { name: 'Coutinho', team: 'Vasco' },
]

interface SmartSearchProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export function SmartSearch({ placeholder = 'Buscar jogadores, times...', onSearch }: SmartSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search logic
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)

    // Simulate API delay
    const timeout = setTimeout(() => {
      const searchResults: SearchResult[] = []
      const lowerQuery = query.toLowerCase()

      // Search teams
      TEAMS.forEach(team => {
        if (team.name.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            type: 'team',
            id: team.id,
            title: team.name,
            subtitle: 'Time',
            emoji: team.emoji,
            href: team.id === 'flamengo' ? '/home' : `/time/${team.id}`
          })
        }
      })

      // Search players
      PLAYERS.forEach(player => {
        if (player.name.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            type: 'player',
            id: player.name.toLowerCase().replace(/\s/g, '-'),
            title: player.name,
            subtitle: player.team,
            emoji: '⚽',
            href: `/explorar?player=${encodeURIComponent(player.name)}`
          })
        }
      })

      setResults(searchResults.slice(0, 8))
      setIsLoading(false)
    }, 150)

    return () => clearTimeout(timeout)
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)
    onSearch?.(value)
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'team': return '🏟️'
      case 'player': return '⚽'
      case 'influencer': return '📰'
      case 'rumor': return '🔥'
      default: return '🔍'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'team': return 'Time'
      case 'player': return 'Jogador'
      case 'influencer': return 'Influenciador'
      case 'rumor': return 'Rumor'
      default: return ''
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Search Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#16162a',
        border: isOpen && results.length > 0 ? '1px solid #ff1744' : '1px solid #2a2a3e',
        borderRadius: isOpen && results.length > 0 ? '12px 12px 0 0' : '12px',
        padding: '12px 16px',
        transition: 'all 0.2s ease'
      }}>
        <span style={{ fontSize: '16px', color: '#666680' }}>
          {isLoading ? '⏳' : '🔍'}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '14px'
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              inputRef.current?.focus()
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#666680',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '4px'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#16162a',
          border: '1px solid #ff1744',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 50
        }}>
          {results.map((result, index) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={result.href}
              onClick={handleResultClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderBottom: index < results.length - 1 ? '1px solid #2a2a3e' : 'none',
                textDecoration: 'none',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 23, 68, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#1e2235',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                {result.emoji || getTypeIcon(result.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                  {result.title}
                </div>
                <div style={{ fontSize: '11px', color: '#666680' }}>
                  {result.subtitle || getTypeLabel(result.type)}
                </div>
              </div>
              <span style={{ color: '#666680', fontSize: '14px' }}>→</span>
            </Link>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#16162a',
          border: '1px solid #2a2a3e',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          padding: '16px',
          textAlign: 'center',
          zIndex: 50
        }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🤔</span>
          <span style={{ color: '#666680', fontSize: '13px' }}>
            Nenhum resultado para &quot;{query}&quot;
          </span>
        </div>
      )}
    </div>
  )
}
