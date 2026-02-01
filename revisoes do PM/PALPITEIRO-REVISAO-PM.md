# Revisão de PM: Site ao Vivo vs PRD v3

**Data:** 31 Janeiro 2026
**URL revisada:** https://palpiteiro-mvp.vercel.app/feed
**Commit revisado:** faaced8

---

## Resumo

O Claude Code entregou a base: dois eixos separados, emojis no banco, jornalistas com credibilidade, dark mode, escudos reais. Mas a UI do feed ainda não reflete o PRD v3 em pontos fundamentais. Abaixo está tudo que precisa mudar, organizado por gravidade.

---

## 🔴 BLOCKERS — Contradizem o PRD v3 diretamente

### BUG-001: "Top Palpiteiros" com ranking de pontos

**O que o site mostra:**
```
🏆 Top Palpiteiros
@torcedor_demo · 1430 pontos
@joao_peixe · 1250 pontos
@ana_verdao · 1100 pontos
```

**O que o PRD v3 diz (seção 16):**
> O que NÃO fazer: Ranking pessoal de "quem acerta mais" entre torcedores

**Ação:** Remover a seção "Top Palpiteiros" inteira. Substituir por **"🏆 Top Fontes"** — o ranking de jornalistas por taxa de acerto (PRD v3, seção 7). Mostar os top 5 jornalistas com nome + % acerto + total de previsões. Exemplo:

```
🏆 Top Fontes
1. Venê Casagrande    92% (114 previsões)
2. Raisa Simplicio     88% (67 previsões)
3. Mauro Cezar        82% (93 previsões)
4. Jorge Nicola       78% (105 previsões)
5. Flazoeiro          72% (48 previsões)
```

---

### BUG-002: Sentimento mostra score numérico (+0.6) em vez de barra de emojis

**O que o site mostra:**
```
Sentimento da Torcida +0.6
```

**O que o PRD v3 diz (seção 5.2):**
```
🔥 42%  😍 28%  😐 12%  👎 11%  💀 7%
████████████████████░░░░░░░░░░░░░░
         SENTIMENTO: +1.4 (positivo)
         12.300 reações
```

O score numérico (+0.6, +1.3, -0.2, -0.7) é output interno do ALG-002. O torcedor não sabe o que "+0.6" significa. Ele precisa ver a DISTRIBUIÇÃO visual dos emojis.

**Ação:** Substituir o score numérico por uma barra horizontal segmentada mostrando a % de cada emoji. O score pode aparecer como label descritivo embaixo ("Sentimento: positivo" em vez de "+0.6"). Barra usa as cores definidas no PRD:

```
🔥 #F97316  |  😍 #10B981  |  😐 #71717A  |  👎 #EF4444  |  💀 #7C3AED
```

Cada segmento proporcional à % de reações daquele emoji. Abaixo da barra: "X reações".

---

### BUG-003: Reações aparecem como contagem mínima no rodapé, não como barra interativa

**O que o site mostra:**
```
🔥2 😍3    +    5 reações
```

Pequeno, no canto, quase invisível. Os emojis parecem decoração, não o mecanismo central de interação.

**O que o PRD v3 diz (seção 5.1):**
> O torcedor reage UMA VEZ por rumor (pode mudar depois).
> Zero fricção — reagir é 1 toque (emoji).

**Ação:** Os 5 emojis precisam ser BOTÕES clicáveis proeminentes no card. Não escondidos no rodapé. Possível layout:

```
[🔥]  [😍]  [😐]  [👎]  [💀]
 42%   28%   12%   11%    7%
```

Cada emoji é um botão. Ao clicar, registra a reação (ou muda se já reagiu). O emoji selecionado fica highlighted. As porcentagens atualizam em tempo real. Isso deve ficar logo abaixo da barra de sentimento (BUG-002), formando um bloco visual coeso.

---

### BUG-004: Preço do paywall errado

**O que o site mostra:**
```
✨ Liberar todos
R$ 29,90/mês
```

**O que a estratégia define:** R$14,90/mês ou R$119/ano.

**Ação:** Mudar pra R$14,90/mês. Ou remover o preço se não vai ter checkout no MVP.

---

### BUG-005: Probabilidade escondida, sentimento domina visualmente

