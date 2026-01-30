# PRD: Redesign Palpiteiro — Home Feed-First

## Visão Geral

Transformar o Palpiteiro de uma landing page tradicional para um produto feed-first inspirado em Twitter e Kalshi. O usuário deve entrar e imediatamente ver conteúdo real (rumores), não explicações sobre como o produto funciona.

**Referências visuais:**
- Twitter/X (layout 3 colunas, feed infinito, densidade de informação)
- Kalshi (cards de mercado com porcentagens, dark mode, estética de trading)
- Polymarket (simplicidade dos cards de apostas)

---

## 1. Design System

### 1.1 Cores

```
// Backgrounds
--bg-primary: #09090B        // Fundo principal (quase preto)
--bg-secondary: #18181B      // Cards, boxes, elementos elevados
--bg-tertiary: #0F0F12       // Hover states
--bg-elevated: #1F1F23       // Items ativos na sidebar

// Borders
--border-primary: #27272A    // Bordas principais
--border-subtle: #27272A     // Divisores

// Text
--text-primary: #FAFAFA      // Texto principal (branco)
--text-secondary: #A1A1AA    // Texto secundário
--text-muted: #71717A        // Texto terciário, labels

// Brand / Accent
--accent-green: #10B981      // Cor principal (verde esmeralda)
--accent-green-light: #34D399
--accent-green-dark: #059669
--accent-green-bg: #10B98120 // 20% opacidade para backgrounds

// Semantic
--color-vai: #10B981         // Verde para "VAI"
--color-vai-bg: #10B98120
--color-nao: #EF4444         // Vermelho para "NÃO VAI"
--color-nao-bg: #EF444420
--color-quente: #F97316      // Laranja para badge "QUENTE"
--color-quente-bg: #F9731620

// Times (usar para badges e acentos)
--time-flamengo: #E11D48
--time-corinthians: #18181B
--time-palmeiras: #16A34A
--time-santos: #E5E7EB
--time-saopaulo: #DC2626
--time-botafogo: #FBBF24
--time-fluminense: #7C3AED
--time-vasco: #1F2937
--time-atletico: #27272A
--time-cruzeiro: #2563EB
--time-inter: #B91C1C
--time-gremio: #0EA5E9
```

### 1.2 Tipografia

```
// Font Families
--font-primary: 'Space Grotesk', sans-serif    // Títulos e UI
--font-mono: 'JetBrains Mono', monospace       // Números, porcentagens, stats

// Font Sizes
--text-xs: 11px      // Labels pequenos, badges
--text-sm: 12px      // Meta info, timestamps
--text-base: 13px    // Corpo de texto, stats
--text-md: 14px      // UI elements, nomes
--text-lg: 15px      // Títulos de seção
--text-xl: 17px      // Títulos de cards de rumor
--text-2xl: 20px     // Título do feed
--text-3xl: 22px     // Logo

// Font Weights
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700

// Line Heights
--leading-tight: 1.2
--leading-normal: 1.4
--leading-relaxed: 1.5
```

**Importar no CSS:**
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### 1.3 Espaçamentos

```
--space-1: 2px
--space-2: 4px
--space-3: 6px
--space-4: 8px
--space-5: 10px
--space-6: 12px
--space-8: 16px
--space-10: 20px
--space-12: 24px
--space-14: 28px
--space-16: 32px
--space-20: 40px
--space-24: 48px
```

### 1.4 Border Radius

```
--radius-sm: 4px     // Badges pequenos
--radius-md: 6px     // Botões, inputs
--radius-lg: 8px     // Cards internos
--radius-xl: 10px    // Logo icon
--radius-2xl: 12px   // Cards principais, boxes
--radius-full: 9999px // Pills, avatares
```

### 1.5 Shadows & Effects

```
// Não usar box-shadows pesados — manter flat
// Usar bordas sutis para separação

// Transições
--transition-fast: 0.15s ease
--transition-normal: 0.2s ease
--transition-slow: 0.3s ease

// Backdrop blur (para header sticky)
backdrop-filter: blur(12px);
background: #09090Bee; // com transparência
```

---

## 2. Layout Geral

### 2.1 Estrutura de 3 Colunas

```
┌──────────────────────────────────────────────────────────────┐
│                     MAX-WIDTH: 1400px                        │
│                     MARGIN: 0 auto                           │
├────────────┬─────────────────────────────┬───────────────────┤
│            │                             │                   │
│  SIDEBAR   │         FEED               │    SIDEBAR        │
│  ESQUERDA  │        CENTRAL             │    DIREITA        │
│            │                             │                   │
│  Width:    │     Flex: 1                │   Width:          │
│  240px     │     Min-width: 0           │   300px           │
│            │                             │                   │
│  Position: │  Border-left: 1px          │   Position:       │
│  sticky    │  Border-right: 1px         │   sticky          │
│  Top: 0    │  Border-color:             │   Top: 0          │
│  Height:   │  #27272A                   │   Height:         │
│  100vh     │                             │   100vh           │
│            │                             │                   │
└────────────┴─────────────────────────────┴───────────────────┘
```

### 2.2 Responsividade

```
// Desktop (>1200px): 3 colunas
// Tablet (768px - 1200px): 2 colunas (esconder sidebar direita)
// Mobile (<768px): 1 coluna (esconder ambas sidebars, mostrar nav inferior)

@media (max-width: 1200px) {
  .sidebar-right { display: none; }
}

@media (max-width: 768px) {
  .sidebar-left { display: none; }
  // Implementar bottom navigation para mobile
}
```

---

## 3. Componentes

### 3.1 Sidebar Esquerda

**Container:**
- Width: 240px
- Padding: 20px 16px
- Border-right: 1px solid #27272A
- Position: sticky, top: 0
- Height: 100vh
- Overflow-y: auto

**3.1.1 Logo**
```
┌─────────────────────────────┐
│  [ICON] Palpiteiro          │
└─────────────────────────────┘

- Container: flex, align-items center, gap 10px
- Padding: 8px 12px
- Margin-bottom: 32px

- Icon:
  - Width/Height: 36px
  - Background: linear-gradient(135deg, #10B981, #059669)
  - Border-radius: 10px
  - Emoji ⚽ centralizado, font-size 18px

- Text:
  - Font-size: 22px
  - Font-weight: 700
  - Background: linear-gradient(90deg, #10B981, #34D399)
  - Background-clip: text
  - Color: transparent
```

