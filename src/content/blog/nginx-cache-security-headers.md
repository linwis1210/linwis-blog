---
title: "Nginx 缓存与安全响应头配置笔记"
description: "静态博客的 Nginx 安全基线：CSP、HSTS、缓存分层与压缩，附一份可直接抄的配置。"
date: 2026-09-05
category: "Server"
tags:
  - Nginx
  - Linux
draft: false
series: "Docker Deployment"
seriesOrder: 3
project: "personal-blog"
---

静态站的安全配置其实很短，难的是知道哪些头该配、哪些值会弄坏自己的站。这篇是配置笔记，按头逐个记录。

## 安全响应头基线

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

注意 `always`：不加上，4xx/5xx 响应不会带头，而错误页恰恰最容易被扫描器利用。

## CSP：从 Report-Only 开始

CSP 配错会直接弄坏页面里的第三方脚本（评论、统计），建议先观察两周再切强制模式：

```nginx
# 第一阶段：只报告，不拦截
add_header Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self' https://giscus.app; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src https://giscus.app" always;
```

[!code highlight] `style-src` 需要 `unsafe-inline`，因为 Astro 的主题防闪烁脚本会内联写入 class，Shiki 也会内联少量样式。

## 压缩与缓存分层

```nginx
gzip on;
gzip_comp_level 5;
gzip_min_length 1024;
gzip_types text/css application/javascript application/json image/svg+xml text/xml;

# 带 hash 的静态资源：一年
location /_astro/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# HTML：协商缓存
location / {
    add_header Cache-Control "no-cache";
}
```

## 用 diff 记录一次配置变更

```diff
- add_header X-Frame-Options "DENY" always;
+ add_header X-Frame-Options "SAMEORIGIN" always;
```

`DENY` 会连自己的 iframe 预览一起拒绝，改回 `SAMEORIGIN`。

## 验证方式

配置完用 `curl -I` 逐个头检查，再跑一遍 [securityheaders.com](https://securityheaders.com) 拿个评分。安全头不是玄学，是可验证的清单。
