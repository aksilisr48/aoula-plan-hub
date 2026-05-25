import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Truck, MapPin, Calendar, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/demandes-mm/")({
  component: DemandesMMPage,
});

function DemandesMMPage() {
  const { demandes, emissions, productions } = useApp();

  const counts = {
    total: demandes.length,
    attente: demandes.filter((d) => d.status === "Demandée" || d.status === "En attente").length,
    validees: demandes.filter((d) => d.status === "Validée").length,
    refusees: demandes.filter((d) => d.status === "Refusée").length,
  };

  return (
    <div>
      <PageHeader
        eyebrow="Module Moyens Mobiles"
        title="Demandes de moyens mobiles"
        description="Suivez l'état des demandes adressées au responsable des moyens mobiles pour les couvertures extérieures."
        actions={
          <Link to="/demandes-mm/new">
            <Button className="gap-2 shadow-soft"><Plus className="h-4 w-4" /> Nouvelle demande</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KPI label="Total demandes" value={counts.total} tone="muted" />
        <KPI label="En attente" value={counts.attente} tone="warning" />
        <KPI label="Validées" value={counts.validees} tone="success" />
        <KPI label="Refusées" value={counts.refusees} tone="destructive" />
      </div>

      {demandes.length === 0 ? (
        <Card className="p-12 border-dashed border-2 bg-accent/20 text-center">
          <Truck className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <div className="text-sm font-medium">Aucune demande pour le moment</div>
        </Card>
      ) : (
        <div className="space-y-3">
          {demandes.map((d) => {
            const emi = emissions.find((e) => e.id === d.emissionId);
            const prod = productions.find((p) => p.id === d.productionId);
            return (
              <Card key={d.id} className="p-5 border-border bg-surface shadow-soft hover:shadow-elevated transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-[color:var(--brand-night)]">{d.typeCouverture}</h3>
                        <StatusBadge value={d.status} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">
                        {emi?.title} · {prod?.name}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {d.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {d.heure}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {d.lieu}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 lg:max-w-sm lg:justify-end">
                    {d.ressources.map((r) => (
                      <span key={r} className="text-[11px] px-2 py-1 rounded-md bg-accent/60 text-[color:var(--brand-deep)]">{r}</span>
                    ))}
                  </div>
                </div>
                {d.justification && (
                  <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/70">Justification : </span>{d.justification}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, tone }: { label: string; value: number; tone: "muted" | "warning" | "success" | "destructive" }) {
  const toneClass = {
    muted: "bg-muted/40 text-foreground",
    warning: "bg-warning/10 text-[color:oklch(0.4_0.12_55)]",
    success: "bg-success/10 text-[color:oklch(0.4_0.15_145)]",
    destructive: "bg-destructive/10 text-destructive",
  }[tone];
  return (
    <Card className="p-5 border-border bg-surface shadow-soft">
      <div className={`text-2xl font-bold tabular-nums ${toneClass.split(" ").slice(1).join(" ")}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </Card>
  );
}
