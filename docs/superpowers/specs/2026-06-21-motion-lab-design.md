# Motion.Lab — 动效展示与参考站 · 设计文档

> 日期：2026-06-21
> 类型：动效组件库 / 参考文档
> 技术栈：Next.js 15 (App Router) + GSAP + Framer Motion + Lenis
> 部署：Vercel

---

## 1. 目标与定位

**Motion.Lab** 是一个面向中文开发者的动效参考与 Playground 站点。访客可以：

- 看到 40+ 个精选动效的真实运行效果
- 在浏览器里调整参数，实时观察变化
- 一键复制可用的 HTML / CSS / JS 代码到自己的项目

**非目标**：

- 不是完整 CSS 库（如 animate.css）的下载站
- 不教动效原理（每个动效有简短文字说明，但不展开教学）
- 不做用户登录、收藏夹等社交化功能

---

## 2. 用户体验

### 2.1 视觉语言

| 维度 | 决策 |
|---|---|
| 主题 | 浅色基底 + 满版 HSL 渐变作为环境动效 |
| 主色 | 纯黑 `#0A0A0A`（文本）/ 纯白 `#FAFAFA`（卡片）|
| 强调色 | HSL 循环渐变 `hsl(var(--h) 90% 60%)`，`--h` 随时间 0→360 缓动循环 |
| 标题字体 | Geist / Inter Display，weight 900，紧字距 (-3%) |
| 正文字体 | Inter 400/500 |
| 等宽字体 | JetBrains Mono 400/600（用于代码） |
| 网格基底 | 全局 1px dot-grid 背景层，可与动效融合 |
| 圆角 | 卡片 24px、按钮 pill (999px) |
| 阴影 | 极简 — 主要靠对比和 HSL 色块来分层 |

### 2.2 站点地图

```
/ (首页)
├─ Hero                视差标题，进入按钮
├─ Manifesto           3 列大字号介绍四个分类
├─ Featured            横向滚动展示 6 个精选动效
└─ CTA                 → 进入 /lab

/lab (主实验室)
├─ Toolbar             搜索框 + 分类标签条
├─ Grid                动效卡片 3 列响应式
└─ Drawer              右侧抽屉：调参 / 代码
```

### 2.3 页面级行为

#### 首页 `/`
- 进入即播：标题用 GSAP 时间线逐字 reveal
- 滚动驱动：标题随滚动做 y/rotate/skew 复合变换（ScrollTrigger）
- Featured 区使用 Lenis 平滑滚动 + 横向 drag
- 整体 HSL 背景持续循环，作为环境动效

#### 实验室 `/lab`
- 顶部 Toolbar 始终 sticky
- 搜索：实时过滤卡片（按名称 + 标签），空结果时显示 "没找到，试试清除筛选"
- 分类标签：四个分类（基础 / 文字 / 交互 / 高级）+ "全部"
- 卡片：3 列（≥1024px）、2 列（≥640px）、1 列（移动）
- 卡片 hover：自动 replay 一次（防抖 2s）
- 抽屉：右侧滑入，宽度 480px（桌面）或全屏（移动），ESC 或点击遮罩关闭

---

## 3. 信息架构

### 3.1 数据模型

所有动效数据由 `data/effects.ts` 静态定义，构建时通过 `getStaticProps` 注入到路由。

```ts
type EffectCategory = 'basic' | 'text' | 'interaction' | 'advanced';

type EffectParam =
  | { kind: 'range'; key: string; label: string; min: number; max: number; step: number; default: number; unit?: string }
  | { kind: 'select'; key: string; label: string; options: string[]; default: string };

interface Effect {
  id: string;                // url-safe slug
  name: string;              // 中文名
  englishName: string;       // 英文名（用于代码注释）
  category: EffectCategory;
  tags: string[];            // 搜索/筛选标签
  description: string;       // 一句话说明
  difficulty: 1 | 2 | 3;     // 1=入门 2=进阶 3=高级
  params: EffectParam[];     // 可调参数
  // 三个代码片段：HTML/CSS/JS 均为字符串，构建时静态注入
  code: { html: string; css: string; js: string };
  // 预览区所需 React 组件，按 id 动态加载
  preview: () => Promise<{ default: React.ComponentType }>;
}
```

### 3.2 路由

