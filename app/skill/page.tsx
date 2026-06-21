import type { Metadata } from 'next';
import { SkillPage } from '@/components/skill/SkillPage';
import { SKILL_MD, SKILL_EFFECTS_COUNT } from '@/lib/skill';

export const metadata: Metadata = {
  title: 'Skill — 让 AI 调用动效',
  description: '把 Motion.Lab 的 160 个动效打包成 SKILL.md，安装到任意 AI Agent 后用自然语言获取可复制的动效源码。',
  alternates: { canonical: '/skill' },
  openGraph: {
    title: 'Motion.Lab Skill — 让 AI 调用动效',
    description: '160 个动效打包成 SKILL.md，AI Agent 可通过自然语言调用。',
    type: 'article',
    url: '/skill',
  },
};

export default function SkillRoute() {
  return <SkillPage skillMd={SKILL_MD} effectsCount={SKILL_EFFECTS_COUNT} />;
}
