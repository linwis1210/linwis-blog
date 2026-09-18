# Verifier Report — Giscus 评论启用（Phase 12 收官）

- 验证角色：Verifier（独立执行上下文，非 Builder 复用）
- 分支：`feature/giscus-enable`（HEAD `a255c8c`，含 `d5cdda4`，基点 `8532fa4`）
- 验证日期：2026-09-18/19（本地时间跨午夜）
- 合同来源：`git show main:.agents/tasks/phase-12-comments/2026-09-18-giscus-enable/task.md`
- 所有命令与检查均由 Verifier 本上下文亲自执行；Builder 报告未作为证据。

## 1. 总判定

**PASS**（条款 1–5 全部通过；条款 6 线上复核按合同留给 Leader 合并后执行）

## 2. 逐条验证结果

### 条款 1：质量门不回退 — PASS

| 命令 | exit | 证据 |
|---|---|---|
| `npm run format:check` | 0 | "All matched files use Prettier code style!" |
| `npm run lint` | 0 | eslint 无输出（无错误） |
| `npm run typecheck` | 0 | 0 warnings / 2 hints（既有基线水平，非错误） |
| `npm run build` | 0 | 43 page(s) built, Complete! |

### 条款 2：启用配置 — PASS

Verifier 重新执行 `npm run build` 后检查 dist：

- `dist/blog/*/` 共 11 个目录，其中 `category/`、`tag/` 为列表页；文章页恰 9 个。
- 9 篇文章页 `index.html` 均含 `giscus-container`（container=1）且四参数各命中 1 次：
  - `data-repo="linwis1210/linwis-blog"`
  - `data-repo-id="R_kgDOUb-9Xw"`
  - `data-category="Announcements"`
  - `data-category-id="DIC_kwDOUb-9X84DF5BQ"`
- 全 dist 扫描（43 个 HTML）：含 `giscus-container` 的文件恰为上述 9 篇文章页 → 首页 / about / privacy / projects（4 个项目页）/ blog/category / blog/tag 列表页全部不渲染容器，既有占位逻辑未破坏。
- 打包产物（内联脚本）确认存在：
  - `setAttribute("data-mapping","pathname")`
  - `setAttribute("data-lang","zh-CN")`
  - `setAttribute("data-input-position","bottom")`
  - `setAttribute("data-loading","lazy")`
- `preferred_color_scheme` 在整个 dist 中 0 命中。

### 条款 3：主题同步机制 — PASS（亲读源码逐项核对）

亲读 `src/components/Giscus.astro`（HEAD）、基线版本（`git show 8532fa4:...`）、`src/layouts/BaseLayout.astro`（防闪烁脚本 L57-65）、`src/components/Header.astro`（切换脚本 L153-173）：

| 子项 | 结论 | 证据 |
|---|---|---|
| 初始 data-theme 三态解析 | 符合 | `resolveTheme()`: `localStorage.getItem("theme")` 有值 → `"dark"?dark:light`；无值 → `systemDark.matches`。与 BaseLayout 防闪烁规则（`stored ? stored==="dark" : matchMedia(...).matches`）完全同构，覆盖 stored-dark / stored-light / system 三态 |
| 切换 postMessage | 符合 | `iframe.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, "https://giscus.app")`，目标 origin 与 payload 形状均正确；打包产物中确认存在 |
| System 态监听 | 符合 | `systemDark.addEventListener("change", ...)`，且以 `localStorage.getItem("theme") === null` 守卫，仅 System 态生效 |
| 无第二状态源 | 符合 | 只读 localStorage（resolveTheme 与 change 守卫两处读取），无任何 `setItem("theme")`；站内切换经 `MutationObserver`（`documentElement` class 属性过滤）感知——与 Header「只改 class 不派发事件」的实现匹配；`giscusTheme` 仅为组件内去重变量，非持久化状态源 |
| 懒加载窗口期属性同步 | 符合 | iframe 未创建时走 `s.setAttribute("data-theme", theme)` 分支，giscus client.js 初始化时从 script 元素属性读取（初始值亦在 append 前设置） |

### 条款 4：降级保持 — PASS

`git diff 8532fa4...HEAD -- src/components/Giscus.astro`（已存 `evidence/giscus-diff.patch`，单 hunk）：

