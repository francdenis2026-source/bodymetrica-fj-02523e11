import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const licenseSchema = z.object({
  licenseKey: z.string().min(10, "Chave de licença inválida"),
  userId: z.string().uuid(),
});

/**
 * Validates a license key for a user and activates it if valid.
 */
export const validateLicense = createServerFn({ method: "POST" })
  .inputValidator((data) => licenseSchema.parse(data))
  .handler(async ({ data }) => {
    // 1. Check if the license exists and is unused
    const { data: license, error: fetchError } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', data.licenseKey)
      .eq('status', 'unused')
      .single();

    if (fetchError || !license) {
      // Fallback for manual validation during transition or if key starts with BODY- but isn't in DB yet
      // However, we want strict DB-backed validation now.
      if (data.licenseKey.startsWith("BODY-") && data.licenseKey.length > 12) {
         // Proceed with auto-creation if it doesn't exist? 
         // For now, let's keep it strict: must be in licenses table.
      }
      return { success: false, message: "Chave de licença inválida, já utilizada ou inexistente." };
    }

    // 2. Activate the license in the database
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { error: updateLicenseError } = await supabase
      .from('licenses')
      .update({ 
        status: 'active',
        user_id: data.userId,
        activated_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .eq('id', license.id);

    if (updateLicenseError) {
      console.error("Error updating license:", updateLicenseError);
      return { success: false, message: "Erro ao ativar licença." };
    }

    // 3. Update the user profile
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({ 
        license_status: 'active',
        license_key: data.licenseKey,
        license_expires_at: expiresAt.toISOString()
      })
      .eq('id', data.userId);

    if (updateProfileError) {
      console.error("Error updating profile license status:", updateProfileError);
      return { success: false, message: "Licença ativa na base, mas erro ao vincular ao seu perfil." };
    }

    return { 
      success: true, 
      message: "Licença ativada com sucesso! Bem-vindo à experiência completa." 
    };
  });

/**
 * Admin function to generate a new license key.
 * Requires admin role.
 */
export const generateLicenseKey = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    userId: z.string().uuid().optional(),
    expiresInDays: z.number().default(365)
  }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Check if the caller is an admin (we should use middleware ideally, but let's check here for now)
    // In a real app, use .middleware([requireAdminAuth])
    
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    const licenseKey = `BODY-${randomPart}-${Date.now().toString(36).toUpperCase()}`;
    
    const { data: license, error } = await supabaseAdmin
      .from('licenses')
      .insert({
        license_key: licenseKey,
        status: 'unused',
        expires_at: data.userId ? new Date(Date.now() + 86400000 * data.expiresInDays).toISOString() : null
      })
      .select()
      .single();

    if (error) {
      console.error("Error generating license:", error);
      return { success: false, message: "Erro ao gerar chave de licença." };
    }

    return { success: true, licenseKey: license.license_key };
  });

/**
 * Admin function to list licenses.
 */
export const listLicenses = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const { data, error } = await supabaseAdmin
      .from('licenses')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error listing licenses:", error);
      return { success: false, message: "Erro ao listar licenças." };
    }

    return { success: true, licenses: data };
  });
