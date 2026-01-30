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
```

### 5.2 Endpoints Necessários

```
GET /api/rumores
  Query params:
    - time?: string (filtrar por time)
    - ordem?: 'quentes' | 'recentes' | 'fechando'
    - page?: number
    - limit?: number (default 20)

GET /api/rumores/:id

POST /api/rumores/:id/palpite
  Body: { palpite: 'vai' | 'nao' }
  Requer autenticação

GET /api/trending
  Retorna top 5 rumores por engajamento

GET /api/palpiteiros/top
  Retorna top 5 palpiteiros por taxa de acerto

GET /api/times
  Retorna lista de times com contagem de rumores ativos
```

---

## 6. Comportamentos Especiais

### 6.1 Visitante vs Usuário Logado

**Visitante pode:**
- Ver todos os rumores
- Ver porcentagens
- Ver influenciadores
- Filtrar por time
- Ver trending e top palpiteiros

**Visitante NÃO pode:**
- Votar (pede login)
- Comentar (pede login)

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

## 8. Checklist de Implementação

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

### Fase 3: Interações
- [ ] Implementar voto com feedback
- [ ] Implementar atualização de porcentagens
- [ ] Implementar scroll infinito
- [ ] Implementar estados de loading

### Fase 4: Responsividade
- [ ] Implementar breakpoint tablet
- [ ] Implementar breakpoint mobile
- [ ] Implementar bottom navigation mobile

### Fase 5: Polish
- [ ] Adicionar animações e transições
- [ ] Testar em diferentes navegadores
- [ ] Otimizar performance
- [ ] Adicionar analytics de eventos

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

*Documento criado em: Janeiro 2025*
*Versão: 1.0*
