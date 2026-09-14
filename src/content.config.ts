import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { isValidCategory } from "./config/categories";

/**
 * blog — slug 即文件名（entry.id），保持稳定，禁止日期/分类前缀。
 * 未使用的 frontmatter 字段可不填。
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      category: z.string().refine(isValidCategory, {
        message: "category 必须在 src/config/categories.ts 中配置",
      }),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      series: z.string().optional(),
      seriesOrder: z.number().int().positive().optional(),
      project: z.string().optional(),
      cover: z.string().optional(),
      redirectFrom: z.array(z.string()).default([]),
    })
    .refine((data) => !data.series || data.seriesOrder !== undefined, {
      message: "声明了 series 的文章需要提供 seriesOrder",
      path: ["seriesOrder"],
    }),
});

/**
 * projects — 项目状态单选；GitHub / Demo 可选。
 * 相关文章通过文章 frontmatter 的 project 字段自动聚合。
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    status: z.enum(["active", "completed", "archived"]).default("active"),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
    screenshots: z.array(z.string()).default([]),
    techStack: z.array(z.string()).default([]),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    startedAt: z.coerce.date().optional(),
  }),
});

/** snippets — v1.0 不公开展示，仅预留内容模型 */
const snippets = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/snippets" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().default(""),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, projects, snippets };
