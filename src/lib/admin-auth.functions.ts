import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/integrations/supabase/config";

const adminLoginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(6, "Senha inválida"),
});

async function fetchRoles(accessToken: string, userId: string) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/user_roles?select=role&user_id=eq.${encodeURIComponent(userId)}`,
    {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    },
  ).catch(() => null);

  if (!response || !response.ok) {
    return { ok: false as const, roles: [] as string[] };
  }

  const rows = (await response.json().catch(() => [])) as Array<{ role?: string }>;
  return {
    ok: true as const,
    roles: rows.map((row) => String(row.role || "")).filter(Boolean),
  };
}

function resolveRole(roles: string[]) {
  if (roles.includes("super_admin")) return "super_admin" as const;
  if (roles.includes("admin")) return "admin" as const;
  return null;
}

/**
 * Authenticate administrators exclusively against the independent Supabase
 * project configured in src/integrations/supabase/config.ts.
 */
export const authenticateAdmin = createServerFn({ method: "POST" })
  .inputValidator((data) => adminLoginSchema.parse(data))
  .handler(async ({ data }) => {
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

    const authPayload = (await response.json().catch(() => null)) as any;

    if (!response.ok || !authPayload?.access_token || !authPayload?.refresh_token || !authPayload?.user?.id) {
      return {
        success: false as const,
        kind: "credentials" as const,
        message: "E-mail ou senha incorretos.",
      };
    }

    const user = authPayload.user;
    const roleResult = await fetchRoles(String(authPayload.access_token), String(user.id));

    if (!roleResult.ok) {
      return {
        success: false as const,
        kind: "permissions" as const,
        message: "Não foi possível validar as permissões administrativas no Supabase configurado.",
      };
    }

    const role = resolveRole(roleResult.roles);
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

/** Resolve the administrative role for an already authenticated session. */
export const resolveAdminRole = createServerFn({ method: "POST" })
  .inputValidator((data) => resolveAdminRoleSchema.parse(data))
  .handler(async ({ data }) => {
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

    const roleResult = await fetchRoles(data.accessToken, String(userPayload.id));
    if (!roleResult.ok) {
      return { success: false as const, user: null };
    }

    const role = resolveRole(roleResult.roles);
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
