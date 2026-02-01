# Handoff para Próximo AI - 31 Janeiro 2026

## Estado Atual do Projeto

### O que é o Palpiteiros
Plataforma de rumores de transferências do futebol brasileiro. Usuários acompanham rumores, dão palpites (vai/não vai acontecer), e veem o que influenciadores estão dizendo.

### Stack Técnica
- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Backend**: Next.js API Routes, tRPC
- **Database**: SQLite via Prisma (produção usa Vercel Postgres ou similar)
- **Deploy**: Vercel
- **Scraping**: Twitter API v2, YouTube RSS, Globo/UOL RSS

---

## Mudanças Feitas Hoje (31/01/2026)

### 1. Novo Logo Implementado
- **Arquivo**: `/public/logo.svg` - Logo completo (balão de chat + "palpiteiros")
- **Arquivo**: `/app/icon.svg` - Favicon (só o balão de chat)
- **Arquivo**: `/public/icon-only.svg` - Ícone para PWA
- **Design**: Balão de chat roxo (#7C3AED) com 3 pontos (branco, laranja #F59E0B, branco)

### 2. Renomeado de "Palpiteiro" para "Palpiteiros"
- Atualizado em `app/layout.tsx` (metadata)
- Atualizado em `public/manifest.json`

### 3. IMPORTANTE: Corrigido Bug de Rumores Falsos
O sistema estava criando rumores falsos como:
- "Paquetá → Corinthians" (falso - ele foi pro Flamengo, "Corinthians" aparecia pq jogava CONTRA)
- "Gabigol → Flamengo" (falso - baseado em menções genéricas)

**Correções em `/src/lib/scrapers/rumor-detector.ts`**:

```typescript
// ANTES: "contra" matchava em "contratou"
// AGORA: Usa word boundaries
const NEGATIVE_PATTERNS = [
  /\bcontra\b/i,  // Só matcha "contra" isolado, não "contratou"
  /\benfrenta[mr]?\b/i,
  /\bfinal\b/i,
  /\bsupercopa\b/i,
  // ... etc
]

// NOVA FUNÇÃO: Valida se é transferência real
function isRealTransfer(text, playerName, toTeam): boolean {
  // Verifica padrões que NEGAM (joga contra, enfrenta, etc)
  // Verifica padrões que CONFIRMAM (acertado com, contratou, etc)
  // Só retorna true se tiver padrão explícito de transferência
}
```

### 4. Banco de Dados Limpo
- Deletados todos os rumores falsos do seed
- Apenas 1 rumor real existe agora: **Hinestroza → Vasco**
- 448 NewsItems reais de scraping (Twitter, YouTube, RSS)

---

## Arquivos Principais

### Scraping e Detecção de Rumores
- `/src/lib/scrapers/rumor-detector.ts` - Detecta rumores de notícias
- `/src/lib/scrapers/types.ts` - PLAYERS_ALIASES, TEAMS_ALIASES, PLAYER_TEAM
- `/src/lib/scrapers/twitter.ts` - Scraper do Twitter
- `/src/lib/scrapers/youtube.ts` - Scraper do YouTube
- `/src/lib/scrapers/rss.ts` - Scraper de RSS (Gazeta, Trivela, ESPN)
- `/app/api/cron/scrape-news/route.ts` - Endpoint do cron job

### Feed e UI
- `/app/feed/FeedClient.tsx` - Componente principal do feed
- `/app/feed/page.tsx` - Página do feed (server component)
- `/app/components/Header.tsx` - Header com logo
- `/app/api/rumors/route.ts` - API de rumores

### Mapeamentos Importantes
Em `/src/lib/scrapers/types.ts`:
- `PLAYERS_ALIASES` - Mapa de jogadores e seus apelidos
- `TEAMS_ALIASES` - Mapa de times e seus apelidos
- `PLAYER_TEAM` - Mapa jogador → time atual

Em `/src/lib/scrapers/rumor-detector.ts`:
- `PLAYER_CURRENT_TEAMS` - Mesmo que PLAYER_TEAM (duplicado, considerar unificar)

---

## Próximos Passos Sugeridos

1. **Expandir mapeamento de jogadores** - Adicionar mais jogadores ao PLAYERS_ALIASES
2. **Melhorar detecção de rumores** - O algoritmo atual é conservador, pode perder alguns válidos
3. **Painel admin** - Criar UI para revisar rumores antes de publicar
4. **Integração com Transfermarkt API** - Para manter elencos atualizados automaticamente

---

## Comandos Úteis

```bash
# Rodar scraper manualmente
curl http://localhost:3000/api/cron/scrape-news

# Ver rumores no banco
npx prisma studio

# Limpar banco e rodar seed
npx prisma db push --force-reset && npx prisma db seed
```

---

## Credenciais e Variáveis de Ambiente
Verificar `.env` ou `.env.local` para:
- `TWITTER_BEARER_TOKEN` - Token do Twitter API v2
- `DATABASE_URL` - URL do banco de dados
- `CRON_SECRET` - Secret para autenticar cron jobs

---

## Observações

1. O deploy foi feito no Vercel - as mudanças devem aparecer em alguns minutos
2. O banco de produção pode ter dados diferentes do local
3. O logo usa a fonte "Nunito" - verificar se está carregando corretamente
