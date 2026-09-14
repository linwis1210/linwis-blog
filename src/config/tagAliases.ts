/**
 * Tag 别名归一化表：frontmatter 与展示统一到这里映射的标准名。
 * 未命中的 tag 保持原样（仅做 trim）。
 */
export const TAG_ALIASES: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  cicd: "CI/CD",
  ci: "CI/CD",
  k8s: "Kubernetes",
  astro: "Astro",
  docker: "Docker",
  nginx: "Nginx",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  ghactions: "GitHub Actions",
  "github-actions": "GitHub Actions",
  cloudflare: "Cloudflare",
  linux: "Linux",
  git: "Git",
};
