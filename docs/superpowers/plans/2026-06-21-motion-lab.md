# Motion.Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Chinese-language web animation reference site (Motion.Lab) showcasing 40 curated CSS/JS effects, with code copy + parameter playground, deployed on Vercel.

**Architecture:** Next.js 15 App Router site with static generation. Effect metadata in `data/effects.ts`; each effect is a self-contained React preview under `components/effects/<id>/`. State (search/filter/drawer) is encoded in URL search params.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, GSAP 3, Framer Motion 11, Lenis, Three.js, lottie-react, shiki, Vitest, Playwright, Vercel.

**Reference Spec:** [2026-06-21-motion-lab-design.md](../specs/2026-06-21-motion-lab-design.md)

**Note on effect implementation:** For each of the four effect categories, we show ONE fully detailed example, then implement the remaining effects in the same category using the EXACT same pattern (replace names, params, colors). The pattern is `PreviewFrame + CSS module + index.tsx with params-driven styles via CSS custom properties`.

---

## Task 1: Project Scaffold

**Files:** `package.json`, `tsconfig.json`, `next.config.mjs`, `.gitignore`, `vitest.config.ts`, `playwright.config.ts`, `tests/setup.ts`

- [ ] **Step 1: Init project + install dependencies**

```bash
cd /workspace
npx create-next-app@latest . --typescript --eslint --app --no-tailwind --src-dir false --import-alias "@/*" --use-npm
# Answer 'No' to all extras if prompted
npm install gsap framer-motion @studio-freight/lenis three @react-three/fiber @react-three/drei lottie-react shiki
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @playwright/test
```

- [ ] **Step 2: `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { optimizePackageImports: ['framer-motion', 'gsap', '@react-three/drei'] },
};
export default nextConfig;
```

- [ ] **Step 4: `vitest.config.ts` + `tests/setup.ts`**

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./tests/setup.ts'], include: ['tests/unit/**/*.test.{ts,tsx}'] },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
```

`tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: true, reporter: 'list',
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'npm run build && npm start', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
```

- [ ] **Step 6: `.gitignore` additions**

```
coverage/
playwright-report/
test-results/
.vercel
```

- [ ] **Step 7: Add npm scripts to `package.json`**

Add to `scripts`:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "test:e2e:install": "playwright install --with-deps chromium"
}
```

- [ ] **Step 8: Verify dev server**

```bash
npm run dev &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
kill %1
```

Expected: `200`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold next.js project with vitest + playwright"
```

---

## Task 2: Global Styles & Infrastructure

**Files:** `app/globals.css`, `app/layout.tsx`, `lib/reduced-motion.ts`, `components/site/HSLBackground.{tsx,module.css}`, `components/site/DotGrid.{tsx,module.css}`

- [ ] **Step 1: `lib/reduced-motion.ts`**

```ts
'use client';
import { useEffect, useState } from 'react';
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return reduced;
}
```

- [ ] **Step 2: `components/site/HSLBackground.module.css`**

```css
.bg { position: fixed; inset: 0; z-index: -2; background: linear-gradient(120deg, hsl(var(--h1, 20) 90% 70%), hsl(var(--h2, 180) 90% 70%), hsl(var(--h3, 320) 90% 70%)); background-size: 300% 300%; animation: shift 18s ease-in-out infinite; filter: saturate(1.05); opacity: 0.55; pointer-events: none; }
@keyframes shift { 0%, 100% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } }
@media (prefers-reduced-motion: reduce) { .bg { animation: none; } }
```

- [ ] **Step 3: `components/site/HSLBackground.tsx`**

```tsx
import styles from './HSLBackground.module.css';
export function HSLBackground() { return <div className={styles.bg} aria-hidden />; }
```

- [ ] **Step 4: `components/site/DotGrid.module.css`**

```css
.dots { position: fixed; inset: 0; z-index: -1; background-image: radial-gradient(circle at 1px 1px, rgba(10,10,10,0.18) 1px, transparent 0); background-size: 24px 24px; pointer-events: none; mix-blend-mode: multiply; }
```

- [ ] **Step 5: `components/site/DotGrid.tsx`**

```tsx
import styles from './DotGrid.module.css';
export function DotGrid() { return <div className={styles.dots} aria-hidden />; }
```

- [ ] **Step 6: `app/globals.css`**

```css
:root {
  --bg: #fafafa; --fg: #0a0a0a; --muted: #6b6b6b; --card: #ffffff;
  --border: rgba(10,10,10,0.08); --accent-h: 280; --accent: hsl(var(--accent-h) 90% 60%);
  --radius-card: 24px; --radius-pill: 999px; --shadow-card: 0 8px 24px rgba(10,10,10,0.06);
  --font-display: var(--font-geist), 'Inter Display', system-ui, sans-serif;
  --font-body: var(--font-geist), system-ui, sans-serif;
  --font-mono: var(--font-mono, 'JetBrains Mono'), monospace;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--bg); color: var(--fg); font-family: var(--font-body); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
