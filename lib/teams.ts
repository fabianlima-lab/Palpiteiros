// =============================================================================
// TIMES DO BRASILEIRÃO - Dados centralizados com escudos
// =============================================================================

export interface Team {
  id: string
  name: string
  shortName: string
  color: string
  secondaryColor?: string
  logo: string // URL do escudo
}

// URLs dos escudos via API do SofaScore (CDN público e confiável)
// Formato: https://api.sofascore.app/api/v1/team/{id}/image
// Alternativa: https://logodetimes.com/times/{nome}/logo-{nome}-{tamanho}.png

export const TEAMS: Team[] = [
  {
    id: 'flamengo',
    name: 'Flamengo',
    shortName: 'FLA',
    color: '#E11D48',
    secondaryColor: '#000000',
    logo: 'https://api.sofascore.app/api/v1/team/5981/image',
  },
  {
    id: 'corinthians',
    name: 'Corinthians',
    shortName: 'COR',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.sofascore.app/api/v1/team/1957/image',
  },
  {
    id: 'palmeiras',
    name: 'Palmeiras',
    shortName: 'PAL',
    color: '#006437',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.sofascore.app/api/v1/team/1963/image',
  },
  {
    id: 'santos',
    name: 'Santos',
    shortName: 'SAN',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.sofascore.app/api/v1/team/1968/image',
  },
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    shortName: 'SAO',
    color: '#FF0000',
    secondaryColor: '#000000',
    logo: 'https://api.sofascore.app/api/v1/team/1981/image',
  },
  {
    id: 'botafogo',
    name: 'Botafogo',
    shortName: 'BOT',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.sofascore.app/api/v1/team/1958/image',
  },
  {
    id: 'fluminense',
    name: 'Fluminense',
    shortName: 'FLU',
    color: '#7B2D3E',
    secondaryColor: '#006633',
    logo: 'https://api.sofascore.app/api/v1/team/1961/image',
  },
  {
    id: 'vasco',
    name: 'Vasco',
    shortName: 'VAS',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.sofascore.app/api/v1/team/1974/image',
  },
  {
    id: 'atletico-mg',
    name: 'Atlético-MG',
    shortName: 'CAM',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.sofascore.app/api/v1/team/1977/image',
  },
  {
    id: 'cruzeiro',
    name: 'Cruzeiro',
    shortName: 'CRU',
    color: '#003DA5',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.sofascore.app/api/v1/team/1954/image',
  },
  {
    id: 'internacional',
    name: 'Internacional',
    shortName: 'INT',
    color: '#E4002B',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.sofascore.app/api/v1/team/1966/image',
  },
  {
    id: 'gremio',
    name: 'Grêmio',
    shortName: 'GRE',
    color: '#0080C8',
    secondaryColor: '#000000',
    logo: 'https://api.sofascore.app/api/v1/team/5926/image',
  },
  {
    id: 'bahia',
    name: 'Bahia',
    shortName: 'BAH',
    color: '#004A99',
    secondaryColor: '#E4002B',
    logo: 'https://api.sofascore.app/api/v1/team/1955/image',
  },
  {
    id: 'fortaleza',
    name: 'Fortaleza',
    shortName: 'FOR',
    color: '#004A99',
    secondaryColor: '#E4002B',
    logo: 'https://api.sofascore.app/api/v1/team/1965/image',
  },
  {
    id: 'athletico-pr',
    name: 'Athletico-PR',
    shortName: 'CAP',
    color: '#B71C1C',
    secondaryColor: '#000000',
    logo: 'https://api.sofascore.app/api/v1/team/1980/image',
  },
  {
    id: 'bragantino',
    name: 'Bragantino',
    shortName: 'RBB',
    color: '#E4002B',
    secondaryColor: '#FFFFFF',
    logo: 'https://api.sofascore.app/api/v1/team/1999/image',
  },
]

// Mapa para busca rápida por nome
export const TEAMS_MAP = new Map(TEAMS.map(t => [t.id, t]))

// Helper para buscar time por ID
export function findTeamById(id: string): Team | undefined {
  return TEAMS_MAP.get(id)
}

// Helper para buscar time por nome (case insensitive)
export function findTeamByName(name: string): Team | undefined {
  const normalized = name.toLowerCase().trim()
  return TEAMS.find(t =>
    t.name.toLowerCase() === normalized ||
    t.shortName.toLowerCase() === normalized ||
    t.id === normalized
  )
}

// Helper para buscar time ou retornar default
export function getTeamOrDefault(name: string): Team {
  return findTeamByName(name) || TEAMS[0]
}

// Componente de escudo reutilizável
export function getTeamLogoUrl(teamName: string): string {
  const team = findTeamByName(teamName)
  return team?.logo || TEAMS[0].logo
}

export function getTeamColor(teamName: string): string {
  const team = findTeamByName(teamName)
  return team?.color || '#27272A'
}
