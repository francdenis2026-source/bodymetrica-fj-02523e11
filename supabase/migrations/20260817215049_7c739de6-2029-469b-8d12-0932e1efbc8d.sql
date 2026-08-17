CREATE TABLE IF NOT EXISTS public.webhook_events (
    id uuid primary key default gen_random_uuid(),
    event_id text unique not null,
    topic text not null,
    status text not null default 'pending',
    payload jsonb not null,
    processed_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.webhook_events TO authenticated;
GRANT ALL ON public.webhook_events TO service_role;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events(event_id);