**3.1.2 Seção de Filtros**
```
┌─────────────────────────────┐
│  FILTRAR                    │  <- Título
├─────────────────────────────┤
│  🔥 Mais quentes           │  <- Item (pode estar ativo)
│  🆕 Mais recentes          │
│  ⏰ Fechando logo          │
└─────────────────────────────┘

- Título da seção:
  - Font-size: 11px
  - Font-weight: 600
  - Color: #71717A
  - Text-transform: uppercase
  - Letter-spacing: 1px
  - Padding: 0 12px
  - Margin-bottom: 12px

- Item de filtro:
  - Padding: 10px 12px
  - Border-radius: 8px
  - Font-size: 14px
  - Color: #A1A1AA
  - Cursor: pointer
  - Transition: all 0.15s ease
  - Display: flex, align-items center, gap 10px
  - Background: transparent
  - Border: none
  - Width: 100%

- Item hover:
  - Background: #18181B
  - Color: #FAFAFA

- Item ativo:
  - Background: #10B98120
  - Color: #10B981
  - Font-weight: 500
```

**3.1.3 Seção de Times**
```
┌─────────────────────────────┐
│  TIMES                      │
├─────────────────────────────┤
│  ⚽ Todos                   │  <- Ativo por padrão
│  🔴 Flamengo               │
│  ⚫ Corinthians            │
│  💚 Palmeiras              │
│  ... (12 times)            │
└─────────────────────────────┘

- Mesma estrutura do filtro
- Gap entre items: 2px

- Item ativo:
  - Background: #1F1F23
  - Color: #FAFAFA
  - Font-weight: 500
  - Barra verde à esquerda:
    - Position: absolute
    - Left: 0
    - Width: 3px
    - Height: 24px
    - Background: #10B981
    - Border-radius: 0 2px 2px 0

- Emoji do time:
  - Font-size: 16px
```

**Lista completa de times e emojis:**
```javascript
const times = [
  { id: 'todos', nome: 'Todos', emoji: '⚽' },
  { id: 'flamengo', nome: 'Flamengo', emoji: '🔴' },
  { id: 'corinthians', nome: 'Corinthians', emoji: '⚫' },
  { id: 'palmeiras', nome: 'Palmeiras', emoji: '💚' },
  { id: 'santos', nome: 'Santos', emoji: '⚪' },
  { id: 'sao-paulo', nome: 'São Paulo', emoji: '🔴' },
  { id: 'botafogo', nome: 'Botafogo', emoji: '⭐' },
  { id: 'fluminense', nome: 'Fluminense', emoji: '🟢' },
  { id: 'vasco', nome: 'Vasco', emoji: '⚫' },
  { id: 'atletico-mg', nome: 'Atlético-MG', emoji: '⚫' },
  { id: 'cruzeiro', nome: 'Cruzeiro', emoji: '💙' },
  { id: 'internacional', nome: 'Inter', emoji: '🔴' },
  { id: 'gremio', nome: 'Grêmio', emoji: '💙' },
];
```

---

### 3.2 Feed Central

**Container:**
- Flex: 1
- Min-width: 0
- Border-right: 1px solid #27272A

**3.2.1 Header do Feed (Sticky)**
```
┌─────────────────────────────────────────┐
│  Rumores                                │
│  [🔥 Quentes] [Recentes] [Fechando]    │
└─────────────────────────────────────────┘

- Position: sticky
- Top: 0
- Background: #09090Bee (com transparência)
- Backdrop-filter: blur(12px)
- Border-bottom: 1px solid #27272A
- Padding: 16px 20px
- Z-index: 10

- Título "Rumores":
  - Font-size: 20px
  - Font-weight: 600
  - Color: #FAFAFA

- Tabs container:
  - Display: flex
  - Gap: 4px
  - Margin-top: 12px

- Tab button:
  - Padding: 8px 16px
  - Border-radius: 20px (pill)
  - Font-size: 13px
  - Font-weight: 500
  - Background: transparent
  - Color: #71717A
  - Border: none
  - Cursor: pointer

- Tab hover:
  - Background: #27272A
  - Color: #FAFAFA

- Tab ativo:
  - Background: #FAFAFA
  - Color: #09090B
```

**3.2.2 Card de Rumor**

Este é o componente mais importante. Cada rumor aparece como um card no feed.

```
┌─────────────────────────────────────────────────────────────┐
│ ▎ FLAMENGO                                    2h   🔥 QUENTE │
│ ▎                                                           │
│ ▎ Neymar fecha com o Flamengo em 2025?                     │
│ ▎                                                           │
│ ▎ ████████████████░░░░░░  73% VAI          27% NÃO VAI     │
│ ▎                                                           │
│ ▎ [Venê Casagrande ✓ VAI 92%] [Jorge Nicola ✗ NÃO 78%]    │
│ ▎                                                           │
│ ▎ 2.847 palpites · 156 comentários     [🎯 VAI] [✗ NÃO VAI]│
└─────────────────────────────────────────────────────────────┘

ESTRUTURA DO CARD:

Container:
- Padding: 20px
- Border-bottom: 1px solid #27272A
- Transition: all 0.2s ease
- Cursor: pointer
- Position: relative

Barra lateral colorida (cor do time):
- Position: absolute
- Left: 0, Top: 0, Bottom: 0
- Width: 3px
- Background: var(--time-color)
- Opacity: 0 (default), 1 (hover)
- Transition: opacity 0.2s ease

Hover state:
- Background: #0F0F12
- Transform: translateX(4px)

---

HEADER DO CARD:
- Display: flex
- Align-items: center
- Gap: 10px
- Margin-bottom: 10px

Badge do time:
- Font-size: 12px
- Font-weight: 600
- Padding: 4px 10px
- Border-radius: 4px
- Background: {cor do time}20 (20% opacidade)
- Color: {cor do time}

Timestamp:
- Font-size: 12px
- Color: #71717A

Badge "QUENTE" (condicional):
- Font-size: 11px
- Font-weight: 600
- Color: #F97316
- Background: #F9731620
- Padding: 3px 8px
- Border-radius: 4px
- Margin-left: auto
- Animation: pulse 2s infinite

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

---

TÍTULO DO RUMOR:
- Font-size: 17px
- Font-weight: 600
- Line-height: 1.4
- Margin-bottom: 14px
- Color: #FAFAFA

---

BARRA DE PROGRESSO:
- Margin-bottom: 14px

Container da barra:
- Height: 8px
- Background: #27272A
- Border-radius: 4px
- Overflow: hidden
- Margin-bottom: 6px

Fill da barra:
- Height: 100%
- Border-radius: 4px
- Width: {percentualVai}%
- Background: 
  - Se > 50%: linear-gradient(90deg, #10B981, #34D399)
  - Se <= 50%: linear-gradient(90deg, #6B7280, #9CA3AF)
- Transition: width 0.5s ease

Labels:
- Display: flex
- Justify-content: space-between
- Font-size: 12px
- Font-family: 'JetBrains Mono', monospace
- Color: #71717A

Label com mais votos:
- Color: #10B981
- Font-weight: 600

---

BADGES DE INFLUENCIADORES:
- Display: flex
- Flex-wrap: wrap
- Gap: 8px
- Margin-bottom: 14px

Cada badge:
- Display: flex
- Align-items: center
- Gap: 6px
- Background: #18181B
- Padding: 6px 10px
- Border-radius: 6px
- Font-size: 12px

Nome do influenciador:
- Color: #A1A1AA
- Max-width: 100px
- Overflow: hidden
- Text-overflow: ellipsis
- White-space: nowrap

Palpite do influenciador:
- Font-weight: 600
- Font-size: 10px
- Padding: 2px 6px
- Border-radius: 3px
- Se "vai": Color #10B981, Background #10B98120
- Se "nao": Color #EF4444, Background #EF444420

Taxa de acerto:
- Color: #71717A
- Font-family: 'JetBrains Mono', monospace
- Font-size: 11px

---

FOOTER DO CARD:
- Display: flex
- Align-items: center
- Justify-content: space-between
- Flex-wrap: wrap
- Gap: 12px

Stats:
- Display: flex
- Gap: 8px
- Font-size: 13px
- Color: #71717A
- Formato: "2.847 palpites · 156 comentários"

Botões de ação:
- Display: flex
- Gap: 8px

Botão VAI:
- Padding: 8px 20px
- Border-radius: 6px
- Font-size: 13px
- Font-weight: 600
- Font-family: 'Space Grotesk', sans-serif
- Background: #10B98120
- Color: #10B981
- Border: 1px solid #10B98140
- Cursor: pointer

Botão VAI hover:
- Background: #10B981
- Color: #FAFAFA

Botão VAI ativo (após voto):
- Background: #10B981
- Color: #FAFAFA

Botão NÃO VAI:
- Mesmo estilo, mas com cores:
- Background: #EF444420
- Color: #EF4444
- Border: 1px solid #EF444440

Botão NÃO VAI hover:
- Background: #EF4444
- Color: #FAFAFA

Botão disabled (após voto no outro):
- Opacity: 0.5
- Cursor: not-allowed

---

FEEDBACK APÓS VOTO:
- Margin-top: 12px
- Padding: 8px 12px
- Background: #10B98110
- Border: 1px solid #10B98130
- Border-radius: 6px
- Font-size: 13px
- Color: #10B981
- Text-align: center
- Texto: "Palpite registrado! 🎯" ou "Palpite registrado! ❌"
```

