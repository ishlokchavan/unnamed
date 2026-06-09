"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FLOORS, BUILDING_META, ZONE_COLORS, type Floor } from "@/lib/building";
import {
  L, R, W, MID, ROOF_CREST, ROOF_UNDER, FH, GRADE, PLAZA, BH, BOTTOM,
  SLAB_AMP, ABOVE, dirOf, waveLine, TOWER, ROOF, MULLIONS, SLAB_YS, LAYOUT,
} from "@/lib/elevation";
import Icon from "./Icon";
import styles from "./Experience.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const F = FLOORS.length;     // 9 floors
const DIVE = 0.26;           // progress where the floor walkthrough begins
const PER = (1 - DIVE) / F;  // the dive runs to the end; the reel closes it out

const CALLOUTS = [
  { t: "WAVING ROOF STRUCTURE", lx: 24, ly: 150, px: MID - 90, py: ROOF_CREST - 30 },
  { t: "DARK GLASS LAMELLA SKIN", lx: 24, ly: 320, px: L + 70, py: 330 },
  { t: "HIGH-PERFORMANCE CURTAIN WALL", lx: 24, ly: 560, px: L + 44, py: 600 },
  { t: "CANDLE-WARM INTERIOR GLOW", lx: 24, ly: 900, px: L + 96, py: 940 },
  { t: "REFLECTIVE URBAN PLAZA", lx: 24, ly: GRADE + 70, px: MID - 40, py: GRADE + 10 },
  { t: "BELOW-GRADE CLUBS · B1–B2", lx: 24, ly: PLAZA + BH + 30, px: L + 60, py: PLAZA + BH + 4 },
];

/* ---- schematic floor-plan ---- */
const FOOT = "M40 30 Q160 12 280 30 Q312 42 300 122 Q312 204 280 218 Q160 236 40 218 Q8 204 20 122 Q8 42 40 30 Z";
const INNER_L = 46, INNER_R = 274, GAP = 5;

function planCells(count: number, cellH: number, r: number) {
  if (count <= 0) return [];
  const topN = Math.ceil(count / 2);
  const cells: { x: number; y: number; w: number; h: number; r: number }[] = [];
  const row = (m: number, y: number) => {
    if (m <= 0) return;
    const w = (INNER_R - INNER_L - (m - 1) * GAP) / m;
    for (let i = 0; i < m; i++) cells.push({ x: INNER_L + i * (w + GAP), y, w, h: cellH, r });
  };
  row(topN, 36);
  row(count - topN, 214 - cellH);
  return cells;
}

