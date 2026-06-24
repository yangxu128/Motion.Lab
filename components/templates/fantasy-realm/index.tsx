'use client';
import { useEffect, useRef } from 'react';
import styles from './fantasy-realm.module.css';

const SECTIONS = [
  {
    kicker: '— THE MEADOW',
    title: 'Where the wildflowers',
    titleEm: 'never fade.',
    body:
      'An illustrated world that breathes. Built for children\u2019s books, meditation apps, and dreamy brand sites.',
  },
  {
    kicker: '— THE BUBBLES',
    title: 'Dreams float in',
    titleEm: 'the morning light.',
    body:
      'Animated soap bubbles drift across the page. Hover one and watch it pop with a soft chime of color.',
  },
  {
    kicker: '— THE TRAIL',
    title: 'Follow the river',
    titleEm: 'to the mountain.',
    body:
      'Three hand-drawn locations, twenty-eight pages, one small fox. A storybook made of pure CSS motion.',
  },
];

const CARDS = [
  { e: '\u2728', n: 'Hollowfern Glade', d: 'Where the fireflies sleep during the day.', c: '#ffd86b' },
  { e: '\u{1F338}', n: 'Cherrywind Path', d: 'A pink trail that hums in May.', c: '#ff7ab2' },
  { e: '\u{1F41F}', n: 'Lakeshrine Cove', d: 'Three small islands, one big secret.', c: '#7ad7ff' },
];

