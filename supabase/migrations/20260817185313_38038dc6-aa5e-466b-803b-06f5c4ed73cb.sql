ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme_preference text DEFAULT 'dark';
GRANT UPDATE(theme_preference) ON public.profiles TO authenticated;