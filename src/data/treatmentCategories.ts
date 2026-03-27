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
    beschreibung: "Feststellung von Zahn-, Mund- und Kiefererkrankungen inkl. Parodontalbefund",
    subSteps: ["notes"], gozNr: "0010", bemaNr: "01", billingUnit: "sitzung",
  },
  {
    id: "DIAG_BERATUNG", name: "Beratung",
    beschreibung: "Eingehende Beratung – auch mittels Fernsprecher",
    subSteps: ["notes"], gozNr: "Ä1", bemaNr: "Ä1", billingUnit: "sitzung",
  },
  {
    id: "DIAG_PSI", name: "PSI-Erhebung",
    beschreibung: "Erhebung des Parodontalen Screening Index (mindestens 1 Index)",
    subSteps: ["notes"], gozNr: "4005", bemaNr: "04", billingUnit: "sitzung",
  },
  {
    id: "DIAG_PARSTATUS", name: "Parodontalstatus",
    beschreibung: "Erstellen und dokumentieren eines Parodontalstatus",
    subSteps: ["notes"], gozNr: "4000", bemaNr: "P200", billingUnit: "sitzung",
  },
  {
    id: "DIAG_ROENTGEN", name: "Röntgen Einzelzahn",
    beschreibung: "Röntgenaufnahme je Projektion (Strahlenschutz-Indikation beachten)",
    subSteps: ["zahnauswahl", "notes"], gozNr: "Ä5000", bemaNr: "Ä925a", billingUnit: "zahn",
  },
  {
    id: "DIAG_OPG", name: "Panoramaschichtaufnahme (OPG)",
    beschreibung: "Panoramaschichtaufnahme der Kiefer",
    subSteps: ["notes"], gozNr: "Ä5004", bemaNr: "Ä935d", billingUnit: "sitzung",
  },
  {
    id: "DIAG_FOTO", name: "Fotodokumentation",
    beschreibung: "Fotodokumentation zu diagnostischen und/oder therapeutischen Zwecken",
    subSteps: ["notes"], gozNr: "6000m", billingUnit: "sitzung",
  },
];

// ===================== CHIR =====================
const chirOptions: TreatmentOption[] = [
  {
    id: "CHIR_EXTRAKTION_EIN", name: "Extraktion (einwurzelig)",
    beschreibung: "Entfernung eines einwurzeligen Zahnes oder Wurzelrestes",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "3000", bemaNr: "X1", billingUnit: "zahn",
    techniken: ["Zangenextraktion", "Hebelung", "Luxation"],
  },
  {
    id: "CHIR_EXTRAKTION_MEHR", name: "Extraktion (mehrwurzelig)",
    beschreibung: "Entfernung eines mehrwurzeligen Zahnes",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "3010", bemaNr: "X2", billingUnit: "zahn",
    techniken: ["Zangenextraktion", "Hebelung", "Wurzeltrennung", "Luxation"],
  },
  {
    id: "CHIR_OSTEOTOMIE_EIN", name: "Osteotomie (einwurzelig)",
    beschreibung: "Operative Entfernung einwurzeliger Zahn/Wurzel mit Knochenabtragung",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "3020", bemaNr: "Ost1", billingUnit: "zahn",
    techniken: ["Mukoperiostlappen", "Osteotomie mit Bohrer", "Osteotomie mit Meißel", "Wundnaht"],
    materialien: ["Kollagenvlies", "Knochenersatzmaterial", "Resorbierbare Membran", "Nahtmaterial"],
  },
  {
    id: "CHIR_OSTEOTOMIE_MEHR", name: "Osteotomie (mehrwurzelig)",
    beschreibung: "Operative Entfernung mehrwurzeliger Zahn mit Knochenabtragung",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "3030", bemaNr: "Ost2", billingUnit: "zahn",
    techniken: ["Mukoperiostlappen", "Osteotomie mit Bohrer", "Wurzeltrennung", "Wundnaht"],
    materialien: ["Kollagenvlies", "Knochenersatzmaterial", "Resorbierbare Membran", "Nahtmaterial"],
  },
  {
    id: "CHIR_WSR", name: "Wurzelspitzenresektion (WSR)",
    beschreibung: "Resektion der Wurzelspitze eines einwurzeligen Zahnes",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "3110", bemaNr: "WR", billingUnit: "zahn",
    techniken: ["Mukoperiostlappen", "Resektion mit Bohrer", "Retrograde Füllung", "Wundnaht", "Mikroskop-assistiert"],
    materialien: ["MTA (Mineral Trioxide Aggregate)", "SuperEBA", "Kollagenvlies", "Nahtmaterial"],
  },
  {
    id: "CHIR_HEMISEKTION", name: "Hemisektion / Prämolarisierung",
    beschreibung: "Durchtrennung eines mehrwurzeligen Zahnes",
    subSteps: ["zahnauswahl", "notes"], gozNr: "3040", bemaNr: "56a", billingUnit: "zahn",
  },
  {
    id: "CHIR_PLASTISCHER_VERSCHLUSS", name: "Plastischer Verschluss / Wundnaht",
    beschreibung: "Plastischer Verschluss einer eröffneten Kieferhöhle oder Wundnaht",
    subSteps: ["zahnauswahl", "materialauswahl", "notes"], gozNr: "3100", bemaNr: "48", billingUnit: "zahn",
    materialien: ["Nahtmaterial resorbierbar", "Nahtmaterial nicht-resorbierbar", "Kollagenvlies"],
  },
  {
    id: "CHIR_INZISION", name: "Inzision / Drainage",
    beschreibung: "Inzision eines Abszesses oder Drainage",
    subSteps: ["zahnauswahl", "notes"], gozNr: "3070", bemaNr: "47a", billingUnit: "zahn",
  },
];

