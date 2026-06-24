'use client';
import styles from './bauhaus.module.css';

const WORKS = [
  { n: '001', t: 'STADT THEATER', y: '1926', c: 'Bauhaus Dessau', g: 'linear-gradient(135deg, #e63027, #ffb000)' },
  { n: '002', t: 'KANDEM LAMP', y: '1928', c: 'Marianne Brandt', g: 'linear-gradient(135deg, #ffd83d, #fff5b0)' },
  { n: '003', t: 'CHAIR WASSILY', y: '1925', c: 'Marcel Breuer', g: 'linear-gradient(135deg, #0a0a0a, #4a4a4a)' },
  { n: '004', t: 'BAUHAUS MAGAZINE', y: '1928', c: 'L. Moholy-Nagy', g: 'linear-gradient(135deg, #4da6ff, #b0d4ff)' },
  { n: '005', t: 'UNIVERSAL TYPEFACE', y: '1925', c: 'Herbert Bayer', g: 'linear-gradient(135deg, #fff, #d4d4d4)' },
  { n: '006', t: 'TEA INFUSER', y: '1924', c: 'Wilhelm Wagenfeld', g: 'linear-gradient(135deg, #b0d4ff, #fff)' },
];

const PRINCIPLES = [
  { n: '01', t: 'FORM FOLLOWS FUNCTION', d: 'Every shape serves a purpose. No ornament without reason.' },
  { n: '02', t: 'TOTAL WORK OF ART', d: 'Architecture, furniture, print — one unified vision.' },
  { n: '03', t: 'PRIMARY COLORS ONLY', d: 'Red, yellow, blue. The building blocks of seeing.' },
  { n: '04', t: 'GEOMETRY AS TRUTH', d: 'Circle, square, triangle. The grammar of form.' },
];

export default function Bauhaus() {
  return (
    <div className={styles.page}>
      {/* GEOMETRIC DECO */}
      <div className={styles.deco} aria-hidden>
        <div className={styles.decoCircle} />
        <div className={styles.decoSquare} />
        <div className={styles.decoTri} />
        <div className={styles.decoLine} />
      </div>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <div className={styles.navLogo}>
            <span className={styles.logoCircle} />
            <span className={styles.logoSquare} />
            <span className={styles.logoTri} />
          </div>
          <span className={styles.navWord}>BAUHAUS</span>
        </div>
        <div className={styles.navYear}>1919 — 1933 · DESSAU</div>
        <div className={styles.navLinks}>
          <a href="#">Manifesto</a>
          <a href="#">Works</a>
          <a href="#">People</a>
          <a href="#">Visit</a>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroShape}>
            <div className={styles.heroCircle} />
          </div>
          <div className={styles.heroKicker}>→ MANIFESTO · 1919</div>
          <h1 className={styles.heroTitle}>
            <span>THE</span>
            <span data-red>TOTAL</span>
            <span>FORM</span>
            <span data-yellow>OF</span>
            <span data-blue>ART.</span>
          </h1>
        </div>
        <div className={styles.heroRight}>
          <p className={styles.heroLede}>
            Architects, sculptors, painters, we all must return to the crafts! The artist is a heightened manifestation of the craftsman. <em>The ultimate aim of all visual creative activity is the complete building!</em>
          </p>
          <div className={styles.heroAuthor}>
            <div className={styles.heroLine} />
            <div>
              <div className={styles.heroAuthorName}>Walter Gropius</div>
              <div className={styles.heroAuthorRole}>Founder, 1919</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES GRID */}
      <section className={styles.principles}>
        {PRINCIPLES.map((p) => (
          <div key={p.n} className={styles.principle}>
            <div className={styles.principleN}>{p.n}</div>
            <h3 className={styles.principleT}>{p.t}</h3>
            <p className={styles.principleD}>{p.d}</p>
          </div>
        ))}
      </section>

      {/* WORKS */}
      <section className={styles.works}>
        <div className={styles.worksHead}>
          <h2 className={styles.worksTitle}>
            <span className={styles.worksRed}>WORKS</span>{' '}
            <span className={styles.worksYellow}>OF</span>{' '}
            <span className={styles.worksBlue}>THE</span>{' '}
            MOVEMENT
          </h2>
          <div className={styles.worksSort}>
            <span data-active>ALL</span>
            <span>FURNITURE</span>
            <span>PRINT</span>
            <span>TYPE</span>
            <span>ARCH.</span>
          </div>
        </div>
        <div className={styles.worksGrid}>
          {WORKS.map((w) => (
            <div key={w.n} className={styles.work}>
              <div className={styles.workImg} style={{ background: w.g }}>
                <div className={styles.workImgShape}>
                  <span className={styles.shCircle} />
                  <span className={styles.shSquare} />
                </div>
                <div className={styles.workN}>{w.n}</div>
              </div>
              <div className={styles.workBody}>
                <h3 className={styles.workT}>{w.t}</h3>
                <div className={styles.workC}>{w.c}</div>
                <div className={styles.workFoot}>
                  <span className={styles.workY}>{w.y}</span>
                  <span className={styles.workArrow}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BIG TYPE */}
      <section className={styles.bigType}>
        <div className={styles.bigTypeA} data-red>FORM</div>
        <div className={styles.bigTypeB} data-yellow>FOLLOWS</div>
        <div className={styles.bigTypeC} data-blue>FUNCTION</div>
      </section>

      {/* FOOTER */}
      <footer className={styles.foot}>
        <div>BAUHAUS · DESSAU · 1919 — 1933</div>
        <div>— DIE NEUE EINHEIT VON KUNST, HANDWERK UND TECHNIK —</div>
        <div>© 2026</div>
      </footer>
    </div>
  );
}
