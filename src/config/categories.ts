/**
 * Category 集中配置 — 单选、一级目录。
 * 新增分类只需在这里添加，文章 frontmatter 引用 name。
 * CI / schema 校验以本配置为准。
 */
export interface Category {
  /** 分类名，文章 frontmatter 中的 category 字段必须精确匹配 */
  name: string;
  /** 分类页与文章页展示的简短说明 */
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    name: "Server",
    description: "部署、运维与基础设施：Docker、Nginx、CI/CD 与服务器那些事。",
  },
  {
    name: "Frontend",
    description: "前端工程实践：框架、构建工具、样式系统与浏览器端优化。",
  },
  {
    name: "DevOps",
    description: "开发效率与工程文化：自动化、监控、云服务与工作流。",
  },
  {
    name: "AI",
    description: "AI 辅助开发：编码智能体、提示工程、模型应用与实践笔记。",
  },
  {
    name: "Notes",
    description: "不成体系的随手记：工具、配置、踩坑与阶段小结。",
  },
];

const CATEGORY_NAMES = new Set(CATEGORIES.map((c) => c.name));

/** 校验 category 是否在集中配置中 */
export function isValidCategory(name: string): boolean {
  return CATEGORY_NAMES.has(name);
}

export function getCategory(name: string): Category | undefined {
  return CATEGORIES.find((c) => c.name === name);
}

/** 分类名 → URL 片段（中文等非 ASCII 名称可在此映射） */
export function categoryToSlug(name: string): string {
  return encodeURIComponent(name.toLowerCase());
}

export function slugToCategory(slug: string): string {
  return decodeURIComponent(slug);
}
