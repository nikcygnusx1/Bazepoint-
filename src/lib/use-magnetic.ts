import { useRef } from 'react';
import { useMotionValue, useSpring } from 'motion/react';

export function useMagnetic(strength: number = 0.35) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  // Check for touch device — disable magnetic on touch
  const isTouch = typeof window !== 'undefined'
    && window.matchMedia('(hover: none)').matches;

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (isTouch) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width  / 2)) * strength);
    y.set((e.clientY - (rect.top  + rect.height / 2)) * strength);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return { ref, springX, springY, onMouseMove, onMouseLeave };
}