**Regra de exibição do badge "QUENTE":**
- Mostrar se o rumor tem mais de 1000 palpites nas últimas 24h
- OU se foi criado nas últimas 6h e tem mais de 500 palpites

---

### 3.3 Sidebar Direita

**Container:**
- Width: 300px
- Padding: 20px 16px
- Position: sticky
- Top: 0
- Height: 100vh
- Overflow-y: auto

**3.3.1 Box Trending**
```
┌─────────────────────────────────┐
│  📈 Trending                    │
├─────────────────────────────────┤
│  1  Neymar                      │
│     Flamengo · 2.8k palpites 73%│
├─────────────────────────────────┤
│  2  Gabigol                     │
│     Cruzeiro · 4.5k palpites 89%│
├─────────────────────────────────┤
│  ... (top 5)                    │
└─────────────────────────────────┘

Container:
- Background: #18181B
- Border-radius: 12px
- Padding: 16px
- Margin-bottom: 20px

Título:
- Font-size: 15px
- Font-weight: 600
- Margin-bottom: 16px
- Display: flex
- Align-items: center
- Gap: 8px

Lista:
- Display: flex
- Flex-direction: column
- Gap: 12px

Item:
- Display: flex
- Align-items: flex-start
- Gap: 12px

Rank:
- Font-size: 14px
- Font-weight: 700
- Color: #71717A
- Font-family: 'JetBrains Mono', monospace
- Width: 20px

Info:
- Flex: 1

Nome do jogador:
- Font-size: 14px
- Font-weight: 500
- Margin-bottom: 2px

Meta:
- Font-size: 12px
- Color: #71717A
- Formato: "{time} · {total} palpites"

Percentual:
- Font-size: 13px
- Font-weight: 600
- Color: #10B981
- Font-family: 'JetBrains Mono', monospace
```

**3.3.2 Box Top Palpiteiros**
```
┌─────────────────────────────────┐
│  🏆 Top Palpiteiros             │
├─────────────────────────────────┤
│  [P] @pedrosilva                │
│      127 palpites          94%  │
├─────────────────────────────────┤
│  [M] @mariacampos               │
│      98 palpites           91%  │
├─────────────────────────────────┤
│  ... (top 5)                    │
└─────────────────────────────────┘

Container:
- Background: #18181B
- Border-radius: 12px
- Padding: 16px

Item:
- Display: flex
- Align-items: center
- Gap: 12px
- Padding: 10px 0
- Border-bottom: 1px solid #27272A (exceto último)

Avatar:
- Width/Height: 36px
- Border-radius: 50%
- Background: linear-gradient(135deg, #10B981, #059669)
- Display: flex
- Align-items: center
- Justify-content: center
- Font-size: 14px
- Font-weight: 600
- Color: #FAFAFA
- Conteúdo: primeira letra do username em maiúscula

Info:
- Flex: 1

Nome:
- Font-size: 14px
- Font-weight: 500
- Formato: "@{username}"

Meta:
- Font-size: 12px
- Color: #71717A
- Formato: "{total} palpites"

Taxa de acerto:
- Font-size: 14px
- Font-weight: 700
- Color: #10B981
- Font-family: 'JetBrains Mono', monospace
```

**3.3.3 CTA Box**
```
┌─────────────────────────────────┐
│                                 │
│      Entre no jogo              │
│                                 │
│  Dê seu palpite e suba no       │
│  ranking dos melhores           │
│  palpiteiros do Brasil          │
│                                 │
│  [ Criar conta grátis ]         │
│                                 │
└─────────────────────────────────┘

Container:
- Background: linear-gradient(135deg, #10B98120, #05966920)
- Border: 1px solid #10B98140
- Border-radius: 12px
- Padding: 20px
- Margin-top: 20px
- Text-align: center

Título:
- Font-size: 15px
- Font-weight: 600
- Margin-bottom: 8px

Texto:
- Font-size: 13px
- Color: #A1A1AA
- Margin-bottom: 16px

Botão:
- Width: 100%
- Padding: 12px
- Background: #10B981
- Color: #FAFAFA
- Border: none
- Border-radius: 8px
- Font-size: 14px
- Font-weight: 600
- Cursor: pointer
- Font-family: 'Space Grotesk', sans-serif

Botão hover:
- Background: #059669
- Transform: translateY(-1px)
```

---

## 4. Estados e Interações

### 4.1 Estado Vazio (Nenhum Rumor)
```
┌─────────────────────────────────┐
│                                 │
│             🔍                  │
│                                 │
│   Nenhum rumor encontrado       │
│   para {time selecionado}       │
│                                 │
└─────────────────────────────────┘

- Padding: 60px 20px
- Text-align: center
- Color: #71717A
- Emoji: font-size 48px, margin-bottom 16px
```

