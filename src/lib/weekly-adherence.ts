import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { exportToCSV } from "./export";
import type { DailyAdherence } from "./adherence";

export interface WeeklyBucket {
  label: string;
  start: string;
  end: string;
  days: DailyAdherence[];
  avgMacros: number;
  avgWater: number;
  trainings: number;
  trend: "up" | "down" | "flat";
  deltaMacros: number;
}

const avg = (list: number[]) =>
  list.length ? Math.round(list.reduce((a, b) => a + b, 0) / list.length) : 0;

const weekKey = (dateStr: string) => {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = (d.getDay() + 6) % 7; // monday = 0
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split("T")[0]!,
    end: sunday.toISOString().split("T")[0]!,
  };
};

export const buildWeeklySummary = (data: DailyAdherence[]): WeeklyBucket[] => {
  const map = new Map<string, DailyAdherence[]>();
  [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((rec) => {
      const { start } = weekKey(rec.date);
      const list = map.get(start) ?? [];
      list.push(rec);
      map.set(start, list);
    });

  const buckets: WeeklyBucket[] = [];
  [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([start, days], i) => {
      const { end } = weekKey(start);
      const avgMacros = avg(days.map((d) => d.macros));
      const avgWater = avg(days.map((d) => d.water));
      const prev = buckets[i - 1];
      const deltaMacros = prev ? avgMacros - prev.avgMacros : 0;
      buckets.push({
        label: `${start.split("-").reverse().slice(0, 2).join("/")} a ${end
          .split("-")
          .reverse()
          .slice(0, 2)
          .join("/")}`,
        start,
        end,
        days,
        avgMacros,
        avgWater,
        trainings: days.filter((d) => d.training).length,
        deltaMacros,
        trend: deltaMacros > 2 ? "up" : deltaMacros < -2 ? "down" : "flat",
      });
    });

  return buckets;
};

const trendLabel = (b: WeeklyBucket) =>
  b.trend === "up"
    ? `Em alta (+${b.deltaMacros}%)`
    : b.trend === "down"
      ? `Em queda (${b.deltaMacros}%)`
      : "Estável";

export const generateWeeklyAdherenceReport = (
  userName: string,
  data: DailyAdherence[],
  type: "pdf" | "csv",
) => {
  const weeks = buildWeeklySummary(data);

  if (type === "csv") {
    const rows: Record<string, string>[] = [];
    weeks.forEach((w) => {
      rows.push({
        Semana: w.label,
        Nivel: "Resumo",
        Data: `${w.start} a ${w.end}`,
        Macros: `${w.avgMacros}%`,
        Agua: `${w.avgWater}%`,
        Treinos: `${w.trainings}`,
        Tendencia: trendLabel(w),
      });
      w.days.forEach((d) => {
        rows.push({
          Semana: w.label,
          Nivel: "Dia",
          Data: d.date,
          Macros: `${d.macros}%`,
          Agua: `${d.water}%`,
          Treinos: d.training ? "Sim" : "Não",
          Tendencia: d.macros >= w.avgMacros ? "Acima da média" : "Abaixo da média",
        });
      });
    });
    exportToCSV(rows, `Aderencia_Semanal_${userName.replace(/\s+/g, "_")}`);
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(20, 20, 30);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("BODY METRICA FJ - RESUMO SEMANAL", 15, 25);
  doc.setFontSize(10);
  doc.text(`Usuario: ${userName}`, 15, 35);
  doc.text(`Semanas analisadas: ${weeks.length}`, pageWidth - 15, 35, { align: "right" });

  doc.setTextColor(20, 20, 30);
  doc.setFontSize(14);
  doc.text("Tendencia por Semana", 15, 55);

  (doc as any).autoTable({
    startY: 60,
    head: [["Semana", "Macros (media)", "Agua (media)", "Treinos", "Tendencia"]],
    body: weeks.map((w) => [
      w.label,
      `${w.avgMacros}%`,
      `${w.avgWater}%`,
      `${w.trainings}`,
      trendLabel(w),
    ]),
    theme: "grid",
    headStyles: { fillColor: [40, 100, 250] },
  });

  weeks.forEach((w) => {
    const y = (doc as any).lastAutoTable.finalY + 12;
    if (y > doc.internal.pageSize.getHeight() - 40) doc.addPage();
    doc.setFontSize(12);
    doc.text(`Detalhe diario - ${w.label}`, 15, y > doc.internal.pageSize.getHeight() - 40 ? 20 : y);
    (doc as any).autoTable({
      startY: (y > doc.internal.pageSize.getHeight() - 40 ? 20 : y) + 4,
      head: [["Data", "Macros", "Agua", "Treino", "Comparativo"]],
      body: w.days.map((d) => [
        d.date,
        `${d.macros}%`,
        `${d.water}%`,
        d.training ? "Sim" : "Nao",
        d.macros >= w.avgMacros ? "Acima da media" : "Abaixo da media",
      ]),
      theme: "striped",
      headStyles: { fillColor: [250, 80, 80] },
    });
  });

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Body Metrica FJ - Painel de Aderencia Semanal",
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: "center" },
  );

  doc.save(
    `Aderencia_Semanal_${userName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
  );
};
