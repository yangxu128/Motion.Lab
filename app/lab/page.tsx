import type { Metadata } from 'next';
import { LabClient } from './LabClient';

export const metadata: Metadata = {
  title: '动效实验室',
  description: '160 个精选前端动效的中文参考站，支持实时调参、代码复制与 AI Skill 调用。涵盖 CSS 动画、GSAP、Three.js、Canvas 等技术栈。',
  keywords: ['动效', '动画', 'CSS 动画', 'GSAP', 'Three.js', '前端动效', 'Motion Lab', '160 effects', 'AI Skill'],
  openGraph: {
    title: '动效实验室 — Motion.Lab',
    description: '160 个精选前端动效的中文参考站，支持实时调参与代码复制。',
    url: '/lab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '动效实验室 — Motion.Lab',
    description: '160 个精选前端动效的中文参考站，支持实时调参与代码复制。',
  },
  alternates: { canonical: '/lab' },
};

export default function LabPage() {
  return <LabClient />;
}
