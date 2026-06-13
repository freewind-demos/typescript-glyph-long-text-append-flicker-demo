# typescript-glyph-long-text-append-flicker-demo

## 简介

与 Ink 闪屏 demo 同场景，用 **@semos-labs/glyph**（字符级双缓冲 diff）跑：120 行静态前缀 + 120 行末行每秒 append「字」。

## 快速开始

```bash
pnpm install
pnpm start
```

按 `q` 退出。

## 对照

- 静态区：`[static …]`
- 会变区：`[grow …]`
