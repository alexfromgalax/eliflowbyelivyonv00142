// Treatment category options for all 10 dental treatment types
// Each category has its own set of options with sub-steps, techniken, materialien

export interface TreatmentOption {
  id: string;
  name: string;
  beschreibung: string;
  subSteps: string[];
  gozNr?: string;
  /** BEMA-Nummer für GKV-Abrechnung */
  bemaNr?: string;
  billingUnit?: 'zahn' | 'kiefer' | 'quadrant' | 'sitzung';
  techniken?: string[];
  materialien?: string[];
  maxPerSession?: number;
  /** Hinweis bei GKV (z.B. "Mehrkostenvereinbarung erforderlich") */
  gkvHinweis?: string;
  /** Ist diese Leistung bei GKV nicht als Kassenleistung verfügbar? */
  nichtKassenleistung?: boolean;
}

// ===================== PROPHY =====================
// Moved from gozCodes.ts

export const pzrTechniken = [
  "Scaling (manuell)",
  "Scaling (maschinell/Ultraschall)",
  "Airflow/Pulverstrahl",
  "Politur (Kelch/Bürste)",
  "Superfloss",
  "Zahnseide",
  "Interdentalbürsten",
];

export const pzrStrahlpulver = [
  "Natriumbicarbonat (grob)",
  "Glycin-Pulver (fein)",
  "Erythritol-Pulver (extra fein)",
  "Calciumcarbonat",
  "ApaPearls",
];

export const mundspuelungMaterialien = [
  "Chlorhexidin 0,2%",
  "Chlorhexidin 0,1%",
  "Betaisodona",
  "Listerine",
  "Meridol",
];

export const schleimhautTechniken = [
  "Auftragen von Salbe",
  "Auftragen von Gel",
  "Spülung mit Lösung",
  "Tamponade",
];

export const schleimhautMaterialien = [
  "Dynexan Mundgel",
  "Solcoseryl Dental-Adhäsivpaste",
  "Chlorhexidin-Gel",
  "Kamistad Gel",
  "Volon A Haftsalbe",
];

export const fluoridierungMaterialien = [
  "Elmex Gelee",
  "Duraphat Lack",
  "Fluoridin Gel",
  "Bifluorid 12",
];

export const ueberempfindlichMaterialien = [
  "Elmex Fluid",
  "Duraphat Lack",
  "Seal & Protect",
  "Gluma Desensitizer",
  "Bifluorid 12",
];

export const subgingivalMaterialien = [
  "CHX-Gel (Chlorhexidin-Digluconat-Gel)",
  "PerioChip",
  "Ligosan Slow Release",
  "Arestin",
];

export const mmp8Ergebnisse = [
  "Negativ (< 20 ng/ml) – kein aktiver Gewebeabbau",
  "Schwach positiv (20-40 ng/ml) – leichter Gewebeabbau",
  "Positiv (> 40 ng/ml) – aktiver parodontaler Gewebeabbau",
];

const prophyOptions: TreatmentOption[] = [
  {
    id: "PZR", name: "PZR – Professionelle Zahnreinigung",
    beschreibung: "Zahnreinigung inkl. Zahnsteinentfernung, Politur und Airflow",
    subSteps: ["zahnauswahl", "techniken", "strahlpulver", "fluoridierung"], gozNr: "1040", billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "PZR ist keine GKV-Kassenleistung. Privatvereinbarung (§8 Abs. 7 BMV-Z) oder Bonusleistung der Kasse erforderlich.",
  },
  {
    id: "MUNDSPUELUNG", name: "Desinfizierende Mundspülung",
    beschreibung: "Lokalbehandlung von Mundschleimhauterkrankungen inkl. Taschenspülungen",
    subSteps: ["materialauswahl"], gozNr: "4020", bemaNr: "107", billingUnit: "sitzung", maxPerSession: 1,
  },
  {
    id: "SCHLEIMHAUT", name: "Schleimhauterkrankungen behandelt",
    beschreibung: "Behandlung mit Salben, Gels oder Lösungen",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl"], gozNr: "4020", bemaNr: "107", billingUnit: "sitzung", maxPerSession: 1,
  },
  {
    id: "FLUORID_SCHIENE", name: "Medikamententrägerschiene zur Fluoridierung",
    beschreibung: "Fluoridierung/Kariesvorsorge mit individuell gefertigter Schiene",
    subSteps: ["kieferauswahl", "materialauswahl", "material_mitgegeben"], gozNr: "1030", billingUnit: "kiefer",
    nichtKassenleistung: true, gkvHinweis: "Keine GKV-Kassenleistung. Privatvereinbarung erforderlich.",
  },
  {
    id: "UEBEREMPFINDLICH", name: "Überempfindliche Zahnhälse/Zahnflächen",
    beschreibung: "Behandlung überempfindlicher Zahnflächen",
    subSteps: ["zahnauswahl", "materialauswahl"], gozNr: "2010", billingUnit: "kiefer",
    nichtKassenleistung: true, gkvHinweis: "Keine eigenständige BEMA-Position. Privatvereinbarung erforderlich.",
  },
  {
    id: "SCHARFE_KANTEN", name: "Scharfe Kanten entfernt",
    beschreibung: "Beseitigung scharfer Zahnkanten, störender Prothesenränder und Fremdreize",
    subSteps: ["zahnauswahl", "materialauswahl"], gozNr: "4030", bemaNr: "107", billingUnit: "quadrant",
  },
  {
    id: "SUBGINGIVAL", name: "Subgingivale antibakterielle Applikation",
    beschreibung: "Applikation von Gel/Salben/Chips in Zahnfleischtaschen",
    subSteps: ["zahnauswahl", "materialauswahl"], gozNr: "4025", billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "Keine GKV-Kassenleistung. Privatvereinbarung erforderlich.",
  },
  {
    id: "MMP8", name: "MMP-8 Test",
    beschreibung: "Matrix-Metalloproteinase-8-Test zur Parodontitis-Früherkennung",
    subSteps: ["ergebnis", "materialauswahl"], gozNr: "vm5000", billingUnit: "sitzung",
  },
];

// ===================== DIAG =====================
const diagOptions: TreatmentOption[] = [
  {
    id: "DIAG_UNTERSUCHUNG", name: "Eingehende Untersuchung",
    beschreibung: "Feststellung von Zahn-, Mund- und Kiefererkrankungen einschl. Erhebung des Parodontalbefundes und Vitalitätsprüfung",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "0010", bemaNr: "01", billingUnit: "sitzung",
    techniken: [
      "Visuelle Inspektion", "Sondierung", "Perkussionstest (vertikal/horizontal)",
      "Sensibilitätstest (Kälte/CO₂-Schnee)", "Sensibilitätstest (elektrisch)",
      "Transillumination", "Palpation", "Mobilität (Grad 0–III)",
      "Okklusionskontrolle (Shimstock/Artikulationspapier)",
    ],
  },
  {
    id: "DIAG_BERATUNG", name: "Beratung",
    beschreibung: "Eingehende Beratung des Patienten – auch mittels Fernsprecher",
    subSteps: ["notes"], gozNr: "Ä1", bemaNr: "Ä1", billingUnit: "sitzung",
  },
  {
    id: "DIAG_PSI", name: "PSI-Erhebung",
    beschreibung: "Erhebung des Parodontalen Screening Index an 6 Messpunkten pro Sextant",
    subSteps: ["notes"], gozNr: "4005", bemaNr: "04", billingUnit: "sitzung",
  },
  {
    id: "DIAG_PARSTATUS", name: "Parodontalstatus (vollständig)",
    beschreibung: "Vollständiger PAR-Status: Sondierungstiefen, Rezessionen, BOP, Furkationsbefall, Mobilität an allen Zähnen (6 Messpunkte/Zahn)",
    subSteps: ["zahnauswahl", "notes"], gozNr: "4000", bemaNr: "P200", billingUnit: "sitzung",
  },
  {
    id: "DIAG_VITALITAET", name: "Vitalitäts-/Sensibilitätsprüfung",
    beschreibung: "Gezielte Prüfung der Zahnvitalität (Kälte, elektrisch, Wärme) zur DD",
    subSteps: ["zahnauswahl", "techniken", "notes"], billingUnit: "zahn",
    techniken: [
      "Kältetest (CO₂-Schnee)", "Kältetest (Chlorethylspray)", "Kältetest (Eisstäbchen)",
      "Elektrischer Sensibilitätstest", "Wärmetest (heißes Guttapercha)",
      "Perkussionstest vertikal", "Perkussionstest horizontal",
    ],
  },
  {
    id: "DIAG_ROENTGEN", name: "Röntgen Einzelzahn (Zahnfilm)",
    beschreibung: "Intraorale Zahnfilmaufnahme (z.B. periapikale Aufnahme, Bissflügelaufnahme). Rechtfertigende Indikation dokumentieren!",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "Ä5000", bemaNr: "Ä925a", billingUnit: "zahn",
    techniken: ["Periapikale Aufnahme", "Bissflügelaufnahme (Bitewing)", "Aufbissaufnahme"],
  },
  {
    id: "DIAG_OPG", name: "Panoramaschichtaufnahme (OPG)",
    beschreibung: "Panoramaschichtaufnahme der Kiefer. Strahlenschutz-Indikation erforderlich.",
    subSteps: ["notes"], gozNr: "Ä5004", bemaNr: "Ä935d", billingUnit: "sitzung",
  },
  {
    id: "DIAG_DVT", name: "Digitale Volumentomographie (DVT/CBCT)",
    beschreibung: "3D-Röntgendiagnostik zur Implantatplanung, WSR-Planung, Verlagerungsdiagnostik. Analogberechnung nach §6 GOZ.",
    subSteps: ["zahnauswahl", "notes"], billingUnit: "sitzung",
    nichtKassenleistung: true, gkvHinweis: "DVT ist keine regelhafte GKV-Kassenleistung. Privatvereinbarung erforderlich (Ausnahmen nach G-BA-Beschluss).",
  },
  {
    id: "DIAG_FOTO", name: "Fotodokumentation",
    beschreibung: "Intraorale/extraorale Fotodokumentation zu diagnostischen und/oder therapeutischen Zwecken",
    subSteps: ["techniken", "notes"], gozNr: "6000m", billingUnit: "sitzung",
    techniken: ["Intraoral frontal", "Intraoral lateral (re/li)", "Intraoral okklusal (OK/UK)", "Extraoral frontal", "Extraoral Profil", "Lippenbild"],
  },
  {
    id: "DIAG_FAL", name: "Klinische Funktionsanalyse",
    beschreibung: "Funktionsanalyse einschl. Dokumentation bei CMD-Verdacht",
    subSteps: ["techniken", "notes"], gozNr: "8000", billingUnit: "sitzung",
    nichtKassenleistung: true, gkvHinweis: "Keine GKV-Kassenleistung. Privatvereinbarung erforderlich.",
    techniken: [
      "Muskelpalpation (Mm. masseter, temporalis, pterygoidei)",
      "Kiefergelenkpalpation (lateral, dorsal)",
      "Auskultation Kiefergelenk",
      "Mundöffnungsmessung (SKD)",
      "Laterotrusionsmessung",
      "Okklusionsanalyse",
    ],
  },
];

