import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Users, 
  ShieldCheck, 
  FileDown, 
  Search, 
  Filter, 
  MoreVertical,
  ArrowUpRight,
  History,
  Lock,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const clients = [
    { id: 1, name: "Ana Oliveira", email: "ana.o@email.com", plan: "Premium", status: "Ativo", lastSync: "2h atrás" },
    { id: 2, name: "Carlos Santos", email: "c.santos@email.com", plan: "Basic", status: "Inativo", lastSync: "5d atrás" },
    { id: 3, name: "Mariana Costa", email: "mari.c@email.com", plan: "Premium", status: "Ativo", lastSync: "30min atrás" },
    { id: 4, name: "Ricardo Lima", email: "r.lima@email.com", plan: "Pro", status: "Pendente", lastSync: "-" },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight font-display text-primary">Painel de Controle</h2>
          <p className="text-muted-foreground text-sm">
            Gerenciamento administrativo de clientes, auditoria e relatórios.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-9 text-xs">
            <History size={14} /> Auditoria
          </Button>
          <Button className="gap-2 h-9 text-xs bg-brand-gradient">
            <FileDown size={14} /> Exportar Relatórios
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Clientes" value="1,284" change="+12%" icon={<Users size={16} />} />
        <StatsCard title="Assinaturas Ativas" value="942" change="+5%" icon={<ShieldCheck size={16} />} />
        <StatsCard title="Acessos Hoje" value="456" change="+18%" icon={<ArrowUpRight size={16} />} />
        <StatsCard title="Logs de Auditoria" value="24" change="Críticos" icon={<Lock size={16} />} negative />
      </div>

      <Card className="surface border-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-1">
            <CardTitle className="text-xl font-display">Gerenciamento de Clientes</CardTitle>
            <CardDescription className="text-xs">Lista completa de usuários e status de acesso.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar cliente..." className="pl-9 h-9 text-xs" />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-muted/20">
                <TableHead className="text-xs font-bold uppercase tracking-wider">Cliente</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Plano</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Último Acesso</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="border-muted/10 hover:bg-muted/5 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{client.name}</span>
                      <span className="text-[10px] text-muted-foreground">{client.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase px-2 py-0 border-primary/20 bg-primary/5 text-primary">
                      {client.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        client.status === 'Ativo' ? 'bg-success' : 
                        client.status === 'Pendente' ? 'bg-warning' : 'bg-muted'
                      }`} />
                      <span className="text-xs">{client.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {client.lastSync}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link to="/about">
                        <Eye size={16} className="text-muted-foreground" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical size={16} className="text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, change, icon, negative }: { title: string; value: string; change: string; icon: React.ReactNode; negative?: boolean }) {
  return (
    <Card className="surface border-none p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold font-display">{value}</div>
        <p className={`text-[10px] font-bold uppercase ${negative ? 'text-destructive' : 'text-success'}`}>
          {change}
        </p>
      </div>
    </Card>
  );
}
