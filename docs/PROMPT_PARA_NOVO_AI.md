# Prompt para Continuar o Projeto Palpiteiro

Copie e cole este prompt para um novo AI:

---

## PROMPT

Ola! Preciso que voce continue o desenvolvimento do meu projeto **Palpiteiro**.

### O que eh o projeto

Palpiteiro eh uma plataforma de previsoes de transferencias do futebol brasileiro. Usuarios votam se rumores vao acontecer, e o sistema usa sinais sociais (Twitter, YouTube, noticias) para mostrar quao "quente" cada rumor esta.

### Tech Stack

- **Frontend:** Next.js 16.1.6 + React 19 + TypeScript + Tailwind CSS 4
- **Backend:** Next.js API Routes + tRPC 11.9.0
- **Database:** PostgreSQL no Neon + Prisma 5.22.0
- **Deploy:** Vercel
- **APIs:** Twitter API v2 (Bearer Token configurado)

### Como comecar

```bash
# Clonar
git clone https://github.com/fabianlima-lab/Palpiteiros.git
cd palpiteiro-mvp

# Instalar
npm install

# Configurar banco (puxar env do Vercel)
npx vercel env pull --environment=production

# Ou criar .env manualmente com:
# DATABASE_URL="postgresql://..."
# DIRECT_URL="postgresql://..."
# TWITTER_BEARER_TOKEN="..."

# Setup Prisma
npx prisma generate
npx prisma db push
npx prisma db seed

# Rodar
npm run dev
```

### Documentacao disponivel

Leia estes arquivos para entender o projeto:

1. `README.md` - Visao geral e setup
2. `docs/DEVELOPMENT.md` - Guia de desenvolvimento
3. `docs/ARCHITECTURE.md` - Arquitetura do sistema
4. `docs/AI_HANDOFF.md` - Contexto para AI continuar

### Arquivos mais importantes

| Arquivo | Funcao |
|---------|--------|
| `prisma/schema.prisma` | Schema do banco |
| `prisma/seed.ts` | Dados iniciais |
| `lib/relevance.ts` | Algoritmo de ordenacao |
| `lib/teams.ts` | Times brasileiros |
| `src/lib/scrapers/twitter.ts` | Scraper Twitter |
| `app/api/cron/scrape-news/route.ts` | Cron de scraping |
| `app/feed/FeedClient.tsx` | Feed principal |
| `app/components/RumorCard.tsx` | Card de rumor |

### O que ja funciona

- [x] Feed de rumores com infinite scroll
- [x] Votacao (vai/nao vai acontecer)
- [x] Reacoes com emojis
- [x] Scraping de Twitter, YouTube, Globo, UOL
- [x] Algoritmo de relevancia por time do usuario
- [x] Sistema de influenciadores

### O que precisa ser feito (backlog)

- [ ] Autenticacao de usuarios (NextAuth ou Clerk)
- [ ] Notificacoes push
- [ ] Sistema de gamificacao (badges, XP)
- [ ] Dashboard admin
- [ ] Historico de acertos

### Meu time eh Flamengo

Quando testar, priorize rumores do Flamengo. O algoritmo de relevancia da 40 pontos extras para rumores do time do usuario.

### Links uteis

- **Producao:** https://palpiteiro-mvp.vercel.app
- **GitHub:** https://github.com/fabianlima-lab/Palpiteiros
- **Vercel:** https://vercel.com/fabian-limas-projects/palpiteiro-mvp

### Comandos uteis

```bash
# Rodar scraping
curl http://localhost:3000/api/cron/scrape-news

# Ver banco visualmente
npx prisma studio

# Resetar banco
npx prisma db push --force-reset && npx prisma db seed
```

---

Agora, o que voce gostaria que eu fizesse? Posso:
1. Implementar uma feature especifica
2. Corrigir um bug
3. Melhorar algo existente
4. Explicar como algo funciona

---

## FIM DO PROMPT

Salve este prompt e use quando iniciar uma nova conversa com outro AI!