// ===================== CHIR =====================
const chirOptions: TreatmentOption[] = [
  {
    id: "CHIR_EXTRAKTION_EIN", name: "Extraktion (einwurzelig)",
    beschreibung: "Entfernung eines einwurzeligen Zahnes oder Wurzelrestes. Indikation: nicht erhaltungswürdig, Trauma, KFO.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "3000", bemaNr: "X1", billingUnit: "zahn",
    techniken: [
      "Syndesmotomie", "Zangenextraktion", "Hebelung (Bein-Hebel)", "Luxation",
      "Wurzelspitzenhebel", "Kompression der Alveole",
      "Nahtversorgung", "Tamponade",
    ],
    materialien: ["Kollagenvlies (Kollagen-Kegel)", "Hämostyptikum", "Nahtmaterial resorbierbar", "Tamponade (Gazestreifen)"],
  },
  {
    id: "CHIR_EXTRAKTION_MEHR", name: "Extraktion (mehrwurzelig)",
    beschreibung: "Entfernung eines mehrwurzeligen Zahnes. Bei festsitzender Krone ggf. Wurzeltrennung erforderlich.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "3010", bemaNr: "X2", billingUnit: "zahn",
    techniken: [
      "Syndesmotomie", "Zangenextraktion", "Hebelung",
      "Wurzeltrennung (Lindemann-Fräse)", "Luxation",
      "Alveolenkompression", "Nahtversorgung", "Tamponade",
    ],
    materialien: ["Kollagenvlies", "Hämostyptikum", "Nahtmaterial resorbierbar", "Tamponade"],
  },
  {
    id: "CHIR_OSTEOTOMIE_EIN", name: "Osteotomie (einwurzelig)",
    beschreibung: "Operative Entfernung einwurzeliger Zahn/Wurzelrest mit Mukoperiostlappenbildung und Knochenabtragung",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "3020", bemaNr: "Ost1", billingUnit: "zahn",
    techniken: [
      "Schnittführung (Marginal/Trapez/Angular)", "Mukoperiostlappenbildung",
      "Osteotomie mit rotierendem Instrument (unter Kühlung)", "Osteotomie mit Meißel",
      "Hebelung des Zahnes/Wurzelrestes", "Alveolektomie/Glättung des Knochens",
      "Kürettage der Alveole", "Wundnaht (Einzelknopf/Matratzennähte)",
    ],
    materialien: ["Kollagenvlies", "Knochenersatzmaterial (bei Defekt)", "Resorbierbare Membran", "Nahtmaterial (resorbierbar 4-0/5-0)", "Nahtmaterial (nicht-resorbierbar)"],
  },
  {
    id: "CHIR_OSTEOTOMIE_MEHR", name: "Osteotomie (mehrwurzelig / retiniert)",
    beschreibung: "Operative Entfernung mehrwurzeliger/retinierter Zahn (z.B. Weisheitszahn) mit Knochenabtragung und ggf. Wurzeltrennung",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "3030", bemaNr: "Ost2", billingUnit: "zahn",
    techniken: [
      "Schnittführung (Marginal/Trapez/Angular/Envelope)", "Mukoperiostlappenbildung",
      "Osteotomie mit rotierendem Instrument (unter Kühlung)",
      "Wurzeltrennung (Lindemann-Fräse)", "Hebelung der Fragmente",
      "Kürettage der Alveole / Follikel-Entfernung", "Knochenglättung",
      "Wundnaht (Einzelknopf/Matratzennähte)",
    ],
    materialien: ["Kollagenvlies", "Knochenersatzmaterial", "Resorbierbare Membran", "Nahtmaterial (resorbierbar 4-0)", "Tamponadestreifen"],
  },
  {
    id: "CHIR_WSR", name: "Wurzelspitzenresektion (WSR)",
    beschreibung: "Apikoektomie mit retrograder Präparation und Füllung. Indikation: persistierende apikale Pathologie nach suffizientem WK-Befund.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "3110", bemaNr: "WR", billingUnit: "zahn",
    techniken: [
      "Schnittführung (Trapez-/Submarginalschnitt)", "Mukoperiostlappenbildung",
      "Osteotomie / Knochenfensterung", "Resektion der Wurzelspitze (ca. 3mm)",
      "Retrograde Kavitätenpräparation (Ultraschall)", "Retrograde Füllung",
      "Kürettage des periapikalen Gewebes", "Histologische Untersuchung veranlasst",
      "Wundnaht", "Mikroskop-/Lupenbrille-assistiert",
    ],
    materialien: ["MTA (Mineral Trioxide Aggregate)", "SuperEBA-Zement", "Kollagenvlies", "Knochenersatzmaterial (Bio-Oss)", "Resorbierbare Membran", "Nahtmaterial (5-0 resorbierbar)"],
  },
  {
    id: "CHIR_HEMISEKTION", name: "Hemisektion / Prämolarisierung",
    beschreibung: "Durchtrennung und Teilentfernung eines mehrwurzeligen Zahnes. Erhalt des prothetisch verwertbaren Anteils.",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "3040", bemaNr: "56a", billingUnit: "zahn",
    techniken: ["Wurzeltrennung (Lindemann-Fräse)", "Entfernung des betroffenen Zahnanteils", "Alveolektomie", "Wundnaht", "Provisorische Versorgung"],
  },
  {
    id: "CHIR_PLASTISCHER_VERSCHLUSS", name: "Plastischer Wundverschluss / MAV",
    beschreibung: "Plastischer Verschluss einer Mund-Antrum-Verbindung (MAV) oder größerer Wunden",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "3100", bemaNr: "48", billingUnit: "zahn",
    techniken: [
      "Rehrmann-Lappen (Wangenverschiebeplastik)", "Brückenlappen",
      "Doppelschichtverschluss", "Periostschlitzung zur Mobilisierung",
      "Wundnaht (mehrschichtig)",
    ],
    materialien: ["Nahtmaterial resorbierbar (4-0)", "Nahtmaterial nicht-resorbierbar", "Kollagenvlies", "Verbandsplatte"],
  },
  {
    id: "CHIR_INZISION", name: "Inzision / Abszessdrainage",
    beschreibung: "Inzision eines intra-/extraoralen Abszesses mit Drainageeinlage",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "3070", bemaNr: "47a", billingUnit: "zahn",
    techniken: ["Inzision intraoral", "Inzision extraoral", "Drainageeinlage", "Spülung der Abszesshöhle", "Tamponade"],
    materialien: ["Lasche/Drainage (Gummi)", "Tamponade (Jodoform)", "NaCl-Spüllösung", "Antibiotikum (Rezept)"],
  },
  {
    id: "CHIR_FRENEKTOMIE", name: "Frenektomie / Lippenbandentfernung",
    beschreibung: "Operative Entfernung oder Verlagerung eines störenden Lippen-/Zungenbändchens",
    subSteps: ["techniken", "materialauswahl", "notes"], gozNr: "3100", billingUnit: "sitzung",
    techniken: ["Exzision (klassisch)", "Laser-Frenektomie (Diode)", "Z-Plastik", "Wundnaht"],
    materialien: ["Nahtmaterial resorbierbar (5-0)", "Kollagenvlies"],
  },
  {
    id: "CHIR_ZYSTEKTOMIE", name: "Zystektomie",
    beschreibung: "Operative Entfernung einer odontogenen Zyste mit vollständiger Ausschälung",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], billingUnit: "zahn",
    nichtKassenleistung: false,
    techniken: [
      "Mukoperiostlappenbildung", "Osteotomie/Knochenfensterung", "Vollständige Zystenausschälung (Enukleation)",
      "Histologische Untersuchung veranlasst", "Defektauffüllung", "Wundnaht",
    ],
    materialien: ["Knochenersatzmaterial (Bio-Oss)", "Kollagenmembran (Bio-Gide)", "Nahtmaterial (4-0 resorbierbar)", "Histologie-Gefäß (Formalin)"],
  },
];

