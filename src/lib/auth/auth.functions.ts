import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const AUTH_KEY = 'bodymetrica_auth_session';
const LOGOUT_CHANNEL = 'bodymetrica_logout_channel';

const broadcastLogout = () => {
  if (typeof window !== 'undefined') {
    const channel = new BroadcastChannel(LOGOUT_CHANNEL);
    channel.postMessage('logout');
    channel.close();
  }
};

export const setupLogoutListener = (onLogout: () => void) => {
  if (typeof window !== 'undefined') {
    const channel = new BroadcastChannel(LOGOUT_CHANNEL);
    channel.onmessage = (event) => {
      if (event.data === 'logout') {
        onLogout();
      }
    };
    return () => channel.close();
  }
  return () => {};
};

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  name: z.string(),
  cpf: z.string().optional(),
  birthDate: z.string().optional(),
  goal: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  activityLevel: z.string().optional(),
});

const resetRequestSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

const resetVerifySchema = z.object({
  password: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
});

export const login = createServerFn({ method: "POST" })
  .inputValidator((data) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (!authData.user?.email_confirmed_at) {
      return { 
        success: false, 
        message: "E-mail não verificado. Por favor, verifique sua caixa de entrada.", 
        needsVerification: true 
      };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    const isLicensed = profile?.license_status === 'active';
    
    // Check if user is admin
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authData.user.id)
      .eq('role', 'admin')
      .single();
    
    const role = roleData ? "admin" : "user";

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: profile?.name || authData.user.user_metadata?.['name'] || "Usuário",
        role,
        profile: profile,
        isLicensed,
        licenseStatus: profile?.license_status || 'demonstrative'
      }
    };
  });

export const register = createServerFn({ method: "POST" })
  .inputValidator((data) => registerSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        }
      }
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // Update profile with additional data if signup was successful
    if (authData.user) {
      await supabase
        .from('profiles')
        .update({
          cpf: data.cpf ?? null,
          birth_date: data.birthDate ? new Date(data.birthDate).toISOString() : null,
          goal: data.goal ?? null,
          weight: data.weight ? parseFloat(data.weight) : null,
          height: data.height ? parseFloat(data.height) : null,
          activity_level: data.activityLevel ?? null,
        })
        .eq('id', authData.user.id);
    }

    return {
      success: true,
      message: "Cadastro realizado! Verifique seu e-mail para confirmar a conta. Após a confirmação, você poderá adquirir sua licença de uso.",
      user: authData.user
    };
  });

export const requestPasswordReset = createServerFn({ method: "POST" })
  .inputValidator((data) => resetRequestSchema.parse(data))
  .handler(async ({ data }) => {
    // Determine the base URL for the reset link
    const origin = process.env['LOVABLE_APP_DOMAIN'] 
      ? `https://${process.env['LOVABLE_APP_DOMAIN']}`
      : 'http://localhost:8080';
      
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${origin}/auth?reset=true`,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Link de recuperação enviado para o seu e-mail." };
  });

export const updatePassword = createServerFn({ method: "POST" })
  .inputValidator((data) => resetVerifySchema.parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Senha redefinida com sucesso!" };
  });

export const logout = createServerFn({ method: "POST" })
  .handler(async () => {
    const { error } = await supabase.auth.signOut();
    return { success: !error };
  });

// Client-side helpers
export const getSession = () => {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem(AUTH_KEY);
  return session ? JSON.parse(session) : null;
};

export const setSession = (user: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.clear();
  broadcastLogout();
};

export const isAuthenticated = () => {
  return !!getSession();
};
