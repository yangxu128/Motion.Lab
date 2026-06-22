'use client';
import { useEffect, useRef } from 'react';
import styles from './landing.module.css';

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.visible);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    let raf = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            const t0 = performance.now();
            const tick = (now: number) => {
              const k = Math.min(1, (now - t0) / duration);
              const eased = 1 - Math.pow(1 - k, 3);
              el.textContent = Math.floor(eased * target).toLocaleString();
              if (k < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => { cancelAnimationFrame(raf); obs.disconnect(); };
  }, [target, duration]);
  return ref;
}

export default function Landing() {
  const featuresRef = useReveal<HTMLDivElement>();
  const statsRef = useReveal<HTMLDivElement>();
  const ctaRef = useReveal<HTMLDivElement>();
  const countA = useCountUp(12800);
  const countB = useCountUp(320);
  const countC = useCountUp(99.9, 1200);
  const countD = useCountUp(48);

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.blobA} aria-hidden />
        <div className={styles.blobB} aria-hidden />
        <div className={styles.heroInner}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>新版 v2.0 来了</span>
          </div>
          <h1 className={styles.title}>
            <span className={styles.titleLine}>用动效让产品</span>
            <span className={styles.titleAccent}>活 起来</span>
          </h1>
          <p className={styles.lede}>
            一套为现代 Web 设计的高质量动效库。性能优先、易于集成、可被 AI 智能体调用。
          </p>
          <div className={styles.ctaRow}>
            <button className={styles.ctaPrimary}>
              <span>立即开始</span>
              <span className={styles.ctaArrow}>→</span>
            </button>
            <button className={styles.ctaGhost}>查看文档</button>
          </div>
        </div>
        <div className={styles.scrollHint} aria-hidden>
          <span>scroll</span>
          <span className={styles.scrollLine} />
        </div>
      </section>

      {/* MARQUEE */}
      <section className={styles.marqueeSection}>
        <div className={styles.marquee}>
          <div className={styles.marqueeInner}>
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className={styles.marqueeGroup} aria-hidden={dup === 1}>
                {['Acme', 'Globex', 'Initech', 'Soylent', 'Umbrella', 'Hooli', 'Vandelay', 'Cyberdyne'].map((n) => (
                  <span key={n} className={styles.marqueeItem}>{n}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features} ref={featuresRef}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionKicker}>核心特性</span>
          <h2 className={styles.sectionTitle}>一切为了更好的体验</h2>
        </div>
        <div className={styles.featureGrid}>
          {[
            { t: '极致性能', d: '60FPS 流畅体验，GPU 加速，离屏自动暂停', icon: '⚡' },
            { t: '零依赖', d: '纯 CSS + 轻量 JS，无任何外部依赖', icon: '✦' },
            { t: '可定制', d: '所有参数可通过 props 调整，主题化友好', icon: '⚙' },
            { t: 'AI 友好', d: '可通过 SKILL.md 被 AI 智能体直接调用', icon: '◈' },
          ].map((f) => (
            <div key={f.t} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.t}</h3>
              <p className={styles.featureDesc}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className={styles.stats} ref={statsRef}>
        <div className={styles.statCard}>
          <div className={styles.statValue}><span ref={countA}>0</span><span className={styles.statSuffix}>+</span></div>
          <div className={styles.statLabel}>活跃用户</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}><span ref={countB}>0</span></div>
          <div className={styles.statLabel}>企业客户</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}><span ref={countC}>0</span><span className={styles.statSuffix}>%</span></div>
          <div className={styles.statLabel}>运行时间</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}><span ref={countD}>0</span><span className={styles.statSuffix}>h</span></div>
          <div className={styles.statLabel}>快速响应</div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta} ref={ctaRef}>
        <h2 className={styles.ctaTitle}>准备好开始了吗？</h2>
        <p className={styles.ctaLede}>免费试用 14 天，无需信用卡。</p>
        <button className={styles.ctaPrimary}>
          <span>免费试用</span>
          <span className={styles.ctaArrow}>→</span>
        </button>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <span>© 2026 Motion.Lab · Made with care</span>
      </footer>
    </div>
  );
}