// ===================== ENDO =====================
const endoOptions: TreatmentOption[] = [
  {
    id: "ENDO_TREPANATION", name: "Trepanation / Eröffnung",
    beschreibung: "Eröffnung der Pulpakammer zur Schmerztherapie oder als Beginn der endodontischen Behandlung",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "2330", bemaNr: "Trep", billingUnit: "zahn",
    techniken: ["Karies-Exkavation vor Trepanation", "Zugangskavität mit Diamant", "Dachentfernung mit Rosenbohrer", "Direkte Überkappung (alternativ)", "Indirekte Überkappung (alternativ)"],
  },
  {
    id: "ENDO_AUFBEREITUNG_EIN", name: "WK-Aufbereitung (1 Kanal, einwurzelig)",
    beschreibung: "Vollständige chemomechanische Aufbereitung eines Wurzelkanals. Arbeitslängenbestimmung, Aufbereitung, Spülprotokoll.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2340", bemaNr: "WK", billingUnit: "zahn",
    techniken: [
      "Kofferdam-Isolation", "Arbeitslängenbestimmung (Endometrie)", "Arbeitslängenbestimmung (Röntgen/Messaufnahme)",
      "Maschinelle Aufbereitung (Voll-rotierende NiTi)", "Maschinelle Aufbereitung (Reziprok, z.B. Reciproc/WaveOne)",
      "Manuelle Aufbereitung (Step-Back/Crown-Down)", "Gleitpfadherstellung (PathFile/ProGlider)",
      "Ultraschallaktivierte Spülung (PUI)", "Schallaktivierte Spülung (EDDY/EndoActivator)",
      "Mikroskop-/Lupenbrille-assistiert",
    ],
    materialien: [
      "NaOCl 3% (Spülung)", "NaOCl 5,25% (Spülung)", "EDTA 17% (Schmierschicht-Entfernung)",
      "Citronensäure 10%", "CHX 2% (Abschlussspülung)", "Alkohol 70% (Trocknung)",
      "Papierspitzen (ISO-Größen)", "Calciumhydroxid-Einlage (z.B. UltraCal XS)",
    ],
  },
  {
    id: "ENDO_AUFBEREITUNG_MEHR", name: "WK-Aufbereitung (mehrere Kanäle, mehrwurzelig)",
    beschreibung: "Chemomechanische Aufbereitung bei mehrwurzeligem Zahn. Jeder Kanal einzeln aufbereitet – Abrechnung je Kanal.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2350", bemaNr: "WK2", billingUnit: "zahn",
    techniken: [
      "Kofferdam-Isolation", "Darstellung aller Kanaleingänge (Ultraschall/Mikroskop)",
      "Arbeitslängenbestimmung (Endometrie)", "Arbeitslängenbestimmung (Röntgen)",
      "Maschinelle Aufbereitung (Voll-rotierende NiTi)", "Maschinelle Aufbereitung (Reziprok)",
      "Manuelle Aufbereitung", "Gleitpfadherstellung",
      "Ultraschallaktivierte Spülung (PUI)", "Schallaktivierte Spülung",
      "Mikroskop-/Lupenbrille-assistiert", "Kanalsuche bei verkalzifizierten Kanälen",
    ],
    materialien: [
      "NaOCl 3% (Spülung)", "NaOCl 5,25% (Spülung)", "EDTA 17%",
      "Citronensäure 10%", "CHX 2%", "Alkohol 70%",
      "Papierspitzen", "Calciumhydroxid-Einlage",
    ],
  },
  {
    id: "ENDO_FUELLUNG", name: "Wurzelkanalfüllung (Obturation)",
    beschreibung: "Definitive Füllung der aufbereiteten Kanäle. Voraussetzung: beschwerdefreier Zahn, trockener Kanal.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2400", bemaNr: "WF", billingUnit: "zahn",
    techniken: [
      "Kofferdam-Isolation",
      "Laterale Kondensation (kalt)", "Vertikale Kondensation (warm, Continuous Wave)",
      "Single-Cone-Technik (hydraulische Sealerverdrängung)",
      "Thermoplastische Obturation (Obtura/Thermafil)",
      "Röntgenkontrolle (Masterpointaufnahme)", "Röntgenkontrolle (Kontrollaufnahme nach Obturation)",
    ],
    materialien: [
      "Guttapercha-Stifte (ISO/Taper)", "AH Plus Sealer (Epoxidharz)", "BioRoot RCS (biokeramisch)",
      "TotalFill BC Sealer (biokeramisch)", "MTA (bei apikaler Barriere)",
      "Thermafil-/GuttaCore-Obturatoren",
    ],
  },
  {
    id: "ENDO_REVISION", name: "WK-Revision",
    beschreibung: "Revision einer insuffizienten Wurzelkanalfüllung. Entfernung alter Füllung, erneute Aufbereitung und Desinfektion.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2410", billingUnit: "zahn",
    nichtKassenleistung: false,
    techniken: [
      "Kofferdam-Isolation", "Entfernung der koronalen Restauration",
      "Entfernung alter Guttapercha (Lösungsmittel/Hedström-Feilen)", "Entfernung alter Guttapercha (maschinell, z.B. R-Endo)",
      "Stift-/Aufbauentfernung (Ultraschall)", "Bypassing blockierter Kanäle",
      "Erneute Aufbereitung", "Ultraschallaktivierte Spülung",
      "Kanalsuche bei verkalzifizierten Kanälen", "Mikroskop-/Lupenbrille-assistiert",
    ],
    materialien: [
      "Chloroform/Eukalyptol (Guttaperchalöser)", "NaOCl 3–5,25%", "EDTA 17%",
      "Calciumhydroxid-Einlage", "Guttapercha-Stifte", "AH Plus / BioRoot RCS Sealer",
    ],
  },
  {
    id: "ENDO_EINLAGE", name: "Medikamentöse Einlage",
    beschreibung: "Einbringen einer medikamentösen Einlage zwischen den Sitzungen. Dichter provisorischer Verschluss obligat.",
    subSteps: ["zahnauswahl", "materialauswahl", "notes"], gozNr: "2390", bemaNr: "Med", billingUnit: "zahn",
    materialien: ["Calciumhydroxid (UltraCal XS)", "Calciumhydroxid (Calxyl)", "Ledermix (Kortikoid + Antibiotikum)", "CHX-Gel 2%", "MTA (als apikaler Plug)"],
  },
  {
    id: "ENDO_STIFTAUFBAU", name: "Stiftaufbau",
    beschreibung: "Adhäsiver Glasfaserstiftaufbau nach endodontischer Behandlung als Verankerung für die definitive Versorgung",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2120", billingUnit: "zahn",
    techniken: [
      "Entfernung der koronalen Guttapercha (Stiftbettbohrung)",
      "Adhäsive Befestigung (Self-Etch/Etch-and-Rinse)",
      "Stiftinsertion", "Aufbau mit Komposit",
    ],
    materialien: ["Glasfaserstift (FRC)", "Dual-härtender Befestigungskomposit (RelyX Unicem)", "Aufbaukomposit (z.B. Multicore Flow)", "Universaladhäsiv", "Phosphorsäure 37%"],
  },
];

