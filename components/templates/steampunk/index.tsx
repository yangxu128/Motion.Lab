'use client';
import styles from './steampunk.module.css';

const GEAR = (size: number, teeth: number, color: string, pos: { x: string; y: string }, rot: number) => (
  <div
    key={`${size}-${teeth}-${pos.x}-${pos.y}`}
    className={styles.gear}
    style={{
      width: size,
      height: size,
      '--t': teeth,
      '--c': color,
      left: pos.x,
      top: pos.y,
      transform: `translate(-50%, -50%) rotate(${rot}deg)`,
    } as React.CSSProperties}
    aria-hidden
  >
    {Array.from({ length: teeth }).map((_, i) => (
      <span key={i} className={styles.gearTooth} style={{ transform: `rotate(${(360 / teeth) * i}deg)` }} />
    ))}
    <div className={styles.gearHub} />
  </div>
);

const INVENTIONS = [
  { n: 'MK-I', t: 'Aetheric Engine', d: 'Steam-powered flight apparatus. Range: 240 mi. Brass + walnut.', y: '1887' },
  { n: 'MK-II', t: 'Chronograph', d: 'Pocket watch with marine chronometer. ±0.1s daily drift.', y: '1891' },
  { n: 'MK-III', t: 'Differential Calculator', d: 'Babbage-derived, fully mechanical. Solves 6th-degree polynomials.', y: '1894' },
  { n: 'MK-IV', t: 'Periscope Mark V', d: 'Submarine observation rig. 8x magnification, water-proof to 30m.', y: '1898' },
];

const STATS = [
  { n: '12', l: 'PATENTS' },
  { n: '∞', l: 'STEAM PSI' },
  { n: '1873', l: 'FOUNDED' },
  { n: '04', l: 'WORKSHOPS' },
];

export default function Steampunk() {
  return (
    <div className={styles.page}>
      <div className={styles.parchment} aria-hidden />

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <div className={styles.navCog}>⚙</div>
          <div>
            <div className={styles.navName}>VICTORIANA WORKS</div>
            <div className={styles.navSub}>MECHANICAL ENGINEERS · EST. 1873</div>
          </div>
        </div>
        <div className={styles.navLinks}>
          <a href="#">THE WORKS</a>
          <a href="#">INVENTIONS</a>
          <a href="#">WORKSHOPS</a>
          <a href="#">DISPATCH</a>
        </div>
        <div className={styles.navDate}>
          <span>23 · JUNE · 2026</span>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden>
          {GEAR(220, 16, '#8a5a2b', { x: '15%', y: '30%' }, 0)}
          {GEAR(160, 12, '#a87141', { x: '30%', y: '70%' }, 30)}
          {GEAR(140, 10, '#6e3a1a', { x: '85%', y: '25%' }, 45)}
          {GEAR(100, 8, '#a87141', { x: '90%', y: '70%' }, 60)}
          {GEAR(80, 6, '#8a5a2b', { x: '5%', y: '85%' }, 15)}
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroKicker}>⚙ VOLUME XIV · ISSUE MMXXVI</div>
          <h1 className={styles.heroTitle}>
            <span>THE</span>
            <span data-brass>AETHER</span>
            <span data-divider>—</span>
            <span>ENGINE</span>
          </h1>
          <p className={styles.heroLede}>
            A chronicle of brass, steam, and singular purpose. <em>Victorian mechanical engineering</em> for an age that never was.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnSolid}>EXAMINE THE WORKS →</button>
            <button className={styles.btnGhost}>SUBSCRIBE TO DISPATCH</button>
          </div>
        </div>
      </section>

      {/* RIVETED DIVIDER */}
      <div className={styles.rivetBar} aria-hidden>
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className={styles.rivet} />
        ))}
      </div>

      {/* STATS */}
      <section className={styles.stats}>
        {STATS.map((s) => (
          <div key={s.l} className={styles.stat}>
            <div className={styles.statN}>{s.n}</div>
            <div className={styles.statL}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* INVENTIONS */}
      <section className={styles.inventions}>
        <div className={styles.invHead}>
          <span className={styles.invOrnament}>⚙</span>
          <h2 className={styles.invTitle}>INVENTIONS OF THE QUARTER</h2>
          <span className={styles.invOrnament}>⚙</span>
        </div>
        <div className={styles.invList}>
          {INVENTIONS.map((iv) => (
            <div key={iv.n} className={styles.inv}>
              <div className={styles.invLeft}>
                <div className={styles.invN}>{iv.n}</div>
                <h3 className={styles.invT}>{iv.t}</h3>
                <p className={styles.invD}>{iv.d}</p>
              </div>
              <div className={styles.invRight}>
                <div className={styles.invYear}>{iv.y}</div>
                <button className={styles.invBtn}>EXAMINE →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BIG TYPE */}
      <section className={styles.bigType}>
        <div className={styles.bigTypeInner}>
          <span>STEAM</span>
          <span data-divider>·</span>
          <span>BRASS</span>
          <span data-divider>·</span>
          <span>COG</span>
          <span data-divider>·</span>
          <span>FIRE</span>
        </div>
      </section>

      {/* QUOTE */}
      <section className={styles.quote}>
        <div className={styles.quoteOrn}>❦</div>
        <p className={styles.quoteText}>
          "What the hand of man can imagine, the wheel and piston shall deliver."
        </p>
        <div className={styles.quoteAuthor}>— Lady Cogsworth, 1898</div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>SUBSCRIBE TO THE DISPATCH</h2>
        <p className={styles.ctaLede}>Receive our quarterly mechanical gazette, hand-typed and sealed with brass.</p>
        <form className={styles.ctaForm} onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="your@address.tld" className={styles.ctaInput} />
          <button className={styles.ctaBtn}>SUBSCRIBE ⚙</button>
        </form>
      </section>

      <footer className={styles.foot}>
        <div>⚙ VICTORIANA WORKS · LONDON · 1873</div>
        <div>Forged in brass. Driven by steam.</div>
        <div>MMXXVI ©</div>
      </footer>
    </div>
  );
}
