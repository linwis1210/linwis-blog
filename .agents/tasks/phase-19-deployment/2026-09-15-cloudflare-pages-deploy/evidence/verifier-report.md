# Verifier Report — Cloudflare Pages 部署基线（条款 1–5）

- 日期：2026-09-16（验证执行日）
- 验证对象：分支 `feature/cloudflare-pages-deploy` @ `8891d40`（3 commits：`88d1f07` / `2dcf856` / `8891d40`，基点 `57902f4`）
- 验证环境：Windows 10 / Git Bash / Node v24.11.1 / npm 11.6.2 / wrangler@4（npx 缓存）
- 独立性：全部命令与文件审阅由 Verifier 本轮自行执行；Builder 报告未作为证据。

## 总判定：PASS（条款 1–5 全部通过）

条款 6–8（合并后 Actions 绿、线上 curl、定时配置终审）归 Leader，不在本报告范围。

## 逐条结果

| # | 条款 | 结果 | 关键证据 |
|---|---|---|---|
| 1 | 质量门不回退 | PASS | `npm run format:check` / `lint` / `typecheck` / `build` 全 exit 0（typecheck 0 warnings 2 hints；build 38 页 Complete） |
| 2 | 产物完整性 | PASS | dist 含 `_headers`(990B)、`_redirects`(0B)、`404.html`、`rss.xml`、`sitemap-index.xml`、`search-index.json`、`robots.txt`；无 `dist/redirects` 残留 |
| 3 | 重定向生成正确 | PASS | 见下「条款 3 三阶段」 |
| 4 | 本地 Pages 行为 | PASS | wrangler pages dev :8789 实测，见下 |
| 5 | CSP 审查 + 变更范围 | PASS | 变更仅限允许的 5 文件；CSP 逐项符合；ci.yml deploy job 逐项符合 |

### 条款 3 三阶段
1. fixture 已发布 + `redirectFrom: ["/blog/verify-old"]` → build exit 0 → `dist/_redirects` 恰一行（cat -A 确认）：`/blog/verify-old /blog/zz-verify-redirect 301`（46 字节）。
2. fixture 置 `draft: true` → build exit 0 → `_redirects` 0 字节；fixture 页面亦被草稿过滤，未出现在 dist。
3. 删除 fixture → build exit 0 → `_redirects` 0 字节。fixture 全程仅 untracked（`??`），从未 git add / commit；验证结束时已删除，工作树干净。

### 条款 4 本地 Pages 行为
启动：`npx --yes wrangler@4 pages dev dist --port 8789`（免登录），日志确认 `Parsed 1 valid redirect rule` + `Parsed 2 valid header rules` + `Ready on http://127.0.0.1:8789`。

| 请求 | 结果 |
|---|---|
| `GET /` | 200；六个安全头（CSP / X-Content-Type-Options / Referrer-Policy / Permissions-Policy / X-Frame-Options / HSTS）各恰好 1 次 |
| `GET /_astro-v2/about.CDLEo0iY.css` | 200；`Cache-Control: public, max-age=31536000, immutable`；六个安全头各恰好 1 次（零重复） |
| `GET /no-such-path` | 404 Not Found；body 与 `dist/404.html` 逐字节一致（cmp IDENTICAL，16677 字节，`<title>404 — linwis_</title>`） |
| `GET /blog/verify-old`（fixture 在场） | 301 Moved Permanently；`Location: /blog/zz-verify-redirect` |

### 条款 5 审查明细
- 变更范围（`git diff 57902f4...HEAD --name-status`）：`.github/workflows/ci.yml`(M)、`.gitignore`(M)、`astro.config.mjs`(M)、`public/_headers`(A)、`src/pages/redirects.ts`(A)。无超范围文件。
- CSP：`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.github.com; frame-src https://giscus.app; object-src 'none'; base-uri 'self'` — script/style `unsafe-inline` 符合、connect-src 与 frame-src 来源精确匹配、object-src 'none'、base-uri 'self'、无 unsafe-eval、https 来源仅 api.github.com 与 giscus.app（无多余来源）。
- 其余安全头（`/*` 块）：nosniff / strict-origin-when-cross-origin / Permissions-Policy camera, microphone, geolocation=() / X-Frame-Options SAMEORIGIN / HSTS max-age=31536000。
- `/_astro-v2/*` 块仅 `Cache-Control: public, max-age=31536000, immutable`；wrangler@4 合并语义假设经条款 4 实测证实（资产响应安全头来自 `/*` 且无重复）。
- ci.yml deploy job：`if: (github.event_name == 'push' && github.ref == 'refs/heads/main') || github.event_name == 'schedule'`；`needs: quality`；`permissions: contents: read`；步骤 checkout@v4 → setup-node@v4(node 22, cache npm) → `npm ci` → `npm run build` → `npx --yes wrangler@4 pages deploy dist --project-name=linwis-blog --branch=main`；secrets 仅引用 `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`；`schedule: cron "30 16 * * *"`（UTC 16:30 = 北京 00:30）；pull_request 事件两条件均假 → PR 只跑 quality，不触发 deploy。
- 机制佐证：`astro.config.mjs` 内联 integration `renameRedirects` 于 `astro:build:done` 将 `dist/redirects` 重命名为 `dist/_redirects`，`existsSync` 守卫使源产物缺失时安全跳过；`src/content.config.ts:27` `redirectFrom: z.array(z.string()).default([])` 保证无该字段的已发布文章不致 endpoint 崩溃；`getPublishedPosts`（src/lib/posts.ts:16）承担草稿/未来日期过滤（条款 3 实测验证其行为）。

## 问题清单

无阻断问题。备注两条（非缺陷）：
1. wrangler 本地 dev 响应含 `x-server-env: dev` 与 `Access-Control-Allow-Origin: *`，为 wrangler 运行时自带头，不在 `_headers` 管控内，不构成合同偏离（线上行为待条款 7 由 Leader 验证）。
2. `_headers` 中 `img-src 'self' data:` 早于本 Feature 存在于设计意图内，与合同清单无冲突。

## Evidence 文件清单

- `clause1-quality-gates.log` — 四项质量门 exit 0 + 日志头尾关键行
- `clause2-dist-artifacts.log` — 产物清单与字节数
- `clause3-redirect-fixture.log` — fixture 三阶段结果
- `clause4-pages-dev.log` — wrangler 启动行 + 四组 curl 结果
- `clause5-scope-csp.log` — 变更范围 / CSP 逐项 / ci.yml 关键行 / schema 默认值
- `clause5-full-diff.patch` — `57902f4...HEAD` 全量 diff（88 行变更）

完整原始日志（未裁剪）留存于 gitignored 工作区 `.agents/tmp/phase-19-deployment/2026-09-15-cloudflare-pages-deploy/`。

## 环境备注（清理确认）

- wrangler 进程链：TaskStop 仅终止包装 shell；已 taskkill /F /T 清除 wrangler node 主进程（PID 23492）及其下两个 workerd.exe（PID 35584、23704）及全部子进程。
- 端口 8789：已确认无 LISTENING（PORT FREE）。
- 残留 workerd 进程：无。
- `.wrangler/` 目录：已删除。
- fixture `src/content/blog/zz-verify-redirect.md`：已删除，从未进入任何 commit。
- 最终重建：exit 0，`_redirects` 0 字节，`git status` 仅剩 evidence/ 新增文件（Verifier 唯一可写位置）。
