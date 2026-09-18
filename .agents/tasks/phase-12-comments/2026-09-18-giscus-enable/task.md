---
feature: Giscus 评论启用（Phase 12 收官）
state: ACTIVE
date: 2026-09-18
role-assignment:
  leader: main session
  builder: 自定义 agent（GLM-5.3-Flash / max）
  verifier: 独立自定义 agent（GLM-5.3-Flash / max）
risk: 2
repair-count: 0
branch: feature/giscus-enable
---

# Giscus 评论启用（Phase 12 收官）

## 背景

站点已上线真实文章，用户提供 giscus.app 生成的官方配置参数（ Discussions 已启用、giscus App 已安装）：

```text
repo=linwis1210/linwis-blog  repo-id=R_kgDOUb-9Xw
category=Announcements       category-id=DIC_kwDOUb-9X84DF5BQ
mapping=pathname  reactions=1  input-position=bottom  lang=zh-CN
```

## 目标

1. **启用配置**（`src/config/social.ts`）：`FEATURES.giscus` → `enabled: true` + 四个真实值；语言 zh-CN、reactions 保留、输入位置 bottom（与用户选择一致）。
2. **主题同步修复**（`src/components/Giscus.astro`，TASKS Phase 12 唯一遗留未勾项）：
   - 初次渲染主题 = 站点解析后主题（非浏览器 preferred_color_scheme——两者可能相反）；跟随 BaseLayout 既有主题机制（localStorage + html class + System 媒体查询），实现方式自审（读 BaseLayout 主题脚本后定，避免重复状态源）；
   - 站内切换主题 → `iframe.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, "https://giscus.app")`，无刷新同步；
   - System 模式下监听 `prefers-color-scheme` 变化一并同步。
3. **降级与性能不变**：懒加载、8s 超时回退、错误降级、失败不影响正文（REQUIREMENTS §17）全部保持。

## Validation Contract

| # | 条款 | 验证方法 | 通过条件 |
|---|---|---|---|
| 1 | 质量门不回退 | format:check / lint / typecheck / build | 全 exit 0 |
| 2 | 启用配置 | dist 文章页 HTML：giscus script 存在且 `data-repo-id=R_kgDOUb-9Xw`、`data-category-id=DIC_kwDOUb-9X84DF5BQ`、`data-repo=linwis1210/linwis-blog`、`data-category=Announcements`、`data-mapping=pathname`、`data-lang=zh-CN`；首页等非文章页不渲染（既有占位逻辑不变） | 全符合 |
| 3 | 主题同步机制 | 代码审查：初始主题取站点解析值（覆盖 System 三态）；切换走 postMessage setConfig；System 监听存在；无新增状态源（复用既有主题存储） | 逐项符合 |
| 4 | 降级保持 | 超时回退/错误降级/懒加载代码路径未删改；`<script` 计数与 main 对照不增（giscus 为既有懒加载脚本，不新增静态脚本） | 符合 |
| 5 | 范围 | diff 仅 `src/components/Giscus.astro` + `src/config/social.ts` | 无越界 |
| 6 | 线上复核（Leader 合并后） | curl 线上文章页同条款 2 参数；`giscus.app` 脚本可加载；主题初始值/切换由用户实浏览器抽查（Leader 汇报后请用户确认明暗切换效果） | 通过 |

## 约束

- 不改 docs/、README、`.agents/tasks/`；不 push 不合并；conventional commits；零新依赖。
- giscus 参数本身是公开值（设计上暴露于页面源码），入库无风险。
- 中间产物放 `.agents/tmp/phase-12-comments/2026-09-18-giscus-enable/`。
- 同一问题修复上限 3 次。

## 状态流转记录

- 2026-09-18 ACTIVE —— 用户提供官方参数（Discussions/giscus App 已由用户配置），Leader 建记录，派发 Builder。
