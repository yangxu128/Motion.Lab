'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './elastic-in.module.css';
export default function ElasticIn({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s` }}>Elastic</div>
    </PreviewFrame>
  );
}
