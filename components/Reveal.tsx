"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ZONE_COLORS } from "@/lib/building";
import {
  L, R, W, ROOF_CREST, ROOF_UNDER, FH, GRADE, BH, BOTTOM,
  SLAB_AMP, ABOVE, dirOf, waveLine, TOWER, ROOF, MULLIONS, SLAB_YS, LAYOUT,
} from "@/lib/elevation";
import styles from "./Reveal.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CHAPTERS = [
  { k: "Chapter I", t: "Assembly", d: "Two basements, a ground plane, five floors and the open sky — drawn the way an architect would lay it down, line by line." },
  { k: "Chapter II", t: "Ignition", d: "Then the volume wakes. Every level glows with its own programme, a different world stacked on the last." },
];

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
  const progress = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const slabEls = slabs.current.filter(Boolean) as SVGPathElement[];
      const glowEls = glows.current.filter(Boolean) as SVGRectElement[];
      const labelEls = labels.current.filter(Boolean) as SVGGElement[];
      const chapEls = chapters.current.filter(Boolean) as HTMLDivElement[];
      const dotEls = dots.current.filter(Boolean) as HTMLSpanElement[];

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const prep = (el: SVGPathElement | null) => {
        if (!el) return;
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      };
      [roof.current, towerStroke.current, gradeLine.current].forEach(prep);
      slabEls.forEach(prep);

      gsap.set([glassFill.current, base.current, mull.current], { autoAlpha: 0 });
      gsap.set(glowEls, { autoAlpha: 0, y: 22 });
      gsap.set(labelEls, { autoAlpha: 0, x: -16 });
      if (chapEls[0]) chapEls.forEach((c, i) => (c.style.opacity = i === 0 ? "1" : "0"));
      if (dotEls[0]) dotEls.forEach((d, i) => d.classList.toggle(styles.dotOn, i === 0));

      const setFinal = () => {
        gsap.set([roof.current, towerStroke.current, gradeLine.current, ...slabEls], { strokeDashoffset: 0 });
        gsap.set([glassFill.current, base.current, mull.current], { autoAlpha: 1 });
        gsap.set(glowEls, { autoAlpha: 0.5, y: 0 });
        gsap.set(labelEls, { autoAlpha: 1, x: 0 });
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
          end: () => "+=" + window.innerHeight * 4,
          pin: pin.current!,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (progress.current) progress.current.style.width = p * 100 + "%";
            const idx = p < 0.5 ? 0 : 1;
            chapEls.forEach((c, i) => (c.style.opacity = i === idx ? "1" : "0"));
            dotEls.forEach((d, i) => d.classList.toggle(styles.dotOn, i === idx));
          },
        },
      });

      // —— Chapter I · Assembly (draw it in) ——
      tl.to(roof.current, { strokeDashoffset: 0, duration: 0.1 }, 0);
      tl.to(towerStroke.current, { strokeDashoffset: 0, duration: 0.16 }, 0.03);
      tl.to(base.current, { autoAlpha: 1, duration: 0.12 }, 0.06);
      tl.to(glassFill.current, { autoAlpha: 1, duration: 0.14 }, 0.12);
      tl.to(gradeLine.current, { strokeDashoffset: 0, duration: 0.12 }, 0.14);
      tl.to(slabEls, { strokeDashoffset: 0, duration: 0.26, stagger: 0.035 }, 0.12);
      tl.to(mull.current, { autoAlpha: 1, duration: 0.14, ease: "power1.out" }, 0.22);

      // —— Chapter II · Ignition (floors come alive) ——
      tl.to(glowEls, { autoAlpha: 0.5, y: 0, duration: 0.22, stagger: 0.04, ease: "power2.out" }, 0.52);
      tl.to(labelEls, { autoAlpha: 1, x: 0, duration: 0.2, stagger: 0.045, ease: "power2.out" }, 0.55);

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.scene} aria-label="The building comes alive">
      <div ref={pin} className={styles.pin}>
        <div className={styles.top} aria-hidden><div ref={progress} className={styles.bar} /></div>
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
                <stop offset="0" stopColor="#171922" /><stop offset="1" stopColor="#0a0b10" />
              </linearGradient>
              <linearGradient id="rGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(232,162,74,0.6)" /><stop offset="1" stopColor="rgba(232,162,74,0)" />
              </linearGradient>
              <linearGradient id="rBronze" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#caa06a" /><stop offset="0.5" stopColor="#a9763c" /><stop offset="1" stopColor="#6d4a23" />
              </linearGradient>
              <pattern id="rHatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(243,239,231,0.12)" strokeWidth="1" />
              </pattern>
              <clipPath id="rTowerClip"><path d={TOWER} /></clipPath>
            </defs>

            <g ref={base}>
              <rect x={L} y={GRADE} width={W} height={BOTTOM - GRADE} fill="#0a0b10" />
              <rect x={L} y={GRADE} width={W} height={BOTTOM - GRADE} fill="url(#rHatch)" />
            </g>

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

            <path ref={towerStroke} d={TOWER} fill="none" stroke="rgba(243,239,231,0.4)" strokeWidth="1.5" />
            <path ref={roof} d={ROOF} fill="url(#rBronze)" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
            {SLAB_YS.map((y, i) => (
              <path key={y} ref={(el) => { slabs.current[i] = el; }}
                    d={waveLine(y, SLAB_AMP, dirOf(i + 1))} fill="none" stroke="url(#rBronze)" strokeWidth="6" strokeLinecap="round" />
            ))}
            <path ref={gradeLine} d={waveLine(GRADE, SLAB_AMP, dirOf(7))} fill="none" stroke="rgba(243,239,231,0.5)" strokeWidth="2" />

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
              <p className={styles.ctext}>{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
