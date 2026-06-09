"use client";

import { useState } from "react";
import { FLOORS, BUILDING_META, type Floor } from "@/lib/building";
import styles from "./Building.module.css";

/* ============================================================
   Geometry for the waving-volume elevation (SVG drafting space).
   Drawn top → bottom like a real elevation: roof, 7 above-grade
   floors (R,L5,L4,L3,L2,L1,G), grade line, then 2 basements.
   ============================================================ */
const L = 250;          // tower left edge
const R = 770;          // tower right edge
const W = R - L;        // tower width
const MID = (L + R) / 2;

const ROOF_CREST = 152; // top of the waving roof
const ROOF_UNDER = 198; // underside of the roof (top of glazing)
const FH = 142;         // above-grade floor height
const GRADE = ROOF_UNDER + 7 * FH; // = 1192, the plaza / ground line
const PLAZA = GRADE + 22;
const BH = 108;         // basement floor height
const BOTTOM = PLAZA + 2 * BH;

const SLAB_AMP = 22;    // wave amplitude of each floor slab
const ROOF_AMP = 46;    // bigger wave for the roof crest

const ABOVE = FLOORS.slice(0, 7); // R … G
const BELOW = FLOORS.slice(7);    // B1, B2

const n = (v: number) => Math.round(v * 10) / 10;
const dirOf = (i: number) => (i % 2 ? -1 : 1);

// a smooth S-wave across the tower at height y
const seg = (y: number, amp: number, d: number) =>
  `C ${n(L + W * 0.28)} ${n(y - amp * d)} ${n(MID - W * 0.12)} ${n(y - amp * d)} ${n(MID)} ${n(y)} ` +
  `C ${n(MID + W * 0.12)} ${n(y + amp * d)} ${n(R - W * 0.28)} ${n(y + amp * d)} ${n(R)} ${n(y)}`;
const segRev = (y: number, amp: number, d: number) =>
  `C ${n(R - W * 0.28)} ${n(y + amp * d)} ${n(MID + W * 0.12)} ${n(y + amp * d)} ${n(MID)} ${n(y)} ` +
  `C ${n(MID - W * 0.12)} ${n(y - amp * d)} ${n(L + W * 0.28)} ${n(y - amp * d)} ${n(L)} ${n(y)}`;
const waveLine = (y: number, amp: number, d: number) => `M ${L} ${n(y)} ${seg(y, amp, d)}`;

// per-floor drawing layout
type Lay = { f: Floor; yTop: number; h: number; yMid: number; above: boolean; bi: number };
const LAYOUT: Lay[] = [
  ...ABOVE.map((f, k) => ({ f, yTop: ROOF_UNDER + k * FH, h: FH, yMid: ROOF_UNDER + k * FH + FH / 2, above: true, bi: k })),
  ...BELOW.map((f, j) => ({ f, yTop: PLAZA + j * BH, h: BH, yMid: PLAZA + j * BH + BH / 2, above: false, bi: 7 + j })),
];

// tower glazing outline (top = roof underside wave, bottom = grade wave)
const TOWER = `M ${L} ${ROOF_UNDER} ${seg(ROOF_UNDER, SLAB_AMP, dirOf(0))} L ${R} ${GRADE} ${segRev(GRADE, SLAB_AMP, dirOf(7))} Z`;
// the waving roof plate band
const ROOF = `M ${L} ${ROOF_CREST} ${seg(ROOF_CREST, ROOF_AMP, 1)} L ${R} ${ROOF_UNDER} ${segRev(ROOF_UNDER, SLAB_AMP, dirOf(0))} Z`;

const MULLIONS = Array.from({ length: Math.floor(W / 22) - 1 }, (_, i) => L + 18 + i * 22);

// facade-feature callouts (static annotation, like the reference board)
const CALLOUTS = [
  { t: "WAVING ROOF STRUCTURE", lx: 24, ly: 150, px: MID - 90, py: ROOF_CREST - 30 },
  { t: "DARK GLASS LAMELLA SKIN", lx: 24, ly: 320, px: L + 70, py: 330 },
  { t: "HIGH-PERFORMANCE CURTAIN WALL", lx: 24, ly: 560, px: L + 44, py: 600 },
  { t: "CANDLE-WARM INTERIOR GLOW", lx: 24, ly: 900, px: L + 96, py: 940 },
  { t: "REFLECTIVE URBAN PLAZA", lx: 24, ly: GRADE + 70, px: MID - 40, py: GRADE + 10 },
  { t: "BELOW-GRADE CLUBS · B1–B2", lx: 24, ly: PLAZA + BH + 30, px: L + 60, py: PLAZA + BH + 4 },
];

