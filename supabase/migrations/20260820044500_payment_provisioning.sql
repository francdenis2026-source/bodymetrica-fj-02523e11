-- Payment provisioning support for Mercado Pago checkout/webhooks.
-- Safe to run more than once.

alter table if exists public.sales
  add column if not exists user_id uuid,
  add column if not exists customer_email text,
  add column if not exists access_granted_at timestamptz;

create index if not exists idx_sales_user_id on public.sales(user_id);
create index if not exists idx_sales_provider_reference on public.sales(provider, provider_reference);

-- Prevent duplicate accounting rows for the same provider payment when possible.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'sales_provider_reference_unique'
  ) then
    begin
      alter table public.sales
        add constraint sales_provider_reference_unique unique (provider, provider_reference);
    exception
      when unique_violation then
        raise notice 'Could not add sales_provider_reference_unique because duplicate historical rows exist.';
    end;
  end if;
end $$;

create index if not exists idx_webhook_events_status on public.webhook_events(status);
create index if not exists idx_licenses_user_source_status on public.licenses(user_id, source, status);
