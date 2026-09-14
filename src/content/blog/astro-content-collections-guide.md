---
title: "Astro Content Collections 内容建模实践"
description: "用 Content Collections 给博客加上 schema 校验：frontmatter 类型安全、category 枚举校验与定时发布的实现。"
date: 2026-08-28
category: "Frontend"
tags:
  - Astro
  - TS
draft: false
featured: true
project: "personal-blog"
---

博客最重要的资产是内容，Content Collections 解决的就是「内容结构不可信」的问题：frontmatter 写错了，构建直接失败，而不是上线后页面悄悄变丑。

## 定义 Schema

```ts
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string().refine(isValidCategory),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
```

[!code highlight] `category` 用 `refine` 挂到集中配置上，新分类必须先在 `categories.ts` 登记——配置驱动，不在代码里写死。

## 类型推导开箱即用

`getCollection("blog")` 返回的每个条目都带着 schema 推导出来的类型，`post.data.date` 是 `Date` 而不是字符串。TS 类型体操不用自己写。

## 定时发布：一个过滤器的事

```ts
export function isPublished(post: Post, now: Date = new Date()): boolean {
  if (post.data.draft) return false;
  return post.data.date.getTime() <= now.getTime();
}
```

frontmatter 里写 `date: 2026-10-01`，文章在日期到达前不会出现在列表、RSS 和搜索索引里。配合 GitHub Actions 每天定时重建，文章自动上线。

:::note
定时发布的判断发生在构建期。这意味着「到点自动发布」依赖定时构建的存在，而不是内容系统本身的魔法。
:::

## slug 规则

文件名即 slug，即 URL：

```text
src/content/blog/deploy-astro-with-docker.md
→ /blog/deploy-astro-with-docker
```

禁止 `/blog/2026/09/xxx` 这种带日期的路径——一旦改名或迁移，日期前缀全是历史包袱。slug 保持英文、小写、连字符，永远不变。

## 一个容易忽略的点

旧 URL 迁移用 `redirectFrom` 字段预留，静态托管上用 Nginx 的 301 规则或生成 meta refresh 页面实现。这个字段本身不产生逻辑，但它是 slug 稳定性的保险。

想看这套建模如何长成完整站点的部署部分，可以读系列文章《使用 Docker 部署 Astro 博客》[^1]。

[^1]: 其实是同一批文章，SEO 上互相引用顺便把脚注也测了。
