'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './spinner.module.css';
export default function Spinner({ params }: { params: { duration: number } }) {
  return <PreviewFrame><div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s` }} /></PreviewFrame>;
}
