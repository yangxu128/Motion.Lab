'use client';
import { useEffect, useRef, useState } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import styles from './login.module.css';

function ParticleBg() {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(ref, () => {
    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    const ps: P[] = [];
    let initW = 0;
    let initH = 0;
    return {
      onTick: ({ ctx, w, h }) => {
        if (initW !== w || initH !== h || ps.length === 0) {
          initW = w;
          initH = h;
          ps.length = 0;
          for (let i = 0; i < 50; i++) {
            ps.push({
              x: Math.random() * w,
              y: Math.random() * h,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              r: 1 + Math.random() * 2,
              c: `hsl(${280 + Math.random() * 80} 80% 70%)`,
            });
          }
        }
        ctx.clearRect(0, 0, w, h);
        for (const p of ps) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          ctx.fillStyle = p.c;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        // 连线
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            const dx = ps[i].x - ps[j].x;
            const dy = ps[i].y - ps[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 12000) {
              ctx.globalAlpha = (1 - d2 / 12000) * 0.25;
              ctx.strokeStyle = 'hsl(280 80% 70%)';
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(ps[i].x, ps[i].y);
              ctx.lineTo(ps[j].x, ps[j].y);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
      },
    };
  }, { pauseOffscreen: true, maxDpr: 1.5 });
  return <canvas ref={ref} className={styles.particles} />;
}

function RippleButton({ children, onClick, ...rest }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
    onClick?.(e);
  };
  return (
    <button ref={ref} className={styles.rippleBtn} onClick={handle} {...rest}>
      {ripples.map((r) => (
        <span key={r.id} className={styles.ripple} style={{ left: r.x, top: r.y }} aria-hidden />
      ))}
      {children}
    </button>
  );
}

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [shake, setShake] = useState(0);
  const [showPwd, setShowPwd] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setShake((s) => s + 1);
  };

  return (
    <div className={styles.page}>
      <ParticleBg />
      <div className={styles.blobA} aria-hidden />
      <div className={styles.blobB} aria-hidden />

      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandDot} />
          <span className={styles.brandName}>Lumen</span>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={styles.tab}
            data-active={mode === 'login'}
            onClick={() => setMode('login')}
          >
            登录
          </button>
          <button
            type="button"
            className={styles.tab}
            data-active={mode === 'signup'}
            onClick={() => setMode('signup')}
          >
            注册
          </button>
          <span
            className={styles.indicator}
            data-pos={mode}
            aria-hidden
          />
        </div>

        <h1 className={styles.title} key={mode}>
          {mode === 'login' ? '欢迎回来 👋' : '开始你的旅程 ✨'}
        </h1>
        <p className={styles.lede}>
          {mode === 'login' ? '使用邮箱和密码登录你的账号' : '几秒钟创建一个新账号'}
        </p>

        <form className={styles.form} onSubmit={submit} key={shake}>
          {mode === 'signup' && (
            <label className={styles.field}>
              <span className={styles.fieldLabel}>用户名</span>
              <input type="text" placeholder="输入用户名" className={styles.input} />
            </label>
          )}
          <label className={styles.field}>
            <span className={styles.fieldLabel}>邮箱</span>
            <input type="email" placeholder="you@example.com" className={styles.input} />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>密码</span>
            <div className={styles.pwdWrap}>
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                className={styles.input}
              />
              <button
                type="button"
                className={styles.eye}
                onClick={() => setShowPwd((s) => !s)}
                aria-label="显示密码"
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </label>
          {mode === 'login' && (
            <div className={styles.row}>
              <label className={styles.check}>
                <input type="checkbox" /> 记住我
              </label>
              <a href="#" className={styles.forgot}>忘记密码？</a>
            </div>
          )}
          <RippleButton type="submit" className={styles.submit}>
            <span>{mode === 'login' ? '登录' : '创建账号'}</span>
            <span className={styles.submitArrow}>→</span>
          </RippleButton>
        </form>

        <div className={styles.divider}><span>或继续使用</span></div>
        <div className={styles.socials}>
          <button className={styles.social}>Google</button>
          <button className={styles.social}>GitHub</button>
          <button className={styles.social}>Apple</button>
        </div>

        <p className={styles.foot}>
          {mode === 'login' ? '还没有账号？' : '已经有账号？'}
          <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? '立即注册' : '前往登录'}
          </button>
        </p>
      </div>
    </div>
  );
}
