import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-4 text-xs">
          <div>
            <p className="font-medium text-foreground mb-3">eli-flow</p>
            <p className="text-muted-foreground leading-relaxed">
              Die intelligente KI-Cloud-Abrechnung für Zahnarztpraxen.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-3">Produkt</p>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/historie" className="hover:text-foreground transition-colors">Historie</Link>
              <Link to="/bestellen" className="hover:text-foreground transition-colors">Bestellen</Link>
            </div>
          </div>
          <div>
            <p className="font-medium text-foreground mb-3">Unternehmen</p>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <Link to="/team" className="hover:text-foreground transition-colors">Team</Link>
              <Link to="/finanzierung" className="hover:text-foreground transition-colors">Finanzierung</Link>
            </div>
          </div>
          <div>
            <p className="font-medium text-foreground mb-3">Kontakt</p>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <p>info@elivyon.com</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-5 text-center text-xs text-muted-foreground">
          © 2026 Elivyon GmbH. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
