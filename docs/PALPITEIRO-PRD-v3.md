# PRD: Palpiteiro v3 — Termômetro Público de Rumores Esportivos

**Versão:** 3.0
**Data:** 31 Janeiro 2026
**Status:** Em definição

---

## 1. Visão do Produto

O Palpiteiro é o primeiro portal analítico de rumores esportivos do Brasil. Combina duas coisas que não existem hoje em nenhum lugar:

1. **O melhor algoritmo de previsão de rumores esportivos do Brasil** — consolida todas as fontes jornalísticas num único indicador de probabilidade, ponderado pela credibilidade comprovada de cada fonte.
2. **A voz quantificada da torcida** — transforma a opinião de milhões de torcedores em dados estruturados sobre o que eles QUEREM que aconteça.

**Filosofia central:** O Palpiteiro é sobre ANTECIPAÇÃO, não sobre notícias. O torcedor vem aqui pra saber o que VAI acontecer antes de todo mundo e expressar o que QUER que aconteça.

**O que o Palpiteiro NÃO é:**
- Não é casa de apostas (sem moedas, sem stakes, sem multiplicadores)
- Não é rede social (sem timeline, sem amigos, sem DMs)
- Não é portal de notícias (sem matérias, sem redação)

**Referências visuais:**
- Twitter/X (layout 3 colunas, feed infinito, densidade de informação)
- Slack (sistema de reações com emojis)
- Polymarket (cards com indicadores de probabilidade, dark mode)

---

## 2. Dois Eixos Fundamentais (NUNCA se misturam)

### Eixo 1: O QUE VAI ACONTECER (Algoritmo de Previsão)

**Quem alimenta:** Jornalistas, influenciadores, veículos de mídia, fontes oficiais.
**O que mede:** Probabilidade real de um rumor acontecer, baseada em INFORMAÇÃO.
**Pergunta central:** "O que as fontes SABEM?"

Este eixo é 100% algorítmico. Nenhum voto de torcedor entra nesse cálculo. A credibilidade de cada fonte é medida pelo histórico de acerto e ajustada automaticamente.

### Eixo 2: O QUE A TORCIDA QUER (Sentimento Popular)

**Quem alimenta:** Torcedores (usuários do app).
**O que mede:** O que a torcida DESEJA que aconteça (não o que acha que vai acontecer).
**Pergunta central:** "O que vocês QUEREM?"

Este eixo é 100% popular. Nenhuma análise jornalística entra nesse cálculo. O torcedor reage com emojis numa escala de sentimento.

### Por que separar?

São sinais completamente diferentes. Jornalista dizendo "85% de chance" é informação. Torcida reagindo com 🔥 é desejo. Misturar destrói ambos.

O valor máximo do produto está na DIVERGÊNCIA entre os dois:
- "85% de chance de acontecer, mas 60% da torcida não quer" → dado poderoso
- "15% de chance, mas a torcida tá em 🔥" → a galera tá sonhando
- "90% de chance e 90% 🔥" → todo mundo alinhado, esse vai dar bom

Essa divergência é informação que NINGUÉM tem hoje. Nenhum clube, nenhum empresário, nenhum veículo.

---

## 3. Regras de Conteúdo

### 3.1 Só presente e futuro

O feed mostra APENAS rumores em aberto — coisas que ainda podem ou não acontecer.

**NUNCA no feed:**
- Transferências já confirmadas/anunciadas
- Negociações que já caíram definitivamente
- Rumores sobre coisas que já aconteceram
- Jogadores já apresentados

**SEMPRE no feed:**
- Rumores de transferências em negociação
- Sondagens e interesses de clubes
- Especulações com fontes jornalísticas
- Possíveis saídas em andamento
- Qualquer outro tipo de rumor em aberto (ver categorias na seção 4)

### 3.2 Filtro anti-consenso óbvio

O feed NÃO deve conter rumores onde 100% da torcida terá a mesma opinião.

**Exemplos que NÃO entram:**
- "Flamengo ganha o jogo?" → 100% dos flamenguistas querem que sim
- "Seu time é rebaixado?" → 100% não querem

**Exemplos que ENTRAM (geram divisão):**
- "Filipe Luís deveria escalar Paquetá como titular?" → divide opinião
- "Fla deveria aceitar proposta de 40M pelo jogador X?" → divide opinião
- "Arrascaeta deveria ser convocado pra seleção?" → divide (torcedor não quer perder ele)

**Regra do algoritmo:** antes de publicar, estimar se o rumor terá pelo menos 20% de reações em cada extremo da escala. Se for provável que 90%+ reaja igual, reformular a pergunta ou não publicar.

### 3.3 Ciclo de vida dos rumores

**Quando um rumor é resolvido (confirmado ou desmentido):**

1. Momento da resolução — Card recebe badge "✅ CONFIRMADO" ou "❌ NÃO ROLOU". Notificação push pra quem reagiu. Card de resultado compartilhável é gerado.

