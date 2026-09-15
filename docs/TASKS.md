# linwis_ v1.0 Development Plan

> **状态说明（2026-09-14，Leader 重建）**：仓库仅有单个初始提交，Git 历史无进度信号，此前全部复选框未勾、与实际实现脱节。
> 今日依据磁盘代码证据逐项重建：勾选 = 有实现工件；未勾 = 未实现或仅部分实现（部分项附括号说明）。
> 判定方法与证据索引：`.agents/tasks/_meta/2026-09-14-takeover-reconciliation.md`（归档后位于 `.agents/tasks/archive/_meta/`）。
> 总计：131 / 212 项完成（约 62%）。

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

- [ ] Responsive Image（无 astro:assets `<Image>`/srcset）
- [x] Lazy Loading（运行时 JS 注入 loading=lazy）
- [ ] WebP / AVIF
- [ ] Caption（仅 CSS 预留，无内容使用）
- [x] Lightbox
- [x] Mobile Zoom
- [ ] Article Optional Cover（schema 有字段，文章页未渲染）
- [x] Project Cover
- [ ] Auto OG Image

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
- [x] Giscus（组件完整：懒加载/超时降级/错误降级；当前 `FEATURES.giscus.enabled=false`）
- [x] Lazy Loading
- [ ] Theme Sync（硬编码 preferred_color_scheme，无 postMessage 同步）
- [x] Timeout Fallback
- [x] Error Degradation

## Phase 13 — SEO

- [x] Metadata
- [x] Canonical
- [ ] Open Graph（有 og:title/description/type/url；缺 og:image，og:type 恒为 website）
- [ ] Structured Data
- [ ] Article Schema
- [ ] Breadcrumb
- [x] robots.txt
- [x] sitemap.xml
- [ ] RSS Full Feed（现为摘要输出，无正文）
- [ ] RedirectFrom（schema 有字段，无任何消费者）
- [ ] Google/Bing verification placeholders

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

- [ ] `npm run new:post`
- [ ] `npm run new:project`
- [ ] Slug Suggestion
- [ ] Frontmatter Generation
- [ ] Category Validation
- [ ] Default Draft

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

## Phase 19 — Docker

- [ ] Multi-stage Dockerfile
- [ ] Nginx Runtime
- [ ] Nginx Config
- [ ] Cache Headers
- [ ] Compression
- [ ] Security Headers
- [ ] `/health`
- [ ] docker-compose.yml

## Phase 20 — GHCR

- [ ] GitHub Container Registry
- [ ] latest Tag
- [ ] Version Tag
- [ ] Git SHA Tag
- [ ] Release Workflow

## Phase 21 — Deployment

- [ ] GitHub Actions CD
- [ ] SSH Deployment
- [ ] docker compose pull
- [ ] docker compose up
- [ ] Healthcheck
- [ ] Previous Version Tracking
- [ ] Automatic Rollback

## Phase 22 — Scheduled Publishing

- [ ] Scheduled GitHub Action
- [x] Future Article Filter（构建期 date 过滤已实现）
- [ ] Automatic Rebuild
- [ ] RSS Refresh
- [ ] Sitemap Refresh
- [ ] Search Index Refresh

## Phase 23 — Production

- [ ] Cloudflare DNS
- [ ] China Server DNS Record
- [ ] BaoTa Reverse Proxy
- [ ] HTTPS
- [ ] ICP Filing
- [x] ICP Footer（见 Phase 16 注）
- [ ] Production Smoke Test

## Phase 24 — Performance

- [ ] Lighthouse
- [ ] JS Bundle Review
- [ ] Image Review
- [ ] CLS Check
- [ ] Mobile Performance
- [ ] Third-party Script Audit

Targets:

```text
Performance ≥ 90
Accessibility ≥ 90
Best Practices ≥ 90
SEO ≥ 95
```

## Phase 25 — v1.0 Release

- [ ] Final Regression Test
- [x] README
- [ ] Deployment Guide
- [ ] Content Guide（README「写作」节覆盖基础，无完整指南）
- [ ] Git Tag `v1.0.0`
- [ ] GitHub Release
- [ ] GHCR `v1.0.0`
- [ ] Production Deploy

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
8. Docker 可独立启动。
9. GitHub Actions 可自动部署。
10. 部署失败可回滚。
11. 新服务器可以快速重建。
12. Lighthouse 达到目标。
13. ICP 等正式上线要求处理完成。
14. `v1.0.0` GitHub Release 发布。
