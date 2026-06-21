import { describe, it, expect } from 'vitest';
import { parseFilter, toQueryString } from '@/lib/url-state';

describe('url-state', () => {
  it('parses empty params to defaults', () => {
    expect(parseFilter(new URLSearchParams(''))).toEqual({ q: '', cat: 'all', open: null, panel: null });
  });
  it('parses present params', () => {
    const p = new URLSearchParams('q=foo&cat=text&open=fade-in&panel=code');
    expect(parseFilter(p)).toEqual({ q: 'foo', cat: 'text', open: 'fade-in', panel: 'code' });
  });
  it('rejects unknown categories', () => {
    expect(parseFilter(new URLSearchParams('cat=bogus')).cat).toBe('all');
  });
  it('round-trips through toQueryString', () => {
    expect(toQueryString({ q: 'hi', cat: 'basic', open: null, panel: null })).toBe('?q=hi&cat=basic');
  });
});
