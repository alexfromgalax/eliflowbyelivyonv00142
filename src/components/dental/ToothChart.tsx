import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ToothData, ToothSurface, MarkingMode, UPPER_TEETH, LOWER_TEETH,
  createToothData, MARKING_LABELS, MARKING_COLORS, calculateIndices,
  getApiBewertung, getBopBewertung, DentalIndices,
} from './types';
import ToothDiagram from './ToothDiagram';
import {
  MousePointer2, Droplets, CircleDot, Paintbrush, Sparkles, CheckCircle2,
  XCircle, RotateCcw,
} from 'lucide-react';

interface ToothChartProps {
  /** Called when selection or data changes. Returns selected tooth IDs + full data. */
  onDataChange?: (selectedTeeth: string[], teethData: Record<string, ToothData>) => void;
  /** Initial selected teeth */
  initialSelectedTeeth?: string[];
  /** Show pocket depth inputs */
  showPocketDepths?: boolean;
  /** Show indices panel */
  showIndices?: boolean;
  /** Compact mode (just selection, no findings) */
  compact?: boolean;
}

const MODES: { mode: MarkingMode; icon: React.ReactNode; color: string }[] = [
  { mode: 'select', icon: <MousePointer2 className="h-4 w-4" />, color: 'bg-primary' },
  { mode: 'plaque', icon: <Droplets className="h-4 w-4" />, color: 'bg-yellow-500' },
  { mode: 'calculus', icon: <CircleDot className="h-4 w-4" />, color: 'bg-amber-800' },
  { mode: 'bop', icon: <Paintbrush className="h-4 w-4" />, color: 'bg-red-600' },
  { mode: 'stain', icon: <Sparkles className="h-4 w-4" />, color: 'bg-gray-400' },
  { mode: 'cleaned', icon: <CheckCircle2 className="h-4 w-4" />, color: 'bg-green-500' },
];

// Quadrant definitions (FDI)
const Q1_TEETH = ['18','17','16','15','14','13','12','11']; // upper right
const Q2_TEETH = ['21','22','23','24','25','26','27','28']; // upper left
const Q3_TEETH = ['31','32','33','34','35','36','37','38']; // lower left
const Q4_TEETH = ['48','47','46','45','44','43','42','41']; // lower right

