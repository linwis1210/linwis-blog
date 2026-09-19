---
feature: Lighthouse 基线 + 移动端审计（Phase 24）
state: ACTIVE
date: 2026-09-19
role-assignment:
  leader: main session（测量与结论）
  builder: 自定义 agent（GLM-5.3-Flash / max，按需）
  verifier: 独立自定义 agent（GLM-5.3-Flash / max，按需）
risk: 2
repair-count: 0
---

# Lighthouse 基线 + 移动端审计（Phase 24）

## 阶段 A：测量（Leader）

- 工具：Google PageSpeed Insights API v5（客观、可复现）。
- 对象 × 策略（4 份）：
  1. `https://linwis.pages.dev/` — mobile
  2. `https://linwis.pages.dev/` — desktop
  3. `https://linwis.pages.dev/blog/what-is-claude-code/` — mobile（最重页：封面 + 正文图 + 评论区）
  4. `https://linwis.pages.dev/blog/what-is-claude-code/` — desktop
- 原始 JSON 存 `.agents/tmp/phase-24-performance/2026-09-19-lighthouse-audit/`，关键摘要入 evidence。

## 通过标准（DoD 第 12 条）

| 维度 | 目标 |
|---|---|
| Performance | ≥ 90（mobile 为准） |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 95 |

四页次全部达标 → Phase 24 直接收官；任一不达标 → 阶段 B 修复循环（以复测分数为客观判据，上限 3 轮/问题）。

## 阶段 B：修复（按测量结果定）

PSI 审计项驱动（预期嫌疑：封面 eager 大图 LCP、CLS、第三方脚本）。每轮：Builder 修 → Verifier 复跑 PSI 对照 → 达标为止。

## 约束

不改验收标准；测量参数固定（同一 API、无缓存作弊）；修复不引入新依赖除非无替代。

## 状态流转记录

- 2026-09-19 ACTIVE —— 用户指示开工；Builder/Verifier 派发链路已恢复（用户修复客户端档位设置，探针验证通过）。
