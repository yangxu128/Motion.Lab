'use client';
import { useEffect, useState } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-delete-retype.module.css';
const TEXT = 'DELETE & RETYPE';
export default function TextDeleteRetype({ params }: { params: { speed: number } }) {
  const [out, setOut] = useState('');
  useEffect(() => {
    let i = 0;
    setOut('');
    const id = setInterval(() => {
      i++;
      setOut(TEXT.slice(0, i));
      if (i >= TEXT.length) { i = 0; setOut(''); }
    }, params.speed);
    return () => clearInterval(id);
  }, [params.speed]);
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <span className={styles['tw']}>{out}</span>
      </div>
    </PreviewFrame>
  );
}
