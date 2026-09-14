---
title: "Cloudflare DNS-Only 模式与国内直连解析"
description: "为什么国内访问场景下 Cloudflare 要关掉代理（小灰云），以及 DNS-Only 模式的正确配置方式。"
date: 2026-07-18
category: "DevOps"
tags:
  - Cloudflare
  - DNS
draft: false
---

服务器在中国大陆时，Cloudflare 的 CDN 代理（橙色云）反而会让流量绕路海外节点。正确姿势是把记录切到 DNS-Only。

## 橙云 vs 灰云

| 模式 | 图标 | 流量路径 | 适用 |
| --- | --- | --- | --- |
| Proxied | 橙云 | 用户 → Cloudflare 边缘 → 源站 | 海外源站 |
| DNS Only | 灰云 | 用户 → 源站直连 | 国内源站 |

灰云模式下 Cloudflare 只做权威 DNS 解析，不做代理、不看内容、不缓存。

## 配置步骤

1. 域名 NS 托管到 Cloudflare
2. A 记录指向服务器 IP，Proxy status 切成 **DNS only**
3. 关闭与代理绑定的功能（CDN 缓存、WAF 在灰云下本来也不生效）
4. HTTPS 证书由源站自己负责（国内服务器用国内 CA 或 Let's Encrypt）

:::warning[备案提醒]
国内服务器 80/443 对外服务需要 ICP 备案，域名解析到未备案 IP 会被运营商拦截。备案完成前先用 hosts 或临时端口自测。
:::

## 验证

```bash
# 灰云：返回源站真实 IP
dig +short linwis.dev

# 橙云：返回 Cloudflare 边缘 IP
dig +short some-proxied-domain.dev
```

解析结果直接是服务器 IP，就说明 DNS-Only 生效了。

## 什么情况下换回橙云

源站迁移到海外、或者愿意接受绕路换 DDoS 防护时。切换只需点一下图标，TTL 到期后全网生效——这也是把 DNS 托管在 Cloudflare 的灵活性所在。
