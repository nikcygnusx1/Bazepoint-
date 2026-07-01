import { useEffect, useRef } from 'react';
import { cursorPos } from './CustomCursor';

interface HeroCanvasProps {
  isFocused: boolean;
  isSearching: boolean;
  className?: string;
}

const SUPPORTS_OFFSCREEN =
  typeof HTMLCanvasElement !== 'undefined' &&
  'transferControlToOffscreen' in HTMLCanvasElement.prototype;

export default function HeroCanvas({ isFocused, isSearching, className }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const transferredRef = useRef(false);
  const cursorRafRef = useRef<number>(0);
  const visibleRef = useRef(true);

  // ── Initialize worker and transfer canvas control ───────────────────────
  useEffect(() => {
    // If OffscreenCanvas is not supported, this graceful fallback will simply
    // render an empty canvas since the worker is not initialized.
    if (!canvasRef.current || transferredRef.current || !SUPPORTS_OFFSCREEN) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;

    const isTouchPrimary = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const dprCap = isTouchPrimary ? 1.5 : 2.0;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const W = parent.clientWidth;
    const H = parent.clientHeight;

    // Set canvas CSS size
    canvas.style.width  = `${W}px`;
    canvas.style.height = `${H}px`;

    // Transfer control to worker
    const offscreen = canvas.transferControlToOffscreen();
    transferredRef.current = true;

    const worker = new Worker(
      new URL('../workers/heroCanvas.worker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.postMessage(
      { type: 'init', canvas: offscreen, dpr, width: W, height: H, isTouchPrimary },
      [offscreen]
    );

    // ── ResizeObserver — relay dimensions to worker ──────────────────────
    const ro = new ResizeObserver(() => {
      if (!parent || !workerRef.current) return;
      const newDpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const newW = parent.clientWidth;
      const newH = parent.clientHeight;
      canvas.style.width  = `${newW}px`;
      canvas.style.height = `${newH}px`;
      workerRef.current.postMessage({ type: 'resize', width: newW, height: newH, dpr: newDpr });
    });
    ro.observe(parent);

    // ── IntersectionObserver — pause/resume worker rAF ───────────────────
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        workerRef.current?.postMessage({
          type: 'visibility',
          visible: entry.isIntersecting,
        });
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    // ── rAF-gated cursor relay ───────────────────────────────────────────
    const relayLoop = () => {
      if (visibleRef.current) {
        workerRef.current?.postMessage({
          type: 'cursor',
          x: cursorPos.x,
          y: cursorPos.y,
        });
      }
      cursorRafRef.current = requestAnimationFrame(relayLoop);
    };
    cursorRafRef.current = requestAnimationFrame(relayLoop);

    return () => {
      cancelAnimationFrame(cursorRafRef.current);
      ro.disconnect();
      io.disconnect();
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // ── Relay isFocused / isSearching state changes ─────────────────────────
  useEffect(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ type: 'state', isFocused, isSearching });
  }, [isFocused, isSearching]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    />
  );
}
