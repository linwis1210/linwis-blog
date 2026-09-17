/**
 * 内容脚手架 CLI 共享工具（new-post / new-project）。
 * 零运行时依赖：仅 node:fs / node:path 等 node 内置模块。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

/** 项目根目录（本文件位于 scripts/lib/，上两级） */
export const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** slug 规则：小写字母/数字，连字符分段 */
export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** 打印错误并以非零码退出 */
export function fail(message) {
  console.error(`错误: ${message}`);
  process.exit(1);
}

/**
 * 解析命令行参数。所有选项按 string 处理（parseArgs 的 boolean 类型不接受
 * --flag=false 写法）；布尔型 key（如 --draft）支持四种写法并统一归一化：
 *   --draft / --draft=true / --draft true / --draft=false
 * 调用方用 toBool 取值。strict 模式下未知选项、缺失值均报错退出。
 */
export function parseCliArgs(options, booleanKeys = []) {
  const expanded = [];
  for (const arg of process.argv.slice(2)) {
    const bare = booleanKeys.find((key) => arg === `--${key}`);
    expanded.push(bare ? `${bare}=true` : arg);
  }
  try {
    const { values } = parseArgs({ options, strict: true, args: expanded });
    return values;
  } catch (error) {
    fail(`命令行参数无效 —— ${error.message}`);
  }
}

/** "true"/"false" 字符串 → boolean；未提供返回默认值；非法值报错退出 */
export function toBool(raw, fallback, label) {
  if (raw === undefined) return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  fail(`${label} 只接受 true / false，收到: ${raw}`);
}

