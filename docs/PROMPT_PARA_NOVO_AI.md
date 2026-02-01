# Prompt para Continuar o Projeto Palpiteiros

Copie e cole este prompt para um novo AI:

---

## PROMPT

Ola! Preciso que voce continue o desenvolvimento do meu projeto **Palpiteiros**.

### IMPORTANTE - Leia primeiro

Antes de fazer qualquer coisa, leia o arquivo `docs/AI_HANDOFF_2026-01-31.md` que contem o estado atual do projeto e as mudancas mais recentes.

### O que eh o projeto

Palpiteiros eh uma plataforma de rumores de transferencias do futebol brasileiro. Usuarios votam se rumores vao acontecer, e o sistema usa sinais sociais (Twitter, YouTube, noticias) para mostrar quao "quente" cada rumor esta.

### Tech Stack

- **Frontend:** Next.js 14+ (App Router) + React + TypeScript
- **Backend:** Next.js API Routes + tRPC
- **Database:** SQLite via Prisma (produção pode usar Vercel Postgres)
- **Deploy:** Vercel
- **APIs:** Twitter API v2 (Bearer Token configurado)

### Como comecar

```bash
# Clonar
git clone https://github.com/fabianlima-lab/Palpiteiros.git
cd Palpiteiros

# Instalar
npm install

# Configurar .env com:
# DATABASE_URL="file:./dev.db"
# TWITTER_BEARER_TOKEN="..."

# Setup Prisma
npx prisma generate
npx prisma db push

# Rodar
npm run dev
```

### Documentacao disponivel

Leia estes arquivos para entender o projeto:

1. `docs/AI_HANDOFF_2026-01-31.md` - **MAIS IMPORTANTE** - Estado atual e mudanças recentes
2. `docs/ARCHITECTURE.md` - Arquitetura do sistema
3. `docs/DEVELOPMENT.md` - Guia de desenvolvimento

### Arquivos mais importantes

| Arquivo | Funcao |
|---------|--------|
| `src/lib/scrapers/rumor-detector.ts` | **Detecta rumores de notícias** |
| `src/lib/scrapers/types.ts` | PLAYERS_ALIASES, TEAMS_ALIASES |
| `src/lib/scrapers/twitter.ts` | Scraper Twitter |
| `app/api/cron/scrape-news/route.ts` | Cron de scraping |
| `app/feed/FeedClient.tsx` | Feed principal |
| `prisma/schema.prisma` | Schema do banco |

### O que funciona

- [x] Feed de rumores
- [x] Votacao (vai/nao vai acontecer)
- [x] Reacoes com emojis
- [x] Scraping de Twitter, YouTube, Globo/Trivela, ESPN
- [x] Deteccao automatica de rumores (com validacao rigorosa)
- [x] Novo logo Palpiteiros (balao de chat)

### Backlog

- [ ] Autenticacao de usuarios
- [ ] Painel admin para revisar rumores
- [ ] Expandir mapeamento de jogadores (PLAYERS_ALIASES)
- [ ] Integracao com Transfermarkt API
- [ ] Notificacoes push

### Meu time eh Flamengo

Quando testar, priorize rumores do Flamengo.

### Links uteis

- **Producao:** https://palpiteiro-mvp.vercel.app
- **GitHub:** https://github.com/fabianlima-lab/Palpiteiros

### Comandos uteis

```bash
# Rodar scraping
curl http://localhost:3000/api/cron/scrape-news

# Ver banco visualmente
npx prisma studio

# Resetar banco
npx prisma db push --force-reset
```

---

Agora, o que voce gostaria que eu fizesse?

---

## FIM DO PROMPT
