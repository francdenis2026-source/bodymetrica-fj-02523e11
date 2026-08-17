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
});

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
        role: "user"
      }
    };
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
};

export const isAuthenticated = () => {
  return !!getSession();
};
