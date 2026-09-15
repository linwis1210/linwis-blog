/**
 * 相关文章推荐：Category + Tag 加权匹配。
 * 规则简单可解释，v1.0 不使用 embedding / 向量检索。
 */
import { normalizeTag } from "./tags";
import type { Post } from "./posts";

const WEIGHTS = {
  sameCategory: 2,
  perSharedTag: 2,
  sameProject: 3,
  sameSeries: 1,
} as const;

export function relatedScore(post: Post, candidate: Post): number {
  if (post.id === candidate.id) return -1;
  let score = 0;
  if (post.data.category === candidate.data.category) {
    score += WEIGHTS.sameCategory;
  }
  const tagsA = new Set(post.data.tags.map(normalizeTag).map((t) => t.toLowerCase()));
  for (const tag of candidate.data.tags) {
    if (tagsA.has(normalizeTag(tag).toLowerCase())) {
      score += WEIGHTS.perSharedTag;
    }
  }
  if (post.data.project && post.data.project === candidate.data.project) {
    score += WEIGHTS.sameProject;
  }
  if (post.data.series && post.data.series === candidate.data.series) {
    score += WEIGHTS.sameSeries;
  }
  return score;
}

/** 取相关文章，按得分倒序，同分按时间倒序 */
export function getRelatedPosts(post: Post, allPosts: Post[], limit = 3): Post[] {
  return allPosts
    .map((candidate) => ({ candidate, score: relatedScore(post, candidate) }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.candidate.data.date.getTime() - a.candidate.data.date.getTime()
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

/** 同系列其余文章，按 seriesOrder 升序 */
export function getSeriesPosts(series: string, allPosts: Post[]): Post[] {
  return allPosts
    .filter((p) => p.data.series === series)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}
