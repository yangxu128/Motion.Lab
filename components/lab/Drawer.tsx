'use client';
import { useEffect } from 'react';
import styles from './Drawer.module.css';
export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [open, onClose]);
  return (
    <>
      <div className={styles.scrim} data-open={open} onClick={onClose} />
      <aside className={styles.drawer} data-open={open} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.header}><span className={styles.title}>{title}</span><button className={styles.close} onClick={onClose} aria-label="关闭">×</button></div>
        <div className={styles.body}>{children}</div>
      </aside>
    </>
  );
}
