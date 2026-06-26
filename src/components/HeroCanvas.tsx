import { useEffect, useRef, useCallback } from 'react';

interface HeroCanvasProps {
  isFocused: boolean;
  isSearching: boolean;
  className?: string;
}

// Color constants — must match design system tokens exactly
const COLORS = {
  teal:           '#0A5C61',
  tealRgb:        '10, 92, 97',
  nodeMuted:      '#A09890',
  textMuted:      '#7A7570',
  background:     'transparent',
} as const;

// Node definitions — positions as percentages of canvas size
// so the layout scales with the canvas dimensions
const NODE_DEFS = [
  { id: 'istanbul',  label: 'Istanbul',  px: 0.22, py: 0.42 },
  { id: 'guangzhou', label: 'Guangzhou', px: 0.82, py: 0.30 },
  { id: 'hanoi',     label: 'Hanoi',     px: 0.75, py: 0.55 },
  { id: 'penang',    label: 'Penang',    px: 0.70, py: 0.75 },
  { id: 'dubai',     label: 'Dubai',     px: 0.52, py: 0.28 },
  { id: 'surabaya',  label: 'Surabaya',  px: 0.58, py: 0.78 },
];

const GHOST_NODES = [
  { px: 0.15, py: 0.72 },
  { px: 0.88, py: 0.62 },
];

// IDEA node is always centered horizontally, 45% from top
const IDEA_PX = 0.38;
const IDEA_PY = 0.48;

