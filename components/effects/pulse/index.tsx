'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './pulse.module.css';
export default function Pulse({ params }: { params: { duration: number; intensity: number } }) {
  return <PreviewFrame><div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s`, ['--intensity' as any]: `${params.intensity}` }}>●</div></PreviewFrame>;
}
