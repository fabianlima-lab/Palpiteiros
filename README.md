# Palpiteiro MVP

Plataforma de previsoes e analise de sentimento para rumores de transferencias do futebol brasileiro.

## Tech Stack

| Tecnologia | Versao | Uso |
|------------|--------|-----|
| **Next.js** | 16.1.6 | Framework React com App Router |
| **React** | 19.2.3 | UI Library |
| **TypeScript** | 5.x | Tipagem |
| **Prisma** | 5.22.0 | ORM para banco de dados |
| **PostgreSQL** | - | Banco de dados (Neon) |
| **tRPC** | 11.9.0 | API type-safe |
| **TanStack Query** | 5.90.20 | Data fetching e cache |
| **Tailwind CSS** | 4.x | Estilizacao |
| **Vercel** | - | Deploy e hosting |

## Estrutura do Projeto

```
palpiteiro-mvp/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── cron/            # Cron jobs (scraping)
│   │   ├── admin/           # Endpoints administrativos
│   │   ├── reactions/       # Sistema de reacoes
│   │   ├── rumors/          # API de rumores
│   │   └── vote/            # Sistema de votacao
│   ├── components/          # Componentes React
│   ├── feed/                # Pagina do feed principal
│   ├── rumor/[id]/          # Detalhes do rumor
│   ├── time/[teamId]/       # Pagina por time
│   └── ...                  # Outras paginas
├── lib/                     # Utilitarios client-side
│   ├── relevance.ts         # Algoritmo de relevancia
│   └── teams.ts             # Dados dos times
├── prisma/
│   ├── schema.prisma        # Schema do banco
│   └── seed.ts              # Dados iniciais
├── server/
│   └── api/                 # tRPC routers
├── src/lib/scrapers/        # Sistema de scraping
│   ├── twitter.ts           # Twitter API v2
│   ├── youtube.ts           # YouTube scraper
│   ├── rss.ts               # RSS (Globo, UOL)
│   ├── processor.ts         # Processamento de dados
│   ├── rumor-detector.ts    # Deteccao automatica de rumores
│   └── types.ts             # Tipos e constantes
└── docs/                    # Documentacao adicional
```

## Configuracao do Ambiente

### 1. Variaveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
# Neon PostgreSQL Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require"

# Twitter/X API (para sinais sociais reais)
TWITTER_BEARER_TOKEN="your_twitter_bearer_token_here"
```

### 2. Instalacao

```bash
# Instalar dependencias
npm install

# Gerar Prisma Client
npx prisma generate

# Rodar migrations (se necessario)
npx prisma db push

# Popular banco com dados iniciais
npx prisma db seed

# Iniciar servidor de desenvolvimento
npm run dev
```

### 3. Comandos Disponiveis

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run start` | Servidor de producao |
| `npx prisma db seed` | Popular banco com seed |
| `npx prisma studio` | Interface visual do banco |
| `npx prisma db push` | Sincronizar schema com banco |

## APIs e Endpoints

### API REST

| Endpoint | Metodo | Descricao |
|----------|--------|-----------|
| `/api/rumors` | GET | Lista rumores com filtros |
| `/api/rumors/relevance` | GET | Rumores ordenados por relevancia |
| `/api/vote` | POST | Registrar voto em rumor |
| `/api/reactions` | POST | Registrar reacao (emoji) |
| `/api/cron/scrape-news` | GET | Executar scraping manual |
| `/api/admin/rumors` | POST | Criar novo rumor |
| `/api/admin/cleanup` | POST | Limpar dados antigos |

### tRPC Routers

- `rumors` - CRUD de rumores
- `influencers` - Influenciadores e seus sinais
- `users` - Usuarios e perfis
- `social` - Posts sociais
- `notifications` - Sistema de notificacoes

## Sistema de Scraping

O sistema coleta dados de multiplas fontes:

### Fontes de Dados

1. **Twitter/X** (`src/lib/scrapers/twitter.ts`)
   - API v2 oficial
   - Busca tweets de jornalistas confiaveis
   - Keywords de transferencias

2. **YouTube** (`src/lib/scrapers/youtube.ts`)
   - RSS de canais esportivos
   - Scraping de titulos e descricoes

3. **RSS Feeds** (`src/lib/scrapers/rss.ts`)
   - Globo Esporte
   - UOL Esporte

### Execucao do Scraping

```bash
# Via curl (local)
curl http://localhost:3000/api/cron/scrape-news

# Via Vercel (producao)
curl https://seu-site.vercel.app/api/cron/scrape-news
```

### Cron Job (Vercel)

Configurado em `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/scrape-news",
    "schedule": "0 8 * * *"
  }]
}
```

> **Nota:** Vercel Hobby so permite cron diario. Para mais frequencia, use servicos externos como cron-job.org.

## Algoritmo de Relevancia

O feed usa um sistema de pontuacao (`lib/relevance.ts`):

| Fator | Pontos | Descricao |
|-------|--------|-----------|
| Meu Time | 40 | Rumor envolve o time do usuario |
| Engajamento | 20 | Usuario ja votou/reagiu |
| Buzz | 25 | Predictions + signals + noticias |
| Recencia | 10 | Rumores mais novos |
| Urgencia | 5 | Prestes a fechar |

## Deploy

### Vercel (Recomendado)

1. Conecte o repositorio GitHub ao Vercel
2. Configure as variaveis de ambiente:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `TWITTER_BEARER_TOKEN`
3. Deploy automatico a cada push

### Banco de Dados (Neon)

1. Crie conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie as connection strings para as variaveis de ambiente

## Servicos Externos

### Twitter API

1. Acesse [developer.twitter.com](https://developer.twitter.com)
2. Crie um projeto e app
3. Gere o Bearer Token
4. Configure em `TWITTER_BEARER_TOKEN`

### Logos dos Times

Usando CDN do Transfermarkt:
```
https://tmssl.akamaized.net/images/wappen/head/{teamId}.png
```

## Status do Projeto

- [x] Sistema de rumores e votacao
- [x] Sistema de reacoes (emojis)
- [x] Scraping de multiplas fontes
- [x] Twitter API integrado
- [x] Algoritmo de relevancia
- [x] Feed personalizado por time
- [x] Sistema de influenciadores
- [ ] Autenticacao de usuarios
- [ ] Notificacoes push
- [ ] Gamificacao completa

## Links Uteis

- **Producao:** https://palpiteiro-mvp.vercel.app
- **GitHub:** https://github.com/fabianlima-lab/Palpiteiros
- **Vercel Dashboard:** https://vercel.com/fabian-limas-projects/palpiteiro-mvp

## Licenca

Projeto privado - Todos os direitos reservados.
