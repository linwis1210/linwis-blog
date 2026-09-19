# linwis_ — Personal Tech Blog

> Build. Learn. Share. — 记录开发、项目与持续学习。

基于 **Astro 5 + TypeScript + Tailwind CSS 4** 的静态优先个人技术博客。
构建产物为纯静态文件，部署于 Cloudflare Pages（[linwis.pages.dev](https://linwis.pages.dev)），运行时零 Node.js。
当前版本 **v1.0.0**。

## 功能一览

- 完整内容系统：文章 / 项目复盘 / 分类 / 标签 / 系列 / 归档，内置内容 CLI 脚手架
- 阅读体验：本地搜索（`Ctrl/Cmd+K`）、明暗主题（评论同步切换）、TOC、代码高亮与题注、Giscus 评论
- 自动化：OG 分享卡生成、响应式图片管线（AVIF/WebP + srcset）、RSS 全文、sitemap、结构化数据
- 工程：CI 质量门 + CF Pages 内嵌构建门、安全响应头（CSP 等）、Lighthouse 全项达标

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
├── assets/            # 构建期优化资产：fonts/（OG 字体）+ blog/<slug>/（文章封面与配图）
├── config/            # 站点/导航/分类/Tag 别名/社交与功能开关
├── content/
│   ├── blog/          # 文章（.md / .mdx），文件名即 slug
│   ├── projects/      # 项目复盘
│   └── snippets/      # v1.0 不公开展示，仅预留模型
├── components/        # Header / SearchDialog / TOC / Giscus / CursorEffects 等
├── layouts/           # BaseLayout（SEO / 主题防闪烁 / 全局脚本）
├── lib/               # 发布过滤 / 阅读时间 / Tag 归一化 / 相关文章加权 / OG 渲染
├── pages/             # 路由（含 rss.xml / search-index.json / og/*.png / _redirects 生成）
└── styles/global.css  # Design Tokens（明暗双主题）+ 文章排版
scripts/               # 内容 CLI（new:post / new:project）
docs/                  # 内容写作指南（CONTENT.md）与部署指南（DEPLOYMENT.md）
public/                # 原样直出：_headers（安全与缓存头）/ robots.txt / 项目 SVG 封面
```

## 写作

```bash
npm run new:post     # 文章脚手架：Title → Slug 建议 → Category 校验 → Tags → 默认 draft: true
npm run new:project  # 项目复盘脚手架
npm run dev          # 写作预览（draft: true 的文章不渲染，预览前先改为 false）
```

**完整写作参考见 [docs/CONTENT.md](docs/CONTENT.md)**：frontmatter 全字段、封面与配图（自动 AVIF/WebP 响应式）、Markdown 增强（代码高亮 / diff / 题注 / callout / 脚注）、定时发布、系列与项目关联。

速记：

- 永久 URL 即文件名：`my-post-slug.md` → `/blog/my-post-slug`（英文小写连字符，禁止日期/分类前缀）；
- 分类单选，集中登记于 `src/config/categories.ts`（当前：Server / Frontend / DevOps / AI / Notes）；标签自由填写，别名归一化见 `src/config/tagAliases.ts`；
- 改 slug 记得 `redirectFrom`（自动生成 301）。

## 第三方功能开关

`src/config/social.ts` 的 `FEATURES` 统一控制，全部为渐进增强，失败不影响正文：

| 功能                              | 状态                                              |
| --------------------------------- | ------------------------------------------------- |
| Giscus 评论（GitHub Discussions） | **已启用**（pathname 映射，主题跟随站内明暗切换） |
| GitHub Activity（首页）           | 关闭，组件就绪                                    |
| Analytics（Umami / Plausible）    | 关闭，适配器就绪                                  |

## 部署（Cloudflare Pages）

push 到 `main` 即自动构建上线（[linwis.pages.dev](https://linwis.pages.dev)），无需部署 Secrets：

- GitHub Actions 质量门（format / lint / typecheck / build）与 CF 构建并行；**质量门同时内嵌于 CF 构建命令**，任何检查不过即不部署；
- 安全与缓存响应头在 `public/_headers`；`redirectFrom` 构建时生成 301；回滚在 Pages Dashboard 一键完成。

完整细节（首次部署 / 新账号重建 / 版本发布 / 故障排查）见 **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**。

## 设计与性能

- 设计体系「Quiet Engineering」（[DESIGN.md](DESIGN.md)）：极简白净、留白 + 1px 细线、蓝色点缀（`#0071E3` 亮 / `#58A6FF` 暗）、系统字体栈、Mobile First、键盘可访问、Reduced Motion；
- 性能基线（Lighthouse，线上实测）：Performance 97 / Accessibility 96 / Best Practices 100 / SEO 100，CLS 与 TBT 为 0。

## License

代码 MIT；文章与图片等内容 CC BY-NC-SA 4.0（见 `CONTENT_LICENSE.md`）。
