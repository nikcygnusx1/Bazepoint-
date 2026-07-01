import { useEffect, useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { buildLandFlags, buildFibonacciPoints } from '../../lib/globe-utils';

interface GlobeCoreProps {
  radius: number;
  onLandFlagsReady: (flags: Float32Array) => void;
}

export function GlobeCore({ radius, onLandFlagsReady }: GlobeCoreProps) {
  const [landFlags, setLandFlags] = useState<Float32Array | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // High-resolution sphere geometry for dot matrix
  const geometry = useMemo(() => {
    return buildFibonacciPoints(3500, radius);
  }, [radius]);

  const vertexCount = geometry.attributes.position.count;

  // Compute land/ocean flags on mount
  useEffect(() => {
    const posAttr = geometry.attributes.position;
    buildLandFlags(posAttr.array as Float32Array, radius).then((flags) => {
      setLandFlags(flags);
      setIsLoading(false);
      onLandFlagsReady(flags);
    });
  }, [geometry, radius, onLandFlagsReady]);

  // Set or update aIsLand attribute on the geometry
  useEffect(() => {
    const array = landFlags || new Float32Array(vertexCount);
    const attr = new THREE.BufferAttribute(array, 1);
    geometry.setAttribute('aIsLand', attr);
    geometry.attributes.aIsLand.needsUpdate = true;
  }, [geometry, landFlags, vertexCount]);

  // Animate time uniform
  useFrame((_state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  // Custom shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSize: { value: 2.8 },
    uLandColor: { value: new THREE.Color('#EDECE8') },
    uOceanColor: { value: new THREE.Color('#B8E2F2') },
  }), []);

  // Custom Shaders for dot matrix
  const vertexShader = `
    attribute float aIsLand;
    varying float vIsLand;
    uniform float uTime;
    uniform float uSize;

    void main() {
      vIsLand = aIsLand;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      // Land dots are larger and brighter, ocean dots are tiny
      float size = aIsLand > 0.5 ? uSize : uSize * 0.3;
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying float vIsLand;
    uniform vec3 uLandColor;
    uniform vec3 uOceanColor;

    void main() {
      // Discard pixels outside the circle to create dot shape
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;

      // Soft edge
      float alpha = 1.0 - smoothstep(0.35, 0.5, dist);

      vec3 color = vIsLand > 0.5 ? uLandColor : uOceanColor;
      float opacity = vIsLand > 0.5 ? 0.85 : 0.12;

      gl_FragColor = vec4(color, alpha * opacity);
    }
  `;

  // Custom Atmosphere Shaders
  const atmosphereUniforms = useMemo(() => ({
    uColor: { value: new THREE.Color('#B8E2F2') },
  }), []);

  const atmosphereVertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const atmosphereFragmentShader = `
    uniform vec3 uColor;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
      gl_FragColor = vec4(uColor, intensity * 0.35);
    }
  `;

  if (isLoading) {
    return (
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial wireframe color="#B8E2F2" opacity={0.06} transparent />
      </mesh>
    );
  }

  return (
    <group>
      {/* Globe Dot Matrix */}
      <points ref={pointsRef} geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
        />
      </points>

      {/* Atmosphere Glow Outer Sphere */}
      <mesh>
        <sphereGeometry args={[radius * 1.015, 64, 64]} />
        <shaderMaterial
          uniforms={atmosphereUniforms}
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
