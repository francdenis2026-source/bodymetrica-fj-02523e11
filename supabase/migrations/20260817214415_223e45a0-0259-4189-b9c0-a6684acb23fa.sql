ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
COMMENT ON COLUMN public.profiles.email IS 'E-mail do usuário para notificações transacionais';