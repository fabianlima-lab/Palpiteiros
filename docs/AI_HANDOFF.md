# AI Handoff - Continuacao do Projeto Palpiteiro

Este documento foi criado para que outro AI possa continuar o desenvolvimento deste projeto.

## Contexto do Projeto

O **Palpiteiro** eh uma plataforma de previsoes de transferencias do futebol brasileiro. Os usuarios votam se um rumor vai acontecer ou nao, e o sistema usa analise de sentimento de redes sociais para mostrar "sinais" de quao quente um rumor esta.

### Visao do Produto

1. Usuario escolhe seu time do coracao (ex: Flamengo)
2. Feed mostra rumores relevantes para o time dele primeiro
3. Sistema agrega noticias de Twitter, YouTube, Globo, UOL
4. Influenciadores (jornalistas) dao sinais sobre os rumores
5. Usuarios ganham pontos por acertar previsoes

## Tech Stack Resumido

```
Frontend:  Next.js 16 + React 19 + TypeScript
Backend:   Next.js API Routes + tRPC
Database:  PostgreSQL (Neon) + Prisma ORM
Styling:   Tailwind CSS 4
Deploy:    Vercel
APIs:      Twitter API v2
```

## Como Rodar Localmente

```bash
# 1. Instalar
npm install

# 2. Configurar .env (ver .env.example)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
TWITTER_BEARER_TOKEN="..."

# 3. Setup banco
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. Rodar
npm run dev
```

## Arquivos Mais Importantes

| Arquivo | O que faz |
|---------|-----------|
| `prisma/schema.prisma` | Schema do banco |
| `prisma/seed.ts` | Dados iniciais |
| `lib/relevance.ts` | Algoritmo de ordenacao do feed |
| `lib/teams.ts` | Lista de times brasileiros |
| `src/lib/scrapers/twitter.ts` | Scraper do Twitter |
| `app/api/cron/scrape-news/route.ts` | Cron job de scraping |
| `app/feed/FeedClient.tsx` | Componente principal do feed |
| `app/components/RumorCard.tsx` | Card de rumor |

## Estado Atual do Projeto

### Funcionando (Janeiro 2026)

- [x] Feed de rumores com infinite scroll
- [x] Sistema de votacao (vai acontecer / nao vai)
- [x] Sistema de reacoes (emojis)
- [x] Scraping de Twitter, YouTube, Globo, UOL
- [x] Twitter API v2 integrado e funcionando
- [x] Algoritmo de relevancia personalizado por time
- [x] Pagina de detalhes do rumor
- [x] Sistema de influenciadores com sinais
- [x] Cron job no Vercel (diario as 8h)

### Pendente / Proximo Passo

- [ ] Autenticacao de usuarios (NextAuth ou Clerk)
- [ ] Notificacoes push quando rumor atualiza
- [ ] Sistema de gamificacao (badges, levels)
- [ ] Historico de acertos do usuario
- [ ] Dashboard admin para moderar rumores

## Credenciais e Servicos

### Vercel
- Projeto: `palpiteiro-mvp`
- URL: https://palpiteiro-mvp.vercel.app
- Dashboard: https://vercel.com/fabian-limas-projects/palpiteiro-mvp

### Neon (PostgreSQL)
- Projeto no Neon Dashboard
- Connection string no Vercel env vars

### Twitter API
- Bearer Token configurado no Vercel
- Basic tier ($100/mes) - 50 requests/15min

### GitHub
- Repo: https://github.com/fabianlima-lab/Palpiteiros

## Comandos Uteis

```bash
# Rodar scraping manualmente
curl http://localhost:3000/api/cron/scrape-news

# Ver banco de dados visualmente
npx prisma studio

# Resetar e repopular banco
npx prisma db push --force-reset
npx prisma db seed

# Puxar env do Vercel
npx vercel env pull --environment=production

# Deploy
git push origin main  # Auto-deploy no Vercel
```

## Problemas Conhecidos

### 1. Cron do Vercel
O plano Hobby so permite cron diario. Para mais frequencia, use:
- cron-job.org
- UptimeRobot
- Ou chamar o endpoint manualmente

### 2. Rate Limit do Twitter
A API Basic tem limite de 50 requests/15min. O scraper ja tem delays entre batches.

### 3. Logos dos Times
Usando CDN do Transfermarkt. Se der erro 403, o componente TeamLogo tem fallback automatico.

## Estrutura de Pastas

```
palpiteiro-mvp/
├── app/                  # Next.js App Router
│   ├── api/              # API endpoints
│   ├── components/       # Componentes React
│   ├── feed/             # Pagina do feed
│   ├── rumor/[id]/       # Detalhes do rumor
│   └── time/[teamId]/    # Feed por time
├── lib/                  # Utils client-side
├── prisma/               # Schema e seed
├── server/api/           # tRPC routers
├── src/lib/scrapers/     # Sistema de scraping
└── docs/                 # Documentacao
```

## Dicas para o Proximo AI

1. **Sempre leia o arquivo antes de editar** - Use Read antes de Edit/Write

2. **Teste localmente antes de dar push** - Rode `npm run dev` e teste

3. **O banco pode mudar** - Use `npx vercel env pull` para pegar credentials atuais

4. **Prisma precisa gerar** - Apos mudar schema, rode `npx prisma generate`

5. **O usuario eh brasileiro** - Comentarios e UI podem ser em portugues

6. **Time do usuario eh Flamengo** - Priorize rumores do Flamengo nos testes

## Contato do Usuario

O usuario (Fabian) pode pedir ajuda com:
- Adicionar novas features
- Corrigir bugs
- Melhorar o algoritmo de relevancia
- Implementar autenticacao
- Criar dashboard admin

## Historico de Conversas Relevantes

- Setup inicial do projeto
- Migracao de SQLite para PostgreSQL (Neon)
- Implementacao do sistema de reacoes
- Integracao com Twitter API v2
- Correcao de rumores desatualizados (Estevao/Chelsea)
- Algoritmo de relevancia personalizado

---

**Ultima atualizacao:** Janeiro 2026
**Criado por:** Claude (Anthropic)
