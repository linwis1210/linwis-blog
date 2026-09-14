---
title: "TypeScript 品牌类型与类型收窄笔记"
description: "用品牌类型（Branded Types）让「合法的 string」和「随便的 string」在类型层面区分开，附几个日常收窄技巧。"
date: 2026-08-12
category: "Frontend"
tags:
  - JavaScript
  - TS
draft: false
---

函数签名里满屏的 `string` 是类型系统没发挥作用的信号。这篇记录品牌类型和几个收窄技巧，都是从真实代码里提炼的。

## 品牌类型

slug、category、tag 都是 string，但它们不应该互相赋值：

```ts
type Brand<T, B extends string> = T & { readonly __brand: B };

type Slug = Brand<string, "Slug">;
type Category = Brand<string, "Category">;

function getPost(slug: Slug) { /* ... */ }

const slug = "deploy-astro" as Slug;
getPost(slug);        // ✅
getPost("deploy-astro"); // ❌ 编译报错
```

> 品牌类型的本质是「名义类型化」：结构相同的类型，因为标记字段不同而互不兼容。

## 用判别联合代替布尔参数

```ts
// ❌ 调用处 true 是什么意思？
fetchPosts(true, false);

// ✅ 语义在类型里
type Query =
  | { kind: "published"; now: Date }
  | { kind: "draft" };

fetchPosts({ kind: "published", now: new Date() });
```

[!code highlight] `switch (q.kind)` 时 TS 自动收窄，每个分支拿到自己的形状。

## as 之前的守卫

类型断言之前先写守卫函数，把运行时检查固化下来：

```ts
function isPost(value: unknown): value is Post {
  return typeof value === "object"
    && value !== null
    && "title" in value
    && "date" in value;
}
```

## 收窄清单

- 判别联合 + `switch`，而不是嵌套 `if`
- `in` 操作符检查属性存在
- 数组用 `flatMap` / `filter` + 类型守卫
- `satisfies` 校验常量对象不丢字面量类型

类型系统写得好的标志：重构时编辑器替你把所有遗漏点标红了。
