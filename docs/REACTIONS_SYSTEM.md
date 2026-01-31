# Sistema de Reações - Palpiteiro

## Filosofia

Mudamos de um sistema binário "vai/não vai" para reações estilo Slack. Isso porque:

1. **Não somos um site de apostas** - Somos análise de sentimento
2. **Mais expressividade** - 5 níveis de sentimento vs 2
3. **Mais engajamento** - Emojis são mais divertidos
4. **Dados mais ricos** - Podemos calcular sentimento médio

## Tipos de Reação

```typescript
export const REACTIONS = [
  { emoji: '🔥', label: 'Quero muito', sentiment: 1.0 },
  { emoji: '👍', label: 'Seria bom', sentiment: 0.75 },
  { emoji: '😐', label: 'Tanto faz', sentiment: 0.5 },
  { emoji: '😕', label: 'Não curti', sentiment: 0.25 },
  { emoji: '💔', label: 'Não quero', sentiment: 0.0 },
] as const

export type ReactionEmoji = '🔥' | '👍' | '😐' | '😕' | '💔'
```

## Cálculo de Sentimento

O sentimento do rumor é a média ponderada das reações:

```typescript
const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0)
const weightedSum = REACTIONS.reduce((sum, r) => {
  return sum + (reactionCounts[r.emoji] * r.sentiment)
}, 0)
const sentiment = weightedSum / totalReactions // 0.0 a 1.0
```

### Exemplo

Se um rumor tem:
- 🔥 Quero muito: 50 reações (50 × 1.0 = 50)
- 👍 Seria bom: 30 reações (30 × 0.75 = 22.5)
- 😐 Tanto faz: 10 reações (10 × 0.5 = 5)
- 😕 Não curti: 5 reações (5 × 0.25 = 1.25)
- 💔 Não quero: 5 reações (5 × 0.0 = 0)

**Total**: 100 reações
**Soma ponderada**: 78.75
**Sentimento**: 78.75 / 100 = **0.7875 (78.75%)**

## Componentes

### ReactionPicker

Componente principal para selecionar reações.

```tsx
<ReactionPicker
  rumorId="abc123"
  userReaction={null}
  reactionCounts={{ '🔥': 50, '👍': 30, ... }}
  onReact={(emoji) => console.log(emoji)}
  compact={false}
/>
```

Props:
- `rumorId`: ID do rumor
- `userReaction`: Reação atual do usuário (ou null)
- `reactionCounts`: Contagem de cada emoji
- `onReact`: Callback quando usuário reage
- `compact`: Versão compacta para cards

### SentimentBar

Barra visual de sentimento com gradiente.

```tsx
<SentimentBar
  reactionCounts={{ '🔥': 50, '👍': 30, ... }}
  showLabels={true}
/>
```

## API

### POST /api/reactions

Registra uma nova reação.

**Request**:
```json
{
  "rumorId": "abc123",
  "userId": "user456",
  "reaction": "🔥"
}
```

**Response**:
```json
{
  "success": true,
  "prediction": {
    "id": "pred789",
    "rumorId": "abc123",
    "userId": "user456",
    "prediction": true
  },
  "newSentiment": 0.78
}
```

### Mapeamento Emoji → Prediction

Por compatibilidade com o modelo existente (`Prediction.prediction: Boolean`):

```typescript
const EMOJI_TO_PREDICTION: Record<string, boolean> = {
  '🔥': true,  // Positivo
  '👍': true,  // Positivo
  '😐': true,  // Neutro (contamos como positivo)
  '😕': false, // Negativo
  '💔': false, // Negativo
}
```

## Visualização

### Modo Completo (Página de Detalhes)

```
┌──────────────────────────────────────────┐
│  🔥 Quero muito                    [50]  │
│  👍 Seria bom                      [30]  │
│  😐 Tanto faz                      [10]  │
│  😕 Não curti                      [ 5]  │
│  💔 Não quero                      [ 5]  │
└──────────────────────────────────────────┘
```

### Modo Compacto (Cards)

```
┌────────────────────────────┐
│ 🔥 50  👍 30  😕 5  💔 5   │
└────────────────────────────┘
```

### Barra de Sentimento

```
┌────────────────────────────────────────────────────┐
│ ████████████████████████████████░░░░░░░░░░░░░░░░░░ │
│ 🔥 50%        👍 30%        😕 15%       💔 5%     │
└────────────────────────────────────────────────────┘
```

## Arquivos

- `/app/components/ReactionPicker.tsx` - Componentes React
- `/app/api/reactions/route.ts` - Endpoint da API
- `/app/components/RumorCard.tsx` - Integração nos cards
- `/app/rumor/[id]/RumorDetailContent.tsx` - Integração na página

## Migração do Sistema Antigo

O sistema antigo usava `Prediction.prediction: boolean` (true = vai, false = não vai).

Para compatibilidade:
1. Reações positivas (🔥, 👍, 😐) salvam `prediction: true`
2. Reações negativas (😕, 💔) salvam `prediction: false`
3. O sentimento do rumor é recalculado após cada reação

Futuramente podemos adicionar um campo `reaction: String` ao modelo Prediction.
