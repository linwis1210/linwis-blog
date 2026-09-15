# Verifier Report — 复验轮 R3（CI 安装失败修复）

- 日期：2026-09-15
- Verifier：独立子代理（GLM-5.3-Flash）
- 分支：`fix/ci-npm10-lockfile`（HEAD = `b548292`，父 = `ecbd3fc` = main tip，`main..HEAD` 仅 1 commit）
- 验证对象：Builder 用 `npx npm@10.9.3 install` 重新生成的 `package-lock.json`（条款 9 远端绿灯不归本轮，由 Leader 合并推送后复核）
- 判定依据：全部来自本执行上下文独立运行的命令输出；Builder 报告未采信。

## 总判定

**PASS**（修复轮范围：条款 1/9-安装路径的本地代表 + 条款 2–5 复跑 + 变更范围/lockfile 合理性全过）

## 逐条结果

| # | 验证项 | 命令 | exit | 关键输出 |
|---|---|---|---|---|
| 1 | 变更范围 | `git diff main...HEAD --stat` | 0 | 仅 `package-lock.json`（53+/16−，69 行变更） |
| 1a | 排除路径 | `git diff main...HEAD -- package.json src/ docs/ .github/ .agents/` | 0 | 输出为空 |
| 1b | package.json 与 main 一致 | `git rev-parse main:package.json HEAD:package.json` + `git hash-object package.json` | 0 | 三者 blob 哈希相同：`a7215bb8` |
| 2 | CI 代表性安装（npm 10） | `rm -rf node_modules && npx -y npm@10.9.3 ci` | 0 | `added 600 packages, and audited 601 packages`；`npx npm@10.9.3 --version` → `10.9.3` |
| 3 | 本机 npm 11 安装 | `rm -rf node_modules && npm ci`（本机 npm 11.6.2） | 0 | `added 600 packages, and audited 601 packages` |
| 3a | lockfile 未被任一版重写 | 两次 ci 后 `git status --short` | 0 | 工作树干净（排除 evidence 自身新文件） |
| 4 | lockfile 合理性 | grep `package-lock.json` | 0 | `"lockfileVersion": 3`（L4）；`node_modules/@emnapi/runtime` version `1.11.3`（L504-506）；`node_modules/@emnapi/core` version `1.11.3`（L493-495） |
| 5 | 条款 2 format:check | `npm run format:check` | 0 | `All matched files use Prettier code style!` |
| 5 | 条款 3 lint | `npm run lint` | 0 | eslint 无输出（无错误） |
| 5 | 条款 4 typecheck | `npm run typecheck` | 0 | `Result (40 files): 0 errors, 0 warnings, 2 hints`（2 hints 为既有 astro is:inline 已知项，非阻断） |
| 5 | 条款 5 build | `npm run build` | 0 | `38 page(s) built`，`Complete!` |

## 结论

- 修复达成目标：npm 10.9.3（CI Node 22 自带 npm 10 的代表版本）与 npm 11.6.2（本机）的 `npm ci` 均 exit 0，R2 后新出现的 `EUSAGE: Missing @emnapi/runtime@1.11.3 / @emnapi/core@1.11.3 from lock file` 安装失败路径已消除。
- 变更最小且合规：仅 `package-lock.json` 一个文件；`package.json`、`src/`、`docs/`、`.github/`、`.agents/` 零改动；`.github/workflows/ci.yml` 保持 Node 22（条款 6 前提不变）。
- lockfileVersion 保持 3，缺失的两个 `@emnapi` 条目均已存在且 resolved URL 指向 registry.npmjs.org。
- 条款 2–5 在最终安装态（npm 11 ci 后）全部复跑 exit 0，与 R2 基线一致。
- 条款 9（远端 CI 绿）不在本轮范围：待 Leader 合并推送后按合同方法复核。

## 证据文件（本轮 R3）

- `r3-scope-git.log` — 分支/基点/commit 范围、diff stat、排除路径空 diff、blob 哈希、lockfileVersion + emnapi 条目、终态 git status
- `r3-step2-npm10-ci.log` — `npx -y npm@10.9.3 ci` 全输出 + EXIT_CODE=0
- `r3-step3-npm11-ci.log` — 本机 `npm ci` 全输出 + EXIT_CODE=0
- `r3-clause2-format-check.log`、`r3-clause3-lint.log`、`r3-clause4-typecheck.log`、`r3-clause5-build.log`

## 环境备注

- Windows 10 (19045) / Git Bash；Node v24.11.1，本机 npm 11.6.2（CI 为 Node 22 自带 npm 10，故用 npm@10.9.3 作代表版本，与 Leader 本地取证复现所用版本一致）。
- npm 安装期间有既知噪声：eslint 9.39.5 / tsconfck deprecated 警告、`4 vulnerabilities (2 low, 1 high, 1 critical)`（审计提示，非本合同范围）。
- 本轮未做任何修复/commit/push；工作树中仅 `evidence/r3-*` 新文件为 untracked，归属 Leader 处理。
