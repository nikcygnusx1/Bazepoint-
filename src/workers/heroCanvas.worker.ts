// Color constants — must match design system tokens exactly
const COLORS = {
  teal:           '#B8E2F2',
  tealRgb:        '184, 226, 242',
  nodeMuted:      '#9C9C96',
  textMuted:      '#9C9C96',
  background:     'transparent',
} as const;

// Node definitions — positions as percentages of canvas size
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

// Mutable state
let edgeOpacity = 0.18;
let packetOpacity = 0.7;
let packetSpeed = 1.0;
let pulseFreq = 2500;
let sweepAngle = 0;
let sweepActive = false;
let sweepStartTime = 0;
let matchedNodes: number[] = [];
let controlPoints: Array<{cx: number, cy: number}> = [];
let controlPointsCached = false;

// Drift phase offsets
let driftPhases = NODE_DEFS.map((_, i) => ({
  px: Math.random() * Math.PI * 2,
  py: Math.random() * Math.PI * 2,
  freq: 0.0004 + i * 0.00008,
}));

// Repulsion offsets
let repulsion: Array<{rx: number, ry: number}> = NODE_DEFS.map(() => ({ rx: 0, ry: 0 }));
let ideaRepulsion = { rx: 0, ry: 0 };
let packetProgress = [0.0, 0.18, 0.35, 0.52, 0.67, 0.83];

// Received data & worker state
let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let W = 0, H = 0;
let dpr = 1;
let cursorX = -999, cursorY = -999;
let cursorDirty = false;
let isFocused = false;
let isSearching = false;
let isVisible = true;
let rafId = 0;
let startTime = 0;
let isTouchPrimary = false;

// Adaptive Quality System
let frameCount = 0;
let totalFrameTime = 0;
type QualityLevel = 'high' | 'medium' | 'low';
let quality: QualityLevel = 'high';

