'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './stagger-fade.module.css';
const ITEMS = ['一', '二', '三', '四'];
export default function StaggerFade({ params }: { params: { duration: number; stagger: number } }) {
  return (
    <PreviewFrame>
      <ul className={styles.stagger} style={{ ['--duration' as any]: `${params.duration}s`, ['--stagger' as any]: `${params.stagger}s` }}>
        {ITEMS.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </PreviewFrame>
  );
}
