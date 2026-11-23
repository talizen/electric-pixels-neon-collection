import { useEffect, useRef } from 'react';
import {
  ELECTRIC_PALETTES,
  ElectricPalette,
  ParticleBlueprint,
  getElectricBlueprints,
} from '../particles/electricShapes';

class ElectricParticle {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  r: number;
  g: number;
  b: number;
  tr: number;
  tg: number;
  tb: number;
  baseSize: number;
  targetSize: number;
  currentSize: number;
  friction: number;
  ease: number;
  driftAngle: number;
  driftSpeed: number;
  flickerAngle: number;
  flickerSpeed: number;

  constructor(bp: ParticleBlueprint, startCx: number, startCy: number, scatter = true) {
    this.ox = bp.ox;
    this.oy = bp.oy;
    this.r = bp.r;
    this.g = bp.g;
    this.b = bp.b;
    this.tr = bp.r;
    this.tg = bp.g;
    this.tb = bp.b;
    this.baseSize = bp.baseSize;
    this.targetSize = bp.baseSize;
    this.currentSize = bp.baseSize;

    if (scatter) {
      const randR = 260 + Math.random() * 480;
      const randA = Math.random() * Math.PI * 2;
      this.x = startCx + Math.cos(randA) * randR;
      this.y = startCy + Math.sin(randA) * randR;
    } else {
      this.x = startCx + bp.ox;
      this.y = startCy + bp.oy;
    }

    this.friction = 0.82 + Math.random() * 0.08;
    this.ease = 0.025 + Math.random() * 0.04;
    this.driftAngle = Math.random() * Math.PI * 2;
    this.driftSpeed = 0.005 + Math.random() * 0.015;
    this.flickerAngle = Math.random() * Math.PI * 2;
    this.flickerSpeed = 0.02 + Math.random() * 0.04;
  }

  assignBlueprint(bp: ParticleBlueprint) {
    this.ox = bp.ox;
    this.oy = bp.oy;
    this.tr = bp.r;
    this.tg = bp.g;
    this.tb = bp.b;
    this.targetSize = bp.baseSize;
  }

  impulseScatter(cx: number, cy: number) {
    const angle = Math.atan2(this.y - cy, this.x - cx) + (Math.random() - 0.5) * 0.9;
    const speed = 28 + Math.random() * 52;
    this.vx += Math.cos(angle) * speed;
    this.vy += Math.sin(angle) * speed;
  }

  update(mouseX: number, mouseY: number, cx: number, cy: number, scale: number) {
    this.driftAngle += this.driftSpeed;
    this.flickerAngle += this.flickerSpeed;

    // Smooth color & size transition when morphing or changing palette
    this.r += (this.tr - this.r) * 0.1;
    this.g += (this.tg - this.g) * 0.1;
    this.b += (this.tb - this.b) * 0.1;
    this.baseSize += (this.targetSize - this.baseSize) * 0.12;

    let targetX = cx + this.ox * scale + Math.sin(this.driftAngle) * 12 * scale;
    let targetY = cy + this.oy * scale + Math.cos(this.driftAngle) * 12 * scale;
    const flickerScale = 0.6 + Math.sin(this.flickerAngle) * 0.4;
    this.currentSize = this.baseSize * scale * flickerScale;

    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.hypot(dx, dy);
    const repelRadius = 150 * scale;

    if (mouseX !== -1000 && dist < repelRadius) {
      const force = (repelRadius - dist) / repelRadius;
      const angle = Math.atan2(dy, dx);
      targetX -= Math.cos(angle) * force * 180 * scale;
      targetY -= Math.sin(angle) * force * 180 * scale;
    }

    this.vx += (targetX - this.x) * this.ease;
    this.vy += (targetY - this.y) * this.ease;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgb(${this.r | 0},${this.g | 0},${this.b | 0})`;
    ctx.fillRect(Math.round(this.x), Math.round(this.y), this.currentSize, this.currentSize);
  }
}

export interface ElectricParticleCanvasProps {
  shapeId: string;
  palette?: ElectricPalette;
  /** Increment to trigger radial scatter explosion + elastic re-assembly */
  scatterNonce?: number;
  className?: string;
}

export function ElectricParticleCanvas({
  shapeId,
  palette = ELECTRIC_PALETTES[0],
  scatterNonce = 0,
  className = '',
}: ElectricParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<ElectricParticle[]>([]);
  const dimsRef = useRef({ w: 800, h: 600 });
  const lastScatterRef = useRef(scatterNonce);

  // Sync shape & palette cleanly with elastic morphing
  useEffect(() => {
    const blueprints = getElectricBlueprints(shapeId, palette, 7);
    const existing = particlesRef.current;
    const cx = dimsRef.current.w / 2;
    const cy = dimsRef.current.h / 2;

    if (existing.length === 0) {
      particlesRef.current = blueprints.map((bp) => new ElectricParticle(bp, cx, cy, true));
      return;
    }

    const next: ElectricParticle[] = [];
    for (let i = 0; i < blueprints.length; i++) {
      if (i < existing.length) {
        const p = existing[i];
        p.assignBlueprint(blueprints[i]);
        // Give a subtle organic swirl kick when switching shapes
        p.vx += (Math.random() - 0.5) * 14;
        p.vy += (Math.random() - 0.5) * 14;
        next.push(p);
      } else {
        next.push(new ElectricParticle(blueprints[i], cx, cy, true));
      }
    }
    particlesRef.current = next;
  }, [shapeId, palette]);

  // Trigger burst scatter effect
  useEffect(() => {
    if (scatterNonce === lastScatterRef.current) return;
    lastScatterRef.current = scatterNonce;
    const cx = dimsRef.current.w / 2;
    const cy = dimsRef.current.h / 2;
    for (const p of particlesRef.current) {
      p.impulseScatter(cx, cy);
    }
  }, [scatterNonce]);

  // Main render loop & resize/pointer bindings
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    let rafId = 0;
    let destroyed = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dimsRef.current = { w: Math.max(1, rect.width), h: Math.max(1, rect.height) };
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top };
    };
    const onMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    const resetMouse = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', resetMouse);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', resetMouse);

    const render = () => {
      if (destroyed) return;
      const { w, h } = dimsRef.current;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      const isMobile = w < 768;
      const baseScale = isMobile ? 650 : 820;
      const scale = Math.max(0.36, Math.min(w, h) / baseScale);
      const cx = w / 2;
      const cy = h / 2;

      ctx.globalCompositeOperation = 'lighter';
      const list = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        p.update(mx, my, cx, cy, scale);
        p.draw(ctx);
      }
      ctx.globalCompositeOperation = 'source-over';

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', resetMouse);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', resetMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full bg-black touch-none ${className}`}
    />
  );
}
