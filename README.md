# typescript-glyph-long-text-append-flicker-demo

## 简介

与 Ink 闪屏 demo 同场景，用 **@semos-labs/glyph**（字符级双缓冲 diff）跑：120 行静态前缀 + 120 行末行每秒 append「字」。

**稳定性**：同场景下 **无全局闪烁**，整体还可以（Ink 易整屏重绘闪一下）。

**滚动说明**：Glyph 走 alt screen，**不支持终端原生 scrollback / 滚动条**（鼠标滚轮不会滚终端历史）。长内容需用 Glyph 自带 **`ScrollView`**（本 demo 已包一层）。

**复杂项目里的滚动体验（未深究）**：曾在更复杂项目里试 Glyph，滚动有点不稳定——向前翻几页后，若又有新内容输出，视窗会自动往下滚一点，但**不会滚到底**；不确定是集成方式问题还是 Glyph 本身。后来选了 Storm，就没继续排查，先记在这里。

## 快速开始

```bash
pnpm install
pnpm start
```

按 `q` 退出。

## 对照

- 静态区：`[static …]`
- 会变区：`[grow …]`
