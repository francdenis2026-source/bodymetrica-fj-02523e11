import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/body/")({
  component: BodyPage,
});

function BodyPage() {
  return <div>Body Metrics</div>;
}
