export const SOCIAL = {
  github: "https://github.com/linwis1210",
  email: "hi@linwis.dev",
  /** 预留：其他社交链接，v1.0 可为空 */
  links: [] as { label: string; url: string }[],
} as const;

/** 第三方功能开关 — 全部为 Progressive Enhancement，失败不影响正文 */
export const FEATURES = {
  analytics: {
    enabled: false,
    provider: "" as "umami" | "plausible" | "" /* 接入时填写并实现对应 loader */,
  },
  giscus: {
    enabled: false,
    repo: "" /* 例如 "linwis1210/linwis-blog" */,
    repoId: "",
    category: "Announcements",
    categoryId: "",
  },
  /** 首页 GitHub Activity */
  githubActivity: {
    enabled: false,
    username: "linwis",
    /** 拉取失败时的静默降级：直接隐藏 */
    timeoutMs: 6000,
  },
} as const;
