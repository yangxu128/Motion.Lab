import type { Metadata } from 'next';
import { TemplatesClient } from './TemplatesClient';

export const metadata: Metadata = {
  title: '整页模板',
  description: '23 套由动效组合而成的完整页面模板，覆盖营销、产品、认证、电商、创意、赛博、包豪斯、电影感、奇幻等风格。点击进入全屏预览。',
  keywords: ['网页模板', '整页模板', '落地页', 'landing page', '动效模板', 'Motion Lab', '前端模板'],
  openGraph: {
    title: '整页模板 — Motion.Lab',
    description: '23 套由动效组合而成的完整页面模板，覆盖营销、产品、认证、电商、创意等场景。',
    url: '/templates',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '整页模板 — Motion.Lab',
    description: '23 套由动效组合而成的完整页面模板，覆盖营销、产品、认证、电商、创意等场景。',
  },
  alternates: { canonical: '/templates' },
};

export default function TemplatesPage() {
  return <TemplatesClient />;
}
