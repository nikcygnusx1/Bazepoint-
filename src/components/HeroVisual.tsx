import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BazeConsole } from './BazeConsole';
import { revealVariant } from '../lib/motion-variants';

export function HeroVisual() {
  const [beat, setBeat] = useState<1 | 2 | 3 | 4>(1);
  const [customFactoryName, setCustomFactoryName] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const startLoop = (startBeat: 1 | 2 | 3 | 4 = 1) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setBeat(3);
      return;
    }

    setBeat(startBeat);

    const runChain = (currentBeat: 1 | 2 | 3 | 4) => {
      let nextBeat: 1 | 2 | 3 | 4 = 1;
      let delay = 2500;

      if (currentBeat === 1) {
        nextBeat = 2;
        delay = 2500; // Beat 1 holds 2500ms
      } else if (currentBeat === 2) {
        nextBeat = 3;
        delay = 2500; // Beat 2 holds 2500ms
      } else if (currentBeat === 3) {
        nextBeat = 4;
        delay = 3000; // Beat 3 holds 3000ms
      } else if (currentBeat === 4) {
        nextBeat = 1;
        delay = 6500; // Beat 4 holds 5000ms, then pause 1500ms before restart
      }

      timeoutRef.current = window.setTimeout(() => {
        setBeat(nextBeat);
        runChain(nextBeat);
      }, delay);
    };

    runChain(startBeat);
  };

  useEffect(() => {
    startLoop(1);
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Event Bridge
  useEffect(() => {
    const handleSearching = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      setBeat(2);
      setCustomFactoryName(null);
    };

    const handleResults = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      setBeat(3);
    };

    const handleDraftOpen = (e: Event) => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      const detail = (e as CustomEvent<{ factoryName: string }>).detail;
      setCustomFactoryName(detail?.factoryName || null);
      setBeat(4);
    };

    const handleReset = () => {
      setCustomFactoryName(null);
      startLoop(1);
    };

    window.addEventListener('demo-searching', handleSearching);
    window.addEventListener('demo-results', handleResults);
    window.addEventListener('demo-draft-open', handleDraftOpen);
    window.addEventListener('demo-reset', handleReset);

    return () => {
      window.removeEventListener('demo-searching', handleSearching);
      window.removeEventListener('demo-results', handleResults);
      window.removeEventListener('demo-draft-open', handleDraftOpen);
      window.removeEventListener('demo-reset', handleReset);
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[440px] flex items-center justify-center p-2 relative">
      {/* Background decoration: subtle grid or glow */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(0,200,176,0.08)_0%,transparent_75%] pointer-events-none z-0"></div>

      <div className="w-full max-w-[850px] relative z-10 min-h-[490px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={beat}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
            variants={revealVariant}
            className="w-full"
          >
            <BazeConsole 
              mode="hero" 
              beat={beat} 
              customFactoryName={customFactoryName} 
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
