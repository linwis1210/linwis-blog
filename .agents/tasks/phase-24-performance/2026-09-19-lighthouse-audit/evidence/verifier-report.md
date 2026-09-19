# Verifier Report — Lighthouse 阶段 B 修复批次复验

- 日期：2026-09-19
- Verifier：独立验证上下文（GLM-5.3-Flash，verifier profile）
- 分支：`fix/lighthouse-batch`，HEAD `e19430d`（基点 `f2ecd1b`），工作区干净（已检出）
- 判定：**PASS**

## 总判定

**PASS** — 四项修复全部独立复现生效，零回归成立，范围精确（恰 4 文件），质量门通过，判据环境（astro preview :4325）Lighthouse desktop/mobile Perf 双 100，errors-in-console 双端 0 条；wrangler 真 CSP 头环境下 errors-in-console 亦为 0，style-src 响应头含 `https://giscus.app`。

## 逐条验证结果

| # | 项目 | 命令 / 方法 | 结果 | 关键证据 |
|---|------|------------|------|---------|
| 1a | format:check | `npm run format:check` | exit 0 | 通过 |
| 1b | lint | `npm run lint` | exit 0（首次 exit 1，系 Builder wrangler 残留 `.wrangler/tmp` 被 eslint 扫到；`.wrangler/` 为 gitignored 临时目录，清除残留后重跑通过。见问题清单 Q1） | 0 problems |
| 1c | typecheck | `npm run typecheck`（astro check） | exit 0 | 通过 |
| 1d | build | `npm run build` | exit 0 | 43 pages built |
| 2a | 内联 style | grep 文章页 HTML | `<style>` 计数 = 1 | `dist/blog/what-is-claude-code/index.html` |
| 2b | 无外部 CSS link | grep `_astro-v2/.*\.css` | 0 处 | 同上 |
| 2c | giscus preconnect | grep head | `<link rel="preconnect" href="https://giscus.app"` 存在（含 `crossorigin`） | 同上 |
| 2d | 封面 sizes | grep `sizes=` | 4 处均为 `(min-width: 1035px) 1035px, 100vw` | 同上 |
| 2e | 封面 srcset 1035w 档 | grep srcset | avif/webp/png 三格式均含 640w/828w/1035w，顶档 1448w（源图宽度上限，符合预期） | 同上 |
| 2f | _headers CSP | grep style-src | `style-src 'self' 'unsafe-inline' https://giscus.app` | `public/_headers` |
| 3a | script 计数零回归 | 基点 `f2ecd1b` 于临时 git worktree 构建（junction 复用 node_modules，已安全拆除），三类页对照 | 文章 11/11、首页 7/7、列表 8/8（base/HEAD），且三类页全部 `src=` 属性列表 md5 一致 | 本报告"对照数据"节 |
| 3b | preconnect 条件同源 | 代码核对 | BaseLayout 条件 `FEATURES.giscus.enabled && repo && repoId` 与 `Giscus.astro` 渲染守卫（`src/components/Giscus.astro:14`）同一对象同三字段；当前 `src/config/social.ts:15` enabled=true | diff + 源码 |
| 4a | 变更范围 | `git diff f2ecd1b...HEAD --stat` | 恰 4 文件：astro.config.mjs(+2)、public/_headers(1±)、src/layouts/BaseLayout.astro(+8)、src/pages/blog/[slug].astro(+2)，共 +13/-1 | git |
| 4b | package-lock | diff 文件名过滤 | 0 处提及，零变化 | git |
| 5a | Lighthouse desktop（判据环境） | `npx -y lighthouse@12` + `astro preview --port 4325` | **Perf 100** / A11y 96 / BP 100 / SEO 100 | `.agents/tmp/v-desktop.json`（不入库） |
| 5b | desktop errors-in-console | 同上 JSON | **0 条目**；CLS 0；TBT 0 ms；LCP 0.4 s；FCP 0.2 s | 同上 |
| 5c | Lighthouse mobile（判据环境） | 同上（默认 mobile preset） | **Perf 100** / A11y 96 / BP 100 / SEO 100 | `.agents/tmp/v-mobile.json`（不入库） |
| 5d | mobile 关键指标 | 同上 JSON | errors-in-console **0 条目**；CLS **0**（<0.05）；TBT **0 ms**；LCP 1.4 s；FCP 0.9 s | 同上 |
| 6a | wrangler 真 CSP 头 | `npx --yes wrangler@4 pages dev dist --port 4326` + `curl -I` | 响应头 `content-security-policy: ... style-src 'self' 'unsafe-inline' https://giscus.app; ...` | curl 输出 |
| 6b | wrangler 环境附加复测（超出最低要求） | lighthouse@12 desktop 对 :4326 | Perf 86 / A11y 96 / BP 100 / SEO 100；**errors-in-console 0 条**（Builder 核心结论"真头下零报错"独立复现） | `.agents/tmp/v-desktop-wrangler.json` |

注（5b Perf 86 解释）：wrangler pages dev 的 workerd 模拟器对每个子资源请求增加代理开销（server-response-time 20 ms 下 FCP 1.2 s / LCP 2.2 s，而 preview 同指标 0.2 s / 0.4 s；TBT 与 CLS 两环境均为 0）。任务判据环境为 astro preview :4325（5a/5c 双 100 达标），该 86 分反映本地模拟器 I/O 开销，不构成回归证据。

## Builder 结论核对

- "本地 desktop Lighthouse 75→100"：判据环境独立复测 **Perf 100**，成立。
- "errors-in-console 清零（wrangler 真 CSP 头下）"：wrangler 环境独立复测 **0 条目**，成立；preview 环境亦为 0。

## 问题清单

- **Q1（环境残留，非代码缺陷）**：Builder 的 wrangler 运行残留 `.wrangler/tmp/`（gitignored）导致 lint 扫到 4 个 no-unused-vars/no-empty 错误。Verifier 清除该临时目录后 lint exit 0。建议后续将 `.wrangler/` 加入 eslint `ignores`（本次不做任何代码改动，仅记录）。
- **Q2（观察项）**：wrangler 本地模拟器下 desktop Perf 86（见上注）。生产 Cloudflare Pages 无此模拟层，如需可上线后以 PageSpeed Insights 复核。

## evidence/ 写入清单

- `evidence/verifier-report.md`（本文件，含分数摘要）
- 原始 Lighthouse JSON（v-desktop.json / v-mobile.json / v-desktop-wrangler.json）按约定留存于 `.agents/tmp/`，不入库

## 环境备注（进程清理确认）

- astro preview :4325：npm 外壳 TaskStop 后残留 node 子进程 PID 39216，`taskkill //T //F` 清除，端口已释放。
- wrangler :4326：TaskStop 后 npx→node(wrangler)→workerd 全链（顶层 PID 43784 共 12 进程，含 supervisor 重启的 workerd 20380/27508 及残留 24904）`taskkill //T //F` 递归清除。
- 最终两次复查（含 5 秒延迟防 supervisor 重启）：4325/4326 均 0 LISTENING，workerd 进程 0。
- 验证用基线 worktree `.agents/tmp/base-f2ecd1b` 已移除（node_modules junction 先经 PowerShell 安全拆除，真实 node_modules 完好），`git worktree list` 仅剩主工作区。
- 主工作区 git 状态：干净（HEAD e19430d），未做任何代码改动。
