import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AUTH_KEY = 'bodymetrica_auth_session';

const loginSchema = z.object({
  cpf: z.string(),
  pin: z.string().length(6, "PIN deve ter 6 dígitos"),
});

const registerSchema = z.object({
  cpf: z.string(),
  pin: z.string().length(6, "PIN deve ter 6 dígitos"),
  name: z.string(),
  birthDate: z.string().optional(),
  goal: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  activityLevel: z.string().optional(),
});

const resetRequestSchema = z.object({
  cpf: z.string(),
});

const resetVerifySchema = z.object({
  cpf: z.string(),
  code: z.string().length(6),
  newPin: z.string().length(6),
});

// Mock database for reset codes (in a real app, use a DB)
const resetCodes = new Map<string, { code: string; expires: number }>();

export const login = createServerFn({ method: "POST" })
  .inputValidator((data) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    // Simulated auth
    console.log("Login attempt:", data.cpf);
    
    return {
      success: true,
      user: {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        name: "Usuário Body Métrica",
        cpf: data.cpf,
        role: "user"
      }
    };
  });

export const register = createServerFn({ method: "POST" })
  .inputValidator((data) => registerSchema.parse(data))
  .handler(async ({ data }) => {
    // Simulated registration
    console.log("Registration attempt:", data.cpf);
    
    return {
      success: true,
      user: {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        name: data.name,
        cpf: data.cpf,
        role: "user",
        profile: {
          goal: data.goal,
          weight: data.weight,
          height: data.height,
          activityLevel: data.activityLevel
        }
      }
    };
  });

export const requestPinReset = createServerFn({ method: "POST" })
  .inputValidator((data) => resetRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    resetCodes.set(data.cpf, { code, expires });
    
    console.log(`Reset code for ${data.cpf}: ${code}`);
    
    return { success: true, message: "Código enviado para seu canal de comunicação cadastrado." };
  });

export const verifyPinReset = createServerFn({ method: "POST" })
  .inputValidator((data) => resetVerifySchema.parse(data))
  .handler(async ({ data }) => {
    const stored = resetCodes.get(data.cpf);
    
    if (!stored || stored.code !== data.code) {
      return { success: false, message: "Código inválido ou expirado." };
    }
    
    if (Date.now() > stored.expires) {
      resetCodes.delete(data.cpf);
      return { success: false, message: "Código expirou. Solicite um novo." };
    }
    
    resetCodes.delete(data.cpf);
    return { success: true, message: "PIN redefinido com sucesso!" };
  });

export const logout = createServerFn({ method: "POST" })
  .handler(async () => {
    return { success: true };
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
  // Clear other sensitive data if necessary
  sessionStorage.clear();
};

export const isAuthenticated = () => {
  return !!getSession();
};
