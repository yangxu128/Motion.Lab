'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import styles from './EmptyState.module.css';
export function EmptyState() {
  const router = useRouter();
  return (
    <div className={styles.empty}>
      <h2>没找到</h2>
      <p>试试清除筛选条件。</p>
      <Button variant="primary" onClick={() => router.replace('/lab')}>清除筛选</Button>
    </div>
  );
}
