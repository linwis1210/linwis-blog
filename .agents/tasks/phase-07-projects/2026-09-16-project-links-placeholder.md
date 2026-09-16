---
state: DONE
date: 2026-09-16
role: Leader（简单工作，轻量路径）
risk: 1
repair-count: 0
---

# 2026-09-16 项目死链占位替换

## 背景

SEO/RSS Feature（archive/phase-13-seo）移交的用户决策项：`dotfiles.md`、`link-checker.md`
两个项目的 github 字段为死链（`linwis` 与 `linwis1210` 账号下均 404）。

## 用户裁决（2026-09-16）

GitHub 账号为 `linwis1210`；两个项目链接**暂时展示**博客仓库 `https://github.com/linwis1210/linwis-blog`，
待各项目仓库建立后替换。

## 变更

- `src/content/projects/dotfiles.md:11`：github → linwis1210/linwis-blog（附注释占位说明）
- `src/content/projects/link-checker.md:12`：同上

## 验证

- `grep -rn "github.com/linwis[^1]" src/ public/` → 零命中（旧账号引用彻底清零）
- format:check / build 通过；线上部署后项目页链接复核

## 后续

项目仓库（dotfiles / link-checker）建立后替换链接——已列入待办，无对应 TASKS 条目。
