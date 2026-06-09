import type { IconName } from "@/lib/building";

/** Minimal line glyphs (24×24) for the floor-plan feature chips. */
const PATHS: Record<IconName, React.ReactNode> = {
  fork: <path d="M7 3v7a2 2 0 002 2v9M7 3v4M9 3v4M16 3c-1.4 0-2 2-2 4.5s.6 4 2 4.5v9" />,
  cup: (
    <>
      <path d="M5 8h11v5a4 4 0 01-4 4H9a4 4 0 01-4-4z" />
      <path d="M16 9h2a2 2 0 010 4h-2" />
      <path d="M7 3v2M10 3v2M13 3v2" />
    </>
  ),
  box: (
    <>
      <path d="M4 8l8-4 8 4-8 4z" />
      <path d="M4 8v8l8 4 8-4V8" />
      <path d="M12 12v8" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="12" cy="13.5" r="3.3" />
      <path d="M8 7l1.5-3h5L16 7" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l-1 12H7z" />
      <path d="M9 8a3 3 0 016 0" />
    </>
  ),
  gem: (
    <>
      <path d="M6 4h12l3 5-9 11L3 9z" />
      <path d="M3 9h18M9 4l3 16M15 4l-3 16" />
    </>
  ),
  hanger: <path d="M12 6a2 2 0 112.6 1.9L12 9 4.4 14.8A1 1 0 005 16.6h14a1 1 0 00.6-1.8L12 9" />,
  ring: (
    <>
      <circle cx="12" cy="14" r="6" />
      <circle cx="12" cy="5.5" r="2" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  people: (
    <>
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M2.5 19a5.5 5.5 0 0111 0M12.5 19a5.5 5.5 0 0111 0" />
    </>
  ),
  table: (
    <>
      <rect x="4" y="10" width="16" height="4" rx="2" />
      <circle cx="7" cy="6.5" r="1.5" />
      <circle cx="12" cy="6.5" r="1.5" />
      <circle cx="17" cy="6.5" r="1.5" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="12" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8 8l12 10M8 16L20 6" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l10-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="15" r="2.5" />
    </>
  ),
  cocktail: (
    <>
      <path d="M5 5h14l-7 8z" />
      <path d="M12 13v6M8 20h8" />
    </>
  ),
  masks: (
    <>
      <path d="M3 5h8v4a4 4 0 01-8 0z" />
      <path d="M13 8h8v4a4 4 0 01-8 0z" />
      <path d="M5.5 6.5h1M8 6.5h1M15.5 9.5h1M18 9.5h1" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M5 5l1.8 1.8M17.2 17.2L19 19M19 5l-1.8 1.8M5 19l1.8-1.8" />
    </>
  ),
  bridge: (
    <>
      <path d="M3 16c4 0 4-5 9-5s5 5 9 5" />
      <path d="M3 16v3M21 16v3M12 11v8" />
    </>
  ),
  star: <path d="M12 3l2.6 5.5 6 .9-4.3 4.2 1 6L12 18.8 6.7 21.6l1-6L3.4 9.4l6-.9z" />,
};

export default function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
         aria-hidden focusable="false">
      {PATHS[name]}
    </svg>
  );
}
