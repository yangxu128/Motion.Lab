'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './drag-rotate.module.css';
export default function DragRotate({ params }: { params: { sensitivity: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rx = -20, ry = 20, dragging = false, lx = 0, ly = 0;
    const onDown = (e: MouseEvent) => { dragging = true; lx = e.clientX; ly = e.clientY; };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      ry += (e.clientX - lx) * params.sensitivity;
      rx -= (e.clientY - ly) * params.sensitivity;
      lx = e.clientX; ly = e.clientY;
      el.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    };
    const onUp = () => { dragging = false; };
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    el.style.transform = 'perspective(600px) rotateX(-20deg) rotateY(20deg)';
    const cleanup = () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    return () => {
      cleanup();
    };
  }, [params.sensitivity]);
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['drag-rotate']}>DRAG</div>
        <span className={styles.hint}>Drag</span>
      </div>
    </PreviewFrame>
  );
}
