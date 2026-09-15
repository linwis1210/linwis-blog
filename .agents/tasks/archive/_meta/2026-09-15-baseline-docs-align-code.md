---
state: DONE
date: 2026-09-15
role: Leader
risk: 1
repair-count: 0
---

# 2026-09-15 基线文档与代码对齐（前端风格以代码为准）

## 裁决与状态（用户 2026-09-15）

1. **前端页面风格以代码现状为准**，基线文档随之更新（本记录即执行）。
2. **域名尚未确定**：`astro.config.mjs` 的 `site=https://linwis.dev` 为占位值。
3. **GitHub remote 建立时机**：评估结论见下，用户决策待定。

## 变更清单

- `README.md` 设计体系段：鼠标特效改为「默认整体关闭」的事实描述；删除「卡片 spotlight 常驻」
  的失实表述（`EFFECTS.enabled=false`，且全站无元素挂 `.spotlight-card`）。
- `README.md` frontmatter 示例：`cover` / `redirectFrom` 两行加注「字段已预留、渲染/重定向暂未生效」。
- `docs/REQUIREMENTS.md` §39：标注 `linwis.dev` 为占位、域名未定及影响面（canonical / RSS / sitemap）。

## 边界说明

REQUIREMENTS 中尚未实现的目标（§19 RSS 全文、§21 Redirect、§22 响应式图片等）保持为「目标」不动——
需求描述目标态，README 描述现状态，缺口由 `docs/TASKS.md` 未勾项跟踪。
本次仅对齐「现状描述」与「事实性标注」，不修改任何验收标准。

## GitHub remote 评估结论（供决策，非本记录执行范围）

建议**尽早**建立，理由：

1. **备份安全**：本地是项目唯一副本（ARCHITECTURE §25 以 Git 仓库为主要资产，单机存在数据损失风险）。
2. **v1.0 DoD 依赖链**：CI（Phase 18）、GHCR/CD（Phase 20–21）、Giscus（需公开仓库 + Discussions）、
   文章页已渲染的 Edit/History on GitHub 链接，均指向一个尚不存在的仓库。
3. **时机**：不阻塞当前本地工作；但在「ESLint + CI 质量基线」Feature 落地前建立最有价值。

执行约束：本机 **gh CLI 未安装**。建议用户在 github.com 手动创建 public 仓库（建议名 `linwis-blog`，
REQUIREMENTS §37 约定源码公开），随后由 Leader 完成提交、remote 配置与首次 push
（凭据走 Git Credential Manager，首次推送会弹浏览器授权）。
