import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const cursorPos = { x: 0, y: 0 };

type CursorState = 'default' | 'hover' | 'cta' | 'drag';

export function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const orbSpringX = useSpring(mouseX, { stiffness: 800, damping: 35 });
  const orbSpringY = useSpring(mouseY, { stiffness: 800, damping: 35 });

  const auraSpringX = useSpring(mouseX, { stiffness: 120, damping: 28 });
  const auraSpringY = useSpring(mouseY, { stiffness: 120, damping: 28 });

  const orbX = useTransform(orbSpringX, (v) => v - 6);
  const orbY = useTransform(orbSpringY, (v) => v - 6);

  const auraX = useTransform(auraSpringX, (v) => v - 20);
  const auraY = useTransform(auraSpringY, (v) => v - 20);

  useEffect(() => {
    const touchCheck = window.matchMedia('(hover: none)').matches;
    const motionCheck = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsTouchDevice(touchCheck);
    setPrefersReducedMotion(motionCheck);

    if (touchCheck || motionCheck) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      cursorPos.x = e.clientX;
      cursorPos.y = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const ctaEl = target.closest('[data-cursor="cta"]');
      if (ctaEl) {
        setCursorState('cta');
        return;
      }

      const dragEl = target.closest('[data-cursor="drag"]');
      if (dragEl) {
        setCursorState('drag');
        return;
      }

      const hoverEl = target.closest('a, button, [data-cursor="hover"]');
      if (hoverEl) {
        setCursorState('hover');
        return;
      }

      setCursorState('default');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice || prefersReducedMotion) {
    return null;
  }

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Layer 2 & 3: Aura & Label (Lags behind) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen select-none"
        style={{
          width: 40,
          height: 40,
          x: auraX,
          y: auraY,
        }}
        animate={{
          scale: cursorState === 'hover' ? 1.4 : cursorState === 'cta' ? 2.2 : cursorState === 'drag' ? 1.8 : 1,
          opacity: cursorState === 'hover' ? 1 : 0.8,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div
          className={`w-full h-full rounded-full flex items-center justify-center relative transition-all duration-300 ${
            cursorState === 'drag' ? 'cursor-aura-spin' : ''
          }`}
          style={{
            background: cursorState === 'cta'
              ? 'radial-gradient(circle, rgba(184,226,242,0.15) 0%, rgba(74,158,191,0.08) 60%, transparent 100%)'
              : 'radial-gradient(circle, rgba(184,226,242,0.08) 0%, rgba(184,226,242,0.04) 50%, transparent 100%)',
            border: cursorState === 'cta'
              ? '1.5px solid rgba(184,226,242,0.5)'
              : cursorState === 'drag'
              ? '1px dashed rgba(184,226,242,0.4)'
              : cursorState === 'hover'
              ? '1px solid rgba(184,226,242,0.4)'
              : '1px solid rgba(184,226,242,0.15)',
          }}
        >
          {/* Label Layer */}
          <span
            className="font-mono text-[9px] uppercase tracking-[0.08em] absolute transition-opacity duration-200"
            style={{
              color: 'var(--color-bz-teal-dark)',
              opacity: cursorState === 'cta' || cursorState === 'drag' ? 1 : 0,
            }}
          >
            {cursorState === 'cta' ? 'EXPLORE' : cursorState === 'drag' ? 'DRAG' : ''}
          </span>
        </div>
      </motion.div>

      {/* Layer 1: Orb (Tight, fast-following dot) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] select-none"
        style={{
          width: 12,
          height: 12,
          x: orbX,
          y: orbY,
        }}
        animate={{
          scale: cursorState === 'hover' ? 0.5 : cursorState === 'cta' ? 0 : cursorState === 'drag' ? 1.2 : 1,
          opacity: cursorState === 'hover' ? 0.6 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <div
          className={`w-full h-full rounded-full transition-colors duration-300 ${
            cursorState === 'cta' ? 'cursor-orb-cta' : ''
          }`}
          style={{
            background: cursorState === 'drag'
              ? 'rgba(74,158,191,0.8)'
              : 'radial-gradient(circle, rgba(184,226,242,0.9) 0%, rgba(184,226,242,0.4) 60%, transparent 100%)',
            border: cursorState === 'drag'
              ? 'none'
              : '1px solid rgba(184,226,242,0.6)',
          }}
        />
      </motion.div>
    </>
  );
}