**O problema:** A probabilidade aparece como "📰65%" pequeno no canto superior do card, quase como metadata. O sentimento tem label próprio ("Sentimento da Torcida") + score (+0.6) e ocupa mais espaço visual. Resultado: parece que o sentimento é o dado principal e a probabilidade é acessório.

**O que o PRD v3 diz (seção 16, princípio 1):**
> Algoritmo primeiro — o número de probabilidade é o produto, não um feature

Os dois eixos precisam de PESO VISUAL IGUAL. A probabilidade é tão importante quanto o sentimento — são dois dados de natureza diferente que juntos geram o valor do produto.

**Ação:** Redesenhar o card com dois blocos lado a lado de tamanho e peso igual. Referência direta: o protótipo `v3-dual-indicators.jsx` que já resolveu isso.

Layout sugerido:

```
┌─────────────────────────────────────────────────────┐
│ REFORÇO · Flamengo · 26min                     🔥   │
│                                                      │
│ Claudinho volta ao Brasil pelo Flamengo?             │
│                                                      │
│ ┌──────────────────┐  ┌──────────────────┐          │
│ │ 📰 PROBABILIDADE │  │ 👥 SENTIMENTO    │          │
│ │                  │  │                  │          │
│ │    65%  ↑        │  │ 🔥40% 😍35%     │          │
│ │ ████████░░░░░░░░ │  │ 😐10% 👎10% 💀5%│          │
│ │ 3 fontes · alta  │  │ 156 reações      │          │
│ └──────────────────┘  └──────────────────┘          │
│                                                      │
│ ⚡ Torcida 15% mais otimista que a mídia             │
│                                                      │
│ Venê ✓ 92%  ·  Raisa ✓ 88%  ·  Flazoeiro ✓ 72%    │
│                                                      │
│ [🔥] [😍] [😐] [👎] [💀]    💬 12  📤 Compartilhar │
└─────────────────────────────────────────────────────┘
```

