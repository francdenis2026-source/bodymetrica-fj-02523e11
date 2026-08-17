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
  AlertCircle,
  Settings as SettingsIcon,
  Activity,
  Trash2,
  Database
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
import { 
  generateLicenseKey, 
  listLicenses, 
  revokeLicense, 
  updateAdminSetting, 
  getAdminSetting, 
  listAuditLogs,
  listWebhookEvents 
} from "@/lib/monetization.functions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const queryClient = useQueryClient();
  const listLicensesFn = useServerFn(listLicenses);
  const generateLicenseFn = useServerFn(generateLicenseKey);
  const revokeLicenseFn = useServerFn(revokeLicense);
  const updateSettingFn = useServerFn(updateAdminSetting);
  const getSettingFn = useServerFn(getAdminSetting);
  const listAuditLogsFn = useServerFn(listAuditLogs);
  const listWebhookEventsFn = useServerFn(listWebhookEvents);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [mpAccessToken, setMpAccessToken] = useState("");
  const [mpWebhookSecret, setMpWebhookSecret] = useState("");

  const { data: licensesData, isLoading: isLoadingLicenses } = useQuery({
    queryKey: ['admin-licenses'],
    queryFn: () => listLicensesFn(),
  });

  const { data: auditData, isLoading: isLoadingAudit } = useQuery({
    queryKey: ['admin-audit'],
    queryFn: () => listAuditLogsFn(),
  });

  useEffect(() => {
    getSettingFn({ data: "mercadopago_access_token" }).then(res => {
      if (res.success) setMpAccessToken(res.value);
    });
    getSettingFn({ data: "mercadopago_webhook_secret" }).then(res => {
      if (res.success) setMpWebhookSecret(res.value);
    });

  }, []);

  const generateMutation = useMutation({
    mutationFn: (days: number) => generateLicenseFn({ data: { expiresInDays: days } }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`Chave gerada: ${result.licenseKey}`);
        queryClient.invalidateQueries({ queryKey: ['admin-licenses'] });
        queryClient.invalidateQueries({ queryKey: ['admin-audit'] });
      } else {
        toast.error(result.message);
      }
      setIsGenerating(false);
    }
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => revokeLicenseFn({ data: { licenseId: id, reason: "Revogação manual admin" } }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['admin-licenses'] });
        queryClient.invalidateQueries({ queryKey: ['admin-audit'] });
      } else {
        toast.error(result.message);
      }
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: (value: string) => updateSettingFn({ data: { key: "mercadopago_access_token", value } }),
    onSuccess: (res) => {
      if (res.success) toast.success("API Mercado Pago atualizada!");
      else toast.error(res.message);
    }
  });

  const handleGenerate = (days: number) => {
    setIsGenerating(true);
    generateMutation.mutate(days);
  };

  const licenses = licensesData?.licenses || [];
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

      <Tabs defaultValue="licenses" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="licenses" className="text-xs uppercase font-black">Licenças</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs uppercase font-black">Auditoria</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs uppercase font-black">API Pagamento / Webhook</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses">
          <Card className="surface border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div className="space-y-1">
                <CardTitle className="text-xl font-display">Gerenciamento de Licenças</CardTitle>
                <CardDescription className="text-xs">Chaves geradas, status de uso e expiração.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLicenses ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-muted/20">
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Chave</TableHead>
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
                              license.status === 'unused' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
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
                                : "Vitalícia"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {license.status !== 'revoked' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => {
                                if (confirm("Deseja realmente revogar esta licença? O usuário perderá acesso imediato.")) {
                                  revokeMutation.mutate(license.id);
                                }
                              }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="surface border-none">
            <CardHeader>
              <CardTitle className="text-xl font-display flex items-center gap-2">
                <Activity size={20} className="text-primary" />
                Trilha de Auditoria
              </CardTitle>
              <CardDescription className="text-xs">Registro histórico de todas as movimentações de licença.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAudit ? (
                <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-muted/20">
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Ação</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Usuário Afetado</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Responsável</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Data</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(auditData?.logs || []).map((log: any) => (
                      <TableRow key={log.id} className="border-muted/10">
                        <TableCell>
                          <Badge variant="secondary" className="text-[9px] uppercase font-black">
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px]">{log.user?.email || 'Sistema'}</TableCell>
                        <TableCell className="text-[10px] font-bold">{log.admin?.email || 'Auto'}</TableCell>
                        <TableCell className="text-[10px]">{format(new Date(log.created_at), "dd/MM HH:mm")}</TableCell>
                        <TableCell className="text-[9px] text-muted-foreground truncate max-w-[150px]">
                          {JSON.stringify(log.details)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="surface border-none">
            <CardHeader>
              <CardTitle className="text-xl font-display flex items-center gap-2">
                <Database size={20} className="text-primary" />
                Integração Mercado Pago
              </CardTitle>
              <CardDescription className="text-xs">Configure as credenciais para processamento de pagamentos e renovação automática.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Access Token (Produção)</Label>
                <div className="flex gap-2">
                  <Input 
                    type="password"
                    placeholder="APP_USR-..." 
                    className="h-12 bg-white/5 border-white/10 rounded-xl px-4 font-mono text-xs"
                    value={mpAccessToken}
                    onChange={(e) => setMpAccessToken(e.target.value)}
                  />
                  <Button 
                    className="h-12 bg-primary font-black uppercase tracking-widest px-8 rounded-xl"
                    onClick={() => updateSettingMutation.mutate(mpAccessToken)}
                  >
                    SALVAR TOKEN
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Webhook Secret (Verification)</Label>
                <div className="flex gap-2">
                  <Input 
                    type="password"
                    placeholder="Assinatura secreta do Webhook..." 
                    className="h-12 bg-white/5 border-white/10 rounded-xl px-4 font-mono text-xs"
                    value={mpWebhookSecret}
                    onChange={(e) => setMpWebhookSecret(e.target.value)}
                  />
                  <Button 
                    variant="outline"
                    className="h-12 font-black uppercase tracking-widest px-8 rounded-xl"
                    onClick={() => updateSettingFn({ data: { key: "mercadopago_webhook_secret", value: mpWebhookSecret } }).then(res => {
                      if (res.success) toast.success("Webhook Secret salvo!");
                    })}
                  >
                    SALVAR SECRET
                  </Button>
                </div>
                <p className="text-[9px] text-muted-foreground italic px-1">
                  Usado para validar a integridade das requisições vindas do Mercado Pago.
                </p>
              </div>

              <div className="pt-6 border-t border-white/5">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4">Eventos de Webhook Recentes</h3>
                <WebhookEventsList listFn={listWebhookEventsFn} />
              </div>
            </CardContent>

          </Card>
        </TabsContent>
      </Tabs>
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

