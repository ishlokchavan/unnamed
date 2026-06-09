"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ZONE_COLORS } from "@/lib/building";
import {
  L, R, W, MID, ROOF_CREST, ROOF_UNDER, FH, GRADE, PLAZA, BH, BOTTOM,
  SLAB_AMP, ABOVE, dirOf, waveLine, TOWER, ROOF, MULLIONS, SLAB_YS, LAYOUT,
} from "@/lib/elevation";
import styles from "./Reveal.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---- content derived from the concept (honest, structural) ---- */
const CHAPTERS = [
  { k: "Chapter I", t: "Assembly", d: "Two basements, a ground plane, five floors and the open sky — drawn the way an architect would lay it down, line by line." },
  { k: "Chapter II", t: "Ignition", d: "Then the volume wakes. Every level glows with its own programme, a different world stacked on the last." },
  { k: "Chapter III", t: "By the Numbers", d: "One building, nine vertical worlds — sized to rival Dubai's premium destinations." },
  { k: "Chapter IV", t: "The Statement", d: "" },
];

const METRICS = [
  { target: 1000000, label: "Gross build-up · sq ft", note: "up to" },
  { target: 9, label: "Vertical levels" },
  { target: 4000, label: "Max store footprint · sq ft" },
];

const PROGRAMME = [
  { label: "Nightlife & Clubs", zone: "nightlife" as const, count: 4 },
  { label: "Retail", zone: "retail" as const, count: 2 },
  { label: "Workspace", zone: "office" as const, count: 1 },
  { label: "Community", zone: "community" as const, count: 1 },
  { label: "F&B / Arrival", zone: "fnb" as const, count: 1 },
];
const TOTAL_FLOORS = PROGRAMME.reduce((s, p) => s + p.count, 0);

const TAGLINES = ["The Alternative Canvas of Dubai.", "Where the Underground Meets the Sky.", "Premium Dissent."];

