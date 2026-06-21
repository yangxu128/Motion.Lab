import type { CSSProperties, ReactNode } from 'react';
import styles from './PreviewFrame.module.css';
export function PreviewFrame({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className={styles.frame} style={style}>{children}</div>;
}
