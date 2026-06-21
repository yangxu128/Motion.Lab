'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './3d-sphere.module.css';
export default function _3dSphere({ params }: { params: { detail: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;
    const geometry = new THREE.IcosahedronGeometry(1.5, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xaa66ff, wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
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
      mesh.rotation.y += 0.005;
      mesh.rotation.x += 0.002;
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
  }, [params.detail]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
