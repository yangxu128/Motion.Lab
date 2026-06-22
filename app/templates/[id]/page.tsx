import { notFound } from 'next/navigation';
import { TEMPLATES } from '@/data/templates';
import TemplateClient from './TemplateClient';

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) return { title: '模板未找到' };
  return {
    title: `${t.name} · ${t.englishName}`,
    description: t.description,
  };
}

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) notFound();
  // 仅传 metadata（不含函数）；Client 组件内做 dynamic import
  const { preview: _ignored, ...meta } = t;
  return <TemplateClient id={t.id} meta={meta} />;
}