2. Após 24 horas — Rumor sai do feed principal. Vai pra aba "Histórico". Fica disponível nas estatísticas.

3. Regra do algoritmo — Rumores resolvidos recebem score = 0 no feed. Filtrar com `WHERE status = 'aberto'` em TODA query.

```typescript
// REGRA ABSOLUTA: feed só mostra rumores em aberto
const rumoresDoFeed = await prisma.rumor.findMany({
  where: { status: 'aberto' },
  orderBy: { relevancia: 'desc' },
});
```

4. Detecção de resolução — Scraper detecta palavras de confirmação ("oficializado", "anunciado", "apresentado") de fonte confiável. Admin confirma manualmente (ou automático se 3+ fontes confiáveis confirmam). Timer de 24h pra sair do feed.

---

## 4. Categorias de Rumores

A janela de transferências dura ~2 meses por semestre. O app precisa cobrir TUDO que o torcedor quer prever. O feed SEMPRE terá conteúdo.

| Categoria | Tag no card | Exemplos | Quando mais ativo |
|-----------|------------|----------|-------------------|
| Transferência (entrada) | `REFORÇO` | "Fla fecha com Jair do Forest?" | Jan-Mar, Jun-Ago |
| Transferência (saída) | `SAÍDA` | "Allan vai pro Corinthians?" | Jan-Mar, Jun-Ago |
| Renovação de contrato | `RENOVAÇÃO` | "Arrascaeta renova até 2028?" | O ano todo |
| Demissão/contratação de técnico | `COMISSÃO` | "Filipe Luís cai se perder o clássico?" | Após derrotas |
| Escalação de jogo | `ESCALAÇÃO` | "Paquetá é titular na Supercopa?" | Antes de jogos |
| Lesão/recuperação | `LESÃO` | "Arrascaeta volta pro Fla-Flu?" | O ano todo |
| Convocação seleção | `SELEÇÃO` | "Paquetá vai pra Copa?" | Datas FIFA |
| Premiação individual | `PRÊMIO` | "Arrascaeta ganha Bola de Ouro?" | Final de temporada |
| Decisão institucional | `CLUBE` | "Fla troca fornecedor de material?" | Esporádico |
| Punição/julgamento | `DISCIPLINA` | "STJD mantém suspensão?" | Esporádico |

**Calendário (o app nunca fica vazio):**

```
JAN-MAR: Janela aberta → Reforços, Saídas, Renovações
MAR-MAI: Campeonatos esquentam → Escalação, Comissão, Lesões
JUN-AGO: Janela do meio + seleções → Reforços, Saídas, Seleção
AGO-NOV: Reta final → Escalações decisivas, Comissão (demissões)
NOV-DEZ: Pós-temporada → Renovações, Saídas, Comissão para próximo ano
```

### Expiração automática por categoria

Cada tipo tem uma vida útil natural. Se não for resolvido antes, expira automaticamente:

```typescript
const EXPIRACAO_DIAS: Record<CategoriaRumor, number> = {
  reforco:     90,
  saida:       90,
  renovacao:   60,
  comissao:    30,
  escalacao:    1,   // expira no fim do jogo
  lesao:       30,
  selecao:     14,
  premio:      14,
  clube:       60,
  disciplina:  30,
};
```

---

## 5. Sistema de Reações (Emojis)

### 5.1 Os 5 emojis universais

Todas as categorias de rumor usam o MESMO set de 5 emojis. O torcedor reage UMA VEZ por rumor (pode mudar depois).

| Emoji | Significado implícito | Valor na escala |
|-------|----------------------|-----------------|
| 🔥 | Quero muito / Amo a ideia | +2 |
| 😍 | Gosto / Apoio | +1 |
| 😐 | Neutro / Tanto faz | 0 |
| 👎 | Não gosto / Contra | -1 |
| 💀 | Péssima ideia / De jeito nenhum | -2 |

### 5.2 Barra de sentimento coletivo

As reações são agregadas numa barra visual de sentimento, mostrando a distribuição de cada emoji:

```
🔥 42%  😍 28%  😐 12%  👎 11%  💀 7%
████████████████████░░░░░░░░░░░░░░
         SENTIMENTO: +1.4 (positivo)
         12.300 reações
```

**Score de sentimento:** média ponderada dos valores (-2 a +2).
- +2.0 a +1.0 = Positivo forte
- +1.0 a +0.3 = Positivo
- +0.3 a -0.3 = Dividido
- -0.3 a -1.0 = Negativo
- -1.0 a -2.0 = Negativo forte

### 5.3 Visão multi-torcida

O MESMO RUMOR aparece no feed de cada time envolvido, mas com o sentimento SEPARADO por torcida.

**Exemplo: "Kaio Jorge sai do Cruzeiro pro Flamengo?"**

