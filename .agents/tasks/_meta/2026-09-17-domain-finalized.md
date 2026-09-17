---
state: DONE
date: 2026-09-17
role: Leader（轻量路径：用户指定的配置值替换，Risk 1）
risk: 1
repair-count: 0
---

# 2026-09-17 域名落定 + 推送纪律

## 用户指令（2026-09-17）

1. **推送纪律**：此前推送过于频繁；今后**任何 push 须经用户确认**。已写入 `AGENTS.md`「Git Push Policy」。
2. **域名落定**：`https://linwis.pages.dev/` 为最终域名（不购买自定义域）。

## 变更（域名对齐，占位 linwis.dev → linwis.pages.dev）

- `astro.config.mjs` site（canonical / RSS / sitemap 的根）
- `src/config/site.ts` url（og:image 绝对 URL 与 og 图内域名小字经 SITE.url 自动联动）
- `src/components/Analytics.astro` data-domain（Plausible 占位，功能未启用）
- `public/robots.txt` Sitemap 行（静态文件，此前 grep 覆盖遗漏）

保留不动：`social.ts` 邮箱 `hi@linwis.dev`（用户地址非站点 URL）；文章 `cloudflare-dns-only-setup.md` 内的 linwis.dev 为行文内容不属配置（如需改写由用户定）。

## 验证

- 代码引用 `grep -rn "linwis\.dev" src/ astro.config.mjs`（排除邮箱）→ 零命中
- `npm run build` exit 0；dist 抽查：首页 canonical/og 均为 `https://linwis.pages.dev/...`；rss.xml 8 item、sitemap-0 均用新域
- format:check /（lint / typecheck 随 CI）

## 文档联动

REQUIREMENTS §39 域名段落改写；TASKS 3 项域名条目作废（149/191，约 78%）。

## 后续

待用户确认后 push；推送触发 CF 部署，线上复核 canonical / rss / sitemap / og 绝对 URL。
