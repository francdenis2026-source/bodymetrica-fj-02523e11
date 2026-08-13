import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms/")({
  component: TermsPage,
});

function TermsPage() {
  return <div>Terms</div>;
}
