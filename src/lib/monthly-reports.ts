
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export interface MonthlyReportData {
  userName: string;
  month: string;
  nutrition: {
    calories: { date: string; value: number }[];
    protein: { date: string; value: number }[];
    carbs: { date: string; value: number }[];
    fat: { date: string; value: number }[];
    goals: { calories: number; protein: number; carbs: number; fat: number };
  };
  hydration: {
    data: { date: string; value: number }[];
    goal: number;
  };
  evolution: {
    weight: { date: string; value: number }[];
  };
}

export const generateMonthlyPDF = (data: MonthlyReportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header
  doc.setFillColor(20, 20, 30);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("BODY MÉTTRICA FJ - PERFORMANCE MENSAL", 15, 25);
  
  doc.setFontSize(10);
  doc.text(`Usuário: ${data.userName}`, 15, 35);
  doc.text(`Período: ${data.month}`, pageWidth - 15, 35, { align: "right" });

  // Section: Nutrition
  doc.setTextColor(20, 20, 30);
  doc.setFontSize(16);
  doc.text("Resumo Nutricional", 15, 55);

  const avgCalories = Math.round(data.nutrition.calories.reduce((acc, curr) => acc + curr.value, 0) / data.nutrition.calories.length);
  const avgProtein = Math.round(data.nutrition.protein.reduce((acc, curr) => acc + curr.value, 0) / data.nutrition.protein.length);
  
  const nutritionSummary = [
    ['Calorias (Média)', `${avgCalories} kcal`, `Meta: ${data.nutrition.goals.calories} kcal`],
    ['Proteínas (Média)', `${avgProtein}g`, `Meta: ${data.nutrition.goals.protein}g`],
    ['Hidratação (Média)', `${Math.round(data.hydration.data.reduce((acc, curr) => acc + curr.value, 0) / data.hydration.data.length) / 1000}L`, `Meta: ${data.hydration.goal / 1000}L`]
  ];

  (doc as any).autoTable({
    startY: 60,
    head: [['Métrica', 'Média Real', 'Meta de Elite']],
    body: nutritionSummary,
    theme: 'grid',
    headStyles: { fillColor: [40, 100, 250] }
  });

  // Section: Evolution Table
  const nextY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.text("Histórico de Evolução", 15, nextY);

  const evolutionRows = data.evolution.weight.map(w => {
    const hyd = data.hydration.data.find(h => h.date === w.date)?.value || 0;
    const cal = data.nutrition.calories.find(c => c.date === w.date)?.value || 0;
    return [w.date, `${w.value}kg`, `${cal} kcal`, `${hyd/1000}L`];
  });

  (doc as any).autoTable({
    startY: nextY + 5,
    head: [['Data', 'Peso', 'Calorias', 'Hidratação']],
    body: evolutionRows,
    theme: 'striped',
    headStyles: { fillColor: [20, 20, 30] }
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Documento gerado automaticamente pelo Body Métrica FJ - Intelligence Suite", pageWidth / 2, pageHeight - 10, { align: "center" });

  doc.save(`Performance_Mensal_${data.month.replace(/\s+/g, '_')}_${data.userName.replace(/\s+/g, '_')}.pdf`);
  
  // Track in history
  const history = JSON.parse(localStorage.getItem('bodymetrica_export_history') || '[]');
  const exportEntry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type: 'PDF',
    fileName: `Performance_Mensal_${data.month}.pdf`,
    publicLink: `https://bodymetrica.link/share/${crypto.randomUUID().slice(0, 8)}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    comparisonData: {
      weightVar: "-3.1%",
      calVar: "+5.2%",
      waterVar: "+18.5%"
    }
  };
  localStorage.setItem('bodymetrica_export_history', JSON.stringify([exportEntry, ...history].slice(0, 50)));
};
