import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useApp, type BlocStatus } from "@/lib/store";
import { PageHeader } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { CalendarRange, MapPin, Truck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/planification")({
  component: PlanificationPage,
});

const RESSOURCES_HUMAINES = [
  "Réalisateur",
  "Cadreur",
  "Ingénieur son",
  "Présentateur",
  "Monteur",
  "Journaliste",
  "Coordinateur plateau",
  "Maquilleur",
];
const RESSOURCES_MATERIELLES = [
  "Caméra studio",
  "Caméra ENG",
  "Micro HF",
  "Console mixage",
  "Éclairage plateau",
  "Téléprompteur",
  "Régie portable",
];

function PlanificationPage() {
  const navigate = useNavigate();
  const { productions, emissions, blocs, updateBloc } = useApp();
  const [selectedProd, setSelectedProd] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return blocs.filter(
      (b) =>
        (selectedProd === "all" || b.productionId === selectedProd) &&
        (statusFilter === "all" || b.status === statusFilter),
    );
  }, [blocs, selectedProd, statusFilter]);

  const bloc = blocs.find((b) => b.id === editing);

  // form state mirrors bloc
  const [form, setForm] = useState<Record<string, unknown>>({});

  function openEditor(id: string) {
    const b = blocs.find((x) => x.id === id);
    if (!b) return;
    setForm({
      dateStart: b.dateStart ?? "",
      dateEnd: b.dateEnd ?? b.dateStart ?? "",
      timeStart: b.timeStart ?? "",
      timeEnd: b.timeEnd ?? "",
      lieu: b.lieu ?? "",
      responsable: b.responsable ?? "",
      ressourcesHumaines: b.ressourcesHumaines ?? [],
      ressourcesMaterielles: b.ressourcesMaterielles ?? [],
      besoinMM: b.besoinMM ?? false,
      commentaire: b.commentaire ?? "",
    });
    setEditing(id);
  }

  function save() {
    if (!bloc) return;
    const f = form as {
      dateStart: string;
      dateEnd: string;
      timeStart: string;
      timeEnd: string;
      lieu: string;
      responsable: string;
      ressourcesHumaines: string[];
      ressourcesMaterielles: string[];
      besoinMM: boolean;
      commentaire: string;
    };
    const complet =
      f.dateStart &&
      f.timeStart &&
      f.timeEnd &&
      f.lieu &&
      f.responsable &&
      f.ressourcesHumaines.length > 0;
    const newStatus: BlocStatus = complet ? "Planifié" : "Incomplet";
    updateBloc(bloc.id, { ...f, status: newStatus });
    toast.success(complet ? "Bloc planifié" : "Bloc enregistré (incomplet)", {
      description: complet
        ? "La planification du bloc a été enregistrée."
        : "Certains champs requis sont manquants.",
    });
    if (f.besoinMM) {
      toast.info("Besoin de moyens mobiles signalé", {
        description: "Créer la demande pour le bloc planifié.",
        action: {
          label: "Créer la demande",
          onClick: () => navigate({ to: "/demandes-mm/new", search: { blocId: bloc.id } as never }),
        },
      });
    }
    setEditing(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Module Planification"
        title="Planification des blocs opérationnels"
        description="Affectez dates, horaires, ressources et lieux à chaque bloc. Signalez les besoins de moyens mobiles pour déclencher une demande."
      />

      <Card className="p-4 border-border bg-surface shadow-soft mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select value={selectedProd} onValueChange={setSelectedProd}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les productions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les productions</SelectItem>
              {productions.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="Non planifié">Non planifié</SelectItem>
              <SelectItem value="Planifié">Planifié</SelectItem>
              <SelectItem value="Incomplet">Incomplet</SelectItem>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Terminé">Terminé</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-end text-sm text-muted-foreground">
            <CalendarRange className="h-4 w-4 mr-2" /> {filtered.length} blocs
          </div>
        </div>
      </Card>

      <Card className="border-border bg-surface shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-5 font-medium">Bloc</th>
                <th className="py-3 px-5 font-medium">Phase</th>
                <th className="py-3 px-5 font-medium">Production</th>
                <th className="py-3 px-5 font-medium">Date</th>
                <th className="py-3 px-5 font-medium">Lieu</th>
                <th className="py-3 px-5 font-medium">Statut</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const prod = productions.find((p) => p.id === b.productionId);
                const emi = prod && emissions.find((e) => e.id === prod.emissionId);
                return (
                  <tr
                    key={b.id}
                    className="border-t border-border hover:bg-accent/30 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-medium flex items-center gap-2">
                        {b.name}
                        {b.besoinMM && (
                          <span
                            title="Besoin de moyens mobiles"
                            className="inline-flex items-center gap-1 text-[10px] text-warning"
                          >
                            <Truck className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{emi?.title}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-xs px-2 py-0.5 rounded bg-accent/60 text-[color:var(--brand-deep)]">
                        {b.phase}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-muted-foreground">{prod?.code}</td>
                    <td className="py-3.5 px-5 text-muted-foreground tabular-nums">
                      {b.dateStart ?? "—"}
                    </td>
                    <td className="py-3.5 px-5 text-muted-foreground">{b.lieu ?? "—"}</td>
                    <td className="py-3.5 px-5">
                      <StatusBadge value={b.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Button
                        size="sm"
                        variant={
                          b.status === "Planifié" || b.status === "Terminé" ? "outline" : "default"
                        }
                        onClick={() => openEditor(b.id)}
                      >
                        {b.status === "Non planifié" ? "Planifier" : "Modifier"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
          {bloc && (
            <>
              <SheetHeader className="p-0 mb-5">
                <SheetTitle className="text-xl">{bloc.name}</SheetTitle>
                <SheetDescription>
                  Phase{" "}
                  <span className="font-medium text-[color:var(--brand-deep)]">{bloc.phase}</span> —
                  renseignez les informations de planification.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Date début">
                    <Input
                      type="date"
                      value={(form.dateStart as string) ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, dateStart: e.target.value }))}
                    />
                  </Field>
                  <Field label="Date fin">
                    <Input
                      type="date"
                      value={(form.dateEnd as string) ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, dateEnd: e.target.value }))}
                    />
                  </Field>
                  <Field label="Heure début">
                    <Input
                      type="time"
                      value={(form.timeStart as string) ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, timeStart: e.target.value }))}
                    />
                  </Field>
                  <Field label="Heure fin">
                    <Input
                      type="time"
                      value={(form.timeEnd as string) ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, timeEnd: e.target.value }))}
                    />
                  </Field>
                </div>

                <Field label="Lieu">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Studio A — SNRT Rabat"
                      value={(form.lieu as string) ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, lieu: e.target.value }))}
                    />
                  </div>
                </Field>

                <Field label="Responsable du bloc">
                  <Input
                    placeholder="Ex. M. El Idrissi"
                    value={(form.responsable as string) ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, responsable: e.target.value }))}
                  />
                </Field>

                <Field label="Ressources humaines">
                  <ChipPicker
                    options={RESSOURCES_HUMAINES}
                    value={(form.ressourcesHumaines as string[]) ?? []}
                    onChange={(v) => setForm((f) => ({ ...f, ressourcesHumaines: v }))}
                  />
                </Field>

                <Field label="Ressources matérielles">
                  <ChipPicker
                    options={RESSOURCES_MATERIELLES}
                    value={(form.ressourcesMaterielles as string[]) ?? []}
                    onChange={(v) => setForm((f) => ({ ...f, ressourcesMaterielles: v }))}
                  />
                </Field>

                <Field label="Commentaire">
                  <Textarea
                    rows={3}
                    value={(form.commentaire as string) ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, commentaire: e.target.value }))}
                  />
                </Field>

                <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={(form.besoinMM as boolean) ?? false}
                      onCheckedChange={(v) => setForm((f) => ({ ...f, besoinMM: !!v }))}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        <Truck className="h-4 w-4 text-warning" /> Ce bloc nécessite des moyens
                        mobiles
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Une demande pourra être adressée au responsable des moyens mobiles après
                        enregistrement.
                      </div>
                    </div>
                  </label>
                </div>

                {!(form.dateStart && form.lieu && form.responsable) && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-warning" /> Date, lieu et
                    responsable sont requis pour finaliser la planification.
                  </div>
                )}
              </div>

              <SheetFooter className="mt-6 p-0">
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Annuler
                </Button>
                <Button onClick={save} className="shadow-soft">
                  Enregistrer la planification
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ChipPicker({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(active ? value.filter((x) => x !== o) : [...value, o])}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-surface border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
