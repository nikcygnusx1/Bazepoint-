import { useEffect } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { initLenis, destroyLenis } from "./lib/lenis-scroll";
import ScrollProgress from "./components/ScrollProgress";
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PromptDemo } from './components/PromptDemo';
import { Mechanism } from './components/Mechanism';
import { Supply } from './components/Supply';
import { Enemy } from './components/Enemy';
import { FinalPush } from './components/FinalPush';
import { Footer } from './components/Footer';
import { initScrollTrigger } from './lib/use-gsap-scroll';
import { CustomCursor } from './components/CustomCursor';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Initialize Lenis smooth scroll
    let lenisInstance: any = undefined;
    const isTouchPrimary = window.matchMedia(
      '(hover: none) and (pointer: coarse)'
    ).matches;
    if (!isTouchPrimary) {
      lenisInstance = initLenis();
    }

    // Register ScrollTrigger and central GSAP configurations
    gsap.registerPlugin(ScrollTrigger);
    initScrollTrigger();

    // Global error listener to intercept and gracefully handle/silence third-party MetaMask or web3 errors
    const handleError = (event: ErrorEvent) => {
      const msg = event.message || '';
      if (
        msg.toLowerCase().includes('metamask') || 
        msg.toLowerCase().includes('ethereum') || 
        msg.toLowerCase().includes('web3') || 
        msg.toLowerCase().includes('wallet')
      ) {
        console.warn('Caught and handled MetaMask error gracefully:', msg);
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const msg = (reason && (reason.message || reason.toString())) || '';
      if (
        msg.toLowerCase().includes('metamask') || 
        msg.toLowerCase().includes('ethereum') || 
        msg.toLowerCase().includes('web3') || 
        msg.toLowerCase().includes('wallet')
      ) {
        console.warn('Caught and handled MetaMask unhandled rejection gracefully:', msg);
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Bridge Lenis scroll events to GSAP ScrollTrigger ticker loop
    if (lenisInstance) {
      // Manual ScrollTrigger update on Lenis scroll event
      lenisInstance.on('scroll', () => {
        ScrollTrigger.update();
      });

      // Centralized animation frame updates via GSAP ticker
      const tickUpdate = (time: number) => {
        lenisInstance.raf(time * 1000);
      };
      gsap.ticker.add(tickUpdate);
      gsap.ticker.lagSmoothing(0);

      // Save references for potential cleanup
      (window as any)._gsapTickUpdate = tickUpdate;
    }

    return () => {
      // Clean up tick listener
      const tickUpdate = (window as any)._gsapTickUpdate;
      if (tickUpdate) {
        gsap.ticker.remove(tickUpdate);
      }
      
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      
      destroyLenis();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <div
        className="min-h-screen bg-[var(--color-bz-bg)] text-[var(--color-bz-text)] font-sans selection:bg-bz-teal-light selection:text-bz-teal overflow-x-hidden"
        key="main"
      >
        <CustomCursor />
        <ScrollProgress />
        <Header />
        <main>
          <Hero />
          <Enemy />
          <PromptDemo />
          <Mechanism />
          <Supply />
          <FinalPush />
        </main>
        <Footer />
      </div>
    </AnimatePresence>
  );
}
