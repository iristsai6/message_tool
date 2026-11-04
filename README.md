# 🍎 智慧批次模板生成小工具 (Smart Batch Message Generator)

![Version](https://img.shields.io/badge/version-2.0.0-amber)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Desktop-slate)

專為**補習班導師、行政老師與教育工作者**設計的自動化訊息生成小工具。
解決每週批次發送學員小考成績、閱讀進度、未達標提醒與群發通知時繁瑣的複製貼上與人工過濾流程。

---

## ✨ 核心特色與功能

- **📊 Excel 智慧解析與動態月份對應**：
  - 支援上傳 `.xlsx` 與 `.xls` 檔案。
  - 動態對應 1~12 月讀本小說成績（例如自動比對 `book_score(10)` 欄位）。
- **🎯 彈性過濾與條件篩選**：
  - **預設未達標**：自動比對小考與小說成績是否符合班級標準。
  - **獨立條件過濾**：可勾選「僅篩選小考未達標」或「僅篩選小說未達標」。
  - **全體群發模式**：一鍵開啟群發，忽略成績標準，直接讀取班級與姓名生成活動提醒通知。
- **📋 傳送狀態即時追蹤**：
  - 點擊「複製訊息」按鈕後，會自動將套用模板後的內容寫入剪貼簿。
  - 複製後按鈕自動變更為 **「已傳送 ✔」** 並轉為綠色背景，避免漏發或重複發送。
- **💾 歷史紀錄與設定持久化**：
  - 支援各班級標準自訂（例如：`150TH:85/6, 200TH:80/4`）。
  - 內建歷史紀錄面板，可隨時回溯過去發送的訊息與套用模板。
- **🌐 雙端支援（純網頁版 + Python PyQt6 桌面版）**：
  - **網頁版**：零安裝，打開瀏覽器即可直接讀取 Excel 進行處理（資料完全在本機瀏覽器處理，不傳送至伺服器，安全無虞）。
  - **桌面版**：提供 Python GUI 程式碼與打包 `.exe` 指南。

---

## 🚀 快速開始 (Quick Start)

### 網頁版 (Web Version)

直接下載專案中的 `index.html` 與 `icon.png` 放置於同一資料夾，雙擊 `[此處](https://iristsai6.github.io/message_tool/)` 即可使用。

### 本地開發 (Desktop Python Version)

1. **複製專案庫 (Clone Repository)**：
   ```bash
   git clone https://github.com/your-username/smart-batch-message-generator.git
   cd smart-batch-message-generator
   ```

2. **安裝所需 Python 套件**：
   ```bash
   pip install PyQt6 pandas openpyxl
   ```

3. **啟動小工具**：
   ```bash
   python app.py
   ```

4. **打包為 `.exe` 執行檔 (使用 PyInstaller)**：
   ```bash
   pyinstaller --noconsole --onefile --icon=icon.png app.py
   ```
   打包完成後，可於 `dist/` 資料夾找到 `app.exe`。

---

## 📂 Excel 檔案格式說明

小工具能自動相容各種欄位大小寫，建議欄位如下：

| id | class | name | test_score | book_score(10) | 加強項目 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 123 | 150TH | 周傑倫 | 53 | 4 | 小說,小考 |
| 4502 | 150TH | 蔡伊琳 | 97 | 6 | - |
| 1304 | 150TH | 王結 | 95 | 6 | - |

---

## 📝 訊息模板變數說明

模板中可以使用花括號 `{}` 來引用 Excel 中的欄位：

- `{name}`：學生姓名
- `{class}`：班級名稱
- `{test_score}`：小考成績
- `{book_score}`：小說成績（自動對應選取月份）
- `{加強項目}`：自訂加強欄位

---

## 🛠️ 技術堆疊 (Tech Stack)

- **前端**：React 18, Tailwind CSS, SheetJS (XLSX)
- **桌面端**：Python 3, PyQt6, Pandas, PyInstaller

---

## 📜 聲明與致謝

- **Icon Attribution**: <a target="_blank" href="https://icons8.com/icon/SMD8PzZeIivy/minecraft-golden-apple">Minecraft Golden Apple</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>

---

## 📄 License

This project is licensed under the MIT License.