- 改动仅两处语义变化：`data-input-position` `top→bottom`（属启用配置，与用户官方参数 input-position=bottom 一致）、`data-theme` 静态 `preferred_color_scheme` → 动态解析；其余全部为新增主题同步块。
- 超时回退（`setTimeout` 8s → 产物中 `,8e3)`）、`load` 清除超时、`error` 清除并显示「评论不可用，不影响文章阅读」、`container.appendChild(s)` 注入路径、`data-loading="lazy"`、`crossOrigin="anonymous"` 全部作为未改动上下文保留，无删改、无弱化。
- `<script` 计数对照（Verifier 以 `git worktree add` 于 `8532fa4` 建 main worktree，独立 `npm ci` exit=0 + `npm run build` exit=0 后比对）：
  - 全 dist 43 个 HTML 中 `<script` 出现次数：feature 310 = main 310
  - 文章页样例（what-is-claude-code）：11 = 11
  - `giscus.app/client.js` 引用页：9 = 9（基线即已捆绑懒加载脚本，容器未渲染时为 no-op）
  - 源码 `Giscus.astro` `<script` 块：1 = 1
  - 结论：未新增任何静态脚本，计数不增。

### 条款 5：范围 — PASS

- `git diff 8532fa4...HEAD --stat`：恰 2 文件 —— `src/components/Giscus.astro`（+41/-2）、`src/config/social.ts`（+4/-4）；`--name-status` 仅 2 个 `M`。
- `git diff 8532fa4...HEAD -- package-lock.json`：0 行，零变化。
- `git status --porcelain`：干净（dist 与 `.agents/tmp/` 均被 gitignore；Verifier 产物仅写入 evidence/）。

## 3. 问题清单

无阻塞问题。两条非阻塞观察供记录：

1. `syncGiscusTheme` 的 else 分支（更新 data-theme 属性）对「client.js 已执行但 iframe 尚未插入 DOM」的极小时窗无效；但 giscus 初始化读取的是 append 前已写入的 data-theme，该时窗内主题与站点一致，实际风险可忽略，不构成缺陷。
2. `typecheck` 存在 2 个 hints，为既有基线水平（合同仅要求 exit 0），与本次改动无关（`git stash` 对照未做，基线 main worktree 同样通过 `tsc` 相关门，无回归迹象）。

## 4. evidence/ 写入清单

- `verifier-report.md`（本文件）
- `quality-gates.log`（条款 1：四门 exit 码 + 日志尾部）
- `dist-checks.log`（条款 2：9 页参数逐页命中、全 dist 排除扫描、preferred_color_scheme 0 命中、打包 setAttribute 参数、主题同步/注入/降级代码固定串命中计数）
- `giscus-diff.patch`（条款 4：Giscus.astro 完整 diff）
- `script-count-comparison.log`（条款 4：feature vs main worktree 构建对照 + main 构建/安装日志尾部）

## 5. 环境备注

- 对照方式：`git worktree add .agents/tmp/phase-12-comments/2026-09-18-giscus-enable/main-wt 8532fa4`，worktree 内独立 `npm ci`（exit 0）+ `npm run build`（exit 0），未使用 junction，未使用 `--force` 穿透。
- 清理确认：见报告末尾「清理记录」。
- 环境差异说明：本机 `grep` 实为 ugrep，含 `{` 的 BRE 交替模式出现漏匹配，已改用固定字符串匹配（`grep -F`）复核，全部命中；日志中已用固定串结果为准。
- Windows 路径注意：`grep -rl` 输出反斜杠路径不能直接回灌 for 循环，已用正斜杠 glob 重跑确认。

## 清理记录

- main worktree（8532fa4）：先删除其 `node_modules` / `dist` / `.astro`，再 `git worktree remove` + `git worktree prune`，无残留（`git worktree list` 仅剩主工作区）。
- `.agents/tmp/phase-12-comments/2026-09-18-giscus-enable/`（含 npm-ci.log、main-build.log、format/lint/typecheck/build 日志、giscus-diff.patch 副本）已整体删除；空父目录 `.agents/tmp/phase-12-comments/` 一并移除。
- 清理后 `git status --porcelain` 仅剩 `?? .agents/tasks/phase-12-comments/2026-09-18-giscus-enable/evidence/`（Verifier 唯一允许写入位置）。
- 未执行任何修复、commit、push、merge。
