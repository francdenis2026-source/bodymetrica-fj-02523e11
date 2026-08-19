import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Copy,
  CreditCard,
  Database,
  Droplets,
  Dumbbell,
  ExternalLink,
  Eye,
  Filter,
  Gauge,
  History,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  Pill,
  Plus,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  Utensils,
  Webhook,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SVGToast } from "@/components/ui/svg-toast";
import { clearSession } from "@/lib/auth/auth.functions";
import {
  generateLicenseKey,
  getAdminSetting,
  listAuditLogs,
  listLicenses,
  listWebhookEvents,
  revokeLicense,
  updateAdminSetting,
} from "@/lib/monetization.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const PLATFORM_MODULES = [
  { title: "Dashboard", description: "Visão do usuário e evolução geral", to: "/dashboard", icon: LayoutDashboard },
  { title: "Perfil", description: "Dados cadastrais e objetivos", to: "/profile", icon: UserRound },
  { title: "Composição", description: "Métricas e composição corporal", to: "/body", icon: Gauge },
  { title: "Nutrição", description: "Plano e registros alimentares", to: "/nutrition", icon: Utensils },
  { title: "Hidratação", description: "Metas e consumo de água", to: "/hydration", icon: Droplets },
  { title: "Protocolos", description: "Suplementos e protocolos", to: "/supplements", icon: Pill },
  { title: "Performance", description: "Treinos e acompanhamento", to: "/training", icon: Dumbbell },
  { title: "Configurações", description: "Preferências e conta", to: "/settings", icon: Settings },
];

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unused" | "revoked">("all");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [licenseToRevoke, setLicenseToRevoke] = useState<any>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: licensesData, isLoading: isLoadingLicenses } = useQuery({
    queryKey: ["admin-licenses"],
    queryFn: () => listLicensesFn(),
  });

  const { data: auditData, isLoading: isLoadingAudit } = useQuery({
    queryKey: ["admin-audit"],
    queryFn: () => listAuditLogsFn(),
  });

  useEffect(() => {
    getSettingFn({ data: "mercadopago_access_token" }).then((res) => {
      if (res.success) setMpAccessToken(res.value || "");
    });
    getSettingFn({ data: "mercadopago_webhook_secret" }).then((res) => {
      if (res.success) setMpWebhookSecret(res.value || "");
    });
  }, []);

  const generateMutation = useMutation({
    mutationFn: (days: number) => generateLicenseFn({ data: { expiresInDays: days } }),
    onSuccess: (result) => {
      if (result.success) {
        toast.custom((t) => (
          <SVGToast
            type="success"
            title="CHAVE GERADA"
            message={`Nova licença: ${result.licenseKey}`}
            onClose={() => toast.dismiss(t)}
          />
        ));
        queryClient.invalidateQueries({ queryKey: ["admin-licenses"] });
        queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
      } else {
        toast.custom((t) => (
          <SVGToast
            type="error"
            title="ERRO NA GERAÇÃO"
            message={result.message}
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
      setIsGenerating(false);
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => revokeLicenseFn({ data: { licenseId: id, reason: "Revogação manual admin" } }),
    onSuccess: (result) => {
      setLicenseToRevoke(null);
      if (result.success) {
        toast.custom((t) => (
          <SVGToast
            type="success"
            title="LICENÇA REVOGADA"
            message={result.message}
            onClose={() => toast.dismiss(t)}
          />
        ));
        queryClient.invalidateQueries({ queryKey: ["admin-licenses"] });
        queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
      } else {
        toast.custom((t) => (
          <SVGToast
            type="error"
            title="ERRO NA REVOGAÇÃO"
            message={result.message}
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
    },
  });

  const updateTokenMutation = useMutation({
    mutationFn: (value: string) => updateSettingFn({ data: { key: "mercadopago_access_token", value } }),
    onSuccess: (res) => {
      toast.custom((t) => (
        <SVGToast
          type={res.success ? "success" : "error"}
          title={res.success ? "TOKEN ATUALIZADO" : "ERRO AO SALVAR"}
          message={res.success ? "Credencial do Mercado Pago salva com sucesso." : res.message}
          onClose={() => toast.dismiss(t)}
        />
      ));
    },
  });

  const updateWebhookSecretMutation = useMutation({
    mutationFn: (value: string) => updateSettingFn({ data: { key: "mercadopago_webhook_secret", value } }),
    onSuccess: (res) => {
      toast.custom((t) => (
        <SVGToast
          type={res.success ? "success" : "error"}
          title={res.success ? "WEBHOOK CONFIGURADO" : "ERRO AO SALVAR"}
          message={res.success ? "Secret de verificação salvo com sucesso." : res.message}
          onClose={() => toast.dismiss(t)}
        />
      ));
    },
  });

  const licenses = licensesData?.licenses || [];
  const activeLicenses = licenses.filter((license: any) => license.status === "active").length;
  const unusedLicenses = licenses.filter((license: any) => license.status === "unused").length;
  const revokedLicenses = licenses.filter((license: any) => license.status === "revoked").length;
  const recentAuditCount = (auditData?.logs || []).length;

  const filteredLicenses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return licenses.filter((license: any) => {
      const matchesStatus = statusFilter === "all" || license.status === statusFilter;
      const searchable = [
        license.license_key,
        license.profiles?.email,
        license.profiles?.name,
        license.profiles?.full_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesStatus && (!normalizedSearch || searchable.includes(normalizedSearch));
    });
  }, [licenses, searchTerm, statusFilter]);

  const handleGenerate = (days: number) => {
    setIsGenerating(true);
    generateMutation.mutate(days);
  };

  const refreshAdminData = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-licenses"] });
    queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
    queryClient.invalidateQueries({ queryKey: ["admin-webhooks"] });
    toast.success("Dados administrativos atualizados.");
  };

  const copyLicense = async (licenseKey: string) => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      toast.success("Chave copiada.");
    } catch {
      toast.error("Não foi possível copiar a chave.");
    }
  };

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
    } finally {
      clearSession();
      window.location.href = "/admin/login";
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=86&w=2200"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/96 to-primary/10" />
        <div className="absolute -right-32 top-12 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px] space-y-6 px-4 py-4 sm:px-6 md:space-y-8 md:px-8 md:py-7 xl:px-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card/78 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=88&w=2000"
            alt="Academia moderna"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

          <div className="relative grid min-h-[340px] gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-9 lg:p-11">
            <div className="flex max-w-3xl flex-col justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  <ShieldCheck size={14} />
                  Central administrativa
                </div>
                <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  Controle a plataforma inteira em um só lugar.
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Licenças, auditoria, pagamentos, webhooks e acesso rápido aos módulos do Body Métrica FJ em uma visão operacional única.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <Button onClick={() => handleGenerate(365)} disabled={isGenerating} className="h-11 rounded-xl px-5 font-semibold">
                  <Plus size={16} className="mr-2" /> Gerar licença anual
                </Button>
                <Button onClick={() => handleGenerate(30)} disabled={isGenerating} variant="secondary" className="h-11 rounded-xl px-5 font-semibold">
                  <KeyRound size={16} className="mr-2" /> Gerar 30 dias
                </Button>
                <Button onClick={refreshAdminData} variant="outline" className="h-11 rounded-xl bg-background/55 px-4 font-semibold backdrop-blur">
                  <RefreshCw size={16} className="mr-2" /> Atualizar dados
                </Button>
              </div>
            </div>

            <div className="flex items-end md:justify-end">
              <div className="w-full max-w-sm rounded-[1.5rem] border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">Status operacional</p>
                    <p className="mt-1 text-lg font-semibold text-white">Sistema disponível</p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                    <CheckCircle2 size={21} />
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <HeroMetric label="Licenças ativas" value={activeLicenses.toString()} />
                  <HeroMetric label="Eventos de auditoria" value={recentAuditCount.toString()} />
                </div>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-white/50">
                  <Server size={13} className="text-primary" />
                  Supabase + painel administrativo sincronizados
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard title="Total de licenças" value={licenses.length.toString()} description="Base completa" icon={KeyRound} />
          <MetricCard title="Ativas" value={activeLicenses.toString()} description="Acesso liberado" icon={ShieldCheck} emphasis="success" />
          <MetricCard title="Disponíveis" value={unusedLicenses.toString()} description="Prontas para ativação" icon={History} />
          <MetricCard title="Revogadas" value={revokedLicenses.toString()} description="Sem acesso" icon={Lock} emphasis="danger" />
          <MetricCard title="Auditoria" value={recentAuditCount.toString()} description="Eventos carregados" icon={Activity} />
        </section>

        <section className="rounded-[1.75rem] border border-border/70 bg-card/72 p-5 shadow-xl shadow-black/5 backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={17} />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em]">Central da plataforma</span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">Acesso rápido a todos os módulos</h2>
              <p className="mt-1 text-sm text-muted-foreground">Abra qualquer área para conferência operacional sem perder o contexto administrativo.</p>
            </div>
            <Button asChild variant="outline" className="h-10 rounded-xl bg-background/60">
              <Link to="/" target="_blank">
                Ver site <ExternalLink size={14} className="ml-2" />
              </Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM_MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.to}
                  to={module.to as any}
                  className="group rounded-2xl border border-border/65 bg-background/55 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/[0.04] hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                      <Icon size={18} />
                    </div>
                    <ArrowRight size={15} className="mt-1 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">{module.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{module.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <Tabs defaultValue="licenses" className="space-y-4">
          <div className="overflow-x-auto pb-1">
            <TabsList className="h-auto min-w-max rounded-2xl border border-border/70 bg-card/80 p-1.5 backdrop-blur-xl">
              <TabsTrigger value="licenses" className="rounded-xl px-4 py-2.5 text-xs font-semibold">Licenças</TabsTrigger>
              <TabsTrigger value="audit" className="rounded-xl px-4 py-2.5 text-xs font-semibold">Auditoria</TabsTrigger>
              <TabsTrigger value="integrations" className="rounded-xl px-4 py-2.5 text-xs font-semibold">Integrações</TabsTrigger>
              <TabsTrigger value="webhooks" className="rounded-xl px-4 py-2.5 text-xs font-semibold">Webhooks</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="licenses" className="mt-0">
            <Card className="overflow-hidden rounded-[1.75rem] border-border/70 bg-card/78 shadow-xl shadow-black/5 backdrop-blur-xl">
              <CardHeader className="gap-5 border-b border-border/60 p-5 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <CardTitle className="font-display text-2xl font-semibold">Gerenciamento de licenças</CardTitle>
                    <CardDescription className="mt-1">Pesquise, filtre, copie ou revogue chaves de acesso.</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative min-w-[240px]">
                      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Buscar chave, nome ou e-mail"
                        className="h-10 rounded-xl bg-background/70 pl-9"
                      />
                    </div>
                    <div className="flex items-center gap-1 rounded-xl border border-border bg-background/70 p-1">
                      <Filter size={14} className="ml-2 text-muted-foreground" />
                      {(["all", "active", "unused", "revoked"] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-colors ${statusFilter === status ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          {status === "all" ? "Todas" : status === "active" ? "Ativas" : status === "unused" ? "Livres" : "Revogadas"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingLicenses ? (
                  <LoadingState label="Carregando licenças" />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-wider">Chave</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider">Status</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider">Usuário</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider">Expiração</TableHead>
                          <TableHead className="pr-6 text-right text-[10px] font-bold uppercase tracking-wider">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLicenses.map((license: any) => (
                          <TableRow key={license.id} className="border-border/50">
                            <TableCell className="pl-6">
                              <div className="flex items-center gap-2">
                                <span className="max-w-[220px] truncate font-mono text-xs font-semibold text-primary">{license.license_key}</span>
                                <button onClick={() => copyLicense(license.license_key)} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" title="Copiar chave">
                                  <Copy size={13} />
                                </button>
                              </div>
                            </TableCell>
                            <TableCell><LicenseStatus status={license.status} /></TableCell>
                            <TableCell>
                              {license.profiles ? (
                                <div>
                                  <p className="text-sm font-medium">{license.profiles.name || license.profiles.full_name || "Usuário"}</p>
                                  <p className="text-[11px] text-muted-foreground">{license.profiles.email || "Sem e-mail"}</p>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">Não vinculada</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-xs">
                                <Calendar size={13} className="text-muted-foreground" />
                                {license.expires_at ? format(new Date(license.expires_at), "dd MMM yyyy", { locale: ptBR }) : "Vitalícia"}
                              </div>
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              {license.status !== "revoked" && (
                                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setLicenseToRevoke(license)}>
                                  <Trash2 size={14} className="mr-1.5" /> Revogar
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredLicenses.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="h-28 text-center text-sm text-muted-foreground">Nenhuma licença encontrada com os filtros atuais.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="mt-0">
            <Card className="overflow-hidden rounded-[1.75rem] border-border/70 bg-card/78 shadow-xl shadow-black/5 backdrop-blur-xl">
              <CardHeader className="border-b border-border/60 p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Activity size={18} /></div>
                  <div>
                    <CardTitle className="font-display text-2xl font-semibold">Trilha de auditoria</CardTitle>
                    <CardDescription className="mt-1">Histórico de movimentações administrativas e de licença.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingAudit ? (
                  <LoadingState label="Carregando auditoria" />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="pl-6 text-[10px] font-bold uppercase">Ação</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase">Usuário afetado</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase">Responsável</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase">Data</TableHead>
                          <TableHead className="pr-6 text-[10px] font-bold uppercase">Detalhes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(auditData?.logs || []).map((log: any) => (
                          <TableRow key={log.id} className="border-border/50">
                            <TableCell className="pl-6"><Badge variant="secondary" className="text-[9px] font-bold uppercase">{log.action}</Badge></TableCell>
                            <TableCell className="text-xs">{log.user?.email || "Sistema"}</TableCell>
                            <TableCell className="text-xs font-medium">{log.admin?.email || "Automação"}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{format(new Date(log.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                            <TableCell className="max-w-[320px] truncate pr-6 text-[11px] text-muted-foreground">{JSON.stringify(log.details)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-0">
            <div className="grid gap-4 xl:grid-cols-[1fr_0.72fr]">
              <Card className="rounded-[1.75rem] border-border/70 bg-card/78 shadow-xl shadow-black/5 backdrop-blur-xl">
                <CardHeader className="p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><CreditCard size={18} /></div>
                    <div>
                      <CardTitle className="font-display text-2xl font-semibold">Mercado Pago</CardTitle>
                      <CardDescription className="mt-1">Credenciais de cobrança, renovação e validação de eventos.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 px-5 pb-6 md:px-6">
                  <SettingField
                    label="Access Token de produção"
                    value={mpAccessToken}
                    onChange={setMpAccessToken}
                    placeholder="APP_USR-..."
                    actionLabel="Salvar token"
                    loading={updateTokenMutation.isPending}
                    onSave={() => updateTokenMutation.mutate(mpAccessToken)}
                  />
                  <SettingField
                    label="Webhook Secret"
                    value={mpWebhookSecret}
                    onChange={setMpWebhookSecret}
                    placeholder="Assinatura secreta do webhook"
                    actionLabel="Salvar secret"
                    loading={updateWebhookSecretMutation.isPending}
                    onSave={() => updateWebhookSecretMutation.mutate(mpWebhookSecret)}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border-border/70 bg-card/78 shadow-xl shadow-black/5 backdrop-blur-xl">
                <CardHeader className="p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500"><Database size={18} /></div>
                    <div>
                      <CardTitle className="font-display text-xl font-semibold">Infraestrutura</CardTitle>
                      <CardDescription className="mt-1">Resumo da arquitetura conectada.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 px-5 pb-6 md:px-6">
                  <InfraRow icon={Database} label="Banco e autenticação" value="Supabase" />
                  <InfraRow icon={CreditCard} label="Pagamentos" value="Mercado Pago" />
                  <InfraRow icon={Webhook} label="Eventos" value="Webhooks" />
                  <InfraRow icon={ShieldCheck} label="Controle de acesso" value="Admin / Super Admin" />
                  <div className="rounded-xl border border-border/70 bg-background/55 p-4 text-xs leading-5 text-muted-foreground">
                    Configurações sensíveis permanecem isoladas da área de usuário e protegidas pelas permissões administrativas do banco.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="mt-0">
            <Card className="rounded-[1.75rem] border-border/70 bg-card/78 shadow-xl shadow-black/5 backdrop-blur-xl">
              <CardHeader className="p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Webhook size={18} /></div>
                  <div>
                    <CardTitle className="font-display text-2xl font-semibold">Monitor de webhooks</CardTitle>
                    <CardDescription className="mt-1">Eventos recentes recebidos pela camada de pagamentos.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-6 md:px-6">
                <WebhookEventsList listFn={listWebhookEventsFn} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <section className="flex flex-col gap-4 rounded-[1.75rem] border border-destructive/15 bg-destructive/[0.035] p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive"><LogOut size={18} /></div>
            <div>
              <h2 className="font-display text-lg font-semibold">Encerrar sessão administrativa</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Use esta ação ao terminar o gerenciamento. A sessão do Supabase e o estado local serão encerrados.</p>
            </div>
          </div>
          <Button variant="destructive" className="h-10 rounded-xl px-5 font-semibold" onClick={() => setShowLogoutConfirm(true)}>
            <LogOut size={16} className="mr-2" /> Sair do administrador
          </Button>
        </section>
      </div>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar sessão administrativa?</AlertDialogTitle>
            <AlertDialogDescription>
              Você será desconectado do painel e precisará informar suas credenciais novamente para retornar à área administrativa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} disabled={isSigningOut} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isSigningOut ? "Saindo..." : "Confirmar saída"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!licenseToRevoke} onOpenChange={(open) => !open && setLicenseToRevoke(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Revogar esta licença?</AlertDialogTitle>
            <AlertDialogDescription>
              O usuário vinculado perderá o acesso imediatamente. Esta ação ficará registrada na trilha de auditoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => licenseToRevoke && revokeMutation.mutate(licenseToRevoke.id)}
            >
              Confirmar revogação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/45">{label}</p>
    </div>
  );
}

function MetricCard({ title, value, description, icon: Icon, emphasis }: { title: string; value: string; description: string; icon: any; emphasis?: "success" | "danger" }) {
  const iconClass = emphasis === "success" ? "bg-emerald-500/10 text-emerald-500" : emphasis === "danger" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary";
  return (
    <Card className="rounded-2xl border-border/70 bg-card/74 shadow-lg shadow-black/5 backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground">{title}</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{description}</p>
          </div>
          <div className={`flex size-9 items-center justify-center rounded-xl ${iconClass}`}><Icon size={17} /></div>
        </div>
      </CardContent>
    </Card>
  );
}

function LicenseStatus({ status }: { status: string }) {
  const styles = status === "active"
    ? "bg-emerald-500/10 text-emerald-500"
    : status === "unused"
      ? "bg-amber-500/10 text-amber-500"
      : "bg-destructive/10 text-destructive";
  return (
    <Badge variant="outline" className={`border-0 text-[9px] font-bold uppercase ${styles}`}>
      {status === "active" ? "Ativa" : status === "unused" ? "Disponível" : "Revogada"}
    </Badge>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-muted-foreground">
      <RefreshCw size={17} className="animate-spin text-primary" />
      {label}
    </div>
  );
}

function SettingField({ label, value, onChange, placeholder, actionLabel, onSave, loading }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; actionLabel: string; onSave: () => void; loading: boolean }) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground">{label}</Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input type="password" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 rounded-xl bg-background/70 font-mono text-xs" />
        <Button onClick={onSave} disabled={loading || !value.trim()} className="h-11 rounded-xl px-5 font-semibold sm:min-w-[145px]">
          {loading ? "Salvando..." : actionLabel}
        </Button>
      </div>
    </div>
  );
}

function InfraRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/65 bg-background/55 px-3.5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon size={14} /></div>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="text-[11px] font-semibold text-muted-foreground">{value}</span>
    </div>
  );
}

function WebhookEventsList({ listFn }: { listFn: any }) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-webhooks"],
    queryFn: () => listFn(),
  });

  if (isLoading) return <LoadingState label="Carregando webhooks" />;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/65">
      <Table>
        <TableHeader className="bg-muted/35">
          <TableRow>
            <TableHead className="pl-5 text-[9px] font-bold uppercase">ID do evento</TableHead>
            <TableHead className="text-[9px] font-bold uppercase">Tópico</TableHead>
            <TableHead className="text-[9px] font-bold uppercase">Usuário</TableHead>
            <TableHead className="text-[9px] font-bold uppercase">Status</TableHead>
            <TableHead className="text-[9px] font-bold uppercase">Data</TableHead>
            <TableHead className="pr-5 text-right text-[9px] font-bold uppercase">Detalhes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data?.events || []).map((event: any) => (
            <TableRow key={event.id} className="border-border/50">
              <TableCell className="max-w-[180px] truncate pl-5 font-mono text-[10px] text-muted-foreground">{event.event_id}</TableCell>
              <TableCell className="text-[10px] font-semibold">{event.topic}</TableCell>
              <TableCell className="max-w-[120px] truncate font-mono text-[9px] text-muted-foreground">{event.processed_by_user_id || "-"}</TableCell>
              <TableCell>
                <Badge className={`border-0 text-[8px] font-bold uppercase ${event.status === "processed" ? "bg-emerald-500/10 text-emerald-500" : event.status === "failed" ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-500"}`}>
                  {event.status}
                </Badge>
              </TableCell>
              <TableCell className="text-[10px] text-muted-foreground">{format(new Date(event.created_at), "dd/MM HH:mm")}</TableCell>
              <TableCell className="pr-5 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => alert(`Detalhes do Evento:\n\nMotivo: ${event.failure_reason || "N/A"}\nErro: ${event.error_message || "N/A"}\n\nPayload: ${JSON.stringify(event.payload, null, 2)}`)}
                >
                  <Eye size={13} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {(!data?.events || data.events.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} className="h-28 text-center text-xs text-muted-foreground">Nenhum evento registrado.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