export default function Reveal() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  const roof = useRef<SVGPathElement>(null);
  const towerStroke = useRef<SVGPathElement>(null);
  const glassFill = useRef<SVGPathElement>(null);
  const gradeLine = useRef<SVGPathElement>(null);
  const base = useRef<SVGGElement>(null);
  const mull = useRef<SVGGElement>(null);
  const slabs = useRef<(SVGPathElement | null)[]>([]);
  const glows = useRef<(SVGRectElement | null)[]>([]);
  const labels = useRef<(SVGGElement | null)[]>([]);

  const chapters = useRef<(HTMLDivElement | null)[]>([]);
  const nums = useRef<(HTMLSpanElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const tags = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const slabEls = slabs.current.filter(Boolean) as SVGPathElement[];
      const glowEls = glows.current.filter(Boolean) as SVGRectElement[];
      const labelEls = labels.current.filter(Boolean) as SVGGElement[];
      const numEls = nums.current.filter(Boolean) as HTMLSpanElement[];
      const barEls = bars.current.filter(Boolean) as HTMLSpanElement[];
      const tagEls = tags.current.filter(Boolean) as HTMLDivElement[];
      const chapEls = chapters.current.filter(Boolean) as HTMLDivElement[];
      const dotEls = dots.current.filter(Boolean) as HTMLSpanElement[];

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const setFinal = () => {
        gsap.set([roof.current, towerStroke.current, gradeLine.current, ...slabEls], { strokeDashoffset: 0 });
        gsap.set([glassFill.current, base.current, mull.current], { autoAlpha: 1 });
        gsap.set(glowEls, { autoAlpha: 0.5, y: 0 });
        gsap.set(labelEls, { autoAlpha: 1, x: 0 });
        barEls.forEach((b) => (b.style.transform = "scaleX(1)"));
        numEls.forEach((el, i) => (el.textContent = Math.round(METRICS[i].target).toLocaleString()));
        gsap.set(tagEls, { autoAlpha: 1, y: 0 });
      };

      // prep "draw-on" strokes
      const prep = (el: SVGPathElement | null) => {
        if (!el) return;
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      };
      [roof.current, towerStroke.current, gradeLine.current].forEach(prep);
      slabEls.forEach(prep);

      // initial hidden states
      gsap.set([glassFill.current, base.current, mull.current], { autoAlpha: 0 });
      gsap.set(glowEls, { autoAlpha: 0, y: 22 });
      gsap.set(labelEls, { autoAlpha: 0, x: -16 });
      gsap.set(tagEls, { autoAlpha: 0, y: 16 });
      barEls.forEach((b) => {
        b.style.transformOrigin = "left center";
        b.style.transform = "scaleX(0)";
      });
      if (chapEls[0]) chapEls.forEach((c, i) => (c.style.opacity = i === 0 ? "1" : "0"));
      if (dotEls[0]) dotEls.forEach((d, i) => d.classList.toggle(styles.dotOn, i === 0));

      if (reduce) {
        setFinal();
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current!,
          start: "top top",
          end: () => "+=" + window.innerHeight * 5,
          pin: pin.current!,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (progress.current) progress.current.style.width = p * 100 + "%";
            const idx = p < 0.32 ? 0 : p < 0.6 ? 1 : p < 0.84 ? 2 : 3;
            chapEls.forEach((c, i) => (c.style.opacity = i === idx ? "1" : "0"));
            dotEls.forEach((d, i) => d.classList.toggle(styles.dotOn, i === idx));
          },
        },
      });

      // —— Chapter I · Assembly (draw it in) ——
      tl.to(roof.current, { strokeDashoffset: 0, duration: 0.08 }, 0);
      tl.to(towerStroke.current, { strokeDashoffset: 0, duration: 0.14 }, 0.02);
      tl.to(base.current, { autoAlpha: 1, duration: 0.1 }, 0.05);
      tl.to(glassFill.current, { autoAlpha: 1, duration: 0.12 }, 0.1);
      tl.to(gradeLine.current, { strokeDashoffset: 0, duration: 0.1 }, 0.12);
      tl.to(slabEls, { strokeDashoffset: 0, duration: 0.22, stagger: 0.03 }, 0.1);
      tl.to(mull.current, { autoAlpha: 1, duration: 0.12, ease: "power1.out" }, 0.18);

      // —— Chapter II · Ignition (floors come alive) ——
      tl.to(glowEls, { autoAlpha: 0.5, y: 0, duration: 0.18, stagger: 0.025, ease: "power2.out" }, 0.34);
      tl.to(labelEls, { autoAlpha: 1, x: 0, duration: 0.16, stagger: 0.03, ease: "power2.out" }, 0.36);

      // —— Chapter III · Numbers ——
      numEls.forEach((el, i) => {
        const o = { v: 0 };
        tl.to(o, {
          v: METRICS[i].target,
          duration: 0.18,
          onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString()),
        }, 0.62 + i * 0.015);
      });
      barEls.forEach((b, i) => {
        tl.to(b, { scaleX: 1, duration: 0.16, ease: "power2.out" }, 0.64 + i * 0.025);
      });

      // —— Chapter IV · Statement ——
      tl.to(tagEls, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.06, ease: "power2.out" }, 0.86);

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.scene} aria-label="The building comes alive">
      <div ref={pin} className={styles.pin}>
        {/* progress + chapter dots */}
        <div className={styles.top} aria-hidden>
          <div ref={progress} className={styles.bar} />
        </div>
        <div className={styles.dots} aria-hidden>
          {CHAPTERS.map((c, i) => (
            <span key={c.t} ref={(el) => { dots.current[i] = el; }} className={styles.dot} title={c.t} />
          ))}
        </div>

        {/* —— the constructing tower —— */}
        <div className={styles.left}>
          <svg className={styles.elev} viewBox="0 0 1000 1480" role="img"
               aria-label="The waving-volume building assembling itself">
            <defs>
              <linearGradient id="rGlass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#171922" />
                <stop offset="1" stopColor="#0a0b10" />
              </linearGradient>
              <linearGradient id="rGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(232,162,74,0.6)" />
                <stop offset="1" stopColor="rgba(232,162,74,0)" />
              </linearGradient>
              <linearGradient id="rBronze" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#caa06a" />
                <stop offset="0.5" stopColor="#a9763c" />
                <stop offset="1" stopColor="#6d4a23" />
              </linearGradient>
              <pattern id="rHatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(243,239,231,0.12)" strokeWidth="1" />
              </pattern>
              <clipPath id="rTowerClip"><path d={TOWER} /></clipPath>
            </defs>

            {/* below-grade block */}
            <g ref={base}>
              <rect x={L} y={GRADE} width={W} height={BOTTOM - GRADE} fill="#0a0b10" />
              <rect x={L} y={GRADE} width={W} height={BOTTOM - GRADE} fill="url(#rHatch)" />
            </g>

            {/* glazing fill + interior, clipped */}
            <path ref={glassFill} d={TOWER} fill="url(#rGlass)" />
            <g clipPath="url(#rTowerClip)">
              {ABOVE.map((_, k) => (
                <rect key={k} ref={(el) => { glows.current[k] = el; }}
                      x={L - 10} y={ROOF_UNDER + k * FH} width={W + 20} height="62" fill="url(#rGlow)" />
              ))}
              <g ref={mull}>
                {MULLIONS.map((x) => (
                  <line key={x} x1={x} y1={ROOF_CREST} x2={x} y2={GRADE + 4} stroke="rgba(243,239,231,0.08)" strokeWidth="1" />
                ))}
              </g>
            </g>

            {/* outlines that draw in */}
            <path ref={towerStroke} d={TOWER} fill="none" stroke="rgba(243,239,231,0.4)" strokeWidth="1.5" />
            <path ref={roof} d={ROOF} fill="url(#rBronze)" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
            {SLAB_YS.map((y, i) => (
              <path key={y} ref={(el) => { slabs.current[i] = el; }}
                    d={waveLine(y, SLAB_AMP, dirOf(i + 1))} fill="none" stroke="url(#rBronze)" strokeWidth="6" strokeLinecap="round" />
            ))}
            <path ref={gradeLine} d={waveLine(GRADE, SLAB_AMP, dirOf(7))} fill="none" stroke="rgba(243,239,231,0.5)" strokeWidth="2" />

            {/* floor labels that ignite */}
            {LAYOUT.map((l, i) => (
              <g key={l.f.id} ref={(el) => { labels.current[i] = el; }} transform={`translate(${R + 18} ${l.yMid})`}>
                <rect x="0" y="-13" width="34" height="26" rx="3" fill={ZONE_COLORS[l.f.zone]} />
                <text x="17" y="4" textAnchor="middle" className={styles.svgCode} fill="#0a0b10">{l.f.id}</text>
                <text x="44" y="-2" className={styles.svgName}>{l.f.name}</text>
                <text x="44" y="13" className={styles.svgSub}>{l.f.summary}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* —— right: crossfading chapters —— */}
        <div className={styles.right}>
          {CHAPTERS.map((c, i) => (
            <div key={c.t} ref={(el) => { chapters.current[i] = el; }} className={styles.chapter}>
              <p className={styles.kicker}>{c.k}</p>
              <h2 className={styles.ctitle}>{c.t}</h2>
              {c.d && <p className={styles.ctext}>{c.d}</p>}

              {/* Chapter III gets the metrics + programme bars */}
              {i === 2 && (
                <div className={styles.data}>
                  <div className={styles.metrics}>
                    {METRICS.map((m, j) => (
                      <div key={m.label} className={styles.metric}>
                        <span className={styles.num}>
                          {m.note && <em>{m.note} </em>}
                          <span ref={(el) => { nums.current[j] = el; }}>0</span>
                        </span>
                        <span className={styles.lbl}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.prog}>
                    <p className={styles.progHead}>Programme by floors</p>
                    {PROGRAMME.map((p, j) => (
                      <div key={p.label} className={styles.row}>
                        <span className={styles.rowLbl}>{p.label}</span>
                        <span className={styles.track}>
                          <span ref={(el) => { bars.current[j] = el; }} className={styles.fill}
                                style={{ width: `${(p.count / TOTAL_FLOORS) * 100}%`, background: ZONE_COLORS[p.zone] }} />
                        </span>
                        <span className={styles.rowN}>{p.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chapter IV gets the taglines */}
              {i === 3 && (
                <div className={styles.taglines}>
                  {TAGLINES.map((t, j) => (
                    <div key={t} ref={(el) => { tags.current[j] = el; }} className={styles.tagline}>{t}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
