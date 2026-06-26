import { useEffect } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { initLenis, destroyLenis } from "./lib/lenis-scroll";
import ScrollProgress from "./components/ScrollProgress";
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PromptDemo } from './components/PromptDemo';
import { Mechanism } from './components/Mechanism';
import { Trust } from './components/Trust';
import { Supply } from './components/Supply';
import { Enemy } from './components/Enemy';
import { FinalPush } from './components/FinalPush';
import { Footer } from './components/Footer';

export default function App() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const lenis = initLenis();
    return () => {
      destroyLenis();
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <div
        className="min-h-screen bg-[var(--color-bz-bg)] text-[var(--color-bz-text)] font-sans selection:bg-bz-teal-light selection:text-bz-teal overflow-x-hidden"
        key="main"
      >
        <ScrollProgress />
        <Header />
        <main>
          <Hero />
          <PromptDemo />
          <Enemy />
          <Mechanism />
          <Supply />
          <Trust />
          <FinalPush />
        </main>
        <Footer />
      </div>
    </AnimatePresence>
  );
}
