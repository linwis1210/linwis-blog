# Leader 线上复核 — 条款 6/7（2026-09-16）

合并 commit：`25c9658`（merge: Cloudflare Pages deployment baseline）

## 条款 6 — 部署接通

- GitHub Actions（merge commit `25c9658`）：**success**（纯质量门，API 轮询确认）。
- Cloudflare Pages Git 集成：合并 push 自动构建部署**成功**——证据为线上响应已切换为新产物（见下，`_headers` 生效不可能是旧部署）。

## 条款 7 — 线上验证（https://linwis.pages.dev）

1. `/` → **200**；六个安全头**各恰好一次**（去重计数 CSP=1 / HSTS=1 / XFO=1 / Permissions-Policy=1）：
   - `content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.github.com; frame-src https://giscus.app; object-src 'none'; base-uri 'self'`
   - `strict-transport-security: max-age=31536000`
   - `permissions-policy: camera=(), microphone=(), geolocation=()`
   - `referrer-policy: strict-origin-when-cross-origin`
   - `x-content-type-options: nosniff`
   - `x-frame-options: SAMEORIGIN`
2. 哈希资产 `/_astro-v2/about.CDLEo0iY.css` → **200** + `Cache-Control: public, max-age=31536000, immutable` + 安全头各一次（CSP=1 / HSTS=1，零重复）。
3. `/no-such-xyz` → **404** + 404 页内容（`<title>404 — linwis_</title>`）。
4. 301 重定向：线上暂无文章配置 `redirectFrom`（`_redirects` 为空文件），机制正确性以本地条款 3/4 证据为准（合同 2026-09-16 修订版已注明）。

## 结论

条款 6、7 **PASS**；条款 8 已移出本 Feature（Phase 22，Deploy Hook 方案）。
合同条款 1–7 全部通过。