export default function HeroCanvas({ isFocused, isSearching, className }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(performance.now());
  
  // Mutable state stored in refs to avoid re-render triggers
  const stateRef = useRef({
    edgeOpacity:    0.18,
    packetOpacity:  0.7,
    packetSpeed:    1.0,
    pulseFreq:      2500,
    sweepAngle:     0,
    sweepActive:    false,
    sweepStartTime: 0,
    matchedNodes:   [] as number[],
  });

  // Control points stored once on init
  const controlPointsRef = useRef<Array<{ cx: number; cy: number }>>([]);
  
  // Drift phase offsets — unique per node
  const driftPhasesRef = useRef(
    NODE_DEFS.map((_, i) => ({
      px: Math.random() * Math.PI * 2,
      py: Math.random() * Math.PI * 2,
      freq: 0.0004 + i * 0.00008,
    }))
  );

  // Packet progress [0..1] per edge, initialized at staggered offsets
  const packetProgressRef = useRef([0.0, 0.18, 0.35, 0.52, 0.67, 0.83]);

  // ── Cubic bezier point helper ──────────────────────────────────────────────
  function quadBezierPoint(
    t: number,
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) {
    const mt = 1 - t;
    return {
      x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
      y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
    };
  }

  // ── Lerp helper ────────────────────────────────────────────────────────────
  function lerp(current: number, target: number, factor: number) {
    return current + (target - current) * factor;
  }

  // ── Draw function ──────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const dt = 1 / 60; // assume 60fps for consistent animation speed
    const state = stateRef.current;

    ctx.clearRect(0, 0, W, H);

    // ── Lerp state toward targets ──────────────────────────────────────────
    const targetEdgeOpacity   = isFocused || isSearching ? 0.32 : 0.18;
    const targetPacketOpacity = isFocused || isSearching ? 1.0  : 0.7;
    const targetPacketSpeed   = isFocused ? 1.4 : isSearching ? 0 : 1.0;
    const targetPulseFreq     = isFocused ? 1250 : 2500;

    state.edgeOpacity   = lerp(state.edgeOpacity,   targetEdgeOpacity,   0.06);
    state.packetOpacity = lerp(state.packetOpacity,  targetPacketOpacity, 0.06);
    state.packetSpeed   = lerp(state.packetSpeed,    targetPacketSpeed,   0.06);
    state.pulseFreq     = lerp(state.pulseFreq,      targetPulseFreq,     0.06);

    // ── Compute node positions with drift ─────────────────────────────────
    const ideaX = W * IDEA_PX;
    const ideaY = H * IDEA_PY;

    // Initialize control points once
    if (controlPointsRef.current.length === 0) {
      controlPointsRef.current = NODE_DEFS.map((node) => {
        const nx = W * node.px;
        const ny = H * node.py;
        const mx = (ideaX + nx) / 2;
        const my = (ideaY + ny) / 2;
        return {
          cx: mx + (Math.random() * 80 - 40),
          cy: my + (Math.random() * 60 - 30),
        };
      });
    }

    const nodePositions = NODE_DEFS.map((node, i) => {
      const drift = driftPhasesRef.current[i];
      const baseX = W * node.px;
      const baseY = H * node.py;
      const driftX = Math.sin(elapsed * drift.freq * Math.PI * 2 + drift.px) * 3;
      const driftY = Math.cos(elapsed * drift.freq * Math.PI * 2 + drift.py) * 3;
      return { x: baseX + driftX, y: baseY + driftY, label: node.label };
    });

    // ── Draw ghost nodes ───────────────────────────────────────────────────
    GHOST_NODES.forEach((g) => {
      ctx.beginPath();
      ctx.arc(W * g.px, H * g.py, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160, 152, 144, 0.25)`;
      ctx.fill();
    });

    // ── Draw edges ─────────────────────────────────────────────────────────
    nodePositions.forEach((node, i) => {
      const cp = controlPointsRef.current[i];
      if (!cp) return;
      ctx.beginPath();
      ctx.moveTo(ideaX, ideaY);
      ctx.quadraticCurveTo(cp.cx, cp.cy, node.x, node.y);
      ctx.strokeStyle = `rgba(${COLORS.tealRgb}, ${state.edgeOpacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // ── Draw radar sweep (isSearching) ─────────────────────────────────────
    if (isSearching) {
      if (!state.sweepActive) {
        state.sweepActive = true;
        state.sweepStartTime = now;
        state.matchedNodes = [0, 2, 4];
      }
      const sweepElapsed = now - state.sweepStartTime;
      if (sweepElapsed < 2200) {
        state.sweepAngle += (45 * Math.PI / 180) * dt;
        const sweepRadius = Math.min(W, H) * 0.45;

        // Fallback: draw filled arc sector
        ctx.beginPath();
        ctx.moveTo(ideaX, ideaY);
        ctx.arc(ideaX, ideaY, sweepRadius, state.sweepAngle - 0.5, state.sweepAngle);
        ctx.closePath();
        ctx.fillStyle = `rgba(${COLORS.tealRgb}, 0.08)`;
        ctx.fill();

        // Leading sweep line
        ctx.beginPath();
        ctx.moveTo(ideaX, ideaY);
        ctx.lineTo(
          ideaX + Math.cos(state.sweepAngle) * sweepRadius,
          ideaY + Math.sin(state.sweepAngle) * sweepRadius
        );
        ctx.strokeStyle = `rgba(${COLORS.tealRgb}, 0.4)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        state.sweepActive = false;
      }
    } else {
      state.sweepActive = false;
      state.matchedNodes = [];
    }

    // ── Advance and draw data packets ──────────────────────────────────────
    const packetDuration = 3500; // ms per journey
    const packetDt = (1000 / 60) / packetDuration; // progress per frame at 60fps

    packetProgressRef.current = packetProgressRef.current.map((progress, i) => {
      const isMatched = state.matchedNodes.includes(i);

      if (!isSearching) {
        // Advance progress
        const newProgress = (progress + packetDt * state.packetSpeed) % 1;
        const cp = controlPointsRef.current[i];
        if (!cp) return newProgress;

        const pt = quadBezierPoint(
          newProgress,
          { x: ideaX, y: ideaY },
          { x: cp.cx, y: cp.cy },
          nodePositions[i]
        );

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLORS.tealRgb}, ${state.packetOpacity})`;
        ctx.fill();
        return newProgress;
      } else {
        // Blink in place at last position
        const blinkOpacity = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(elapsed * 0.01 + i * 1.2));
        const cp = controlPointsRef.current[i];
        if (!cp) return progress;
        const pt = quadBezierPoint(progress, { x: ideaX, y: ideaY }, { x: cp.cx, y: cp.cy }, nodePositions[i]);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isMatched
          ? `rgba(${COLORS.tealRgb}, ${blinkOpacity})`
          : `rgba(160, 152, 144, ${blinkOpacity * 0.5})`;
        ctx.fill();
        return progress;
      }
    });

    // ── Draw factory nodes ─────────────────────────────────────────────────
    nodePositions.forEach((node, i) => {
      const isMatched = state.matchedNodes.includes(i);

      if (isMatched) {
        // Expanding ring for matched nodes
        const ringProgress = ((elapsed % 1800) / 1800);
        const ringRadius = 4.5 + ringProgress * 14;
        const ringOpacity = (1 - ringProgress) * 0.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${COLORS.tealRgb}, ${ringOpacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.teal;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.nodeMuted;
        ctx.fill();
      }

      // Label (desktop only — checked in parent via prop or CSS)
      if (W > 600) {
        ctx.font = `10px 'Satoshi', 'Inter', sans-serif`;
        ctx.fillStyle = COLORS.textMuted;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y - 14);
      }
    });

    // ── Draw IDEA node ─────────────────────────────────────────────────────
    // Expanding pulse ring
    const pulseProgress = (elapsed % state.pulseFreq) / state.pulseFreq;
    const pulseRadius = 7 + pulseProgress * 11;
    const pulseOpacity = (1 - pulseProgress) * 0.4;
    ctx.beginPath();
    ctx.arc(ideaX, ideaY, pulseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${COLORS.tealRgb}, ${pulseOpacity})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Core dot
    ctx.beginPath();
    ctx.arc(ideaX, ideaY, 7, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.teal;
    ctx.fill();

    // "IDEA" label
    if (W > 600) {
      ctx.font = `bold 10px 'Satoshi', 'Inter', sans-serif`;
      ctx.fillStyle = COLORS.teal;
      ctx.textAlign = 'center';
      ctx.fillText('YOUR IDEA', ideaX, ideaY - 18);
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [isFocused, isSearching]);

  // ── Resize observer ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = parent.clientWidth  * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width  = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
      const ctx = canvas.getContext('2d', { alpha: true });
      ctx?.scale(dpr, dpr);
      // Reset control points on resize so they recalculate for new dimensions
      controlPointsRef.current = [];
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();

    return () => ro.disconnect();
  }, []);

  // ── Start/stop RAF ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    />
  );
}
