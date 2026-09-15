# linwis_ Personal Tech Blog — v1.0 Requirements

## 1. Product Positioning

`linwis_` 是一个面向开发者的个人技术博客与作品集网站，同时承担：

- 个人技术知识沉淀
- 对外技术内容输出
- Developer Portfolio
- 项目展示
- 个人技术品牌建设

核心原则：

> Content First. Static First. Progressive Enhancement.

即：

- 内容优先于视觉效果
- 静态页面优先于运行时动态
- 动态能力作为增强功能加入
- 不为“工程化”而过度工程化
- 降低长期写作和维护成本

## 2. Brand

站点品牌：`linwis_`

视觉方向：

- Modern
- Minimal
- Light Tech
- Developer-oriented

Accent Color：蓝 `#0071E3`（亮）/ `#58A6FF`（暗），以 `DESIGN.md` §4 为权威，不引入第二品牌 accent。（2026-09-14 用户裁决，修正早期「Cyan」表述）

首页 Logo：`linwis_`

Hero 结构：英文主 Slogan + 中文副标题。

示例：

> Build. Learn. Share.  
> 记录开发、项目与持续学习。

首页不使用真人头像作为主视觉。真人头像主要展示于 About 页面。

## 3. Language

主要语言：中文。

技术术语自然保留英文，例如：

- Docker
- Astro
- API
- CI/CD
- GitHub Actions

导航采用英文：

- Home
- Blog
- Projects
- Archive
- About

阅读相关 UI 使用中文，例如：

- 发布时间
- 更新于
- 阅读时间
- 相关文章
- 上一篇
- 下一篇

v1.0 不实现完整 i18n。

## 4. Main Pages

### Home

首页包含：

- Hero
- Developer ID
- Slogan
- GitHub 入口
- Blog 入口
- Projects 入口
- Featured Projects
- Latest Posts
- GitHub Activity
- Footer

不包含：

- Now 页面
- Currently Building
- 复杂 Timeline

### Blog

路径：`/blog`

包含：

- Featured Posts
- 最新文章
- Category 筛选
- Tag 筛选
- 发布时间排序
- 更新时间排序
- 分页

默认每页：10–12 篇文章。

禁止无限滚动。

### Article

路径：`/blog/{slug}`

文章页面包含：

- Title
- Description
- Category
- Tags
- Published Date
- Updated Date
- Reading Time
- Word Count
- TOC
- Article Content
- Series Navigation
- Related Posts
- Previous / Next
- Copy Link
- Native Share
- View on GitHub
- Edit on GitHub
- Giscus Comments

桌面：正文 + 右侧 TOC。

移动端：TOC 折叠。

TOC 默认仅显示：

- H2
- H3

## 5. Content Format

默认文章：`.md`

需要交互组件时：`.mdx`

Markdown 支持：

- Syntax Highlight
- Code Copy
- Code Title
- Optional Line Numbers
- Highlight Lines
- Diff
- Mermaid
- LaTeX
- Footnotes
- Tables
- Task Lists
- Callout
- Blockquote
- Image Caption
- Heading Anchors
- References

代码块行号默认关闭。

## 6. Article Frontmatter

建议结构：

```yaml
---
title: "使用 Docker 部署 Astro 博客"
slug: "deploy-astro-with-docker"
description: "从 GitHub Actions、GHCR 到 Nginx，完整搭建可迁移的 Astro Docker 部署流程。"
date: 2026-09-03
updated: 2026-09-03
category: "Server"
tags:
  - Docker
  - Astro
  - Nginx
draft: true
featured: false
series: "Docker Deployment"
seriesOrder: 1
project: "personal-blog"
cover: "/images/blog/example/cover.webp"
redirectFrom:
  - "/blog/old-slug"
---
```

其中只有实际需要的字段才填写。

## 7. Draft System

仅使用：

```yaml
draft: true
```

和：

```yaml
draft: false
```

不增加额外：

- published
- status

需要注意：公开 GitHub Repository 中的 Draft 文件仍然是公开可见的。

