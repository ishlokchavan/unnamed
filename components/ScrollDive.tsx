"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SEQUENCE } from "@/lib/sequence";
import styles from "./ScrollDive.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ScrollDive() {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const n = SEQUENCE.length;

  // pointer-tilt throttle
  const tilt = useRef<{ x: number; y: number; raf: number | null }>({ x: 0, y: 0, raf: null });

  useGSAP(
    () => {
      const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
      slides.forEach((s) => (s.style.filter = "blur(var(--b,0px))"));

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // ---- reduced motion: quiet crossfade, no scroll-jacking ----
      if (reduce) {
        gsap.set(slides, { autoAlpha: 0 });
        gsap.set(slides[0], { autoAlpha: 1 });
        slides.forEach((s, i) =>
          ScrollTrigger.create({
            trigger: root.current!,
            start: () => `top+=${i * 20}% top`,
            onToggle: (self) => {
              if (self.isActive) {
                gsap.to(slides, { autoAlpha: 0, duration: 0.4 });
                gsap.to(s, { autoAlpha: 1, duration: 0.4 });
                setActive(i);
              }
            },
          })
        );
        return;
      }

      // ---- initial 3D state: frame 1 at the lens, the rest deep in Z ----
      gsap.set(slides, {
        autoAlpha: 0, scale: 0.5, z: -1100, rotateY: 8, "--b": "6px", transformOrigin: "50% 50%",
      });
      gsap.set(slides[0], { autoAlpha: 1, scale: 1, z: 0, rotateY: 0, "--b": "0px" });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 1 },
        scrollTrigger: {
          trigger: root.current!,
          start: "top top",
          end: () => "+=" + window.innerHeight * n,
          pin: pinRef.current!,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.width = self.progress * 100 + "%";
            if (self.progress > 0.01) setStarted(true);
            setActive(Math.round(self.progress * (n - 1)));
          },
        },
      });

      for (let i = 0; i < n - 1; i++) {
        const cur = slides[i];
        const nxt = slides[i + 1];
        tl.to(cur, { scale: 1.9, z: 820, rotateY: -6, autoAlpha: 0, "--b": "12px" }, i);
        tl.fromTo(
          nxt,
          { scale: 0.5, z: -1100, rotateY: 8, autoAlpha: 0, "--b": "6px" },
          { scale: 1, z: 0, rotateY: 0, autoAlpha: 1, "--b": "0px" },
          i
        );
      }

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root }
  );

  // ---- pointer-driven parallax tilt on the whole stack ----
  const handleMove = (e: React.PointerEvent) => {
    const el = pinRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    tilt.current.x = ((e.clientX - r.left) / r.width - 0.5) * 6;
    tilt.current.y = ((e.clientY - r.top) / r.height - 0.5) * -6;
    if (tilt.current.raf == null) {
      tilt.current.raf = requestAnimationFrame(() => {
        stackRef.current?.style.setProperty("--tx", tilt.current.x.toFixed(2) + "deg");
        stackRef.current?.style.setProperty("--ty", tilt.current.y.toFixed(2) + "deg");
        tilt.current.raf = null;
      });
    }
  };
  const handleLeave = () => {
    stackRef.current?.style.setProperty("--tx", "0deg");
    stackRef.current?.style.setProperty("--ty", "0deg");
  };

  const frame = SEQUENCE[active];

  return (
    <section ref={root} className={styles.scene} aria-label="Image sequence">
      <div
        ref={pinRef}
        className={styles.pin}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        <div ref={stackRef} className={styles.stack}>
          {SEQUENCE.map((im, i) => (
            <div
              key={im.src}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className={styles.slide}
            >
              <div className={styles.frame}>
                <Image
                  src={im.src}
                  alt={im.title}
                  fill
                  priority={i < 2}
                  sizes="100vw"
                  className={styles.img}
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>

        {/* atmosphere */}
        <div className={styles.grain} aria-hidden />
        <div className={styles.scrimTop} aria-hidden />
        <div className={styles.scrimBot} aria-hidden />
        <div className={styles.topbar} aria-hidden>
          <div ref={barRef} className={styles.topbarFill} />
        </div>

        {/* chrome — scoped to the pinned viewport */}
        <div className={styles.hud} aria-hidden>
          <div className={styles.eyebrow}>
            <span className={styles.dot} /> Five Frames
          </div>

          <div key={`num-${active}`} className={styles.bignum}>
            {String(active + 1).padStart(2, "0")}
          </div>

          <div key={`cap-${active}`} className={styles.caption}>
            <div className={styles.ttl}>{frame.title}</div>
            <div className={styles.sub}>{frame.sub}</div>
          </div>

          <div className={styles.rail}>
            {SEQUENCE.map((_, i) => (
              <div key={i} className={`${styles.tick} ${i === active ? styles.tickActive : ""}`}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.bar} />
              </div>
            ))}
          </div>

          <div className={styles.hint} style={{ opacity: started ? 0 : 1 }}>
            Scroll
            <span className={styles.arrow} />
          </div>
        </div>
      </div>
    </section>
  );
}
