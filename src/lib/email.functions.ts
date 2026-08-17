import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Envia e-mails transacionais relacionados à licença.
 * Em um cenário real, integraria com SendGrid, Resend ou SMTP.
 */
export const sendLicenseEmail = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    email: z.string().email(),
    type: z.enum(['expiring_soon', 'renewed', 'revoked', 'expired', 'welcome']),
    details: z.any().optional()
  }).parse(data))
  .handler(async ({ data }) => {
    // Para o MVP, vamos apenas logar no servidor. 
    // Em produção, aqui iria o 'fetch' para a API de e-mail.
    console.log(`[Email Service] Sending ${data.type} to ${data.email}`, data.details);
    
    // Simulação de sucesso
    return { success: true };
  });