export default function Building() {
  const [activeId, setActiveId] = useState("G");
  const active = FLOORS.find((f) => f.id === activeId) ?? FLOORS[0];

  return (
    <section className={styles.board} aria-label="Building design board" id="building">
      {/* ——————————————— TITLE BLOCK ——————————————— */}
      <header className={styles.titleblock}>
        <div>
          <p className={styles.eyebrow}><span className={styles.dot} /> Conceptual 2D Design Board</p>
          <h2 className={styles.title}>The Waving Canvas — Project 2305</h2>
          <p className={styles.lead}>
            {BUILDING_META.stack} · {BUILDING_META.location}. A fluid dark-glass volume
            in the spirit of Opus by Omniyat. Click any level on the elevation to read its programme.
          </p>
        </div>
        <dl className={styles.meta}>
          <div><dt>Stack</dt><dd>{BUILDING_META.stack}</dd></div>
          <div><dt>Area</dt><dd>{BUILDING_META.area}</dd></div>
          <div><dt>Scale</dt><dd>NTS · concept</dd></div>
        </dl>
      </header>

      <div className={styles.sheet}>
        {/* ——————————————— ELEVATION ——————————————— */}
        <figure className={styles.elevWrap}>
          <svg className={styles.elev} viewBox="0 0 1000 1560" role="img"
               aria-label="North elevation of the waving-volume building">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="rgba(243,239,231,0.05)" strokeWidth="1" />
              </pattern>
              <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#171922" />
                <stop offset="1" stopColor="#0a0b10" />
              </linearGradient>
              <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(232,162,74,0.55)" />
                <stop offset="1" stopColor="rgba(232,162,74,0)" />
              </linearGradient>
              <linearGradient id="bronze" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#caa06a" />
                <stop offset="0.5" stopColor="#a9763c" />
                <stop offset="1" stopColor="#6d4a23" />
              </linearGradient>
              <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(243,239,231,0.12)" strokeWidth="1" />
              </pattern>
              <clipPath id="towerClip"><path d={TOWER} /></clipPath>
            </defs>

            {/* sheet + grid + registration frame */}
            <rect x="0" y="0" width="1000" height="1560" fill="url(#grid)" />
            <rect x="8" y="8" width="984" height="1544" fill="none" stroke="rgba(243,239,231,0.14)" strokeWidth="1.5" />

            {/* key plan corner */}
            <g transform="translate(24 24)">
              <rect width="118" height="64" fill="rgba(0,0,0,0.3)" stroke="rgba(243,239,231,0.18)" />
              <path d="M14 40 q14 -16 28 0 t28 0 t28 0" fill="none" stroke="#e8a24a" strokeWidth="1.4" />
              <text x="14" y="56" className={styles.svgTiny}>KEY PLAN</text>
            </g>

            {/* below-grade block (basements) */}
            <rect x={L} y={GRADE} width={W} height={BOTTOM - GRADE} fill="#0a0b10" />
            <rect x={L} y={GRADE} width={W} height={BOTTOM - GRADE} fill="url(#hatch)" />
            {BELOW.map((f, j) => {
              const yTop = PLAZA + j * BH;
              const on = f.id === activeId;
              return (
                <g key={f.id} onClick={() => setActiveId(f.id)} onMouseEnter={() => setActiveId(f.id)} className={styles.hit}>
                  {on && <rect x={L} y={yTop} width={W} height={BH} fill="rgba(232,162,74,0.16)" />}
                  <rect x={L} y={yTop} width={W} height={BH} fill="transparent" />
                </g>
              );
            })}
            <line x1={L} y1={PLAZA} x2={R} y2={PLAZA} stroke="rgba(243,239,231,0.25)" strokeWidth="1" strokeDasharray="6 5" />
            <line x1={L} y1={PLAZA + BH} x2={R} y2={PLAZA + BH} stroke="rgba(243,239,231,0.18)" strokeWidth="1" strokeDasharray="6 5" />

            {/* tower glazing + interior */}
            <path d={TOWER} fill="url(#glass)" />
            <g clipPath="url(#towerClip)">
              {/* warm interior glow under each slab */}
              {ABOVE.map((_, k) => (
                <rect key={k} x={L - 10} y={ROOF_UNDER + k * FH} width={W + 20} height="62" fill="url(#glow)" opacity="0.5" />
              ))}
              {/* curtain-wall mullions */}
              {MULLIONS.map((x) => (
                <line key={x} x1={x} y1={ROOF_CREST} x2={x} y2={GRADE + 4} stroke="rgba(243,239,231,0.07)" strokeWidth="1" />
              ))}
              {/* active floor highlight */}
              {LAYOUT.filter((l) => l.above && l.f.id === activeId).map((l) => (
                <rect key={l.f.id} x={L} y={l.yTop} width={W} height={l.h} fill="rgba(232,162,74,0.18)" />
              ))}
            </g>
            <path d={TOWER} fill="none" stroke="rgba(243,239,231,0.3)" strokeWidth="1.5" />

            {/* waving roof plate */}
            <path d={ROOF} fill="url(#bronze)" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />

            {/* slab edges (bronze waving lines) */}
            {Array.from({ length: 7 }, (_, k) => ROOF_UNDER + (k + 1) * FH).map((y, i) => (
              <path key={y} d={waveLine(y, SLAB_AMP, dirOf(i + 1))} fill="none" stroke="url(#bronze)" strokeWidth="6" strokeLinecap="round" />
            ))}

            {/* invisible hit-zones for above-grade floors */}
            {LAYOUT.filter((l) => l.above).map((l) => (
              <rect key={l.f.id} x={L} y={l.yTop} width={W} height={l.h} fill="transparent"
                    className={styles.hit} onClick={() => setActiveId(l.f.id)} onMouseEnter={() => setActiveId(l.f.id)} />
            ))}

            {/* plaza + reflecting pool */}
            <path d={waveLine(GRADE, SLAB_AMP, dirOf(7))} fill="none" stroke="rgba(243,239,231,0.5)" strokeWidth="2" />
            <rect x="40" y={GRADE + 6} width="920" height="18" fill="rgba(120,150,170,0.12)" />
            {/* two figures for scale */}
            {[MID - 38, MID + 22].map((x, i) => (
              <g key={i} stroke="rgba(243,239,231,0.5)" strokeWidth="2" fill="none">
                <circle cx={x} cy={GRADE - 26} r="4" />
                <line x1={x} y1={GRADE - 22} x2={x} y2={GRADE - 4} />
              </g>
            ))}

            {/* floor code tags (right) */}
            {LAYOUT.map((l) => {
              const on = l.f.id === activeId;
              return (
                <g key={l.f.id} className={styles.hit} onClick={() => setActiveId(l.f.id)} onMouseEnter={() => setActiveId(l.f.id)}>
                  <line x1={R + 6} y1={l.yMid} x2={R + 22} y2={l.yMid} stroke="rgba(243,239,231,0.3)" strokeWidth="1" />
                  <rect x={R + 22} y={l.yMid - 13} width="40" height="26" rx="3"
                        fill={on ? "#e8a24a" : "rgba(0,0,0,0.35)"} stroke="rgba(243,239,231,0.25)" />
                  <text x={R + 42} y={l.yMid + 4} textAnchor="middle"
                        className={styles.svgTag} fill={on ? "#1a1206" : "#f3efe7"}>{l.f.id}</text>
                </g>
              );
            })}

            {/* facade callouts (left) */}
            {CALLOUTS.map((c) => (
              <g key={c.t}>
                <line x1={c.lx + 2} y1={c.ly + 4} x2={L - 6} y2={c.ly + 4} stroke="rgba(243,239,231,0.22)" strokeWidth="1" />
                <line x1={L - 6} y1={c.ly + 4} x2={c.px} y2={c.py} stroke="rgba(243,239,231,0.22)" strokeWidth="1" />
                <circle cx={c.px} cy={c.py} r="2.5" fill="#e8a24a" />
                <text x={c.lx} y={c.ly} className={styles.svgLabel}>{c.t}</text>
              </g>
            ))}

            {/* bottom chrome: title, scale bar, north arrow */}
            <text x={L} y={1500} className={styles.svgHead}>NORTH ELEVATION</text>
            <text x={L} y={1518} className={styles.svgTiny}>SCALE — NTS · CONCEPT</text>
            <g transform={`translate(${R - 30} 1486)`}>
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={i * 26} y="0" width="26" height="8" fill={i % 2 ? "#0a0b10" : "#e8a24a"} stroke="rgba(243,239,231,0.4)" />
              ))}
              <text x="0" y="24" className={styles.svgTiny}>0</text>
              <text x="52" y="24" className={styles.svgTiny}>5</text>
              <text x="104" y="24" className={styles.svgTiny}>10m</text>
            </g>
            <g transform="translate(930 1500)">
              <circle r="16" fill="none" stroke="rgba(243,239,231,0.4)" />
              <path d="M0 -12 L5 6 L0 1 L-5 6 Z" fill="#e8a24a" />
              <text x="0" y="-20" textAnchor="middle" className={styles.svgTiny}>N</text>
            </g>
          </svg>
        </figure>

        {/* ——————————————— RIGHT: SCHEDULE + DETAIL ——————————————— */}
        <div className={styles.side}>
          {/* drawing schedule = clickable floor index */}
          <div className={styles.schedule}>
            <p className={styles.schedHead}>Floor Schedule</p>
            {LAYOUT.map((l) => {
              const on = l.f.id === activeId;
              return (
                <button key={l.f.id} className={`${styles.row} ${styles[l.f.zone]} ${on ? styles.rowOn : ""}`}
                        onClick={() => setActiveId(l.f.id)} onMouseEnter={() => setActiveId(l.f.id)}>
                  <span className={styles.rowCode}>{l.f.id}</span>
                  <span className={styles.rowName}>{l.f.name}</span>
                  <span className={styles.rowLvl}>{l.f.level}</span>
                </button>
              );
            })}
          </div>

          {/* detail panel for the active floor */}
          <aside className={styles.panel} aria-live="polite">
            <div className={styles.panelTop}>
              <span className={`${styles.panelCode} ${styles[active.zone]}`}>{active.id}</span>
              <div>
                <p className={styles.panelLevel}>{active.level}</p>
                <h3 className={styles.panelName}>{active.name}</h3>
              </div>
            </div>
            <p className={styles.panelSummary}>{active.summary}</p>
            <p className={styles.panelScope}>{active.scope}</p>
            <ul className={styles.list}>
              {active.details.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </aside>

          {/* two reference insets, like the board */}
          <div className={styles.insets}>
            <figure className={styles.inset}>
              <svg viewBox="0 0 200 150" className={styles.insetSvg} aria-hidden>
                <rect x="0" y="0" width="200" height="150" fill="url(#grid)" />
                <path d="M22 30 q30 -16 62 0 t62 0 t30 6 v74 q-30 14 -62 0 t-62 0 t-30 -6 Z"
                      fill="rgba(232,162,74,0.05)" stroke="rgba(243,239,231,0.4)" strokeWidth="1.4" />
                <rect x="78" y="62" width="30" height="30" fill="rgba(243,239,231,0.1)" stroke="rgba(243,239,231,0.4)" />
                <path d="M120 58 q24 14 0 36 q-12 -18 0 -36 Z" fill="rgba(120,150,170,0.18)" stroke="rgba(243,239,231,0.4)" />
                <text x="30" y="48" className={styles.svgTiny}>RETAIL PERIMETER</text>
                <text x="118" y="106" className={styles.svgTiny}>ATRIUM VOID</text>
                <text x="70" y="106" className={styles.svgTiny}>CORE</text>
              </svg>
              <figcaption>Typical retail floor plan · L1</figcaption>
            </figure>
            <figure className={styles.inset}>
              <svg viewBox="0 0 200 150" className={styles.insetSvg} aria-hidden>
                <rect x="0" y="0" width="200" height="150" fill="url(#grid)" />
                {[0, 1, 2, 3].map((i) => (
                  <path key={i} d={`M40 ${50 + i * 22} q30 -12 60 0 t60 0 l0 8 q-30 12 -60 0 t-60 0 Z`}
                        fill={i % 2 ? "url(#bronze)" : "rgba(243,239,231,0.08)"}
                        stroke="rgba(243,239,231,0.35)" strokeWidth="1" />
                ))}
              </svg>
              <figcaption>Massing configuration · stacked volumes</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