// ===================== ENDO =====================
const endoOptions: TreatmentOption[] = [
  {
    id: "ENDO_TREPANATION", name: "Trepanation / Eröffnung",
    beschreibung: "Eröffnung der Pulpakammer zur Aufbereitung",
    subSteps: ["zahnauswahl", "notes"], gozNr: "2330", bemaNr: "Trep", billingUnit: "zahn",
  },
  {
    id: "ENDO_AUFBEREITUNG_EIN", name: "WK-Aufbereitung (1 Kanal)",
    beschreibung: "Aufbereitung eines Wurzelkanals bei einwurzeligem Zahn",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2340", bemaNr: "WK", billingUnit: "zahn",
    techniken: ["Maschinelle Aufbereitung (NiTi-Feilen)", "Manuelle Aufbereitung", "Reziproktechnik", "Ultraschallaktivierte Spülung", "Endometrie (elektr. Längenbestimmung)", "Mikroskop-assistiert"],
    materialien: ["NaOCl (Natriumhypochlorit) 3%", "NaOCl 5,25%", "EDTA 17%", "CHX 2%", "Calciumhydroxid-Einlage", "Guttapercha-Stifte", "AH Plus Sealer"],
  },
  {
    id: "ENDO_AUFBEREITUNG_MEHR", name: "WK-Aufbereitung (mehrere Kanäle)",
    beschreibung: "Aufbereitung bei mehrwurzeligem Zahn (je Kanal)",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2350", bemaNr: "WK2", billingUnit: "zahn",
    techniken: ["Maschinelle Aufbereitung (NiTi-Feilen)", "Manuelle Aufbereitung", "Reziproktechnik", "Ultraschallaktivierte Spülung", "Endometrie (elektr. Längenbestimmung)", "Mikroskop-assistiert"],
    materialien: ["NaOCl (Natriumhypochlorit) 3%", "NaOCl 5,25%", "EDTA 17%", "CHX 2%", "Calciumhydroxid-Einlage", "Guttapercha-Stifte", "AH Plus Sealer"],
  },
  {
    id: "ENDO_FUELLUNG", name: "Wurzelkanalfüllung",
    beschreibung: "Füllung eines oder mehrerer aufbereiteter Wurzelkanäle",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2400", bemaNr: "WF", billingUnit: "zahn",
    techniken: ["Laterale Kondensation", "Vertikale Kondensation (warm)", "Single-Cone-Technik", "Thermoplastische Obturation"],
    materialien: ["Guttapercha-Stifte", "AH Plus Sealer", "BioRoot RCS", "MTA", "Thermafil-Obturatoren"],
  },
  {
    id: "ENDO_REVISION", name: "WK-Revision",
    beschreibung: "Revision einer Wurzelkanalfüllung",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2410", billingUnit: "zahn",
    techniken: ["Entfernung alter Füllung", "Maschinelle Re-Aufbereitung", "Ultraschall", "Mikroskop-assistiert", "Stift-/Aufbauentfernung"],
    materialien: ["NaOCl 3%", "EDTA 17%", "Calciumhydroxid-Einlage", "Guttapercha", "AH Plus Sealer"],
  },
  {
    id: "ENDO_EINLAGE", name: "Medikamentöse Einlage",
    beschreibung: "Einbringen einer medikamentösen Einlage in den Wurzelkanal",
    subSteps: ["zahnauswahl", "materialauswahl", "notes"], gozNr: "2390", bemaNr: "Med", billingUnit: "zahn",
    materialien: ["Calciumhydroxid (Calxyl)", "Ledermix", "CHX-Gel", "MTA"],
  },
];

