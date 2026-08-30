# ペラっと（Peratto）

29卒向けインターン参加支援。中央のアイランドウィンドウで絵本を読み、初日だけアイスブレイクに参加する Web アプリ。

## セットアップ

```bash
npm install
cp .env.example .env
# .env の NUXT_ADMIN_PASS を設定（本番では必ず強いパスワードに変更）
npm run dev
```

| URL | 用途 |
|-----|------|
| `/` | ホーム・本棚 |
| `/book/[id]` | 絵本 |
| `/icebreak` | アイスブレイク参加 |
| `/screen` | 会場投影 |
| `/admin` | 管理（URL 直アクセス） |

## 試作運用の制約（重要）

このリポジトリは **当日試作** 向けです。本番 hundreds 人規模を想定していません。

| 項目 | 制約 |
|------|------|
| 状態 | **`.data/` に JSON + 画像ファイル**。単一 Node プロセス前提 |
| プロセス | **1 プロセス 1 ルーム**。水平スケール不可 |
| 参加者 | 最大 **20 人** |
| 管理者 | `NUXT_ADMIN_USER` / `NUXT_ADMIN_PASS`（環境変数） |
| プレイヤー | join 時に `playerSecret` 発行。submit/vote に必須 |
| 本の非公開 | 一覧非表示 + `/api/books/[id]` で readable チェック（本文はバンドル内） |
| 読書リワード | `localStorage` のみ。デバイス間で共有されない |

## デプロイ

- **推奨:** 単一 Node プロセス（`node .output/server/index.mjs`）を long-running で運用
- **非推奨:** サーバーレス・複数インスタンス（状態が分裂する）
- 本番前: 環境変数設定、HTTPS、`NUXT_ADMIN_PASS` ローテーション

## テスト

```bash
npm test
```

## 技術スタック

Nuxt 4 + Vue 3 + Nitro + TypeScript。永続化は `.data/` のみ。詳細は `docs/04-設計書.md` §2・§3。

## ドキュメント

- `docs/01-企画総書.md`
- `docs/02-ワードレポート.md`
- `docs/03-コンテンツ詳細.md`
- `docs/04-設計書.md`
