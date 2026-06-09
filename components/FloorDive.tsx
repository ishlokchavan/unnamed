"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FLOORS, TAGLINES, ZONE_COLORS, type Floor } from "@/lib/building";
import {
  L, R, W, ROOF_CREST, ROOF_UNDER, FH, GRADE, PLAZA, BH, BOTTOM,
  SLAB_AMP, ABOVE, dirOf, waveLine, TOWER, ROOF, MULLIONS, SLAB_YS, LAYOUT,
} from "@/lib/elevation";
import Icon from "./Icon";
import styles from "./FloorDive.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const N = FLOORS.length;        // 9 floors
const STEPS = N + 1;            // + closing coda

/* ---- schematic floor-plan generator ---- */
const FOOT = "M40 30 Q160 12 280 30 Q312 42 300 122 Q312 204 280 218 Q160 236 40 218 Q8 204 20 122 Q8 42 40 30 Z";
const INNER_L = 46, INNER_R = 274, GAP = 5;

function planCells(count: number, cellH: number, r: number) {
  if (count <= 0) return [];
  const topN = Math.ceil(count / 2);
  const botN = count - topN;
  const cells: { x: number; y: number; w: number; h: number; r: number }[] = [];
  const row = (m: number, y: number) => {
    if (m <= 0) return;
    const w = (INNER_R - INNER_L - (m - 1) * GAP) / m;
    for (let i = 0; i < m; i++) cells.push({ x: INNER_L + i * (w + GAP), y, w, h: cellH, r });
  };
  row(topN, 36);
  row(botN, 214 - cellH);
  return cells;
}

function FloorPlan({ floor }: { floor: Floor }) {
  const c = ZONE_COLORS[floor.zone];
  const { layout, units = 0, voidCore } = floor.plan;
  const cellH = layout === "grid" ? 18 : layout === "large" ? 30 : 34;
  const count = layout === "grid" || layout === "large" ? units : floor.plan.features.length;
  const cells = planCells(count, cellH, layout === "open" || layout === "amenity" || layout === "club" ? 8 : 3);

  return (
    <svg viewBox="0 0 320 250" className={styles.planSvg} role="img" aria-label={`${floor.level} plan`}>
      <path d={FOOT} fill={`${c}10`} stroke={`${c}88`} strokeWidth="1.6" />
      {/* gridlines */}
      <path d="M120 24V224M200 24V224M30 84H290M30 164H290" stroke="rgba(243,239,231,0.06)" strokeWidth="1" />
      {/* units / zones */}
      {cells.map((u, i) => (
        <rect key={i} x={u.x} y={u.y} width={u.w} height={u.h} rx={u.r}
              fill={`${c}22`} stroke={`${c}99`} strokeWidth="1.2" />
      ))}
      {/* service core */}
      <g>
        <rect x="139" y="98" width="42" height="52" rx="2" fill="rgba(243,239,231,0.08)" stroke="rgba(243,239,231,0.4)" />
        <path d="M150 98v52M160 98v52M170 98v52" stroke="rgba(243,239,231,0.25)" strokeWidth="1" />
        <text x="160" y="166" textAnchor="middle" className={styles.planTiny}>CORE</text>
      </g>
      {/* atrium void */}
      {voidCore && (
        <g>
          <path d="M214 96q44 28 0 58q-22 -29 0 -58Z" fill="rgba(120,150,170,0.16)" stroke="rgba(243,239,231,0.4)" strokeWidth="1.2" />
          <text x="228" y="129" textAnchor="middle" className={styles.planTiny}>VOID</text>
        </g>
      )}
    </svg>
  );
}

