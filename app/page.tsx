import ScrollDive from "@/components/ScrollDive";
import Building from "@/components/Building";

export default function Home() {
  return (
    <main>
      {/* —— open straight into the pinned sequence, no intro fold —— */}
      <ScrollDive />

      {/* —— the 2D floor-by-floor breakdown of the building —— */}
      <Building />
    </main>
  );
}
