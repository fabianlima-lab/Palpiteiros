# Algoritmo de Relevância - Palpiteiro

## Visão Geral

O algoritmo de relevância determina a ordem em que os rumores aparecem no feed. O objetivo é mostrar primeiro os rumores mais relevantes para cada usuário.

## Fatores de Ordenação

O score total é de **100 pontos**, distribuídos assim:

### 1. Meu Time (40 pontos) - MAIOR PESO

Rumores que envolvem o time do coração do usuário aparecem primeiro.

```typescript
const isMyTeam =
  rumor.toTeam.toLowerCase().includes(userTeam) ||
  rumor.fromTeam?.toLowerCase().includes(userTeam)

factors.myTeam = isMyTeam ? 40 : 0
```

**Justificativa**: O principal interesse do torcedor é seu próprio time.

### 2. Engajamento Prévio (20 pontos)

Rumores onde o usuário já votou/reagiu recebem boost.

```typescript
factors.engagement = userEngagedRumorIds.has(rumor.id) ? 20 : 0
```

**Justificativa**: Mantém o usuário conectado aos rumores que ele acompanha.

### 3. Buzz/Hype (25 pontos)

Combinação de métricas de engajamento geral:

```typescript
function calculateBuzzScore(
  predictionsCount: number,   // 30% - Quantidade de votos
  signalsCount: number,       // 25% - Signals de influenciadores
  signalScore: number | null, // 25% - Score agregado
  newsCount: number           // 20% - Notícias relacionadas
): number {
  const predScore = Math.min(predictionsCount / 100, 1)
  const sigScore = Math.min(signalsCount / 5, 1)
  const aggScore = signalScore ?? 0
  const newsScore = Math.min(newsCount / 10, 1)

  return (predScore * 0.3) + (sigScore * 0.25) + (aggScore * 0.25) + (newsScore * 0.2)
}

factors.buzz = buzzScore * 25
```

**Justificativa**: Rumores com mais discussão/cobertura são mais interessantes.

### 4. Recência (10 pontos)

Rumores mais novos aparecem antes.

```typescript
function calculateRecencyScore(createdAt: Date): number {
  const hoursAgo = (now - createdAt) / (1000 * 60 * 60)

  if (hoursAgo <= 6) return 1.0    // Últimas 6h
  if (hoursAgo <= 24) return 0.8   // Último dia
  if (hoursAgo <= 48) return 0.6   // 2 dias
  if (hoursAgo <= 72) return 0.4   // 3 dias
  if (hoursAgo <= 168) return 0.2  // 1 semana
  return 0.1                        // Mais de 1 semana
}

factors.recency = recencyScore * 10
```

**Justificativa**: Notícias frescas são mais relevantes.

### 5. Urgência (5 pontos)

Rumores prestes a fechar têm prioridade.

```typescript
function calculateUrgencyScore(closesAt: Date): number {
  const hoursUntilClose = (closesAt - now) / (1000 * 60 * 60)

  if (hoursUntilClose <= 6) return 1.0
  if (hoursUntilClose <= 24) return 0.8
  if (hoursUntilClose <= 48) return 0.6
  if (hoursUntilClose <= 72) return 0.4
  return 0.2
}

factors.urgency = urgencyScore * 5
```

**Justificativa**: Usuários devem votar antes do fechamento.

## Exemplos de Score

### Rumor A: Meu time, novo, muito buzz
- Meu Time: 40
- Engajamento: 0
- Buzz: 20 (80% normalizado)
- Recência: 10 (criado há 2h)
- Urgência: 4 (fecha em 12h)
- **TOTAL: 74 pontos**

### Rumor B: Outro time, já votei, médio buzz
- Meu Time: 0
- Engajamento: 20
- Buzz: 12 (48% normalizado)
- Recência: 8 (criado há 20h)
- Urgência: 2 (fecha em 5 dias)
- **TOTAL: 42 pontos**

### Rumor C: Meu time, antigo, pouco buzz
- Meu Time: 40
- Engajamento: 0
- Buzz: 5 (20% normalizado)
- Recência: 2 (criado há 1 semana)
- Urgência: 1 (fecha em 2 semanas)
- **TOTAL: 48 pontos**

**Ordenação final**: A (74) > C (48) > B (42)

## Implementação

### Server-side (page.tsx)

```typescript
// Calcular scores
const scoredRumors = rumors.map(rumor => ({
  ...rumor,
  _relevanceScore: calculateTotalScore(rumor, userTeam, userEngaged)
}))

// Ordenar
scoredRumors.sort((a, b) => b._relevanceScore - a._relevanceScore)
```

### API (GET /api/rumors)

Query params para personalização:
- `userId` - ID do usuário
- `userTeam` - Time do usuário
- `order=quentes` - Ativa algoritmo de relevância

## Arquivos Relacionados

- `/lib/relevance.ts` - Funções de cálculo exportadas
- `/app/feed/page.tsx` - Implementação no server
- `/app/api/rumors/route.ts` - API pública
- `/app/api/rumors/relevance/route.ts` - Endpoint dedicado

## Possíveis Melhorias Futuras

1. **Decay exponencial** - Substituir steps discretos por função contínua
2. **Machine Learning** - Aprender preferências do usuário
3. **A/B Testing** - Testar diferentes pesos
4. **Boost por categoria** - Usuários podem preferir certos tipos de rumor
5. **Penalidade por repetição** - Evitar mostrar o mesmo rumor muito