export default function ToothChart({
  onDataChange,
  initialSelectedTeeth = [],
  showPocketDepths = true,
  showIndices = true,
  compact = false,
}: ToothChartProps) {
  // Initialize teeth data
  const [teethData, setTeethData] = useState<Record<string, ToothData>>(() => {
    const data: Record<string, ToothData> = {};
    [...UPPER_TEETH, ...LOWER_TEETH].forEach(id => {
      const td = createToothData(id);
      td.selected = initialSelectedTeeth.includes(id);
      data[id] = td;
    });
    return data;
  });

  const [markingMode, setMarkingMode] = useState<MarkingMode>('select');
  const [selectedToothDetail, setSelectedToothDetail] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastDragTooth = useRef<string | null>(null);

  const updateTeeth = useCallback((updater: (prev: Record<string, ToothData>) => Record<string, ToothData>) => {
    setTeethData(prev => {
      const next = updater(prev);
      const selected = Object.values(next).filter(t => t.selected).map(t => t.id);
      onDataChange?.(selected, next);
      return next;
    });
  }, [onDataChange]);

  const handleToothClick = useCallback((toothId: string) => {
    updateTeeth(prev => ({
      ...prev,
      [toothId]: { ...prev[toothId], selected: !prev[toothId].selected },
    }));
  }, [updateTeeth]);

  const handleSurfaceClick = useCallback((toothId: string, surface: ToothSurface) => {
    updateTeeth(prev => {
      const tooth = { ...prev[toothId] };
      const surfaces = { ...tooth.surfaces };
      const sf = { ...surfaces[surface] };

      // Auto-select tooth when marking
      tooth.selected = true;

      switch (markingMode) {
        case 'plaque': sf.plaque = !sf.plaque; break;
        case 'calculus':
          sf.calculus = sf.calculus === 'none' ? 'supragingival' :
                        sf.calculus === 'supragingival' ? 'subgingival' : 'none';
          break;
        case 'bop': sf.bop = !sf.bop; break;
        case 'stain': sf.stain = !sf.stain; break;
        case 'cleaned': sf.cleaned = !sf.cleaned; break;
      }

      surfaces[surface] = sf;
      tooth.surfaces = surfaces;
      return { ...prev, [toothId]: tooth };
    });
  }, [markingMode, updateTeeth]);

  // Apply current marking mode to a set of teeth (all surfaces)
  const applyModeToTeeth = useCallback((toothIds: string[]) => {
    updateTeeth(prev => {
      const next = { ...prev };
      toothIds.forEach(id => {
        if (next[id].missing) return;
        const tooth = { ...next[id] };
        if (markingMode === 'select') {
          tooth.selected = true;
        } else {
          tooth.selected = true;
          const surfaces = { ...tooth.surfaces };
          (['bukkal', 'lingual', 'mesial', 'distal', 'okklusal'] as ToothSurface[]).forEach(s => {
            const sf = { ...surfaces[s] };
            switch (markingMode) {
              case 'plaque': sf.plaque = true; break;
              case 'calculus': sf.calculus = sf.calculus === 'none' ? 'supragingival' : sf.calculus; break;
              case 'bop': sf.bop = true; break;
              case 'stain': sf.stain = true; break;
              case 'cleaned': sf.cleaned = true; break;
            }
            surfaces[s] = sf;
          });
          tooth.surfaces = surfaces;
        }
        next[id] = tooth;
      });
      return next;
    });
  }, [markingMode, updateTeeth]);

  const selectAll = () => applyModeToTeeth([...UPPER_TEETH, ...LOWER_TEETH]);

  const deselectAll = () => {
    updateTeeth(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(id => { next[id] = { ...next[id], selected: false }; });
      return next;
    });
  };

  const selectUpperJaw = () => applyModeToTeeth(UPPER_TEETH);
  const selectLowerJaw = () => applyModeToTeeth(LOWER_TEETH);
  const selectQuadrant = (q: number) => {
    const ids = q === 1 ? Q1_TEETH : q === 2 ? Q2_TEETH : q === 3 ? Q3_TEETH : Q4_TEETH;
    applyModeToTeeth(ids);
  };

  const toggleMissing = (toothId: string) => {
    updateTeeth(prev => ({
      ...prev,
      [toothId]: { ...prev[toothId], missing: !prev[toothId].missing, selected: false },
    }));
  };

  const resetAll = () => {
    updateTeeth(() => {
      const data: Record<string, ToothData> = {};
      [...UPPER_TEETH, ...LOWER_TEETH].forEach(id => { data[id] = createToothData(id); });
      return data;
    });
  };

  const updatePocketDepth = (toothId: string, point: string, value: string) => {
    const num = value === '' ? null : parseInt(value);
    if (num !== null && (isNaN(num) || num < 0 || num > 15)) return;
    updateTeeth(prev => ({
      ...prev,
      [toothId]: {
        ...prev[toothId],
        pocketDepths: { ...prev[toothId].pocketDepths, [point]: num },
      },
    }));
  };

  const selectedTeeth = Object.values(teethData).filter(t => t.selected && !t.missing);
  const indices = calculateIndices(teethData);

  // Handle mouse drag for fast marking in ALL modes
  const handleMouseDown = (toothId: string) => {
    setIsDragging(true);
    lastDragTooth.current = toothId;
  };
  const handleMouseUp = () => { setIsDragging(false); lastDragTooth.current = null; };

  const handleDragEnter = useCallback((toothId: string) => {
    if (!isDragging || lastDragTooth.current === toothId) return;
    lastDragTooth.current = toothId;
    if (markingMode === 'select') {
      // In select mode, toggle selection on drag
      updateTeeth(prev => ({
        ...prev,
        [toothId]: { ...prev[toothId], selected: true },
      }));
    } else {
      // In marking modes, apply marking to all surfaces
      (['bukkal', 'lingual', 'mesial', 'distal', 'okklusal'] as ToothSurface[]).forEach(s =>
        handleSurfaceClick(toothId, s)
      );
    }
  }, [isDragging, markingMode, handleSurfaceClick, updateTeeth]);

  const renderTeethRow = (toothIds: string[], isUpper: boolean) => (
    <div className="flex gap-0.5 justify-center flex-nowrap min-w-max">
      {toothIds.map(id => (
        <div
          key={id}
          onMouseDown={() => handleMouseDown(id)}
          onMouseEnter={() => handleDragEnter(id)}
        >
          <ToothDiagram
            tooth={teethData[id]}
            isUpper={isUpper}
            markingMode={compact ? 'select' : markingMode}
            onSurfaceClick={handleSurfaceClick}
            onToothClick={handleToothClick}
          />
        </div>
      ))}
    </div>
  );

  const renderLegend = () => (
    <div className="flex flex-wrap gap-3 text-xs">
      {[
        { label: 'Plaque', color: MARKING_COLORS.plaque },
        { label: 'Zahnstein (supra)', color: MARKING_COLORS.calculus_supra },
        { label: 'Zahnstein (sub)', color: MARKING_COLORS.calculus_sub },
        { label: 'Blutung', color: MARKING_COLORS.bop },
        { label: 'Verfärbung', color: MARKING_COLORS.stain },
        { label: 'Gereinigt', color: MARKING_COLORS.cleaned },
      ].map(({ label, color }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
          <span className="text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );

  const renderIndices = () => {
    if (!showIndices || !indices.api && !indices.bopPercent) return null;
    return (
      <div className="grid grid-cols-3 gap-3">
        {indices.api !== null && (
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">API (Plaque)</p>
            <p className="text-2xl font-bold" style={{ color: indices.api > 50 ? MARKING_COLORS.bop : indices.api > 25 ? MARKING_COLORS.plaque : MARKING_COLORS.cleaned }}>
              {indices.api}%
            </p>
            <p className="text-xs text-muted-foreground">{getApiBewertung(indices.api)}</p>
          </Card>
        )}
        {indices.bopPercent !== null && (
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">BOP (Blutung)</p>
            <p className="text-2xl font-bold" style={{ color: indices.bopPercent > 25 ? MARKING_COLORS.bop : indices.bopPercent > 10 ? MARKING_COLORS.plaque : MARKING_COLORS.cleaned }}>
              {indices.bopPercent}%
            </p>
            <p className="text-xs text-muted-foreground">{getBopBewertung(indices.bopPercent)}</p>
          </Card>
        )}
        {indices.plaquePercent !== null && (
          <Card className="p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Plaque gesamt</p>
            <p className="text-2xl font-bold" style={{ color: indices.plaquePercent > 40 ? MARKING_COLORS.bop : indices.plaquePercent > 20 ? MARKING_COLORS.plaque : MARKING_COLORS.cleaned }}>
              {indices.plaquePercent}%
            </p>
          </Card>
        )}
      </div>
    );
  };

  const renderPocketDepths = () => {
    if (!showPocketDepths || !selectedToothDetail) return null;
    const tooth = teethData[selectedToothDetail];
    if (!tooth || tooth.missing) return null;

    const points = ['MB', 'B', 'DB', 'ML', 'L', 'DL'] as const;
    return (
      <Card className="p-4">
        <h4 className="text-sm font-semibold mb-3">Taschentiefen – Zahn {tooth.id}</h4>
        <div className="grid grid-cols-6 gap-2">
          {points.map(p => (
            <div key={p} className="text-center">
              <label className="text-[10px] text-muted-foreground block mb-1">{p}</label>
              <Input
                type="number"
                min={0}
                max={15}
                className={`h-8 text-center text-sm p-1 ${
                  (tooth.pocketDepths[p] ?? 0) >= 4 ? 'border-red-400 bg-red-50 text-red-700 font-bold' : ''
                }`}
                value={tooth.pocketDepths[p] ?? ''}
                onChange={e => updatePocketDepth(tooth.id, p, e.target.value)}
                placeholder="–"
              />
            </div>
          ))}
        </div>
        {Object.values(tooth.pocketDepths).some(v => v !== null && v >= 4) && (
          <p className="text-xs text-red-600 mt-2">⚠ Erhöhte Taschentiefen (≥ 4 mm) festgestellt</p>
        )}
      </Card>
    );
  };

  const renderCleaningStatus = () => {
    const total = selectedTeeth.length * 5; // 5 surfaces each
    if (total === 0) return null;
    let cleaned = 0;
    selectedTeeth.forEach(t => {
      Object.values(t.surfaces).forEach(s => { if (s.cleaned) cleaned++; });
    });
    const percent = Math.round((cleaned / total) * 100);
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%`, backgroundColor: MARKING_COLORS.cleaned }}
          />
        </div>
        <span className="text-sm font-medium" style={{ color: MARKING_COLORS.cleaned }}>
          {percent}% gereinigt
        </span>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-4" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        {/* Toolbar */}
        {!compact && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground mr-1">Modus:</span>
              {MODES.map(({ mode, icon, color }) => (
                <Tooltip key={mode}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={markingMode === mode ? 'default' : 'outline'}
                      size="sm"
                      className={`h-8 gap-1.5 text-xs ${markingMode === mode ? color + ' text-white' : ''}`}
                      onClick={() => setMarkingMode(mode)}
                      style={markingMode === mode ? {
                        backgroundColor: mode === 'select' ? undefined :
                          mode === 'plaque' ? MARKING_COLORS.plaque :
                          mode === 'calculus' ? MARKING_COLORS.calculus_supra :
                          mode === 'bop' ? MARKING_COLORS.bop :
                          mode === 'stain' ? MARKING_COLORS.stain :
                          MARKING_COLORS.cleaned,
                      } : undefined}
                    >
                      {icon}
                      <span className="hidden sm:inline">{MARKING_LABELS[mode]}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{MARKING_LABELS[mode]}</TooltipContent>
                </Tooltip>
              ))}
            </div>
            {/* Selection / apply buttons – available in ALL modes */}
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-[10px] text-muted-foreground mr-1">Anwenden:</span>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={selectAll}>Alle</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={deselectAll}>Keine</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={selectUpperJaw}>OK</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={selectLowerJaw}>UK</Button>
              <div className="h-4 w-px bg-border mx-1" />
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => selectQuadrant(1)}>Q1</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => selectQuadrant(2)}>Q2</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => selectQuadrant(3)}>Q3</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => selectQuadrant(4)}>Q4</Button>
              <div className="h-4 w-px bg-border mx-1" />
              <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={resetAll}>
                <RotateCcw className="h-3 w-3 mr-1" /> Reset
              </Button>
            </div>
          </div>
        )}

        {compact && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>Alle vorhandenen auswählen</Button>
            <Button variant="ghost" size="sm" onClick={deselectAll}>Keine</Button>
          </div>
        )}

        {/* Tooth chart */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 text-center">Oberkiefer</p>
            {renderTeethRow(UPPER_TEETH, true)}
          </div>
          <div className="h-px bg-border" />
          <div>
            {renderTeethRow(LOWER_TEETH, false)}
            <p className="text-xs font-semibold text-muted-foreground mt-2 text-center">Unterkiefer</p>
          </div>
        </div>

        {/* Selection summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{selectedTeeth.length} Zähne ausgewählt</p>
          {!compact && selectedTeeth.length > 0 && (
            <div className="flex gap-1">
              {selectedTeeth.slice(0, 8).map(t => (
                <button
                  key={t.id}
                  className={`h-6 px-1.5 rounded text-[10px] font-medium transition-colors ${
                    selectedToothDetail === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted-foreground/20'
                  }`}
                  onClick={() => setSelectedToothDetail(selectedToothDetail === t.id ? null : t.id)}
                >
                  {t.id}
                </button>
              ))}
              {selectedTeeth.length > 8 && (
                <span className="text-[10px] text-muted-foreground self-center">+{selectedTeeth.length - 8}</span>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        {!compact && renderLegend()}

        {/* Cleaning status bar */}
        {!compact && selectedTeeth.length > 0 && renderCleaningStatus()}

        {/* Indices */}
        {!compact && renderIndices()}

        {/* Pocket depth detail */}
        {!compact && renderPocketDepths()}

        {/* Context actions for selected tooth */}
        {!compact && selectedToothDetail && teethData[selectedToothDetail] && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => toggleMissing(selectedToothDetail)}
            >
              <XCircle className="h-3 w-3 mr-1" />
              {teethData[selectedToothDetail].missing ? 'Als vorhanden markieren' : 'Als fehlend markieren'}
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
