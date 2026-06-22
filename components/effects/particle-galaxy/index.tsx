'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '@/lib/use-three-scene';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './particle-galaxy.module.css';
export default function ParticleGalaxy({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useThreeScene(
    ref,
    ({ scene }) => {
      const positions = new Float32Array(params.count * 3);
      const colors = new Float32Array(params.count * 3);
      for (let i = 0; i < params.count; i++) {
        const r = Math.random() * 5;
        const a = i * 0.3;
        positions[i * 3] = Math.cos(a) * r;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 2] = Math.sin(a) * r;
        const hue = i / params.count;
        colors[i * 3] = hue;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 1;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.9 });
      const points = new THREE.Points(geometry, material);
      scene.add(points);
      return {
        onTick: () => { points.rotation.y += 0.002; },
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
