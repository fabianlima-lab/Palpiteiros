# PROCESS.md - Documento Central do Projeto Palpiteiros

> **IMPORTANTE:** Este eh o documento principal de referencia. Todo AI deve ler ANTES de fazer qualquer codigo e ATUALIZAR ao final de cada sessao.

---

## Indice
1. [Visao Geral](#visao-geral)
2. [Tech Stack](#tech-stack)
3. [Como Acessar](#como-acessar)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Arquivos Criticos](#arquivos-criticos)
6. [Como Rodar Localmente](#como-rodar-localmente)
7. [Comandos Uteis](#comandos-uteis)
8. [Estado Atual](#estado-atual)
9. [Backlog de Features](#backlog-de-features)
10. [Decisoes de Produto](#decisoes-de-produto)
11. [Historico de Mudancas](#historico-de-mudancas)
12. [Regras para AIs](#regras-para-ais)

---

## Visao Geral

**Palpiteiros** eh uma plataforma de analise de rumores de transferencias do futebol brasileiro.

### O que faz:
- Usuario escolhe seu time do coracao (ex: Flamengo)
- Feed mostra rumores relevantes para o time dele
- Sistema agrega noticias de Twitter, YouTube, Globo, UOL, ESPN
- Influenciadores (jornalistas) dao sinais sobre os rumores
- Usuarios reagem aos rumores (emojis) e votam se vai acontecer ou nao
- Usuarios ganham pontos por acertar previsoes

### Modelo de negocio:
- Freemium: usuarios gratis veem apenas rumores do seu time
- Premium (R$ 14,90/mes): veem rumores de todos os times

---

## Tech Stack

| Camada | Tecnologia | Versao |
|--------|------------|--------|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **Frontend** | React + TypeScript | 19.2.3 |
| **Styling** | Tailwind CSS | 4.x |
| **Backend** | Next.js API Routes + tRPC | 11.9.0 |
| **Database** | PostgreSQL (Neon) | - |
| **ORM** | Prisma | 5.22.0 |
| **Deploy** | Vercel | - |
| **Scraping** | Twitter API v2 + RSS feeds | - |
| **State** | React Query (TanStack) | 5.90.20 |

---

## Como Acessar

### URLs
| Ambiente | URL |
|----------|-----|
| **Producao** | https://palpiteiro-mvp.vercel.app/feed |
| **GitHub** | https://github.com/fabianlima-lab/Palpiteiros |
| **Vercel Dashboard** | https://vercel.com/fabian-limas-projects/palpiteiro-mvp |
| **Neon (DB)** | Dashboard do Neon (credentials no Vercel) |

### Credenciais
- **Database:** Connection strings estao nas env vars do Vercel
- **Twitter API:** Bearer token no Vercel (Basic tier - $100/mes)
- **Para puxar env vars:** `npx vercel env pull --environment=production`

---

## Estrutura do Projeto

```
palpiteiro-mvp/
├── app/                      # Next.js App Router
│   ├── api/                  # API endpoints
│   │   ├── cron/             # Cron jobs (scraping)
│   │   ├── admin/            # Endpoints admin
│   │   └── trpc/             # tRPC handler
│   ├── components/           # Componentes React reutilizaveis
│   │   ├── RumorCard.tsx     # Card de rumor principal
│   │   ├── Header.tsx        # Header com logo
│   │   └── ...
│   ├── feed/                 # Pagina principal do feed
│   │   ├── page.tsx          # Server component
│   │   └── FeedClient.tsx    # Client component
│   ├── rumor/[id]/           # Detalhes do rumor
│   └── time/[teamId]/        # Feed filtrado por time
├── lib/                      # Utils client-side
│   ├── relevance.ts          # Algoritmo de ordenacao
│   ├── signals.ts            # **NOVO** Sistema de sinais visuais e badges
│   └── teams.ts              # Lista de times brasileiros
├── prisma/
│   ├── schema.prisma         # Schema do banco
│   └── seed.ts               # Dados iniciais
├── server/api/               # tRPC routers
├── src/lib/scrapers/         # Sistema de scraping
│   ├── rumor-detector.ts     # Detecta rumores de noticias
│   ├── twitter.ts            # Scraper Twitter
│   └── types.ts              # Mapeamentos jogadores/times
├── docs/                     # Documentacao
│   └── PROCESS.md            # ESTE ARQUIVO
└── public/                   # Assets estaticos
    └── logo.svg              # Logo atual
```

---

## Arquivos Criticos

> **Leia estes arquivos antes de qualquer mudanca significativa:**

| Arquivo | Funcao | Quando mexer |
|---------|--------|--------------|
| `app/components/RumorCard.tsx` | Card principal de rumor | UI de rumores |
| `app/feed/FeedClient.tsx` | Feed principal | Logica do feed |
| `lib/signals.ts` | **Sistema de sinais visuais e badges** | Mudar exibicao de prob/sentimento |
| `lib/relevance.ts` | Algoritmo de ordenacao | Mudar ordem dos rumores |
| `src/lib/scrapers/rumor-detector.ts` | Detecta rumores | Scraping |
| `prisma/schema.prisma` | Schema do banco | Mudancas no DB |
| `app/api/cron/scrape-news/route.ts` | Cron de scraping | Automacao |

---

## Como Rodar Localmente

```bash
# 1. Clonar
git clone https://github.com/fabianlima-lab/Palpiteiros.git
cd Palpiteiros

# 2. Instalar dependencias
npm install

# 3. Configurar .env.local
# Copiar de .env.example ou puxar do Vercel:
npx vercel env pull --environment=production

# 4. Variaveis necessarias:
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
TWITTER_BEARER_TOKEN="..."

# 5. Setup Prisma
npx prisma generate
npx prisma db push

# 6. (Opcional) Popular banco com dados de teste
npx prisma db seed

# 7. Rodar
npm run dev
# Abrir http://localhost:3000/feed
```

---

## Comandos Uteis

```bash
# Desenvolvimento
npm run dev                    # Rodar local
npm run build                  # Build de producao
npm run lint                   # Checar erros

# Banco de dados
npx prisma studio              # UI visual do banco
npx prisma generate            # Gerar client apos mudar schema
npx prisma db push             # Aplicar mudancas no banco
npx prisma db push --force-reset  # Resetar banco completamente
npx prisma db seed             # Popular com dados iniciais

# Scraping (local)
curl http://localhost:3000/api/cron/scrape-news

# Scraping (producao)
curl -X POST https://palpiteiro-mvp.vercel.app/api/cron/scrape-news

# Limpar rumores falsos
curl -X POST https://palpiteiro-mvp.vercel.app/api/admin/cleanup

# Vercel
npx vercel env pull --environment=production  # Puxar env vars
git push origin main                           # Deploy automatico
```

---

## Estado Atual

### Funcionando (Janeiro 2026)
- [x] Feed de rumores com infinite scroll
- [x] Sistema de votacao (vai acontecer / nao vai)
- [x] Sistema de reacoes (emojis com feedback visual)
- [x] Scraping de Twitter, YouTube, Globo, UOL, ESPN
- [x] Twitter API v2 integrado
- [x] Algoritmo de relevancia personalizado por time
- [x] Pagina de detalhes do rumor
- [x] Sistema de influenciadores com sinais
- [x] Cron job no Vercel (diario as 8h)
- [x] Logo novo (balao de chat roxo)
- [x] RumorCard redesenhado (PRD v3)
- [x] **NOVO:** Sinais visuais ao inves de percentuais (probabilidade/sentimento)
- [x] **NOVO:** Badges de credibilidade para fontes (💎🥇🥈🥉)
- [x] **NOVO:** Feedback de reacao mostra apenas seta (sem %)

### Problemas Conhecidos
1. **Cron do Vercel:** Plano Hobby so permite cron diario
2. **Rate Limit Twitter:** 50 requests/15min (Basic tier)
3. **Logos dos Times:** CDN do Transfermarkt pode dar 403

---

## Backlog de Features

### Alta Prioridade
- [x] ~~**Remover percentuais de probabilidade** - Mostrar apenas sinais visuais~~ **FEITO 2026-01-31**
- [x] ~~**Ajustar secao de influenciadores** - Sem percentuais, com badges~~ **FEITO 2026-01-31**
- [ ] **Adicionar fontes tradicionais** - Globo, portais, veiculos especializados
- [ ] **Permitir clique no influenciador** - Ver conteudo original que impactou o algoritmo

### Media Prioridade
- [ ] Autenticacao de usuarios (NextAuth ou Clerk)
- [ ] Notificacoes push quando rumor atualiza
- [ ] Dashboard admin para moderar rumores

### Baixa Prioridade
- [ ] Sistema de gamificacao (badges, levels)
- [ ] Historico de acertos do usuario
- [ ] Integracao Transfermarkt API

---

## Decisoes de Produto

### Exibicao de Probabilidade (DECISAO IMPORTANTE)
**NAO mostrar numeros ou percentuais de probabilidade ao usuario.**

O algoritmo interno calcula probabilidades, mas o usuario ve apenas:
- Sinais visuais qualitativos (emojis + setas)
- Escala:
  - 🔥 + ↑ = Impacto positivo forte
  - 😍 + ↗ = Impacto positivo moderado
  - 😊 + ↗ = Impacto positivo leve
  - 😐 + → = Neutro
  - 😕 + ↘ = Impacto negativo leve
  - 😟 + ↘ = Impacto negativo moderado
  - ❄️ + ↓ = Impacto negativo forte

**Motivo:** Algoritmo proprietario. Usuario nao precisa ver os calculos.

### Secao de Influenciadores/Fontes
- Mostrar influenciadores SEM percentuais de influencia
- **Usar badges de credibilidade baseados em distribuicao normal:**
  - 💎 Diamante: Top 5% (credibilidade >= 95)
  - 🥇 Ouro: Top 20% (credibilidade >= 80)
  - 🥈 Prata: Top 50% (credibilidade >= 60)
  - 🥉 Bronze: Top 80% (credibilidade >= 40)
  - Sem badge: Bottom 20% (credibilidade < 40)
- Permitir clique para ver o conteudo original
- Deixar claro que eh fonte qualitativa, nao peso matematico

### Fontes de Dados
O sistema deve agregar:
1. **Influenciadores:** Vene Casagrande, Fabrizio Romano, Jorge Nicola, etc.
2. **Portais:** Globo.com, G1, UOL, Terra, Folha, Estadao
3. **Especializados:** ge.globo, ESPN Brasil, Lance!

**Logica de convergencia (interna):**
- Se Globo + 3 fontes relevantes = positivo → probabilidade sobe
- Se fontes desmentem → probabilidade desce
- Usuario ve apenas sinais visuais e fontes clicaveis

---

## Historico de Mudancas

### 2026-01-31 (Sessao Atual - Sinais Visuais)
- [x] Criado `lib/signals.ts` - Sistema centralizado de sinais visuais
- [x] Implementado `getSignalFromPercent()` - Converte % em emoji+seta
- [x] Implementado `getCredibilityBadge()` - Sistema de badges (💎🥇🥈🥉)
- [x] Atualizado `RumorCard.tsx` - Probabilidade e sentimento agora mostram sinais visuais
- [x] Atualizado `RumorCard.tsx` - Fontes agora mostram badges ao inves de %
- [x] Atualizado `RumorCard.tsx` - Feedback de reacao mostra apenas seta (sem %)
- [x] Atualizado `FeedClient.tsx` - Sidebar "Trending" usa sinais visuais
- [x] Atualizado `FeedClient.tsx` - Sidebar "Top Fontes" usa badges
- [x] Criado tag `v1.0.0-pre-signals` para rollback seguro
- [x] Criado documento PROCESS.md

### 2026-01-31 (Sessao Anterior - PRD v3)
- Logo novo implementado (balao de chat roxo)
- Vercel reconectado ao GitHub
- Banco de producao limpo
- Algoritmo de deteccao melhorado
- RumorCard redesenhado (PRD v3)
- Feedback visual nas reacoes implementado

### 2026-01-30
- Migracao de SQLite para PostgreSQL (Neon)
- Implementacao do sistema de reacoes
- Integracao com Twitter API v2
- Algoritmo de relevancia personalizado

---

## Regras para AIs

### ANTES de comecar:
1. **SEMPRE leia este documento (PROCESS.md)**
2. Leia os arquivos relevantes antes de editar
3. Entenda o contexto da mudanca solicitada

### DURANTE o desenvolvimento:
1. Teste localmente com `npm run dev`
2. Faca commits pequenos e descritivos
3. Use portugues na UI (projeto brasileiro)
4. Priorize rumores do Flamengo nos testes (time do usuario)

### APOS terminar:
1. **ATUALIZE este documento (PROCESS.md)**
   - Adicione entrada no Historico de Mudancas
   - Atualize Estado Atual se necessario
   - Marque items do Backlog como concluidos
2. Faca commit e push
3. Verifique deploy no Vercel

### Comandos de validacao:
```bash
npm run build    # Deve passar sem erros
npm run lint     # Deve passar sem erros
```

---

## Contato

**Usuario:** Fabian Lima
**Time do coracao:** Flamengo
**GitHub:** fabianlima-lab

---

*Ultima atualizacao: 2026-01-31*
*Atualizado por: Claude (Opus 4.5)*