因此：

> 真正不希望公开的内容不得提交到 Public Repository。

## 8. Scheduled Publishing

支持未来发布时间。

例如：

```yaml
date: 2026-09-10
draft: false
```

在日期到达之前：

- 不出现在 Blog
- 不出现在首页
- 不进入搜索
- 不进入 RSS
- 不进入 Sitemap

GitHub Actions 定时触发构建，实现自动上线。

## 9. Category

Category：

- 单选
- 一级目录
- 用户自行配置
- 不在代码中写死

Category 采用集中配置。

CI 检查 Category 是否存在。

不支持：

- Nested Category
- 多级分类

## 10. Tags

Tag：

- 多选
- 自由输入
- 不需要预注册

支持 Tag Alias / Normalize。

例如：

```ts
{
  JS: "JavaScript",
  Javascript: "JavaScript",
  CICD: "CI/CD"
}
```

## 11. Series

支持轻量 Series。

用于连续技术教程。

支持：

```yaml
series: "Docker Deployment"
seriesOrder: 3
```

文章页自动展示系列导航。

## 12. Projects

路径：`/projects`

每个项目有独立页面：`/projects/{slug}`

项目详情页采用：作品集 + 技术复盘

结构包括：

- 项目简介
- Cover
- Screenshots
- Tech Stack
- GitHub
- Demo
- Project Status
- 项目背景
- Goals
- Architecture
- Technical Decisions
- Core Challenges
- Problems & Solutions
- Result
- Future Plans
- Related Posts

项目状态：

- Active
- Completed
- Archived

GitHub URL：可选。

Demo URL：可选。

精选项目：

```yaml
featured: true
```

首页展示约 3–6 个 Featured Projects。

## 13. Project / Article Relationship

由文章声明所属项目：

```yaml
project: "personal-blog"
```

项目详情页自动聚合相关文章。

项目文件不需要维护 relatedPosts。

## 14. Archive

路径：`/archive`

按照年份和月份组织文章。

示例：

```text
2026

September
- Article A
- Article B

August
- Article C
```

## 15. Search

实现：本地全文搜索。

无需数据库。

搜索范围：

- Title
- Description
- Body
- Category
- Tags
- Projects

支持：

- Fuzzy Search
- Highlight
- Keyboard Navigation
- Enter Open
- Esc Close

提供普通搜索按钮，以及 `Ctrl/Cmd + K` Command Palette。

## 16. Recommendations

相关文章采用：Category + Tag Weighted Matching。

v1.0 不使用：

- Embedding
- Vector Database
- AI Recommendation

## 17. Comments

采用：Giscus。

数据存储：GitHub Discussions。

要求：

- Lazy Load
- 不阻塞正文
- 加载失败时优雅降级
- 中国大陆网络访问异常不能影响文章阅读

## 18. Analytics

采用轻量统计方案。

需要支持：

- Page Views
- Popular Pages
- Referral
- Device
- Basic Region

优先：

- Low-cookie
- Cookie-free

统计能力通过配置开关控制。

## 19. RSS

提供：`/rss.xml`

RSS 输出完整文章正文。

Draft 和未来文章不进入 RSS。

## 20. SEO

v1.0 需要完整基础 SEO。

包括：

- Title
- Description
- Canonical
- Open Graph
- Twitter/OpenGraph Metadata
- Structured Data
- Article Schema
- Breadcrumb
- Sitemap
- robots.txt
- RSS
- Category Page
- Tag Page

URL 采用：

```text
/blog/deploy-astro-with-docker
```

禁止：

```text
/blog/2026/09/...
```

以及：

```text
/blog/devops/...
```

Slug 应保持稳定。

## 21. Redirect

支持：

```yaml
redirectFrom:
  - /blog/old-url
```

用于旧 URL 301 Redirect。

## 22. Images

图片跟随 Git Repository。

不使用独立图床作为 v1.0 默认方案。

支持：