// ===================== FÜLL =====================
const fuellOptions: TreatmentOption[] = [
  {
    id: "FUELL_KOMPOSIT_1", name: "Kompositfüllung (einflächig)",
    beschreibung: "Direkte Kompositfüllung, einflächig",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2050", bemaNr: "13a", billingUnit: "zahn",
    gkvHinweis: "Seitenzahn: Amalgam ist Kassenleistung. Für Komposit im Seitenzahnbereich ist eine Mehrkostenvereinbarung (§28 SGB V) erforderlich.",
    techniken: ["Säure-Ätz-Technik", "Adhäsivtechnik (Etch & Rinse)", "Adhäsivtechnik (Self-Etch)", "Schichtung", "Matrizentechnik"],
    materialien: ["Nano-Hybrid-Komposit", "Bulk-Fill-Komposit", "Flow-Komposit", "Universaladhäsiv", "Phosphorsäure 37%"],
  },
  {
    id: "FUELL_KOMPOSIT_2", name: "Kompositfüllung (zweiflächig)",
    beschreibung: "Direkte Kompositfüllung, zweiflächig",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2060", bemaNr: "13b", billingUnit: "zahn",
    gkvHinweis: "Seitenzahn: Für Komposit ggf. Mehrkostenvereinbarung (§28 SGB V) erforderlich.",
    techniken: ["Säure-Ätz-Technik", "Adhäsivtechnik (Etch & Rinse)", "Adhäsivtechnik (Self-Etch)", "Schichtung", "Matrizentechnik", "Keilsetzung"],
    materialien: ["Nano-Hybrid-Komposit", "Bulk-Fill-Komposit", "Flow-Komposit", "Universaladhäsiv", "Phosphorsäure 37%", "Teilmatrizenband"],
  },
  {
    id: "FUELL_KOMPOSIT_3PLUS", name: "Kompositfüllung (drei- oder mehrflächig)",
    beschreibung: "Direkte Kompositfüllung, drei- oder mehrflächig",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "2080", bemaNr: "13c", billingUnit: "zahn",
    gkvHinweis: "Seitenzahn: Für Komposit ggf. Mehrkostenvereinbarung (§28 SGB V) erforderlich.",
    techniken: ["Säure-Ätz-Technik", "Adhäsivtechnik", "Mehrfach-Schichtung", "Matrizentechnik", "Keilsetzung", "Anatomische Modellation"],
    materialien: ["Nano-Hybrid-Komposit", "Bulk-Fill-Komposit", "Flow-Komposit", "Universaladhäsiv", "Phosphorsäure 37%", "Teilmatrizenband", "Zirkularmatrize"],
  },
  {
    id: "FUELL_GIZ", name: "Glasionomerzement-Füllung",
    beschreibung: "Füllung mit Glasionomerzement (z.B. Klasse V, provisorisch)",
    subSteps: ["zahnauswahl", "notes"], gozNr: "2050", bemaNr: "13a", billingUnit: "zahn",
  },
  {
    id: "FUELL_PROVISORISCH", name: "Provisorische Füllung",
    beschreibung: "Provisorischer Verschluss einer Kavität",
    subSteps: ["zahnauswahl", "materialauswahl", "notes"], gozNr: "2050", bemaNr: "13a", billingUnit: "zahn",
    materialien: ["Cavit", "Fermit", "Ketac Cem", "IRM (Intermediate Restorative Material)"],
  },
  {
    id: "FUELL_UNTERFUELLUNG", name: "Unterfüllung / Aufbau",
    beschreibung: "Unterfüllung, Stiftaufbau oder plastischer Aufbau",
    subSteps: ["zahnauswahl", "materialauswahl", "notes"], gozNr: "2120", billingUnit: "zahn",
    materialien: ["Glasionomerzement", "Calciumhydroxid-Liner", "Flow-Komposit", "Kompomer", "Stift (Glasfaser)"],
  },
  {
    id: "FUELL_ADHAESIV", name: "Adhäsivtechnik (Zuschlag)",
    beschreibung: "Adhäsive Befestigung als Zuschlagsposition",
    subSteps: ["zahnauswahl", "notes"], gozNr: "2100", billingUnit: "zahn",
  },
];

