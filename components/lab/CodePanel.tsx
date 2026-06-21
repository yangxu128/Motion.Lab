'use client';
import { useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { CopyButton } from '@/components/ui/CopyButton';
import type { Effect } from '@/data/effects';
import styles from './CodePanel.module.css';
type Lang = 'html' | 'css' | 'js';
const TABS: { value: Lang; label: string }[] = [{ value: 'html', label: 'HTML' }, { value: 'css', label: 'CSS' }, { value: 'js', label: 'JS' }];
export function CodePanel({ effect }: { effect: Effect }) {
  const [lang, setLang] = useState<Lang>('html');
  const code = lang === 'html' ? effect.code.html : lang === 'css' ? effect.code.css : effect.code.js;
  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        <Tabs items={TABS} value={lang} onChange={setLang} />
        <CopyButton text={code || `// 无需 ${lang.toUpperCase()}`} />
      </div>
      <div className={styles.code}><pre>{code || `// 无需 ${lang.toUpperCase()}`}</pre></div>
    </div>
  );
}
