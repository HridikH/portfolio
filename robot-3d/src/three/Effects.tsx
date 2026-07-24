import { EffectComposer, Bloom, N8AO, DepthOfField } from '@react-three/postprocessing';
import type { Tier } from './quality';
import * as THREE from 'three';

type Props = {
  tier: Tier;
  // world-space focus target for gentle DoF on close-ups; null disables
  focusTarget?: THREE.Vector3 | null;
  dofEnabled?: boolean;
};

// low tier renders without a composer at all (see caller).
export default function Effects({ tier, focusTarget, dofEnabled = false }: Props) {
  if (tier === 'low') return null;
  return (
    <EffectComposer multisampling={tier === 'high' ? 4 : 0}>
      <N8AO
        aoRadius={0.25}
        distanceFalloff={0.6}
        intensity={2.2}
        quality={tier === 'high' ? 'medium' : 'low'}
        halfRes={tier !== 'high'}
      />
      <Bloom
        mipmapBlur
        intensity={0.55}
        luminanceThreshold={1.05}
        luminanceSmoothing={0.2}
      />
      {tier === 'high' && dofEnabled && focusTarget ? (
        <DepthOfField target={focusTarget} bokehScale={2.2} focalLength={0.06} />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
