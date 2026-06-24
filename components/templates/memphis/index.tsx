'use client';
import styles from './memphis.module.css';

const PRODUCTS = [
  { n: 'POSTER', s: 'Bauhaus Wavy', p: '$58', c: 'pink' },
  { n: 'MUG', s: 'Stripes Forever', p: '$24', c: 'cyan' },
  { n: 'TOTE', s: 'Dots & Triangles', p: '$32', c: 'yellow' },
  { n: 'PIN', s: 'Mini Memphis', p: '$8', c: 'mint' },
  { n: 'STICKER', s: 'Confetti Pack', p: '$12', c: 'lavender' },
  { n: 'TEE', s: 'Crayon Wave', p: '$46', c: 'orange' },
];

const TAGS = ['#squiggle', '#dots', '#pastel', '#bauhaus', '#triangle', '#confetti', '#wave', '#terrazzo'];

export default function Memphis() {
  return (
    <div className={styles.page}>
      {/* Floating memphis decorations */}
      <div className={styles.deco} aria-hidden>
        <div className={styles.squiggle} data-a style={{ top: '5%', left: '6%' }}>∿∿∿∿</div>
        <div className={styles.triangle} data-a style={{ top: '12%', right: '8%' }} />
        <div className={styles.circle} data-a style={{ top: '30%', left: '3%' }} />
        <div className={styles.dotGrid} data-a style={{ top: '20%', right: '20%' }} />
        <div className={styles.cross} data-a style={{ bottom: '30%', left: '8%' }}>+</div>
        <div className={styles.cross} data-a style={{ top: '50%', right: '5%' }}>+</div>
        <div className={styles.squiggle} data-a style={{ bottom: '10%', right: '12%' }}>∿∿</div>
        <div className={styles.triangle} data-a style={{ bottom: '15%', left: '20%' }} data-down />
        <div className={styles.circle} data-a style={{ top: '70%', right: '15%' }} data-stroke />
      </div>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <span>◐</span>
          </div>
          <div>
            <div className={styles.brandName}>memfiz.co</div>
            <div className={styles.brandSub}>✿ 80s shop ✿ est. 1985</div>
          </div>
        </div>
        <div className={styles.navLinks}>
          <a href="#">★ shop</a>
          <a href="#">★ about</a>
          <a href="#">★ contact</a>
        </div>
        <div className={styles.navCart}>
          <button className={styles.cartBtn}>🛒 <span>3</span></button>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            <span className={styles.tPink}>MAKE</span>
            <span className={styles.tYellow}>IT</span>
            <span className={styles.tCyan}>WEIRD!</span>
          </h1>
          <p className={styles.heroLede}>
            Posters, mugs, tees, pins — all the loud, joyful, dot-covered goods you forgot you needed. <span className={styles.highlight}>Made in Brooklyn</span>, shipped worldwide.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnPrimary}>★ SHOP NOW</button>
            <button className={styles.btnSecondary}>VIEW LOOKBOOK →</button>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardBg}>
              <div className={styles.cardSquiggle}>∿∿∿∿∿</div>
              <div className={styles.cardDot} style={{ top: '20%', left: '20%' }} />
              <div className={styles.cardDot} style={{ top: '70%', left: '60%' }} />
              <div className={styles.cardTri} />
            </div>
            <div className={styles.heroCardBody}>
              <div className={styles.heroCardLabel}>SUMMER 26 DROP</div>
              <div className={styles.heroCardTitle}>Wavy Lines</div>
              <div className={styles.heroCardPrice}>$58</div>
            </div>
          </div>
        </div>
      </section>

      {/* TAG TICKER */}
      <div className={styles.tagTicker}>
        <div className={styles.tagTickerInner}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles.tagTickerGroup}>
              {TAGS.map((t) => <span key={t}>{t}</span>)}
              {TAGS.map((t) => <span key={`b-${t}`}>{t}</span>)}
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className={styles.products}>
        <div className={styles.productsHead}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.tPink}>HOT</span>{' '}
            <span className={styles.tCyan}>DROPS</span>{' '}
            <span className={styles.tYellow}>✿</span>
          </h2>
          <div className={styles.sort}>
            <span data-active>ALL</span>
            <span>POSTER</span>
            <span>MUG</span>
            <span>TOTE</span>
            <span>STICKER</span>
          </div>
        </div>
        <div className={styles.productGrid}>
          {PRODUCTS.map((p, i) => (
            <div key={p.n} className={styles.product} data-color={p.c}>
              <div className={styles.productImg}>
                <div className={styles.productImgInner}>
                  <div className={styles.imgSquiggle}>∿∿∿</div>
                  <div className={styles.imgCircle} />
                  <div className={styles.imgTri} />
                </div>
                <span className={styles.productTag}>NEW</span>
              </div>
              <div className={styles.productBody}>
                <div className={styles.productN}>{p.n}</div>
                <div className={styles.productS}>{p.s}</div>
                <div className={styles.productFoot}>
                  <div className={styles.productPrice}>{p.p}</div>
                  <button className={styles.addBtn}>+ ADD</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className={styles.stats}>
        {[
          { n: '12K+', l: 'happy customers' },
          { n: '180+', l: 'designs' },
          { n: '★ 4.9', l: 'reviews' },
          { n: '40+', l: 'countries' },
        ].map((s) => (
          <div key={s.l} className={styles.stat}>
            <div className={styles.statN}>{s.n}</div>
            <div className={styles.statL}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* BIG CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          <span>JOIN</span>{' '}
          <span className={styles.tPink}>THE</span>{' '}
          <span className={styles.tCyan}>CLUB</span>
        </h2>
        <p className={styles.ctaLede}>Get 15% off your first order + a free sticker pack ✿</p>
        <form className={styles.ctaForm} onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="your@email.com" className={styles.ctaInput} />
          <button className={styles.ctaBtn}>★ JOIN NOW</button>
        </form>
      </section>

      <footer className={styles.foot}>
        <div>✿ memfiz.co · est 1985 ✿</div>
        <div>Made in Brooklyn · Shipped worldwide</div>
        <div>© 2026</div>
      </footer>
    </div>
  );
}
