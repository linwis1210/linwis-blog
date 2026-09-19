# 内容写作指南

面向作者的完整写作参考。快速入口：`npm run new:post`。

## 1. 创建文章

```bash
npm run new:post
# 交互：Title → Slug → Category → Tags → Series(可选) → draft(默认 true)
# 也可全参数：npm run new:post -- --title "标题" --slug my-slug --category AI --tags "A, B"
```

- 文件生成于 `src/content/blog/<slug>.md`，**文件名即永久 URL** `/blog/<slug>`；
- slug 规则：英文小写连字符（手输会自动规范化：大写转小写、空格/下划线折叠）；禁止日期/分类前缀；
- 禁止日期/分类前缀的原因：URL 应稳定不随分类调整变化。

## 2. Frontmatter 参考（只写实际需要的字段）

```yaml
---
title: "文章标题"                # 必填，可中文
description: "一句话摘要"        # 必填：列表/搜索/分享卡摘要
date: 2026-09-18                # 必填：发布日期（未来日期 = 定时发布，到点前不渲染）
category: "AI"                  # 必填：单选，必须在 src/config/categories.ts 登记
tags: [Claude Code, AI Coding]  # 可选：自由填写，自动别名归一化（tagAliases.ts）
draft: true                     # 默认 true：预览/发布前改为 false
featured: false                 # 可选：首页/博客页精选置顶
updated: 2026-09-20             # 可选：实质修订后填写
series: "系列名"                # 可选：需配 seriesOrder（成对出现）
seriesOrder: 1                  # 系列内序号
project: "personal-blog"        # 可选：关联项目，项目页自动聚合
cover: "cover.jpg"              # 可选：封面，见 §4
redirectFrom: ["/blog/old"]     # 可选：旧地址 301（改 slug 时用）
---
```

校验：category 不在清单、series 缺 seriesOrder、slug 重复 → 构建期报错。

## 3. 发布流程

```bash
npm run dev      # localhost:4321 预览（draft:true 的文章不渲染——预览前先改 false）
git add … && git commit -m "post: 标题" && git push
# push 后 2–4 分钟自动上线：文章页 / RSS 全文 / 搜索索引 / sitemap / OG 卡片 / 首页列表
```

## 4. 配图

| 类型 | 图片位置 | frontmatter / md 写法 |
|---|---|---|
| 封面（可选） | `src/assets/blog/<slug>/` | `cover: "cover.jpg"`（自动 AVIF/WebP 响应式 + eager 高优先级） |
| 正文图（推荐） | `src/assets/blog/<slug>/` | `![说明](../../assets/blog/<slug>/xxx.png)` |
| 正文图（备选） | 与 md 同目录 | `![说明](./xxx.png)`——文件名加文章前缀防撞名 |
| 题注 | 同上 | `![说明](路径 "题注文字")` → figure + figcaption |

- 全部自动优化：WebP 副本 + srcset 响应式 + 懒加载（封面额外 AVIF + LCP 优先）；
- 封面写文件名但文件不存在 → 构建期直接报错；
- `/` 开头路径 = `public/` 原样直出（适合 SVG），不走优化。

## 5. Markdown 增强

- 代码块：Shiki 明暗双主题高亮 + 复制按钮；`` ```js `` 标语言；
- 行高亮：行尾注释 `// [!code highlight]`；diff：`// [!code ++]` / `// [!code --]`；
- 提示框：

  ```md
  :::note[标题]
  内容
  :::
  ```
  （类型：note / tip / info / warning / caution，左侧色条区分）
- 脚注 `[^1]`、表格、任务清单 `- [ ]`、标题锚点（悬停显示 #，点击复制）自动可用；
- ⚠️ 表格单元格内的 `|` 需写 `\|`；图片用标准 `![]()` 语法（Obsidian 的 `![[...]]` 不被构建识别，建议在 Obsidian 设置中关闭 Wiki 链接）。

## 6. 分类与标签

- **Category**：单选，集中登记在 `src/config/categories.ts`（含描述）。新增分类：加一条即可，CLI 与校验自动识别；
- **Tag**：多选自由填写，无需预注册；`src/config/tagAliases.ts` 做别名归一（如 `JS → JavaScript`）。标签页自动生成于 `/blog/tag/<slug>/`。

## 7. 定时发布

`date` 写未来时间且 `draft: false` → 构建不渲染，日期到达后的**下一次部署**自动上线。
（当前无自动定时重建，未来日期文章需由一次任意 push 触发上线；定时自动构建见 docs/TASKS.md Phase 22。）

## 8. 关联与系列

- `project: "<project-slug>"`：项目详情页自动聚合该文章（项目文件无需维护反向列表）；
- `series` + `seriesOrder`：文章页展示系列导航；系列只是标签性分组，无需注册。

## 9. 修改与迁移

- 实质修订：更新 `updated` 字段（列表可按更新时间排序）；
- 改 slug：旧地址会 404，务必加 `redirectFrom: ["/blog/旧slug"]`（构建生成 301）；
- 草稿长期保存：`draft: true` 可安全提交入库（不渲染），注意公开仓库中内容本身可见。

## 10. License

文章内容默认 CC BY-NC-SA 4.0（见 `CONTENT_LICENSE.md`）；他人可通过 PR 提交勘误，由你审阅合并。
