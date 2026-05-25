import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, type Phase } from "@/lib/store";
import { PageHeader } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Clock, Truck } from "lucide-react";

export const Route = createFileRoute("/_app/suivi")({
  component: SuiviPage,
});

const PHASES: Phase[] = ["Pré-production", "Production", "Post-production", "Diffusion"];

function SuiviPage() {
  const { productions, emissions, blocs, demandes } = useApp();

  const totalBlocs = blocs.length;
  const planifies = blocs.filter((b) => b.status === "Planifié" || b.status === "Terminé").length;
  const incomplets = blocs.filter((b) => b.status === "Incomplet").length;
  const enAttenteMM = demandes.filter(
    (d) => d.status === "Demandée" || d.status === "En attente",
  ).length;

  return (
    <div>
      <PageHeader
        eyebrow="Suivi opérationnel"
        title="Suivi de l'avancement des productions"
        description="Vue d'ensemble du pilotage : blocs planifiés, blocs incomplets, alertes opérationnelles et demandes de moyens mobiles."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPI
          tone="primary"
          icon={CheckCircle2}
          value={`${totalBlocs ? Math.round((planifies / totalBlocs) * 100) : 0}%`}
          label="Avancement global"
        />
        <KPI
          tone="success"
          icon={CheckCircle2}
          value={planifies}
          label="Blocs planifiés / terminés"
        />
        <KPI tone="warning" icon={AlertTriangle} value={incomplets} label="Blocs incomplets" />
        <KPI tone="info" icon={Truck} value={enAttenteMM} label="Demandes MM en attente" />
      </div>

      <div className="space-y-4">
        {productions.map((p) => {
          const emi = emissions.find((e) => e.id === p.emissionId);
          const list = blocs.filter((b) => b.productionId === p.id);
          const done = list.filter((b) => b.status === "Planifié" || b.status === "Terminé").length;
          const inc = list.filter((b) => b.status === "Incomplet").length;
          const pct = list.length ? Math.round((done / list.length) * 100) : 0;
          const demandesP = demandes.filter((d) => d.productionId === p.id);

          return (
            <Card key={p.id} className="p-6 border-border bg-surface shadow-soft">
              <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                <div className="flex-1">
                  <Link to="/productions/$id" params={{ id: p.id }} className="group">
                    <div className="text-xs text-muted-foreground">
                      {emi?.title} · <span className="font-mono">{p.code}</span>
                    </div>
                    <h3 className="mt-1 font-semibold text-[color:var(--brand-night)] group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                  </Link>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {p.dateStart} → {p.dateEnd}
                    </span>
                    <StatusBadge value={p.priority} />
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Avancement</span>
                      <span className="font-medium tabular-nums">
                        {done}/{list.length} · {pct}%
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>

                  <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {PHASES.map((phase) => {
                      const ph = list.filter((b) => b.phase === phase);
                      const phDone = ph.filter(
                        (b) => b.status === "Planifié" || b.status === "Terminé",
                      ).length;
                      const phPct = ph.length ? Math.round((phDone / ph.length) * 100) : 0;
                      return (
                        <div
                          key={phase}
                          className="rounded-lg border border-border p-2.5 bg-muted/30"
                        >
                          <div className="text-[11px] text-muted-foreground">{phase}</div>
                          <div className="mt-0.5 text-sm font-semibold text-[color:var(--brand-deep)] tabular-nums">
                            {phDone}/{ph.length}
                          </div>
                          <Progress value={phPct} className="mt-1 h-1" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:w-72 space-y-2">
                  {inc > 0 && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-destructive">
                        <AlertTriangle className="h-3.5 w-3.5" /> {inc} bloc(s) incomplet(s)
                      </div>
                      <div className="text-muted-foreground mt-0.5">
                        Compléter les champs manquants.
                      </div>
                    </div>
                  )}
                  {demandesP.length > 0 && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Truck className="h-3.5 w-3.5 text-primary" /> Demandes MM
                      </div>
                      <div className="mt-1 space-y-1">
                        {demandesP.map((d) => (
                          <div key={d.id} className="flex items-center justify-between gap-2">
                            <span className="truncate text-muted-foreground">
                              {d.typeCouverture}
                            </span>
                            <StatusBadge value={d.status} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {inc === 0 && demandesP.length === 0 && (
                    <div className="rounded-lg border border-success/20 bg-success/10 p-3 text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-[color:oklch(0.4_0.15_145)]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Aucune alerte
                      </div>
                      <div className="text-muted-foreground mt-0.5">
                        La production est dans les délais.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function KPI({
  value,
  label,
  tone,
  icon: Icon,
}: {
  value: number | string;
  label: string;
  tone: "primary" | "success" | "warning" | "info";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const toneClass = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success/15 text-[color:oklch(0.45_0.15_145)]",
    warning: "bg-warning/15 text-[color:oklch(0.4_0.12_55)]",
    info: "bg-accent text-[color:var(--brand-deep)]",
  }[tone];
  return (
    <Card className="p-5 border-border bg-surface shadow-soft">
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-2xl font-bold text-[color:var(--brand-night)] tabular-nums">
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </Card>
  );
}
