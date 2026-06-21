// SiteFooter.tsx
import styles from './SiteFooter.module.css';
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span>© 2026 Motion.Lab — 为中文开发者打造</span>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
    </footer>
  );
}
