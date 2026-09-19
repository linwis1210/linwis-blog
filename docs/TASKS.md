# linwis_ v1.0 Development Plan

> **状态说明（2026-09-14，Leader 重建）**：仓库仅有单个初始提交，Git 历史无进度信号，此前全部复选框未勾、与实际实现脱节。
> 今日依据磁盘代码证据逐项重建：勾选 = 有实现工件；未勾 = 未实现或仅部分实现（部分项附括号说明）。
> 判定方法与证据索引：`.agents/tasks/_meta/2026-09-14-takeover-reconciliation.md`（归档后位于 `.agents/tasks/archive/_meta/`）。
> 总计：167 / 190 项完成（约 88%）。2026-09-19 三次修订：GHCR 发布条目随架构作废。2026-09-17 二次修订：3 项域名绑定条目作废；2026-09-18 Phase 6 图片体系四项完成。
> 2026-09-15 范围修订：Docker / GHCR / CD-SSH 条目作废（Phase 19 重写为 Cloudflare Pages 部署，20/21 置空），总数由 212 调整为 194。

## Phase 0 — Repository

- [x] 创建 GitHub Public Repository（2026-09-15 建立：github.com/linwis1210/linwis-blog，SSH 推送完成；遗留：src/config/site.ts 的 repo 值待同步为 linwis1210/linwis-blog）
- [x] 初始化 Astro + TypeScript
- [x] 配置 Tailwind CSS
- [x] 配置 ESLint
- [x] 配置 Prettier
- [x] 配置 EditorConfig
- [x] 添加 MIT License
- [x] 添加 CONTENT_LICENSE.md
- [x] 建立 README
- [x] 建立 REQUIREMENTS.md
- [x] 建立 ARCHITECTURE.md
- [x] 建立 TASKS.md

## Phase 1 — Foundation

- [x] 建立 Layout 系统
- [x] 建立 Design Tokens
- [x] Accent Color（以蓝 `#0071E3`/`#58A6FF` 实现；2026-09-14 用户裁决 DESIGN.md §4 为权威，修正原「Cyan」表述）
- [x] Light / Dark / System Theme（首帧防闪烁 + localStorage；注：手动选择后无「回到 System」入口）
- [x] Responsive Container
- [x] Typography
- [x] Navigation
- [x] Footer
- [x] Mobile Navigation
- [x] Reduced Motion

## Phase 2 — Content System

- [x] Astro Content Collections
- [x] Blog Schema
- [x] Project Schema
- [x] Snippet Schema 预留
- [x] Category Config
- [x] Tag Normalize
- [x] Draft Filter
- [x] Scheduled Publish Filter
- [ ] Duplicate Slug Validation（无显式校验，仅文件名唯一性隐式保证）

## Phase 3 — Blog

- [x] Blog List
- [x] Pagination
- [x] Featured Posts
- [x] Category Filter
- [x] Tag Filter
- [x] Published Sort
- [x] Updated Sort
- [x] Article Layout
- [x] Reading Time
- [x] Word Count
- [x] Published / Updated Date
- [x] Previous / Next
- [x] Related Posts
- [x] GitHub History Link
- [x] Edit on GitHub

## Phase 4 — Markdown Experience

- [x] Syntax Highlight
- [x] Copy Code
- [ ] Code Filename
- [x] Line Highlight
- [ ] Optional Line Number
- [x] Diff
- [ ] Mermaid
- [ ] LaTeX
- [x] Footnote
- [x] Tables
- [x] Task Lists（GFM 内建）
- [x] Callout
- [x] Heading Anchors
- [ ] Reference Section

## Phase 5 — TOC & Reading UX

- [x] H2/H3 TOC
- [x] Desktop Floating TOC
- [x] Mobile Collapsible TOC
- [x] Smooth Scroll
- [x] Anchor Copy
- [x] Copy Article Link
- [x] Web Share API

## Phase 6 — Images

- [x] Responsive Image（markdown 相对路径自动 srcset；封面 `<Picture>` constrained，2026-09-18）
- [x] Lazy Loading（运行时 JS 注入 loading=lazy）
- [x] WebP / AVIF（sharp 管线：正文图 WebP、封面 AVIF+WebP 双源，2026-09-18）
- [x] Caption（remark-figure：title 属性 → figure+figcaption，2026-09-18）
- [x] Lightbox
- [x] Mobile Zoom
- [x] Article Optional Cover（双模式渲染：assets 优化 / public 回退，2026-09-18）
- [x] Project Cover
- [x] Auto OG Image（satori+sharp 构建期生成 1200×630，2026-09-17）

