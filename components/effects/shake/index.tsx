'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './shake.module.css';
export default function Shake({ params }: { params: { duration: number } }) {
  return <PreviewFrame><div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s` }}>ERROR</div></PreviewFrame>;
}
