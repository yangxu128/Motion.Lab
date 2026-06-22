'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './pricing.module.css';

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.visible);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const btn = ref.current;
    if (!btn) return;
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    };
    const onLeave = () => { btn.style.transform = 'translate(0, 0)'; };
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, []);
  return <button ref={ref} className={styles.magnetic}>{children}</button>;
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: '可以随时取消订阅吗？', a: '可以的。在账户设置中随时取消，无任何隐藏费用。' },
    { q: '是否提供免费试用？', a: '所有付费套餐都提供 14 天免费试用，无需信用卡。' },
    { q: '支持哪些支付方式？', a: '支持支付宝、微信支付、Visa、Mastercard、PayPal。' },
    { q: '团队套餐怎么计算？', a: '按坐席计费，可随时增减。年度订阅享受额外 8 折。' },
  ];
  return (
    <div className={styles.faq}>
      {faqs.map((f, i) => (
        <div key={i} className={styles.faqItem} data-open={open === i}>
          <button className={styles.faqQ} onClick={() => setOpen(open === i ? null : i)}>
            <span>{f.q}</span>
            <span className={styles.faqToggle}>{open === i ? '−' : '+'}</span>
          </button>
          <div className={styles.faqA}><div>{f.a}</div></div>
        </div>
      ))}
    </div>
  );
}

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const ref1 = useReveal<HTMLDivElement>();
  const ref2 = useReveal<HTMLDivElement>();
  const ref3 = useReveal<HTMLDivElement>();
  const ref4 = useReveal<HTMLDivElement>();

  const tiers = [
    {
      name: '免费版', tag: '永远免费', price: 0, yearly: 0, desc: '个人探索者入门',
      features: ['5 个项目', '基础动效库', '社区支持', '1GB 存储'],
      cta: '开始使用', primary: false, hue: 200,
    },
    {
      name: '专业版', tag: '最受欢迎', price: 29, yearly: 24, desc: '独立开发者和小型团队',
      features: ['无限项目', '完整动效库 + AI', '邮件支持', '100GB 存储', '自定义域名'],
      cta: '立即升级', primary: true, hue: 280,
    },
    {
      name: '企业版', tag: '专业团队', price: 99, yearly: 79, desc: '中大型团队和组织',
      features: ['所有专业版功能', '专属客户经理', '24/7 优先支持', '无限存储', 'SSO + 审计日志', 'SLA 99.99%'],
      cta: '联系销售', primary: false, hue: 330,
    },
  ];

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <span className={styles.kicker}>Pricing</span>
        <h1 className={styles.title}>简单透明<br />的定价</h1>
        <p className={styles.lede}>选择适合你的方案，随时升级或取消。</p>

        <div className={styles.toggle}>
          <button data-active={!yearly} onClick={() => setYearly(false)}>按月</button>
          <button data-active={yearly} onClick={() => setYearly(true)}>
            按年 <span className={styles.save}>省 20%</span>
          </button>
          <span className={styles.indicator} data-pos={yearly ? 1 : 0} aria-hidden />
        </div>
      </section>

      {/* TIERS */}
      <section className={styles.tiers} ref={ref1}>
        {tiers.map((t, i) => (
          <div
            key={t.name}
            className={styles.tier}
            data-primary={t.primary}
            data-hue={t.hue}
            style={{ '--hue': t.hue, transitionDelay: `${i * 80}ms` } as React.CSSProperties}
          >
            {t.primary && <span className={styles.popular}>✦ 最受欢迎</span>}
            <div className={styles.tierHead}>
              <span className={styles.tierName}>{t.name}</span>
              <span className={styles.tierTag}>{t.tag}</span>
            </div>
            <div className={styles.tierDesc}>{t.desc}</div>
            <div className={styles.tierPrice}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>{yearly ? t.yearly : t.price}</span>
              <span className={styles.per}>/月</span>
            </div>
            {yearly && t.price > 0 && (
              <div className={styles.tierSave}>按年付费 · 共 ${t.yearly * 12}/年</div>
            )}
            <ul className={styles.feats}>
              {t.features.map((f) => (
                <li key={f}><span className={styles.featCheck}>✓</span> {f}</li>
              ))}
            </ul>
            <Magnetic>{t.cta}</Magnetic>
          </div>
        ))}
      </section>

      {/* FEATURES MATRIX */}
      <section className={styles.matrixSection} ref={ref2}>
        <div className={styles.matrixHead}>
          <h2 className={styles.matrixTitle}>功能对比</h2>
        </div>
        <div className={styles.matrix}>
          <div className={styles.matrixRow} data-head>
            <span></span><span>免费版</span><span>专业版</span><span>企业版</span>
          </div>
          {[
            ['项目数量', '5', '无限', '无限'],
            ['动效库', '基础', '完整 + AI', '完整 + 定制'],
            ['存储空间', '1GB', '100GB', '无限'],
            ['自定义域名', '✗', '✓', '✓'],
            ['团队成员', '1', '10', '无限'],
            ['SLA', '—', '99.9%', '99.99%'],
            ['技术支持', '社区', '邮件', '24/7 专属'],
          ].map((row) => (
            <div key={row[0] as string} className={styles.matrixRow}>
              <span className={styles.matrixLabel}>{row[0]}</span>
              <span>{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testiSection} ref={ref3}>
        <h2 className={styles.testiTitle}>客户的真实评价</h2>
        <div className={styles.testiGrid}>
          {[
            { q: '动效库非常丰富，帮助我们节省了大量开发时间。', n: '李明', r: '前端工程师 · 字节跳动' },
            { q: 'AI 集成让我们的产品体验提升了一个档次。', n: 'Sarah', r: '产品经理 · 腾讯' },
            { q: '客服响应非常快，问题总是能在 1 小时内解决。', n: '王芳', r: 'CTO · 美团' },
          ].map((t) => (
            <div key={t.n} className={styles.testiCard}>
              <div className={styles.testiQ}>"{t.q}"</div>
              <div className={styles.testiWho}>
                <div className={styles.testiAvatar} />
                <div>
                  <div className={styles.testiName}>{t.n}</div>
                  <div className={styles.testiRole}>{t.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection} ref={ref4}>
        <h2 className={styles.faqTitle}>常见问题</h2>
        <FAQ />
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>准备开始了吗？</h2>
        <p>14 天免费试用，无需信用卡。</p>
        <Magnetic>免费试用 →</Magnetic>
      </section>
    </div>
  );
}
