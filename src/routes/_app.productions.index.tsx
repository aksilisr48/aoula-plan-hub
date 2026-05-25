import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, User as UserIcon, Clapperboard } from "lucide-react";

export const Route = createFileRoute("/_app/productions/")({
  component: ProductionsListPage,
});

function ProductionsListPage() {
  const { productions, emissions, blocs } = useApp();

  return (
    <div>
      <PageHeader
        eyebrow="Module Productions"
        title="Productions audiovisuelles"
        description="Liste consolidée des productions liées aux émissions Al Aoula. Les productions sont créées depuis la fiche d'une émission."
      />

      {productions.length === 0 ? (
        <Card className="p-12 border-dashed border-2 bg-accent/20 text-center">
          <Clapperboard className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <div className="text-sm font-medium">Aucune production enregistrée</div>
          <p className="text-xs text-muted-foreground mt-1">
            Créez une production depuis la fiche d'une émission.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {productions.map((p) => {
            const emi = emissions.find((e) => e.id === p.emissionId);
            const list = blocs.filter((b) => b.productionId === p.id);
            const done = list.filter(
              (b) => b.status === "Planifié" || b.status === "Terminé",
            ).length;
            const pct = list.length ? Math.round((done / list.length) * 100) : 0;
            return (
              <Link key={p.id} to="/productions/$id" params={{ id: p.id }}>
                <Card className="p-5 border-border bg-surface shadow-soft hover:shadow-elevated hover:border-primary/40 transition-all h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground inline-block">
                        {p.code}
                      </div>
                      <h3 className="mt-2 font-semibold text-[color:var(--brand-night)] leading-tight">
                        {p.name}
                      </h3>
                      <div className="text-xs text-muted-foreground mt-0.5">{emi?.title}</div>
                    </div>
                    <StatusBadge value={p.priority} />
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> {p.dateStart} → {p.dateEnd}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {p.lieu}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserIcon className="h-3.5 w-3.5" /> {p.responsable}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Avancement</span>
                      <span className="font-medium tabular-nums">
                        {done}/{list.length} blocs · {pct}%
                      </span>
                    </div>
                    <Progress value={pct} className="mt-1.5 h-1.5" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
