import logo from "@/assets/mplanner-logo.png";

export function AppLogo({ className = "h-9 w-auto" }: { className?: string }) {
  return <img src={logo} alt="mPlanner" className={className} loading="eager" />;
}
