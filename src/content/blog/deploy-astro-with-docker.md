---
title: "使用 Docker 部署 Astro 博客"
description: "从 Multi-stage 构建、Nginx 运行时镜像到 docker compose，完整搭建可迁移的 Astro 静态博客部署流程。"
date: 2026-09-03
updated: 2026-09-05
category: "Server"
tags:
  - Docker
  - Astro
  - Nginx
draft: false
featured: true
series: "Docker Deployment"
seriesOrder: 1
project: "personal-blog"
---

最终镜像里只有 Nginx 和 dist/，不运行 Node.js。这是整篇的前提：Astro 负责在构建期把一切变成静态文件，运行时复杂度归零。

## 为什么是 Multi-stage

把构建环境和运行环境分开，镜像体积可以从 1GB+ 降到 50MB 以内。构建阶段需要 Node 和全部依赖，运行阶段只需要一个能吐静态文件的 Nginx。

```dockerfile
# 构建阶段
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段：只有 Nginx + dist/
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

:::note[镜像里没有 .dockerignore 会发生什么]
`COPY . .` 会把 node_modules、.git 一起拷进去，构建上下文可能超过几百 MB。先写 .dockerignore，再谈优化。
:::

## docker compose

生产环境用 compose 管理，回滚也只是换一个 tag 的事：

```yaml
services:
  blog:
    image: ghcr.io/linwis/linwis-blog:latest
    ports:
      - "127.0.0.1:8080:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 2
```

绑定 `127.0.0.1:8080` 而不是 `0.0.0.0`，让宿主机 Nginx 反代对外，Docker 只对内。暴露面越少越好。

## Nginx 静态资源配置

带 hash 的静态资源可以长缓存，HTML 必须不缓存：

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;

    # 带内容 hash 的资源：一年强缓存
    location /_astro/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /health {
        return 200 "ok";
        add_header Content-Type text/plain;
    }

    # HTML 不缓存，保证发布后立即生效
    location / {
        try_files $uri $uri/ $uri/index.html =404;
        add_header Cache-Control "no-cache";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
```

## 缓存策略小结

| 资源类型 | 策略 | 原因 |
| --- | --- | --- |
| `/_astro/*`（带 hash） | `max-age=31536000, immutable` | 内容变了 hash 就变 |
| HTML | `no-cache` | 发布后必须立即可见 |
| sitemap / rss | `max-age=3600` | 允许短暂滞后 |

:::tip
`no-cache` 不是「不缓存」，而是「每次都要问服务器有没有更新」。配合 ETag 使用，命中时返回 304，实际流量很小。
:::

## 验证清单

- [x] `docker build` 本地通过
- [x] 容器启动后 `/health` 返回 200
- [x] 文章页刷新后 HTML 均为 304 / 200，无旧缓存
- [ ] 迁移服务器演练（等正式服务器到位后补）

下一步是把整个链路接到 GitHub Actions 上，见系列下一篇。
