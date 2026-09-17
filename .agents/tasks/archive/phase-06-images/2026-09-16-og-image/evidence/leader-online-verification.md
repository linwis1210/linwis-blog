# Leader 线上复核 — 条款 7（2026-09-17）

合并链：`742e41e`（feature 主体）→ 远端 npm ci FAIL → `9d8a41d`（sharp 修复，分支 fix/og-sharp-raster）→ 合并 `df5c9e8` 推送。

## 远端状态（修复验证的直接证据）

- GitHub Actions（merge commit `df5c9e8`）：**success** —— 修复前同步骤（Install dependencies）6 秒 EUSAGE 失败，sharp + npm10-lock 后 Linux npm 10 安装通过。
- Cloudflare Pages Git 集成构建部署成功：线上出现 og 产物（旧部署无此路径）。

## 条款 7 — 线上验证（https://linwis.pages.dev）

1. `GET /og/default.png` → **200**，`Content-Type: image/png`；
2. `GET /og/deploy-astro-with-docker.png` → **200**，`image/png`；
3. 文章页 `/blog/deploy-astro-with-docker/` meta：
   - `<meta property="og:image" content="https://linwis.dev/og/deploy-astro-with-docker.png">`
   - `<meta property="og:image:width" content="1200">`
   - `<meta name="twitter:card" content="summary_large_image">`
   - Article JSON-LD `"image":"https://linwis.dev/og/deploy-astro-with-docker.png"`
4. 首页 og:image 兜底 → `https://linwis.dev/og/default.png`。

## 结论

条款 7 **PASS**。合同条款 1–7 全部通过（R1 六项 + 远端失败修复 + R2 全量重验 + 本线上复核）。
og:image/占位域名说明：URL 使用占位 `linwis.dev`，与 canonical 同源，随域名 Feature 统一替换。
