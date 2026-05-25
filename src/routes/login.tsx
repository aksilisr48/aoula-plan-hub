import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useApp((s) => s.login);
  const [email, setEmail] = useState("s.bennani@snrt.ma");
  const [password, setPassword] = useState("••••••••");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Identifiants incorrects", {
        description: "Veuillez renseigner votre login et mot de passe.",
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email);
      toast.success("Connexion réussie", {
        description: "Bienvenue dans votre espace de travail.",
      });
      navigate({ to: "/dashboard" });
    }, 500);
  }

  return (
    <AuthShell
      title="Accédez à votre espace de planification audiovisuelle"
      subtitle="Connectez-vous avec vos identifiants professionnels pour gérer les émissions, productions et blocs opérationnels."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Identifiant</Label>
          <Input
            id="email"
            type="email"
            placeholder="p.nom@snrt.ma"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPwd ? "text" : "password"}
              placeholder="Saisir votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pr-11"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground"
              aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" defaultChecked />
          <Label
            htmlFor="remember"
            className="text-sm text-muted-foreground font-normal cursor-pointer"
          >
            Se souvenir de moi sur cet appareil
          </Label>
        </div>

        <Button
          type="submit"
          className="h-11 w-full gap-2 text-[15px] shadow-soft"
          disabled={loading}
        >
          {loading ? (
            "Connexion…"
          ) : (
            <>
              Se connecter <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <div className="flex items-start gap-2 rounded-xl bg-accent/50 border border-border p-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 mt-0.5 text-primary shrink-0" />
          <div>
            Accès réservé aux collaborateurs SNRT. Toute connexion est tracée pour des raisons de
            sécurité.
          </div>
        </div>
      </form>
    </AuthShell>
  );
}
