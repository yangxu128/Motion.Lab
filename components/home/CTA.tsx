import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './CTA.module.css';
export function CTA() {
  return (
    <section className={styles.section}>
      <h2 className={styles.big}>进实验室</h2>
      <Link href="/lab"><Button variant="primary" style={{ fontSize: 18, padding: '16px 32px' }}>开始探索 →</Button></Link>
    </section>
  );
}
