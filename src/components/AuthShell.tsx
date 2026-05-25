import { AppLogo } from "./AppLogo";
import loginVisual from "@/assets/login-visual.jpg";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="min-h-screen bg-auth-gradient flex flex-col">
      <div className="flex-1 grid lg:grid-cols-[1.05fr_1fr]">
        {/* Left — form */}
        <div className="flex flex-col px-6 sm:px-10 lg:px-16 py-8">
          <div className="flex items-center justify-between">
            <AppLogo className="h-10 w-auto" />
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
              Outil interne SNRT
            </div>
          </div>

          <div className="flex-1 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft border border-border px-3 py-1 text-xs font-medium text-[color:var(--brand-deep)]">
                  Espace Al Aoula
                </span>
                <h1 className="mt-4 text-3xl sm:text-[2rem] font-bold text-[color:var(--brand-night)] leading-tight tracking-tight text-balance">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
                )}
              </div>
              {children}
            </div>
          </div>

          <AuthFooter />
        </div>

        {/* Right — visual */}
        <div className="relative hidden lg:block p-6">
          <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-elevated">
            <img
              src={loginVisual}
              alt="Régie de production audiovisuelle"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--brand-night)]/85 via-[color:var(--brand-night)]/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-5 max-w-sm">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/70 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Plateforme interne
                </div>
                <h2 className="text-xl font-semibold leading-tight">
                  Planification des productions audiovisuelles
                </h2>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">
                  Centralisez les émissions, productions et moyens opérationnels dans un espace de
                  travail structuré.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthFooter() {
  return (
    <footer className="mt-10 border-t border-border/60 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
      <div>
        <span className="font-medium text-foreground/80">2026 © SNRT</span> — Société Nationale de
        Radiodiffusion et de Télévision
      </div>
      <div className="flex items-center gap-4">
        <span>Tous Droits Réservés</span>
        <a href="#" className="hover:text-primary">
          Mentions légales
        </a>
      </div>
    </footer>
  );
}
