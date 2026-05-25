import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, type Phase } from "@/lib/store";
import { PageHeader } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, MapPin, User as UserIcon, Clapperboard, ListChecks, CalendarPlus } from "lucide-react";

export const Route = createFileRoute("/_app/productions/$id")({
  component: ProductionDetailPage,
});

const PHASES: Phase[] = ["Pré-production", "Production", "Post-production", "Diffusion"];

const PHASE_COLORS: Record<Phase, string> = {
  "Pré-production": "from-[oklch(0.92_0.05_230)] to-[oklch(0.96_0.03_245)]",
  Production: "from-[oklch(0.92_0.08_55)] to-[oklch(0.97_0.04_55)]",
  "Post-production": "from-[oklch(0.92_0.08_145)] to-[oklch(0.97_0.04_145)]",
  Diffusion: "from-[oklch(0.92_0.08_280)] to-[oklch(0.96_0.04_280)]",
};

function ProductionDetailPage() {
  const { id } = Route.useParams();
  const prod = useApp((s) => s.productions.find((p) => p.id === id));
  const emi = useApp((s) => (prod ? s.emissions.find((e) => e.id === prod.emissionId) : undefined));
  const blocs = useApp((s) => s.blocs.filter((b) => b.productionId === id));

  if (!prod) return <div className="text-sm text-muted-foreground">Production introuvable.</div>;

  const done = blocs.filter((b) => b.status === "Planifié" || b.status === "Terminé").length;
  const pct = blocs.length ? Math.round((done / blocs.length) * 100) : 0;

  return (
    <div>
      <Link to="/productions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="h-4 w-4" /> Retour aux productions
      </Link>

      <Card className="p-6 border-border bg-surface shadow-soft mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{prod.code}</span>
              {emi && <Link to="/emissions/$id" params={{ id: emi.id }} className="text-primary hover:underline">{emi.title}</Link>}
            </div>
            <h1 className="mt-2 text-2xl font-bold text-[color:var(--brand-night)] tracking-tight">{prod.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{prod.commentaire}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge value={prod.priority} />
              {emi && <span className="text-xs px-2 py-1 rounded-md bg-accent/60 text-[color:var(--brand-deep)] font-medium">{emi.model}</span>}
            </div>
          </div>
          <div className="w-full lg:w-72">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Avancement</span>
              <span className="font-medium tabular-nums">{done}/{blocs.length} · {pct}%</span>
            </div>
            <Progress value={pct} className="h-2" />
            <Link to="/planification" className="mt-3 block">
              <Button className="w-full gap-2 shadow-soft"><CalendarPlus className="h-4 w-4" /> Planifier les blocs</Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCell icon={Calendar} label="Période" value={`${prod.dateStart} → ${prod.dateEnd}`} />
          <InfoCell icon={MapPin} label="Lieu principal" value={prod.lieu} />
          <InfoCell icon={UserIcon} label="Responsable" value={prod.responsable} />
          <InfoCell icon={ListChecks} label="Blocs opérationnels" value={String(blocs.length)} />
        </div>
      </Card>

      <h2 className="text-lg font-semibold text-[color:var(--brand-night)] mb-3">Phases & blocs opérationnels</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {PHASES.map((phase) => {
          const list = blocs.filter((b) => b.phase === phase);
          return (
            <Card key={phase} className="p-5 border-border bg-surface shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${PHASE_COLORS[phase]} grid place-items-center text-[color:var(--brand-deep)] font-bold text-sm`}>
                    {phase[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-[color:var(--brand-night)] text-sm">{phase}</div>
                    <div className="text-[11px] text-muted-foreground">{list.length} blocs</div>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                {list.map((b) => (
                  <div key={b.id} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-muted/40 hover:bg-accent/40 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Clapperboard className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium truncate">{b.name}</span>
                    </div>
                    <StatusBadge value={b.status} />
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function InfoCell({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-sm font-medium text-[color:var(--brand-night)] truncate">{value}</div>
    </div>
  );
}
