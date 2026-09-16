---
title: "link-checker 站内链接检查器"
description: "给静态博客写的死链检查 CLI：递归爬取构建产物，校验内部锚点与外链可达性。"
status: "completed"
featured: true
cover: "/images/projects/link-checker.svg"
screenshots:
  - "/images/projects/link-checker.svg"
techStack:
  - Node.js
  - TypeScript
github: "https://github.com/linwis1210/linwis-blog" # 临时展示占位，项目仓库建立后替换
startedAt: 2026-06-10
---

为博客 CI 服务的内部工具：构建完成后扫描 dist/，把坏链接拦在部署之前。

## 项目背景

写文章时引用旧文、改 slug、删页面都会产生死链，人工检查不现实。需求很收敛：只查站内 HTML 产物的链接与锚点，外加可选的外链探活。

## 目标

- 输入一个 dist 目录，输出全部坏链清单
- 支持 `#anchor` 校验（标题 id 对不上也算错）
- 外链检查并发受限、可跳过指定域名
- 退出码非零即 CI 失败

## 架构

```text
dist/**/*.html
  ↓ 解析 <a href> / <img src>
  ↓ 内部链接 → 文件系统直查 + 锚点比对
  ↓ 外部链接 → 受限并发 HEAD 请求
报告（stdout + exit code）
```

## 技术决策

- 不做浏览器渲染，用轻量 HTML 解析——静态产物不需要执行 JS
- 外链检查默认只发 HEAD，4xx/5xx 记录但不区分「临时故障」
- 忽略列表走 `.linkcheckerrc`，域名级配置

## 核心挑战

锚点校验要处理 rehype-slug 生成 id 的规则（重名标题自动加后缀）。直接复用同一套 slug 函数，而不是猜格式。

## 结果

- 已并入博客 CI，跑一次 < 10 秒
- 上线当天就抓出 3 处改 slug 造成的死链

## 未来计划

项目完成，随博客 CI 长期维护。如果需要，会加 sitemap 全量比对模式。
