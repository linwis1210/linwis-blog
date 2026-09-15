# linwis_ — Personal Tech Blog

> Build. Learn. Share. — 记录开发、项目与持续学习。

基于 **Astro + TypeScript + Tailwind CSS** 的静态优先个人技术博客。
构建产物为纯静态文件，由 Nginx 直接提供服务，运行时零 Node.js。

## 快速开始

```bash
npm install
npm run dev        # 开发服务器 http://localhost:4321
npm run build      # 产出 dist/
npm run preview    # 本地预览构建产物
```

## 目录结构

```text
src/
├── config/            # 站点/导航/分类/Tag 别名/社交与功能开关
├── content/
│   ├── blog/          # 文章（.md / .mdx），文件名即 slug
│   ├── projects/      # 项目复盘
│   └── snippets/      # v1.0 不公开展示，仅预留模型
├── components/        # Header / SearchDialog / TOC / PostList / Giscus 占位等
├── layouts/           # BaseLayout（主题防闪烁 / 全局脚本）
├── lib/               # 发布过滤 / 阅读时间 / Tag 归一化 / 相关文章加权 / 分页
├── pages/             # 路由
└── styles/global.css  # Design Tokens（明暗双主题）+ 文章排版
```

## 写作

新建文章：在 `src/content/blog/` 创建 `my-post-slug.md`（英文小写连字符文件名即永久 URL `/blog/my-post-slug`，禁止日期/分类前缀）。

Frontmatter 示例（只写实际需要的字段）：

```yaml
---
title: "文章标题"
description: "一句话摘要。"
date: 2026-09-03
updated: 2026-09-05        # 可选
category: "Server"          # 必须在 src/config/categories.ts 中登记
tags: [Docker, Astro]       # 自由填写，自动走别名归一化
draft: false                # true 则完全不构建
featured: true              # 首页/博客页精选
series: "Docker Deployment" # 可选，需配 seriesOrder
seriesOrder: 1
project: "personal-blog"    # 可选，项目页自动聚合相关文章
cover: "/images/blog/x/cover.webp"   # 字段已预留，文章页暂未渲染
redirectFrom: ["/blog/old-url"]      # 字段已预留，重定向暂未生效
---
```

规则速记：

- **draft / 定时发布**：`draft: true` 不构建；`date` 在未来则发布前不可见，配合定时构建自动上线。
- **Category**：单选，集中配置于 `src/config/categories.ts`，schema 校验。
- **Tag**：多选自由输入，别名映射见 `src/config/tagAliases.ts`（如 `JS → JavaScript`）。
- **Markdown 增强**：代码高亮（明暗双主题）、`// [!code highlight]`、diff、copy 按钮、`:::note[标题]` callout、脚注、表格、任务清单、标题锚点。

## 第三方功能开关

Giscus 评论 / GitHub Activity / Analytics 均为渐进增强，失败不影响正文。
统一在 `src/config/social.ts` 的 `FEATURES` 中配置并 `enabled: true`。

## 设计体系

- 极简白净：留白 + 1px 细线，无重阴影；蓝色点缀（`#0071E3` 亮 / `#58A6FF` 暗，见 DESIGN.md §4）
- 主题：Light / Dark / System（默认跟随系统，localStorage 持久化，首帧防闪烁）
- 系统字体栈，不依赖外部字体 CDN
- Mobile First；键盘可访问（搜索 Command Palette `Ctrl/Cmd+K`、focus 可见、Reduced Motion）
- 鼠标特效（轮换制，默认整体关闭）：光标与点击特效各 5 种循环 — 光标：小点 / mono 方块 / 彗星拖尾 /
  「阅读」标签 / Emoji；点击：火花 / 纸屑 / Emoji 爆炸 / 涟漪 / 方块粒子。依 DESIGN.md §23/§24 克制原则
  默认 `enabled: false`；卡片 spotlight 样式已备但当前无卡片挂载。开关在 `src/config/effects.ts`，
  触屏与 reduced-motion 环境自动禁用

## License

代码 MIT；文章与图片等内容 CC BY-NC-SA 4.0（见 `CONTENT_LICENSE.md`）。
