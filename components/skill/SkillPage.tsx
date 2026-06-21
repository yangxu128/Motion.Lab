'use client';
import { useState, useCallback } from 'react';
import styles from './SkillPage.module.css';

interface Props {
  skillMd: string;
  effectsCount: number;
}

const STEPS = [
  {
    n: 1,
    title: '安装 Skill',
    desc: '将下方 SKILL.md 下载到你的 Agent 项目（如 Claude Code 的 .claude/skills/ 目录），或直接复制内容粘贴到 Agent 配置中。',
  },
  {
    n: 2,
    title: '描述需求',
    desc: '用自然语言告诉 Agent 你想要的动效，例如"给按钮加点击波纹"、"标题用打字机效果"、"做个粒子背景"。',
  },
  {
    n: 3,
    title: '获取代码',
    desc: 'Agent 会从 160 个动效中匹配最合适的，返回可直接复制的 HTML/CSS/JS 源码与参数说明，按需粘贴到项目中即可。',
  },
];

const EXAMPLES = [
  { q: '帮我给按钮加个点击波纹效果', a: 'click-ripple-material' },
  { q: '首页大标题想要打字机效果', a: 'text-typewriter-multi' },
  { q: '做个粒子背景', a: 'particle-fountain / canvas-starfield / flow-field' },
  { q: '卡片悬停时翻转显示背面', a: 'hover-flip-card' },
  { q: '页面滚动时元素淡入', a: 'scroll-reveal' },
];

export function SkillPage({ skillMd, effectsCount }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(skillMd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
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

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.kicker}>AI Agent Skill</div>
          <h1 className={styles.title}>
            让 AI 学会<span className={styles.accent}>调用动效</span>
          </h1>
          <p className={styles.subtitle}>
            把 Motion.Lab 的 {effectsCount} 个动效打包成一个 Skill 文件，安装到任意 AI Agent 后，用自然语言即可获取可复制的动效源码。
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={handleDownload}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              下载 SKILL.md
            </button>
            <button className={styles.btnSecondary} onClick={handleCopy}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {copied ? '已复制!' : '复制内容'}
            </button>
          </div>
        </div>
      </section>

      {/* Usage steps */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>三步上手</h2>
        <div className={styles.steps}>
          {STEPS.map((s) => (
            <div key={s.n} className={styles.step}>
              <div className={styles.stepNum}>{s.n}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>示例对话</h2>
        <div className={styles.examples}>
          {EXAMPLES.map((ex, i) => (
            <div key={i} className={styles.example}>
              <div className={styles.exampleQ}>
                <span className={styles.exampleBadge}>用户</span>
                <span>{ex.q}</span>
              </div>
              <div className={styles.exampleA}>
                <span className={styles.exampleBadgeA}>Agent</span>
                <code className={styles.exampleCode}>{ex.a}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILL.md preview */}
      <section className={styles.section}>
        <div className={styles.previewHeader}>
          <h2 className={styles.sectionTitle}>SKILL.md 预览</h2>
          <span className={styles.previewMeta}>{(skillMd.length / 1024).toFixed(1)} KB · Markdown</span>
        </div>
        <div className={styles.preview}>
          <pre className={styles.previewCode}><code>{skillMd}</code></pre>
        </div>
        <div className={styles.previewActions}>
          <button className={styles.btnPrimary} onClick={handleDownload}>下载 SKILL.md</button>
          <button className={styles.btnSecondary} onClick={handleCopy}>{copied ? '已复制!' : '复制全部'}</button>
        </div>
      </section>
    </main>
  );
}
