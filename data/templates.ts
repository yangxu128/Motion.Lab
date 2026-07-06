// data/templates.ts — 整页模板（每个用多种动效组合的完整页面 demo）
import type { ComponentType } from 'react';

export type TemplateCategory =
  | 'marketing' | 'product' | 'auth' | 'commerce' | 'creative'
  | 'brutalism' | 'neumorphism' | 'cyberpunk' | 'y2k' | 'terminal' | 'spatial' | 'swiss' | 'memphis'
  | 'tech' | 'minimal' | 'bauhaus' | 'steampunk' | 'macaron'
  | 'showcase' | 'atmospheric' | 'painterly' | 'cinematic' | 'fantasy';

export type CategoryKind = 'scene' | 'style';

export interface Template {
  id: string;
  name: string;
  englishName: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  /** 使用的动效 id 列表（用于展示 badge） */
  effects: string[];
  /** 视觉风格标签（用于筛选） */
  style?: string;
  preview: () => Promise<{ default: ComponentType }>;
}

/**
 * 主分类（场景）—— 固定 5 个 + 全部，不会随模板增长
 * 用于顶部一级 tab
 */
export const SCENE_CATEGORIES: { id: TemplateCategory | 'all'; name: string; english: string }[] = [
  { id: 'all', name: '全部', english: 'All' },
  { id: 'marketing', name: '营销', english: 'Marketing' },
  { id: 'product', name: '产品', english: 'Product' },
  { id: 'auth', name: '认证', english: 'Auth' },
  { id: 'commerce', name: '电商', english: 'Commerce' },
  { id: 'creative', name: '创意', english: 'Creative' },
];

/**
 * 风格分类 —— 横向滚动 chip 行
 * 后续新增风格只在这里追加一行即可，导航不撑高
 */
export const STYLE_CATEGORIES: { id: TemplateCategory; name: string; english: string }[] = [
  { id: 'brutalism', name: '新粗野', english: 'Brutalism' },
  { id: 'neumorphism', name: '拟物', english: 'Neumorphism' },
  { id: 'cyberpunk', name: '赛博', english: 'Cyberpunk' },
  { id: 'y2k', name: 'Y2K', english: 'Y2K' },
  { id: 'terminal', name: '终端', english: 'Terminal' },
  { id: 'spatial', name: '空间', english: 'Spatial' },
  { id: 'swiss', name: '瑞士', english: 'Swiss' },
  { id: 'memphis', name: '孟菲斯', english: 'Memphis' },
  { id: 'tech', name: '科技', english: 'Tech' },
  { id: 'minimal', name: '极简', english: 'Minimal' },
  { id: 'bauhaus', name: '包豪斯', english: 'Bauhaus' },
  { id: 'steampunk', name: '蒸汽', english: 'Steampunk' },
  { id: 'macaron', name: '马卡龙', english: 'Macaron' },
  { id: 'showcase', name: '高级展示', english: 'Premium Showcase' },
  { id: 'atmospheric', name: '氛围', english: 'Atmospheric' },
  { id: 'painterly', name: '油画', english: 'Painterly' },
  { id: 'cinematic', name: '电影', english: 'Cinematic' },
  { id: 'fantasy', name: '奇幻', english: 'Fantasy' },
];

/** 兼容旧引用：合并的扁平分类列表（保留以便未来需要） */
export const TEMPLATE_CATEGORIES: { id: TemplateCategory | 'all'; name: string; english: string }[] = [
  ...SCENE_CATEGORIES,
  ...STYLE_CATEGORIES,
];

