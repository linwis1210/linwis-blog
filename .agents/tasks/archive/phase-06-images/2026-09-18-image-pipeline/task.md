---
feature: Phase 6 图片体系收尾（Responsive / WebP·AVIF / Caption / Article Cover）
state: DONE
date: 2026-09-18
role-assignment:
  leader: main session
  builder: 自定义 agent（GLM-5.3-Flash / max）
  verifier: 独立自定义 agent（GLM-5.3-Flash / max）
risk: 2
repair-count: 0
branch: feature/image-pipeline
---

# Phase 6 图片体系收尾

## 目标（TASKS Phase 6 剩余 4 项；REQUIREMENTS §22；ARCHITECTURE §21 落地）

当前全站零内容图片——本 Feature 为第一篇真实配图文章铺基础设施，验收以 fixture（不入库）为主。

1. **Article Optional Cover（双模式）**：`blog/[slug].astro` 消费 `post.data.cover`——
   - 文件名形式（如 `"cover.jpg"`）→ `import.meta.glob("/src/assets/blog/**/*.{webp,avif,jpg,jpeg,png}")` 查 `<slug>/<文件>` → `<Picture formats={["avif","webp"]} layout="constrained">` + `loading="eager"` + `fetchpriority="high"`（文章头 LCP）；
   - `/` 开头（public 资产）→ 普通 `<img>` 回退。
2. **Responsive + WebP/AVIF（正文图）**：md 相对路径引用 src/assets → Astro 内置管线自动优化 + srcset（默认 WebP）；绝对路径 public 维持原样。README 写作节写清用法。
3. **Caption**：`src/lib/remark-figure.mjs` 零依赖 remark 插件——`![alt](src "title")` → `<figure><img><figcaption>title</figcaption></figure>`（复用既有 figcaption 样式）；无 title 不包裹。注册于 astro.config remarkPlugins。
4. **联动**：Article JSON-LD image 在 cover 存在时取 cover（已有 cover 优先逻辑，验证取到优化产物 URL）；og:image 保持 /og/<slug>.png 不变。
5. **文档**：README 写作节补「配图指南」（封面放法 / 正文相对路径写法 / 题注写法）。

## 范围外

Lightbox 多图切换、项目 SVG 封面迁移、Lighthouse（Phase 24）、真实配图体验（待首篇实际文章走轻量复核）。

## Validation Contract

| # | 条款 | 验证方法 | 通过条件 |
|---|---|---|---|
| 1 | 质量门不回退 | format:check / lint / typecheck / build | 全 exit 0 |
| 2 | Cover 优化路径 | fixture `src/assets/blog/fix-cover/cover.jpg`（sharp 生成，不入库）+ 文章 cover:"cover.jpg" → dist 文章页 `<picture>` 含 avif/webp source + srcset + img fallback，eager/fetchpriority；既有无 cover 文章页对照零变化 | 全符合 |
| 3 | Cover 回退路径 | fixture cover:"/images/projects/personal-blog.svg" → 普通 img 渲染 → 清理 | 符合 |
| 4 | 正文图 + Caption | fixture md 相对路径图 → dist/_astro 优化副本（webp）+ img 带 srcset/width/height/lazy；title 题注 → figure+figcaption 且文字正确；无 title → 不包裹 → 清理 | 全符合 |
| 5 | JSON-LD / meta 联动 | cover fixture 下 JSON-LD image 指 cover 产物；og:image 仍 /og/<slug>.png | 符合 |
| 6 | 纯净与范围 | `<script` 计数与 main 对照不增；diff 仅 blog/[slug].astro / astro.config.mjs / src/lib/remark-figure.mjs / README.md（package-lock 应零变化 = 零新依赖）；fixture 全清理 | 符合 |
| 7 | 线上零回归（Leader 合并后） | 既有文章页/首页/og 图 200、无 cover 文章无渲染异常 | 通过 |

## 约束

- 不改 docs/（README 除外——本 Feature 范围内）、`.agents/tasks/`；不 push 不合并；conventional commits。
- 零新 npm 依赖。
- fixture 图片与中间产物放 `.agents/tmp/phase-06-images/2026-09-18-image-pipeline/`，验证用副本用后删除。
- 同一问题修复上限 3 次。

## 状态流转记录

- 2026-09-18 ACTIVE —— 用户指示开发 Phase 6 其余项，Leader 出计划获批，派发 Builder。
- 2026-09-18 Builder 完成（`0799b0d` feature + `18795c4` docs，恰 4 文件零新依赖），自验条款 1–6 全 PASS。**Leader 采纳全部偏离**（均有验证支撑）：①新增 `image:{layout:"constrained"}` 全局配置——markdown 正文图 srcset 的必要开关（Astro 5.10+ 官方响应式图片特性，现无既有 astro:assets 用法故零副作用）；②JSON-LD 取 Picture fallback 需带 fit/position 参数参与哈希对齐；③无 cover 文章页 diff 的现实下界 = 新增 Tailwind 类致 CSS hash 1 行 + 条件槽位空白（结构性零变化）；④search-index 顺序非确定为既有已知项。防呆增强获认可：cover 文件缺失 → 构建报错 exit≠0。分支核查通过。
- 2026-09-18 状态 ACTIVE → READY_FOR_VALIDATION（派发 Verifier 条款 1–6）。
- 2026-09-18 Verifier R1 —— **条款 1–6 全部 PASS**：cover 优化路径（avif/webp 各 6 档 srcset + eager/fetchpriority）、回退路径、正文图 webp 副本 + 题注 figure 结构、JSON-LD/og 联动、script 计数 275=275、恰 4 文件零新依赖。备注两条：①md 相对路径按 md 位置解析——`./flow.png` 指 content 目录（与 md 同目录共置写法，Verifier 实测走通优化管线）；README 采「正文图与 md 同目录 / 封面走 assets 目录」双规则（Leader 裁定：各单一最简，ARCHITECTURE §21 由 cover 实现落地，约定记档）；②验证中 junction 摘除失误致 node_modules 清空，`npm ci` 精确还原（lock 零变化），判定证据取自事故前有效构建。证据：`evidence/verifier-report.md`。
- 2026-09-18 合并与条款 7 —— 证据提交 `72d70ba`；合并 `5745b6e` 推送；Actions **success**；线上零回归：首页/既有文章（无 cover，无 picture 块）/og 图/rss/sitemap 全部 200 正常。**合同条款 1–7 全部通过，零修复循环**。
- 2026-09-18 状态 → **DONE**。TASKS.md Phase 6 四项全勾（153/191 约 80%）——至此 Phase 6 仅剩真实配图后的体验复核（轻量）。分支已删，tmp 已清（含 Builder 遗留 8 项）。
