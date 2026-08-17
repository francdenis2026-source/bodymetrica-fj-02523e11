import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";


export interface ReportData {
  userName: string;
  period: string;
  bodyWeightChange: string;
  muscleMassChange: string;
  fatPercentChange: string;
  weightData: { date: string; weight: number }[];
  macros: { calories: number; protein: number; carbs: number; fat: number };
  hydrationGoal: number;
  hydrationCurrent: number;
  summary: string;
}

export const generateComparisonPDF = async (data: ReportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(20, 20, 30);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("BODY MÉTTRICA FJ - RELATÓRIO COMPARATIVO", 15, 25);
  
  doc.setFontSize(10);
  doc.text(`Usuário: ${data.userName}`, 15, 35);
  doc.text(`Período: ${data.period}`, pageWidth - 15, 35, { align: "right" });

  doc.setTextColor(20, 20, 30);
  doc.setFontSize(16);
  doc.text("Resumo de Evolução", 15, 55);

  const summaryData = [
    ['Peso', data.bodyWeightChange],
    ['Gordura', data.fatPercentChange],
    ['Massa Muscular', data.muscleMassChange]
  ];

  (doc as any).autoTable({
    startY: 60,
    head: [['Métrica', 'Evolução']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [40, 100, 250] }
  });

  const nextY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text("Insight do Analista:", 15, nextY);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const splitSummary = doc.splitTextToSize(data.summary, pageWidth - 30);
  doc.text(splitSummary, 15, nextY + 8);

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Body Métrica FJ - Performance Suite", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

  doc.save(`Comparativo_BodyMetrica_${data.userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);

  // Track export in history
  const exportEntry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type: 'PDF',
    fileName: `Comparativo_BodyMetrica_${data.userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
    publicLink: `https://bodymetrica.link/share/${crypto.randomUUID().slice(0, 8)}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  };

  const history = JSON.parse(localStorage.getItem('bodymetrica_export_history') || '[]');
  localStorage.setItem('bodymetrica_export_history', JSON.stringify([exportEntry, ...history].slice(0, 50)));

  return {
    summaryText: `Relatório Body Métrica FJ - ${data.userName}\nEvolução: ${data.bodyWeightChange} de peso, ${data.muscleMassChange} de massa.\nResumo: ${data.summary}`,
    fileName: exportEntry.fileName,
    publicLink: exportEntry.publicLink
  };
};

export const exportReportAsImage = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const canvas = await html2canvas(element, {
    backgroundColor: '#14141E',
    scale: 2
  });
  
  const link = document.createElement('a');
  const fullFileName = `${fileName}.png`;
  link.download = fullFileName;
  link.href = canvas.toDataURL('image/png');
  link.click();

  // Track export in history
  const exportEntry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type: 'PNG',
    fileName: fullFileName,
    publicLink: `https://bodymetrica.link/share/${crypto.randomUUID().slice(0, 8)}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  const history = JSON.parse(localStorage.getItem('bodymetrica_export_history') || '[]');
  localStorage.setItem('bodymetrica_export_history', JSON.stringify([exportEntry, ...history].slice(0, 50)));
};
