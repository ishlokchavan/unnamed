import Hero from "@/components/Hero";
import Experience from "@/components/Experience";

export default function Home() {
  return (
    <main>
      {/* —— 1 · full-bleed hero background video —— */}
      <Hero />

      {/* —— 2 · conceptual walkthrough: the building assembles,
             ignites, and opens floor by floor —— */}
      <Experience />
    </main>
  );
}
