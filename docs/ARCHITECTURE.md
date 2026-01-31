# Arquitetura do Sistema - Palpiteiro MVP

## Visao Geral

O Palpiteiro eh uma plataforma de previsoes de transferencias do futebol brasileiro com analise de sentimento baseada em sinais sociais.

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Feed     │  │   Rumor     │  │    Time     │             │
│  │   (lista)   │  │  (detalhe)  │  │  (filtrado) │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          │                                       │
│                    ┌─────▼─────┐                                 │
│                    │  tRPC +   │                                 │
│                    │  React    │                                 │
│                    │  Query    │                                 │
│                    └─────┬─────┘                                 │
└──────────────────────────┼──────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────────┐
│                     BACKEND (Next.js)                            │
│                          │                                       │
│  ┌───────────────────────┼───────────────────────────┐          │
│  │              API Routes + tRPC                     │          │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │          │
│  │  │ /rumors  │  │  /vote   │  │ /scrape  │        │          │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘        │          │
│  └───────┼─────────────┼─────────────┼───────────────┘          │
│          │             │             │                           │
│          └─────────────┼─────────────┘                           │
│                        │                                         │
│                  ┌─────▼─────┐                                   │
│                  │  Prisma   │                                   │
│                  │   ORM     │                                   │
│                  └─────┬─────┘                                   │
└────────────────────────┼────────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────────┐
│                   BANCO DE DADOS                                 │
│                        │                                         │
│                  ┌─────▼─────┐                                   │
│                  │ PostgreSQL│                                   │
│                  │   (Neon)  │                                   │
│                  └───────────┘                                   │
└─────────────────────────────────────────────────────────────────┘
                         ▲
                         │
┌────────────────────────┼────────────────────────────────────────┐
│                SISTEMA DE SCRAPING                               │
│                        │                                         │
│  ┌─────────────────────┼─────────────────────────┐              │
│  │            Cron Job (Vercel)                   │              │
│  │                     │                          │              │
│  │     ┌───────┬───────┼───────┬───────┐         │              │
│  │     │       │       │       │       │         │              │
│  │  ┌──▼──┐ ┌──▼──┐ ┌──▼──┐ ┌──▼──┐   │         │              │
│  │  │Twitter│ │YouTube│ │Globo │ │ UOL │   │         │              │
│  │  │ API  │ │ RSS  │ │ RSS │ │ RSS │   │         │              │
│  │  └──────┘ └──────┘ └─────┘ └─────┘   │         │              │
│  └──────────────────────────────────────┘         │              │
└─────────────────────────────────────────────────────────────────┘
```

## Modulos Principais

### 1. Frontend (React + Next.js App Router)

#### Paginas

| Rota | Arquivo | Descricao |
|------|---------|-----------|
| `/` | `app/page.tsx` | Landing (redireciona para /feed) |
| `/feed` | `app/feed/page.tsx` | Feed principal de rumores |
| `/rumor/[id]` | `app/rumor/[id]/page.tsx` | Detalhes do rumor |
| `/time/[teamId]` | `app/time/[teamId]/page.tsx` | Rumores filtrados por time |
| `/onboarding` | `app/onboarding/page.tsx` | Selecao do time do coracao |
| `/ranking` | `app/ranking/page.tsx` | Ranking de influenciadores |
| `/perfil` | `app/perfil/page.tsx` | Perfil do usuario |

#### Componentes Chave

- **RumorCard** - Card de rumor com votos e reacoes
- **TeamLogo** - Logo do time com fallback
- **ReactionPicker** - Seletor de emojis
- **SmartSearch** - Busca inteligente

### 2. Backend (API Routes + tRPC)

#### API Routes

| Rota | Metodo | Funcao |
|------|--------|--------|
| `/api/rumors` | GET | Lista rumores |
| `/api/rumors/relevance` | GET | Rumores ordenados por relevancia |
| `/api/vote` | POST | Registrar voto |
| `/api/reactions` | POST | Registrar reacao |
| `/api/cron/scrape-news` | GET | Executar scraping |
| `/api/admin/rumors` | POST | Criar rumor |

#### tRPC Routers

```typescript
// server/api/root.ts
export const appRouter = createTRPCRouter({
  rumors: rumorsRouter,
  influencers: influencersRouter,
  users: usersRouter,
  social: socialRouter,
  notifications: notificationsRouter,
})
```

### 3. Banco de Dados (Prisma + PostgreSQL)

#### Schema Principal

```
User ─────────────┐
  │               │
  │ predictions   │ badges
  ▼               ▼
Prediction ◄──── UserBadge ──► Badge
  │
  │ rumorId
  ▼
Rumor ◄──────────────────────────┐
  │                              │
  │ signals    newsItems         │ signals
  ▼            ▼                 │
Signal ◄── Influencer            │
           │                     │
           └─────────────────────┘

Rumor ◄──────────────────────────┐
  │                              │
  │ rumorSignals   newsItems     │
  ▼                ▼             │
RumorSignal     RumorNewsItem ───┤
                   │             │
                   ▼             │
                NewsItem ────────┘
```

### 4. Sistema de Scraping

#### Pipeline

```
1. Cron Trigger (Vercel ou Manual)
         │
         ▼
2. Buscar Rumores Ativos
         │
         ▼
