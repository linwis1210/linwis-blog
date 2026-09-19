# 部署指南（Cloudflare Pages）

站点以 **Cloudflare Pages Git 集成**部署：push 到 `main` 即自动构建上线，无部署 Secrets、无服务器。

## 当前架构

```text
git push main → GitHub
                 ├─ GitHub Actions：质量门（format / lint / typecheck / build）
                 └─ Cloudflare Pages Git 集成：自动构建部署（构建命令内嵌同一套质量门）
                      → dist/（含 _headers / _redirects / 404.html）
                      → linwis.pages.dev 全球边缘
```

## 首次部署（新账号从零重建，约 10 分钟）

1. **Fork/推送仓库**：源码在 `github.com/linwis1210/linwis-blog`；
2. **创建 Pages 项目**：Cloudflare Dashboard → Workers 和 Pages → 创建 → Pages → 连接到 Git → 选仓库 → 项目名 `linwis`、生产分支 `main`；
3. **构建配置**（Settings → Builds & deployments → 构建配置）：
   - 构建命令：`npm run format:check && npm run lint && npm run typecheck && npm run build`
   - 构建输出目录：`dist`
4. **环境变量**（Settings → 变量和密钥）：`NODE_VERSION` = `22`（文本变量，构建作用域）——必须设置，否则默认 Node 版本会因 npm 差异导致 lockfile 安装失败；
5. 保存后任意 push 即触发首次部署。

> 质量门内嵌于构建命令的意义：Git 集成默认不等 GitHub Actions 结果，检查不过 = 构建失败 = 不部署。

## 日常发布

```bash
git push origin main   # 之后 2–4 分钟自动上线
```

部署历史：Workers 和 Pages → linwis → 部署（每次 commit 一条，含预览 URL）。

## 回滚

部署列表 → 任选历史版本 → 「…」→ **回滚到此次部署**（即时生效，无需构建）。

## 版本发布（SemVer）

```bash
# package.json version 升级（补丁/ minor / major）
git commit -m "chore: release vX.Y.Z"
git tag -a vX.Y.Z -m "..."
git push origin main --follow-tags
```

GitHub Release 在网页创建：Releases → Draft a new release → 选 tag → 粘贴发布说明 → Publish。

## 域名与 HTTPS

- 当前最终域名 `linwis.pages.dev`，HTTPS 由 Cloudflare 自动提供；
- 如未来绑定自定义域：项目 → 自定义域 → 添加域（域需托管在同账号 Cloudflare DNS），证书自动签发；绑定后须同步修改 `astro.config.mjs` 的 `site` 与 `src/config/site.ts` 的 `url`（影响 canonical / RSS / sitemap / og 绝对 URL）。

## 故障排查

| 症状 | 排查 |
|---|---|
| CF 构建失败 | 部署详情页看构建日志；常见：lint/format 不过、Node 版本不对 |
| Actions 红 | 仓库 Actions 页看失败步骤；Actions 与 CF 构建互不阻塞，互为独立信号 |
| 第三方功能异常（评论等） | 先查响应头 CSP 是否放行该第三方来源（`public/_headers`），再查网络可达性 |
| 改了 `site`/`url` | canonical、RSS、sitemap、og:image 全部随之变化，需全量重部署 |
