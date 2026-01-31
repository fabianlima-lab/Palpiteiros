import { prisma } from '@/lib/prisma'
import { TeamPageClient } from './TeamPageClient'
import { TEAMS, findTeamById } from '@/lib/teams'

// Helper function to darken a color
function darkenColor(hex: string): string {
  const color = hex.replace('#', '')
  const r = Math.max(0, parseInt(color.slice(0, 2), 16) - 40)
  const g = Math.max(0, parseInt(color.slice(2, 4), 16) - 40)
  const b = Math.max(0, parseInt(color.slice(4, 6), 16) - 40)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Fake rumors for each team
const FAKE_RUMORS: Record<string, Array<{ title: string; category: string; sentiment: number }>> = {
  'corinthians': [
    { title: 'Memphis Depay renova com o Corinthians?', category: 'Contrato', sentiment: 72 },
    { title: 'Yuri Alberto vai para a Europa?', category: 'Transferência', sentiment: 35 },
    { title: 'Novo reforço para a zaga do Timão', category: 'Contratação', sentiment: 68 },
  ],
  'palmeiras': [
    { title: 'Endrick deixará saudades no Verdão', category: 'Transferência', sentiment: 85 },
    { title: 'Abel Ferreira renova até 2027?', category: 'Contrato', sentiment: 78 },
    { title: 'Palmeiras de olho em atacante argentino', category: 'Contratação', sentiment: 55 },
  ],
  'santos': [
    { title: 'Neymar volta para a Vila?', category: 'Retorno', sentiment: 42 },
    { title: 'Santos busca reforços para Série A', category: 'Contratação', sentiment: 65 },
    { title: 'Promessa da base renova contrato', category: 'Contrato', sentiment: 88 },
  ],
  'sao-paulo': [
    { title: 'James Rodríguez fica no Tricolor?', category: 'Contrato', sentiment: 48 },
    { title: 'Lucas Moura vai para MLS?', category: 'Transferência', sentiment: 30 },
    { title: 'Novo técnico no radar do São Paulo', category: 'Técnico', sentiment: 25 },
  ],
  'botafogo': [
    { title: 'Artur Jorge renova após título?', category: 'Contrato', sentiment: 82 },
    { title: 'Botafogo mira reforços europeus', category: 'Contratação', sentiment: 70 },
    { title: 'Jefferson volta como dirigente?', category: 'Gestão', sentiment: 65 },
  ],
  'fluminense': [
    { title: 'Germán Cano fica em 2025?', category: 'Contrato', sentiment: 75 },
    { title: 'Flu de olho em meia colombiano', category: 'Contratação', sentiment: 58 },
    { title: 'Jovem da base vai para Europa', category: 'Transferência', sentiment: 45 },
  ],
  'vasco': [
    { title: 'Philippe Coutinho renova?', category: 'Contrato', sentiment: 62 },
    { title: 'Vasco busca goleiro experiente', category: 'Contratação', sentiment: 70 },
    { title: 'SAF anuncia novos investimentos', category: 'Gestão', sentiment: 55 },
  ],
  'atletico-mg': [
    { title: 'Hulk vai se aposentar no Galo?', category: 'Aposentadoria', sentiment: 80 },
    { title: 'Atlético mira técnico estrangeiro', category: 'Técnico', sentiment: 45 },
    { title: 'Reforço uruguaio na mira', category: 'Contratação', sentiment: 60 },
  ],
  'cruzeiro': [
    { title: 'Cruzeiro vai atrás de Dudu?', category: 'Contratação', sentiment: 38 },
    { title: 'Novo estádio em construção', category: 'Infraestrutura', sentiment: 72 },
    { title: 'Cabuloso mira Libertadores', category: 'Contratação', sentiment: 65 },
  ],
  'internacional': [
    { title: 'Alan Patrick renova até 2027?', category: 'Contrato', sentiment: 70 },
    { title: 'Inter busca centroavante', category: 'Contratação', sentiment: 58 },
    { title: 'Jovem promessa vai para Europa', category: 'Transferência', sentiment: 42 },
  ],
  'gremio': [
    { title: 'Suárez joga mais uma temporada?', category: 'Contrato', sentiment: 55 },
    { title: 'Grêmio mira técnico português', category: 'Técnico', sentiment: 40 },
    { title: 'Reforço para a lateral direita', category: 'Contratação', sentiment: 68 },
  ],
  'athletico-pr': [
    { title: 'Furacão busca reforços na base', category: 'Contratação', sentiment: 75 },
    { title: 'Técnico estrangeiro na mira', category: 'Técnico', sentiment: 50 },
    { title: 'Jogador vai para liga saudita', category: 'Transferência', sentiment: 35 },
  ],
}

interface PageProps {
  params: Promise<{ teamId: string }>
}

export default async function TeamPage({ params }: PageProps) {
  const { teamId } = await params
  const team = findTeamById(teamId)

  if (!team) {
    return (
      <main style={{ backgroundColor: '#0f0f1a', minHeight: '100vh', paddingBottom: '80px' }}>
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>😕</span>
          <span style={{ color: '#666680', fontSize: '14px' }}>Time não encontrado</span>
        </div>
      </main>
    )
  }

  // Construct teamData from centralized team data
  const teamData = {
    name: team.name,
    logo: team.logo,
    color: team.color,
    colorDark: darkenColor(team.color),
  }

  const influencers = await prisma.influencer.findMany({
    orderBy: { trustScore: 'desc' },
    take: 5,
  })

  const topUsers = await prisma.user.findMany({
    orderBy: { points: 'desc' },
    take: 5,
  })

  // Check if user is premium (for now, always false for non-Flamengo teams)
  const isPremium = false
  const teamRumors = FAKE_RUMORS[teamId] || []

  return (
    <TeamPageClient
      teamId={teamId}
      teamData={teamData}
      influencers={influencers}
      topUsers={topUsers}
      teamRumors={teamRumors}
      isPremium={isPremium}
    />
  )
}
