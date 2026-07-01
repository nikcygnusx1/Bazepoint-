import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GlobeCore } from './GlobeCore';
import { GlobeNodes } from './GlobeNodes';
import { cursorPos } from '../CustomCursor';

interface GlobeSceneProps {
  activeRegion: string | null;
  onRegionHover: (region: string | null) => void;
  scrollProgress: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function GlobeGroup({ activeRegion, onRegionHover, scrollProgress }: GlobeSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Rotational states
  const targetRotationRef = useRef({ x: 0, y: 0, z: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0, z: 0 });
  const autoRotationRef = useRef(0);

  // Region Y-rotation targets (negative longitude in radians to face the camera)
  const regionFocusY = useMemo<Record<string, number>>(() => ({
    turkey: -0.61,     // Lon 35 deg
    indonesia: -2.06,  // Lon 118 deg
    uae: -0.94,        // Lon 54 deg
  }), []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    // 1. Auto-rotate (slow, cinematic drift around Y axis when not focused)
    autoRotationRef.current += 0.0006;

    // 2. Cursor tilt effect (smoothly tilting X/Z based on normalized mouse coords)
    let mx = 0.5;
    let my = 0.5;
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: none)').matches) {
      mx = cursorPos.x / window.innerWidth;
      my = cursorPos.y / window.innerHeight;
    }

    targetRotationRef.current.x = (my - 0.5) * 0.18;
    targetRotationRef.current.z = (mx - 0.5) * -0.12;

    // 3. Smooth Y-rotation depending on activeRegion focus or auto-rotation
    let targetY = autoRotationRef.current;
    if (activeRegion && regionFocusY[activeRegion] !== undefined) {
      targetY = regionFocusY[activeRegion];
    }

    // 4. Interpolate and apply transforms
    currentRotationRef.current.x = lerp(currentRotationRef.current.x, targetRotationRef.current.x, 0.04);
    currentRotationRef.current.z = lerp(currentRotationRef.current.z, targetRotationRef.current.z, 0.04);
    
    // Smoothly interpolate the Y rotation
    groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, targetY, 0.04);
    groupRef.current.rotation.x = currentRotationRef.current.x;
    groupRef.current.rotation.z = currentRotationRef.current.z;

    // 5. Scroll entrance progress
    const p = Math.min(Math.max(scrollProgress, 0), 1);
    const scale = 0.7 + p * 0.3; // Scale 0.7 -> 1.0
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      <GlobeCore radius={1.0} onLandFlagsReady={() => {}} />
      <GlobeNodes radius={1.0} activeRegion={activeRegion} onNodeHover={onRegionHover} />
    </group>
  );
}

export function GlobeScene({ activeRegion, onRegionHover, scrollProgress }: GlobeSceneProps) {
  const dpr = typeof window !== 'undefined'
    ? window.matchMedia('(hover: none)').matches
      ? 1.5
      : Math.min(window.devicePixelRatio, 2)
    : 1;

  return (
    <div className="w-full h-full globe-canvas-container relative select-none">
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 45 }}
        dpr={dpr}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', pointerEvents: 'auto' }}
      >
        <GlobeGroup
          activeRegion={activeRegion}
          onRegionHover={onRegionHover}
          scrollProgress={scrollProgress}
        />
        <ambientLight intensity={0.4} color="#F5F4F0" />
        <directionalLight position={[5, 3, 5]} intensity={0.8} color="#FFFFFF" />
        <directionalLight position={[-3, -2, -4]} intensity={0.15} color="#B8E2F2" />
      </Canvas>
    </div>
  );
}
export default GlobeScene;
