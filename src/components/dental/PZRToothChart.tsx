import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UPPER_TEETH, LOWER_TEETH } from './types';

interface PZRToothChartProps {
  selectedTeeth: string[];
  onSelectionChange: (teeth: string[]) => void;
}

const Q1_TEETH = ['18','17','16','15','14','13','12','11'];
const Q2_TEETH = ['21','22','23','24','25','26','27','28'];
const Q3_TEETH = ['31','32','33','34','35','36','37','38'];
const Q4_TEETH = ['48','47','46','45','44','43','42','41'];

function getToothDimensions(id: string, baseSize: number): { w: number; h: number } {
  const num = parseInt(id.slice(-1));
  if (num >= 6) return { w: baseSize, h: baseSize };
  if (num >= 4) return { w: baseSize * 0.7, h: baseSize };
  return { w: baseSize * 0.95, h: baseSize * 0.72 };
}

function PZRTooth({ id, isUpper, selected, size = 40 }: { id: string; isUpper: boolean; selected: boolean; size?: number }) {
  const { w, h } = getToothDimensions(id, size);
  const mx = w * 0.28;
  const my = h * 0.28;
  const fill = selected ? 'hsl(var(--primary) / 0.25)' : 'hsl(var(--muted))';
  const stroke = selected ? 'hsl(var(--primary))' : 'hsl(var(--border))';
  const strokeWidth = selected ? 2 : 1;

  const surfaceLines = [
    `M2,2 L${w-2},2 L${w-mx},${my} L${mx},${my} Z`,
    `M${mx},${h-my} L${w-mx},${h-my} L${w-2},${h-2} L2,${h-2} Z`,
    `M${w-2},2 L${w-2},${h-2} L${w-mx},${h-my} L${w-mx},${my} Z`,
    `M2,2 L${mx},${my} L${mx},${h-my} L2,${h-2} Z`,
    `M${mx},${my} L${w-mx},${my} L${w-mx},${h-my} L${mx},${h-my} Z`,
  ];

  return (
    <div className="flex flex-col items-center justify-end" style={{ gap: '1px' }}>
      {isUpper && <span className="text-[9px] text-muted-foreground font-medium leading-none">{id}</span>}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="cursor-pointer select-none">
        <rect x="1" y="1" width={w-2} height={h-2} rx="3" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        {surfaceLines.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity={0.5} />
        ))}
      </svg>
      {!isUpper && <span className="text-[9px] text-muted-foreground font-medium leading-none">{id}</span>}
    </div>
  );
}

