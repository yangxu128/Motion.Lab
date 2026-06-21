'use client';
import { useState } from 'react';
import styles from './CopyButton.module.css';
export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className={styles.btn}
      data-done={done}
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }
        catch { /* fallback in CodePanel */ }
      }}
    >{done ? '✓ 已复制' : '复制'}</button>
  );
}
