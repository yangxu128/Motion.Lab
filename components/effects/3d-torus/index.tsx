'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '@/lib/use-three-scene';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './3d-torus.module.css';
export default function _3dTorus({ params }: { params: { duration: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useThreeScene(
    ref,
    ({ scene }) => {
      const geometry = new THREE.TorusGeometry(1.2, 0.4, 16, 60);
      const material = new THREE.MeshNormalMaterial();
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      const speed = 1 / Math.max(0.1, params.duration) * 30;
      return {
        onTick: () => {
          mesh.rotation.x += 0.01 * speed;
          mesh.rotation.y += 0.006 * speed;
        },
        cleanup: () => { geometry.dispose(); material.dispose(); },
      };
    },
    { pauseOffscreen: false },
    [params.duration]
  );
  return (
    <PreviewFrame category="advanced">
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