## Phase 7 — Projects

- [x] Projects Page
- [x] Project Card
- [x] Project Detail
- [x] Active / Completed / Archived
- [x] Featured Project
- [x] GitHub Link
- [x] Demo Link
- [x] Screenshot Gallery
- [x] Related Article Aggregation

## Phase 8 — Taxonomy

- [x] Category Page
- [x] Category Description
- [x] Tag Page
- [x] Archive Page
- [ ] Series Page
- [x] Series Navigation

## Phase 9 — Search

- [x] Local Search Index
- [x] Title Search
- [x] Description Search
- [x] Body Search
- [x] Category Search
- [x] Tag Search
- [ ] Fuzzy Match（现为多关键词子串按序加权，非编辑距离模糊）
- [x] Highlight
- [x] Search Dialog
- [x] Ctrl/Cmd + K
- [x] Keyboard Navigation
- [x] Esc Close

## Phase 10 — Home

- [x] `linwis_` Logo
- [x] Hero
- [x] English Slogan
- [x] Chinese Subtitle（index.astro 硬编码；site.ts 的 subtitle 字段未被使用）
- [x] GitHub CTA
- [x] Blog CTA
- [x] Projects CTA
- [x] Featured Projects
- [x] Latest Posts
- [x] GitHub Activity（组件完整：超时+失败移除；当前 `FEATURES.githubActivity.enabled=false`）
- [x] Lightweight Motion

## Phase 11 — About

- [ ] Avatar（现为「L_」文字占位块）
- [x] Personal Introduction
- [x] Technology Stack Groups
- [ ] Projects
- [x] Blog Motivation
- [ ] Interests
- [x] GitHub
- [x] Email

## Phase 12 — Comments

- [x] GitHub Discussions（giscus pathname mapping）
- [x] Giscus（已启用：真实仓库配置 + pathname + Announcements + zh-CN，2026-09-18 上线）
- [x] Lazy Loading
- [x] Theme Sync（初始取站点解析主题 + postMessage 切换同步 + System 媒体监听，2026-09-18）
- [x] Timeout Fallback
- [x] Error Degradation

## Phase 13 — SEO

- [x] Metadata
- [x] Canonical
- [x] Open Graph（og:type 动态 + og:image 自动生成齐备，2026-09-17）
- [x] Structured Data
- [x] Article Schema
- [x] Breadcrumb
- [x] robots.txt
- [x] sitemap.xml
- [x] RSS Full Feed（content:encoded 全文输出，2026-09-16）
- [x] RedirectFrom（构建时生成 `dist/_redirects` 301；线上首篇文章使用后自然生效）
- [x] Google/Bing verification placeholders（site.ts 空占位，填值即输出）

## Phase 14 — PWA

- [ ] Web Manifest
- [ ] App Icons
- [ ] Service Worker
- [ ] Static Cache
- [ ] Basic Offline Reading
- [ ] Update Strategy

## Phase 15 — Analytics

- [x] Analytics Adapter
- [x] Provider Config
- [x] Lazy Load
- [ ] Low-cookie Strategy（仅选型注释，未启用运行）
- [x] Privacy Documentation

## Phase 16 — Legal

- [x] Privacy Page
- [x] Terms Page
- [x] MIT License
- [x] CC BY-NC-SA 4.0 Content Notice
- [x] ICP Footer Placeholder（渲染逻辑已备，site.ts 值为空待备案后填）

## Phase 17 — Content CLI

- [x] `npm run new:post`（2026-09-17）
- [x] `npm run new:project`（2026-09-17）
- [x] Slug Suggestion
- [x] Frontmatter Generation
- [x] Category Validation（动态读 categories.ts）
- [x] Default Draft

## Phase 18 — CI

- [x] GitHub Actions
- [x] Install
- [x] Format Check
- [x] Lint
- [x] Type Check
- [ ] Content Validation
- [ ] Unit Tests
- [x] Astro Build
- [ ] Broken Link Check
- [ ] Playwright Smoke Test

## Phase 19 — Deployment（Cloudflare Pages）

> 2026-09-15 修订：部署目标由「中国服务器 + BaoTa + Docker」变更为 Cloudflare Pages（用户决策，大陆延迟权衡已知悉）。
> 原 Phase 19（Docker）/ Phase 20（GHCR）/ Phase 21（CD-SSH）条目全部作废（Git 历史可查），由本阶段取代。

