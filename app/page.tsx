import ScrollDive from "@/components/ScrollDive";
import Experience from "@/components/Experience";
import ShowReel from "@/components/ShowReel";

export default function Home() {
  return (
    <main>
      {/* —— open straight into the pinned cinematic sequence —— */}
      <ScrollDive />

      {/* —— one unified walkthrough: the building assembles, ignites,
             and opens floor by floor —— */}
      <Experience />

      {/* —— full-bleed show-reel finale —— */}
      <ShowReel />
    </main>
  );
}
