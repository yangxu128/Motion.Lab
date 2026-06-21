// 点赞数据持久化（localStorage）
const KEY = 'motionlab:likes';

type LikeMap = Record<string, number>;

function read(): LikeMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LikeMap) : {};
  } catch {
    return {};
  }
}

function write(map: LikeMap) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* quota exceeded — ignore */
  }
}

// 读取某动效的点赞数
export function getLikes(id: string): number {
  const map = read();
  return map[id] ?? 0;
}

// 读取全部点赞数（一次性，避免重复读 localStorage）
export function getAllLikes(): LikeMap {
  return read();
}

// 点赞 +1（不可取消，简化模型）
export function like(id: string): number {
  const map = read();
  const next = (map[id] ?? 0) + 1;
  map[id] = next;
  write(map);
  // 通知其他组件刷新
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('likes-updated', { detail: { id, count: next } }));
  }
  return next;
}
