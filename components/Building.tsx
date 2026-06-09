"use client";

import { useState } from "react";
import { FLOORS, BUILDING_META } from "@/lib/building";
import styles from "./Building.module.css";

/**
 * A 2D cross-section / elevation of the concept building.
 * Left: the stacked floors, drawn as a fluid dark-glass tower you can
 * click through (rooftop at top → B2 at the bottom, like a real
 * elevation drawing). Right: the detail panel for the selected floor.
 *
 * Doubles as in-page navigation: pick a floor, read what lives there.
 * Inspired in spirit by the Burj Khalifa floor-guide breakdown.
 */
export default function Building() {
  // default to Ground — the front door of the experience
  const [activeId, setActiveId] = useState("G");
  const active = FLOORS.find((f) => f.id === activeId) ?? FLOORS[0];

  return (
    <section className={styles.section} aria-label="Building floor breakdown" id="building">
      <header className={styles.head}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} /> The Structure
        </p>
        <h2 className={styles.title}>
          One building,<br />nine vertical worlds.
        </h2>
        <p className={styles.lead}>
          A {BUILDING_META.stack} stack in {BUILDING_META.location}. Climb the
          elevation — every band is a floor. Tap one to see what lives there.
        </p>
      </header>

      <div className={styles.layout}>
        {/* —— the elevation: clickable floor bands —— */}
        <div className={styles.tower} role="tablist" aria-label="Floors">
          {FLOORS.map((f) => {
            const isActive = f.id === activeId;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={isActive}
                className={`${styles.band} ${styles[f.zone]} ${isActive ? styles.active : ""}`}
                onClick={() => setActiveId(f.id)}
                onMouseEnter={() => setActiveId(f.id)}
              >
                <span className={styles.code}>{f.id}</span>
                <span className={styles.bandBody}>
                  <span className={styles.bandLevel}>{f.level}</span>
                  <span className={styles.bandName}>{f.name}</span>
                </span>
                <span className={styles.bandSummary}>{f.summary}</span>
              </button>
            );
          })}
          <div className={styles.ground} aria-hidden>
            <span>street level</span>
          </div>
        </div>

        {/* —— the detail panel —— */}
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
            {active.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </aside>
      </div>

      {/* —— footing facts —— */}
      <dl className={styles.facts}>
        <div>
          <dt>Footprint</dt>
          <dd>{BUILDING_META.area}</dd>
        </div>
        <div>
          <dt>Skin</dt>
          <dd>{BUILDING_META.look}</dd>
        </div>
        <div>
          <dt>Parking</dt>
          <dd>{BUILDING_META.parking}</dd>
        </div>
        <div>
          <dt>Feel</dt>
          <dd>{BUILDING_META.feel}</dd>
        </div>
      </dl>
    </section>
  );
}
