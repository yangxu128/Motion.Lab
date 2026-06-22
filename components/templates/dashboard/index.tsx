'use client';
import { useEffect, useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import styles from './dashboard.module.css';

function useCountUp(target: number, suffix = '', duration = 1200) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    let raf = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            const t0 = performance.now();
            const tick = (now: number) => {
              const k = Math.min(1, (now - t0) / duration);
              const eased = 1 - Math.pow(1 - k, 3);
              el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
              if (k < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => { cancelAnimationFrame(raf); obs.disconnect(); };
  }, [target, suffix, duration]);
  return ref;
}

function LineChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(ref, () => {
    const points: number[] = [];
    const N = 30;
    for (let i = 0; i < N; i++) {
      const v = 0.5 + 0.18 * Math.sin(i * 0.5) + 0.12 * Math.cos(i * 0.3 + 1.2) + 0.06 * Math.sin(i * 0.9);
      points.push(v);
    }
    return {
      onTick: ({ ctx, w, h }) => {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(139, 92, 246, 0.35)');
        grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
        // 填充
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let i = 0; i < N; i++) {
          const x = (i / (N - 1)) * w;
          const y = h - points[i] * h * 0.85 - 8;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        // 折线
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const x = (i / (N - 1)) * w;
          const y = h - points[i] * h * 0.85 - 8;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgb(139, 92, 246)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        // 最后一个点
        const lx = w;
        const ly = h - points[N - 1] * h * 0.85 - 8;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(lx - 4, ly, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgb(139, 92, 246)';
        ctx.beginPath();
        ctx.arc(lx - 4, ly, 2.5, 0, Math.PI * 2);
        ctx.fill();
      },
    };
  }, { pauseOffscreen: true, maxDpr: 1.5 });
  return <canvas ref={ref} className={styles.chartCanvas} />;
}

function BarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<number[]>([0.4, 0.6, 0.45, 0.8, 0.55, 0.7, 0.9]);
  useCanvas2D(ref, () => {
    return {
      onTick: ({ ctx, w, h }) => {
        // 缓慢变化
        dataRef.current = dataRef.current.map((v, i) => {
          const next = v + (Math.random() - 0.5) * 0.04;
          return Math.max(0.2, Math.min(0.95, next));
        });
        const N = dataRef.current.length;
        const gap = 8;
        const bw = (w - gap * (N - 1)) / N;
        for (let i = 0; i < N; i++) {
          const v = dataRef.current[i];
          const x = i * (bw + gap);
          const bh = v * (h - 16);
          // 渐变
          const g = ctx.createLinearGradient(0, h - bh, 0, h);
          g.addColorStop(0, 'hsl(280 90% 70%)');
          g.addColorStop(1, 'hsl(280 90% 50%)');
          ctx.fillStyle = g;
          ctx.beginPath();
          // 圆角矩形
          const r = Math.min(4, bw / 2);
          ctx.moveTo(x + r, h - bh);
          ctx.lineTo(x + bw - r, h - bh);
          ctx.quadraticCurveTo(x + bw, h - bh, x + bw, h - bh + r);
          ctx.lineTo(x + bw, h);
          ctx.lineTo(x, h);
          ctx.lineTo(x, h - bh + r);
          ctx.quadraticCurveTo(x, h - bh, x + r, h - bh);
          ctx.closePath();
          ctx.fill();
        }
      },
    };
  }, { pauseOffscreen: true, maxDpr: 1.5 });
  return <canvas ref={ref} className={styles.chartCanvas} />;
}

function Donut() {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(ref, () => {
    return {
      onTick: ({ ctx, w, h }) => {
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) * 0.36;
        const data = [
          { v: 0.45, c: 'hsl(280 90% 60%)' },
          { v: 0.28, c: 'hsl(200 90% 60%)' },
          { v: 0.17, c: 'hsl(330 90% 60%)' },
          { v: 0.10, c: 'hsl(40 90% 60%)' },
        ];
        let start = -Math.PI / 2;
        for (const seg of data) {
          const end = start + seg.v * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, r, start, end);
          ctx.closePath();
          ctx.fillStyle = seg.c;
          ctx.fill();
          start = end;
        }
        // 中空
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      },
    };
  }, { pauseOffscreen: true, maxDpr: 1.5 });
  return <canvas ref={ref} className={styles.chartCanvas} />;
}

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 4;
      const ry = (x - 0.5) * 4;
      card.style.setProperty('--rx', `${rx}deg`);
      card.style.setProperty('--ry', `${ry}deg`);
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
    };
    const onLeave = () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);
  return ref;
}

