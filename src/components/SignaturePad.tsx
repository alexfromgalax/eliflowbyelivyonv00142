import { useRef, useEffect, useState } from "react";
import SignaturePadLib from "signature_pad";
import { Button } from "@/components/ui/button";
import { Eraser, Undo2 } from "lucide-react";

interface SignaturePadProps {
  label: string;
  onSignatureChange: (dataUrl: string | null) => void;
  signature: string | null;
}

export default function SignaturePad({ label, onSignatureChange, signature }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadLib | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = container.offsetWidth * ratio;
      canvas.height = container.offsetHeight * ratio;
      canvas.style.width = `${container.offsetWidth}px`;
      canvas.style.height = `${container.offsetHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(ratio, ratio);

      // Restore signature if exists
      if (padRef.current && signature) {
        padRef.current.fromDataURL(signature, {
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
        setIsEmpty(false);
      }
    };

    const pad = new SignaturePadLib(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
      penColor: "rgb(0, 0, 0)",
      minWidth: 1,
      maxWidth: 2.5,
    });

    pad.addEventListener("endStroke", () => {
      setIsEmpty(pad.isEmpty());
      onSignatureChange(pad.toDataURL("image/png"));
    });

    padRef.current = pad;
    resizeCanvas();

    const observer = new ResizeObserver(() => resizeCanvas());
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      pad.off();
      observer.disconnect();
    };
  }, []);

  const handleClear = () => {
    padRef.current?.clear();
    // Redraw white background
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    setIsEmpty(true);
    onSignatureChange(null);
  };

  const handleUndo = () => {
    const pad = padRef.current;
    if (!pad) return;
    const data = pad.toData();
    if (data.length > 0) {
      data.pop();
      pad.fromData(data);
      setIsEmpty(pad.isEmpty());
      onSignatureChange(pad.isEmpty() ? null : pad.toDataURL("image/png"));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={handleUndo} disabled={isEmpty} className="h-7 px-2">
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleClear} disabled={isEmpty} className="h-7 px-2">
            <Eraser className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative rounded-md border-2 border-dashed border-muted-foreground/30 bg-white overflow-hidden"
        style={{ height: "120px", touchAction: "none" }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair" />
        {isEmpty && !signature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm text-muted-foreground/40">Hier unterschreiben</span>
          </div>
        )}
      </div>
    </div>
  );
}
