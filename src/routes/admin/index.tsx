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
  Eye,
  Plus,
  Key,
  Calendar,
  AlertCircle
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
import { useServerFn } from "@tanstack/react-start";
import { generateLicenseKey, listLicenses } from "@/lib/monetization.functions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const queryClient = useQueryClient();
  const listLicensesFn = useServerFn(listLicenses);
  const generateLicenseFn = useServerFn(generateLicenseKey);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-licenses'],
    queryFn: () => listLicensesFn(),
  });

  const generateMutation = useMutation({
    mutationFn: (days: number) => generateLicenseFn({ data: { expiresInDays: days } }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`Chave gerada: ${result.licenseKey}`);
        queryClient.invalidateQueries({ queryKey: ['admin-licenses'] });
      } else {
        toast.error(result.message);
      }
      setIsGenerating(false);
    },
    onError: () => {
      toast.error("Erro ao gerar chave.");
      setIsGenerating(false);
    }
  });

  const handleGenerate = (days: number) => {
    setIsGenerating(true);
    generateMutation.mutate(days);
  };

  const licenses = data?.licenses || [];
  const activeLicenses = licenses.filter((l: any) => l.status === 'active').length;
  const unusedLicenses = licenses.filter((l: any) => l.status === 'unused').length;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight font-display text-primary">Painel de Controle</h2>
          <p className="text-muted-foreground text-sm">
            Gerenciamento administrativo de chaves de acesso e assinaturas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => handleGenerate(365)} 
            disabled={isGenerating}
            className="gap-2 h-9 text-xs bg-brand-gradient"
          >
            <Plus size={14} /> Gerar Chave (1 Ano)
          </Button>
          <Button 
            onClick={() => handleGenerate(30)} 
            variant="outline"
            disabled={isGenerating}
            className="gap-2 h-9 text-xs"
          >
            <Plus size={14} /> Gerar Chave (30 Dias)
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Licenças" value={licenses.length.toString()} change="Total na Base" icon={<Key size={16} />} />
        <StatsCard title="Licenças Ativas" value={activeLicenses.toString()} change="Em Uso" icon={<ShieldCheck size={16} />} />
        <StatsCard title="Licenças Disponíveis" value={unusedLicenses.toString()} change="Para Ativação" icon={<History size={16} />} />
        <StatsCard title="Logs de Sistema" value="Ok" change="Status Seguro" icon={<Lock size={16} />} />
      </div>

      <Card className="surface border-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-1">
            <CardTitle className="text-xl font-display">Gerenciamento de Licenças</CardTitle>
            <CardDescription className="text-xs">Chaves geradas, status de uso e expiração.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por chave ou email..." className="pl-9 h-9 text-xs" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-muted/20">
                  <TableHead className="text-xs font-bold uppercase tracking-wider">Chave de Licença</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">Usuário</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider">Expiração</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenses.map((license: any) => (
                  <TableRow key={license.id} className="border-muted/10 hover:bg-muted/5 transition-colors">
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {license.license_key}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] font-bold uppercase px-2 py-0 border-none ${
                          license.status === 'active' ? 'bg-success/10 text-success' : 
                          license.status === 'unused' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {license.status === 'active' ? 'Ativo' : license.status === 'unused' ? 'Disponível' : 'Revogado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {license.profiles ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{license.profiles.full_name || 'Usuário'}</span>
                          <span className="text-[10px] text-muted-foreground">{license.profiles.email}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Não vinculada</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-muted-foreground" />
                        <span>
                          {license.expires_at 
                            ? format(new Date(license.expires_at), "dd/MM/yyyy", { locale: ptBR })
                            : "Vitalícia / Indefinida"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={16} className="text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {licenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle size={32} className="opacity-20" />
                        <p>Nenhuma licença encontrada.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
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
