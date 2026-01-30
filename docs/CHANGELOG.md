# Palpiteiro MVP - Changelog e Documentação

## Visão Geral
Palpiteiro é um app de palpites sobre rumores de transferências do futebol brasileiro. Os usuários podem votar se um rumor "vai acontecer" ou "não vai rolar", acompanhar sinais de influenciadores e competir no ranking.

---

## 30/01/2026 - Sessão de Desenvolvimento

### O que foi feito hoje:

---

### 1. Migração para PostgreSQL (Neon)

**Problema:** O SQLite não funciona no Vercel serverless porque o arquivo do banco não persiste entre as invocações das funções.

**Solução:** Migramos para PostgreSQL usando o Neon (https://neon.tech), que oferece um plano gratuito generoso.

**Arquivos modificados:**
- `prisma/schema.prisma` - Alterado provider de `sqlite` para `postgresql`
- `lib/prisma.ts` - Adicionado logging condicional
- `.env` - Configurado com connection strings do Neon
- `.env.example` - Criado para referência

**Configuração do banco:**
```
Projeto: palpiteiro
Host: ep-floral-star-ae32a71c.c-2.us-east-2.aws.neon.tech
Database: neondb
```

**Variáveis de ambiente necessárias:**
- `DATABASE_URL` - Connection string com pooling
- `DIRECT_URL` - Connection string direta (para migrations)

---

### 2. Sistema de Feed (Feed-First Design)

**Descrição:** Implementamos um feed estilo Twitter/X para exibir rumores de transferências.

**Arquivos criados/modificados:**
- `app/feed/page.tsx` - Server component que busca dados do banco
- `app/feed/FeedClient.tsx` - Client component com toda a UI interativa

**Features implementadas:**
- Cards de rumores com barra de sentimento (% VAI vs % NÃO VAI)
- Badges de influenciadores com seus sinais (favorável/desfavorável)
- Filtros: Quentes, Recentes, Fechando
- Sidebar esquerda com times (Meu Time + Outros Times bloqueados)
- Sidebar direita com Trending e Top Palpiteiros
- Modal de upsell para Premium (R$ 29,90/mês)
- Design responsivo (sidebars escondem em mobile)

---

### 3. Sistema de Votação Real

**Descrição:** API para registrar votos dos usuários nos rumores.

**Arquivo:** `app/api/vote/route.ts`

**Endpoint:** `POST /api/vote`

**Body:**
```json
{
  "rumorId": "string",
  "userId": "string",
  "prediction": boolean
}
```

**Response:**
```json
{
  "success": true,
  "newSentiment": 0.65,
  "totalPredictions": 150
}
```

**Lógica:**
- Cria prediction no banco
- Recalcula sentiment baseado em todas as predictions
- Retorna novo sentiment para atualizar UI em tempo real

---

### 4. Scroll Infinito + Skeleton Loaders

**Descrição:** Carregamento paginado de rumores conforme o usuário rola a página.

**Arquivo:** `app/api/rumors/route.ts`

**Endpoint:** `GET /api/rumors?limit=10&offset=0&order=quentes`

**Implementação:**
- Intersection Observer detecta quando usuário chega no fim da lista
- Skeleton loaders com animação shimmer durante carregamento
- Estado `hasMore` controla se há mais itens para carregar

---

### 5. Sistema de Agregação de Notícias (Preparação)

**Descrição:** Infraestrutura para scraping de notícias de fontes como Globo Esporte e UOL.

**Arquivos criados:**
- `src/lib/scrapers/types.ts` - Tipos TypeScript
- `src/lib/scrapers/rss.ts` - Parser de feeds RSS
- `src/lib/scrapers/processor.ts` - Processamento e matching com rumores
- `app/api/cron/scrape-news/route.ts` - Cron job (roda 1x por dia às 8h)
- `app/api/news/rumor/route.ts` - API para buscar notícias de um rumor
- `app/api/news/signals/route.ts` - API para sinais agregados

**Modelos no Prisma:**
```prisma
model NewsItem {
  id           String   @id @default(cuid())
  source       String   // "globo" | "uol"
  sourceId     String
  sourceUrl    String
  content      String
  publishedAt  DateTime
  // ... outros campos
}

model RumorNewsItem {
  rumorId    String
  newsItemId String
  relevance  Float
}

model RumorSignal {
  rumorId  String
  period   DateTime
  source   String
  mentions Int
  velocity Float
}
```

**Cron configurado em `vercel.json`:**
```json
{
  "crons": [{
    "path": "/api/cron/scrape-news",
    "schedule": "0 8 * * *"
  }]
}
```

---

### 6. Componentes de UI

**NewsItemCard** (`app/components/NewsItemCard.tsx`)
- Card para exibir notícias agregadas
- Suporta fontes: Globo, UOL, Twitter, YouTube
- Ícones e cores por fonte

**NewsSectionWrapper** (`app/rumor/[id]/NewsSectionWrapper.tsx`)
- Wrapper client-side para seção de notícias na página do rumor
- Busca notícias via API quando componente monta

---

## Arquitetura

```
palpiteiro-mvp/
├── app/
│   ├── feed/
│   │   ├── page.tsx          # Server component
│   │   └── FeedClient.tsx    # Client component
│   ├── api/
│   │   ├── vote/route.ts
│   │   ├── rumors/route.ts
│   │   ├── news/
│   │   │   ├── rumor/route.ts
│   │   │   └── signals/route.ts
│   │   └── cron/
│   │       └── scrape-news/route.ts
│   ├── components/
│   │   └── NewsItemCard.tsx
│   └── rumor/[id]/
│       └── NewsSectionWrapper.tsx
├── lib/
│   └── prisma.ts
├── src/lib/scrapers/
│   ├── types.ts
│   ├── rss.ts
│   └── processor.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── docs/
    └── CHANGELOG.md
```

---

## Dados de Seed

O arquivo `prisma/seed.ts` popula o banco com:
- 5 influenciadores (Venê, Raisa, Marcelo Bechler, Jorge Nicola, Flazoeiro)
- 3 rumores (Neymar→Flamengo, Gabigol→Cruzeiro, Arrascaeta→MLS)
- 8 sinais de influenciadores
- 4 posts sociais de exemplo
- 5 badges
- 1 usuário demo

**Para rodar o seed:**
```bash
npm run db:seed
```

---

## Deploy

**Plataforma:** Vercel (Hobby Plan)

**URL de Produção:** https://palpiteiro-mvp.vercel.app

**Variáveis de Ambiente no Vercel:**
- `DATABASE_URL` (Production + Preview)
- `DIRECT_URL` (Production + Preview)

**Comandos úteis:**
```bash
# Deploy para produção
npx vercel --prod

# Ver logs
npx vercel logs palpiteiro-mvp.vercel.app

# Listar variáveis de ambiente
npx vercel env ls

# Adicionar variável
npx vercel env add NOME_VAR production
```

---

## Próximos Passos (TODO)

### Fase 7 - Autenticação
- [ ] Implementar NextAuth.js ou Clerk
- [ ] Login social (Google, Twitter)
- [ ] Persistir sessão do usuário

### Fase 8 - Notificações
- [ ] Push notifications (web)
- [ ] Email digest semanal
- [ ] Notificar quando rumor fecha

### Fase 9 - Monetização
- [ ] Integrar Stripe para pagamentos
- [ ] Implementar lógica de Premium
- [ ] Desbloquear times adicionais

### Melhorias
- [ ] Adicionar mais rumores reais
- [ ] Implementar scraping de Twitter/YouTube
- [ ] Melhorar algoritmo de matching de notícias
- [ ] Testes automatizados
- [ ] Analytics (Mixpanel/Amplitude)

---

## Troubleshooting

### Erro "Application error" no Vercel
- Verificar se variáveis `DATABASE_URL` e `DIRECT_URL` estão configuradas
- Verificar se estão em Production E Preview

### Banco não conecta
- Verificar se IP não está bloqueado no Neon
- Testar connection string localmente

### Cron não executa
- Vercel Hobby só permite crons diários (1x por dia)
- Verificar logs em `vercel logs`

---

## Contato

Desenvolvido com Claude Code (Anthropic)
