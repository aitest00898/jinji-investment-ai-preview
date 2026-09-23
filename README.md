# 金雞 Investment AI — Design preview

PWA 與 LINE 查詢介面的靜態互動設計提案。所有場地、代養主、使用者與金額皆為人工虛構範例。

可切換 PWA／LINE、紙白／墨黑、朱砂／橄欖；可操作期間查詢、結算明細、風險與編輯確認流程。

明細在原位開啟：手機使用底部浮層，桌面使用置中浮層。下拉頂部把手、點背景、關閉鍵或 Esc 可收合，保留捲動位置與鍵盤焦點。單水明細支援左右滑動及上一水／下一水操作。

此版本未串接 Cloudflare AI、LINE Messaging API、資料庫或正式資料，亦尚未提供可安裝與離線功能。AI 解讀使用本地示範回覆；編輯只影響目前頁面，重新載入即還原。

## Preview locally

```sh
python3 -m http.server 4373 --bind 127.0.0.1
```

開啟 http://127.0.0.1:4373/。不需要 Node、套件安裝或 API key。

## GitHub Pages

儲存庫的 Pages source 設為 GitHub Actions 後，推送至 `main` 會觸發部署。流程只發布 `index.html`、`build.json` 與 `.nojekyll`，並在網頁及 `build.json` 寫入來源 commit SHA。

本預覽不包含需求規格庫、正式資料或匯入檔案。
