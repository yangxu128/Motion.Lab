import { Hero } from '@/components/home/Hero';
import { Manifesto } from '@/components/home/Manifesto';
import { Featured } from '@/components/home/Featured';
import { CTA } from '@/components/home/CTA';
export default function Home() {
  return <main><Hero /><Manifesto /><Featured /><CTA /></main>;
}
