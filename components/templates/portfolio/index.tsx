'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './portfolio.module.css';

const works = [
  { id: 1, title: 'Lumen · SaaS Dashboard', tag: 'Product', year: '2025', hue: 280, color: 'linear-gradient(135deg, hsl(280 70% 50%), hsl(330 60% 45%))' },
  { id: 2, title: 'Nova · Mobile Banking', tag: 'Mobile', year: '2025', hue: 200, color: 'linear-gradient(135deg, hsl(200 70% 50%), hsl(280 60% 45%))' },
  { id: 3, title: 'Orbit · E-commerce', tag: 'Web', year: '2024', hue: 330, color: 'linear-gradient(135deg, hsl(330 70% 50%), hsl(40 70% 50%))' },
  { id: 4, title: 'Apex · Brand Identity', tag: 'Branding', year: '2024', hue: 40, color: 'linear-gradient(135deg, hsl(40 80% 50%), hsl(20 70% 45%))' },
  { id: 5, title: 'Pulse · Health App', tag: 'Mobile', year: '2024', hue: 150, color: 'linear-gradient(135deg, hsl(150 60% 45%), hsl(200 60% 50%))' },
  { id: 6, title: 'Echo · Music Player', tag: 'Product', year: '2023', hue: 270, color: 'linear-gradient(135deg, hsl(270 60% 50%), hsl(200 70% 50%))' },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function WorkCard({ w, i }: { w: typeof works[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let pending = false;
    let mx = 0, my = 0, active = false;
    const flush = () => {
      pending = false;
      const spot = el.querySelector('[data-spot]') as HTMLElement | null;
      if (spot) {
        spot.style.opacity = active ? '1' : '0';
        spot.style.background = `radial-gradient(circle 200px at ${mx}px ${my}px, hsla(${w.hue}, 100%, 90%, 0.45), transparent 60%)`;
      }
    };
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      active = true;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(flush);
      }
    };
    const onLeave = () => {
      active = false;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(flush);
      }
    };
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [w.hue]);

  return (
    <div
      ref={ref}
      className={styles.card}
      data-reveal
      style={{
        '--hue': w.hue,
        transitionDelay: `${i * 80}ms`,
      } as React.CSSProperties}
    >
      <div className={styles.cover} style={{ background: w.color }}>
        <span className={styles.coverText}>{w.title.split(' · ')[0]}</span>
        <div data-spot className={styles.spotlight} aria-hidden />
        <div className={styles.coverNumber}>0{i + 1}</div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.cardTag}>{w.tag}</span>
          <span className={styles.cardYear}>{w.year}</span>
        </div>
        <h3 className={styles.cardTitle}>{w.title}</h3>
        <div className={styles.cardLink}>
          View project <span className={styles.arrow}>→</span>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const heroRef = useReveal();
  const aboutRef = useReveal();
  const worksRef = useReveal();
  const [filter, setFilter] = useState('All');
  const tags = ['All', 'Product', 'Mobile', 'Web', 'Branding'];
  const filtered = filter === 'All' ? works : works.filter((w) => w.tag === filter);

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroOrbA} aria-hidden />
        <div className={styles.heroOrbB} aria-hidden />
        <div className={styles.heroInner}>
          <span className={styles.kicker}>Studio · Selected Work</span>
          <h1 className={styles.title}>
            <span className={styles.titleLine}>设计 · 代码 ·</span>
            <span className={styles.titleAccent}>动效的交叉点</span>
          </h1>
          <p className={styles.lede}>
            我们是一个 4 人工作室，专注于为现代产品打造精致的数字体验。
            过去 5 年间交付了 60+ 个项目。
          </p>
          <div className={styles.heroStats}>
            {[
              { n: '60+', l: '项目交付' },
              { n: '4', l: '设计师' },
              { n: '5y', l: '经验' },
              { n: '24', l: '奖项' },
            ].map((s, i) => (
              <div key={i} className={styles.heroStat}>
                <div className={styles.heroStatN}>{s.n}</div>
                <div className={styles.heroStatL}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className={styles.brands} aria-hidden>
        <div className={styles.brandsInner}>
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className={styles.brandsGroup}>
              {['Acme', 'Globex', 'Initech', 'Soylent', 'Hooli', 'Vandelay', 'Pied Piper', 'Massive Dynamic'].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* WORKS */}
      <section className={styles.worksSection} ref={worksRef}>
        <div className={styles.worksHead}>
          <h2 className={styles.worksTitle}>精选作品</h2>
          <div className={styles.filter}>
            {tags.map((t) => (
              <button
                key={t}
                data-active={filter === t}
                onClick={() => setFilter(t)}
                className={styles.filterBtn}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.worksGrid}>
          {filtered.map((w, i) => (
            <WorkCard key={w.id} w={w} i={i} />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles.about} ref={aboutRef}>
        <div className={styles.aboutInner}>
          <h2 className={styles.aboutTitle}>关于工作室</h2>
          <p className={styles.aboutText}>
            我们相信好的设计来自细节的打磨和持续的好奇心。每一个像素都值得被认真对待。
          </p>
          <div className={styles.team}>
            {[
              { n: '林梓', r: '设计总监', hue: 280 },
              { n: '陈思', r: '前端工程师', hue: 200 },
              { n: '李明', r: '产品经理', hue: 330 },
              { n: '王芳', r: '动效设计师', hue: 40 },
            ].map((m) => (
              <div key={m.n} className={styles.member} style={{ '--hue': m.hue } as React.CSSProperties}>
                <div className={styles.memberAvatar} style={{ background: `linear-gradient(135deg, hsl(${m.hue} 70% 60%), hsl(${(m.hue + 60) % 360} 70% 50%))` }} />
                <div>
                  <div className={styles.memberN}>{m.n}</div>
                  <div className={styles.memberR}>{m.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>有想法想聊聊？</h2>
        <p>我们总是在寻找有趣的项目和合作伙伴。</p>
        <button className={styles.ctaBtn}>
          联系我们 <span className={styles.ctaArrow}>→</span>
        </button>
      </section>
    </div>
  );
}