// ===================== IMPL =====================
const implOptions: TreatmentOption[] = [
  {
    id: "IMPL_INSERTION", name: "Implantatinsertion",
    beschreibung: "Einbringen eines enossalen Implantats inkl. OP-Protokoll und Chargendoku",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "9000", billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "Implantologie ist grundsätzlich keine GKV-Kassenleistung (Ausnahmeindikationen gem. §28 SGB V beachten).",
    techniken: ["Lappenbildung", "Pilotbohrung", "Stufenbohrung", "Schablonengeführte Insertion", "Freihand-Insertion", "Wundnaht"],
    materialien: ["Titanimplantat", "Keramikimplantat (Zirkonoxid)", "Einheilkappe", "Kollagenvlies", "Nahtmaterial", "Bohrschablone"],
  },
  {
    id: "IMPL_FREILEGUNG", name: "Implantatfreilegung",
    beschreibung: "Chirurgische Freilegung eines subgingival eingeheilten Implantats",
    subSteps: ["zahnauswahl", "notes"], gozNr: "9010", billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "Keine GKV-Kassenleistung.",
  },
  {
    id: "IMPL_AUGMENTATION", name: "Knochenaugmentation / Sinuslift",
    beschreibung: "Aufbau/Augmentation des Kieferknochens (lateral/krestal)",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "9040", billingUnit: "zahn",
    nichtKassenleistung: true, gkvHinweis: "Keine GKV-Kassenleistung.",
    techniken: ["Lateraler Sinuslift", "Krestaler Sinuslift", "GBR (Guided Bone Regeneration)", "Blocktransplantat", "Socket Preservation"],
    materialien: ["Bio-Oss (bovines KEM)", "Cerabone", "Eigenknochen", "Kollagenmembran (Bio-Gide)", "Titan-Mesh", "Titanschrauben", "PRF-Membran"],
  },
  {
    id: "IMPL_BOHRSCHABLONE", name: "Bohrschablone",
    beschreibung: "Erstellung/Verwendung einer navigierten Bohrschablone",
    subSteps: ["notes"], billingUnit: "sitzung",
  },
];

// ===================== KFO =====================
const kfoOptions: TreatmentOption[] = [
  {
    id: "KFO_MODELLANALYSE", name: "Modellanalyse / KIG-Einstufung",
    beschreibung: "Modellanalyse und KIG-Einstufung dokumentieren",
    subSteps: ["notes"], gozNr: "6030", bemaNr: "119", billingUnit: "sitzung",
  },
  {
    id: "KFO_MULTIBAND", name: "Festsitzende Apparatur (Multiband)",
    beschreibung: "Eingliederung festsitzender kieferorthopädischer Apparatur",
    subSteps: ["kieferauswahl", "materialauswahl", "notes"], gozNr: "6100", bemaNr: "123a", billingUnit: "kiefer",
    materialien: ["Metallbrackets", "Keramikbrackets", "Selbstligierende Brackets", "Lingualbrackets", "Bögen (NiTi/Stahl)", "Bänder"],
  },
  {
    id: "KFO_ALIGNER", name: "Aligner-Therapie",
    beschreibung: "Behandlung mit transparenten Schienen (z.B. Invisalign)",
    subSteps: ["kieferauswahl", "notes"], billingUnit: "kiefer",
  },
  {
    id: "KFO_RETAINER", name: "Retainer",
    beschreibung: "Eingliederung eines Retainers zur Retention",
    subSteps: ["kieferauswahl", "materialauswahl", "notes"], billingUnit: "kiefer",
    materialien: ["Drahtretainer (3-3)", "Drahtretainer (4-4)", "Herausnehmbarer Retainer", "Essix-Schiene"],
  },
  {
    id: "KFO_KONTROLLE", name: "KFO-Kontrolle / Bogenwechsel",
    beschreibung: "Kontrolle und ggf. Bogenwechsel oder Nachstellung",
    subSteps: ["notes"], gozNr: "7040", billingUnit: "sitzung",
  },
];

