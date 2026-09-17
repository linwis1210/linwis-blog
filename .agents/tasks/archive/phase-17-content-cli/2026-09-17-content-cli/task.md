---
feature: 内容 CLI（new:post / new:project）
state: DONE
date: 2026-09-17
role-assignment:
  leader: main session
  builder: 自定义 agent（GLM-5.3-Flash / max）
  verifier: 独立自定义 agent（GLM-5.3-Flash / max）
risk: 2
repair-count: 0
branch: feature/content-cli
---

# 内容 CLI（new:post / new:project）

## 背景与决策（Leader 2026-09-17）

用户将下一项决策交予 Leader。裁定 Phase 17：对唯一用户（作者）每篇写作即刻有用、零生产风险、ARCHITECTURE §22 规格完整。图片体系（封面/响应式）与 Lighthouse 顺位其后。

## 目标（TASKS Phase 17 全部 6 项；ARCHITECTURE §22）

实现交互式内容脚手架，**零新 npm 依赖**（node 内置 readline）：

1. **`npm run new:post`**：交互流 Title → Slug 建议（标题为 ASCII 时自动 kebab-case 建议，含 CJK 时留空要求手输）→ 确认/修改 → Category（从 `src/config/categories.ts` 动态读取合法清单并校验，清单外拒绝）→ Tags（可选，逗号分隔）→ Series/seriesOrder（可选）→ draft（**默认 true**，REQUIREMENTS §7）。
2. **`npm run new:project`**：Title → Slug（同规则）→ status（active|completed|archived 校验）→ techStack（逗号）→ github/demo（可选）→ featured（默认 false）。
3. 生成文件：`src/content/blog/<slug>.md` / `src/content/projects/<slug>.md`，frontmatter 含 `date`（今日 yyyy-mm-dd）且与 content.config.ts schema 兼容；**slug 重复时拒绝并 exit≠0，绝不覆盖既有文件**。
4. slug 规则：`^[a-z0-9]+(-[a-z0-9]+)*$`；非法输入即时重询或退出报错。
5. 可脚本化：所有交互项支持命令行参数（如 `--title --slug --category --tags --series`）与管道 stdin，供 Verifier/CI 自动化使用。

## 范围外

snippet 脚手架（v1 不展示）、tag 别名归一化入 CLI、CI 中运行 CLI、修改站点源码与 content schema。

## Validation Contract

| # | 条款 | 验证方法 | 通过条件 |
|---|---|---|---|
| 1 | 质量门不回退 | format:check / lint / typecheck / build | 全 exit 0 |
| 2 | new:post 全流程 | 管道 stdin（或参数）模拟完整交互 → 检查生成文件：路径正确、frontmatter 字段与默认值正确（draft: true、date=今日、category 来自清单）、文件被 prettier 风格接受 | 全符合 |
| 3 | new:project 全流程 | 同法 → status/techStack/github/demo/featured 字段正确 | 全符合 |
| 4 | slug 规则与防覆盖 | ASCII 标题 → 建议 kebab；非法 slug（大写/下划线/空格/中文）被拒；对既有 slug 二次创建 → exit≠0 且原文件字节不变 | 全符合 |
| 5 | category 动态校验 | 清单内 slug 通过；伪造清单外 slug 被拒且提示可用值；校验值来源为 `src/config/categories.ts`（非脚本内硬编码） | 全符合 |
| 6 | 范围与无副作用 | diff 仅 `scripts/`（新）+ package.json scripts 字段（+2 行）；站点源码/docs/零改动；fixture 文件验证后删除；`npm run build` 产物不受影响 | 全符合 |
| 7 | 平台 | Builder 本机 Windows Git Bash 实测交互与管道两种模式 | 通过 |

（本 Feature 为开发工具，无线上条款；CF/Actions 行为零变化。）

## 约束

- 不改 docs/、README（Leader 收尾更新写作节）、`.agents/tasks/`；不 push 不合并；conventional commits。
- 中间产物放 `.agents/tmp/phase-17-content-cli/2026-09-17-content-cli/`。
- 同一问题修复上限 3 次。

## 状态流转记录

- 2026-09-17 ACTIVE —— Leader 裁定优先级后创建记录，派发 Builder。
- 2026-09-17 Builder 完成（`84e4e6e`：scripts/ 三文件 + package.json scripts 两行，+544 行零新依赖），自验条款 1–7 全 PASS（含 11 个 fixture 全清理、防覆盖 md5 前后一致、category 清单无硬编码 grep 证明、管道/参数/混合三模式实测）。**Leader 采纳四处偏离**（均有 Builder 实证）：①弃 node:readline（Windows 管道 question() 只读一行，最小复现在案）改自写 stdin 行读取器，TTY/管道同路径；②argv 模式下可选字段取默认不询问（否则全参数用法挂死）；③`--draft` 四写法兼容（parseArgs boolean 拒绝 `--flag=false`）；④winpty 真 TTY 环境不可用，以三模式覆盖且代码无 TTY 分支。分支核查通过（1 commit、无 fixture 残留）。
- 2026-09-17 状态 ACTIVE → READY_FOR_VALIDATION（派发 Verifier 条款 1–7）。
- 2026-09-17 Verifier R1 —— **条款 1–7 全部 PASS**：参数/最小参数/管道交互三模式生成正确（draft:true、date 当日、可选字段整段省略）；非法 slug 与伪造 category 全拒（清单与 categories.ts 四项一致、脚本零硬编码）；防覆盖 md5 前后一致；EOF 报错不挂死；范围恰 4 文件。**流程卫生记录**：发现 Builder 自验残留 2 个未跟踪 fixture（与「11 个全清理」记录不符），Verifier 保全 md5 证据后删除；所有条款判定在清理后干净工作树复测，不受影响。证据：`evidence/verifier-report.md` + 日志 17 份。
- 2026-09-17 合并与收尾 —— 证据提交 `3362a28`；合并 `db7962a` 推送（纯开发工具，CI/线上行为零变化）。TASKS.md Phase 17 六项全勾（149/194 约 77%）；README 写作节更新（推荐 new:post/new:project 入口）。状态 → **DONE**（零修复循环）。分支已删，tmp 已清。
