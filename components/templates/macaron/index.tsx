'use client';
import styles from './macaron.module.css';

const SWEETS = [
  { n: 'ROSE MACARON', p: '¥28', c: '#ffb0d0', tag: 'BEST' },
  { n: 'PISTACHIO', p: '¥32', c: '#b4f5a4', tag: 'NEW' },
  { n: 'LAVENDER', p: '¥28', c: '#d4b4ff', tag: '' },
  { n: 'LEMON DROP', p: '¥24', c: '#fff9b0', tag: 'HOT' },
  { n: 'BLUEBERRY', p: '¥28', c: '#b0d4ff', tag: '' },
  { n: 'CARAMEL', p: '¥30', c: '#ffd6a5', tag: 'NEW' },
];

const FLAVORS = [
  { name: 'Rose', emoji: '🌸', bg: 'linear-gradient(135deg, #ffb0d0, #ffd6e8)' },
  { name: 'Matcha', emoji: '🍵', bg: 'linear-gradient(135deg, #b4f5a4, #d4ffd0)' },
  { name: 'Lavender', emoji: '💜', bg: 'linear-gradient(135deg, #d4b4ff, #e8d4ff)' },
  { name: 'Citrus', emoji: '🍋', bg: 'linear-gradient(135deg, #fff9b0, #fff5d0)' },
  { name: 'Berry', emoji: '🫐', bg: 'linear-gradient(135deg, #b0d4ff, #d0e8ff)' },
  { name: 'Caramel', emoji: '🍬', bg: 'linear-gradient(135deg, #ffd6a5, #ffe0b8)' },
];

export default function Macaron() {
  return (
    <div className={styles.page}>
      {/* CLOUDS */}
      <div className={styles.clouds} aria-hidden>
        <div className={styles.cloud} style={{ top: '5%', left: '10%', '--s': '1' } as React.CSSProperties} />
        <div className={styles.cloud} style={{ top: '8%', right: '15%', '--s': '0.8' } as React.CSSProperties} />
        <div className={styles.cloud} style={{ bottom: '20%', left: '5%', '--s': '0.6' } as React.CSSProperties} />
        <div className={styles.cloud} style={{ top: '50%', right: '8%', '--s': '0.9' } as React.CSSProperties} />
      </div>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandEmoji}>🧁</span>
          <span className={styles.brandName}>Macaron Dreams</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#">Menu</a>
          <a href="#">Flavors</a>
          <a href="#">About</a>
          <a href="#">Visit</a>
        </div>
        <div className={styles.navCart}>
          <button className={styles.cartBtn}>🛒 2</button>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>✨ SWEETEST IN TOWN ✨</div>
          <h1 className={styles.heroTitle}>
            <span className={styles.tPink}>Life</span>
            <span className={styles.tYellow}>is</span>
            <span className={styles.tLavender}>sweet</span>
            <span>when</span>
            <span className={styles.tMint}>you</span>
            <span className={styles.tBlue}>dream.</span>
          </h1>
          <p className={styles.heroLede}>
            Handcrafted macarons with love, layered with color, filled with joy. Every bite is a tiny cloud of happiness.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnPink}>🧁 ORDER NOW</button>
            <button className={styles.btnSoft}>VIEW MENU →</button>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroStack}>
            {FLAVORS.slice(0, 4).map((f, i) => (
              <div
                key={f.name}
                className={styles.heroMacaron}
                style={{
                  background: f.bg,
                  transform: `rotate(${(i - 1.5) * 12}deg) translateY(${i * 8}px)`,
                  zIndex: 4 - i,
                }}
              >
                <span className={styles.heroMacaronEmoji}>{f.emoji}</span>
                <span className={styles.heroMacaronName}>{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLAVOR TICKER */}
      <div className={styles.ticker}>
        <div className={styles.tickerInner}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles.tickerGroup}>
              {FLAVORS.map((f) => <span key={f.name}>{f.emoji} {f.name.toUpperCase()}</span>)}
              {FLAVORS.map((f) => <span key={`b-${f.name}`}>{f.emoji} {f.name.toUpperCase()}</span>)}
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className={styles.products}>
        <div className={styles.productsHead}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.tPink}>Today's</span>{' '}
            <span className={styles.tLavender}>Fresh</span>{' '}
            <span className={styles.tYellow}>Batch</span>{' '}
            <span>✨</span>
          </h2>
        </div>
        <div className={styles.productGrid}>
          {SWEETS.map((s) => (
            <div key={s.n} className={styles.product}>
              <div className={styles.productImg} style={{ background: `linear-gradient(135deg, ${s.c}, ${s.c}cc)` }}>
                <div className={styles.productFill} />
                <span className={styles.productEmoji}>🧁</span>
                {s.tag && <span className={styles.productTag}>{s.tag}</span>}
              </div>
              <div className={styles.productBody}>
                <div className={styles.productN}>{s.n}</div>
                <div className={styles.productFoot}>
                  <div className={styles.productPrice}>{s.p}</div>
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
          { n: '18', l: 'Flavors', e: '🎨' },
          { n: '10K+', l: 'Happy Bites', e: '😋' },
          { n: '★ 4.9', l: 'Reviews', e: '⭐' },
          { n: '100%', l: 'Made with Love', e: '💗' },
        ].map((s) => (
          <div key={s.l} className={styles.stat}>
            <div className={styles.statEmoji}>{s.e}</div>
            <div className={styles.statN}>{s.n}</div>
            <div className={styles.statL}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* BIG QUOTE */}
      <section className={styles.quote}>
        <div className={styles.quoteEmoji}>☁️</div>
        <p className={styles.quoteText}>
          "Happiness is a warm macaron on a rainy day."
        </p>
        <div className={styles.quoteAuthor}>— Chef Lune, 2026</div>
      </section>

      {/* FLAVORS RAIL */}
      <section className={styles.flavors}>
        <h2 className={styles.sectionTitle}>Our Flavors ✨</h2>
        <div className={styles.flavorRow}>
          {FLAVORS.map((f) => (
            <div key={f.name} className={styles.flavorCard}>
              <div className={styles.flavorIcon} style={{ background: f.bg }}>
                {f.emoji}
              </div>
              <div className={styles.flavorName}>{f.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          <span className={styles.tPink}>Sweet</span>{' '}
          <span className={styles.tLavender}>dreams</span>{' '}
          <span className={styles.tYellow}>await</span>{' '}
          <span>☁️</span>
        </h2>
        <p className={styles.ctaLede}>Join the Macaron Club — 15% off your first box + a free flavor sampler</p>
        <form className={styles.ctaForm} onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="your@email.com" className={styles.ctaInput} />
          <button className={styles.ctaBtn}>🧁 JOIN</button>
        </form>
      </section>

      <footer className={styles.foot}>
        <div>🧁 Macaron Dreams · Paris · Tokyo</div>
        <div>Made with 💗</div>
        <div>© 2026</div>
      </footer>
    </div>
  );
}