export default function FantasyRealm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 飘动气泡（叠加在视频上，模拟图中泡泡）
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let dpr = window.devicePixelRatio || 1;
    let w = 0, h = 0;
    type Bubble = { x: number; y: number; r: number; vy: number; drift: number; phase: number; a: number; hue: number; gradInner: string; gradMid: string; gradEdge: string; gradZero: string; stroke: string; highlight: string };
    let bubbles: Bubble[] = [];
    const N = 18;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      w = rect.width;
      h = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const seed = () => {
      bubbles = [];
      for (let i = 0; i < N; i++) {
        const hue = 200 + Math.random() * 40;
        const a = 0.12 + Math.random() * 0.18;
        // 预编译 hsla 字符串，避免每帧字符串拼接（每帧 18 × 4 = 72 次拼接受不了）
        bubbles.push({
          x: Math.random() * w,
          y: h + Math.random() * h * 0.4,
          r: 14 + Math.random() * 28,
          vy: 0.25 + Math.random() * 0.4,
          drift: 0.3 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          a,
          hue,
          gradInner: `hsla(${hue} 90% 92% / ${a * 1.2})`,
          gradMid: `hsla(${hue} 80% 80% / ${a * 0.6})`,
          gradEdge: `hsla(${hue} 60% 70% / ${a * 0.2})`,
          gradZero: `hsla(${hue} 60% 70% / 0)`,
          stroke: `hsla(0 0% 100% / ${a * 0.7})`,
          highlight: `hsla(0 0% 100% / ${a * 1.5})`,
        });
      }
    };
    seed();

    let t0 = performance.now();
    const tick = (t: number) => {
      const elapsed = (t - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const b of bubbles) {
        b.y -= b.vy;
        b.x += Math.sin(elapsed * 0.6 + b.phase) * b.drift;
        if (b.y < -b.r * 2) {
          b.y = h + b.r;
          b.x = Math.random() * w;
        }
        // 主体：透明玻璃球（用预编译字符串）
        const grad = ctx.createRadialGradient(
          b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1,
          b.x, b.y, b.r,
        );
        grad.addColorStop(0, b.gradInner);
        grad.addColorStop(0.4, b.gradMid);
        grad.addColorStop(0.85, b.gradEdge);
        grad.addColorStop(1, b.gradZero);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        // 描边
        ctx.strokeStyle = b.stroke;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
        // 高光小点
        ctx.fillStyle = b.highlight;
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 注入 Google Fonts（DM Serif Display + Quicksand）
  useEffect(() => {
    const id = 'fantasy-fonts';
    if (document.getElementById(id)) return;
    const pre1 = document.createElement('link');
    pre1.rel = 'preconnect';
    pre1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pre1);
    const pre2 = document.createElement('link');
    pre2.rel = 'preconnect';
    pre2.href = 'https://fonts.gstatic.com';
    pre2.crossOrigin = 'anonymous';
    document.head.appendChild(pre2);
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Quicksand:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <div className={styles.page}>
      {/* 视频背景（动起来的奇幻秘境） */}
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4"
      />
      {/* 顶部轻雾化（让 nav 文字更可读） */}
      <div className={styles.topMist} aria-hidden />
      {/* 底部轻雾化 */}
      <div className={styles.bottomMist} aria-hidden />
      {/* 飘动气泡 canvas */}
      <canvas ref={canvasRef} className={styles.bubbleCanvas} />

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>&#10024;</span>
          <span className={styles.brandName}>Faeloria</span>
        </div>
        <ul className={styles.navLinks}>
          <li className={styles.navLinkActive}>Story</li>
          <li className={styles.navLink}>Atlas</li>
          <li className={styles.navLink}>Shop</li>
          <li className={styles.navLink}>About</li>
        </ul>
        <button className={`${styles.liquidGlass} ${styles.navCta}`}>
          Begin a journey
        </button>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroKicker}>&#10024; a storybook that breathes</div>
        <h1 className={styles.heroTitle}>
          <span className={styles.fadeRise}>Welcome to the</span>
          <span className={`${styles.heroEm} ${styles.fadeRiseDelay}`}>wildflower meadow.</span>
        </h1>
        <p className={`${styles.heroBody} ${styles.fadeRiseDelay2}`}>
          A hand-drawn world for quiet dreamers. Petals drift, bubbles rise, and the
          river remembers your name.
        </p>
        <div className={`${styles.heroBtns} ${styles.fadeRiseDelay2}`}>
          <button className={`${styles.liquidGlass} ${styles.btnPrimary}`}>
            &#8594; Open the book
          </button>
          <button className={`${styles.liquidGlass} ${styles.btnGhost}`}>
            Watch trailer
          </button>
        </div>
      </section>

      {/* 滚动揭示的三段小故事 */}
      <section className={styles.storySection}>
        {SECTIONS.map((s, i) => (
          <article
            key={s.title}
            className={styles.story}
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className={styles.storyKicker}>{s.kicker}</div>
            <h2 className={styles.storyTitle}>
              {s.title}
              <br />
              <em className={styles.storyEm}>{s.titleEm}</em>
            </h2>
            <p className={styles.storyBody}>{s.body}</p>
          </article>
        ))}
      </section>

      {/* 卡片：3 个秘境地点 */}
      <section className={styles.cardsSection}>
        <div className={styles.cardsHead}>
          <div className={styles.cardsKicker}>&#8212; LOCATIONS</div>
          <h3 className={styles.cardsTitle}>Three small worlds.</h3>
        </div>
        <div className={styles.cardsGrid}>
          {CARDS.map((c, i) => (
            <div
              key={c.n}
              className={`${styles.liquidGlass} ${styles.card}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={styles.cardEmoji} style={{ color: c.c }}>{c.e}</div>
              <div className={styles.cardN}>{c.n}</div>
              <div className={styles.cardD}>{c.d}</div>
              <div className={styles.cardArrow}>&#8594;</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL */}
      <section className={styles.final}>
        <h2 className={styles.finalTitle}>
          <span>Close your eyes.</span>
          <em className={styles.finalEm}>Open the meadow.</em>
        </h2>
        <button className={`${styles.liquidGlass} ${styles.finalBtn}`}>
          &#10024; Begin the journey
        </button>
      </section>

      <footer className={styles.foot}>
        <div>&#10024; Faeloria &middot; est. 2026</div>
        <div>Made with petals and patience.</div>
        <div>&copy; 2026</div>
      </footer>
    </div>
  );
}
