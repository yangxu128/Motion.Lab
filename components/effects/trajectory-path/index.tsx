'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './trajectory-path.module.css';
export default function TrajectoryPath({ params }: { params: { duration: number } }) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;
    const len = path.getTotalLength();
    let t = 0;
    let raf = 0;
    const tick = () => {
      t += 16 / (params.duration * 1000);
      if (t > 1) t = 0;
      const p = path.getPointAtLength(t * len);
      dot.setAttribute('cx', String(p.x));
      dot.setAttribute('cy', String(p.y));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [params.duration]);
  return (
    <PreviewFrame>
      <svg className={styles.svg} viewBox="0 0 200 100" preserveAspectRatio="none">
        <path ref={pathRef} d="M10,80 C40,10 70,90 100,40 S160,90 190,30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="4 4" />
        <circle ref={dotRef} r="5" fill="hsl(280 90% 60%)" cx="10" cy="80" />
      </svg>
    </PreviewFrame>
  );
}
