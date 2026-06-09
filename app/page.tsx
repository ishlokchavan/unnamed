import ScrollDive from "@/components/ScrollDive";
import Building from "@/components/Building";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main>
      {/* —— open straight into the pinned sequence, no intro fold —— */}
      <ScrollDive />

      {/* —— the 2D design board: floor-by-floor breakdown —— */}
      <Building />

      {/* —— the building comes alive: scroll-scrubbed reveal —— */}
      <Reveal />
    </main>
  );
}
