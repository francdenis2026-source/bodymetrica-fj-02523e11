
ALTER TABLE public.webhook_events 
ADD COLUMN IF NOT EXISTS error_message text,
ADD COLUMN IF NOT EXISTS processed_by_user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS failure_reason text;

-- Re-grant to ensure visibility
GRANT SELECT, INSERT, UPDATE, DELETE ON public.webhook_events TO authenticated;
GRANT ALL ON public.webhook_events TO service_role;
