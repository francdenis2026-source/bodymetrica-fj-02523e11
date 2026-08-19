import { createFileRoute, Link } from '@tanstack/react-router';
import { Database, ExternalLink, ShieldCheck, Terminal, Server, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/admin/infrastructure')({ component: InfrastructurePage });

function safeProjectId() {
  return String(import.meta.env.VITE_SUPABASE_PROJECT_ID || 'não configurado');
}

function safeUrl() {
  return String(import.meta.env.VITE_SUPABASE_URL || 'não configurada');
}

function InfrastructurePage() {
  const projectId = safeProjectId();
  const url = safeUrl();
  const configured = projectId !== 'não configurado' && url !== 'não configurada';
  const postgresHost = configured ? `db.${projectId}.supabase.co` : 'não configurado';
  const cliLink = configured ? `supabase link --project-ref ${projectId}` : 'supabase link --project-ref <project_id>';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon"><Link to="/admin"><ArrowLeft size={17} /></Link></Button>
            <div>
              <div className="flex items-center gap-2"><Database size={18} className="text-primary" /><h1 className="font-display text-xl font-semibold">Infraestrutura</h1></div>
              <p className="text-xs text-muted-foreground">Configuração segura do backend e Supabase.</p>
            </div>
          </div>
          <Badge variant="outline" className={configured ? 'border-success/25 bg-success/10 text-success' : 'border-warning/25 bg-warning/10 text-warning'}>{configured ? 'Configurado' : 'Pendente'}</Badge>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 md:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard icon={<Database size={18} />} title="Supabase Project ID" value={projectId} />
          <InfoCard icon={<ExternalLink size={18} />} title="URL do projeto" value={url} />
          <InfoCard icon={<Server size={18} />} title="Host PostgreSQL" value={postgresHost} />
          <InfoCard icon={<ShieldCheck size={18} />} title="Ambiente" value="Produção" />
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Terminal size={18} /> Comandos CLI</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {['supabase login', 'supabase init', cliLink].map((command) => <code key={command} className="block overflow-x-auto rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-xs">{command}</code>)}
          </CardContent>
        </Card>

        <Card className="border-primary/15 bg-primary/5">
          <CardContent className="flex gap-3 p-5">
            <ShieldCheck className="mt-0.5 shrink-0 text-primary" size={19} />
            <div>
              <div className="font-semibold">Credenciais sensíveis protegidas</div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Senhas de banco, senhas de usuários, chaves secret/service-role e connection strings com senha não são exibidas nesta interface nem devem ser gravadas no frontend. Elas devem permanecer em Secrets/Environment Variables do ambiente de produção.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function InfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return <Card><CardContent className="p-5"><div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-xs font-bold uppercase tracking-wider">{title}</span></div><div className="mt-3 break-all font-mono text-sm font-semibold">{value}</div></CardContent></Card>;
}
