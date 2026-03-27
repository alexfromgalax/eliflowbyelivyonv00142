// Festzuschüsse nach FZ-Richtlinie (G-BA) für Zahnersatz (ZE) bei GKV-Patienten
// Stand: 2025 – Beträge in Euro (inkl. Bonus 20% / 30%)

export interface FestzuschussBefund {
  nr: string;
  bezeichnung: string;
  regelversorgung: string;
  /** Festzuschuss ohne Bonus */
  betragOhneBonus: number;
  /** Festzuschuss mit 20% Bonus (5 Jahre Bonusheft) */
  betragBonus20: number;
  /** Festzuschuss mit 30% Bonus (10 Jahre Bonusheft) */
  betragBonus30: number;
  /** Gilt für welche Zahngruppen? */
  zahngruppe?: string;
}

export type BonusStufe = "kein" | "20" | "30";

// ZE-Festzuschüsse (wichtigste Befunde nach FZ-Richtlinie Anlage 2)
export const festzuschuesseZE: FestzuschussBefund[] = [
  // Einzelzahnlücke / fehlende Zähne
  {
    nr: "1.1", bezeichnung: "Erhaltungswürdiger Zahn mit weitgehender Zerstörung der klinischen Krone",
    regelversorgung: "Vollkrone (NEM/Stahl) im Seitenzahnbereich",
    betragOhneBonus: 182.42, betragBonus20: 218.90, betragBonus30: 237.15,
  },
  {
    nr: "1.2", bezeichnung: "Erhaltungswürdiger Zahn mit weitgehender Zerstörung der klinischen Krone",
    regelversorgung: "Vollkrone (NEM) im sichtbaren Bereich (vestibuläre Verblendung)",
    betragOhneBonus: 219.84, betragBonus20: 263.81, betragBonus30: 285.79,
    zahngruppe: "Frontzähne / Prämolaren (bis Zahn 5)",
  },
  {
    nr: "1.3", bezeichnung: "Erhaltungswürdiger Zahn mit weitgehender Zerstörung – Stiftzahn",
    regelversorgung: "Vollkrone mit Stiftaufbau",
    betragOhneBonus: 219.84, betragBonus20: 263.81, betragBonus30: 285.79,
  },
  {
    nr: "2.1", bezeichnung: "Zahnbegrenzte Lücke mit einem fehlenden Zahn",
    regelversorgung: "Brücke (NEM) mit Vollkronen als Anker",
    betragOhneBonus: 365.38, betragBonus20: 438.46, betragBonus30: 475.00,
    zahngruppe: "Seitenzahnbereich",
  },
  {
    nr: "2.2", bezeichnung: "Zahnbegrenzte Lücke mit einem fehlenden Zahn im sichtbaren Bereich",
    regelversorgung: "Brücke mit Verblendung im sichtbaren Bereich",
    betragOhneBonus: 437.63, betragBonus20: 525.16, betragBonus30: 568.92,
    zahngruppe: "Frontzähne / Prämolaren",
  },
  {
    nr: "2.3", bezeichnung: "Zahnbegrenzte Lücke mit zwei fehlenden Zähnen nebeneinander",
    regelversorgung: "Brücke mit 2 Zwischengliedern",
    betragOhneBonus: 496.27, betragBonus20: 595.52, betragBonus30: 645.15,
  },
  {
    nr: "2.5", bezeichnung: "Zahnbegrenzte Lücke mit einem fehlenden Zahn – Inlaybrücke/Adhäsivbrücke",
    regelversorgung: "Adhäsivbrücke (Marylandbrücke)",
    betragOhneBonus: 365.38, betragBonus20: 438.46, betragBonus30: 475.00,
  },
  {
    nr: "2.7", bezeichnung: "Zahnbegrenzte Lücke – Implantatgetragene Krone",
    regelversorgung: "Festzuschuss wie zahnbegrenzte Lücke (Brücke)",
    betragOhneBonus: 365.38, betragBonus20: 438.46, betragBonus30: 475.00,
    zahngruppe: "Implantat als Befund",
  },

  // Freiendsituation / größere Lücken
  {
    nr: "3.1", bezeichnung: "Freiendsituation oder große Lücke (nicht zahnbegrenzt), 1–4 fehlende Zähne",
    regelversorgung: "Modellgussprothese mit Klammern",
    betragOhneBonus: 340.98, betragBonus20: 409.18, betragBonus30: 443.27,
  },
  {
    nr: "3.2", bezeichnung: "Freiendsituation, mehr als 4 fehlende Zähne je Kiefer",
    regelversorgung: "Modellgussprothese mit Klammern (erweitert)",
    betragOhneBonus: 402.21, betragBonus20: 482.65, betragBonus30: 522.87,
  },

  // Zahnloser Kiefer
  {
    nr: "4.1", bezeichnung: "Zahnloser Oberkiefer",
    regelversorgung: "Totalprothese Oberkiefer",
    betragOhneBonus: 418.88, betragBonus20: 502.66, betragBonus30: 544.54,
  },
  {
    nr: "4.2", bezeichnung: "Zahnloser Unterkiefer",
    regelversorgung: "Totalprothese Unterkiefer",
    betragOhneBonus: 418.88, betragBonus20: 502.66, betragBonus30: 544.54,
  },
  {
    nr: "4.5", bezeichnung: "Zahnloser Kiefer – Implantatgestützte Prothese",
    regelversorgung: "Festzuschuss wie zahnloser Kiefer (Totalprothese)",
    betragOhneBonus: 418.88, betragBonus20: 502.66, betragBonus30: 544.54,
  },

  // Reparatur / Wiederherstellung
  {
    nr: "6.0", bezeichnung: "Wiederherstellungsbedürftiger Zahnersatz (Reparatur)",
    regelversorgung: "Reparatur / Unterfütterung",
    betragOhneBonus: 36.47, betragBonus20: 43.76, betragBonus30: 47.41,
  },
  {
    nr: "6.1", bezeichnung: "Wiederherstellungsbedürftiger Zahnersatz – Erweiterung um Zahn",
    regelversorgung: "Prothesenerweiterung (1 Zahn)",
    betragOhneBonus: 54.03, betragBonus20: 64.84, betragBonus30: 70.24,
  },
  {
    nr: "6.5", bezeichnung: "Unterfütterung einer Prothese",
    regelversorgung: "Direkte oder indirekte Unterfütterung",
    betragOhneBonus: 62.58, betragBonus20: 75.10, betragBonus30: 81.35,
  },
];

