export type Category = 'all' | 'basic' | 'text' | 'interaction' | 'advanced';
export type PanelKind = 'code' | 'params';
export interface FilterState { q: string; cat: Category; open: string | null; panel: PanelKind | null; }
const VALID_CATS: Category[] = ['all', 'basic', 'text', 'interaction', 'advanced'];
const VALID_PANELS: PanelKind[] = ['code', 'params'];
export function parseFilter(p: URLSearchParams): FilterState {
  const cat = p.get('cat'); const panel = p.get('panel');
  return {
    q: p.get('q') ?? '',
    cat: VALID_CATS.includes(cat as Category) ? (cat as Category) : 'all',
    open: p.get('open'),
    panel: VALID_PANELS.includes(panel as PanelKind) ? (panel as PanelKind) : null,
  };
}
export function toQueryString(state: Partial<FilterState>): string {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  if (state.cat && state.cat !== 'all') p.set('cat', state.cat);
  if (state.open) p.set('open', state.open);
  if (state.panel) p.set('panel', state.panel);
  const s = p.toString();
  return s ? `?${s}` : '';
}