body { min-height: 100vh; }
a { color: inherit; text-decoration: none; }
button { font-family: inherit; }
h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 900; letter-spacing: -0.03em; line-height: 0.95; margin: 0; }
::selection { background: var(--accent); color: white; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }
```

- [ ] **Step 7: `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import { HSLBackground } from '@/components/site/HSLBackground';
import { DotGrid } from '@/components/site/DotGrid';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Motion.Lab — 动效实验室',
  description: '40 个精选动效的中文参考站,支持调参与代码复制',
  metadataBase: new URL('https://motion-lab.vercel.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geist.variable} ${mono.variable}`}>
      <body><HSLBackground /><DotGrid />{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Placeholder `app/page.tsx`**

```tsx
export default function Home() { return <main style={{ padding: 64 }}><h1>Motion.Lab</h1></main>; }
```

- [ ] **Step 9: Build + commit**

```bash
npm run build
git add -A
git commit -m "feat: global styles, HSL background, dot-grid, fonts"
```

---

## Task 3: Site Shell (Header + Footer)

**Files:** `components/site/SiteHeader.{tsx,module.css}`, `components/site/SiteFooter.{tsx,module.css}`, modify `app/layout.tsx`

- [ ] **Step 1: `SiteHeader.module.css`**

```css
.header { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: rgba(250,250,250,0.7); backdrop-filter: saturate(180%) blur(12px); -webkit-backdrop-filter: saturate(180%) blur(12px); border-bottom: 1px solid var(--border); }
.logo { font-family: var(--font-display); font-weight: 900; font-size: 20px; letter-spacing: -0.03em; display: flex; align-items: center; gap: 8px; }
.dot { width: 10px; height: 10px; border-radius: 50%; background: hsl(var(--accent-h) 90% 60%); display: inline-block; animation: pulse 2.5s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.4); } }
.nav { display: flex; gap: 24px; font-size: 14px; font-weight: 500; }
.nav a { opacity: 0.6; transition: opacity 0.2s; }
.nav a:hover, .nav a[data-active='true'] { opacity: 1; }
```

- [ ] **Step 2: `SiteHeader.tsx`**

```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SiteHeader.module.css';
export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}><span className={styles.dot} aria-hidden />Motion.Lab</Link>
      <nav className={styles.nav}>
        <Link href="/" data-active={pathname === '/'}>首页</Link>
        <Link href="/lab" data-active={pathname?.startsWith('/lab')}>实验室</Link>
      </nav>
    </header>
  );
}
```

- [ ] **Step 3: `SiteFooter.module.css` + `SiteFooter.tsx`**

```css
/* SiteFooter.module.css */
.footer { padding: 48px 32px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: var(--muted); flex-wrap: wrap; gap: 16px; }
.footer a { text-decoration: underline; }
```

```tsx
// SiteFooter.tsx
import styles from './SiteFooter.module.css';
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span>© 2026 Motion.Lab — 为中文开发者打造</span>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
    </footer>
  );
}
```

- [ ] **Step 4: Wire into `app/layout.tsx`** — add imports and wrap body children with `<SiteHeader />` and `<SiteFooter />`.

- [ ] **Step 5: Verify + commit**

```bash
npm run build && git add -A && git commit -m "feat: site header and footer"
```

---

## Task 4: URL State Library

**Files:** `lib/url-state.ts`, `tests/unit/url-state.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/unit/url-state.test.ts
import { describe, it, expect } from 'vitest';
import { parseFilter, toQueryString } from '@/lib/url-state';

describe('url-state', () => {
  it('parses empty params to defaults', () => {
    expect(parseFilter(new URLSearchParams(''))).toEqual({ q: '', cat: 'all', open: null, panel: null });
  });
  it('parses present params', () => {
    const p = new URLSearchParams('q=foo&cat=text&open=fade-in&panel=code');
    expect(parseFilter(p)).toEqual({ q: 'foo', cat: 'text', open: 'fade-in', panel: 'code' });
  });
  it('rejects unknown categories', () => {
    expect(parseFilter(new URLSearchParams('cat=bogus')).cat).toBe('all');
  });
  it('round-trips through toQueryString', () => {
    expect(toQueryString({ q: 'hi', cat: 'basic', open: null, panel: null })).toBe('?q=hi&cat=basic');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- url-state
```
Expected: FAIL.

- [ ] **Step 3: Implement `lib/url-state.ts`**

```ts
export type Category = 'all' | 'basic' | 'text' | 'interaction' | 'advanced';
export type PanelKind = 'code' | 'params';
export interface FilterState { q: string; cat: Category; open: string | null; panel: PanelKind | null; }
const VALID_CATS: Category[] = ['all', 'basic', 'text', 'interaction', 'advanced'];
const VALID_PANELS: PanelKind[] = ['code', 'params'];
export function parseFilter(p: URLSearchParams): FilterState {
  const cat = p.get('cat'); const panel = p.get('panel');
  return {
    q: p.get('q') ?? '',
    cat: VALID_CATS.includes(cat as Category) ? (cat as Category) : 'all',
    open: p.get('open'),
    panel: VALID_PANELS.includes(panel as PanelKind) ? (panel as PanelKind) : null,
  };
}
export function toQueryString(state: Partial<FilterState>): string {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  if (state.cat && state.cat !== 'all') p.set('cat', state.cat);
  if (state.open) p.set('open', state.open);
  if (state.panel) p.set('panel', state.panel);
  const s = p.toString();
  return s ? `?${s}` : '';
}
```

- [ ] **Step 4: Run test, expect PASS, then commit**

```bash
npm test -- url-state && git add -A && git commit -m "feat: url-state library with tests"
```

---

## Task 5: Shiki + Reduced Motion + Shuffle Libs

**Files:** `lib/code-highlight.ts`, `lib/shuffle.ts`

- [ ] **Step 1: `lib/code-highlight.ts`**

```ts
import { createHighlighter, type Highlighter } from 'shiki';
let p: Promise<Highlighter> | null = null;
function getH() { if (!p) p = createHighlighter({ themes: ['github-light'], langs: ['html', 'css', 'javascript', 'typescript'] }); return p; }
export async function highlight(code: string, lang: 'html' | 'css' | 'javascript' | 'typescript') {
  const hl = await getH();
  return hl.codeToHtml(code, { lang, theme: 'github-light' });
}
```

- [ ] **Step 2: `lib/shuffle.ts`** (used by Featured)

```ts
export function shuffle<T>(arr: T[], seed: number = Date.now()): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: shiki highlighter + shuffle lib"
```

---

## Task 6: Data Layer (40 effects metadata)

**Files:** `data/effects.ts`, `components/effects/_shared/PreviewFrame.{tsx,module.css}`

- [ ] **Step 1: `PreviewFrame.module.css`**

```css
.frame { position: relative; width: 100%; height: 100%; min-height: 200px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1)), repeating-conic-gradient(rgba(0,0,0,0.04) 0% 25%, transparent 0% 50%) 0 0 / 16px 16px; border-radius: 16px; overflow: hidden; isolation: isolate; }
```

- [ ] **Step 2: `PreviewFrame.tsx`**

```tsx
import type { CSSProperties, ReactNode } from 'react';
import styles from './PreviewFrame.module.css';
export function PreviewFrame({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className={styles.frame} style={style}>{children}</div>;
}
```

- [ ] **Step 3: Create `data/effects.ts` with types + ALL 40 entries**

The data file is generated by a Node.js script in **Appendix A** at the end of this plan. Run:

```bash
mkdir -p scripts
# Create scripts/gen-effects.mjs (see Appendix A for the full 200-line script)
node scripts/gen-effects.mjs
```

Expected: prints `Generated data/effects.ts with 40 effects.` and creates a ~700-line `data/effects.ts`.

- [ ] **Step 4: Verify build compiles**

```bash
npm run build 2>&1 | tail -10
```

Expected: build success. Dynamic imports will warn about missing modules but won't fail.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: effects data layer with 40 entries"
```

---

## Task 7: UI Atoms (Button, Tabs, Slider, CopyButton)

**Files:** `components/ui/{Button,Tabs,Slider,CopyButton}.{tsx,module.css}`

- [ ] **Step 1: All 4 components (combined)**

**Button.module.css:**

```css
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: var(--radius-pill); border: 1px solid var(--border); background: var(--card); color: var(--fg); font-weight: 600; font-size: 14px; cursor: pointer; transition: transform 0.15s, background 0.2s; white-space: nowrap; }
.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
.btn[data-variant='primary'] { background: var(--accent); color: white; border-color: transparent; }
.btn[data-variant='ghost'] { background: transparent; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
```

**Button.tsx:**

```tsx
import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';
export function Button({ variant = 'default', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'primary' | 'ghost' }) {
  return <button className={`${styles.btn} ${className ?? ''}`} data-variant={variant} {...rest} />;
}
```

**Tabs.module.css:**

```css
.tabs { display: inline-flex; padding: 4px; background: rgba(0,0,0,0.05); border-radius: var(--radius-pill); gap: 2px; }
.tab { padding: 6px 14px; border: none; background: transparent; border-radius: var(--radius-pill); font-weight: 600; font-size: 13px; cursor: pointer; color: var(--muted); transition: all 0.2s; }
.tab[data-active='true'] { background: var(--card); color: var(--fg); box-shadow: 0 1px 2px rgba(0,0,0,0.08); }
```

**Tabs.tsx:**

```tsx
'use client';
import styles from './Tabs.module.css';
export interface TabItem<T extends string> { value: T; label: string; }
export function Tabs<T extends string>({ items, value, onChange }: { items: TabItem<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className={styles.tabs} role="tablist">
      {items.map((it) => (
        <button key={it.value} role="tab" aria-selected={value === it.value} data-active={value === it.value} className={styles.tab} onClick={() => onChange(it.value)}>{it.label}</button>
      ))}
    </div>
  );
}
```

**Slider.module.css:**

```css
.wrap { display: flex; flex-direction: column; gap: 6px; }
.label { display: flex; justify-content: space-between; font-size: 13px; font-weight: 500; }
.label span:last-child { color: var(--muted); font-variant-numeric: tabular-nums; }
.input { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; background: rgba(0,0,0,0.1); border-radius: 2px; outline: none; }
.input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; background: var(--accent); border-radius: 50%; cursor: pointer; }
.input::-moz-range-thumb { width: 18px; height: 18px; background: var(--accent); border-radius: 50%; cursor: pointer; border: none; }
```

**Slider.tsx:**

```tsx
'use client';
import styles from './Slider.module.css';
export function Slider({ label, min, max, step, value, onChange, unit }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.label}><span>{label}</span><span>{value}{unit ?? ''}</span></div>
      <input className={styles.input} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}
```

**CopyButton.module.css:**

```css
.btn { padding: 6px 14px; border-radius: var(--radius-pill); border: 1px solid var(--border); background: var(--card); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn[data-done='true'] { background: hsl(140 80% 45%); color: white; border-color: transparent; }
```

**CopyButton.tsx:**

```tsx
'use client';
import { useState } from 'react';
import styles from './CopyButton.module.css';
export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className={styles.btn}
      data-done={done}
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }
        catch { /* fallback in CodePanel */ }
      }}
    >{done ? '✓ 已复制' : '复制'}</button>
  );
}
```

- [ ] **Step 2: Build + commit**

```bash
npm run build && git add -A && git commit -m "feat: UI atoms (Button, Tabs, Slider, CopyButton)"
```

---

## Task 8: Home Page (Hero, Manifesto, Featured, CTA)

**Files:** `components/home/{Hero,Manifesto,Featured,CTA}.{tsx,module.css}`, replace `app/page.tsx`

- [ ] **Step 1: `Hero.module.css`**

```css
.hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 120px 48px 80px; overflow: hidden; }
.title { font-size: clamp(72px, 14vw, 220px); letter-spacing: -0.05em; line-height: 0.88; }
.title span { display: inline-block; }
.subtitle { margin-top: 24px; font-size: clamp(18px, 2vw, 24px); color: var(--muted); max-width: 600px; }
.kicker { font-family: var(--font-mono); font-size: 13px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 32px; color: var(--muted); }
```

- [ ] **Step 2: `Hero.tsx`**

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Hero.module.css';
export function Hero() {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll('[data-char]');
    gsap.from(chars, { y: 100, opacity: 0, stagger: 0.04, duration: 1.2, ease: 'power4.out' });
  }, []);
  const text = '动效实验室';
  return (
    <section className={styles.hero}>
      <div className={styles.kicker}>Motion.Lab · 2026</div>
      <h1 ref={ref} className={styles.title}>
        {text.split('').map((c, i) => <span key={i} data-char>{c === ' ' ? '\u00A0' : c}</span>)}
      </h1>
      <p className={styles.subtitle}>40 个精选动效,可调参数,可复制代码。<br />为中文开发者打造的动效参考站。</p>
    </section>
  );
}
```

- [ ] **Step 3: `Manifesto.module.css` + `Manifesto.tsx`**

```css
/* Manifesto.module.css */
.section { padding: 120px 48px; }
.heading { font-size: clamp(48px, 8vw, 120px); margin-bottom: 80px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 32px; }
.card { padding: 32px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); box-shadow: var(--shadow-card); }
.card h3 { font-size: 48px; margin-bottom: 16px; }
.card p { color: var(--muted); line-height: 1.5; }
.num { font-family: var(--font-mono); font-size: 13px; color: var(--muted); margin-bottom: 24px; }
```

