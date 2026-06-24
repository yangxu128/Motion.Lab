'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './premium-showcase.module.css';

const CATS = ['Mixed', 'Hero', 'Landing', '3D', 'SaaS', 'Agency', 'Web3', 'Portfolio'];

const SHOWCASE = [
  { n: '01', t: 'Aetheris Voyage', a: 'Hero', c: 'linear-gradient(135deg, #1a0033 0%, #4d00b3 50%, #ff0080 100%)', tag: 'Hero Section' },
  { n: '02', t: 'Layered Depth', a: 'Landing', c: 'linear-gradient(135deg, #001a4d 0%, #00b3ff 100%)', tag: 'Landing Page' },
  { n: '03', t: 'Prisma Studio', a: 'Landing', c: 'linear-gradient(135deg, #ffd83d 0%, #ff0080 50%, #5d00b3 100%)', tag: 'Landing Page' },
  { n: '04', t: '3D Collectible', a: '3D', c: 'linear-gradient(135deg, #2a1a4d 0%, #b34dff 100%)', tag: '3D Website' },
  { n: '05', t: 'Dreamcore', a: 'Landing', c: 'linear-gradient(135deg, #ffb0d0 0%, #d4b4ff 50%, #b0d4ff 100%)', tag: 'Landing Page' },
  { n: '06', t: 'Velorah', a: 'Agency', c: 'linear-gradient(135deg, #fafafa 0%, #e0e0e0 100%)', tag: 'Agency' },
  { n: '07', t: 'Aethera', a: 'Hero', c: 'linear-gradient(135deg, #4a4a4a 0%, #1a1a1a 100%)', tag: 'Hero Section' },
  { n: '08', t: 'Reveal Hero', a: 'Hero', c: 'linear-gradient(135deg, #001a1a 0%, #00b3b3 100%)', tag: 'Hero' },
  { n: '09', t: 'Cursor Follow', a: 'Hero', c: 'linear-gradient(135deg, #4d00b3 0%, #00b3ff 100%)', tag: 'Hero' },
  { n: '10', t: 'Web3 EOS', a: 'Web3', c: 'linear-gradient(135deg, #0a0a0a 0%, #1a4d1a 50%, #00ff8f 100%)', tag: 'Web3' },
  { n: '11', t: 'Growth SaaS', a: 'Hero', c: 'linear-gradient(135deg, #4d8aff 0%, #b3d4ff 100%)', tag: 'Hero' },
  { n: '12', t: '3D Portfolio', a: '3D', c: 'linear-gradient(135deg, #1a1a2a 0%, #4d4d8a 100%)', tag: 'Portfolio' },
];

const STATS = [
  { n: '500+', l: 'Premium Templates' },
  { n: '120K+', l: 'Designers' },
  { n: '∞', l: 'Animations' },
  { n: '4.9★', l: 'Avg. Rating' },
];

