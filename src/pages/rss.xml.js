import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPublishedPosts } from "../lib/posts";
import { SITE } from "../config/site";

export async function GET(context) {
  const posts = getPublishedPosts(await getCollection("blog"));

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: [post.data.category],
      link: `/blog/${post.id}`,
      // 全文正文：content layer 构建期编译好的 HTML，与文章页渲染同源
      // （Astro 5.18 的 render() 返回 { Content, headings, remarkPluginFrontmatter }，
      //   其内部即取 entry.rendered.html，此处直接复用同一份编译产物）
      content: post.rendered?.html,
    })),
    customData: "<language>zh-CN</language>",
    trailingSlash: false,
  });
}
