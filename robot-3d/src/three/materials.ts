import * as THREE from 'three';
import type { Region } from '../data/stations';

export type PaletteMode = 'light' | 'dark';

export const palette = {
  stage: '#f5f5f7',
  stageDark: '#0a0a0c',
  text: '#1d1d1f',
  accent: '#0071e3',
  secondary: '#0066cc',
  steel: '#6e6e73',
  led: '#41d8ff',
};

export type MaterialSet = {
  aluminum: THREE.MeshPhysicalMaterial;
  polymer: THREE.MeshPhysicalMaterial;
  visor: THREE.MeshPhysicalMaterial;
  led: THREE.MeshStandardMaterial;
  logo: THREE.MeshPhysicalMaterial;
};

export function buildMaterials(): MaterialSet {
  // Brushed aluminum shells (URDF material "white").
  // NOTE: no roughnessMap / anisotropy — the URDF meshes carry no UVs, so any
  // texture sampling is undefined. Brushed feel comes from roughness + env.
  const aluminum = new THREE.MeshPhysicalMaterial({
    name: 'aluminum',
    color: new THREE.Color('#b4b7bf'),
    metalness: 0.9,
    roughness: 0.38,
    envMapIntensity: 0.65,
  });

  // Dark anodized / polymer joint housings (URDF material "dark")
  const polymer = new THREE.MeshPhysicalMaterial({
    name: 'polymer',
    color: new THREE.Color('#2e2e33'),
    metalness: 0.4,
    roughness: 0.5,
    clearcoat: 0.3,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.7,
  });

  // Head: dark glass helmet, near-black, glossy
  const visor = new THREE.MeshPhysicalMaterial({
    name: 'visor',
    color: new THREE.Color('#08080a'),
    metalness: 0.85,
    roughness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.2,
  });

  // LED strip on the face. HDR emissive so bloom threshold picks it alone.
  const led = new THREE.MeshStandardMaterial({
    name: 'led',
    color: new THREE.Color('#000000'),
    emissive: new THREE.Color(palette.led),
    emissiveIntensity: 4.0,
    toneMapped: true,
  });

  // Chest logo: close to the shell tone so it reads as subtle embossing,
  // not a branding focal point.
  const logo = new THREE.MeshPhysicalMaterial({
    name: 'logo',
    color: new THREE.Color('#a6a9b1'),
    metalness: 0.9,
    roughness: 0.42,
    envMapIntensity: 0.6,
  });

  return { aluminum, polymer, visor, led, logo };
}

// Which GLB nodes belong to each station region. Node names = URDF link names.
export const regionMatchers: Record<Region, (n: string) => boolean> = {
  brain: (n) => n === 'head_link',
  eyes: (n) => n === 'face_led',
  face: (n) => n === 'head_link' || n === 'face_led',
  jaw: (n) => n === 'head_link',
  spine: (n) => n.startsWith('waist_') || n.startsWith('torso_link'),
  arms: (n) => /shoulder|elbow|wrist/.test(n),
  core: (n) => n.startsWith('pelvis') || n.startsWith('logo_link'),
  legs: (n) => /hip|knee|ankle/.test(n),
};

export function nodesForRegion(region: Region, names: string[]): Set<string> {
  const match = regionMatchers[region];
  return new Set(names.filter(match));
}
