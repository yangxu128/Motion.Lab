'use client';
import { useEffect, useRef } from 'react';
import styles from './nocturne.module.css';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_143803_f635b644-d959-4f16-9d29-cedaeb5c6de0.mp4';

const CHAPTERS = [
  {
    n: 'I.',
    t: 'The hour before',
    d: 'When the streetlamps hum, and the city holds its breath between one heartbeat and the next.',
  },
  {
    n: 'II.',
    t: 'A door left open',
    d: 'Light spills out into the alley. Inside: a gramophone, a glass of something amber, and a story you almost remember.',
  },
  {
    n: 'III.',
    t: 'What the night keeps',
    d: 'Some things are easier to believe at midnight. We are not in a hurry to be proven otherwise.',
  },
];

const CAST = [
  { i: 'MV', n: 'Maren Vossler', r: 'Founder · Director', c: '#c9a87c' },
  { i: 'JT', n: 'Julien Tardieu', r: 'Cinematographer', c: '#7a8c9c' },
  { i: 'AS', n: 'Akiyo Shirai', r: 'Sound · Score', c: '#a87c7c' },
  { i: 'NR', n: 'Noor Rahimi', r: 'Production Design', c: '#8c9c7a' },
];

const SCROLL_TIMELINE = [
  { y: 0, label: 'PROLOGUE' },
  { y: 1, label: 'CHAPTER I' },
  { y: 2, label: 'CHAPTER II' },
  { y: 3, label: 'CHAPTER III' },
  { y: 4, label: 'EPILOGUE' },
];

