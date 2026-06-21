'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SiteHeader.module.css';
export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}><span className={styles.dot} aria-hidden />Motion.Lab</Link>
      <nav className={styles.nav}>
        <Link href="/" data-active={pathname === '/'}>首页</Link>
        <Link href="/lab" data-active={pathname?.startsWith('/lab')}>实验室</Link>
      </nav>
    </header>
  );
}
