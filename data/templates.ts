// data/templates.ts — 整页模板（每个用多种动效组合的完整页面 demo）
import type { ComponentType } from 'react';

export type TemplateCategory = 'marketing' | 'product' | 'auth' | 'commerce' | 'creative';

export interface Template {
  id: string;
  name: string;
  englishName: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  /** 使用的动效 id 列表（用于展示 badge） */
  effects: string[];
  preview: () => Promise<{ default: ComponentType }>;
}

export const TEMPLATE_CATEGORIES: { id: TemplateCategory | 'all'; name: string; english: string }[] = [
  { id: 'all', name: '全部', english: 'All' },
  { id: 'marketing', name: '营销', english: 'Marketing' },
  { id: 'product', name: '产品', english: 'Product' },
  { id: 'auth', name: '认证', english: 'Auth' },
  { id: 'commerce', name: '电商', english: 'Commerce' },
  { id: 'creative', name: '创意', english: 'Creative' },
];

const lz = (id: string) => () => import(`@/components/templates/${id}`);

export const TEMPLATES: Template[] = [
  {
    id: 'landing',
    name: '产品落地页',
    englishName: 'Landing Page',
    description: '首屏渐变 + 滚动揭示 + 客户 logo 跑马灯 + 数据 stats + CTA 区域，营销页通用骨架。',
    category: 'marketing',
    tags: ['marketing', 'hero', 'scroll', 'stats', 'cta'],
    effects: ['split-char', 'scroll-reveal', 'marquee', 'count-up', 'gradient-text', 'ripple-click', 'hover-lift'],
    preview: lz('landing'),
  },
  {
    id: 'dashboard',
    name: '数据仪表盘',
    englishName: 'Dashboard',
    description: '侧栏 + 顶部 KPI 卡片 + 实时折线/柱状/环形图 + 3D 倾斜交互，数据可视化展示。',
    category: 'product',
    tags: ['dashboard', 'charts', '3d', 'kpi', 'analytics'],
    effects: ['three-d-tilt', 'count-up', 'hover-glow', 'color-cycle', 'progress-bar', 'hover-lift'],
    preview: lz('dashboard'),
  },
  {
    id: 'login',
    name: '登录注册',
    englishName: 'Login',
    description: '居中卡片 + 粒子背景 + 输入框聚焦光晕 + 按钮涟漪 + 切换 tab 翻转，最常见的认证页。',
    category: 'auth',
    tags: ['auth', 'login', 'signup', 'form', 'particles'],
    effects: ['three-particles', 'focus-glow', 'ripple-click', 'toggle-flip', 'shake', 'gradient-text'],
    preview: lz('login'),
  },
  {
    id: 'pricing',
    name: '价格方案',
    englishName: 'Pricing',
    description: '三档套餐对比 + hover 抬升 + 渐变描边 + 月/年切换 + 常见问题折叠，订阅产品标配。',
    category: 'commerce',
    tags: ['pricing', 'subscription', 'comparison', 'faq'],
    effects: ['hover-lift', 'border-draw', 'toggle-flip', 'accordion-smooth', 'count-up', 'magnetic-button'],
    preview: lz('pricing'),
  },
  {
    id: 'portfolio',
    name: '作品集',
    englishName: 'Portfolio',
    description: '磁吸网格 + 遮罩揭示 + 鼠标跟随聚光 + 文字变形 + 入场动画，个人/工作室展示页。',
    category: 'creative',
    tags: ['portfolio', 'grid', 'showcase', 'personal'],
    effects: ['grid-magnetic', 'mask-reveal', 'hover-follow-cursor', 'text-split-reveal', 'three-d-tilt', 'image-zoom'],
    preview: lz('portfolio'),
  },
];