| 路径 | 说明 | 渲染方式 |
|---|---|---|
| `/` | 首页 | SSG |
| `/lab` | 主实验室（带查询参数 `?q=&cat=`） | SSG + 客户端筛选 |
| `/lab/[id]` | 单个动效详情（直接落地分享） | SSG（动态路由） |

---

## 4. 动效目录（40 个）

### 4.1 基础 CSS 动画（12）

| id | 中文名 | 英文 | 难度 |
|---|---|---|---|
| fade-in | 淡入 | Fade In | 1 |
| fade-in-up | 上滑淡入 | Fade In Up | 1 |
| slide-in-left | 左侧滑入 | Slide In Left | 1 |
| slide-in-right | 右侧滑入 | Slide In Right | 1 |
| zoom-bounce | 缩放弹跳 | Zoom Bounce | 1 |
| flip-x | 水平翻转 | Flip X | 2 |
| rotate-in | 旋转入场 | Rotate In | 1 |
| pulse | 脉冲 | Pulse | 1 |
| shake | 摇晃 | Shake | 1 |
| heartbeat | 心跳 | Heartbeat | 1 |
| marquee | 跑马灯 | Marquee | 2 |
| spinner | 加载旋转 | Spinner | 1 |

### 4.2 文字/排版（10）

| id | 中文名 | 英文 | 难度 |
|---|---|---|---|
| typewriter | 打字机 | Typewriter | 1 |
| wave-text | 波浪文字 | Wave Text | 2 |
| mask-reveal | 遮罩揭示 | Mask Reveal | 2 |
| split-char | 字符分裂 | Split Character | 2 |
| gradient-text | 渐变文字 | Gradient Text | 1 |
| glitch-text | 故障文字 | Glitch Text | 3 |
| scramble | 乱码解码 | Scramble | 3 |
| count-up | 数字滚动 | Count Up | 2 |
| stagger-fade | 错落淡入 | Stagger Fade | 2 |
| vertical-marquee | 垂直跑马灯 | Vertical Marquee | 2 |

### 4.3 交互/悬停（10）

| id | 中文名 | 英文 | 难度 |
|---|---|---|---|
| magnetic-cursor | 磁吸光标 | Magnetic Cursor | 2 |
| three-d-tilt | 3D 倾斜 | 3D Tilt | 2 |
| ripple-click | 点击波纹 | Ripple Click | 1 |
| parallax-mouse | 鼠标视差 | Parallax Mouse | 2 |
| blob-cursor | 粘性光标 | Blob Cursor | 2 |
| hover-image-distort | 悬停图像畸变 | Hover Distort | 3 |
| magnetic-button | 磁吸按钮 | Magnetic Button | 2 |
| sticky-stack | 堆叠翻页 | Sticky Stack | 3 |
| drag-scroll | 拖动滚动 | Drag Scroll | 2 |
| color-picker-hover | 随悬停变色 | Color Hover | 1 |

### 4.4 高级/创意（8）

| id | 中文名 | 英文 | 难度 |
|---|---|---|---|
| gsap-scrollTrigger | 滚动驱动 | GSAP ScrollTrigger | 3 |
| three-particles | 粒子系统 | Three.js Particles | 3 |
| webgl-shader | 着色器 | WebGL Shader | 3 |
| canvas-confetti | 五彩纸屑 | Canvas Confetti | 2 |
| lottie-loader | Lottie 加载 | Lottie Loader | 2 |
| morph-svg | SVG 形变 | Morph SVG | 3 |
| grid-magnetic | 网格磁吸 | Grid Magnetic | 3 |
| sine-wave | 正弦波 | Sine Wave | 2 |

---

## 5. 组件设计

### 5.1 全局组件

| 组件 | 位置 | 职责 |
|---|---|---|
| `<HSLBackground />` | 根 layout | 全站 HSL 循环渐变背景层 |
| `<DotGrid />` | 根 layout | 1px dot-grid 背景叠加 |
| `<SiteHeader />` | 所有页面 | 顶部 logo + 导航（首页 / 实验室） |
| `<SiteFooter />` | 所有页面 | 版权 + GitHub 链接 |
| `<ReducedMotionProvider />` | 根 layout | 监听 `prefers-reduced-motion`，下发给子组件 |

### 5.2 首页组件

| 组件 | 职责 |
|---|---|
| `<Hero />` | 标题 GSAP reveal + 滚动视差 |
| `<Manifesto />` | 三列大字号分类介绍 |
| `<Featured />` | 横向滚动 6 个精选卡（Lenis + drag） |
| `<CTA />` | 大号按钮 → `/lab` |

