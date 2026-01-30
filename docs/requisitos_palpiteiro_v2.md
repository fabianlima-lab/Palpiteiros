# Requisitos Técnicos — Palpiteiro v2

> Documento para implementação via Claude Code
> Prioridade: Alta → Média → Baixa
> Estimativa total: 4-6 horas

---

## 🔴 PRIORIDADE ALTA

### REQ-001: Esconder métricas totais da landing page

**Contexto:** Atualmente mostra "1+ palpiteiros" e "3+ palpites", o que passa impressão de site vazio.

**Requisito:**
- Remover completamente a seção que exibe "X+ palpiteiros" e "X+ palpites" da landing page
- Manter apenas "12 times" como métrica visível
- Quando tivermos mais de 100 usuários, podemos reativar (deixar comentado no código)

**Critério de aceite:**
- Landing page não exibe contagem de usuários ou palpites
- Código comentado para fácil reativação futura

---

### REQ-002: Adicionar rumor em destaque na hero section

**Contexto:** Usuário precisa ver um exemplo real do produto antes de se cadastrar. Cria urgência e curiosidade.

**Requisito:**
- Adicionar um card de "Rumor em Destaque" logo abaixo do headline principal
- O card deve exibir:
  - Emoji de fogo (🔥) + label "Rumor Quente"
  - Nome do jogador e time de destino (ex: "Neymar no Santos")
  - Barra de probabilidade visual (ex: 67% acham que acontece)
  - Texto secundário: "X palpites nesse rumor"
  - Botão CTA: "Dar meu palpite"
- O rumor deve ser dinâmico (puxar do banco de dados o rumor com mais engajamento ou mais recente)
- Se não houver rumor ativo, exibir um rumor de exemplo estático

**Design sugerido:**
```
┌─────────────────────────────────────────────┐
│ 🔥 RUMOR QUENTE                             │
│                                             │
│ Neymar no Santos                            │
│                                             │
│ ████████████░░░░░░░░  67%                   │
│ acham que acontece                          │
│                                             │
│ 234 palpites · Janela fecha em 12 dias      │
│                                             │
│         [ Dar meu palpite ]                 │
└─────────────────────────────────────────────┘
```

**Critério de aceite:**
- Card visível na landing page abaixo do headline
- Probabilidade exibida com barra visual
- Clique no CTA leva para página do rumor ou onboarding (se não logado)

---

## 🟡 PRIORIDADE MÉDIA

### REQ-003: Criar página /empresas (B2B)

**Contexto:** Mostrar que existe modelo de monetização B2B para investidores e potenciais clientes.

**Requisito:**
- Criar nova rota `/empresas`
- Conteúdo da página:

**Header:**
```
Dados de probabilidade para sua redação, app ou transmissão

O Palpiteiro oferece acesso a dados em tempo real sobre rumores e transferências do futebol brasileiro.
```

**Seção "O que oferecemos":**
```
📡 API de Probabilidades
Acesse dados de probabilidades em tempo real via REST API. 
Ideal para apps, sites de notícia e plataformas de análise.

📺 Licenciamento para TV
Widgets e dados para exibição em programas esportivos.
Probabilidades ao vivo durante transmissões.

📊 Relatórios Personalizados
Análises sob demanda para clubes, agentes e veículos de mídia.
```

**Seção "Para quem":**
```
- Jornalistas e redações esportivas
- Apps e sites de futebol
- Canais de TV e streaming
- Clubes e departamentos de scout
- Casas de análise esportiva
```

**CTA final:**
```
Interessado? Entre em contato.

[campo de email]
[campo de mensagem]
[botão: Enviar]

Ou mande email direto para: empresas@palpiteiro.com.br
```

**Critério de aceite:**
- Página acessível em /empresas
- Formulário de contato funcional (pode enviar para email ou salvar no banco)
- Link para /empresas no footer da landing page
- Design consistente com o resto do site

---

### REQ-004: Adicionar screenshot/preview do produto na landing

**Contexto:** Usuário quer ver como é o produto por dentro antes de criar conta.

**Requisito:**
- Adicionar nova seção na landing page entre "Como funciona" e "Escolha seu time"
- Título: "Veja o Palpiteiro em ação"
- Exibir 1-3 screenshots do produto:
  - Tela de rumor com probabilidade
  - Tela de ranking de palpiteiros
  - Tela de perfil de influenciador (opcional)
- Screenshots podem ser imagens estáticas ou mockups
- Implementar como carrossel ou grid de imagens

**Opção alternativa (se não tiver screenshots):**
- Criar mockup visual direto em código (componente React que simula a tela)
- Estilizar como se fosse uma janela de browser/app

**Critério de aceite:**
- Seção visível na landing page
- Pelo menos 1 imagem/preview do produto logado
- Responsivo (funciona em mobile)

---

### REQ-005: Melhorar visual dos cards de times

