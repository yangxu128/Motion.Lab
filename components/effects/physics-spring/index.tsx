'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './physics-spring.module.css';
export default function PhysicsSpring({ params }: { params: { stiffness: number; damping: number } }) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const zone = zoneRef.current;
    const ball = ballRef.current;
    if (!zone || !ball) return;
    let px = zone.offsetWidth / 2 - 24;
    let py = zone.offsetHeight / 2 - 24;
    let vx = 0, vy = 0;
    let dragging = false;
    let offX = 0, offY = 0;
    const cx = () => zone.offsetWidth / 2 - 24;
    const cy = () => zone.offsetHeight / 2 - 24;
    const onDown = (e: MouseEvent) => {
      dragging = true;
      const r = ball.getBoundingClientRect();
      offX = e.clientX - (r.left + 24);
      offY = e.clientY - (r.top + 24);
    };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const r = zone.getBoundingClientRect();
      px = e.clientX - r.left - offX;
      py = e.clientY - r.top - offY;
    };
    const onUp = () => { dragging = false; };
    ball.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    let raf = 0;
    const tick = () => {
      if (!dragging) {
        const dx = cx() - px;
        const dy = cy() - py;
        vx += dx * params.stiffness;
        vy += dy * params.stiffness;
        vx *= params.damping;
        vy *= params.damping;
        px += vx;
        py += vy;
      }
      ball.style.left = px + 'px';
      ball.style.top = py + 'px';
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      ball.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [params.stiffness, params.damping]);
  return (
    <PreviewFrame>
      <div ref={zoneRef} className={styles.zone}>
        <div ref={ballRef} className={styles.ball} />
      </div>
    </PreviewFrame>
  );
}