3. Gerar Keywords dos Rumores
         │
         ▼
4. Executar Scrapers em Paralelo
   ┌─────┼─────┬─────┐
   │     │     │     │
   ▼     ▼     ▼     ▼
Twitter YouTube Globo UOL
   │     │     │     │
   └─────┼─────┴─────┘
         │
         ▼
5. Processar e Extrair Entidades
         │
         ▼
6. Match com Rumores Existentes
         │
         ▼
7. Salvar NewsItems e Relacoes
         │
         ▼
8. Calcular Sinais (velocity, spike)
         │
         ▼
9. Atualizar signalScore dos Rumores
```

#### Scrapers

| Scraper | Arquivo | Fonte | Autenticacao |
|---------|---------|-------|--------------|
| Twitter | `twitter.ts` | Twitter API v2 | Bearer Token |
| YouTube | `youtube.ts` | RSS + Scraping | Nenhuma |
| Globo | `rss.ts` | RSS Feed | Nenhuma |
| UOL | `rss.ts` | RSS Feed | Nenhuma |

### 5. Algoritmo de Relevancia

```typescript
// lib/relevance.ts

RelevanceScore = {
  myTeam:     0-40,  // Rumor do meu time
  engagement: 0-20,  // Usuario ja engajou
  buzz:       0-25,  // Popularidade do rumor
  recency:    0-10,  // Quao recente
  urgency:    0-5,   // Prestes a fechar
}

// Total maximo: 100 pontos
```

#### Calculo do Buzz

```
buzz = (predictions * 0.3) +
       (signals * 0.25) +
       (signalScore * 0.25) +
       (newsCount * 0.2)
```

## Fluxo de Dados

### 1. Usuario Vota em Rumor

```
Client                 Server                  Database
  │                      │                        │
  │ POST /api/vote       │                        │
  ├─────────────────────►│                        │
  │                      │ prisma.prediction      │
  │                      ├───────────────────────►│
  │                      │                        │
  │                      │◄───────────────────────┤
  │  { success: true }   │                        │
  │◄─────────────────────┤                        │
  │                      │                        │
```

### 2. Feed com Relevancia

```
Client                 Server                  Database
  │                      │                        │
  │ GET /api/rumors/     │                        │
  │     relevance?team=X │                        │
  ├─────────────────────►│                        │
  │                      │ prisma.rumor.findMany  │
  │                      ├───────────────────────►│
  │                      │                        │
  │                      │◄───────────────────────┤
  │                      │                        │
  │                      │ calculateRelevance()   │
  │                      │ para cada rumor        │
  │                      │                        │
  │                      │ sortByRelevance()      │
  │                      │                        │
  │  [rumores ordenados] │                        │
  │◄─────────────────────┤                        │
```

### 3. Scraping Automatico

```
Cron                   Server                  External APIs
  │                      │                        │
  │ GET /api/cron/       │                        │
  │     scrape-news      │                        │
  ├─────────────────────►│                        │
  │                      │                        │
  │                      │ scrapeTwitter()        │
  │                      ├───────────────────────►│ Twitter
  │                      │◄───────────────────────┤
  │                      │                        │
  │                      │ scrapeYouTube()        │
  │                      ├───────────────────────►│ YouTube
  │                      │◄───────────────────────┤
  │                      │                        │
  │                      │ scrapeGlobo/UOL()      │
  │                      ├───────────────────────►│ RSS
  │                      │◄───────────────────────┤
  │                      │                        │
  │                      │ processAndSave()       │
  │                      │                        │
  │  { stats: {...} }    │                        │
  │◄─────────────────────┤                        │
```

## Seguranca

### Variaveis de Ambiente

| Variavel | Onde Usar | Nunca Commitar |
|----------|-----------|----------------|
| `DATABASE_URL` | Prisma | Sim |
| `DIRECT_URL` | Prisma migrations | Sim |
| `TWITTER_BEARER_TOKEN` | Scraper | Sim |
| `CRON_SECRET` | Proteger cron | Sim |

### Arquivos Sensiveis

```gitignore
# .gitignore
.env
.env.local
.env*.local
```

## Performance

### Otimizacoes Implementadas

1. **Infinite Scroll** - Feed carrega em chunks
2. **React Query Cache** - Evita requests duplicados
3. **Prisma Connection Pool** - Reutiliza conexoes
4. **Parallel Scraping** - Scrapers rodam em paralelo

### Metricas de Scraping

Ultima execucao (tipico):
- Twitter: ~200 tweets
- YouTube: ~100 videos
- Globo: ~70 artigos
- UOL: ~10 artigos
- Tempo total: ~30 segundos

## Extensibilidade

### Adicionar Novo Scraper

1. Crie `src/lib/scrapers/novo.ts`
2. Implemente interface `ScrapedItem[]`
3. Adicione no `scrape-news/route.ts`

### Adicionar Nova Fonte de Dados

1. Adicione tipo em `types.ts`:
```typescript
export type NewsSource = 'twitter' | 'youtube' | 'globo' | 'uol' | 'nova'
```

2. Atualize o cron job

### Adicionar Novo Fator de Relevancia

1. Edite `lib/relevance.ts`
2. Adicione campo em `RelevanceFactors`
3. Atualize `calculateRelevanceScore()`
