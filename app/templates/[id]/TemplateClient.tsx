'use client';
import { useEffect, useState, type ComponentType } from 'react';
import Link from 'next/link';
import type { Template } from '@/data/templates';
import styles from './template-detail.module.css';

const CATEGORY_LABEL: Record<string, string> = {
  marketing: '营销', product: '产品', auth: '认证', commerce: '电商', creative: '创意',
  brutalism: '新粗野', neumorphism: '拟物', cyberpunk: '赛博', y2k: 'Y2K',
  terminal: '终端', spatial: '空间', swiss: '瑞士', memphis: '孟菲斯',
  tech: '科技', minimal: '极简', bauhaus: '包豪斯', steampunk: '蒸汽', macaron: '马卡龙',
  showcase: '高级展示',
  atmospheric: '氛围',
  painterly: '油画',
};

type Meta = Omit<Template, 'preview'>;

export default function TemplateClient({ id, meta }: { id: string; meta: Meta }) {
  const [Comp, setComp] = useState<ComponentType | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const m = await import(`@/components/templates/${id}`);
      if (!cancelled) setComp(() => m.default);
    })();
    return () => { cancelled = true; };
  }, [id]);

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <Link href="/templates" className={styles.back}>
          <span className={styles.backArrow}>←</span>
          <span>返回列表</span>
        </Link>
        <div className={styles.meta}>
          <span className={styles.catTag}>{CATEGORY_LABEL[meta.category] || meta.category}</span>
          <span className={styles.name}>{meta.name}</span>
          <span className={styles.eng}>{meta.englishName}</span>
        </div>
        <div className={styles.actions}>
          <a
            href={`/templates/${id}`}
            target="_blank"
            rel="noreferrer"
            className={styles.action}
            title="在新窗口打开"
          >
            ↗ 新窗口
          </a>
        </div>
      </div>
      <div className={styles.canvas}>
        {Comp ? <Comp /> : (
          <div className={styles.loading}>
            <span /><span /><span />
          </div>
        )}
      </div>
    </div>
  );
}
