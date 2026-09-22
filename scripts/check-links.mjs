/**
 * scripts/check-links.mjs
 * 全站静态死链检查器 (Broken Link Checker)
 *
 * 遍历 dist/ 下的所有 HTML 页面，递归校验：
 * 1. 站内链接 (<a href>) 的有效性（包括根相对路径与相对路径）
 * 2. 页面内与跨页锚点目标 (#heading-id) 的存在性
 * 3. 图片与媒体资源 (<img src>, <img srcset>, <source srcset>) 的存在性
 * 4. 支持 --external 选项异步检测外部链接（默认关闭，保证秒级离线自检）
 */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import https from "node:https";

const ROOT_DIR = process.cwd();
const DIST_DIR = path.resolve(ROOT_DIR, "dist");

const checkExternal = process.argv.includes("--external");

if (!fs.existsSync(DIST_DIR)) {
  console.error("❌ 错误：dist 目录不存在，请先执行 `npm run build`。");
  process.exit(1);
}

const startTime = performance.now();

/**
 * 递归收集指定目录下所有 HTML 文件
 */
function getHtmlFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(DIST_DIR);
if (htmlFiles.length === 0) {
  console.warn("⚠️ 警告：dist 目录下未找到任何 HTML 文件。");
  process.exit(0);
}

/**
 * 预解析所有 HTML：缓存内容、行起始偏移量、以及页面内的所有 DOM ID
 */
/**
 * 保持行号与字符偏移完全一致的前提下，将 HTML 注释、<script> 与 <style> 内容替换为空白字符，
 * 避免 JavaScript 模板字符串或样式规则中包含的 URL 引起误报。
 */
function stripNonDomContent(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, (match) => match.replace(/[^\r\n]/g, " "))
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (match, body) => {
      const replacedBody = body.replace(/[^\r\n]/g, " ");
      return match.slice(0, match.indexOf(body)) + replacedBody + "</script>";
    })
    .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (match, body) => {
      const replacedBody = body.replace(/[^\r\n]/g, " ");
      return match.slice(0, match.indexOf(body)) + replacedBody + "</style>";
    });
}

const pagesCache = new Map();

for (const filePath of htmlFiles) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const content = stripNonDomContent(rawContent);

  // 计算每一行在文本中的起始字符索引，便于二分查找行号
  const lineStarts = [0];
  for (let i = 0; i < content.length; i++) {
    if (content[i] === "\n") {
      lineStarts.push(i + 1);
    }
  }

  // 提取页面内所有 ID 和 name（锚点定位目标）
  const ids = new Set();
  const idRegex = /\s(?:id|name)=["']([^"']+)["']/gi;
  let match;
  while ((match = idRegex.exec(content)) !== null) {
    const rawId = match[1];
    ids.add(rawId);
    try {
      ids.add(decodeURIComponent(rawId));
    } catch {
      // 忽略无法 decode 的特殊字符串
    }
  }

  pagesCache.set(filePath, { content, lineStarts, ids });
}

/**
 * 根据字符偏移索引快速计算行号（1-indexed）
 */
function getLineNumber(lineStarts, index) {
  let low = 0;
  let high = lineStarts.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (lineStarts[mid] <= index) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return low;
}

/**
 * 尝试在 dist 目录下定位内部路径对应的真实磁盘文件
 */
function resolveInternalPath(baseDir, rawPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(rawPath);
  } catch {
    decoded = rawPath;
  }

  let resolved;
  if (decoded.startsWith("/")) {
    resolved = path.join(DIST_DIR, decoded.slice(1));
  } else {
    resolved = path.resolve(baseDir, decoded);
  }

  // 确保没有跨出 dist 目录
  const relativeFromDist = path.relative(DIST_DIR, resolved);
  if (relativeFromDist.startsWith("..") || path.isAbsolute(relativeFromDist)) {
    return null;
  }

  // 1. 命中真实文件（如 /favicon.svg、/rss.xml、/_astro-v2/xxx.css）
  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
    return resolved;
  }

  // 2. 目录形态，命中 index.html（如 /blog/ 或 /blog -> dist/blog/index.html）
  const indexPath = path.join(resolved, "index.html");
  if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
    return indexPath;
  }

  // 3. 命中直接以 .html 命名的文件（如 /404 -> dist/404.html）
  const htmlPath = resolved + ".html";
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    return htmlPath;
  }

  return null;
}

const errors = [];
const externalLinks = new Set();

let totalLinksChecked = 0;
let totalAnchorsChecked = 0;
let totalImagesChecked = 0;

