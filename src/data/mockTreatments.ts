import { currentBehandler, availableAssistants } from "@/data/mockStaff";

export interface TreatmentPosition {
  nr: string;
  bezeichnung: string;
  faktor: number;
  anzahl: number;
  betrag: number;
}

export interface Treatment {
  id: string;
  patientId: string;
  datum: string;
  behandlungsart: string;
  leistungen: string[];
  positionen: TreatmentPosition[];
  gesamtbetrag: number;
  status: "abgerechnet" | "offen" | "in_bearbeitung";
  dokumentation: string;
  behandler: string;
  assistenz: string[];
}

const arten = ["PZR", "Untersuchung", "PZR + Fluoridierung", "Scaling + PZR", "PZR + SubMed", "Untersuchung + OPG"];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}

const statuses: Treatment["status"][] = ["abgerechnet", "abgerechnet", "abgerechnet", "offen", "in_bearbeitung"];

const positionenMap: Record<string, TreatmentPosition[]> = {
  "PZR": [
    { nr: "1040", bezeichnung: "Professionelle Zahnreinigung", faktor: 3.5, anzahl: 28, betrag: 153.86 },
  ],
  "Untersuchung": [
    { nr: "0010", bezeichnung: "Eingehende Untersuchung", faktor: 3.5, anzahl: 1, betrag: 19.67 },
    { nr: "Ä1", bezeichnung: "Beratung", faktor: 2.3, anzahl: 1, betrag: 10.72 },
  ],
  "PZR + Fluoridierung": [
    { nr: "1040", bezeichnung: "Professionelle Zahnreinigung", faktor: 3.5, anzahl: 28, betrag: 153.86 },
    { nr: "1020", bezeichnung: "Lokale Fluoridierung", faktor: 3.2, anzahl: 1, betrag: 8.99 },
  ],
  "Scaling + PZR": [
    { nr: "1040", bezeichnung: "Professionelle Zahnreinigung", faktor: 3.5, anzahl: 28, betrag: 153.86 },
    { nr: "4030", bezeichnung: "Beseitigung scharfer Zahnkanten", faktor: 2.3, anzahl: 2, betrag: 9.06 },
  ],
  "PZR + SubMed": [
    { nr: "1040", bezeichnung: "Professionelle Zahnreinigung", faktor: 3.5, anzahl: 28, betrag: 153.86 },
    { nr: "4025", bezeichnung: "Subgingivale Lokalapplikation", faktor: 3.5, anzahl: 4, betrag: 11.76 },
  ],
  "Untersuchung + OPG": [
    { nr: "0010", bezeichnung: "Eingehende Untersuchung", faktor: 3.5, anzahl: 1, betrag: 19.67 },
    { nr: "Ä5004", bezeichnung: "Panoramaschichtaufnahme", faktor: 2.5, anzahl: 1, betrag: 58.28 },
    { nr: "Ä1", bezeichnung: "Beratung", faktor: 2.3, anzahl: 1, betrag: 10.72 },
  ],
};

const assistantIds = availableAssistants.map(a => a.id);

export const mockTreatments: Treatment[] = Array.from({ length: 30 }, (_, i) => {
  const art = arten[i % arten.length];
  const positionen = positionenMap[art] || positionenMap["PZR"];
  const betrag = positionen.reduce((s, p) => s + p.betrag, 0);
  const date = randomDate(new Date("2025-06-01"), new Date("2026-03-15"));
  const assistCount = 1 + (i % 3 === 0 ? 1 : 0);
  const assistIds = assistantIds.slice(i % assistantIds.length, (i % assistantIds.length) + assistCount);

  const leistungenMap: Record<string, string[]> = {
    "PZR": ["1040 PZR"],
    "Untersuchung": ["0010 Untersuchung", "Ä1 Beratung"],
    "PZR + Fluoridierung": ["1040 PZR", "1020 Fluoridierung"],
    "Scaling + PZR": ["1040 PZR", "4030 sK"],
    "PZR + SubMed": ["1040 PZR", "4025 SubMed"],
    "Untersuchung + OPG": ["0010 Untersuchung", "Ä5004 OPG", "Ä1 Beratung"],
  };

  return {
    id: `BEH-${(2024000 + i).toString()}`,
    patientId: `${100000 + i * 137}`,
    datum: formatDate(date),
    behandlungsart: art,
    leistungen: leistungenMap[art] || ["1040 PZR"],
    positionen,
    gesamtbetrag: Math.round(betrag * 100) / 100,
    status: statuses[i % statuses.length],
    dokumentation: `Behandlung ${art} durchgeführt. Patient:in kooperativ. Befund unauffällig. Nächster Termin in ${3 + (i % 4)} Monaten empfohlen.`,
    behandler: currentBehandler.name,
    assistenz: assistIds.map(id => availableAssistants.find(a => a.id === id)?.name || ""),
  };
}).sort((a, b) => b.datum.localeCompare(a.datum));
