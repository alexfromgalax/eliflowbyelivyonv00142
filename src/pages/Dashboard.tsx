import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, ArrowRight, Check, FileText, Mail, Heart, Pencil, Search, Mic, Plus, X, Users, Download } from "lucide-react";
import jsPDF from "jspdf";
import SignaturePad from "@/components/SignaturePad";
import ToothChart from "@/components/dental/ToothChart";
import PZRToothChart from "@/components/dental/PZRToothChart";
import { ToothData } from "@/components/dental/types";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  behandlungsArten, gozCodes, begruendungsTexte, verbrauchsmaterialien,
  bemaCodes, BEMA_PUNKTWERT,
} from "@/data/gozCodes";
import {
  pzrTechniken, pzrStrahlpulver,
  mundspuelungMaterialien, schleimhautTechniken, schleimhautMaterialien,
  fluoridierungMaterialien, ueberempfindlichMaterialien, subgingivalMaterialien,
  mmp8Ergebnisse,
  getCategoryOptions, getCategoryLabel, getMaterialsForOption, getTechnikenForOption,
  type TreatmentOption,
} from "@/data/treatmentCategories";
import {
  festzuschuesseZE, parAntragsTypen, getFestzuschussBetrag, berechneEigenanteil,
  type BonusStufe, type HkpZeile, type HkpData, type FestzuschussBefund,
} from "@/data/festzuschuesse";

// Alias for backward compat
const prophylaxeOptionen = getCategoryOptions("PROPHY");
import { toast } from "sonner";
import { useLikes } from "@/hooks/useLikes";
import { currentBehandler, availableAssistants, StaffMember } from "@/data/mockStaff";

type Step =
  | "team" | "action" | "patient" | "kostentraeger" | "date" | "behandlungsart"
  | "prophy_auswahl"
  | "prophy_sub"
  | "mehrkosten"
  | "hkp"
  | "review" | "email" | "done";

type Kostentraeger = "PKV" | "GKV" | "Selbstzahler" | "";

const allTeeth = [
  "18","17","16","15","14","13","12","11","21","22","23","24","25","26","27","28",
  "48","47","46","45","44","43","42","41","31","32","33","34","35","36","37","38"
];

const Q1 = ['18','17','16','15','14','13','12','11'];
const Q2 = ['21','22','23','24','25','26','27','28'];
const Q3 = ['31','32','33','34','35','36','37','38'];
const Q4 = ['48','47','46','45','44','43','42','41'];
const UPPER = [...Q1, ...Q2];
const LOWER = [...Q4, ...Q3];

/** Returns a segment label like "Alle Zähne", "Oberkiefer", "Q1+Q3", or individual teeth */
function getTeethSegmentLabel(teeth: string[]): string {
  const set = new Set(teeth);
  if (allTeeth.every(t => set.has(t))) return "Alle Zähne (komplett)";
  
  const hasQ1 = Q1.every(t => set.has(t));
  const hasQ2 = Q2.every(t => set.has(t));
  const hasQ3 = Q3.every(t => set.has(t));
  const hasQ4 = Q4.every(t => set.has(t));
  const hasOK = hasQ1 && hasQ2;
  const hasUK = hasQ3 && hasQ4;

  const segments: string[] = [];
  if (hasOK) segments.push("Oberkiefer");
  else {
    if (hasQ1) segments.push("Quadrant 1");
    if (hasQ2) segments.push("Quadrant 2");
  }
  if (hasUK) segments.push("Unterkiefer");
  else {
    if (hasQ4) segments.push("Quadrant 4");
    if (hasQ3) segments.push("Quadrant 3");
  }

  // Remaining individual teeth not covered by complete segments
  const coveredTeeth = new Set<string>();
  if (hasQ1) Q1.forEach(t => coveredTeeth.add(t));
  if (hasQ2) Q2.forEach(t => coveredTeeth.add(t));
  if (hasQ3) Q3.forEach(t => coveredTeeth.add(t));
  if (hasQ4) Q4.forEach(t => coveredTeeth.add(t));
  const remaining = teeth.filter(t => !coveredTeeth.has(t));

  if (segments.length > 0 && remaining.length > 0) {
    return `${segments.join(", ")} + Zähne ${remaining.join(", ")}`;
  }
  if (segments.length > 0) return `${segments.join(", ")} (${teeth.length} Zähne)`;
  return `Zähne: ${teeth.join(", ")} (${teeth.length} Zähne)`;
}

const kiefer = ["Oberkiefer", "Unterkiefer", "Beide Kiefer"];

// Sub-step definitions for each prophylaxe option
interface SubStepState {
  optionId: string;
  subStepIndex: number; // which sub-step within this option
}

interface ProphylaxeData {
  selectedTeeth: string[];
  selectedTechniken: string[];
  selectedPulver: string;
  selectedMaterial: string;
  selectedKiefer: string;
  materialMitgegeben: boolean;
  materialMitgegebenAuswahl: string;
  mmp8Ergebnis: string;
  notes: string;
  fluoridpiertJa: boolean | null;
  selectedFluoridMaterial: string;
}

const emptyProphylaxeData = (): ProphylaxeData => ({
  selectedTeeth: [], selectedTechniken: [], selectedPulver: "",
  selectedMaterial: "", selectedKiefer: "", materialMitgegeben: false,
  materialMitgegebenAuswahl: "", mmp8Ergebnis: "", notes: "",
  fluoridpiertJa: null, selectedFluoridMaterial: "",
});

