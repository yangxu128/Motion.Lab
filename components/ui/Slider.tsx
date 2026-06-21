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