for (const [filePath, pageData] of pagesCache.entries()) {
  const { content, lineStarts, ids: sourceIds } = pageData;
  const fileDir = path.dirname(filePath);
  const relSourcePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");

  // -------------------------------------------------------------------------
  // 1. 检查 <a href="...">
  // -------------------------------------------------------------------------
  const aRegex = /<a\s+[^>]*?href=["']([^"']*)["'][^>]*>/gi;
  let aMatch;

  while ((aMatch = aRegex.exec(content)) !== null) {
    const rawUrl = aMatch[1].trim();
    const line = getLineNumber(lineStarts, aMatch.index);
    totalLinksChecked++;

    // 协议过滤
    if (
      !rawUrl ||
      rawUrl.startsWith("mailto:") ||
      rawUrl.startsWith("tel:") ||
      rawUrl.startsWith("javascript:") ||
      rawUrl.startsWith("data:")
    ) {
      continue;
    }

    // 外链处理
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://") || rawUrl.startsWith("//")) {
      // 若包含本站域名，转为站内路径处理
      const siteOrigins = ["https://linwis.pages.dev", "http://linwis.pages.dev"];
      const matchedOrigin = siteOrigins.find((origin) => rawUrl.startsWith(origin));

      if (matchedOrigin) {
        const localPath = rawUrl.slice(matchedOrigin.length) || "/";
        verifyInternalLink(localPath, filePath, line, rawUrl);
      } else if (checkExternal) {
        externalLinks.add(rawUrl);
      }
      continue;
    }

    verifyInternalLink(rawUrl, filePath, line, rawUrl);
  }

  // -------------------------------------------------------------------------
  // 2. 检查图片资源 (<img src="...">)
  // -------------------------------------------------------------------------
  const imgSrcRegex = /<img\s+[^>]*?src=["']([^"']*)["'][^>]*>/gi;
  let imgMatch;

  while ((imgMatch = imgSrcRegex.exec(content)) !== null) {
    const rawSrc = imgMatch[1].trim();
    const line = getLineNumber(lineStarts, imgMatch.index);
    totalImagesChecked++;

    if (
      !rawSrc ||
      rawSrc.startsWith("data:") ||
      rawSrc.startsWith("http://") ||
      rawSrc.startsWith("https://") ||
      rawSrc.startsWith("//")
    ) {
      continue;
    }

    verifyAsset(rawSrc, fileDir, line, relSourcePath);
  }

  // -------------------------------------------------------------------------
  // 3. 检查响应式图片候选 (<img srcset="..."> 与 <source srcset="...">)
  // -------------------------------------------------------------------------
  const srcsetRegex = /(?:<img|<source)\s+[^>]*?srcset=["']([^"']*)["'][^>]*>/gi;
  let srcsetMatch;

  while ((srcsetMatch = srcsetRegex.exec(content)) !== null) {
    const rawSrcset = srcsetMatch[1].trim();
    const line = getLineNumber(lineStarts, srcsetMatch.index);

    const candidates = rawSrcset.split(",").map((s) => s.trim());
    for (const cand of candidates) {
      if (!cand) continue;
      const urlPart = cand.split(/\s+/)[0];
      totalImagesChecked++;

      if (
        !urlPart ||
        urlPart.startsWith("data:") ||
        urlPart.startsWith("http://") ||
        urlPart.startsWith("https://") ||
        urlPart.startsWith("//")
      ) {
        continue;
      }

      verifyAsset(urlPart, fileDir, line, relSourcePath);
    }
  }

  /**
   * 校验内部链接与锚点目标
   */
  function verifyInternalLink(linkUrl, currentFilePath, line, originalUrl) {
    const [pathWithQuery, ...hashParts] = linkUrl.split("#");
    const hash = hashParts.length > 0 ? hashParts.join("#") : null;
    const pathname = pathWithQuery.split("?")[0];

    // 情况 A：纯同页锚点（例如 href="#main" 或 href="#"）
    if (!pathname) {
      if (!hash || hash === "top") {
        return; // 空 hash 或 #top 默认滚动至顶部，视作有效
      }

      totalAnchorsChecked++;
      const decodedHash = decodeHash(hash);
      if (!sourceIds.has(hash) && !sourceIds.has(decodedHash)) {
        errors.push({
          file: relSourcePath,
          line,
          target: originalUrl,
          reason: `同页锚点 "#${hash}" 在当前页面中未找到对应元素 ID`,
        });
      }
      return;
    }

    // 情况 B：路径链接（可带或不带锚点）
    const resolvedTarget = resolveInternalPath(fileDir, pathname);
    if (!resolvedTarget) {
      errors.push({
        file: relSourcePath,
        line,
        target: originalUrl,
        reason: `目标文件或路由不存在：${pathname}`,
      });
      return;
    }

    // 若携带跨页锚点且目标为 HTML 页面，校验目标页 ID
    if (hash && resolvedTarget.endsWith(".html")) {
      totalAnchorsChecked++;
      const targetPageData = pagesCache.get(resolvedTarget);
      if (targetPageData) {
        const decodedHash = decodeHash(hash);
        if (!targetPageData.ids.has(hash) && !targetPageData.ids.has(decodedHash)) {
          const relTarget = path.relative(ROOT_DIR, resolvedTarget).replace(/\\/g, "/");
          errors.push({
            file: relSourcePath,
            line,
            target: originalUrl,
            reason: `跨页锚点 "#${hash}" 在目标页面 ${relTarget} 中未找到对应元素 ID`,
          });
        }
      }
    }
  }

  /**
   * 校验静态资源文件存在性
   */
  function verifyAsset(assetUrl, baseDir, line, sourceFile) {
    const cleanPath = assetUrl.split("?")[0].split("#")[0];
    const resolved = resolveInternalPath(baseDir, cleanPath);
    if (!resolved) {
      errors.push({
        file: sourceFile,
        line,
        target: assetUrl,
        reason: `静态资源文件不存在：${cleanPath}`,
      });
    }
  }
}