Na página do Flamengo:
```
📰 Probabilidade: 35%
Sentimento Flamengo: 🔥42% 😍28% 😐12% 👎11% 💀7% → Score +1.4
Sentimento Cruzeiro: 💀38% 👎30% 😐15% 😍12% 🔥5% → Score -1.2
```

Na página do Cruzeiro:
```
📰 Probabilidade: 35% (mesma — é o mesmo rumor)
Sentimento Cruzeiro: 💀38% 👎30% 😐15% 😍12% 🔥5% → Score -1.2
Sentimento Flamengo: 🔥42% 😍28% 😐12% 👎11% 💀7% → Score +1.4
```

**Cada torcida vê sua reação primeiro, mas pode ver a do rival.** Isso gera zoeira, screenshot, viralidade.

### 5.4 Schema do banco de dados

```typescript
model Reacao {
  id         String   @id @default(cuid())
  userId     String
  rumorId    String
  timeId     String   // time que o torcedor torce
  emoji      Emoji    // FOGO, AMOR, NEUTRO, NAO_GOSTO, PESSIMO
  criadoEm   DateTime @default(now())
  atualizadoEm DateTime @updatedAt

  @@unique([userId, rumorId])  // uma reação por usuário por rumor
}

enum Emoji {
  FOGO         // 🔥 valor +2
  AMOR         // 😍 valor +1
  NEUTRO       // 😐 valor 0
  NAO_GOSTO    // 👎 valor -1
  PESSIMO      // 💀 valor -2
}
```

---

## 6. Algoritmos Técnicos

### ALG-001: Probabilidade Real (O que VAI acontecer)

**Alimentado APENAS por fontes jornalísticas. Zero input de torcedor.**

```typescript
interface FonteInput {
  tipo: 'jornalista' | 'veiculo' | 'clube_oficial' | 'agente';
  nome: string;
  credibilidade: number;            // 0-100, começa por seguidores, refina por acerto
  posicao: 'confirma' | 'nega' | 'neutro';
  intensidade: 'especula' | 'afirma' | 'crava';
  dataPublicacao: Date;
}

function calcularProbabilidadeReal(fontes: FonteInput[]): number {
  let scorePonderado = 0;
  let pesoTotal = 0;

  for (const fonte of fontes) {
    // Peso base = credibilidade da fonte (0-1)
    let peso = fonte.credibilidade / 100;

    // Multiplicador por tipo
    const multTipo = {
      clube_oficial: 3.0,   // comunicado oficial tem peso máximo
      agente:        2.0,   // empresário do jogador
      jornalista:    1.5,   // depende do histórico
      veiculo:       1.0,   // veículo sem autor específico
    };
    peso *= multTipo[fonte.tipo] || 1.0;

    // Multiplicador por intensidade
    const multIntensidade = {
      crava:     1.5,   // "FECHADO", "VAI ASSINAR"
      afirma:    1.2,   // "Está encaminhado"
      especula:  0.8,   // "Existe a possibilidade"
    };
    peso *= multIntensidade[fonte.intensidade] || 1.0;

    // Decay temporal: half-life de 3 dias
    const horas = (Date.now() - fonte.dataPublicacao.getTime()) / 3600000;
    peso *= Math.pow(0.5, horas / 72);

    // Direção
    const direcao = fonte.posicao === 'confirma' ? 1 : fonte.posicao === 'nega' ? -1 : 0;

    scorePonderado += direcao * peso;
    pesoTotal += peso;
  }

  // Normalizar para 0-100
  let score = pesoTotal > 0 ? scorePonderado / pesoTotal : 0;
  let porcentagem = Math.round((score + 1) * 50);

  // Clampar entre 3-97 (nunca 0% nem 100% enquanto aberto)
  return Math.max(3, Math.min(97, porcentagem));
}
```

### ALG-002: Sentimento da Torcida (O que QUEREM)

**Alimentado APENAS por reações dos torcedores. Zero input jornalístico.**

```typescript
const VALOR_EMOJI = { FOGO: 2, AMOR: 1, NEUTRO: 0, NAO_GOSTO: -1, PESSIMO: -2 };

interface SentimentoOutput {
  score: number;                    // -2.0 a +2.0
  label: 'positivo_forte' | 'positivo' | 'dividido' | 'negativo' | 'negativo_forte';
  distribuicao: Record<Emoji, number>;  // contagem por emoji
  totalReacoes: number;
}

function calcularSentimento(reacoes: Reacao[], timeId: string): SentimentoOutput {
  // Filtrar reações do time específico
  const reacoesDoTime = reacoes.filter(r => r.timeId === timeId);
  const total = reacoesDoTime.length;

  if (total === 0) {
    return { score: 0, label: 'dividido', distribuicao: { FOGO: 0, AMOR: 0, NEUTRO: 0, NAO_GOSTO: 0, PESSIMO: 0 }, totalReacoes: 0 };
  }

  // Contar por emoji
  const distribuicao = { FOGO: 0, AMOR: 0, NEUTRO: 0, NAO_GOSTO: 0, PESSIMO: 0 };
  let somaValores = 0;

  for (const reacao of reacoesDoTime) {
    distribuicao[reacao.emoji]++;
    somaValores += VALOR_EMOJI[reacao.emoji];
  }

  const score = Math.round((somaValores / total) * 100) / 100;

  const label =
    score >= 1.0  ? 'positivo_forte' :
    score >= 0.3  ? 'positivo' :
    score >= -0.3 ? 'dividido' :
    score >= -1.0 ? 'negativo' :
    'negativo_forte';

  return { score, label, distribuicao, totalReacoes: total };
}
```

