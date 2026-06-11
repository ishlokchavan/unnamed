"use client";

import { useEffect, useRef } from "react";
import { BUILDING_META } from "@/lib/building";
import styles from "./Hero.module.css";

/**
 * Opening hero — full-bleed background video with the project identity
 * over a scrim. Autoplays muted/looping, pauses when scrolled away.
 */
export default function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const section = useRef<HTMLElement>(null);

  // pause when scrolled out of view, resume when back
  useEffect(() => {
    const v = video.current;
    const s = section.current;
    if (!v || !s) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(s);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={section} className={styles.scene} aria-label="Hero">
      <video
        ref={video}
        className={styles.video}
        src="/video/showreel1.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className={styles.scrim} aria-hidden />
      <div className={styles.grain} aria-hidden />

      <div className={styles.overlay}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} /> Project 2305 · {BUILDING_META.location}
        </p>
        <h1 className={styles.title}>The Waving Canvas</h1>
        <p className={styles.sub}>{BUILDING_META.feel}</p>
      </div>

      <div className={styles.hint} aria-hidden>
        Scroll
        <span className={styles.arrow} />
      </div>
    </section>
  );
}
