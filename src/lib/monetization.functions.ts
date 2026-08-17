import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const licenseSchema = z.object({
  licenseKey: z.string().min(10, "Chave de licença inválida"),
  userId: z.string().uuid(),
});

/**
 * Validates a license key for a user.
 * Keys starting with 'BODY-' are considered valid for activation.
 */
export const validateLicense = createServerFn({ method: "POST" })
  .inputValidator((data) => licenseSchema.parse(data))
  .handler(async ({ data }) => {
    // Basic validation rule: must start with 'BODY-'
    const isValid = data.licenseKey.startsWith("BODY-");

    if (!isValid) {
      return { success: false, message: "Chave de licença inválida ou expirada." };
    }

    // Set expiration to 1 year from now for new activations
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { error } = await supabase
      .from('profiles')
      .update({ 
        license_status: 'active',
        license_key: data.licenseKey,
        license_expires_at: expiresAt.toISOString()
      })
      .eq('id', data.userId);

    if (error) {
      console.error("Error updating license status:", error);
      return { success: false, message: "Erro ao ativar licença no banco de dados." };
    }

    return { 
      success: true, 
      message: "Licença ativada com sucesso! Bem-vindo à experiência completa." 
    };
  });

/**
 * Mock function to simulate payment and license generation.
 * In a real scenario, this would be a webhook from Stripe/Paddle.
 */
export const generateLicenseAfterPayment = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ userId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    // Generate a random key
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    const licenseKey = `BODY-${randomPart}`;
    
    // In a real app, you would email this key to the user
    console.log(`Generated license ${licenseKey} for user ${data.userId}`);
    
    return { success: true, licenseKey };
  });
