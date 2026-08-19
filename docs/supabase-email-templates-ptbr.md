# E-mails de autenticação em português (pt-BR)

Os arquivos em `supabase/templates/` são as versões oficiais em português-BR usadas pelo projeto para recuperação de senha, confirmação de cadastro e convite.

## Projeto Supabase hospedado

No Supabase Dashboard, abra **Authentication > Email Templates** e atualize cada template:

- **Reset password / Recovery**
  - Assunto: `Redefina sua senha — Body Métrica FJ`
  - Conteúdo: copie `supabase/templates/recovery.html`
- **Confirm sign up / Confirmation**
  - Assunto: `Confirme seu e-mail — Body Métrica FJ`
  - Conteúdo: copie `supabase/templates/confirmation.html`
- **Invite user / Invite**
  - Assunto: `Seu acesso ao Body Métrica FJ`
  - Conteúdo: copie `supabase/templates/invite.html`

Os templates usam `{{ .ConfirmationURL }}`, variável oficial do Supabase Auth. Não substitua por uma URL fixa.

## Ambiente local/self-hosted

Adicione ao `supabase/config.toml` quando esse arquivo estiver sendo usado pela instância local:

```toml
[auth.email.template.recovery]
subject = "Redefina sua senha — Body Métrica FJ"
content_path = "./supabase/templates/recovery.html"

[auth.email.template.confirmation]
subject = "Confirme seu e-mail — Body Métrica FJ"
content_path = "./supabase/templates/confirmation.html"

[auth.email.template.invite]
subject = "Seu acesso ao Body Métrica FJ"
content_path = "./supabase/templates/invite.html"
```

## Observação importante

Em projetos Supabase hospedados, alterar arquivos no repositório não muda automaticamente o template que o serviço Auth já está usando. A configuração do template precisa ser aplicada no painel do projeto ou pela Management API com credenciais administrativas apropriadas.

Projetos novos no plano Free que usam o provedor de e-mail padrão do Supabase podem ter restrições de personalização. Nesse caso, configure SMTP próprio (por exemplo, Resend, Postmark, SendGrid ou Amazon SES) e depois aplique os templates acima.
