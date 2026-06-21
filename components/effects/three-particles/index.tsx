'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './three-particles.module.css';

export default function ThreeParticles({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;

    const renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;

    const positions = new Float32Array(params.count * 3);
    for (let i = 0; i < params.count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
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

    const resize = () => {
      const w = c.offsetWidth;
      const h = c.offsetHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const tick = () => {
      points.rotation.y += 0.002;
      points.rotation.x += 0.0008;
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