// Gradient Cache
let cachedGlowGradient: CanvasGradient | null = null;
let lastGlowX = -9999, lastGlowY = -9999;

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
function draw() {
  if (!isVisible || !ctx || !canvas) {
    return;
  }
  const t0 = performance.now();

  const now = performance.now();
  const elapsed = now - startTime;
  const dt = 1 / 60; // assume 60fps for consistent animation speed

  // Background clear
  ctx.fillStyle = '#F5F4F0';
  ctx.fillRect(0, 0, W, H);

  // Logical coordinates
  const cursorCanvasX = cursorX;
  const cursorCanvasY = cursorY;

  // ── Dirty flag guard ──────────────────────────────────
  if (cursorDirty) {
    cursorDirty = false;
  }

  // ── Draw cursor glow ───────────────────────────────────────────────────
  if (quality !== 'low' && cursorCanvasX > 0 && cursorCanvasX < W && cursorCanvasY > 0 && cursorCanvasY < H) {
    if (Math.abs(cursorCanvasX - lastGlowX) > 4 || Math.abs(cursorCanvasY - lastGlowY) > 4 || cachedGlowGradient === null) {
      cachedGlowGradient = ctx.createRadialGradient(
        cursorCanvasX, cursorCanvasY, 0,
        cursorCanvasX, cursorCanvasY, 70
      );
      cachedGlowGradient.addColorStop(0, 'rgba(184, 226, 242, 0.08)');
      cachedGlowGradient.addColorStop(0.5, 'rgba(184, 226, 242, 0.03)');
      cachedGlowGradient.addColorStop(1, 'transparent');
      lastGlowX = cursorCanvasX;
      lastGlowY = cursorCanvasY;
    }
    
    ctx.beginPath();
    ctx.arc(cursorCanvasX, cursorCanvasY, 70, 0, Math.PI * 2);
    ctx.fillStyle = cachedGlowGradient;
    ctx.fill();
  }

  // ── Lerp state toward targets ──────────────────────────────────────────
  const targetEdgeOpacity   = isFocused || isSearching ? 0.32 : 0.18;
  const targetPacketOpacity = isFocused || isSearching ? 1.0  : 0.7;
  const targetPacketSpeed   = isFocused ? 1.4 : isSearching ? 0 : 1.0;
  const targetPulseFreq     = isFocused ? 1250 : 2500;

  edgeOpacity   = lerp(edgeOpacity,   targetEdgeOpacity,   0.06);
  packetOpacity = lerp(packetOpacity,  targetPacketOpacity, 0.06);
  packetSpeed   = lerp(packetSpeed,    targetPacketSpeed,   0.06);
  pulseFreq     = lerp(pulseFreq,      targetPulseFreq,     0.06);

  const REPULSION_RADIUS = 80;   
  const REPULSION_FORCE  = 28;   
  const REPULSION_DECAY  = 0.08; 

  // ── Repulsion for central IDEA node ────────────────────────────────────
  const ideaBaseX = W * IDEA_PX;
  const ideaBaseY = H * IDEA_PY;
  
  if (quality !== 'low') {
    if (cursorDirty) {
      const idx = ideaBaseX - cursorCanvasX;
      const idy = ideaBaseY - cursorCanvasY;
      const idist = Math.sqrt(idx * idx + idy * idy);

      if (idist < REPULSION_RADIUS && idist > 0) {
        const force = (1 - idist / REPULSION_RADIUS) * 20; 
        const angle = Math.atan2(idy, idx);
        ideaRepulsion.rx = Math.cos(angle) * force;
        ideaRepulsion.ry = Math.sin(angle) * force;
      } else {
        ideaRepulsion.rx = lerp(ideaRepulsion.rx, 0, REPULSION_DECAY);
        ideaRepulsion.ry = lerp(ideaRepulsion.ry, 0, REPULSION_DECAY);
      }
    } else {
      ideaRepulsion.rx = lerp(ideaRepulsion.rx, 0, REPULSION_DECAY);
      ideaRepulsion.ry = lerp(ideaRepulsion.ry, 0, REPULSION_DECAY);
    }
  } else {
    ideaRepulsion.rx = 0;
    ideaRepulsion.ry = 0;
  }

  const ideaX = ideaBaseX + ideaRepulsion.rx;
  const ideaY = ideaBaseY + ideaRepulsion.ry;

  // Initialize control points once
  if (!controlPointsCached || controlPoints.length === 0) {
    controlPoints = NODE_DEFS.map((node) => {
      const nx = W * node.px;
      const ny = H * node.py;
      const mx = (ideaBaseX + nx) / 2;
      const my = (ideaBaseY + ny) / 2;
      return {
        cx: mx + (Math.random() * 80 - 40),
        cy: my + (Math.random() * 60 - 30),
      };
    });
    controlPointsCached = true;
  }

  // ── Compute node positions with drift and repulsion ──────────────────
  const nodePositions = NODE_DEFS.map((node, i) => {
    let driftX = 0;
    let driftY = 0;
    
    if (quality !== 'low') {
      const drift = driftPhases[i];
      driftX = Math.sin(elapsed * drift.freq * Math.PI * 2 + drift.px) * 3;
      driftY = Math.cos(elapsed * drift.freq * Math.PI * 2 + drift.py) * 3;
    }
    
    const baseX = W * node.px + driftX;
    const baseY = H * node.py + driftY;

    if (quality !== 'low') {
      if (cursorDirty) {
        const dx = baseX - cursorCanvasX;
        const dy = baseY - cursorCanvasY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPULSION_RADIUS && dist > 0) {
          const force = (1 - dist / REPULSION_RADIUS) * REPULSION_FORCE;
          const angle = Math.atan2(dy, dx);
          repulsion[i].rx = Math.cos(angle) * force;
          repulsion[i].ry = Math.sin(angle) * force;
        } else {
          repulsion[i].rx = lerp(repulsion[i].rx, 0, REPULSION_DECAY);
          repulsion[i].ry = lerp(repulsion[i].ry, 0, REPULSION_DECAY);
        }
      } else {
        repulsion[i].rx = lerp(repulsion[i].rx, 0, REPULSION_DECAY);
        repulsion[i].ry = lerp(repulsion[i].ry, 0, REPULSION_DECAY);
      }
    } else {
      repulsion[i].rx = 0;
      repulsion[i].ry = 0;
    }

    return {
      x: baseX + repulsion[i].rx,
      y: baseY + repulsion[i].ry,
      label: node.label
    };
  });

  // ── Draw ghost nodes ───────────────────────────────────────────────────
  GHOST_NODES.forEach((g) => {
    ctx!.beginPath();
    ctx!.arc(W * g.px, H * g.py, 3, 0, Math.PI * 2);
    ctx!.fillStyle = `rgba(160, 152, 144, 0.25)`;
    ctx!.fill();
  });

  // ── Draw edges ─────────────────────────────────────────────────────────
  nodePositions.forEach((node, i) => {
    const cp = controlPoints[i];
    if (!cp) return;
    ctx!.beginPath();
    ctx!.moveTo(ideaX, ideaY);
    ctx!.quadraticCurveTo(cp.cx, cp.cy, node.x, node.y);
    ctx!.strokeStyle = `rgba(${COLORS.tealRgb}, ${edgeOpacity})`;
    ctx!.lineWidth = 1;
    ctx!.stroke();
  });

  // ── Draw radar sweep (isSearching) ─────────────────────────────────────
  if (isSearching) {
    if (!sweepActive) {
      sweepActive = true;
      sweepStartTime = now;
      matchedNodes = [0, 2, 4];
    }
    const sweepElapsed = now - sweepStartTime;
    if (sweepElapsed < 2200) {
      sweepAngle += (45 * Math.PI / 180) * dt;
      const sweepRadius = Math.min(W, H) * 0.45;

      // Fallback: draw filled arc sector
      ctx!.beginPath();
      ctx!.moveTo(ideaX, ideaY);
      ctx!.arc(ideaX, ideaY, sweepRadius, sweepAngle - 0.5, sweepAngle);
      ctx!.closePath();
      ctx!.fillStyle = `rgba(${COLORS.tealRgb}, 0.08)`;
      ctx!.fill();

      // Leading sweep line
      ctx!.beginPath();
      ctx!.moveTo(ideaX, ideaY);
      ctx!.lineTo(
        ideaX + Math.cos(sweepAngle) * sweepRadius,
        ideaY + Math.sin(sweepAngle) * sweepRadius
      );
      ctx!.strokeStyle = `rgba(${COLORS.tealRgb}, 0.4)`;
      ctx!.lineWidth = 1.5;
      ctx!.stroke();
    } else {
      sweepActive = false;
    }
  } else {
    sweepActive = false;
    matchedNodes = [];
  }

  // ── Advance and draw data packets ──────────────────────────────────────
  const packetDuration = 3500; 
  const packetDt = (1000 / 60) / packetDuration; 
  const activePacketCount = quality === 'low' ? 2 : quality === 'medium' ? 4 : 6;

  for (let i = 0; i < activePacketCount; i++) {
    const isMatched = matchedNodes.includes(i);
    let progress = packetProgress[i];

    if (!isSearching) {
      const newProgress = (progress + packetDt * packetSpeed) % 1;
      const cp = controlPoints[i];
      if (cp) {
        const pt = quadBezierPoint(
          newProgress,
          { x: ideaX, y: ideaY },
          { x: cp.cx, y: cp.cy },
          nodePositions[i]
        );

        ctx!.beginPath();
        ctx!.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${COLORS.tealRgb}, ${packetOpacity})`;
        ctx!.fill();
      }
      packetProgress[i] = newProgress;
    } else {
      const blinkOpacity = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(elapsed * 0.01 + i * 1.2));
      const cp = controlPoints[i];
      if (cp) {
        const pt = quadBezierPoint(progress, { x: ideaX, y: ideaY }, { x: cp.cx, y: cp.cy }, nodePositions[i]);
        ctx!.beginPath();
        ctx!.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = isMatched
          ? `rgba(${COLORS.tealRgb}, ${blinkOpacity})`
          : `rgba(160, 152, 144, ${blinkOpacity * 0.5})`;
        ctx!.fill();
      }
    }
  }

  // ── Draw factory nodes ─────────────────────────────────────────────────
  nodePositions.forEach((node, i) => {
    const isMatched = matchedNodes.includes(i);

    if (isMatched) {
      const ringProgress = ((elapsed % 1800) / 1800);
      const ringRadius = 4.5 + ringProgress * 14;
      const ringOpacity = (1 - ringProgress) * 0.5;
      ctx!.beginPath();
      ctx!.arc(node.x, node.y, ringRadius, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(${COLORS.tealRgb}, ${ringOpacity})`;
      ctx!.lineWidth = 1;
      ctx!.stroke();

      ctx!.beginPath();
      ctx!.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
      ctx!.fillStyle = COLORS.teal;
      ctx!.fill();
    } else {
      ctx!.beginPath();
      ctx!.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
      ctx!.fillStyle = COLORS.nodeMuted;
      ctx!.fill();
    }

    if (W > 600) {
      ctx!.fillStyle = COLORS.textMuted;
      ctx!.textAlign = 'center';
      ctx!.fillText(node.label, node.x, node.y - 14);
    }
  });

  // ── Draw IDEA node ─────────────────────────────────────────────────────
  const pulseProgress = (elapsed % pulseFreq) / pulseFreq;
  const pulseRadius = 7 + pulseProgress * 11;
  const pulseOpacity = (1 - pulseProgress) * 0.4;
  ctx!.beginPath();
  ctx!.arc(ideaX, ideaY, pulseRadius, 0, Math.PI * 2);
  ctx!.strokeStyle = `rgba(${COLORS.tealRgb}, ${pulseOpacity})`;
  ctx!.lineWidth = 1.5;
  ctx!.stroke();

  ctx!.beginPath();
  ctx!.arc(ideaX, ideaY, 7, 0, Math.PI * 2);
  ctx!.fillStyle = COLORS.teal;
  ctx!.fill();

  if (W > 600) {
    ctx!.fillStyle = COLORS.teal;
    ctx!.textAlign = 'center';
    ctx!.fillText('YOUR IDEA', ideaX, ideaY - 18);
  }

  // Adaptive quality profiling
  const frameTime = performance.now() - t0;
  if (frameCount < 60) {
    totalFrameTime += frameTime;
    frameCount++;
    if (frameCount === 60) {
      const avg = totalFrameTime / 60;
      if (avg > 8) quality = 'low';
      else if (avg > 5) quality = 'medium';
      else quality = 'high';
    }
  }
  // Re-profile every 30 seconds (1800 frames at 60fps)
  if (frameCount > 0 && frameCount % 1800 === 0) {
    frameCount = 0;
    totalFrameTime = 0;
  }
  rafId = requestAnimationFrame(draw);
}