- Lazy Load
- Responsive Image
- WebP / AVIF Optimization
- Caption
- Lightbox
- Zoom
- Mobile Gesture
- 多图切换

文章 Cover：可选。

项目 Cover：建议填写。

OG Image：自动生成。

## 23. Theme

支持：

- Light
- Dark
- System

默认：System。

用户选择使用 localStorage 保存。

要求避免：FOUC / Theme Flash。

代码主题、Mermaid 和 Giscus 尽可能同步主题。

## 24. Responsive Design

Mobile First。

手机端与桌面端同等优先。

重点保证：

- Navigation
- Code Block
- Tables
- Mermaid
- Search
- TOC
- Images
- Lightbox

## 25. PWA

支持基础 PWA。

包括：

- Add to Home Screen
- Manifest
- Icons
- Static Asset Cache
- 部分访问过页面离线阅读

v1.0 不做：

- Full Offline Search
- Full Content Prefetch
- Complex Offline Sync

## 26. Accessibility

Accessibility 为 v1.0 验收标准。

包括：

- Semantic HTML
- Keyboard Navigation
- Focus State
- Color Contrast
- alt
- Reduced Motion
- Accessible Dialog
- Accessible Command Palette

## 27. Performance

目标：

- Lighthouse Performance ≥ 90
- Accessibility ≥ 90
- Best Practices ≥ 90
- SEO ≥ 95

原则：

- Minimum JavaScript
- Third-party scripts lazy loading
- Static-first rendering
- Image optimization
- Avoid layout shift
- Avoid blocking animation

## 28. Fonts

优先：System Font Stack。

代码使用：Monospace Font Stack。

v1.0 不依赖 Google Fonts 等外部字体 CDN。

## 29. External Links

站内：当前标签页打开。

站外：新标签页打开。

增加：

```html
rel="noopener noreferrer"
```

并提供轻量外链 Icon。

## 30. Sharing

支持：

- Copy Article Link
- Copy Heading Anchor
- Web Share API

不提供大量平台分享按钮。

## 31. 404

自定义 404 页面。

包括：

- Home
- Blog
- Search
- Latest Posts
- Command Palette

视觉保持 `linwis_` 风格。

## 32. Privacy / Terms

提供：

- `/privacy`
- `/terms`

Footer 包含：

- Privacy
- Terms
- RSS
- GitHub

## 33. Contact

通过 About 或 Contact 提供：

- GitHub
- Email
- Social Links

v1.0 不提供 Contact Form。

## 34. Newsletter

v1.0：仅预留 UI / 接口位置。

不接入实际 Newsletter 服务。

## 35. AI

v1.0：不提供 AI 功能。

v2 候选：

- AI Article Summary
- Ask This Article
- AI Semantic Search
- AI Recommendation
- Global Blog Q&A
- Automatic Translation

## 36. Snippets

底层内容模型预留 Snippets。

v1.0：不展示 Snippets 栏目。

## 37. Repository

GitHub Repository：Public。

源码公开。

## 38. Licensing

代码：MIT License。

文章、图片、内容：CC BY-NC-SA 4.0。

仓库需要明确区分：

```text
LICENSE
CONTENT_LICENSE.md
```

## 39. China Deployment

主要访问用户：中国大陆。

服务器：中国大陆。

域名：后续购买（截至 2026-09-15 尚未确定；`astro.config.mjs` 的 `site` 为占位值 `https://linwis.dev`，域名确定后需统一替换，影响 canonical / RSS / sitemap 输出）。

DNS：Cloudflare 托管。

普通 Cloudflare CDN 不作为默认大陆访问路径。

正式上线：完成 ICP 备案后使用正式域名。

## 40. v1.0 Out of Scope

明确不做：

- Database
- User Login
- User Account
- Favorites
- Personalized Feed
- Private Notes
- CMS Backend
- Nested Category
- AI
- Full i18n
- Complex Analytics
- Infinite Scroll
- Advanced Offline Mode
- Article Difficulty
- Prerequisites Schema
- Outdated Article Warning
- Now Page
- Complex Changelog Page
