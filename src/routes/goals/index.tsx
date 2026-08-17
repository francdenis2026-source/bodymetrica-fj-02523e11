import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Scale, Droplets, Utensils, TrendingUp } from "lucide-react";
import { ModuleHeader } from "@/components/module-header";
import { getSession } from "@/lib/auth/auth.functions";

export const Route = createFileRoute("/goals/")({
  component: GoalsPage,
});

function GoalsPage() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const session = getSession();
    if (session) setUserData(session);
  }, []);

  const [goals, setGoals] = useState([
    {
      title: "Peso Corporal",
      current: 82.4,
      target: 78.0,
      unit: "kg",
      icon: <Scale className="text-primary" />,
      color: "bg-primary",
      status: "Em Progresso"
    },
    {
      title: "Hidratação",
      current: 1200,
      target: 3000,
      unit: "ml",
      icon: <Droplets className="text-info" />,
      color: "bg-info",
      status: "Abaixo da Meta"
    },
    {
      title: "Proteínas",
      current: 145,
      target: 180,
      unit: "g",
      icon: <Utensils className="text-success" />,
      color: "bg-success",
      status: "Faltam 35g"
    }
  ]);

  const updateGoal = (idx: number, newTarget: number) => {
    const updated = [...goals];
    if (updated[idx]) {
      updated[idx].target = newTarget;
      setGoals(updated);
    }
  };

  return (
    <div className="flex-1 space-y-12 p-4 md:p-12 pt-10 bg-background">
      <ModuleHeader 
        title="Metas de Performance"
        description="Acompanhamento centralizado de seus objetivos de elite e progresso em tempo real."
        icon={Target}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal, idx) => {
          const progress = Math.min(Math.round(((goal.current || 0) / (goal.target || 1)) * 100), 100);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="surface border-none overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      {goal.icon}
                    </div>
                    <CardTitle className="text-lg font-display uppercase italic tracking-tighter">{goal.title}</CardTitle>
                  </div>
                  <TrendingUp size={16} className="text-muted-foreground opacity-50" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="text-3xl font-black font-display tracking-tighter italic">
                        {goal.current} <span className="text-sm font-normal text-muted-foreground uppercase">{goal.unit}</span>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Meta: {goal.target} {goal.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <input 
                        type="number" 
                        value={goal.target}
                        onChange={(e) => updateGoal(idx, parseFloat(e.target.value))}
                        className="w-20 text-right bg-transparent text-2xl font-black italic text-primary focus:outline-none"
                      />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{goal.status}</p>
                    </div>
                  </div>
                  <Progress value={progress} className={`h-2 ${goal.color}`} />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