// ===================== FÜLL =====================
const fuellOptions: TreatmentOption[] = [
  {
    id: "FUELL_KOMPOSIT_1", name: "Kompositfüllung (einflächig)",
    beschreibung: "Direkte dentin-adhäsive Restauration, einflächig. Bei GKV im Seitenzahnbereich: Amalgam = Regelversorgung, Komposit = Mehrkostenvereinbarung.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2050", bemaNr: "13a", billingUnit: "zahn",
    gkvHinweis: "Seitenzahn: Amalgam ist Kassenleistung. Für Komposit im Seitenzahnbereich ist eine Mehrkostenvereinbarung (§28 SGB V) erforderlich.",
    techniken: [
      "Kofferdam-Isolation", "Relative Trockenlegung (Watterollen + Absaugung)",
      "Karies-Exkavation (Rosenbohrer/Handexkavator)", "Exkavation mit Kariesdetektorlösung",
      "Selektive Schmelzätzung (Phosphorsäure 37%)", "Adhäsivapplikation (Etch-and-Rinse)",
      "Adhäsivapplikation (Self-Etch/Universal)", "Inkrementelle Kompositschichtung",
      "Lichthärtung (mind. 20s/Inkrement)", "Ausarbeitung (Finierdiamant/Hartmetallfinierer)",
      "Politur (Silikonpolierer, mehrstufig)", "Okklusionskontrolle (Shimstock/Artikulationspapier)",
    ],
    materialien: [
      "Nano-Hybrid-Komposit (z.B. Filtek Supreme, Venus Diamond)",
      "Bulk-Fill-Komposit (z.B. Tetric PowerFill, Filtek One)",
      "Flow-Komposit (als Liner)", "Universaladhäsiv (z.B. Scotchbond Universal, Adhese Universal)",
      "Phosphorsäure 37% (Ätzgel)", "Matrize + Holzkeil (Teilmatrize)",
    ],
  },
  {
    id: "FUELL_KOMPOSIT_2", name: "Kompositfüllung (zweiflächig)",
    beschreibung: "Direkte dentin-adhäsive Restauration, zweiflächig (Klasse II mit einer Approximalfläche). Matrizentechnik obligat.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2060", bemaNr: "13b", billingUnit: "zahn",
    gkvHinweis: "Seitenzahn: Für Komposit ggf. Mehrkostenvereinbarung (§28 SGB V) erforderlich.",
    techniken: [
      "Kofferdam-Isolation", "Relative Trockenlegung",
      "Karies-Exkavation", "Exkavation mit Kariesdetektorlösung",
      "Teilmatrizentechnik (Sektionalmatrize + Ring)", "Keilsetzung (Holzkeil/Kunststoffkeil)",
      "Selektive Schmelzätzung", "Adhäsivapplikation",
      "Inkrementelle Kompositschichtung (Approximalwand zuerst)",
      "Kontaktpunktgestaltung", "Lichthärtung",
      "Ausarbeitung (Finierstreifen approximal)", "Politur", "Okklusionskontrolle",
    ],
    materialien: [
      "Nano-Hybrid-Komposit", "Bulk-Fill-Komposit", "Flow-Komposit (Liner)",
      "Universaladhäsiv", "Phosphorsäure 37%",
      "Teilmatrizenband (z.B. Palodent V3, Composi-Tight)", "Separationsring",
      "Holzkeile/Kunststoffkeile", "Finierstreifen (Sof-Lex)",
    ],
  },
  {
    id: "FUELL_KOMPOSIT_3PLUS", name: "Kompositfüllung (drei- oder mehrflächig)",
    beschreibung: "Direkte dentin-adhäsive Restauration, drei- oder mehrflächig (mod, Aufbaufüllung). Anatomische Schichtung und Modellation.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2080", bemaNr: "13c", billingUnit: "zahn",
    gkvHinweis: "Seitenzahn: Für Komposit ggf. Mehrkostenvereinbarung (§28 SGB V) erforderlich.",
    techniken: [
      "Kofferdam-Isolation", "Relative Trockenlegung",
      "Karies-Exkavation (komplett/selektiv)", "Exkavation mit Kariesdetektorlösung",
      "Matrizentechnik (Sektional- oder Zirkularmatrize)", "Keilsetzung",
      "Adhäsivapplikation (Etch-and-Rinse/Self-Etch)",
      "Inkrementelle Schichtung (sukzessive Höckeraufbau)", "Anatomische Modellation (Centripetal-Technik)",
      "Lichthärtung pro Inkrement", "Kontaktpunktgestaltung",
      "Ausarbeitung/Konturierung", "Mehrstufige Politur", "Okklusionskontrolle",
    ],
    materialien: [
      "Nano-Hybrid-Komposit", "Bulk-Fill-Komposit", "Flow-Komposit (Liner/Unterlage)",
      "Universaladhäsiv", "Phosphorsäure 37%",
      "Teilmatrizenband/Zirkularmatrize", "Separationsring", "Keile",
      "Silikonpolierer (mehrstufig)", "Finierstreifen",
    ],
  },
  {
    id: "FUELL_GIZ", name: "Glasionomerzement-Füllung",
    beschreibung: "Füllung mit konventionellem oder kunstoffmodifiziertem GIZ. Typisch für Klasse V, provisorisch, Milchzähne.",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "2050", bemaNr: "13a", billingUnit: "zahn",
    techniken: ["Karies-Exkavation", "Kavitätenkonditionierung (Polyacrylsäure 10%)", "Applikation GIZ", "Ausarbeitung nach Aushärtung", "Versiegelung mit Bonding/Lack"],
  },
  {
    id: "FUELL_PROVISORISCH", name: "Provisorische Füllung",
    beschreibung: "Provisorischer Verschluss einer Kavität (z.B. zwischen Endo-Sitzungen, vor definitiver Versorgung)",
    subSteps: ["zahnauswahl", "materialauswahl", "notes"], gozNr: "2050", bemaNr: "13a", billingUnit: "zahn",
    materialien: ["Cavit (selbsthärtend, Wasserkontakt)", "Fermit (lichthärtend)", "Ketac Cem (GIZ)", "IRM (Zinoxid-Eugenol-Zement)", "Clip (lichthärtend)"],
  },
  {
    id: "FUELL_UNTERFUELLUNG", name: "Unterfüllung / Aufbau",
    beschreibung: "Unterfüllung als thermischer Schutz, Kalziumhydroxid-Liner bei tiefer Kavität, oder plastischer Stumpfaufbau",
    subSteps: ["zahnauswahl", "materialauswahl", "notes"], gozNr: "2120", billingUnit: "zahn",
    materialien: [
      "Calciumhydroxid-Liner (Dycal/Life)", "Glasionomerzement (Fuji IX/Ketac Molar)",
      "Flow-Komposit (als Liner)", "Kompomer", "Stift (Glasfaser) + Aufbaukomposit",
    ],
  },
  {
    id: "FUELL_ADHAESIV", name: "Adhäsivtechnik (Zuschlag GOZ 2100)",
    beschreibung: "Zuschlagsposition für dentin-adhäsive Befestigung. Neben der Füllung gesondert berechnungsfähig (GOZ).",
    subSteps: ["zahnauswahl", "notes"], gozNr: "2100", billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "GOZ 2100 ist keine BEMA-Position. Bei GKV nur im Rahmen der Mehrkostenvereinbarung berechnungsfähig.",
  },
];

