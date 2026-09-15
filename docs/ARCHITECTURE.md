# linwis_ v1.0 Architecture

## 1. Technology Stack

核心：

```text
Astro
TypeScript
Tailwind CSS
Markdown / MDX
Astro Content Collections
```

整体设计：

```text
Static First
+
Astro Islands
+
Progressive Enhancement
```

只有真正需要交互的功能才加载 JavaScript。

## 2. Runtime Architecture

生产环境不运行 Astro Node Server。

Astro 仅负责构建：

```text
Astro
  ↓
npm run build
  ↓
dist/
```

最终由 Nginx 提供静态资源。

## 3. Container Architecture（2026-09-15 废弃）

原方案（Multi-stage Docker Build → Nginx Runtime）随部署目标变更为 Cloudflare Pages 而作废。
静态产物直接发布至 Pages，无容器层。历史方案见 Git 历史。

## 4. Deployment

完整链路：

```text
Developer
    ↓
git push
    ↓
GitHub
    ↓
GitHub Actions（Quality Gate：format / lint / typecheck / build）
    ↓
Astro Build → dist/
    ↓
wrangler pages deploy
    ↓
Cloudflare Pages 全球边缘
```

## 5. Production Traffic

Cloudflare Pages 边缘直接服务静态产物：

```text
Internet
   ↓
Custom Domain（待定；先行 <project>.pages.dev）
   ↓
Cloudflare Pages Edge（HTTPS 自动）
   ↓
Astro dist（含 _headers / _redirects / 404.html）
```

Cloudflare 负责：

- HTTPS / 证书
- 全球 CDN
- `_headers`：Security Headers + Cache Policy
- `_redirects`：301 重定向
- 404 页自动识别

## 6. DNS

DNS 托管：Cloudflare。

自定义域名（待定）以代理模式绑定 Cloudflare Pages；
大陆访问走全球边缘，延迟权衡已于 2026-09-15 由用户知情接受。

## 7. GitHub Container Registry（2026-09-15 废弃）

随 Docker 方案作废；镜像托管与分发由 Cloudflare Pages 取代。

## 8. Rollback

Cloudflare Pages 保留历史部署版本，Dashboard 可一键回滚到任意历史部署。

失败处理：部署异常 → 回滚上一版本 → 排查修复 → 重新部署。

不做：

- Kubernetes
- Blue/Green Infrastructure
- Service Mesh

## 9. Content Architecture

建议目录：

```text
src/
├── content/
│   ├── blog/
│   ├── projects/
│   └── snippets/
│
├── components/
├── layouts/
├── pages/
├── styles/
├── config/
├── lib/
└── assets/
```

Snippets v1.0 不公开展示。

## 10. Configuration

配置型数据：

```text
src/config/
```

例如：

```text
site.ts
categories.ts
tagAliases.ts
navigation.ts
social.ts
```

内容型数据：Markdown / MDX。

## 11. Search

搜索索引在 Build 阶段生成。

浏览器端执行搜索。

架构：

```text
Content Collections
      ↓
Build
      ↓
Search Index
      ↓
Browser
      ↓
Command Palette
```

无需：

- Database
- Elasticsearch
- Search Backend

## 12. Content Validation

Astro Content Collections Schema 校验：

- title
- slug
- description
- date
- updated
- category
- tags
- draft
- featured
- series
- project
- cover
- redirectFrom

CI 进一步检查：

- Duplicate Slug
- Missing Image
- Broken Internal Link
- Invalid Category
- Invalid Series Order

## 13. CI Pipeline

Pull / Push：

```text
Install
↓
Format Check
↓
Lint
↓
Type Check
↓
Content Validation
↓
Unit Tests
↓
Astro Build
↓
Link Check
↓
Playwright Smoke Test
```

任何步骤失败：

```text
STOP
```

禁止部署。

## 14. CD Pipeline

main 通过全部 CI 后（同一 workflow 的 deploy job，`needs: quality`）：

```text
Astro Build
↓
wrangler pages deploy（secrets：CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID）
↓
Cloudflare Pages
↓
线上冒烟验证
↓
Success / Pages 回滚
```

## 15. Scheduled Build

GitHub Actions 提供 Scheduled Workflow。

目的：发布未来日期文章。

例如：

```text
每天定时
↓
重新 Build
↓
检查 date
↓
符合发布时间
↓
自动上线
```

## 16. Secrets

绝对禁止进入 Repository：

- SSH Private Key
- Server Password
- API Token
- Analytics Secret
- Deployment Token

全部放：GitHub Actions Secrets。

## 17. Security

需要配置：

- CSP
- HSTS
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Frame Protection

第三方脚本必须白名单。

实现位置：`public/_headers`（Cloudflare Pages）。

## 18. Third-party Failure Strategy

以下服务属于 Progressive Enhancement：

- Giscus
- Analytics
- GitHub Activity

必须满足：

```text
Third-party Failure
        ≠
Site Failure
```

正文必须始终可以独立加载。

## 19. Analytics Architecture

Analytics Provider 封装成独立组件：

```text
Analytics.astro
```

配置：

```text
enabled: true
provider: ...
```

以后可以更换 Provider，不影响页面代码。

## 20. GitHub Activity

首页 GitHub Activity：异步加载。

失败：隐藏或展示缓存。

不得阻塞：

- Hero
- Projects
- Posts

## 21. Image Architecture

文章资源跟 Repository。

建议：

```text
src/assets/blog/{slug}/
```

例如：

```text
src/assets/blog/docker-deployment/
├── cover.png
├── architecture.png
└── nginx.png
```

Build 时自动优化。

## 22. Content CLI

提供：

```bash
npm run new:post
```

和：

```bash
npm run new:project
```

创建文章时：

1. 输入 Title
2. 自动建议英文 Slug
3. 用户确认/修改
4. Category
5. Tags
6. Series
7. Draft

默认：

```yaml
draft: true
```

## 23. Testing

Unit Tests：只测试关键业务工具函数。

例如：

- Related Post Ranking
- Reading Time
- Draft Filter
- Scheduled Publish Filter
- Tag Normalize
- Slug Check

Playwright Smoke Tests：

- Home
- Blog
- Article
- Search
- Theme
- 404

不追求高 Coverage。

## 24. Deployment Portability

目标：部署不依赖任何特定服务器。

恢复 / 迁移流程：

```text
GitHub Repository（源码 + 内容）
↓
Cloudflare 账号（Pages 项目 + API Token）
↓
Actions Secrets 配置
↓
git push 触发部署
```

平台迁移仅涉及文档化配置，无服务器重建成本。

## 25. Backup

主要资产：

```text
GitHub Repository
+
Local Git Repository
```

未来可增加：第二 Git Remote 自动镜像。

服务器不作为唯一数据源。

## 26. Versioning

采用 Semantic Versioning：

```text
v1.0.0
v1.1.0
v1.2.0
v2.0.0
```

GitHub Releases 管理版本。

Docker Tag 与 Release 对齐。

## 27. Architecture Principles

项目开发过程中始终遵守：

1. Static First
2. Content First
3. Mobile First
4. No Database in v1
5. Minimal Runtime JavaScript
6. Progressive Enhancement
7. Configuration over Hard Coding
8. Third-party Services Must Degrade Gracefully
9. Server Must Be Replaceable
10. Writing Workflow Must Stay Simple
