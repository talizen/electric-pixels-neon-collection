import { useEffect, useMemo, useState } from 'react';
import { ElectricParticleCanvas } from './components/ElectricParticleCanvas';
import { ElectricThumbCanvas } from './components/ElectricThumbCanvas';
import {
  ELECTRIC_CATALOG,
  ELECTRIC_CATEGORIES,
  ELECTRIC_PALETTES,
  ElectricCategory,
  ElectricShapeItem,
} from './particles/electricShapes';

type PageMode = 'grid' | 'stage' | 'hero';

export default function App() {
  const [mode, setMode] = useState<PageMode>('grid');
  // Read ?view= after mount so the page also renders on the server.
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('view');
    if (v === 'hero' || v === 'stage') setMode(v);
  }, []);
  const [category, setCategory] = useState<ElectricCategory>('all');
  const [activeId, setActiveId] = useState<string>('butterfly');
  const [paletteId, setPaletteId] = useState<string>('electric');
  const [autoCycle, setAutoCycle] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [scatterNonce, setScatterNonce] = useState(0);

  const palette =
    ELECTRIC_PALETTES.find((p) => p.id === paletteId) ?? ELECTRIC_PALETTES[0];

  const filteredItems = useMemo(
    () =>
      category === 'all'
        ? ELECTRIC_CATALOG
        : ELECTRIC_CATALOG.filter((item) => item.category === category),
    [category],
  );

  const activeItem: ElectricShapeItem =
    ELECTRIC_CATALOG.find((item) => item.id === activeId) ?? ELECTRIC_CATALOG[0];

  useEffect(() => {
    if (!autoCycle || mode !== 'stage') return;
    const timer = window.setInterval(() => {
      setActiveId((prev) => {
        const list = filteredItems.length ? filteredItems : ELECTRIC_CATALOG;
        const idx = list.findIndex((i) => i.id === prev);
        return list[(idx + 1) % list.length].id;
      });
    }, 4500);
    return () => window.clearInterval(timer);
  }, [autoCycle, mode, filteredItems]);

  useEffect(() => {
    if (mode !== 'stage') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zenMode) {
        setZenMode(false);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const list = filteredItems.length ? filteredItems : ELECTRIC_CATALOG;
        const idx = list.findIndex((i) => i.id === activeId);
        setActiveId(list[(idx + 1) % list.length].id);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const list = filteredItems.length ? filteredItems : ELECTRIC_CATALOG;
        const idx = list.findIndex((i) => i.id === activeId);
        setActiveId(list[(idx - 1 + list.length) % list.length].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, activeId, filteredItems, zenMode]);

  const stepActive = (delta: number) => {
    const list = filteredItems.length ? filteredItems : ELECTRIC_CATALOG;
    const idx = list.findIndex((i) => i.id === activeId);
    setActiveId(list[(idx + delta + list.length) % list.length].id);
  };

  /* ========================================================================= */
  /* HERO VIEW — full-bleed electric butterfly hero                            */
  /* ========================================================================= */
  if (mode === 'hero') {
    return (
      <section className="relative min-h-screen w-full overflow-hidden bg-black text-white select-none">
        <div className="absolute inset-0 z-0">
          <ElectricParticleCanvas
            shapeId={activeId}
            palette={palette}
            scatterNonce={scatterNonce}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(0,0,0,0.08)_48%,rgba(0,0,0,0.72)_100%),linear-gradient(180deg,rgba(0,0,0,0.22)_0%,transparent_34%,rgba(0,0,0,0.75)_100%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-6 py-6 md:px-10 md:py-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
                <path d="M2.5 18C2.5 13.5 6 9.5 10.5 9.5C15 9.5 18 13.5 18 18" stroke="#eaff80" strokeLinecap="round" strokeWidth="3" />
                <path d="M10.5 18C10.5 13.5 14 9.5 18.5 9.5C23 9.5 26 13.5 26 18" stroke="#eaff80" strokeLinecap="round" strokeWidth="3" />
              </svg>
              <span className="text-base font-bold tracking-[0.16em] uppercase">Voltage</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMode('grid')}
                className="cursor-pointer rounded-full border border-white/20 bg-black/55 px-4 py-1.5 text-xs tracking-wide text-white/90 backdrop-blur-md transition hover:border-[#eaff80] hover:text-[#eaff80]"
              >
                ← Collection ({ELECTRIC_CATALOG.length})
              </button>

              {ELECTRIC_PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  title={p.label}
                  onClick={() => setPaletteId(p.id)}
                  className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border transition ${
                    p.id === paletteId
                      ? 'border-white bg-white/15'
                      : 'border-white/20 bg-black/40 hover:border-white/50'
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.swatch }} />
                </button>
              ))}

              <button
                type="button"
                onClick={() => setScatterNonce((n) => n + 1)}
                className="cursor-pointer rounded-[4px] bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
              >
                Scatter Pulse
              </button>
            </div>
          </header>

          <main className="pointer-events-none flex flex-1 flex-col justify-end gap-8 pb-8 pt-14 md:flex-row md:items-end md:justify-between md:pb-12">
            <div className="max-w-[40rem]">
              <h1 className="font-display-serif text-5xl leading-[1.02] font-normal tracking-tight text-[#f4f4f4] sm:text-6xl">
                Light that moves
                <br />
                <span className="text-[#9e9e9e]">when you do</span>
              </h1>
            </div>

            <div className="pointer-events-auto flex flex-col items-start gap-4 md:items-end">
              <p className="max-w-[320px] text-[13px] leading-[1.75] text-zinc-400 md:text-right">
                Move your cursor across the electric particles to scatter and re-form{' '}
                <span className="text-white">{activeItem.zhName}</span>.
              </p>
              <div className="flex flex-wrap gap-1.5 rounded-full border border-white/15 bg-black/70 p-1.5 backdrop-blur-xl">
                {ELECTRIC_CATALOG.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className={`cursor-pointer rounded-full px-3 py-1 text-[11px] transition ${
                      item.id === activeId
                        ? 'bg-white font-medium text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.name.replace('Electric ', '').replace('Neon ', '').replace('Cyber ', '').replace('Spirit ', '').replace('Astral ', '').replace('Pulse ', '')}
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      {!zenMode && (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMode('hero')}
                className="cursor-pointer rounded-full border border-white/16 bg-white/[0.04] px-3.5 py-1.5 text-[11px] tracking-[0.14em] text-zinc-200 uppercase transition hover:border-[#eaff80] hover:text-[#eaff80]"
              >
                ← Hero View
              </button>
              <div className="flex items-center gap-3">
                <span className="font-display-serif text-2xl text-white">Electric Pixels</span>
                <span className="h-4 w-px bg-white/15" />
                <span className="text-[11px] font-light tracking-[0.2em] text-[#ff69b4] uppercase">
                  Collection · {ELECTRIC_CATALOG.length} Forms
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* 4 Electric Palette Swatches */}
              <div className="flex items-center gap-1.5">
                {ELECTRIC_PALETTES.map((p) => {
                  const active = p.id === paletteId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      title={p.label}
                      onClick={() => setPaletteId(p.id)}
                      className={`group flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border transition ${
                        active
                          ? 'border-white bg-white/15'
                          : 'border-white/15 bg-white/[0.03] hover:border-white/45'
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-110"
                        style={{ backgroundColor: p.swatch }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Grid / Live Stage Switch */}
              <div className="flex items-center rounded-full border border-white/15 bg-white/[0.04] p-1">
                <button
                  type="button"
                  onClick={() => setMode('grid')}
                  className={`cursor-pointer rounded-full px-3.5 py-1 text-[11px] tracking-[0.14em] uppercase transition ${
                    mode === 'grid'
                      ? 'bg-white font-medium text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Grid ({ELECTRIC_CATALOG.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMode('stage')}
                  className={`cursor-pointer rounded-full px-3.5 py-1 text-[11px] tracking-[0.14em] uppercase transition ${
                    mode === 'stage'
                      ? 'bg-white font-medium text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Live Stage
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ===================================================================== */}
      {/* VIEW 1: 4x2 Real Electric Pixel Particle Grid                         */}
      {/* ===================================================================== */}
      {mode === 'grid' ? (
        <main className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-2.5 text-[11px] font-medium tracking-[0.22em] text-[#ffd700] uppercase">
                Electric Butterfly Pixel-Particle System
              </p>
              <h1 className="font-display-serif text-4xl leading-[1.04] font-normal text-white md:text-5xl">
                Eight electric silhouettes,{' '}
                <span className="italic text-zinc-400">zero 3D assets.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed font-light text-zinc-400">
                One neon pixel engine for all eight forms: pure black canvas, a radial neon gradient, square pixels blended with <code className="text-zinc-200">lighter</code> and a strong 150px cursor field. Pick a colour at top right to restyle the whole grid, or click any card to open its 60fps stage.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {ELECTRIC_CATEGORIES.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? ELECTRIC_CATALOG.length
                    : ELECTRIC_CATALOG.filter((i) => i.category === cat.id).length;
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[11px] tracking-[0.14em] uppercase transition ${
                      active
                        ? 'border-[#ff69b4]/75 bg-[#ff69b4]/15 text-white'
                        : 'border-white/12 bg-white/[0.03] text-zinc-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveId(item.id);
                  setMode('stage');
                }}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#ff69b4]/55 hover:shadow-2xl hover:shadow-fuchsia-950/50"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/10 bg-black">
                  <ElectricThumbCanvas
                    shapeId={item.id}
                    palette={palette}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/75 px-2.5 py-0.5 text-[10px] tracking-[0.16em] text-white uppercase backdrop-blur-md">
                    <span className="text-[#ffd700]">{item.num}</span>
                    <span>2D Pixel</span>
                  </div>
                  <div className="absolute right-3 bottom-3 rounded-full border border-[#ff69b4]/50 bg-black/80 px-2.5 py-1 text-[10px] tracking-[0.14em] text-pink-200 uppercase opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                    Launch Live ↗
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="text-base font-medium text-white">{item.name}</h2>
                      <span className="text-xs font-light text-[#ffd700]">{item.zhName}</span>
                    </div>
                    <p className="mt-1.5 text-[11px] font-medium text-zinc-500">{item.spec}</p>
                    <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed font-light text-zinc-400">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/10 pt-3.5">
                    {item.highlights.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      ) : (
        /* ===================================================================== */
        /* VIEW 2: Split List + 60fps Live Electric Pixel Stage (+ Zen Mode)     */
        /* ===================================================================== */
        <main
          className={`relative flex w-full overflow-hidden ${
            zenMode ? 'h-screen' : 'h-[calc(100vh-69px)]'
          }`}
        >
          {!zenMode && (
            <aside className="hidden w-[330px] shrink-0 flex-col border-r border-white/10 bg-zinc-950 md:flex">
              <div className="border-b border-white/10 p-4">
                <div className="flex flex-wrap gap-1.5">
                  {ELECTRIC_CATEGORIES.map((cat) => {
                    const active = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`cursor-pointer rounded-full border px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase transition ${
                          active
                            ? 'border-[#ff69b4]/75 bg-[#ff69b4]/18 text-white'
                            : 'border-white/12 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {filteredItems.map((item) => {
                  const active = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                        active
                          ? 'border-[#ff69b4]/70 bg-[#ff69b4]/10'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                        <ElectricThumbCanvas
                          shapeId={item.id}
                          palette={palette}
                          width={160}
                          height={112}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-white">
                          <span className="mr-1.5 text-[11px] text-[#ffd700]">{item.num}</span>
                          {item.name}
                        </div>
                        <div className="truncate text-[11px] text-zinc-300">{item.zhName}</div>
                        <div className="mt-0.5 truncate text-[10px] text-zinc-500">{item.spec}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>
          )}

          {/* Right Live Interactive Electric Stage */}
          <div className="relative flex-1 overflow-hidden bg-black">
            <ElectricParticleCanvas
              shapeId={activeId}
              palette={palette}
              scatterNonce={scatterNonce}
            />

            {/* Top Controls */}
            <div className="absolute top-5 right-5 left-5 z-20 flex flex-wrap items-center justify-between gap-3">
              {!zenMode ? (
                <div className="flex items-center gap-2.5 rounded-full border border-white/15 bg-black/70 px-4 py-1.5 backdrop-blur-md">
                  <span className="text-xs font-semibold text-[#ffd700]">{activeItem.num}</span>
                  <span className="text-xs font-medium text-white">{activeItem.name}</span>
                  <span className="text-xs text-zinc-400">· {activeItem.zhName}</span>
                </div>
              ) : (
                <div />
              )}

              <div className="flex flex-wrap items-center gap-2">
                {!zenMode && (
                  <>
                    <button
                      type="button"
                      onClick={() => setScatterNonce((n) => n + 1)}
                      className="cursor-pointer rounded-full border border-white/20 bg-black/70 px-3.5 py-1.5 text-[11px] tracking-[0.14em] text-white uppercase backdrop-blur-md transition hover:border-[#ffd700] hover:text-[#ffd700]"
                    >
                      Scatter
                    </button>
                    <button
                      type="button"
                      onClick={() => setAutoCycle((v) => !v)}
                      className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[11px] tracking-[0.14em] uppercase backdrop-blur-md transition ${
                        autoCycle
                          ? 'border-[#ff69b4] bg-[#ff69b4]/20 text-white'
                          : 'border-white/20 bg-black/70 text-zinc-300 hover:border-white/50'
                      }`}
                    >
                      {autoCycle ? 'Auto: ON' : 'Auto-Cycle'}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setZenMode((v) => !v)}
                  className="cursor-pointer rounded-full border border-white/22 bg-black/70 px-3.5 py-1.5 text-[11px] tracking-[0.14em] text-white uppercase backdrop-blur-md transition hover:border-[#ff69b4]"
                >
                  {zenMode ? 'Exit Clean View' : 'Clean View'}
                </button>
              </div>
            </div>

            {/* Bottom Info & Navigation */}
            {!zenMode && (
              <div className="pointer-events-none absolute right-5 bottom-5 left-5 z-20 flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-md rounded-2xl border border-white/12 bg-black/75 p-4 backdrop-blur-xl">
                  <div className="text-[10.5px] tracking-[0.16em] text-[#ffd700] uppercase">
                    {activeItem.spec}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed font-light text-zinc-300">
                    {activeItem.description}
                  </p>
                </div>

                <div className="pointer-events-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => stepActive(-1)}
                    className="cursor-pointer rounded-full border border-white/20 bg-black/75 px-4 py-2 text-[11px] tracking-[0.14em] text-white uppercase backdrop-blur-md transition hover:border-[#ff69b4]"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => stepActive(1)}
                    className="cursor-pointer rounded-full border border-white/20 bg-black/75 px-4 py-2 text-[11px] tracking-[0.14em] text-white uppercase backdrop-blur-md transition hover:border-[#ff69b4]"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
