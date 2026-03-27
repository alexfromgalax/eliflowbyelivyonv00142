export interface GozCode {
  nr: string;
  kuerzel: string;
  bezeichnung: string;
  betrag1fach: number;
  standardFaktor: number;
  begruendungAbFaktor: number;
  begruendungen: string[];
}

// BEMA-Punktwert (bundeseinheitlich, Stand 2025)
export const BEMA_PUNKTWERT = 1.0864;

export interface BemaCode {
  nr: string;
  kuerzel: string;
  bezeichnung: string;
  punkte: number;
  billingUnit: 'zahn' | 'kiefer' | 'quadrant' | 'sitzung' | 'flaeche';
  /** Maximale Häufigkeit pro Sitzung (optional) */
  maxPerSession?: number;
  /** Anmerkungen / Abrechnungshinweise */
  hinweis?: string;
}

export const bemaCodes: BemaCode[] = [
  // ===== DIAG / Untersuchung =====
  { nr: "01", kuerzel: "01", bezeichnung: "Eingehende Untersuchung zur Feststellung von Zahn-, Mund- und Kiefererkrankungen", punkte: 25, billingUnit: "sitzung", hinweis: "1× pro Halbjahr" },
  { nr: "Ä1", kuerzel: "Ä1", bezeichnung: "Beratung – auch mittels Fernsprecher", punkte: 15, billingUnit: "sitzung" },
  { nr: "04", kuerzel: "04", bezeichnung: "Erhebung des PSI-Code (Parodontaler Screening Index)", punkte: 15, billingUnit: "sitzung", hinweis: "1× innerhalb von 2 Jahren" },
  { nr: "Ä925a", kuerzel: "Ä925a", bezeichnung: "Röntgenaufnahme eines Zahnes (Einzelzahn)", punkte: 12, billingUnit: "zahn" },
  { nr: "Ä935d", kuerzel: "Ä935d", bezeichnung: "Panoramaschichtaufnahme der Kiefer (OPG)", punkte: 80, billingUnit: "sitzung" },

  // ===== PROPHY / IP =====
  { nr: "IP1", kuerzel: "IP1", bezeichnung: "Mundhygienestatus (6–17 Jahre)", punkte: 25, billingUnit: "sitzung", hinweis: "Nur 6–17 Jahre, 1× pro Halbjahr" },
  { nr: "IP2", kuerzel: "IP2", bezeichnung: "Mundgesundheitsaufklärung (6–17 Jahre)", punkte: 25, billingUnit: "sitzung", hinweis: "Nur 6–17 Jahre, 1× pro Halbjahr" },
  { nr: "IP4", kuerzel: "IP4", bezeichnung: "Lokale Fluoridierung (6–17 Jahre)", punkte: 8, billingUnit: "sitzung", hinweis: "Nur 6–17 Jahre, 1× pro Halbjahr" },
  { nr: "IP5", kuerzel: "IP5", bezeichnung: "Fissurenversiegelung (6–17 Jahre, Molaren)", punkte: 22, billingUnit: "zahn", hinweis: "Nur bleibende Molaren bei 6–17 J." },
  { nr: "107", kuerzel: "107", bezeichnung: "Beseitigung scharfer Zahnkanten/störender Prothesenränder", punkte: 9, billingUnit: "quadrant" },
  { nr: "105", kuerzel: "105", bezeichnung: "Entfernung harter Zahnbeläge (Zahnstein), je Sitzung", punkte: 16, billingUnit: "sitzung", hinweis: "1× pro Kalenderjahr" },

  // ===== CHIR =====
  { nr: "X1", kuerzel: "X1", bezeichnung: "Extraktion eines einwurzeligen Zahnes", punkte: 18, billingUnit: "zahn" },
  { nr: "X2", kuerzel: "X2", bezeichnung: "Extraktion eines mehrwurzeligen Zahnes", punkte: 25, billingUnit: "zahn" },
  { nr: "X3", kuerzel: "X3", bezeichnung: "Extraktion eines tieffrakturierten oder tief zerstörten Zahnes", punkte: 30, billingUnit: "zahn" },
  { nr: "Ost1", kuerzel: "Ost1", bezeichnung: "Osteotomie eines einwurzeligen Zahnes/Wurzelrestes", punkte: 42, billingUnit: "zahn" },
  { nr: "Ost2", kuerzel: "Ost2", bezeichnung: "Osteotomie eines mehrwurzeligen Zahnes mit Wurzeltrennung", punkte: 55, billingUnit: "zahn" },
  { nr: "WR", kuerzel: "WR", bezeichnung: "Wurzelspitzenresektion (einwurzelig)", punkte: 61, billingUnit: "zahn" },
  { nr: "47a", kuerzel: "47a", bezeichnung: "Inzision eines Abszesses, intraoral", punkte: 18, billingUnit: "zahn" },
  { nr: "48", kuerzel: "48b", bezeichnung: "Plastischer Verschluss einer eröffneten Kieferhöhle", punkte: 38, billingUnit: "zahn" },
  { nr: "56a", kuerzel: "56a", bezeichnung: "Hemisektion / Prämolarisierung", punkte: 55, billingUnit: "zahn" },

  // ===== ENDO =====
  { nr: "Trep", kuerzel: "Trep", bezeichnung: "Trepanation (Aufbohrung) eines Zahnes", punkte: 18, billingUnit: "zahn" },
  { nr: "WK", kuerzel: "WK", bezeichnung: "Wurzelkanalaufbereitung (einwurzelig)", punkte: 30, billingUnit: "zahn" },
  { nr: "WK2", kuerzel: "WK2", bezeichnung: "Wurzelkanalaufbereitung (mehrwurzelig), je Kanal", punkte: 45, billingUnit: "zahn" },
  { nr: "WF", kuerzel: "WF", bezeichnung: "Wurzelkanalfüllung", punkte: 36, billingUnit: "zahn" },
  { nr: "Med", kuerzel: "Med", bezeichnung: "Medikamentöse Einlage", punkte: 12, billingUnit: "zahn" },

  // ===== FÜLL =====
  { nr: "13a", kuerzel: "13a", bezeichnung: "Füllung einflächig (Amalgam/Zement/Komposit als Kassenleistung)", punkte: 25, billingUnit: "zahn", hinweis: "Seitenzahn: Amalgam = Kassenleistung; Komposit: Mehrkostenvereinbarung nötig" },
  { nr: "13b", kuerzel: "13b", bezeichnung: "Füllung zweiflächig", punkte: 35, billingUnit: "zahn" },
  { nr: "13c", kuerzel: "13c", bezeichnung: "Füllung dreiflächig", punkte: 45, billingUnit: "zahn" },
  { nr: "13d", kuerzel: "13d", bezeichnung: "Füllung mehr als dreiflächig", punkte: 50, billingUnit: "zahn" },

  // ===== PAR =====
  { nr: "P200", kuerzel: "P200", bezeichnung: "Erhebung des parodontalen Befundes (PAR-Status)", punkte: 45, billingUnit: "sitzung", hinweis: "Nur bei systematischer PAR-Behandlung" },
  { nr: "4", kuerzel: "4", bezeichnung: "Subgingivale Instrumentierung (geschlossenes Vorgehen), je Zahn", punkte: 14, billingUnit: "zahn", hinweis: "Nach Genehmigung PAR-Antrag" },
  { nr: "4b", kuerzel: "4b", bezeichnung: "Chirurgische Therapie (offenes Vorgehen), je Zahn", punkte: 28, billingUnit: "zahn", hinweis: "Nach BEV, wenn TT ≥ 6mm" },

  // ===== DIVERS =====
  { nr: "41a", kuerzel: "41a", bezeichnung: "Infiltrationsanästhesie", punkte: 12, billingUnit: "zahn" },
  { nr: "41b", kuerzel: "41b", bezeichnung: "Leitungsanästhesie", punkte: 18, billingUnit: "sitzung" },
  { nr: "NB", kuerzel: "NB", bezeichnung: "Nachbehandlung nach chirurgischem Eingriff", punkte: 15, billingUnit: "sitzung" },
  { nr: "03", kuerzel: "03", bezeichnung: "Notfallbehandlung / Besondere Maßnahmen beim Schmerzfall", punkte: 60, billingUnit: "sitzung" },

  // ===== ZE (BEMA Teil 5 – Festzuschüsse) =====
  // ZE wird bei GKV über HKP/Festzuschüsse abgerechnet, die zahnärztlichen Leistungen über BEMA
  { nr: "20a", kuerzel: "20a", bezeichnung: "Präparation eines Zahnes für eine Krone", punkte: 32, billingUnit: "zahn" },
  { nr: "20b", kuerzel: "20b", bezeichnung: "Abformung für festsitzenden Zahnersatz", punkte: 22, billingUnit: "sitzung" },
  { nr: "24a", kuerzel: "24a", bezeichnung: "Eingliederung einer Krone / Brücke", punkte: 28, billingUnit: "zahn" },
  { nr: "25", kuerzel: "25", bezeichnung: "Reparatur/Unterfütterung von Zahnersatz", punkte: 35, billingUnit: "sitzung" },

  // ===== KFO (BEMA Teil 3) =====
  { nr: "119", kuerzel: "119", bezeichnung: "Modellanalyse einschließlich Vermessung", punkte: 90, billingUnit: "sitzung" },
  { nr: "123a", kuerzel: "123a", bezeichnung: "Eingliederung einer festsitzenden Apparatur, je Kiefer", punkte: 180, billingUnit: "kiefer" },
];

