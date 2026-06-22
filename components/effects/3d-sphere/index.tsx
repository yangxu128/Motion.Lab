'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '@/lib/use-three-scene';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './3d-sphere.module.css';

export default function _3dSphere({ params }: { params: { detail: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useThreeScene(
    ref,
    ({ scene }) => {
      const geometry = new THREE.IcosahedronGeometry(1.5, params.detail);
      const material = new THREE.MeshBasicMaterial({ color: 0xaa66ff, wireframe: true, transparent: true, opacity: 0.95 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return {
        onTick: () => {
          mesh.rotation.y += 0.005;
          mesh.rotation.x += 0.002;
        },
        cleanup: () => { geometry.dispose(); material.dispose(); },
      };
    },
    { pauseOffscreen: false },
    [params.detail]
  );
  return (
    <PreviewFrame category="advanced">
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
