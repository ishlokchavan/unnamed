"use client";

import { useEffect, useRef, useState } from "react";
import { TAGLINES } from "@/lib/building";
import styles from "./ShowReel.module.css";

/**
 * Full-bleed show-reel finale. The video fills the viewport (cover, so
 * it zooms to fit any screen including mobile portrait), with a scrim
 * and the closing taglines over it. Autoplays muted/looping, pauses
 * when off-screen, and offers play + sound toggles.
 */
export default function ShowReel() {
  const video = useRef<HTMLVideoElement>(null);
  const section = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  // pause when scrolled out of view, resume when back
  useEffect(() => {
    const v = video.current;
    const s = section.current;
    if (!v || !s) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && playing) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(s);
    return () => io.disconnect();
  }, [playing]);

  const togglePlay = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };
  const toggleMute = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section ref={section} className={styles.scene} aria-label="Show reel">
      <video
        ref={video}
        className={styles.video}
        src="/video/showreel.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className={styles.scrim} aria-hidden />

      <div className={styles.overlay}>
        <p className={styles.eyebrow}><span className={styles.dot} /> Show Reel</p>
        <div className={styles.taglines}>
          {TAGLINES.map((t, i) => (
            <div key={t} className={styles.tagline} style={{ animationDelay: `${0.1 + i * 0.12}s` }}>{t}</div>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <button className={styles.btn} onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
          {playing ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M7 5l12 7-12 7z" fill="currentColor" /></svg>
          )}
        </button>
        <button className={styles.btn} onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M17 9l5 6M22 9l-5 6" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16 8.5a4 4 0 010 7M19 6a8 8 0 010 12" /></svg>
          )}
        </button>
      </div>
    </section>
  );
}
