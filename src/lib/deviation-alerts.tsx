import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { addAuditLog, getAdherenceData, type DailyAdherence } from "./adherence";
import { buildWeeklySummary } from "./weekly-adherence";

const THRESHOLD = 15; // desvio significativo em pontos percentuais

export interface DeviationResult {
  severity: "ok" | "warning" | "error";
  title: string;
  lines: string[];
}

export const evaluateDeviation = (
  record: DailyAdherence,
  data: DailyAdherence[] = getAdherenceData(),
): DeviationResult => {
  const lines: string[] = [];
  let severity: DeviationResult["severity"] = "ok";

  const macroDelta = record.macros - 100;
  const waterDelta = record.water - 100;

  if (Math.abs(macroDelta) >= THRESHOLD) {
    severity = macroDelta < 0 ? "error" : "warning";
    lines.push(
      `Macros do dia ${macroDelta > 0 ? "acima" : "abaixo"} do planejado em ${Math.abs(macroDelta)}%.`,
    );
  }
  if (Math.abs(waterDelta) >= THRESHOLD) {
    severity = severity === "error" ? "error" : "warning";
    lines.push(
      `Hidratação ${waterDelta > 0 ? "acima" : "abaixo"} da meta em ${Math.abs(waterDelta)}%.`,
    );
  }

  const week = buildWeeklySummary(data).find(
    (w) => record.date >= w.start && record.date <= w.end,
  );
  if (week) {
    const weekDelta = week.avgMacros - 100;
    if (Math.abs(weekDelta) >= THRESHOLD) {
      severity = severity === "error" ? "error" : "warning";
      lines.push(
        `Média semanal de macros em ${week.avgMacros}% (${weekDelta > 0 ? "+" : ""}${weekDelta}% vs. plano).`,
      );
    }
  }

  return {
    severity,
    title: severity === "error" ? "DESVIO CRÍTICO DETECTADO" : "ATENÇÃO AO PLANEJAMENTO",
    lines,
  };
};

/** Avalia o impacto de uma alteração e dispara alerta profissional quando relevante. */
export const alertOnDeviation = (
  record: DailyAdherence,
  origin: string,
  data?: DailyAdherence[],
) => {
  const result = evaluateDeviation(record, data);
  if (result.severity === "ok" || result.lines.length === 0) return result;

  addAuditLog({
    action: "Alerta de Desvio",
    details: `${origin} | ${result.lines.join(" ")}`,
    type: "adherence",
  });

  toast.custom((t) => (
    <SVGToast
      type={result.severity === "error" ? "error" : "warning"}
      title={result.title}
      message={
        <div className="space-y-1">
          {result.lines.map((l, i) => (
            <p key={i} className="text-xs leading-relaxed">
              {l}
            </p>
          ))}
          <p className="pt-1 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
            Origem: {origin}
          </p>
        </div>
      }
      onClose={() => toast.dismiss(t)}
    />
  ));

  return result;
};
