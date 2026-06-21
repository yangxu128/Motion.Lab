'use client';
import { useState, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './accordion-smooth.module.css';
export default function AccordionSmooth({ params }: { params: { duration: number } }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  return (
    <PreviewFrame>
      <div className={styles.acc}>
        <button className={styles.h} onClick={() => setOpen((v) => !v)}>Q: 什么是动效？</button>
        <div ref={bodyRef} className={styles.b} style={{ maxHeight: open ? bodyRef.current?.scrollHeight : 0, ['--duration' as any]: `${params.duration}s` }}>
          <p>动效是界面元素的运动,引导注意力,增强反馈。</p>
        </div>
      </div>
    </PreviewFrame>
  );
}
