'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Hero.module.css';
export function Hero() {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll('[data-char]');
    gsap.from(chars, { y: 100, opacity: 0, stagger: 0.04, duration: 1.2, ease: 'power4.out' });
  }, []);
  const text = '动效实验室';
  return (
    <section className={styles.hero}>
      <div className={styles.kicker}>Motion.Lab · 2026</div>
      <h1 ref={ref} className={styles.title}>
        {text.split('').map((c, i) => <span key={i} data-char>{c === ' ' ? '\u00A0' : c}</span>)}
      </h1>
      <p className={styles.subtitle}>40 个精选动效,可调参数,可复制代码。<br />为中文开发者打造的动效参考站。</p>
    </section>
  );
}
