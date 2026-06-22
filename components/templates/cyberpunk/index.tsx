'use client';
import styles from './cyberpunk.module.css';

const tracks = [
  { n: 'NEON_KNIFE', a: 'GRID//9', t: '03:42', hue: 320, c: 'rgba(255, 0, 168, 0.6)' },
  { n: 'HOLO_RIOT', a: 'VAPOR/SIX', t: '04:15', hue: 180, c: 'rgba(0, 255, 255, 0.6)' },
  { n: 'CYBER_LULL', a: 'KOGARASHI', t: '05:08', hue: 280, c: 'rgba(139, 0, 255, 0.6)' },
  { n: 'STREETCODE', a: 'NULL.PTR', t: '02:54', hue: 30, c: 'rgba(255, 200, 0, 0.6)' },
  { n: 'CHROMA_WIRE', a: 'ACIDWAVE', t: '06:12', hue: 200, c: 'rgba(0, 200, 255, 0.6)' },
];

export default function Cyberpunk() {
  return (
    <div className={styles.page}>
      <div className={styles.scan} aria-hidden />
      <div className={styles.noise} aria-hidden />
      <div className={styles.grid} aria-hidden />

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandBox}>://NEXUS_88</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#">CHANNELS</a><a href="#">STREAMS</a><a href="#">NETWORK</a><a href="#">JOBS</a>
        </div>
        <div className={styles.navRight}>
          <span className={styles.signal}>●●●</span>
          <span className={styles.zone}>CHIBA-7</span>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLabel}>
          <span className={styles.dot} />
          <span>LIVE NOW · CHIBA 2077 · 3.2M LISTENERS</span>
        </div>
        <h1 className={styles.title}>
          <span data-text="WAKE">WAKE</span>
          <br />
          <span data-text="THE">THE</span>
          <span data-text="FREQ" className={styles.accent}>FREQ</span>
        </h1>
        <p className={styles.heroLede}>
          Underground music · Neural mixes · Live in 7 cities.<br />
          <span className={styles.blink}>▌</span> <span className={styles.danger}>! WARNING</span> // 24/7 RAW SIGNAL
        </p>
        <div className={styles.heroBtns}>
          <button className={styles.btnPrimary}>▶ TUNE IN</button>
          <button className={styles.btnGhost}>VIEW LINEUP</button>
        </div>
      </section>

      {/* TICKER */}
      <div className={styles.ticker}>
        <div className={styles.tickerInner}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles.tickerGroup}>
              <span>◆ NEW DROP // GRID//9 - NEON_KNIFE</span>
              <span>◆ LIVE 24/7</span>
              <span>◆ 3.2M USERS</span>
              <span>◆ TOKYO · BERLIN · CHIBA · SEOUL</span>
              <span>◆ SIGNAL STABLE</span>
            </div>
          ))}
        </div>
      </div>

      {/* NOW PLAYING */}
      <section className={styles.player}>
        <div className={styles.playerLeft}>
          <div className={styles.cover} style={{ '--c1': 'hsl(320 100% 60%)', '--c2': 'hsl(280 100% 50%)' } as React.CSSProperties}>
            <span>NK</span>
            <div className={styles.coverBars} aria-hidden>
              {Array.from({ length: 24 }).map((_, i) => <span key={i} style={{ animationDelay: `${i * 0.05}s` }} />)}
            </div>
          </div>
          <div>
            <div className={styles.playerLabel}>NOW PLAYING</div>
            <div className={styles.playerTitle}>NEON_KNIFE</div>
            <div className={styles.playerArtist}>GRID//9</div>
          </div>
        </div>
        <div className={styles.playerMid}>
          <div className={styles.waveform} aria-hidden>
            {Array.from({ length: 64 }).map((_, i) => (
              <span key={i} style={{ height: `${20 + Math.abs(Math.sin(i * 0.5) * 60) + Math.random() * 20}%`, animationDelay: `${i * 0.02}s` }} />
            ))}
          </div>
          <div className={styles.playerTime}>
            <span>02:14</span>
            <div className={styles.progress}><div /></div>
            <span>03:42</span>
          </div>
        </div>
        <div className={styles.playerRight}>
          <button className={styles.pBtn}>⏮</button>
          <button className={styles.pBtnMain}>⏸</button>
          <button className={styles.pBtn}>⏭</button>
        </div>
      </section>

      {/* TRACK LIST */}
      <section className={styles.tracks}>
        <h2 className={styles.sectionTitle}>// CHANNEL 01 · TRACKS</h2>
        <div className={styles.trackList}>
          {tracks.map((t, i) => (
            <div key={t.n} className={styles.track} data-playing={i === 0} style={{ '--glow': t.c } as React.CSSProperties}>
              <span className={styles.trackN}>{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.trackMid}>
                <div className={styles.trackName}>{t.n}</div>
                <div className={styles.trackArtist}>{t.a}</div>
              </div>
              <div className={styles.trackBars} aria-hidden>
                {Array.from({ length: 8 }).map((_, j) => <span key={j} style={{ animationDelay: `${j * 0.1}s` }} />)}
              </div>
              <div className={styles.trackTime}>{t.t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className={styles.stats}>
        {[
          { n: '3.2M', l: 'ACTIVE LISTENERS' },
          { n: '24/7', l: 'BROADCAST' },
          { n: '180+', l: 'ARTISTS' },
          { n: '7', l: 'CITIES' },
        ].map((s) => (
          <div key={s.l} className={styles.stat}>
            <div className={styles.statN}>{s.n}</div>
            <div className={styles.statL}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          JACK<br/>IN →
        </h2>
        <button className={styles.btnPrimary}>▶ ENTER THE NETWORK</button>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div>// NEXUS_88 · 2077</div>
        <div className={styles.danger}>! ROOT ACCESS · UNAUTH</div>
        <div>SIG:STABLE · 88.8 MHz</div>
      </footer>
    </div>
  );
}