### 4.2 Loading State
- Usar skeleton loaders nos cards
- Background animado: linear-gradient moving de #18181B para #27272A

### 4.3 Fluxo de Voto

1. Usuário clica em "VAI" ou "NÃO VAI"
2. Se logado:
   - Botão clicado fica ativo (cor cheia)
   - Outro botão fica disabled
   - Aparece feedback "Palpite registrado!"
   - Percentuais atualizam em tempo real
3. Se não logado:
   - Abre modal de login/signup
   - Após login, voto é registrado automaticamente

### 4.4 Atualização em Tempo Real
- Usar WebSocket ou polling a cada 30s
- Quando percentuais mudam, animar a barra de progresso
- Quando novo rumor aparece, adicionar no topo com animação de slide-down

---

## 5. Dados e API

### 5.1 Estrutura do Rumor
```typescript
interface Rumor {
  id: string;
  titulo: string;                    // "Neymar fecha com o Flamengo em 2025?"
  jogador: {
    nome: string;                    // "Neymar Jr."
    foto?: string;
  };
  timeDestino: {
    id: string;
    nome: string;                    // "Flamengo"
    cor: string;                     // "#E11D48"
  };
  timeOrigem?: {
    nome: string;                    // "Al-Hilal"
  };
  palpites: {
    vai: number;
    naoVai: number;
    total: number;
    percentualVai: number;          // Calculado: vai / total * 100
  };
  comentarios: number;
  criadoEm: Date;
  atualizadoEm: Date;
  status: 'aberto' | 'fechado' | 'confirmado' | 'desmentido';
  quente: boolean;                   // Calculado no backend
  influenciadores: InfluenciadorPalpite[];
}

interface InfluenciadorPalpite {
  influenciador: {
    id: string;
    nome: string;                    // "Venê Casagrande"
    taxaAcerto: number;             // 92
  };
  palpite: 'vai' | 'nao';
  data: Date;
}

interface Palpiteiro {
  id: string;
  username: string;
  palpitesTotal: number;
  taxaAcerto: number;
}

interface User {
  id: string;
  email: string;
  username: string;
  meuTime: string;                   // ID do time escolhido no onboarding
  meuTimeEscolhidoEm: Date;         // Quando escolheu (pra evitar troca)
  isPremium: boolean;
  premiumAte: Date | null;          // null se não for premium
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  criadoEm: Date;
}

interface Subscription {
  id: string;
  userId: string;
  plano: 'mensal' | 'anual';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  inicioEm: Date;
  proximaCobranca: Date;
  canceladoEm?: Date;
  stripeSubscriptionId: string;
}
```

### 5.2 Endpoints Necessários

```
// RUMORES
GET /api/rumores
  Query params:
    - time?: string (filtrar por time)
    - ordem?: 'quentes' | 'recentes' | 'fechando'
    - page?: number
    - limit?: number (default 20)
  Nota: Se usuário grátis, backend já filtra pelo time dele

GET /api/rumores/:id

POST /api/rumores/:id/palpite
  Body: { palpite: 'vai' | 'nao' }
  Requer autenticação

// TRENDING E RANKINGS
GET /api/trending
  Query params:
    - time?: string (opcional, se não passar e for premium, retorna geral)
  Nota: Usuário grátis só recebe do seu time

GET /api/palpiteiros/top
  Retorna top 5 palpiteiros por taxa de acerto

GET /api/times
  Retorna lista de times com contagem de rumores ativos

// USUÁRIO
GET /api/user/me
  Retorna dados do usuário logado incluindo:
  - meuTime: string
  - isPremium: boolean
  - premiumAte: Date | null

POST /api/user/escolher-time
  Body: { time: string }
  Nota: Só pode chamar 1x (ou ilimitado se premium)

PUT /api/user/trocar-time
  Body: { time: string }
  Requer Premium

// ASSINATURA
GET /api/subscription/status
  Retorna status da assinatura

POST /api/subscription/checkout
  Body: { plano: 'mensal' | 'anual' }
  Retorna URL do checkout (Stripe)

POST /api/subscription/webhook
  Webhook do Stripe para atualizar status

POST /api/subscription/cancel
  Cancela assinatura no final do período
```

---

## 6. Monetização e Acesso (Freemium)

### 6.1 Modelo de Negócio

**Conceito:** Usuário escolhe UM time grátis. Para ver rumores de outros times, precisa do Premium.

```
┌─────────────────────────────────────────────────────────────────┐
│                        MATRIZ DE ACESSO                         │
├─────────────────────┬─────────────────┬─────────────────────────┤
│     FUNCIONALIDADE  │     GRÁTIS      │        PREMIUM          │
├─────────────────────┼─────────────────┼─────────────────────────┤
│ Ver rumores         │ 1 time apenas   │ Todos os 12 times       │
│ Ver porcentagens    │ ✓               │ ✓                       │
│ Ver influenciadores │ ✓               │ ✓                       │
│ Votar (palpitar)    │ ✓               │ ✓                       │
│ Comentar            │ ✓               │ ✓                       │
│ Ver trending geral  │ ✗ (só do time)  │ ✓ (todos)               │
│ Trocar de time      │ ✗               │ ✓ (ilimitado)           │
│ Notificações        │ 1 time          │ Todos os times          │
│ Histórico completo  │ ✗               │ ✓                       │
│ Badge Premium       │ ✗               │ ✓                       │
│ Sem anúncios        │ ✗               │ ✓                       │
└─────────────────────┴─────────────────┴─────────────────────────┘
```

**Preço sugerido:**
- R$ 29,90/mês
- R$ 199,90/ano (44% desconto — equivale a R$ 16,66/mês)

---

### 6.2 Fluxo de Onboarding (Escolha do Time)

**Primeiro acesso (obrigatório antes de ver o feed):**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ⚽ Bem-vindo ao Palpiteiro!                  │
│                                                                 │
│              Escolha o time do seu coração                      │
│           (você pode trocar depois com Premium)                 │
│                                                                 │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│   │   🔴    │  │   ⚫    │  │   💚    │  │   ⚪    │          │
│   │Flamengo │  │Corinthi.│  │Palmeiras│  │ Santos  │          │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                 │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│   │   🔴    │  │   ⭐    │  │   🟢    │  │   ⚫    │          │
│   │São Paulo│  │Botafogo │  │Fluminen.│  │  Vasco  │          │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                 │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│   │   ⚫    │  │   💙    │  │   🔴    │  │   💙    │          │
│   │Atlét-MG │  │Cruzeiro │  │  Inter  │  │ Grêmio  │          │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

