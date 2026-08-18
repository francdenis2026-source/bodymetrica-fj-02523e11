export const generateInsights = (history: any[], target: any) => {
  const lastWeek = history.slice(-7);
  const avgProtein = lastWeek.reduce((acc, curr) => acc + curr.protein, 0) / 7;
  
  if (avgProtein < target.protein * 0.9) {
    return "Consumo de proteínas abaixo da meta. Aumentar a ingestão de fontes proteicas no almoço/jantar.";
  }
  
  return "Consistência nutricional excelente. Mantenha o volume de treino e a hidratação atual.";
};