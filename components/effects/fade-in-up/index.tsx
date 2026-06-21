'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './fade-in-up.module.css';
export default function FadeInUp({ params }: { params: { duration: number; distance: number } }) {
  return <PreviewFrame><div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s`, ['--distance' as any]: `${params.distance}px` }}>Fade In Up</div></PreviewFrame>;
}
