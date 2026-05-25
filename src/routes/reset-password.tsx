import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

const RULES = [
  { test: (p: string) => p.length >= 10, label: "Au moins 10 caractères" },
  { test: (p: string) => /[A-Z]/.test(p), label: "Une majuscule" },
  { test: (p: string) => /[0-9]/.test(p), label: "Un chiffre" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "Un caractère spécial" },
];

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [temp, setTemp] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");

  const allOk = RULES.every((r) => r.test(pwd)) && pwd === confirm && temp.length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!allOk) return;
    toast.success("Mot de passe modifié avec succès");
    setTimeout(() => navigate({ to: "/login" }), 500);
  }

  return (
    <AuthShell
      title="Modification du mot de passe"
      subtitle="Pour des raisons de sécurité, vous devez modifier votre mot de passe temporaire avant d'accéder à votre espace de travail."
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="temp">Mot de passe temporaire</Label>
          <Input
            id="temp"
            type="password"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pwd">Nouveau mot de passe</Label>
          <Input
            id="pwd"
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirmation</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-11"
          />
          {confirm && pwd !== confirm && (
            <p className="text-xs text-destructive">Les mots de passe ne correspondent pas.</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-accent/40 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[color:var(--brand-deep)] uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" /> Règles de sécurité
          </div>
          <ul className="space-y-1">
            {RULES.map((r) => {
              const ok = r.test(pwd);
              return (
                <li
                  key={r.label}
                  className={`flex items-center gap-2 text-xs ${ok ? "text-[color:oklch(0.4_0.15_145)]" : "text-muted-foreground"}`}
                >
                  <Check className={`h-3.5 w-3.5 ${ok ? "" : "opacity-30"}`} /> {r.label}
                </li>
              );
            })}
          </ul>
        </div>

        <Button type="submit" className="h-11 w-full shadow-soft" disabled={!allOk}>
          Valider et accéder à l'espace
        </Button>
      </form>
    </AuthShell>
  );
}
