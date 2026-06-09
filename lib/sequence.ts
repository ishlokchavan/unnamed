// ============================================================
//  THE SEQUENCE — edit captions here, swap images in /public/frames.
//  Add or remove entries freely; the component adapts to the count.
// ============================================================
export type Frame = {
  src: string;
  title: string;
  sub: string;
};

export const SEQUENCE: Frame[] = [
  { src: "/frames/frame-1.jpg", title: "The Spire",    sub: "I · rain over the black tower" },
  { src: "/frames/frame-2.jpg", title: "The Vigil",    sub: "II · candlelight in the old nave" },
  { src: "/frames/frame-3.jpg", title: "The Crossing", sub: "III · into the long light" },
  { src: "/frames/frame-4.jpg", title: "The Bazaar",   sub: "IV · the lower market, after dark" },
  { src: "/frames/frame-5.jpg", title: "The Edge",     sub: "V · above the city, first night" },
];
