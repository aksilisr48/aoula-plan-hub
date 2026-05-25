import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Briefcase, Building2, KeyRound } from "lucide-react";

export const Route = createFileRoute("/_app/profil")({
  component: ProfilPage,
});

function ProfilPage() {
  const user = useApp((s) => s.user);

  return (
    <div className="max-w-4xl">
      <PageHeader
        eyebrow="Mon compte"
        title="Profil utilisateur"
        description="Consultez et mettez à jour vos informations personnelles. Le changement de mot de passe est géré par l'administrateur SNRT."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-6 border-border bg-surface shadow-soft text-center lg:text-left">
          <div className="flex flex-col items-center lg:items-start">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[color:var(--brand-deep)] to-primary text-white grid place-items-center text-2xl font-bold shadow-soft">
              {user.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
            <h2 className="mt-4 font-semibold text-[color:var(--brand-night)]">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.role}</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-soft text-[color:var(--brand-deep)] px-3 py-1 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Compte actif
            </span>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 border-border bg-surface shadow-soft space-y-5">
          <h3 className="font-semibold text-[color:var(--brand-night)]">
            Informations personnelles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <Input defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label>Adresse e-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" defaultValue={user.email} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" defaultValue={user.role} readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Service</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" defaultValue={user.service} readOnly />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button className="shadow-soft">Enregistrer les modifications</Button>
            <Link to="/reset-password">
              <Button variant="outline" className="gap-2">
                <KeyRound className="h-4 w-4" /> Changer mon mot de passe
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
