import { useEffect, useRef } from 'react';
import { ElectricPalette, getElectricBlueprints } from '../particles/electricShapes';

interface ElectricThumbCanvasProps {
  shapeId: string;
  palette: ElectricPalette;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Lightweight 2D Canvas thumbnail renderer for each electric pixel silhouette.
 * Uses the exact same gradient & square-pixel `lighter` composition as the live engine.
 */
export function ElectricThumbCanvas({
  shapeId,
  palette,
  width = 360,
  height = 225,
  className = '',
}: ElectricThumbCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cvs.width = width * dpr;
    cvs.height = height * dpr;

    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const blueprints = getElectricBlueprints(shapeId, palette, 9);
    const scale = Math.min(width, height) / 760;
    const cx = width / 2;
    const cy = height / 2;

    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < blueprints.length; i++) {
      const bp = blueprints[i];
      const jitterX = Math.sin(i * 12.7) * 2.2 * scale;
      const jitterY = Math.cos(i * 9.3) * 2.2 * scale;
      const sz = Math.max(1.1, bp.baseSize * scale * (0.72 + (i % 4) * 0.14));
      ctx.fillStyle = `rgb(${bp.r},${bp.g},${bp.b})`;
      ctx.fillRect(
        Math.round(cx + bp.ox * scale + jitterX),
        Math.round(cy + bp.oy * scale + jitterY),
        sz,
        sz,
      );
    }
    ctx.globalCompositeOperation = 'source-over';
  }, [shapeId, palette, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
      className={`block bg-black ${className}`}
      aria-hidden="true"
    />
  );
}