/** 分类 ID → 中文标签（统一导出，避免多处重复维护） */
export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  TEMPLATE_CATEGORIES.map((c) => [c.id, c.name]),
);

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

  // ==== 风格系列 ====
  {
    id: 'brutalism',
    name: '新粗野主义',
    englishName: 'Neo-Brutalism',
    description: '硬边粗框、明黄对比、夸张投影、原始网格。宣言感、搞怪、让人一眼记住。',
    category: 'brutalism',
    style: 'brutalism',
    tags: ['brutalism', 'bold', 'y2k', 'editorial'],
    effects: ['text-marquee', 'hover-press', 'hover-tilt', 'color-cycle', 'magnetic-button', 'scroll-reveal'],
    preview: lz('brutalism'),
  },
  {
    id: 'neumorphism',
    name: '拟物软 UI',
    englishName: 'Neumorphism',
    description: '同色系背景 + 内外阴影 + 按压感按钮 + 软圆角，触感优先、温和、治愈。',
    category: 'neumorphism',
    style: 'neumorphism',
    tags: ['soft-ui', 'monochrome', 'control', 'iot'],
    effects: ['hover-press', 'toggle-flip', 'progress-ring', 'count-up', 'wave-bar', 'ripple-click'],
    preview: lz('neumorphism'),
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    englishName: 'Cyberpunk',
    description: '深色 + 霓虹青/紫/粉 + 扫描线 + 故障风文字 + 数据流。黑客感、夜店、反抗。',
    category: 'cyberpunk',
    style: 'cyberpunk',
    tags: ['cyberpunk', 'neon', 'dark', 'gaming'],
    effects: ['glitch-text', 'marquee', 'scan-lines', 'gradient-text', 'pulse-glow', 'hover-glow'],
    preview: lz('cyberpunk'),
  },
  {
    id: 'y2k',
    name: 'Y2K 复古',
    englishName: 'Y2K Retro',
    description: '黑黄棋盘格、镭射渐变、DotWeb、星球、Disco 球。千禧年、华丽、Disco 复古。',
    category: 'y2k',
    style: 'y2k',
    tags: ['y2k', 'retro', 'fashion', 'music'],
    effects: ['text-marquee', 'chrome-text', 'hover-press', 'color-cycle', 'magnetic-button', 'hover-tilt'],
    preview: lz('y2k'),
  },
  {
    id: 'terminal',
    name: '终端命令行',
    englishName: 'Terminal CLI',
    description: '绿底 + 黑白字 + ASCII 艺术 + 命令提示符 + 闪烁光标。极客感、代码即美学。',
    category: 'terminal',
    style: 'terminal',
    tags: ['cli', 'dev', 'ascii', 'monospace'],
    effects: ['typewriter', 'blink-cursor', 'ascii-art', 'text-marquee', 'count-up', 'scroll-reveal'],
    preview: lz('terminal'),
  },
  {
    id: 'vision-pro',
    name: '空间计算',
    englishName: 'Spatial / Vision Pro',
    description: '玻璃拟态 + 巨大字号 + 模糊光圈 + 高级质感。Apple 范儿、spatial、premium。',
    category: 'spatial',
    style: 'spatial',
    tags: ['spatial', 'apple', 'glassmorphism', 'premium'],
    effects: ['glass-blur', 'gradient-text', 'magnetic-button', 'scroll-parallax', 'hover-glow', 'text-marquee'],
    preview: lz('vision-pro'),
  },
  {
    id: 'swiss',
    name: '瑞士国际主义',
    englishName: 'Swiss Minimalism',
    description: '黑红配色、十二网格、Helvetica 风、几何元素、严格排版。克制、理性、高级。',
    category: 'swiss',
    style: 'swiss',
    tags: ['swiss', 'editorial', 'minimal', 'magazine'],
    effects: ['scroll-reveal', 'number-counter', 'text-marquee', 'hover-tilt', 'magnetic-button', 'wave-bar'],
    preview: lz('swiss'),
  },
  {
    id: 'memphis',
    name: '孟菲斯设计',
    englishName: 'Memphis Design',
    description: '80s 几何 + 点阵网格 + 卷曲线 + 三角圆点 + 撞色配色。欢快、活泼、年轻。',
    category: 'memphis',
    style: 'memphis',
    tags: ['memphis', '80s', 'geometric', 'playful'],
    effects: ['hover-tilt', 'text-marquee', 'color-cycle', 'magnetic-button', 'hover-press', 'scroll-reveal'],
    preview: lz('memphis'),
  },

  // ==== 第二批风格 ====
  {
    id: 'tech',
    name: '科技风',
    englishName: 'Tech HUD',
    description: '深色 + 等宽数字 + 数据流 + 电路网格 + 玻璃面板。未来感、数据可视化、HUD 范儿。',
    category: 'tech',
    style: 'tech',
    tags: ['tech', 'hud', 'data', 'dark'],
    effects: ['text-marquee', 'gradient-text', 'pulse-glow', 'hover-glow', 'color-cycle', 'count-up'],
    preview: lz('tech'),
  },
  {
    id: 'minimal',
    name: '极简风',
    englishName: 'Minimal',
    description: '大量留白 + 黑白灰 + 细线条 + 极简排版。安静、克制、呼吸感（与 Swiss 区分：更轻、更禅）。',
    category: 'minimal',
    style: 'minimal',
    tags: ['minimal', 'whitespace', 'quiet', 'calm'],
    effects: ['scroll-reveal', 'fade-in', 'count-up', 'hover-lift', 'text-marquee', 'accordion-smooth'],
    preview: lz('minimal'),
  },
  {
    id: 'bauhaus',
    name: '包豪斯',
    englishName: 'Bauhaus',
    description: '红黄蓝三原色 + 几何形状 + 纯色块 + 先锋派。功能即美学、构成感。',
    category: 'bauhaus',
    style: 'bauhaus',
    tags: ['bauhaus', 'primary-colors', 'geometric', 'constructivist'],
    effects: ['hover-tilt', 'color-cycle', 'magnetic-button', 'text-marquee', 'scroll-reveal', 'hover-press'],
    preview: lz('bauhaus'),
  },
  {
    id: 'steampunk',
    name: '蒸汽朋克',
    englishName: 'Steampunk',
    description: '铜色 + 齿轮 + 黄铜铆钉 + 维多利亚 + 复古机械。工业感、探险、蒸汽动力。',
    category: 'steampunk',
    style: 'steampunk',
    tags: ['steampunk', 'victorian', 'industrial', 'retro'],
    effects: ['hover-tilt', 'pulse-glow', 'text-marquee', 'color-cycle', 'magnetic-button', 'scroll-reveal'],
    preview: lz('steampunk'),
  },
  {
    id: 'macaron',
    name: '马卡龙梦境',
    englishName: 'Macaron Dream',
    description: '粉嫩色系 + 渐变 + 棉花糖 + 云朵 + 梦幻。少女心、甜、柔软。',
    category: 'macaron',
    style: 'macaron',
    tags: ['macaron', 'pastel', 'dream', 'cute'],
    effects: ['hover-press', 'pulse-glow', 'color-cycle', 'gradient-text', 'magnetic-button', 'scroll-reveal'],
    preview: lz('macaron'),
  },
  {
    id: 'premium-showcase',
    name: '高级展示',
    englishName: 'Premium Showcase',
    description: '对标 motionsites.ai：深色 + 鼠标 spotlight + 渐变文字 + 3D 卡片 + masonry 网格 + 漂浮装饰。',
    category: 'showcase',
    style: 'showcase',
    tags: ['showcase', 'premium', 'dark', '3d', 'gradient'],
    effects: ['mouse-spotlight', 'gradient-text', '3d-card', 'scroll-reveal', 'parallax', 'color-cycle'],
    preview: lz('premium-showcase'),
  },
  {
    id: 'misty-forest',
    name: '雾气山林',
    englishName: 'Misty Forest',
    description: 'Ken Burns 慢呼吸背景 + Canvas 雾气粒子 + 玻璃预订卡 + 暖色小屋光晕。度假酒店/民宿范儿。',
    category: 'atmospheric',
    style: 'atmospheric',
    tags: ['atmospheric', 'forest', 'lifestyle', 'ken-burns', 'particles'],
    effects: ['ken-burns', 'canvas-particles', 'glass-blur', 'glow-flicker', 'stagger-in', 'hover-lift'],
    preview: lz('misty-forest'),
  },
  {
    id: 'paris-cafe',
    name: '巴黎咖啡',
    englishName: 'Paris Café',
    description: '印象派油画背景 + Ken Burns 慢呼吸 + Canvas 雨滴 + 暖色路灯光晕。巴黎小酒馆范儿。',
    category: 'painterly',
    style: 'painterly',
    tags: ['painterly', 'paris', 'cafe', 'ken-burns', 'rain', 'bistro'],
    effects: ['ken-burns', 'canvas-rain', 'oil-paint-css', 'lamp-flicker', 'glass-blur', 'stagger-in'],
    preview: lz('paris-cafe'),
  },
  {
    id: 'velorah',
    name: '电影感视频',
    englishName: 'Velorah Cinematic',
    description: '全屏循环视频背景 + Liquid Glass 玻璃 UI + Instrument Serif 电影字 + fade-rise 入场。对标高端品牌落地页。',
    category: 'cinematic',
    style: 'cinematic',
    tags: ['cinematic', 'video-bg', 'glassmorphism', 'serif', 'minimal', 'hero'],
    effects: ['video-loop', 'liquid-glass', 'fade-rise', 'hover-scale', 'google-fonts'],
    preview: lz('velorah'),
  },
  {
    id: 'fantasy-realm',
    name: '奇幻秘境',
    englishName: 'Faeloria Fantasy',
    description: '奇幻动漫视频背景 + 飘动 Canvas 气泡 + 玻璃卡片 + DM Serif 童话字 + 渐变 hueShift。童书/冥想/梦境范儿。',
    category: 'fantasy',
    style: 'fantasy',
    tags: ['fantasy', 'storybook', 'ghibli', 'video-bg', 'bubbles', 'glass'],
    effects: ['video-loop', 'canvas-bubbles', 'liquid-glass', 'fade-rise', 'hue-shift', 'gradient-text'],
    preview: lz('fantasy-realm'),
  },
];