### ALG-003: Divergência (o motor de viralidade)

**Compara o que VAI acontecer com o que a torcida QUER.**

```typescript
interface DivergenciaOutput {
  tipo: 'sonhando' | 'resignados' | 'alinhados_positivo' | 'alinhados_negativo' | 'neutro';
  mensagem: string;
  destaque: boolean;  // se ganha badge ⚡ no card
}

function calcularDivergencia(
  probabilidade: number,      // 0-100 (ALG-001)
  sentimento: number,         // -2 a +2 (ALG-002)
): DivergenciaOutput {

  // Normalizar sentimento pra 0-100 pra comparar
  // -2 = 0, 0 = 50, +2 = 100
  const sentimentoNorm = (sentimento + 2) * 25;

  const diff = sentimentoNorm - probabilidade;
  const absDiff = Math.abs(diff);

  // Destaque se divergem mais que 25 pontos
  const destaque = absDiff >= 25;

  let tipo: DivergenciaOutput['tipo'];
  let mensagem: string;

  if (absDiff < 15) {
    // Alinhados
    if (probabilidade > 55 && sentimentoNorm > 55) {
      tipo = 'alinhados_positivo';
      mensagem = 'Mídia e torcida alinhadas — vai rolar';
    } else if (probabilidade < 45 && sentimentoNorm < 45) {
      tipo = 'alinhados_negativo';
      mensagem = 'Mídia e torcida alinhadas — não vai rolar';
    } else {
      tipo = 'neutro';
      mensagem = 'Cenário indefinido';
    }
  } else if (diff > 0) {
    // Torcida mais positiva que a mídia
    tipo = 'sonhando';
    mensagem = `Torcida quer, mas mídia diz ${probabilidade}% de chance`;
  } else {
    // Mídia mais positiva que a torcida
    tipo = 'resignados';
    mensagem = `${probabilidade}% de chance, mas torcida não quer`;
  }

  return { tipo, mensagem, destaque };
}
```

**Os 4 cenários de divergência e por que são virais:**

| Cenário | Probabilidade | Sentimento | Mensagem | Por que viraliza |
|---------|--------------|------------|----------|------------------|
| 🌟 Sonhando | 15% | 🔥🔥 | "Torcida quer, mídia diz que não" | Torcedor compartilha pra pressionar |
| 😤 Resignados | 85% | 💀💀 | "Vai acontecer, mas ninguém quer" | Torcedor compartilha pra reclamar |
| ✅ Alinhados + | 80% | 🔥🔥 | "Tudo indica que vai, e a galera quer" | Celebração antecipada |
| 🤝 Alinhados - | 10% | 👎👎 | "Não vai rolar, e ninguém queria mesmo" | Alívio coletivo |

### ALG-004: Relevância do Feed (Ranking de cards)

**Objetivo:** Ordenar os rumores no feed. Os mais relevantes aparecem primeiro.

```typescript
function calcularRelevancia(input: {
  // Engajamento
  totalReacoes: number;
  reacoesUltimas24h: number;

  // Tempo
  criadoEm: Date;
  ultimaAtividade: Date;

  // Fontes
  qtdFontes: number;
  fonteConfiavel: boolean;
  qtdNoticias24h: number;

  // Divisão (quanto mais dividido, mais interessante)
  divisaoSentimento: number;     // 0-1, onde 1 = perfeitamente dividido

  // Divergência entre eixos
  divergenciaDestaque: boolean;
  divergenciaAbs: number;        // 0-100

  // Cross-torcida
  reacoesRival: number;          // se torcida rival tá reagindo, é quente
}): number {

  const agora = Date.now();

  // 1. DECAY TEMPORAL (half-life de 48h)
  const horas = (agora - input.ultimaAtividade.getTime()) / 3600000;
  const decay = Math.pow(0.5, horas / 48);

  // 2. ENGAJAMENTO
  const scoreEngajamento =
    Math.log10(input.totalReacoes + 1) * 10 +
    Math.log10(input.reacoesUltimas24h + 1) * 20;

  // 3. CREDIBILIDADE DAS FONTES
  const scoreFontes =
    (input.qtdFontes * 5) +
    (input.fonteConfiavel ? 20 : 0) +
    (input.qtdNoticias24h * 3);

  // 4. DIVISÃO DE SENTIMENTO (rumores divididos são mais interessantes)
  const scoreDivisao = input.divisaoSentimento * 25;

  // 5. DIVERGÊNCIA (boost quando eixos discordam)
  const boostDivergencia = input.divergenciaDestaque ? (input.divergenciaAbs * 0.4) : 0;

  // 6. BOOST CROSS-TORCIDA (rival reagindo = viral)
  const boostRival = Math.log10(input.reacoesRival + 1) * 8;

  // 7. BOOST NOVO (primeiras 6 horas)
  const horasDesdeCreacao = (agora - input.criadoEm.getTime()) / 3600000;
  const boostNovo = horasDesdeCreacao < 6 ? 20 : 0;

  const scoreBase = scoreEngajamento + scoreFontes + scoreDivisao + boostDivergencia + boostRival + boostNovo;
  return Math.round(scoreBase * decay * 100) / 100;
}
```