self.onmessage = (e: MessageEvent) => {
  const { type } = e.data;

  if (type === 'init') {
    canvas = e.data.canvas as OffscreenCanvas;
    dpr = e.data.dpr;
    isTouchPrimary = e.data.isTouchPrimary;
    W = e.data.width;
    H = e.data.height;

    const dprCap = isTouchPrimary ? 1.5 : 2.0;
    dpr = Math.min(dpr, dprCap);

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    ctx = canvas.getContext('2d', { alpha: true }) as OffscreenCanvasRenderingContext2D;
    ctx.scale(dpr, dpr);

    ctx.font = `10px 'Satoshi', 'Inter', sans-serif`;

    startTime = performance.now();
    rafId = requestAnimationFrame(draw);
  }

  if (type === 'resize') {
    W = e.data.width;
    H = e.data.height;
    const newDpr = e.data.dpr;
    const dprCap = isTouchPrimary ? 1.5 : 2.0;
    dpr = Math.min(newDpr, dprCap);

    if (canvas) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      ctx.scale(dpr, dpr);
      ctx.font = `10px 'Satoshi', 'Inter', sans-serif`;
    }
    controlPointsCached = false;
    cachedGlowGradient = null;
  }

  if (type === 'cursor') {
    if (cursorX !== e.data.x || cursorY !== e.data.y) {
      cursorX = e.data.x;
      cursorY = e.data.y;
      cursorDirty = true;
    }
  }

  if (type === 'state') {
    isFocused = e.data.isFocused;
    isSearching = e.data.isSearching;
  }

  if (type === 'visibility') {
    const wasInvisible = !isVisible;
    isVisible = e.data.visible;
    if (isVisible && wasInvisible && ctx) {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(draw);
    }
  }
};
