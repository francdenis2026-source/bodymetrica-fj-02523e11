import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/supplements/")({
  component: SupplementsPage,
});

function SupplementsPage() {
  return <div>Supplements</div>;
}
