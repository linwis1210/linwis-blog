---
feature: 内容 CLI（new:post / new:project）
state: ACTIVE
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