export default function Nocturne() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // 鼠标光晕（暖金色，大半径）
  useEffect(() => {
    const root = rootRef.current;
    const dot = cursorRef.current;
    if (!root || !dot) return;
    let raf = 0;
    let tx = -1000;
    let ty = -1000;
    let cx = -1000;
    let cy = -1000;
    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    const tick = () => {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    root.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener('mousemove', onMove);
    };
  }, []);

  // Hero 视差（视频与文字层反向位移）
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (heroRef.current) {
        const v = heroRef.current.querySelector<HTMLVideoElement>('video');
        const t = heroRef.current.querySelector<HTMLDivElement>(`.${styles.heroTitle}`);
        const k = heroRef.current.querySelector<HTMLDivElement>(`.${styles.heroKicker}`);
        if (v) v.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.06)`;
        if (t) t.style.transform = `translate3d(0, ${y * -0.08}px, 0)`;
        if (k) k.style.opacity = String(Math.max(0, 1 - y / 400));
      }
      // 右侧 timeline 进度
      if (timelineRef.current) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const p = Math.min(1, Math.max(0, y / totalHeight));
        const fill = timelineRef.current.querySelector<HTMLDivElement>(`.${styles.tlFill}`);
        if (fill) fill.style.height = `${p * 100}%`;
        // 高亮当前段落
        const dots = timelineRef.current.querySelectorAll<HTMLButtonElement>(`button[data-tl]`);
        const active = Math.round(p * (dots.length - 1));
        dots.forEach((d, i) => {
          d.setAttribute('data-active', i === active ? 'true' : 'false');
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 注入 Google Fonts（Cormorant Garamond + Inter）
  useEffect(() => {
    const id = 'nocturne-fonts';
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
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <div className={styles.page} ref={rootRef}>
      {/* 鼠标光晕 */}
      <div className={styles.cursor} ref={cursorRef} aria-hidden />

      {/* HERO 视频背景 */}
      <section className={styles.hero} ref={heroRef}>
        <video
          className={styles.heroVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          src={VIDEO_URL}
        />
        <div className={styles.heroScrim} aria-hidden />
        <div className={styles.heroVignette} aria-hidden />

        <nav className={styles.nav}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>◐</span>
            <span className={styles.brandName}>NOCTURNE</span>
          </div>
          <ul className={styles.navLinks}>
            <li data-active>Films</li>
            <li>Series</li>
            <li>Studio</li>
            <li>Press</li>
          </ul>
          <button type="button" className={styles.navCta}>
            Watch reel <span aria-hidden>→</span>
          </button>
        </nav>

        <div className={styles.heroInner}>
          <div className={styles.heroKicker}>A SHORT FILM COLLECTION · 2026</div>
          <h1 className={styles.heroTitle}>
            <span className={styles.lineA}>Stories the night</span>
            <span className={styles.lineB}><em>remembers</em> for us.</span>
          </h1>
          <p className={styles.heroBody}>
            Nocturne is a small studio of filmmakers and designers who make quiet, slow
            things. Three short films, one ambient score, and a website that doesn&apos;t
            ask you to scroll faster than you can feel.
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.metaCell}><span className={styles.metaK}>RUNTIME</span><span className={styles.metaV}>2h 47m</span></span>
            <span className={styles.metaCell}><span className={styles.metaK}>EPISODES</span><span className={styles.metaV}>03</span></span>
            <span className={styles.metaCell}><span className={styles.metaK}>YEAR</span><span className={styles.metaV}>MMXXVI</span></span>
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden>
          <span className={styles.scrollLabel}>SCROLL</span>
          <span className={styles.scrollLine} />
        </div>
      </section>

      {/* MANIFESTO 大字宣言 */}
      <section className={styles.manifesto}>
        <div className={styles.manifestoKicker}>— A NOTE FROM THE STUDIO</div>
        <p className={styles.manifestoQuote}>
          We make films the way other people <em>write letters</em> &mdash; with
          care, in longhand, and only when there is something worth saying.
        </p>
        <div className={styles.manifestoSign}>— M. Vossler, founder</div>
      </section>

      {/* CHAPTERS 三个章节 */}
      <section className={styles.chapters}>
        <div className={styles.chapterHead}>
          <div className={styles.chapterKicker}>— THE TRILOGY</div>
          <h2 className={styles.chapterTitle}>
            Three small films. <em>One long night.</em>
          </h2>
        </div>
        <div className={styles.chapterList}>
          {CHAPTERS.map((c, i) => (
            <article key={c.n} className={styles.chapter} style={{ animationDelay: `${i * 0.12}s` }}>
              <div className={styles.chapterN}>{c.n}</div>
              <h3 className={styles.chapterT}>{c.t}</h3>
              <p className={styles.chapterD}>{c.d}</p>
              <button type="button" className={styles.chapterMore}>
                Watch chapter <span aria-hidden>↗</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* CAST 团队 */}
      <section className={styles.cast}>
        <div className={styles.castKicker}>— BEHIND THE LENS</div>
        <div className={styles.castGrid}>
          {CAST.map((m) => (
            <div key={m.i} className={styles.castItem}>
              <div className={styles.castAvatar} style={{ background: m.c }}>{m.i}</div>
              <div className={styles.castName}>{m.n}</div>
              <div className={styles.castRole}>{m.r}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.final}>
        <h2 className={styles.finalTitle}>
          <span>Stay for the credits.</span>
          <em>The best part comes after.</em>
        </h2>
        <button type="button" className={styles.finalBtn}>
          Subscribe to the next film →
        </button>
      </section>

      <footer className={styles.foot}>
        <div className={styles.footL}>◐ NOCTURNE STUDIO &middot; MMXXVI</div>
        <div className={styles.footC}>Filmed between Lisbon, Kyoto, and 3am.</div>
        <div className={styles.footR}>© 2026</div>
      </footer>

      {/* 右侧滚动时间轴 */}
      <aside className={styles.timeline} ref={timelineRef} aria-hidden>
        <div className={styles.tlRail} />
        <div className={styles.tlFill} />
        {SCROLL_TIMELINE.map((s, i) => (
          <button type="button" key={s.label} data-tl data-active={i === 0 ? 'true' : 'false'} className={styles.tlNode}>
            <span className={styles.tlDot} />
            <span className={styles.tlLabel}>{s.label}</span>
          </button>
        ))}
      </aside>
    </div>
  );
}
