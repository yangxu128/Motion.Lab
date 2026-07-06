'use client';
import styles from './y2k.module.css';

const products = [
  { n: 'CD PLAYER X-2000', c: 'linear-gradient(135deg, #ff8a00, #ff3da6)', p: '¥ 1,288', tag: 'NEW' },
  { n: 'STARLITE LIP GLOSS', c: 'linear-gradient(135deg, #c7e8ff, #ff8ad4)', p: '¥ 188', tag: 'HOT' },
  { n: 'CHROME MINI BAG', c: 'linear-gradient(135deg, #d4d4d4, #8a8a8a)', p: '¥ 588', tag: 'SOLD OUT' },
  { n: 'DISCO PHONE CASE', c: 'linear-gradient(135deg, #ffd6f5, #b0f5ff)', p: '¥ 99', tag: 'NEW' },
  { n: 'PLATINUM SUNGLASSES', c: 'linear-gradient(135deg, #fff9b0, #ff5d5d)', p: '¥ 388', tag: '' },
  { n: 'BUBBLE GUM KEYCHAIN', c: 'linear-gradient(135deg, #ffaaff, #aaffff)', p: '¥ 58', tag: 'NEW' },
];

export default function Y2k() {
  return (
    <div className={styles.page}>
      {/* DISCO BALL */}
      <div className={styles.disco} aria-hidden>
        <div className={styles.discoInner}>
          {Array.from({ length: 64 }).map((_, i) => (
            <span key={i} style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandStar}>★</span>
          <span className={styles.brandName}>LUV2000™</span>
          <span className={styles.brandSub}>x X-TREME CYBER FASHION</span>
        </div>
        <div className={styles.navLinks}>
          <button type="button">SHOP</button>
          <button type="button">★ NEW</button>
          <button type="button">SALE</button>
          <button type="button">★ ABOUT</button>
        </div>
        <div className={styles.navRight}>
          <button className={styles.cart}>🛒 <span>3</span></button>
        </div>
      </nav>

      {/* TICKER */}
      <div className={styles.ticker}>
        <div className={styles.tickerInner}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles.tickerGroup}>
              {['✿ FREE SHIPPING OVER ¥299', '★ NEW IN: CD PLAYER X-2000', '✿ 2000s EDIT', '★ MEMBER POINTS x2', '✿ LIMITED PLATINUM EDITION', '★ CYBER FAIR 2026'].map((t) => <span key={t}>{t}</span>)}
            </div>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.checkerTop} />
          <h1 className={styles.title}>
            <span className={styles.titleT}>SPARKLE</span>
            <span className={styles.titleT} data-pink>★ LIKE ★</span>
            <span className={styles.titleT} data-chrome>2005</span>
          </h1>
          <p className={styles.heroLede}>
            The future is <span className={styles.chrome}>CHROME</span>.<br />
            Y2K fashion · Cyber gear · Dispo vibes.<br />
            <span className={styles.small}>✿ FAST SHIPPING ✿ FREE RETURNS ✿ 100% REAL ✿</span>
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnChrome}>SHOP NEW ✿</button>
            <button className={styles.btnOutline}>VIEW LOOKBOOK →</button>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.bigStar} aria-hidden>★</div>
          <div className={styles.heroOrbA} />
          <div className={styles.heroOrbB} />
          <div className={styles.heroProduct} style={{ background: 'linear-gradient(135deg, #ff8a00, #ff3da6)' }}>
            <span className={styles.heroProductLabel}>NEW DROP</span>
            <span className={styles.heroProductName}>CD PLAYER X-2000</span>
            <span className={styles.heroProductPrice}>¥ 1,288</span>
          </div>
        </div>
      </section>

      {/* CHECKER STRIP */}
      <div className={styles.checkerStrip} aria-hidden />

      {/* PRODUCTS */}
      <section className={styles.products}>
        <div className={styles.productsHead}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.chrome}>★ HOT DROPS ★</span>
          </h2>
          <div className={styles.sort}>
            <span data-active>ALL</span>
            <span>CD</span>
            <span>BAGS</span>
            <span>JEWELRY</span>
          </div>
        </div>
        <div className={styles.productGrid}>
          {products.map((p) => (
            <div key={p.n} className={styles.product}>
              <div className={styles.productImage} style={{ background: p.c }}>
                <span className={styles.productTag}>{p.tag}</span>
                <span className={styles.productSparkle}>✦</span>
                <div className={styles.productBubble} />
              </div>
              <div className={styles.productBody}>
                <h3 className={styles.productName}>{p.n}</h3>
                <div className={styles.productPrice}>{p.p}</div>
                <button className={styles.addBtn}>+ ADD TO CART</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className={styles.stats}>
        {[
          { n: '★ 4.9', l: 'RATING' },
          { n: '50K+', l: 'ORDERS' },
          { n: '180+', l: 'STYLES' },
          { n: '24h', l: 'SHIP' },
        ].map((s) => (
          <div key={s.l} className={styles.stat}>
            <div className={styles.statN}>{s.n}</div>
            <div className={styles.statL}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div>★ LUV2000™ ★</div>
        <div>✿ X-TREME CYBER FASHION ✿</div>
        <div>EST 2000 · TOKYO</div>
      </footer>
    </div>
  );
}
