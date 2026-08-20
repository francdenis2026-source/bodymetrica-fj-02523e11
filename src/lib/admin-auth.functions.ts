import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const adminLoginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(6, "Senha inválida"),
});

/**
 * Authenticate an administrator entirely on the server.
 *
 * We intentionally use the GoTrue HTTP endpoint instead of creating another
 * browser-side Supabase client. This avoids multiple GoTrueClient instances
 * sharing the same storage key and removes the race that previously caused a
 * valid admin login to be interpreted as an invalid session.
 */
export const authenticateAdmin = createServerFn({ method: "POST" })
  .inputValidator((data) => adminLoginSchema.parse(data))
  .handler(async ({ data }) => {
    const SUPABASE_URL = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
    const SUPABASE_PUBLISHABLE_KEY =
      process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      console.error("[AdminAuth] Missing Supabase URL or publishable key on server.");
      return {
        success: false as const,
        kind: "configuration" as const,
        message: "A autenticação administrativa não está configurada no servidor.",
      };
    }

    let response: Response;
    try {
      response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: data.password,
        }),
      });
    } catch (error) {
      console.error("[AdminAuth] GoTrue request failed:", error);
      return {
        success: false as const,
        kind: "network" as const,
        message: "Não foi possível conectar ao serviço de autenticação.",
      };
    }

    const authPayload = await response.json().catch(() => null) as any;

    if (!response.ok || !authPayload?.access_token || !authPayload?.refresh_token || !authPayload?.user?.id) {
      return {
        success: false as const,
        kind: "credentials" as const,
        message: "E-mail ou senha incorretos.",
      };
    }

    const user = authPayload.user;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: roleRows, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (roleError) {
      console.error("[AdminAuth] Role lookup failed:", roleError);
      return {
        success: false as const,
        kind: "permissions" as const,
        message: "Não foi possível validar as permissões administrativas.",
      };
    }

    const roles = (roleRows || []).map((row: any) => String(row.role));
    const role = roles.includes("super_admin")
      ? "super_admin"
      : roles.includes("admin")
        ? "admin"
        : null;

    if (!role) {
      return {
        success: false as const,
        kind: "permissions" as const,
        message: "Esta conta não possui papel administrativo ativo.",
      };
    }

    return {
      success: true as const,
      accessToken: String(authPayload.access_token),
      refreshToken: String(authPayload.refresh_token),
      user: {
        id: String(user.id),
        email: String(user.email || data.email).toLowerCase(),
        name: user.user_metadata?.["name"] || "Administrador",
        role,
      },
    };
  });

const resolveAdminRoleSchema = z.object({
  accessToken: z.string().min(10),
});

/**
 * Resolve the administrative role for an already authenticated session.
 */
export const resolveAdminRole = createServerFn({ method: "POST" })
  .inputValidator((data) => resolveAdminRoleSchema.parse(data))
  .handler(async ({ data }) => {
    const SUPABASE_URL = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
    const SUPABASE_PUBLISHABLE_KEY =
      process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      return { success: false as const, user: null };
    }

    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${data.accessToken}`,
      },
    }).catch(() => null);

    const userPayload = userResponse && userResponse.ok
      ? ((await userResponse.json().catch(() => null)) as any)
      : null;

    if (!userPayload?.id) {
      return { success: false as const, user: null };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roleRows, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userPayload.id);

    if (error) {
      return { success: false as const, user: null };
    }

    const roles = (roleRows || []).map((row: any) => String(row.role));
    const role = roles.includes("super_admin")
      ? ("super_admin" as const)
      : roles.includes("admin")
        ? ("admin" as const)
        : null;

    if (!role) {
      return { success: true as const, user: null };
    }

    return {
      success: true as const,
      user: {
        id: String(userPayload.id),
        email: String(userPayload.email || "").toLowerCase(),
        role,
      },
    };
  });
