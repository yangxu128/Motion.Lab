'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './neumorphism.module.css';

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

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button className={styles.toggle} data-on={on} onClick={onClick} aria-pressed={on}>
      <span className={styles.toggleKnob} />
    </button>
  );
}

function RingStat({ value, label, hue = 280 }: { value: number; label: string; hue?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const circle = e.target.querySelector('circle:last-child') as SVGCircleElement;
            if (circle) {
              const c = 2 * Math.PI * 60;
              circle.style.strokeDasharray = String(c);
              circle.style.strokeDashoffset = String(c * (1 - value));
            }
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return (
    <div ref={ref} className={styles.ring}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <defs>
          <linearGradient id={`g-${hue}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${hue} 70% 65%)`} />
            <stop offset="100%" stopColor={`hsl(${hue} 60% 50%)`} />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r="60"
          fill="none"
          stroke={`url(#g-${hue})`}
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ strokeDasharray: 377, strokeDashoffset: 377, transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className={styles.ringCenter}>
        <div className={styles.ringValue}>{Math.round(value * 100)}%</div>
      </div>
      <div className={styles.ringLabel}>{label}</div>
    </div>
  );
}

export default function Neumorphism() {
  const [lights, setLights] = useState(true);
  const [ac, setAc] = useState(22);
  const [music, setMusic] = useState(false);
  const [vacuum, setVacuum] = useState(false);

  const cLights = useCountUp(12, '');
  const cTemp = useCountUp(22, '°', 1);
  const cEnergy = useCountUp(4.2, ' kWh', 1);

  return (
    <div className={styles.page} data-dark={!lights}>
      <div className={styles.shell}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <div className={styles.brand}>Hearth</div>
            <div className={styles.brandSub}>Smart Home · Living Room</div>
          </div>
          <div className={styles.headerRight}>
            <Toggle on={lights} onClick={() => setLights(!lights)} />
            <span className={styles.status}>{lights ? 'Evening' : 'Good Night'}</span>
          </div>
        </header>

        {/* Hero stat */}
        <section className={styles.heroStat}>
          <div>
            <div className={styles.statLabel}>Indoor Temperature</div>
            <div className={styles.statValue}><span ref={cTemp}>0</span></div>
            <div className={styles.statFoot}>
              <span>Comfortable</span>
              <span>· 体感 23°</span>
            </div>
          </div>
          <div className={styles.tempControl}>
            <button onClick={() => setAc(Math.max(16, ac - 1))} className={styles.tempBtn}>−</button>
            <button onClick={() => setAc(Math.min(30, ac + 1))} className={styles.tempBtn}>+</button>
          </div>
        </section>

        {/* Devices grid */}
        <section className={styles.devices}>
          <h2 className={styles.sectionTitle}>Devices</h2>
          <div className={styles.deviceGrid}>
            {[
              { i: '💡', t: 'Floor Lamp', s: 'On', c: 60, on: true, hue: 50 },
              { i: '🎵', t: 'Speakers', s: music ? 'Playing' : 'Idle', c: music ? 1 : 0, on: music, hue: 280 },
              { i: '🧹', t: 'Vacuum', s: vacuum ? 'Cleaning' : 'Docked', c: vacuum ? 0.4 : 0, on: vacuum, hue: 200 },
              { i: '🌡️', t: 'Heater', s: 'Auto', c: 0.7, on: true, hue: 20 },
              { i: '🔒', t: 'Front Door', s: 'Locked', c: 1, on: true, hue: 0 },
              { i: '📷', t: 'Camera', s: 'Standby', c: 0, on: false, hue: 0 },
            ].map((d, i) => (
              <div key={i} className={styles.device} data-on={d.on}>
                <div className={styles.deviceTop}>
                  <span className={styles.deviceIcon} style={{ filter: d.on ? 'none' : 'grayscale(0.8)' }}>{d.i}</span>
                  <Toggle on={d.on} onClick={() => {
                    if (d.t === 'Speakers') setMusic(!music);
                    if (d.t === 'Vacuum') setVacuum(!vacuum);
                  }} />
                </div>
                <div className={styles.deviceName}>{d.t}</div>
                <div className={styles.deviceStatus}>{d.s}</div>
                <div className={styles.deviceBar}><span style={{ width: `${d.c * 100}%`, background: d.on ? `linear-gradient(90deg, hsl(${d.hue} 70% 60%), hsl(${d.hue} 60% 50%))` : 'rgba(0,0,0,0.1)' }} /></div>
              </div>
            ))}
          </div>
        </section>

        {/* Rings */}
        <section className={styles.rings}>
          <h2 className={styles.sectionTitle}>Today</h2>
          <div className={styles.ringGrid}>
            <RingStat value={0.72} label="舒适度" hue={280} />
            <RingStat value={0.43} label="空气质量" hue={200} />
            <RingStat value={0.88} label="节能" hue={140} />
            <RingStat value={0.32} label="湿度" hue={40} />
          </div>
        </section>

        {/* Energy */}
        <section className={styles.energy}>
          <div>
            <div className={styles.statLabel}>Energy Used Today</div>
            <div className={styles.energyValue}><span ref={cEnergy}>0</span></div>
            <div className={styles.statFoot}>
              <span>↓ 18% vs 昨天</span>
            </div>
          </div>
          <div className={styles.energyBars}>
            {Array.from({ length: 12 }).map((_, i) => {
              const h = 30 + Math.sin(i * 0.6) * 20 + Math.random() * 20;
              return <span key={i} style={{ height: `${h}%` }} />;
            })}
          </div>
        </section>

        {/* Scenes */}
        <section className={styles.scenes}>
          <h2 className={styles.sectionTitle}>Scenes</h2>
          <div className={styles.sceneRow}>
            {[
              { i: '🌅', n: 'Morning', c: 'hsl(30 80% 65%)' },
              { i: '📚', n: 'Focus', c: 'hsl(200 60% 55%)' },
              { i: '🍷', n: 'Dinner', c: 'hsl(330 60% 55%)' },
              { i: '🌙', n: 'Sleep', c: 'hsl(260 50% 50%)' },
            ].map((s) => (
              <button key={s.n} className={styles.sceneBtn} style={{ '--c': s.c } as React.CSSProperties}>
                <span className={styles.sceneIcon}>{s.i}</span>
                <span className={styles.sceneName}>{s.n}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
