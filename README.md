# 🍎 [批次模板生成小工具](https://iristsai6.github.io/message_tool/)

![Version](https://img.shields.io/badge/version-2.0.0-amber)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Desktop-slate)

專為**補習班導師、行政老師與教育工作者**設計的自動化訊息生成與班務管理小工具。解決每週批次發送學員小考成績、閱讀進度、未達標提醒與群發通知時繁瑣的複製貼上與人工過濾流程。

本專案提供 **純網頁單檔版 (`index.html`)** 與 **Python PyQt6 桌面版 (`app.py`)** 雙端版本，資料皆於本機端處理，資訊安全無虞。

---

## ✨ 核心特色與功能 

*v2.0.0*

- **🏫 班級群組管理與名單分群區分**：
  - 支援視覺化新增、編輯與刪除不同班級群組（例如 `150TH`、`200TH`、`300TU`），並獨立設定各班小考與小說達標門檻。
  - 右側預覽區新增「**班級群組區分**」切換頁籤，可單獨檢視特定班級名單並一鍵複製該班級的所有通知訊息。
- **🔗 內建縮網址 URL 小工具**：
  - 支援將長網址（如 Google 表單、線上測驗連結）一鍵縮短（整合 `is.gd` 與 `TinyURL` 雙重備援）並自動複製到剪貼簿，還可直接點擊「插入模板」加入訊息尾端。
- **📥 一鍵輸出／複製標準 Excel 範本**：
  - 內建標準範本產生器，點擊即可下載對應月份的 `.xlsx` 範例檔，並同步將欄位格式複製到剪貼簿，方便直接在 Excel 或 Google 試算表中按 `Ctrl+V` 貼上建立名單。
- **🎯 按鈕化篩選與全體群發模式**：
  - 將過濾條件簡化為直覺的切換按鈕：「**群發模式**」、「**小考未達標**」、「**小說未達標**」，即時動態篩選名單。
- **📊 Excel 智慧解析與動態月份對應**：
  - 支援上傳 `.xlsx`、`.xls` 與 `.csv` 檔案。
  - 自動對應 1\~12 月讀本成績欄位（例如 `BookScore(11)`，並向下相容舊版 `book_score(11)`）。
- **📋 傳送狀態即時追蹤與 RWD 介面**：
  - 點擊「複製訊息」後自動寫入剪貼簿並標記為 **「已傳送 ✔」**，避免漏發或重複發送；網頁版支援手機、平板與桌機自適應操作，並可自由拖曳調整表格欄寬與列高。
- **💾 歷史紀錄持久化**：
  - 網頁版採用 `LocalStorage` 儲存設定與歷史批次紀錄；桌面版採用 `QThread` 非同步運算與 `Atomic Write` 原子寫入本機 `history.json`。


*v1.2.0*

- **📱 RWD 響應式介面設計**：
  - 全面優化主介面
  - 設定對話框與歷史紀錄檢視視窗，支援各種尺寸的行動裝置與桌機操作
- **🚀 自動化 CI/CD 部署**:
  - 導入 GitHub Actions 與 GitHub Pages，讓網頁版程式碼推播後即可自動發布更新
- **📊 欄位彈性與一致性對應**：
  - 全面整合 `studentMec`（學號/項次）、`studentName`（中文姓名）、`englishName`（英文名）與 `BookCount(月份)` 讀本追蹤欄位
- **⚙️ 本機與歷史資料保存**：
  - 延續穩定可靠的 LocalStorage 狀態管理與歷史紀錄備份功能，換裝置也不怕資料丟失
    
*v1.1.0*

- **📊 Excel 智慧解析與動態月份對應**：
  - 支援上傳 `.xlsx` 、 `.xls`、`.csv` 和 `.json`檔案
  - 動態對應 1~12 月讀本小說成績（自動比對 `BookCount(月份)` 欄位）

- **🎯 彈性過濾與條件篩選**：
  - **預設未達標**：自動比對小考與小說成績是否符合班級標準
  - **獨立條件過濾**：可勾選「僅篩選小考未達標」或「僅篩選小說未達標」
  - **全體群發模式**：一鍵開啟群發，忽略成績標準，直接讀取班級與姓名生成活動提醒通知

- **🖱️ 互動式表格自由調整與滑動優化 (v1.1.0 新增)**：
  - **自由調整欄寬與列高**：將滑鼠移至表頭右側邊緣或資料列下方邊緣，按住即可隨心所欲拖曳調整尺寸
  - **雙向捲動與行動裝置支援**：完美支援桌機與行動裝置的自適應佈局，視窗縮小或手機瀏覽時可順暢滑動
  - **生成內容可折疊**：預覽內容支援「展開/收合」按鈕，長篇訊息檢視更清爽不佔空間

- **📋 傳送狀態即時追蹤與人性化排版**：
  - **快速操作優先**：將「快速操作」按鈕欄位調整至表格最左側第一欄，點擊複製更直覺、不需向右捲動
  - 點擊「複製訊息」後自動轉為 **「已傳送 ✔」** 綠色標記，避免漏發或重複發送

- **💾 歷史紀錄與設定持久化**：
  - 支援各班級標準自訂（例如：`150TH:85/6, 200TH:80/4`）
  - 內建歷史紀錄面板，可隨時回溯過去發送的訊息與套用模板

- **🌐 雙端支援（純網頁版 + Python PyQt6 桌面版）**：
  - **網頁版**：零安裝，打開瀏覽器即可直接讀取 Excel 進行處理（資料完全在本機瀏覽器處理，不傳送至伺服器，安全無虞）
  - **桌面版**：提供 Python GUI 程式碼與打包 `.exe` 指南
 


---

## 🚀 快速開始 (Quick Start)

### 網頁版 (Web Version)

直接下載專案中的 `index.html` 與 `icon.png` 放置於同一資料夾，雙擊 [此處](https://iristsai6.github.io/message_tool/) 即可使用

### 本地開發 (Desktop Python Version)

1. **複製專案庫 (Clone Repository)**：
   ```bash
   git clone [https://github.com/your-username/smart-batch-message-generator.git](https://github.com/your-username/smart-batch-message-generator.git)
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


打包完成後，可於 `dist/` 資料夾找到 `app.exe`

---

## 📂 Excel 檔案格式說明

小工具會自動忽略欄位名稱大小寫，建議第一列標題欄位如下（亦可直接點擊工具內的「**輸出/複製 Excel 範本**」產生）：

| studentMec | class | studentName | englishName | test_score | BookCount(11) |
| --- | --- | --- | --- | --- | --- |
| 0123 | 150TH | 周傑倫 | Jay | 53 | 4 |
| 2413 | 150TH | 蔡伊琳 | Jolin | 97 | 6 |
| 14023 | 150TH | 王結 | Jack | 95 | 6 |

---

## 📝 訊息模板變數說明

模板中可以使用花括號 `{}` 來引用 Excel 中的欄位：

* `{studentName}`：學員中文姓名（向下相容 `{name}`）
* `{englishName}`：學員英文姓名（選填）
* `{studentMec}`：學員學號／項次（向下相容 `{id}`）
* `{class}`：班級群組代碼
* `{test_score}`：小考成績
* `{BookScore}`：小說讀本成績（自動對應目前選擇的月份，例如 `BookScore(11)`）
* `{加強項目}`：自訂加強項目欄位（可自由擴充其他 Excel 欄位名稱）

---

## 🛠️ 技術堆疊 (Tech Stack)

* **網頁端 (Web)**：HTML5, React 18, Tailwind CSS, SheetJS (XLSX), is.gd / TinyURL API
* **桌面端 (Desktop)**：Python 3, PyQt6, Pandas, Openpyxl, PyInstaller

---

## 📜 聲明與致謝

* **Icon Attribution**: Minecraft Golden Apple icon by Icons8

---

## 📄 License

This project is licensed under the MIT License.

```
(https://raw.githubusercontent.com/iristsai6/message_tool/refs/heads/main/index.html)｝

```
