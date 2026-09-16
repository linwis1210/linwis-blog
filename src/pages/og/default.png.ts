/**
 * 站点默认 OG 图端点（构建期静态生成）：/og/default.png → 1200×630 PNG。
 * 首页、关于页等非文章页面的 og:image / twitter:image 兜底。
 */
import type { APIRoute } from "astro";
import { renderDefaultOgImage } from "../../lib/og";

export const GET: APIRoute = async () => {
  const png = await renderDefaultOgImage();
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
