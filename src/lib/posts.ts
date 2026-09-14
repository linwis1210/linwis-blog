/**
 * 文章集合的领域逻辑：过滤、排序、日期格式化。
 * 「发布」的定义：draft === false 且 date 已到达（含当天 00:00 之后）。
 */
import type { CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

/** 定时发布过滤：date 未到视为未发布（构建期判断，配合定时构建自动上线） */
export function isPublished(post: Post, now: Date = new Date()): boolean {
  if (post.data.draft) return false;
  return post.data.date.getTime() <= now.getTime();
}

/** 已发布文章，按发布时间倒序 */
export function getPublishedPosts(posts: Post[], now: Date = new Date()): Post[] {
  return posts
    .filter((p) => isPublished(p, now))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 按更新时间倒序（无 updated 的文章回退到 date） */
export function sortByUpdated(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => lastModified(b) - lastModified(a));
}

export function lastModified(post: Post): number {
  return (post.data.updated ?? post.data.date).getTime();
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatMonth(date: Date): string {
  return date.toLocaleString("en-US", { month: "long" });
}
