'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './gsap-scrollTrigger.module.css';

export default function GsapScrollTrigger({ params }: { params: { distance: number } }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let st: { getAll: () => Array<{ kill: () => void }> } | null = null;

    (async () => {
      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      st = ScrollTrigger;
      if (!targetRef.current) return;
      gsap.to(targetRef.current, {
        x: params.distance,
        rotation: params.distance / 4,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    })();

    return () => {
      cancelled = true;
      if (st) st.getAll().forEach((t) => t.kill());
    };
  }, [params.distance]);

  return (
    <PreviewFrame>
      <div ref={containerRef} className={styles.scroller}>
        <div className={styles.spacer} />
        <div ref={targetRef} className={styles.target}>SCROLL ↓</div>
        <div className={styles.spacer} />
      </div>
    </PreviewFrame>
  );
}
