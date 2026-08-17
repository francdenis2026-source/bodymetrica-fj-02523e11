import React, { useEffect } from 'react';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from '@tanstack/react-router';


interface AccessGateProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  isAllowed: boolean;
  needsVerification?: boolean;
}

export function AccessGate({ 
  title = "ACESSO RESTRITO", 
  description = "ESTA ÁREA REQUER AUTENTICAÇÃO DE ALTO NÍVEL PARA SER ACESSADA.", 
  children, 
  isAllowed,
  needsVerification = false
}: AccessGateProps) {
  const navigate = useNavigate();

  useEffect(() => {
    let timer: any;
    if (!isAllowed) {
      timer = setTimeout(() => {
        navigate({ 
          to: "/auth", 
          search: { 
            registerMode: false, 
            name: "", 
            birthDate: "",
            goal: "",
            weight: "",
            height: "",
            activityLevel: ""
          } 
        });
      }, 3500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAllowed, navigate]);

  if (isAllowed) return <>{children}</>;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="surface max-w-lg w-full p-12 text-center space-y-8 relative overflow-hidden border-white/5 shadow-2xl rounded-[3rem] bg-black/40 backdrop-blur-3xl">
        <div className="relative z-10 space-y-6">
          <div className="mx-auto w-24 h-24 bg-brand-gradient rounded-3xl flex items-center justify-center text-primary-foreground shadow-2xl border-2 border-white/20 animate-pulse">
            <Lock size={48} />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black font-display tracking-tighter text-white uppercase italic">
              {title}
            </h2>
            <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">
              {description}
            </p>
            <p className="text-primary font-black uppercase tracking-widest text-[10px] animate-pulse">
              Redirecionando para o sistema de autenticação...
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <Button className="h-14 font-black uppercase tracking-widest bg-brand-gradient shadow-2xl shadow-primary/30 hover:scale-105 transition-all border-none rounded-2xl" asChild>
              <Link 
                to="/auth" 
                search={{ 
                  registerMode: false, 
                  name: "", 
                  birthDate: "",
                  goal: "",
                  weight: "",
                  height: "",
                  activityLevel: ""
                }}
              >
                ENTRAR AGORA
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
