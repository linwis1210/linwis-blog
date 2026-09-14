---
title: "Docker 容器网络排查手记"
description: "bridge 网络下容器互访、端口映射与 DNS 解析问题的一次完整排查记录。"
date: 2026-06-25
category: "Server"
tags:
  - Docker
  - Linux
draft: true
---

最近一次容器之间连不上的排查记录，先记下来，之后整理成正式文章。

## 现象

- 宿主机 `curl 127.0.0.1:8080` 正常
- 另一个容器里 `curl blog:8080` 解析失败
- compose 内服务名互访正常，单独 `docker run` 的容器不行

## 排查过程

```bash
# 看容器在哪些网络里
docker inspect blog --format '{{json .NetworkSettings.Networks}}'

# 单独运行的容器在默认 bridge，compose 的服务在自定义 bridge
docker network ls
```

原因：默认 bridge 没有 DNS，只有自定义网络才提供按服务名解析。

## 解决

要么都放进同一个 compose 项目，要么手动：

```bash
docker network create blognet
docker run --network blognet --name blog ...
```

## 待整理

- [ ] 端口映射 127.0.0.1 vs 0.0.0.0 的区别
- [ ] 容器访问宿主机服务的几种方式（host.docker.internal 等）
- [ ] MTU 问题导致的偶发超时
