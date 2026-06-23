'use client';
import styles from './tech.module.css';

const FEATURES = [
  { n: 'ΔLATENCY', v: '0.4ms', t: 'Avg response' },
  { n: '↑THROUGHPUT', v: '12.8 TB/s', t: 'Per cluster' },
  { n: '↑UPTIME', v: '99.997%', t: 'SLA guarantee' },
  { n: '◈NODES', v: '2,048', t: 'Global edge' },
];

const LOGS = [
  { ts: '14:23:01.004', l: 'INFO', m: 'edge-node-synced: na-east-1 → 2048 nodes OK' },
  { ts: '14:23:01.008', l: 'INFO', m: 'cert-renewal: *.tech.hub verified + issued' },
  { ts: '14:23:01.011', l: 'WARN', m: 'latency-spike: ap-south-1 (transient, resolved)' },
  { ts: '14:23:01.015', l: 'INFO', m: 'deploy-pipeline: v2.4.1 → canary 5% → stable' },
  { ts: '14:23:01.019', l: 'DEBUG', m: 'model-load: llm-core-v3 [12B params] ✓ 340ms' },
];

const HEX = ['◫', '◈', '◉', '◐', '▲', '●', '✦', '◻'];

export default function Tech() {
  return (
    <div className={styles.page}>
      {/* GRID BG */}
      <div className={styles.grid} aria-hidden />
      <div className={styles.vignette} aria-hidden />

      {/* HUD FRAME */}
      <div className={styles.hud}>
        {/* CORNER MARKS */}
        <span className={styles.corner} data-tl />
        <span className={styles.corner} data-tr />
        <span className={styles.corner} data-bl />
        <span className={styles.corner} data-br />
      </div>

      {/* TOP BAR */}
      <div className={styles.topbar}>
        <div className={styles.topLeft}>
          <span className={styles.topLogo}>◈</span>
          <span className={styles.topName}>TECH.HUB</span>
          <span className={styles.topSep}>|</span>
          <span className={styles.topSub}>v2.4.1</span>
        </div>
        <div className={styles.topMid}>
          {['DASHBOARD', 'SERVICES', 'NETWORK', 'LOGS', 'SETTINGS'].map((k, i) => (
            <span key={k} className={styles.topTab} data-active={i === 0}>{k}</span>
          ))}
        </div>
        <div className={styles.topRight}>
          <span className={styles.topDot} data-live />
          <span className={styles.topStatus}>LIVE · 2,048 NODES</span>
        </div>
      </div>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.kicker}>
            <span className={styles.hex}>{HEX[0]}</span>
            SYSTEM ONLINE · ALL SUBSYSTEMS NOMINAL
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.cyan}>BUILD</span>
            <br />
            <span className={styles.dim}>BEYOND</span>
            <br />
            <span className={styles.blue}>THE EDGE.</span>
          </h1>
          <div className={styles.heroBtns}>
            <button className={styles.btnCyan}>INITIALIZE →</button>
            <button className={styles.btnGhost}>VIEW DOCS</button>
          </div>
        </div>
        <div className={styles.heroRight}>
          {/* MAIN KPI GLASS CARD */}
          <div className={styles.kpiCard}>
            <div className={styles.kpiCardHeader}>
              <span>◈ CORE METRICS</span>
              <span className={styles.kpiLive}>● LIVE</span>
            </div>
            <div className={styles.kpiGrid}>
              {[
                { label: 'TOTAL REQUESTS', value: '847.3M', sub: '↑ 12.4%' },
                { label: 'P99 LATENCY', value: '0.4ms', sub: '↓ 8.1%' },
                { label: 'ERROR RATE', value: '0.001%', sub: '↓ 0.0003' },
                { label: 'UPTIME', value: '99.997%', sub: 'SLAs met' },
              ].map((k) => (
                <div key={k.label} className={styles.kpiCell}>
                  <div className={styles.kpiLabel}>{k.label}</div>
                  <div className={styles.kpiValue}>{k.value}</div>
                  <div className={styles.kpiSub}>{k.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MINI CHART */}
          <div className={styles.chartCard}>
            <div className={styles.chartHead}>◈ THROUGHPUT · 24H</div>
            <div className={styles.bars}>
              {[40, 55, 45, 70, 60, 80, 65, 90, 75, 85, 95, 88].map((h, i) => (
                <div key={i} className={styles.bar} style={{ '--h': `${h}%` } as React.CSSProperties} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className={styles.stats}>
        {FEATURES.map((f) => (
          <div key={f.n} className={styles.stat}>
            <div className={styles.statN}>{f.n}</div>
            <div className={styles.statV}>{f.v}</div>
            <div className={styles.statT}>{f.t}</div>
          </div>
        ))}
      </section>

      {/* LOGS */}
      <section className={styles.logs}>
        <div className={styles.logsHead}>
          <span>◈ SYSTEM LOG</span>
          <span className={styles.logsSep}>|</span>
          <span className={styles.logsCount}>5 entries · last 18s</span>
        </div>
        <div className={styles.logList}>
          {LOGS.map((l, i) => (
            <div key={i} className={styles.logRow}>
              <span className={styles.logTs}>{l.ts}</span>
              <span className={styles.logLevel} data-l={l.l}>{l.l}</span>
              <span className={styles.logMsg}>{l.m}</span>
            </div>
          ))}
        </div>
      </section>

      {/* NETWORK MAP */}
      <section className={styles.network}>
        <div className={styles.netHead}>◈ GLOBAL EDGE NODES</div>
        <div className={styles.netDots}>
          {[
            { region: 'NA-EAST', p: '98.2%', x: '20%', y: '35%' },
            { region: 'EU-WEST', p: '99.1%', x: '48%', y: '25%' },
            { region: 'AP-SOUTH', p: '97.8%', x: '70%', y: '55%' },
            { region: 'SA-EAST', p: '99.4%', x: '30%', y: '75%' },
            { region: 'AF-SOUTH', p: '98.7%', x: '55%', y: '70%' },
            { region: 'OC-SYD', p: '99.9%', x: '82%', y: '80%' },
          ].map((n) => (
            <div
              key={n.region}
              className={styles.netDot}
              style={{ left: n.x, top: n.y } as React.CSSProperties}
              title={`${n.region} · ${n.p}`}
            >
              <span className={styles.netDotRing} />
              <span className={styles.netDotLabel}>{n.region} · {n.p}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.foot}>
        <span>TECH.HUB v2.4.1 · © 2026 · 2,048 EDGE NODES · 99.997% UPTIME</span>
        <span className={styles.footDot}>●</span>
      </footer>
    </div>
  );
}
