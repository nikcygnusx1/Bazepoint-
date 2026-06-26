import { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';

// Shared data for visualization
const NODES = [
  { id: 1, initAngle: 30, radius: 130, size: 14, verified: true, name: 'Vertex Tech', cat: 'MY · Electronics', price: '$12.00/unit', moq: '250', duration: 150 },
  { id: 2, initAngle: 75, radius: 180, size: 12, verified: false, cat: 'CN · Plastics', duration: 180 },
  { id: 3, initAngle: 120, radius: 150, size: 16, verified: true, name: 'Anatolia Apparel', cat: 'TR · Apparel', price: '$7.20/unit', moq: '100', duration: 140 },
  { id: 4, initAngle: 170, radius: 210, size: 11, verified: false, cat: 'VN · Shoes', duration: 200 },
  { id: 5, initAngle: 210, radius: 140, size: 15, verified: true, name: 'Pacific Pkg', cat: 'ID · Packaging', price: '$1.45/unit', moq: '2000', duration: 160 },
  { id: 6, initAngle: 260, radius: 190, size: 13, verified: true, name: 'Atlas Ceramics', cat: 'VN · Ceramics', price: '$4.80/unit', moq: '500', duration: 170 },
  { id: 7, initAngle: 315, radius: 220, size: 10, verified: false, cat: 'PK · Textiles', duration: 210 },
  { id: 8, initAngle: 340, radius: 135, size: 14, verified: true, name: 'Oasis Labs', cat: 'AE · Cosmetics', price: '$3.50/unit', moq: '1000', duration: 145 },
];

export function HeroVisual() {
  const shouldReduceMotion = useReducedMotion();
  const [activeVerifiedIdx, setActiveVerifiedIdx] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const verifiedNodes = NODES.filter(n => n.verified);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVerifiedIdx(prev => (prev + 1) % verifiedNodes.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [verifiedNodes.length]);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <svg viewBox="-300 -280 600 560" className="w-full h-full overflow-visible" aria-label="Interactive visualization of Bazepoint's manufacturer network">
        {/* Background concentric circles */}
        <circle r="80" fill="none" stroke="var(--color-bz-border)" opacity="0.15" />
        <circle r="140" fill="none" stroke="var(--color-bz-border)" opacity="0.15" />
        <circle r="200" fill="none" stroke="var(--color-bz-border)" opacity="0.15" />

        {/* Radar Sweep */}
        {!shouldReduceMotion && (
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <path
              d="M 0 0 L 250 -20 A 250 250 0 0 1 250 20 Z"
              fill="var(--color-bz-teal)"
              opacity="0.04"
            />
          </motion.g>
        )}

        {/* Lines and Nodes */}
        {NODES.map(node => {
          const isVerified = node.verified;
          const isActive = isVerified && verifiedNodes[activeVerifiedIdx].id === node.id;
          const isHovered = hoveredNode === node.id;
          
          return (
            <motion.g
              key={node.id}
              initial={{ rotate: node.initAngle }}
              animate={shouldReduceMotion ? { rotate: node.initAngle } : { rotate: node.initAngle + 360 }}
              transition={{ duration: node.duration, repeat: Infinity, ease: "linear" }}
            >
              {/* Connection Line */}
              {isVerified && (
                <>
                  <line 
                    x1={0} y1={0} x2={node.radius} y2={0} 
                    stroke="var(--color-bz-teal)"
                    strokeWidth={isActive ? 1.5 : 1}
                    strokeDasharray={isActive ? "none" : "4 4"}
                    opacity={isActive ? 0.8 : (isHovered ? 0.5 : 0.25)}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {isActive && !shouldReduceMotion && (
                    <motion.circle
                      r="3"
                      fill="#fff"
                      initial={{ cx: 0, opacity: 0 }}
                      animate={{ cx: node.radius, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 0.6, times: [0, 0.1, 0.8, 1] }}
                    />
                  )}
                </>
              )}
              {!isVerified && (
                <line 
                  x1={0} y1={0} x2={node.radius} y2={0} 
                  stroke="var(--color-bz-border)"
                  strokeWidth={1}
                  strokeDasharray="2 4"
                  opacity={0.3}
                />
              )}

              {/* Node Content (Counter-rotated to keep upright) */}
              <g transform={`translate(${node.radius}, 0)`}>
                <motion.g
                  initial={{ rotate: -node.initAngle }}
                  animate={shouldReduceMotion ? { rotate: -node.initAngle } : { rotate: -(node.initAngle + 360) }}
                  transition={{ duration: node.duration, repeat: Infinity, ease: "linear" }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: isVerified ? 'pointer' : 'default' }}
                >
                  <circle 
                    r={isActive || isHovered ? node.size + 3 : node.size} 
                    fill={isVerified ? "var(--color-bz-amber)" : "transparent"} 
                    stroke={isVerified ? "none" : "var(--color-bz-border)"}
                    strokeWidth={1}
                    style={{ transition: 'r 0.3s ease' }}
                  />
                  {isVerified && (
                    <path 
                      d="M -4 0 L -1.5 2.5 L 4 -3" 
                      fill="none" 
                      stroke="#fff" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  )}
                  
                  {/* Category Label */}
                  <text 
                    y={node.size + 14} 
                    textAnchor="middle" 
                    className="fill-bz-text-faint font-mono text-[9px]"
                  >
                    {node.cat}
                  </text>

                  {/* HTML Tooltip overlay using foreignObject */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.foreignObject 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        x={-75} 
                        y={-64} 
                        width={150} 
                        height={48} 
                        className="overflow-visible pointer-events-none"
                      >
                        <div className="bg-bz-surface shadow-md border border-bz-border rounded-md px-3 py-2 flex flex-col items-center justify-center whitespace-nowrap">
                          <span className="text-bz-text text-[10px] font-body font-semibold leading-tight">{node.name}</span>
                          <span className="text-bz-text-muted text-[9px] font-mono leading-tight mt-0.5">{node.price} · MOQ {node.moq}</span>
                        </div>
                      </motion.foreignObject>
                    )}
                  </AnimatePresence>
                </motion.g>
              </g>
            </motion.g>
          );
        })}

        {/* Center Node (Your Idea) */}
        <g>
          {/* Soft outer glow */}
          <circle r="60" fill="url(#centerGlow)" />
          {/* Pulsing ring */}
          <motion.circle 
            r="48" 
            fill="none" 
            stroke="var(--color-bz-teal)" 
            opacity="0.3" 
            strokeWidth="1"
            animate={shouldReduceMotion ? {} : { r: [44, 54, 44] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Main center circle */}
          <motion.circle 
            r="28" 
            fill="var(--color-bz-teal)" 
            animate={shouldReduceMotion ? {} : { y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Star Icon */}
          <motion.path 
            d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" 
            fill="#fff" 
            animate={shouldReduceMotion ? {} : { y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>

        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-bz-teal)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-bz-teal)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
