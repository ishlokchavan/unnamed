import ScrollDive from "@/components/ScrollDive";
import Experience from "@/components/Experience";

export default function Home() {
  return (
    <main>
      {/* —— open straight into the pinned cinematic sequence —— */}
      <ScrollDive />

      {/* —— one unified walkthrough: the building assembles, ignites,
             opens floor by floor, and lands the statement —— */}
      <Experience />
    </main>
  );
}