```tsx
// Manifesto.tsx
import styles from './Manifesto.module.css';
import { CATEGORIES } from '@/data/effects';
export function Manifesto() {
  const items = CATEGORIES.filter((c) => c.id !== 'all');
  const copy: Record<string, string> = {
    basic: '纯 CSS,无需 JS,五种缓动曲线覆盖 80% 场景。',
    text: '让文字本身成为主角,排版的呼吸感。',
    interaction: '鼠标是新的指尖,每一次悬停都是对话。',
    advanced: 'GSAP、Three.js、WebGL —— 当浏览器成为画布。',
  };
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>四种语言<br />四十种节奏</h2>
      <div className={styles.grid}>
        {items.map((c, i) => (
          <div key={c.id} className={styles.card}>
            <div className={styles.num}>0{i + 1} / {c.english}</div>
            <h3>{c.name}</h3>
            <p>{copy[c.id]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: `Featured.module.css` + `Featured.tsx`**

```css
/* Featured.module.css */
.section { padding: 80px 0; overflow: hidden; }
.heading { font-size: clamp(40px, 6vw, 80px); padding: 0 48px; margin-bottom: 48px; }
.track { display: flex; gap: 24px; padding: 0 48px; overflow-x: auto; scrollbar-width: none; cursor: grab; }
.track::-webkit-scrollbar { display: none; }
.item { flex: 0 0 320px; height: 200px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); display: flex; align-items: center; justify-content: center; font-size: 64px; box-shadow: var(--shadow-card); transition: transform 0.2s; }
.item:hover { transform: translateY(-4px); }
```

```tsx
// Featured.tsx
import Link from 'next/link';
import styles from './Featured.module.css';
import { EFFECTS } from '@/data/effects';
const PICKS = ['fade-in', 'gradient-text', 'magnetic-cursor', 'three-particles', 'glitch-text', 'marquee'];
export function Featured() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>精选</h2>
      <div className={styles.track}>
        {PICKS.map((id) => {
          const e = EFFECTS.find((x) => x.id === id)!;
          return <Link key={id} href={`/lab?open=${id}&panel=params`} className={styles.item}>{e.name}</Link>;
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: `CTA.module.css` + `CTA.tsx`**

```css
/* CTA.module.css */
.section { padding: 160px 48px; text-align: center; }
.big { font-size: clamp(64px, 12vw, 200px); margin-bottom: 48px; line-height: 0.9; }
```

```tsx
// CTA.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './CTA.module.css';
export function CTA() {
  return (
    <section className={styles.section}>
      <h2 className={styles.big}>进实验室</h2>
      <Link href="/lab"><Button variant="primary" style={{ fontSize: 18, padding: '16px 32px' }}>开始探索 →</Button></Link>
    </section>
  );
}
```

- [ ] **Step 6: Replace `app/page.tsx`**

```tsx
import { Hero } from '@/components/home/Hero';
import { Manifesto } from '@/components/home/Manifesto';
import { Featured } from '@/components/home/Featured';
import { CTA } from '@/components/home/CTA';
export default function Home() {
  return <main><Hero /><Manifesto /><Featured /><CTA /></main>;
}
```

- [ ] **Step 7: Build + commit**

```bash
npm run build && git add -A && git commit -m "feat: home page (Hero, Manifesto, Featured, CTA)"
```

---

## Task 9: Lab Page UI (Toolbar, EffectCard, EffectGrid, EmptyState, Drawer, ParamPanel, CodePanel)

**Files:** `components/lab/{Toolbar,EffectCard,EffectGrid,EmptyState,Drawer,ParamPanel,CodePanel}.{tsx,module.css}`, `app/lab/page.tsx`, `app/lab/[id]/{page,LabClient}.tsx`

- [ ] **Step 1: `EffectCard.module.css` + `EffectCard.tsx`**

```css
/* EffectCard.module.css */
.card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); overflow: hidden; box-shadow: var(--shadow-card); display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
.preview { aspect-ratio: 4 / 3; border-bottom: 1px solid var(--border); position: relative; }
.body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.title { font-size: 20px; font-weight: 700; }
.desc { font-size: 13px; color: var(--muted); line-height: 1.4; }
.actions { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
.tag { font-family: var(--font-mono); font-size: 11px; padding: 2px 8px; background: rgba(0,0,0,0.05); border-radius: 999px; }
```

```tsx
// EffectCard.tsx
'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Effect } from '@/data/effects';
import styles from './EffectCard.module.css';
export function EffectCard({ effect }: { effect: Effect }) {
  const [params] = useState<Record<string, any>>(() => {
    const p: Record<string, any> = {}; effect.params.forEach((p2) => (p[p2.key] = p2.default)); return p;
  });
  const [key, setKey] = useState(0);
  const [lastReplay, setLastReplay] = useState(0);
  const Preview = dynamic(effect.preview, { ssr: false, loading: () => <div style={{ opacity: 0.3 }}>…</div> });
  const replay = () => {
    if (Date.now() - lastReplay < 2000) return;
    setKey((k) => k + 1); setLastReplay(Date.now());
  };
  const openPanel = (panel: 'code' | 'params') => {
    const url = new URL(window.location.href);
    url.searchParams.set('open', effect.id); url.searchParams.set('panel', panel);
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  return (
    <div className={styles.card}>
      <div className={styles.preview} onMouseEnter={replay}><Preview key={key} params={params} /></div>
      <div className={styles.body}>
        <div>
          <div className={styles.title}>{effect.name}</div>
          <div className={styles.desc}>{effect.description}</div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {effect.tags.slice(0, 2).map((t) => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
        <div className={styles.actions}>
          <Button onClick={replay}>▶ 重播</Button>
          <Button onClick={() => openPanel('params')}>⚙ 调参</Button>
          <Button onClick={() => openPanel('code')}>{'</>'} 代码</Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `EffectGrid.module.css` + `EffectGrid.tsx`**

```css
/* EffectGrid.module.css */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; padding: 32px 48px; }
```

```tsx
// EffectGrid.tsx
import type { Effect } from '@/data/effects';
import { EffectCard } from './EffectCard';
import styles from './EffectGrid.module.css';
export function EffectGrid({ effects }: { effects: Effect[] }) {
  return <div className={styles.grid}>{effects.map((e) => <EffectCard key={e.id} effect={e} />)}</div>;
}
```

- [ ] **Step 3: `Toolbar.module.css` + `Toolbar.tsx`**

```css
/* Toolbar.module.css */
.toolbar { position: sticky; top: 56px; z-index: 40; padding: 24px 48px; background: rgba(250,250,250,0.85); backdrop-filter: saturate(180%) blur(12px); -webkit-backdrop-filter: saturate(180%) blur(12px); border-bottom: 1px solid var(--border); display: flex; flex-direction: column; gap: 16px; }
.row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.search { flex: 1; min-width: 200px; padding: 10px 16px; border: 1px solid var(--border); border-radius: var(--radius-pill); background: var(--card); font-size: 14px; outline: none; }
.count { font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
```

```tsx
// Toolbar.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { CATEGORIES } from '@/data/effects';
import styles from './Toolbar.module.css';
export function Toolbar({ count }: { count: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const cat = (params.get('cat') as any) || 'all';
  const q = params.get('q') || '';
  const setParam = useCallback((key: string, value: string | null) => {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value); else p.delete(key);
    router.replace(`/lab?${p.toString()}`);
  }, [params, router]);
  return (
    <div className={styles.toolbar}>
      <div className={styles.row}>
        <input className={styles.search} placeholder="搜索动效、标签…" defaultValue={q} onChange={(e) => setParam('q', e.target.value || null)} />
        <span className={styles.count}>{count} 个</span>
      </div>
      <div className={styles.row}>
        <Tabs items={CATEGORIES.map((c) => ({ value: c.id, label: c.name }))} value={cat} onChange={(v) => setParam('cat', v === 'all' ? null : v)} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: `EmptyState.module.css` + `EmptyState.tsx`**

```css
/* EmptyState.module.css */
.empty { padding: 120px 48px; text-align: center; }
.empty h2 { font-size: 48px; margin-bottom: 16px; }
.empty p { color: var(--muted); margin-bottom: 32px; }
```

```tsx
// EmptyState.tsx
'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import styles from './EmptyState.module.css';
export function EmptyState() {
  const router = useRouter();
  return (
    <div className={styles.empty}>
      <h2>没找到</h2>
      <p>试试清除筛选条件。</p>
      <Button variant="primary" onClick={() => router.replace('/lab')}>清除筛选</Button>
    </div>
  );
}
```

- [ ] **Step 5: `Drawer.module.css` + `Drawer.tsx`**

```css
/* Drawer.module.css */
.scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); z-index: 100; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
.scrim[data-open='true'] { opacity: 1; pointer-events: auto; }
.drawer { position: fixed; top: 0; right: 0; height: 100vh; width: min(480px, 100vw); background: var(--card); z-index: 101; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; flex-direction: column; }
.drawer[data-open='true'] { transform: translateX(0); box-shadow: -16px 0 40px rgba(0,0,0,0.1); }
.header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.title { font-size: 18px; font-weight: 700; }
.close { background: none; border: none; font-size: 24px; cursor: pointer; }
.body { flex: 1; overflow-y: auto; padding: 24px; }
```

```tsx
// Drawer.tsx
'use client';
import { useEffect } from 'react';
import styles from './Drawer.module.css';
export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [open, onClose]);
  return (
    <>
      <div className={styles.scrim} data-open={open} onClick={onClose} />
      <aside className={styles.drawer} data-open={open} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.header}><span className={styles.title}>{title}</span><button className={styles.close} onClick={onClose} aria-label="关闭">×</button></div>
        <div className={styles.body}>{children}</div>
      </aside>
    </>
  );
}
```

- [ ] **Step 6: `ParamPanel.module.css` + `ParamPanel.tsx`**

```css
/* ParamPanel.module.css */
.panel { display: flex; flex-direction: column; gap: 20px; }
.preview { aspect-ratio: 4 / 3; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 16px; }
.params { display: flex; flex-direction: column; gap: 16px; padding: 20px; background: rgba(0,0,0,0.03); border-radius: 16px; }
```

```tsx
// ParamPanel.tsx
'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import type { Effect } from '@/data/effects';
import styles from './ParamPanel.module.css';
export function ParamPanel({ effect }: { effect: Effect }) {
  const [params, setParams] = useState<Record<string, any>>(() => {
    const p: Record<string, any> = {}; effect.params.forEach((p2) => (p[p2.key] = p2.default)); return p;
  });
  const Preview = dynamic(effect.preview, { ssr: false });
  const update = (k: string, v: any) => setParams((p) => ({ ...p, [k]: v }));
  return (
    <div className={styles.panel}>
      <div className={styles.preview}><Preview key={JSON.stringify(params)} params={params} /></div>
      <div className={styles.params}>
        {effect.params.map((param) => (
          param.kind === 'range' ? (
            <Slider key={param.key} label={param.label} min={param.min} max={param.max} step={param.step} value={params[param.key]} onChange={(v) => update(param.key, v)} unit={param.unit} />
          ) : (
            <div key={param.key}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{param.label}</div>
              <select value={params[param.key]} onChange={(e) => update(param.key, e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8 }}>
                {param.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: `CodePanel.module.css` + `CodePanel.tsx`**

```css
/* CodePanel.module.css */
.panel { display: flex; flex-direction: column; gap: 16px; }
.tabs { display: flex; justify-content: space-between; align-items: center; }
.code { background: #0a0a0a; color: #fafafa; padding: 16px; border-radius: 12px; font-family: var(--font-mono); font-size: 13px; line-height: 1.5; overflow-x: auto; max-height: 60vh; }
.code pre { margin: 0; white-space: pre-wrap; word-break: break-all; }
```

```tsx
// CodePanel.tsx
'use client';
import { useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { CopyButton } from '@/components/ui/CopyButton';
import type { Effect } from '@/data/effects';
import styles from './CodePanel.module.css';
type Lang = 'html' | 'css' | 'js';
const TABS: { value: Lang; label: string }[] = [{ value: 'html', label: 'HTML' }, { value: 'css', label: 'CSS' }, { value: 'js', label: 'JS' }];
export function CodePanel({ effect }: { effect: Effect }) {
  const [lang, setLang] = useState<Lang>('html');
  const code = lang === 'html' ? effect.code.html : lang === 'css' ? effect.code.css : effect.code.js;
  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        <Tabs items={TABS} value={lang} onChange={setLang} />
        <CopyButton text={code || `// 无需 ${lang.toUpperCase()}`} />
      </div>
      <div className={styles.code}><pre>{code || `// 无需 ${lang.toUpperCase()}`}</pre></div>
    </div>
  );
}
```

- [ ] **Step 8: `app/lab/page.tsx`**

```tsx
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import { EFFECTS } from '@/data/effects';
import { Toolbar } from '@/components/lab/Toolbar';
import { EffectGrid } from '@/components/lab/EffectGrid';
import { EmptyState } from '@/components/lab/EmptyState';
import { Drawer } from '@/components/lab/Drawer';
import { ParamPanel } from '@/components/lab/ParamPanel';
import { CodePanel } from '@/components/lab/CodePanel';

export default function LabPage() {
  const params = useSearchParams();
  const router = useRouter();
  const q = (params.get('q') || '').toLowerCase();
  const cat = params.get('cat') || 'all';
  const openId = params.get('open');
  const panel = params.get('panel') as 'code' | 'params' | null;

  const [, setTick] = useState(0);
  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener('popstate', h);
    return () => window.removeEventListener('popstate', h);
  }, []);

  const filtered = useMemo(() => EFFECTS.filter((e) => {
    if (cat !== 'all' && e.category !== cat) return false;
    if (q && !`${e.name} ${e.englishName} ${e.tags.join(' ')}`.toLowerCase().includes(q)) return false;
    return true;
  }), [q, cat]);

  const open = openId ? EFFECTS.find((e) => e.id === openId) : null;
  const close = () => {
    const p = new URLSearchParams(params.toString());
    p.delete('open'); p.delete('panel');
    router.replace(`/lab?${p.toString()}`);
  };

  return (
    <main>
      <Toolbar count={filtered.length} />
      {filtered.length === 0 ? <EmptyState /> : <EffectGrid effects={filtered} />}
      <Drawer open={!!open} onClose={close} title={open ? `${open.name} · ${open.englishName}` : ''}>
        {open && panel === 'code' && <CodePanel effect={open} />}
        {open && (panel === 'params' || !panel) && <ParamPanel effect={open} />}
      </Drawer>
    </main>
  );
}
```

- [ ] **Step 9: `app/lab/[id]/page.tsx` + `LabClient.tsx`**

`app/lab/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { EFFECTS } from '@/data/effects';
import { LabClient } from './LabClient';
export function generateStaticParams() { return EFFECTS.map((e) => ({ id: e.id })); }
export default async function EffectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const effect = EFFECTS.find((e) => e.id === id);
  if (!effect) notFound();
  return <LabClient id={id} />;
}
```

`app/lab/[id]/LabClient.tsx`:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { EFFECTS } from '@/data/effects';
import { Toolbar } from '@/components/lab/Toolbar';
import { EffectGrid } from '@/components/lab/EffectGrid';
import { Drawer } from '@/components/lab/Drawer';
import { ParamPanel } from '@/components/lab/ParamPanel';
import { CodePanel } from '@/components/lab/CodePanel';
export function LabClient({ id }: { id: string }) {
  const effect = EFFECTS.find((e) => e.id === id)!;
  const [panel, setPanel] = useState<'params' | 'code'>('params');
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setPanel((p.get('panel') as any) || 'params');
  }, []);
  return (
    <main>
      <Toolbar count={EFFECTS.length} />
      <EffectGrid effects={EFFECTS} />
      <Drawer open onClose={() => history.back()} title={`${effect.name} · ${effect.englishName}`}>
        {panel === 'code' ? <CodePanel effect={effect} /> : <ParamPanel effect={effect} />}
      </Drawer>
    </main>
  );
}
```

- [ ] **Step 10: Build + commit**

```bash
npm run build && git add -A && git commit -m "feat: lab page (toolbar/grid/card/drawer/param/code) + effect detail"
```

---

## Task 10: Basic CSS Animations (12 effects)

**Files:** `components/effects/<id>/{index.tsx,*.module.css}` for 12 ids: `fade-in`, `fade-in-up`, `slide-in-left`, `slide-in-right`, `zoom-bounce`, `flip-x`, `rotate-in`, `pulse`, `shake`, `heartbeat`, `marquee`, `spinner`

- [ ] **Step 1: Detailed example — `fade-in`**

`fade-in.module.css`:

```css
.box { padding: 24px 32px; background: hsl(280 90% 60%); color: white; border-radius: 12px; font-weight: 700; animation: fadeIn var(--duration, 0.8s) ease-out var(--delay, 0s) both; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
```

`fade-in/index.tsx`:

```tsx
'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './fade-in.module.css';
export default function FadeIn({ params }: { params: { duration: number; delay: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s`, ['--delay' as any]: `${params.delay}s` }}>Fade In</div>
    </PreviewFrame>
  );
}
```

- [ ] **Step 2: `fade-in-up`** (Y-translate variant)

`fade-in-up.module.css`:

```css
.box { padding: 24px 32px; background: hsl(20 90% 60%); color: white; border-radius: 12px; font-weight: 700; animation: fadeInUp var(--duration, 0.8s) ease-out both; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(var(--distance, 20px)); } to { opacity: 1; transform: translateY(0); } }
```

`fade-in-up/index.tsx`:

```tsx
'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './fade-in-up.module.css';
export default function FadeInUp({ params }: { params: { duration: number; distance: number } }) {
  return <PreviewFrame><div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s`, ['--distance' as any]: `${params.distance}px` }}>Fade In Up</div></PreviewFrame>;
}
```

- [ ] **Step 3: 10 remaining basic effects (batch implementation)**

For each, create `*.module.css` + `index.tsx` with the same PreviewFrame + params-as-CSS-custom-props pattern. The CSS keyframes and component shape follow from the `code` field in `data/effects.ts`:

| id | keyframe essence | index.tsx body |
|---|---|---|
| `slide-in-left` | `from { transform: translateX(-100%) } to { translateX(0) }` | Box labeled "← Slide Left" |
| `slide-in-right` | `from { translateX(100%) } to { translateX(0) }` | Box labeled "Slide Right →" |
| `zoom-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1); scale 0→1` | 80px circle |
| `flip-x` | `perspective(600px) rotateX(-90deg) → 0` | Box "Flip X" |
| `rotate-in` | `rotate(-180deg) scale(0.3) → rotate(0) scale(1)` | Box "Rotate" |
| `pulse` | `infinite; scale 1 → 1+intensity` | 64px circle |
| `shake` | `translateX: 0 → -10 → 10 → -8 → 8 → 0` | Box "ERROR" |
| `heartbeat` | `scale 1 → 1.3 → 1 → 1.3 → 1` | ♥ char |
| `marquee` | `translateX 0 → -50% infinite` | Spans "Motion.Lab · 动效实验室 · " doubled |
| `spinner` | `rotate 0 → 360deg infinite` | 48px circle with top border accent |

All components: `'use client'; import { PreviewFrame } from '../_shared/PreviewFrame';` then return `<PreviewFrame>...</PreviewFrame>` with `style={{ ['--duration' as any]: `${params.X}s`, ... }}` overriding CSS custom properties from the data file.

- [ ] **Step 4: Build + commit**

```bash
npm run build 2>&1 | tail -5
git add -A && git commit -m "feat: 12 basic CSS animation effects"
```

---

## Task 11: Text Animations (10 effects)

**Files:** 10 effects: `typewriter`, `wave-text`, `mask-reveal`, `split-char`, `gradient-text`, `glitch-text`, `scramble`, `count-up`, `stagger-fade`, `vertical-marquee`

- [ ] **Step 1: Detailed example — `typewriter`**

`typewriter.module.css`:

```css
.tw { font-family: var(--font-mono); font-size: 24px; font-weight: 700; }
.tw::after { content: '|'; margin-left: 2px; animation: caret 0.8s step-end infinite; }
@keyframes caret { 50% { opacity: 0; } }
```

`typewriter/index.tsx`:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './typewriter.module.css';
const TEXT = 'Hello, Motion.Lab!';
export default function Typewriter({ params }: { params: { speed: number } }) {
  const [out, setOut] = useState('');
  useEffect(() => {
    let i = 0; setOut('');
    const id = setInterval(() => { i++; setOut(TEXT.slice(0, i)); if (i >= TEXT.length) clearInterval(id); }, params.speed);
    return () => clearInterval(id);
  }, [params.speed]);
  return <PreviewFrame><span className={styles.tw}>{out}</span></PreviewFrame>;
}
```

- [ ] **Step 2: 9 remaining text effects (batch implementation)**

| id | Implementation hint |
|---|---|
| `wave-text` | Split "WAVE" into chars, each `<span>` with `animation-delay: 0.1s * n` |
| `mask-reveal` | `clip-path: inset(0 0 100% 0) → inset(0 0 0 0)` over "MOTION" |
| `split-char` | "SPLIT" chars: odd use `translateY(-100%)→0`, even use `translateY(100%)→0` |
| `gradient-text` | "COLOR" with `background-clip: text`, animated `background-position` |
| `glitch-text` | `data-text="GLITCH"` with `::before/::after` in cyan/magenta, translate jitter |
| `scramble` | `useState` + `setInterval` that progressively replaces random chars with target |
| `count-up` | `useEffect` + `requestAnimationFrame` with `Math.floor(target * (1 - Math.pow(1-t, 3)))` |
| `stagger-fade` | 4 `<li>` items, each `animation-delay: calc(var(--stagger) * n)` |
| `vertical-marquee` | 8 `<span>` doubled, `translateY 0 → -50% infinite` |

Pattern: `'use client'; import { PreviewFrame };` + state hooks for JS-driven ones, CSS-only for others.

- [ ] **Step 3: Build + commit**

```bash
npm run build 2>&1 | tail -5
git add -A && git commit -m "feat: 10 text/typography effects"
```

---

## Task 12: Interaction Animations (10 effects)

**Files:** 10 effects: `magnetic-cursor`, `three-d-tilt`, `ripple-click`, `parallax-mouse`, `blob-cursor`, `hover-image-distort`, `magnetic-button`, `sticky-stack`, `drag-scroll`, `color-picker-hover`

- [ ] **Step 1: Detailed example — `magnetic-cursor`**

`magnetic-cursor.module.css`:

```css
.btn { padding: 16px 32px; background: hsl(280 90% 60%); color: white; border-radius: 999px; font-weight: 700; cursor: pointer; transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
```

`magnetic-cursor/index.tsx`:

```tsx
'use client';
import { useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './magnetic-cursor.module.css';
export default function MagneticCursor({ params }: { params: { strength: number } }) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <PreviewFrame>
      <button
        ref={ref}
        className={styles.btn}
        onMouseMove={(e) => {
          if (!ref.current) return;
          const r = ref.current.getBoundingClientRect();
          ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * params.strength}px, ${(e.clientY - r.top - r.height / 2) * params.strength}px)`;
        }}
        onMouseLeave={() => { if (ref.current) ref.current.style.transform = ''; }}
      >Hover me</button>
    </PreviewFrame>
  );
}
```

- [ ] **Step 2: 9 remaining interaction effects (batch implementation)**

| id | Implementation hint |
|---|---|
| `three-d-tilt` | `onMouseMove`: `transform: perspective(600px) rotateY(${x*max}deg) rotateX(${-y*max}deg)` |
| `ripple-click` | `onClick`: spawn `<span class="ripple">` at click coords, remove after 600ms |
| `parallax-mouse` | Multiple `data-depth` layers, each translates `x*depth*intensity` |
| `blob-cursor` | Fixed `<div>` with `mix-blend-mode: difference`, follows mouse |
| `hover-image-distort` | SVG `feTurbulence` + `feDisplacementMap`, amount driven by params |
| `magnetic-button` | Global `mousemove`: if dist < radius, translate button toward cursor |
| `sticky-stack` | 3-8 cards with `position: sticky; top: 80px`, scroll-driven via GSAP ScrollTrigger |
| `drag-scroll` | `mousedown/mousemove/mouseup` to translate inner div, with momentum |
| `color-picker-hover` | `mousemove` sets `--x`, `--y` for radial-gradient + random `--h` |

Pattern: most use `useRef` + `onMouseMove` on the PreviewFrame's child. Use `'use client'`.

- [ ] **Step 3: Build + commit**

```bash
npm run build 2>&1 | tail -5
git add -A && git commit -m "feat: 10 interaction/hover effects"
```

---

## Task 13: Advanced Animations (8 effects)

**Files:** 8 effects: `gsap-scrollTrigger`, `three-particles`, `webgl-shader`, `canvas-confetti`, `lottie-loader`, `morph-svg`, `grid-magnetic`, `sine-wave`

- [ ] **Step 1: Detailed example — `sine-wave`**

`sine-wave.module.css`:

```css
.canvas { width: 100%; height: 100%; }
```

`sine-wave/index.tsx`:

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './sine-wave.module.css';
export default function SineWave({ params }: { params: { frequency: number; amplitude: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    const resize = () => { c.width = c.offsetWidth * 2; c.height = c.offsetHeight * 2; };
    resize(); window.addEventListener('resize', resize);
    let t = 0; let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.strokeStyle = 'hsl(280 90% 50%)'; ctx.lineWidth = 4; ctx.beginPath();
      for (let x = 0; x < c.width; x++) ctx.lineTo(x, c.height / 2 + Math.sin(x * params.frequency + t) * params.amplitude * 2);
      ctx.stroke(); t += 0.05; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [params.frequency, params.amplitude]);
  return <PreviewFrame><canvas ref={ref} className={styles.canvas} /></PreviewFrame>;
}
```

- [ ] **Step 2: 7 remaining advanced effects (batch implementation)**

| id | Implementation hint |
|---|---|
| `gsap-scrollTrigger` | `useEffect` imports `gsap` + `ScrollTrigger`, animates `.target` based on scroll progress |
| `three-particles` | `useEffect` creates `THREE.Scene` + `Points` with `BufferGeometry` of `params.count` positions |
| `webgl-shader` | Inline `<canvas>` + WebGL2 context + custom GLSL fragment shader using `u_time` |
| `canvas-confetti` | `setInterval` (or RAF) that integrates `vy += g` for `params.count` particles, draw `fillRect` |
| `lottie-loader` | `lottie.loadAnimation` from inline JSON (use simple Lottie file or fallback to CSS animation) |
| `morph-svg` | SVG `<path>` with `setInterval` toggling `d` between two paths |
| `grid-magnetic` | Render 6×12 grid of dots in JSX, animate each dot's transform based on mouse distance |

Pattern: `'use client'; useEffect(() => { ... return cleanup; }, [params])` for canvas/three/lottie effects. Use `gsap.registerPlugin(ScrollTrigger)` only inside the effect that needs it (lazy import).

- [ ] **Step 3: Build + commit**

```bash
npm run build 2>&1 | tail -5
git add -A && git commit -m "feat: 8 advanced effects (gsap, three, webgl, canvas, lottie, svg)"
```

---

## Task 14: Accessibility & Performance Polish

**Files:** modify `app/globals.css`, add `lib/reduced-motion.ts` usage, ensure focus rings

- [ ] **Step 1: Add focus styles in `app/globals.css`**

Append:

```css
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
button:focus-visible, a:focus-visible { outline-offset: 4px; }
```

- [ ] **Step 2: Verify reduced-motion handling**

Search the codebase for animations that should respect reduced-motion. The `HSLBackground` and `globals.css` global override already handle this; verify in browser dev tools.

- [ ] **Step 3: Lighthouse check**

```bash
npm run build && npm start &
sleep 8
# Optional: use lighthouse CLI if installed
npx lighthouse http://localhost:3000/lab --output=json --output-path=/tmp/lh.json --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility 2>&1 | tail -10
kill %1
```

Expected: Performance ≥ 90, Accessibility ≥ 95. If lower, identify and address top issues.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "polish: focus styles + reduced-motion verification"
```

---

## Task 15: E2E Tests

**Files:** `tests/e2e/{home,lab-search,lab-drawer,lab-copy}.spec.ts`

- [ ] **Step 1: `tests/e2e/home.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
test('home page loads and shows hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '动效实验室' })).toBeVisible();
  await expect(page.getByRole('link', { name: /开始探索/ })).toBeVisible();
});
```

- [ ] **Step 2: `tests/e2e/lab-search.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
test('search filters cards', async ({ page }) => {
  await page.goto('/lab');
  await expect(page.getByText('淡入')).toBeVisible();
  await page.getByPlaceholder('搜索动效、标签…').fill('magnetic');
  await expect(page.getByText('淡入')).not.toBeVisible();
  await expect(page.getByText('磁吸光标')).toBeVisible();
});
test('category tab filters', async ({ page }) => {
  await page.goto('/lab');
  await page.getByRole('tab', { name: '文字' }).click();
  await expect(page).toHaveURL(/cat=text/);
});
```

- [ ] **Step 3: `tests/e2e/lab-drawer.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
test('clicking 调参 opens drawer with params', async ({ page }) => {
  await page.goto('/lab');
  await page.getByRole('button', { name: /调参/ }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/时长|周期|速度/)).toBeVisible();
});
test('Escape closes drawer', async ({ page }) => {
  await page.goto('/lab?open=fade-in&panel=params');
  await page.keyboard.press('Escape');
  await expect(page).not.toHaveURL(/open=/);
});
```

- [ ] **Step 4: `tests/e2e/lab-copy.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
test('code panel copy button works', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/lab?open=fade-in&panel=code');
  await page.getByRole('button', { name: '复制' }).click();
  await expect(page.getByText('已复制')).toBeVisible();
});
```

- [ ] **Step 5: Run E2E tests**

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

Expected: all tests pass. Commit:

```bash
git add -A && git commit -m "test: e2e tests for home, search, drawer, copy"
```

---

## Task 16: Vercel Deployment

**Files:** `vercel.json` (optional)

- [ ] **Step 1: Add `vercel.json` (minimal — Next.js auto-detected)**

```json
{ "framework": "nextjs" }
```

- [ ] **Step 2: Create a GitHub repo + push**

```bash
# User must do this step manually:
# 1. Create empty GitHub repo
# 2. Add remote: git remote add origin git@github.com:<user>/motion-lab.git
# 3. Push: git push -u origin main
```

- [ ] **Step 3: Vercel deploy**

User flow:
1. Visit https://vercel.com/new
2. Import the GitHub repo
3. Framework preset: Next.js (auto-detected)
4. Click Deploy
5. Wait for build
6. Visit `https://motion-lab-<hash>.vercel.app` and smoke test

- [ ] **Step 4: Smoke test deployed site**

Manual: open the deployed URL, navigate Home → Lab → click an effect → change a param → copy code → verify it works.

---

## Appendix A: `data/effects.ts` Generator Script

To avoid an 800-line manual file, generate `data/effects.ts` from this Node.js script. Save as `scripts/gen-effects.mjs` and run with `node scripts/gen-effects.mjs > data/effects.ts`.

**Files:** `scripts/gen-effects.mjs`

- [ ] **Step 1: Create `scripts/gen-effects.mjs`**

```js
#!/usr/bin/env node
// scripts/gen-effects.mjs — Generate data/effects.ts from a compact spec table.
import { writeFileSync } from 'node:fs';

const SPEC = [
  // [id, name, englishName, category, difficulty, description, params, code]
  ['fade-in', '淡入', 'Fade In', 'basic', 1, '元素从透明渐入到不透明,最基础的进入动画。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 3, step: 0.1, default: 0.8, unit: 's' },
     { key: 'delay', label: '延迟', min: 0, max: 2, step: 0.1, default: 0, unit: 's' }],
    { html: '<div class="fade-in">Hello</div>',
      css: '.fade-in { animation: fadeIn var(--duration, 0.8s) ease-out var(--delay, 0s) both; }\n@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
      js: '// Pure CSS — no JS needed' }],

  ['fade-in-up', '上滑淡入', 'Fade In Up', 'basic', 1, '元素从下方淡入,常用于列表项。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 3, step: 0.1, default: 0.8, unit: 's' },
     { key: 'distance', label: '距离', min: 10, max: 80, step: 5, default: 20, unit: 'px' }],
    { html: '<div class="fade-in-up">Hello</div>',
      css: '.fade-in-up { animation: fadeInUp var(--duration, 0.8s) ease-out both; }\n@keyframes fadeInUp { from { opacity: 0; transform: translateY(var(--distance, 20px)); } to { opacity: 1; transform: translateY(0); } }',
      js: '// Pure CSS' }],

  ['slide-in-left', '左侧滑入', 'Slide In Left', 'basic', 1, '元素从左侧滑入视口。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 2, step: 0.1, default: 0.6, unit: 's' }],
    { html: '<div class="slide-left">→</div>',
      css: '.slide-left { animation: slideLeft var(--duration, 0.6s) ease-out both; }\n@keyframes slideLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }',
      js: '' }],

  ['slide-in-right', '右侧滑入', 'Slide In Right', 'basic', 1, '元素从右侧滑入视口。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 2, step: 0.1, default: 0.6, unit: 's' }],
    { html: '<div class="slide-right">←</div>',
      css: '.slide-right { animation: slideRight var(--duration, 0.6s) ease-out both; }\n@keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }',
      js: '' }],

  ['zoom-bounce', '缩放弹跳', 'Zoom Bounce', 'basic', 1, '元素放大入场,带弹跳回弹。',
    [{ key: 'duration', label: '时长', min: 0.3, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<div class="zoom-bounce">●</div>',
      css: '.zoom-bounce { animation: zoomBounce var(--duration, 0.8s) cubic-bezier(0.34, 1.56, 0.64, 1) both; }\n@keyframes zoomBounce { from { transform: scale(0); } to { transform: scale(1); } }',
      js: '' }],

  ['flip-x', '水平翻转', 'Flip X', 'basic', 2, '元素绕 X 轴翻转入场。',
    [{ key: 'duration', label: '时长', min: 0.3, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<div class="flip-x">↻</div>',
      css: '.flip-x { animation: flipX var(--duration, 0.8s) ease-out both; transform-origin: center; }\n@keyframes flipX { from { transform: perspective(600px) rotateX(-90deg); opacity: 0; } to { transform: perspective(600px) rotateX(0); opacity: 1; } }',
      js: '' }],

  ['rotate-in', '旋转入场', 'Rotate In', 'basic', 1, '元素从旋转状态回归原位。',
    [{ key: 'duration', label: '时长', min: 0.3, max: 2, step: 0.1, default: 0.7, unit: 's' }],
    { html: '<div class="rotate-in">★</div>',
      css: '.rotate-in { animation: rotateIn var(--duration, 0.7s) ease-out both; }\n@keyframes rotateIn { from { transform: rotate(-180deg) scale(0.3); opacity: 0; } to { transform: rotate(0) scale(1); opacity: 1; } }',
      js: '' }],

  ['pulse', '脉冲', 'Pulse', 'basic', 1, '元素持续放大缩小,吸引注意。',
    [{ key: 'duration', label: '周期', min: 0.5, max: 3, step: 0.1, default: 1.5, unit: 's' },
     { key: 'intensity', label: '强度', min: 0.05, max: 0.4, step: 0.05, default: 0.15 }],
    { html: '<div class="pulse">●</div>',
      css: '.pulse { animation: pulse var(--duration, 1.5s) ease-in-out infinite; }\n@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(calc(1 + var(--intensity, 0.15))); } }',
      js: '' }],

  ['shake', '摇晃', 'Shake', 'basic', 1, '元素左右快速摇晃,常用于表单错误提示。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 1.5, step: 0.1, default: 0.5, unit: 's' }],
    { html: '<div class="shake">!</div>',
      css: '.shake { animation: shake var(--duration, 0.5s); }\n@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }',
      js: '' }],

  ['heartbeat', '心跳', 'Heartbeat', 'basic', 1, '双拍心跳节奏,模拟真实心跳。',
    [{ key: 'duration', label: '周期', min: 0.5, max: 3, step: 0.1, default: 1.2, unit: 's' }],
    { html: '<div class="heartbeat">♥</div>',
      css: '.heartbeat { animation: heartbeat var(--duration, 1.2s) ease-in-out infinite; }\n@keyframes heartbeat { 0%, 100% { transform: scale(1); } 14% { transform: scale(1.3); } 28% { transform: scale(1); } 42% { transform: scale(1.3); } 70% { transform: scale(1); } }',
      js: '' }],

  ['marquee', '跑马灯', 'Marquee', 'basic', 2, '内容从右向左无限滚动。',
    [{ key: 'duration', label: '周期', min: 5, max: 30, step: 1, default: 12, unit: 's' },
     { key: 'direction', label: '方向', options: ['left', 'right'], default: 'left' }],
    { html: '<div class="marquee"><span>Motion.Lab · 动效实验室 · </span><span>Motion.Lab · 动效实验室 · </span></div>',
      css: '.marquee { display: flex; gap: 32px; animation: marquee var(--duration, 12s) linear infinite; white-space: nowrap; }\n@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }',
      js: '' }],

  ['spinner', '加载旋转', 'Spinner', 'basic', 1, '经典加载指示器。',
    [{ key: 'duration', label: '周期', min: 0.3, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<div class="spinner"></div>',
      css: '.spinner { width: 32px; height: 32px; border: 3px solid rgba(0,0,0,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin var(--duration, 0.8s) linear infinite; }\n@keyframes spin { to { transform: rotate(360deg); } }',
      js: '' }],

  ['typewriter', '打字机', 'Typewriter', 'text', 1, '字符逐个出现,模拟键盘输入。',
    [{ key: 'speed', label: '速度', min: 20, max: 200, step: 10, default: 80, unit: 'ms' }],
    { html: '<div id="typewriter"></div>',
      css: '#typewriter { font-family: monospace; border-right: 2px solid currentColor; padding-right: 4px; animation: caret 0.8s step-end infinite; }\n@keyframes caret { 50% { border-color: transparent; } }',
      js: "const el = document.getElementById('typewriter');\nconst text = 'Hello, Motion.Lab!';\nlet i = 0;\nsetInterval(() => { el.textContent = text.slice(0, i++ % (text.length + 1)); }, 80);" }],

  ['wave-text', '波浪文字', 'Wave Text', 'text', 2, '每个字符上下波动形成波浪。',
    [{ key: 'duration', label: '周期', min: 0.8, max: 3, step: 0.1, default: 1.6, unit: 's' }],
    { html: '<span class="wave-text">WAVE</span>',
      css: '.wave-text span { display: inline-block; animation: wave var(--duration, 1.6s) ease-in-out infinite; }\n.wave-text span:nth-child(n) { animation-delay: calc(0.1s * n); }\n@keyframes wave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }',
      js: "document.querySelectorAll('.wave-text').forEach(el => el.innerHTML = [...el.textContent].map(c => `<span>${c}</span>`).join(''));" }],

  ['mask-reveal', '遮罩揭示', 'Mask Reveal', 'text', 2, '文字从遮罩下方揭示,常用于 hero 标题。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 2.5, step: 0.1, default: 1.2, unit: 's' }],
    { html: '<h1 class="mask-reveal">MOTION</h1>',
      css: '.mask-reveal { clip-path: inset(0 0 100% 0); animation: reveal var(--duration, 1.2s) cubic-bezier(0.65, 0, 0.35, 1) forwards; }\n@keyframes reveal { to { clip-path: inset(0 0 0 0); } }',
      js: '' }],

  ['split-char', '字符分裂', 'Split Character', 'text', 2, '每个字符从上下分开再合拢。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<h1 class="split-char">SPLIT</h1>',
      css: '.split-char span { display: inline-block; animation: split var(--duration, 0.8s) ease-out both; }\n.split-char span:nth-child(odd) { animation-name: splitTop; }\n.split-char span:nth-child(even) { animation-name: splitBot; }\n@keyframes splitTop { from { transform: translateY(-100%); } to { transform: translateY(0); } }\n@keyframes splitBot { from { transform: translateY(100%); } to { transform: translateY(0); } }',
      js: "[...document.querySelector('.split-char').textContent].forEach(c => { const s = document.createElement('span'); s.textContent = c; c.replaceWith(s); });" }],

  ['gradient-text', '渐变文字', 'Gradient Text', 'text', 1, '文字使用 HSL 渐变背景 + 循环动画。',
    [{ key: 'duration', label: '周期', min: 2, max: 10, step: 0.5, default: 4, unit: 's' }],
    { html: '<h1 class="gradient-text">COLOR</h1>',
      css: '.gradient-text { background: linear-gradient(90deg, hsl(0 90% 60%), hsl(120 90% 60%), hsl(240 90% 60%)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: hue var(--duration, 4s) linear infinite; }\n@keyframes hue { to { background-position: 200% 0; } }',
      js: '' }],

  ['glitch-text', '故障文字', 'Glitch Text', 'text', 3, 'RGB 分离故障效果,赛博朋克风。',
    [{ key: 'duration', label: '周期', min: 1, max: 5, step: 0.1, default: 2.5, unit: 's' }],
    { html: '<h1 class="glitch" data-text="GLITCH">GLITCH</h1>',
      css: '.glitch { position: relative; }\n.glitch::before, .glitch::after { content: attr(data-text); position: absolute; inset: 0; }\n.glitch::before { color: cyan; animation: glitchA var(--duration, 2.5s) infinite; }\n.glitch::after { color: magenta; animation: glitchB var(--duration, 2.5s) infinite; }\n@keyframes glitchA { 0%, 100% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(2px, -1px); } }\n@keyframes glitchB { 0%, 100% { transform: translate(0); } 20% { transform: translate(2px, -1px); } 40% { transform: translate(-1px, 2px); } }',
      js: '' }],

  ['scramble', '乱码解码', 'Scramble', 'text', 3, '文字先以乱码出现,逐渐解码为目标文字。',
    [{ key: 'duration', label: '时长', min: 0.5, max: 3, step: 0.1, default: 1.5, unit: 's' }],
    { html: '<span id="scramble"></span>',
      css: '#scramble { font-family: monospace; }',
      js: "const el = document.getElementById('scramble');\nconst target = 'SCRAMBLE';\nconst chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%';\nlet frame = 0;\nconst interval = setInterval(() => {\n  el.textContent = target.split('').map((c, i) => i < frame / 3 ? c : chars[Math.floor(Math.random() * chars.length)]).join('');\n  if (frame++ > target.length * 3) clearInterval(interval);\n}, 50);" }],

  ['count-up', '数字滚动', 'Count Up', 'text', 2, '数字从 0 滚动到目标值。',
    [{ key: 'target', label: '目标值', min: 10, max: 9999, step: 1, default: 1234 }],
    { html: '<span id="count-up">0</span>',
      css: '#count-up { font-variant-numeric: tabular-nums; font-weight: 900; font-size: 48px; }',
      js: "const el = document.getElementById('count-up');\nconst target = 1234;\nconst duration = 1500;\nconst start = performance.now();\nconst tick = (now) => {\n  const t = Math.min(1, (now - start) / duration);\n  el.textContent = Math.floor(target * (1 - Math.pow(1 - t, 3)));\n  if (t < 1) requestAnimationFrame(tick);\n};\nrequestAnimationFrame(tick);" }],

  ['stagger-fade', '错落淡入', 'Stagger Fade', 'text', 2, '多个文字依次淡入,带 stagger 延迟。',
    [{ key: 'duration', label: '单项时长', min: 0.2, max: 1.5, step: 0.1, default: 0.5, unit: 's' },
     { key: 'stagger', label: '间隔', min: 0.05, max: 0.5, step: 0.05, default: 0.1, unit: 's' }],
    { html: '<ul class="stagger"><li>一</li><li>二</li><li>三</li><li>四</li></ul>',
      css: '.stagger li { opacity: 0; animation: fadeIn var(--duration, 0.5s) ease-out forwards; }\n.stagger li:nth-child(1) { animation-delay: 0s; }\n.stagger li:nth-child(2) { animation-delay: var(--stagger, 0.1s); }\n.stagger li:nth-child(3) { animation-delay: calc(var(--stagger, 0.1s) * 2); }\n.stagger li:nth-child(4) { animation-delay: calc(var(--stagger, 0.1s) * 3); }\n@keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }',
      js: '' }],

  ['vertical-marquee', '垂直跑马灯', 'Vertical Marquee', 'text', 2, '文字从下往上垂直滚动。',
    [{ key: 'duration', label: '周期', min: 5, max: 30, step: 1, default: 15, unit: 's' }],
    { html: '<div class="vmarquee"><div>设计 · 设计 · 设计 · 设计</div><div>设计 · 设计 · 设计 · 设计</div></div>',
      css: '.vmarquee { height: 60px; overflow: hidden; }\n.vmarquee > div { animation: vm var(--duration, 15s) linear infinite; }\n@keyframes vm { from { transform: translateY(0); } to { transform: translateY(-100%); } }',
      js: '' }],

  ['magnetic-cursor', '磁吸光标', 'Magnetic Cursor', 'interaction', 2, '光标靠近元素时元素被吸引。',
    [{ key: 'strength', label: '强度', min: 0.1, max: 0.8, step: 0.05, default: 0.4 }],
    { html: '<button class="magnetic">Hover me</button>',
      css: '.magnetic { transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }',
      js: "const btn = document.querySelector('.magnetic');\nbtn.addEventListener('mousemove', (e) => {\n  const r = btn.getBoundingClientRect();\n  const x = (e.clientX - r.left - r.width / 2) * 0.4;\n  const y = (e.clientY - r.top - r.height / 2) * 0.4;\n  btn.style.transform = `translate(${x}px, ${y}px)`;\n});\nbtn.addEventListener('mouseleave', () => btn.style.transform = '');" }],

  ['three-d-tilt', '3D 倾斜', '3D Tilt', 'interaction', 2, '卡片随鼠标 3D 倾斜。',
    [{ key: 'max', label: '最大角度', min: 5, max: 30, step: 1, default: 15, unit: '°' }],
    { html: '<div class="tilt">TILT</div>',
      css: '.tilt { transform-style: preserve-3d; transition: transform 0.2s; }',
      js: "const el = document.querySelector('.tilt');\nel.addEventListener('mousemove', (e) => {\n  const r = el.getBoundingClientRect();\n  const x = (e.clientX - r.left) / r.width - 0.5;\n  const y = (e.clientY - r.top) / r.height - 0.5;\n  el.style.transform = `perspective(600px) rotateY(${x * 30}deg) rotateX(${-y * 30}deg)`;\n});" }],

  ['ripple-click', '点击波纹', 'Ripple Click', 'interaction', 1, 'Material Design 风格的点击波纹。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 1.5, step: 0.1, default: 0.6, unit: 's' }],
    { html: '<button class="ripple-btn">Click</button>',
      css: '.ripple-btn { position: relative; overflow: hidden; }\n.ripple-btn .ripple { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.5); animation: ripple var(--duration, 0.6s); }\n@keyframes ripple { to { transform: scale(4); opacity: 0; } }',
      js: "document.querySelector('.ripple-btn').addEventListener('click', (e) => {\n  const r = e.currentTarget.getBoundingClientRect();\n  const ripple = document.createElement('span');\n  ripple.className = 'ripple';\n  ripple.style.left = (e.clientX - r.left) + 'px';\n  ripple.style.top = (e.clientY - r.top) + 'px';\n  ripple.style.width = ripple.style.height = '20px';\n  e.currentTarget.appendChild(ripple);\n  setTimeout(() => ripple.remove(), 600);\n});" }],

  ['parallax-mouse', '鼠标视差', 'Parallax Mouse', 'interaction', 2, '多层元素按不同深度响应鼠标。',
    [{ key: 'intensity', label: '强度', min: 5, max: 40, step: 1, default: 20, unit: 'px' }],
    { html: '<div class="parallax"><div class="layer bg" data-depth="1"></div><div class="layer fg" data-depth="3"></div></div>',
      css: '.parallax { position: relative; }\n.layer { position: absolute; inset: 0; transition: transform 0.2s; }',
      js: "document.querySelector('.parallax').addEventListener('mousemove', (e) => {\n  const r = e.currentTarget.getBoundingClientRect();\n  const x = (e.clientX - r.left) / r.width - 0.5;\n  const y = (e.clientY - r.top) / r.height - 0.5;\n  e.currentTarget.querySelectorAll('.layer').forEach(l => {\n    const d = +l.dataset.depth;\n    l.style.transform = `translate(${x * d * 20}px, ${y * d * 20}px)`;\n  });\n});" }],

  ['blob-cursor', '粘性光标', 'Blob Cursor', 'interaction', 2, '光标变成一个跟随的彩色 blob。',
    [{ key: 'size', label: '尺寸', min: 20, max: 80, step: 4, default: 40, unit: 'px' }],
    { html: '<div class="blob"></div>',
      css: '.blob { position: fixed; width: 40px; height: 40px; border-radius: 50%; background: hsl(280 90% 60%); mix-blend-mode: difference; pointer-events: none; transition: transform 0.15s; }',
      js: "const blob = document.querySelector('.blob');\ndocument.addEventListener('mousemove', (e) => {\n  blob.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;\n});" }],

  ['hover-image-distort', '悬停图像畸变', 'Hover Distort', 'interaction', 3, '悬停时图像被 SVG 滤镜畸变。',
    [{ key: 'amount', label: '畸变强度', min: 0, max: 0.05, step: 0.005, default: 0.02 }],
    { html: '<svg width="0" height="0"><filter id="d"><feTurbulence baseFrequency="0.02" numOctaves="2" /><feDisplacementMap in="SourceGraphic" scale="20" /></filter></svg>\n<div class="distort">HOVER</div>',
      css: '.distort { filter: url(#d); transition: filter 0.3s; }',
      js: '' }],

  ['magnetic-button', '磁吸按钮', 'Magnetic Button', 'interaction', 2, '按钮周围区域吸引按钮位移。',
    [{ key: 'radius', label: '吸引半径', min: 30, max: 200, step: 10, default: 80, unit: 'px' }],
    { html: '<button class="mag-btn">PRESS</button>',
      css: '.mag-btn { transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }',
      js: "const btn = document.querySelector('.mag-btn');\ndocument.addEventListener('mousemove', (e) => {\n  const r = btn.getBoundingClientRect();\n  const dx = e.clientX - (r.left + r.width / 2);\n  const dy = e.clientY - (r.top + r.height / 2);\n  const dist = Math.hypot(dx, dy);\n  if (dist < 80) btn.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;\n  else btn.style.transform = '';\n});" }],

  ['sticky-stack', '堆叠翻页', 'Sticky Stack', 'interaction', 3, '滚动时卡片堆叠翻页效果。',
    [{ key: 'count', label: '卡片数', min: 3, max: 8, step: 1, default: 4 }],
    { html: '<div class="stack"><div class="card">1</div><div class="card">2</div><div class="card">3</div></div>',
      css: '.stack .card { position: sticky; top: 80px; padding: 40px; background: white; border-radius: 16px; margin-bottom: 20px; }',
      js: '' }],

  ['drag-scroll', '拖动滚动', 'Drag Scroll', 'interaction', 2, '横向拖动滚动容器。',
    [{ key: 'duration', label: '惯性时长', min: 0.2, max: 1.5, step: 0.1, default: 0.6, unit: 's' }],
    { html: '<div class="drag"><div class="drag-inner"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div></div>',
      css: '.drag { overflow: hidden; cursor: grab; user-select: none; }\n.drag:active { cursor: grabbing; }\n.drag-inner { display: flex; gap: 20px; padding: 20px; }',
      js: "const wrap = document.querySelector('.drag');\nlet isDown = false, startX = 0, scrollLeft = 0;\nwrap.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX; scrollLeft = wrap.scrollLeft; });\nwindow.addEventListener('mouseup', () => isDown = false);\nwrap.addEventListener('mousemove', (e) => { if (!isDown) return; e.preventDefault(); wrap.scrollLeft = scrollLeft - (e.pageX - startX); });" }],

  ['color-picker-hover', '随悬停变色', 'Color Hover', 'interaction', 1, '悬停位置产生彩色光晕。',
    [{ key: 'size', label: '光晕大小', min: 100, max: 600, step: 20, default: 300, unit: 'px' }],
    { html: '<div class="color-hover"></div>',
      css: '.color-hover { background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), hsl(var(--h, 0) 90% 60%), transparent 50%); }',
      js: "const el = document.querySelector('.color-hover');\nel.addEventListener('mousemove', (e) => {\n  const r = el.getBoundingClientRect();\n  el.style.setProperty('--x', (e.clientX - r.left) + 'px');\n  el.style.setProperty('--y', (e.clientY - r.top) + 'px');\n  el.style.setProperty('--h', Math.random() * 360);\n});" }],

  ['gsap-scrollTrigger', '滚动驱动', 'GSAP ScrollTrigger', 'advanced', 3, '使用 GSAP ScrollTrigger 绑定滚动进度。',
    [{ key: 'distance', label: '位移', min: 50, max: 400, step: 10, default: 200, unit: 'px' }],
    { html: '<div class="gsap-target">SCROLL</div>',
      css: '.gsap-target { font-size: 64px; font-weight: 900; }',
      js: "gsap.registerPlugin(ScrollTrigger);\ngsap.to('.gsap-target', { x: 200, scrollTrigger: { trigger: '.gsap-target', start: 'top center', end: 'bottom center', scrub: true } });" }],

  ['three-particles', '粒子系统', 'Three.js Particles', 'advanced', 3, 'Three.js 渲染的几何粒子系统。',
    [{ key: 'count', label: '粒子数', min: 100, max: 5000, step: 100, default: 1500 }],
    { html: '<canvas class="three"></canvas>',
      css: '.three { width: 100%; height: 100%; }',
      js: "import * as THREE from 'three';\nconst scene = new THREE.Scene();\nconst geom = new THREE.BufferGeometry();\nconst positions = new Float32Array(1500 * 3);\nfor (let i = 0; i < 1500 * 3; i++) positions[i] = (Math.random() - 0.5) * 10;\ngeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));\nconst mat = new THREE.PointsMaterial({ color: 0xff00ff, size: 0.05 });\nscene.add(new THREE.Points(geom, mat));" }],

  ['webgl-shader', '着色器', 'WebGL Shader', 'advanced', 3, '自定义 GLSL 片元着色器生成动画。',
    [{ key: 'speed', label: '速度', min: 0.1, max: 3, step: 0.1, default: 1 }],
    { html: '<canvas class="shader"></canvas>',
      css: '.shader { width: 100%; height: 100%; }',
      js: "const frag = `precision mediump float; uniform float u_time; uniform vec2 u_resolution; void main() { vec2 uv = gl_FragCoord.xy / u_resolution.xy; gl_FragColor = vec4(uv, 0.5 + 0.5 * sin(u_time), 1.0); }`;" }],

  ['canvas-confetti', '五彩纸屑', 'Canvas Confetti', 'advanced', 2, '撒花庆祝效果。',
    [{ key: 'count', label: '粒子数', min: 30, max: 300, step: 10, default: 120 }],
    { html: '<canvas class="cv"></canvas>',
      css: '.cv { position: absolute; inset: 0; pointer-events: none; }',
      js: "const cv = document.querySelector('.cv'); const ctx = cv.getContext('2d');\nconst particles = [];\nfor (let i = 0; i < 120; i++) particles.push({ x: 200, y: 200, vx: (Math.random()-0.5)*8, vy: Math.random()*-12, g: 0.3, c: `hsl(${Math.random()*360} 90% 60%)` });\nfunction tick() { ctx.clearRect(0,0,cv.width,cv.height); particles.forEach(p => { p.vy += p.g; p.x += p.vx; p.y += p.vy; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 6, 6); }); requestAnimationFrame(tick); } tick();" }],

  ['lottie-loader', 'Lottie 加载', 'Lottie Loader', 'advanced', 2, '使用 Lottie 动画作为加载器。',
    [{ key: 'style', label: '风格', options: ['pulse', 'orbit', 'wave'], default: 'pulse' }],
    { html: '<div class="lottie"></div>',
      css: '.lottie { width: 200px; height: 200px; }',
      js: "import lottie from 'lottie-web';\nlottie.loadAnimation({ container: document.querySelector('.lottie'), renderer: 'svg', loop: true, autoplay: true, path: '/animation.json' });" }],

  ['morph-svg', 'SVG 形变', 'Morph SVG', 'advanced', 3, 'SVG path 之间平滑形变。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 3, step: 0.1, default: 1.5, unit: 's' }],
    { html: '<svg viewBox="0 0 100 100"><path class="p" d="M10 50 Q50 10 90 50 Q50 90 10 50" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
      css: 'svg { width: 200px; height: 200px; }',
      js: "const p = document.querySelector('.p');\nconst paths = ['M10 50 Q50 10 90 50 Q50 90 10 50', 'M10 10 L90 10 L90 90 L10 90 Z'];\nlet i = 0; setInterval(() => { p.setAttribute('d', paths[i++ % 2]); }, 1500);" }],

  ['grid-magnetic', '网格磁吸', 'Grid Magnetic', 'advanced', 3, '网格中每个点对鼠标有磁吸反应。',
    [{ key: 'radius', label: '吸引半径', min: 40, max: 200, step: 10, default: 100, unit: 'px' }],
    { html: '<div class="grid-mag"></div>',
      css: '.grid-mag { position: relative; width: 100%; height: 100%; }\n.grid-mag .dot { position: absolute; width: 4px; height: 4px; background: currentColor; border-radius: 50%; transition: transform 0.2s; }',
      js: "const el = document.querySelector('.grid-mag');\nconst dots = [];\nfor (let r = 0; r < 6; r++) for (let c = 0; c < 12; c++) { const d = document.createElement('div'); d.className = 'dot'; d.style.left = c * 24 + 'px'; d.style.top = r * 24 + 'px'; el.appendChild(d); dots.push(d); }\nel.addEventListener('mousemove', (e) => { dots.forEach(d => { const r = d.getBoundingClientRect(); const dx = e.clientX - (r.left + 2); const dy = e.clientY - (r.top + 2); const dist = Math.hypot(dx, dy); if (dist < 100) d.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`; else d.style.transform = ''; }); });" }],

  ['sine-wave', '正弦波', 'Sine Wave', 'advanced', 2, 'Canvas 渲染的正弦波。',
    [{ key: 'frequency', label: '频率', min: 0.005, max: 0.05, step: 0.005, default: 0.02 },
     { key: 'amplitude', label: '振幅', min: 10, max: 80, step: 5, default: 30, unit: 'px' }],
    { html: '<canvas class="wave"></canvas>',
      css: '.wave { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.wave'); const ctx = c.getContext('2d');\nlet t = 0;\nfunction draw() { ctx.clearRect(0, 0, c.width, c.height); ctx.beginPath();\nfor (let x = 0; x < c.width; x++) ctx.lineTo(x, c.height/2 + Math.sin(x * 0.02 + t) * 30);\nctx.stroke(); t += 0.05; requestAnimationFrame(draw); } draw();" }],
];

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

