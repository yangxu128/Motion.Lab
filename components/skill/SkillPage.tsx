'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './SkillPage.module.css';

interface Props {
  skillMd: string;
  effectsCount: number;
}

const STEPS = [
  {
    n: '01',
    title: '下载 SKILL.md',
    desc: '点击下方按钮下载 SKILL.md，存到你的 Agent 项目里（Claude Code 的 .claude/skills/ 目录，或类似位置）。',
  },
  {
    n: '02',
    title: '用自然语言提问',
    desc: '告诉 Agent 你想要的动效——"给按钮加点击波纹"、"标题用打字机效果"、"做个粒子背景"。',
  },
  {
    n: '03',
    title: '复制可用代码',
    desc: 'Agent 会从 160 个动效里匹配最合适的，给你 HTML/CSS/JS 三段代码，参数可调，直接粘贴即用。',
  },
];

const EXAMPLES = [
  { q: '帮我给按钮加个点击波纹效果', a: 'click-ripple-material', accent: 'hsl(210 90% 55%)', accentBg: 'hsl(210 60% 97%)' },
  { q: '首页大标题想要打字机效果', a: 'text-typewriter-multi', accent: 'hsl(280 85% 60%)', accentBg: 'hsl(280 55% 96%)' },
  { q: '做个粒子背景', a: 'particle-fountain / canvas-starfield / flow-field', accent: 'hsl(340 85% 60%)', accentBg: 'hsl(340 50% 97%)' },
  { q: '卡片悬停时翻转显示背面', a: 'hover-flip-card', accent: 'hsl(30 95% 55%)', accentBg: 'hsl(30 70% 95%)' },
  { q: '页面滚动时元素淡入', a: 'scroll-reveal', accent: 'hsl(180 85% 50%)', accentBg: 'hsl(180 55% 95%)' },
];

const TITLE = '让 AI 调用动效';
const KICKER = 'AI Agent Skill · 2026';

// 解析 YAML frontmatter + body — 避免 frontmatter 被 react-markdown 当成标题渲染
function parseFrontmatter(md: string): { frontmatter: { key: string; value: string }[]; body: string } {
  const match = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: [], body: md };
  const [, yaml, body] = match;
  const frontmatter = yaml.split('\n').filter(Boolean).map((line) => {
    const idx = line.indexOf(':');
    if (idx === -1) return { key: line.trim(), value: '' };
    return { key: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
  });
  return { frontmatter, body };
}

// 截取预览用的 markdown — 保留 frontmatter + 简介 + 第一个分类示例，避免渲染 480 个 <pre>
function truncateForPreview(md: string, maxBytes = 10_000): { preview: string; totalBytes: number; isTruncated: boolean } {
  const total = md.length;
  if (total <= maxBytes) return { preview: md, totalBytes: total, isTruncated: false };
  // 找到第三个 ---（包含到第一个分类的源码）之前的部分
  let cut = maxBytes;
  const markers: number[] = [];
  const re = /\n---\n/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    markers.push(m.index);
    if (markers.length >= 4) break;
  }
  if (markers.length >= 4) cut = Math.max(maxBytes, markers[3] + 4);
  // 在最近的一个换行处截断，避免切到代码块中间
  const lastNewline = md.lastIndexOf('\n', cut);
  return { preview: md.slice(0, lastNewline > 0 ? lastNewline : cut), totalBytes: total, isTruncated: true };
}

// 演示对话 — 在 Hero 右侧循环播放
const DEMO_SCRIPT = [
  { type: 'user' as const, text: '帮我给按钮加点击波纹' },
  { type: 'agent' as const, text: '推荐 click-ripple-material' },
  { type: 'user' as const, text: '首页标题想要打字机效果' },
  { type: 'agent' as const, text: '推荐 text-typewriter-multi' },
];

