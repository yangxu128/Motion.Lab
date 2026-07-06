'use client';
import { useEffect, useRef } from 'react';
import styles from './paris-cafe.module.css';

// Canvas 雨滴效果
function useRainCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let drops: Array<{
      x: number; y: number;
      len: number; speed: number;
      vx: number; vy: number;
      a: number; w: number;
    }> = [];
    let w = 0, h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      w = rect.width;
      h = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    // 初始化雨滴
    const N = 140;
    for (let i = 0; i < N; i++) {
      drops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        len: 8 + Math.random() * 18,
        speed: 6 + Math.random() * 8,
        vx: -1.2 - Math.random() * 0.8,
        vy: 6 + Math.random() * 6,
        a: 0.15 + Math.random() * 0.35,
        w: 0.5 + Math.random() * 1,
      });
    }

    // 地面积水涟漪
    type Ripple = { x: number; y: number; r: number; max: number; speed: number };
    let ripples: Ripple[] = [];
    let rippleTimer = 0;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // 绘制雨滴（斜线）
      ctx.lineCap = 'round';
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.y > h || d.x < -20) {
          d.x = w + Math.random() * 30;
          d.y = -20;
        }
        const grad = ctx.createLinearGradient(d.x, d.y, d.x + d.vx * d.len, d.y + d.vy * d.len);
        grad.addColorStop(0, `rgba(220, 230, 245, 0)`);
        grad.addColorStop(0.5, `rgba(220, 230, 245, ${d.a})`);
        grad.addColorStop(1, `rgba(220, 230, 245, ${d.a * 0.3})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = d.w;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.vx * d.len / 4, d.y + d.vy * d.len / 4);
        ctx.stroke();
      }

      // 积水涟漪（仅下半部分）
      rippleTimer++;
      if (rippleTimer % 8 === 0) {
        ripples.push({
          x: Math.random() * w,
          y: h * 0.55 + Math.random() * h * 0.4,
          r: 0,
          max: 8 + Math.random() * 12,
          speed: 0.3 + Math.random() * 0.2,
        });
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += rp.speed;
        if (rp.r > rp.max) {
          ripples.splice(i, 1);
          continue;
        }
        const alpha = (1 - rp.r / rp.max) * 0.4;
        ctx.strokeStyle = `rgba(220, 230, 245, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [ref]);
}

const MENU = [
  { n: 'Steak Frites', d: 'Grass-fed, cooked medium-rare, with herb butter', p: '€28', cat: 'Mains' },
  { n: 'Coq au Vin', d: 'Braised in red wine for 6 hours, with mushrooms', p: '€24', cat: 'Mains' },
  { n: 'Bouillabaisse', d: 'Provençal fish stew with saffron rouille', p: '€32', cat: 'Mains' },
  { n: 'Crème Brûlée', d: 'Madagascar vanilla, torched tableside', p: '€9', cat: 'Desserts' },
  { n: 'Tarte Tatin', d: 'Caramelized apple, crème fraîche', p: '€10', cat: 'Desserts' },
  { n: 'Mille-feuille', d: 'Custard cream, caramelized puff pastry', p: '€11', cat: 'Desserts' },
];

const REVIEWS = [
  { n: 'Marie L.', r: '★★★★★', t: 'Like stepping into a Renoir painting. The warm light against the rain is unforgettable.', y: '2026' },
  { n: 'Thomas B.', r: '★★★★★', t: 'The coq au vin is worth the trip alone. Service is impossibly charming.', y: '2026' },
  { n: 'Yuki S.', r: '★★★★☆', t: 'Authentique. No music, no rush, just butter and wine.', y: '2025' },
];

const STATS = [
  { n: '1953', l: 'FOUNDED' },
  { n: '★★★', l: 'MICHELIN' },
  { n: '40+', l: 'WINES' },
  { n: '6pm', l: 'OPEN' },
];

