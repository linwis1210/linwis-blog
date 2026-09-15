---
feature: ESLint + CI 质量基线
state: FAILED_VALIDATION
date: 2026-09-15
role-assignment:
  leader: main session
  builder: subagent (GLM-5.3-Flash / max，目标配置；实测 2026-09-15 Agent 派发继承会话模型 GLM-5.3)
  verifier: 独立子代理（用户手动派发，2026-09-15）
risk: 2
repair-count: 1
branch: feature/eslint-ci-baseline
---

# ESLint + CI 质量基线

## 目标

为仓库建立本地可运行、CI 可复现的质量检查基线，并修正 `src/config/site.ts` 中与真实仓库不符的 `repo` 配置。

覆盖：

- docs/TASKS.md **Phase 0**：配置 ESLint（遗留未完成项）
- docs/TASKS.md **Phase 18**：GitHub Actions / Install / Format Check / Lint / Type Check / Astro Build 六项
- 正确性修正：`site.ts` `repo: "linwis/linwis-blog"` → `"linwis1210/linwis-blog"`（文章页 View/Edit/History on GitHub 链接当前指向不存在的仓库）

## 范围

**内**：

1. ESLint 9 flat config（Astro + TypeScript 项目适配：`eslint-plugin-astro`、`typescript-eslint`、必要的 globals；格式归 Prettier 管，用 `eslint-config-prettier` 类配置关掉冲突的风格规则）。
2. package.json scripts 补齐：`lint`、`format:check`（Prettier 已有配置）、`typecheck`（`astro check`，需补 `@astrojs/check` 依赖）、沿用现有 `build`。
3. `.github/workflows/ci.yml`：push/PR 到 main 触发；Node 22（与 `@types/node` ^22 对齐）；步骤 = npm ci → format:check → lint → typecheck → build；任一步失败即失败。
4. `site.ts` repo 值修正。
5. 为让上述命令通过所需的**最小**代码整理：Prettier 格式化、lint 修复。仅限不改变运行时行为的安全修复（如未使用导入）；行为性改动一律不做，留问题记录。

**外**（后续 Feature）：Content Validation 独立步骤、Unit Tests、Broken Link Check、Playwright Smoke Test、Docker/GHCR/CD、pre-commit hook。

## Validation Contract

验收标准 / 验证方法 / 通过条件 / 证据位置（Verifier 在**独立上下文**中逐条执行）：

| # | 条款 | 验证方法 | 通过条件 |
|---|---|---|---|
| 1 | 干净安装 | `rm -rf node_modules && npm ci` | exit 0 |
| 2 | 格式检查 | `npm run format:check` | exit 0 |
| 3 | Lint | `npm run lint` | exit 0 |
| 4 | 类型检查 | `npm run typecheck` | exit 0 |
| 5 | 构建 | `npm run build` | exit 0 |
| 6 | CI 工作流有效 | 审查 `.github/workflows/ci.yml`（YAML 合法；步骤与本合同 2–5 一致；触发条件 push/PR → main；Node 22） | 逐项符合 |
| 7 | repo 配置正确 | `src/config/site.ts` 的 `repo` 值；构建产物中抽查一篇文章页的 GitHub 链接指向 `linwis1210/linwis-blog` | 均指向真实仓库 |
| 8 | 无行为变更 | `git diff main...feature/eslint-ci-baseline` 审查：仅限 新增配置/workflow/依赖、格式化 diff、site.ts 单行、删除未使用导入等安全项 | 无运行时行为改动 |
| 9 | 远端 CI 绿（合并后复核） | Leader 合并推送后查公开 API `api.github.com/repos/linwis1210/linwis-blog/actions/runs` | main 最新 run = success |

证据位置：本目录 `evidence/`（Verifier 写入各命令输出摘要 + 条款逐条结论；条款 9 由 Leader 合并后补充）。

## 约束

- 遵守 `AGENTS.md` 与 `.agents/roles/builder.md`；不修改 docs/（TASKS.md 勾选由 Leader 在 DONE 时统一处理）、不改需求/架构/验收标准。
- 不推送远端（Leader 负责合并与推送）。
- 工作分支：`feature/eslint-ci-baseline`（自 main 创建）。
- 同一问题修复上限 3 次，计数记于本文件 front-matter。

## 状态流转记录

