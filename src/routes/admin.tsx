import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div>
      {/* Admin specific layout could go here */}
      <Outlet />
    </div>
  );
}

import { Outlet } from "@tanstack/react-router";
