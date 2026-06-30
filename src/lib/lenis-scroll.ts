// src/lib/lenis-scroll.ts
// Lenis smooth scroll singleton — initialize once in App.tsx

import Lenis from "@studio-freight/lenis";

let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (typeof window === "undefined") return null;

  // Detect touch/mobile devices to prevent smooth scroll blocking/blank screens
  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia("(any-pointer: coarse)").matches);

  if (isTouchDevice) {
    return null;
  }

  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.15,          // scroll animation duration in seconds
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 0,      // Disable smooth touch to let native mobile scrolling take over
    infinite: false,
  });

  // Sync Lenis with Framer Motion's RAF loop
  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis(): void {
  lenisInstance?.destroy();
  lenisInstance = null;
}
