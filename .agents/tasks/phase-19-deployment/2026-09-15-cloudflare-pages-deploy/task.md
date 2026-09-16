---
feature: Cloudflare Pages 部署基线
state: READY_FOR_VALIDATION
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
2. `src/pages/redirects.ts` + `astro.config.mjs` 内联 integration（2026-09-15 机制修订，见流转记录）：endpoint 产出 `dist/redirects`，integration 于 `astro:build:done` 将其重命名为 `dist/_redirects`（源产物缺失时跳过）。遍历 blog 集合 `redirectFrom` 生成 301 行（含草稿/未来日期过滤，复用 `src/lib/posts.ts`）；无重定向时输出空文件。**完成后同步满足 TASKS Phase 13「RedirectFrom」项**。
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
- 2026-09-15 Builder 首轮上报机制阻塞（正确未擅改）：Astro 排除 `src/pages` 下划线前缀文件，原定 `_redirects.ts` 无构建产物（证据：路由清单缺失 + 同字节非下划线探针对照产出 + 官方文档）。**Leader 裁定**：①采纳方案 A——`redirects.ts` 产出 `dist/redirects`，`astro.config.mjs` 内联 integration 于 `astro:build:done` 重命名为 `dist/_redirects`（此修改正式纳入范围）；②`_headers` 布局翻转——wrangler@4 实测为**合并语义**（修正本记录原「首条命中」的错误假设）：`/*` 全安全头在前、`/_astro-v2/*` 仅 `Cache-Control: immutable` 在后，消除重复头。**Validation Contract 条款不变**。Builder 首轮已交付 `public/_headers` 与 ci.yml deploy job（`88d1f07`），自验除被阻塞的 `_redirects` 相关项外全 PASS。
- 2026-09-15 Builder 续作完成 —— `2dcf856`：redirects.ts + 重命名钩子落地，`_headers` 翻转；自验条款 1–5 全 PASS（含 404 body 与产物逐字节一致、资产头零重复、fixture 301/draft 过滤/清理、`_astro-v2` immutable）。Leader 追加 `8891d40`（`.wrangler/` 入 .gitignore，采纳 Builder 观察项）。分支共 3 commits（`88d1f07`/`2dcf856`/`8891d40`）。
- 2026-09-15 状态 ACTIVE → READY_FOR_VALIDATION（派发 Verifier 条款 1–5；合并与条款 6–8 **以用户完成 CF Pages 项目 + Secrets 配置为先决**，否则 deploy job 必败推红 main）。
- 2026-09-16 Verifier R1 独立验证 —— **条款 1–5 全部 PASS**：质量门全绿；dist 产物七件齐全（`_redirects` 0 字节）；fixture 三阶段（已发布→恰一行 301 / draft→空 / 删除→空）且全程未入库；本地 Pages 实测（安全头各 1 次、资产 immutable 零重复、404 body 与产物 cmp 逐字节一致、301+Location 正确）；diff 范围仅允许的 5 文件，CSP/ci.yml 逐项符合。wrangler 进程链与 `.wrangler/` 已清理。证据：`evidence/verifier-report.md` + clause*.log + full-diff.patch。
- 2026-09-16 当前状态：条款 1–5 已过，**合并挂起等待用户 CF 三步配置**（Pages 项目 `linwis-blog` / API Token / 仓库 Secrets），完成后 Leader 合并推送并复核条款 6–8。
- 2026-09-16 用户已完成 CF 侧部署 —— 实际项目名为 **`linwis`**（线上 https://linwis.pages.dev）。Leader 探测：200、title 正确、404 行为正常；响应仅含 nosniff / referrer-policy 两头（CF Pages 平台自动安全头），无本 Feature 的完整六头 → 判定用户上传的是 **main 分支构建产物**（不含 `_headers`/`_redirects`），待自动部署接通后自然解决。据此 Leader 修订（`2161728`）：ci.yml `--project-name` 由 `linwis-blog` 改为 `linwis`（一字符串配置修正，format:check 过；该值的最强验证即合并后的真实部署）。合同中项目名引用以本条为准。待确认项：① GitHub Secrets（`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`）是否已配置；② `linwis` 项目 production branch 是否为 main（若非，部署会落在 preview 别名，届时在 Dashboard 修正）。
