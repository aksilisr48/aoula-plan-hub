import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    toast.success("Demande envoyée", { description: "L'administrateur a été notifié par e-mail." });
  }

  return (
    <AuthShell
      title="Réinitialisation du mot de passe"
      subtitle="Saisissez votre adresse professionnelle. L'administrateur recevra votre demande et vous transmettra un mot de passe temporaire par SMS."
    >
      {!sent ? (
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse professionnelle</Label>
            <Input id="email" type="email" placeholder="p.nom@snrt.ma" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" required />
          </div>
          <Button type="submit" className="h-11 w-full gap-2 shadow-soft">
            <Mail className="h-4 w-4" /> Envoyer la demande
          </Button>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Retour à la connexion
          </Link>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl bg-success/10 border border-success/20 p-5">
            <div className="font-semibold text-[color:oklch(0.4_0.15_145)]">Demande transmise</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Vous recevrez un mot de passe temporaire par SMS. À la prochaine connexion, il vous sera demandé de le modifier.
            </p>
          </div>
          <Link to="/login">
            <Button variant="outline" className="h-11 w-full gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour à la connexion
            </Button>
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
