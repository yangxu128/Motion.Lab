import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import { HSLBackground } from '@/components/site/HSLBackground';
import { DotGrid } from '@/components/site/DotGrid';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Motion.Lab — 动效实验室',
  description: '40 个精选动效的中文参考站,支持调参与代码复制',
  metadataBase: new URL('https://motion-lab.vercel.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geist.variable} ${mono.variable}`}>
      <body><HSLBackground /><DotGrid />{children}</body>
    </html>
  );
}
