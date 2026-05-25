import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tv2,
  Clapperboard,
  CalendarRange,
  CheckCircle2,
  Truck,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  Plus,
  CalendarPlus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

const ACTIVITY_DATA = [
  { day: "Lun", planifies: 4, termines: 2 },
  { day: "Mar", planifies: 6, termines: 3 },
  { day: "Mer", planifies: 5, termines: 4 },
  { day: "Jeu", planifies: 8, termines: 5 },
  { day: "Ven", planifies: 7, termines: 6 },
  { day: "Sam", planifies: 3, termines: 3 },
  { day: "Dim", planifies: 2, termines: 1 },
];

function DashboardPage() {
  const { emissions, productions, blocs, demandes, user } = useApp();
  const blocsPlanifies = blocs.filter((b) => b.status === "Planifié" || b.status === "Terminé").length;
  const blocsAPlanifier = blocs.filter((b) => b.status === "Non planifié" || b.status === "Incomplet").length;
  const demandesAttente = demandes.filter((d) => d.status === "Demandée" || d.status === "En attente").length;
  const avancement = blocs.length ? Math.round((blocsPlanifies / blocs.length) * 100) : 0;

  const recentEmissions = emissions.slice(0, 4);
  const aPlanifier = blocs.filter((b) => b.status === "Non planifié").slice(0, 5);

  const kpis = [
    { label: "Émissions", value: emissions.length, icon: Tv2, hint: "Actives sur Al Aoula", trend: "+2 ce mois" },
    { label: "Productions", value: productions.length, icon: Clapperboard, hint: "En cours", trend: "+1 cette semaine" },
    { label: "Blocs à planifier", value: blocsAPlanifier, icon: CalendarRange, hint: "Non encore programmés", trend: null },
    { label: "Blocs planifiés", value: blocsPlanifies, icon: CheckCircle2, hint: "Programmés ou terminés", trend: `${avancement}% du total` },
    { label: "Demandes MM", value: demandesAttente, icon: Truck, hint: "En attente de validation", trend: null },
    { label: "Avancement global", value: `${avancement}%`, icon: TrendingUp, hint: "Productions Al Aoula", trend: null },
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={`Bonjour ${user.name.split(" ")[0]}`}
        title="Vue d'ensemble — Espace Al Aoula"
        description="Suivi de l'avancement des productions, planification des blocs opérationnels et coordination des moyens mobiles."
        actions={
          <>
            <Link to="/emissions/new">
              <Button variant="outline" className="gap-2"><Plus className="h-4 w-4" /> Nouvelle émission</Button>
            </Link>
            <Link to="/planification">
              <Button className="gap-2 shadow-soft"><CalendarPlus className="h-4 w-4" /> Planifier un bloc</Button>
            </Link>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="p-5 border-border bg-surface shadow-soft hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary grid place-items-center">
                  <Icon className="h-5 w-5" />
                </div>
                {k.trend && (
                  <span className="text-[11px] font-medium text-muted-foreground">{k.trend}</span>
                )}
              </div>
              <div className="mt-4 text-2xl font-bold text-[color:var(--brand-night)] tracking-tight">{k.value}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{k.label}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <Card className="lg:col-span-2 p-6 border-border bg-surface shadow-soft">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-semibold text-[color:var(--brand-night)]">Activité de planification — 7 derniers jours</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Blocs planifiés et blocs terminés</p>
            </div>
            <div className="flex gap-3 text-xs">
              <Legend color="oklch(0.62 0.19 255)" label="Planifiés" />
              <Legend color="oklch(0.66 0.18 145)" label="Terminés" />
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer>
              <AreaChart data={ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.19 255)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.62 0.19 255)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.66 0.18 145)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.66 0.18 145)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.92 0.012 250)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "oklch(0.52 0.04 257)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "oklch(0.52 0.04 257)" }} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid oklch(0.92 0.012 250)",
                    borderRadius: 12,
                    fontSize: 12,
                    boxShadow: "0 8px 32px rgba(9,8,41,0.08)",
                  }}
                />
                <Area type="monotone" dataKey="planifies" stroke="oklch(0.62 0.19 255)" strokeWidth={2.5} fill="url(#gp)" />
                <Area type="monotone" dataKey="termines" stroke="oklch(0.66 0.18 145)" strokeWidth={2.5} fill="url(#gt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Avancement */}
        <Card className="p-6 border-border bg-surface shadow-soft">
          <h3 className="font-semibold text-[color:var(--brand-night)]">Avancement par production</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Blocs planifiés sur l'ensemble</p>
          <div className="mt-5 space-y-4">
            {productions.map((p) => {
              const list = blocs.filter((b) => b.productionId === p.id);
              const done = list.filter((b) => b.status === "Planifié" || b.status === "Terminé").length;
              const pct = list.length ? Math.round((done / list.length) * 100) : 0;
              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium truncate pr-2">{p.name}</div>
                    <div className="text-xs text-muted-foreground tabular-nums">{done}/{list.length} · {pct}%</div>
                  </div>
                  <Progress value={pct} className="mt-1.5 h-1.5" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Emissions récentes */}
        <Card className="lg:col-span-2 p-6 border-border bg-surface shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-[color:var(--brand-night)]">Émissions récentes</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Dernières émissions enregistrées sur Al Aoula</p>
            </div>
            <Link to="/emissions" className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline">
              Voir tout <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentEmissions.map((e) => (
              <Link
                key={e.id}
                to="/emissions/$id"
                params={{ id: e.id }}
                className="flex items-center gap-4 py-3 -mx-2 px-2 rounded-lg hover:bg-accent/40 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-soft to-accent grid place-items-center text-[color:var(--brand-deep)] font-semibold text-sm">
                  {e.title.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{e.category} · {e.responsable}</div>
                </div>
                <StatusBadge value={e.status} />
              </Link>
            ))}
          </div>
        </Card>

        {/* Alertes */}
        <Card className="p-6 border-border bg-surface shadow-soft">
          <h3 className="font-semibold text-[color:var(--brand-night)] flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> Alertes opérationnelles
          </h3>
          <div className="mt-4 space-y-3">
            <AlertCard
              tone="warning"
              title={`${demandesAttente} demande(s) MM en attente`}
              desc="À traiter par le responsable des moyens mobiles."
            />
            <AlertCard
              tone="info"
              title={`${aPlanifier.length} blocs non planifiés`}
              desc="Pensez à compléter la planification cette semaine."
            />
            <AlertCard
              tone="success"
              title="Aucun retard critique"
              desc="Toutes les productions sont dans les délais."
            />
          </div>
        </Card>
      </div>

      {/* Productions à planifier */}
      <Card className="p-6 border-border bg-surface shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[color:var(--brand-night)]">Blocs à planifier</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Prochaines actions de planification</p>
          </div>
          <Link to="/planification" className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline">
            Ouvrir la planification <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2.5 font-medium">Bloc</th>
                <th className="py-2.5 font-medium">Phase</th>
                <th className="py-2.5 font-medium">Production</th>
                <th className="py-2.5 font-medium">Statut</th>
                <th className="py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {aPlanifier.map((b) => {
                const prod = productions.find((p) => p.id === b.productionId);
                return (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                    <td className="py-3 font-medium">{b.name}</td>
                    <td className="py-3 text-muted-foreground">{b.phase}</td>
                    <td className="py-3 text-muted-foreground">{prod?.name}</td>
                    <td className="py-3"><StatusBadge value={b.status} /></td>
                    <td className="py-3 text-right">
                      <Link to="/planification">
                        <Button size="sm" variant="outline">Planifier</Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}

function AlertCard({ tone, title, desc }: { tone: "warning" | "info" | "success"; title: string; desc: string }) {
  const styles = {
    warning: "bg-warning/10 border-warning/25",
    info: "bg-primary-soft border-primary/15",
    success: "bg-success/10 border-success/20",
  }[tone];
  return (
    <div className={`rounded-xl border p-3 ${styles}`}>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
    </div>
  );
}
