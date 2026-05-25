import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApp, CATEGORIES } from "@/lib/store";
import { PageHeader } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, MoreHorizontal, Tv2 } from "lucide-react";

export const Route = createFileRoute("/_app/emissions/")({
  component: EmissionsListPage,
});

function EmissionsListPage() {
  const emissions = useApp((s) => s.emissions);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const filtered = emissions.filter(
    (e) =>
      (cat === "all" || e.category === cat) &&
      (q === "" || e.title.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div>
      <PageHeader
        eyebrow="Module Émissions"
        title="Émissions Al Aoula"
        description="Consultez et gérez l'ensemble des émissions diffusées sur Al Aoula. Chaque émission est associée automatiquement à un modèle de production."
        actions={
          <Link to="/emissions/new">
            <Button className="gap-2 shadow-soft">
              <Plus className="h-4 w-4" /> Nouvelle émission
            </Button>
          </Link>
        }
      />

      <Card className="p-4 border-border bg-surface shadow-soft mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une émission…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-10 h-10 bg-accent/40 border-transparent focus:bg-surface"
            />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-full sm:w-64 h-10">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="border-border bg-surface shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-5 font-medium">Émission</th>
                <th className="py-3 px-5 font-medium">Catégorie</th>
                <th className="py-3 px-5 font-medium">Modèle associé</th>
                <th className="py-3 px-5 font-medium">Responsable</th>
                <th className="py-3 px-5 font-medium">Créée le</th>
                <th className="py-3 px-5 font-medium">Statut</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  className="border-t border-border hover:bg-accent/30 transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <Link
                      to="/emissions/$id"
                      params={{ id: e.id }}
                      className="flex items-center gap-3 group"
                    >
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-soft to-accent grid place-items-center text-[color:var(--brand-deep)] font-semibold text-xs shrink-0">
                        {e.title
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <div className="font-medium group-hover:text-primary transition-colors">
                          {e.title}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {e.description}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="text-xs px-2 py-1 rounded-md bg-accent/60 text-[color:var(--brand-deep)] font-medium">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground">{e.model}</td>
                  <td className="py-3.5 px-5 text-muted-foreground">{e.responsable}</td>
                  <td className="py-3.5 px-5 text-muted-foreground tabular-nums">{e.createdAt}</td>
                  <td className="py-3.5 px-5">
                    <StatusBadge value={e.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Tv2 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <div className="text-sm text-muted-foreground">
                      Aucune émission ne correspond à votre recherche.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
