import ScrollDive from "@/components/ScrollDive";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      {/* —— a normal section above it, to prove the pin coexists with the rest of the site —— */}
      <section className={styles.intro}>
        <p className={styles.eyebrow}>A larger site</p>
        <h1 className={styles.h1}>
          Scroll down.<br />The next section takes over.
        </h1>
        <p className={styles.lead}>
          Everything below this fold is a single pinned sequence. The page never
          navigates away — it holds you in place while five frames pass through.
        </p>
      </section>

      {/* —— the sequence —— */}
      <ScrollDive />

      {/* —— a normal section below it, where the page resumes —— */}
      <section className={styles.outro}>
        <h2 className={styles.h2}>And the page continues.</h2>
        <p className={styles.lead}>
          Add the rest of your routes, content, and footer here as usual.
        </p>
      </section>
    </main>
  );
}
