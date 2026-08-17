import React from 'react';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

interface AccessGateProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  isAllowed: boolean;
}

export function AccessGate({ 
  title = "ACESSO RESTRITO", 
  description = "ESTA ÁREA REQUER AUTENTICAÇÃO DE ALTO NÍVEL PARA SER ACESSADA.", 
  children, 
  isAllowed 
}: AccessGateProps) {
  if (isAllowed) return <>{children}</>;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="surface max-w-lg w-full p-12 text-center space-y-8 relative overflow-hidden border-white/5 shadow-2xl rounded-[3rem] bg-black/40 backdrop-blur-3xl">
        {/* Background SVG Graphic */}
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none -translate-y-1/4 translate-x-1/4">
          <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

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
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <Button className="h-14 font-black uppercase tracking-widest bg-brand-gradient shadow-2xl shadow-primary/30 hover:scale-105 transition-all border-none rounded-2xl" asChild>
              <Link to="/auth" search={{ registerMode: false, name: "", birthDate: "" }}>
                ENTRAR AGORA
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
              Sua segurança é nossa prioridade máxima.
            </p>
          </div>
        </div>

        {/* Professional SVG Overlay Message Component */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gradient opacity-50" />
      </div>
    </div>
  );
}
