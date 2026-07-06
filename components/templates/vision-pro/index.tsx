'use client';
import styles from './vision-pro.module.css';

const FEATURES = [
  { t: 'Eye Tracking', d: 'Sub-millimeter precision. Look to focus, tap to select.', i: '👁' },
  { t: 'Hand Gestures', d: 'Pinch to grab, twist to scroll. The cursor, re-imagined.', i: '✋' },
  { t: 'Spatial Audio', d: 'Sounds come from where they belong in the room.', i: '🔊' },
  { t: 'Infinite Canvas', d: 'Apps float in space. Resize, group, hide.', i: '◫' },
];

const APPS = [
  { n: 'Photos', g: 'linear-gradient(135deg, #ff8a3d, #ff3d6e)', i: '✿' },
  { n: 'Mail', g: 'linear-gradient(135deg, #4d8aff, #5dffd0)', i: '✉' },
  { n: 'Music', g: 'linear-gradient(135deg, #ff4d6d, #ff8ad4)', i: '♪' },
  { n: 'Notes', g: 'linear-gradient(135deg, #fff9b0, #ffd6a5)', i: '✎' },
  { n: 'Maps', g: 'linear-gradient(135deg, #5dff8a, #4dffd0)', i: '◉' },
  { n: 'FaceTime', g: 'linear-gradient(135deg, #5dffaa, #4d8aff)', i: '◐' },
];

export default function VisionPro() {
  return (
    <div className={styles.page}>
      {/* BIG COLORED ORBS */}
      <div className={styles.orbA} aria-hidden />
      <div className={styles.orbB} aria-hidden />
      <div className={styles.orbC} aria-hidden />
      <div className={styles.grid} aria-hidden />

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>◉</div>
          <div>
            <div className={styles.brandName}>visionOS</div>
            <div className={styles.brandSub}>by Apple · 2026</div>
          </div>
        </div>
        <div className={styles.navLinks}>
          <button type="button">Overview</button>
          <button type="button">Features</button>
          <button type="button">Apps</button>
          <button type="button">Specs</button>
          <button type="button">Buy</button>
        </div>
        <div className={styles.navCta}>
          <button className={styles.ghostBtn}>Try a demo</button>
          <button className={styles.solidBtn}>Buy · $3,499</button>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroKicker}>◉ New era of computing</div>
        <h1 className={styles.heroTitle}>
          <span className={styles.line}>Welcome to</span>
          <span className={styles.line} data-big>spatial.</span>
        </h1>
        <p className={styles.heroLede}>
          Apps float in your room.<br />
          The line between digital and physical — gone.
        </p>
        <div className={styles.heroBtns}>
          <button className={styles.solidBtn}>Buy · $3,499</button>
          <button className={styles.glassBtn}>▶ Watch the film</button>
        </div>

        <div className={styles.heroCard}>
          <div className={styles.heroCardHeader}>
            <div className={styles.heroCardDots}>
              <span /><span /><span />
            </div>
            <div className={styles.heroCardTitle}>visionOS · 2.4</div>
          </div>
          <div className={styles.heroCardBody}>
            <div className={styles.appFloat} style={{ background: APPS[0].g }}>✿</div>
            <div className={styles.appFloat} style={{ background: APPS[1].g, '--x': '60%', '--y': '20%' } as React.CSSProperties}>✉</div>
            <div className={styles.appFloat} style={{ background: APPS[2].g, '--x': '70%', '--y': '60%' } as React.CSSProperties}>♪</div>
            <div className={styles.appFloat} style={{ background: APPS[3].g, '--x': '20%', '--y': '70%' } as React.CSSProperties}>✎</div>
            <div className={styles.heroCardLine} />
            <div className={styles.heroCardLine} data-thin />
            <div className={styles.heroCardLine} data-thinner />
          </div>
        </div>
      </section>

      {/* FEATURES GLASS GRID */}
      <section className={styles.features}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionKicker}>Features</div>
          <h2 className={styles.sectionTitle}>
            Built for your <em>eyes</em>,<br />
            hands, and room.
          </h2>
        </div>
        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.t} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.i}</div>
              <h3 className={styles.featureTitle}>{f.t}</h3>
              <p className={styles.featureDesc}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APPS RAIL */}
      <section className={styles.apps}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionKicker}>App Gallery</div>
          <h2 className={styles.sectionTitle}>Hundreds of apps.<br />In your space.</h2>
        </div>
        <div className={styles.appRow}>
          {APPS.map((a) => (
            <div key={a.n} className={styles.appCard}>
              <div className={styles.appIcon} style={{ background: a.g }}>{a.i}</div>
              <div className={styles.appName}>{a.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BIG QUOTE */}
      <section className={styles.quote}>
        <div className={styles.quoteMark}>"</div>
        <p className={styles.quoteText}>
          The first device you look through,<br />
          and the first you forget you're wearing.
        </p>
        <div className={styles.quoteAuthor}>— Tim C., Jony I., 2024</div>
      </section>

      {/* STATS */}
      <section className={styles.stats}>
        {[
          { n: '23M', l: 'pixels per eye' },
          { n: '12ms', l: 'motion to photon' },
          { n: '6', l: 'spatial cameras' },
          { n: '2h', l: 'all-day battery' },
        ].map((s) => (
          <div key={s.l} className={styles.stat}>
            <div className={styles.statN}>{s.n}</div>
            <div className={styles.statL}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to see <em>more</em>?</h2>
        <div className={styles.ctaBtns}>
          <button className={styles.solidBtn}>Buy · $3,499</button>
          <button className={styles.glassBtn}>Book a demo</button>
        </div>
        <div className={styles.ctaFoot}>Free shipping · 14-day returns · AppleCare+ included</div>
      </section>

      <footer className={styles.foot}>
        <div>© 2026 Apple Inc. — visionOS · vision Pro</div>
        <div>Designed in Cupertino</div>
      </footer>
    </div>
  );
}
