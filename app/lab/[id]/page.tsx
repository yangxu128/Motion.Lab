import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { EFFECTS } from '@/data/effects';
import { LabClient } from './LabClient';
export function generateStaticParams() { return EFFECTS.map((e) => ({ id: e.id })); }
export default async function EffectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const effect = EFFECTS.find((e) => e.id === id);
  if (!effect) notFound();
  return <Suspense fallback={null}><LabClient id={id} /></Suspense>;
}
