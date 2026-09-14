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
    })),
    customData: "<language>zh-CN</language>",
    trailingSlash: false,
  });
}
