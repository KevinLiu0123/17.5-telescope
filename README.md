# 17.5 吋望遠鏡計畫網站

清華大學天文社 × 清華大學天文台「17.5 吋牛頓反射式望遠鏡建置計畫」介紹網站。純 HTML / CSS / JS，不需要任何建置工具。

## 檔案結構

```
index.html   頁面內容（文字都在這裡改）
style.css    外觀樣式（顏色在最上方 :root 改）
script.js    星空背景、選單、分頁、經費長條圖、數字動畫
viewer.js         3D 檢視器原始碼（three.js r170，MIT 授權）
viewer.bundle.js  打包後實際載入的檔案
model/ota.js      3D 模型：由 OTA_assembly.stl 減面（56.7 萬 → 17 萬面）轉 GLB 後以 base64 內嵌
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
- **更新 3D 模型**：CAD 改版後把新的 STL 轉成 GLB（建議 3–5 MB 內），再轉成 `model/ota.js`（內容為 `window.OTA_GLB="<base64>";`）。
- **修改 3D 檢視器**：改 `viewer.js` 後執行 `npx esbuild viewer.js --bundle --minify --format=iife --outfile=viewer.bundle.js`（需先 `npm i three@0.170.0 esbuild`）。
- 直接雙擊 `index.html` 就能在本機預覽，3D 模型也可以操作。
