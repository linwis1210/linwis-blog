---
feature: Mermaid 架构图渲染支持
state: DONE
date: 2026-09-21
role-assignment:
  leader: main session
  builder: Builder
  verifier: Verifier
risk: 1
repair-count: 0
branch: feature/mermaid-diagram-support
---

# Mermaid 架构图渲染支持

## 目标

为博客正文（Markdown 与 MDX）提供轻量、优雅的 Mermaid 架构图与时序图渲染支持，完美契合 `DESIGN.md`（Quiet Engineering）的视觉体系，且保证在 Cloudflare Pages 无 Chromium 构建环境下的零运行时代价（仅在含图表文章按需激活）。

覆盖：
- `docs/TASKS.md` **Phase 4 — Markdown Experience**：`- [ ] Mermaid`

## 范围

**内**：
1. 前端轻量按需渲染组件 `src/components/Mermaid.astro`，识别页面中标记为 `data-language="mermaid"` 的代码块。
2. 视觉与 Design Tokens 对齐：通过 Mermaid 配置注入博客专属主题变量（明暗模式自动对应 `#F6F8FA` / `#161B22` 背景、`#0071E3` / `#58A6FF` 连接线、细中性边框与系统字体栈）。
3. 主题切换动态联动：监听全站主题切换事件，用户切换 Dark/Light 模式时无缝重绘图表，消除色彩割裂。
4. 优雅降级与工具栏：在代码块顶栏展示「DIAGRAM / MERMAID」，支持一键复制原始图表文本；JS 禁用或异常时安全回退为等宽代码块。
5. 在 `src/layouts/BaseLayout.astro` 中引入该能力，并在代码块顶栏处理逻辑中对 `mermaid` 语言做分流接管。
6. 提供实际 Mermaid 流程图/时序图测试用例验证效果。

**外**：
- 不在 Cloudflare Pages 构建机安装重型 Puppeteer/Chromium；
- 不引入 PlantUML、Graphviz 等其他图表语法。

## Validation Contract

验收标准 / 验证方法 / 通过条件 / 证据位置（Verifier 在独立上下文中逐条核验）：

| # | 条款 | 验证方法 | 通过条件 |
|---|---|---|---|
| 1 | 格式检查 | `npm run format:check` | exit 0 |
| 2 | 代码规范 | `npm run lint` | exit 0 |
| 3 | 类型检查 | `npm run typecheck` | exit 0 |
| 4 | 静态构建 | `npm run build` | exit 0 |
| 5 | 无图表页面零开销 | 检查不含 mermaid 的文章页 Network 与 DOM | 0 个 mermaid 资源请求，无运行时负载 |
| 6 | 图表渲染呈现 | 访问含 mermaid 代码块的文章测试页 | 代码块被成功渲染为清晰精致的内联 SVG 图表 |
| 7 | 双主题联动 | 点击顶栏主题切换按钮（Light ↔ Dark） | 图表节点背景与连线颜色自动跟随主题平滑重绘，无控制台报错 |
| 8 | 源码与降级 | 检查图表顶栏操作项 | 提供清晰的代码/复制入口，网络异常或降级时文字源码可读 |

证据位置：本目录 `evidence/`（由 Verifier 在独立验收时记录）。

## 约束

- 严格遵守 `AGENTS.md`、`.agents/roles/leader.md` 与 `.agents/roles/builder.md`。
- Leader 不直接修改产品源码；产品实现由 Builder 角色完成。
- 不推送远端 Git；本地通过独立验证并经用户确认后合并。
- 修复上限 3 次，计数记录于 front-matter `repair-count`。

## 状态流转记录

- 2026-09-21 ACTIVE —— Leader 完成 Feature 规划与 Validation Contract 定义，准备派发 Builder。
- 2026-09-21 READY_FOR_VALIDATION —— Builder 完成 Mermaid 渲染组件开发、全局样式适配、布局接管与集成测试用例，全套自验（格式检查、代码规范、类型检查、静态构建与 Headless 真实浏览器双主题/零开销 E2E 测试）全部通过。
  - 修改/新增文件清单：
    - 新增 `src/components/Mermaid.astro`
    - 修改 `src/layouts/BaseLayout.astro`
    - 修改 `src/styles/global.css`
    - 修改 `src/content/blog/deploy-astro-with-docker.md`
  - 自验命令执行结果：
    - `npm run format:check`：Exit 0（All matched files use Prettier code style!）
    - `npm run lint`：Exit 0（ESLint 检查全绿通过，无报错）
    - `npm run typecheck`：Exit 0（astro check 0 errors, 0 warnings）
    - `npm run build`：Exit 0（43 页面全量静态构建成功）
    - 真实浏览器 Headless E2E 验证：
      - Light 模式：SVG 图表正常渲染，主题变量对齐（`#0071e3`、`#f6f8fa`、`#d8dee4`）
      - Dark 模式：SVG 图表正常渲染，主题变量对齐（`#58a6ff`、`#161b22`、`#30363d`）
      - 动态切换联动：切换 `dark` class 后图表无缝平滑重绘，无控制台报错
      - 无图表页面零开销：非图表页无 Mermaid DOM、无 CDN 网络请求
      - 优雅回退与顶栏交互：提供 DIAGRAM 标签、Code 源码切换、一键复制，无 JS 时以代码块正常呈现
- 2026-09-21 DONE —— Verifier 独立验收完成（报告归档于 `evidence/verifier-report.md`），条款 1–8 全量通过（PASS）。Leader 审核验证证据真实完整，正式批准 Feature 完成并归档。`docs/TASKS.md` 对应项同步勾选。

