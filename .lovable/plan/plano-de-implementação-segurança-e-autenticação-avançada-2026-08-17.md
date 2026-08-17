# Plano de Implementação: Segurança e Autenticação Avançada

Implementar recuperação de senha, reforçar o sistema de cadastro e garantir consistência na gestão de sessões.

## Ações Propostas

### 1. Sistema de Recuperação de PIN
- **Frontend**: Adicionar diálogo de recuperação em `src/routes/auth/index.tsx` acionado pelo botão "RECUPERAR PIN DE ACESSO".
- **Backend (Server Function)**: Criar `requestPinReset` e `verifyPinReset` em `src/lib/auth/auth.functions.ts`.
- **Lógica**: Simular envio de código de 6 dígitos (expira em 10 minutos).

### 2. Acesso Restrito e Mensagens Profissionais
- **AccessGate**: Atualizar `src/components/access-gate.tsx` para incluir um estado de "Redirecionamento Automático" após 3 segundos, mantendo a mensagem visual em SVG.
- **Mensagem**: Refinar o visual para uma estética "Deep Night" militar com feedback claro de que o acesso requer login.

### 3. Cadastro Real e Onboarding
- **Onboarding**: Validar campos obrigatórios antes de avançar para o cadastro.
- **Integração**: Garantir que `register` em `src/lib/auth/auth.functions.ts` persista os dados coletados (objetivo, peso, altura) no perfil simulado.
- **Feedback**: Implementar toasts profissionais para sucesso e falha detalhada.

### 4. Logout Consistente
- **Funcionalidade**: Atualizar `handleLogout` em `src/routes/__root.tsx` para chamar `clearSession`, invalidar cache do TanStack Query e forçar redirecionamento limpo para `/auth`.
- **Prevenção**: Garantir que ao sair, o usuário não consiga usar o botão "voltar" do navegador para ver dados sensíveis (limpeza de estado).

## Detalhes Técnicos
- Uso de `zod` para todas as validações de input.
- `localStorage` como motor de persistência de sessão (mockando o comportamento do Lovable Cloud/Supabase).
- Animações CSS para transições de estado de erro/sucesso.