**Contexto:** Cards muito similares, difícil diferenciar times rapidamente.

**Requisito:**
- Adicionar cor de fundo ou borda lateral na cor predominante de cada time
- Manter emojis atuais
- Cores sugeridas:
  - Flamengo: vermelho (#D62828)
  - Corinthians: preto (#1A1A1A)
  - Palmeiras: verde (#2D6A4F)
  - Santos: branco com borda cinza (#F5F5F5)
  - São Paulo: vermelho/preto/branco (gradiente ou tricolor)
  - Botafogo: preto com estrela dourada
  - Fluminense: tricolor (grená, verde, branco)
  - Vasco: preto (#1A1A1A)
  - Atlético-MG: preto (#1A1A1A)
  - Cruzeiro: azul (#1E3A8A)
  - Inter: vermelho (#DC2626)
  - Grêmio: azul (#1E40AF)

**Implementação sugerida:**
```jsx
// Exemplo de estrutura
const teamColors = {
  flamengo: { primary: '#D62828', secondary: '#1A1A1A' },
  palmeiras: { primary: '#2D6A4F', secondary: '#FFFFFF' },
  // ... etc
}

// Card com borda lateral colorida
<div style={{ borderLeft: `4px solid ${teamColors[team].primary}` }}>
```

**Critério de aceite:**
- Cada time tem cor distintiva no card
- Visual não fica poluído
- Cores consistentes com identidade dos times

---

## 🟢 PRIORIDADE BAIXA

### REQ-006: Configurar OG Image para compartilhamento

**Contexto:** Quando link for compartilhado no Twitter/WhatsApp, precisa aparecer preview bonito.

**Requisito:**
- Criar imagem OG (Open Graph) para a landing page
- Dimensões: 1200x630px
- Conteúdo da imagem:
  - Logo/nome "Palpiteiro"
  - Tagline: "O termômetro dos rumores do futebol"
  - Visual com cores do site
- Configurar meta tags:
  ```html
  <meta property="og:title" content="Palpiteiro - Rumores do Futebol Brasileiro" />
  <meta property="og:description" content="Acompanhe transferências, veja o que os influenciadores dizem e dê seu palpite" />
  <meta property="og:image" content="https://palpiteiro-mvp.vercel.app/og-image.png" />
  <meta property="og:url" content="https://palpiteiro-mvp.vercel.app" />
  <meta name="twitter:card" content="summary_large_image" />
  ```

**Critério de aceite:**
- Compartilhar link no Twitter mostra imagem de preview
- Compartilhar link no WhatsApp mostra imagem de preview

---

### REQ-007: Atualizar footer

**Contexto:** Footer atual muito simples e defensivo.

**Requisito:**
- Expandir footer com:
  - Links: FAQ | Políticas | Para Empresas | Contato
  - Redes sociais (Twitter/X) — quando tiver
  - Texto atualizado: "© 2025 Palpiteiro. Feito para torcedores, por torcedores."
- Remover ou diminuir ênfase em "Apenas entretenimento" (pode ficar na página de políticas)

**Critério de aceite:**
- Footer com links funcionais
- Visual mais completo e confiante

---

### REQ-008: Adicionar favicon personalizado

**Contexto:** Favicon padrão do Vercel/Next.js não representa a marca.

**Requisito:**
- Criar favicon simples (pode ser emoji ⚽ ou letra P estilizada)
- Formatos necessários:
  - favicon.ico (32x32)
  - apple-touch-icon.png (180x180)
- Configurar no head do documento

**Critério de aceite:**
- Aba do browser mostra ícone personalizado
- Funciona em mobile (quando salva na home)

---

## 📋 Resumo para implementação

| ID | Requisito | Esforço estimado |
|----|-----------|------------------|
| REQ-001 | Esconder métricas | 15 min |
| REQ-002 | Rumor na hero | 1-2h |
| REQ-003 | Página /empresas | 2h |
| REQ-004 | Screenshot na landing | 1h |
| REQ-005 | Cores nos cards de times | 30 min |
| REQ-006 | OG Image | 30 min |
| REQ-007 | Footer atualizado | 20 min |
| REQ-008 | Favicon | 15 min |

---

## 🚀 Ordem de execução sugerida

1. REQ-001 (quick win, 15 min)
2. REQ-002 (maior impacto visual)
3. REQ-005 (melhora visual rápida)
4. REQ-003 (importante pra B2B)
5. REQ-007 (complementa REQ-003)
6. REQ-006 (necessário antes de divulgar)
7. REQ-008 (polimento)
8. REQ-004 (pode fazer depois com screenshots reais)

---

## Notas para o desenvolvedor

- Manter consistência de design com o que já existe
- Priorizar mobile-first
- Testar em Chrome, Safari e Firefox
- Commitar cada requisito separadamente para fácil rollback