export const gozCodes: GozCode[] = [
  // ===== PROPHY / Allgemein =====
  { nr: "1020", kuerzel: "Flouri", bezeichnung: "Lokale Fluoridierung zur Verbesserung der Zahnhartsubstanz, zur Kariesvorbeugung und -behandlung, mit Lack oder Gel, je Sitzung", betrag1fach: 2.81, standardFaktor: 3.2, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","220","224"] },
  { nr: "1030", kuerzel: "Fl_Sch", bezeichnung: "Lokale Anwendung von Medikamenten zur Kariesvorbeugung oder initialen Kariesbehandlung mit einer individuell gefertigten Schiene als Medikamententräger, je Kiefer", betrag1fach: 5.06, standardFaktor: 3.4, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "1040", kuerzel: "PZR", bezeichnung: "Professionelle Zahnreinigung", betrag1fach: 1.57, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","271","319"] },
  { nr: "2010", kuerzel: "üZ", bezeichnung: "Behandlung überempfindlicher Zahnflächen, je Kiefer", betrag1fach: 2.81, standardFaktor: 3.3, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","220","224"] },
  { nr: "4000", kuerzel: "PAstat", bezeichnung: "Erstellen und dokumentieren eines Parodontalstatus", betrag1fach: 9.00, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","282"] },
  { nr: "4005", kuerzel: "PSI", bezeichnung: "Erhebung mindestens eines Gingivalindex und/oder eines Parodontalindex (z.B. PSI)", betrag1fach: 4.50, standardFaktor: 3.4, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","253"] },
  { nr: "4020", kuerzel: "Mu", bezeichnung: "Lokalbehandlung von Mundschleimhauterkrankungen ggf. einschl. Taschenspülungen, je Sitzung", betrag1fach: 2.53, standardFaktor: 2.3, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","220"] },
  { nr: "4025", kuerzel: "SubMed", bezeichnung: "Subgingivale medikamentöse antibakterielle Lokalapplikation, je Zahn", betrag1fach: 0.84, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","282"] },
  { nr: "4030", kuerzel: "sK", bezeichnung: "Beseitigung von scharfen Zahnkanten, störenden Prothesenrändern und Fremdreizen am Parodontium, je Kieferhälfte oder Frontzahnbereich", betrag1fach: 1.97, standardFaktor: 2.3, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","244","251","252","229"] },
  { nr: "4050", kuerzel: "Zst1", bezeichnung: "Entfernung harter und weicher Zahnbeläge ggf. einschl. Polieren an einem einwurzeligen Zahn oder Implantat", betrag1fach: 0.56, standardFaktor: 3.4, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","271"] },
  { nr: "4055", kuerzel: "Zst2", bezeichnung: "Entfernung harter und weicher Zahnbeläge ggf. einschl. Polieren an einem mehrwurzeligen Zahn", betrag1fach: 0.73, standardFaktor: 3.4, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","271"] },
  { nr: "0010", kuerzel: "01p", bezeichnung: "Eingehende Untersuchung zur Feststellung von Zahn-, Mund- und Kiefererkrankungen einschl. Erhebung des Parodontalbefundes", betrag1fach: 5.62, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","306","222"] },
  { nr: "Ä1", kuerzel: "Ä1p", bezeichnung: "Beratung – auch mittels Fernsprecher", betrag1fach: 4.66, standardFaktor: 2.3, begruendungAbFaktor: 2.3, begruendungen: ["306","307"] },
  { nr: "Ä5000", kuerzel: "Rö", bezeichnung: "Röntgen Zähne, je Projektion", betrag1fach: 2.91, standardFaktor: 2.5, begruendungAbFaktor: 1.8, begruendungen: ["200","201","202","203","302","262"] },
  { nr: "Ä5004", kuerzel: "OPG", bezeichnung: "Panoramaschichtaufnahme der Kiefer", betrag1fach: 23.31, standardFaktor: 2.5, begruendungAbFaktor: 1.8, begruendungen: ["200","201","202","203","302"] },
  { nr: "6000m", kuerzel: "Fotos", bezeichnung: "Fotodokumentation zu diagnostischen und/oder therapeutischen Zwecken", betrag1fach: 4.50, standardFaktor: 2.3, begruendungAbFaktor: 2.3, begruendungen: ["338","339"] },
  { nr: "7040", kuerzel: "SchKon", bezeichnung: "Kontrolle eines Aufbissbehelfes", betrag1fach: 3.66, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "8000", kuerzel: "FALBef", bezeichnung: "Klinische Funktionsanalyse einschließlich Dokumentation", betrag1fach: 28.12, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },

  // ===== CHIR =====
  { nr: "3000", kuerzel: "Ex1", bezeichnung: "Entfernung eines einwurzeligen Zahnes oder eines Wurzelrestes", betrag1fach: 5.62, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "3010", kuerzel: "Ex2", bezeichnung: "Entfernung eines mehrwurzeligen Zahnes", betrag1fach: 6.75, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "3020", kuerzel: "Ost1", bezeichnung: "Operative Entfernung eines einwurzeligen Zahnes/Wurzelrestes mit Knochenabtragung", betrag1fach: 11.24, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "3030", kuerzel: "Ost2", bezeichnung: "Operative Entfernung eines mehrwurzeligen Zahnes mit Knochenabtragung und ggf. Wurzeltrennung", betrag1fach: 16.87, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "3040", kuerzel: "Hemi", bezeichnung: "Hemisektion / Prämolarisierung eines mehrwurzeligen Zahnes", betrag1fach: 16.87, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "3070", kuerzel: "Inz", bezeichnung: "Inzision eines Abszesses", betrag1fach: 5.62, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "3100", kuerzel: "PlVer", bezeichnung: "Plastischer Verschluss einer Kieferhöhlenöffnung oder Wundnaht", betrag1fach: 11.24, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "3110", kuerzel: "WSR", bezeichnung: "Resektion der Wurzelspitze eines einwurzeligen Zahnes", betrag1fach: 19.69, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },

  // ===== ENDO =====
  { nr: "2330", kuerzel: "Trep", bezeichnung: "Trepanation eines Zahnes (Eröffnung der Pulpakammer)", betrag1fach: 5.62, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "2340", kuerzel: "WK1", bezeichnung: "Aufbereitung eines Wurzelkanals bei einwurzeligem Zahn", betrag1fach: 10.12, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "2350", kuerzel: "WK2", bezeichnung: "Aufbereitung eines Wurzelkanals bei mehrwurzeligem Zahn, je Kanal", betrag1fach: 15.18, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "2390", kuerzel: "WKEin", bezeichnung: "Medikamentöse Einlage in den Wurzelkanal", betrag1fach: 3.94, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "2400", kuerzel: "WKFü", bezeichnung: "Füllung eines Wurzelkanals", betrag1fach: 11.24, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "2410", kuerzel: "WKRev", bezeichnung: "Revision einer Wurzelkanalfüllung, je Kanal", betrag1fach: 5.62, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },

  // ===== FÜLL =====
  { nr: "2050", kuerzel: "Fü1", bezeichnung: "Füllung einflächig (dentin-adhäsive Restauration)", betrag1fach: 10.12, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "2060", kuerzel: "Fü2", bezeichnung: "Füllung zweiflächig (dentin-adhäsive Restauration)", betrag1fach: 16.87, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "2080", kuerzel: "Fü3+", bezeichnung: "Füllung drei- oder mehrflächig (dentin-adhäsive Restauration)", betrag1fach: 24.05, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "2100", kuerzel: "Adhäs", bezeichnung: "Adhäsive Befestigung / Adhäsivtechnik (Zuschlag)", betrag1fach: 8.43, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "2120", kuerzel: "Unter", bezeichnung: "Unterfüllung, Stiftaufbau oder plastischer Aufbau", betrag1fach: 4.50, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },

  // ===== IMPL =====
  { nr: "9000", kuerzel: "ImplI", bezeichnung: "Einbringen eines enossalen Implantats", betrag1fach: 73.12, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "9010", kuerzel: "ImplF", bezeichnung: "Freilegung eines Implantats / Einbringen eines Aufbauelements", betrag1fach: 23.31, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "9040", kuerzel: "Augm", bezeichnung: "Knochenaugmentation / Sinuslift einschließlich Materialien", betrag1fach: 73.12, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },

  // ===== KFO =====
  { nr: "6030", kuerzel: "KFOAn", bezeichnung: "KFO-Modellanalyse einschließlich Vermessung", betrag1fach: 28.12, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "6100", kuerzel: "KFOEi", bezeichnung: "Eingliederung einer festsitzenden kieferorthopädischen Apparatur, je Kiefer", betrag1fach: 56.24, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },

  // ===== PAR =====
  { nr: "4070", kuerzel: "Kür1", bezeichnung: "Subgingivales Debridement / geschlossene Kürettage, je Zahn", betrag1fach: 3.37, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","282"] },
  { nr: "4075", kuerzel: "Kür2", bezeichnung: "Offene Kürettage / Lappenoperation, je Zahn", betrag1fach: 7.87, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203","282"] },

  // ===== DIVERS =====
  { nr: "0060", kuerzel: "NaBeh", bezeichnung: "Nachbehandlung nach chirurgischem Eingriff", betrag1fach: 4.66, standardFaktor: 2.3, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "0070", kuerzel: "InfAn", bezeichnung: "Infiltrationsanästhesie", betrag1fach: 3.94, standardFaktor: 2.3, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "0090", kuerzel: "LeitA", bezeichnung: "Leitungsanästhesie", betrag1fach: 5.62, standardFaktor: 2.3, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "0100", kuerzel: "Notf", bezeichnung: "Besondere Maßnahmen beim Notfall / Schmerzbehandlung", betrag1fach: 19.69, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },

  // ===== ZE =====
  { nr: "5000", kuerzel: "KrStZ", bezeichnung: "Versorgung eines Zahnes mit einer Krone / Stiftzahn", betrag1fach: 22.47, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "5040", kuerzel: "BrGl", bezeichnung: "Brückenglied / Zwischenglied", betrag1fach: 16.87, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
  { nr: "5070", kuerzel: "ZERep", bezeichnung: "Reparatur / Unterfütterung von Zahnersatz", betrag1fach: 11.24, standardFaktor: 3.5, begruendungAbFaktor: 2.3, begruendungen: ["200","201","202","203"] },
];

export const verbrauchsmaterialien = [
  { nr: "vm1000", kuerzel: "vmCHXG", bezeichnung: "Chlorhexidin-Digluconat-Gel", betrag: 0.65, einheit: "Zahn oder Implantat" },
  { nr: "vm1050", kuerzel: "vmCPFK", bezeichnung: "Calcium-Phosphat-Flourid-Komplex", betrag: 6.13, einheit: "Packung" },
  { nr: "vm5000", kuerzel: "vmMMP8", bezeichnung: "MMP-8 (Matrix-Metalloproteinase-8)-Test Verbrauchsmaterial", betrag: 48.72, einheit: "Packung" },
];

export const begruendungsTexte: Record<string, string> = {
  "200": "Besonders stark erhöhter Aufwand aufgrund starken Wangendrucks",
  "201": "Besonders stark erhöhter Aufwand aufgrund starken Lippenzugs",
  "202": "Besonders stark erhöhter Aufwand aufgrund Hypermobilität der Zunge",
  "203": "Besonders stark erhöhter Aufwand aufgrund starken Speichelflusses",
  "220": "Besonders stark erhöhter Aufwand aufgrund Anwendung an allen Zähnen",
  "222": "Besonders stark erhöhter Aufwand aufgrund Anwendung elektronischer Kariesdetektion",
  "224": "Besonders stark erhöhter Aufwand aufgrund Anwendung mehrerer Verfahren",
  "229": "Besonders stark erhöhter Aufwand aufgrund Entfernung von Druckstellen am Zahnersatz",
  "244": "Besonders stark erhöhter Aufwand aufgrund materialspezifisch erhöhten Aufwands (mehrere Polierer nötig)",
  "251": "Besonders stark erhöhter Aufwand aufgrund mehrstufiger interdentaler Politur im Approximalraum mit Finierstreifen",
  "252": "Besonders stark erhöhter Aufwand aufgrund mehrstufiger Politur von Keramik",
  "253": "Besonders stark erhöhter Aufwand aufgrund Messung an allen Zähnen und mindestens vier Messpunkten je Zahn",
  "262": "Besonders stark erhöhter Aufwand aufgrund schwieriger Platzierung bei stark gekrümmtem Kiefer",
  "271": "Besonders stark erhöhter Aufwand aufgrund sehr festhaftender Beläge",
  "282": "Besonders stark erhöhter Aufwand aufgrund stark entzündeter und sehr tiefer Zahnfleischtaschen",
  "302": "Besonders stark erhöhter Aufwand aufgrund von Würgereiz",
  "306": "Besonders zeitaufwendiges Aufklärungsgespräch",
  "307": "Diagnostik ungewöhnlich aufwendig wegen zahlreicher Differentialdiagnosen bei unklarem Befund",
  "319": "Parodontal-Intensiv-Vorbehandlung",
  "338": "Besonders stark erhöhter Aufwand aufgrund schwieriger Positionierung wegen anatomischer Ungleichheiten",
  "339": "Besonders stark erhöhter Aufwand aufgrund Tremors",
  "MHB": "Besonders zeitaufwendige Mundhygieneberatung",
};

export const behandlungsArten = [
  { id: "DIAG", name: "DIAG (Untersuchungen)", verfuegbar: true },
  { id: "PROPHY", name: "PROPHY (Prophylaxe)", verfuegbar: true },
  { id: "CHIR", name: "CHIR (Chirurgie)", verfuegbar: true },
  { id: "ENDO", name: "ENDO (Endodontie)", verfuegbar: true },
  { id: "FUELL", name: "FÜLL (Füllung)", verfuegbar: true },
  { id: "IMPL", name: "IMPL (Implantologie)", verfuegbar: true },
  { id: "KFO", name: "KFO (Kieferorthopädie)", verfuegbar: true },
  { id: "PAR", name: "PAR (Parodontologie)", verfuegbar: true },
  { id: "ZE", name: "ZE (Zahnersatz)", verfuegbar: true },
  { id: "DIVERS", name: "DIVERS (Sonstiges)", verfuegbar: true },
];
