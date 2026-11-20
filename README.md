# 17.5 吋望遠鏡計畫網站

清華大學天文社 × 清華大學天文台「17.5 吋牛頓反射式望遠鏡建置計畫」介紹網站。純 HTML / CSS / JS，不需要任何建置工具。

## 檔案結構

```
index.html   頁面內容（文字都在這裡改）
style.css    外觀樣式（顏色在最上方 :root 改）
script.js    星空背景、選單、分頁、經費長條圖、數字動畫
img/         圖片（設計圖、觀測資料、活動照片、社徽）
```

## 架到 GitHub Pages

1. 在 GitHub 建立新的 repository（例如 `telescope-17.5`），設為 Public。
2. 把這個資料夾裡的所有檔案上傳到 repository 根目錄（`index.html` 要在最外層）。
3. 進入 repository 的 **Settings → Pages**。
4. Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
5. 約一分鐘後，網站會出現在 `https://<你的帳號>.github.io/<repository 名稱>/`。

## 常見修改

- **新增 Facebook 連結**：在 `index.html` 搜尋「Facebook 粉專」，填入網址並取消註解。
- **更新經費數字**：改 `script.js` 裡的 `budget` 陣列，以及 `index.html` 中總預算的 `data-count`。
- **換成員照片**：把 `<div class="avatar">劉</div>` 換成 `<img class="avatar" src="img/xxx.jpg" alt="">`。
- **加入計畫進度**：可以在「計畫時程」區塊下方新增卡片，記錄每個階段完成的日期。