### 5.3 实验室组件

| 组件 | 职责 |
|---|---|
| `<Toolbar />` | 搜索输入 + 分类标签条 + 计数 |
| `<EffectCard />` | 单卡片：预览 / 名称 / 操作按钮 |
| `<EffectGrid />` | 响应式网格，承载卡片 |
| `<EffectPreview />` | 卡片内的预览容器，按 `id` 动态 `import()` |
| `<Drawer />` | 右侧滑出抽屉（portal 渲染） |
| `<ParamPanel />` | 调参面板，渲染滑块/选择器 |
| `<CodePanel />` | 代码面板，三 tab + Shiki 高亮 + 复制 |

### 5.4 动效预览组件

每个动效一个独立的 React 组件，路径 `components/effects/<id>/index.tsx`，命名导出 `default` 组件。

预览组件通过 `data/effects.ts` 的 `preview` 字段 `next/dynamic` 加载，避免初始包过大。

---

## 6. 状态管理

| 状态 | 范围 | 持久化 | 方案 |
|---|---|---|---|
| 当前搜索词 | /lab | URL `?q=` | `useSearchParams` + `useRouter().replace` |
| 当前分类 | /lab | URL `?cat=` | 同上 |
| 抽屉打开的卡片 | /lab | URL `?open=<id>&panel=code\|params` | 同上 |
| 调参面板的当前值 | 抽屉 | 仅内存 | `useState`（不持久化，避免 URL 污染） |
| 已复制反馈 | 复制按钮 | 仅内存 | `useState` + 2s 计时器 |

**全部用 URL search params 驱动**——筛选状态可分享、可收藏，刷新不丢。

---

## 7. 错误与边界处理

| 场景 | 行为 |
|---|---|
| 搜索无结果 | 网格区显示空状态："没找到匹配的效果" + "清除筛选"按钮 |
| 动效预览加载失败 | 卡片预览区显示骨架 + 重试按钮 |
| 代码复制失败（权限拒绝） | 提示用户手动复制，并自动选中代码区域 |
| `prefers-reduced-motion` | 全局降级为 0.2s 淡入淡出；高级动效（WebGL/Three.js）显示静态图 |
| 移动端性能不足 | 自动检测低端设备（`navigator.hardwareConcurrency < 4`），HSL 背景渐变改为静态 |

---

## 8. 可访问性

- 所有交互可键盘访问（Tab / Enter / Esc）
- 抽屉打开时焦点 trap，关闭后焦点回到触发卡片
- 颜色对比度满足 WCAG AA（黑/白 = 21:1）
- 提供 `prefers-reduced-motion` 全局降级
- 抽屉打开时 `body` 设置 `overflow: hidden`，关闭后恢复
- ARIA 标签：搜索框 `role="search"`、抽屉 `role="dialog"` `aria-modal="true"`

---

## 9. 性能

| 指标 | 目标 |
|---|---|
| Lighthouse Performance | ≥ 90 |
| First Contentful Paint | < 1.5s (3G Fast) |
| Time to Interactive | < 3s |
| 初始 JS 体积 | < 200KB gzip（不含高级分类的 Three.js / WebGL） |
| 高级动效 | `next/dynamic` + `ssr: false`，按需懒加载 |

实现策略：

- `next/font` 自动托管字体
- 图片用 `next/image`
- 高级动效（Three.js、WebGL、Lottie）按需动态导入
- 静态资源 CDN 缓存一年（Vercel 默认）

---

## 10. 测试策略

| 层 | 工具 | 覆盖 |
|---|---|---|
| 单元 | Vitest | 工具函数（参数解析、URL 参数同步） |
| 组件 | Vitest + Testing Library | 卡片渲染、抽屉开关、搜索过滤 |
| 端到端 | Playwright | 首页 → 实验室 → 调参 → 复制 关键路径 |
| 视觉回归 | Playwright 截图 | 四个分类的代表动效（fade-in、typewriter、magnetic-cursor、three-particles） |

不追求 100% 覆盖率，只覆盖关键路径和用户操作流。

---

## 11. 部署

- **平台**：Vercel
- **触发**：`main` 分支 push 自动部署
- **预览**：每个 PR 自动生成 preview URL
- **环境变量**：无（纯静态 + 客户端筛选）
- **域名**：`motion-lab.vercel.app`（暂用 Vercel 子域名）