### ALG-005: Sentiment Analysis de Notícias

Analisa o texto de cada notícia/tweet pra determinar se a fonte está confirmando ou negando o rumor. Alimenta o `posicao` de cada `FonteInput` no ALG-001.

```typescript
const PALAVRAS_CONFIRMA = [
  'encaminhado', 'fechado', 'acertado', 'vai assinar', 'acordo verbal',
  'exames marcados', 'deve ser anunciado', 'proposta aceita', 'negociação avançada',
  'tem acordo', 'vai fechar', 'praticamente definido', 'questão de tempo',
];

const PALAVRAS_NEGA = [
  'esfriou', 'não avança', 'descartado', 'desistiu', 'valores distantes',
  'sem acordo', 'não vai', 'caiu', 'inviável', 'fora do orçamento',
  'negou', 'desmentiu', 'não procede',
];

const PALAVRAS_INTENSIDADE_ALTA = [
  'confirmado', 'fechado', 'certo', 'oficial', 'assinado',
  'CRAVA', 'garante', 'certeza',
];

function analisarTexto(texto: string): { posicao: string; intensidade: string } {
  const lower = texto.toLowerCase();

  const matchesConfirma = PALAVRAS_CONFIRMA.filter(p => lower.includes(p)).length;
  const matchesNega = PALAVRAS_NEGA.filter(p => lower.includes(p)).length;
  const temIntensidadeAlta = PALAVRAS_INTENSIDADE_ALTA.some(p => lower.includes(p));

  const posicao = matchesConfirma > matchesNega ? 'confirma' : matchesNega > matchesConfirma ? 'nega' : 'neutro';
  const intensidade = temIntensidadeAlta ? 'crava' : (matchesConfirma + matchesNega >= 2) ? 'afirma' : 'especula';

  return { posicao, intensidade };
}
```

---

## 7. Ranking de Credibilidade de Jornalistas

### 7.1 Filosofia

**Premiar quem acerta. Ignorar quem erra.** Foco no positivo.

O Palpiteiro quer que jornalistas sejam apreciados por falar a verdade. Os que mais acertam sobem no ranking e o conteúdo deles tem mais peso no algoritmo de previsão. É um ciclo virtuoso — jornalista bom ganha visibilidade, o que melhora o algoritmo, o que dá credibilidade ao app.

Nenhum jornalista é exposto com score baixo. O ranking mostra apenas o top — quem não está lá simplesmente não aparece.

### 7.2 Cold start por popularidade

No dia 1, sem histórico de acerto, usamos SEGUIDORES como proxy de credibilidade:

```typescript
function credibilidadeInicial(seguidores: number): number {
  // Log scale: 1k seg = 30, 10k = 40, 100k = 50, 1M = 60
  // Nunca começa acima de 70 (os últimos 30 pontos só vêm de acerto)
  const base = Math.min(70, 20 + Math.log10(seguidores + 1) * 10);
  return Math.round(base);
}

// Exemplos:
// Venê Casagrande (1M seg) → 80 (seed manual, tier 1)
// Fabrizio Romano (20M seg) → 85 (seed manual, tier 1)
// Perfil com 5k seg → 37
// Perfil com 500 seg → 27
```

**Seeds manuais para jornalistas conhecidos (tier 1):**

```typescript
const JORNALISTAS_SEED = {
  'Fabrizio Romano':       85,
  'Venê Casagrande':       80,
  'Bruno Andrade':         78,
  'André Hernan':          76,
  'Jorge Nicola':          68,
  'Paulo Vinícius Coelho': 66,
  'Mauro Cezar Pereira':   64,
};
```

### 7.3 Atualização por acerto

Depois que o sistema tem histórico, credibilidade é refinada automaticamente:

```typescript
async function atualizarCredibilidade(jornalistaId: string, acertou: boolean) {
  const jornalista = await prisma.jornalista.findUnique({ where: { id: jornalistaId } });

  // Média móvel exponencial (últimos ~20 resultados)
  const alfa = 0.05;
  const nova = jornalista.credibilidade * (1 - alfa) + (acertou ? 100 : 0) * alfa;

  await prisma.jornalista.update({
    where: { id: jornalistaId },
    data: {
      credibilidade: Math.round(nova),
      totalPrevisoes: { increment: 1 },
      acertos: acertou ? { increment: 1 } : undefined,
    },
  });
}
```

### 7.4 O que o usuário vê

**Página de ranking (acessível pela sidebar):**

```
🏆 TOP FONTES — Quem mais acerta no futebol brasileiro

1. Fabrizio Romano     92% (147 de 160)    🌎 Internacional
2. Venê Casagrande     86% (98 de 114)     🔴⚫ Flamengo especialista
3. Bruno Andrade       81% (72 de 89)      ⚽ Mercado geral
...

Filtrar: [Todos] [Flamengo] [Corinthians] [São Paulo] ...
```

**Badge no card de rumor:**

Quando uma fonte aparece, mostra a credibilidade inline:
```
✓ Venê Casagrande · 86% acerto · "Jair está encaminhado"
```

### 7.5 O que o Palpiteiro quer ser: o "quem é confiável" do futebol

Hoje o torcedor não tem como comparar fontes com dados. O Palpiteiro é o primeiro lugar que prova com números quem acerta mais. Isso atrai jornalistas sérios (que vão querer subir no ranking e divulgar o app) e afasta clickbait (que perde relevância no algoritmo).

---

## 8. Sistema de Notificações (Motor de Retenção)

### 8.1 Filosofia

Sem coins e sem gamificação pesada, as notificações são o principal motor de retenção. O torcedor volta porque ALGO MUDOU num assunto que ele se importa.

### 8.2 Tipos de notificação

| Gatilho | Exemplo | Prioridade |
|---------|---------|------------|
| Rumor que você reagiu mudou de probabilidade | "Jair no Fla subiu de 45% pra 72%" | Alta |
| Rumor resolvido | "CONFIRMADO: Allan vai pro Corinthians. Você reagiu com 🔥" | Alta |
| Jornalista tier 1 cravou algo novo do seu time | "Venê Casagrande cravou novo rumor sobre o Flamengo" | Alta |
| Novo rumor quente do seu time | "Novo rumor 🔥: Fla estuda proposta por zagueiro do Premier League" | Média |
| Divergência explodiu | "⚡ 85% de chance mas torcida em 💀 — reaja!" | Média |
| Torcida rival reagindo ao seu rumor | "Corinthians reagindo ao rumor do Allan — veja o sentimento" | Média |
| Sentimento da torcida mudou muito | "Sentimento sobre Cebolinha caiu de 😍 pra 👎 nas últimas 24h" | Baixa |
| Resumo semanal | "Seu resumo: 3 rumores resolvidos, 2 novos, top fontes da semana" | Baixa |

### 8.3 Regras anti-spam

- Máximo 5 push por dia por usuário
- Agrupar notificações se muitas do mesmo rumor
- Respeitar horário: não enviar entre 23h e 7h
- Priorizar por engajamento do usuário (se ele reagiu, notifica; se não, não)
- Sempre permitir configurar por tipo no app

### 8.4 Notificação como gancho de compartilhamento

Toda notificação de resolução inclui botão "Compartilhar resultado":
```
✅ CONFIRMADO: Allan vai pro Corinthians
Probabilidade final: 72% | Torcida Fla: 🔥62% | Torcida Corinthians: 😍78%
[Compartilhar no WhatsApp] [Compartilhar no X]
```

---

## 9. Ferramentas de Compartilhamento

### 9.1 Filosofia

Cada share é uma reativação do usuário que compartilha E uma aquisição potencial do amigo que recebe. Viralidade peer-to-peer é mais forte que push notification.

### 9.2 O que pode ser compartilhado

| Conteúdo | Formato | Onde |
|----------|---------|------|
| Card de rumor | Imagem estática com dados | WhatsApp, X, Instagram Stories |
| Resultado resolvido | Card com "CONFIRMADO/NÃO ROLOU" + dados | WhatsApp, X |
| Divergência | "85% de chance mas torcida em 💀" | X, WhatsApp |
| Sentimento cross-torcida | Barra de emojis lado a lado | X, Instagram |
| Ranking de fontes | Top 5 da semana | X |

### 9.3 Card compartilhável (formato imagem)

Cada rumor pode gerar um card estático (PNG) otimizado pra cada plataforma:

```
┌─────────────────────────────────────────┐
│  PALPITEIRO                    ⚽        │
│                                          │
│  Jair (Nott. Forest) fecha com o Fla?    │
│                                          │
│  📰 Probabilidade: 58% ↑                │
│  🔥42% 😍25% 😐15% 👎12% 💀6%          │
│                                          │
│  12.300 torcedores reagiram              │
│  Reaja você também → palpiteiro.com.br   │
└─────────────────────────────────────────┘
```

