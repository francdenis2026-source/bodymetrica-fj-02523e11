import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const requireAdminAuth = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    // Accept both administrative roles used by the application.
    const { data: roleData, error } = await context.supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', context.userId)
      .in('role', ['admin', 'super_admin']);

    const hasAdminRole = !error && (roleData || []).some((row: any) =>
      row?.role === 'admin' || row?.role === 'super_admin'
    );

    if (!hasAdminRole) {
      throw new Error("Forbidden: Admin access required");
    }

    return next();
  });
