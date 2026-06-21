'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './rotate-in.module.css';
export default function RotateIn({ params }: { params: { duration: number } }) {
  return <PreviewFrame><div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s` }}>Rotate</div></PreviewFrame>;
}
