/* ================================================================
   17.5 吋望遠鏡 · 製作日誌資料
   ----------------------------------------------------------------
   ★ 社員只需要改這個檔案，網站的「製作日誌」頁和首頁進度會自動更新。
   ★ 在 GitHub 網頁上打開這個檔案 → 按右上角鉛筆圖示編輯 → 存檔（Commit）。

   【新增一則日誌】複製下面這段，貼到 entries 的「最上面」，改內容：

    {
      date: "2026-12-05",              // 日期：YYYY-MM-DD（只知道月份可寫 "2026-12"）
      title: "主鏡座 CNC 加工完成",      // 標題
      author: "鄭亦家",                 // 寫的人（可留空 ""）
      tags: ["加工"],                   // 從下方 TAGS 選，可多個
      text: "第一段內容。\n\n空一行就是新段落。",
      images: [                         // 沒照片就寫 images: []
        { src: "img/log/2026-12-05-mirror-cell.jpg", caption: "照片說明" }
      ],
      link: ""                          // 相關連結（IG 貼文、影片…），沒有就留空
    },

   【照片】上傳到 img/log/ 資料夾，檔名建議「日期-簡短英文.jpg」，
          寬度 1600px 以內、每張 < 500 KB，手機才載得快。

   【更新里程碑】把 status 改成 "done"（完成）、"doing"（進行中）或 "todo"（未開始），
               完成的話順便填上 date。

   ⚠ 注意：每一筆 { } 後面要有逗號，字串要用英文雙引號 " "。
          改壞了網頁會顯示「資料格式錯誤」（上線後會標出行號），照提示修正即可。
   ================================================================ */

window.PROGRESS = {

  /* 標籤（名稱：顏色）。可以自己新增 */
  TAGS: {
    "設計": "#b18cff",
    "加工": "#ff9f6b",
    "採購": "#6bc7ff",
    "組裝": "#ffd27a",
    "測試": "#7be0a8",
    "觀測": "#ff7aa8",
    "活動": "#f2a3ff",
    "歷史": "#a5a2c2",
    "其他": "#c9c9c9"
  },

  /* ---------- 里程碑：依計畫書四個階段 ---------- */
  milestones: [
    { phase: 1, title: "主鏡量測與歷史考證",           status: "done",  date: "2022-11" },
    { phase: 1, title: "鏡筒 3D 結構設計（Fusion 360）", status: "done",  date: "" },
    { phase: 1, title: "完成計畫書與預算",             status: "done",  date: "" },
    { phase: 1, title: "確認 GSO 冠昇光學技術合作",     status: "doing", date: "" },

    { phase: 2, title: "募款與歷屆社員交流活動",         status: "todo",  date: "" },
    { phase: 2, title: "採購赤道儀、相機與光學配件",     status: "todo",  date: "" },
    { phase: 2, title: "鏡筒零件 CNC 加工",            status: "todo",  date: "" },
    { phase: 2, title: "三段鏡筒組裝",                 status: "todo",  date: "" },
    { phase: 2, title: "第一次光軸校正",               status: "todo",  date: "" },

    { phase: 3, title: "First Light 第一道星光",       status: "todo",  date: "" },
    { phase: 3, title: "測光精度與追蹤測試",            status: "todo",  date: "" },
    { phase: 3, title: "第一筆 ExoClock 系外行星數據",  status: "todo",  date: "" },
    { phase: 3, title: "第一次移地暗空觀測",            status: "todo",  date: "" },

    { phase: 4, title: "成果發表",                     status: "todo",  date: "" },
    { phase: 4, title: "首場以 17.5 吋為主角的觀星活動", status: "todo",  date: "" },
    { phase: 4, title: "納入星空之子天文營教學",        status: "todo",  date: "" }
  ],

  /* ---------- 日誌：新的寫在最上面 ---------- */
  entries: [
    {
      date: "2026-11-21",
      title: "計畫網站上線，3D 模型可以轉著看了",
      author: "",
      tags: ["設計", "其他"],
      text: "我們把計畫的來龍去脈整理成這個網站，也把 Fusion 360 的整支鏡筒模型放上來，可以直接在網頁上拖曳旋轉。\n\n之後每一次進展都會記錄在這個日誌裡，歡迎常回來看看。",
      images: [
        { src: "img/telescope-full.jpg", caption: "鏡筒整體 3D 結構" }
      ],
      link: ""
    },
    {
      date: "2024-09-17",
      title: "中秋路邊天文：三台望遠鏡，數百位觀眾",
      author: "",
      tags: ["活動"],
      text: "天文社與天文台在中秋節合辦賞月觀星，架了三台望遠鏡，現場人潮一直沒斷過。\n\n這晚讓我們確定一件事：人們並不是不喜歡天文，而是缺乏接觸的渠道。這也是我們想做一支更大望遠鏡的原因。",
      images: [
        { src: "img/mid-autumn-2024.jpg", caption: "2024 中秋觀星活動" }
      ],
      link: ""
    },
    {
      date: "2022-11-12",
      title: "一面大鏡片重見天日",
      author: "",
      tags: ["歷史"],
      text: "物理系光學實驗室搬遷，兩位副社長巧遇退休的施宙聰教授。施教授想起實驗室裡一面閒置多年的大鏡片，交給了天文社。\n\n我們原以為是創社望遠鏡遺失的 16 吋主鏡，量了才發現是 17.5 吋——1986 年學長姊從美國 Coulter 公司買回來、沉睡了快四十年的那一面。",
      images: [],
      link: ""
    }
  ]
};