// ===================== IMPL =====================
const implOptions: TreatmentOption[] = [
  {
    id: "IMPL_INSERTION", name: "Implantatinsertion",
    beschreibung: "Einbringen eines enossalen Implantats. OP-Bericht: Implantatsystem, Dimension, Drehmoment, Primärstabilität dokumentieren!",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "9000", billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "Implantologie ist grundsätzlich keine GKV-Kassenleistung (Ausnahmeindikationen gem. §28 SGB V / G-BA-Richtlinie beachten).",
    techniken: [
      "Krestaler Schnitt/Lappenbildung", "Flapless (lappenlose Insertion)",
      "Pilotbohrung (unter Kühlung)", "Sequenzielle Aufbohrung (Normprotokoll)",
      "Unterdimensionierte Aufbereitung (D3/D4-Knochen)",
      "Schablonengeführte Insertion (navigiert)", "Freihand-Insertion",
      "Gewindeschneiden (falls erforderlich)", "Implantatinsertion (Drehmoment dokumentieren)",
      "Einbringen Einheilkappe/Cover Screw", "Periostschlitzung (bei Bedarf)",
      "Wundnaht (Einzelknopf/Matratzennähte)",
    ],
    materialien: [
      "Titanimplantat (System + Dimensionen dokumentieren)", "Keramikimplantat (Zirkonoxid, z.B. Straumann PURE)",
      "Einheilkappe (transgingival)", "Cover Screw (subgingival)",
      "Kollagenvlies", "Nahtmaterial (5-0 resorbierbar)", "Bohrschablone (falls verwendet)",
      "Sterile Kochsalzlösung (Kühlung)",
    ],
  },
  {
    id: "IMPL_FREILEGUNG", name: "Implantatfreilegung / 2. Phase",
    beschreibung: "Chirurgische Freilegung eines subgingival eingeheilten Implantats und Einbringen des Gingivaformers",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "9010", billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "Keine GKV-Kassenleistung.",
    techniken: ["Punch-Technik (Stanzfreilegung)", "Krestaler Schnitt + Lappenbildung", "Apikaler Verschiebelappen", "Rollappen-Technik", "Einbringen Gingivaformer", "Wundnaht"],
    materialien: ["Gingivaformer (System-passend)", "Nahtmaterial (5-0)", "Kollagenvlies"],
  },
  {
    id: "IMPL_AUGMENTATION", name: "Knochenaugmentation / Sinuslift",
    beschreibung: "Aufbau des Kieferknochens. OP-Bericht: Augmentationstechnik, Material (ggf. Charge), Membranfixierung dokumentieren.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "9040", billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "Keine GKV-Kassenleistung.",
    techniken: [
      "Lateraler Sinuslift (Knochenfenster)", "Krestaler Sinuslift (transalveolär, Osteotome)",
      "GBR – Guided Bone Regeneration (Membrantechnik)",
      "Knochenblockentnahme (retromolar/Kinn)", "Knochenblockfixierung (Schrauben)",
      "Socket Preservation (Alveolarkammerhalt)", "Ridge Splitting / Bone Spreading",
      "PRF-/PRGF-Herstellung",
    ],
    materialien: [
      "Bio-Oss (bovines KEM, Granulat/Block)", "Cerabone (bovines KEM)",
      "Autogener Knochen (Bohrspäne/Block)", "Allogenes KEM (z.B. Maxgraft)",
      "Kollagenmembran resorbierbar (Bio-Gide/Jason)", "Titan-Mesh (nicht-resorbierbar)",
      "Titanschrauben/Pins (Membranfixierung)", "PRF-Membran",
      "Nahtmaterial (5-0/6-0 nicht-resorbierbar)",
    ],
  },
  {
    id: "IMPL_SOCKET_PRESERVATION", name: "Socket/Ridge Preservation",
    beschreibung: "Alveolarkammerhalt nach Extraktion zur Vorbereitung einer späteren Implantation",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "Keine GKV-Kassenleistung.",
    techniken: ["Atraumatische Extraktion", "Kürettage der Alveole", "Einbringen KEM", "Membranabdeckung", "Wundnaht (spannungsfrei)"],
    materialien: ["Bio-Oss Collagen (Plug)", "Kollagenmembran (Bio-Gide)", "Kollagenvlies", "Nahtmaterial (5-0)"],
  },
  {
    id: "IMPL_PERIIMPLANTITIS", name: "Periimplantitis-Therapie",
    beschreibung: "Behandlung einer Periimplantitis mit Dekontamination der Implantatoberfläche",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "Keine GKV-Kassenleistung.",
    techniken: [
      "Lappenbildung", "Mechanische Dekontamination (Titan-/Kunststoffküretten)",
      "Chemische Dekontamination (Citronensäure/H₂O₂)", "Air-Abrasion (Glycin-Pulver)",
      "Laser-Dekontamination (Er:YAG)", "Knochenaugmentation (falls indiziert)",
      "Wundnaht", "Implantatexplantation (falls nicht erhaltungswürdig)",
    ],
    materialien: ["CHX 0,2% (Spülung)", "Citronensäure 40%", "H₂O₂ 3%", "Knochenersatzmaterial", "Kollagenmembran", "Nahtmaterial"],
  },
  {
    id: "IMPL_BOHRSCHABLONE", name: "Navigierte Implantation / Bohrschablone",
    beschreibung: "Digitale Implantatplanung und schablonengeführte Insertion (backward planning)",
    subSteps: ["techniken", "notes"], billingUnit: "sitzung",
    nichtKassenleistung: true, gkvHinweis: "Keine GKV-Kassenleistung.",
    techniken: ["DICOM-Daten-Import (DVT/CBCT)", "STL-Daten (Intraoralscan/Modell)", "Digitale Planung (coDiagnostiX/Implant Studio)", "Schablonenfertigung (3D-Druck/gefräst)", "Schablonenverifikation am Modell"],
  },
];

// ===================== KFO =====================
const kfoOptions: TreatmentOption[] = [
  {
    id: "KFO_MODELLANALYSE", name: "Modellanalyse / KIG-Einstufung",
    beschreibung: "Diagnostische Modellanalyse, Platzanalyse und KIG-Einstufung (Kieferorthopädische Indikationsgruppen). GKV: Behandlung ab KIG 3.",
    subSteps: ["techniken", "notes"], gozNr: "6030", bemaNr: "119", billingUnit: "sitzung",
    techniken: [
      "Abformung OK/UK (Alginat/Silikon)", "Modellherstellung (Gips/digital)",
      "Platzanalyse nach Moyers", "Bolton-Analyse", "Vermessung der Stützzonen",
      "KIG-Einstufung (Grad 1–5)", "Fotodokumentation (intra-/extraoral)",
      "Kephalometrische Analyse (FRS-Auswertung)",
    ],
  },
  {
    id: "KFO_MULTIBAND", name: "Festsitzende Apparatur (Multiband)",
    beschreibung: "Eingliederung festsitzender kieferorthopädischer Apparatur – Brackets, Bänder, Initialbögen",
    subSteps: ["kieferauswahl", "techniken", "materialauswahl", "notes"], gozNr: "6100", bemaNr: "123a", billingUnit: "kiefer",
    techniken: [
      "Zahnreinigung/Prophylaxe", "Schmelzätzung (Phosphorsäure 37%)",
      "Direktes Kleben (Adhäsiv + Bracket)", "Indirektes Kleben (Transfer-Tray)",
      "Bandanpassung und Zementierung (Molar)", "Initialbogeeinbringen",
      "Ligierung (elastisch/metallisch)", "Okklusionskontrolle",
    ],
    materialien: [
      "Metallbrackets (konventionell)", "Keramikbrackets (ästhetisch)", "Selbstligierende Brackets (z.B. Damon)",
      "Lingualbrackets (z.B. Incognito)", "Bänder (Molarenregion)",
      "NiTi-Initialbögen (rund, .012/.014)", "Stahlbögen", "Elastische Ligaturen",
      "Glasionomerzement (Bandtzementierung)", "Bracket-Adhäsiv",
    ],
  },
  {
    id: "KFO_ALIGNER", name: "Aligner-Therapie",
    beschreibung: "Behandlung mit transparenten Schienen (z.B. Invisalign, CA Clear Aligner, SureSmile). Bei GKV nicht vorgesehen.",
    subSteps: ["kieferauswahl", "techniken", "notes"], billingUnit: "kiefer",
    nichtKassenleistung: true, gkvHinweis: "Aligner-Therapie ist keine GKV-Kassenleistung. Privatvereinbarung erforderlich.",
    techniken: [
      "Intraoralscan (digitale Abformung)", "ClinCheck/Behandlungsplanung digital",
      "Attachments kleben (Komposit)", "Aligner-Ausgabe (Sets)", "IPR (Interproximal Reduction/Stripping)",
      "Kontrolle und Tracking", "Overcorrection/Refinement-Scan",
    ],
  },
  {
    id: "KFO_FKO", name: "Funktionskieferorthopädie (FKO)",
    beschreibung: "Herausnehmbare funktionskieferorthopädische Apparatur (z.B. Bionator, Aktivator, Funktionsregler)",
    subSteps: ["kieferauswahl", "materialauswahl", "notes"], billingUnit: "kiefer",
    materialien: ["Bionator (Typ I/II/III)", "Aktivator", "Funktionsregler (Fränkel)", "Vorschubdoppelplatte (VDP)", "Elastisch offener Aktivator (EOA)"],
  },
  {
    id: "KFO_RETAINER", name: "Retainer",
    beschreibung: "Eingliederung eines Retainers zur Retention nach aktiver KFO-Behandlung",
    subSteps: ["kieferauswahl", "techniken", "materialauswahl", "notes"], billingUnit: "kiefer",
    techniken: ["Schmelzätzung (Phosphorsäure)", "Adhäsive Klebung", "Einpolymerisation (Komposit)", "Okklusionskontrolle"],
    materialien: ["Drahtretainer 3-3 (Wildcat/Respond)", "Drahtretainer 4-4", "Herausnehmbare Retentionsplatte", "Essix-Schiene (tiefgezogen)", "Komposit (Klebung)"],
  },
  {
    id: "KFO_DEBONDING", name: "Debonding / Entbänderung",
    beschreibung: "Entfernung der festsitzenden Apparatur nach Abschluss der aktiven Behandlung",
    subSteps: ["kieferauswahl", "techniken", "notes"], billingUnit: "kiefer",
    techniken: [
      "Bracket-Entfernung (Enthärtungszange)", "Band-Entfernung",
      "Adhäsivreste-Entfernung (Hartmetallfinierer/Arkansasstein)",
      "Politur der Zahnoberflächen", "Fluoridierung",
      "Abschluss-Fotodokumentation", "Retainer-Anpassung",
    ],
  },
  {
    id: "KFO_KONTROLLE", name: "KFO-Kontrolle / Bogenwechsel",
    beschreibung: "Regelmäßige Kontrolle, Bogenwechsel, Nachaktivierung, Gummizugkontrolle",
    subSteps: ["techniken", "notes"], gozNr: "7040", billingUnit: "sitzung",
    techniken: [
      "Bogenwechsel (NiTi → Stahl → Finishing)", "Ligaturenwechsel",
      "Gummizug-Anweisung (Klasse II/III/Kreuz)", "Bracket-Reparatur (Nachkleben)",
      "Kontrolle der Zahnbewegung", "Mundhygienekontrolle",
    ],
  },
];

