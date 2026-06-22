'use client';
import { useEffect, useState } from 'react';
import styles from './terminal.module.css';

const FILES = [
  { d: 'drw', n: 'README.md', s: '2.4K' },
  { d: 'drw', n: 'package.json', s: '1.1K' },
  { d: 'fld', n: 'src/', s: '128' },
  { d: 'fld', n: 'docs/', s: '42' },
  { d: 'fld', n: 'tests/', s: '76' },
  { d: 'fld', n: '.config/', s: '6' },
  { d: 'fld', n: 'public/', s: '24' },
  { d: 'fld', n: 'scripts/', s: '11' },
  { d: 'fil', n: 'index.tsx', s: '8.8K' },
  { d: 'fil', n: 'use-cli.ts', s: '3.2K' },
  { d: 'fil', n: 'renderer.ts', s: '12K' },
  { d: 'fil', n: 'ansi.ts', s: '4.6K' },
  { d: 'fil', n: 'theme.css', s: '2.1K' },
  { d: 'fil', n: 'plugin.lua', s: '7.4K' },
];

const HISTORY = [
  { c: '$', t: 'whoami', o: 'nexus@motus.dev' },
  { c: '$', t: 'cat motus.json | jq .role', o: '"principal engineer"' },
  { c: '$', t: 'ls -la ./projects', o: 'drwxr-xr-x  nexus  nexus' },
  { c: '$', t: 'build --watch --turbopack', o: '✓ ready in 87ms' },
];

const STATS = [
  { n: '1,287', l: 'COMMITS' },
  { n: '142', l: 'PLUGINS' },
  { n: '12y', l: 'EXPERIENCE' },
  { n: '99.9%', l: 'UPTIME' },
];

const ROBOT = `       ┌─────────┐
       │  ◉   ◉  │
       │    ▽    │
       │  ╰─────╯  │
       └──┬───┬──┘
          │ ▮ │
          ╰───╯`;

function useTypewriter(text: string, speed = 35) {
  const [out, setOut] = useState('');
  useEffect(() => {
    let i = 0;
    setOut('');
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

export default function Terminal() {
  const typed = useTypewriter('nexus@motus ~ $ ', 60);
  const [prompt, setPrompt] = useState('');
  useEffect(() => {
    const cycle = ['run --build', 'test --watch', 'deploy prod', 'git push', 'help'];
    let i = 0;
    const id = setInterval(() => {
      setPrompt(cycle[i % cycle.length]);
      i++;
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.scan} aria-hidden />
      <div className={styles.vignette} aria-hidden />

      {/* TOP BAR */}
      <div className={styles.topbar}>
        <div className={styles.dots}>
          <span data-r /><span data-y /><span data-g />
        </div>
        <div className={styles.title}>nexus@motus — zsh — 80×24</div>
        <div className={styles.status}>● ONLINE</div>
      </div>

      <div className={styles.body}>
        {/* SIDEBAR (FILE TREE) */}
        <aside className={styles.sidebar}>
          <div className={styles.sideHeader}>
            <span>┌─ EXPLORER</span>
            <span className={styles.kbd}>⌘E</span>
          </div>
          <ul className={styles.tree}>
            {FILES.map((f, i) => (
              <li key={f.n} className={styles.treeItem} style={{ animationDelay: `${i * 0.05}s` }}>
                <span className={styles.treeIcon}>
                  {f.d === 'fld' ? '▸' : f.d === 'fil' ? '·' : '◉'}
                </span>
                <span className={styles.treeName}>{f.n}</span>
                <span className={styles.treeSize}>{f.s}</span>
              </li>
            ))}
          </ul>
          <div className={styles.treeFoot}>
            <div>14 items · 4 dirs</div>
            <div>branch: main ⎇</div>
          </div>
        </aside>

        {/* MAIN */}
        <main className={styles.main}>
          {/* BANNER */}
          <div className={styles.banner}>
            <pre className={styles.ascii}>{ROBOT}</pre>
            <div className={styles.bannerRight}>
              <div className={styles.bannerTitle}>MOTUS/CLI <span>v3.14.0</span></div>
              <div className={styles.bannerLede}>
                a tiny shell that ships pixels.<br />
                build · test · ship · vibe.
              </div>
            </div>
          </div>

          {/* TYPED PROMPT */}
          <div className={styles.promptLine}>
            <span className={styles.user}>nexus@motus</span>:<span className={styles.path}>~</span>${' '}
            <span className={styles.typed}>{typed}</span>
            <span className={styles.caret}>▌</span>
          </div>

          {/* LIVE PROMPT */}
          <div className={styles.promptLine} data-live>
            <span className={styles.dollar}>$</span>
            <span className={styles.live} key={prompt}>{prompt}</span>
            <span className={styles.caret} data-fast>▌</span>
          </div>

          {/* HISTORY */}
          <div className={styles.history}>
            {HISTORY.map((h, i) => (
              <div key={i} className={styles.histRow}>
                <span className={styles.dollar}>{h.c}</span>
                <span className={styles.histCmd}>{h.t}</span>
                <span className={styles.histOut}>{h.o}</span>
              </div>
            ))}
          </div>

          {/* STATS */}
          <div className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.l} className={styles.stat}>
                <div className={styles.statN}>{s.n}</div>
                <div className={styles.statL}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* KEYBOARD SHORTCUTS */}
          <div className={styles.keys}>
            <div className={styles.keysHead}>// key bindings</div>
            <div className={styles.keysGrid}>
              {[
                { k: '⌘ K', d: 'command palette' },
                { k: '⌘ P', d: 'quick open' },
                { k: '⌘ /', d: 'toggle comment' },
                { k: '⌥ ↑', d: 'multicursor' },
                { k: '⌘ ⇧ P', d: 'run task' },
                { k: '⌃ `', d: 'open terminal' },
              ].map((kk) => (
                <div key={kk.k} className={styles.kRow}>
                  <span className={styles.kKey}>{kk.k}</span>
                  <span className={styles.kDot}>·················</span>
                  <span className={styles.kDesc}>{kk.d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM PROMPT */}
          <div className={styles.promptLine} data-bottom>
            <span className={styles.user}>nexus@motus</span>:<span className={styles.path}>~/projects/motus</span>${' '}
            <span className={styles.typed}>_</span>
            <span className={styles.caret}>▌</span>
          </div>
        </main>
      </div>
    </div>
  );
}
