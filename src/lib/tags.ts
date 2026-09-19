/**
 * Tag 归一化：别名表 + trim。
 * 未命中别名的 tag 保持作者原样输入。
 */
import { TAG_ALIASES } from "../config/tagAliases";

export function normalizeTag(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  return TAG_ALIASES[trimmed] ?? TAG_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}

/** 归一化并去重（忽略大小写重复） */
export function normalizeTags(raw: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of raw) {
    const normalized = normalizeTag(tag);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }
  return result;
}

/**
 * 无编码的 URL 安全 slug：非 [a-z0-9] 连续段折叠为单个 `-`，去首尾 `-`。
 * 样例：`Claude Code`→`claude-code`；`CI/CD`→`ci-cd`。
 * 链接生成与 /blog/tag/[tag] 路由必须同用本函数，禁止手写 tag URL。
 */
export function tagToSlug(tag: string): string {
  return normalizeTag(tag)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
