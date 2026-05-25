import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp, type Priority } from "@/lib/store";
import { PageHeader } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Clapperboard,
  Calendar,
  MapPin,
  User as UserIcon,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/emissions/$id")({
  component: EmissionDetailPage,
});

function EmissionDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const emission = useApp((s) => s.emissions.find((e) => e.id === id));
  const productions = useApp((s) => s.productions.filter((p) => p.emissionId === id));
  const addProduction = useApp((s) => s.addProduction);

  const [open, setOpen] = useState(false);
  const [pName, setPName] = useState("");
  const [pStart, setPStart] = useState("");
  const [pEnd, setPEnd] = useState("");
  const [pLieu, setPLieu] = useState("");
  const [pResp, setPResp] = useState("");
  const [pPrio, setPPrio] = useState<Priority>("Normale");
  const [pCom, setPCom] = useState("");

  if (!emission) {
    return (
      <div className="text-sm text-muted-foreground">
        Émission introuvable.{" "}
        <Link to="/emissions" className="text-primary">
          Retour à la liste
        </Link>
      </div>
    );
  }

  function createProd() {
    if (!pName || !pStart || !pEnd || !pResp) {
      toast.error("Veuillez compléter les champs obligatoires");
      return;
    }
    const prod = addProduction({
      name: pName,
      emissionId: emission!.id,
      dateStart: pStart,
      dateEnd: pEnd,
      lieu: pLieu,
      responsable: pResp,
      priority: pPrio,
      commentaire: pCom,
    });
    setOpen(false);
    toast.success("Production créée", {
      description: `${prod.name} héritera du modèle ${emission!.model} avec ses blocs opérationnels.`,
    });
    navigate({ to: "/productions/$id", params: { id: prod.id } });
  }

  return (
    <div>
      <Link
        to="/emissions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux émissions
      </Link>

      <Card className="p-6 border-border bg-surface shadow-soft mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex gap-5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-soft to-accent grid place-items-center text-[color:var(--brand-deep)] font-bold text-lg shrink-0">
              {emission.title
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Fiche émission
              </div>
              <h1 className="text-2xl font-bold text-[color:var(--brand-night)] tracking-tight mt-1">
                {emission.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-md bg-accent/60 text-[color:var(--brand-deep)] font-medium">
                  {emission.category}
                </span>
                <StatusBadge value={emission.status} />
                <StatusBadge value={emission.priority} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground max-w-2xl">{emission.description}</p>
            </div>
          </div>
          <Button className="gap-2 shadow-soft" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Ajouter production
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCell icon={ListChecks} label="Modèle associé" value={emission.model} />
          <InfoCell icon={UserIcon} label="Responsable" value={emission.responsable} />
          <InfoCell icon={Calendar} label="Créée le" value={emission.createdAt} />
          <InfoCell icon={Clapperboard} label="Productions" value={String(productions.length)} />
        </div>
      </Card>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-[color:var(--brand-night)]">
          Productions associées
        </h2>
      </div>

      {productions.length === 0 ? (
        <Card className="p-12 border-dashed border-2 bg-accent/20 text-center">
          <Clapperboard className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <div className="text-sm font-medium">Aucune production pour le moment</div>
          <p className="text-xs text-muted-foreground mt-1">
            Créez une première production. Elle héritera automatiquement du modèle{" "}
            <span className="font-medium text-[color:var(--brand-deep)]">{emission.model}</span>.
          </p>
          <Button className="mt-4 shadow-soft" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Ajouter production
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {productions.map((p) => (
            <Link key={p.id} to="/productions/$id" params={{ id: p.id }}>
              <Card className="p-5 border-border bg-surface shadow-soft hover:shadow-elevated hover:border-primary/40 transition-all cursor-pointer h-full">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {p.code}
                  </span>
                  <StatusBadge value={p.priority} />
                </div>
                <h3 className="mt-3 font-semibold text-[color:var(--brand-night)]">{p.name}</h3>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
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
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle production</DialogTitle>
            <DialogDescription>
              La production héritera automatiquement du modèle{" "}
              <span className="font-medium text-[color:var(--brand-deep)]">{emission.model}</span>{" "}
              avec ses phases et blocs opérationnels.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label>Nom de la production *</Label>
              <Input
                placeholder="Ex. JT 20h30 — Édition 30 mai"
                value={pName}
                onChange={(e) => setPName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Date début *</Label>
              <Input type="date" value={pStart} onChange={(e) => setPStart(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Date fin *</Label>
              <Input type="date" value={pEnd} onChange={(e) => setPEnd(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Lieu principal</Label>
              <Input
                placeholder="Studio A — SNRT Rabat"
                value={pLieu}
                onChange={(e) => setPLieu(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Responsable *</Label>
              <Input
                placeholder="Ex. M. El Idrissi"
                value={pResp}
                onChange={(e) => setPResp(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select value={pPrio} onValueChange={(v) => setPPrio(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Basse", "Normale", "Haute", "Critique"] as Priority[]).map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Commentaire</Label>
              <Textarea
                rows={3}
                value={pCom}
                onChange={(e) => setPCom(e.target.value)}
                placeholder="Notes opérationnelles, contraintes, instructions…"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={createProd}>Créer la production</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoCell({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-sm font-medium text-[color:var(--brand-night)] truncate">
        {value}
      </div>
    </div>
  );
}
