import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { transformerNotationDiff, transformerNotationHighlight } from "@shikijs/transformers";
import remarkDirective from "remark-directive";
import remarkFigure from "./src/lib/remark-figure.mjs";
import { visit } from "unist-util-visit";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { existsSync, renameSync } from "node:fs";

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

/** 构建后把 endpoint 产物 dist/redirects 重命名为 dist/_redirects（下划线前缀文件不参与 Astro 路由）。 */
function renameRedirects() {
  return {
    name: "rename-redirects",
    hooks: {
      "astro:build:done": ({ dir }) => {
        const from = new URL("redirects", dir);
        if (existsSync(from)) renameSync(from, new URL("_redirects", dir));
      },
    },
  };
}

export default defineConfig({
  site: "https://linwis.pages.dev",
  integrations: [mdx(), sitemap(), renameRedirects()],
  build: {
    // 资源目录改名以绕过浏览器对旧 CSS 文件名的顽固缓存
    assets: "_astro-v2",
  },
  // 响应式图片默认布局：正文 markdown 图片与封面 Picture 自动生成
  // srcset（宽高由源图决定），配合内容图默认 lazy 加载
  image: {
    layout: "constrained",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkDirective, remarkCallouts, remarkFigure],
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
