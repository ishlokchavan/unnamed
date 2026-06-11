import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import ShowReel from "@/components/ShowReel";

export default function Home() {
  return (
    <main>
      {/* —— open on the full-bleed hero background video —— */}
      <Hero />

      {/* —— frame sequence hidden for now; restore by re-adding:
             import ScrollDive from "@/components/ScrollDive";
             <ScrollDive /> —— */}

      {/* —— one unified walkthrough: the building assembles, ignites,
             and opens floor by floor —— */}
      <Experience />

      {/* —— full-bleed show-reel finale —— */}
      <ShowReel />
    </main>
  );
}