function decodeHash(h) {
  try {
    return decodeURIComponent(h);
  } catch {
    return h;
  }
}

/**
 * 异步校验外部链接（当且仅当指定 --external 参数）
 */
async function testExternalLinks(urls) {
  console.log(`\n🌐 正在检测 ${urls.size} 个外部链接有效性...`);
  const failed = [];

  const checkUrl = (url) =>
    new Promise((resolve) => {
      let client;
      try {
        const parsed = new URL(url);
        client = parsed.protocol === "https:" ? https : http;
      } catch {
        resolve({ url, status: "Invalid URL format" });
        return;
      }

      const req = client.request(
        url,
        {
          method: "HEAD",
          timeout: 7000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        },
        (res) => {
          if (res.statusCode && res.statusCode < 400) {
            resolve({ url, ok: true, status: res.statusCode });
          } else {
            // 某些服务器拒绝 HEAD 请求，回退尝试 GET
            const getReq = client.get(
              url,
              {
                timeout: 7000,
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
              },
              (getRes) => {
                getRes.destroy();
                resolve({
                  url,
                  ok: (getRes.statusCode ?? 500) < 400,
                  status: getRes.statusCode,
                });
              }
            );
            getReq.on("error", (e) => resolve({ url, ok: false, status: e.message }));
            getReq.on("timeout", () => {
              getReq.destroy();
              resolve({ url, ok: false, status: "Timeout" });
            });
          }
        }
      );

      req.on("error", (e) => resolve({ url, ok: false, status: e.message }));
      req.on("timeout", () => {
        req.destroy();
        resolve({ url, ok: false, status: "Timeout" });
      });
      req.end();
    });

  // 并发限制 10
  const urlArray = Array.from(urls);
  const results = [];
  const chunkSize = 10;
  for (let i = 0; i < urlArray.length; i += chunkSize) {
    const chunk = urlArray.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(checkUrl));
    results.push(...chunkResults);
  }

  for (const res of results) {
    if (!res.ok) {
      failed.push(res);
    }
  }

  return failed;
}

// 主流程执行
async function main() {
  let externalFailures = [];
  if (checkExternal && externalLinks.size > 0) {
    externalFailures = await testExternalLinks(externalLinks);
  }

  const duration = (performance.now() - startTime).toFixed(1);

  console.log("\n==========================================");
  console.log("🔍 全站静态死链检查报告 (Broken Link Check)");
  console.log("==========================================");
  console.log(`📄 扫描页面数：${htmlFiles.length}`);
  console.log(`🔗 校验链接数：${totalLinksChecked}`);
  console.log(`⚓ 校验锚点数：${totalAnchorsChecked}`);
  console.log(`🖼️  校验资源数：${totalImagesChecked}`);
  console.log(`⏱️  检测总耗时：${duration}ms`);

  if (errors.length > 0) {
    console.error(`\n❌ 发现 ${errors.length} 处内部死链或无效资源引用：\n`);
    errors.forEach((err, idx) => {
      console.error(
        `[${idx + 1}] ${err.file}:${err.line}\n    目标: ${err.target}\n    原因: ${err.reason}\n`
      );
    });
  }

  if (externalFailures.length > 0) {
    console.warn(`\n⚠️  发现 ${externalFailures.length} 个外部链接访问异常（仅提示，不阻断）：\n`);
    externalFailures.forEach((item, idx) => {
      console.warn(`[${idx + 1}] ${item.url} -> 状态: ${item.status}`);
    });
  }

  if (errors.length > 0) {
    process.exit(1);
  }

  console.log("\n✅ 全站内部链接与静态资源引用 100% 有效，检查通过！\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("检查脚本发生未捕获异常：", err);
  process.exit(1);
});
