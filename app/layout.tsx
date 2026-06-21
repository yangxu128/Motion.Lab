import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import { HSLBackground } from '@/components/site/HSLBackground';
import { DotGrid } from '@/components/site/DotGrid';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://motion-lab.vercel.app'),
  title: {
    default: 'Motion.Lab — 动效实验室',
    template: '%s — Motion.Lab',
  },
  description: '160 个精选动效的中文参考站,支持调参与代码复制,可被 AI Agent 通过 Skill 调用。',
  applicationName: 'Motion.Lab',
  keywords: ['动效', '动画', 'CSS 动画', 'GSAP', 'Three.js', '前端动效', 'Motion Lab', '160 effects', 'AI Skill'],
  authors: [{ name: 'yangxu128', url: 'https://github.com/yangxu128' }],
  creator: 'yangxu128',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://motion-lab.vercel.app',
    siteName: 'Motion.Lab',
    title: 'Motion.Lab — 动效实验室',
    description: '160 个精选动效的中文参考站,支持调参与代码复制。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Motion.Lab — 动效实验室',
    description: '160 个精选动效的中文参考站,支持调参与代码复制。',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geist.variable} ${mono.variable}`}>
      <body><HSLBackground /><DotGrid /><SiteHeader />{children}<SiteFooter /></body>
    </html>
  );
}