// PAR-spezifische Festzuschüsse gibt es nicht in der gleichen Form.
// PAR wird bei GKV über den PAR-Antrag genehmigt und direkt nach BEMA abgerechnet.
// Hier definieren wir die PAR-Antragstypen für den HKP-Workflow.
export interface ParAntragTyp {
  id: string;
  bezeichnung: string;
  beschreibung: string;
  /** Voraussetzung für Genehmigung */
  voraussetzung: string;
}

export const parAntragsTypen: ParAntragTyp[] = [
  {
    id: "PAR_AIT", bezeichnung: "Systematische PAR-Therapie (AIT)",
    beschreibung: "Antiinfektiöse Therapie mit subgingivaler Instrumentierung",
    voraussetzung: "PAR-Status erhoben, Sondierungstiefen ≥ 4mm an mind. 1 Zahn, BOP dokumentiert",
  },
  {
    id: "PAR_CPT", bezeichnung: "Chirurgische PAR-Therapie (CPT)",
    beschreibung: "Offenes Vorgehen nach BEV mit persistierenden Taschen ≥ 6mm",
    voraussetzung: "BEV abgeschlossen, Sondierungstiefen ≥ 6mm persistierend",
  },
  {
    id: "PAR_UPT", bezeichnung: "Unterstützende PAR-Therapie (UPT)",
    beschreibung: "Recall/Nachsorge nach abgeschlossener systematischer PAR",
    voraussetzung: "AIT abgeschlossen, UPT-Intervall nach PAR-Richtlinie (Grad A–C)",
  },
];

export interface HkpZeile {
  zahnNr: string;
  befundNr: string;
  festzuschussBetrag: number;
  bonusStufe: BonusStufe;
}

export interface HkpData {
  zeilen: HkpZeile[];
  bonusStufe: BonusStufe;
  /** PAR: Antragstyp */
  parAntragsTyp?: string;
  /** PAR: Grading */
  parGrad?: string;
  /** PAR: Staging */
  parStadium?: string;
  /** Gesamtkosten (zahntechnisch + zahnärztlich) */
  gesamtkosten: number;
  /** Eigenanteil Patient */
  eigenanteil: number;
}

export function berechneEigenanteil(zeilen: HkpZeile[], gesamtkosten: number): number {
  const sumFZ = zeilen.reduce((s, z) => s + z.festzuschussBetrag, 0);
  return Math.max(0, Math.round((gesamtkosten - sumFZ) * 100) / 100);
}

export function getFestzuschussBetrag(befund: FestzuschussBefund, bonus: BonusStufe): number {
  switch (bonus) {
    case "20": return befund.betragBonus20;
    case "30": return befund.betragBonus30;
    default: return befund.betragOhneBonus;
  }
}
