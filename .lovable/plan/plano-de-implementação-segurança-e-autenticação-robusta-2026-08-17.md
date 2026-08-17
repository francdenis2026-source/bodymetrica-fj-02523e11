# Plano de Implementação: Segurança e Autenticação Robusta

Implementação de um sistema de autenticação real via Lovable Cloud (Supabase), incluindo verificação de e-mail, rate limiting, e fluxo de recuperação de senha seguro.

## Etapas de Implementação

### 1. Backend: Schema e Segurança
- Criar a tabela `public.profiles` para armazenar dados do usuário (CPF, Objetivo, Medidas).
- Configurar políticas RLS para garantir que usuários só acessem seus próprios dados.
- Implementar triggers de validação e segurança.
- Configurar autenticação via Supabase para exigir confirmação de e-mail.

### 2. Autenticação e Rate Limiting
- Migrar o fluxo mock de `src/lib/auth/auth.functions.ts` para chamadas reais ao Supabase.
- Implementar rate limiting no frontend para prevenir força bruta no login e recuperação.
- Adicionar estado de "bloqueio temporário" no componente de login.

### 3. Recuperação de Senha (Real)
- Integrar `supabase.auth.resetPasswordForEmail` para envio de links reais.
- Implementar a página de confirmação de redefinição de senha.
- Garantir expiração de tokens e tratamento de erros.

### 4. Onboarding e Registro
- Ajustar `src/routes/onboarding/index.tsx` para persistir dados no Supabase durante o registro.
- Implementar verificação de e-mail: bloquear acesso até que o `email_confirmed_at` esteja presente no auth.
- Exibir mensagens profissionais e amigáveis para usuários não autenticados ou não confirmados.

### 5. UI/UX e Redirecionamento
- Refinar o `AccessGate` para tratar estados de "não confirmado".
- Garantir redirecionamento automático fluido e mensagens SVG profissionais.

## Detalhes Técnicos
- **Database**: Tabela `profiles` vinculada a `auth.users.id`.
- **Auth**: `supabase.auth.signUp`, `supabase.auth.signInWithPassword`, `supabase.auth.resetPasswordForEmail`.
- **Segurança**: RLS + `GRANT authenticated` nas tabelas `public`.
- **Rate Limit**: Controle de tentativas em estado local/sessionStorage com timeout exponencial.
