'use client';
import { useEffect } from 'react';
import styles from './velorah.module.css';

const NAV = ['Home', 'Studio', 'About', 'Journal', 'Reach Us'];

export default function Velorah() {
  // 注入 Google Fonts（Instrument Serif + Inter），仅本模板作用域
  useEffect(() => {
    const id1 = 'velorah-preconnect';
    const id2 = 'velorah-fonts';
    if (!document.getElementById(id1)) {
      const pre1 = document.createElement('link');
      pre1.id = id1;
      pre1.rel = 'preconnect';
      pre1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(pre1);
      const pre2 = document.createElement('link');
      pre2.id = id1 + '-2';
      pre2.rel = 'preconnect';
      pre2.href = 'https://fonts.gstatic.com';
      pre2.crossOrigin = 'anonymous';
      document.head.appendChild(pre2);
    }
    if (!document.getElementById(id2)) {
      const link = document.createElement('link');
      link.id = id2;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className={styles.page}>
      {/* 全屏循环视频背景 */}
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
      />

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          Velorah<sup className={styles.logoR}>®</sup>
        </div>
        <ul className={styles.navLinks}>
          {NAV.map((label, i) => (
            <li
              key={label}
              className={i === 0 ? styles.navLinkActive : styles.navLink}
            >
              {label}
            </li>
          ))}
        </ul>
        <button className={`${styles.liquidGlass} ${styles.navCta}`}>
          Begin Journey
        </button>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <h1 className={`${styles.h1} ${styles.fadeRise}`}>
          Where <em className={styles.dim}>dreams</em> rise{' '}
          <em className={styles.dim}>through the silence.</em>
        </h1>
        <p className={`${styles.subtext} ${styles.fadeRiseDelay}`}>
          We&apos;re designing tools for deep thinkers, bold creators, and quiet
          rebels. Amid the chaos, we build digital spaces for sharp focus and
          inspired work.
        </p>
        <button className={`${styles.liquidGlass} ${styles.heroCta} ${styles.fadeRiseDelay2}`}>
          Begin Journey
        </button>
      </section>
    </div>
  );
}