let out = `// Auto-generated by scripts/gen-effects.mjs — do not edit by hand.
import type { ComponentType } from 'react';

export type EffectCategory = 'basic' | 'text' | 'interaction' | 'advanced';
export type ParamKind = 'range' | 'select';
export type EffectParam =
  | { kind: 'range'; key: string; label: string; min: number; max: number; step: number; default: number; unit?: string }
  | { kind: 'select'; key: string; label: string; options: string[]; default: string };
export interface EffectCode { html: string; css: string; js: string; }
export interface Effect {
  id: string; name: string; englishName: string;
  category: EffectCategory; tags: string[]; description: string;
  difficulty: 1 | 2 | 3; params: EffectParam[]; code: EffectCode;
  preview: () => Promise<{ default: ComponentType<{ params: Record<string, any> }> }>;
}

export const CATEGORIES: { id: EffectCategory | 'all'; name: string; english: string }[] = [
  { id: 'all', name: '全部', english: 'All' },
  { id: 'basic', name: '基础', english: 'Basic' },
  { id: 'text', name: '文字', english: 'Text' },
  { id: 'interaction', name: '交互', english: 'Interaction' },
  { id: 'advanced', name: '高级', english: 'Advanced' },
];

const lz = (id: string) => () => import(\`@/components/effects/\${id}\`);

export const EFFECTS: Effect[] = [
`;

