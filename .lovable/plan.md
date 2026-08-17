# Plano de Implementação: Auditoria, Webhook e Segurança

Implementar melhorias na gestão administrativa, segurança de pagamentos e testes de renovação do Body Métrica FJ.

## 1. Banco de Dados e Backend
- Adicionar coluna `idempotency_key` na tabela `license_audit_logs` ou criar uma nova tabela `webhook_events` para rastrear processamento e evitar duplicidade.
- Adicionar suporte a `mercadopago_webhook_secret` na tabela `admin_settings`.

## 2. Webhook Profissional (`src/routes/api/public/webhook.ts`)
- **Assinatura:** Implementar validação de assinatura `x-signature` do Mercado Pago.
- **Idempotência:** Verificar se o `payment_id` já foi processado antes de aplicar a renovação.
- **Logs:** Registrar cada evento recebido (status, usuário, timestamp) na trilha de auditoria.

## 3. Painel Administrativo (`src/routes/admin/index.tsx`)
- **Filtros:** Adicionar busca e filtros por data/status na aba de Auditoria.
- **Detalhes de Webhook:** Criar uma nova visualização para listar eventos de webhook recebidos e seus resultados.
- **Configuração:** Permitir salvar o `Webhook Secret` na aba de API.

## 4. Testes e Estabilidade
- Criar script Playwright (`/tmp/browser/monetization/test_renewal.py`) para simular o clique em "Renovar" nas configurações e validar a navegação/fluxo.
- Adicionar validações de tipo Zod para as respostas do Mercado Pago.

## Detalhes Técnicos
- **Idempotência:** Uso de `INSERT ... ON CONFLICT DO NOTHING` ou verificação prévia no Supabase.
- **Segurança:** `crypto.createHmac` para validar o hash do Mercado Pago.
- **UI:** Mantendo o padrão "Deep Night" com badges de status e tabelas responsivas.