- Tela fullscreen
- Cards clicáveis
- Após selecionar, animação de confirmação
- Redireciona para o feed filtrado pelo time escolhido
- Salva no perfil do usuário: `meuTime: 'flamengo'`
```

**Especificações do card de time no onboarding:**
- Width: 140px
- Height: 100px
- Background: #18181B
- Border: 2px solid transparent
- Border-radius: 12px
- Cursor: pointer
- Transition: all 0.2s ease

**Card hover:**
- Border: 2px solid {cor do time}
- Transform: translateY(-4px)

**Card selecionado:**
- Border: 2px solid {cor do time}
- Background: {cor do time}15
- Checkmark aparece no canto

---

### 6.3 Comportamento da Sidebar de Times (Pós-Onboarding)

**Usuário Grátis:**
```
┌─────────────────────────────┐
│  MEU TIME                   │
├─────────────────────────────┤
│  🔴 Flamengo        ← ativo │
├─────────────────────────────┤
│  OUTROS TIMES 🔒            │
├─────────────────────────────┤
│  ⚫ Corinthians     🔒      │  ← bloqueado, opacidade 50%
│  💚 Palmeiras       🔒      │
│  ⚪ Santos          🔒      │
│  ...                        │
├─────────────────────────────┤
│  ✨ Liberar todos           │  ← CTA para Premium
│     R$ 29,90/mês            │
└─────────────────────────────┘
```

**Especificações:**

Título "MEU TIME":
- Font-size: 11px
- Font-weight: 600
- Color: #10B981
- Text-transform: uppercase
- Letter-spacing: 1px

Time do usuário:
- Sempre visível e clicável
- Mesmo estilo do item ativo atual

Divisor "OUTROS TIMES 🔒":
- Font-size: 11px
- Font-weight: 600
- Color: #71717A
- Margin-top: 16px
- Margin-bottom: 8px

Times bloqueados:
- Opacity: 0.5
- Cursor: not-allowed
- Ao clicar: abre modal de upsell

Ícone de cadeado:
- Usar emoji 🔒 ou ícone de Lucide `Lock`
- Font-size: 12px
- Color: #71717A
- Margin-left: auto

CTA "Liberar todos":
- Background: linear-gradient(135deg, #10B98120, #05966920)
- Border: 1px solid #10B98140
- Border-radius: 8px
- Padding: 12px
- Margin-top: 16px
- Text-align: center
- Font-size: 13px
- Font-weight: 600
- Color: #10B981
- Cursor: pointer

CTA hover:
- Background: #10B98130
- Transform: translateY(-1px)

---

### 6.4 Modal de Upsell (Quando Clica em Time Bloqueado)

```
┌─────────────────────────────────────────────────────────────────┐
│                              ✕                                  │
│                                                                 │
│                    🔓 Libere todos os times                     │
│                                                                 │
│    Você está no plano grátis e só pode ver rumores do          │
│    Flamengo. Com o Premium, você acompanha TODOS os times.     │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │  ✓  Acesso a todos os 12 times                      │     │
│    │  ✓  Trending geral do futebol brasileiro            │     │
│    │  ✓  Troque de time quando quiser                    │     │
│    │  ✓  Notificações de todos os rumores                │     │
│    │  ✓  Badge Premium no seu perfil                     │     │
│    │  ✓  Sem anúncios                                    │     │
│    └─────────────────────────────────────────────────────┘     │
│                                                                 │
│    ┌───────────────────────┐  ┌───────────────────────┐        │
│    │      MENSAL           │  │       ANUAL           │        │
│    │                       │  │                       │        │
│    │    R$ 29,90/mês       │  │   R$ 199,90/ano       │        │
│    │                       │  │   (R$ 16,66/mês)      │        │
│    │                       │  │    ECONOMIA 44%       │        │
│    └───────────────────────┘  └───────────────────────┘        │
│                                                                 │
│              [ Assinar Premium ]                                │
│                                                                 │
│              Cancele quando quiser                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Modal:
- Width: 480px (max)
- Background: #18181B
- Border: 1px solid #27272A
- Border-radius: 16px
- Padding: 32px
- Overlay: #00000080

Título:
- Font-size: 24px
- Font-weight: 700
- Text-align: center
- Margin-bottom: 12px

Descrição:
- Font-size: 14px
- Color: #A1A1AA
- Text-align: center
- Line-height: 1.5
- Margin-bottom: 24px

Lista de benefícios:
- Background: #09090B
- Border-radius: 12px
- Padding: 16px 20px
- Margin-bottom: 24px

Item de benefício:
- Display: flex
- Align-items: center
- Gap: 10px
- Padding: 8px 0
- Font-size: 14px
- Color: #FAFAFA

Checkmark:
- Color: #10B981
- Font-weight: bold

Cards de preço:
- Display: flex
- Gap: 12px
- Margin-bottom: 24px

Card de preço individual:
- Flex: 1
- Background: #27272A
- Border: 2px solid transparent
- Border-radius: 12px
- Padding: 20px
- Text-align: center
- Cursor: pointer

Card de preço selecionado:
- Border: 2px solid #10B981
- Background: #10B98110

Card de preço - label:
- Font-size: 12px
- Font-weight: 600
- Color: #71717A
- Text-transform: uppercase
- Letter-spacing: 1px
- Margin-bottom: 8px

Card de preço - valor:
- Font-size: 24px
- Font-weight: 700
- Color: #FAFAFA

Card anual - badge economia:
- Font-size: 11px
- Font-weight: 600
- Color: #10B981
- Background: #10B98120
- Padding: 4px 8px
- Border-radius: 4px
- Margin-top: 8px
- Display: inline-block

Botão assinar:
- Width: 100%
- Padding: 16px
- Background: #10B981
- Color: #FAFAFA
- Border: none
- Border-radius: 10px
- Font-size: 16px
- Font-weight: 600
- Cursor: pointer

Botão hover:
- Background: #059669

