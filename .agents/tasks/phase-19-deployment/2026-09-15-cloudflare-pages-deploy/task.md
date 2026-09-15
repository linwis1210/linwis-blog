---
feature: Cloudflare Pages 部署基线
state: ACTIVE
date: 2026-09-15
role-assignment:
  leader: main session
  builder: 自定义 agent（GLM-5.3-Flash / max）
  verifier: 独立自定义 agent（GLM-5.3-Flash / max）
risk: 2
repair-count: 0
branch: feature/cloudflare-pages-deploy
---

# Cloudflare Pages 部署基线

## 背景

2026-09-15 用户决策：部署目标由「中国服务器 + BaoTa + Docker」变更为 **Cloudflare Pages**（接受全球 CDN 的大陆延迟权衡，免 ICP/免大陆服务器）。Docker/GHCR 计划作废，基线文档已同步修订（main `18fce23`）。

## 目标

1. `public/_headers`：安全头 + 缓存策略（Astro 构建原样拷入 dist）。
2. `src/pages/_redirects.ts`：静态 endpoint，遍历 blog 集合 `redirectFrom` 生成 301 行（无重定向时输出空文件）；模式同 `src/pages/rss.xml.js`。**完成后同步满足 TASKS Phase 13「RedirectFrom」项**。
3. `.github/workflows/ci.yml` 扩展 `deploy` job：`needs: quality`；条件 push→main 或 schedule；步骤 checkout → Node 22 → npm ci → build → `npx wrangler@4 pages deploy dist --project-name=linwis-blog --branch=main`；触发器新增 `schedule`（建议 cron `30 16 * * *`，UTC 16:30 = 北京 00:30，利于未来日期文章刚跨日上线）；PR 仍只跑 quality；permissions `contents: read`；secrets `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`。
4. 404 零改动（dist/404.html 已存在，Pages 自动识别，仅验证）。

## 范围外

自定义域名绑定（域名未定）、CF 控制台操作与 Secrets（用户手动）、线上定时触发实测（只审配置）、README 更新（Leader 在 DONE 时统一改）。

## Validation Contract

| # | 条款 | 验证方法 | 通过条件 |
|---|---|---|---|
| 1 | 质量门不回退 | `npm run format:check` / `lint` / `typecheck` / `build` | 全 exit 0 |
| 2 | 产物完整性 | 构建后 dist 含 `_headers`、`_redirects`、`404.html`、`rss.xml`、`sitemap-index.xml`、`search-index.json`、`robots.txt` | 齐全 |
| 3 | 重定向生成正确 | 临时 fixture（带 `redirectFrom`，**不入库**，验证后删除并重建）核对 `_redirects` 行；无重定向时输出空文件 | 逐行对应 |
| 4 | 本地 Pages 行为 | `npx wrangler@4 pages dev dist`（本地模式免登录）+ curl：`/` 200；`/_astro-v2/*` 响应含 immutable Cache-Control 与全部安全头；不存在路径 → 404 且返回 404 页内容；fixture 重定向 301 | 全部符合 |
| 5 | CSP 审查 | `_headers` 逐项核对：`script-src 'self' 'unsafe-inline'`（Astro 内联脚本）、`connect-src 'self' https://api.github.com`、`frame-src https://giscus.app`、`object-src 'none'`、无 `unsafe-eval`、无多余来源 | 符合清单 |
| 6 | 远端部署绿 | Leader 合并推送后 Actions run（quality + deploy）全绿（前置：用户已配置 CF 项目与 Secrets） | success |
| 7 | 线上验证 | curl `https://linwis-blog.pages.dev`：200 + 安全头 + 缓存头 + 404 行为 | 全部符合 |
| 8 | 定时重建配置 | workflow `schedule` 语法与 deploy 条件路径审查 | 正确 |

证据：本目录 `evidence/`（条款 1–5 归 Verifier，6–8 归 Leader 合并后）。

## 约束

- 遵守 AGENTS.md 与 `.agents/roles/builder.md`；不修改 docs/ 与 README（Leader 域）；不 push、不合并。
- fixture 文章绝不进入任何 commit。
- 中间产物放 `.agents/tmp/phase-19-deployment/2026-09-15-cloudflare-pages-deploy/`。
- 同一问题修复上限 3 次。

## 用户前置（与 Builder 并行，条款 6–7 的先决）

1. Cloudflare 控制台创建 Pages 项目 `linwis-blog`（直接上传模式，无需 Git 集成）；
2. 创建 API Token（模板「Cloudflare Pages — Edit」）；
3. GitHub 仓库 Secrets 添加 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`。

## 状态流转记录

- 2026-09-15 ACTIVE —— Leader 修订基线文档（`18fce23`）后创建记录，派发 Builder。
