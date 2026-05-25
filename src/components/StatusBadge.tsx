import { cn } from "@/lib/utils";

const MAP: Record<string, string> = {
  // Statuts émission / production
  Actif: "bg-success/12 text-[color:oklch(0.45_0.15_145)] ring-success/20",
  Brouillon: "bg-muted text-muted-foreground ring-border",
  Archivé: "bg-muted text-muted-foreground ring-border",

  // Bloc
  "Non planifié": "bg-muted text-muted-foreground ring-border",
  Planifié: "bg-primary-soft text-[color:var(--brand-deep)] ring-primary/20",
  "En cours": "bg-warning/15 text-[color:oklch(0.4_0.12_55)] ring-warning/25",
  Terminé: "bg-success/12 text-[color:oklch(0.45_0.15_145)] ring-success/20",
  Incomplet: "bg-destructive/10 text-destructive ring-destructive/20",

  // MM
  Demandée: "bg-primary-soft text-[color:var(--brand-deep)] ring-primary/20",
  "En attente": "bg-warning/15 text-[color:oklch(0.4_0.12_55)] ring-warning/25",
  Validée: "bg-success/12 text-[color:oklch(0.45_0.15_145)] ring-success/20",
  Refusée: "bg-destructive/10 text-destructive ring-destructive/20",

  // Priorités
  Basse: "bg-muted text-muted-foreground ring-border",
  Normale: "bg-accent text-[color:var(--brand-deep)] ring-primary/15",
  Haute: "bg-warning/15 text-[color:oklch(0.4_0.12_55)] ring-warning/25",
  Critique: "bg-destructive/10 text-destructive ring-destructive/20",
};

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        MAP[value] ?? "bg-muted text-muted-foreground ring-border",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {value}
    </span>
  );
}