Texto "Cancele quando quiser":
- Font-size: 12px
- Color: #71717A
- Text-align: center
- Margin-top: 12px
```

---

### 6.5 Usuário Premium

**Sidebar de times (sem restrições):**
```
┌─────────────────────────────┐
│  TIMES                      │
├─────────────────────────────┤
│  ⚽ Todos                   │
│  🔴 Flamengo        ★      │  ← estrela indica "meu time"
│  ⚫ Corinthians            │
│  💚 Palmeiras              │
│  ⚪ Santos                 │
│  ...                        │
├─────────────────────────────┤
│  ✨ Premium ativo           │
└─────────────────────────────┘
```

- Todos os times clicáveis
- Opção "Todos" disponível
- Estrela ★ ao lado do time principal do usuário
- Badge "Premium ativo" no final da sidebar
- Pode trocar "meu time" nas configurações

---

### 6.6 Níveis de Acesso (Resumo)

**Visitante (não logado):**
- Ver feed com rumores (sem filtro de time, vê misturado)
- Ver porcentagens
- NÃO pode votar (pede login)
- NÃO pode ver detalhes dos influenciadores

**Usuário Grátis (logado):**
- Escolhe 1 time no onboarding
- Vê APENAS rumores do seu time
- Pode votar
- Pode comentar
- Vê influenciadores
- Trending só do seu time
- Times bloqueados mostram upsell

**Usuário Premium:**
- Acesso a todos os times
- Pode filtrar por "Todos"
- Trending geral
- Pode trocar de time principal
- Badge no perfil
- Sem anúncios
- Notificações de qualquer time

---

### 6.7 Gatilhos de Upsell

Momentos para mostrar upsell:

1. **Clique em time bloqueado** → Modal de upsell
2. **Após 5 palpites no mesmo dia** → Banner: "Gostando? Libere todos os times!"
3. **Quando rumor do time rival aparece no trending** → "Quer ver o que tá rolando no {rival}?"
4. **Após 7 dias de uso** → Push notification: "Falta só um passo pra virar palpiteiro premium"
5. **No resultado de um palpite certo** → "Parabéns! Quer testar seu palpite em outros times?"

---

### 6.8 Comportamentos Especiais

**Visitante vs Usuário Logado vs Premium:**

| Ação | Visitante | Grátis | Premium |
|------|-----------|--------|---------|
| Ver rumores | ✓ (todos misturados) | ✓ (1 time) | ✓ (todos) |
| Ver porcentagens | ✓ | ✓ | ✓ |
| Ver influenciadores | Parcial | ✓ | ✓ |
| Votar | ✗ (pede login) | ✓ | ✓ |
| Comentar | ✗ | ✓ | ✓ |
| Filtrar times | ✗ | ✗ | ✓ |
| Ver trending | Parcial | Só do time | Todos |

### 6.2 Scroll Infinito
- Carregar mais 20 rumores quando chegar a 80% do scroll
- Mostrar loading spinner no final
- Parar quando não houver mais rumores

### 6.3 Deep Linking
- URL deve refletir filtros: `/rumores?time=flamengo&ordem=quentes`
- Permitir compartilhar link de rumor específico: `/rumor/{id}`

---

## 7. Mobile (Responsivo)

### 7.1 Layout Mobile (<768px)

- Esconder sidebars
- Feed ocupa 100% da largura
- Header fixo no topo com logo e filtro de time (dropdown)
- Bottom navigation com ícones:
  ```
  [🏠 Feed] [🔍 Buscar] [🏆 Ranking] [👤 Perfil]
  ```

### 7.2 Card de Rumor Mobile
- Padding: 16px
- Botões VAI/NÃO VAI empilhados se não couberem
- Badges de influenciadores scrolláveis horizontalmente

---

## 9. Checklist de Implementação

### Fase 1: Estrutura Base
- [ ] Remover landing page atual
- [ ] Implementar layout de 3 colunas
- [ ] Criar componente de Sidebar Esquerda
- [ ] Criar componente de Feed
- [ ] Criar componente de Sidebar Direita

### Fase 2: Componentes
- [ ] Implementar Card de Rumor completo
- [ ] Implementar sistema de filtros
- [ ] Implementar lista de times
- [ ] Implementar box Trending
- [ ] Implementar box Top Palpiteiros

### Fase 3: Onboarding e Autenticação
- [ ] Criar tela de escolha de time (fullscreen)
- [ ] Salvar time escolhido no perfil do usuário
- [ ] Redirecionar após escolha para feed filtrado
- [ ] Implementar fluxo de login/signup

### Fase 4: Monetização (Freemium)
- [ ] Implementar lógica de acesso por time
- [ ] Criar sidebar com times bloqueados (usuário grátis)
- [ ] Criar modal de upsell
- [ ] Implementar cards de preço (mensal/anual)
- [ ] Integrar gateway de pagamento (Stripe)
- [ ] Criar página de checkout
- [ ] Implementar verificação de status Premium
- [ ] Criar badge Premium no perfil

### Fase 5: Agregação de Notícias
- [ ] Criar schema Prisma (NewsItem, RumorNewsItem, RumorSignal)
- [ ] Rodar migration
- [ ] Implementar scraper Globo Esporte (RSS)
- [ ] Implementar scraper UOL Esporte (RSS)
- [ ] Implementar scraper YouTube (API)
- [ ] Implementar scraper Twitter (Nitter)
- [ ] Criar processador de entidades (extrair jogadores/times)
- [ ] Criar matcher de rumores
- [ ] Implementar calculador de sinais (spike detection)
- [ ] Configurar cron job no Vercel (30 min)
- [ ] Criar endpoint GET /api/news/rumor/:rumorId
- [ ] Criar componente NewsItemCard
- [ ] Integrar feed de notícias no card expandido de rumor

### Fase 6: Interações
- [ ] Implementar voto com feedback
- [ ] Implementar atualização de porcentagens
- [ ] Implementar scroll infinito
- [ ] Implementar estados de loading

### Fase 7: Responsividade
- [ ] Implementar breakpoint tablet
- [ ] Implementar breakpoint mobile
- [ ] Implementar bottom navigation mobile

### Fase 8: Polish
- [ ] Adicionar animações e transições
- [ ] Testar em diferentes navegadores
- [ ] Otimizar performance
- [ ] Adicionar analytics de eventos
- [ ] Implementar gatilhos de upsell (após 5 palpites, etc.)
- [ ] Monitorar scrapers (alertas de erro no Vercel)

---

## 9. Notas Finais

**Princípios a seguir:**
1. **Conteúdo primeiro** — usuário vê rumores imediatamente
2. **Zero fricção** — votar deve ser 1 clique
3. **Densidade de informação** — mostrar o máximo possível sem poluir
4. **Dark mode always** — mais moderno, menos cansativo
5. **Números em destaque** — porcentagens, contagens sempre visíveis

**O que NÃO fazer:**
- Landing pages com "Como funciona"
- Modais desnecessários
- Explicações longas
- CTAs agressivos repetidos
- Espaços vazios sem propósito

---

## 10. Sistema de Agregação de Notícias em Tempo Real

> **Prioridade:** 🔴 ALTA
> **Esforço estimado:** 8-12 horas
> **Objetivo:** Usuário abre o app toda manhã e vê um feed completo sobre os rumores do time dele, sem precisar ir ao Twitter/X ou sites de notícia.

### 10.1 Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        CRON JOB (30 min)                        │
│                     Vercel Cron ou QStash                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SCRAPER WORKERS                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │ Twitter  │  │ YouTube  │  │  Globo   │  │     UOL      │    │
│  │ Scraper  │  │   API    │  │ RSS+Scrape│  │  RSS+Scrape │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESSADOR DE CONTEÚDO                      │
│  - Normaliza dados                                              │
│  - Extrai entidades (jogador, time)                             │
│  - Calcula relevância (volume/velocidade)                       │
│  - Associa a rumores existentes ou cria novos                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BANCO DE DADOS                             │
│  - Tabela: news_items                                           │
│  - Tabela: rumor_signals (volume por período)                   │
│  - Atualiza probabilidades dos rumores                          │
└─────────────────────────────────────────────────────────────────┘
```

