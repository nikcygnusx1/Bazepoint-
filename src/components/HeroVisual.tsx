import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BazeConsole } from './BazeConsole';
import { revealVariant } from '../lib/motion-variants';

export function HeroVisual() {
  const [beat, setBeat] = useState<1 | 2 | 3 | 4>(1);
  const [customFactoryName, setCustomFactoryName] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  // Hover-pause overlay state
  const [isHovered, setIsHovered] = useState(false);
  const pausedBeatRef = useRef<1 | 2 | 3 | 4>(1);
  const resumeDelayRef = useRef<number | null>(null);

  const startLoop = (startBeat: 1 | 2 | 3 | 4 = 1) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setBeat(3); return; }
    setBeat(startBeat);
    const runChain = (currentBeat: 1 | 2 | 3 | 4) => {
      let nextBeat: 1 | 2 | 3 | 4 = 1;
      let delay = 2500;
      if (currentBeat === 1)      { nextBeat = 2; delay = 2500; }
      else if (currentBeat === 2) { nextBeat = 3; delay = 2500; }
      else if (currentBeat === 3) { nextBeat = 4; delay = 3000; }
      else if (currentBeat === 4) { nextBeat = 1; delay = 6500; }
      timeoutRef.current = window.setTimeout(() => {
        setBeat(nextBeat);
        runChain(nextBeat);
      }, delay);
    };
    runChain(startBeat);
  };

  useEffect(() => {
    startLoop(1);
    return () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); };
  }, []);

  // Event Bridge — LOCKED, do not modify event names
  useEffect(() => {
    const handleSearching = () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      setBeat(2); setCustomFactoryName(null);
    };
    const handleResults = () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      setBeat(3);
    };
    const handleDraftOpen = (e: Event) => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      const detail = (e as CustomEvent<{ factoryName: string }>).detail;
      setCustomFactoryName(detail?.factoryName || null);
      setBeat(4);
    };
    const handleReset = () => { setCustomFactoryName(null); startLoop(1); };
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

  // Hover-pause: pause loop on hover, resume after 2s on pointer-out
  const handleMouseEnter = () => {
    if (resumeDelayRef.current) window.clearTimeout(resumeDelayRef.current);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    pausedBeatRef.current = beat;
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    resumeDelayRef.current = window.setTimeout(() => {
      startLoop(pausedBeatRef.current);
    }, 2000);
  };
  const handleClick = () => {
    if (!isHovered) return;
    if (resumeDelayRef.current) window.clearTimeout(resumeDelayRef.current);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    const next = beat === 4 ? 1 : ((beat + 1) as 1 | 2 | 3 | 4);
    setBeat(next);
    pausedBeatRef.current = next;
  };

  return (
    <div
      className="w-full h-full min-h-[440px] flex items-center justify-center p-2 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="region"
      aria-label="Live product sourcing demo — click to advance"
    >
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(0,200,176,0.08)_0%,transparent_75%] pointer-events-none z-0"></div>

      {/* Hover indicator — pulsing dot, only visible on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-[var(--bz-console-bg)]/80 rounded-full px-3 py-1.5 border border-[var(--bz-console-border)] pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--bz-console-teal)] animate-pulse" />
            <span className="text-[10px] font-console text-[var(--bz-console-text-muted)] tracking-wide">
              Click to advance
            </span>
          </motion.div>
        )}
      </AnimatePresence>

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
            <BazeConsole mode="hero" beat={beat} customFactoryName={customFactoryName} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