// 鼠标位置 — 用 ref 存值 + 直接写 DOM style，避免 setState 触发整树重渲染
function useMouseTracker() {
  const xRef = useRef(0);
  const yRef = useRef(0);
  useEffect(() => {
    let raf = 0;
    let pending = false;
    const flush = () => {
      pending = false;
      const x = xRef.current;
      const y = yRef.current;
      // spotlight（radial-gradient 中心点）
      const spot = document.getElementById('ps-spotlight');
      if (spot) spot.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(120, 119, 198, 0.15), transparent 40%)`;
      // 3 张浮动卡（直接写 transform，绕过 React）
      const c1 = document.getElementById('ps-card-1');
      const c2 = document.getElementById('ps-card-2');
      const c3 = document.getElementById('ps-card-3');
      if (c1) c1.style.transform = `rotate(-8deg) translate(${x * 0.02}px, ${y * 0.02}px)`;
      if (c2) c2.style.transform = `rotate(6deg) translate(${x * -0.015}px, ${y * -0.015}px)`;
      if (c3) c3.style.transform = `rotate(-4deg) translate(${x * 0.01}px, ${y * 0.025}px)`;
    };
    const onMove = (e: MouseEvent) => {
      xRef.current = e.clientX;
      yRef.current = e.clientY;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(flush);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

export default function PremiumShowcase() {
  const [active, setActive] = useState('Mixed');
  useMouseTracker();
  const heroRef = useRef<HTMLDivElement>(null);
  // 滚动视差 — rAF 节流 + 直接写 DOM style
  useEffect(() => {
    let raf = 0;
    let pending = false;
    const flush = () => {
      pending = false;
      const y = window.scrollY;
      const bg = document.getElementById('ps-hero-bg');
      if (bg) bg.style.transform = `translateY(${y * 0.4}px)`;
    };
    const onScroll = () => {
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(flush);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const list = active === 'Mixed' ? SHOWCASE : SHOWCASE.filter((s) => s.a === active);

  return (
    <div className={styles.page}>
      {/* SPOTLIGHT */}
      <div id="ps-spotlight" className={styles.spotlight} aria-hidden />

      {/* NOISE OVERLAY */}
      <div className={styles.noise} aria-hidden />

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <div className={styles.brandMark} />
          <span className={styles.brandWord}>motion<em>showcase</em></span>
        </div>
        <div className={styles.navLinks}>
          <a data-active>Templates</a>
          <a>Backgrounds</a>
          <a>3D</a>
          <a>Pricing</a>
        </div>
        <div className={styles.navRight}>
          <button className={styles.navGhost}>Sign in</button>
          <button className={styles.navCta}>Go Unlimited →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero} ref={heroRef}>
        <div id="ps-hero-bg" className={styles.heroBg} aria-hidden>
          <div className={styles.heroOrbA} />
          <div className={styles.heroOrbB} />
          <div className={styles.heroOrbC} />
        </div>

        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          500+ Premium Animated Templates
        </div>

        <h1 className={styles.heroTitle}>
          <span className={styles.heroLine} data-a>Unlock</span>
          <span className={styles.heroLine} data-b>
            <em className={styles.heroItalic}>your</em>
          </span>
          <span className={styles.heroLine} data-c>
            <span className={styles.heroGrad1}>AI Design</span>
          </span>
          <span className={styles.heroLine} data-d>
            <span className={styles.heroGrad2}>Superpowers</span>
            <span className={styles.heroDot}>.</span>
          </span>
        </h1>

        <p className={styles.heroLede}>
          Build beautiful landing pages in minutes with our ready-to-use prompt library.
          <br />
          Just copy, paste, and launch.
        </p>

        <div className={styles.heroBtns}>
          <button className={styles.btnPrimary}>
            Go Unlimited
            <span className={styles.btnArrow}>→</span>
          </button>
          <button className={styles.btnSecondary}>View Pricing</button>
        </div>

        <div className={styles.heroFloating} aria-hidden>
          <div id="ps-card-1" className={styles.floatCard} data-pos="1">
            <div className={styles.floatCardInner} style={{ background: 'linear-gradient(135deg, #1a0033, #4d00b3, #ff0080)' }}>
              <span className={styles.floatCardTag}>HERO</span>
              <span className={styles.floatCardT}>Aetheris</span>
            </div>
          </div>
          <div id="ps-card-2" className={styles.floatCard} data-pos="2">
            <div className={styles.floatCardInner} style={{ background: 'linear-gradient(135deg, #001a4d, #00b3ff)' }}>
              <span className={styles.floatCardTag}>3D</span>
              <span className={styles.floatCardT}>Layered</span>
            </div>
          </div>
          <div id="ps-card-3" className={styles.floatCard} data-pos="3">
            <div className={styles.floatCardInner} style={{ background: 'linear-gradient(135deg, #ffd83d, #ff0080, #5d00b3)' }}>
              <span className={styles.floatCardTag}>LANDING</span>
              <span className={styles.floatCardT}>Prisma</span>
            </div>
          </div>
        </div>
      </section>

      {/* TYPE FILTER */}
      <section className={styles.filterSection}>
        <div className={styles.filterHead}>
          <span className={styles.filterLabel}>Type</span>
          <span className={styles.filterKicker}>All Templates</span>
        </div>
        <div className={styles.filterRow}>
          {CATS.map((c) => (
            <button
              key={c}
              className={styles.filterBtn}
              data-active={active === c}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* SHOWCASE GRID */}
      <section className={styles.showcase}>
        <div className={styles.showcaseGrid}>
          {list.map((s, i) => (
            <article
              key={s.n}
              className={styles.card}
              data-pos={i % 2 === 0 ? 'left' : 'right'}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className={styles.cardImg} style={{ background: s.c }}>
                <div className={styles.cardImgOverlay} />
                <div className={styles.cardImgLabel}>
                  <span>{s.tag}</span>
                </div>
                <div className={styles.card3d} aria-hidden>
                  <div className={styles.card3dShape} />
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardN}>{s.n}</div>
                <div className={styles.cardT}>{s.t}</div>
                <div className={styles.cardMeta}>
                  <span>{s.a}</span>
                  <span className={styles.cardArrow}>→</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className={styles.promo}>
        <div className={styles.promoInner}>
          <div className={styles.promoLeft}>
            <div className={styles.promoKicker}>★ FEATURED COURSE</div>
            <h2 className={styles.promoTitle}>
              Learn to design<br />
              <span className={styles.heroGrad3}>beautiful websites</span><br />
              using AI tools.
            </h2>
            <div className={styles.promoBtns}>
              <button className={styles.btnPrimary}>
                Master AI-powered design
                <span className={styles.btnArrow}>→</span>
              </button>
              <button className={styles.btnSecondary}>Start Learning for Free</button>
            </div>
          </div>
          <div className={styles.promoRight}>
            <div className={styles.promoDeco} aria-hidden>
              <div className={styles.promoOrb} style={{ background: 'linear-gradient(135deg, #4d00b3, #ff0080)' }} />
              <div className={styles.promoOrb} style={{ background: 'linear-gradient(135deg, #00b3ff, #4d8aff)' }} />
              <div className={styles.promoOrb} style={{ background: 'linear-gradient(135deg, #ffd83d, #ff8a3d)' }} />
            </div>
          </div>
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

      {/* FEATURED VIDEO / BG SECTION */}
      <section className={styles.featured}>
        <div className={styles.featuredHead}>
          <span className={styles.featuredKicker}>◉ FEATURED</span>
          <h2 className={styles.featuredTitle}>
            Animated backgrounds<br />
            <span className={styles.heroGrad1}>designed to convert,</span><br />
            impress, and amaze.
          </h2>
        </div>
        <div className={styles.featuredCard}>
          <div className={styles.featuredBg} aria-hidden>
            <div className={styles.fbOrb1} />
            <div className={styles.fbOrb2} />
            <div className={styles.fbOrb3} />
            <div className={styles.fbOrb4} />
            <div className={styles.fbGrid} />
          </div>
          <div className={styles.featuredCardBody}>
            <div className={styles.featuredCardKicker}>PLAY REEL · 2026</div>
            <div className={styles.featuredCardT}>4K · Loop · 12s</div>
            <button className={styles.btnPrimary}>
              Explore Videos
              <span className={styles.btnArrow}>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <h2 className={styles.finalCtaTitle}>
          <span>Ready to ship</span>
          <span className={styles.heroGrad2}>something beautiful?</span>
        </h2>
        <div className={styles.finalCtaBtns}>
          <button className={styles.btnPrimary}>
            Go Unlimited
            <span className={styles.btnArrow}>→</span>
          </button>
          <button className={styles.btnSecondary}>Talk to Sales</button>
        </div>
      </section>

      <footer className={styles.foot}>
        <div>© 2026 motion showcase</div>
        <div>Made with ♥ for designers</div>
        <div>Privacy · Terms</div>
      </footer>
    </div>
  );
}