export default function ParisCafe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useRainCanvas(canvasRef);

  return (
    <div className={styles.page}>
      {/* 印象派油画背景（真实画作 + Ken Burns + 暖色光晕 + 路灯） */}
      <div className={styles.bg}>
        <div className={styles.bgPainting} />
        <div className={styles.bgWarmGlow} />
        <div className={styles.bgLampA} />
        <div className={styles.bgLampB} />
        <div className={styles.bgLampC} />
        {/* 笔触 overlay */}
        <div className={styles.brushOverlay} aria-hidden />
        {/* 画框暗角 */}
        <div className={styles.vignette} aria-hidden />
        {/* 雨滴 canvas */}
        <canvas ref={canvasRef} className={styles.rainCanvas} />
        {/* 顶部暗化 */}
        <div className={styles.topShade} aria-hidden />
      </div>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>B</span>
          <div>
            <div className={styles.brandName}>Bistrot Lumière</div>
            <div className={styles.brandSub}>depuis 1953 · Paris</div>
          </div>
        </div>
        <div className={styles.navLinks}>
          <button type="button">Menu</button>
          <button type="button">Wine</button>
          <button type="button">Story</button>
          <button type="button">Visit</button>
        </div>
        <button className={styles.navCta}>Reserve a table</button>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroKicker}>★ est. 1953 · Montmartre</div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine} data-a>A little</span>
            <span className={styles.heroLine} data-b><em>Paris</em></span>
            <span className={styles.heroLine} data-c>on every plate.</span>
          </h1>
          <p className={styles.heroLede}>
            A family bistro, warmed by butter and candlelight. Open since before your grandfather was born. Still the same menu.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnPrimary}>Reserve for tonight →</button>
            <button className={styles.btnGhost}>View menu</button>
          </div>
        </div>

        {/* 玻璃预订卡 */}
        <div className={styles.reserveCard}>
          <div className={styles.reserveKicker}>— Tonight</div>
          <div className={styles.reserveRow}>
            <div className={styles.reserveCell}>
              <div className={styles.reserveLabel}>Time</div>
              <div className={styles.reserveValue}>19:30</div>
            </div>
            <div className={styles.reserveCell}>
              <div className={styles.reserveLabel}>Guests</div>
              <div className={styles.reserveValue}>2 people</div>
            </div>
          </div>
          <div className={styles.reserveNote}>
            <span>★</span> Last table left for 19:30
          </div>
          <button className={styles.reserveBtn}>Confirm reservation</button>
        </div>
      </section>

      {/* STATS */}
      <section className={styles.stats}>
        {STATS.map((s) => (
          <div key={s.l} className={styles.stat}>
            <div className={styles.statN}>{s.n}</div>
            <div className={styles.statL}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* MENU */}
      <section className={styles.menuSection}>
        <div className={styles.menuHead}>
          <div className={styles.menuKicker}>— LA CARTE</div>
          <h2 className={styles.menuTitle}>
            A menu<br />that <em>never changes.</em>
          </h2>
          <p className={styles.menuLede}>
            "Why fix what is perfect?" — Chef Bernard, 1987.
          </p>
        </div>
        <div className={styles.menuGrid}>
          {MENU.map((m, i) => (
            <div key={m.n} className={styles.menuItem} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={styles.menuItemHead}>
                <div>
                  <div className={styles.menuItemCat}>{m.cat}</div>
                  <div className={styles.menuItemN}>{m.n}</div>
                </div>
                <div className={styles.menuItemP}>{m.p}</div>
              </div>
              <div className={styles.menuItemD}>{m.d}</div>
              <div className={styles.menuItemLine} />
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className={styles.reviews}>
        <div className={styles.reviewsHead}>
          <div className={styles.reviewsKicker}>— TÊTE-À-TÊTE</div>
          <h2 className={styles.reviewsTitle}>What they say.</h2>
        </div>
        <div className={styles.reviewsGrid}>
          {REVIEWS.map((r) => (
            <div key={r.n} className={styles.review}>
              <div className={styles.reviewRate}>{r.r}</div>
              <p className={styles.reviewT}>"{r.t}"</p>
              <div className={styles.reviewFoot}>
                <span className={styles.reviewN}>{r.n}</span>
                <span className={styles.reviewY}>{r.y}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          <span>Come in from</span>
          <span><em>the rain.</em></span>
        </h2>
        <p className={styles.ctaLede}>
          14 rue des Abbesses, 75018 Paris · Open Tuesday — Sunday, 18:00 — 23:00
        </p>
        <button className={styles.ctaBtn}>Reserve a table →</button>
      </section>

      <footer className={styles.foot}>
        <div>★ Bistrot Lumière · 1953</div>
        <div>Au revoir, et à bientôt.</div>
        <div>© 2026</div>
      </footer>
    </div>
  );
}
