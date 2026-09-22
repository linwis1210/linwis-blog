---
feature: 全站静态死链检查器 (Broken Link Checker)
state: DONE
date: 2026-09-21
role-assignment:
  leader: main session
  builder: Builder
  verifier: Verifier
risk: 1
repair-count: 0
branch: feature/broken-link-checker
---

# 全站静态死链检查器 (Broken Link Checker)

## 目标

为博客提供快速、可靠的全站静态链接与资源有效性检查脚本，在 `dist/` 编译产物中递归核验所有站内链接（`<a href>`）、图片资源（`<img src>`/`<img srcset>`）以及锚点目标，彻底消除死链与资源引用损坏。

覆盖：
- `docs/TASKS.md` **Phase 18 — CI**：`- [ ] Broken Link Check`

## 范围

**内**：
1. 编写独立检查脚本 `scripts/check-links.mjs`，递归遍历 `dist/**/*.html`。
2. 内部链接存在性校验：
   - 根相对路径（如 `/blog/xyz`、`/projects/abc`）需命中磁盘上实际存在的 HTML 文件或目录（例如 `dist/blog/xyz/index.html` 或 `dist/blog/xyz.html`）；
   - 静态资产路径（如 `/_astro-v2/...`、`/favicon.svg`、`/og/...`）需命中磁盘真实文件；
   - 同页或跨页锚点（`#heading-id`）需校验目标页面中是否存在对应 `id` 的 DOM 节点。
3. 协议过滤：忽略 `mailto:`、`tel:`、`javascript:` 等特殊协议。
4. 结果输出与退出码：发现内部死链时，精准打印出错的源文件路径、所在行数与目标断链，脚本以 `exit code 1` 退出；全量通过时返回 `exit code 0`。
5. 在 `package.json` 中配置 `"check:links": "node scripts/check-links.mjs"` 脚本。
6. 支持 `--external` 可选参数供博主在需要时异步自测外网链接。

**外**：
- 默认不将外部第三方 URL 失败作为构建阻断条件，避免受第三方服务器波动影响。

## Validation Contract

验收标准 / 验证方法 / 通过条件 / 证据位置（Verifier 在独立上下文中逐条核验）：

| # | 条款 | 验证方法 | 通过条件 |
|---|---|---|---|
| 1 | 格式检查 | `npm run format:check` | exit 0 |
| 2 | 代码规范 | `npm run lint` | exit 0 |
| 3 | 全站产物自检 | `npm run build && npm run check:links` | 扫描全部静态产物，内部死链与静态资源引用 0 错误，exit 0 |
| 4 | 断链捕获能力（反向断言） | 人工注入不存在的内部链接测试页面并执行 `npm run check:links` | 精准定位错误文件与死链 URL，exit 1 |
| 5 | 执行性能 | 记录全站 43+ 页面扫描耗时 | 耗时 < 1000ms，无阻塞卡顿 |

证据位置：本目录 `evidence/`（由 Verifier 在独立验收时记录）。

## 约束

- 遵守 `AGENTS.md` 与 `.agents/roles/leader.md` 规范。
- Leader 负责总体协调与调度，不直接编写业务脚本；脚本实现由 Builder 完成。
- 修复上限 3 次，记录于 front-matter `repair-count`。

## 状态流转记录

- 2026-09-21 ACTIVE —— Leader 完成 Feature 规划与 Validation Contract 定义，准备派发 Builder。
- 2026-09-21 READY_FOR_VALIDATION —— Builder 完成全站静态死链检查脚本开发、package.json 脚本配置以及完整自验（格式检查、代码规范、全站自检、反向断言测试与性能指标），全部达标通过。
  - 修改/新增文件清单：
    - 新增 `scripts/check-links.mjs`
    - 修改 `package.json`（新增 `check:links` 脚本）
  - 自验命令执行结果：
    - `npm run format:check`：Exit 0（All matched files use Prettier code style!）
    - `npm run lint`：Exit 0（eslint . 检查全绿通过，无报错）
    - `npm run typecheck`：Exit 0（astro check 0 errors, 0 warnings）
    - `npm run build && npm run check:links`：Exit 0（43 页面扫描 1045 链接、183 锚点、68 资源，内部死链与资源引用 0 错误，耗时约 82ms）
    - 反向断言自测：注入包含路径死链、同页断锚、跨页断锚、缺失图片的测试页，脚本精准命中 4 处问题及准确行号并 Exit 1，清理后恢复全绿
    - 性能指标：全站检测耗时 ~82ms，远低于 < 1000ms 约束
- 2026-09-21 DONE —— Verifier 独立验收完成（报告归档于 `evidence/verifier-report.md`），条款 1–5 全量通过（PASS）。Leader 审核验证证据真实客观，正式批准 Feature 完成并归档。`docs/TASKS.md` 对应项同步勾选。

