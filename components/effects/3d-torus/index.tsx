'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './3d-torus.module.css';
export default function _3dTorus({ params }: { params: { duration: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;
    const geometry = new THREE.TorusGeometry(1.2, 0.4, 16, 60);
    const material = new THREE.MeshNormalMaterial();
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
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.006;
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
  }, [params.duration]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
