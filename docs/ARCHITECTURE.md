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

## 3. Container Architecture

使用 Multi-stage Docker Build。

```text
Node Build Stage
      ↓
Astro Build
      ↓
dist/
      ↓
Nginx Runtime Stage
```

最终镜像只包含：

```text
Nginx
+
dist/
```

不运行 Node.js。

## 4. Deployment

完整链路：

```text
Developer
    ↓
git push
    ↓
GitHub
    ↓
GitHub Actions
    ↓
Quality Gate
    ↓
Astro Build
    ↓
Docker Build
    ↓
GHCR
    ↓
Production Server
    ↓
docker pull
    ↓
docker compose
    ↓
Healthcheck
```

## 5. Production Traffic

当前服务器：中国大陆 Linux Server + 宝塔。

建议：

```text
Internet
   ↓
Domain
   ↓
DNS
   ↓
BaoTa Nginx
   ↓
127.0.0.1:8080
   ↓
Docker Nginx
   ↓
Astro dist
```

宝塔 Nginx 负责：

- HTTPS
- Domain
- Reverse Proxy
- Certificate
- Access Log

Docker 内 Nginx 负责：

- Static Files
- Cache Headers
- Compression
- Security Headers
- `/health`

## 6. DNS

DNS 托管：Cloudflare。

大陆访问优先，因此普通 Cloudflare Proxy 不作为默认流量路径。

默认：

```text
Cloudflare DNS
      ↓
DNS Only
      ↓
China Mainland Server
```

## 7. GitHub Container Registry

镜像：

```text
ghcr.io/{user}/linwis-blog
```

建议 Tags：

```text
latest
v1.0.0
git-{sha}
```

## 8. Rollback

部署流程：

```text
Current Version
      ↓
Pull New Image
      ↓
Start
      ↓
Healthcheck
```

成功：部署完成。

失败：

```text
Stop Failed Version
      ↓
Restore Previous Image
      ↓
Start
      ↓
Healthcheck
```

不做：

- Kubernetes
- Blue/Green Infrastructure
- Service Mesh
- Docker Swarm

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

main 通过全部 CI 后：

```text
Build Docker
↓
Push GHCR
↓
SSH Server
↓
docker compose pull
↓
docker compose up
↓
Healthcheck
↓
Success / Rollback
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

目标：服务器不是核心资产。

新服务器恢复流程：

```text
Install Docker
↓
Copy compose config
↓
Configure Secrets
↓
Pull GHCR Image
↓
docker compose up
↓
Update DNS
```

因此服务器可以随时迁移。

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
