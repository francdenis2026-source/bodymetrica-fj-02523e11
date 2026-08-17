import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const licenseSchema = z.object({
  licenseKey: z.string().min(10, "Chave de licença inválida"),
  userId: z.string().uuid(),
});

/**
 * Validates a license key for a user.
 * In a real scenario, this would check against a 'licenses' table.
 */
export const validateLicense = createServerFn({ method: "POST" })
  .inputValidator((data) => licenseSchema.parse(data))
  .handler(async ({ data }) => {
    // This is a placeholder for real monetization logic.
    // For now, we'll assume any key starting with 'BODY-' is valid.
    const isValid = data.licenseKey.startsWith("BODY-");

    if (!isValid) {
      return { success: false, message: "Chave de licença inválida ou expirada." };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ 
        // We assume a 'license_status' field exists or will be added to the profiles table
        // For now, we use metadata or just return success
      })
      .eq('id', data.userId);

    if (error) {
      console.error("Error updating license status:", error);
    }

    return { 
      success: true, 
      message: "Licença ativada com sucesso! Bem-vindo à experiência completa." 
    };
  });
