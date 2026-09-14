/**
 * 文章统计：字数与阅读时间。
 * 从 raw markdown 估算：剔除代码块 / frontmatter / HTML 标签后，
 * CJK 字符按字计数，拉丁文本按词计数。
 */

/** 中文语境阅读速度：约 300 字/分钟；英文约 200 词/分钟；代码约 60 行/分钟 */
const CJK_CHARS_PER_MINUTE = 300;
const LATIN_WORDS_PER_MINUTE = 200;
const CODE_LINES_PER_MINUTE = 60;

const CJK_RANGE = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;

export interface PostStats {
  words: number;
  minutes: number;
}

export function countStats(markdown: string): PostStats {
  // 代码块单独统计行数：代码占阅读时间的比重不可忽略
  let codeLines = 0;
  const text = markdown
    // frontmatter
    .replace(/^---\n[\s\S]*?\n---/, "")
    // 代码块：计行数后剔除
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, (block) => {
      codeLines += block.split("\n").length - 2;
      return " ";
    })
    // 行内代码
    .replace(/`[^`]*`/g, "")
    // 图片 / 链接
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // HTML 标签
    .replace(/<[^>]+>/g, "")
    // markdown 符号
    .replace(/[#>*_~\-|]+/g, " ");

  const latinWords = text
    .split(/\s+/)
    .filter((w) => /[a-zA-Z0-9]/.test(w) && !CJK_RANGE.test(w)).length;
  const cjkChars = (text.match(new RegExp(CJK_RANGE, "g")) ?? []).length;

  const words = latinWords + cjkChars;
  const minutes = Math.max(
    1,
    Math.round(
      cjkChars / CJK_CHARS_PER_MINUTE +
        latinWords / LATIN_WORDS_PER_MINUTE +
        codeLines / CODE_LINES_PER_MINUTE,
    ),
  );

  return { words, minutes };
}

/** 移除 markdown 标记后的纯文本（用于搜索索引 / 摘要） */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/^---\n[\s\S]*?\n---/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
