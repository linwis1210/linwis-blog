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

export function tagToSlug(tag: string): string {
  return encodeURIComponent(normalizeTag(tag).toLowerCase());
}

export function slugToTag(slug: string): string {
  return decodeURIComponent(slug);
}
