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
