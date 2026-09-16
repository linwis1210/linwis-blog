/**
 * 文章 OG 图端点（构建期静态生成）：/og/<slug>.png → 1200×630 PNG。
 * getStaticPaths 与文章页同源复用 getPublishedPosts 过滤（draft、未来发布不生成）。
 */
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPublishedPosts, type Post } from "../../lib/posts";
import { renderPostOgImage } from "../../lib/og";

export async function getStaticPaths() {
  const all = await getCollection("blog");
  return getPublishedPosts(all).map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Post };
  const png = await renderPostOgImage({
    title: post.data.title,
    category: post.data.category,
  });
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