### 9.4 Deep links

Cada share leva direto pro rumor no app/web. Se o cara não tem conta, vê o rumor e um CTA pra reagir (criando conta).

---

## 10. Integração #palpiteiros no X (Twitter)

### 10.1 Conceito

O torcedor posta no X com a hashtag #palpiteiros. O sistema puxa esses posts, filtra por segurança, associa ao rumor relevante, e exibe numa seção "O que a torcida tá dizendo" dentro do card.

**Benefícios:**
- Dá voz ao torcedor sem abrir comentários dentro do app (sem moderação interna)
- Cada post com #palpiteiros é marketing orgânico no X
- O torcedor usa uma plataforma que já conhece
- Filtro algorítmico é a camada de segurança

### 10.2 Pipeline de ingestão

```
[X API] → [Scrape a cada 15-30min] → [Filtro de segurança] → [Associação ao rumor] → [Exibição no card]
```

### 10.3 Filtro de segurança (RESTRITIVO — whitelist approach)

**Filosofia:** em vez de tentar bloquear tudo que é ruim (impossível), só deixa passar o que claramente é seguro. Se 70% dos posts forem filtrados, tudo bem.

```typescript
function postEhSeguro(post: TweetData): boolean {
  const texto = post.text.toLowerCase();

  // BLOQUEAR se qualquer um:
  if (contemPalavrao(texto)) return false;
  if (contemDiscursoOdio(texto)) return false;
  if (contemAtaqueAPessoa(texto)) return false;    // menção + tom negativo
  if (post.text.length < 20) return false;          // muito curto, provavelmente spam
  if (post.text.length > 500) return false;         // muito longo, provavelmente copypasta
  if (contemLinkExterno(texto)) return false;        // possível spam/phishing
  if (contaEhMuitoNova(post.author)) return false;  // conta com <30 dias
  if (contaTemPoucosSeguidores(post.author, 50)) return false;

  // PERMITIR se:
  if (mencionaJogadorOuTime(texto)) return true;    // fala de futebol
  if (mencionaRumorAtivo(texto)) return true;        // relacionado a rumor ativo

  // Na dúvida, não passa
  return false;
}
```

### 10.4 Associação ao rumor

```typescript
async function associarAoRumor(post: TweetData): Promise<string | null> {
  const rumoresAtivos = await getRumoresAtivos();

  for (const rumor of rumoresAtivos) {
    // Match por menção de jogador + time
    if (mencionaJogador(post.text, rumor.jogadorNome) &&
        mencionaTime(post.text, rumor.timeNome)) {
      return rumor.id;
    }
  }
  return null; // não associou a nenhum rumor → descarta
}
```

### 10.5 Exibição no card expandido

Quando o usuário clica pra expandir um rumor, aparece a seção:

```
💬 O QUE A TORCIDA TÁ DIZENDO

@torcedor_fla · 2h
"Jair seria perfeito pro sistema do Filipe Luís, zagueiro
 que sai jogando e é canhoto. Tem que trazer."
 ❤️ 124  🔁 23

@mengo_news · 5h
"Se vier por empréstimo com opção de compra, acho
 um ótimo negócio. Forest vai pedir muito?"
 ❤️ 89  🔁 12

[Ver mais no X →]
```

---

## 11. Dados de Jogadores e Times

### 11.1 Fonte de dados

Usar APIs oficiais pagas para garantir dados atualizados:
- **X (Twitter) API** — posts de jornalistas, hashtag #palpiteiros, engajamento
- **YouTube API** — vídeos de análise, entrevistas, coletivas
- **API de dados de futebol** (API-Football ou similar) — elencos atualizados, transferências confirmadas, resultados

### 11.2 Atualização de elencos

```typescript
// Sync diário automático
// POST /api/cron/sync-elencos

interface Jogador {
  id: string;
  nome: string;
  apelidos: string[];
  foto: string;
  timeAtualId: string | null;
  posicao: string;
  nacionalidade: string;
  atualizadoEm: DateTime;
}
```

**Validação:** antes de criar rumor, verificar se jogador ainda está no time de origem. Alertar se dados >7 dias sem sync.

---

## 12. Escudos e Regras Visuais

### 12.1 Escudos dos times

**OBRIGATÓRIO:** Todos os times com escudos oficiais (SVG/PNG), nunca emojis.

- Sidebar: 24x24px
- Card de rumor: 20x20px
- Onboarding: 48x48px
- Perfil: 32x32px

**Fallback:** Se escudo não carregar, círculo com cor primária do time.

### 12.2 Design system