**Fontes a agregar:**
- Twitter/X (via scraping do Nitter)
- YouTube (API gratuita — 10k requests/dia)
- Globo Esporte (RSS + scraping)
- UOL Esporte (RSS + scraping)

**Frequência:** A cada 30 minutos

---

### 10.2 Schema do Banco de Dados (Prisma)

```prisma
// Adicionar ao schema.prisma

model NewsItem {
  id          String   @id @default(cuid())
  source      String   // "twitter" | "youtube" | "globo" | "uol"
  sourceId    String   // ID único na fonte (tweet ID, video ID, URL)
  sourceUrl   String   // Link original
  authorName  String?  // Nome do autor/canal
  authorHandle String? // @handle no Twitter, channel ID no YouTube
  authorAvatar String? // URL do avatar
  content     String   // Texto do tweet/título do vídeo/headline
  summary     String?  // Resumo extraído (primeiros 280 chars)
  imageUrl    String?  // Thumbnail ou imagem
  publishedAt DateTime // Data de publicação original
  scrapedAt   DateTime @default(now())
  
  // Relacionamento com rumores
  rumors      RumorNewsItem[]
  
  // Entidades extraídas
  players     String[] // ["neymar", "paqueta"]
  teams       String[] // ["flamengo", "santos"]
  
  // Métricas (para Twitter/YouTube)
  likes       Int?
  retweets    Int?
  views       Int?
  
  @@unique([source, sourceId])
  @@index([publishedAt])
  @@index([source])
}

model RumorNewsItem {
  id        String   @id @default(cuid())
  rumorId   String
  newsItemId String
  relevance Float    // 0-1, quão relevante é pro rumor
  createdAt DateTime @default(now())
  
  rumor     Rumor    @relation(fields: [rumorId], references: [id])
  newsItem  NewsItem @relation(fields: [newsItemId], references: [id])
  
  @@unique([rumorId, newsItemId])
}

model RumorSignal {
  id        String   @id @default(cuid())
  rumorId   String
  period    DateTime // Timestamp do período (hora cheia)
  source    String   // "twitter" | "youtube" | "globo" | "uol" | "all"
  mentions  Int      // Quantidade de menções no período
  velocity  Float    // Taxa de crescimento vs período anterior
  
  rumor     Rumor    @relation(fields: [rumorId], references: [id])
  
  @@unique([rumorId, period, source])
  @@index([rumorId, period])
}

// Atualizar model Rumor existente:
model Rumor {
  // ... campos existentes ...
  
  // Adicionar:
  newsItems    RumorNewsItem[]
  signals      RumorSignal[]
  lastScraped  DateTime?
  signalScore  Float?  @default(0) // Score agregado de todos os sinais
}
```

---

### 10.3 Scrapers por Fonte

#### Twitter/X Scraper

**Biblioteca:** `puppeteer-core` + `@sparticuz/chromium` (versão leve pro Vercel)

**Alternativa:** Usar Nitter (nitter.net) como proxy — mais estável pra scraping

```typescript
// src/lib/scrapers/twitter.ts

interface TwitterScraperConfig {
  keywords: string[];      // ["neymar santos", "paqueta flamengo"]
  accounts: string[];      // ["@venecasagrande", "@jorgenicola"]
  maxResults: number;      // 50 por execução
}

interface ScrapedTweet {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  publishedAt: Date;
  likes: number;
  retweets: number;
  url: string;
}

async function scrapeTweets(config: TwitterScraperConfig): Promise<ScrapedTweet[]>
```

**Implementação:**
1. Usar Nitter como proxy
2. Buscar por keywords relacionadas aos rumores ativos
3. Buscar timeline de jornalistas específicos
4. Rate limit: máximo 100 requests por execução

---

#### YouTube Scraper

**Biblioteca:** YouTube Data API v3 (grátis até 10k requests/dia)

```typescript
// src/lib/scrapers/youtube.ts

interface YouTubeScraperConfig {
  keywords: string[];
  channels: string[];      // IDs de canais confiáveis
  maxResults: number;
}

interface ScrapedVideo {
  id: string;
  channelName: string;
  channelId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: Date;
  views: number;
  url: string;
}

async function scrapeYouTube(config: YouTubeScraperConfig): Promise<ScrapedVideo[]>
```

**Canais sugeridos:** ESPN Brasil, Globo Esporte, TNT Sports, canais oficiais dos clubes

---

#### Globo Esporte e UOL Scrapers

**Abordagem:** RSS + scraping de conteúdo

```typescript
// src/lib/scrapers/globo.ts

const GLOBO_RSS_FEEDS = [
  'https://ge.globo.com/rss/futebol/',
  'https://ge.globo.com/rss/futebol/futebol-internacional/',
];

const UOL_RSS_FEEDS = [
  'https://esporte.uol.com.br/futebol/rss.xml',
];

interface ScrapedArticle {
  id: string;           // URL como ID
  title: string;
  summary: string;
  imageUrl: string;
  publishedAt: Date;
  url: string;
  source: 'globo' | 'uol';
}
```

---

### 10.4 Processador de Conteúdo

```typescript
// src/lib/scrapers/processor.ts

interface ContentProcessor {
  // Extrair entidades (jogadores, times) do texto
  extractEntities(text: string): { players: string[], teams: string[] };
  
  // Encontrar rumores relacionados ao conteúdo
  matchRumors(entities: { players: string[], teams: string[] }, activeRumors: Rumor[]): RumorMatch[];
  
  // Calcular relevância (0-1)
  calculateRelevance(newsItem: NewsItem, rumor: Rumor): number;
}
```

**Regras de extração de entidades:**
- Lista de apelidos de jogadores: "Neymar", "Ney", "Menino Ney" → `neymar`
- Lista de variações de times: "Mengão", "Flamengo", "CRF" → `flamengo`
- Usar lowercase normalizado para matching

**Cálculo de relevância:**
- 1.0: Menciona jogador + time destino + palavras como "acerto", "fechado", "negociação"
- 0.8: Menciona jogador + time destino
- 0.5: Menciona apenas jogador em contexto de transferência
- 0.3: Menciona apenas jogador

---

### 10.5 Spike Detection (Badge "QUENTE")

```typescript
// src/lib/scrapers/signals.ts

interface SignalCalculator {
  // Calcular velocidade de menções
  calculateVelocity(rumorId: string, currentPeriod: Date): number;
  
  // Detectar spike (rumor esquentou)
  detectSpike(rumorId: string): boolean;
  
  // Atualizar score agregado do rumor
  updateSignalScore(rumorId: string): void;
}
```

