---
feature: og:image 自动生成
state: FAILED_VALIDATION
repair-count: 1
date: 2026-09-16
role-assignment:
  leader: main session
  builder: 自定义 agent（GLM-5.3-Flash / max）
  verifier: 独立自定义 agent（GLM-5.3-Flash / max）
risk: 2
repair-count: 0
branch: feature/og-image
---

# og:image 自动生成

## 目标（TASKS Phase 6「Auto OG Image」+ REQUIREMENTS §22/§20）

构建期为每篇已发布文章生成 1200×630 OG 图片，并补齐全站 `og:image` 元数据缺口：

1. **生成管线**（构建期，零客户端 JS）：`src/pages/og/[slug].png.ts` 端点（getStaticPaths 遍历已发布文章，含 draft/未来过滤）+ `src/pages/og/default.png.ts`（站点默认图，非文章页用）。技术选型 satori + @resvg/resvg-js（或 Builder 论证后的等效组合）。
2. **字体**：中文标题必须正确渲染（无豆腐块）。CJK 字体文件入库（预算 ≤10MB，优先更小子集；OFL 类许可需随附 license 说明）。
3. **视觉**：遵循 DESIGN.md Quiet Engineering——`#FBFBFD` 近白底、`#1D1D1F` 墨色标题、蓝 `#0071E3` accent、`linwis_` 标识；无渐变堆砌无 SaaS 风。内容建议：站名 + 文章标题 +（可选）分类/域名，字号层级清晰。
4. **meta 接线**：`BaseLayout.astro` 新增 ogImage prop——文章页传 `/og/<slug>.png` 绝对 URL（`SITE.url` 拼接，占位域名与 canonical 一致属既定状态）；输出 `og:image` + `og:image:width/height`（1200/630）+ `twitter:card=summary_large_image` + `twitter:image`；未传时指向 default 图。
5. **Article JSON-LD**：`blog/[slug].astro` 的 Article JSON-LD 补 `image` 字段（REQUIREMENTS §20）。

## 范围外

og:image 对占位域名 linwis.dev 的最终域名替换（随域名 Feature 统一处理）；移动端分享预览的多平台实测（线上条款做基础可达性）。

## Validation Contract

| # | 条款 | 验证方法 | 通过条件 |
|---|---|---|---|
| 1 | 质量门不回退 | format:check / lint / typecheck / build | 全 exit 0 |
| 2 | 产物齐全 | 构建后 dist：每篇已发布文章 `og/<slug>.png` + `og/default.png`；均为合法 PNG 且 1200×630（file/签名 + 尺寸探针） | 齐全且尺寸正确 |
| 3 | 渲染正确性（视觉） | 用 Read 工具目视 ≥3 张生成 PNG：中文标题清晰无豆腐块、无乱码、构图符合 DESIGN.md 色板 | 目检通过 |
| 4 | meta 正确 | 文章页 HTML：og:image 绝对 URL 指向自身 /og/<slug>.png + width/height + twitter:card=summary_large_image + twitter:image；首页/关于等指向 default | 全符合 |
| 5 | 构建期纯净与确定性 | dist 页面无新增客户端 JS（与 main 对照 script 计数不增）；连续两次 build 同名 PNG 字节一致 | 全符合 |
| 6 | 变更范围 | diff 仅限：新增 og 端点、字体资产（+license）、package.json/lock（新依赖）、BaseLayout.astro、blog/[slug].astro | 无越界 |
| 7 | 线上复核（Leader 合并后） | curl `https://linwis.pages.dev/og/<slug>.png` 200 且 content-type image/png；文章页 meta 正确 | 全符合 |

## 约束

- 不改 docs/、README、`.agents/tasks/`；不 push 不合并；conventional commits。
- 中间产物（含字体下载残料）放 `.agents/tmp/phase-06-images/2026-09-16-og-image/`。
- 同一问题修复上限 3 次。

## 状态流转记录

- 2026-09-16 ACTIVE —— 用户搁置 Phase 22 定时发布（降级低优先级）后指示继续；Leader 按 TASKS 优先级选择本项，创建记录，派发 Builder。
- 2026-09-16 Builder 完成（2 commits：`ff56018` satori+resvg 管线 / `e903031` meta 接线），自验条款 1–6 全 PASS：9 张 PNG（8 文章 + default）1200×630、4 张目视无豆腐块、`<script>` 计数与 main 逐页一致、双构建 sha256 一致、字体 Noto Sans SC 7.9MiB（SIL OFL，LICENSE 随附）。Leader 分支核查通过（基点 = main tip、范围 10 文件、树干净）。备注：Builder 合理地以 `git show main:` 替代分支切换读取文档；TS TypedArray 泛型一轮类型收窄属预期修复非方案变更。
- 2026-09-17 状态 ACTIVE → READY_FOR_VALIDATION（派发 Verifier 条款 1–6；条款 7 线上复核归 Leader 合并后）。
- 2026-09-17 Verifier R1 —— 条款 1–6 全部 PASS（5 张 PNG 独立目视；main 对照逐页 script 计数一致；双构建 sha256 一致）。证据：`evidence/verifier-report.md`。随后证据提交 `2808752`、合并 `742e41e` 推送。
- 2026-09-17 条款 7/远端 FAIL（新问题，修复尝试 1）—— 合并后 Actions **Install dependencies（npm ci）6 秒失败**，CF Pages 构建同步失败（线上 404 = 旧部署仍在服务）。无日志权限，Leader 本地复现钉死根因：`npm ci --os=linux` 在 **npm 10**（Actions Node 22 与 CF 均为 npm 10）报 `EUSAGE: Missing @emnapi/runtime@1.11.3, @emnapi/core@1.11.3 from lock file`（resvg-js 平台二进制的 emnapi 依赖链在 Linux 理想树中的解析，npm 11 已修复、npm 10 无修复）；npm 11 同命令 dry-run 通过。
- 2026-09-17 Leader 修复指示（尝试 1）—— **以 sharp 替换 @resvg/resvg-js 做光栅化**：sharp（libvips）已在依赖树（Astro 图像管线），其平台图已被本仓 d9ce540 的成功 CI（npm 10）验证；satori 输出 SVG 文字为矢量路径，光栅化无需系统字体。实现：`src/lib/og.ts` 移除 resvg 调用改 `sharp(Buffer.from(svg)).resize(1200).png()` 或等效；package.json 移除 resvg 两依赖后重生成 lock；**验证门槛升级：npm 11 与 `npx npm@10.9.3 ci --os=linux --cpu=x64 --libc=glibc --dry-run` 双解析通过 + 条款 1–6 全量重验（视觉必须重做——光栅器更换）**。备选否决：CI 装 npm 11（管不了 CF）、resvg-wasm（新依赖形态）、重生成 lock（跨平台打地鼠）。分支 `fix/og-sharp-raster`。
- 2026-09-17 状态 READY_FOR_VALIDATION → FAILED_VALIDATION。
