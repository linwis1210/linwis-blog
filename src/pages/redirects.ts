import { getCollection } from "astro:content";
import { getPublishedPosts } from "../lib/posts";

/**
 * 构建期生成 Cloudflare Pages 的重定向清单（endpoint 产物 `dist/redirects`）。
 * 遍历已发布文章 frontmatter 的 `redirectFrom`，逐项输出 `旧路径 新路径 301` 行；
 * 无任何重定向时输出空文件。草稿与未来日期文章不参与（getPublishedPosts 已过滤）。
 * 下划线前缀文件不参与 Astro 路由，故由 astro.config.mjs 的内联 integration
 * 在 astro:build:done 阶段把产物重命名为 Pages 约定的 `dist/_redirects`。
 */
export async function GET() {
  const posts = getPublishedPosts(await getCollection("blog"));

  const lines = posts.flatMap((post) =>
    post.data.redirectFrom.map((from) => `${from} /blog/${post.id} 301`)
  );

  const body = lines.length > 0 ? `${lines.join("\n")}\n` : "";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