**Regra de spike:**
- Se menções no período atual > 2x menções do período anterior → `quente = true`
- Se menções > 50 em 1 hora → `quente = true`
- Decai após 6 horas sem novas menções

---

### 10.6 Cron Job

```typescript
// src/app/api/cron/scrape-news/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Verificar que é chamada do Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // 1. Buscar rumores ativos
    const activeRumors = await getActiveRumors();
    
    // 2. Gerar keywords baseado nos rumores
    const keywords = generateKeywords(activeRumors);
    
    // 3. Executar scrapers em paralelo
    const [tweets, videos, globoArticles, uolArticles] = await Promise.all([
      scrapeTweets({ keywords, accounts: TRUSTED_JOURNALISTS }),
      scrapeYouTube({ keywords }),
      scrapeGlobo(),
      scrapeUOL(),
    ]);
    
    // 4. Processar e salvar
    const allItems = [...tweets, ...videos, ...globoArticles, ...uolArticles];
    await processAndSaveItems(allItems, activeRumors);
    
    // 5. Recalcular sinais
    await recalculateAllSignals(activeRumors);
    
    return NextResponse.json({ 
      success: true, 
      processed: allItems.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Scrape cron failed:', error);
    return NextResponse.json({ error: 'Scrape failed' }, { status: 500 });
  }
}
```

**Configuração no Vercel:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/scrape-news",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

---

### 10.7 API para o Frontend

```typescript
// Adicionar aos endpoints

GET /api/news/rumor/:rumorId
  Query params:
    - limit?: number (default 10)
    - offset?: number (default 0)
  Retorna: NewsItem[] ordenados por publishedAt desc

GET /api/news/rumor/:rumorId/signals
  Retorna: RumorSignal[] para gráfico de atividade
```

---

### 10.8 Componente de UI: Feed de Notícias no Card de Rumor

Quando o usuário clica em um rumor para expandir ou ver detalhes, mostra o feed de notícias relacionadas.

**Layout no Card Expandido:**

```
┌─────────────────────────────────────────────────────────────────┐
│ ▎ FLAMENGO                                    2h   🔥 QUENTE    │
│ ▎                                                               │
│ ▎ Neymar fecha com o Flamengo em 2025?                         │
│ ▎                                                               │
│ ▎ ████████████████░░░░░░  73% VAI          27% NÃO VAI         │
│ ▎                                                               │
│ ▎ 2.847 palpites · 156 comentários     [🎯 VAI] [✗ NÃO VAI]    │
├─────────────────────────────────────────────────────────────────┤
│ 📰 O QUE ESTÃO DIZENDO                                          │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🐦  Venê Casagrande @venecasagrande · 2h                    │ │
│ │     "Fontes confirmam que Neymar quer voltar ao Brasil.     │ │
│ │      Flamengo lidera as conversas."                         │ │
│ │     ❤️ 2.4k  🔁 892                                         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 📰  Globo Esporte · 3h                                      │ │
│ │     "Flamengo prepara proposta oficial por Neymar"          │ │
│ │     [thumbnail da matéria]                                  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ▶️  ESPN Brasil · 5h                                        │ │
│ │     "NEYMAR NO FLAMENGO? Veja os números da negociação"     │ │
│ │     [thumbnail do vídeo]                                    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│                    [ Carregar mais ]                            │
└─────────────────────────────────────────────────────────────────┘
```

**Especificações do NewsItemCard:**

```
Container:
- Background: #0F0F12
- Border-radius: 8px
- Padding: 12px
- Margin-bottom: 8px
- Cursor: pointer (abre link externo)
- Transition: all 0.15s ease

Container hover:
- Background: #18181B

Header:
- Display: flex
- Align-items: center
- Gap: 8px
- Margin-bottom: 8px

Ícone da fonte:
- 🐦 Twitter
- ▶️ YouTube  
- 📰 Globo/UOL
- Font-size: 14px

Nome do autor:
- Font-size: 13px
- Font-weight: 500
- Color: #FAFAFA

Handle (se Twitter):
- Font-size: 12px
- Color: #71717A

Timestamp:
- Font-size: 12px
- Color: #71717A
- Margin-left: auto

Conteúdo:
- Font-size: 14px
- Color: #A1A1AA
- Line-height: 1.4
- Margin-bottom: 8px
- Max 3 linhas com ellipsis

Métricas (se Twitter):
- Display: flex
- Gap: 16px
- Font-size: 12px
- Color: #71717A
- Font-family: 'JetBrains Mono', monospace

Thumbnail (se YouTube/Globo):
- Width: 100%
- Height: 120px
- Object-fit: cover
- Border-radius: 6px
- Margin-top: 8px
```

**Seção "O que estão dizendo":**

```
Título da seção:
- Font-size: 12px
- Font-weight: 600
- Color: #71717A
- Text-transform: uppercase
- Letter-spacing: 1px
- Padding: 12px 0
- Border-top: 1px solid #27272A
- Margin-top: 12px

Botão "Carregar mais":
- Width: 100%
- Padding: 12px
- Background: transparent
- Border: 1px solid #27272A
- Border-radius: 6px
- Font-size: 13px
- Color: #71717A
- Cursor: pointer

Botão hover:
- Background: #18181B
- Color: #FAFAFA
```

---

### 10.9 Variáveis de Ambiente

```env
# .env.local

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

# Cron authentication
CRON_SECRET=random_secret_string

# Opcional: Browserless para scraping mais robusto
BROWSERLESS_API_KEY=your_key
```

---

### 10.10 Dependências a Instalar

```bash
npm install puppeteer-core @sparticuz/chromium  # Para Twitter scraping
npm install xml2js                               # Para RSS parsing
npm install googleapis                           # Para YouTube API
```

---

### 10.11 Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Nitter sai do ar | Média | Ter fallback ou aceitar sem Twitter temporariamente |
| Rate limit YouTube | Baixa | Cache agressivo, reduzir frequência se precisar |
| Sites mudam estrutura | Média | Monitorar erros, ter alerta no Vercel |
| Vercel timeout (10s) | Média | Dividir scrapers em functions separadas |

---

## 11. Notas Finais

**Princípios a seguir:**
1. **Conteúdo primeiro** — usuário vê rumores imediatamente
2. **Zero fricção** — votar deve ser 1 clique
3. **Densidade de informação** — mostrar o máximo possível sem poluir
4. **Dark mode always** — mais moderno, menos cansativo
5. **Números em destaque** — porcentagens, contagens sempre visíveis
6. **Notícias agregadas** — usuário não precisa sair do app pra saber o que está rolando

**O que NÃO fazer:**
- Landing pages com "Como funciona"
- Modais desnecessários
- Explicações longas
- CTAs agressivos repetidos
- Espaços vazios sem propósito

---

*Documento criado em: Janeiro 2025*
*Versão: 2.0 — inclui monetização freemium e agregação de notícias*
