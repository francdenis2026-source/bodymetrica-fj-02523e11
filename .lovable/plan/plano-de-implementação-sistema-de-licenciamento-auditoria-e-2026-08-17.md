# Plano de Implementação - Sistema de Licenciamento, Auditoria e Pagamento

Este plano detalha as melhorias no sistema de licenciamento do Body Métrica FJ, incluindo integração com Mercado Pago, auditoria, monitoramento de status em tempo real e segurança.

## Alterações de Banco de Dados

### 1. Tabela de Configurações (Admin)
Criar uma tabela `public.admin_settings` para armazenar chaves de API (Mercado Pago) de forma segura.
- `key`: texto, chave primária.
- `value`: texto, valor da configuração.
- `updated_at`: timestamp.
- RLS: Apenas administradores podem ler e escrever.

### 2. Trilha de Auditoria
Criar a tabela `public.license_audit_logs` para registrar todas as ações relacionadas a licenças.
- `id`: uuid.
- `license_id`: uuid (opcional, para chaves ainda não vinculadas).
- `user_id`: uuid (usuário afetado).
- `admin_id`: uuid (administrador que realizou a ação).
- `action`: texto (geração, ativação, revogação, expiração).
- `details`: jsonb.
- `created_at`: timestamp.
- RLS: Apenas administradores podem ler.

### 3. Melhoria na Tabela de Licenças
Adicionar coluna `revoked_at` e `revoked_by` na tabela `public.licenses` para controle fino de revogação.

## Funcionalidades de Backend (Server Functions)

### 1. Gestão de Configurações Admin
- `getAdminSetting`: Busca uma configuração (ex: Mercado Pago Access Token).
- `updateAdminSetting`: Atualiza uma configuração (protegido por middleware admin).

### 2. Auditoria
- Criar helper interno `createAuditLog` para registrar ações.
- Implementar trigger no banco para registrar expiração automática (opcional, ou via cron).

### 3. Invalidação de Sessão
- Atualizar `validateLicense` para emitir evento de broadcast em caso de expiração/revogação detectada.
- Criar `checkLicenseStatus` para ser usado no polling do frontend.

## Melhorias no Frontend

### 1. Dashboard Admin
- Nova aba "Configurações" para inserção da API do Mercado Pago.
- Nova aba "Auditoria" para visualizar logs de sistema.
- Botão "Revogar" na tabela de licenças.

### 2. Central de Ajustes (Usuário)
- Novo card informativo com:
    - Status (Ativo/Expirado/Revogado).
    - Data de expiração formatada.
    - Contador de dias restantes.
    - Alerta visual para renovação (< 7 dias).

### 3. Sincronização e Segurança (Root Layout)
- Implementar polling a cada 5 minutos (ou quando a aba ganha foco) para verificar o status da licença no banco.
- Caso a licença seja revogada ou expire:
    - Limpar `localStorage`.
    - Redirecionar para `/auth`.
    - Exibir toast de "Acesso Expirado".

## Plano de Entrega

1. **Sprint 1: Database & Security** - Migrações SQL e Auditoria.
2. **Sprint 2: Admin Power** - Configurações Mercado Pago e Auditoria UI.
3. **Sprint 3: User Experience** - Polling de licença, UI de status e logout forçado.

**Nota:** As chaves de API do Mercado Pago serão armazenadas de forma criptografada ou protegidas por RLS restrito a administradores (service_role no servidor).
