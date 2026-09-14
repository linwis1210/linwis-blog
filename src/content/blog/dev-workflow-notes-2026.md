---
title: "2026 年我的开发环境与工作流"
description: "终端、编辑器、快捷键与几个提升日常效率的小配置，随手记形式整理。"
date: 2026-07-30
category: "Notes"
tags:
  - Linux
  - Git
  - Notes
draft: false
---

搬家新电脑，顺手把环境整理成清单，下次迁移直接照抄。

## 终端

- Windows Terminal + Git Bash（工作机）/ WSL2（编译重活）
- 字号 13，等宽字体用系统默认，不折腾
- 提示符只保留两行：路径 + git 分支状态

## Git 全局配置

```ini
[init]
    defaultBranch = main
[core]
    editor = code --wait
    autocrlf = input
[alias]
    st = status -sb
    lg = log --oneline --graph --decorate -20
    undo = reset --soft HEAD~1
[push]
    autoSetupRemote = true
```

`git undo` 是使用频率最高的别名——commit 消息写错拆掉重来的场景太多了。

## 编辑器原则

- 不装「提高效率」的插件集，只留格式化、Git、语言服务器
- 保存即格式化，风格争议全部交给 Prettier
- 快捷键只肌肉记忆十个以内：格式化、文件切换、终端、引用重构

## 一些约定

- 提交信息用祈使句：`add search dialog`，不是 `added`
- 分支命名 `feat/search-dialog`，事情做完当天合
- 实验性想法放 `notes/` 目录，别污染正式文档

环境的价值在于「不用想」，任何需要记忆的特殊配置都是未来的坑。