// ===================== PAR =====================
const parOptions: TreatmentOption[] = [
  {
    id: "PAR_STATUS", name: "PAR-Befunderhebung",
    beschreibung: "Vollständiger Parodontalstatus: 6-Punkt-Sondierung aller Zähne, BOP, Rezession, Furkation, Mobilität, Attachmentverlust. Diagnose nach neuer PAR-Klassifikation (Grad/Stadium).",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "4000", bemaNr: "P200", billingUnit: "sitzung",
    techniken: [
      "6-Punkt-Sondierung (WHO/UNC-15-Sonde)", "BOP-Erhebung",
      "Rezessionsmessung", "Furkationssondierung (Nabers-Sonde)",
      "Mobilitätsprüfung (Grad 0–III)", "Röntgendiagnostik (Zahnfilmstatus/OPG)",
      "Foto-/Videodokumentation", "Diagnose nach PAR-Klassifikation 2018 (Stadium I–IV, Grad A–C)",
    ],
  },
  {
    id: "PAR_VORBEHANDLUNG", name: "PAR-Vorbehandlung (Zahnsteinentfernung + MHI)",
    beschreibung: "Vorbereitende Maßnahmen vor AIT: Supragingivale Zahnsteinentfernung, Mundhygieneinstruktion, ggf. Extraktion nicht erhaltungswürdiger Zähne",
    subSteps: ["zahnauswahl", "techniken", "notes"], bemaNr: "105", billingUnit: "sitzung",
    techniken: [
      "Supragingivale Zahnsteinentfernung (Ultraschall/Handinstrumente)",
      "Politur", "Mundhygieneinstruktion (MHI)",
      "Hilfsmittel-Demonstration (Zahnseide, Interdentalbürsten)",
      "Motivation zur häuslichen Mundhygiene",
    ],
  },
  {
    id: "PAR_AIT", name: "AIT – Antiinfektiöse Therapie (geschlossen)",
    beschreibung: "Subgingivale Instrumentierung / geschlossenes Debridement aller betroffenen Taschen (≥ 4mm). In der Regel in 1–2 Sitzungen innerhalb von 4 Wochen (Full-Mouth-Konzept).",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "4070", bemaNr: "4", billingUnit: "zahn",
    techniken: [
      "Handinstrumente (Gracey-Küretten, Universalküretten)",
      "Maschinelle Instrumentation (Ultraschall/Piezon mit schlanken Ansätzen)",
      "Schallscaler", "Subgingivaler Airflow (Perio-Flow, EMS Airflow mit Plus-Pulver)",
      "Laser-assistiert (Er:YAG-Laser)", "Full-Mouth-Disinfection (nach Quirynen)",
    ],
    materialien: [
      "CHX 0,2% Spülung (Taschenspülung)", "CHX-Gel subgingival",
      "Povidon-Iod (Betaisodona, Taschenspülung)", "NaCl 0,9% (Spülung)",
      "PerioChip (CHX-Chip)", "Ligosan Slow Release (Doxycyclin lokal)",
    ],
  },
  {
    id: "PAR_BEV", name: "BEV – Befundevaluation",
    beschreibung: "Reevaluation 3–6 Monate nach AIT. Erneute Sondierung und BOP-Erhebung. Entscheidung: UPT oder chirurgische Therapie (bei TT ≥ 6mm).",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "4000", bemaNr: "P200", billingUnit: "sitzung",
    techniken: [
      "Erneute 6-Punkt-Sondierung", "BOP-Erhebung", "Vergleich mit Ausgangsbefund",
      "Risikobewertung (Lang & Tonetti / PRA)", "Festlegung des UPT-Intervalls",
      "Indikationsstellung chirurgische Therapie (TT ≥ 6mm nach AIT)",
    ],
  },
  {
    id: "PAR_OFFEN", name: "Chirurgische PAR-Therapie (offene Kürettage / Lappenoperation)",
    beschreibung: "Offene Kürettage/Lappenoperation bei Resttaschen ≥ 6mm nach AIT + BEV. Nur nach Genehmigung durch Krankenkasse (bei GKV).",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "4075", bemaNr: "4b", billingUnit: "zahn",
    techniken: [
      "Mukoperiostlappen (Kirkland/Neumann)", "Modifizierter Widman-Lappen",
      "Debridement unter Sicht", "Wurzelglättung",
      "Resektive Therapie (Osteoektomie/Osteoplastik)", "Furkationsplastik",
      "Regenerative Therapie – GTR (Membrantechnik)",
      "Regenerative Therapie – Schmelzmatrixproteine (Emdogain)",
      "Knochenersatzmaterial einbringen", "Wundnaht (Einzelknopf/Matratzennähte)",
    ],
    materialien: [
      "Emdogain (Amelogenin)", "Kollagenmembran (Bio-Gide)", "Bio-Oss (Knochenersatzmaterial)",
      "Nahtmaterial (5-0/6-0 resorbierbar)", "CHX 0,2% (Spülung)",
    ],
  },
  {
    id: "PAR_UPT", name: "UPT – Unterstützende Parodontitistherapie",
    beschreibung: "Strukturierte Nachsorge nach systematischer PAR-Therapie. Intervall: 3–12 Monate (risikobasiert nach Lang & Tonetti). GKV: PAR-Richtlinie sieht UPT über 2 Jahre vor.",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "4070", bemaNr: "4", billingUnit: "zahn",
    techniken: [
      "Sondierung/BOP an Problemstellen", "Reinstruktion Mundhygiene",
      "Supragingivale Reinigung", "Subgingivale Instrumentierung (bei Bedarf)",
      "Politur", "Fluoridierung",
      "Risikobewertung / Intervall-Festlegung",
    ],
  },
];

