import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/training/")({
  component: TrainingPage,
});

function TrainingPage() {
  return <div>Training</div>;
}
