'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './slide-in-right.module.css';
export default function SlideInRight({ params }: { params: { duration: number } }) {
  return <PreviewFrame><div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s` }}>Slide Right →</div></PreviewFrame>;
}
