import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/nutrition/")({
  component: NutritionPage,
});

function NutritionPage() {
  return <div>Nutrition</div>;
}
