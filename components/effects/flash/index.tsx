'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './flash.module.css';
const COLORS: Record<string, string> = {
  red: 'hsl(0 90% 55%)',
  yellow: 'hsl(50 95% 55%)',
  blue: 'hsl(210 90% 55%)',
  green: 'hsl(140 70% 50%)',
};
export default function Flash({ params }: { params: { duration: number; color: string } }) {
  const color = COLORS[params.color] || COLORS.red;
  return (
    <PreviewFrame>
      <div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s`, background: color }}>NOTICE</div>
    </PreviewFrame>
  );
}
