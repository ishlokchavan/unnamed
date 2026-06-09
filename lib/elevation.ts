// ============================================================
//  ELEVATION GEOMETRY — shared drafting space for the waving
//  volume. Used by the static design board (<Building />) and the
//  animated reveal (<Reveal />) so both read as the same building.
// ============================================================
import { FLOORS, type Floor } from "./building";

export const L = 250;            // tower left edge
export const R = 770;            // tower right edge
export const W = R - L;          // tower width
export const MID = (L + R) / 2;

export const ROOF_CREST = 152;   // top of the waving roof
export const ROOF_UNDER = 198;   // underside of roof / top of glazing
export const FH = 142;           // above-grade floor height
export const GRADE = ROOF_UNDER + 7 * FH; // plaza / ground line
export const PLAZA = GRADE + 22;
export const BH = 108;           // basement floor height
export const BOTTOM = PLAZA + 2 * BH;

export const SLAB_AMP = 22;      // wave amplitude of each floor slab
export const ROOF_AMP = 46;      // bigger wave for the roof crest

export const ABOVE = FLOORS.slice(0, 7); // R … G
export const BELOW = FLOORS.slice(7);    // B1, B2

export const n = (v: number) => Math.round(v * 10) / 10;
export const dirOf = (i: number) => (i % 2 ? -1 : 1);

// smooth S-wave across the tower at height y
export const seg = (y: number, amp: number, d: number) =>
  `C ${n(L + W * 0.28)} ${n(y - amp * d)} ${n(MID - W * 0.12)} ${n(y - amp * d)} ${n(MID)} ${n(y)} ` +
  `C ${n(MID + W * 0.12)} ${n(y + amp * d)} ${n(R - W * 0.28)} ${n(y + amp * d)} ${n(R)} ${n(y)}`;
export const segRev = (y: number, amp: number, d: number) =>
  `C ${n(R - W * 0.28)} ${n(y + amp * d)} ${n(MID + W * 0.12)} ${n(y + amp * d)} ${n(MID)} ${n(y)} ` +
  `C ${n(MID - W * 0.12)} ${n(y - amp * d)} ${n(L + W * 0.28)} ${n(y - amp * d)} ${n(L)} ${n(y)}`;
export const waveLine = (y: number, amp: number, d: number) => `M ${L} ${n(y)} ${seg(y, amp, d)}`;

export const TOWER = `M ${L} ${ROOF_UNDER} ${seg(ROOF_UNDER, SLAB_AMP, dirOf(0))} L ${R} ${GRADE} ${segRev(GRADE, SLAB_AMP, dirOf(7))} Z`;
export const ROOF = `M ${L} ${ROOF_CREST} ${seg(ROOF_CREST, ROOF_AMP, 1)} L ${R} ${ROOF_UNDER} ${segRev(ROOF_UNDER, SLAB_AMP, dirOf(0))} Z`;
export const MULLIONS = Array.from({ length: Math.floor(W / 22) - 1 }, (_, i) => L + 18 + i * 22);

// slab boundary heights (7 above-grade slab edges, bottom one = grade)
export const SLAB_YS = Array.from({ length: 7 }, (_, k) => ROOF_UNDER + (k + 1) * FH);

export type Lay = { f: Floor; yTop: number; h: number; yMid: number; above: boolean; bi: number };
export const LAYOUT: Lay[] = [
  ...ABOVE.map((f, k) => ({ f, yTop: ROOF_UNDER + k * FH, h: FH, yMid: ROOF_UNDER + k * FH + FH / 2, above: true, bi: k })),
  ...BELOW.map((f, j) => ({ f, yTop: PLAZA + j * BH, h: BH, yMid: PLAZA + j * BH + BH / 2, above: false, bi: 7 + j })),
];
