---
feature: SEO/RSS 收尾与仓库链接修正
state: ACTIVE
date: 2026-09-16
role-assignment:
  leader: main session
  builder: 自定义 agent（GLM-5.3-Flash / max）
  verifier: 独立自定义 agent（GLM-5.3-Flash / max）
risk: 2
repair-count: 0
branch: feature/seo-rss-legacy-fixes
---

# SEO/RSS 收尾与仓库链接修正

## 目标（用户 2026-09-16 指示：修复遗留项 2/3/4）

**A. 内容与配置中的旧仓库标识修正**（遗留项 2）：

- `src/content/projects/personal-blog.md`（github 字段）、`src/content/blog/deploy-astro-with-docker.md` 与 `github-actions-cd-to-china-server.md`（`ghcr.io/linwis/linwis-blog`）：`linwis/linwis-blog` → `linwis1210/linwis-blog`。
- `src/config/social.ts` 的 GitHub 主页链接 `https://github.com/linwis` → `https://github.com/linwis1210`（用户实际账号，与仓库 owner 一致；about 页/Footer 共用此配置）。
- 全量兜底：`grep -rn "linwis/linwis-blog\|ghcr.io/linwis/\|github.com/linwis[^1]" src/ public/` 修复后零命中（注意 `linwis1210` 是合法值不得误伤）。

**B. RSS 全文输出**（遗留项 3，TASKS Phase 13「RSS Full Feed」，REQUIREMENTS §19）：

- `src/pages/rss.xml.js`：为每篇文章输出完整正文 HTML（Astro 5 用 `import { render } from "astro:content"` 取 `html` 填入 item `content`）；保留现有 draft/未来日期过滤与既有字段。

**C. SEO 结构化数据**（遗留项 4，TASKS Phase 13 剩余项）：

1. `src/config/site.ts` 增加 Google/Bing 站长验证占位字段（空串默认）。
2. `BaseLayout.astro`：og:type 动态（新增 prop，默认 website）；验证占位非空时条件输出 `google-site-verification` / `msvalidate.01` meta（空时不输出任何标签）；全站 WebSite JSON-LD。
3. `blog/[slug].astro`：og:type=article + article 元数据（published/modified time）；Article JSON-LD（headline/description/datePublished/dateModified/author/mainEntityOfPage，cover 存在时含 image）；BreadcrumbList JSON-LD（Home → Blog → 文章）。
4. **不做** og:image 自动生成（Phase 6 范畴）与视觉面包屑 UI（本项为 SEO schema 层）。

## Validation Contract

| # | 条款 | 验证方法 | 通过条件 |
|---|---|---|---|
| 1 | 质量门不回退 | format:check / lint / typecheck / build | 全 exit 0 |
| 2 | 旧标识清零 | 上述 grep 兜底模式（含 social.ts） | src/ public/ 零命中且 linwis1210 值未被误改 |
| 3 | RSS 全文 | dist/rss.xml 抽样 ≥1 篇：item 含正文 HTML（content:encoded 或等价）；存在 draft 文章且不出现在 RSS | 全符合 |
| 4 | 结构化数据 | 首页含 WebSite JSON-LD；任一文章页含 Article + BreadcrumbList JSON-LD；全部为合法 JSON（可解析） | 全符合 |
| 5 | og:type 正确 | 文章页 `og:type=article`、首页 `website`；canonical/og:url 不变 | 全符合 |
| 6 | 验证占位 | site.ts 占位为空串时 dist 中无验证 meta 标签输出 | 符合 |
| 7 | 变更范围 | `git diff main...HEAD` 仅限：3 个内容文件、social.ts、site.ts、rss.xml.js、BaseLayout.astro、blog/[slug].astro | 无越界 |
| 8 | 线上复核（Leader 合并后） | curl linwis.pages.dev：rss.xml 含正文；文章页含 ld+json；og:type 正确 | 全符合 |

## 约束

- 不改 docs/、README、`.agents/tasks/`；不 push 不合并；conventional commits。
- 中间产物放 `.agents/tmp/phase-13-seo/2026-09-16-seo-rss-legacy-fixes/`。
- 同一问题修复上限 3 次。

## 状态流转记录

- 2026-09-16 ACTIVE —— Leader 创建记录（用户指示执行遗留项 2/3/4，Phase 22 定时发布不在本轮），派发 Builder。
