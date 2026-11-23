export type ElectricCategory = 'all' | 'creatures' | 'botanical' | 'emblems';

export interface ElectricPalette {
  id: string;
  label: string;
  swatch: string;
  stops: Array<[number, string]>;
}

export const ELECTRIC_PALETTES: ElectricPalette[] = [
  {
    id: 'electric',
    label: 'Original Electric',
    swatch: '#ff69b4',
    stops: [
      [0, '#ffffff'],
      [0.1, '#fff5ba'],
      [0.35, '#ffd700'],
      [0.65, '#ff69b4'],
      [0.9, '#da70d6'],
      [1, '#8a2be2'],
    ],
  },
  {
    id: 'cyan',
    label: 'Cyber Cyan',
    swatch: '#00bbf9',
    stops: [
      [0, '#ffffff'],
      [0.12, '#d8fff8'],
      [0.36, '#00f5d4'],
      [0.65, '#00bbf9'],
      [0.88, '#3a86ff'],
      [1, '#4338ca'],
    ],
  },
  {
    id: 'acid',
    label: 'Acid Lime',
    swatch: '#eaff80',
    stops: [
      [0, '#ffffff'],
      [0.14, '#f8ffd6'],
      [0.38, '#eaff80'],
      [0.65, '#4ade80'],
      [0.88, '#06b6d4'],
      [1, '#0f766e'],
    ],
  },
  {
    id: 'solar',
    label: 'Solar Flare',
    swatch: '#fb5607',
    stops: [
      [0, '#ffffff'],
      [0.12, '#fff1b8'],
      [0.36, '#ffb703'],
      [0.65, '#fb5607'],
      [0.88, '#ff006e'],
      [1, '#7209b7'],
    ],
  },
];

export const ELECTRIC_CATEGORIES: Array<{ id: ElectricCategory; label: string }> = [
  { id: 'all', label: 'All Forms' },
  { id: 'creatures', label: 'Creatures' },
  { id: 'botanical', label: 'Botanical' },
  { id: 'emblems', label: 'Emblems' },
];

