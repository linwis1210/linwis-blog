import { getCollection } from "astro:content";
import { getPublishedPosts } from "../lib/posts";
import { toPlainText } from "../lib/stats";
import { normalizeTags } from "../lib/tags";

/**
 * 构建期生成搜索索引。
 * draft 与未来文章不进入索引（getPublishedPosts 已过滤）。
 */
export async function GET() {
  const [posts, projects] = await Promise.all([
    getCollection("blog"),
    getCollection("projects"),
  ]);

  const postDocs = getPublishedPosts(posts).map((post) => ({
    url: `/blog/${post.id}`,
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: normalizeTags(post.data.tags),
    kind: "post" as const,
    body: toPlainText(post.body ?? "").slice(0, 12000),
  }));

  const projectDocs = projects.map((project) => ({
    url: `/projects/${project.id}`,
    title: project.data.title,
    description: project.data.description,
    category: project.data.techStack.join(" "),
    tags: project.data.techStack,
    kind: "project" as const,
    body: toPlainText(project.body ?? "").slice(0, 8000),
  }));

  return new Response(JSON.stringify([...postDocs, ...projectDocs]), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
