import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { mockTreatments } from "@/data/mockTreatments";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, ChevronDown, ChevronUp, FileText, Users } from "lucide-react";
import { currentBehandler } from "@/data/mockStaff";

export default function HistoriePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("alle");
  const [artFilter, setArtFilter] = useState("alle");
  const [sortField, setSortField] = useState<"datum" | "betrag">("datum");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const uniqueArten = useMemo(() => [...new Set(mockTreatments.map(t => t.behandlungsart))], []);

  const filtered = useMemo(() => {
    let result = mockTreatments;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(t =>
        t.patientId.toLowerCase().includes(s) ||
        t.behandlungsart.toLowerCase().includes(s) ||
        t.id.toLowerCase().includes(s) ||
        t.behandler.toLowerCase().includes(s) ||
        t.assistenz.some(a => a.toLowerCase().includes(s))
      );
    }
    if (statusFilter !== "alle") {
      result = result.filter(t => t.status === statusFilter);
    }
    if (artFilter !== "alle") {
      result = result.filter(t => t.behandlungsart === artFilter);
    }
    result = [...result].sort((a, b) => {
      const val = sortField === "datum" ? a.datum.localeCompare(b.datum) : a.gesamtbetrag - b.gesamtbetrag;
      return sortDir === "asc" ? val : -val;
    });
    return result;
  }, [search, statusFilter, artFilter, sortField, sortDir]);

  const totalBetrag = useMemo(() => filtered.reduce((s, t) => s + t.gesamtbetrag, 0), [filtered]);

  const statusColor = (s: string) => {
    switch (s) {
      case "abgerechnet": return "bg-green-100 text-green-700 border-green-200";
      case "offen": return "bg-red-50 text-destructive border-red-200";
      case "in_bearbeitung": return "bg-accent text-accent-foreground border-accent";
      default: return "";
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "abgerechnet": return "Abgerechnet";
      case "offen": return "Offen";
      case "in_bearbeitung": return "In Bearbeitung";
      default: return s;
    }
  };

  const formatDatum = (d: string) => {
    const [y, m, day] = d.split("-");
    return `${day}.${m}.${y}`;
  };

  return (
    <Layout compact>
      <div className="container py-8 px-4 max-w-full">
        <h1 className="font-display text-3xl font-bold mb-2">Behandlungshistorie</h1>
        <p className="text-muted-foreground mb-6">
          {filtered.length} Behandlung{filtered.length !== 1 ? "en" : ""} · Gesamt: {totalBetrag.toFixed(2)} € · Praxis {currentBehandler.name}
        </p>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Patient, Behandlung, Team…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle Status</SelectItem>
              <SelectItem value="abgerechnet">Abgerechnet</SelectItem>
              <SelectItem value="offen">Offen</SelectItem>
              <SelectItem value="in_bearbeitung">In Bearbeitung</SelectItem>
            </SelectContent>
          </Select>
          <Select value={artFilter} onValueChange={setArtFilter}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle Behandlungsarten</SelectItem>
              {uniqueArten.map(a => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted transition-colors"
            onClick={() => {
              if (sortField === "datum") {
                setSortDir(d => d === "asc" ? "desc" : "asc");
              } else {
                setSortField("datum");
                setSortDir("desc");
              }
            }}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortField === "datum" ? "Datum" : "Betrag"} {sortDir === "desc" ? "↓" : "↑"}
          </button>
          <button
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted transition-colors"
            onClick={() => {
              setSortField(f => f === "datum" ? "betrag" : "datum");
              setSortDir("desc");
            }}
          >
            {sortField === "datum" ? "Nach Betrag" : "Nach Datum"}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {filtered.map(t => {
            const isExpanded = expandedId === t.id;
            return (
              <Card key={t.id} className="overflow-hidden transition-shadow hover:shadow-sm">
                <button
                  type="button"
                  className="w-full p-4 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                        <Badge variant="outline" className={statusColor(t.status)}>
                          {statusLabel(t.status)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDatum(t.datum)}</span>
                      </div>
                      <p className="mt-1 font-semibold text-sm">{t.behandlungsart}</p>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Patient: {t.patientId}</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {t.behandler}{t.assistenz.length > 0 && ` + ${t.assistenz.join(", ")}`}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {t.leistungen.map((l, i) => (
                          <span key={i} className="rounded bg-muted px-1.5 py-0.5 text-xs">{l}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold whitespace-nowrap">{t.gesamtbetrag.toFixed(2)} €</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-4">
                    {/* Positions */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-primary" />
                        Abrechnungspositionen
                      </h4>
                      <div className="rounded-md border border-border overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/50 text-xs text-muted-foreground">
                              <th className="text-left px-3 py-2 font-medium">GOZ</th>
                              <th className="text-left px-3 py-2 font-medium">Bezeichnung</th>
                              <th className="text-right px-3 py-2 font-medium">Faktor</th>
                              <th className="text-right px-3 py-2 font-medium">Anz.</th>
                              <th className="text-right px-3 py-2 font-medium">Betrag</th>
                            </tr>
                          </thead>
                          <tbody>
                            {t.positionen.map((p, idx) => (
                              <tr key={idx} className="border-t border-border">
                                <td className="px-3 py-2 font-mono text-xs">{p.nr}</td>
                                <td className="px-3 py-2 text-xs">{p.bezeichnung}</td>
                                <td className="px-3 py-2 text-right text-xs">{p.faktor}×</td>
                                <td className="px-3 py-2 text-right text-xs">{p.anzahl}</td>
                                <td className="px-3 py-2 text-right font-medium text-xs">{p.betrag.toFixed(2)} €</td>
                              </tr>
                            ))}
                            <tr className="border-t-2 border-border font-bold">
                              <td colSpan={4} className="px-3 py-2 text-xs">Gesamt</td>
                              <td className="px-3 py-2 text-right text-xs">{t.gesamtbetrag.toFixed(2)} €</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Documentation */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Dokumentation</h4>
                      <p className="text-xs text-muted-foreground bg-muted/30 rounded-md p-3 leading-relaxed">
                        {t.dokumentation}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">Keine Behandlungen gefunden.</p>
            <Button variant="link" onClick={() => { setSearch(""); setStatusFilter("alle"); setArtFilter("alle"); }}>
              Filter zurücksetzen
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
