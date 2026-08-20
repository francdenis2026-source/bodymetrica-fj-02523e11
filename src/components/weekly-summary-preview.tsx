import { useMemo, useState } from "react";
import { FileDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DailyAdherence } from "@/lib/adherence";
import { buildWeeklySummary, generateWeeklyAdherenceReport } from "@/lib/weekly-adherence";

interface Props {
  userName: string;
  data: DailyAdherence[];
  trigger?: React.ReactNode;
}

export function WeeklySummaryPreview({ userName, data, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const weeks = useMemo(() => buildWeeklySummary(data), [data]);
  const activeWeeks = weeks.filter((w) => selected.length === 0 || selected.includes(w.start));
  const filteredData = activeWeeks.flatMap((w) => w.days);

  const toggleWeek = (start: string) =>
    setSelected((prev) =>
      prev.includes(start) ? prev.filter((s) => s !== start) : [...prev, start],
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="sm"
            className="text-[9px] font-semibold uppercase tracking-wide hover:bg-primary/10"
          >
            <FileDown size={14} className="mr-1" /> Resumo Semanal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold tracking-wide">
            Pré-visualização do Resumo Semanal
          </DialogTitle>
        </DialogHeader>

        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
          Selecione as semanas para confirmar o período antes de exportar. Sem seleção, todas são incluídas.
        </p>

        <div className="space-y-3">
          {weeks.length === 0 && (
            <p className="text-xs  text-muted-foreground py-6 text-center">
              Ainda não há dados de aderência para resumir.
            </p>
          )}
          {weeks.map((w) => {
            const isSelected = selected.includes(w.start);
            const TrendIcon = w.trend === "up" ? TrendingUp : w.trend === "down" ? TrendingDown : Minus;
            return (
              <div
                key={w.start}
                className={cn(
                  "rounded-2xl border p-4 transition-all",
                  isSelected ? "border-primary bg-primary/5" : "border-white/10 bg-white/5",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <button
                    className="text-left flex-1"
                    onClick={() => toggleWeek(w.start)}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide">{w.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Macros {w.avgMacros}% • Água {w.avgWater}% • {w.trainings} treino(s)
                    </p>
                  </button>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-[10px] font-semibold uppercase",
                      w.trend === "up" ? "text-success" : w.trend === "down" ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    <TrendIcon size={12} />
                    {w.deltaMacros > 0 ? `+${w.deltaMacros}` : w.deltaMacros}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[9px] font-semibold uppercase"
                    onClick={() => setExpanded(expanded === w.start ? null : w.start)}
                  >
                    {expanded === w.start ? "Fechar" : "Detalhar"}
                  </Button>
                </div>

                {expanded === w.start && (
                  <div className="mt-3 space-y-1 border-t border-white/10 pt-3">
                    {w.days.map((d) => (
                      <div key={d.date} className="flex items-center justify-between text-[10px]">
                        <span className="font-bold">{d.date}</span>
                        <span className="text-muted-foreground">
                          Macros {d.macros}% • Água {d.water}% • {d.training ? "Treinou" : "Sem treino"}
                        </span>
                        <span
                          className={cn(
                            "font-semibold uppercase",
                            d.macros >= w.avgMacros ? "text-success" : "text-warning",
                          )}
                        >
                          {d.macros >= w.avgMacros ? "Acima" : "Abaixo"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            className="flex-1 gap-2 font-semibold uppercase tracking-wide bg-brand-gradient border-none"
            disabled={filteredData.length === 0}
            onClick={() => generateWeeklyAdherenceReport(userName, filteredData, "pdf")}
          >
            <FileDown size={16} /> Baixar PDF
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2 font-semibold uppercase tracking-wide"
            disabled={filteredData.length === 0}
            onClick={() => generateWeeklyAdherenceReport(userName, filteredData, "csv")}
          >
            <FileDown size={16} /> Baixar CSV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