/** 逗号分隔字符串 → 去空白、去空项的数组；未提供返回 undefined */
export function splitList(raw) {
  if (raw === undefined) return undefined;
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** 标题为纯 ASCII 时给出 kebab-case 建议；含非 ASCII 字符（如中文）返回 null */
export function suggestSlug(title) {
  if (!/^[\x20-\x7E]+$/.test(title)) return null;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return SLUG_RE.test(slug) ? slug : null;
}

/**
 * 从 src/config/categories.ts 动态解析合法 category 清单。
 * 做法：截取源码中 CATEGORIES 数组块，正则提取其中的 name: "..." 字符串字面量。
 * 清单值完全来自该文件，脚本内不硬编码。
 */
export function getCategoryNames() {
  const file = path.join(ROOT_DIR, "src", "config", "categories.ts");
  let source;
  try {
    source = fs.readFileSync(file, "utf8");
  } catch {
    fail(`无法读取分类清单文件: ${file}`);
  }
  const start = source.indexOf("CATEGORIES");
  const end = source.indexOf("];", start);
  if (start === -1 || end === -1) fail(`无法解析分类清单（未找到 CATEGORIES 数组）: ${file}`);
  const names = [...source.slice(start, end).matchAll(/\bname:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (names.length === 0) fail(`分类清单解析结果为空: ${file}`);
  return names;
}

/**
 * 交互提问器：自行按行读取 stdin（TTY 与管道统一处理）。
 * 不用 node:readline 的 question() —— 其对 Windows 非 TTY 管道 stdin 存在
 * 只能读到第一行答案后即提前 close 的问题；直接监听 data/end 事件两种环境
 * 都可靠。终端行编辑与回显由 OS 行规程负责（未开 raw mode）。
 * stdin 提前结束则立即报错退出，避免非交互环境下挂死或静默吞掉必填项。
 */
export function createPrompter() {
  let buffer = "";
  let ended = false;
  let started = false;
  let notify = null;

  const start = () => {
    if (started) return;
    started = true;
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      buffer += chunk;
      if (notify) {
        const wake = notify;
        notify = null;
        wake();
      }
    });
    process.stdin.on("end", () => {
      ended = true;
      if (notify) {
        const wake = notify;
        notify = null;
        wake();
      }
    });
    process.stdin.on("error", (error) => {
      fail(`读取 stdin 失败: ${error.message}`);
    });
  };

  const takeLine = () => {
    const index = buffer.indexOf("\n");
    if (index === -1) {
      if (ended && buffer.length > 0) {
        const rest = buffer;
        buffer = "";
        return rest;
      }
      return null;
    }
    const line = buffer.slice(0, index);
    buffer = buffer.slice(index + 1);
    return line;
  };

  return {
    /** 提问并读取一行（自动 trim）；stdin 结束且无剩余输入时报错退出 */
    async ask(question) {
      start();
      process.stdout.write(question);
      for (;;) {
        const line = takeLine();
        if (line !== null) return line.trim();
        if (ended) {
          fail("stdin 已结束，无法读取交互输入 —— 请补齐命令行参数，或通过管道提供剩余答案");
        }
        await new Promise((resolve) => {
          notify = resolve;
        });
      }
    },
    close() {
      if (started) process.stdin.destroy();
    },
  };
}

/** 交互循环：标题必填，空输入重询 */
export async function askTitle(prompter) {
  for (;;) {
    const title = await prompter.ask("Title（标题）: ");
    if (title) return title;
    console.error("标题不能为空，请重新输入。");
  }
}

/** 交互循环：slug 建议（纯 ASCII 标题回车即用建议；含中文要求手输），非法重询 */
export async function askSlug(prompter, title) {
  const suggestion = suggestSlug(title);
  const hint = suggestion ? `（回车 = ${suggestion}）` : "（标题含非 ASCII 字符，请手动输入）";
  for (;;) {
    const answer = await prompter.ask(`Slug ${hint}: `);
    const candidate = answer || suggestion;
    if (!candidate) {
      console.error("slug 不能为空。");
      continue;
    }
    if (!SLUG_RE.test(candidate)) {
      console.error(`slug 不合法: "${candidate}"（规则: ^[a-z0-9]+(-[a-z0-9]+)*$）`);
      continue;
    }
    return candidate;
  }
}

/**
 * 清单选项交互循环：非法/空输入重询；提供 fallback 时直接回车取默认值。
 */
export async function askChoice(prompter, label, options, fallback = undefined) {
  for (;;) {
    const answer = await prompter.ask(`${label}（可选: ${options.join(" | ")}）: `);
    if (!answer && fallback !== undefined) return fallback;
    if (options.includes(answer)) return answer;
    console.error(`${label} "${answer}" 不在清单中 —— 可用值: ${options.join(" | ")}`);
  }
}

/** 交互循环：布尔项，直接回车取默认值 */
export async function askBool(prompter, question, fallback) {
  for (;;) {
    const answer = (await prompter.ask(question)).toLowerCase();
    if (answer === "") return fallback;
    if (answer === "true") return true;
    if (answer === "false") return false;
    console.error("请输入 true 或 false（或直接回车取默认值）。");
  }
}

/** argv 值 → 清单校验；非法即报错退出（脚本模式无重询） */
export function resolveChoice(raw, options, label, sourceNote = "") {
  if (raw === undefined) return null;
  const value = raw.trim();
  if (!options.includes(value)) {
    fail(`${label} "${value}" 不在清单中${sourceNote} —— 可用值: ${options.join(" | ")}`);
  }
  return value;
}

/** YAML 双引号字符串 */
export function yamlStr(value) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * YAML 纯量：安全的字母开头纯标量不加引号（与现有 frontmatter 风格一致）；
 * 数字样、布尔样或含特殊字符的值加双引号，避免被 YAML 解析成非 string。
 */
export function yamlScalar(value) {
  const isPlain =
    /^[A-Za-z0-9][A-Za-z0-9 .+#/_-]*$/.test(value) &&
    !/^(true|false|yes|no|on|off|null|~)$/i.test(value) &&
    !/^\d+(\.\d+)*$/.test(value);
  return isPlain ? value : yamlStr(value);
}

/** 校验目标文件不存在（防覆盖：已存在即报错退出） */
export function ensureNewFile(filePath) {
  if (fs.existsSync(filePath)) fail(`目标文件已存在，拒绝覆盖: ${filePath}`);
}

/** 写入内容文件：frontmatter + 空行 + 正文，LF、UTF-8、结尾换行 */
export function writeContentFile(filePath, frontmatterLines, bodyLines) {
  const content = ["---", ...frontmatterLines, "---", "", ...bodyLines, ""].join("\n");
  fs.writeFileSync(filePath, content, "utf8");
}

/** 今日日期，本地时区，yyyy-mm-dd */
export function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** URL 合法性校验（与 zod z.string().url() 语义一致） */
export function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