function KpiCard({ label, target, suffix, trend, hue }: { label: string; target: number; suffix?: string; trend: string; hue: number }) {
  const ref = useTilt();
  const countRef = useCountUp(target, suffix ?? '');
  return (
    <div ref={ref} className={styles.kpi} style={{
      '--hue': hue,
    } as React.CSSProperties}>
      <div className={styles.kpiSpot} aria-hidden />
      <div className={styles.kpiTop}>
        <span className={styles.kpiLabel}>{label}</span>
        <span className={styles.kpiTrend} data-pos={trend.startsWith('+')}>{trend}</span>
      </div>
      <div className={styles.kpiValue}><span ref={countRef}>0</span></div>
      <div className={styles.kpiSpark} />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className={styles.page}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandDot} />
          <span className={styles.brandName}>Lumen</span>
        </div>
        <nav className={styles.nav}>
          {[
            ['概览', '◐', true],
            ['分析', '◑'],
            ['用户', '◒'],
            ['订单', '◓'],
            ['设置', '◔'],
          ].map(([label, icon, active]) => (
            <a key={label as string} href="#" className={styles.navItem} data-active={!!active}>
              <span className={styles.navIcon}>{icon as string}</span>
              <span>{label as string}</span>
            </a>
          ))}
        </nav>
        <div className={styles.sideFoot}>
          <div className={styles.avatar} />
          <div className={styles.who}>
            <div className={styles.whoName}>Lina Wu</div>
            <div className={styles.whoRole}>Admin</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.breadcrumb}>概览 · 仪表盘</div>
            <h1 className={styles.pageTitle}>下午好，Lina 👋</h1>
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.search}>搜索…</button>
            <button className={styles.notif}>🔔</button>
          </div>
        </header>

        {/* KPIs */}
        <section className={styles.kpiGrid}>
          <KpiCard label="总收入" target={184320} suffix="" trend="+12.4%" hue={280} />
          <KpiCard label="新增用户" target={2340} suffix="" trend="+8.1%" hue={200} />
          <KpiCard label="订单数" target={987} suffix="" trend="+24.7%" hue={330} />
          <KpiCard label="转化率" target={4} suffix="%" trend="-0.3%" hue={40} />
        </section>

        {/* CHARTS */}
        <section className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <div className={styles.chartHead}>
              <div>
                <div className={styles.chartTitle}>收入趋势</div>
                <div className={styles.chartSub}>最近 30 天</div>
              </div>
              <div className={styles.chartTabs}>
                <span data-active>30d</span>
                <span>90d</span>
                <span>1y</span>
              </div>
            </div>
            <div className={styles.chartBody}>
              <LineChart />
            </div>
          </div>
          <div className={styles.chartCard}>
            <div className={styles.chartHead}>
              <div>
                <div className={styles.chartTitle}>渠道分布</div>
                <div className={styles.chartSub}>实时</div>
              </div>
            </div>
            <div className={styles.donutWrap}>
              <Donut />
              <div className={styles.donutLegend}>
                <div><span style={{ background: 'hsl(280 90% 60%)' }} />直接访问 45%</div>
                <div><span style={{ background: 'hsl(200 90% 60%)' }} />搜索引擎 28%</div>
                <div><span style={{ background: 'hsl(330 90% 60%)' }} />社交媒体 17%</div>
                <div><span style={{ background: 'hsl(40 90% 60%)' }} />其他 10%</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.bottomGrid}>
          <div className={styles.chartCard}>
            <div className={styles.chartHead}>
              <div>
                <div className={styles.chartTitle}>每周活跃</div>
                <div className={styles.chartSub}>用户数（千）</div>
              </div>
            </div>
            <div className={styles.chartBody}><BarChart /></div>
          </div>
          <div className={styles.chartCard}>
            <div className={styles.chartHead}>
              <div>
                <div className={styles.chartTitle}>最近活动</div>
                <div className={styles.chartSub}>实时</div>
              </div>
            </div>
            <ul className={styles.activity}>
              {[
                { t: '新订单 #1284', who: 'Alice', a: '1 分钟前' },
                { t: '用户注册', who: 'Bob', a: '5 分钟前' },
                { t: '退款处理', who: '系统', a: '12 分钟前' },
                { t: '新评论', who: 'Charlie', a: '18 分钟前' },
              ].map((row, i) => (
                <li key={i} className={styles.activityItem}>
                  <span className={styles.activityDot} style={{ animationDelay: `${i * 0.2}s` }} />
                  <div className={styles.activityBody}>
                    <div className={styles.activityTitle}>{row.t}</div>
                    <div className={styles.activityMeta}>{row.who} · {row.a}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
