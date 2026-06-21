'use client';
import { useState } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './toggle-flip.module.css';
export default function ToggleFlip({ params }: { params: { duration: number } }) {
  const [on, setOn] = useState(false);
  return (
    <PreviewFrame>
      <div className={`${styles.tg} ${on ? styles.on : ''}`} onClick={() => setOn((v) => !v)} style={{ ['--duration' as any]: `${params.duration}s` }}>
        <div className={styles.knob} />
      </div>
    </PreviewFrame>
  );
}