- Dark mode always (#09090B background)
- Font primária: Space Grotesk
- Font mono (dados): JetBrains Mono
- Cores de sentimento: 🔥 #F97316, 😍 #10B981, 😐 #71717A, 👎 #EF4444, 💀 #7C3AED
- Layout: 3 colunas (sidebar + feed + contexto)

---

## 13. Schema Completo do Banco de Dados

```typescript
model User {
  id          String    @id @default(cuid())
  nome        String
  email       String    @unique
  timePrincipal String  // time que torce
  criadoEm    DateTime  @default(now())
  reacoes     Reacao[]
}

model Rumor {
  id            String          @id @default(cuid())
  titulo        String
  contexto      String          // frase curta explicando o cenário
  categoria     CategoriaRumor
  status        StatusRumor     @default(ABERTO)

  // Relações
  jogadorId     String?
  timeOrigemId  String?
  timeDestinoId String?

  // Algoritmo (ALG-001)
  probabilidade      Float      @default(50)
  probabilidadeTrend String     @default("estavel") // subindo, caindo, estavel
  confianca          String     @default("baixa")   // baixa, media, alta

  // Datas
  criadoEm     DateTime        @default(now())
  encerraEm    DateTime
  resolvidoEm  DateTime?

  // Relações
  fontes       FonteRumor[]
  reacoes      Reacao[]
  tweets       TweetRumor[]
}

model FonteRumor {
  id            String   @id @default(cuid())
  rumorId       String
  jornalistaId  String
  posicao       String   // confirma, nega, neutro
  intensidade   String   // especula, afirma, crava
  textoOriginal String
  urlOriginal   String
  dataPublicacao DateTime
}

model Jornalista {
  id              String   @id @default(cuid())
  nome            String
  handle          String?  // @twitter
  veiculo         String?
  seguidores      Int
  credibilidade   Float    // 0-100
  totalPrevisoes  Int      @default(0)
  acertos         Int      @default(0)
  fontes          FonteRumor[]
}

model Reacao {
  id         String   @id @default(cuid())
  userId     String
  rumorId    String
  timeId     String
  emoji      Emoji
  criadoEm   DateTime @default(now())
  atualizadoEm DateTime @updatedAt

  @@unique([userId, rumorId])
}

model TweetRumor {
  id         String   @id @default(cuid())
  rumorId    String
  tweetId    String   @unique
  autor      String
  handle     String
  texto      String
  likes      Int
  retweets   Int
  criadoEm   DateTime
  aprovado   Boolean  @default(false)
}

enum CategoriaRumor {
  REFORCO
  SAIDA
  RENOVACAO
  COMISSAO
  ESCALACAO
  LESAO
  SELECAO
  PREMIO
  CLUBE
  DISCIPLINA
}

enum StatusRumor {
  ABERTO
  CONFIRMADO
  DESMENTIDO
  EXPIRADO
}

enum Emoji {
  FOGO
  AMOR
  NEUTRO
  NAO_GOSTO
  PESSIMO
}
```

---

## 14. Monetização (Futuro — não é v1)

**Caminhos possíveis sem depender de coins:**

1. **Freemium** — grátis com limite de visualizações. Premium desbloqueia: dados históricos completos, notificações ilimitadas, filtros avançados, dados de probabilidade em tempo real.

2. **B2B — Dados de sentimento** — vender insights agregados pra clubes ("94% da torcida quer jogador X"), empresários ("sentimento sobre meu cliente no Flamengo"), marcas esportivas ("qual jogador a torcida mais quer?").

3. **Ads segmentados** — "50 mil flamenguistas interessados em centroavante" é ouro pra patrocinador esportivo.

4. **Parcerias com veículos** — licenciar o indicador de probabilidade pra GE, ESPN, etc. "Segundo o Palpiteiro, 73% de chance."

---

## 15. Expansão Futura

- **Outros esportes** — basquete, MMA, F1 (mesma mecânica)
- **Política** — "Lula troca o ministro X?" com sentimento popular
- **Entretenimento** — "Ator X vai pra novela Y?" com sentimento dos fãs

A arquitetura de "algoritmo de previsão + sentimento popular quantificado" funciona pra QUALQUER domínio onde existe rumor e opinião pública.

---

## 16. Princípios do Produto

1. **Algoritmo primeiro** — o número de probabilidade é o produto, não um feature
2. **Dois eixos, nunca misturados** — o que vai acontecer ≠ o que a torcida quer
3. **Zero fricção** — reagir é 1 toque (emoji)
4. **Conteúdo sempre** — o feed nunca fica vazio, com ou sem janela de transferências
5. **Premiar quem acerta** — jornalistas bons ganham visibilidade, os demais simplesmente não aparecem
6. **Dar voz à torcida** — a opinião do torcedor é quantificada e tem valor
7. **Dark mode always** — estética moderna, informacional
8. **Compartilhável por natureza** — cada card é potencialmente viral

**O que NÃO fazer:**
- Moedas virtuais, stakes, multiplicadores, apostas
- Ranking pessoal de "quem acerta mais" entre torcedores
- Landing pages com "Como funciona"
- Comentários abertos dentro do app (v1)
- Modais desnecessários

---

*Documento v3.0 — Janeiro 2026*
*Reescrito do zero após brainstorm de produto*
