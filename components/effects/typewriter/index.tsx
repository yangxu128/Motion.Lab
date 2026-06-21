'use client';
import { useEffect, useState } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './typewriter.module.css';
const TEXT = 'Hello, Motion.Lab!';
export default function Typewriter({ params }: { params: { speed: number } }) {
  const [out, setOut] = useState('');
  useEffect(() => {
    let i = 0; setOut('');
    const id = setInterval(() => { i++; setOut(TEXT.slice(0, i)); if (i >= TEXT.length) clearInterval(id); }, params.speed);
    return () => clearInterval(id);
  }, [params.speed]);
  return <PreviewFrame><span className={styles.tw}>{out}</span></PreviewFrame>;
}
