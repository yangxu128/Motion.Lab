import type { CSSProperties, ReactNode } from 'react';
import styles from './PreviewFrame.module.css';

interface PreviewFrameProps {
  children: ReactNode;
  style?: CSSProperties;
  category?: 'basic' | 'text' | 'interaction' | 'advanced';
  label?: string;
}

const CATEGORY_LABEL: Record<NonNullable<PreviewFrameProps['category']>, string> = {
  basic: 'BASIC',
  text: 'TEXT',
  interaction: 'INTERACTION',
  advanced: 'ADVANCED',
};

export function PreviewFrame({ children, style, category, label }: PreviewFrameProps) {
  return (
    <div className={styles.frame} style={style} data-category={category}>
      {/* 细密点阵网格 — 给所有动效一个精致的"画布"质感 */}
      <div className={styles.grid} aria-hidden="true" />
      {/* 顶部柔光 + 底部暗角 — 增加视觉深度 */}
      <div className={styles.lights} aria-hidden="true">
        <div className={styles.lightTop} />
        <div className={styles.lightBottom} />
      </div>
      {/* 角落分类标签（可选） */}
      {category && (
        <div className={styles.cornerLabel} aria-hidden="true">
          {CATEGORY_LABEL[category]}
        </div>
      )}
      {label && (
        <div className={styles.bottomHint} aria-hidden="true">
          {label}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
