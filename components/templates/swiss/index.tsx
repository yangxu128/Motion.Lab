'use client';
import styles from './swiss.module.css';

const ARTICLES = [
  { n: '01', t: 'On the Grid', a: 'Müller-Brockmann', d: 'A twelve-column argument for clarity. The grid is not a cage — it is a contract between form and meaning.', cat: 'Theory' },
  { n: '02', t: 'The Last Sans-Serif', a: 'Helvetica Now', d: 'Fifty years of neutrality. From Zürich signs to New York subway, the typeface that refused to speak.', cat: 'Typography' },
  { n: '03', t: 'White Space, Loud', a: 'Emil Ruder', d: 'Silence is not empty. White space is a positive element, a load-bearing member of the page.', cat: 'Essay' },
  { n: '04', t: 'Number, Form', a: 'Karl Gerstner', d: 'Programmatic design before computers. Variables, modules, systems — design as reproducible thought.', cat: 'Systems' },
];

const STATS = [
  { n: '12', l: 'Columns' },
  { n: '8pt', l: 'Baseline' },
  { n: '1.4', l: 'Leading' },
  { n: '∞', l: 'Whitespace' },
];

export default function Swiss() {
  return (
    <div className={styles.page}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <span className={styles.navLogo}>●</span>
          <span className={styles.navWord}>GRID</span>
          <span className={styles.navSub}>/ QUARTERLY Nº 142</span>
        </div>
        <div className={styles.navLinks}>
          <a>Index</a>
          <a>Articles</a>
          <a>Archive</a>
          <a>Subscribe</a>
        </div>
      </nav>

      {/* ISSUE BAND */}
      <div className={styles.issueBand}>
        <div className={styles.issueItem}>
          <span className={styles.issueLabel}>Issue</span>
          <span className={styles.issueValue}>Vol. 24 / 02</span>
        </div>
        <div className={styles.issueItem}>
          <span className={styles.issueLabel}>Theme</span>
          <span className={styles.issueValue}>Form follows function</span>
        </div>
        <div className={styles.issueItem}>
          <span className={styles.issueLabel}>Filed under</span>
          <span className={styles.issueValue}>Design · Theory</span>
        </div>
        <div className={styles.issueItem}>
          <span className={styles.issueLabel}>2026</span>
        </div>
      </div>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroKicker}>→ Feature</div>
          <h1 className={styles.heroTitle}>
            <span>The</span>
            <span>Discipline</span>
            <span>of</span>
            <span data-red>Restraint.</span>
          </h1>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroMeta}>
            <div className={styles.heroMetaRow}>
              <span className={styles.metaLabel}>Author</span>
              <span className={styles.metaValue}>Anna Müller</span>
            </div>
            <div className={styles.heroMetaRow}>
              <span className={styles.metaLabel}>Date</span>
              <span className={styles.metaValue}>23.06.2026</span>
            </div>
            <div className={styles.heroMetaRow}>
              <span className={styles.metaLabel}>Reading</span>
              <span className={styles.metaValue}>14 min</span>
            </div>
          </div>
          <p className={styles.heroLede}>
            Swiss design is not a style. It is a position. A refusal to decorate, an insistence on the object itself — its function, its grid, its type. From Zürich in the fifties to your screen today, the discipline of restraint remains the most difficult thing to practice.
          </p>
          <div className={styles.heroCta}>
            <button className={styles.btnSolid}>Read article →</button>
            <button className={styles.btnGhost}>Download PDF</button>
          </div>
        </div>
      </section>

      {/* BIG STATS BAR */}
      <section className={styles.statsBar}>
        {STATS.map((s) => (
          <div key={s.l} className={styles.statCell}>
            <div className={styles.statN}>{s.n}</div>
            <div className={styles.statL}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* ARTICLES GRID */}
      <section className={styles.articles}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionNum}>02 —</div>
          <h2 className={styles.sectionTitle}>Selected Articles</h2>
        </div>
        <div className={styles.articleGrid}>
          {ARTICLES.map((a) => (
            <article key={a.n} className={styles.article}>
              <div className={styles.articleHead}>
                <span className={styles.articleN}>{a.n}</span>
                <span className={styles.articleCat}>{a.cat}</span>
              </div>
              <h3 className={styles.articleTitle}>{a.t}</h3>
              <div className={styles.articleAuthor}>{a.a}</div>
              <p className={styles.articleDesc}>{a.d}</p>
              <a className={styles.articleMore}>Read →</a>
            </article>
          ))}
        </div>
      </section>

      {/* TWO COLUMN QUOTE */}
      <section className={styles.quote}>
        <div className={styles.quoteCol}>
          <div className={styles.quoteLabel}>Statement</div>
        </div>
        <div className={styles.quoteCol} data-main>
          <p className={styles.quoteText}>
            "Less, but better."<br />
            The shortest possible defense of design.
          </p>
          <div className={styles.quoteAuthor}>— Dieter Rams</div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className={styles.marquee}>
        <div className={styles.marqueeInner}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles.marqueeGroup}>
              {['FUNCTION', '·', 'GRID', '·', 'CLARITY', '·', 'SYSTEMS', '·', 'NEUTRAL', '·', 'OBJECTIVE', '·', 'FORM', '·', 'RHYTHM', '·'].map((w, j) => (
                <span key={`${i}-${j}`}>{w}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SUBSCRIBE */}
      <section className={styles.subscribe}>
        <div>
          <div className={styles.subLabel}>Subscribe</div>
          <h2 className={styles.subTitle}>One essay, every Sunday.</h2>
        </div>
        <form className={styles.subForm} onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="your@email.com" className={styles.subInput} />
          <button className={styles.subBtn}>Subscribe →</button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className={styles.foot}>
        <div>© 2026 GRID Quarterly · Zürich · New York</div>
        <div>ISSN 1234-5678</div>
        <div>Set in Helvetica · Printed on the web</div>
      </footer>
    </div>
  );
}