- [x] `public/_headers`：安全头 + 缓存策略
- [x] `_redirects` 生成（frontmatter `redirectFrom` → 301，构建时）
- [x] 部署通道：CF Pages Git 集成自动构建，质量门内嵌于 CF 构建命令（原 wrangler 方案作废，2026-09-16）
- [x] Cloudflare Pages 项目与构建设置（用户完成；Secrets 路径随 Git 集成作废）
- [x] pages.dev 线上冒烟（2026-09-16 通过：六安全头零重复 / 资产 immutable / 404 正常）
- [ ] 定时重建（移至 Phase 22，Deploy Hook 方案实施）
- [ ] 回滚演练（Pages 历史版本回滚）
- ~~自定义域名绑定~~（N/A：2026-09-17 用户裁决以 linwis.pages.dev 为最终域名）

## Phase 20 — ~~GHCR~~（obsolete）

> 2026-09-15 随 Docker 方案作废，无条目。

## Phase 21 — ~~Deployment（CD-SSH）~~（obsolete）

> 2026-09-15 并入 Phase 19（Cloudflare Pages），无条目。

## Phase 22 — Scheduled Publishing

- [ ] 每日定时重建触发（CF Deploy Hook，方案定于 2026-09-16）
- [x] Future Article Filter（构建期 date 过滤已实现）
- [ ] Automatic Rebuild（hook 触发 CF 重建部署）
- [ ] RSS / Sitemap / Search Index 随部署刷新（线上验证一次）

## Phase 23 — Production（2026-09-15 修订）

> ICP 备案与宝塔反代随 CF 全球部署作废；ICP Footer 逻辑保留但无预期用途。

- ~~Cloudflare DNS 托管与解析确认~~（N/A：同上，pages.dev 由 CF 直接服务）
- ~~自定义域 HTTPS~~（N/A：pages.dev 自带 CF HTTPS）
- [ ] Production Smoke Test

## Phase 24 — Performance

- [x] Lighthouse（线上基线+修复+终验，2026-09-19）
- [x] JS Bundle Review（TBT=0ms 全页次；script 计数多轮冻结）
- [x] Image Review（responsive-images 修复：封面 1035w 档）
- [x] CLS Check（全部页次 0.000）
- [x] Mobile Performance（97–100；跨境 RTT 波动已记录为环境属性）
- [x] Third-party Script Audit（giscus 懒加载+preconnect+CSP 合规；Activity/Analytics 关闭态）

Targets:

```text
Performance ≥ 90
Accessibility ≥ 90
Best Practices ≥ 90
SEO ≥ 95
```

## Phase 25 — v1.0 Release

- [x] Final Regression Test（2026-09-19 全页扫 17 端点全绿；发现并修复 tag 页 404）
- [x] README
- [x] Deployment Guide（docs/DEPLOYMENT.md）
- [x] Content Guide（docs/CONTENT.md 完整指南）
- [x] Git Tag `v1.0.0`
- [x] GitHub Release（2026-09-19 用户发布：github.com/linwis1210/linwis-blog/releases/tag/v1.0.0）
- ~~GHCR `v1.0.0`~~（N/A：无 Docker，CF Pages 连续部署）
- [x] Production Deploy（连续部署：tag 所指 commit 已在线上）

# v2 Roadmap

## AI

- [ ] AI Article Summary
- [ ] Ask This Article
- [ ] Semantic Search
- [ ] Global Blog Q&A
- [ ] AI Related Posts
- [ ] Automatic Translation / English Summary

## Content

- [ ] Enable Snippets
- [ ] Newsletter
- [ ] Optional English Content
- [ ] Advanced Search

## Platform

- [ ] Online Preview Environment
- [ ] Secondary Git Backup
- [ ] More Advanced Analytics

# Definition of Done — v1.0

v1.0 可以正式发布的条件：

1. 首页、Blog、Projects、Archive、About 正常。
2. Markdown/MDX 写作体验完整。
3. 搜索与 Command Palette 正常。
4. 手机端体验完整。
5. SEO / RSS / Sitemap 正常。
6. Giscus 可用且失败不影响正文。
7. CI 全部通过。
8. Cloudflare Pages 部署成功且线上可访问。
9. GitHub Actions 可自动部署。
10. 部署失败可回滚（Pages 历史版本）。
11. 部署不依赖特定服务器（仓库 + CF 配置即可重建）。
12. Lighthouse 达到目标。
13. 自定义域名绑定完成（ICP 不再适用）。
14. `v1.0.0` GitHub Release 发布。
