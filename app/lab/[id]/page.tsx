import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EFFECTS } from '@/data/effects';
import { LabClient } from './LabClient';

export function generateStaticParams() { return EFFECTS.map((e) => ({ id: e.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const effect = EFFECTS.find((e) => e.id === id);
  if (!effect) return { title: '未找到动效' };
  const title = `${effect.name}（${effect.englishName}）`;
  const fullTitle = `${title} — Motion.Lab`;
  const description = `${effect.description} 分类：${effect.category}，难度 ${effect.difficulty}/3。`;
  return {
    title,
    description,
    keywords: [effect.name, effect.englishName, ...effect.tags, '动效', '动画', 'Motion.Lab'],
    openGraph: {
      title: fullTitle,
      description,
      type: 'article',
      url: `/lab/${effect.id}`,
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
    alternates: { canonical: `/lab/${effect.id}` },
  };
}

export default async function EffectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const effect = EFFECTS.find((e) => e.id === id);
  if (!effect) notFound();
  return <Suspense fallback={null}><LabClient id={id} /></Suspense>;
}
