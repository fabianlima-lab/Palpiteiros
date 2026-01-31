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

// URLs dos escudos via Transfermarkt CDN (público e confiável)
// Formato: https://tmssl.akamaized.net/images/wappen/head/{id}.png

export const TEAMS: Team[] = [
  {
    id: 'flamengo',
    name: 'Flamengo',
    shortName: 'FLA',
    color: '#E11D48',
    secondaryColor: '#000000',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/614.png',
  },
  {
    id: 'corinthians',
    name: 'Corinthians',
    shortName: 'COR',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/199.png',
  },
  {
    id: 'palmeiras',
    name: 'Palmeiras',
    shortName: 'PAL',
    color: '#006437',
    secondaryColor: '#FFFFFF',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/1023.png',
  },
  {
    id: 'santos',
    name: 'Santos',
    shortName: 'SAN',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/221.png',
  },
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    shortName: 'SAO',
    color: '#FF0000',
    secondaryColor: '#000000',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/585.png',
  },
  {
    id: 'botafogo',
    name: 'Botafogo',
    shortName: 'BOT',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/537.png',
  },
  {
    id: 'fluminense',
    name: 'Fluminense',
    shortName: 'FLU',
    color: '#7B2D3E',
    secondaryColor: '#006633',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/2462.png',
  },
  {
    id: 'vasco',
    name: 'Vasco',
    shortName: 'VAS',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/978.png',
  },
  {
    id: 'atletico-mg',
    name: 'Atlético-MG',
    shortName: 'CAM',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/330.png',
  },
  {
    id: 'cruzeiro',
    name: 'Cruzeiro',
    shortName: 'CRU',
    color: '#003DA5',
    secondaryColor: '#FFFFFF',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/609.png',
  },
  {
    id: 'internacional',
    name: 'Internacional',
    shortName: 'INT',
    color: '#E4002B',
    secondaryColor: '#FFFFFF',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/6600.png',
  },
  {
    id: 'gremio',
    name: 'Grêmio',
    shortName: 'GRE',
    color: '#0080C8',
    secondaryColor: '#000000',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/210.png',
  },
  {
    id: 'bahia',
    name: 'Bahia',
    shortName: 'BAH',
    color: '#004A99',
    secondaryColor: '#E4002B',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/2028.png',
  },
  {
    id: 'fortaleza',
    name: 'Fortaleza',
    shortName: 'FOR',
    color: '#004A99',
    secondaryColor: '#E4002B',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/10870.png',
  },
  {
    id: 'athletico-pr',
    name: 'Athletico-PR',
    shortName: 'CAP',
    color: '#B71C1C',
    secondaryColor: '#000000',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/679.png',
  },
  {
    id: 'bragantino',
    name: 'Bragantino',
    shortName: 'RBB',
    color: '#E4002B',
    secondaryColor: '#FFFFFF',
    logo: 'https://tmssl.akamaized.net/images/wappen/head/8793.png',
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
