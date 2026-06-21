'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
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

  // Hero 演示对话 — 循环打字机效果
  useEffect(() => {
    let cancelled = false;
    const runStep = (i: number) => {
      if (cancelled) return;
      setDemoStep(i);
      setTyped('');
      const msg = DEMO_SCRIPT[i];
      let idx = 0;
      const typeTimer = setInterval(() => {
        if (cancelled) { clearInterval(typeTimer); return; }
        idx += 1;
        setTyped(msg.text.slice(0, idx));
        if (idx >= msg.text.length) {
          clearInterval(typeTimer);
          setTimeout(() => runStep((i + 1) % DEMO_SCRIPT.length), 1600);
        }
      }, 60);
    };
    const startTimer = setTimeout(() => runStep(0), 1200);
    return () => { cancelled = true; clearTimeout(startTimer); };
  }, []);

  // Hero: char-by-char entrance (consistent with Home/Hero)
  useEffect(() => {
    if (!titleRef.current) return;
    const chars = titleRef.current.querySelectorAll<HTMLElement>('[data-char]');
    // 关键：动画前先强制可见，避免 autoAlpha 起始态在某些情况下卡住
    gsap.set(chars, { autoAlpha: 1 });
    gsap.fromTo(
      chars,
      { y: 60, rotateX: -90 },
      { y: 0, rotateX: 0, stagger: 0.04, duration: 0.9, ease: 'power4.out' }
    );
  }, []);

  // Hero: subtitle + actions fade in after chars
  useEffect(() => {
    gsap.set([subtitleRef.current, actionsRef.current, statsRef.current, demoRef.current].filter(Boolean), { autoAlpha: 1 });
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { y: 24 },
        { y: 0, duration: 0.7, delay: 0.5, ease: 'power2.out' }
      );
    }
    if (actionsRef.current) {
      gsap.fromTo(
        actionsRef.current.children,
        { y: 20 },
        { y: 0, stagger: 0.1, duration: 0.5, delay: 0.8, ease: 'power2.out' }
      );
    }
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { y: 16 },
        { y: 0, stagger: 0.08, duration: 0.5, delay: 1.0, ease: 'power2.out' }
      );
    }
    if (demoRef.current) {
      gsap.fromTo(
        demoRef.current,
        { y: 40, scale: 0.96 },
        { y: 0, scale: 1, duration: 0.9, delay: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  // Hero: mouse parallax on blobs (consistent with Home/Hero)
  useEffect(() => {
    if (!heroRef.current) return;
    let raf = 0;
    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = heroRef.current!.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const blobs = heroRef.current!.querySelectorAll(`.${styles.blob}`);
        blobs.forEach((blob, i) => {
          const factor = (i + 1) * 10;
          gsap.to(blob, { x: -x * factor, y: -y * factor, duration: 0.8, ease: 'power2.out' });
        });
      });
    };
    const handleLeave = () => {
      const blobs = heroRef.current!.querySelectorAll(`.${styles.blob}`);
      gsap.to(blobs, { x: 0, y: 0, duration: 1.0, ease: 'elastic.out(1, 0.6)' });
    };
    heroRef.current.addEventListener('mousemove', handleMove);
    heroRef.current.addEventListener('mouseleave', handleLeave);
    return () => {
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

          {/* 右栏：演示对话窗口 */}
          <div ref={demoRef} className={styles.heroRight}>
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
            <div className={styles.floatTag} style={{ top: '-20px', right: '40px', background: 'hsl(280 85% 60%)' }}>
              <span>自然语言</span>
            </div>
            <div className={styles.floatTag} style={{ bottom: '-16px', left: '20px', background: 'hsl(340 85% 60%)' }}>
              <span>一键复制</span>
            </div>
            <div className={styles.floatTag} style={{ top: '40%', right: '-24px', background: 'hsl(30 95% 55%)' }}>
              <span>160 动效</span>
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

      {/* SKILL.md 预览 — 仿终端风格：带 mac 红绿灯 + toolbar + 等宽 */}
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
            </div>
            <pre className={styles.terminalBody}><code>{skillMd}</code></pre>
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