- 2026-09-15 ACTIVE —— Leader 创建记录与合同，派发 Builder。
- 2026-09-15 Builder 完成 —— 分支 `feature/eslint-ci-baseline` 4 commits（`08a8f91`→`c9eba63`），基点 `4617f5e`（= main tip）。自验条款 1–8 全 PASS；条款 8 方法：main/分支双构建 dist 去空白逐字符比对，除 repo URL 外零差异。遗留 3 项（`/blog/page/2+` 路由因文章数未激活、prettier-plugin-astro 0.14 无法解析 `define:vars` 组件、2 个 astro(4000) is:inline hint）均为行为性/工具性事项，未纳入本合同。
- 2026-09-15 Leader 分支核查通过 —— 基点正确、无越权改动（docs/ 与 .agents/tasks/ 未动）、变更规模与报告一致。
- 2026-09-15 派发标准偏差记录 —— 用户观察 Builder 子代理实际运行 GLM-5.3（要求 GLM-5.3-Flash）；子代理 metadata 无模型字段，结构证据指向「Agent 工具派发继承会话模型」，客户端 Flash 设置未覆盖该路径。影响：成本与设置意图不符；不影响验证客观性（Verifier 依合同独立执行命令与比对）。Verifier 派发待用户对模型配置的决定。
- 2026-09-15 状态 ACTIVE → READY_FOR_VALIDATION。
- 2026-09-15 用户决定 —— Verifier 派发挂起，待用户先行核查/修正客户端子代理模型设置（要求 Flash 生效）；收到就绪信号后 Leader 立即派发。Builder 分支（4 commits）无时效风险。
- 2026-09-15 Verifier 独立验证（用户手动派发）—— **总判定 FAIL**：条款 2（format:check）FAIL，条款 1、3–8 全 PASS。根因：`core.autocrlf=true` 的 Windows 检出为 CRLF，Prettier 3 默认 `endOfLine: lf` → 36 文件判定不合规；反证实验（HEAD 仓库字节过 prettier = exit 0）证明仓库内容本身合规，失败由检出环境引起。证据：`evidence/verifier-report.md` + raw 日志。
- 2026-09-15 Leader 修复指示（修复尝试 1/3）—— 方向定为 **`.gitattributes` 强制 LF**（`* text=auto eol=lf`）+ renormalize + Windows 工作树刷新；`.prettierrc` 保持默认 `lf` 不动（对齐 Linux CI，消除环境分歧，顺带终结全天出现的 LF/CRLF 警告）。备选方案 `endOfLine: "auto"` 被否：它让检查结果依赖本地检出风格，弱化基线。修复后 Verifier 须重跑条款 1–8 全量。
- 2026-09-15 合同外观察项记录（Verifier，不入本合同）—— ① 内容文件存在旧仓库链接（`projects/personal-blog.md:15`、两篇博文的 `ghcr.io/linwis/linwis-blog`），属内容修正，待用户确认后另立任务；② `search-index.json` projects 段构建间顺序非确定（建议后续加显式排序）；③ DESIGN.md 被 prettier 表格对齐（Leader 知悉，保持）；④ npm 安装含 eslint deprecated 警告（噪声）。
- 2026-09-15 状态 READY_FOR_VALIDATION → FAILED_VALIDATION；repair-count 0 → 1。
- 2026-09-15 修复尝试 1/3 完成 —— Builder（自定义 agent 直派）新增 `97d85ac`：仅 `.gitattributes` 一行（`* text=auto eol=lf`）；renormalize 确认 no-op；工作树刷新后 `git ls-files --eol` 全 96 文件 LF / 0 CRLF；自验条款 1–5 全部 exit 0（条款 2 由 1→0）。派发机制升级：用户建立 `~/.zcode/agents/` 自定义 Builder/Verifier（模型绑定 GLM-5.3-Flash，metadata 已实证记录），此后角色派发经 `subagent_type` 直派，标准写入 `.agents/tasks/README.md`（main `4cd388f`）。
- 2026-09-15 状态 FAILED_VALIDATION → READY_FOR_VALIDATION（复验轮 R2，Verifier 重跑条款 1–8 全量）。
- 2026-09-15 Verifier R2 复验 —— **条款 1–8 全部 PASS**（R1 唯一 FAIL 的条款 2 经 `97d85ac` 修复后转绿；其余条款独立重跑）。证据：`evidence/verifier-report-r2.md` + r2-*.log。随后 Leader 合并 `c24e687` 推送，触发仓库首次 CI。
- 2026-09-15 条款 9 FAIL（新问题，CI 安装失败，修复尝试 1）—— 远端 run `34985384625` 于 **Install dependencies（npm ci）** 步骤 exit 1（6 秒即败，后续步骤 skipped）。远端日志需管理员权限（403），Leader 本地取证复现：CI Node 22 自带 **npm 10**，而 lockfile 由本机 **npm 11.6.2** 生成，`npx npm@10.9.3 ci` 本地同样报 `EUSAGE：Missing @emnapi/runtime@1.11.3、@emnapi/core@1.11.3 from lock file`（sharp 传递依赖）→ 根因 = **lockfile 的 npm 版本不兼容**，非代码问题。
- 2026-09-15 Leader 修复指示（CI-install 问题，尝试 1）—— 用 `npx npm@10 install` 重新生成 `package-lock.json`（预期仅此一文件变更；package.json 不动），双版本验证（npm 10 与 npm 11 的 `ci` 均 exit 0）+ 条款 1–5 自验，新分支 `fix/ci-npm10-lockfile`。CI 保持 Node 22（合同条款 6 不变）。附带观察：actions/checkout@v4、setup-node@v4 有 Node20 弃用警告（后续小任务升级）。
- 2026-09-15 状态 READY_FOR_VALIDATION → FAILED_VALIDATION（条款 9 未过，Feature 未完成）。
