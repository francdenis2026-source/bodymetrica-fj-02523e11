import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hydration")({
  component: HydrationPage,
});

function HydrationPage() {
  return <div>Hydration</div>;
}
