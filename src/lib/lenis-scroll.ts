// src/lib/lenis-scroll.ts
// Lenis smooth scroll singleton — initialize once in App.tsx

import Lenis from "@studio-freight/lenis";

let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.15,          // scroll animation duration in seconds
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
    infinite: false,
  });

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis(): void {
  lenisInstance?.destroy();
  lenisInstance = null;
}
