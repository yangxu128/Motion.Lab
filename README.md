# Motion.Lab — 动效实验室

> 40 个常用动效的交互式展示、可调参数与源码复制 —— 一个属于前端开发者的动效手册。
> An interactive playground of 40 curated UI motion effects with live params and copy-to-clipboard code.

## ✨ 特性 / Features

- **40 个动效** 覆盖基础、文字、交互、高级四大类
- **搜索 & 筛选** 按名称、标签、难度快速定位
- **参数面板** 实时调节，参数走 URL state，可分享
- **代码复制** HTML / CSS / JS 拆分高亮，一键 Copy
- **响应式 + `prefers-reduced-motion`** 尊重无障碍偏好

## 🧱 技术栈 / Tech Stack

- [Next.js 15](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- TypeScript
- [GSAP](https://gsap.com) / [Framer Motion](https://www.framer.com/motion/) / [Lenis](https://lenis.darkroom.engineering/)
- [Three.js](https://threejs.org) · [@react-three/fiber](https://r3f.docs.pmnd.rs/) · [@react-three/drei](https://drei.docs.pmnd.rs/)
- [lottie-react](https://github.com/Gamote/lottie-react) · [shiki](https://shiki.style)
- 测试：[Vitest](https://vitest.dev) (单元) + [Playwright](https://playwright.dev) (E2E)

## 🚀 本地开发 / Getting Started

```bash
npm install
npm run dev          # http://localhost:3000
```

## 📜 脚本 / Scripts

| Script              | Description                |
| ------------------- | -------------------------- |
| `npm run dev`       | 启动开发服务器               |
| `npm run build`     | 生产构建                    |
| `npm run start`     | 启动生产服务器               |
| `npm run lint`      | 运行 ESLint (`next lint`)   |
| `npm test`          | 运行 Vitest 单元测试         |
| `npm run test:e2e`  | 运行 Playwright E2E 测试    |

## ☁️ 部署到 Vercel / Deploy to Vercel

1. 推送代码到 GitHub
2. 打开 <https://vercel.com/new>，点击 **Import** 选择本仓库
3. 框架会被自动识别为 **Next.js**，点击 **Deploy** 完成

Vercel 会自动跑 `npm run build`，无需额外配置（见 `vercel.json`）。

## 📁 目录结构 / Project Structure

```
app/                    # Next.js App Router (pages, layouts)
  page.tsx              # 首页
  lab/                  # 动效实验室（列表 + 详情）
components/
  effects/              # 40 个动效实现（每个一个文件夹）
  home/                 # 首页区块
  lab/                  # 实验室 UI（Drawer / ParamPanel / CodePanel …）
  site/                 # 全局 Header / Footer / 背景
  ui/                   # 通用基础组件
data/effects.ts         # 动效元数据（自动生成）
lib/                    # 工具函数（url-state、shuffle、shiki…）
tests/                  # unit (vitest) + e2e (playwright)
public/                 # 静态资源
```

## 📄 License

MIT
