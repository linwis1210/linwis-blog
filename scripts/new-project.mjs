/**
 * new:project — 项目脚手架（交互式 + 可脚本化）。
 *
 * 交互流: Title → Slug 建议 → status（active|completed|archived）→ techStack
 *        → github / demo（可选 URL）→ featured（默认 false）
 *
 * 用法:
 *   npm run new:project
 *   npm run new:project -- --title "My Project" --slug my-project --status completed \
 *     --techStack "Node.js, Astro" --github https://github.com/me/my --demo https://my.dev
 *
 * frontmatter 与 src/content.config.ts 的 projects schema 保持兼容。
 */
import path from "node:path";
import {
  ROOT_DIR,
  SLUG_RE,
  askBool,
  askChoice,
  askSlug,
  askTitle,
  createPrompter,
  ensureNewFile,
  fail,
  isValidUrl,
  parseCliArgs,
  splitList,
  toBool,
  writeContentFile,
  yamlScalar,
  yamlStr,
} from "./lib/scaffold.mjs";

const STATUSES = ["active", "completed", "archived"];

const args = parseCliArgs(
  {
    title: { type: "string" },
    slug: { type: "string" },
    status: { type: "string" },
    techStack: { type: "string" },
    github: { type: "string" },
    demo: { type: "string" },
    featured: { type: "string" },
  },
  ["featured"]
);

const prompter = createPrompter();
/** 纯交互会话（完全无 argv）才询问可选字段；带参数运行时缺省项直接取默认值 */
const interactive = process.argv.slice(2).length === 0;

try {
  // Title
  let title = args.title?.trim();
  if (!title) title = await askTitle(prompter);

  // Slug（规则与 new:post 一致）
  let slug = args.slug?.trim();
  if (slug === undefined) {
    slug = await askSlug(prompter, title);
  } else if (!SLUG_RE.test(slug)) {
    fail(`slug 不合法: "${slug}"（规则: ^[a-z0-9]+(-[a-z0-9]+)*$）`);
  }

  // status（纯交互下回车默认 active）
  let status = args.status?.trim();
  if (status === undefined) {
    status = interactive ? await askChoice(prompter, "Status", STATUSES, "active") : "active";
  } else if (!STATUSES.includes(status)) {
    fail(`status "${status}" 不合法 —— 可用值: ${STATUSES.join(" | ")}`);
  }

  // techStack
  let techStack = splitList(args.techStack);
  if (techStack === undefined) {
    techStack = interactive ? splitList(await prompter.ask("TechStack（可选，逗号分隔）: ")) : [];
  }

  // github / demo（可选 URL；仅纯交互会话询问）
  const resolveUrl = async (label, raw) => {
    if (raw !== undefined) {
      const value = raw.trim();
      if (value === "") return undefined;
      if (!isValidUrl(value)) fail(`${label} 不是合法 URL: "${value}"（需含协议，如 https://...）`);
      return value;
    }
    if (!interactive) return undefined;
    for (;;) {
      const answer = await prompter.ask(`${label}（可选 URL，回车跳过）: `);
      if (answer === "") return undefined;
      if (isValidUrl(answer)) return answer;
      console.error(`${label} 不是合法 URL: "${answer}"（需含协议，如 https://...）`);
    }
  };
  const github = await resolveUrl("GitHub", args.github);
  const demo = await resolveUrl("Demo", args.demo);

  // featured（默认 false；仅纯交互会话询问）
  const featured =
    args.featured !== undefined
      ? toBool(args.featured, false, "--featured")
      : interactive
        ? await askBool(prompter, "Featured（回车 = false）: ", false)
        : false;

  // 防覆盖：slug 已存在 → 报错退出，绝不覆盖
  const target = path.join(ROOT_DIR, "src", "content", "projects", `${slug}.md`);
  ensureNewFile(target);

  const frontmatter = [
    `title: ${yamlStr(title)}`,
    `description: ${yamlStr("占位描述：用一句话概括本项目。")}`,
    `status: ${yamlStr(status)}`,
    ...(techStack.length > 0
      ? ["techStack:", ...techStack.map((item) => `  - ${yamlScalar(item)}`)]
      : []),
    ...(github ? [`github: ${yamlStr(github)}`] : []),
    ...(demo ? [`demo: ${yamlStr(demo)}`] : []),
    `featured: ${featured}`,
  ];
  writeContentFile(target, frontmatter, [
    "<!-- 项目简介占位：一句话说明项目是什么，然后展开背景 / 目标 / 实现，完成后删除本行注释。 -->",
  ]);

  console.log(`已创建: ${path.relative(ROOT_DIR, target)}`);
  console.log(`  title: ${title}`);
  console.log(`  status: ${status}`);
  if (techStack.length > 0) console.log(`  techStack: ${techStack.join(", ")}`);
  if (github) console.log(`  github: ${github}`);
  if (demo) console.log(`  demo: ${demo}`);
  console.log(`  featured: ${featured}`);
} finally {
  prompter.close();
}
