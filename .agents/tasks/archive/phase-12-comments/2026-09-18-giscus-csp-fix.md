---
state: DONE
date: 2026-09-18
role: Leader（轻量路径：一行配置缺陷，Risk 1）
risk: 1
repair-count: 0
---

# 2026-09-18 Giscus 上线缺陷修复：CSP 漏放行 script-src

## 现象（用户浏览器实测反馈）

文章页评论区显示「评论不可用，不影响文章阅读」——Giscus 组件的 **error 降级分支**文案（非 8s 超时），即浏览器加载 `https://giscus.app/client.js` 即失败。

## 根因

`public/_headers` 的 CSP `script-src 'self' 'unsafe-inline'` **未包含 `https://giscus.app`**——CF Pages 部署 Feature 时设计的 CSP 只为 giscus 预留了 `frame-src`（评论区 iframe），遗漏了 client.js 脚本加载需要 `script-src`。CSP 违规被浏览器静默拒绝 → script 元素 error 事件 → 命中降级文案。网络已排除（curl 实测 giscus.app 200/1.2s）。线上响应头取证确认。

## 修复

`script-src` 追加 `https://giscus.app`（一行）。iframe 内部资源不受本页 CSP 约束，`frame-src` 原有值不变。

## 流程教训（记录）

1. **启用第三方脚本必须复核 CSP**——「启用功能」与「CSP 白名单」分属两个 Feature，衔接处无人检查；
2. 既有验证盲区：Verifier 条款与 Leader 线上复核均为 curl 层（参数/头），**无真实浏览器加载验证**；用户实测是唯一捕获层。后续启用任何前端第三方脚本，验证合同应含「CSP 逐源核对」条款。

## 验证

- 修复后线上响应头 `script-src` 含 `https://giscus.app`（Leader curl）；
- 评论区实际渲染 + 主题切换由用户浏览器复测确认。