---

## 12. 项目结构

```
motion-lab/
├─ app/
│  ├─ layout.tsx                 # 根布局：HSL 背景 + dot-grid + reduced-motion provider
│  ├─ page.tsx                   # 首页
│  ├─ globals.css                # 全局样式 + CSS 变量
│  ├─ lab/
│  │  ├─ page.tsx                # 实验室列表
│  │  └─ [id]/page.tsx           # 详情（直接落地）
│  └─ icon.svg
├─ components/
│  ├─ site/                      # SiteHeader / SiteFooter
│  ├─ home/                      # Hero / Manifesto / Featured / CTA
│  ├─ lab/                       # Toolbar / EffectCard / EffectGrid / Drawer / ParamPanel / CodePanel
│  ├─ effects/                   # 每个动效一个子目录
│  │  ├─ fade-in/index.tsx
│  │  ├─ ... (40 个)
│  │  └─ sine-wave/index.tsx
│  └─ ui/                        # 通用 UI 原子：Button / Drawer / Tabs / Slider
├─ data/
│  └─ effects.ts                 # 40 个动效元数据 + 懒加载 preview
├─ lib/
│  ├─ params.ts                  # 调参逻辑
│  ├─ code-highlight.ts          # Shiki 封装
│  └─ url-state.ts               # URL search params 工具
├─ public/
│  └─ fonts/                     # Geist / JetBrains Mono
├─ styles/                       # 模块化 CSS（按需）
├─ tests/
│  ├─ unit/
│  └─ e2e/
├─ next.config.mjs
├─ package.json
└─ tsconfig.json
```

---

## 13. 关键依赖

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "gsap": "^3.12.0",
    "framer-motion": "^11.0.0",
    "@studio-freight/lenis": "^1.1.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.95.0",
    "lottie-react": "^2.4.0",
    "shiki": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/react": "^19.0.0",
    "vitest": "^1.5.0",
    "@testing-library/react": "^15.0.0",
    "@playwright/test": "^1.42.0"
  }
}
```

---

## 14. 实现阶段（高层分解）

1. **脚手架** — Next.js 项目初始化、依赖安装、目录结构
2. **基础设施** — 全局样式、HSL 背景、dot-grid、reduced-motion provider
3. **数据层** — `data/effects.ts` 完整定义 40 个动效元数据
4. **首页** — Hero / Manifesto / Featured / CTA
5. **实验室骨架** — Toolbar / Grid / Card / Drawer
6. **动效实现**（按分类）— 基础 12 → 文字 10 → 交互 10 → 高级 8
7. **代码高亮 + 复制** — Shiki 集成
8. **可访问性 + 性能** — 焦点管理、Lighthouse 优化
9. **测试** — 单元 + E2E + 视觉回归
10. **部署** — Vercel 部署与冒烟测试

每个阶段结束都构建一次，确保不破坏主分支。

---

## 15. 风险与缓解

| 风险 | 影响 | 缓解 |
|---|---|---|
| 高级动效性能拖累首屏 | Lighthouse 评分低 | `next/dynamic` + `ssr: false` 懒加载 |
| 动效在 Safari 上的兼容性 | 卡片动效不一致 | 提前在真机/ BrowserStack 验证；降级用基础 CSS |
| GSAP 商业许可 | 法务风险 | 使用 MIT 版的 ScrollTrigger / MotionPath 插件，避开 Club GreenSock 收费插件 |
| 代码复制在 HTTP 环境下不可用 | 用户体验差 | 提示使用 HTTPS / localhost 部署 |
| 用户对"彩色满版"审美疲劳 | 跳出率高 | 提供主题切换（已规划 V2），V1 不做 |

---

## 16. 验收标准

完成时必须满足：

- [ ] 40 个动效全部实现，且全部支持调参与代码复制
- [ ] 首页、实验室、详情页三个路由均可访问
- [ ] 搜索 + 分类筛选 + 抽屉 三个核心交互零 bug
- [ ] URL 参数同步：刷新页面后筛选状态保留
- [ ] Lighthouse 性能 ≥ 90、可访问性 ≥ 95
- [ ] `prefers-reduced-motion` 下所有动效降级为淡入淡出
- [ ] Vercel 部署成功，URL 可公开访问
- [ ] 至少 4 个 E2E 测试通过
