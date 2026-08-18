import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";

import { 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Target, 
  Scale, 
  CheckCircle2,
  Calendar
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/")({
  component: OnboardingPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      registerMode: (search['registerMode'] as boolean) || undefined,
      reset: (search['reset'] as boolean) || undefined,
      name: (search['name'] as string) || undefined,
      birthDate: (search['birthDate'] as string) || undefined,
      goal: (search['goal'] as string) || undefined,
      weight: (search['weight'] as string) || undefined,
      height: (search['height'] as string) || undefined,
      activityLevel: (search['activityLevel'] as string) || undefined,
    } as any;
  },
});

function OnboardingPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    goal: "gain",
    weight: "",
    height: "",
    activityLevel: "Moderadamente ativo (3-5 dias/semana)",
    macroPreference: "Equilibrado",
    unitSystem: "Métrico"
  });

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      return formData.name.length >= 3 && formData.birthDate.length > 0;
    }
    if (currentStep === 3) {
      return formData.weight.length > 0 && formData.height.length > 0;
    }
    return true;
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  
  const finish = () => {
    // Navigate to completion screen (step 5 if we had one) or redirect
    // For now, we go to final register step
    navigate({ 
      to: "/auth", 
      search: { 
        registerMode: true,
        reset: false,
        name: formData.name,
        birthDate: formData.birthDate,
        goal: formData.goal,
        weight: formData.weight,
        height: formData.height,
        activityLevel: formData.activityLevel,
        macroPreference: formData.macroPreference,
        unitSystem: formData.unitSystem
      } as any
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 relative overflow-hidden">
      {/* Hero Background for Onboarding */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-10 dark:opacity-5"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2000)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/90 via-background to-background" />

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col space-y-8 pt-8 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span>Passo {step} de {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-1.5" />
        </div>

        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold font-display text-primary">Bem-vindo(a)!</h1>
                <p className="text-muted-foreground text-sm">Vamos começar com o básico. Como devemos te chamar?</p>
              </div>
              <div className="space-y-4">
                <FormField 
                  label="Nome Completo" 
                  placeholder="Ex: João Silva" 
                  value={formData.name}
                  onChange={(e: any) => setFormData({...formData, name: e.target.value})}
                />
                <FormField 
                  label="Data de Nascimento" 
                  type="date" 
                  value={formData.birthDate}
                  onChange={(e: any) => setFormData({...formData, birthDate: e.target.value})}
                  description="Usamos isso para calcular suas necessidades metabólicas."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold font-display text-primary">Seu Objetivo</h1>
                <p className="text-muted-foreground text-sm">O que você deseja alcançar com o Body Métrica FJ?</p>
              </div>
              <div className="grid gap-4">
                <GoalOption 
                  id="loss" 
                  icon={<Scale />} 
                  title="Emagrecimento" 
                  description="Foco em perda de gordura e definição." 
                  isActive={formData.goal === 'loss'}
                  onClick={() => setFormData({...formData, goal: 'loss'})}
                />
                <GoalOption 
                  id="gain" 
                  icon={<Target />} 
                  title="Hipertrofia" 
                  description="Foco em ganho de massa muscular." 
                  isActive={formData.goal === 'gain'}
                  onClick={() => setFormData({...formData, goal: 'gain'})}
                />
                <GoalOption 
                  id="maint" 
                  icon={<User />} 
                  title="Manutenção" 
                  description="Manter o peso e melhorar a saúde." 
                  isActive={formData.goal === 'maint'}
                  onClick={() => setFormData({...formData, goal: 'maint'})}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold font-display text-primary">Ponto de Partida</h1>
                <p className="text-muted-foreground text-sm">Precisamos dessas medidas para calcular suas metas iniciais.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField 
                  label="Peso (kg)" 
                  type="number" 
                  placeholder="00.0" 
                  value={formData.weight}
                  onChange={(e: any) => setFormData({...formData, weight: e.target.value})}
                />
                <FormField 
                  label="Altura (cm)" 
                  type="number" 
                  placeholder="170" 
                  value={formData.height}
                  onChange={(e: any) => setFormData({...formData, height: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Nível de Atividade Física</Label>
                <select 
                  className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}
                >
                  <option>Sedentário (pouco ou nenhum exercício)</option>
                  <option>Levemente ativo (1-3 dias/semana)</option>
                  <option>Moderadamente ativo (3-5 dias/semana)</option>
                  <option>Muito ativo (6-7 dias/semana)</option>
                  <option>Extremamente ativo (trabalho braçal + treino)</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold font-display text-primary">Preferências de Macros</h1>
                <p className="text-muted-foreground text-sm">Como você prefere distribuir seus macronutrientes?</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Distribuição de Macros</Label>
                  <select 
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.macroPreference}
                    onChange={(e) => setFormData({...formData, macroPreference: e.target.value})}
                  >
                    <option>Equilibrado (40% C, 30% P, 30% G)</option>
                    <option>High Protein (30% C, 40% P, 30% G)</option>
                    <option>Low Carb (20% C, 40% P, 40% G)</option>
                    <option>Cetogênica (5% C, 25% P, 70% G)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Sistema de Unidades</Label>
                  <select 
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.unitSystem}
                    onChange={(e) => setFormData({...formData, unitSystem: e.target.value})}
                  >
                    <option>Métrico (kg, cm, ml)</option>
                    <option>Imperial (lbs, in, oz)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-success/20 text-success flex items-center justify-center">
                  <CheckCircle2 size={40} />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold font-display text-primary">Tudo Pronto!</h1>
                <p className="text-muted-foreground text-sm">
                  Seu perfil estratégico foi configurado. Você poderá ajustar todos os detalhes no seu dashboard de elite.
                </p>
              </div>
              <div className="surface p-6 text-left space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Resumo do Perfil</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Nome:</span> <span className="font-bold">{formData.name}</span></div>
                  <div className="flex justify-between"><span>Objetivo:</span> <span className="font-bold">{formData.goal === 'loss' ? 'Emagrecimento' : formData.goal === 'gain' ? 'Hipertrofia' : 'Manutenção'}</span></div>
                  <div className="flex justify-between"><span>Macros:</span> <span className="font-bold">{formData.macroPreference.split(' (')[0]}</span></div>
                  <div className="flex justify-between"><span>Sistema:</span> <span className="font-bold">{formData.unitSystem}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 py-8">
          {step > 1 && step < 5 && (
            <Button variant="ghost" className="h-12 gap-2" onClick={prevStep}>
              <ChevronLeft size={18} /> Voltar
            </Button>
          )}
          {step < 5 ? (
            <Button 
              className="h-12 flex-1 gap-2 text-base font-semibold" 
              onClick={() => {
                if (validateStep(step)) {
                  nextStep();
                } else {
                  toast.custom((t) => (
                    <SVGToast 
                      type="warning"
                      title="CAMPOS PENDENTES"
                      message="Por favor, preencha todos os campos obrigatórios para continuar."
                      onClose={() => toast.dismiss(t)}
                    />
                  ));
                }
              }}
            >
              Próximo <ChevronRight size={18} />
            </Button>
          ) : (
            <Button className="h-12 flex-1 gap-2 text-base font-semibold bg-brand-gradient" onClick={finish}>
              Começar Agora
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function GoalOption({ id, icon, title, description, isActive, onClick }: { id: string; icon: React.ReactNode; title: string; description: string; isActive: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${isActive ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-transparent surface hover:border-primary/20'}`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {isActive && <CheckCircle2 className="text-primary" size={20} />}
    </button>
  );
}
