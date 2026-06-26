// src/components/ScrollProgress.tsx

import { useScroll, useSpring, motion } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // Spring smoothing for the fill — snappy but not choppy
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Track */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[1px] bg-[var(--color-bz-border)]"
        aria-hidden="true"
      />
      {/* Filled bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-[var(--color-bz-teal)] origin-left will-change-transform"
        style={{ scaleX }}
        aria-hidden="true"
      />
    </>
  );
}
