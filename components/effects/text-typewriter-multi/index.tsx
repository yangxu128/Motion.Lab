'use client';
import { useEffect, useState } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-typewriter-multi.module.css';
const LINES = ["Hello.","I am Motion.","Built for effects."];
export default function TextTypewriterMulti({ params }: { params: { speed: number } }) {
  const [out, setOut] = useState('');
  useEffect(() => {
    let li = 0, ci = 0, del = false;
    setOut('');
    const id = setInterval(() => {
      const t = LINES[li];
      ci += del ? -1 : 1;
      setOut(t.slice(0, ci));
      if (!del && ci >= t.length) { del = true; }
      else if (del && ci <= 0) { del = false; li = (li + 1) % LINES.length; }
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
