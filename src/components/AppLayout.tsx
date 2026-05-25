import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Tv2,
  Clapperboard,
  CalendarRange,
  Truck,
  LineChart,
  UserCircle,
  Search,
  Bell,
  Plus,
  LogOut,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { AppLogo } from "./AppLogo";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/emissions", label: "Émissions", icon: Tv2 },
  { to: "/productions", label: "Productions", icon: Clapperboard },
  { to: "/planification", label: "Planification", icon: CalendarRange },
  { to: "/demandes-mm", label: "Demandes MM", icon: Truck },
  { to: "/suivi", label: "Suivi", icon: LineChart },
  { to: "/profil", label: "Profil", icon: UserCircle },
] as const;

export function AppLayout() {
  const navigate = useNavigate();
  const authed = useApp((s) => s.authed);
  const user = useApp((s) => s.user);
  const logout = useApp((s) => s.logout);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!authed) navigate({ to: "/login" });
  }, [authed, navigate]);

  if (!authed) return null;

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 h-screen shrink-0 border-r border-border bg-sidebar flex flex-col transition-[width] duration-200",
          collapsed ? "w-[76px]" : "w-[252px]",
        )}
      >
        <div
          className={cn(
            "h-16 flex items-center border-b border-border",
            collapsed ? "justify-center" : "px-5",
          )}
        >
          {collapsed ? (
            <div className="h-9 w-9 rounded-lg bg-primary-soft flex items-center justify-center">
              <span className="font-bold text-[color:var(--brand-deep)]">m</span>
            </div>
          ) : (
            <AppLogo className="h-8 w-auto" />
          )}
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {!collapsed && (
            <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Espace de travail
            </div>
          )}
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-[color:var(--brand-deep)]",
                  collapsed && "justify-center px-2",
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    active
                      ? ""
                      : "text-muted-foreground group-hover:text-[color:var(--brand-deep)]",
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" /> Réduire
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 border-b border-border bg-surface/85 backdrop-blur-md">
          <div className="h-full px-5 sm:px-8 flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Espace</span>
              <span className="font-semibold text-[color:var(--brand-deep)]">Al Aoula</span>
              <span className="mx-2 h-4 w-px bg-border" />
              <span className="text-xs text-muted-foreground capitalize">{today}</span>
            </div>

            <div className="flex-1 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Rechercher une émission, production, bloc…"
                  className="w-full h-10 pl-11 pr-4 rounded-full bg-accent/60 border border-transparent focus:bg-surface focus:border-border focus:outline-none focus:ring-2 focus:ring-ring transition text-sm placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="rounded-full gap-2 shadow-soft">
                    <Plus className="h-4 w-4" /> Créer
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Actions rapides</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/emissions/new" })}>
                    <Tv2 className="h-4 w-4" /> Nouvelle émission
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: "/productions" })}>
                    <Clapperboard className="h-4 w-4" /> Nouvelle production
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: "/demandes-mm/new" })}>
                    <Truck className="h-4 w-4" /> Demande moyens mobiles
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button className="relative h-10 w-10 grid place-items-center rounded-full hover:bg-accent/60 transition-colors">
                <Bell className="h-[18px] w-[18px] text-muted-foreground" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-warning ring-2 ring-surface" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 pl-2 pr-3 h-10 rounded-full hover:bg-accent/60 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[color:var(--brand-deep)] to-primary text-white grid place-items-center text-sm font-semibold">
                      {user.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium leading-tight">{user.name}</div>
                      <div className="text-[11px] text-muted-foreground leading-tight">
                        {user.service}
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground font-normal">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/profil" })}>
                    <UserCircle className="h-4 w-4" /> Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Settings className="h-4 w-4" /> Préférences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      navigate({ to: "/login" });
                    }}
                  >
                    <LogOut className="h-4 w-4" /> Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 sm:px-8 py-8 max-w-[1480px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl sm:text-[28px] font-bold text-[color:var(--brand-night)] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
