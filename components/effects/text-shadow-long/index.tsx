'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-shadow-long.module.css';
export default function TextShadowLong({ params }: { params: { depth: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['long-shadow']}>SHADOW</h1>
      </div>
    </PreviewFrame>
  );
}
