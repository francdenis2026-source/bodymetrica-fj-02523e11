import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const loginSchema = z.object({
  cpf: z.string(),
  pin: z.string().length(6, "PIN deve ter 6 dígitos"),
});

export const login = createServerFn({ method: "POST" })
  .inputValidator((data) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    // This is a placeholder for the future Supabase integration
    console.log("Login attempt with CPF:", data.cpf.replace(/(\d{3}).*/, "$1.***.***-**"));
    
    // For demo purposes, we'll return a mock success
    // In production, this would verify the PIN and return a session
    return {
      success: true,
      user: {
        id: "mock-user-id",
        name: "Usuário Demonstrativo",
        role: "user"
      }
    };
  });
