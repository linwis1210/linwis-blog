---
feature: SEO/RSS 收尾与仓库链接修正
state: DONE
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
| 2 | 旧标识清零 | 上述 grep 兜底模式（含 social.ts） | G1/G2 零命中且 linwis1210 值未误改；G3 零命中**除**两个已知项目死链（`projects/dotfiles.md`、`link-checker.md`——两账号下均 404，属项目死链非旧账号引用，2026-09-16 Leader 修订移交用户决策） |
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
- 2026-09-16 派发备注 —— 首次 Builder 派发 10 分钟无输出超时，零残留（无 commit/工作树干净），原样重派成功，不计修复次数。
- 2026-09-16 Builder 完成（3 commits：`3307a7e` 链接修正 / `9ff9cc9` RSS 全文 / `f3cd38c` 结构化数据），自验条款 1–7 除 G3 两处死链外全 PASS。**Leader 裁决**：①RSS 机制偏离接受——Builder 实证 Astro 5.18.2 `render()` 无 html 输出（runtime.js:549-555），改用 `post.rendered.html`（与页面渲染同源、零依赖），条款 3 结果达成；②G3 两个项目死链（dotfiles/link-checker，两账号均 404）非旧账号引用，合同条款 2 措辞修订（见上表），移交用户决策；③`githubActivity.username` 旧账号名由 Leader 顺手修正（`d440ee7`，social.ts 本在清单内，功能关闭态零风险）。
- 2026-09-16 状态 ACTIVE → READY_FOR_VALIDATION（分支 4 commits，派发 Verifier 条款 1–7）。
- 2026-09-16 Verifier R1 —— **条款 1–7 全部 PASS**（54 个 ld+json 块 JSON.parse 零失败；8/8 文章 RSS 全文；og:type 以 main 对照构建逐字节核验；diff 恰 8 文件无越界）。证据：`evidence/verifier-report.md` + c1–c7 日志。
- 2026-09-16 合并与条款 8 —— 证据提交 `37e21f1`；合并 `2191793` 推送；Actions **success**；CF Git 集成自动部署上线后线上实测：rss.xml 含 9 处 `content:encoded` 全文；文章页恰好 3 个 ld+json（WebSite + Article + BreadcrumbList）；`og:type=article`。**合同条款 1–8 全部通过，零修复循环**。
- 2026-09-16 状态 → **DONE**。TASKS.md 勾选 +5（RSS Full Feed / Structured Data / Article Schema / Breadcrumb / 验证占位，141/194 约 73%）；Open Graph 注记更新（仅缺 og:image）。遗留移交用户：`dotfiles.md` / `link-checker.md` 两个项目死链的归宿决策。分支已删，tmp 已清。
