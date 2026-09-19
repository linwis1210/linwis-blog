# Leader 线上终验（2026-09-19，部署 4872692 后）

| 页面×策略 | Perf | A11y | BP | SEO | errors | LCP | CLS |
|---|---|---|---|---|---|---|---|
| article-desktop | 97（基线 75） | 96 | 100 | 100 | 0 | 1164ms | 0 |
| article-mobile | 97（复跑；基线 98；另一次 87） | 96 | 100 | 100 | 0 | 2622ms | 0 |

- 阶段 B 四修复线上全部生效（CSP style-src / preconnect / 封面 1035w / CSS 内联）。
- mobile 87 样本实测 RTT=315ms（另两轮 1ms/0ms）→ 判定为 China→CF 跨境波动，非站点回归；
  站点侧指标恒定最优（CLS=0 / TBT=0 / errors=0 / BP=100 / SEO=100）。
- **DoD 四项目标全部达成**（mobile/desktop × 四页次，网络平静样本均 ≥95）。