// ===================== DIVERS =====================
const diversOptions: TreatmentOption[] = [
  {
    id: "DIVERS_ANAESTHESIE_INF", name: "Infiltrationsanästhesie",
    beschreibung: "Lokalanästhesie durch Infiltration (Depotanästhesie). Dokumentation: Wirkstoff, Menge, Injektionsstelle.",
    subSteps: ["zahnauswahl", "materialauswahl", "notes"], gozNr: "0070", bemaNr: "41a", billingUnit: "zahn",
    materialien: [
      "Ultracain D-S (Articain + Epinephrin 1:200.000)", "Ultracain D-S forte (Articain + Epinephrin 1:100.000)",
      "Scandonest 3% (Mepivacain, ohne Vasokonstriktor)", "Septanest (Articain + Epinephrin 1:100.000)",
      "Ubistesin (Articain + Epinephrin 1:200.000)", "Ubistesin forte (Articain + Epinephrin 1:100.000)",
    ],
  },
  {
    id: "DIVERS_ANAESTHESIE_LEIT", name: "Leitungsanästhesie",
    beschreibung: "Leitungsanästhesie (z.B. N. alveolaris inferior, N. lingualis, N. buccalis). Aspirationsprobe obligat!",
    subSteps: ["techniken", "materialauswahl", "notes"], gozNr: "0090", bemaNr: "41b", billingUnit: "sitzung",
    techniken: ["Leitungsanästhesie N. alveolaris inferior (Foramen mandibulae)", "N. buccalis (Wangenanästhesie)", "N. mentalis (Foramen mentale)", "Tuberanästhesie (N. alveolaris superior posterior)", "Infraorbitalanästhesie", "Gow-Gates-Technik", "Aspirationsprobe durchgeführt"],
    materialien: [
      "Ultracain D-S forte", "Scandonest 3% (ohne Vasokonstriktor)",
      "Septanest", "Ubistesin forte",
    ],
  },
  {
    id: "DIVERS_NOTFALL", name: "Notfallbehandlung / Schmerzfall",
    beschreibung: "Akutversorgung bei Schmerzen, Trauma, Schwellung. Dokumentation: Befund, Maßnahmen, Verlauf.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "0100", bemaNr: "03", billingUnit: "sitzung",
    techniken: [
      "Trepanation (Schmerzentlastung)", "Inzision/Drainage (Abszess)",
      "Schienung (Trauma, z.B. TTS-Schiene)", "Replantation (Avulsion)",
      "Provisorische Versorgung (Fraktur)", "Scharfe Kanten glätten",
      "Medikation (Analgetikum, Antibiotikum)", "Wundversorgung",
      "Überweisung/Einweisung (bei Komplikation)",
    ],
    materialien: [
      "Cavit/Fermit (provisorischer Verschluss)", "Antibiotikum (Rezept: z.B. Amoxicillin, Clindamycin)",
      "Analgetikum (Rezept: z.B. Ibuprofen 600)", "TTS-Schiene (Draht + Komposit)",
      "Tamponade (Gazestreifen)", "Kältekompresse",
    ],
  },
  {
    id: "DIVERS_NACHBEHANDLUNG", name: "Nachbehandlung / Kontrolle",
    beschreibung: "Nachbehandlung nach chirurgischem Eingriff: Wundkontrolle, Nahtentfernung, Beschwerdeabfrage.",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "0060", bemaNr: "NB", billingUnit: "sitzung",
    techniken: ["Wundkontrolle (Inspektion)", "Nahtentfernung", "Wundtoilette/Spülung", "Tamponade/Verband erneuert", "Röntgenkontrolle (bei Bedarf)", "Verhaltenshinweise erteilt"],
  },
  {
    id: "DIVERS_SCHIENUNG", name: "Schienung (Trauma/Parodontal)",
    beschreibung: "Fixierung gelockerter/subluxierter Zähne mittels Draht-Komposit-Schiene oder Titan-Trauma-Schiene",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], billingUnit: "zahn",
    techniken: ["Draht-Komposit-Schiene (TTS)", "Titan-Trauma-Schiene", "Glasfaserschiene", "Adhäsive Klebung", "Okklusionskontrolle"],
    materialien: ["TTS-Draht (Titan)", "Glasfaserverstärkter Draht (Ribbond)", "Komposit (Klebung)", "Phosphorsäure 37%", "Adhäsiv"],
  },
  {
    id: "DIVERS_BLEACHING", name: "Bleaching / Zahnaufhellung",
    beschreibung: "Professionelles Bleaching (In-Office oder Home-Bleaching mit individueller Schiene)",
    subSteps: ["techniken", "materialauswahl", "notes"], billingUnit: "sitzung",
    nichtKassenleistung: true, gkvHinweis: "Keine GKV-Kassenleistung. Rein kosmetische Leistung.",
    techniken: ["In-Office-Bleaching (H₂O₂-Gel + Lichtaktivierung)", "Home-Bleaching (individuelle Schiene)", "Walking-Bleach (internes Bleaching, devitaler Zahn)", "Gingivaprotektor aufgetragen"],
    materialien: ["Wasserstoffperoxid-Gel (35–40%)", "Carbamidperoxid-Gel (10–22%)", "Natriumperborat (internes Bleaching)", "Individuelle Bleaching-Schiene"],
  },
  {
    id: "DIVERS_BESCHEINIGUNG", name: "Bescheinigung / Attest",
    beschreibung: "Ausstellen einer zahnärztlichen Bescheinigung, Attest oder Gutachten",
    subSteps: ["notes"], billingUnit: "sitzung",
  },
  {
    id: "DIVERS_ROENTGEN", name: "Röntgenaufnahme (Einzelzahn)",
    beschreibung: "Röntgendiagnostik (periapikale Aufnahme). Rechtfertigende Indikation gemäß StrlSchV dokumentieren!",
    subSteps: ["zahnauswahl", "notes"], gozNr: "Ä5000", bemaNr: "Ä925a", billingUnit: "zahn",
  },
  {
    id: "DIVERS_MEDIKATION", name: "Medikamentöse Therapie / Rezept",
    beschreibung: "Verordnung von Medikamenten (Analgetika, Antibiotika, Antimykotika, Mundspülung)",
    subSteps: ["materialauswahl", "notes"], billingUnit: "sitzung",
    materialien: [
      "Amoxicillin 1000mg (3×tgl., 5–7 Tage)", "Clindamycin 600mg (3×tgl., 5–7 Tage)",
      "Metronidazol 400mg (3×tgl., 7 Tage)", "Ibuprofen 600mg (bei Bedarf, max. 3×tgl.)",
      "Paracetamol 500mg", "Nystatin Suspension (Antimykotikum)",
      "CHX 0,2% Mundspülung (2×tgl., 7 Tage)", "Meridol Mundspülung",
    ],
  },
];