export function SkillPage({ skillMd, effectsCount }: Props) {
  const [copied, setCopied] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [typed, setTyped] = useState('');
  const [previewMode, setPreviewMode] = useState<'rendered' | 'source'>('rendered');

  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const sectionHeadingsRef = useRef<HTMLHeadingElement[]>([]);

  // Hero 演示对话 — 循环打字机效果，hero 离屏时暂停避免持续重渲染
  useEffect(() => {
    let cancelled = false;
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let intervals: ReturnType<typeof setInterval>[] = [];
    let io: IntersectionObserver | null = null;
    let isVisible = true;

    const start = () => {
      const runStep = (i: number) => {
        if (cancelled || !isVisible) return;
        setDemoStep(i);
        setTyped('');
        const msg = DEMO_SCRIPT[i];
        let idx = 0;
        const typeTimer = setInterval(() => {
          if (cancelled || !isVisible) { clearInterval(typeTimer); return; }
          idx += 1;
          setTyped(msg.text.slice(0, idx));
          if (idx >= msg.text.length) {
            clearInterval(typeTimer);
            const next = setTimeout(() => runStep((i + 1) % DEMO_SCRIPT.length), 1600);
            timeouts.push(next);
          }
        }, 60);
        intervals.push(typeTimer);
      };
      const startTimer = setTimeout(() => runStep(0), 1200);
      timeouts.push(startTimer);
    };

    if (heroRef.current && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (isVisible && !wasVisible) {
            // 重新进入视口时重启
            timeouts.forEach(clearTimeout);
            intervals.forEach(clearInterval);
            timeouts = [];
            intervals = [];
            start();
          } else if (!isVisible) {
            // 离屏时清空所有 timer，避免 setState 持续触发重渲染
            timeouts.forEach(clearTimeout);
            intervals.forEach(clearInterval);
          }
        },
        { threshold: 0 }
      );
      io.observe(heroRef.current);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      io?.disconnect();
    };
  }, []);

  // Hero: 标题用纯 CSS 动画（避免 GSAP 起始态在某些情况下卡住）
  useEffect(() => {
    // 只对副标题、按钮、stats、demo 容器做 GSAP 入场
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { y: 24 },
        { y: 0, duration: 0.7, delay: 0.3, ease: 'power2.out', clearProps: 'transform' }
      );
    }
    if (actionsRef.current) {
      gsap.fromTo(
        actionsRef.current.children,
        { y: 20 },
        { y: 0, stagger: 0.1, duration: 0.5, delay: 0.5, ease: 'power2.out', clearProps: 'transform' }
      );
    }
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { y: 16 },
        { y: 0, stagger: 0.08, duration: 0.5, delay: 0.7, ease: 'power2.out', clearProps: 'transform' }
      );
    }
    if (demoRef.current) {
      gsap.fromTo(
        demoRef.current,
        { y: 40, scale: 0.96 },
        { y: 0, scale: 1, duration: 0.9, delay: 0.4, ease: 'power3.out', clearProps: 'transform' }
      );
    }
  }, []);

  // Hero: 鼠标视差 — 用 rAF 节流 + 降低 GSAP 调用频率
  useEffect(() => {
    if (!heroRef.current) return;
    let raf = 0;
    let running = true;
    const blobs = heroRef.current.querySelectorAll(`.${styles.blob}`);
    if (blobs.length === 0) return;
    const handleMove = (e: MouseEvent) => {
      if (!running) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        blobs.forEach((blob, i) => {
          const factor = (i + 1) * 6; // 视差幅度从 10 降到 6
          gsap.to(blob, { x: -x * factor, y: -y * factor, duration: 1.0, ease: 'power2.out', overwrite: 'auto' });
        });
      });
    };
    const handleLeave = () => {
      gsap.to(blobs, { x: 0, y: 0, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
    };
    heroRef.current.addEventListener('mousemove', handleMove, { passive: true });
    heroRef.current.addEventListener('mouseleave', handleLeave);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      heroRef.current?.removeEventListener('mousemove', handleMove);
      heroRef.current?.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  // Scroll-reveal: section headings + steps + examples + preview
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const children = target.children;
          if (target.dataset.reveal === 'stagger' && children.length > 0) {
            gsap.fromTo(
              children,
              { y: 60, autoAlpha: 0, scale: 0.95 },
              { y: 0, autoAlpha: 1, scale: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' }
            );
          } else {
            gsap.fromTo(
              target,
              { y: 40, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }
            );
          }
          observer.unobserve(target);
        });
      },
      { threshold: 0.15 }
    );

    sectionHeadingsRef.current.forEach((h) => h && observer.observe(h));
    if (stepsRef.current) observer.observe(stepsRef.current);
    if (examplesRef.current) observer.observe(examplesRef.current);
    if (previewRef.current) observer.observe(previewRef.current);

    return () => observer.disconnect();
  }, []);

  // 3D tilt + spotlight for step cards (consistent with Manifesto)
  useEffect(() => {
    if (!stepsRef.current) return;
    const cards = Array.from(stepsRef.current.querySelectorAll<HTMLElement>(`.${styles.stepCard}`));
    const cleanups: Array<() => void> = [];
    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotX = (0.5 - y) * 6;
        const rotY = (x - 0.5) * 6;
        gsap.to(card, {
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: 'power2.out',
        });
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
      };
      const onLeave = () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  // 3D tilt for example cards
  useEffect(() => {
    if (!examplesRef.current) return;
    const cards = Array.from(examplesRef.current.querySelectorAll<HTMLElement>(`.${styles.exampleCard}`));
    const cleanups: Array<() => void> = [];
    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotX = (0.5 - y) * 3;
        const rotY = (x - 0.5) * 3;
        gsap.to(card, {
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 1200,
          duration: 0.3,
          ease: 'power2.out',
        });
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
      };
      const onLeave = () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(skillMd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = skillMd;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [skillMd]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([skillMd], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SKILL.md';
    a.click();
    URL.revokeObjectURL(url);
  }, [skillMd]);

  const setHeadingRef = (idx: number) => (el: HTMLHeadingElement | null) => {
    if (el) sectionHeadingsRef.current[idx] = el;
  };

  return (
    <main className={styles.main}>
      {/* HERO — 与 Home/Hero 一致的视觉语言：blob 背景、char-by-char 渐变标题、副标题 + actions */}
      <section ref={heroRef} className={styles.hero}>
        <div className={styles.blob} style={{ top: '10%', left: '5%', width: 320, height: 320, background: 'hsl(280 90% 60%)', animationDelay: '0s' }} />
        <div className={styles.blob} style={{ top: '55%', right: '8%', width: 380, height: 380, background: 'hsl(340 90% 55%)', animationDelay: '-2s' }} />
        <div className={styles.blob} style={{ bottom: '10%', left: '25%', width: 260, height: 260, background: 'hsl(180 90% 50%)', animationDelay: '-4s' }} />
        <div className={styles.blob} style={{ top: '25%', right: '22%', width: 220, height: 220, background: 'hsl(30 95% 55%)', animationDelay: '-6s' }} />

        <div className={styles.heroGrid}>
          {/* 左栏：标题/副标题/统计/CTA */}
          <div className={styles.heroLeft}>
            <div className={styles.kicker}>{KICKER}</div>
            <h1 ref={titleRef} className={styles.heroTitle}>
              {TITLE.split('').map((c, i) => (
                <span key={i} data-char className={styles.heroChar}>
                  {c === ' ' ? '\u00A0' : c}
                </span>
              ))}
            </h1>
            <p ref={subtitleRef} className={styles.heroSubtitle}>
              把 Motion.Lab 的 <strong className={styles.heroStrong}>{effectsCount}</strong> 个动效打包成 SKILL.md，
              <br />安装到任意 AI Agent，用自然语言获取可复制的动效源码。
            </p>

            <div ref={statsRef} className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{effectsCount}</span>
                <span className={styles.statLabel}>动效</span>
              </div>
              <span className={styles.statSep}>·</span>
              <div className={styles.statItem}>
                <span className={styles.statValue}>4</span>
                <span className={styles.statLabel}>分类</span>
              </div>
              <span className={styles.statSep}>·</span>
              <div className={styles.statItem}>
                <span className={styles.statValue}>100<span className={styles.statUnit}>%</span></span>
                <span className={styles.statLabel}>开源</span>
              </div>
            </div>

            <div ref={actionsRef} className={styles.heroActions}>
              <button className={styles.btnPrimary} onClick={handleDownload}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span>下载 SKILL.md</span>
              </button>
              <button className={styles.btnSecondary} onClick={handleCopy}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{copied ? '已复制 ✓' : '复制内容'}</span>
              </button>
            </div>
          </div>

          {/* 右栏：演示对话窗口 + 代码片段 */}
          <div ref={demoRef} className={styles.heroRight}>
            {/* 顶部能力徽章 — 放在 demo 框上方一行，不覆盖内容 */}
            <div className={styles.featureRow} aria-hidden>
              <span className={styles.featureChip} style={{ color: 'hsl(280 85% 50%)' }}>· 自然语言</span>
              <span className={styles.featureChip} style={{ color: 'hsl(340 85% 50%)' }}>· 一键复制</span>
              <span className={styles.featureChip} style={{ color: 'hsl(30 95% 45%)' }}>· {effectsCount} 动效</span>
            </div>

            <div className={styles.demo}>
              <div className={styles.demoBar}>
                <span className={styles.demoDot} style={{ background: '#ff5f57' }} />
                <span className={styles.demoDot} style={{ background: '#febc2e' }} />
                <span className={styles.demoDot} style={{ background: '#28c840' }} />
                <span className={styles.demoName}>Motion.Lab Agent</span>
                <span className={styles.demoLive}>
                  <span className={styles.liveDot} />
                  LIVE
                </span>
              </div>
              <div className={styles.demoBody}>
                {DEMO_SCRIPT.slice(0, demoStep).map((m, i) => (
                  <div key={i} className={`${styles.demoMsg} ${m.type === 'user' ? styles.demoUser : styles.demoAgent}`}>
                    <span className={styles.demoBadge}>{m.type === 'user' ? '你' : 'AI'}</span>
                    <span className={styles.demoText}>{m.text}</span>
                  </div>
                ))}
                {demoStep < DEMO_SCRIPT.length && (
                  <div className={`${styles.demoMsg} ${DEMO_SCRIPT[demoStep].type === 'user' ? styles.demoUser : styles.demoAgent}`}>
                    <span className={styles.demoBadge}>{DEMO_SCRIPT[demoStep].type === 'user' ? '你' : 'AI'}</span>
                    <span className={styles.demoText}>
                      {typed}
                      <span className={styles.cursor} />
                    </span>
                  </div>
                )}
              </div>
              <div className={styles.demoFooter}>
                <span className={styles.demoStatus}>已加载 SKILL.md · {effectsCount} effects</span>
              </div>
            </div>

            {/* 代码片段卡 — 填满右栏下方的空白 */}
            <div className={styles.snippetCard}>
              <div className={styles.snippetLabel}>// SKILL.md · 片段</div>
              <pre className={styles.snippetCode}>
<span className={styles.snippetCmt}>{'# 帮我给按钮加个点击波纹效果\n'}</span><span className={styles.snippetKey}>推荐</span> <span className={styles.snippetStr}>click-ripple-material</span>{'\n'}
<span className={styles.snippetCmt}>{'# 首页标题想要打字机效果\n'}</span><span className={styles.snippetKey}>推荐</span> <span className={styles.snippetStr}>text-typewriter-multi</span>{'\n'}
<span className={styles.snippetCmt}>{'# 做个粒子背景\n'}</span><span className={styles.snippetKey}>推荐</span> <span className={styles.snippetStr}>flow-field / particle-galaxy</span>
              </pre>
            </div>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* 三步上手 — 与 Manifesto 一致的 3D tilt + spotlight 卡片 */}
      <section className={styles.section}>
        <div className={styles.headingWrap}>
          <h2 ref={setHeadingRef(0)} className={styles.heading}>三步上手</h2>
          <div className={styles.headingLine} />
        </div>
        <div ref={stepsRef} className={styles.steps} data-reveal="stagger">
          {STEPS.map((s) => (
            <div key={s.n} className={styles.stepCard}>
              <div className={styles.stepNum}>{s.n}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 示例对话 — 复用 Featured 风格：accent 顶边 + 类别色 + spotlight */}
      <section className={styles.section}>
        <div className={styles.headingWrap}>
          <h2 ref={setHeadingRef(1)} className={styles.heading}>示例对话</h2>
          <div className={styles.headingLine} />
        </div>
        <div ref={examplesRef} className={styles.examples} data-reveal="stagger">
          {EXAMPLES.map((ex, i) => (
            <div
              key={i}
              className={styles.exampleCard}
              style={{
                '--card-accent': ex.accent,
                '--card-bg-start': ex.accentBg,
                '--card-bg-end': '#ffffff',
              } as React.CSSProperties}
            >
              <div className={styles.spotlight} />
              <div className={styles.exampleQ}>
                <span className={styles.qBadge}>用户</span>
                <span className={styles.qText}>{ex.q}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.exampleA}>
                <span className={styles.aBadge} style={{ background: ex.accent, color: 'white' }}>Agent</span>
                <code className={styles.aCode}>{ex.a}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILL.md 预览 — 支持 Markdown 渲染 + 源代码切换 */}
      <section className={styles.section}>
        <div className={styles.headingWrap}>
          <h2 ref={setHeadingRef(2)} className={styles.heading}>SKILL.md 预览</h2>
          <div className={styles.headingLine} />
        </div>
        <div ref={previewRef} className={styles.preview} data-reveal="stagger">
          <div className={styles.terminal}>
            <div className={styles.terminalBar}>
              <span className={styles.terminalDot} style={{ background: '#ff5f57' }} />
              <span className={styles.terminalDot} style={{ background: '#febc2e' }} />
              <span className={styles.terminalDot} style={{ background: '#28c840' }} />
              <span className={styles.terminalName}>SKILL.md</span>
              <span className={styles.terminalMeta}>{(skillMd.length / 1024).toFixed(1)} KB · {effectsCount} effects</span>
              {/* 模式切换 */}
              <div className={styles.modeTabs}>
                <button
                  className={`${styles.modeTab} ${previewMode === 'rendered' ? styles.modeTabActive : ''}`}
                  onClick={() => setPreviewMode('rendered')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                  预览
                </button>
                <button
                  className={`${styles.modeTab} ${previewMode === 'source' ? styles.modeTabActive : ''}`}
                  onClick={() => setPreviewMode('source')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                  </svg>
                  源码
                </button>
              </div>
            </div>
            <div className={styles.terminalBody}>
              {previewMode === 'rendered' ? (
                <div className={styles.markdown}>
                  {(() => {
                    const { preview, isTruncated, totalBytes } = truncateForPreview(skillMd, 10_000);
                    const { frontmatter, body } = parseFrontmatter(preview);
                    return (
                      <>
                        {frontmatter.length > 0 && (
                          <div className={styles.frontmatter}>
                            <div className={styles.frontmatterHeader}>
                              <span className={styles.frontmatterBadge}>YAML</span>
                              <span className={styles.frontmatterTitle}>Frontmatter</span>
                            </div>
                            {frontmatter.map((f) => (
                              <div key={f.key} className={styles.frontmatterRow}>
                                <span className={styles.frontmatterKey}>{f.key}</span>
                                <span className={styles.frontmatterValue}>{f.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
                        {isTruncated && (
                          <div className={styles.truncatedNotice}>
                            <div className={styles.truncatedDivider} />
                            <div className={styles.truncatedInner}>
                              <span className={styles.truncatedBadge}>… 仅展示前 {(preview.length / 1024).toFixed(1)} KB</span>
                              <span className={styles.truncatedText}>
                                完整内容 {(totalBytes / 1024).toFixed(1)} KB 含全部动效源码 — 请下载 SKILL.md
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <pre className={styles.terminalSource}><code>{skillMd}</code></pre>
              )}
            </div>
          </div>
          <div className={styles.previewActions}>
            <button className={styles.btnPrimary} onClick={handleDownload}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <span>下载 SKILL.md</span>
            </button>
            <button className={styles.btnSecondary} onClick={handleCopy}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>{copied ? '已复制 ✓' : '复制全部'}</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
