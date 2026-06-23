'use client';
import styles from './minimal.module.css';

const WORKS = [
  { n: '01', t: 'Quiet Light', y: '2026', c: 'Photography' },
  { n: '02', t: 'Slow Motion', y: '2026', c: 'Short Film' },
  { n: '03', t: 'Soft Edges', y: '2025', c: 'Print' },
  { n: '04', t: 'White Space', y: '2025', c: 'Identity' },
  { n: '05', t: 'Long Breath', y: '2024', c: 'Editorial' },
  { n: '06', t: 'Less, Better', y: '2024', c: 'Object' },
];

export default function Minimal() {
  return (
    <div className={styles.page}>
      {/* NAV */}
      <nav className={styles.nav}>
        <a className={styles.brand}>KIRA</a>
        <div className={styles.links}>
          <a>Index</a>
          <a>Work</a>
          <a>About</a>
          <a>Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroKicker}>Independent studio · est. 2018</div>
        <h1 className={styles.heroTitle}>
          <span>Design</span>
          <span>that</span>
          <span data-light>breathes.</span>
        </h1>
        <p className={styles.heroLede}>
          We make quiet things. For brands that don't need to shout, the work speaks for itself — in negative space, in long pauses, in restraint.
        </p>
        <div className={styles.heroFoot}>
          <span>Tokyo — New York</span>
          <span>Available · Autumn 2026</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className={styles.ticker}>
        <div className={styles.tickerInner}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles.tickerGroup}>
              {['CALM', '·', 'SLOW', '·', 'QUIET', '·', 'SOFT', '·', 'OPEN', '·', 'BREATH', '·', 'SPACE', '·', 'LESS', '·'].map((w, j) => (
                <span key={`${i}-${j}`}>{w}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* WORKS */}
      <section className={styles.works}>
        <div className={styles.worksHead}>
          <div>
            <div className={styles.worksKicker}>Selected</div>
            <h2 className={styles.worksTitle}>Recent Work</h2>
          </div>
          <div className={styles.worksCount}>06 — 2026</div>
        </div>
        <div className={styles.worksList}>
          {WORKS.map((w) => (
            <a key={w.n} className={styles.work}>
              <span className={styles.workN}>{w.n}</span>
              <span className={styles.workT}>{w.t}</span>
              <span className={styles.workC}>{w.c}</span>
              <span className={styles.workY}>{w.y}</span>
              <span className={styles.workArrow}>→</span>
            </a>
          ))}
        </div>
      </section>

      {/* BIG QUOTE */}
      <section className={styles.quote}>
        <p className={styles.quoteText}>
          "There is no design without discipline."<br />
          "There is no form without quiet."
        </p>
        <div className={styles.quoteAuthor}>— studio notes, 2024</div>
      </section>

      {/* ABOUT */}
      <section className={styles.about}>
        <div className={styles.aboutLabel}>About</div>
        <div className={styles.aboutBody}>
          <p>
            KIRA is a small studio for design and direction. We work with brands and individuals who value the long view — over launch, over applause, over the next thing.
          </p>
          <p>
            We believe the page should be mostly empty. The room should be mostly still. The pause should be mostly long.
          </p>
        </div>
        <div className={styles.aboutMeta}>
          <div>
            <div className={styles.metaKicker}>Founded</div>
            <div className={styles.metaValue}>2018</div>
          </div>
          <div>
            <div className={styles.metaKicker}>People</div>
            <div className={styles.metaValue}>04</div>
          </div>
          <div>
            <div className={styles.metaKicker}>Cities</div>
            <div className={styles.metaValue}>02</div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className={styles.contact}>
        <div className={styles.contactLabel}>Say hello</div>
        <a className={styles.contactMail}>hello@kira.studio</a>
        <div className={styles.contactFoot}>
          <span>© 2026 KIRA Studio</span>
          <span>Last updated · 23.06.2026</span>
        </div>
      </section>
    </div>
  );
}