// ===================== PAR =====================
const parOptions: TreatmentOption[] = [
  {
    id: "PAR_STATUS", name: "PAR-Status erfassen",
    beschreibung: "Sondierung, BOP, Diagnose, Grad/Stadium dokumentieren",
    subSteps: ["zahnauswahl", "notes"], gozNr: "4000", bemaNr: "P200", billingUnit: "sitzung",
  },
  {
    id: "PAR_AIT", name: "Geschlossene Kürettage (AIT)",
    beschreibung: "Antiinfektiöse Therapie / geschlossenes subgingivales Debridement",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "4070", bemaNr: "4", billingUnit: "zahn",
    techniken: ["Handinstrumente (Gracey-Küretten)", "Ultraschall (Piezon)", "Schallscaler", "Laser-assistiert (Er:YAG)", "Subgingivaler Airflow (Perio-Flow)"],
    materialien: ["CHX 0,2% Spülung", "CHX-Gel subgingival", "Povidon-Iod", "PerioChip", "Ligosan"],
  },
  {
    id: "PAR_OFFEN", name: "Offene Kürettage / Lappenoperation",
    beschreibung: "Chirurgische PAR-Therapie mit Lappenbildung",
    subSteps: ["zahnauswahl", "techniken", "materialauswahl", "notes"], gozNr: "4075", bemaNr: "4b", billingUnit: "zahn",
    techniken: ["Mukoperiostlappen", "Modifizierter Widman-Lappen", "Resektive Therapie", "Regenerative Therapie (GTR)", "Schmelz-Matrix-Proteine (Emdogain)"],
    materialien: ["Emdogain", "Kollagenmembran", "Bio-Oss", "Nahtmaterial", "CHX-Spülung"],
  },
  {
    id: "PAR_UPT", name: "UPT (Unterstützende PAR-Therapie)",
    beschreibung: "Recall/Nachsorge mit subgingivalem Debridement",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "4070", bemaNr: "4", billingUnit: "zahn",
    techniken: ["Handinstrumente", "Ultraschall", "Subgingivaler Airflow", "Politur"],
  },
  {
    id: "PAR_BEV", name: "BEV / Reevaluation",
    beschreibung: "Befundevaluation nach antiinfektiöser Therapie",
    subSteps: ["zahnauswahl", "notes"], gozNr: "4000", bemaNr: "P200", billingUnit: "sitzung",
  },
];

// ===================== DIVERS =====================
const diversOptions: TreatmentOption[] = [
  {
    id: "DIVERS_ANAESTHESIE_INF", name: "Infiltrationsanästhesie",
    beschreibung: "Lokalanästhesie durch Infiltration",
    subSteps: ["zahnauswahl", "materialauswahl", "notes"], gozNr: "0070", bemaNr: "41a", billingUnit: "zahn",
    materialien: ["Ultracain D-S", "Ultracain D-S forte", "Scandonest 3%", "Septanest", "Ubistesin"],
  },
  {
    id: "DIVERS_ANAESTHESIE_LEIT", name: "Leitungsanästhesie",
    beschreibung: "Leitungsanästhesie (z.B. N. alveolaris inferior)",
    subSteps: ["materialauswahl", "notes"], gozNr: "0090", bemaNr: "41b", billingUnit: "sitzung",
    materialien: ["Ultracain D-S forte", "Scandonest 3%", "Septanest", "Ubistesin"],
  },
  {
    id: "DIVERS_NOTFALL", name: "Notfallbehandlung",
    beschreibung: "Akutversorgung bei Schmerzen, Trauma oder Schwellung",
    subSteps: ["zahnauswahl", "techniken", "notes"], gozNr: "0100", bemaNr: "03", billingUnit: "sitzung",
    techniken: ["Trepanation", "Inzision/Drainage", "Schienung", "Provisorische Versorgung", "Medikation", "Wundversorgung"],
  },
  {
    id: "DIVERS_NACHBEHANDLUNG", name: "Nachbehandlung / Kontrolle",
    beschreibung: "Kontrolle, Nahtentfernung, Recall",
    subSteps: ["zahnauswahl", "notes"], gozNr: "0060", bemaNr: "NB", billingUnit: "sitzung",
  },
  {
    id: "DIVERS_BESCHEINIGUNG", name: "Bescheinigung / Attest",
    beschreibung: "Ausstellen einer Bescheinigung oder eines Attests",
    subSteps: ["notes"], billingUnit: "sitzung",
  },
  {
    id: "DIVERS_ROENTGEN", name: "Röntgenaufnahme",
    beschreibung: "Röntgendiagnostik (Einzelzahn oder OPG)",
    subSteps: ["zahnauswahl", "notes"], gozNr: "Ä5000", bemaNr: "Ä925a", billingUnit: "zahn",
  },
];