/* ---- the pinned mini-elevation with the active floor lit ---- */
function MiniElevation({ idx }: { idx: number }) {
  const active = idx < N ? LAYOUT[idx] : null;
  return (
    <svg className={styles.elev} viewBox="0 0 1000 1480" role="img" aria-label="Building elevation, active floor highlighted">
      <defs>
        <linearGradient id="fdGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#171922" /><stop offset="1" stopColor="#0a0b10" />
        </linearGradient>
        <linearGradient id="fdGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(232,162,74,0.5)" /><stop offset="1" stopColor="rgba(232,162,74,0)" />
        </linearGradient>
        <linearGradient id="fdBronze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#caa06a" /><stop offset=".5" stopColor="#a9763c" /><stop offset="1" stopColor="#6d4a23" />
        </linearGradient>
        <pattern id="fdHatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(243,239,231,0.12)" strokeWidth="1" />
        </pattern>
        <clipPath id="fdClip"><path d={TOWER} /></clipPath>
      </defs>

      <rect x={L} y={GRADE} width={W} height={BOTTOM - GRADE} fill="#0a0b10" />
      <rect x={L} y={GRADE} width={W} height={BOTTOM - GRADE} fill="url(#fdHatch)" />

      <path d={TOWER} fill="url(#fdGlass)" />
      <g clipPath="url(#fdClip)">
        {ABOVE.map((_, k) => (
          <rect key={k} x={L - 10} y={ROOF_UNDER + k * FH} width={W + 20} height="62" fill="url(#fdGlow)" opacity="0.32" />
        ))}
        {MULLIONS.map((x) => (
          <line key={x} x1={x} y1={ROOF_CREST} x2={x} y2={GRADE + 4} stroke="rgba(243,239,231,0.06)" strokeWidth="1" />
        ))}
        {/* active highlight */}
        {active && <rect x={L} y={active.yTop} width={W} height={active.h} fill="rgba(232,162,74,0.28)" />}
      </g>
      <path d={TOWER} fill="none" stroke="rgba(243,239,231,0.32)" strokeWidth="1.5" />
      <path d={ROOF} fill="url(#fdBronze)" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
      {SLAB_YS.map((y, i) => (
        <path key={y} d={waveLine(y, SLAB_AMP, dirOf(i + 1))} fill="none" stroke="url(#fdBronze)" strokeWidth="6" strokeLinecap="round" />
      ))}
      <path d={waveLine(GRADE, SLAB_AMP, dirOf(7))} fill="none" stroke="rgba(243,239,231,0.5)" strokeWidth="2" />

      {/* floor code tags — active one bright */}
      {LAYOUT.map((l, i) => {
        const on = i === idx;
        return (
          <g key={l.f.id} opacity={on ? 1 : 0.4}>
            <line x1={R + 6} y1={l.yMid} x2={R + 22} y2={l.yMid} stroke="rgba(243,239,231,0.3)" strokeWidth="1" />
            <rect x={R + 22} y={l.yMid - 13} width="40" height="26" rx="3"
                  fill={on ? ZONE_COLORS[l.f.zone] : "rgba(0,0,0,0.35)"} stroke="rgba(243,239,231,0.25)" />
            <text x={R + 42} y={l.yMid + 4} textAnchor="middle" className={styles.elevTag}
                  fill={on ? "#0a0b10" : "#f3efe7"}>{l.f.id}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function FloorDive() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const cur = useRef(0);
  const [idx, setIdx] = useState(0);

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: root.current!,
        start: "top top",
        end: () => "+=" + window.innerHeight * STEPS,
        pin: pin.current!,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (STEPS - 1), duration: 0.25, ease: "power1.inOut" },
        onUpdate: (self) => {
          if (progress.current) progress.current.style.width = self.progress * 100 + "%";
          const i = Math.min(STEPS - 1, Math.round(self.progress * (STEPS - 1)));
          if (i !== cur.current) {
            cur.current = i;
            setIdx(i);
          }
        },
      });
      return () => st.kill();
    },
    { scope: root }
  );

  const floor = idx < N ? FLOORS[idx] : null;

  return (
    <section ref={root} className={styles.scene} aria-label="Floor-by-floor walkthrough">
      <div ref={pin} className={styles.pin}>
        <div className={styles.top} aria-hidden><div ref={progress} className={styles.bar} /></div>

        <header className={styles.heading}>
          <p className={styles.eyebrow}><span className={styles.dot} /> Floor by Floor</p>
          <p className={styles.count}>{idx < N ? `${String(idx + 1).padStart(2, "0")} / ${N}` : "Coda"}</p>
        </header>

        {/* left — the building, active floor lit */}
        <div className={styles.left}>
          <MiniElevation idx={idx} />
        </div>

        {/* right — the active floor's plan + what's on it */}
        <div className={styles.right}>
          {floor ? (
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
                    <Icon name={f.icon} />
                    <span className={styles.chipText}>{f.label}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div key="coda" className={`${styles.card} ${styles.coda}`}>
              <p className={styles.eyebrow}><span className={styles.dot} /> The Statement</p>
              {TAGLINES.map((t, i) => (
                <div key={t} className={styles.tagline} style={{ animationDelay: `${i * 0.12}s` }}>{t}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