/** Small like/heart toggle button */
const LikeButton = ({ liked, onClick }: { liked: boolean; onClick: (e: React.MouseEvent) => void }) => (
  <button
    type="button"
    onPointerDown={(e) => e.stopPropagation()}
    onClick={onClick}
    aria-pressed={liked}
    className="ml-auto shrink-0 rounded-full p-1 transition-colors hover:bg-primary/10"
    title={liked ? "Favorit entfernen" : "Als Favorit markieren"}
  >
    <Heart
      className={`h-4 w-4 transition-colors ${liked ? "fill-elivyon-magenta text-elivyon-magenta" : "text-muted-foreground"}`}
    />
  </button>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("team");
  const [patientId, setPatientId] = useState("");
  const [treatmentDate, setTreatmentDate] = useState<Date>(new Date());
  const [dateOption, setDateOption] = useState("");
  const [selectedArten, setSelectedArten] = useState<string[]>([]);
  const [kostentraeger, setKostentraeger] = useState<Kostentraeger>("");
  const [email, setEmail] = useState("");
  const [globalNotes, setGlobalNotes] = useState("");
  const [dokumentation, setDokumentation] = useState("");
  const [mehrkostenAkzeptiert, setMehrkostenAkzeptiert] = useState(false);
  const [signaturPatient, setSignaturPatient] = useState<string | null>(null);
  const [signaturArzt, setSignaturArzt] = useState<string | null>(null);
  const [dokuGenerated, setDokuGenerated] = useState(false);
  const [faktorOverrides, setFaktorOverrides] = useState<Record<string, { faktor: number; begruendungen: string[] }>>({});
  const [openBegruendungen, setOpenBegruendungen] = useState<Record<string, boolean>>({});
  const [materialSearch, setMaterialSearch] = useState("");
  const [technikSearch, setTechnikSearch] = useState("");
  const [pulverSearch, setPulverSearch] = useState("");

  // Team / assistant state
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>([]);
  const [showAssistantPicker, setShowAssistantPicker] = useState(false);
  const [positionAssistants, setPositionAssistants] = useState<Record<string, string[]>>({});
  const [openPositionAssistantPicker, setOpenPositionAssistantPicker] = useState<string | null>(null);

  // Multi-category flow: track which category index we're currently processing
  const [currentArtenIdx, setCurrentArtenIdx] = useState(0);
  // Per-category selected options: { "PROPHY": ["PZR","MUNDSPUELUNG"], "DIAG": ["DIAG_UNTERSUCHUNG"] }
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  // Data per option (works for all categories)
  const [prophyData, setProphyData] = useState<Record<string, ProphylaxeData>>({});
  const [currentSubStep, setCurrentSubStep] = useState<SubStepState>({ optionId: "", subStepIndex: 0 });

  // HKP state
  const [hkpBonusStufe, setHkpBonusStufe] = useState<BonusStufe>("kein");
  const [hkpZeilen, setHkpZeilen] = useState<HkpZeile[]>([]);
  const [hkpGesamtkosten, setHkpGesamtkosten] = useState<number>(0);
  const [hkpParAntragsTyp, setHkpParAntragsTyp] = useState<string>("");
  const [hkpParGrad, setHkpParGrad] = useState<string>("");
  const [hkpParStadium, setHkpParStadium] = useState<string>("");

  const needsHkp = kostentraeger === "GKV" && selectedArten.some(a => a === "ZE" || a === "PAR");
  const hasZE = selectedArten.includes("ZE");
  const hasPAR = selectedArten.includes("PAR");

  const getProphyData = (id: string): ProphylaxeData => prophyData[id] || emptyProphylaxeData();

  // Detect options that need Mehrkostenvereinbarung for GKV patients
  const getMehrkostenOptionen = (): { optionId: string; optionName: string; grund: string; rechtsgrundlage: string }[] => {
    if (kostentraeger !== "GKV") return [];
    const result: { optionId: string; optionName: string; grund: string; rechtsgrundlage: string }[] = [];
    for (const catId of selectedArten) {
      const catOpts = getCategoryOptions(catId);
      const catSel = selectedOptions[catId] || [];
      for (const optId of catSel) {
        const opt = catOpts.find(o => o.id === optId);
        if (!opt) continue;
        if (opt.nichtKassenleistung) {
          result.push({
            optionId: opt.id,
            optionName: opt.name,
            grund: opt.gkvHinweis || "Keine GKV-Kassenleistung. Privatvereinbarung erforderlich.",
            rechtsgrundlage: "§8 Abs. 7 BMV-Z",
          });
        } else if (opt.id.startsWith("FUELL_KOMPOSIT")) {
          // Komposit im Seitenzahnbereich = Mehrkosten
          const data = getProphyData(opt.id);
          const seitenzaehne = data.selectedTeeth.filter(t => {
            const num = parseInt(t.substring(1));
            return num >= 4; // Zähne 4-8 = Prämolaren/Molaren (Seitenzahnbereich)
          });
          if (seitenzaehne.length > 0) {
            result.push({
              optionId: opt.id,
              optionName: `${opt.name} (Seitenzahn)`,
              grund: `Amalgam ist im Seitenzahnbereich die Regelversorgung der GKV. Für Kompositfüllungen an Zähnen ${seitenzaehne.join(", ")} fallen Mehrkosten an.`,
              rechtsgrundlage: "§28 Abs. 2 SGB V",
            });
          }
        }
      }
    }
    return result;
  };
  const mehrkostenOptionen = getMehrkostenOptionen();
  const needsMehrkosten = mehrkostenOptionen.length > 0;

  // Backward-compat: selectedProphyOptionen is now derived from selectedOptions
  const currentCategoryId = selectedArten[currentArtenIdx] || "PROPHY";
  const selectedProphyOptionen = Object.values(selectedOptions).flat();
  const setSelectedProphyOptionen = (updater: string[] | ((prev: string[]) => string[])) => {
    // no-op kept for compat - individual category selections handled via selectedOptions
  };

  // Like hooks for each category
  const likesPzrTechniken = useLikes("pzr-techniken");
  const likesSchleimhautTechniken = useLikes("schleimhaut-techniken");
  const likesStrahlpulver = useLikes("strahlpulver");
  const likesMundspuelung = useLikes("mat-mundspuelung");
  const likesSchleimhautMat = useLikes("mat-schleimhaut");
  const likesFluoridMat = useLikes("mat-fluorid");
  const likesUeberempfindlich = useLikes("mat-ueberempfindlich");
  const likesSubgingival = useLikes("mat-subgingival");
  const likesScharfeKanten = useLikes("mat-scharfe-kanten");
  const likesMmp8Mat = useLikes("mat-mmp8");
  const likesKiefer = useLikes("kiefer");
  const likesMmp8Ergebnis = useLikes("mmp8-ergebnis");
  const likesMitgegeben = useLikes("mat-mitgegeben");

  // Generic techniken likes keyed by option ID
  const likesGenericTechniken: Record<string, ReturnType<typeof useLikes>> = {};
  // We use a stable hook approach - create likes for known categories with techniken
  const likesChirExtEin = useLikes("tech-CHIR_EXTRAKTION_EIN");
  const likesChirExtMehr = useLikes("tech-CHIR_EXTRAKTION_MEHR");
  const likesChirOstEin = useLikes("tech-CHIR_OSTEOTOMIE_EIN");
  const likesChirOstMehr = useLikes("tech-CHIR_OSTEOTOMIE_MEHR");
  const likesChirWsr = useLikes("tech-CHIR_WSR");
  const likesEndoAufEin = useLikes("tech-ENDO_AUFBEREITUNG_EIN");
  const likesEndoAufMehr = useLikes("tech-ENDO_AUFBEREITUNG_MEHR");
  const likesEndoFuellung = useLikes("tech-ENDO_FUELLUNG");
  const likesEndoRevision = useLikes("tech-ENDO_REVISION");
  const likesFuellKomposit1 = useLikes("tech-FUELL_KOMPOSIT_1");
  const likesFuellKomposit2 = useLikes("tech-FUELL_KOMPOSIT_2");
  const likesFuellKomposit3 = useLikes("tech-FUELL_KOMPOSIT_3PLUS");
  const likesImplInsertion = useLikes("tech-IMPL_INSERTION");
  const likesImplAugmentation = useLikes("tech-IMPL_AUGMENTATION");
  const likesParSrp = useLikes("tech-PAR_AIT");
  const likesParChir = useLikes("tech-PAR_OFFEN");
  const likesParUpt = useLikes("tech-PAR_UPT");
  const likesParStatus = useLikes("tech-PAR_STATUS");
  const likesParVorbehandlung = useLikes("tech-PAR_VORBEHANDLUNG");
  const likesParBev = useLikes("tech-PAR_BEV");
  const likesDiagUntersuchung = useLikes("tech-DIAG_UNTERSUCHUNG");
  const likesDiagVitalitaet = useLikes("tech-DIAG_VITALITAET");
  const likesDiagRoentgen = useLikes("tech-DIAG_ROENTGEN");
  const likesDiagFoto = useLikes("tech-DIAG_FOTO");
  const likesDiagFal = useLikes("tech-DIAG_FAL");
  const likesChirHemisektion = useLikes("tech-CHIR_HEMISEKTION");
  const likesChirVerschluss = useLikes("tech-CHIR_PLASTISCHER_VERSCHLUSS");
  const likesChirInzision = useLikes("tech-CHIR_INZISION");
  const likesChirFrenektomie = useLikes("tech-CHIR_FRENEKTOMIE");
  const likesChirZystektomie = useLikes("tech-CHIR_ZYSTEKTOMIE");
  const likesEndoTrep = useLikes("tech-ENDO_TREPANATION");
  const likesEndoStift = useLikes("tech-ENDO_STIFTAUFBAU");
  const likesFuellGiz = useLikes("tech-FUELL_GIZ");
  const likesImplFreilegung = useLikes("tech-IMPL_FREILEGUNG");
  const likesImplSocket = useLikes("tech-IMPL_SOCKET_PRESERVATION");
  const likesImplPeriimpl = useLikes("tech-IMPL_PERIIMPLANTITIS");
  const likesImplBohr = useLikes("tech-IMPL_BOHRSCHABLONE");
  const likesKfoModell = useLikes("tech-KFO_MODELLANALYSE");
  const likesKfoAligner = useLikes("tech-KFO_ALIGNER");
  const likesKfoDebonding = useLikes("tech-KFO_DEBONDING");
  const likesKfoKontrolle = useLikes("tech-KFO_KONTROLLE");
  const likesDiversLeit = useLikes("tech-DIVERS_ANAESTHESIE_LEIT");
  const likesDiversNachbeh = useLikes("tech-DIVERS_NACHBEHANDLUNG");
  const likesDiversSchienung = useLikes("tech-DIVERS_SCHIENUNG");
  const likesDiversBleaching = useLikes("tech-DIVERS_BLEACHING");

  // Generic material likes for non-PROPHY categories
  const likesGenericMat: Record<string, ReturnType<typeof useLikes>> = {};
  const likesMatChirOstEin = useLikes("mat-CHIR_OSTEOTOMIE_EIN");
  const likesMatChirOstMehr = useLikes("mat-CHIR_OSTEOTOMIE_MEHR");
  const likesMatChirWsr = useLikes("mat-CHIR_WSR");
  const likesMatChirVerschluss = useLikes("mat-CHIR_PLASTISCHER_VERSCHLUSS");
  const likesMatEndoAufEin = useLikes("mat-ENDO_AUFBEREITUNG_EIN");
  const likesMatEndoAufMehr = useLikes("mat-ENDO_AUFBEREITUNG_MEHR");
  const likesMatEndoFuellung = useLikes("mat-ENDO_FUELLUNG");
  const likesMatEndoRevision = useLikes("mat-ENDO_REVISION");
  const likesMatEndoEinlage = useLikes("mat-ENDO_EINLAGE");
  const likesMatFuellKomposit1 = useLikes("mat-FUELL_KOMPOSIT_1");
  const likesMatFuellKomposit2 = useLikes("mat-FUELL_KOMPOSIT_2");
  const likesMatFuellKomposit3 = useLikes("mat-FUELL_KOMPOSIT_3PLUS");
  const likesMatFuellProv = useLikes("mat-FUELL_PROVISORISCH");
  const likesMatFuellUnter = useLikes("mat-FUELL_UNTERFUELLUNG");
  const likesMatImplInsertion = useLikes("mat-IMPL_INSERTION");
  const likesMatImplAugmentation = useLikes("mat-IMPL_AUGMENTATION");
  const likesMatImplFreilegung = useLikes("mat-IMPL_FREILEGUNG");
  const likesMatImplSocket = useLikes("mat-IMPL_SOCKET_PRESERVATION");
  const likesMatImplPeriimpl = useLikes("mat-IMPL_PERIIMPLANTITIS");
  const likesMatKfoMultiband = useLikes("mat-KFO_MULTIBAND");
  const likesMatKfoFko = useLikes("mat-KFO_FKO");
  const likesMatKfoRetainer = useLikes("mat-KFO_RETAINER");
  const likesMatKfoAligner = useLikes("mat-KFO_ALIGNER");
  const likesMatParAit = useLikes("mat-PAR_AIT");
  const likesMatParOffen = useLikes("mat-PAR_OFFEN");
  const likesMatChirExtEin = useLikes("mat-CHIR_EXTRAKTION_EIN2");
  const likesMatChirExtMehr = useLikes("mat-CHIR_EXTRAKTION_MEHR2");
  const likesMatChirInzision = useLikes("mat-CHIR_INZISION");
  const likesMatChirFrenektomie = useLikes("mat-CHIR_FRENEKTOMIE");
  const likesMatChirZystektomie = useLikes("mat-CHIR_ZYSTEKTOMIE");
  const likesMatEndoStift = useLikes("mat-ENDO_STIFTAUFBAU");
  const likesMatDiversSchienung = useLikes("mat-DIVERS_SCHIENUNG");
  const likesMatDiversBleaching = useLikes("mat-DIVERS_BLEACHING");
  const likesMatDiversMedikation = useLikes("mat-DIVERS_MEDIKATION");
  const likesMatDiversNotfall = useLikes("mat-DIVERS_NOTFALL");
  const likesMatZeInlay = useLikes("mat-ZE_INLAY_ONLAY");
  const likesMatZeImplProt = useLikes("mat-ZE_IMPLANTAT_PROTHETIK");

  const getLikesForTechniken = (optionId: string): ReturnType<typeof useLikes> => {
    switch (optionId) {
      case "PZR": return likesPzrTechniken;
      case "SCHLEIMHAUT": return likesSchleimhautTechniken;
      case "CHIR_EXTRAKTION_EIN": return likesChirExtEin;
      case "CHIR_EXTRAKTION_MEHR": return likesChirExtMehr;
      case "CHIR_OSTEOTOMIE_EIN": return likesChirOstEin;
      case "CHIR_OSTEOTOMIE_MEHR": return likesChirOstMehr;
      case "CHIR_WSR": return likesChirWsr;
      case "ENDO_AUFBEREITUNG_EIN": return likesEndoAufEin;
      case "ENDO_AUFBEREITUNG_MEHR": return likesEndoAufMehr;
      case "ENDO_FUELLUNG": return likesEndoFuellung;
      case "ENDO_REVISION": return likesEndoRevision;
      case "FUELL_KOMPOSIT_1": return likesFuellKomposit1;
      case "FUELL_KOMPOSIT_2": return likesFuellKomposit2;
      case "FUELL_KOMPOSIT_3PLUS": return likesFuellKomposit3;
      case "IMPL_INSERTION": return likesImplInsertion;
      case "IMPL_AUGMENTATION": return likesImplAugmentation;
      case "IMPL_FREILEGUNG": return likesImplFreilegung;
      case "IMPL_SOCKET_PRESERVATION": return likesImplSocket;
      case "IMPL_PERIIMPLANTITIS": return likesImplPeriimpl;
      case "IMPL_BOHRSCHABLONE": return likesImplBohr;
      case "PAR_AIT": return likesParSrp;
      case "PAR_OFFEN": return likesParChir;
      case "PAR_UPT": return likesParUpt;
      case "PAR_STATUS": return likesParStatus;
      case "PAR_VORBEHANDLUNG": return likesParVorbehandlung;
      case "PAR_BEV": return likesParBev;
      case "DIAG_UNTERSUCHUNG": return likesDiagUntersuchung;
      case "DIAG_VITALITAET": return likesDiagVitalitaet;
      case "DIAG_ROENTGEN": return likesDiagRoentgen;
      case "DIAG_FOTO": return likesDiagFoto;
      case "DIAG_FAL": return likesDiagFal;
      case "CHIR_HEMISEKTION": return likesChirHemisektion;
      case "CHIR_PLASTISCHER_VERSCHLUSS": return likesChirVerschluss;
      case "CHIR_INZISION": return likesChirInzision;
      case "CHIR_FRENEKTOMIE": return likesChirFrenektomie;
      case "CHIR_ZYSTEKTOMIE": return likesChirZystektomie;
      case "ENDO_TREPANATION": return likesEndoTrep;
      case "ENDO_STIFTAUFBAU": return likesEndoStift;
      case "FUELL_GIZ": return likesFuellGiz;
      case "KFO_MODELLANALYSE": return likesKfoModell;
      case "KFO_ALIGNER": return likesKfoAligner;
      case "KFO_DEBONDING": return likesKfoDebonding;
      case "KFO_KONTROLLE": return likesKfoKontrolle;
      case "DIVERS_ANAESTHESIE_LEIT": return likesDiversLeit;
      case "DIVERS_NACHBEHANDLUNG": return likesDiversNachbeh;
      case "DIVERS_SCHIENUNG": return likesDiversSchienung;
      case "DIVERS_BLEACHING": return likesDiversBleaching;
      default: return likesPzrTechniken; // fallback
    }
  };

  const getLikesForMaterial = (optionId: string) => {
    switch (optionId) {
      case "MUNDSPUELUNG": return likesMundspuelung;
      case "SCHLEIMHAUT": return likesSchleimhautMat;
      case "FLUORID_SCHIENE": return likesFluoridMat;
      case "UEBEREMPFINDLICH": return likesUeberempfindlich;
      case "SUBGINGIVAL": return likesSubgingival;
      case "MMP8": return likesMmp8Mat;
      case "SCHARFE_KANTEN": return likesScharfeKanten;
      case "CHIR_OSTEOTOMIE_EIN": return likesMatChirOstEin;
      case "CHIR_OSTEOTOMIE_MEHR": return likesMatChirOstMehr;
      case "CHIR_WSR": return likesMatChirWsr;
      case "CHIR_PLASTISCHER_VERSCHLUSS": return likesMatChirVerschluss;
      case "ENDO_AUFBEREITUNG_EIN": return likesMatEndoAufEin;
      case "ENDO_AUFBEREITUNG_MEHR": return likesMatEndoAufMehr;
      case "ENDO_FUELLUNG": return likesMatEndoFuellung;
      case "ENDO_REVISION": return likesMatEndoRevision;
      case "ENDO_EINLAGE": return likesMatEndoEinlage;
      case "FUELL_KOMPOSIT_1": return likesMatFuellKomposit1;
      case "FUELL_KOMPOSIT_2": return likesMatFuellKomposit2;
      case "FUELL_KOMPOSIT_3PLUS": return likesMatFuellKomposit3;
      case "FUELL_PROVISORISCH": return likesMatFuellProv;
      case "FUELL_UNTERFUELLUNG": return likesMatFuellUnter;
      case "IMPL_INSERTION": return likesMatImplInsertion;
      case "IMPL_AUGMENTATION": return likesMatImplAugmentation;
      case "KFO_MULTIBAND": return likesMatKfoMultiband;
      case "KFO_ALIGNER": return likesMatKfoAligner;
      case "PAR_SRP": return likesMatParSrp;
      case "PAR_CHIRURGISCH": return likesMatParChir;
      default: return likesMundspuelung;
    }
  };

  const toggleProphyOption = (id: string) =>
    setSelectedProphyOptionen(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);


  const updateProphyData = (id: string, update: Partial<ProphylaxeData>) => {
    setProphyData(prev => ({ ...prev, [id]: { ...getProphyData(id), ...update } }));
  };

  const toggleTooth = (optionId: string, t: string) => {
    const current = getProphyData(optionId).selectedTeeth;
    updateProphyData(optionId, { selectedTeeth: current.includes(t) ? current.filter(x => x !== t) : [...current, t] });
  };

  const selectAllTeeth = (optionId: string) => {
    updateProphyData(optionId, { selectedTeeth: allTeeth.slice() });
  };

  const toggleTechnik = (optionId: string, t: string) => {
    const current = getProphyData(optionId).selectedTechniken;
    updateProphyData(optionId, { selectedTechniken: current.includes(t) ? current.filter(x => x !== t) : [...current, t] });
  };

  // Auto-apply defaults from likes when entering a sub-step
  useEffect(() => {
    if (step !== "prophy_sub" || !currentSubStep.optionId) return;
    const option = getCurrentOption();
    if (!option) return;
    const data = getProphyData(option.id);
    const subStepName = option.subSteps[currentSubStep.subStepIndex];

    if (subStepName === "strahlpulver" && !data.selectedPulver) {
      const def = likesStrahlpulver.getDefault();
      if (def) updateProphyData(option.id, { selectedPulver: def });
    }
    if (subStepName === "materialauswahl" && !data.selectedMaterial) {
      const likes = getLikesForMaterial(option.id);
      const def = likes.getDefault();
      if (def) updateProphyData(option.id, { selectedMaterial: def });
    }
    if (subStepName === "kieferauswahl" && !data.selectedKiefer) {
      const def = likesKiefer.getDefault();
      if (def) updateProphyData(option.id, { selectedKiefer: def });
    }
    if (subStepName === "techniken" && data.selectedTechniken.length === 0) {
      const likes = getLikesForTechniken(option.id);
      const allLiked = likes.liked;
      if (allLiked.length > 0) {
        const availableTechniken = getTechnikenForOption(option);
        const validLiked = allLiked.filter(l => availableTechniken.includes(l));
        if (validLiked.length > 0) updateProphyData(option.id, { selectedTechniken: validLiked });
      }
    }
    if (subStepName === "fluoridierung" && data.fluoridpiertJa === null && !data.selectedFluoridMaterial) {
      const fluoridLikes = getLikesForMaterial("FLUORID_SCHIENE");
      const def = fluoridLikes.getDefault();
      if (def) updateProphyData(option.id, { fluoridpiertJa: true, selectedFluoridMaterial: def });
    }
    if (subStepName === "ergebnis" && !data.mmp8Ergebnis) {
      const def = likesMmp8Ergebnis.getDefault();
      if (def) updateProphyData(option.id, { mmp8Ergebnis: def });
    }
  }, [step, currentSubStep.optionId, currentSubStep.subStepIndex]);

  // Navigate through category sub-steps
  const currentCatOpts = getCategoryOptions(currentCategoryId);
  const currentCatSelectedOpts = selectedOptions[currentCategoryId] || [];

  const startProphySubSteps = () => {
    const opts = selectedOptions[currentCategoryId] || [];
    if (opts.length === 0) return;
    setCurrentSubStep({ optionId: opts[0], subStepIndex: 0 });
    setStep("prophy_sub");
  };

  const getCurrentOption = (): TreatmentOption | undefined => {
    // Search across all categories for the current option
    for (const catId of selectedArten) {
      const opts = getCategoryOptions(catId);
      const found = opts.find(o => o.id === currentSubStep.optionId);
      if (found) return found;
    }
    return undefined;
  };

  const advanceSubStep = () => {
    const option = getCurrentOption();
    if (!option) return;
    setMaterialSearch("");
    setTechnikSearch("");
    setPulverSearch("");

    const nextSubIdx = currentSubStep.subStepIndex + 1;
    if (nextSubIdx < option.subSteps.length) {
      setCurrentSubStep({ ...currentSubStep, subStepIndex: nextSubIdx });
    } else {
      const opts = selectedOptions[currentCategoryId] || [];
      const currentOptIdx = opts.indexOf(currentSubStep.optionId);
      if (currentOptIdx < opts.length - 1) {
        setCurrentSubStep({ optionId: opts[currentOptIdx + 1], subStepIndex: 0 });
      } else {
        // Done with current category - advance to next
        const nextIdx = currentArtenIdx + 1;
        if (nextIdx < selectedArten.length) {
          setCurrentArtenIdx(nextIdx);
          setStep("prophy_auswahl");
        } else if (needsMehrkosten) {
          setStep("mehrkosten");
        } else if (needsHkp) {
          setStep("hkp");
        } else {
          setStep("review");
        }
      }
    }
  };

  const goBackSubStep = () => {
    if (currentSubStep.subStepIndex > 0) {
      setCurrentSubStep({ ...currentSubStep, subStepIndex: currentSubStep.subStepIndex - 1 });
    } else {
      const opts = selectedOptions[currentCategoryId] || [];
      const currentOptIdx = opts.indexOf(currentSubStep.optionId);
      if (currentOptIdx > 0) {
        const prevOption = opts[currentOptIdx - 1];
        const prevOpt = getCurrentOption();
        const allOpts = getCategoryOptions(currentCategoryId);
        const prev = allOpts.find(o => o.id === prevOption);
        setCurrentSubStep({ optionId: prevOption, subStepIndex: (prev?.subSteps.length || 1) - 1 });
      } else {
        setStep("prophy_auswahl");
      }
    }
  };

  // Billing calculation - uses faktorOverrides when available
  const berechneAbrechnung = () => {
    const isGKV = kostentraeger === "GKV";
    const lines: { nr: string; bezeichnung: string; faktor: number; anzahl: number; betrag: number; betrag1fach: number; isVM: boolean; isBema?: boolean; punkte?: number; hinweis?: string }[] = [];

    const addGozLine = (nr: string, bezeichnung: string, standardFaktor: number, betrag1fach: number, anzahl: number, isVM: boolean = false) => {
      const override = faktorOverrides[nr];
      const faktor = isVM ? 1 : (override ? override.faktor : standardFaktor);
      const betrag = isVM
        ? Math.round(betrag1fach * anzahl * 100) / 100
        : Math.round(betrag1fach * faktor * anzahl * 100) / 100;
      lines.push({ nr, bezeichnung, faktor, anzahl, betrag, betrag1fach, isVM });
    };

    const addBemaLine = (bemaNr: string, anzahl: number, hinweis?: string) => {
      const bema = bemaCodes.find(b => b.nr === bemaNr);
      if (!bema) return;
      const betrag = Math.round(bema.punkte * BEMA_PUNKTWERT * anzahl * 100) / 100;
      lines.push({
        nr: `BEMA ${bema.nr}`,
        bezeichnung: bema.bezeichnung,
        faktor: 1,
        anzahl,
        betrag,
        betrag1fach: Math.round(bema.punkte * BEMA_PUNKTWERT * 100) / 100,
        isVM: false,
        isBema: true,
        punkte: bema.punkte,
        hinweis: hinweis || bema.hinweis,
      });
    };

    /** Compute quantity based on billingUnit and collected data */
    const computeAnzahl = (option: TreatmentOption, data: ProphylaxeData): number => {
      switch (option.billingUnit) {
        case 'zahn': return data.selectedTeeth.length || 1;
        case 'kiefer': return data.selectedKiefer === "Beide Kiefer" ? 2 : 1;
        case 'quadrant': {
          const quads = new Set(data.selectedTeeth.map(t => t[0]));
          return quads.size || 1;
        }
        case 'sitzung':
        default: return 1;
      }
    };

    for (const optId of selectedProphyOptionen) {
      const data = getProphyData(optId);

      // Find the option across all categories
      const option = (() => {
        for (const catId of selectedArten) {
          const found = getCategoryOptions(catId).find(o => o.id === optId);
          if (found) return found;
        }
        // Also check PROPHY as fallback
        return prophylaxeOptionen.find(o => o.id === optId);
      })();
      if (!option) continue;

      // For GKV: if option is nichtKassenleistung, still use GOZ (Privatvereinbarung)
      const useBema = isGKV && option.bemaNr && !option.nichtKassenleistung;

      if (useBema && option.bemaNr) {
        // BEMA billing
        let anzahl = computeAnzahl(option, data);
        if (option.maxPerSession) {
          if (lines.some(l => l.nr === `BEMA ${option.bemaNr}`)) continue;
          anzahl = Math.min(anzahl, option.maxPerSession);
        }
        addBemaLine(option.bemaNr, anzahl, option.gkvHinweis);
      } else {
        // GOZ billing (PKV, Selbstzahler, or nichtKassenleistung bei GKV)
        // Keep special PROPHY cases for backward compat
        switch (optId) {
          case "PZR": {
            const pzr = gozCodes.find(g => g.nr === "1040")!;
            const zahnCount = data.selectedTeeth.length;
            if (zahnCount > 0) {
              addGozLine("1040", pzr.bezeichnung, pzr.standardFaktor, pzr.betrag1fach, zahnCount);
            }
            break;
          }
          case "MUNDSPUELUNG":
          case "SCHLEIMHAUT": {
            if (!lines.some(l => l.nr === "4020")) {
              const g = gozCodes.find(g => g.nr === "4020")!;
              addGozLine("4020", g.bezeichnung, g.standardFaktor, g.betrag1fach, 1);
            }
            break;
          }
          case "FLUORID_SCHIENE": {
            const g = gozCodes.find(g => g.nr === "1030")!;
            const kieferCount = data.selectedKiefer === "Beide Kiefer" ? 2 : 1;
            addGozLine("1030", g.bezeichnung, g.standardFaktor, g.betrag1fach, kieferCount);
            if (data.materialMitgegeben && data.materialMitgegebenAuswahl) {
              const vm = verbrauchsmaterialien.find(v => v.nr === "vm1050");
              if (vm) addGozLine("vm1050", vm.bezeichnung, 1, vm.betrag, 1, true);
            }
            break;
          }
          case "UEBEREMPFINDLICH": {
            const g = gozCodes.find(g => g.nr === "2010")!;
            const jaws = new Set(data.selectedTeeth.map(t => {
              const q = t[0];
              return (q === "1" || q === "2") ? "OK" : "UK";
            }));
            const jawCount = jaws.size || 1;
            addGozLine("2010", g.bezeichnung, g.standardFaktor, g.betrag1fach, jawCount);
            break;
          }
          case "SCHARFE_KANTEN": {
            const g = gozCodes.find(g => g.nr === "4030")!;
            const quadrants = new Set(data.selectedTeeth.map(t => t[0]));
            addGozLine("4030", g.bezeichnung, g.standardFaktor, g.betrag1fach, quadrants.size);
            break;
          }
          case "SUBGINGIVAL": {
            const g = gozCodes.find(g => g.nr === "4025")!;
            const zahnCount = data.selectedTeeth.length;
            if (zahnCount > 0) {
              addGozLine("4025", g.bezeichnung, g.standardFaktor, g.betrag1fach, zahnCount);
              const vm = verbrauchsmaterialien.find(v => v.nr === "vm1000");
              if (vm) addGozLine("vm1000", vm.bezeichnung, 1, vm.betrag, zahnCount, true);
            }
            break;
          }
          case "MMP8": {
            const vm = verbrauchsmaterialien.find(v => v.nr === "vm5000");
            if (vm) addGozLine("vm5000", vm.bezeichnung, 1, vm.betrag, 1, true);
            break;
          }
          default: {
            // Generic GOZ billing
            if (option.gozNr) {
              const goz = gozCodes.find(g => g.nr === option.gozNr);
              if (goz) {
                let anzahl = computeAnzahl(option, data);
                if (option.maxPerSession) {
                  if (!lines.some(l => l.nr === option.gozNr)) {
                    addGozLine(option.gozNr, goz.bezeichnung, goz.standardFaktor, goz.betrag1fach, Math.min(anzahl, option.maxPerSession));
                  }
                } else {
                  addGozLine(option.gozNr, goz.bezeichnung, goz.standardFaktor, goz.betrag1fach, anzahl);
                }
              }
            }
            break;
          }
        }
      }

      // Add VM lines (materials) regardless of billing system
      if (optId === "SUBGINGIVAL" && useBema) {
        const zahnCount = data.selectedTeeth.length;
        if (zahnCount > 0) {
          const vm = verbrauchsmaterialien.find(v => v.nr === "vm1000");
          if (vm) addGozLine("vm1000", vm.bezeichnung, 1, vm.betrag, zahnCount, true);
        }
      }
    }

    return lines;
  };

  const updateFaktor = (nr: string, rawValue: string) => {
    // Allow empty field while editing
    const parsed = parseFloat(rawValue);
    const faktor = isNaN(parsed) ? 0 : parsed;
    setFaktorOverrides(prev => ({
      ...prev,
      [nr]: { faktor, begruendungen: prev[nr]?.begruendungen || [] },
    }));
  };

  const toggleBegruendung = (nr: string, code: string) => {
    setFaktorOverrides(prev => {
      const current = prev[nr] || { faktor: gozCodes.find(g => g.nr === nr)?.standardFaktor || 1, begruendungen: [] };
      const has = current.begruendungen.includes(code);
      return {
        ...prev,
        [nr]: {
          ...current,
          begruendungen: has ? current.begruendungen.filter(b => b !== code) : [...current.begruendungen, code],
        },
      };
    });
  };

  const getAvailableBegruendungen = (nr: string): string[] => {
    const goz = gozCodes.find(g => g.nr === nr);
    if (!goz) return Object.keys(begruendungsTexte);
    return goz.begruendungen;
  };

  const needsBegruendung = (nr: string): boolean => {
    const goz = gozCodes.find(g => g.nr === nr);
    if (!goz) return false;
    const override = faktorOverrides[nr];
    if (!override) return false;
    return override.faktor > goz.begruendungAbFaktor;
  };

  const gesamt = (step === "review" || step === "hkp" || step === "email" || step === "done") ? berechneAbrechnung() : [];
  const gesamtBetrag = gesamt.reduce((s, l) => s + l.betrag, 0);

  // HKP: compute Festzuschuss total and Eigenanteil
  const hkpFestzuschussGesamt = hkpZeilen.reduce((s, z) => s + z.festzuschussBetrag, 0);
  const hkpEigenanteil = berechneEigenanteil(hkpZeilen, hkpGesamtkosten || gesamtBetrag);

  // Add HKP Zeile
  const addHkpZeile = (zahnNr: string, befundNr: string) => {
    const befund = festzuschuesseZE.find(f => f.nr === befundNr);
    if (!befund) return;
    const betrag = getFestzuschussBetrag(befund, hkpBonusStufe);
    setHkpZeilen(prev => [...prev, { zahnNr, befundNr, festzuschussBetrag: betrag, bonusStufe: hkpBonusStufe }]);
  };

  const removeHkpZeile = (index: number) => {
    setHkpZeilen(prev => prev.filter((_, i) => i !== index));
  };

  // Update all HKP zeilen when bonus changes
  const updateHkpBonus = (bonus: BonusStufe) => {
    setHkpBonusStufe(bonus);
    setHkpZeilen(prev => prev.map(z => {
      const befund = festzuschuesseZE.find(f => f.nr === z.befundNr);
      if (!befund) return z;
      return { ...z, bonusStufe: bonus, festzuschussBetrag: getFestzuschussBetrag(befund, bonus) };
    }));
  };

  // Generate Mehrkostenvereinbarung PDF
  const generateMehrkostenPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pw = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentW = pw - 2 * margin;
    let y = 25;

    const addLine = (text: string, size: number, bold: boolean = false, maxW: number = contentW) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, maxW);
      doc.text(lines, margin, y);
      y += lines.length * (size * 0.45) + 2;
    };

    const addSep = () => {
      y += 2;
      doc.setDrawColor(180);
      doc.line(margin, y, pw - margin, y);
      y += 5;
    };

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Mehrkostenvereinbarung", margin, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("gem. \u00A728 Abs. 2 SGB V / \u00A78 Abs. 7 BMV-Z", margin, y);
    y += 10;

    addSep();

    // Praxis info
    addLine(`Praxis: ${currentBehandler.name}`, 10, true);
    addLine("Musterstr. 1, 12345 Kusterhausen", 9);
    y += 3;

    // Patient info
    addLine(`Patientennummer: ${patientId}`, 10);
    addLine(`Datum: ${format(treatmentDate, "dd.MM.yyyy")}`, 10);
    addLine(`Kostentr\u00E4ger: Gesetzliche Krankenversicherung (GKV)`, 10);
    y += 3;

    addSep();

    // Legal text
    addLine("Aufkl\u00E4rung \u00FCber Mehrkosten / Privatleistungen", 12, true);
    y += 2;
    addLine(
      "Hiermit wird best\u00E4tigt, dass der/die Patient:in \u00FCber die nachfolgend aufgef\u00FChrten Leistungen " +
      "aufgekl\u00E4rt wurde, die nicht oder nicht vollst\u00E4ndig im Leistungskatalog der gesetzlichen " +
      "Krankenversicherung enthalten sind. Die Kosten werden gem\u00E4\u00DF der Geb\u00FChrenordnung f\u00FCr " +
      "Zahn\u00E4rzte (GOZ) berechnet und sind vom Patienten/von der Patientin selbst zu tragen.",
      9
    );
    y += 4;

    // Services table
    addLine("Betroffene Leistungen:", 11, true);
    y += 2;

    // Estimate costs from billing
    const billing = berechneAbrechnung();

    // --- Detailed billing table ---
    const bemaLines = billing.filter(l => l.isBema);
    const gozPrivatLines = billing.filter(l => !l.isBema && !l.isVM);
    const vmLines = billing.filter(l => l.isVM);

    // Helper: draw a billing row
    const drawBillingRow = (label: string, detail: string, amount: string, highlight: boolean = false) => {
      if (y > 265) { doc.addPage(); y = 25; }
      if (highlight) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, y - 4, contentW, 10, "F");
      }
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(label, margin + 3, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      if (detail) doc.text(detail, margin + 3, y + 4, { maxWidth: contentW - 45 });
      doc.setFontSize(9);
      doc.text(amount, pw - margin - 3, y, { align: "right" });
      y += detail ? 11 : 7;
    };

    // BEMA section (Kassenleistungen)
    if (bemaLines.length > 0) {
      addLine("Kassenleistungen (BEMA):", 10, true);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Punktwert: ${BEMA_PUNKTWERT.toFixed(4)} \u20AC`, margin, y);
      y += 5;

      for (const bl of bemaLines) {
        const bemaNr = bl.nr.replace('BEMA ', '');
        const detail = bl.hinweis ? `${bl.bezeichnung} \u2013 ${bl.hinweis}` : bl.bezeichnung;
        drawBillingRow(
          `BEMA ${bemaNr}`,
          `${detail} | ${bl.punkte || 0} Pkt. \u00D7 ${bl.anzahl}`,
          `${bl.betrag.toFixed(2)} \u20AC`,
          true
        );
      }
      const bemaTotal = bemaLines.reduce((s, l) => s + l.betrag, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`Summe BEMA: ${bemaTotal.toFixed(2)} \u20AC`, pw - margin - 3, y, { align: "right" });
      y += 8;
    }

    // GOZ Privatleistungen
    if (gozPrivatLines.length > 0) {
      addLine("Privatleistungen (GOZ):", 10, true);
      y += 1;

      for (const gl of gozPrivatLines) {
        const gozEntry = gozCodes.find(g => g.nr === gl.nr);
        const kuerzel = gozEntry?.kuerzel ? ` (${gozEntry.kuerzel})` : '';
        drawBillingRow(
          `GOZ ${gl.nr}${kuerzel}`,
          `${gl.bezeichnung} | 1-fach: ${gl.betrag1fach.toFixed(2)} \u20AC \u00D7 Faktor ${gl.faktor.toFixed(2)} \u00D7 ${gl.anzahl}`,
          `${gl.betrag.toFixed(2)} \u20AC`,
          true
        );
      }
      const gozTotal = gozPrivatLines.reduce((s, l) => s + l.betrag, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`Summe GOZ: ${gozTotal.toFixed(2)} \u20AC`, pw - margin - 3, y, { align: "right" });
      y += 8;
    }

    // Verbrauchsmaterialien
    if (vmLines.length > 0) {
      addLine("Verbrauchsmaterialien:", 10, true);
      for (const vl of vmLines) {
        drawBillingRow(
          vl.nr,
          `${vl.bezeichnung} | ${vl.anzahl} \u00D7 ${vl.betrag1fach.toFixed(2)} \u20AC`,
          `${vl.betrag.toFixed(2)} \u20AC`
        );
      }
      y += 3;
    }

    // Mehrkosten detail per option
    y += 2;
    addLine("Rechtsgrundlagen der Mehrkosten:", 10, true);
    y += 1;
    for (const mk of mehrkostenOptionen) {
      if (y > 265) { doc.addPage(); y = 25; }
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`\u2022 ${mk.optionName}`, margin + 3, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`${mk.rechtsgrundlage} \u2013 ${mk.grund}`, margin + 6, y + 4, { maxWidth: contentW - 10 });
      const wrappedLines = doc.splitTextToSize(`${mk.rechtsgrundlage} \u2013 ${mk.grund}`, contentW - 10);
      y += 4 + wrappedLines.length * 3.5 + 3;
    }

    // Total
    const totalMehrkosten = billing.filter(l => !l.isBema).reduce((s, l) => s + l.betrag, 0);
    y += 3;
    doc.setDrawColor(100);
    doc.line(margin, y, pw - margin, y);
    y += 6;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Gesch\u00E4tzte Mehrkosten gesamt:", margin, y);
    doc.text(`${totalMehrkosten.toFixed(2)} \u20AC`, pw - margin, y, { align: "right" });
    y += 4;
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("(Die tats\u00E4chlichen Kosten k\u00F6nnen je nach Behandlungsverlauf abweichen.)", margin, y);
    y += 10;

    addSep();

    // Patient declaration
    if (y > 220) { doc.addPage(); y = 25; }
    addLine("Erkl\u00E4rung des Patienten / der Patientin:", 11, true);
    y += 2;
    addLine(
      "Ich wurde \u00FCber die oben aufgef\u00FChrten Leistungen, die damit verbundenen Kosten und die " +
      "Tatsache aufgekl\u00E4rt, dass diese Leistungen nicht oder nicht vollst\u00E4ndig von meiner " +
      "gesetzlichen Krankenkasse \u00FCbernommen werden. Ich w\u00FCnsche ausdr\u00FCcklich die Erbringung " +
      "dieser Leistungen und erkl\u00E4re mich mit der \u00DCbernahme der anfallenden Mehrkosten einverstanden.",
      9
    );
    y += 3;
    addLine(
      "Mir ist bekannt, dass ich die Regelversorgung meiner gesetzlichen Krankenkasse " +
      "als Alternative w\u00E4hlen kann.",
      9
    );
    y += 10;

    // Signature lines
    if (y > 240) { doc.addPage(); y = 25; }
    doc.setDrawColor(0);

    // Date/Place
    doc.setFontSize(9);
    doc.text("Ort, Datum", margin, y);
    y += 8;
    doc.line(margin, y, margin + 70, y);
    y += 12;

    // Patient signature
    doc.text("Unterschrift Patient:in", margin, y);
    y += 3;
    if (signaturPatient) {
      doc.addImage(signaturPatient, "PNG", margin, y, 60, 25);
      y += 28;
    } else {
      y += 5;
      doc.line(margin, y, margin + 70, y);
      y += 8;
    }
    y += 5;

    // Dentist signature
    doc.text("Unterschrift Zahnarzt/Zahn\u00E4rztin", margin, y);
    y += 3;
    if (signaturArzt) {
      doc.addImage(signaturArzt, "PNG", margin, y, 60, 25);
      y += 28;
    } else {
      y += 5;
      doc.line(margin, y, margin + 70, y);
      y += 8;
    }
    y += 10;

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(120);
    doc.text(
      "Dieses Dokument wurde gem\u00E4\u00DF \u00A728 Abs. 2 SGB V, \u00A78 Abs. 7 BMV-Z und \u00A72 Abs. 2 GOZ erstellt. " +
      "Eine Kopie verbleibt in der Patientenakte.",
      margin, y, { maxWidth: contentW }
    );

    doc.save(`Mehrkostenvereinbarung_Patient_${patientId}_${format(treatmentDate, "yyyyMMdd")}.pdf`);
    toast.success("Mehrkostenvereinbarung als PDF heruntergeladen.");
  };

  // Render Mehrkostenvereinbarung step
  const renderMehrkostenStep = () => (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Mehrkostenvereinbarung</h2>
      <div className="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-4">
        <p className="font-medium text-amber-800 dark:text-amber-200 text-sm">⚠ Gesetzliche Pflicht bei GKV-Patienten</p>
        <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
          Bei den folgenden Leistungen handelt es sich um Privatleistungen bzw. Mehrkosten gegenüber der
          GKV-Regelversorgung. Gemäß <strong>§28 Abs. 2 SGB V</strong> und <strong>§8 Abs. 7 BMV-Z</strong> muss
          der/die Patient:in <em>vor Behandlungsbeginn</em> schriftlich über die Mehrkosten aufgeklärt und eine
          Vereinbarung unterzeichnet werden.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-sm">Betroffene Leistungen</h3>
        <div className="space-y-3">
          {mehrkostenOptionen.map((mk, idx) => (
            <div key={idx} className="rounded-md border border-border p-3">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{mk.optionName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{mk.grund}</p>
                  <p className="text-[10px] text-primary mt-1 font-medium">
                    Rechtsgrundlage: {mk.rechtsgrundlage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-primary/20">
        <h3 className="font-semibold mb-3 text-sm">Vereinbarung & Aufklärung</h3>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Bitte bestätigen Sie, dass die/der Patient:in über die anfallenden Mehrkosten aufgeklärt wurde
            und eine schriftliche Mehrkostenvereinbarung <em>vor</em> Behandlungsbeginn unterzeichnet hat.
          </p>
          <label className="flex items-start gap-3 cursor-pointer rounded-lg border-2 p-4 transition-colors hover:border-primary/50"
            style={{ borderColor: mehrkostenAkzeptiert ? 'hsl(var(--primary))' : undefined, backgroundColor: mehrkostenAkzeptiert ? 'hsl(var(--primary) / 0.05)' : undefined }}
          >
            <Checkbox
              checked={mehrkostenAkzeptiert}
              onCheckedChange={(v) => setMehrkostenAkzeptiert(!!v)}
              className="mt-0.5"
            />
            <div>
              <span className="text-sm font-medium">
                Patient:in wurde aufgeklärt und hat die Mehrkostenvereinbarung unterschrieben
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Die schriftliche Vereinbarung nach §28 SGB V / §8 Abs. 7 BMV-Z liegt vor.
                Kopie wird der Patientenakte beigefügt.
              </p>
            </div>
          </label>

          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-[10px] text-muted-foreground">
              <strong>Hinweis:</strong> Ohne vorliegende schriftliche Mehrkostenvereinbarung dürfen die
              aufgeführten Privatleistungen nicht zulasten des/der Patient:in abgerechnet werden.
              Die Vereinbarung muss den geschätzten Betrag der Mehrkosten, die Art der Leistung
              und die Unterschrift des/der Patient:in enthalten (§2 Abs. 2 GOZ).
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-1 text-sm">Digitale Unterschriften</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Patient:in und Behandler:in können hier direkt auf dem Tablet unterschreiben. Die Unterschriften werden in das PDF eingebettet.
        </p>
        <div className="space-y-4">
          <SignaturePad
            label="Unterschrift Patient:in"
            signature={signaturPatient}
            onSignatureChange={setSignaturPatient}
          />
          <SignaturePad
            label="Unterschrift Zahnarzt/Zahnärztin"
            signature={signaturArzt}
            onSignatureChange={setSignaturArzt}
          />
        </div>
        {signaturPatient && signaturArzt && (
          <div className="mt-3 rounded-md bg-primary/5 border border-primary/20 p-2">
            <p className="text-xs text-primary font-medium">✓ Beide Unterschriften erfasst</p>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm">PDF mit Unterschriften</h3>
            <p className="text-xs text-muted-foreground">
              {signaturPatient && signaturArzt
                ? "PDF wird mit den digitalen Unterschriften generiert."
                : "Unterschriften optional – PDF enthält sonst leere Unterschriftsfelder zum Drucken."}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={generateMehrkostenPDF}>
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => {
          // Go back to last sub-step of last category
          const lastCatId = selectedArten[selectedArten.length - 1];
          const lastCatOpts = selectedOptions[lastCatId] || [];
          const lastOptId = lastCatOpts[lastCatOpts.length - 1];
          if (lastOptId) {
            const allOpts = getCategoryOptions(lastCatId);
            const lastOptDef = allOpts.find(o => o.id === lastOptId);
            if (lastOptDef) {
              setCurrentArtenIdx(selectedArten.length - 1);
              setCurrentSubStep({ optionId: lastOptId, subStepIndex: lastOptDef.subSteps.length - 1 });
              setStep("prophy_sub");
            }
          }
        }}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>
        <Button onClick={() => {
          if (needsHkp) {
            setStep("hkp");
          } else {
            setStep("review");
          }
        }} disabled={!mehrkostenAkzeptiert}>
          Weiter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Render HKP step
  const renderHkpStep = () => (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Heil- und Kostenplan (HKP)</h2>
      <p className="text-sm text-muted-foreground">
        Für GKV-Patienten muss vor Beginn der ZE-/PAR-Behandlung ein Heil- und Kostenplan erstellt und bei der Kasse eingereicht werden.
      </p>

      {hasZE && (
        <>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Bonusheft-Status</h3>
            <RadioGroup value={hkpBonusStufe} onValueChange={(v) => updateHkpBonus(v as BonusStufe)}>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="kein" />
                  <span className="text-sm">Kein Bonus (Standardzuschuss)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="20" />
                  <span className="text-sm">20% Bonus (5 Jahre lückenloses Bonusheft)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="30" />
                  <span className="text-sm">30% Bonus (10 Jahre lückenloses Bonusheft)</span>
                </label>
              </div>
            </RadioGroup>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-3">Befunde & Festzuschüsse (FZ-RL)</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Weisen Sie jedem betroffenen Zahn den passenden Befund zu. Der Festzuschuss wird automatisch berechnet.
            </p>

            {hkpZeilen.map((zeile, idx) => {
              const befund = festzuschuesseZE.find(f => f.nr === zeile.befundNr);
              return (
                <div key={idx} className="flex items-start gap-3 border-b border-border pb-3 mb-3 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium bg-primary/10 px-2 py-0.5 rounded">Zahn {zeile.zahnNr}</span>
                      <span className="text-xs text-muted-foreground">FZ {zeile.befundNr}</span>
                    </div>
                    {befund && (
                      <p className="text-xs text-muted-foreground mt-1">{befund.bezeichnung}</p>
                    )}
                    <p className="text-xs mt-1">Regelversorgung: {befund?.regelversorgung}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-sm">{zeile.festzuschussBetrag.toFixed(2)} €</span>
                    <p className="text-[10px] text-muted-foreground">
                      {zeile.bonusStufe === "kein" ? "ohne Bonus" : `${zeile.bonusStufe}% Bonus`}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeHkpZeile(idx)} className="text-muted-foreground hover:text-destructive mt-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}

            <div className="border rounded-md p-4 bg-muted/20">
              <p className="text-xs font-medium mb-2">Befund hinzufügen:</p>
              <div className="flex gap-2 mb-3">
                <Select onValueChange={(zahn) => {
                  // Store temporarily for pairing with befund
                  const el = document.getElementById('hkp-befund-select') as HTMLSelectElement;
                  if (el) el.dataset.zahn = zahn;
                }}>
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue placeholder="Zahn" />
                  </SelectTrigger>
                  <SelectContent>
                    {allTeeth.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                    <SelectItem value="OK">OK (ges.)</SelectItem>
                    <SelectItem value="UK">UK (ges.)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {festzuschuesseZE.map(fz => (
                  <button
                    key={fz.nr}
                    type="button"
                    className="w-full text-left rounded-md border border-border p-2 hover:border-primary hover:bg-primary/5 transition-colors"
                    onClick={() => {
                      // Find selected tooth from last select interaction or default to first selected ZE tooth
                      const zeOpts = selectedOptions["ZE"] || [];
                      const firstZeData = zeOpts.length > 0 ? getProphyData(zeOpts[0]) : null;
                      const defaultZahn = firstZeData?.selectedTeeth?.[0] || "11";
                      addHkpZeile(defaultZahn, fz.nr);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-medium">FZ {fz.nr}</span>
                        <p className="text-[10px] text-muted-foreground">{fz.bezeichnung}</p>
                        <p className="text-[10px]">→ {fz.regelversorgung}</p>
                      </div>
                      <span className="text-xs font-semibold text-primary ml-2 whitespace-nowrap">
                        {getFestzuschussBetrag(fz, hkpBonusStufe).toFixed(2)} €
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20 bg-primary/5">
            <h3 className="font-semibold mb-3">Kostenübersicht ZE</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Geschätzte Gesamtkosten (zahnärztl. + Labor):</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={hkpGesamtkosten || ""}
                    onChange={e => setHkpGesamtkosten(parseFloat(e.target.value) || 0)}
                    placeholder={gesamtBetrag.toFixed(2)}
                    className="w-28 h-8 text-sm text-right"
                  />
                  <span>€</span>
                </div>
              </div>
              <div className="flex justify-between text-primary font-medium">
                <span>Festzuschuss GKV gesamt:</span>
                <span>– {hkpFestzuschussGesamt.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold border-t border-border pt-2">
                <span>Eigenanteil Patient:</span>
                <span>{hkpEigenanteil.toFixed(2)} €</span>
              </div>
            </div>
            {hkpZeilen.length === 0 && (
              <p className="text-xs text-amber-600 mt-3">⚠ Noch keine Befunde/Festzuschüsse zugeordnet.</p>
            )}
          </Card>
        </>
      )}

      {hasPAR && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3">PAR-Antrag (GKV)</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Systematische PAR-Therapie erfordert Genehmigung durch die Krankenkasse. Der Antrag wird elektronisch (eVerfahren) übermittelt.
          </p>

          <div className="space-y-4">
            <div>
              <Label className="text-sm">Antragstyp</Label>
              <RadioGroup value={hkpParAntragsTyp} onValueChange={setHkpParAntragsTyp} className="mt-2">
                {parAntragsTypen.map(typ => (
                  <label key={typ.id} className="flex items-start gap-2 cursor-pointer p-2 rounded-md hover:bg-muted/50">
                    <RadioGroupItem value={typ.id} className="mt-0.5" />
                    <div>
                      <span className="text-sm font-medium">{typ.bezeichnung}</span>
                      <p className="text-xs text-muted-foreground">{typ.beschreibung}</p>
                      <p className="text-[10px] text-amber-600 mt-0.5">Voraussetzung: {typ.voraussetzung}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">PAR-Grad (Grading)</Label>
                <Select value={hkpParGrad} onValueChange={setHkpParGrad}>
                  <SelectTrigger className="h-8 text-sm mt-1">
                    <SelectValue placeholder="Grad wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Grad A – langsame Progression</SelectItem>
                    <SelectItem value="B">Grad B – moderate Progression</SelectItem>
                    <SelectItem value="C">Grad C – schnelle Progression</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">PAR-Stadium (Staging)</Label>
                <Select value={hkpParStadium} onValueChange={setHkpParStadium}>
                  <SelectTrigger className="h-8 text-sm mt-1">
                    <SelectValue placeholder="Stadium wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="I">Stadium I – initial</SelectItem>
                    <SelectItem value="II">Stadium II – moderat</SelectItem>
                    <SelectItem value="III">Stadium III – schwer</SelectItem>
                    <SelectItem value="IV">Stadium IV – sehr schwer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hkpParAntragsTyp && (
              <div className="rounded-md bg-primary/5 border border-primary/20 p-3">
                <p className="text-xs font-medium text-primary">✓ Antrag bereit zur Übermittlung</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Der PAR-Antrag wird nach Abschluss über das eVerfahren an die KZV/Krankenkasse übermittelt.
                  Die Abrechnung erfolgt nach Genehmigung direkt über BEMA.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => {
          if (needsMehrkosten) {
            setStep("mehrkosten");
          } else {
            // Go back to last sub-step of last category
            const lastCatId = selectedArten[selectedArten.length - 1];
            const lastCatOpts = selectedOptions[lastCatId] || [];
            const lastOptId = lastCatOpts[lastCatOpts.length - 1];
            if (lastOptId) {
              const allOpts = getCategoryOptions(lastCatId);
              const lastOptDef = allOpts.find(o => o.id === lastOptId);
              if (lastOptDef) {
                setCurrentArtenIdx(selectedArten.length - 1);
                setCurrentSubStep({ optionId: lastOptId, subStepIndex: lastOptDef.subSteps.length - 1 });
                setStep("prophy_sub");
              }
            }
          }
        }}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>
        <Button onClick={() => setStep("review")}>
          Weiter zur Prüfung <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Generate treatment documentation text
  const generateDokumentation = () => {
    const dateStr = format(treatmentDate, "dd.MM.yyyy");
    const lines: string[] = [];
    lines.push(`Behandlungsdokumentation vom ${dateStr}`);
    lines.push(`Patient: ${patientId}`);
    lines.push(`Behandler:in: ${currentBehandler.name}`);
    const assistantNames = selectedAssistants.map(id => availableAssistants.find(a => a.id === id)?.name).filter(Boolean);
    if (assistantNames.length > 0) lines.push(`Assistenz: ${assistantNames.join(", ")}`);
    lines.push(`Kostenträger: ${kostentraeger || "nicht angegeben"}`);
    lines.push("");
    lines.push("Durchgeführte Maßnahmen:");

    for (const catId of selectedArten) {
      const catOpts = getCategoryOptions(catId);
      const catSel = selectedOptions[catId] || [];
      if (catSel.length === 0) continue;

      lines.push("");
      lines.push(`=== ${getCategoryLabel(catId)} ===`);

      for (const optId of catSel) {
        const opt = catOpts.find(o => o.id === optId);
        const data = getProphyData(optId);
        if (!opt) continue;

        lines.push("");
        lines.push(`${opt.name}:`);

        if (data.selectedTeeth.length > 0) {
          lines.push(`- Behandelte Zähne: ${getTeethSegmentLabel(data.selectedTeeth)}`);
        }
        if (data.selectedTechniken.length > 0) {
          lines.push(`- Angewandte Techniken: ${data.selectedTechniken.join(", ")}`);
        }
        if (data.selectedPulver) {
          lines.push(`- Verwendetes Strahlpulver: ${data.selectedPulver}`);
        }
        if (data.fluoridpiertJa === true && data.selectedFluoridMaterial) {
          lines.push(`- Fluoridierung: Ja – ${data.selectedFluoridMaterial}`);
        } else if (data.fluoridpiertJa === false) {
          lines.push(`- Fluoridierung: Nein`);
        }
        if (data.selectedMaterial) {
          lines.push(`- Verwendetes Material: ${data.selectedMaterial}`);
        }
        if (data.selectedKiefer) {
          lines.push(`- Kiefer: ${data.selectedKiefer}`);
        }
        if (data.mmp8Ergebnis) {
          lines.push(`- MMP-8 Testergebnis: ${data.mmp8Ergebnis}`);
        }
        if (data.materialMitgegeben && data.materialMitgegebenAuswahl) {
          lines.push(`- Material an Patient:in mitgegeben: ${data.materialMitgegebenAuswahl}`);
        }
        if (data.notes) {
          lines.push(`- Notizen: ${data.notes}`);
        }
      }
    }

    lines.push("");
    // Per-position team assignments
    const billing = berechneAbrechnung();
    const teamLines: string[] = [];
    for (const bl of billing) {
      const posAssist = positionAssistants[bl.nr] || selectedAssistants;
      const assistNames = posAssist.map(id => availableAssistants.find(a => a.id === id)?.name).filter(Boolean);
      const posLabel = bl.isBema ? `BEMA ${bl.nr.replace('BEMA ', '')}` : `GOZ ${bl.nr}`;
      const teamStr = assistNames.length > 0
        ? `Behandler:in: ${currentBehandler.name}, Assistenz: ${assistNames.join(", ")}`
        : `Behandler:in: ${currentBehandler.name}`;
      teamLines.push(`  ${posLabel}: ${teamStr}`);
    }
    if (teamLines.length > 0) {
      lines.push("");
      lines.push("Team-Zuordnung pro Leistung:");
      lines.push(...teamLines);
    }

    // === Kostenträgerspezifische Abrechnung ===
    lines.push("");
    lines.push("=== Abrechnung ===");

    if (kostentraeger === "GKV") {
      // GKV: Separate BEMA and GOZ (Privatleistungen)
      const bemaLines = billing.filter(l => l.isBema);
      const gozLines = billing.filter(l => !l.isBema && !l.isVM);
      const vmLines = billing.filter(l => l.isVM);

      if (bemaLines.length > 0) {
        lines.push("");
        lines.push("Kassenleistungen (BEMA):");
        lines.push(`Punktwert: ${BEMA_PUNKTWERT.toFixed(4)} €`);
        for (const bl of bemaLines) {
          const bemaNr = bl.nr.replace('BEMA ', '');
          lines.push(`  BEMA ${bemaNr} – ${bl.bezeichnung} | ${bl.punkte || 0} Pkt. × ${bl.anzahl} = ${bl.betrag.toFixed(2)} €${bl.hinweis ? ` (${bl.hinweis})` : ''}`);
        }
        const bemaTotal = bemaLines.reduce((s, l) => s + l.betrag, 0);
        lines.push(`  Summe BEMA: ${bemaTotal.toFixed(2)} €`);
      }

      if (gozLines.length > 0) {
        lines.push("");
        lines.push("Privatleistungen (GOZ) – gem. Mehrkostenvereinbarung:");
        for (const gl of gozLines) {
          const goz = gozCodes.find(g => g.nr === gl.nr);
          const kuerzel = goz?.kuerzel ? ` (${goz.kuerzel})` : '';
          lines.push(`  GOZ ${gl.nr}${kuerzel} – ${gl.bezeichnung} | Faktor ${gl.faktor.toFixed(2)} × ${gl.anzahl} = ${gl.betrag.toFixed(2)} €`);
        }
        const gozTotal = gozLines.reduce((s, l) => s + l.betrag, 0);
        lines.push(`  Summe GOZ (Privatanteil): ${gozTotal.toFixed(2)} €`);
      }

      if (vmLines.length > 0) {
        lines.push("");
        lines.push("Verbrauchsmaterialien:");
        for (const vl of vmLines) {
          lines.push(`  ${vl.nr} – ${vl.bezeichnung} | ${vl.anzahl} × ${vl.betrag1fach.toFixed(2)} € = ${vl.betrag.toFixed(2)} €`);
        }
        const vmTotal = vmLines.reduce((s, l) => s + l.betrag, 0);
        lines.push(`  Summe Material: ${vmTotal.toFixed(2)} €`);
      }

      lines.push("");
      lines.push(`Gesamtbetrag: ${gesamtBetrag.toFixed(2)} €`);

      // HKP-Daten für ZE/PAR
      if (needsHkp) {
        lines.push("");
        lines.push("=== Heil- und Kostenplan (HKP) ===");
        const bonusLabel = hkpBonusStufe === "kein" ? "ohne Bonus" : hkpBonusStufe === "20" ? "5 Jahre (20%)" : "10 Jahre (30%)";
        lines.push(`Bonusstufe: ${bonusLabel}`);

        if (hasZE && hkpZeilen.length > 0) {
          lines.push("");
          lines.push("Festzuschüsse (ZE):");
          for (const z of hkpZeilen) {
            const befund = festzuschuesseZE.find(f => f.nr === z.befundNr);
            lines.push(`  Zahn ${z.zahnNr} – Befund ${z.befundNr}: ${befund?.bezeichnung || ''} → ${z.festzuschussBetrag.toFixed(2)} €`);
          }
          lines.push(`  Summe Festzuschüsse: ${hkpFestzuschussGesamt.toFixed(2)} €`);
          lines.push(`  Gesamtkosten: ${(hkpGesamtkosten || gesamtBetrag).toFixed(2)} €`);
          lines.push(`  Voraussichtlicher Eigenanteil: ${hkpEigenanteil.toFixed(2)} €`);
        }

        if (hasPAR) {
          lines.push("");
          lines.push("PAR-Antrag (eVerfahren):");
          if (hkpParAntragsTyp) {
            const typ = parAntragsTypen.find(t => t.id === hkpParAntragsTyp);
            lines.push(`  Antragstyp: ${typ?.bezeichnung || hkpParAntragsTyp}`);
          }
          if (hkpParGrad) lines.push(`  Grad: ${hkpParGrad}`);
          if (hkpParStadium) lines.push(`  Stadium: ${hkpParStadium}`);
        }
      }
    } else if (kostentraeger === "PKV" || kostentraeger === "Selbstzahler") {
      // PKV/Selbstzahler: GOZ mit Steigerungsfaktoren
      const gozLines = billing.filter(l => !l.isVM);
      const vmLines = billing.filter(l => l.isVM);

      lines.push("");
      lines.push(`Abrechnung nach GOZ (${kostentraeger}):`);
      for (const gl of gozLines) {
        const goz = gozCodes.find(g => g.nr === gl.nr);
        const kuerzel = goz?.kuerzel ? ` (${goz.kuerzel})` : '';
        const faktorHinweis = gl.faktor > (goz?.standardFaktor || 2.3) ? ' ⚠ erhöht' : '';
        lines.push(`  GOZ ${gl.nr}${kuerzel} – ${gl.bezeichnung}`);
        lines.push(`    1-fach: ${gl.betrag1fach.toFixed(2)} € × Faktor ${gl.faktor.toFixed(2)} × ${gl.anzahl} = ${gl.betrag.toFixed(2)} €${faktorHinweis}`);
      }

      if (vmLines.length > 0) {
        lines.push("");
        lines.push("Verbrauchsmaterialien (§ 3 Abs. 1 GOZ):");
        for (const vl of vmLines) {
          lines.push(`  ${vl.nr} – ${vl.bezeichnung} | ${vl.anzahl} × ${vl.betrag1fach.toFixed(2)} € = ${vl.betrag.toFixed(2)} €`);
        }
      }

      lines.push("");
      lines.push(`Gesamtbetrag: ${gesamtBetrag.toFixed(2)} €`);
    }

    // Add Mehrkostenvereinbarung info
    if (needsMehrkosten && mehrkostenAkzeptiert) {
      lines.push("");
      lines.push("=== Mehrkostenvereinbarung ===");
      lines.push("Schriftliche Mehrkostenvereinbarung liegt vor (§28 SGB V / §8 Abs. 7 BMV-Z).");
      lines.push("Betroffene Leistungen:");
      for (const mk of mehrkostenOptionen) {
        lines.push(`  - ${mk.optionName} (${mk.rechtsgrundlage})`);
      }
      lines.push("Kopie der Vereinbarung in Patientenakte abgelegt.");
    }

    lines.push("");
    lines.push("Befund: Behandlung komplikationslos durchgeführt. Patient hat die Maßnahmen gut toleriert.");
    lines.push("Mundhygieneinstruktion erfolgt. Patient wurde über häusliche Prophylaxemaßnahmen aufgeklärt.");

    // Add Begründungen for elevated factors
    const begruendungLines: string[] = [];
    for (const [nr, override] of Object.entries(faktorOverrides)) {
      if (override.begruendungen.length > 0) {
        const goz = gozCodes.find(g => g.nr === nr);
        const label = goz ? `GOZ ${nr} (${goz.kuerzel})` : `GOZ ${nr}`;
        begruendungLines.push(`${label} – Faktor ${override.faktor}:`);
        for (const code of override.begruendungen) {
          begruendungLines.push(`  • Nr. ${code}: ${begruendungsTexte[code] || code}`);
        }
      }
    }
    if (begruendungLines.length > 0) {
      lines.push("");
      lines.push("Begründungen für erhöhte Faktoren:");
      lines.push(...begruendungLines);
    }
    
    if (globalNotes) {
      lines.push("");
      lines.push(`Ergänzende Anmerkungen: ${globalNotes}`);
    }

    lines.push("");
    lines.push(`Nächster empfohlener Kontrolltermin gemäß Behandlungsplan.`);
    lines.push("");
    lines.push(`Unterschrift Behandler: ___________________`);

    return lines.join("\n");
  };

  // Auto-pre-select Begründungen "202" and "203" for all positions that support them
  const DEFAULT_BEGRUENDUNGEN = ["202", "203"];
  useEffect(() => {
    if (step === "review") {
      const billing = berechneAbrechnung();
      setFaktorOverrides(prev => {
        const updated = { ...prev };
        for (const line of billing) {
          if (line.isVM) continue;
          const goz = gozCodes.find(g => g.nr === line.nr);
          if (!goz) continue;
          const toAdd = DEFAULT_BEGRUENDUNGEN.filter(code => goz.begruendungen.includes(code));
          if (toAdd.length === 0) continue;
          const existing = updated[line.nr];
          if (!existing) {
            updated[line.nr] = { faktor: line.faktor, begruendungen: [...toAdd] };
          } else {
            const missing = toAdd.filter(code => !existing.begruendungen.includes(code));
            if (missing.length > 0) {
              updated[line.nr] = { ...existing, begruendungen: [...existing.begruendungen, ...missing] };
            }
          }
        }
        return updated;
      });
    }
  }, [step]);

  // Auto-generate documentation when entering review step
  useEffect(() => {
    if (step === "review" && !dokuGenerated) {
      setDokumentation(generateDokumentation());
      setDokuGenerated(true);
    }
  }, [step]);

  // Re-generate documentation when factors/Begründungen/assistants change
  useEffect(() => {
    if (step === "review" && dokuGenerated) {
      setDokumentation(generateDokumentation());
    }
  }, [faktorOverrides, selectedAssistants, positionAssistants]);

  // Store full dental chart data per option
  const [dentalChartData, setDentalChartData] = useState<Record<string, Record<string, ToothData>>>({});

  // Render teeth selection component using the new dental chart
  const renderTeethSelection = (optionId: string, useFullChart: boolean = false) => {
    const data = getProphyData(optionId);
    const isPZR = optionId === "PZR";

    if (isPZR) {
      return (
        <PZRToothChart
          selectedTeeth={data.selectedTeeth}
          onSelectionChange={(teeth) => updateProphyData(optionId, { selectedTeeth: teeth })}
        />
      );
    }

    return (
      <div className="overflow-x-auto">
        <ToothChart
          initialSelectedTeeth={data.selectedTeeth}
          compact={!useFullChart}
          showPocketDepths={false}
          showIndices={false}
          onDataChange={(selectedTeeth, teethData) => {
            updateProphyData(optionId, { selectedTeeth });
            setDentalChartData(prev => ({ ...prev, [optionId]: teethData }));
          }}
        />
      </div>
    );
  };

  // Render the current prophylaxe sub-step
  const renderProphySubStep = () => {
    const option = getCurrentOption();
    if (!option) return null;
    const data = getProphyData(option.id);
    const currentSubStepName = option.subSteps[currentSubStep.subStepIndex];
    const optionLabel = option.name;

    const optIdx = selectedProphyOptionen.indexOf(option.id) + 1;
    const totalOpts = selectedProphyOptionen.length;

    const canAdvance = (() => {
      switch (currentSubStepName) {
        case "zahnauswahl": return data.selectedTeeth.length > 0;
        case "techniken": return data.selectedTechniken.length > 0;
        case "strahlpulver": return !!data.selectedPulver;
        case "fluoridierung": return data.fluoridpiertJa === false || (data.fluoridpiertJa === true && !!data.selectedFluoridMaterial);
        case "materialauswahl": return !!data.selectedMaterial;
        case "kieferauswahl": return !!data.selectedKiefer;
        case "material_mitgegeben": return true;
        case "ergebnis": return !!data.mmp8Ergebnis;
        case "notes": return true;
        default: return true;
      }
    })();

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Behandlung {optIdx}/{totalOpts}
          </span>
          <span>{optionLabel}</span>
        </div>

        {currentSubStepName === "zahnauswahl" && (
          <>
            <h2 className="font-display text-2xl font-bold">{optionLabel} – Zahnauswahl</h2>
            <p className="text-sm text-muted-foreground">Wähle die behandelten Zähne aus.</p>
            {renderTeethSelection(option.id, option.id === "PZR")}
          </>
        )}

        {currentSubStepName === "techniken" && (() => {
          const techLikes = getLikesForTechniken(option.id);
          const rawTechList = getTechnikenForOption(option);
          if (rawTechList.length === 0) return null;
          const sortedTech = techLikes.sortItems(rawTechList);
          return (
            <>
              <h2 className="font-display text-2xl font-bold">{optionLabel} – Techniken</h2>
              <p className="text-sm text-muted-foreground">Welche Techniken wurden angewendet?</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {sortedTech.map(t => (
                  <div key={t} className={`flex items-center gap-3 rounded-lg border p-3 ${data.selectedTechniken.includes(t) ? "border-primary bg-primary/5" : "border-border"}`}>
                    <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                      <Checkbox checked={data.selectedTechniken.includes(t)} onCheckedChange={() => toggleTechnik(option.id, t)} />
                      <span className="text-sm">{t}</span>
                    </label>
                    <LikeButton liked={techLikes.isLiked(t)} onClick={(e) => { e.preventDefault(); e.stopPropagation(); techLikes.toggleLike(t); if (!techLikes.isLiked(t) && !data.selectedTechniken.includes(t)) toggleTechnik(option.id, t); }} />
                  </div>
                ))}
                {sortedTech.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 col-span-2">Keine Technik gefunden.</p>
                )}
              </div>
            </>
          );
        })()}

        {currentSubStepName === "strahlpulver" && (() => {
          const sortedPulver = likesStrahlpulver.sortItems(pzrStrahlpulver);
          const filteredPulver = pulverSearch
            ? sortedPulver.filter(p => p.toLowerCase().includes(pulverSearch.toLowerCase()))
            : sortedPulver;
          return (
            <>
              <h2 className="font-display text-2xl font-bold">PZR – Strahlpulver</h2>
              <p className="text-sm text-muted-foreground">Welches Strahlpulver wurde verwendet?</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Strahlpulver suchen…"
                  value={pulverSearch}
                  onChange={e => setPulverSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="grid gap-2">
                {filteredPulver.map(p => (
                  <div key={p} className={`flex items-center gap-3 rounded-lg border p-3 ${data.selectedPulver === p ? "border-primary bg-primary/5" : "border-border"}`}>
                    <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => updateProphyData(option.id, { selectedPulver: p })}>
                      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${data.selectedPulver === p ? "border-primary" : "border-muted-foreground/40"}`}>
                        {data.selectedPulver === p && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm">{p}</span>
                    </button>
                    <LikeButton liked={likesStrahlpulver.isLiked(p)} onClick={(e) => { e.preventDefault(); e.stopPropagation(); const wasLiked = likesStrahlpulver.isLiked(p); likesStrahlpulver.toggleLike(p); if (!wasLiked) updateProphyData(option.id, { selectedPulver: p }); }} />
                  </div>
                ))}
                {filteredPulver.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Kein Strahlpulver gefunden.</p>
                )}
              </div>
            </>
          );
        })()}

        {currentSubStepName === "fluoridierung" && (() => {
          const fluoridMatLikes = getLikesForMaterial("FLUORID_SCHIENE");
          const sortedFluoridMat = fluoridMatLikes.sortItems(fluoridierungMaterialien);
          const fluoridSearchVal = materialSearch;
          const filteredFluoridMat = fluoridSearchVal
            ? sortedFluoridMat.filter(m => m.toLowerCase().includes(fluoridSearchVal.toLowerCase()))
            : sortedFluoridMat;
          return (
            <>
              <h2 className="font-display text-2xl font-bold">PZR – Fluoridierung</h2>
              <p className="text-sm text-muted-foreground">Wurde fluoridiert?</p>
              <div className="flex gap-3">
                <Button variant={data.fluoridpiertJa === true ? "default" : "outline"} onClick={() => updateProphyData(option.id, { fluoridpiertJa: true })}>Ja</Button>
                <Button variant={data.fluoridpiertJa === false ? "default" : "outline"} onClick={() => updateProphyData(option.id, { fluoridpiertJa: false, selectedFluoridMaterial: "" })}>Nein</Button>
              </div>
              {data.fluoridpiertJa === true && (
                <div className="space-y-3 mt-2">
                  <p className="text-sm font-medium">Fluoridierungsmaterial auswählen</p>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Material suchen…"
                        value={materialSearch}
                        onChange={e => setMaterialSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => toast.info("Spracherkennung wird in einer zukünftigen Version verfügbar sein.")}
                      title="Spracheingabe (coming soon)"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {filteredFluoridMat.map(m => (
                      <div key={m} className={`flex items-center gap-3 rounded-lg border p-3 ${data.selectedFluoridMaterial === m ? "border-primary bg-primary/5" : "border-border"}`}>
                        <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => updateProphyData(option.id, { selectedFluoridMaterial: m })}>
                          <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${data.selectedFluoridMaterial === m ? "border-primary" : "border-muted-foreground/40"}`}>
                            {data.selectedFluoridMaterial === m && <div className="h-2 w-2 rounded-full bg-primary" />}
                          </div>
                          <span className="text-sm">{m}</span>
                        </button>
                        <LikeButton liked={fluoridMatLikes.isLiked(m)} onClick={(e) => { e.preventDefault(); e.stopPropagation(); const wasLiked = fluoridMatLikes.isLiked(m); fluoridMatLikes.toggleLike(m); if (!wasLiked) updateProphyData(option.id, { selectedFluoridMaterial: m }); }} />
                      </div>
                    ))}
                    {filteredFluoridMat.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">Kein Material gefunden.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          );
        })()}

        {currentSubStepName === "materialauswahl" && (() => {
          const materialLikes = getLikesForMaterial(option.id);
          const rawMaterials = getMaterialOptions(option.id);
          const sortedMaterials = materialLikes.sortItems(rawMaterials);
          const filteredMaterials = materialSearch
            ? sortedMaterials.filter(m => m.toLowerCase().includes(materialSearch.toLowerCase()))
            : sortedMaterials;
          return (
            <>
              <h2 className="font-display text-2xl font-bold">{optionLabel} – Material</h2>
              <p className="text-sm text-muted-foreground">Welches Material wurde verwendet?</p>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Produkt suchen…"
                    value={materialSearch}
                    onChange={e => setMaterialSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => toast.info("Spracherkennung wird in einer zukünftigen Version verfügbar sein.")}
                  title="Spracheingabe (coming soon)"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {filteredMaterials.map(m => (
                  <div key={m} className={`flex items-center gap-3 rounded-lg border p-3 ${data.selectedMaterial === m ? "border-primary bg-primary/5" : "border-border"}`}>
                    <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => updateProphyData(option.id, { selectedMaterial: m })}>
                      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${data.selectedMaterial === m ? "border-primary" : "border-muted-foreground/40"}`}>
                        {data.selectedMaterial === m && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm">{m}</span>
                    </button>
                    <LikeButton liked={materialLikes.isLiked(m)} onClick={(e) => { e.preventDefault(); e.stopPropagation(); const wasLiked = materialLikes.isLiked(m); materialLikes.toggleLike(m); if (!wasLiked) updateProphyData(option.id, { selectedMaterial: m }); }} />
                  </div>
                ))}
                {filteredMaterials.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Kein Material gefunden.</p>
                )}
              </div>
            </>
          );
        })()}

        {currentSubStepName === "kieferauswahl" && (
          <>
            <h2 className="font-display text-2xl font-bold">{optionLabel} – Kieferauswahl</h2>
            <p className="text-sm text-muted-foreground">Welcher Kiefer wurde behandelt?</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {likesKiefer.sortItems(kiefer).map(k => (
                <div key={k} className={`flex items-center gap-3 rounded-lg border p-3 ${data.selectedKiefer === k ? "border-primary bg-primary/5" : "border-border"}`}>
                  <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => updateProphyData(option.id, { selectedKiefer: k })}>
                    <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${data.selectedKiefer === k ? "border-primary" : "border-muted-foreground/40"}`}>
                      {data.selectedKiefer === k && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <span className="text-sm">{k}</span>
                  </button>
                  <LikeButton liked={likesKiefer.isLiked(k)} onClick={(e) => { e.preventDefault(); e.stopPropagation(); const wasLiked = likesKiefer.isLiked(k); likesKiefer.toggleLike(k); if (!wasLiked) updateProphyData(option.id, { selectedKiefer: k }); }} />
                </div>
              ))}
            </div>
          </>
        )}

        {currentSubStepName === "material_mitgegeben" && (
          <>
            <h2 className="font-display text-2xl font-bold">Material für zu Hause mitgegeben?</h2>
            <div className="flex gap-3">
              <Button variant={data.materialMitgegeben ? "default" : "outline"} onClick={() => updateProphyData(option.id, { materialMitgegeben: true })}>Ja</Button>
              <Button variant={!data.materialMitgegeben ? "default" : "outline"} onClick={() => updateProphyData(option.id, { materialMitgegeben: false, materialMitgegebenAuswahl: "" })}>Nein</Button>
            </div>
            {data.materialMitgegeben && (
              <div className="grid gap-2">
                {likesMitgegeben.sortItems(["Calcium-Phosphat-Fluorid-Komplex", "Elmex Gelee"]).map(m => (
                    <div key={m} className={`flex items-center gap-3 rounded-lg border p-3 ${data.materialMitgegebenAuswahl === m ? "border-primary bg-primary/5" : "border-border"}`}>
                      <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => updateProphyData(option.id, { materialMitgegebenAuswahl: m })}>
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${data.materialMitgegebenAuswahl === m ? "border-primary" : "border-muted-foreground/40"}`}>
                          {data.materialMitgegebenAuswahl === m && <div className="h-2 w-2 rounded-full bg-primary" />}
                        </div>
                        <span className="text-sm">{m}</span>
                      </button>
                      <LikeButton liked={likesMitgegeben.isLiked(m)} onClick={(e) => { e.preventDefault(); e.stopPropagation(); const wasLiked = likesMitgegeben.isLiked(m); likesMitgegeben.toggleLike(m); if (!wasLiked) updateProphyData(option.id, { materialMitgegebenAuswahl: m }); }} />
                    </div>
                ))}
              </div>
            )}
          </>
        )}

        {currentSubStepName === "ergebnis" && (
          <>
            <h2 className="font-display text-2xl font-bold">MMP-8 Test – Ergebnis</h2>
            <p className="text-sm text-muted-foreground">Wie lautet das Testergebnis?</p>
            <div className="grid gap-2">
              {likesMmp8Ergebnis.sortItems(mmp8Ergebnisse).map(ergebnis => (
                <div key={ergebnis} className={`flex items-center gap-3 rounded-lg border p-3 ${data.mmp8Ergebnis === ergebnis ? "border-primary bg-primary/5" : "border-border"}`}>
                  <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => updateProphyData(option.id, { mmp8Ergebnis: ergebnis })}>
                    <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${data.mmp8Ergebnis === ergebnis ? "border-primary" : "border-muted-foreground/40"}`}>
                      {data.mmp8Ergebnis === ergebnis && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <span className="text-sm">{ergebnis}</span>
                  </button>
                  <LikeButton liked={likesMmp8Ergebnis.isLiked(ergebnis)} onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); const wasLiked = likesMmp8Ergebnis.isLiked(ergebnis); likesMmp8Ergebnis.toggleLike(ergebnis); if (!wasLiked) updateProphyData(option.id, { mmp8Ergebnis: ergebnis }); }} />
                </div>
              ))}
            </div>
          </>
        )}
        {currentSubStepName === "notes" && (
          <>
            <h2 className="font-display text-2xl font-bold">{optionLabel} – Notizen</h2>
            <p className="text-sm text-muted-foreground">Ergänzende Dokumentation (optional)</p>
            <Textarea
              value={data.notes}
              onChange={e => updateProphyData(option.id, { notes: e.target.value })}
              placeholder="Befund, Besonderheiten, Verlauf..."
              className="min-h-[120px]"
            />
          </>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={goBackSubStep}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
          </Button>
          <Button onClick={advanceSubStep} disabled={!canAdvance}>
            Weiter <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const getMaterialOptions = (optionId: string): string[] => {
    // Check all categories for embedded materialien first
    for (const catId of Object.keys(getCategoryOptions("DIAG") ? {} : {})) { /* skip */ }
    const option = (() => {
      for (const catId of selectedArten) {
        const found = getCategoryOptions(catId).find(o => o.id === optionId);
        if (found) return found;
      }
      return undefined;
    })();
    if (option) {
      const mats = getMaterialsForOption(option);
      if (mats.length > 0) return mats;
    }
    // Legacy fallback
    switch (optionId) {
      case "MUNDSPUELUNG": return mundspuelungMaterialien;
      case "SCHLEIMHAUT": return schleimhautMaterialien;
      case "FLUORID_SCHIENE": return fluoridierungMaterialien;
      case "UEBEREMPFINDLICH": return ueberempfindlichMaterialien;
      case "SUBGINGIVAL": return subgingivalMaterialien;
      case "MMP8": return ["MMP-8 Testkit (Verbrauchsmaterial)"];
      case "SCHARFE_KANTEN": return ["Finierstreifen", "Polierer (Kelch/Bürste)", "Diamantbohrer (fein)"];
      default: return [];
    }
  };

  /** Small team bar showing behandler + assistants, visible during workflow */
  const renderTeamBar = () => {
    if (step === "team" || step === "done") return null;
    const assistants = selectedAssistants.map(id => availableAssistants.find(a => a.id === id)).filter(Boolean) as StaffMember[];
    return (
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
          <img src={currentBehandler.photo} alt={currentBehandler.name} className="h-7 w-7 rounded-full object-cover border-2 border-primary" />
          <span className="text-xs font-medium">{currentBehandler.name}</span>
        </div>
        {assistants.map(a => (
          <div key={a.id} className="flex items-center gap-2 rounded-full bg-accent px-3 py-1">
            <img src={a.photo} alt={a.name} className="h-7 w-7 rounded-full object-cover border-2 border-accent-foreground/20" />
            <span className="text-xs font-medium">{a.name}</span>
            <button
              type="button"
              className="ml-0.5 rounded-full hover:bg-destructive/10 p-0.5"
              onClick={() => setSelectedAssistants(prev => prev.filter(x => x !== a.id))}
              title="Entfernen"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setShowAssistantPicker(true)}
          className="flex items-center gap-1 rounded-full border-2 border-dashed border-muted-foreground/30 px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <Plus className="h-3 w-3" /> Assistenz
        </button>
        {showAssistantPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAssistantPicker(false)}>
            <Card className="p-4 w-80 max-w-[90vw]" onClick={e => e.stopPropagation()}>
              <h3 className="font-semibold mb-3">Assistenz hinzufügen</h3>
              <div className="space-y-2">
                {availableAssistants.filter(a => !selectedAssistants.includes(a.id)).map(a => (
                  <button
                    key={a.id}
                    type="button"
                    className="flex items-center gap-3 w-full rounded-lg border p-3 hover:border-primary hover:bg-primary/5 transition-colors"
                    onClick={() => { setSelectedAssistants(prev => [...prev, a.id]); setShowAssistantPicker(false); }}
                  >
                    <img src={a.photo} alt={a.name} className="h-10 w-10 rounded-full object-cover" />
                    <span className="text-sm font-medium">{a.name}</span>
                  </button>
                ))}
                {availableAssistants.filter(a => !selectedAssistants.includes(a.id)).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">Alle Assistenten bereits ausgewählt.</p>
                )}
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => setShowAssistantPicker(false)}>Schließen</Button>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case "team":
        return (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold">Wer behandelt heute?</h2>
            <div>
              <p className="text-sm text-muted-foreground mb-3">Behandler:in (eingeloggt)</p>
              <div className="flex items-center gap-4 rounded-lg border-2 border-primary bg-primary/5 p-4">
                <img src={currentBehandler.photo} alt={currentBehandler.name} className="h-14 w-14 rounded-full object-cover border-2 border-primary" />
                <div>
                  <p className="font-semibold">{currentBehandler.name}</p>
                  <p className="text-sm text-muted-foreground">Behandler:in</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-3">Assistenz auswählen</p>
              <div className="grid grid-cols-3 gap-3">
                {availableAssistants.map(a => {
                  const selected = selectedAssistants.includes(a.id);
                  const nameParts = a.name.split(" ");
                  const firstName = nameParts[0];
                  const lastName = nameParts.slice(1).join(" ");
                  return (
                    <button
                      key={a.id}
                      type="button"
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors text-center ${selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                      onClick={() => setSelectedAssistants(prev => selected ? prev.filter(x => x !== a.id) : [...prev, a.id])}
                    >
                      <div className="relative">
                        <img src={a.photo} alt={a.name} className="h-12 w-12 rounded-full object-cover" />
                        {selected && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium leading-tight">{firstName}</p>
                        {lastName && <p className="text-xs font-medium leading-tight">{lastName}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <Button onClick={() => setStep("action")}>
              Weiter <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case "action":
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Was möchtest Du tun?</h2>
            <p className="text-muted-foreground">Willkommen, {currentBehandler.name}!</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="cursor-pointer p-6 hover:border-primary hover:shadow-md transition-all" onClick={() => setStep("patient")}>
                <FileText className="h-8 w-8 text-primary" />
                <h3 className="mt-3 font-semibold">Eine Behandlung abrechnen und dokumentieren</h3>
                <p className="mt-1 text-sm text-muted-foreground">Erstelle Abrechnung und Dokumentation für eine durchgeführte Behandlung.</p>
              </Card>
              <Card className="cursor-pointer p-6 hover:border-primary hover:shadow-md transition-all opacity-60" onClick={() => toast.info("Coming soon")}>
                <FileText className="h-8 w-8 text-muted-foreground" />
                <h3 className="mt-3 font-semibold text-muted-foreground">Einen Heil- und Kostenplan erstellen</h3>
                <p className="mt-1 text-sm text-muted-foreground">Coming soon</p>
              </Card>
            </div>
          </div>
        );

      case "patient":
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Patientenauswahl</h2>
            <Label>Patientennummer eingeben</Label>
            <Input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="z.B. 123456…"
              value={patientId}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setPatientId(val);
              }}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button onClick={() => patientId && setStep("kostentraeger")} disabled={!patientId}>
              Weiter <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case "kostentraeger":
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Kostenträger</h2>
            <p className="text-sm text-muted-foreground">
              Wie ist der Patient versichert? Dies bestimmt die anwendbaren Abrechnungsregeln
              (BEMA für GKV, GOZ/GOÄ für PKV/Selbstzahler).
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {([
                { id: "PKV" as Kostentraeger, label: "PKV / Beihilfe", desc: "Abrechnung nach GOZ/GOÄ mit Steigerungsfaktoren" },
                { id: "GKV" as Kostentraeger, label: "GKV (Kasse)", desc: "Abrechnung nach BEMA, ggf. Mehrkostenvereinbarung" },
                { id: "Selbstzahler" as Kostentraeger, label: "Selbstzahler", desc: "Freie Vereinbarung, Abrechnung nach GOZ" },
              ]).map(kt => (
                <button
                  key={kt.id}
                  type="button"
                  className={`flex flex-col items-start rounded-lg border-2 p-4 text-left transition-colors ${kostentraeger === kt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  onClick={() => setKostentraeger(kt.id)}
                >
                  <span className="text-sm font-semibold">{kt.label}</span>
                  <span className="text-xs text-muted-foreground mt-1">{kt.desc}</span>
                </button>
              ))}
            </div>
            {kostentraeger === "GKV" && (
              <div className="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3 text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200">⚠ GKV-Hinweis</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Privatleistungen (z.B. PZR, Komposit-Mehrkosten) erfordern eine schriftliche Mehrkostenvereinbarung
                  gemäß §28 SGB V bzw. §8 Abs. 7 BMV-Z <em>vor</em> Behandlungsbeginn.
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("patient")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
              </Button>
              <Button onClick={() => setStep("date")} disabled={!kostentraeger}>
                Weiter <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "date":
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Wann fand die Behandlung statt?</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant={dateOption === "heute" ? "default" : "outline"} onClick={() => { setDateOption("heute"); setTreatmentDate(new Date()); setStep("behandlungsart"); }}>Heute</Button>
              <Button variant={dateOption === "gestern" ? "default" : "outline"} onClick={() => { setDateOption("gestern"); const d = new Date(); d.setDate(d.getDate() - 1); setTreatmentDate(d); setStep("behandlungsart"); }}>Gestern</Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={dateOption === "kalender" ? "default" : "outline"}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Anderes Datum
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={treatmentDate}
                    onSelect={d => { if (d) { setTreatmentDate(d); setDateOption("kalender"); setStep("behandlungsart"); }}}
                    locale={de}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            {dateOption && (
              <p className="text-sm text-muted-foreground">Gewählt: {format(treatmentDate, "dd.MM.yyyy", { locale: de })}</p>
            )}
          </div>
        );

      case "behandlungsart":
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Behandlungsarten auswählen</h2>
            <p className="text-sm text-muted-foreground">Wähle alles aus, was Du gemacht hast.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {behandlungsArten.map(ba => (
                <label key={ba.id} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${selectedArten.includes(ba.id) ? "border-primary bg-primary/5" : "border-border"}`}>
                  <Checkbox
                    checked={selectedArten.includes(ba.id)}
                    onCheckedChange={(checked) => {
                      setSelectedArten(prev => checked ? [...prev, ba.id] : prev.filter(x => x !== ba.id));
                    }}
                  />
                  <span className="text-sm font-medium">{ba.name}</span>
                </label>
              ))}
            </div>
            <Button onClick={() => {
              if (selectedArten.length === 0) return;
              // Navigate to the first selected category's option selection
              setStep("prophy_auswahl");
            }} disabled={selectedArten.length === 0}>
              Weiter <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case "prophy_auswahl": {
        const catLabel = getCategoryLabel(currentCategoryId);
        const catOptions = currentCatOpts;
        const catSelected = currentCatSelectedOpts;
        const toggleOption = (id: string) => {
          setSelectedOptions(prev => {
            const current = prev[currentCategoryId] || [];
            return { ...prev, [currentCategoryId]: current.includes(id) ? current.filter(x => x !== id) : [...current, id] };
          });
        };
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Kategorie {currentArtenIdx + 1}/{selectedArten.length}
              </span>
              <span>{catLabel}</span>
            </div>
            <h2 className="font-display text-2xl font-bold">{catLabel} – Was wurde durchgeführt?</h2>
            <p className="text-sm text-muted-foreground">Wähle alle durchgeführten Maßnahmen aus.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {catOptions.map(opt => (
                <label key={opt.id} className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${catSelected.includes(opt.id) ? "border-primary bg-primary/5" : "border-border"}`}>
                  <Checkbox
                    checked={catSelected.includes(opt.id)}
                    onCheckedChange={() => toggleOption(opt.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium">{opt.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.beschreibung}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{catSelected.length} Maßnahme(n) ausgewählt</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => {
                if (currentArtenIdx > 0) {
                  setCurrentArtenIdx(currentArtenIdx - 1);
                } else {
                  setStep("behandlungsart");
                }
              }}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
              </Button>
              <Button onClick={startProphySubSteps} disabled={catSelected.length === 0}>
                Weiter <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      }

      case "prophy_sub":
        return renderProphySubStep();

      case "mehrkosten":
        return renderMehrkostenStep();

      case "hkp":
        return renderHkpStep();

      case "review":
        return (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold">Prüfung der Abrechnung</h2>
            <Card className="p-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Patient:</span><span className="font-medium">{patientId}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Datum:</span><span className="font-medium">{format(treatmentDate, "dd.MM.yyyy")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Behandler:in:</span><span className="font-medium">{currentBehandler.name}</span></div>
                {selectedAssistants.length > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Assistenz:</span><span className="font-medium">{selectedAssistants.map(id => availableAssistants.find(a => a.id === id)?.name).join(", ")}</span></div>
                )}
                <div className="flex justify-between"><span className="text-muted-foreground">Kostenträger:</span><span className="font-medium">{kostentraeger}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Behandlungskategorien:</span><span className="font-medium">{selectedArten.map(id => getCategoryLabel(id)).join(", ")}</span></div>
              </div>
            </Card>

            {selectedArten.map(catId => {
              const catOpts = getCategoryOptions(catId);
              const catSel = selectedOptions[catId] || [];
              if (catSel.length === 0) return null;
              return (
                <div key={catId} className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">{getCategoryLabel(catId)}</h3>
                  {catSel.map(optId => {
                    const opt = catOpts.find(o => o.id === optId);
                    const data = getProphyData(optId);
                    if (!opt) return null;
                    return (
                      <Card key={optId} className="p-4">
                        <h4 className="font-semibold text-sm mb-2">{opt.name}</h4>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {data.selectedTeeth.length > 0 && <p>Zähne: {getTeethSegmentLabel(data.selectedTeeth)}</p>}
                          {data.selectedTechniken.length > 0 && <p>Techniken: {data.selectedTechniken.join(", ")}</p>}
                          {data.selectedPulver && <p>Strahlpulver: {data.selectedPulver}</p>}
                          {data.fluoridpiertJa === true && data.selectedFluoridMaterial && <p>Fluoridierung: {data.selectedFluoridMaterial}</p>}
                          {data.fluoridpiertJa === false && <p>Fluoridierung: Nein</p>}
                          {data.selectedMaterial && <p>Material: {data.selectedMaterial}</p>}
                          {data.selectedKiefer && <p>Kiefer: {data.selectedKiefer}</p>}
                          {data.mmp8Ergebnis && <p>Ergebnis: {data.mmp8Ergebnis}</p>}
                          {data.materialMitgegeben && <p>Material mitgegeben: {data.materialMitgegebenAuswahl || "Ja"}</p>}
                          {data.notes && <p>Notizen: {data.notes}</p>}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              );
            })}

            <Card className="p-6">
              <h3 className="font-semibold mb-1">
                Abrechnungspositionen ({kostentraeger === "GKV" ? "BEMA / GOZ" : "GOZ"}) – Faktoren anpassen
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {kostentraeger === "GKV"
                  ? "GKV-Leistungen werden nach BEMA (Punktwert × " + BEMA_PUNKTWERT.toFixed(4) + " €) abgerechnet. Privatleistungen weiterhin nach GOZ."
                  : "Klicke auf das Faktor-Feld, um den Faktor zu ändern und eine Begründung auszuwählen."}
              </p>
              <div className="space-y-4">
                {gesamt.map((l, i) => {
                  const goz = gozCodes.find(g => g.nr === l.nr);
                  const isEditable = !l.isVM && !!goz;
                  const isOpen = openBegruendungen[l.nr] || false;
                  const override = faktorOverrides[l.nr];
                  const selectedBegruendungen = override?.begruendungen || [];

                  return (
                    <div key={i} className="border-b border-border pb-3 last:border-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="text-sm font-medium">{l.isBema ? l.nr : `GOZ ${l.nr}`}</span>
                          {l.isBema && l.punkte && <span className="text-[10px] text-muted-foreground ml-1">({l.punkte} Pkt.)</span>}
                          <p className="text-xs text-muted-foreground">{l.bezeichnung}</p>
                          {l.hinweis && <p className="text-[10px] text-amber-600 mt-0.5">⚠ {l.hinweis}</p>}
                        </div>
                        <span className="font-semibold text-sm ml-4">{l.betrag.toFixed(2)} €</span>
                      </div>

                      {/* Per-position team assignment */}
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5">
                          <img src={currentBehandler.photo} alt={currentBehandler.name} className="h-5 w-5 rounded-full object-cover" />
                          <span className="text-[10px] font-medium">{currentBehandler.kuerzel}</span>
                        </div>
                        {(positionAssistants[l.nr] || selectedAssistants).map(aId => {
                          const a = availableAssistants.find(x => x.id === aId);
                          if (!a) return null;
                          return (
                            <div key={a.id} className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5">
                              <img src={a.photo} alt={a.name} className="h-5 w-5 rounded-full object-cover" />
                              <span className="text-[10px] font-medium">{a.kuerzel}</span>
                              <button
                                type="button"
                                className="ml-0.5 hover:text-destructive"
                                onClick={() => {
                                  const current = positionAssistants[l.nr] || [...selectedAssistants];
                                  setPositionAssistants(prev => ({ ...prev, [l.nr]: current.filter(x => x !== a.id) }));
                                }}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })}
                        <button
                          type="button"
                          className="flex items-center gap-0.5 rounded-full border border-dashed border-muted-foreground/30 px-2 py-0.5 text-[10px] text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                          onClick={() => setOpenPositionAssistantPicker(openPositionAssistantPicker === l.nr ? null : l.nr)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        {openPositionAssistantPicker === l.nr && (
                          <div className="basis-full mt-1">
                            <div className="flex flex-wrap gap-1.5 rounded-md border border-border bg-muted/30 p-2">
                              {availableAssistants
                                .filter(a => !(positionAssistants[l.nr] || selectedAssistants).includes(a.id))
                                .map(a => (
                                  <button
                                    key={a.id}
                                    type="button"
                                    className="flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs hover:border-primary hover:bg-primary/5 transition-colors"
                                    onClick={() => {
                                      const current = positionAssistants[l.nr] || [...selectedAssistants];
                                      setPositionAssistants(prev => ({ ...prev, [l.nr]: [...current, a.id] }));
                                      setOpenPositionAssistantPicker(null);
                                    }}
                                  >
                                    <img src={a.photo} alt={a.name} className="h-5 w-5 rounded-full object-cover" />
                                    <span>{a.name}</span>
                                  </button>
                                ))}
                              {availableAssistants.filter(a => !(positionAssistants[l.nr] || selectedAssistants).includes(a.id)).length === 0 && (
                                <span className="text-xs text-muted-foreground">Alle zugewiesen</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {isEditable && !l.isBema ? (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-3">
                            <Label className="text-xs whitespace-nowrap">Faktor:</Label>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="9.9"
                              value={override?.faktor ?? l.faktor}
                              onChange={(e) => updateFaktor(l.nr, e.target.value)}
                              onBlur={() => {
                                const current = faktorOverrides[l.nr]?.faktor ?? l.faktor;
                                if (current < 1) {
                                  toast.warning("Faktor unter 1,0 nicht erlaubt");
                                }
                              }}
                              onFocus={() => setOpenBegruendungen(prev => ({ ...prev, [l.nr]: true }))}
                              className="w-20 h-8 text-sm"
                            />
                            <span className="text-xs text-muted-foreground">× {l.anzahl} × {l.betrag1fach.toFixed(2)} €</span>
                            {(override?.faktor ?? l.faktor) < 1 && (
                              <span className="text-xs text-destructive font-medium">⚠ Faktor unter 1,0 nicht erlaubt</span>
                            )}
                            {goz && (override?.faktor ?? l.faktor) >= 1 && (override?.faktor ?? l.faktor) > goz.begruendungAbFaktor && (
                              <button
                                type="button"
                                className="text-xs text-amber-600 font-medium hover:underline cursor-pointer"
                                onClick={() => setOpenBegruendungen(prev => ({ ...prev, [l.nr]: true }))}
                              >
                                ⚠ Begründung ab {goz.begruendungAbFaktor}×
                              </button>
                            )}
                          </div>

                          {isOpen && (
                            <div className="mt-2 rounded-md border border-border bg-muted/30 p-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-medium">Begründung(en) auswählen:</p>
                                <button type="button" onClick={() => setOpenBegruendungen(prev => ({ ...prev, [l.nr]: false }))} className="text-xs text-muted-foreground hover:text-foreground">Schließen</button>
                              </div>
                              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                {(() => {
                                  const codes = getAvailableBegruendungen(l.nr);
                                  // Put non-default codes first, defaults (202, 203) at the bottom
                                  const nonDefaults = codes.filter(c => !DEFAULT_BEGRUENDUNGEN.includes(c));
                                  const defaults = codes.filter(c => DEFAULT_BEGRUENDUNGEN.includes(c));
                                  const sorted = [...nonDefaults, ...defaults];
                                  return sorted.map(code => {
                                    const isDefault = DEFAULT_BEGRUENDUNGEN.includes(code);
                                    return (
                                      <label key={code} className={`flex items-start gap-2 rounded p-1.5 cursor-pointer text-xs ${selectedBegruendungen.includes(code) ? "bg-primary/10" : ""}`}>
                                        <Checkbox
                                          checked={selectedBegruendungen.includes(code)}
                                          onCheckedChange={() => toggleBegruendung(l.nr, code)}
                                          className="mt-0.5"
                                        />
                                        <span className="flex-1"><strong>{code}</strong> – {begruendungsTexte[code] || code}</span>
                                        {isDefault && <span className="text-[10px] text-muted-foreground italic whitespace-nowrap ml-1">vorausgewählt</span>}
                                      </label>
                                    );
                                  });
                                })()}
                              </div>
                              <p className="text-[10px] text-muted-foreground italic text-right mt-2">Begr. 202 und 203 wegen Häufigkeit regelm. vorausgewählt.</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">
                          {l.isBema ? `${l.punkte} Pkt. × ${BEMA_PUNKTWERT.toFixed(4)} € × ${l.anzahl}` : `Faktor ${l.faktor} × ${l.anzahl}`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-between border-t border-border pt-3 font-bold">
                <span>Gesamt</span>
                <span>{gesamtBetrag.toFixed(2)} €</span>
              </div>
            </Card>

            <div>
              <Label>Ergänzende Notizen (optional)</Label>
              <Textarea value={globalNotes} onChange={e => setGlobalNotes(e.target.value)} placeholder="Weitere Anmerkungen zur Behandlung..." className="mt-2" />
            </div>

            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Behandlungsdokumentation</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Möchtest Du Änderungen an der Behandlungsdokumentation eintragen?
              </p>
              <Textarea
                value={dokumentation}
                onChange={e => setDokumentation(e.target.value)}
                className="min-h-[280px] font-mono text-sm bg-background"
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setDokuGenerated(false);
                  setDokumentation(generateDokumentation());
                  setDokuGenerated(true);
                  toast.success("Dokumentation wurde neu generiert.");
                }}
              >
                Dokumentation neu generieren
              </Button>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => {
                if (needsHkp) {
                  setStep("hkp");
                } else if (needsMehrkosten) {
                  setStep("mehrkosten");
                } else {
                  const lastCatId = selectedArten[selectedArten.length - 1];
                  const lastCatOpts = selectedOptions[lastCatId] || [];
                  const lastOptId = lastCatOpts[lastCatOpts.length - 1];
                  if (lastOptId) {
                    const allOpts = getCategoryOptions(lastCatId);
                    const lastOptDef = allOpts.find(o => o.id === lastOptId);
                    if (lastOptDef) {
                      setCurrentArtenIdx(selectedArten.length - 1);
                      setCurrentSubStep({ optionId: lastOptId, subStepIndex: lastOptDef.subSteps.length - 1 });
                      setStep("prophy_sub");
                    }
                  }
                }
              }}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
              </Button>
              <Button onClick={() => setStep("email")}>
                Abrechnung abschließen <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Mehrkosten summary if applicable */}
            {needsMehrkosten && mehrkostenAkzeptiert && (
              <Card className="p-4 border-amber-300/50 bg-amber-50/50 dark:bg-amber-950/10">
                <h4 className="text-sm font-semibold mb-2">✓ Mehrkostenvereinbarung</h4>
                <div className="text-xs space-y-1">
                  {mehrkostenOptionen.map((mk, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{mk.optionName}</span>
                      <span className="text-muted-foreground">{mk.rechtsgrundlage}</span>
                    </div>
                  ))}
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Schriftliche Vereinbarung liegt vor. Kopie in Patientenakte.
                  </p>
                </div>
              </Card>
            )}

            {/* HKP summary if applicable */}
            {needsHkp && hkpZeilen.length > 0 && (
              <Card className="p-4 border-primary/20 bg-primary/5">
                <h4 className="text-sm font-semibold mb-2">HKP-Zusammenfassung</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between"><span>Festzuschüsse ({hkpZeilen.length} Befunde):</span><span className="font-medium">{hkpFestzuschussGesamt.toFixed(2)} €</span></div>
                  <div className="flex justify-between"><span>Bonus:</span><span>{hkpBonusStufe === "kein" ? "keiner" : `${hkpBonusStufe}%`}</span></div>
                  <div className="flex justify-between font-bold"><span>Eigenanteil:</span><span>{hkpEigenanteil.toFixed(2)} €</span></div>
                </div>
              </Card>
            )}
            {needsHkp && hkpParAntragsTyp && (
              <Card className="p-4 border-primary/20 bg-primary/5">
                <h4 className="text-sm font-semibold mb-1">PAR-Antrag</h4>
                <p className="text-xs text-muted-foreground">
                  {parAntragsTypen.find(t => t.id === hkpParAntragsTyp)?.bezeichnung}
                  {hkpParGrad && ` | Grad ${hkpParGrad}`}
                  {hkpParStadium && ` | Stadium ${hkpParStadium}`}
                </p>
              </Card>
            )}
          </div>
        );

      case "email":
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Dokumente versenden</h2>
            <p className="text-muted-foreground">An welche E-Mail-Adresse sollen Abrechnung und Dokumentation gesendet werden?</p>
            <Label>E-Mail-Adresse</Label>
            <Input type="email" placeholder="arzt@praxis.de" value={email} onChange={e => setEmail(e.target.value)} />
            <Button onClick={() => { toast.success("Abrechnung und Dokumentation wurden erfolgreich an " + email + " gesendet! (Prototyp – kein tatsächlicher Versand)"); setStep("done"); }} disabled={!email}>
              <Mail className="mr-2 h-4 w-4" /> Dokumente senden
            </Button>
          </div>
        );

      case "done":
        return (
          <div className="space-y-4 text-center py-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="font-display text-2xl font-bold">Fertig!</h2>
            <p className="text-muted-foreground">Abrechnung ({gesamtBetrag.toFixed(2)} €) und Dokumentation wurden an {email} gesendet.</p>
            <p className="text-xs text-muted-foreground">(Prototyp – Es wurde keine tatsächliche E-Mail versendet)</p>
            <div className="flex justify-center gap-3 mt-6">
              <Button onClick={() => {
                setStep("team"); setPatientId(""); setSelectedArten([]); setKostentraeger("");
                setSelectedOptions({}); setProphyData({}); setCurrentArtenIdx(0);
                setGlobalNotes(""); setEmail(""); setDateOption("");
                setDokumentation(""); setDokuGenerated(false); setFaktorOverrides({}); setOpenBegruendungen({});
                setSelectedAssistants([]); setPositionAssistants({}); setMehrkostenAkzeptiert(false);
                setSignaturPatient(null); setSignaturArzt(null);
              }}>
                Neue Behandlung
              </Button>
              <Button variant="outline" onClick={() => navigate("/historie")}>
                Zur Historie
              </Button>
            </div>
          </div>
        );
    }
  };

  // Progress bar
  const getProgressSteps = (): { name: string; key: string }[] => {
    const steps = [
      { name: "Team", key: "team" },
      { name: "Aktion", key: "action" },
      { name: "Patient", key: "patient" },
      { name: "Kostenträger", key: "kostentraeger" },
      { name: "Datum", key: "date" },
      { name: "Behandlung", key: "behandlungsart" },
      { name: "Details", key: "prophy_sub" },
      ...(needsMehrkosten ? [{ name: "Mehrkosten", key: "mehrkosten" }] : []),
      ...(needsHkp ? [{ name: "HKP", key: "hkp" }] : []),
      { name: "Prüfung", key: "review" },
      { name: "Versand", key: "email" },
      { name: "Fertig", key: "done" },
    ];
    return steps;
  };

  const progressSteps = getProgressSteps();
  const currentIdx = progressSteps.findIndex(s => s.key === step);

  return (
    <Layout compact hideFooter>
      <div className="container py-8 px-4 max-w-full overflow-x-hidden">
        <h1 className="font-display text-3xl font-bold mb-2">Dokumentation & Abrechnung</h1>
        <p className="text-muted-foreground mb-6">Praxis {currentBehandler.name} · Musterstr. 1 · 12345 Kusterhausen</p>

        {/* Progress */}
        <div className="mb-8 flex items-center gap-1 overflow-x-auto pb-2">
          {progressSteps.map((s, i) => {
            const canClick = i < currentIdx && step !== "done";
            return (
              <div key={s.key} className="flex items-center">
                <button
                  type="button"
                  disabled={!canClick}
                  onClick={() => {
                    if (!canClick) return;
                    const targetStep = s.key as Step;
                    if (targetStep === "prophy_sub") {
                      // Go to first sub-step of first selected option
                      if (selectedProphyOptionen.length > 0) {
                        setCurrentSubStep({ optionId: selectedProphyOptionen[0], subStepIndex: 0 });
                      }
                    }
                    setStep(targetStep === "prophy_auswahl" ? "prophy_auswahl" : targetStep);
                  }}
                  className={`flex h-7 items-center rounded-full px-3 text-xs font-medium whitespace-nowrap transition-colors ${
                    i < currentIdx ? "bg-primary text-primary-foreground" :
                    i === currentIdx ? "bg-accent text-accent-foreground" :
                    "bg-muted text-muted-foreground"
                  } ${canClick ? "cursor-pointer hover:opacity-80" : ""}`}
                >
                  {i < currentIdx ? <Check className="h-3 w-3 mr-1" /> : null}
                  {s.name}
                </button>
{i < progressSteps.length - 1 && (
                  <svg className="mx-0.5 w-3 h-3 text-muted-foreground/50" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 6 L8 6 M6 3 L9 6 L6 9" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {renderTeamBar()}

        <Card className="p-6 md:p-8">
          {renderStep()}
        </Card>
      </div>
    </Layout>
  );
}
