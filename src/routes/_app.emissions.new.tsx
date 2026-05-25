import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useApp, CATEGORIES, CATEGORY_TO_MODEL, type EmissionCategory, type Priority, type Status } from "@/lib/store";
import { PageHeader } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/emissions/new")({
  component: NewEmissionPage,
});

function NewEmissionPage() {
  const navigate = useNavigate();
  const addEmission = useApp((s) => s.addEmission);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EmissionCategory | "">("");
  const [responsable, setResponsable] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Normale");
  const [status, setStatus] = useState<Status>("Actif");

  const associatedModel = useMemo(
    () => (category ? CATEGORY_TO_MODEL[category as EmissionCategory] : null),
    [category],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !category || !responsable) {
      toast.error("Veuillez compléter les champs obligatoires");
      return;
    }
    const em = addEmission({
      title,
      category: category as EmissionCategory,
      responsable,
      description,
      priority,
      status,
    });
    toast.success("Émission créée", { description: `${em.title} a été enregistrée avec son modèle de production.` });
    navigate({ to: "/emissions/$id", params: { id: em.id } });
  }

  return (
    <div className="max-w-4xl">
      <Link to="/emissions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="h-4 w-4" /> Retour aux émissions
      </Link>
      <PageHeader
        eyebrow="Nouvelle émission"
        title="Créer une émission"
        description="Renseignez les informations de la nouvelle émission. Un modèle de production sera associé automatiquement selon la catégorie choisie."
      />

      <form onSubmit={submit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2 p-6 border-border bg-surface shadow-soft space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'émission <span className="text-destructive">*</span></Label>
              <Input id="title" placeholder="Ex. JT Al Aoula 20h30" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Catégorie <span className="text-destructive">*</span></Label>
                <Select value={category} onValueChange={(v) => setCategory(v as EmissionCategory)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner une catégorie" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resp">Responsable <span className="text-destructive">*</span></Label>
                <Input id="resp" placeholder="Ex. M. El Idrissi" value={responsable} onChange={(e) => setResponsable(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Basse", "Normale", "Haute", "Critique"] as Priority[]).map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Statut</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Brouillon">Brouillon</SelectItem>
                    <SelectItem value="Archivé">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={4} placeholder="Décrivez brièvement l'émission, sa ligne éditoriale, son public cible…" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button type="submit" className="shadow-soft">Enregistrer l'émission</Button>
              <Link to="/emissions"><Button type="button" variant="outline">Annuler</Button></Link>
            </div>
          </Card>

          <Card className="p-6 border-border bg-gradient-to-br from-primary-soft to-accent/40 shadow-soft h-fit">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-deep)]">
              <Sparkles className="h-3.5 w-3.5" /> Modèle de production
            </div>
            <h3 className="mt-2 font-semibold text-[color:var(--brand-night)]">Association automatique</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Selon la catégorie choisie, mPlanner associe automatiquement un modèle de production avec ses phases et blocs opérationnels.
            </p>
            <div className="mt-4 rounded-xl bg-surface border border-border p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Modèle associé</div>
              <div className="mt-1 font-semibold text-[color:var(--brand-deep)]">
                {associatedModel ?? "— Aucun (sélectionnez une catégorie)"}
              </div>
            </div>
            <ul className="mt-4 text-xs text-muted-foreground space-y-1.5">
              <li className="flex gap-2"><span className="text-primary">•</span> Pré-production</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Production</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Post-production</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Diffusion</li>
            </ul>
          </Card>
        </div>
      </form>
    </div>
  );
}
