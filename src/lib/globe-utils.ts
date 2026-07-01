import * as THREE from 'three';

export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export function pointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export async function buildLandFlags(
  positions: Float32Array,
  radius: number
): Promise<Float32Array> {
  const vertexCount = positions.length / 3;
  const flags = new Float32Array(vertexCount);

  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    if (!res.ok) throw new Error('Failed to fetch country topojson');
    const topo = await res.json();

    // Dynamically import topojson-client from CDN as an ES module
    // @ts-ignore
    const topojson = await import('https://cdn.jsdelivr.net/npm/topojson-client@3/+esm');
    const countries = topojson.feature(topo, topo.objects.countries) as any;

    const polygons: [number, number][][] = countries.features
      .flatMap((f: any) => {
        if (!f.geometry) return [];
        if (f.geometry.type === 'Polygon') {
          return [f.geometry.coordinates[0]];
        }
        if (f.geometry.type === 'MultiPolygon') {
          return f.geometry.coordinates.map((p: any) => p[0]);
        }
        return [];
      });

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const lat = 90 - (Math.acos(Math.max(-1, Math.min(1, y / radius))) * 180 / Math.PI);
      const lon = ((Math.atan2(z, -x) * 180 / Math.PI) + 180) % 360 - 180;

      let isLand = false;
      for (const poly of polygons) {
        if (pointInPolygon([lon, lat], poly)) {
          isLand = true;
          break;
        }
      }
      flags[i / 3] = isLand ? 1.0 : 0.0;
    }
  } catch (error) {
    console.error('Error in buildLandFlags, using fallback ocean flags:', error);
    // fallback to empty (all ocean) on error
  }

  return flags;
}

export function createArcCurve(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  radius: number,
  arcHeight: number = 0.4
): THREE.QuadraticBezierCurve3 {
  const startVec = latLonToVector3(startLat, startLon, radius);
  const endVec = latLonToVector3(endLat, endLon, radius);
  const midpoint = startVec.clone().add(endVec).normalize();
  midpoint.multiplyScalar(radius + arcHeight);
  return new THREE.QuadraticBezierCurve3(startVec, midpoint, endVec);
}
