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
  needsLicense?: boolean;
}

export function AccessGate({ 
  title = "ACESSO RESTRITO", 
  description = "ESTA ÁREA REQUER AUTENTICAÇÃO DE ALTO NÍVEL PARA SER ACESSADA.", 
  children, 
  isAllowed,
  needsVerification = false,
  needsLicense = false
}: AccessGateProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTarget = needsVerification ? "/auth/verify" : needsLicense ? "/settings" : "/auth";

    let timer: any;
    if (!isAllowed) {
      timer = setTimeout(() => {
        navigate({ 
          to: redirectTarget, 
          search: { 
            registerMode: false, 
            name: "", 
            birthDate: "",
            goal: "",
            weight: "",
            height: "",
            activityLevel: ""
          } 
        } as any);
      }, 3500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAllowed, navigate]);

  if (isAllowed) return <>{children}</>;

  const displayTitle = needsVerification ? "E-MAIL NÃO CONFIRMADO" : needsLicense ? "LICENÇA NECESSÁRIA" : title;
  const displayDescription = needsVerification 
    ? "POR FAVOR, CONFIRME SEU E-MAIL PARA LIBERAR O ACESSO ÀS FERRAMENTAS." 
    : needsLicense
    ? "ESTA FERRAMENTA REQUER UMA LICENÇA ATIVA. ADQUIRA A SUA NOS AJUSTES."
    : description;

  const redirectTarget = needsVerification ? "/auth/verify" : needsLicense ? "/settings" : "/auth";

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="surface max-w-xl w-full p-12 md:p-20 text-center space-y-10 relative overflow-hidden border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.6)] rounded-[3.5rem] bg-black/40 backdrop-blur-3xl group">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="mx-auto w-28 h-28 bg-brand-gradient rounded-[2rem] flex items-center justify-center text-primary-foreground shadow-[0_20px_50px_rgba(oklch(0.65_0.22_260),0.3)] border-2 border-white/20 animate-in zoom-in duration-700">
            <Lock size={56} className="group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-black font-display tracking-tighter text-white uppercase italic leading-none">
              {displayTitle}
            </h2>
            <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs max-w-sm mx-auto leading-relaxed">
              {displayDescription}
            </p>
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                Sincronizando segurança...
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Button size="lg" className="w-full sm:w-auto px-16 h-16 font-black uppercase tracking-[0.2em] bg-brand-gradient shadow-[0_20px_40px_rgba(oklch(0.65_0.22_260),0.4)] hover:scale-105 transition-all border-none rounded-[1.5rem]" asChild>
              <Link 
                to={redirectTarget as any} 
                search={{ 
                  registerMode: false, 
                  name: "", 
                  birthDate: "",
                  goal: "",
                  weight: "",
                  height: "",
                  activityLevel: ""
                } as any}
              >
                {needsVerification ? "VERIFICAR AGORA" : needsLicense ? "ADQUIRIR LICENÇA" : "ENTRAR AGORA"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
