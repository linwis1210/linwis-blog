/**
 * 题注管线（构建期 remark 插件，零依赖）。
 *
 * `![alt](src "title")` → `<figure><img …><figcaption>title</figcaption></figure>`；
 * 无 title 的图片保持原样。复用 global.css 既有 `.prose figcaption` 样式。
 *
 * 实现：只改外层结构——把「仅含一张带 title 图片的段落」改名为 figure，
 * 并追加一个改名为 figcaption 的段落子节点（与 remark-callouts 相同的
 * hName 手法，节点类型保持 remark 标准类型，不发明自定义类型）。
 * image 节点的 url/alt 数据原样保留，后续 Astro 管线的
 * remarkCollectImages（收集相对路径）与 rehypeImages（改写为优化组件）
 * 都按节点类型遍历、与父节点无关，因此 figure 包装不破坏图片优化。
 *
 * 刻意保守的范围：仅处理「段落唯一子节点」的图片。
 * 行内混排（图文同段）或多图同段的 title 不包裹——避免产生
 * `<p><figure>` 非法嵌套；这类写法本就不该用作题注。
 */
import { visit } from "unist-util-visit";

function remarkFigure() {
  return (tree) => {
    visit(tree, "paragraph", (node) => {
      if (node.children?.length !== 1) return;
      const image = node.children[0];
      if (image.type !== "image") return;
      if (typeof image.title !== "string" || image.title.trim() === "") return;

      node.data ??= {};
      node.data.hName = "figure";
      node.data.hProperties = {};

      // title 文本落进 figcaption；从 img 上移除，避免悬停 tooltip 与题注重复
      const captionText = image.title;
      delete image.title;
      node.children.push({
        type: "paragraph",
        data: { hName: "figcaption" },
        children: [{ type: "text", value: captionText }],
      });
    });
  };
}

export default remarkFigure;