for (const [id, name, englishName, category, difficulty, description, params, code] of SPEC) {
  const paramStrs = params.map((p) => {
    if ('options' in p) {
      return `      { kind: 'select', key: '${p.key}', label: '${p.label}', options: ${JSON.stringify(p.options)}, default: '${p.default}' }`;
    }
    const u = p.unit ? `, unit: '${p.unit}'` : '';
    return `      { kind: 'range', key: '${p.key}', label: '${p.label}', min: ${p.min}, max: ${p.max}, step: ${p.step}, default: ${p.default}${u} }`;
  }).join(',\n');
  out += `  {
    id: '${id}',
    name: '${name}',
    englishName: '${englishName}',
    category: '${category}',
    tags: ['${englishName.toLowerCase().split(' ')[0]}', '${category}'],
    description: '${description}',
    difficulty: ${difficulty},
    params: [
${paramStrs}
    ],
    code: {
      html: \`${esc(code.html)}\`,
      css: \`${esc(code.css)}\`,
      js: \`${esc(code.js)}\`,
    },
    preview: lz('${id}'),
  },
`;
}

out += `];
`;

writeFileSync('data/effects.ts', out, 'utf8');
console.log(`Generated data/effects.ts with ${SPEC.length} effects.`);
```

- [ ] **Step 2: Run the generator and verify**

```bash
node scripts/gen-effects.mjs
head -40 data/effects.ts
wc -l data/effects.ts
npm run build 2>&1 | tail -5
```

Expected: generator prints `Generated data/effects.ts with 40 effects.`, file has ~700 lines, build succeeds.

- [ ] **Step 3: Commit the generator script + generated file**

```bash
git add scripts/gen-effects.mjs data/effects.ts
git commit -m "feat: data/effects.ts generated from compact spec (40 effects)"
```