Regras visuais:
- Ambos os blocos têm mesma largura (50/50)
- Ambos têm mesma tipografia (número grande em JetBrains Mono)
- Ambos têm barra de progresso
- Probabilidade: barra única colorida por valor (verde > 60%, amarelo 40-60%, vermelho < 40%)
- Sentimento: barra segmentada por emoji com as cores do PRD (🔥 #F97316, 😍 #10B981, 😐 #71717A, 👎 #EF4444, 💀 #7C3AED)
- Linha de divergência abaixo dos dois blocos (só aparece se destaque = true)

Isso resolve BUG-005 (probabilidade escondida), BUG-002 (score numérico) e BUG-003 (emojis no rodapé) de uma vez só. É a mudança mais importante do card.

---

## 🟡 FALTANDO — Features do PRD v3 que não foram implementadas

### FEAT-001: Visão cross-torcida (PRD v3, seção 5.3)

O site mostra sentimento de uma torcida só. O PRD define que rumores com 2 times envolvidos mostram sentimento de AMBAS as torcidas.

Exemplo no card "Claudinho volta ao Brasil pelo Flamengo":
```
Sentimento Flamengo: 🔥42% 😍28% 😐12% 👎11% 💀7%
Sentimento [time origem]: 💀38% 👎30% 😐15% 😍12% 🔥5%
```

**Ação:** Pra rumores com timeOrigem e timeDestino, mostrar duas barras de sentimento, uma pra cada torcida. O torcedor do time principal vê a sua primeiro. Label: "Sentimento Flamengo" + "Sentimento [outro time]". Torcida rival pode ter cadeado (🔒) pro tier gratuito — limitar a 3 visualizações/dia conforme estratégia.

---

### FEAT-002: Badge de divergência (PRD v3, seção 6 — ALG-003)

O PRD define 4 cenários de divergência quando os dois eixos discordam:

| Cenário | Condição | Badge |
|---------|----------|-------|
| Sonhando | Prob baixa + torcida positiva | 🌟 |
| Resignados | Prob alta + torcida negativa | 😤 |
| Alinhados + | Ambos altos | ✅ |
| Alinhados - | Ambos baixos | 🤝 |

Badge ⚡ DIVERGÊNCIA quando divergem >= 25 pontos.

**O que o site mostra:** Nada disso. Não tem badge de divergência nos cards.

**Ação:** Calcular divergência (ALG-003) pra cada rumor. Se destaque = true (>= 25 pontos), mostrar badge no card: "⚡ Torcida quer, mas mídia diz 32% de chance" ou "⚡ 82% de chance, mas torcida em 💀". Destacar esses cards visualmente (borda dourada ou fundo sutil).

---

### FEAT-003: Card expandido com detalhes das fontes (PRD v3, seção 7.4)

O site mostra jornalistas inline no card: "Venê ✓ VAI 92%". Mas não tem card expandido com:
- Detalhe do que cada jornalista disse (citação)
- Timestamp de quando disse
- Posição classificada (confirma/nega/neutro) + intensidade (crava/afirma/especula)

**O que o PRD v3 define (seção 7.4):**
```
✓ Venê Casagrande · 86% acerto · "Jair está encaminhado"
```

**Ação:** Ao clicar num rumor, expandir com:
1. Seção "📰 Fontes" — cada jornalista com posição, intensidade, citação, data, % acerto
2. Seção "📊 Histórico" — como a probabilidade evoluiu ao longo do tempo (gráfico simples se possível, lista de mudanças se não)

---

### FEAT-004: Categorias faltando (PRD v3, seção 4)

**Site implementa:** Tags visíveis no feed (pelo menos REFORÇO, SAÍDA — os seeds visíveis são todos dessas categorias ou sem tag).

**PRD define 10:** REFORÇO, SAÍDA, RENOVAÇÃO, COMISSÃO, ESCALAÇÃO, LESÃO, SELEÇÃO, PRÊMIO, CLUBE, DISCIPLINA.

**Ação:** Garantir que o enum CategoriaRumor no schema tem todas as 10. Adicionar seeds de rumores de categorias variadas (pelo menos 1 COMISSÃO, 1 ESCALAÇÃO, 1 RENOVAÇÃO) pra feed não parecer monotemático. Tabela de expiração automática por categoria (PRD seção 4).

---

### FEAT-005: Sistema de notificações (PRD v3, seção 8)

Nenhuma evidência de push notifications no site.

**O que o PRD define:**
- Push quando rumor que reagi muda de probabilidade
- Push quando rumor é resolvido
- Push quando jornalista tier 1 crava algo do meu time
- Push quando divergência explode
- Máximo 5/dia, respeitar horário 23h-7h

**Ação:** Implementar ao menos a permissão de notificação (browser Notification API) e o trigger básico: "probabilidade mudou > 10 pontos" e "rumor resolvido". O resto pode vir depois, mas a permissão e infra base precisam existir.

---

### FEAT-006: Compartilhamento (PRD v3, seção 9)

Não vejo botão de compartilhar em nenhum card no feed.

**O que o PRD define:**
- Botão de share em cada card (WhatsApp, X, copiar link)
- Card estático PNG gerado server-side (OG image)
- Deep link que abre o rumor (funciona sem login)

**Ação mínima:** Adicionar botão de share em cada card com:
1. Link copiável (`/rumor/{id}`)
2. Intent do WhatsApp (`https://wa.me/?text=...`)
3. Intent do X (`https://twitter.com/intent/tweet?text=...&url=...`)

OG image server-side (via `@vercel/og` ou Satori) é desejável mas pode ser fase 2. No mínimo, meta tags OG no `/rumor/{id}` com título + descrição + probabilidade.

---

### FEAT-007: Integração #palpiteiros no X (PRD v3, seção 10)

Não implementado. O pipeline de ingestão de tweets com hashtag #palpiteiros não existe.

**Ação:** Isso depende da X API paga. Se já tem acesso, implementar o pipeline mínimo:
1. Cron a cada 30min busca tweets com #palpiteiros
2. Filtro de segurança (whitelist approach — PRD seção 10.3)
3. Associa ao rumor relevante
4. Exibe no card expandido: "💬 O que a torcida tá dizendo"

Se não tem acesso à X API ainda, criar a UI placeholder com CTA "Poste com #palpiteiros no X pra aparecer aqui" e implementar o backend quando a API estiver disponível.

---

### FEAT-008: Ciclo de vida dos rumores (PRD v3, seção 3.3)

Não vejo evidência de resolução de rumores: badges "✅ CONFIRMADO" ou "❌ NÃO ROLOU", aba de histórico, card de resultado compartilhável.

**Ação:**
1. Status CONFIRMADO e DESMENTIDO no schema (se já existe no enum, implementar na UI)
2. Badge visual no card quando resolvido
3. Card de resultado: "✅ CONFIRMADO — Probabilidade final: 65% | Torcida: 🔥72%"
4. Filtro: feed principal mostra APENAS status = ABERTO
5. Seção ou filtro "Histórico" pra ver resolvidos

---

### FEAT-009: Filtro anti-consenso (PRD v3, seção 3.2)

Não vejo validação de que rumores no feed geram divisão real de opinião.

**Ação:** Antes de publicar rumor, estimar se terá pelo menos 20% de reações em cada extremo. Se for provável que 90%+ reajam igual, reformular ou não publicar. Implementar como check no admin/criação de rumor.

---

## 🟢 AJUSTES MENORES

### AJUSTE-001: Seeds precisam de variação

Todos os rumores mostram "5 reações" e "26min". Parece artificial.

**Ação:** Variar o seed:
- Distribuições diferentes por rumor (uns mais 🔥, uns mais 💀, uns divididos)
- Quantidades diferentes (entre 10 e 200 reações)
- Timestamps variados (entre 1h e 3 dias atrás)
- Pelo menos 1 rumor com divergência alta (prob > 70% e sentimento negativo, ou vice-versa)

---

### AJUSTE-002: Trending sidebar repete mesma informação

A sidebar "📈 Trending" mostra os mesmos rumores do feed com menos info. Não adiciona valor.

**Ação:** Ou transformar em algo útil (top rumores por VELOCIDADE de reações, não por probabilidade) ou substituir por outra coisa do PRD v3:
- "⚡ Maiores divergências" — rumores onde mídia e torcida mais discordam
- "📅 Fechando logo" — rumores que expiram em breve
- "🔥 Esquentando" — rumores com mais reações nas últimas 2h

---

### AJUSTE-003: Faltam 4 categorias de rumor no enum/seed

PRD define 10 categorias. Garantir que LESÃO, SELEÇÃO, PRÊMIO e DISCIPLINA existem no enum e adicionar pelo menos 1 seed de cada das categorias que faltam.

---

## Ordem de execução sugerida

| # | Task | Impacto | Esforço |
|---|------|---------|---------|
| 1 | **BUG-005: Dois blocos lado a lado (probabilidade + sentimento com peso igual)** — resolve BUG-002 e BUG-003 junto | Crítico | Alto |
| 2 | BUG-001: Tirar Top Palpiteiros, colocar Top Fontes | Alto | Baixo |
| 3 | BUG-004: Preço R$14,90 | Alto | Baixo |
| 4 | AJUSTE-001: Variar seeds | Médio | Baixo |
| 5 | FEAT-002: Badge de divergência nos cards | Alto | Médio |
| 6 | FEAT-001: Visão cross-torcida (duas barras de sentimento) | Alto | Médio |
| 7 | FEAT-006: Botões de compartilhamento | Alto | Médio |
| 8 | FEAT-003: Card expandido com fontes detalhadas | Médio | Médio |
| 9 | FEAT-004: Todas as 10 categorias + seeds variados | Médio | Baixo |
| 10 | AJUSTE-002: Trending → Divergências ou Esquentando | Baixo | Baixo |
| 11 | FEAT-008: Ciclo de vida (resolvido/histórico) | Médio | Médio |
| 12 | FEAT-005: Notificações (permissão + trigger básico) | Médio | Médio |
| 13 | FEAT-007: Integração #palpiteiros X | Médio | Alto |
| 14 | FEAT-009: Filtro anti-consenso | Baixo | Baixo |

**Item 1 é A mudança.** Resolve 3 bugs de uma vez e muda completamente como o produto é percebido. Os dois eixos ficam iguais em importância visual, os emojis viram botões clicáveis, e a barra de sentimento substitui o score numérico.

---

*Revisão de PM — Janeiro 2026*
