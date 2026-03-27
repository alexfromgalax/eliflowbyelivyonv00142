// Dental chart types for PZR documentation

export type ToothSurface = 'bukkal' | 'lingual' | 'mesial' | 'distal' | 'okklusal';

export type MarkingMode = 'plaque' | 'calculus' | 'bop' | 'stain' | 'cleaned' | 'select';

export interface SurfaceFindings {
  plaque: boolean;
  calculus: 'none' | 'supragingival' | 'subgingival';
  bop: boolean;
  stain: boolean;
  cleaned: boolean;
}

export interface PocketDepths {
  MB: number | null; // mesio-bukkal
  B: number | null;  // bukkal
  DB: number | null; // disto-bukkal
  ML: number | null; // mesio-lingual
  L: number | null;  // lingual
  DL: number | null; // disto-lingual
}

export interface ToothData {
  id: string; // FDI number e.g. "11"
  selected: boolean;
  missing: boolean;
  surfaces: Record<ToothSurface, SurfaceFindings>;
  pocketDepths: PocketDepths;
}

export const SURFACES: ToothSurface[] = ['bukkal', 'lingual', 'mesial', 'distal', 'okklusal'];

export const emptySurfaceFindings = (): SurfaceFindings => ({
  plaque: false,
  calculus: 'none',
  bop: false,
  stain: false,
  cleaned: false,
});

export const emptyPocketDepths = (): PocketDepths => ({
  MB: null, B: null, DB: null, ML: null, L: null, DL: null,
});

export const createToothData = (id: string): ToothData => ({
  id,
  selected: false,
  missing: false,
  surfaces: {
    bukkal: emptySurfaceFindings(),
    lingual: emptySurfaceFindings(),
    mesial: emptySurfaceFindings(),
    distal: emptySurfaceFindings(),
    okklusal: emptySurfaceFindings(),
  },
  pocketDepths: emptyPocketDepths(),
});

// Color mapping for marking modes
export const MARKING_COLORS: Record<string, string> = {
  plaque: '#EAB308',      // gelb
  calculus_supra: '#92400E', // braun
  calculus_sub: '#78716C',   // grau-braun
  bop: '#DC2626',          // rot
  stain: '#9CA3AF',        // grau
  cleaned: '#22C55E',      // grün
};

export const MARKING_LABELS: Record<MarkingMode, string> = {
  plaque: 'Plaque',
  calculus: 'Zahnstein',
  bop: 'Blutung (BOP)',
  stain: 'Verfärbung',
  cleaned: 'Gereinigt',
  select: 'Auswählen',
};

// Upper jaw teeth (right to left from patient perspective)
export const UPPER_TEETH = ['18','17','16','15','14','13','12','11','21','22','23','24','25','26','27','28'];
// Lower jaw teeth
export const LOWER_TEETH = ['48','47','46','45','44','43','42','41','31','32','33','34','35','36','37','38'];

export interface DentalIndices {
  api: number | null;        // Approximal Plaque Index %
  bopPercent: number | null; // Bleeding on Probing %
  plaquePercent: number | null;
}

export function calculateIndices(teeth: Record<string, ToothData>): DentalIndices {
  const activeTeeth = Object.values(teeth).filter(t => t.selected && !t.missing);
  if (activeTeeth.length === 0) return { api: null, bopPercent: null, plaquePercent: null };

  // API: approximal surfaces (mesial + distal) with plaque / total approximal surfaces
  let approxTotal = 0;
  let approxPlaque = 0;
  let surfaceTotal = 0;
  let surfacePlaque = 0;
  let bopTotal = 0;
  let bopPositive = 0;

  for (const tooth of activeTeeth) {
    for (const surface of SURFACES) {
      const f = tooth.surfaces[surface];
      surfaceTotal++;
      if (f.plaque) surfacePlaque++;

      if (surface === 'mesial' || surface === 'distal') {
        approxTotal++;
        if (f.plaque) approxPlaque++;
      }

      // BOP on all surfaces
      bopTotal++;
      if (f.bop) bopPositive++;
    }
  }

  return {
    api: approxTotal > 0 ? Math.round((approxPlaque / approxTotal) * 100) : null,
    bopPercent: bopTotal > 0 ? Math.round((bopPositive / bopTotal) * 100) : null,
    plaquePercent: surfaceTotal > 0 ? Math.round((surfacePlaque / surfaceTotal) * 100) : null,
  };
}

export function getApiBewertung(api: number): string {
  if (api <= 25) return 'Optimal';
  if (api <= 39) return 'Gut';
  if (api <= 69) return 'Verbesserungswürdig';
  return 'Unzureichend';
}

export function getBopBewertung(bop: number): string {
  if (bop <= 10) return 'Gesund';
  if (bop <= 25) return 'Leichte Entzündung';
  if (bop <= 50) return 'Moderate Entzündung';
  return 'Schwere Entzündung';
}
