# Verifier Report R2 —— fix/og-sharp-raster（9d8a41d）

- 日期：2026-09-15（本机时钟）
- 验证对象：`fix/og-sharp-raster` @ `9d8a41d`（父 `742e41e` = 已合并 og:image Feature），独立 worktree 检出，判定全部来自本轮 Verifier 自行执行
- 验证环境：Windows 10 / Git Bash / node v24.11.1 / npm 11.6.2；lock 对照用 `npx npm@10.9.3`
- 总判定：**PASS（条款 1–6 全部通过）**

## 环境 / 前置

| 项 | 结果 |
|---|---|
| 分支 / HEAD | `fix/og-sharp-raster` / `9d8a41d`，工作树干净 |
| 干净 `npm ci`（本地 npm 11.6.2，运维约束内唯一允许命令） | exit 0（619 packages），lock 未被改动（`git status` 干净）→ Gate A 复现 |

## 条款逐项

### 条款 1 质量门 —— PASS

| 命令 | exit | 关键输出 |
|---|---|---|
| `npm run format:check` | 0 | All matched files use Prettier code style! |
| `npm run lint` | 0 | eslint 无输出 |
| `npm run typecheck` | 0 | 44 files，0 errors，0 warnings，2 hints |
| `npm run build` | 0 | 38 page(s) built |

### 条款 2 双解析门槛（本轮重点）—— PASS

| 检查 | 结果 |
|---|---|
| `npx -y npm@10.9.3 ci --os=linux --cpu=x64 --libc=glibc --dry-run` | **exit 0**（修复前必现 `EUSAGE: Missing @emnapi/runtime…`，本轮未复现）。证据 `r2-gate-npm10-linux-dryrun.log` |
| `npx -y npm@10.9.3 ci --dry-run`（win32 原生） | **exit 0**。证据 `r2-gate-npm10-win32-dryrun.log` |
| `grep -ci resvg package-lock.json` | **0**（大小写不敏感） |
| package.json | 仅移除 `@resvg/resvg-js` 一行；deps/devDeps 无 resvg、无新增运行时依赖 |
| 根因证据 | lock 中 wasm32 兜底链在位：`@emnapi/runtime`、`@img/sharp-wasm32`、`@tailwindcss/oxide-wasm32-wasi`（嵌套 `@emnapi/core` / `@emnapi/runtime` / `@emnapi/wasi-threads` / `@napi-rs/wasm-runtime` / `@tybys/wasm-util` / `tslib`） |

### 条款 3 产物 —— PASS

- `dist/og/` 恰 9 张 PNG（8 文章 + default）。
- 9 张全部：PNG 签名 `89504e470d0a1a0a` OK；首块 IHDR（len 13）；**全部 1200×630**；大小 30,647–43,931 B。
- 排除正确：`docker-network-troubleshooting`（frontmatter `draft: true`）、`blog-2026-roadmap`（date `2026-10-01`，晚于今日 2026-09-15 的定时文章）均无产物。

### 条款 4 视觉（光栅器已换，必做）—— PASS（5 张亲验，超出 ≥4 要求）

| 图片 | 覆盖点 | 逐张结论 |
|---|---|---|
| `nginx-cache-security-headers.png` | 长中文标题 | 「Nginx 缓存与安全响应头配置笔记」两行排布，中文清晰无豆腐块/乱码，无截断，无异常模糊 |
| `tailwind-v4-design-tokens.png` | 中英混排（最长） | 「Tailwind CSS v4 的 Design Tokens 实践」两行，混排正确、字重清晰 |
| `typescript-branded-types-notes.png` | 中英混排 | 「TypeScript 品牌类型与类型收窄笔记」渲染正确，无异常 |
| `github-actions-cd-to-china-server.png` | 混排长标题 | 「GitHub Actions 自动部署到国内服务器」两行正确 |
| `default.png` | default（必看） | 大字标 `linwis_`（accent 下划线）+ 灰 tagline「Keep Thinking, Keep Learning.」+ 弱灰域名，无异常 |

- 构图与色板符合 DESIGN.md §4.1：近白底 #FBFBFD、墨色标题 #1D1D1F、弱灰 #656D76/#8C959F、单一蓝 accent #0071E3（品牌竖标/下划线符/大写分类），无渐变、无装饰堆砌，Quiet Engineering 成立。

### 条款 5 meta + 确定性 + 零新 JS —— PASS

- 8 篇文章页：`og:image` 均自指 `https://linwis.dev/og/<slug>.png`（占位域名与 canonical 一致属既定状态），`og:image:width=1200` / `height=630`、`twitter:card=summary_large_image`、`twitter:image` 全部在位。
- 首页 `dist/index.html`：og:image + twitter:image → `/og/default.png`，twitter:card 正确；`dist/about/index.html` og:image → default。
- Article JSON-LD：8/8 篇含 `"image":"https://linwis.dev/og/<slug>.png"`。
- 确定性：build1 与 build2 连续两次构建，9 张 PNG sha256 完全一致（`r2-sha256-build1.txt` = `r2-sha256-build2.txt`，diff 空）。
- 零新 JS：worktree @ `742e41e` 对照构建（38 页）与本轮 dist 逐页 `<script` 计数 diff 为空；总计 275 = 275。证据 `r2-script-counts-main-742e41e.txt` / `r2-script-counts-fix-9d8a41d.txt`。

### 条款 6 变更范围 —— PASS

- `git diff 742e41e...HEAD --stat`：恰 3 文件 —— `package-lock.json`（-279/+110 净变化）、`package.json`（-1 行）、`src/lib/og.ts`。
- og.ts 逐行审查：变更仅 import（Resvg→sharp）与 `renderToPng` 主体（`sharp(Buffer.from(svg), { density: 72 }).resize(1200, 630).png().toBuffer()`）及头注释；色板、布局、截断、字号分档、字体加载逻辑与父提交一致，无逻辑漂移。`new Uint8Array(png)` 保留 ArrayBuffer-backed 拷贝语义。
- 未动（diff 为空佐证）：`src/pages/og/[slug].png.ts`、`default.png.ts` 端点、BaseLayout、blog/[slug]、`src/assets/fonts/`、docs/、README。`grep -ri resvg src/` = 无引用。

## 方法偏离（记录）

条款 5c 对照构建未用 junction 共享 node_modules：main 的 package.json 依赖 `@resvg/resvg-js`，而修复分支 node_modules 已不含它，junction 会使 main 构建直接失败。改为在 `.agents/tmp/.../main-wt`（worktree @ 742e41e）内以其自身 lock 执行 `npm ci`（exit 0）+ `npm run build`（exit 0，38 页、9 PNG）。全程未触碰主工作树受管文件；未创建任何 junction。

## 结论

条款 1–6 全部 PASS。修复杂询：sharp 替换 resvg + npm 10 重生成 lock 同时满足双解析（npm 11 实装 + npm 10 linux/win32 dry-run），产物、视觉、meta、确定性、零新 JS、范围均无退化。建议状态 READY_FOR_VALIDATION → 合并；条款 7 线上复核归 Leader。
