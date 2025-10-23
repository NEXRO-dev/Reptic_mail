# Reptic 外部テスター用メール収集サイト

Reptic の外部テスター募集のためにメールアドレスを収集し、Google スプレッドシートに保存する静的サイト + Google Apps Script（GAS）の構成です。

## 構成
- `index.html`: 登録フォーム（hidden iframe で GAS に POST）
- `styles.css`: スタイル
- `script.js`: バリデーション/送信 UI、GAS の URL 設定
- `Code.gs`: スプレッドシートに追記する GAS コード

## 準備（スプレッドシート）
1. Google スプレッドシートを新規作成
2. シート名は任意（デフォルトは `Emails` を想定）
3. URL からスプレッドシート ID を控える（`/d/` と `/edit` の間の文字列）

## GAS セットアップ手順
1. Apps Script を新規作成（スプレッドシートに紐付け or スタンドアロンどちらでも可）
2. `Code.gs` の内容を貼り付け、以下を編集
```js
const SPREADSHEET_ID = 'PUT_YOUR_SPREADSHEET_ID'; // スプレッドシート ID
const SHEET_NAME = 'Emails'; // シート名（任意）
```
3. デプロイ → 新しいデプロイ → 種類: ウェブアプリ
   - 実行するアプリ: 自分
   - アクセスできるユーザー: 全員（匿名を含む）
   - デプロイ後の「ウェブアプリのURL」をコピー

## フロントエンドの設定
1. `script.js` の冒頭で GAS の URL を設定
```js
const GAS_WEB_APP_URL = 'REPLACE_WITH_YOUR_GAS_WEB_APP_URL';
```
2. `index.html` をブラウザで開き、テスト送信
   - 成功: 「登録が完了しました」表示 + スプレッドシートに `[Timestamp, Email]` 追記
   - 重複: 「すでに登録済み」表示

## デプロイ（任意）
- GitHub Pages / Netlify / Vercel などの静的ホスティングに配置可能（サーバー不要）

## 実装のポイント（CORS 対応）
- `<form>` を hidden iframe に対して POST→ GAS が HTML を返却 → `postMessage` で親に結果通知

## よくある質問
- プライバシーポリシー: `index.html` のリンク先を自社のURLに変更してください
- reCAPTCHA: v2 Invisible などを追加可能（要別途実装）
- 追加項目: `doPost` の `e.parameter.xxx` を読み取り、列を増やして保存してください
