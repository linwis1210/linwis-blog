/**
 * OG 图片渲染管线（构建期专用，零客户端 JS）。
 *
 * satori：受严格子集约束的元素树 → SVG（根节点需显式 width/height，
 * 多子节点容器需显式 display: flex；文字以矢量路径内嵌，不依赖系统字体）；
 * sharp（libvips）：SVG → PNG，72 DPI 光栅化并强制输出 1200×630。
 * 字体只加载仓库内 Noto Sans SC Regular（区域子集，OFL 许可），
 * 保证任意环境下同名输入产出字节一致的 PNG。
 *
 * 视觉遵循 DESIGN.md「Quiet Engineering」：近白底、墨色标题、
 * 单一蓝色 accent（品牌下划线符、竖向标记、分类），无渐变无装饰堆砌。
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import satori from "satori";
import sharp from "sharp";
import { SITE } from "../config/site";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** DESIGN.md §4.1 Light Theme：只取中性色 + 单一 accent */
const CANVAS = "#FBFBFD";
const INK = "#1D1D1F";
const INK_MUTED = "#656D76";
const INK_FAINT = "#8C959F";
const ACCENT = "#0071E3";

const FONT_FAMILY = "Noto Sans SC";
const FONT_FILE = resolve(process.cwd(), "src/assets/fonts/NotoSansSC-Regular.otf");

const SITE_HOST = new URL(SITE.url).host;
const OG_PADDING = 96;

let cachedFont: Buffer | undefined;
function fontData(): Buffer {
  cachedFont ??= readFileSync(FONT_FILE);
  return cachedFont;
}

type OgStyle = Record<string, string | number>;
type OgNode = { type: string; props: { style: OgStyle; children?: unknown } };

function el(style: OgStyle, children?: OgNode | OgNode[] | string): OgNode {
  return { type: "div", props: { style, children } };
}

function text(style: OgStyle, value: string): OgNode {
  return { type: "span", props: { style, children: value } };
}

/** 估算显示宽度：CJK/全角 ≈ 1em，其余（拉丁、数字、空白）≈ 0.55em */
function widthUnits(value: string): number {
  let units = 0;
  for (const ch of value) {
    units += (ch.codePointAt(0) ?? 0) > 0x2e7f ? 1 : 0.55;
  }
  return units;
}

/**
 * 长标题按宽度预算截断并追加「…」（satori 不支持多行 line-clamp）。
 * 中英文按同一预算度量，混排不会溢出版面；可容纳 3 行以内。
 */
function truncateToWidth(value: string, maxUnits: number): string {
  if (widthUnits(value) <= maxUnits) return value;
  let used = 0;
  let out = "";
  for (const ch of value) {
    const w = (ch.codePointAt(0) ?? 0) > 0x2e7f ? 1 : 0.55;
    if (used + w > maxUnits) break;
    used += w;
    out += ch;
  }
  return `${out.trimEnd()}…`;
}

/** 标题字号随长度分档：短标题更大，长标题收敛到 3 行以内 */
function titleFontSize(title: string): number {
  const units = widthUnits(title);
  if (units <= 12) return 80;
  if (units <= 26) return 68;
  return 58;
}

/** 品牌行：accent 竖向标记 + linwis（墨色）+ _（accent 下划线符） */
function brandRow(): OgNode {
  return el({ display: "flex", alignItems: "center", gap: "20px" }, [
    el({ width: "6px", height: "30px", backgroundColor: ACCENT }),
    el({ display: "flex", alignItems: "baseline" }, [
      text({ fontSize: "30px", color: INK, letterSpacing: "1px" }, "linwis"),
      text({ fontSize: "30px", color: ACCENT, letterSpacing: "1px" }, "_"),
    ]),
  ]);
}

/** 底部信息行：分类（accent，大写）· 域名（弱灰） */
function footerRow(category?: string): OgNode {
  const parts: OgNode[] = [];
  if (category) {
    parts.push(
      text(
        {
          fontSize: "24px",
          color: ACCENT,
          letterSpacing: "3px",
          textTransform: "uppercase",
        },
        category
      )
    );
    parts.push(text({ fontSize: "24px", color: INK_FAINT }, "·"));
  }
  parts.push(text({ fontSize: "24px", color: INK_FAINT, letterSpacing: "1px" }, SITE_HOST));
  return el({ display: "flex", alignItems: "center", gap: "16px" }, parts);
}

/** 画布骨架：1200×630 近白底 + 96px 内边距 + 上下两极对齐 */
function page(sections: OgNode[]): OgNode {
  return el(
    {
      width: `${OG_WIDTH}px`,
      height: `${OG_HEIGHT}px`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: `${OG_PADDING}px`,
      backgroundColor: CANVAS,
      fontFamily: FONT_FAMILY,
      color: INK,
    },
    sections
  );
}

async function renderToPng(tree: OgNode): Promise<Uint8Array<ArrayBuffer>> {
  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: [{ name: FONT_FAMILY, data: fontData(), weight: 400, style: "normal" }],
  });
  // satori 产出的 SVG width/height 即 1200/630，libvips 默认 72 DPI 光栅化
  // 得 1:1 像素图；resize 兜底保证输出严格为 1200×630。文字为矢量路径，
  // 光栅化不依赖系统字体，同名输入产出字节一致。
  const png = await sharp(Buffer.from(svg), { density: 72 })
    .resize(OG_WIDTH, OG_HEIGHT)
    .png()
    .toBuffer();
  // toBuffer() 返回 ArrayBufferLike 视图，拷贝为 ArrayBuffer-backed
  // 以满足 Response BodyInit（BufferSource）的类型要求
  return new Uint8Array(png);
}

/** 文章 OG 图：品牌行 + 居中大标题（自动换行/截断）+ 分类与域名 */
export async function renderPostOgImage(params: {
  title: string;
  category?: string;
}): Promise<Uint8Array<ArrayBuffer>> {
  const title = truncateToWidth(params.title.replace(/\s+/g, " ").trim(), 50);
  const tree = page([
    brandRow(),
    el(
      {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
      },
      text(
        {
          fontSize: `${titleFontSize(title)}px`,
          lineHeight: 1.35,
          color: INK,
        },
        title
      )
    ),
    footerRow(params.category),
  ]);
  return renderToPng(tree);
}

/** 站点默认 OG 图：大号品牌字标 + tagline + 域名 */
export async function renderDefaultOgImage(): Promise<Uint8Array<ArrayBuffer>> {
  const tree = page([
    el(
      {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        gap: "28px",
      },
      [
        el({ display: "flex", alignItems: "baseline" }, [
          text({ fontSize: "88px", color: INK, letterSpacing: "2px" }, "linwis"),
          text({ fontSize: "88px", color: ACCENT, letterSpacing: "2px" }, "_"),
        ]),
        text({ fontSize: "36px", color: INK_MUTED, letterSpacing: "1px" }, SITE.tagline),
      ]
    ),
    footerRow(),
  ]);
  return renderToPng(tree);
}
