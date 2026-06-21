import type { MetadataRoute } from 'next';
import { EFFECTS } from '@/data/effects';

const BASE = 'https://motion-lab.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/lab`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/skill`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];
  const effectRoutes: MetadataRoute.Sitemap = EFFECTS.map((e) => ({
    url: `${BASE}/lab/${e.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...effectRoutes];
}