export default function PZRToothChart({ selectedTeeth, onSelectionChange }: PZRToothChartProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragMode = useRef<'select' | 'deselect' | null>(null);
  const lastTooth = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive tooth size
  const [toothSize, setToothSize] = useState(40);
  useEffect(() => {
    const updateSize = () => {
      // Calculate max tooth size that fits in viewport
      // Row has 8 teeth per quadrant × 2 + axis + gaps ≈ 16 teeth + spacing
      // Approximate total width factor: 8 molars equivalent per side
      const vw = window.innerWidth;
      // Each row: 8 teeth. Widest config: mix of sizes averaging ~0.85 * base
      // Total row width ≈ 2 * (8 * 0.85 * base) + axis(6px) + gaps ≈ 13.6 * base + 10
      // Fit in viewport with some padding (24px each side)
      const available = vw - 48;
      const maxBase = Math.floor(available / 13.8);
      setToothSize(Math.min(40, Math.max(22, maxBase)));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Use refs for latest state to avoid stale closures in native event handlers
  const selectedTeethRef = useRef(selectedTeeth);
  selectedTeethRef.current = selectedTeeth;
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;

  const toggleId = useCallback((id: string) => {
    const sel = selectedTeethRef.current;
    onSelectionChangeRef.current(
      sel.includes(id) ? sel.filter(t => t !== id) : [...sel, id]
    );
  }, []);

  const applyDrag = useCallback((id: string) => {
    if (lastTooth.current === id) return;
    lastTooth.current = id;
    const sel = selectedTeethRef.current;
    const isSelected = sel.includes(id);
    if (dragMode.current === 'select' && !isSelected) {
      onSelectionChangeRef.current([...sel, id]);
    } else if (dragMode.current === 'deselect' && isSelected) {
      onSelectionChangeRef.current(sel.filter(t => t !== id));
    }
  }, []);

  const toothFromPoint = useCallback((x: number, y: number): string | null => {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    const wrapper = el.closest('[data-tooth-id]') as HTMLElement | null;
    return wrapper?.dataset.toothId ?? null;
  }, []);

  // Native touch events (non-passive) so preventDefault actually works on iOS
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement;
      if (target.closest('button')) return;
      const id = toothFromPoint(e.touches[0].clientX, e.touches[0].clientY);
      if (!id) return;
      e.preventDefault();
      setIsDragging(true);
      const willSelect = !selectedTeethRef.current.includes(id);
      dragMode.current = willSelect ? 'select' : 'deselect';
      lastTooth.current = id;
      toggleId(id);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragMode.current || e.touches.length !== 1) return;
      const id = toothFromPoint(e.touches[0].clientX, e.touches[0].clientY);
      if (!id) return;
      e.preventDefault();
      applyDrag(id);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!dragMode.current) return;
      e.preventDefault();
      setIsDragging(false);
      dragMode.current = null;
      lastTooth.current = null;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [toothFromPoint, toggleId, applyDrag]);

  const handleMouseDown = useCallback((id: string) => {
    setIsDragging(true);
    const willSelect = !selectedTeethRef.current.includes(id);
    dragMode.current = willSelect ? 'select' : 'deselect';
    lastTooth.current = id;
    toggleId(id);
  }, [toggleId]);

  const handleMouseEnter = useCallback((id: string) => {
    if (!isDragging) return;
    applyDrag(id);
  }, [isDragging, applyDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragMode.current = null;
    lastTooth.current = null;
  }, []);

  const toggleGroup = (teeth: string[]) => {
    const allSelected = teeth.every(t => selectedTeeth.includes(t));
    if (allSelected) {
      onSelectionChange(selectedTeeth.filter(t => !teeth.includes(t)));
    } else {
      onSelectionChange([...new Set([...selectedTeeth, ...teeth])]);
    }
  };

  const selectAll = () => onSelectionChange([...UPPER_TEETH, ...LOWER_TEETH]);
  const selectNone = () => onSelectionChange([]);

  const renderQuadrant = (teeth: string[], isUpper: boolean) => (
    <div className={`flex gap-px ${isUpper ? 'items-end' : 'items-start'}`}>
      {teeth.map(id => (
        <div
          key={id}
          data-tooth-id={id}
          onMouseDown={(e) => { e.preventDefault(); handleMouseDown(id); }}
          onMouseEnter={() => handleMouseEnter(id)}
        >
          <PZRTooth id={id} isUpper={isUpper} selected={selectedTeeth.includes(id)} size={toothSize} />
        </div>
      ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="space-y-3 select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Quick selection buttons */}
      <div className="flex flex-wrap gap-1 items-center">
        <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={selectAll}>Alle</Button>
        <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={selectNone}>Keine</Button>
        <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => toggleGroup(UPPER_TEETH)}>OK</Button>
        <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => toggleGroup(LOWER_TEETH)}>UK</Button>
        <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => toggleGroup(Q1_TEETH)}>Q1</Button>
        <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => toggleGroup(Q2_TEETH)}>Q2</Button>
        <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => toggleGroup(Q3_TEETH)}>Q3</Button>
        <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => toggleGroup(Q4_TEETH)}>Q4</Button>
      </div>

      {/* Tooth chart with quadrant axes */}
      <div className="w-full">
        <p className="text-xs font-semibold text-muted-foreground mb-1 text-center">Oberkiefer</p>
        <div className="flex items-center justify-center">
          {renderQuadrant(Q1_TEETH, true)}
          <div className="w-px bg-primary/40 self-stretch mx-0.5 sm:mx-1.5" style={{ minHeight: '48px' }} />
          {renderQuadrant(Q2_TEETH, true)}
        </div>

        <div className="h-px bg-primary/40 my-1.5" />

        <div className="flex items-center justify-center">
          {renderQuadrant(Q4_TEETH, false)}
          <div className="w-px bg-primary/40 self-stretch mx-0.5 sm:mx-1.5" style={{ minHeight: '48px' }} />
          {renderQuadrant(Q3_TEETH, false)}
        </div>
        <p className="text-xs font-semibold text-muted-foreground mt-1 text-center">Unterkiefer</p>
      </div>

      <p className="text-sm text-muted-foreground">{selectedTeeth.length} Zähne ausgewählt</p>
    </div>
  );
}
