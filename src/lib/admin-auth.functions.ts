import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const adminRoleSchema = z.object({
  accessToken: z.string().min(20),
});

export const resolveAdminRole = createServerFn({ method: "POST" })
  .inputValidator((data) => adminRoleSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(data.accessToken);
    const user = userData?.user;

    if (userError || !user) {
      return { success: false as const, message: "Sessão administrativa inválida." };
    }

    const { data: roleRows, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (roleError) {
      return { success: false as const, message: "Não foi possível validar as permissões administrativas." };
    }

    const roles = (roleRows || []).map((row: any) => String(row.role));
    const role = roles.includes("super_admin")
      ? "super_admin"
      : roles.includes("admin")
        ? "admin"
        : null;

    if (!role) {
      return { success: false as const, message: "Esta conta não possui papel administrativo ativo." };
    }

    return {
      success: true as const,
      user: {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.["name"] || "Administrador",
        role,
      },
    };
  });
