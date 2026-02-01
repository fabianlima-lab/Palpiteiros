# Handoff para Próximo AI - 31 Janeiro 2026 (Atualizado)

## Estado Atual do Projeto

### O que é o Palpiteiros
Plataforma de rumores de transferências do futebol brasileiro. Usuários acompanham rumores, dão palpites (vai/não vai acontecer), e veem o que influenciadores estão dizendo.

### Stack Técnica
- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Backend**: Next.js API Routes, tRPC
- **Database**: SQLite via Prisma (local) / Vercel Postgres (produção)
- **Deploy**: Vercel (conectado ao GitHub)
- **Scraping**: Twitter API v2, YouTube RSS, Globo/UOL RSS

---

## Estado Atual (Fim da Sessão)

### ✅ Concluído Hoje

1. **Novo Logo Implementado e em Produção**
   - Logo roxo com balão de chat + "palpiteiros"
   - Arquivos: `/public/logo.svg`, `/app/icon.svg`, `/public/icon-only.svg`
   - Cor principal: #7C3AED (roxo)

2. **Vercel Reconectado ao GitHub**
   - Projeto: `palpiteiro-mvp`
   - Repo: `fabianlima-lab/Palpiteiros`
   - Deploy automático funcionando

3. **Banco de Produção Limpo**
   - 0 rumores falsos
   - Sistema pronto para receber novos rumores reais

4. **Algoritmo de Detecção Melhorado**
   - Corrigido bug: "contra" não mais matchava "contratou"
   - Adicionado `isRealTransfer()` para validação de contexto
   - Threshold de confiança aumentado para 0.4

### URLs Importantes
- **Produção**: https://palpiteiro-mvp.vercel.app/feed
- **GitHub**: https://github.com/fabianlima-lab/Palpiteiros
- **Vercel**: https://vercel.com/fabian-limas-projects/palpiteiro-mvp

---

## Arquivos Principais

### Scraping e Detecção
- `/src/lib/scrapers/rumor-detector.ts` - **CRÍTICO** - Lógica de detecção
- `/src/lib/scrapers/types.ts` - Mapeamentos de jogadores/times
- `/app/api/cron/scrape-news/route.ts` - Cron job de scraping

### UI
- `/app/feed/FeedClient.tsx` - Feed principal
- `/app/components/Header.tsx` - Header com logo
- `/public/logo.svg` - Logo atual

### Admin
- `/app/api/admin/cleanup/route.ts` - Limpeza de rumores falsos
- `/app/api/admin/rumors/route.ts` - CRUD de rumores

---

## Comandos Úteis

```bash
# Dev local
npm run dev

# Rodar scraper (produção)
curl -X POST https://palpiteiro-mvp.vercel.app/api/cron/scrape-news

# Limpar rumores falsos (produção)
curl -X POST https://palpiteiro-mvp.vercel.app/api/admin/cleanup

# Ver banco local
npx prisma studio
```

---

## Próximos Passos Sugeridos

1. **Popular com rumores reais** - Rodar o scraper em produção
2. **Expandir mapeamento de jogadores** - Adicionar mais ao `PLAYERS_ALIASES`
3. **Painel admin** - UI para revisar rumores antes de publicar
4. **Integração Transfermarkt** - Manter elencos atualizados automaticamente

---

## Observações Importantes

1. O banco de produção está **vazio** - precisa rodar scraper para popular
2. O scraper está configurado para rodar diariamente às 8h (cron)
3. Credenciais necessárias estão em `.env.local` (local) e Vercel (produção)
