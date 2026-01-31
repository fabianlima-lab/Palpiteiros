# Sistema de Times - Palpiteiro

## Arquivo Centralizado

Todos os times do Brasileirão estão centralizados em `/lib/teams.ts`.

## Estrutura

```typescript
export interface Team {
  id: string          // Identificador único (slug)
  name: string        // Nome completo
  shortName: string   // Sigla (3 letras)
  color: string       // Cor primária (hex)
  secondaryColor?: string
  logo: string        // URL do escudo
}
```

## Times Disponíveis

| ID | Nome | Sigla | Cor | SofaScore ID |
|----|------|-------|-----|--------------|
| flamengo | Flamengo | FLA | #E11D48 | 5981 |
| corinthians | Corinthians | COR | #000000 | 1957 |
| palmeiras | Palmeiras | PAL | #006437 | 1963 |
| santos | Santos | SAN | #000000 | 1968 |
| sao-paulo | São Paulo | SAO | #FF0000 | 1981 |
| botafogo | Botafogo | BOT | #000000 | 1958 |
| fluminense | Fluminense | FLU | #7B2D3E | 1961 |
| vasco | Vasco | VAS | #000000 | 1974 |
| atletico-mg | Atlético-MG | CAM | #000000 | 1977 |
| cruzeiro | Cruzeiro | CRU | #003DA5 | 1954 |
| internacional | Internacional | INT | #E4002B | 1966 |
| gremio | Grêmio | GRE | #0080C8 | 5926 |
| bahia | Bahia | BAH | #004A99 | 1955 |
| fortaleza | Fortaleza | FOR | #004A99 | 1965 |
| athletico-pr | Athletico-PR | CAP | #B71C1C | 1980 |
| bragantino | Bragantino | RBB | #E4002B | 1999 |

## API de Escudos

Usamos a API pública do SofaScore:

```
https://api.sofascore.app/api/v1/team/{ID}/image
```

### Vantagens
- CDN confiável e rápido
- Imagens de alta qualidade
- Atualizadas automaticamente
- Sem necessidade de hospedar localmente

### Alternativa (backup)
```
https://logodetimes.com/times/{nome}/logo-{nome}-256.png
```

## Funções Utilitárias

### findTeamById
```typescript
export function findTeamById(id: string): Team | undefined
// Exemplo: findTeamById('flamengo') => { id: 'flamengo', name: 'Flamengo', ... }
```

### findTeamByName
```typescript
export function findTeamByName(name: string): Team | undefined
// Busca case-insensitive por name, shortName ou id
// Exemplo: findTeamByName('FLA') => { id: 'flamengo', ... }
```

### getTeamColor
```typescript
export function getTeamColor(teamName: string): string
// Exemplo: getTeamColor('Palmeiras') => '#006437'
```

### getTeamLogoUrl
```typescript
export function getTeamLogoUrl(teamName: string): string
// Exemplo: getTeamLogoUrl('Santos') => 'https://api.sofascore.app/api/v1/team/1968/image'
```

## Componentes React

### TeamLogo
```tsx
<TeamLogo teamName="Flamengo" size={24} showName={false} />
```

Props:
- `teamName` (required): Nome do time
- `size`: Tamanho em pixels (default: 24)
- `showName`: Mostrar nome ao lado (default: false)

Inclui fallback automático se a imagem falhar.

### TeamButton
```tsx
<TeamButton
  team={TEAMS[0]}
  isSelected={true}
  isLocked={false}
  onClick={() => {}}
/>
```

Usado na sidebar para seleção de times.

## Uso nos Arquivos

### Feed (FeedClient.tsx)
```tsx
import { TEAMS, findTeamByName, getTeamColor } from '@/lib/teams'
import { TeamLogo } from '@/app/components/TeamLogo'

const meuTimeObj = findTeamByName(user?.team || 'Flamengo')
<TeamLogo teamName={meuTimeObj.name} size={24} />
```

### Onboarding (onboarding/page.tsx)
```tsx
import { TEAMS } from '@/lib/teams'

const teams = TEAMS.map(t => ({
  id: t.id,
  name: t.name,
  badge: t.logo,
}))
```

### Página do Time (time/[teamId]/page.tsx)
```tsx
import { findTeamById } from '@/lib/teams'

const team = findTeamById(teamId)
const teamData = {
  name: team.name,
  logo: team.logo,
  color: team.color,
}
```

## Adicionando Novos Times

1. Encontre o ID do time no SofaScore:
   - Acesse `https://www.sofascore.com/team/football/{nome-do-time}/{id}`
   - O ID está na URL

2. Adicione ao array TEAMS em `/lib/teams.ts`:
```typescript
{
  id: 'novo-time',
  name: 'Novo Time FC',
  shortName: 'NTF',
  color: '#HEXCOR',
  logo: 'https://api.sofascore.app/api/v1/team/{ID}/image',
}
```

3. Atualize o TEAMS_MAP é automático.
