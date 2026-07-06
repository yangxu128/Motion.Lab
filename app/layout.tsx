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
  metadataBase: new URL('https://motionlab.uanx.online'),
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
    url: 'https://motionlab.uanx.online',
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
      <body>
        <HSLBackground />
        <DotGrid />
        {/* 全局 grain 颗粒纹理（按 design-taste-frontend-v1 Section 5 规则：fixed + pointer-events: none） */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            opacity: 0.5,
            mixBlendMode: 'multiply',
          }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
