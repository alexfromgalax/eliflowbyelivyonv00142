import { Link, useLocation } from "react-router-dom";
import { Menu, X, Settings, Info } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo-elivyon.jpg";
import logoCompact from "@/assets/logo-elivyon-compact.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Doku/Abrechnung", path: "/dashboard" },
  { label: "Historie", path: "/historie" },
  { label: "Bestellen", path: "/bestellen" },
  { label: "Team", path: "/team" },
  { label: "Finanzierung", path: "/finanzierung" },
  { label: "settings", path: "/einstellungen", isIcon: true },
];

export default function Navbar({ compact = false }: { compact?: boolean }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className={`container flex items-center justify-between ${compact ? "h-12" : "h-24"}`}>
          <Link to="/" className="flex items-center gap-3">
            <img src={compact ? logoCompact : logo} alt="Elivyon Logo" className={`object-cover ${compact ? "h-8 w-8" : "h-20 w-20 rounded-lg"}`} style={compact ? { borderRadius: '3px 3px 3px 0px' } : undefined} />
            <div className="flex flex-col leading-tight">
              <span className={`font-semibold text-foreground tracking-tight ${compact ? "text-sm" : "text-base"}`}>eli-flow</span>
              {!compact && <span className="text-[10px] text-muted-foreground">Version Full</span>}
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-xs font-normal transition-colors hover:text-foreground ${
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {(item as any).isIcon ? (
                  <span className="flex items-center gap-0.5">
                    <Settings className="h-3.5 w-3.5" />
                    <span>/</span>
                    <Info className="h-3.5 w-3.5" />
                  </span>
                ) : item.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden ${compact ? "top-12" : "top-24"}`}>
          <div className="container py-8 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`py-3 text-2xl font-semibold transition-colors border-b border-border/30 ${
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {(item as any).isIcon ? (
                  <span className="flex items-center gap-1">
                    <Settings className="h-5 w-5" />
                    <span>/</span>
                    <Info className="h-5 w-5" />
                  </span>
                ) : item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
