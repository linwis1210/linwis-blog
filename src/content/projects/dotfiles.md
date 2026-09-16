---
title: "dotfiles 个人配置仓库"
description: "终端、编辑器与 Git 的个人配置集合：新机器 15 分钟恢复熟悉环境。"
status: "completed"
cover: "/images/projects/dotfiles.svg"
screenshots:
  - "/images/projects/dotfiles.svg"
techStack:
  - Shell
  - Git
github: "https://github.com/linwis1210/linwis-blog" # 临时展示占位，项目仓库建立后替换
startedAt: 2025-11-20
---

一套让新电脑快速变成「自己的电脑」的配置集合。

## 项目背景

每年都要重装或新配机器，手动调环境的重复劳动太多了。原则：配置文件进 Git，一条脚本完成软链。

## 目标

- `install.sh` 一键完成全部软链与依赖安装
- 配置按工具分目录，互不纠缠
- 不引入 Zsh 框架，保持 bash 原生

## 结构

```text
dotfiles/
├── git/gitconfig
├── editor/
├── terminal/
└── install.sh
```

## 技术决策

- 软链而非复制：改完配置 push 即备份
- 机器差异用 `*.local` 文件覆盖，主配置保持通用
- 不做跨平台抽象——就是给 Windows + Linux 用的

## 结果

新机器恢复时间从半天缩短到 15 分钟，主要是依赖安装的网络时间。

## 未来计划

已归档为稳定状态，只有换机器时才可能更新。
