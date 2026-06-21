// lib/skill.ts — 生成可供 AI Agent 使用的 SKILL.md 内容（从 EFFECTS 数据动态构建，始终同步）
import { EFFECTS, CATEGORIES, type EffectCategory } from '@/data/effects';

const SITE_URL = 'https://motion-lab.vercel.app';

const CATEGORY_LABEL: Record<EffectCategory, string> = {
  basic: '基础',
  text: '文字',
  interaction: '交互',
  advanced: '高级',
};

const DIFFICULTY_STARS = (d: number) => '★'.repeat(d) + '☆'.repeat(3 - d);

function effectsByCategory(cat: EffectCategory) {
  return EFFECTS.filter((e) => e.category === cat);
}

function buildEffectTable(cat: EffectCategory): string {
  const rows = effectsByCategory(cat).map((e) =>
    `| \`${e.id}\` | ${e.name} | ${e.englishName} | ${DIFFICULTY_STARS(e.difficulty)} | ${e.description}`,
  );
  return `| ID | 名称 | 英文名 | 难度 | 说明 |\n|----|------|--------|------|------|\n${rows.join('\n')}`;
}

function buildCodeSection(cat: EffectCategory): string {
  const blocks = effectsByCategory(cat).map((e) => {
    const paramsDoc = e.params.length
      ? e.params.map((p) => {
          if ('options' in p) return `- \`${p.key}\` (${p.label}): 选项 ${JSON.stringify(p.options)}，默认 \`${p.default}\``;
          const unit = p.unit ? p.unit : '';
          return `- \`${p.key}\` (${p.label}): 范围 ${p.min}–${p.max}（步长 ${p.step}）${unit}，默认 ${p.default}`;
        }).join('\n')
      : '- 无可调参数';
    return `#### \`${e.id}\` — ${e.name}（${e.englishName}）

${e.description}

**参数：**
${paramsDoc}

**HTML：**
\`\`\`html
${e.code.html}
\`\`\`

**CSS：**
\`\`\`css
${e.code.css}
\`\`\`

**JS：**
\`\`\`javascript
${e.code.js || '// Pure CSS — no JS needed'}
\`\`\`

[在线预览](${SITE_URL}/lab/${e.id})`;
  });
  return blocks.join('\n\n---\n\n');
}

export const SKILL_FRONTMATTER = `---
name: motion-lab
description: Motion.Lab 动效库 — 160 个精选前端动效（基础/文字/交互/高级），每个动效提供可直接复制的 HTML/CSS/JS 源码与可调参数。当用户需要为网页、组件、落地页添加动画效果，或询问"有什么动效推荐"时使用。
---

`;

export function buildSkillMd(): string {
  const sections = (['basic', 'text', 'interaction', 'advanced'] as EffectCategory[]).map((cat) => {
    const list = effectsByCategory(cat);
    return `## ${CATEGORY_LABEL[cat]}（${cat}）— ${list.length} 个\n\n${buildEffectTable(cat)}\n\n### ${CATEGORY_LABEL[cat]}源码\n\n${buildCodeSection(cat)}`;
  });

  return `${SKILL_FRONTMATTER}# Motion.Lab 动效库

Motion.Lab 是一个包含 **${EFFECTS.length} 个精选前端动效**的中文参考库，覆盖基础、文字、交互、高级四大类。每个动效均提供可直接复制的 HTML/CSS/JS 源码，并支持参数调节。

- 线上站点：${SITE_URL}
- 实验室：${SITE_URL}/lab
- 源码仓库：https://github.com/yangxu128/Motion.Lab

## 何时使用

当用户出现以下意图时调用本 Skill：

- "帮我给 XX 加个动画/动效"
- "有没有 XX 效果的代码"
- "落地页/按钮/卡片想要 XX 交互"
- "文字想要 XX 特效"
- "背景做个粒子/星空/流体效果"

## 使用流程

1. **检索**：根据用户需求在下方清单中找到对应 \`id\`（可按关键词、分类、难度筛选）
2. **取码**：直接从下方对应 \`id\` 的代码块复制 HTML/CSS/JS；或访问 \`${SITE_URL}/lab/<id>\` 查看实时预览
3. **调参**：每个动效列出可调参数（range/select），按需修改 CSS 自定义属性或 JS 变量
4. **落地**：将 HTML 放入页面结构、CSS 放入样式表、JS 放入 \`<script>\` 或模块；参数通过 \`style="--key: value"\` 或 JS 变量传入

## 分类说明

- **basic（基础）**：进入/退出/循环动画，以纯 CSS 为主，最易集成
- **text（文字）**：文字特效，打字机、渐变、描边、3D 等
- **interaction（交互）**：悬停、点击、拖拽、滚动类交互动效
- **advanced（高级）**：Canvas、Three.js、GLSL 着色器、物理仿真等

## 动效清单与源码

${sections.join('\n\n---\n\n')}

---

## 示例对话

**用户**："帮我给按钮加个点击波纹效果"
→ 推荐 \`click-ripple-material\`，提供其 HTML/CSS/JS 三段代码，告知可调参数 \`duration\`

**用户**："首页大标题想要打字机效果"
→ 推荐 \`text-typewriter\`（单行）或 \`text-typewriter-multi\`（多行循环），提供代码

**用户**："做个粒子背景"
→ 按风格推荐：\`particle-fountain\`（喷泉）、\`canvas-starfield\`（星空穿越）、\`flow-field\`（流场）、\`particle-galaxy\`（Three.js 星系）

**用户**："卡片悬停时翻转显示背面"
→ 推荐 \`hover-flip-card\`，提供 3D 翻转卡片代码

**用户**："页面滚动时元素淡入"
→ 推荐 \`scroll-reveal\`，基于 IntersectionObserver，提供带阈值参数的代码

## 集成注意事项

1. **CSS 自定义属性**：多数动效通过 \`var(--key, fallback)\` 接收参数，可在元素 \`style\` 上覆盖
2. **JS 依赖**：标注 \`import * as THREE\` 的需要安装 \`three\`；标注 \`gsap\` 的需要安装 \`gsap\`
3. **无障碍**：对纯装饰动效，建议包裹 \`@media (prefers-reduced-motion: reduce)\` 降级
4. **响应式**：Canvas 类动效的宽高需随容器自适应，监听 \`resize\` 重设 \`canvas.width/height\`
`;
}

export const SKILL_MD = buildSkillMd();
export const SKILL_EFFECTS_COUNT = EFFECTS.length;
export const SKILL_CATEGORIES = CATEGORIES;
