export type DeviceTier = 'high' | 'mid' | 'low';

export interface TierConfig {
  pointCount: number;        // Fibonacci globe points
  arcSegments: number;       // TubeGeometry tubularSegments
  arcRadialSegments: number; // TubeGeometry radialSegments
  dprCap: number;            // Maximum devicePixelRatio to use
  showLabels: boolean;       // Whether to render Sprite labels
  enableCursor: boolean;     // Whether to mount CustomCursor
}

export const TIER_CONFIGS: Record<DeviceTier, TierConfig> = {
  high: { pointCount: 3500, arcSegments: 20, arcRadialSegments: 3, dprCap: 2,   showLabels: true,  enableCursor: true  },
  mid:  { pointCount: 2000, arcSegments: 12, arcRadialSegments: 3, dprCap: 1.5, showLabels: true,  enableCursor: false },
  low:  { pointCount: 1200, arcSegments: 8,  arcRadialSegments: 3, dprCap: 1,   showLabels: false, enableCursor: false },
};

export function getDeviceTier(): DeviceTier {
  // Signal 1: primary input is touch (no fine pointer = mobile/tablet)
  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  // Signal 2: pixel density (high-end phones can have high DPR but low RAM)
  const dpr = window.devicePixelRatio ?? 1;
  // Signal 3: device RAM via navigator.deviceMemory (Chrome/Edge only, undefined elsewhere)
  const ram = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  // Classification logic:
  // Low tier:  touch device with low RAM or very low DPR
  if (isTouch && ram <= 2) return 'low';
  // Mid tier:  touch device (any RAM) or desktop with limited RAM
  if (isTouch || ram <= 4) return 'mid';
  // High tier: desktop with sufficient RAM
  return 'high';
}

/**
 * React hook wrapper. Evaluates once at mount — device tier never changes
 * during a session, so no state or effect needed.
 *
 * Usage:
 *   const tier = useDeviceTier();          // → 'high' | 'mid' | 'low'
 *   const config = TIER_CONFIGS[tier];     // → TierConfig
 *   // Pass config.pointCount to GlobeCore, config.arcSegments to GlobeNodes
 */
import { useRef } from 'react';

export function useDeviceTier(): DeviceTier {
  const tierRef = useRef<DeviceTier | null>(null);
  if (tierRef.current === null) {
    tierRef.current = getDeviceTier();
  }
  return tierRef.current;
}
