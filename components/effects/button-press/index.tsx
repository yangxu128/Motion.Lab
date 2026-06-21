'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './button-press.module.css';
export default function ButtonPress({ params }: { params: { scale: number } }) {
  return (
    <PreviewFrame>
      <button className={styles.btn} style={{ ['--scale' as any]: String(params.scale) }}>CLICK</button>
    </PreviewFrame>
  );
}
