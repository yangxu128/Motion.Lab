// lib/css-vars.ts — 类型安全的 CSS 自定义属性 helper，替代 `as any` 强转
import type { CSSProperties } from 'react';

type CssVars = Record<`--${string}`, string | number>;

/** 构造一个带 CSS 自定义属性的 style 对象，零 `as any` */
export function cssVars(vars: CssVars): CSSProperties {
  return vars as CSSProperties;
}

/** 把数字/字符串值规范化为 CSS value（数字补 px） */
export function v(value: string | number, unit: 's' | 'ms' | 'px' | 'deg' | 'rem' | 'em' | '%' | '' = ''): string {
  if (typeof value === 'number') return `${value}${unit}`;
  return value;
}

/** 常用参数 → CSS 变量快捷方式 */
export const cv = {
  duration: (s: number) => ({ '--duration': `${s}s` }),
  delay: (s: number) => ({ '--delay': `${s}s` }),
  color: (h: string) => ({ '--color': h }),
};
