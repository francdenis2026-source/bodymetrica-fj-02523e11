import React from 'react';
import { ArrowRight, Lock, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from '@tanstack/react-router';

interface AccessGateProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  isAllowed: boolean;
  needsVerification?: boolean;
  needsLicense?: boolean;
}

const PUBLIC_AUTH_ROUTES = ['/auth', '/auth/register', '/auth/verify', '/auth/recover', '/admin/login'];

export function AccessGate({
  title = 'Acesso protegido',
  description = 'Entre na sua conta para continuar e acessar este módulo com seus dados sincronizados.',
  children,
  isAllowed,
  needsVerification = false,
  needsLicense = false,
}: AccessGateProps) {
  const location = useLocation();
  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.includes(location.pathname);
  const effectiveAllowed = isAllowed || isPublicAuthRoute;

  if (effectiveAllowed) return <>{children}</>;

  const displayTitle = needsVerification
    ? 'Confirme seu e-mail'
    : needsLicense
      ? 'Licença necessária'
      : title;

  const displayDescription = needsVerification
    ? 'Confirme seu endereço de e-mail para liberar o acesso aos módulos protegidos.'
    : needsLicense
      ? 'Este recurso precisa de uma licença ativa. Você pode revisar sua situação nas configurações.'
      : description;

  const redirectTarget = needsVerification ? '/auth/verify' : needsLicense ? '/settings' : '/auth';
  const primaryLabel = needsVerification ? 'Verificar agora' : needsLicense ? 'Revisar licença' : 'Entrar na conta';

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden px-4 py-8 md:px-6">
      <img
        src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=84&w=1800"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-background/68 dark:bg-background/78" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/96 via-background/82 to-background/48 dark:from-background/98 dark:via-background/90 dark:to-background/62" />

      <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-border/80 bg-background/96 shadow-2xl shadow-black/15 md:grid-cols-[0.95fr_1.05fr]">
        <section className="on-media relative min-h-[300px] overflow-hidden md:min-h-[430px]">
          <img
            src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=86&w=1200"
            alt="Pessoa treinando com foco e acompanhamento"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/38 to-black/10" />
          <div className="relative flex h-full flex-col justify-between p-5 text-white sm:p-6 md:p-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/15 bg-black/25 px-2.5 py-1.5 text-[11px] font-semibold text-white/85">
              <Sparkles size={14} className="text-primary" />
              Acesso aos módulos
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Body Métrica FJ</p>
              <h1 className="mt-2 max-w-sm font-display text-3xl font-semibold leading-[1.04] tracking-[-0.035em] sm:text-4xl">
                Seus dados ficam melhores quando continuam conectados.
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/68">
                Entre para abrir o módulo com seu histórico, metas e registros disponíveis no mesmo contexto.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center p-5 sm:p-7 md:p-8">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Lock size={19} />
            </div>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">Área protegida</p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-[-0.035em]">{displayTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{displayDescription}</p>

            <div className="mt-5 rounded-xl border border-border/70 bg-muted/35 p-3.5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold">Por que pedimos autenticação?</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Para manter métricas, histórico e preferências associados à conta correta.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-2.5">
              <Button asChild className="h-11 rounded-xl font-semibold">
                <Link
                  to={redirectTarget as any}
                  search={{
                    registerMode: false,
                    name: '',
                    birthDate: '',
                    goal: '',
                    weight: '',
                    height: '',
                    activityLevel: '',
                  } as any}
                >
                  {primaryLabel}
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>

              {!needsVerification && !needsLicense && (
                <Button asChild variant="outline" className="h-11 rounded-xl bg-background font-medium">
                  <Link to="/auth/register" search={{} as any}>
                    <UserPlus size={16} className="mr-2" />
                    Criar nova conta
                  </Link>
                </Button>
              )}
            </div>

            <p className="mt-4 text-center text-[11px] text-muted-foreground">Você escolhe quando continuar. Não há redirecionamento automático.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
