/**
 * new:post — 博客文章脚手架（交互式 + 可脚本化）。
 *
 * 交互流: Title → Slug 建议 → Category（清单校验）→ Tags → Series/seriesOrder → draft
 *
 * 用法:
 *   npm run new:post
 *   npm run new:post -- --title "My Post" --slug my-post --category Server \
 *     --tags "Docker, Astro" --series "Series" --seriesOrder 1 --draft=false
 *
 * frontmatter 与 src/content.config.ts 的 blog schema 保持兼容
 * （series 必须成对携带 seriesOrder；category 必须在 src/config/categories.ts 清单内）。
 */
import path from "node:path";
import {
  ROOT_DIR,
  askBool,
  askChoice,
  askSlug,
  askTitle,
  createPrompter,
  ensureNewFile,
  fail,
  getCategoryNames,
  parseCliArgs,
  resolveArgvSlug,
  resolveChoice,
  splitList,
  toBool,
  today,
  writeContentFile,
  yamlScalar,
  yamlStr,
} from "./lib/scaffold.mjs";

const args = parseCliArgs(
  {
    title: { type: "string" },
    slug: { type: "string" },
    category: { type: "string" },
    tags: { type: "string" },
    series: { type: "string" },
    seriesOrder: { type: "string" },
    draft: { type: "string" },
  },
  ["draft"]
);

const categories = getCategoryNames();
const prompter = createPrompter();
/** 纯交互会话（完全无 argv）才询问可选字段；带参数运行时缺省项直接取默认值 */
const interactive = process.argv.slice(2).length === 0;

try {
  // Title
  let title = args.title?.trim();
  if (!title) title = await askTitle(prompter);

  // Slug（argv 提供 → 规范化 + 校验非法即退出；未提供 → 建议 + 重询）
  let slug = args.slug?.trim();
  if (slug === undefined) {
    slug = await askSlug(prompter, title);
  } else {
    slug = resolveArgvSlug(slug);
  }

  // Category（值来源: src/config/categories.ts 动态解析）
  const category =
    resolveChoice(args.category, categories, "category", "（来源: src/config/categories.ts）") ??
    (await askChoice(prompter, "Category", categories));

  // Tags
  let tags = splitList(args.tags);
  if (tags === undefined) {
    tags = interactive ? splitList(await prompter.ask("Tags（可选，逗号分隔）: ")) : [];
  }

  // Series / seriesOrder（可选，成对出现）
  let series = args.series?.trim() || undefined;
  let orderRaw = args.seriesOrder?.trim() || undefined;
  if (!series && orderRaw) fail("--seriesOrder 必须与 --series 成对提供");
  if (series && !orderRaw && !interactive) {
    fail("--series 需要成对提供 --seriesOrder（正整数）");
  }
  if (interactive && args.series === undefined && args.seriesOrder === undefined) {
    series = (await prompter.ask("Series（可选，回车跳过）: ")) || undefined;
  }
  if (series && !orderRaw) {
    for (;;) {
      const answer = await prompter.ask(`SeriesOrder（${series} 中的序号，正整数）: `);
      if (/^[1-9]\d*$/.test(answer)) {
        orderRaw = answer;
        break;
      }
      console.error(`seriesOrder 必须是正整数，收到: "${answer}"`);
    }
  }
  const seriesOrder = orderRaw === undefined ? undefined : Number(orderRaw);
  if (series && (!Number.isInteger(seriesOrder) || seriesOrder < 1)) {
    fail(`seriesOrder 不合法: "${orderRaw}"（必须是正整数）`);
  }

  // draft（默认 true；仅纯交互会话询问）
  const draft =
    args.draft !== undefined
      ? toBool(args.draft, true, "--draft")
      : interactive
        ? await askBool(prompter, "Draft（回车 = true，输入 false 则立即发布）: ", true)
        : true;

  // 防覆盖：slug 已存在 → 报错退出，绝不覆盖
  const target = path.join(ROOT_DIR, "src", "content", "blog", `${slug}.md`);
  ensureNewFile(target);

  // frontmatter 只含实际填写的字段 + 必需默认字段
  const frontmatter = [
    `title: ${yamlStr(title)}`,
    `description: ${yamlStr("占位描述：用一句话概括本文内容。")}`,
    `date: ${today()}`,
    `category: ${yamlStr(category)}`,
    ...(tags.length > 0 ? ["tags:", ...tags.map((tag) => `  - ${yamlScalar(tag)}`)] : []),
    `draft: ${draft}`,
    ...(series ? [`series: ${yamlStr(series)}`, `seriesOrder: ${seriesOrder}`] : []),
  ];
  writeContentFile(target, frontmatter, [
    "<!-- 正文占位：从这里开始写作，完成后删除本行注释。 -->",
  ]);

  console.log(`已创建: ${path.relative(ROOT_DIR, target)}`);
  console.log(`  title: ${title}`);
  console.log(`  category: ${category}`);
  if (tags.length > 0) console.log(`  tags: ${tags.join(", ")}`);
  if (series) console.log(`  series: ${series} #${seriesOrder}`);
  console.log(`  draft: ${draft}`);
} finally {
  prompter.close();
}
