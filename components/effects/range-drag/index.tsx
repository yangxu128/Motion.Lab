'use client';
import { useEffect, useRef, useState } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './range-drag.module.css';
export default function RangeDrag({ params }: { params: { max: number } }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const valRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [, force] = useState(0);
  useEffect(() => {
    const update = (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const r = track.getBoundingClientRect();
      let pct = (clientX - r.left) / r.width;
      pct = Math.max(0, Math.min(1, pct));
      if (fillRef.current) fillRef.current.style.width = (pct * 100) + '%';
      if (knobRef.current) knobRef.current.style.left = (pct * 100) + '%';
      if (valRef.current) valRef.current.textContent = String(Math.round(pct * params.max));
    };
    const onDown = (e: MouseEvent) => { dragging.current = true; update(e.clientX); force((v) => v + 1); };
    const onMove = (e: MouseEvent) => { if (dragging.current) update(e.clientX); };
    const onUp = () => { dragging.current = false; };
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      track.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [params.max]);
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={trackRef} className={styles.track}>
          <div ref={fillRef} className={styles.fill} />
          <div ref={knobRef} className={styles.knob} />
        </div>
        <div ref={valRef} className={styles.val}>0</div>
      </div>
    </PreviewFrame>
  );
}
