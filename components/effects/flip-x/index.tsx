'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './flip-x.module.css';
export default function FlipX({ params }: { params: { duration: number } }) {
  return <PreviewFrame><div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s` }}>Flip X</div></PreviewFrame>;
}
