import { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { latLonToVector3, createArcCurve } from '../../lib/globe-utils';

interface GlobeNodesProps {
  radius: number;
  activeRegion: string | null;
  onNodeHover: (region: string | null) => void;
}

const YOU_LAT = 28.6;
const YOU_LON = 77.2;

const FACTORY_NODES = [
  { id: 'turkey',    lat: 39.0, lon: 35.0,  label: 'Turkey',    sub: 'Apparel · Textiles',      phase: 0 },
  { id: 'indonesia', lat: -2.5, lon: 118.0, label: 'Indonesia', sub: 'Bamboo · Ceramics',        phase: 2.1 },
  { id: 'uae',       lat: 24.0, lon: 54.0,  label: 'UAE',       sub: 'Pharma · Supplements',     phase: 4.2 },
];

export function GlobeNodes({ radius, activeRegion, onNodeHover }: GlobeNodesProps) {
  // 1. Convert positions to Vector3
  const youPos = useMemo(() => latLonToVector3(YOU_LAT, YOU_LON, radius), [radius]);
  const nodePositions = useMemo(() => {
    return FACTORY_NODES.map(node => ({
      ...node,
      pos: latLonToVector3(node.lat, node.lon, radius),
      labelPos: latLonToVector3(node.lat, node.lon, radius + 0.08),
    }));
  }, [radius]);

  // 2. Create Arc Curves
  const arcCurves = useMemo(() => {
    return FACTORY_NODES.map(node =>
      createArcCurve(node.lat, node.lon, YOU_LAT, YOU_LON, radius, 0.45)
    );
  }, [radius]);

  // 3. Create Arc Geometries (TubeGeometry along Bezier curve)
  const arcGeometries = useMemo(() => {
    return arcCurves.map(curve => {
      return new THREE.TubeGeometry(curve, 64, 0.0025, 6, false);
    });
  }, [arcCurves]);

  // Refs for custom materials and meshes
  const arcMaterialsRef = useRef<THREE.ShaderMaterial[]>([]);
  const ring1Refs = useRef<THREE.Mesh[]>([]);
  const ring2Refs = useRef<THREE.Mesh[]>([]);
  const youRingRef = useRef<THREE.Mesh[]>([]);
  const packetGroupRefs = useRef<THREE.Group[]>([]);

  // 4. Custom Ring Shader Material definition
  const ringShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPhase: { value: 0 },
        uActive: { value: 0.0 },
        uColor: { value: new THREE.Color('#B8E2F2') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uPhase;
        uniform float uActive;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          // Circular ring fade
          float dist = length(vUv - vec2(0.5));
          if (dist > 0.5 || dist < 0.35) discard;
          
          float cycle = sin(uTime * 2.0 + uPhase);
          float baseOpacity = cycle * 0.25 + 0.45;
          float opacity = baseOpacity * (uActive > 0.5 ? 1.0 : 0.4);
          
          gl_FragColor = vec4(uColor, opacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Arc Shader Material template function
  const createArcMaterial = () => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0.0 },
        uOpacity: { value: 0.7 },
        uColor: { value: new THREE.Color('#B8E2F2') },
      },
      vertexShader: `
        varying float vProgress;
        void main() {
          vProgress = uv.x;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uProgress;
        uniform float uOpacity;
        uniform vec3 uColor;
        varying float vProgress;
        void main() {
          if (vProgress > uProgress) discard;
          float alpha = uOpacity * (1.0 - smoothstep(uProgress - 0.05, uProgress, vProgress));
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  };

  const arcMaterials = useMemo(() => {
    return FACTORY_NODES.map(() => createArcMaterial());
  }, []);

  // Populate refs once
  useEffect(() => {
    arcMaterialsRef.current = arcMaterials;
  }, [arcMaterials]);

  // Trigger stagger animation for Arcs drawing on mount
  useEffect(() => {
    arcMaterials.forEach((mat, i) => {
      mat.uniforms.uProgress.value = 0;
      gsap.to(mat.uniforms.uProgress, {
        value: 1.0,
        duration: 1.8,
        delay: 0.4 + i * 0.5,
        ease: 'power2.out',
      });
    });
  }, [arcMaterials]);

  // 5. Data Packets initialization (3 per arc)
  const packets = useMemo(() => {
    return FACTORY_NODES.flatMap((_, arcIdx) =>
      [0.0, 0.33, 0.66].map((offset, pIdx) => ({
        id: `p-${arcIdx}-${pIdx}`,
        arcIdx,
        offset,
        speed: 0.0012 + Math.random() * 0.0008,
      }))
    );
  }, []);

  // Mutable tracking of progress per packet
  const packetProgressRef = useRef<number[]>(packets.map(p => p.offset));

  // Animate everything in the R3F loop
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // ── Update active states on materials ──
    FACTORY_NODES.forEach((node, i) => {
      const isActive = activeRegion === node.id;
      
      // Update arc opacity
      const arcMat = arcMaterialsRef.current[i];
      if (arcMat) {
        arcMat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
          arcMat.uniforms.uOpacity.value,
          isActive ? 1.0 : 0.6,
          0.1
        );
      }

      // Update node ring scale and opacity calculations
      const r1 = ring1Refs.current[i];
      const r2 = ring2Refs.current[i];
      
      if (r1) {
        const scale = 1.0 + Math.sin(time * 2.0 + node.phase) * 0.25;
        r1.scale.setScalar(isActive ? scale * 1.4 : scale);
      }
      if (r2) {
        const scale = 1.6 + Math.sin(time * 2.0 + node.phase + Math.PI) * 0.2;
        r2.scale.setScalar(isActive ? scale * 1.3 : scale);
      }
    });

    // Animate YOU Node Ring
    if (youRingRef.current[0]) {
      const scale = 1.0 + Math.sin(time * 2.0) * 0.2;
      youRingRef.current[0].scale.setScalar(scale);
    }

    // ── Update packet positions ──
    packets.forEach((packet, i) => {
      // Advance progress
      packetProgressRef.current[i] = (packetProgressRef.current[i] + packet.speed) % 1.0;
      const t = packetProgressRef.current[i];
      const curve = arcCurves[packet.arcIdx];
      const pos = curve.getPoint(t);

      const packetMesh = packetGroupRefs.current[i];
      if (packetMesh) {
        packetMesh.position.copy(pos);
      }
    });
  });

  return (
    <group>
      {/* ── DRAW THE ARCS ── */}
      {arcGeometries.map((geo, i) => (
        <mesh key={`arc-${i}`} geometry={geo} material={arcMaterials[i]} />
      ))}

      {/* ── DRAW DATA PACKETS ── */}
      {packets.map((packet, i) => (
        <group
          key={packet.id}
          ref={(el) => {
            if (el) packetGroupRefs.current[i] = el;
          }}
        >
          {/* Core dot */}
          <mesh>
            <sphereGeometry args={[0.006, 6, 6]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
          </mesh>
          {/* Ambient packet glow */}
          <mesh>
            <sphereGeometry args={[0.011, 6, 6]} />
            <meshBasicMaterial
              color="#B8E2F2"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}

      {/* ── DRAW FACTORY NODES ── */}
      {nodePositions.map((node, i) => {
        const isActive = activeRegion === node.id;
        return (
          <group key={node.id} position={node.pos}>
            {/* Core sphere */}
            <mesh scale={isActive ? 1.4 : 1.0}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial color="#B8E2F2" />
            </mesh>

            {/* Pulsing Outer Rings */}
            <Billboard>
              <mesh
                ref={(el) => {
                  if (el) ring1Refs.current[i] = el;
                }}
              >
                <ringGeometry args={[0.018, 0.024, 32]} />
                <primitive
                  object={ringShaderMaterial}
                  attach="material"
                  uPhase={node.phase}
                  uActive={isActive ? 1.0 : 0.0}
                />
              </mesh>
              <mesh
                ref={(el) => {
                  if (el) ring2Refs.current[i] = el;
                }}
              >
                <ringGeometry args={[0.028, 0.034, 32]} />
                <primitive
                  object={ringShaderMaterial}
                  attach="material"
                  uPhase={node.phase + Math.PI}
                  uActive={isActive ? 1.0 : 0.0}
                />
              </mesh>
            </Billboard>

            {/* THREE HTML Labels overlay */}
            <Html
              position={[0, 0.03, 0]}
              center
              distanceFactor={8}
              className="drei-html-label pointer-events-auto"
            >
              <div
                className={`flex flex-col items-center bg-[#1A1A18]/90 border px-2 py-1 rounded text-center transition-all duration-300 backdrop-blur-sm select-none cursor-pointer ${
                  isActive
                    ? 'border-[#B8E2F2] shadow-[0_0_12px_rgba(184,226,242,0.4)] scale-105'
                    : 'border-white/10 hover:border-[#B8E2F2]'
                }`}
                onMouseEnter={() => onNodeHover(node.id)}
                onMouseLeave={() => onNodeHover(null)}
              >
                <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-white">
                  {node.label}
                </span>
                <span className="font-sans text-[7px] text-[#9C9C96] whitespace-nowrap mt-0.5">
                  {node.sub}
                </span>
              </div>
            </Html>
          </group>
        );
      })}

      {/* ── DRAW "YOU" DESTINATION NODE ── */}
      <group position={youPos}>
        {/* Core Octahedron */}
        <mesh>
          <octahedronGeometry args={[0.016, 0]} />
          <meshBasicMaterial color="#1A1A18" />
        </mesh>

        {/* Pulsing ring */}
        <Billboard>
          <mesh
            ref={(el) => {
              if (el) youRingRef.current[0] = el;
            }}
          >
            <ringGeometry args={[0.020, 0.026, 24]} />
            <primitive
              object={ringShaderMaterial}
              attach="material"
              uPhase={0}
              uActive={1.0}
            />
          </mesh>
        </Billboard>

        {/* HTML label */}
        <Html position={[0, 0.03, 0]} center distanceFactor={8} className="drei-html-label select-none">
          <div className="flex flex-col items-center bg-[#F5F4F0] border border-[rgba(0,0,0,0.07)] px-1.5 py-0.5 rounded text-center shadow-sm">
            <span className="font-mono text-[8px] uppercase tracking-wider font-bold text-[#1A1A18]">
              Your Inbox
            </span>
          </div>
        </Html>
      </group>
    </group>
  );
}
