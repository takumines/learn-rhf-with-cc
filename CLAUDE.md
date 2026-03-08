# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev    # 開発サーバー (http://localhost:3000)
pnpm build
pnpm lint
```

## 構造

Next.js App Router。`app/phase{1-4}/` 配下に各セクションのページを実装していく。詳細は `LEARNING.md` 参照。

## ルール

- フェーズを進める際に得た新しい知見は `INSIGHTS.md` に追記する
- コードレビュー時にバグや不備を発見した場合、AIはバグの指摘のみ行い、修正はhuman自身が行う
- RHFの実装は基本的にhuman自身が行う。AIはヒントや解説を提供するに留める
