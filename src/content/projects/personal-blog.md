---
title: "linwis-blog 个人博客"
description: "基于 Astro 的静态优先个人技术博客：内容集合建模、本地搜索、Docker 部署与自动化发布。"
status: "active"
featured: true
cover: "/images/projects/personal-blog.svg"
screenshots:
  - "/images/projects/personal-blog.svg"
techStack:
  - Astro
  - TypeScript
  - Tailwind CSS
  - Docker
  - Nginx
github: "https://github.com/linwis/linwis-blog"
startedAt: 2026-07-01
---

你正在看的这个网站就是它。

## 项目背景

写博客的想法放了很久，一直没动手的原因是每次都被「选型 → 搞主题 → 折腾后端」消耗掉热情。这一次先把原则定死：Static First、Content First、不写后端，让写作成本无限低。

## 目标

- 写作路径只有一步：创建 markdown 文件，写，push
- 构建产物纯静态，服务器随时可迁移
- 移动端与桌面端体验一致
- 搜索、评论等动态能力全部作为增强，失败不影响阅读

## 架构

```text
Markdown / MDX
  ↓ Astro Content Collections（schema 校验）
  ↓ astro build
dist/
  ↓ Docker Multi-stage（Nginx 运行时）
  ↓ GitHub Actions 自动部署
国内服务器（docker compose）
```

## 技术决策

| 决策 | 选择 | 放弃的方案 | 原因 |
| --- | --- | --- | --- |
| 框架 | Astro | Next.js | 静态优先、零运行时 JS |
| 部署 | Docker + GHCR | Serverless | 国内访问可控、可迁移 |
| 搜索 | 构建期索引 + 浏览器端 | 外部搜索服务 | 无依赖、够用 |
| 评论 | Giscus | 自建评论系统 | GitHub Discussions 承载数据 |

## 核心挑战

最大的坑是国内访问 GHCR 的网络波动。解决思路是让部署失败永远不影响现网：服务器上始终保留上一个可用镜像，健康检查不过就保持旧版本在线。

## 结果

- 全站构建产物约 200KB JS 以内（大部分页面为 0）
- 单篇文章从创建到上线：一个 git push
- 服务器可在 30 分钟内从零重建（装 Docker → 拉镜像 → 起 compose）

## 未来计划

- [ ] 文章内 LaTeX 支持
- [ ] Newsletter 接入评估
- [ ] 备份镜像仓库（第二 Git Remote）
