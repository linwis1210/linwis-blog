# Task Records 约定

本目录是**执行真源**（怎么做、证据何在）；`docs/TASKS.md` 是**计划真源**（做什么、何时）。
Feature 归档时同步勾选 `docs/TASKS.md` 对应项；规则本身不双写。

## 目录结构

```text
.agents/tasks/
├── _meta/                          # 跨阶段项目级工作（接管核对、工作流改进）
├── phase-XX-<slug>/                # 活跃工作（懒创建，见下方命名表）
│   ├── YYYY-MM-DD-<slug>.md        # 简单工作：单文件
│   └── YYYY-MM-DD-<slug>/          # 正式 Feature：目录
│       ├── task.md                 # 目标/范围/Validation Contract/状态/修复计数/证据索引
│       └── evidence/               # 按需：支撑 PASS/FAIL 判定的客观证据
└── archive/                        # 归档区（结构同上按阶段镜像）
    └── phase-XX-<slug>/
```

## 命名表（权威映射，目录按需懒创建，不预建空目录）

| docs/TASKS.md 阶段 | 目录名 |
|---|---|
| Phase 0 — Repository | `phase-00-repository` |
| Phase 1 — Foundation | `phase-01-foundation` |
| Phase 2 — Content System | `phase-02-content-system` |
| Phase 3 — Blog | `phase-03-blog` |
| Phase 4 — Markdown Experience | `phase-04-markdown-experience` |
| Phase 5 — TOC & Reading UX | `phase-05-toc-reading-ux` |
| Phase 6 — Images | `phase-06-images` |
| Phase 7 — Projects | `phase-07-projects` |
| Phase 8 — Taxonomy | `phase-08-taxonomy` |
| Phase 9 — Search | `phase-09-search` |
| Phase 10 — Home | `phase-10-home` |
| Phase 11 — About | `phase-11-about` |
| Phase 12 — Comments | `phase-12-comments` |
| Phase 13 — SEO | `phase-13-seo` |
| Phase 14 — PWA | `phase-14-pwa` |
| Phase 15 — Analytics | `phase-15-analytics` |
| Phase 16 — Legal | `phase-16-legal` |
| Phase 17 — Content CLI | `phase-17-content-cli` |
| Phase 18 — CI | `phase-18-ci` |
| Phase 19 — Deployment（Cloudflare Pages，2026-09-15 修订） | `phase-19-deployment` |
| Phase 22 — Scheduled Publishing | `phase-22-scheduled-publishing` |
| Phase 23 — Production | `phase-23-production` |
| Phase 24 — Performance | `phase-24-performance` |
| Phase 25 — v1.0 Release | `phase-25-v1-release` |
| v2 Roadmap — AI | `v2-ai` |
| v2 Roadmap — Content | `v2-content` |
| v2 Roadmap — Platform | `v2-platform` |
| （跨阶段 / 工作流级） | `_meta` |

能归入单一阶段的工作优先归阶段目录；`_meta` 仅用于真正的跨阶段工作。

## 记录形式

- 记录与 Feature 目录统一命名 `YYYY-MM-DD-<slug>`，归档区自然按时间排序。
- 简单工作：单个 Markdown 文件。
- 正式 Feature：目录 + `task.md`，Validation Contract（验收标准、验证方法、通过条件、证据位置）内嵌在 task.md，不另立契约文档；`evidence/` 按需创建。

## 状态与生命周期

- front-matter 维护 `state`：`ACTIVE` / `READY_FOR_VALIDATION` / `FAILED_VALIDATION` / `BLOCKED` / `DONE`。
- `DONE` 判定 = 独立验证通过的完整证据；Builder 不能自证完成，Leader 仅凭完整通过证据记录 DONE。
- 同一问题修复上限 3 次，计数记在 task.md；更名不重置计数。
- 归档：`DONE`（或确认放弃的 `BLOCKED`）→ 整体移入 `archive/对应阶段/`，文件名不变。

## 派发边界（子代理上下文）

handoff 只指向所需活跃阶段目录；`archive/` 默认**不进入**子代理上下文，仅确需历史证据时按显式路径引用。

## 中间产物

`.agents/tmp/`（整目录 gitignored）与本目录**同轴按阶段**存放中间产物；任务收尾先抽取证据到 `evidence/`，再删除对应 tmp 子目录。持久状态只存在于 Git 与 Task Records，不依赖会话记忆。

## 派发标准（运行要求）

角色子代理：**GLM-5.3-Flash，推理强度 max**（provider `defaultVariant` 已为 `max`）。

**机制（2026-09-15 起生效）**：用户在 `~/.zcode/agents/` 定义 `builder.md` / `verifier.md`
两个自定义 agent（`model: custom:builtin:bigmodel-coding-plan:GLM-5.3-Flash`，
`injectAgentsMd: true`）。Leader 经 Agent 工具以 `subagent_type: "Builder" / "Verifier"`
直接派发，模型绑定随 profile 生效，无需手动会话；角色细则由派发 prompt 指向
`.agents/roles/*.md`。

**历史实测（供参考）**：`general-purpose` / `Explore` 等无 model 绑定的类型继承会话模型
（主会话 GLM-5.3），此前「Flash 设置未生效」的观察源于此；勘误类只读调研可继续用 `Explore`，
与模型标准无关，唯角色派发必须走 Builder/Verifier 类型。实际运行模型以用户端确认
（子代理 metadata 不记录模型字段）。
