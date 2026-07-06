'use client';
import { useEffect, useRef } from 'react';
import styles from './misty-forest.module.css';

// Canvas 雾气粒子系统 —— 模拟山间晨雾/尘埃
function useMistCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let particles: Array<{
      x: number; y: number;
      vx: number; vy: number;
      r: number; a: number;
      life: number; maxLife: number;
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

    // 初始化粒子
    const N = 60;
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.05 - Math.random() * 0.15,
        r: 1 + Math.random() * 2.5,
        a: 0.08 + Math.random() * 0.18,
        life: 0,
        maxLife: 400 + Math.random() * 400,
      });
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin((p.life + i) * 0.01) * 0.1;
        p.y += p.vy;
        p.life++;
        // 渐入渐出
        const lifeRatio = p.life / p.maxLife;
        const alpha = p.a * Math.sin(lifeRatio * Math.PI);

        // 雾点
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `rgba(200, 220, 230, ${alpha})`);
        grad.addColorStop(1, 'rgba(200, 220, 230, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        // 循环
        if (p.life > p.maxLife || p.y < -10) {
          p.x = Math.random() * w;
          p.y = h + 10;
          p.life = 0;
          p.maxLife = 400 + Math.random() * 400;
        }
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

const ROOMS = [
  { n: 'Evergreen Cabin', p: '$289', img: 'linear-gradient(135deg, #0d3a2e 0%, #1a4d3a 50%, #0a1a14 100%)', tag: '★ 4.9' },
  { n: 'Pine Family Lodge', p: '$359', img: 'linear-gradient(135deg, #0a1a2e 0%, #1a3a4d 50%, #050a14 100%)', tag: '★ 4.7' },
  { n: 'Misty Mountain Hut', p: '$229', img: 'linear-gradient(135deg, #1a2e0d 0%, #3a4d1a 50%, #0a1405 100%)', tag: '★ 4.8' },
  { n: 'Lakeside Retreat', p: '$419', img: 'linear-gradient(135deg, #0d2e1a 0%, #1a4d3a 50%, #05140a 100%)', tag: '★ 5.0' },
];

const STATS = [
  { n: '1,800+', l: 'STAYS' },
  { n: '4.8', l: 'RATING' },
  { n: '24', l: 'CABINS' },
  { n: '12', l: 'LOCATIONS' },
];

export default function MistyForest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMistCanvas(canvasRef);

  return (
    <div className={styles.page}>
      {/* KEN BURNS 背景层 —— 多层径向渐变慢慢呼吸 */}
      <div className={styles.bg}>
        <div className={styles.bgLayer1} />
        <div className={styles.bgLayer2} />
        <div className={styles.bgLayer3} />
        {/* 树影 SVG 剪影 */}
        <svg className={styles.treeSilhouette} viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden>
          <path d="M0,400 L0,200 L50,80 L80,120 L120,40 L160,100 L200,60 L240,140 L300,20 L360,120 L400,60 L440,140 L500,30 L560,100 L620,50 L680,130 L740,70 L800,120 L800,400 Z" fill="rgba(0,0,0,0.55)" />
          <path d="M0,400 L0,260 L60,200 L120,260 L200,180 L280,260 L360,200 L440,260 L520,180 L600,260 L680,200 L800,260 L800,400 Z" fill="rgba(0,0,0,0.7)" />
        </svg>
        {/* 小屋光晕 */}
        <div className={styles.cabinGlow} />
        {/* Canvas 雾粒 */}
        <canvas ref={canvasRef} className={styles.mistCanvas} />
        {/* 渐变蒙版压暗 */}
        <div className={styles.bgVignette} />
        <div className={styles.bgGradient} />
      </div>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🌲</span>
          <span className={styles.brandName}>WoodNest</span>
        </div>
        <div className={styles.navLinks}>
          <button type="button">Locations</button>
          <button type="button">Rooms</button>
          <button type="button">Experiences</button>
          <button type="button">Contact</button>
        </div>
        <button className={styles.navCta}>Book Now</button>
      </nav>

      {/* HERO + BOOKING */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine} data-a>Nature's</span>
            <span className={styles.heroLine} data-b>Perfect</span>
            <span className={styles.heroLine} data-c>Hideaways</span>
          </h1>
          <p className={styles.heroLede}>
            Discover handpicked luxury cabins in breathtaking locations. Unplug, unwind, and reconnect with what matters most.
          </p>
          <div className={styles.heroRating}>
            <span className={styles.heroStar}>★</span>
            <span className={styles.heroRate}>4.8</span>
            <span className={styles.heroCount}>from 1,800+ stays</span>
          </div>
        </div>

        {/* 预订卡片 */}
        <div className={styles.bookingCard}>
          <div className={styles.bookingHead}>
            <div>
              <h3 className={styles.bookingTitle}>Evergreen</h3>
              <h3 className={styles.bookingTitle}>Pine Family Lodge</h3>
            </div>
            <button className={styles.bookingEdit} aria-label="edit">✎</button>
          </div>
          <div className={styles.bookingRow}>
            <div className={styles.bookingCell}>
              <div className={styles.bookingLabel}>
                <span>📅</span> Check-in
              </div>
              <div className={styles.bookingValue}>Feb 11</div>
              <div className={styles.bookingSub}>After 2:00 PM</div>
            </div>
            <div className={styles.bookingCell} data-divider>
              <div className={styles.bookingLabel}>
                <span>📅</span> Check-out
              </div>
              <div className={styles.bookingValue}>Mar 25</div>
              <div className={styles.bookingSub}>Until 12:00 PM</div>
            </div>
          </div>
          <div className={styles.bookingPriceRow}>
            <div>
              <div className={styles.bookingPrice}>$359<span>/night</span></div>
              <div className={styles.bookingGuests}>2-5 guests</div>
            </div>
          </div>
          <button className={styles.bookingBtn}>Reserve</button>
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

      {/* ROOMS */}
      <section className={styles.rooms}>
        <div className={styles.roomsHead}>
          <div className={styles.roomsKicker}>— STAY</div>
          <h2 className={styles.roomsTitle}>Choose your<br />perfect cabin.</h2>
        </div>
        <div className={styles.roomsGrid}>
          {ROOMS.map((r, i) => (
            <article key={r.n} className={styles.room} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.roomImg} style={{ background: r.img }}>
                <div className={styles.roomImgOverlay} />
                <div className={styles.roomTag}>{r.tag}</div>
                <div className={styles.roomWindow} />
              </div>
              <div className={styles.roomBody}>
                <div className={styles.roomN}>{r.n}</div>
                <div className={styles.roomFoot}>
                  <div className={styles.roomP}>{r.p}<span>/night</span></div>
                  <button className={styles.roomBtn}>View →</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className={styles.exp}>
        <div className={styles.expLeft}>
          <div className={styles.expKicker}>— EXPERIENCE</div>
          <h2 className={styles.expTitle}>Where silence<br />becomes luxury.</h2>
          <p className={styles.expLede}>
            No WiFi. No traffic. No notifications. Just the crackle of a fireplace, the whisper of pine, and a sky full of stars.
          </p>
          <div className={styles.expList}>
            <div className={styles.expItem}>
              <span className={styles.expIcon}>🔥</span>
              <div>
                <div className={styles.expItemT}>Wood-fired sauna</div>
                <div className={styles.expItemD}>Every cabin has its own.</div>
              </div>
            </div>
            <div className={styles.expItem}>
              <span className={styles.expIcon}>🌌</span>
              <div>
                <div className={styles.expItemT}>Stargazing deck</div>
                <div className={styles.expItemD}>Zero light pollution, 360° sky.</div>
              </div>
            </div>
            <div className={styles.expItem}>
              <span className={styles.expIcon}>🥾</span>
              <div>
                <div className={styles.expItemT}>Forest trails</div>
                <div className={styles.expItemD}>From your door to the ridge.</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.expRight}>
          <div className={styles.expVisual}>
            <div className={styles.expVisualBg} />
            <div className={styles.expMoon} />
            <div className={styles.expStars}>
              {Array.from({ length: 30 }).map((_, i) => (
                <span
                  key={i}
                  className={styles.star}
                  style={{
                    left: `${(i * 37) % 100}%`,
                    top: `${(i * 53) % 100}%`,
                    animationDelay: `${(i * 0.13) % 3}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Find your<br /><em>hideaway.</em></h2>
        <button className={styles.ctaBtn}>Browse all cabins →</button>
      </section>

      <footer className={styles.foot}>
        <div>🌲 WoodNest · est. 2018</div>
        <div>Quietly tucked in 12 countries</div>
        <div>© 2026</div>
      </footer>
    </div>
  );
}