// ===================== ZE =====================
const zeOptions: TreatmentOption[] = [
  {
    id: "ZE_KRONE", name: "Krone",
    beschreibung: "Versorgung mit einer Einzelzahnkrone",
    subSteps: ["zahnauswahl", "materialauswahl", "techniken", "notes"], gozNr: "5000", bemaNr: "20a", billingUnit: "zahn",
    gkvHinweis: "Bei GKV: Abrechnung über HKP/Festzuschuss. Gleichartig/andersartig = Mehrkostenvereinbarung.",
    techniken: ["Präparation", "Abformung (konventionell)", "Abformung (digital/Intraoralscan)", "Provisoriumherstellung", "Einprobe", "Adhäsive Befestigung", "Konventionelle Zementierung"],
    materialien: ["Vollkeramik (Zirkonoxid)", "Vollkeramik (Lithiumdisilikat/e.max)", "VMK (Verblend-Metall-Keramik)", "Goldkrone", "Provisorischer Zement", "Adhäsivzement (RelyX)", "Glasionomerzement"],
  },
  {
    id: "ZE_BRUECKE", name: "Brücke",
    beschreibung: "Versorgung mit einer festsitzenden Brücke",
    subSteps: ["zahnauswahl", "materialauswahl", "techniken", "notes"], gozNr: "5040", bemaNr: "20a", billingUnit: "zahn",
    gkvHinweis: "Bei GKV: Abrechnung über HKP/Festzuschuss.",
    techniken: ["Präparation Pfeilerzähne", "Abformung (konventionell)", "Abformung (digital)", "Provisoriumherstellung", "Einprobe", "Zementierung"],
    materialien: ["Vollkeramik (Zirkonoxid)", "VMK", "Goldbrücke", "Provisorischer Zement", "Adhäsivzement"],
  },
  {
    id: "ZE_TEILPROTHESE", name: "Teilprothese",
    beschreibung: "Herausnehmbarer Zahnersatz (Modellguss, Teleskop, Klammer)",
    subSteps: ["kieferauswahl", "materialauswahl", "techniken", "notes"], billingUnit: "kiefer",
    techniken: ["Abformung Situationsmodell", "Abformung Funktionsmodell", "Kieferrelationsbestimmung", "Einprobe (Wachswall)", "Eingliederung", "Remontage"],
    materialien: ["Modellguss (CoCr)", "Klammerprothese", "Teleskopprothese", "Geschiebeprothese", "PEEK-Gerüst"],
  },
  {
    id: "ZE_TOTALPROTHESE", name: "Totalprothese",
    beschreibung: "Vollständiger herausnehmbarer Zahnersatz",
    subSteps: ["kieferauswahl", "techniken", "notes"], billingUnit: "kiefer",
    techniken: ["Funktionsabformung", "Kieferrelationsbestimmung", "Wachsanprobe", "Einprobe", "Eingliederung", "Remontage"],
  },
  {
    id: "ZE_VENEER", name: "Veneer",
    beschreibung: "Keramikschale / Verblendschale",
    subSteps: ["zahnauswahl", "materialauswahl", "notes"], gozNr: "5000", billingUnit: "zahn",
    materialien: ["Lithiumdisilikat (e.max)", "Feldspatkeramik", "Komposit-Veneer", "Adhäsivzement"],
  },
  {
    id: "ZE_PROVISORIUM", name: "Provisorium",
    beschreibung: "Herstellung eines Langzeit- oder Kurzzeitprovisoriums",
    subSteps: ["zahnauswahl", "materialauswahl", "notes"], billingUnit: "zahn",
    materialien: ["PMMA (gefräst)", "Bis-Acryl (Protemp)", "Komposit", "Provisorischer Zement (TempBond)"],
  },
  {
    id: "ZE_REPARATUR", name: "Reparatur Zahnersatz",
    beschreibung: "Reparatur oder Unterfütterung von bestehendem Zahnersatz",
    subSteps: ["materialauswahl", "notes"], gozNr: "5070", bemaNr: "25", billingUnit: "sitzung",
    materialien: ["Kaltpolymerisat", "Unterfütterungsmaterial (hart)", "Unterfütterungsmaterial (weich)", "Prothesenkunststoff"],
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
    FUELL: "Füllung",
    IMPL: "Implantologie",
    KFO: "Kieferorthopädie",
    PAR: "Parodontologie",
    PROPHY: "Prophylaxe",
    DIVERS: "Sonstiges / Begleitleistungen",
    ZE: "Zahnersatz",
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
