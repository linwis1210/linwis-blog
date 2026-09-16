---
title: "GitHub Actions 自动部署到国内服务器"
description: "用 GitHub Actions 完成 CI 质量门禁、Docker 构建推送到 GHCR，再 SSH 到国内服务器 pull & up，失败自动回滚。"
date: 2026-09-04
category: "Server"
tags:
  - GitHub Actions
  - CICD
  - Docker
draft: false
series: "Docker Deployment"
seriesOrder: 2
project: "personal-blog"
---

上一篇把博客装进了 Docker 镜像，这一篇让它自己上线：push 到 main 之后，CI 跑完质量门禁，构建镜像推到 GHCR，再 SSH 到服务器 `docker compose pull && up`。

## 整体流水线

```text
git push
  ↓
GitHub Actions: lint + type check + build
  ↓
docker build → push ghcr.io/linwis1210/linwis-blog:{sha,latest}
  ↓
ssh 服务器: docker compose pull && up -d
  ↓
healthcheck 通过？
  ├─ 是 → 部署完成
  └─ 否 → 回滚到上一个镜像
```

## 质量门禁先行

部署 job 依赖 CI 全部通过。任何一步失败，后面全部不执行——禁止带病部署：

```yaml
jobs:
  ci:
    uses: ./.github/workflows/ci.yml
  deploy:
    needs: ci
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:git-${{ github.sha }}
```

推两个 tag：`latest` 给日常部署用，`git-{sha}` 留着精确回滚。

## 服务器端脚本

服务器上放一个极简部署脚本，Actions 只负责 SSH 调用：

```bash
#!/usr/bin/env bash
set -euo pipefail

cd /opt/linwis-blog
docker compose pull
docker compose up -d

# 健康检查，失败则回滚
for i in $(seq 1 10); do
  if curl -fsS http://127.0.0.1:8080/health > /dev/null; then
    echo "deploy ok"; exit 0
  fi
  sleep 3
done

echo "healthcheck failed, rolling back"
docker compose down
docker image prune -f
exit 1
```

:::warning[Secrets 管理]
SSH 私钥、服务器密码只放在 GitHub Actions Secrets 里。任何 secret 出现在代码、日志或环境变量导出里都是事故，宁可重配也不要提交。
:::

## 国内服务器的网络现实

服务器在国内，拉取 GHCR 镜像可能不稳定。备选路径：

1. 服务器配置镜像加速（部分加速器支持 ghcr）
2. Actions 里构建后直接 `docker save | ssh docker load`，绕过 registry
3. 接受偶尔失败，靠 Actions 重试

我选了 1 + 3：加速器能用就用，失败重试一次，仍然失败保持上一个版本在线——部署失败不应该影响现网服务。

## 关于回滚

回滚的本质是：上一个镜像还在本地（`docker image prune` 别手动跑），compose 文件指回去，`up -d`。保持简单，Kubernetes、Blue/Green 这些在单机博客场景都是过度设计。
