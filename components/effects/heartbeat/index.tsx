'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './heartbeat.module.css';
export default function Heartbeat({ params }: { params: { duration: number } }) {
  return <PreviewFrame><div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s` }}>♥</div></PreviewFrame>;
}