export interface ElectricShapeItem {
  id: string;
  num: string;
  name: string;
  zhName: string;
  category: Exclude<ElectricCategory, 'all'>;
  spec: string;
  description: string;
  highlights: string[];
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export interface ParticleBlueprint {
  ox: number;
  oy: number;
  r: number;
  g: number;
  b: number;
  baseSize: number;
}

export const SHAPE_SIZE = 800;

/* -------------------------------------------------------------------------- */
/* 8 Electric Pixel Particle Silhouettes (drawn centered at 0, 0 in 800x800)  */
/* -------------------------------------------------------------------------- */

/** 01. Original ParticleButterfly.tsx exact bezier silhouette */
function drawButterfly(ctx: CanvasRenderingContext2D) {
  const drawWing = (flipX: boolean) => {
    ctx.save();
    if (flipX) ctx.scale(-1, 1);
    ctx.beginPath();
    ctx.moveTo(10, -50);
    ctx.bezierCurveTo(40, -180, 180, -260, 320, -200);
    ctx.bezierCurveTo(340, -150, 330, -50, 250, 20);
    ctx.bezierCurveTo(280, 50, 280, 80, 250, 120);
    ctx.bezierCurveTo(220, 220, 140, 280, 60, 260);
    ctx.bezierCurveTo(20, 220, 10, 120, 10, 50);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  drawWing(false);
  drawWing(true);
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 80, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** 02. Phoenix — Sweeping feathered wings & triple streaming tail plumes */
function drawPhoenix(ctx: CanvasRenderingContext2D) {
  const drawWing = (flipX: boolean) => {
    ctx.save();
    if (flipX) ctx.scale(-1, 1);
    ctx.beginPath();
    ctx.moveTo(14, -40);
    ctx.bezierCurveTo(75, -185, 220, -255, 340, -210);
    ctx.bezierCurveTo(315, -140, 295, -95, 325, -55);
    ctx.bezierCurveTo(265, -20, 240, 10, 265, 45);
    ctx.bezierCurveTo(190, 55, 130, 38, 28, 30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  drawWing(false);
  drawWing(true);

  // Crest head & torso
  ctx.beginPath();
  ctx.moveTo(0, -175);
  ctx.bezierCurveTo(24, -150, 28, -90, 24, 15);
  ctx.bezierCurveTo(20, 75, 8, 120, 0, 145);
  ctx.bezierCurveTo(-8, 120, -20, 75, -24, 15);
  ctx.bezierCurveTo(-28, -90, -24, -150, 0, -175);
  ctx.closePath();
  ctx.fill();

  // Triple tail plumes
  const drawPlume = (endX: number, endY: number, ctrlX: number, w: number) => {
    ctx.beginPath();
    ctx.moveTo(-w * 0.5, 45);
    ctx.quadraticCurveTo(ctrlX - w, (45 + endY) * 0.5, endX, endY);
    ctx.quadraticCurveTo(ctrlX + w, (45 + endY) * 0.5, w * 0.5, 45);
    ctx.closePath();
    ctx.fill();
  };
  drawPlume(0, 305, 0, 18);
  drawPlume(-105, 265, -70, 16);
  drawPlume(105, 265, 70, 16);
}

/** 03. Lotus — Symmetrical 7-petal sacred bloom + floating water arc */
function drawLotus(ctx: CanvasRenderingContext2D) {
  const drawPetal = (angle: number, w: number, h: number) => {
    ctx.save();
    ctx.translate(0, 125);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(w, -h * 0.25, w * 1.05, -h * 0.72, 0, -h);
    ctx.bezierCurveTo(-w * 1.05, -h * 0.72, -w, -h * 0.25, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  drawPetal(0, 88, 360);
  drawPetal(-0.46, 80, 325);
  drawPetal(0.46, 80, 325);
  drawPetal(-0.92, 72, 290);
  drawPetal(0.92, 72, 290);
  drawPetal(-1.32, 58, 235);
  drawPetal(1.32, 58, 235);

  // Subtle curved pedestal arc
  ctx.beginPath();
  ctx.moveTo(-225, 162);
  ctx.quadraticCurveTo(0, 214, 225, 162);
  ctx.quadraticCurveTo(0, 240, -225, 162);
  ctx.closePath();
  ctx.fill();
}

/** 04. Sakura — Lush 5-petal radial blossom */
function drawSakura(ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 5);
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.bezierCurveTo(105, -62, 162, -195, 62, -285);
    ctx.quadraticCurveTo(22, -308, 0, -268);
    ctx.quadraticCurveTo(-22, -308, -62, -285);
    ctx.bezierCurveTo(-162, -195, -105, -62, 0, -24);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 38, 0, Math.PI * 2);
  ctx.fill();
}

/** 05. Fox — Poised seated spirit fox with sweeping brush tail */
function drawFox(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  // Head & pointed ears
  ctx.moveTo(-140, -165); // Nose tip
  ctx.quadraticCurveTo(-85, -195, -55, -210);
  ctx.lineTo(-78, -305); // Back ear tip
  ctx.lineTo(-18, -228);
  ctx.lineTo(24, -298); // Front ear tip
  ctx.lineTo(36, -206);
  // Graceful neck & chest down to front paws
  ctx.bezierCurveTo(68, -165, 76, -80, 62, 30);
  ctx.bezierCurveTo(54, 115, 42, 185, 58, 255);
  ctx.lineTo(-10, 255);
  ctx.bezierCurveTo(-16, 170, -22, 110, -26, 65);
  // Sweeping plush fox tail curving dramatically upward to the right
  ctx.bezierCurveTo(45, 210, 175, 255, 255, 165);
  ctx.bezierCurveTo(325, 85, 310, -45, 218, -108);
  ctx.bezierCurveTo(240, -15, 200, 65, 128, 72);
  // Seated back curving up to neck
  ctx.bezierCurveTo(100, 20, -45, 225, -118, 255);
  ctx.bezierCurveTo(-175, 195, -172, 65, -125, -35);
  ctx.bezierCurveTo(-98, -95, -92, -130, -140, -165);
  ctx.closePath();
  ctx.fill();
}

/** 06. Whale — Leaping celestial whale with sweeping flukes */
function drawWhale(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  // Rounded head & arched back
  ctx.moveTo(265, -28);
  ctx.bezierCurveTo(255, -138, 130, -218, -18, -210);
  ctx.bezierCurveTo(-150, -202, -238, -105, -260, 48);
  // Left tail fluke
  ctx.bezierCurveTo(-318, 35, -356, 62, -365, 92);
  ctx.bezierCurveTo(-328, 120, -285, 122, -252, 112);
  // Right/lower tail fluke
  ctx.bezierCurveTo(-244, 165, -222, 222, -182, 260);
  ctx.bezierCurveTo(-165, 208, -172, 146, -188, 96);
  // Smooth inner belly & sweeping pectoral fin
  ctx.bezierCurveTo(-132, -18, -56, -78, 38, -68);
  ctx.bezierCurveTo(26, 12, -22, 92, -62, 135);
  ctx.bezierCurveTo(22, 108, 92, 34, 125, -32);
  // Lower jaw back to nose
  ctx.bezierCurveTo(192, -22, 258, 16, 265, -28);
  ctx.closePath();
  ctx.fill();
}

/** 07. Heart — Radiant pulsing electric heart */
function drawHeart(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(0, -125);
  ctx.bezierCurveTo(18, -235, 185, -285, 272, -168);
  ctx.bezierCurveTo(352, -60, 275, 105, 0, 278);
  ctx.bezierCurveTo(-275, 105, -352, -60, -272, -168);
  ctx.bezierCurveTo(-185, -285, -18, -235, 0, -125);
  ctx.closePath();
  ctx.fill();
}

/** 08. Starburst — Crisp 8-point cyber emblem */
function drawStarburst(ctx: CanvasRenderingContext2D) {
  const outer = 335;
  const mid = 225;
  const inner = 74;
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 2 === 1 ? inner : i % 4 === 0 ? outer : mid;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

export const ELECTRIC_CATALOG: ElectricShapeItem[] = [
  {
    id: 'butterfly',
    num: '01',
    name: 'Electric Butterfly',
    zhName: 'Electric butterfly',
    category: 'creatures',
    spec: 'The original electric butterfly',
    description:
      'Bezier butterfly wings in a gold-pink-violet radial gradient, glowing square pixels that drift and flicker, and a strong 150px cursor field that pushes them away before they spring back.',
    highlights: ['The original', 'Glowing square pixels', '150px repulsion', 'Elastic return'],
    draw: drawButterfly,
  },
  {
    id: 'phoenix',
    num: '02',
    name: 'Neon Phoenix',
    zhName: 'Electric phoenix',
    category: 'creatures',
    spec: 'Wide wings · three flowing tail plumes',
    description:
      'Raised wings and three long tail plumes in a radial gradient from white-gold to neon pink and violet, like a cyber firebird rising.',
    highlights: ['Wide wings', 'Three tail plumes', 'White-hot core', 'Scatter and reform'],
    draw: drawPhoenix,
  },
  {
    id: 'lotus',
    num: '03',
    name: 'Electric Lotus',
    zhName: 'Electric lotus',
    category: 'botanical',
    spec: '7-petal lotus · curved water cradle',
    description:
      'Seven open petals over a floating curved base. An electric white glow at the centre fades to neon pink and violet at the petal tips.',
    highlights: ['Seven-petal symmetry', 'Curved cradle', 'Radial colour', 'Flicker'],
    draw: drawLotus,
  },
  {
    id: 'sakura',
    num: '04',
    name: 'Cyber Sakura',
    zhName: 'Cyber sakura',
    category: 'botanical',
    spec: '5 notched heart petals · starry centre',
    description:
      'A full five-petal blossom built from glowing square pixels on pure black. Sweep the cursor through it like stirring a pond of falling blossoms.',
    highlights: ['Five heart petals', 'Gold centre', 'Additive glow', 'Touch friendly'],
    draw: drawSakura,
  },
  {
    id: 'fox',
    num: '05',
    name: 'Spirit Fox',
    zhName: 'Electric fox',
    category: 'creatures',
    spec: 'Sitting fox · pointed ears and a curling brush',
    description:
      'A sitting fox silhouette with a big curling tail sweeping up to the right, its edge fading into deep electric violet.',
    highlights: ['Pointed ears', 'Curling tail', 'Neon gradient', 'Elastic bounce'],
    draw: drawFox,
  },
  {
    id: 'whale',
    num: '06',
    name: 'Astral Whale',
    zhName: 'Electric whale',
    category: 'creatures',
    spec: 'Breaching whale arc · spread flukes',
    description:
      'A powerful breaching arc of a great whale. Its fins and flukes scatter like surf under the cursor and roll back.',
    highlights: ['Breaching arc', 'Spread flukes', 'Stardust trail', 'Satisfying scatter'],
    draw: drawWhale,
  },
  {
    id: 'heart',
    num: '07',
    name: 'Pulse Heart',
    zhName: 'Electric heart',
    category: 'emblems',
    spec: 'Full symmetrical heart · white-hot core',
    description:
      'A white-hot core radiates bands of gold, magenta and violet neon. Made for music, events and brand campaign heroes.',
    highlights: ['White-hot core', 'Neon gradient', 'Pixel pulse', 'One-click scatter'],
    draw: drawHeart,
  },
  {
    id: 'starburst',
    num: '08',
    name: 'Nova Crest',
    zhName: 'Electric starburst',
    category: 'emblems',
    spec: 'Four long and four short rays · sharp cyber star',
    description:
      'A high-contrast eight-point star whose alternating long and short rays end in deep violet light. Minimal, with a strong focal point.',
    highlights: ['Eight-point star', 'Sharp ray tips', 'High-contrast focus', 'Four palettes'],
    draw: drawStarburst,
  },
];

// Deterministic PRNG for stable sampling across thumbnails & morphs
function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const blueprintCache = new Map<string, ParticleBlueprint[]>();

export function getElectricBlueprints(
  shapeId: string,
  palette: ElectricPalette,
  step = 7,
): ParticleBlueprint[] {
  const cacheKey = `${shapeId}:${palette.id}:${step}`;
  const cached = blueprintCache.get(cacheKey);
  if (cached) return cached;

  const shape = ELECTRIC_CATALOG.find((s) => s.id === shapeId) ?? ELECTRIC_CATALOG[0];

  const canvas = document.createElement('canvas');
  canvas.width = SHAPE_SIZE;
  canvas.height = SHAPE_SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  const cx = SHAPE_SIZE / 2;
  const cy = SHAPE_SIZE / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = '#ffffff';
  shape.draw(ctx);
  ctx.restore();

  ctx.globalCompositeOperation = 'source-in';
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400);
  for (const [stop, color] of palette.stops) {
    gradient.addColorStop(stop, color);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SHAPE_SIZE, SHAPE_SIZE);

  const imageData = ctx.getImageData(0, 0, SHAPE_SIZE, SHAPE_SIZE).data;
  const rng = mulberry32(shapeId.length * 131 + step * 17);
  const blueprints: ParticleBlueprint[] = [];

  for (let y = 0; y < SHAPE_SIZE; y += step) {
    for (let x = 0; x < SHAPE_SIZE; x += step) {
      const idx = (y * SHAPE_SIZE + x) * 4;
      const alpha = imageData[idx + 3];
      if (alpha <= 128 || rng() > 0.85) continue;

      const dist = Math.hypot(x - cx, y - cy);
      const sizeFalloff = Math.max(0.4, 1 - dist / 350);

      blueprints.push({
        ox: x - cx,
        oy: y - cy,
        r: imageData[idx],
        g: imageData[idx + 1],
        b: imageData[idx + 2],
        baseSize: step * 0.45 + sizeFalloff * step * 0.35,
      });
    }
  }

  // Deterministic shuffle so morph transitions fly organically across the silhouette
  for (let i = blueprints.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [blueprints[i], blueprints[j]] = [blueprints[j], blueprints[i]];
  }

  blueprintCache.set(cacheKey, blueprints);
  return blueprints;
}
