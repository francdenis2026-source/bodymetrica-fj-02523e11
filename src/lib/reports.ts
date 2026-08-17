import { jsPDF } from "jspdf";
import "jspdf-autotable";

export interface ReportData {
  userName: string;
  period: string;
  weightData: { date: string; weight: number }[];
  macros: { calories: number; protein: number; carbs: number; fat: number };
  hydrationGoal: number;
  hydrationCurrent: number;
}

export const generatePDFReport = (data: ReportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(20, 20, 30);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("BODY MÉTTRICA FJ - RELATÓRIO", 15, 25);
  
  doc.setFontSize(10);
  doc.text(`Usuário: ${data.userName}`, 15, 35);
  doc.text(`Período: ${data.period}`, pageWidth - 15, 35, { align: "right" });

  doc.setTextColor(20, 20, 30);
  doc.setFontSize(16);
  doc.text("Composição Corporal", 15, 55);
  
  const weightRows = data.weightData.map(d => [d.date, `${d.weight} kg`]);
  (doc as any).autoTable({
    startY: 60,
    head: [['Data', 'Peso']],
    body: weightRows,
    theme: 'grid',
    headStyles: { fillColor: [40, 100, 250] }
  });

  const nextY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.text("Nutrição e Aderência", 15, nextY);
  
  const macroData = [
    ['Calorias', `${data.macros.calories} kcal`],
    ['Proteínas', `${data.macros.protein} g`],
    ['Carboidratos', `${data.macros.carbs} g`],
    ['Gorduras', `${data.macros.fat} g`]
  ];
  
  (doc as any).autoTable({
    startY: nextY + 5,
    head: [['Métrica', 'Valor']],
    body: macroData,
    theme: 'striped',
    headStyles: { fillColor: [250, 80, 80] }
  });

  const hydrationY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.text("Hidratação Diária", 15, hydrationY);
  doc.setFontSize(12);
  doc.text(`Meta: ${data.hydrationGoal / 1000}L | Média Atual: ${data.hydrationCurrent / 1000}L`, 15, hydrationY + 10);

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Body Métrica FJ - Performance Suite", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

  doc.save(`Relatorio_BodyMetrica_${data.userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};
