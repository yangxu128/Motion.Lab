'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './gsap-stagger.module.css';
export default function GsapStagger({ params }: { params: { stagger: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let tl: any = null;
    (async () => {
      const gsapMod = await import('gsap');
      if (cancelled || !ref.current) return;
      const gsap = gsapMod.default;
      const items = ref.current.querySelectorAll('[data-item]');
      tl = gsap.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: params.stagger, repeat: -1, repeatDelay: 1 });
    })();
    return () => {
      cancelled = true;
      if (tl) tl.kill();
    };
  }, [params.stagger]);
  return (
    <PreviewFrame>
      <div ref={ref} className={styles.container}>
        <div data-item className={styles.item}>A</div><div data-item className={styles.item}>B</div><div data-item className={styles.item}>C</div><div data-item className={styles.item}>D</div><div data-item className={styles.item}>E</div>
      </div>
    </PreviewFrame>
  );
}
