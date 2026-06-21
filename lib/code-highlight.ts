import { createHighlighter, type Highlighter } from 'shiki';
let p: Promise<Highlighter> | null = null;
function getH() { if (!p) p = createHighlighter({ themes: ['github-light'], langs: ['html', 'css', 'javascript', 'typescript'] }); return p; }
export async function highlight(code: string, lang: 'html' | 'css' | 'javascript' | 'typescript') {
  const hl = await getH();
  return hl.codeToHtml(code, { lang, theme: 'github-light' });
}
