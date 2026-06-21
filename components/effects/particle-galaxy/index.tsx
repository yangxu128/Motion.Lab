'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './particle-galaxy.module.css';
export default function ParticleGalaxy({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;
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
    const resize = () => {
      const w = c.offsetWidth, h = c.offsetHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);
    let raf = 0;
    const tick = () => {
      points.rotation.y += 0.002;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [params.count]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
