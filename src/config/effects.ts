/**
 * 纯视觉增强开关 — 全部为渐进增强，关闭时不渲染任何 DOM/脚本。
 * 颜色 / 形态细节在 global.css 的对应段落调整。
 */
export const EFFECTS = {
  /**
   * 总开关：false 时鼠标特效完全不输出。
   * DESIGN.md §23/§24 反对装饰性 emoji UI 与浮夸动效，故默认关闭；
   * 需要时改回 true 即可整体恢复。
   */
  enabled: false,
  /** 卡片 spotlight：悬停时以鼠标位置为中心泛起高光 */
  cardSpotlight: true,
  /** 光标样式轮换：每次点击在 5 种形态间循环（点 / 点+环 / 反色点 / 文字标签 / Emoji） */
  cursorRotation: true,
  /** 点击特效轮换：每次点击在 5 种特效间循环（火花 / 纸屑 / Emoji / 涟漪 / 方块） */
  clickRotation: true,
} as const;
