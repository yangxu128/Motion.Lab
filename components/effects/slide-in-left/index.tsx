'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './slide-in-left.module.css';
export default function SlideInLeft({ params }: { params: { duration: number } }) {
  return <PreviewFrame><div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s` }}>← Slide Left</div></PreviewFrame>;
}
