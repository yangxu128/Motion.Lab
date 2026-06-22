'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '@/lib/use-three-scene';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './three-particles.module.css';

export default function ThreeParticles({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useThreeScene(
    ref,
    ({ scene }) => {
      const positions = new Float32Array(params.count * 3);
      for (let i = 0; i < params.count * 3; i++) positions[i] = (Math.random() - 0.5) * 10;
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: new THREE.Color('hsl(280, 90%, 60%)'),
        size: 0.05,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);
      return {
        onTick: () => {
          points.rotation.y += 0.002;
          points.rotation.x += 0.0008;
        },
        cleanup: () => { geometry.dispose(); material.dispose(); },
      };
    },
    { pauseOffscreen: false },
    [params.count]
  );
  return (
    <PreviewFrame category="advanced">
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
