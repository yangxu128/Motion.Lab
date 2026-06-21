'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './gsap-timeline.module.css';
export default function GsapTimeline({ params }: { params: { duration: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let tl: any = null;
    (async () => {
      const gsapMod = await import('gsap');
      if (cancelled || !ref.current) return;
      const gsap = gsapMod.default;
      const boxes = ref.current.querySelectorAll('[data-b]');
      tl = gsap.timeline({ repeat: -1 });
      tl.to(boxes[0], { x: 60, duration: params.duration / 4 })
        .to(boxes[1], { x: 60, duration: params.duration / 4 }, '<0.2')
        .to(boxes[2], { x: 60, duration: params.duration / 4 }, '<0.2')
        .to(boxes, { x: 0, duration: params.duration / 4 }, '+=0.3');
    })();
    return () => {
      cancelled = true;
      if (tl) tl.kill();
    };
  }, [params.duration]);
  return (
    <PreviewFrame>
      <div ref={ref} className={styles.container}>
        <div data-b className={styles.b1}>1</div><div data-b className={styles.b2}>2</div><div data-b className={styles.b3}>3</div>
      </div>
    </PreviewFrame>
  );
}
