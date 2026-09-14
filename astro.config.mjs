import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** :::note[标题] 等 callout 容器 → aside.callout */
function remarkCallouts() {
  return (tree) => {
    visit(tree, "containerDirective", (node) => {
      const type = node.name;
      if (!["note", "tip", "warning", "caution", "info"].includes(type)) return;
      node.data ??= {};
      node.data.hName = "aside";
      node.data.hProperties = { class: "callout", "data-type": type };
      // :::note[标题] 的标签段落在 remark-directive 中带 directiveLabel 标记
      for (const child of node.children ?? []) {
        if (child.data?.directiveLabel) {
          child.data.hName = "div";
          child.data.hProperties = { class: "callout-title" };
        }
      }
    });
  };
}

export default defineConfig({
  site: "https://linwis.dev",
  integrations: [mdx(), sitemap()],
  build: {
    // 资源目录改名以绕过浏览器对旧 CSS 文件名的顽固缓存
    assets: "_astro-v2",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkDirective, remarkCallouts],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            class: "heading-anchor",
            "aria-label": "复制标题锚点链接",
          },
          content: {
            type: "element",
            tagName: "span",
            properties: { "aria-hidden": "true" },
            children: [{ type: "text", value: "#" }],
          },
        },
      ],
    ],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      transformers: [transformerNotationDiff(), transformerNotationHighlight()],
    },
  },
});
