import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/AppLayout";
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
import { ArrowLeft, Truck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/demandes-mm/new")({
  component: NewDemandeMMPage,
  validateSearch: (s: Record<string, unknown>) => ({
    blocId: typeof s.blocId === "string" ? s.blocId : undefined,
  }),
});

const TYPES = [
  "Reportage extérieur",
  "Duplex direct",
  "Couverture événementielle",
  "Captation sportive",
  "Captation culturelle",
];
const RESSOURCES = [
  "Régie mobile",
  "Camion",
  "Fourgonnette",
  "Équipe caméra",
  "Son",
  "Éclairage",
  "Unité de transmission",
];

function NewDemandeMMPage() {
  const navigate = useNavigate();
  const { blocId } = Route.useSearch();
  const { emissions, productions, blocs, addDemandeMM } = useApp();

  const presetBloc = blocs.find((b) => b.id === blocId);
  const presetProd = presetBloc
    ? productions.find((p) => p.id === presetBloc.productionId)
    : undefined;

  const [emissionId, setEmissionId] = useState(presetProd?.emissionId ?? "");
  const [productionId, setProductionId] = useState(presetProd?.id ?? "");
  const [bloc, setBloc] = useState(presetBloc?.id ?? "");
  const [type, setType] = useState("");
  const [date, setDate] = useState(presetBloc?.dateStart ?? "");
  const [heure, setHeure] = useState(presetBloc?.timeStart ?? "");
  const [lieu, setLieu] = useState(presetBloc?.lieu ?? "");
  const [ressources, setRessources] = useState<string[]>([]);
  const [justification, setJustification] = useState("");

  const prodsFiltered = useMemo(
    () => productions.filter((p) => !emissionId || p.emissionId === emissionId),
    [productions, emissionId],
  );
  const blocsFiltered = useMemo(
    () => blocs.filter((b) => !productionId || b.productionId === productionId),
    [blocs, productionId],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !emissionId ||
      !productionId ||
      !bloc ||
      !type ||
      !date ||
      !lieu ||
      ressources.length === 0
    ) {
      toast.error("Veuillez compléter tous les champs requis");
      return;
    }
    addDemandeMM({
      emissionId,
      productionId,
      blocId: bloc,
      typeCouverture: type,
      date,
      heure,
      lieu,
      ressources,
      justification,
    });
    toast.success("Demande envoyée", {
      description: "Le responsable des moyens mobiles a été notifié.",
    });
    navigate({ to: "/demandes-mm" });
  }

  return (
    <div className="max-w-4xl">
      <Link
        to="/demandes-mm"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux demandes
      </Link>
      <PageHeader
        eyebrow="Nouvelle demande"
        title="Demande de moyens mobiles"
        description="Renseignez les informations nécessaires à la préparation de la couverture extérieure."
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-6 border-border bg-surface shadow-soft space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Émission *</Label>
              <Select
                value={emissionId}
                onValueChange={(v) => {
                  setEmissionId(v);
                  setProductionId("");
                  setBloc("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {emissions.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Production *</Label>
              <Select
                value={productionId}
                onValueChange={(v) => {
                  setProductionId(v);
                  setBloc("");
                }}
                disabled={!emissionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {prodsFiltered.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Bloc concerné *</Label>
              <Select value={bloc} onValueChange={setBloc} disabled={!productionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un bloc" />
                </SelectTrigger>
                <SelectContent>
                  {blocsFiltered.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.phase} — {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Type de couverture extérieure *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Heure</Label>
              <Input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Lieu *</Label>
              <Input
                placeholder="Adresse / site"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Ressources demandées *</Label>
              <div className="flex flex-wrap gap-1.5">
                {RESSOURCES.map((r) => {
                  const active = ressources.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() =>
                        setRessources((prev) =>
                          active ? prev.filter((x) => x !== r) : [...prev, r],
                        )
                      }
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-surface border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Justification / commentaire</Label>
              <Textarea
                rows={4}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Précisez le contexte, l'urgence, les contraintes techniques…"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" className="shadow-soft">
              Envoyer la demande
            </Button>
            <Link to="/demandes-mm">
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 border-border bg-gradient-to-br from-primary-soft to-accent/40 shadow-soft h-fit">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-deep)]">
            <Truck className="h-3.5 w-3.5" /> Workflow
          </div>
          <h3 className="mt-2 font-semibold text-[color:var(--brand-night)]">
            Cheminement de la demande
          </h3>
          <ol className="mt-3 space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-semibold">1.</span> Vous envoyez la demande
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">2.</span> Le responsable MM la reçoit et
              la traite
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">3.</span> Validation ou refus motivé
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">4.</span> Les ressources sont intégrées
              au bloc planifié
            </li>
          </ol>
        </Card>
      </form>
    </div>
  );
}