// ===================== ZE =====================
const zeOptions: TreatmentOption[] = [
  {
    id: "ZE_KRONE", name: "Einzelzahnkrone",
    beschreibung: "Überkronung eines Zahnes. Workflow: Präparation → Abformung → Provisorium → Einprobe → definitive Eingliederung. Bei GKV: Abrechnung über HKP/Festzuschuss.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "5000", bemaNr: "20a", billingUnit: "zahn",
    gkvHinweis: "Bei GKV: HKP-Genehmigung vor Behandlung erforderlich. Regelversorgung: Metall im Seitenzahnbereich, Teilverblendung im Sichtbereich. Gleichartig/andersartig = Mehrkostenvereinbarung.",
    techniken: [
      "Präparation (Hohlkehle/Stufe/Tangential)", "Gingivamanagement (Retraktionsfaden/Paste)",
      "Konventionelle Abformung (Doppelmisch/Korrektur)", "Digitale Abformung (Intraoralscan)",
      "Bissregistrat/Kieferrelation", "Provisoriumherstellung (direkt, Bis-Acryl/PMMA)",
      "Stumpfaufbau (falls erforderlich)", "Gerüsteinprobe (bei VMK/Zirkon)",
      "Rohbrandeinprobe/Bissprobe", "Definitive Eingliederung",
      "Adhäsive Befestigung (bei Vollkeramik)", "Konventionelle Zementierung (GIZ/Phosphatzement)",
      "Okklusionseinstellung (statisch + dynamisch)",
    ],
    materialien: [
      "Vollkeramik – Zirkonoxid (monolithisch/verblendet)", "Vollkeramik – Lithiumdisilikat (e.max Press/CAD)",
      "VMK (Verblend-Metall-Keramik)", "Vollgusskrone (NEM/Gold)",
      "Provisorischer Zement (TempBond/Freegenol)", "Glasionomerzement (definitiv, z.B. Ketac Cem)",
      "Adhäsivzement (RelyX Unicem/Panavia)", "Retraktionsfaden (Ultrapak)",
      "Abformmaterial (Impregum/Aquasil/Alginat)",
    ],
  },
  {
    id: "ZE_BRUECKE", name: "Brücke (festsitzend)",
    beschreibung: "Festsitzende Brückenversorgung. Mindestens 2 Pfeilerzähne + Brückenglied(er). Bei GKV: HKP-Genehmigung erforderlich.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "5040", bemaNr: "20a", billingUnit: "zahn",
    gkvHinweis: "Bei GKV: Abrechnung über HKP/Festzuschuss. Befundklassen beachten!",
    techniken: [
      "Präparation Pfeilerzähne", "Gingivamanagement (Retraktionsfaden)",
      "Konventionelle Abformung", "Digitale Abformung (Intraoralscan)",
      "Kieferrelationsbestimmung (Bissgabel/Registrat)", "Provisorische Versorgung (Brücken-Provisorium)",
      "Gerüsteinprobe", "Rohbrandeinprobe", "Definitive Eingliederung/Zementierung",
      "Okklusionseinstellung",
    ],
    materialien: [
      "Vollkeramik – Zirkonoxid", "VMK (Verblend-Metall-Keramik)", "Vollguß (NEM/Gold)",
      "Provisorisches Material (Bis-Acryl)", "Zement (GIZ/Adhäsiv)",
      "Abformmaterial", "Retraktionsfaden",
    ],
  },
  {
    id: "ZE_INLAY_ONLAY", name: "Inlay / Onlay / Overlay",
    beschreibung: "Indirekte laborgefertigte Restauration (Keramik/Gold/Komposit). Minimalinvasiver festsitzender Zahnersatz.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "5000", billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "Inlays/Onlays sind keine GKV-Regelversorgung. Privatvereinbarung erforderlich.",
    techniken: [
      "Kavitätenpräparation (Inlay-/Onlay-Design)", "Konventionelle Abformung (Doppelmisch)",
      "Digitale Abformung (Chairside CAD/CAM möglich)", "Provisorische Versorgung",
      "Einprobe und Anpassung", "Adhäsive Befestigung (obligat bei Keramik)",
      "Ausarbeitung/Politur", "Okklusionskontrolle",
    ],
    materialien: [
      "Keramik – Lithiumdisilikat (e.max, gepresst/gefräst)", "Keramik – Feldspatkeramik",
      "CAD/CAM-Komposit (z.B. Lava Ultimate)", "Goldinlay/-onlay",
      "Adhäsivzement (Variolink/Multilink)", "Universaladhäsiv", "Phosphorsäure 37%",
    ],
  },
  {
    id: "ZE_TEILPROTHESE", name: "Teilprothese (herausnehmbar)",
    beschreibung: "Herausnehmbarer Zahnersatz: Modellgussgerüst, Teleskopprothese, Klammerprothese oder Geschiebeprothese. Bei GKV: HKP erforderlich.",
    subSteps: ["kieferauswahl", "techniken", "materialauswahl", "notes"], billingUnit: "kiefer",
    techniken: [
      "Situationsabformung (Alginat)", "Funktionsabformung (Individuallöffel + Silikon/Polyether)",
      "Kieferrelationsbestimmung (Wachswall/Bissgabel)", "Bissregistrat",
      "Einprobe Metallgerüst", "Wachsanprobe (Zahnaufstellung)",
      "Eingliederung und Einschleifen", "Remontage (falls erforderlich)",
      "Mundhygieneinstruktion (Prothesenreinigung)", "Druckstellenkontrolle",
    ],
    materialien: [
      "Modellguss (CoCr-Legierung)", "Klammerprothese (NEM)",
      "Teleskopprothese (Primär-/Sekundärkronen)", "Geschiebeprothese",
      "PEEK-Gerüst", "Prothesenkunststoff (PMMA)", "Konfektions-/Garniturezhähne",
    ],
  },
  {
    id: "ZE_TOTALPROTHESE", name: "Totalprothese (Vollprothese)",
    beschreibung: "Vollständiger herausnehmbarer Zahnersatz im zahnlosen Kiefer. Bei GKV: HKP erforderlich.",
    subSteps: ["kieferauswahl", "techniken", "notes"], billingUnit: "kiefer",
    techniken: [
      "Situationsabformung (Alginat)", "Funktionsabformung (Individuallöffel + Polyether/Silikon)",
      "Kieferrelationsbestimmung (Biss-Schablone)", "Gesichtsbogenübertragung",
      "Wachsanprobe (Ästhetik + Phonetik + Funktion)", "Einprobe (ggf. zweite Anprobe)",
      "Eingliederung und Einschleifen", "Remontage",
      "Druckstellenkontrolle", "Prothesenrandbiss",
    ],
  },
  {
    id: "ZE_VENEER", name: "Veneer (Verblendschale)",
    beschreibung: "Laborgefertigte oder chairside-gefertigte Verblendschale (Keramik/Komposit). Minimalinvasive ästhetische Versorgung.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "5000", billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "Veneers sind keine GKV-Kassenleistung. Privatvereinbarung erforderlich.",
    techniken: [
      "Minimalinvasive Präparation (Fensterpräparation/Non-Prep)", "Gingivamanagement",
      "Abformung (konventionell/digital)", "Farbbestimmung (Vita-Farbring/digitale Farbmessung)",
      "Provisorium (Spot-Etch-Technik)", "Einprobe (Try-In-Paste)",
      "Adhäsive Befestigung (Etch-and-Rinse + lichthärtender Befestigungskomposit)",
      "Randfiniur und Politur", "Okklusionskontrolle",
    ],
    materialien: [
      "Lithiumdisilikat (e.max Press/CAD)", "Feldspatkeramik (geschichtet)",
      "Komposit-Veneer (direkt/indirekt)", "Befestigungskomposit (Variolink Esthetic)",
      "Try-In-Paste", "Universaladhäsiv", "Phosphorsäure 37%",
    ],
  },
  {
    id: "ZE_PROVISORIUM", name: "Langzeitprovisorium",
    beschreibung: "Herstellung eines Langzeitprovisoriums (mehrere Monate Tragezeit) bei größerer prothetischer Planung",
    subSteps: ["zahnauswahl", "materialauswahl", "notes"], billingUnit: "zahn",
    materialien: [
      "PMMA gefräst (CAD/CAM-Provisorium)", "Bis-Acryl (Protemp)",
      "Laborprovisorium (Vakuumschiene + Autopolymerisat)",
      "Provisorischer Zement (TempBond NE)", "Eugenolfreier Zement",
    ],
  },
  {
    id: "ZE_IMPLANTAT_PROTHETIK", name: "Implantatprothetik (Suprakonstruktion)",
    beschreibung: "Prothetische Versorgung auf Implantaten: Einzelkrone, Brücke, Steg, Locator. Abutment-Auswahl und -Anpassung.",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "5000", billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "Implantatgetragener Zahnersatz: Festzuschüsse werden gewährt, Restkosten sind Eigenanteil (§55 SGB V).",
    techniken: [
      "Abformung (offen/geschlossene Abformpfosten)", "Digitale Abformung (Scanbody)",
      "Abutment-Auswahl (Standard/individuell/Scan)", "Bissregistrat auf Implantatniveau",
      "Gerüsteinprobe", "Einprobe (ggf. Wachsanprobe)", "Definitive Befestigung (verschraubt/zementiert)",
      "Okklusionseinstellung", "Verschlussschraube/Zugangsloch-Verschluss",
    ],
    materialien: [
      "Titan-Abutment (Standard/individuell)", "Zirkon-Abutment (individuell/CAD/CAM)",
      "Verschraubte Krone (Zirkon/Titan)", "Zementierte Krone (Lithiumdisilikat/Zirkon)",
      "Locator-Attachments", "Stegkonstruktion", "Provisorischer Zement / Befestigungsschraube",
    ],
  },
  {
    id: "ZE_REPARATUR", name: "Reparatur / Unterfütterung Zahnersatz",
    beschreibung: "Reparatur (Bruch, Zahn-, Klammerzusatz) oder Unterfütterung von bestehendem herausnehmbarem Zahnersatz",
    subSteps: ["techniken", "materialauswahl", "notes"], gozNr: "5070", bemaNr: "25", billingUnit: "sitzung",
    techniken: [
      "Bruchreparatur (Kaltpolymerisat)", "Zahnzusatz (neuer Zahn an Prothese)",
      "Klammerzusatz/-erneuerung", "Direkte Unterfütterung (Chairside, hart)",
      "Direkte Unterfütterung (Chairside, weich)", "Indirekte Unterfütterung (Labor)",
      "Funktionsabformung in der Prothese", "Einschleifen/Okklusionskorrektur",
    ],
    materialien: [
      "Kaltpolymerisat (Autopolymerisat)", "Unterfütterungsmaterial hart (GC Reline)",
      "Unterfütterungsmaterial weich (Coe-Comfort/Visco-gel)", "Prothesenkunststoff",
      "Konfektionszahn (Ersatz)", "Drahtklammer (NEM)",
    ],
  },
];

// ===================== LOOKUP =====================

const categoryOptionsMap: Record<string, TreatmentOption[]> = {
  DIAG: diagOptions,
  CHIR: chirOptions,
  ENDO: endoOptions,
  FUELL: fuellOptions,
  IMPL: implOptions,
  KFO: kfoOptions,
  PAR: parOptions,
  PROPHY: prophyOptions,
  DIVERS: diversOptions,
  ZE: zeOptions,
};

export function getCategoryOptions(categoryId: string): TreatmentOption[] {
  return categoryOptionsMap[categoryId] || [];
}

export function getCategoryLabel(categoryId: string): string {
  const labels: Record<string, string> = {
    DIAG: "Diagnostik / Untersuchung",
    CHIR: "Chirurgie",
    ENDO: "Endodontie",
    FUELL: "Füllung / Restauration",
    IMPL: "Implantologie",
    KFO: "Kieferorthopädie",
    PAR: "Parodontologie",
    PROPHY: "Prophylaxe",
    DIVERS: "Sonstiges / Begleitleistungen",
    ZE: "Zahnersatz / Prothetik",
  };
  return labels[categoryId] || categoryId;
}

/** Get material options for a treatment option - checks embedded materialien first, then legacy PROPHY fallbacks */
export function getMaterialsForOption(option: TreatmentOption): string[] {
  if (option.materialien && option.materialien.length > 0) return option.materialien;
  // Legacy PROPHY fallbacks
  switch (option.id) {
    case "MUNDSPUELUNG": return mundspuelungMaterialien;
    case "SCHLEIMHAUT": return schleimhautMaterialien;
    case "FLUORID_SCHIENE": return fluoridierungMaterialien;
    case "UEBEREMPFINDLICH": return ueberempfindlichMaterialien;
    case "SUBGINGIVAL": return subgingivalMaterialien;
    case "MMP8": return ["MMP-8 Testkit (Verbrauchsmaterial)"];
    case "SCHARFE_KANTEN": return ["Finierstreifen", "Polierer (Kelch/Bürste)", "Diamantbohrer (fein)"];
    default: return [];
  }
}

/** Get techniken for a treatment option - checks embedded techniken first, then legacy PROPHY fallbacks */
export function getTechnikenForOption(option: TreatmentOption): string[] {
  if (option.techniken && option.techniken.length > 0) return option.techniken;
  // Legacy PROPHY fallbacks
  switch (option.id) {
    case "PZR": return pzrTechniken;
    case "SCHLEIMHAUT": return schleimhautTechniken;
    default: return [];
  }
}
