import React from 'react';
import { ToothData, ToothSurface, MarkingMode, MARKING_COLORS } from './types';

interface ToothDiagramProps {
  tooth: ToothData;
  isUpper: boolean;
  markingMode: MarkingMode;
  onSurfaceClick: (toothId: string, surface: ToothSurface) => void;
  onToothClick: (toothId: string) => void;
  size?: number;
}

function getSurfaceColor(tooth: ToothData, surface: ToothSurface): string {
  const f = tooth.surfaces[surface];
  // Priority: cleaned > bop > calculus > plaque > stain > default
  if (f.cleaned) return MARKING_COLORS.cleaned;
  if (f.bop) return MARKING_COLORS.bop;
  if (f.calculus === 'subgingival') return MARKING_COLORS.calculus_sub;
  if (f.calculus === 'supragingival') return MARKING_COLORS.calculus_supra;
  if (f.plaque) return MARKING_COLORS.plaque;
  if (f.stain) return MARKING_COLORS.stain;
  return tooth.selected ? '#E0E7FF' : '#F3F4F6';
}

export default function ToothDiagram({ tooth, isUpper, markingMode, onSurfaceClick, onToothClick, size = 44 }: ToothDiagramProps) {
  if (tooth.missing) {
    return (
      <div className="flex flex-col items-center gap-0.5">
        {isUpper && <span className="text-[9px] text-muted-foreground font-medium">{tooth.id}</span>}
        <svg width={size} height={size} viewBox="0 0 44 44" className="opacity-30">
          <rect x="2" y="2" width="40" height="40" rx="4" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
          <line x1="8" y1="8" x2="36" y2="36" stroke="#9CA3AF" strokeWidth="1.5" />
          <line x1="36" y1="8" x2="8" y2="36" stroke="#9CA3AF" strokeWidth="1.5" />
        </svg>
        {!isUpper && <span className="text-[9px] text-muted-foreground font-medium">{tooth.id}</span>}
      </div>
    );
  }

  const s = size;
  const m = s * 0.28; // margin for outer surfaces

  // Surface polygons (cross pattern)
  // bukkal = top for upper, bottom for lower
  // lingual = bottom for upper, top for lower
  const surfaces: { key: ToothSurface; points: string }[] = isUpper ? [
    { key: 'bukkal', points: `2,2 ${s-2},2 ${s-m},${m} ${m},${m}` },
    { key: 'lingual', points: `${m},${s-m} ${s-m},${s-m} ${s-2},${s-2} 2,${s-2}` },
    { key: 'mesial', points: `${s-2},2 ${s-2},${s-2} ${s-m},${s-m} ${s-m},${m}` },
    { key: 'distal', points: `2,2 ${m},${m} ${m},${s-m} 2,${s-2}` },
    { key: 'okklusal', points: `${m},${m} ${s-m},${m} ${s-m},${s-m} ${m},${s-m}` },
  ] : [
    { key: 'lingual', points: `2,2 ${s-2},2 ${s-m},${m} ${m},${m}` },
    { key: 'bukkal', points: `${m},${s-m} ${s-m},${s-m} ${s-2},${s-2} 2,${s-2}` },
    { key: 'distal', points: `${s-2},2 ${s-2},${s-2} ${s-m},${s-m} ${s-m},${m}` },
    { key: 'mesial', points: `2,2 ${m},${m} ${m},${s-m} 2,${s-2}` },
    { key: 'okklusal', points: `${m},${m} ${s-m},${m} ${s-m},${s-m} ${m},${s-m}` },
  ];

  const handleClick = (surface: ToothSurface) => {
    if (markingMode === 'select') {
      onToothClick(tooth.id);
    } else {
      onSurfaceClick(tooth.id, surface);
    }
  };

  const borderColor = tooth.selected ? 'hsl(234 55% 28%)' : '#D1D5DB';

  return (
    <div className="flex flex-col items-center gap-0.5">
      {isUpper && <span className="text-[9px] text-muted-foreground font-medium">{tooth.id}</span>}
      <svg
        width={s} height={s} viewBox={`0 0 ${s} ${s}`}
        className="cursor-pointer"
        style={{ filter: tooth.selected ? 'drop-shadow(0 0 2px rgba(32,40,109,0.3))' : undefined }}
      >
        <rect x="1" y="1" width={s-2} height={s-2} rx="3" fill="none" stroke={borderColor} strokeWidth={tooth.selected ? 2 : 1} />
        {surfaces.map(({ key, points }) => (
          <polygon
            key={key}
            points={points}
            fill={getSurfaceColor(tooth, key)}
            stroke="#D1D5DB"
            strokeWidth="0.5"
            onClick={() => handleClick(key)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <title>{key}</title>
          </polygon>
        ))}
        {/* BOP indicator dot */}
        {Object.values(tooth.surfaces).some(f => f.bop) && (
          <circle cx={s/2} cy={isUpper ? s + 4 : -4} r="2.5" fill={MARKING_COLORS.bop} />
        )}
      </svg>
      {!isUpper && <span className="text-[9px] text-muted-foreground font-medium">{tooth.id}</span>}
    </div>
  );
}
