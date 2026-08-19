import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const THEME_KEY = 'bodymetrica_user_theme';
const LEGACY_THEME_KEY = 'theme';

export const getUserTheme = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { theme: null };

    const { data: profile } = await supabase
      .from('profiles')
      .select('theme_preference')
      .eq('id', session.user.id)
      .single();

    return { theme: (profile?.theme_preference as 'light' | 'dark') || null };
  });

export const updateUserTheme = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ theme: z.enum(['light', 'dark']) }).parse(data))
  .handler(async ({ data }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false };

    const { error } = await supabase
      .from('profiles')
      .update({ theme_preference: data.theme })
      .eq('id', session.user.id);

    return { success: !error };
  });

export const setLocalTheme = (theme: 'light' | 'dark') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(LEGACY_THEME_KEY, theme);
  }
};

export const getLocalTheme = (): 'light' | 'dark' | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(THEME_KEY) || localStorage.getItem(LEGACY_THEME_KEY);
  return stored === 'light' || stored === 'dark' ? stored : null;
};