function FloorPlan({ floor }: { floor: Floor }) {
  const c = ZONE_COLORS[floor.zone];
  const { layout, units = 0, voidCore } = floor.plan;
  const cellH = layout === "grid" ? 18 : layout === "large" ? 30 : 34;
  const count = layout === "grid" || layout === "large" ? units : floor.plan.features.length;
  const cells = planCells(count, cellH, layout === "grid" || layout === "large" ? 3 : 8);
  return (
    <svg viewBox="0 0 320 250" className={styles.planSvg} role="img" aria-label={`${floor.level} plan`}>
      <path d={FOOT} fill={`${c}10`} stroke={`${c}88`} strokeWidth="1.6" />
      <path d="M120 24V224M200 24V224M30 84H290M30 164H290" stroke="rgba(243,239,231,0.06)" strokeWidth="1" />
      {cells.map((u, i) => (
        <rect key={i} x={u.x} y={u.y} width={u.w} height={u.h} rx={u.r} fill={`${c}22`} stroke={`${c}99`} strokeWidth="1.2" />
      ))}
      <rect x="139" y="98" width="42" height="52" rx="2" fill="rgba(243,239,231,0.08)" stroke="rgba(243,239,231,0.4)" />
      <path d="M150 98v52M160 98v52M170 98v52" stroke="rgba(243,239,231,0.25)" strokeWidth="1" />
      <text x="160" y="166" textAnchor="middle" className={styles.planTiny}>CORE</text>
      {voidCore && (
        <>
          <path d="M214 96q44 28 0 58q-22 -29 0 -58Z" fill="rgba(120,150,170,0.16)" stroke="rgba(243,239,231,0.4)" strokeWidth="1.2" />
          <text x="228" y="129" textAnchor="middle" className={styles.planTiny}>VOID</text>
        </>
      )}
    </svg>
  );
}

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  const roof = useRef<SVGPathElement>(null);
  const towerStroke = useRef<SVGPathElement>(null);
  const glassFill = useRef<SVGPathElement>(null);
  const gradeLine = useRef<SVGPathElement>(null);
  const base = useRef<SVGGElement>(null);
  const mull = useRef<SVGGElement>(null);
  const tagsG = useRef<SVGGElement>(null);
  const callG = useRef<SVGGElement>(null);
  const slabs = useRef<(SVGPathElement | null)[]>([]);
  const glows = useRef<(SVGRectElement | null)[]>([]);

  const phaseRef = useRef<"build" | "floor">("build");
  const idxRef = useRef(0);
  const [phase, setPhase] = useState<"build" | "floor">("build");
  const [idx, setIdx] = useState(0);

  useGSAP(
    () => {
      const slabEls = slabs.current.filter(Boolean) as SVGPathElement[];
      const glowEls = glows.current.filter(Boolean) as SVGRectElement[];
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const prep = (el: SVGPathElement | null) => {
        if (!el) return;
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      };
      [roof.current, towerStroke.current, gradeLine.current].forEach(prep);
      slabEls.forEach(prep);
      gsap.set([glassFill.current, base.current, mull.current, callG.current, tagsG.current], { autoAlpha: 0 });
      gsap.set(glowEls, { autoAlpha: 0, y: 22 });

      const setFinal = () => {
        gsap.set([roof.current, towerStroke.current, gradeLine.current, ...slabEls], { strokeDashoffset: 0 });
        gsap.set([glassFill.current, base.current, mull.current, tagsG.current], { autoAlpha: 1 });
        gsap.set(glowEls, { autoAlpha: 0.45, y: 0 });
      };

      if (reduce) {
        setFinal();
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current!,
          start: "top top",
          end: () => "+=" + window.innerHeight * 12,
          pin: pin.current!,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (v) => {
              if (v < DIVE - PER * 0.5) return v;       // free scrub through assembly/ignition
              const i = Math.min(F - 1, Math.max(0, Math.floor((v - DIVE) / PER)));
              return DIVE + (i + 0.5) * PER;             // snap to each floor
            },
            duration: 0.25,
            ease: "power1.inOut",
          },
          onUpdate: (self) => {
            const p = self.progress;
            if (progress.current) progress.current.style.width = p * 100 + "%";
            let ph: "build" | "floor" = "build";
            let fi = idxRef.current;
            if (p >= DIVE) { ph = "floor"; fi = Math.min(F - 1, Math.floor((p - DIVE) / PER)); }
            if (ph !== phaseRef.current) { phaseRef.current = ph; setPhase(ph); }
            if (fi !== idxRef.current) { idxRef.current = fi; setIdx(fi); }
          },
        },
      });

      // —— Movement I · Assembly (draw it in) ——
      tl.to(roof.current, { strokeDashoffset: 0, duration: 0.05 }, 0);
      tl.to(towerStroke.current, { strokeDashoffset: 0, duration: 0.08 }, 0.02);
      tl.to(base.current, { autoAlpha: 1, duration: 0.05 }, 0.03);
      tl.to(glassFill.current, { autoAlpha: 1, duration: 0.06 }, 0.06);
      tl.to(gradeLine.current, { strokeDashoffset: 0, duration: 0.06 }, 0.07);
      tl.to(slabEls, { strokeDashoffset: 0, duration: 0.12, stagger: 0.014 }, 0.06);
      tl.to(callG.current, { autoAlpha: 1, duration: 0.08 }, 0.05);
      tl.to(mull.current, { autoAlpha: 1, duration: 0.06, ease: "power1.out" }, 0.12);

      // —— Movement II · Ignition (floors wake) ——
      tl.to(glowEls, { autoAlpha: 0.45, y: 0, duration: 0.08, stagger: 0.012, ease: "power2.out" }, 0.16);
      tl.to(tagsG.current, { autoAlpha: 1, duration: 0.06 }, 0.18);

      // callouts retire before the floor walkthrough
      tl.to(callG.current, { autoAlpha: 0, duration: 0.05 }, 0.22);

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root }
  );

  const active = LAYOUT[idx];
  const floor = phase === "floor" ? FLOORS[idx] : null;

  return (
    <section ref={root} className={styles.scene} aria-label="The Waving Canvas — building walkthrough">
      <div ref={pin} className={styles.pin}>
        <div className={styles.top} aria-hidden><div ref={progress} className={styles.bar} /></div>

        {/* persistent title block — the board identity */}
        <header className={styles.titleblock}>
          <p className={styles.eyebrow}><span className={styles.dot} /> Conceptual Walkthrough · Project 2305</p>
          <p className={styles.count}>
            {phase === "build" ? "Overview" : `${String(idx + 1).padStart(2, "0")} / ${F}`}
          </p>
        </header>

        {/* —— left: the one persistent elevation —— */}
        <div className={styles.left}>
          <svg className={styles.elev} viewBox="0 0 1000 1560" role="img"
               aria-label="Waving-volume elevation, building and lighting up">
            <defs>
              <linearGradient id="exGlass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#171922" /><stop offset="1" stopColor="#0a0b10" />
              </linearGradient>
              <linearGradient id="exGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(232,162,74,0.6)" /><stop offset="1" stopColor="rgba(232,162,74,0)" />
              </linearGradient>
              <linearGradient id="exBronze" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#caa06a" /><stop offset=".5" stopColor="#a9763c" /><stop offset="1" stopColor="#6d4a23" />
              </linearGradient>
              <pattern id="exHatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(243,239,231,0.12)" strokeWidth="1" />
              </pattern>
              <clipPath id="exClip"><path d={TOWER} /></clipPath>
            </defs>

            {/* key plan */}
            <g transform="translate(24 24)">
              <rect width="118" height="64" fill="rgba(0,0,0,0.3)" stroke="rgba(243,239,231,0.18)" />
              <path d="M14 40 q14 -16 28 0 t28 0 t28 0" fill="none" stroke="#e8a24a" strokeWidth="1.4" />
              <text x="14" y="56" className={styles.svgTiny}>KEY PLAN</text>
            </g>

            <g ref={base}>
              <rect x={L} y={GRADE} width={W} height={BOTTOM - GRADE} fill="#0a0b10" />
              <rect x={L} y={GRADE} width={W} height={BOTTOM - GRADE} fill="url(#exHatch)" />
            </g>

            <path ref={glassFill} d={TOWER} fill="url(#exGlass)" />
            <g clipPath="url(#exClip)">
              {ABOVE.map((_, k) => (
                <rect key={k} ref={(el) => { if (el) glows.current[k] = el; }}
                      x={L - 10} y={ROOF_UNDER + k * FH} width={W + 20} height="62" fill="url(#exGlow)" />
              ))}
              <g ref={mull}>
                {MULLIONS.map((x) => (
                  <line key={x} x1={x} y1={ROOF_CREST} x2={x} y2={GRADE + 4} stroke="rgba(243,239,231,0.08)" strokeWidth="1" />
                ))}
              </g>
            </g>

            {/* active-floor highlight (during the walkthrough) */}
            {phase === "floor" && active && (
              active.above
                ? <g clipPath="url(#exClip)"><rect x={L} y={active.yTop} width={W} height={active.h} fill="rgba(232,162,74,0.3)" /></g>
                : <rect x={L} y={active.yTop} width={W} height={active.h} fill="rgba(232,162,74,0.26)" />
            )}

            <path ref={towerStroke} d={TOWER} fill="none" stroke="rgba(243,239,231,0.4)" strokeWidth="1.5" />
            <path ref={roof} d={ROOF} fill="url(#exBronze)" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
            {SLAB_YS.map((y, i) => (
              <path key={y} ref={(el) => { if (el) slabs.current[i] = el; }}
                    d={waveLine(y, SLAB_AMP, dirOf(i + 1))} fill="none" stroke="url(#exBronze)" strokeWidth="6" strokeLinecap="round" />
            ))}
            <path ref={gradeLine} d={waveLine(GRADE, SLAB_AMP, dirOf(7))} fill="none" stroke="rgba(243,239,231,0.5)" strokeWidth="2" />

            {/* plaza + scale figures */}
            <rect x="40" y={GRADE + 6} width="920" height="18" fill="rgba(120,150,170,0.12)" />
            {[MID - 38, MID + 22].map((x, i) => (
              <g key={i} stroke="rgba(243,239,231,0.5)" strokeWidth="2" fill="none">
                <circle cx={x} cy={GRADE - 26} r="4" /><line x1={x} y1={GRADE - 22} x2={x} y2={GRADE - 4} />
              </g>
            ))}

            {/* code tags (ignite together) + active marker */}
            <g ref={tagsG}>
              {LAYOUT.map((l) => (
                <g key={l.f.id}>
                  <line x1={R + 6} y1={l.yMid} x2={R + 22} y2={l.yMid} stroke="rgba(243,239,231,0.3)" strokeWidth="1" />
                  <rect x={R + 22} y={l.yMid - 13} width="40" height="26" rx="3" fill={ZONE_COLORS[l.f.zone]} />
                  <text x={R + 42} y={l.yMid + 4} textAnchor="middle" className={styles.elevTag} fill="#0a0b10">{l.f.id}</text>
                </g>
              ))}
            </g>
            {phase === "floor" && active && (
              <path d={`M${R + 70} ${active.yMid - 9} L${R + 84} ${active.yMid} L${R + 70} ${active.yMid + 9} Z`} fill="#e8a24a" />
            )}

            {/* facade callouts (retire before the walkthrough) */}
            <g ref={callG}>
              {CALLOUTS.map((c) => (
                <g key={c.t}>
                  <line x1={c.lx + 2} y1={c.ly + 4} x2={L - 6} y2={c.ly + 4} stroke="rgba(243,239,231,0.22)" strokeWidth="1" />
                  <line x1={L - 6} y1={c.ly + 4} x2={c.px} y2={c.py} stroke="rgba(243,239,231,0.22)" strokeWidth="1" />
                  <circle cx={c.px} cy={c.py} r="2.5" fill="#e8a24a" />
                  <text x={c.lx} y={c.ly} className={styles.svgLabel}>{c.t}</text>
                </g>
              ))}
            </g>

            {/* bottom chrome */}
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
        </div>

        {/* —— right: the panel that evolves —— */}
        <div className={styles.right}>
          {phase === "build" && (
            <div key="overview" className={styles.card}>
              <h2 className={styles.title}>The Waving Canvas</h2>
              <p className={styles.lead}>
                {BUILDING_META.stack} · {BUILDING_META.location}. A fluid dark-glass volume
                in the spirit of Opus by Omniyat. Keep scrolling — it builds, lights up, then
                opens floor by floor.
              </p>
              <dl className={styles.facts}>
                <div><dt>Footprint</dt><dd>{BUILDING_META.area}</dd></div>
                <div><dt>Skin</dt><dd>{BUILDING_META.look}</dd></div>
                <div><dt>Parking</dt><dd>{BUILDING_META.parking}</dd></div>
                <div><dt>Feel</dt><dd>{BUILDING_META.feel}</dd></div>
              </dl>
            </div>
          )}

          {phase === "floor" && floor && (
            <div key={floor.id} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.code} style={{ background: ZONE_COLORS[floor.zone] }}>{floor.id}</span>
                <div>
                  <p className={styles.lvl}>{floor.level}</p>
                  <h3 className={styles.name}>{floor.name}</h3>
                </div>
              </div>
              <p className={styles.scope}>{floor.scope}</p>
              <FloorPlan floor={floor} />
              <div className={styles.features}>
                {floor.plan.features.map((f) => (
                  <span key={f.label} className={styles.chip}
                        style={{ color: ZONE_COLORS[floor.zone], borderColor: `${ZONE_COLORS[floor.zone]}55` }}>
                    <Icon name={f.icon} /><span className={styles.chipText}>{f.label}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
