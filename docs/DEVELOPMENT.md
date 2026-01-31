# Guia de Desenvolvimento - Palpiteiro MVP

Este guia explica como desenvolver e estender o projeto.

## Prerequisitos

- Node.js 18+
- npm ou yarn
- Conta no Neon (banco PostgreSQL)
- Conta no Twitter Developer (para API)

## Setup Inicial

### 1. Clone e Instale

```bash
git clone https://github.com/fabianlima-lab/Palpiteiros.git
cd palpiteiro-mvp
npm install
```

### 2. Configure o Banco de Dados

1. Crie uma conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie as connection strings

```bash
# Crie o arquivo .env
cp .env.example .env

# Edite com suas credenciais
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require"
```

### 3. Configure o Prisma

```bash
# Gerar o client
npx prisma generate

# Sincronizar schema com banco
npx prisma db push

# Popular com dados iniciais
npx prisma db seed

# (Opcional) Abrir interface visual
npx prisma studio
```

### 4. Configure o Twitter

1. Acesse [developer.twitter.com](https://developer.twitter.com)
2. Crie um projeto e app
3. Gere o Bearer Token
4. Adicione ao `.env`:

```env
TWITTER_BEARER_TOKEN="seu_token_aqui"
```

### 5. Inicie o Servidor

```bash
npm run dev
```

Acesse: http://localhost:3000

## Estrutura de Codigo

### App Router (Next.js 16)

```
app/
├── page.tsx              # Landing page (redireciona para /feed)
├── layout.tsx            # Layout global
├── providers.tsx         # Providers (tRPC, React Query)
├── feed/
│   ├── page.tsx          # Server component
│   └── FeedClient.tsx    # Client component
├── rumor/[id]/
│   ├── page.tsx          # Detalhes do rumor
│   └── RumorDetailClient.tsx
└── api/
    └── route.ts          # API handlers
```

### Componentes Importantes

| Arquivo | Descricao |
|---------|-----------|
| `app/components/RumorCard.tsx` | Card de rumor no feed |
| `app/components/TeamLogo.tsx` | Logo do time com fallback |
| `app/components/ReactionPicker.tsx` | Seletor de reacoes |
| `app/feed/FeedClient.tsx` | Feed principal com infinite scroll |

### Sistema de Scraping

```
src/lib/scrapers/
├── twitter.ts       # Twitter API v2
├── youtube.ts       # YouTube RSS + scraping
├── rss.ts           # Globo e UOL RSS
├── processor.ts     # Processamento de entidades
├── rumor-detector.ts # Deteccao automatica
└── types.ts         # Tipos e constantes
```

## Fluxos Principais

### 1. Criar Novo Rumor

**Via API:**
```bash
curl -X POST http://localhost:3000/api/admin/rumors \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "Neymar",
    "toTeam": "Flamengo",
    "fromTeam": "Santos",
    "title": "Neymar no Flamengo?",
    "description": "Rumor de transferencia",
    "closesAt": "2026-03-01T00:00:00Z"
  }'
```

**Via Prisma:**
```typescript
await prisma.rumor.create({
  data: {
    playerName: "Neymar",
    toTeam: "Flamengo",
    fromTeam: "Santos",
    title: "Neymar no Flamengo?",
    closesAt: new Date("2026-03-01"),
  }
})
```

### 2. Registrar Voto

```bash
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{
    "rumorId": "clxxx...",
    "prediction": true
  }'
```

### 3. Executar Scraping

```bash
# Local
curl http://localhost:3000/api/cron/scrape-news

# Producao
curl https://palpiteiro-mvp.vercel.app/api/cron/scrape-news
```

### 4. Buscar Rumores com Relevancia

```bash
# Com filtro de time
curl "http://localhost:3000/api/rumors/relevance?team=Flamengo"

# Sem filtro
curl "http://localhost:3000/api/rumors/relevance"
```

## Banco de Dados

### Modelos Principais

```
User          - Usuarios da plataforma
Rumor         - Rumores de transferencia
Prediction    - Votos dos usuarios
Influencer    - Jornalistas/influenciadores
Signal        - Sinais dos influenciadores
NewsItem      - Noticias agregadas
RumorNewsItem - Relacao rumor <-> noticia
RumorSignal   - Metricas de mencoes
```

### Queries Uteis

```typescript
// Rumores ativos
const rumors = await prisma.rumor.findMany({
  where: { status: 'open' },
  include: {
    predictions: true,
    signals: { include: { influencer: true } },
    newsItems: { include: { newsItem: true } },
  }
})

// Estatisticas de um rumor
const stats = await prisma.prediction.groupBy({
  by: ['prediction'],
  where: { rumorId: 'xxx' },
  _count: true,
})
```

### Resetar Banco

```bash
# Limpar e recriar
npx prisma db push --force-reset

# Repopular
npx prisma db seed
```

## tRPC

### Estrutura

```
server/
├── api/
│   ├── root.ts           # Root router
│   ├── trpc.ts           # Configuracao tRPC
│   └── routers/
│       ├── rumors.ts     # Router de rumores
│       ├── users.ts      # Router de usuarios
│       ├── influencers.ts
│       ├── social.ts
│       └── notifications.ts
```

### Usar no Client

```typescript
import { trpc } from '@/lib/trpc'

// Em um componente
const { data: rumors } = trpc.rumors.getAll.useQuery()

// Mutation
const mutation = trpc.rumors.vote.useMutation()
await mutation.mutateAsync({ rumorId: 'xxx', prediction: true })
```

## Deploy

### Vercel

1. Push para GitHub
2. Conecte ao Vercel
3. Configure variaveis de ambiente no Vercel Dashboard:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `TWITTER_BEARER_TOKEN`

### Comandos Uteis

```bash
# Pull env do Vercel para local
npx vercel env pull --environment=production

# Deploy manual
npx vercel --prod

# Ver logs
npx vercel logs
```

## Troubleshooting

### Erro de Conexao com Banco

```
Authentication failed against database server
```

**Solucao:** Verifique se as credenciais no `.env` estao corretas. Use `npx vercel env pull` para obter as credenciais mais recentes.

### Prisma Client Desatualizado

```
The table `xxx` does not exist
```

**Solucao:**
```bash
npx prisma generate
npx prisma db push
```

### Twitter API Erro 401

```
Twitter API error 401: Unauthorized
```

**Solucao:** Verifique se o `TWITTER_BEARER_TOKEN` esta correto e ativo.

## Adicionar Novas Features

### 1. Novo Modelo no Banco

1. Edite `prisma/schema.prisma`
2. Execute `npx prisma db push`
3. Execute `npx prisma generate`

### 2. Nova Rota API

1. Crie arquivo em `app/api/nome/route.ts`
2. Exporte funcoes `GET`, `POST`, etc.

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const data = await prisma.xxx.findMany()
  return NextResponse.json(data)
}
```

### 3. Novo Scraper

1. Crie arquivo em `src/lib/scrapers/nome.ts`
2. Exporte funcao que retorna `ScrapedItem[]`
3. Adicione no `app/api/cron/scrape-news/route.ts`

### 4. Nova Pagina

1. Crie pasta em `app/nome/`
2. Adicione `page.tsx` (server component)
3. Se precisar de interatividade, crie `NomeClient.tsx` com `'use client'`

## Contato

- **GitHub:** https://github.com/fabianlima-lab/Palpiteiros
- **Vercel:** https://vercel.com/fabian-limas-projects/palpiteiro-mvp
