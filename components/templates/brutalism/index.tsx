'use client';
import styles from './brutalism.module.css';

export default function Brutalism() {
  return (
    <div className={styles.page}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandBox}>BRUTAL™</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#">Work</a><a href="#">Shop</a><a href="#">About</a><a href="#">Contact</a>
        </div>
        <button className={styles.cta}>GET IT →</button>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden />
        <span className={styles.stickerTopLeft}>★ NEW DROP</span>
        <span className={styles.stickerTopRight}>100% RAW</span>
        <h1 className={styles.title}>
          <span className={styles.titleRow}>DESIGN</span>
          <span className={styles.titleRow} data-stripe>LIKE</span>
          <span className={styles.titleRow}>NO ONE.</span>
        </h1>
        <div className={styles.heroFoot}>
          <p className={styles.heroLede}>
            A studio that makes websites <span className={styles.highlight}>too loud to ignore</span>.<br />
            Est. 2019. Brooklyn, NY.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnYellow}>SEE THE WORK ↓</button>
            <button className={styles.btnOutline}>HIRE US</button>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className={styles.marquee}>
        <div className={styles.marqueeInner}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles.marqueeGroup}>
              {['NO PIXEL LEFT BEHIND', '★ EST 2019', 'BRUTAL BUT HONEST', '✦ MADE IN BROOKLYN', 'NO ROUNDED CORNERS', '◼ 100% RAW'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className={styles.services}>
        <h2 className={styles.sectionTitle}>WHAT<br/>WE DO?</h2>
        <div className={styles.serviceGrid}>
          {[
            { n: '01', t: 'BRAND', d: 'Logos, identities, and all the weird stuff in between.' },
            { n: '02', t: 'WEBSITES', d: 'Fast, loud, slightly unhinged. Always custom.' },
            { n: '03', t: 'MOTION', d: 'Lottie, Rive, hand-coded. We make things move.' },
            { n: '04', t: 'PRINT', d: 'Posters, zines, business cards that slap.' },
          ].map((s) => (
            <div key={s.n} className={styles.serviceCard}>
              <div className={styles.serviceHead}>
                <span className={styles.serviceN}>{s.n}</span>
                <span className={styles.serviceArrow}>→</span>
              </div>
              <h3 className={styles.serviceT}>{s.t}</h3>
              <p className={styles.serviceD}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className={styles.work}>
        <div className={styles.workHead}>
          <h2 className={styles.sectionTitle}>FEATURED<br/>WORK</h2>
          <button className={styles.btnOutline}>ALL →</button>
        </div>
        <div className={styles.workGrid}>
          {[
            { c: '#FFE600', t: 'CRUSH SODA', tag: 'BRANDING / WEB' },
            { c: '#FF5C00', t: 'YARD SALE', tag: 'IDENTITY' },
            { c: '#00C2FF', t: 'BOOM BOOM', tag: 'MOTION' },
            { c: '#FF00A8', t: 'PUNK ZINE', tag: 'PRINT' },
          ].map((w, i) => (
            <div key={i} className={styles.workCard} style={{ background: w.c }}>
              <div className={styles.workCardInner}>
                <span className={styles.workN}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.workT}>{w.t}</span>
                <span className={styles.workTag}>{w.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>LIKE WHAT<br/>YOU SEE?</h2>
        <button className={styles.btnBig}>LET'S TALK →</button>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div>BRUTAL™ · 2026</div>
        <div>BROOKLYN · NEW YORK</div>
        <div>HELLO@BRUTAL.STUDIO</div>
      </footer>
    </div>
  );
}
