---
title: "Tailwind CSS v4 的 Design Tokens 实践"
description: "用 CSS 变量 + @theme 管理明暗双主题的设计令牌，告别无意义的工具类堆砌。"
date: 2026-08-20
category: "Frontend"
tags:
  - Tailwind CSS
  - CSS
draft: false
---

v4 最大的变化是把配置从 JS 搬回了 CSS。主题即变量，变量即令牌，这件事值得单独写一篇。

## 令牌先行

先在 `:root` 和 `.dark` 定义语义变量，再映射进 `@theme`：

```css
:root {
  --bg: #fafafa;
  --fg: #1b1b1f;
  --accent: #0e7490;
}

.dark {
  --bg: #131316;
  --fg: #e8e8ec;
  --accent: #22d3ee;
}

@theme inline {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-accent: var(--accent);
}
```

[!code highlight] 之后 `bg-bg`、`text-fg`、`text-accent` 这些工具类自动跟随主题切换，组件里一个 `dark:` 前缀都不用写。

## 语义色 vs 原色

直接用 `text-cyan-600` 是把调色板泄漏到业务代码里。语义令牌（`--fg`、`--muted`、`--line`）让「换主题」「换品牌色」变成只改一个文件的事。

:::tip[检查对比度]
浅色模式的 accent 文字建议取 cyan-700 级别（#0e7490），cyan-500 在白底上对比度不达标。深色模式反过来用 cyan-400。
:::

## 字体栈不引外部 CDN

系统字体栈对中文博客是最优解：

```css
--font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI",
  "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
```

省掉 WebFont 的几百 KB 和 FOUT，代价是不同系统字形略有差异——可以接受。

## 小结

- 令牌定义在 CSS，映射用 `@theme inline`
- 组件只使用语义类名，不出现原色类名
- 深色模式切换只动 `:root` 级变量，组件零感知
