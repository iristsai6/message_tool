import sys
import os
import json
import re
import tempfile
import ctypes
import urllib.request
import urllib.parse
import pandas as pd
from PyQt6.QtCore import QThread, pyqtSignal, Qt
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QTextEdit, QLabel, QFileDialog, QTableWidget, 
    QTableWidgetItem, QMessageBox, QSplitter, QHeaderView, QLineEdit, 
    QGroupBox, QDialog, QListWidget, QComboBox, QScrollArea, QFrame
)
from PyQt6.QtGui import QColor, QIcon

APP_VERSION = "v2.0.0"

# --- 原子寫入 (Atomic Write) 函式 ---
def save_json_safely(data, target_file="history.json"):
    """使用暫存檔與 os.replace 進行原子寫入，避免寫入中斷導致資料損毀"""
    directory = os.path.dirname(target_file) or "."
    with tempfile.NamedTemporaryFile('w', dir=directory, delete=False, encoding='utf-8') as tmp_file:
        json.dump(data, tmp_file, ensure_ascii=False, indent=4)
        tmp_filename = tmp_file.name

    try:
        os.replace(tmp_filename, target_file)
    except Exception as e:
        if os.path.exists(tmp_filename):
            os.remove(tmp_filename)
        raise e


# --- 縮網址背景執行緒 (避免網路請求卡住主畫面) ---
class ShortenUrlThread(QThread):
    finished = pyqtSignal(str)
    error = pyqtSignal(str)

    def __init__(self, raw_url):
        super().__init__()
        self.raw_url = raw_url.strip()

    def run(self):
        try:
            target = self.raw_url if re.match(r'^https?://', self.raw_url, re.I) else f"https://{self.raw_url}"
            encoded = urllib.parse.quote(target, safe='')
            
            # 優先使用 is.gd API
            try:
                req_url = f"https://is.gd/create.php?format=json&url={encoded}"
                with urllib.request.urlopen(req_url, timeout=8) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    if "shorturl" in data:
                        self.finished.emit(data["shorturl"])
                        return
            except Exception:
                pass

            # 備援使用 TinyURL API
            fallback_url = f"https://tinyurl.com/api-create.php?url={encoded}"
            with urllib.request.urlopen(fallback_url, timeout=8) as resp:
                short_text = resp.read().decode('utf-8').strip()
                if short_text.startswith("http"):
                    self.finished.emit(short_text)
                    return

            self.error.emit("無法縮短此網址，請確認網址格式是否正確。")
        except Exception as e:
            self.error.emit(f"縮網址連線失敗：{str(e)}")


# --- 操作說明與 Q&A 對話框 (含版本號) ---
class HelpDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle(f"🚨 操作說明與常見問題 Q&A ({APP_VERSION})")
        self.resize(650, 520)

        layout = QVBoxLayout(self)

        header_label = QLabel(
            f"<div style='background-color:#1e293b; color:#f8fafc; padding:12px; border-radius:6px;'>"
            f"<b style='font-size:15px; color:#fbbf24;'>📌 批次模板生成小工具 {APP_VERSION} (Python PyQt6 桌面版)</b><br>"
            f"<span style='font-size:12px; color:#cbd5e1;'>v2.0.0 更新：整合班級群組管理與區分頁籤、縮網址小工具、按鈕化篩選條件與 Excel 範本匯出。</span>"
            f"</div>"
        )
        layout.addWidget(header_label)

        help_text = QTextEdit()
        help_text.setReadOnly(True)
        help_text.setHtml(f"""
        <div style="font-family: 'Microsoft JhengHei', sans-serif; line-height: 1.6; font-size: 13px;">
            <h3 style="color:#d97706;">🏫 1. 班級群組管理與區分</h3>
            <ul>
                <li><b>新增班級群組</b>：點擊左側「⚙️ 群組與模板管理」，可視覺化新增不同班級群組（如 <code>150TH</code>、<code>200TH</code>、<code>300TH</code>）並獨立設定小考與小說達標分數。</li>
                <li><b>名單分群檢視</b>：右側名單上方提供「班級群組區分」按鈕列，可單獨檢視特定班級並一鍵複製該班級的所有通知訊息。</li>
            </ul>
            <hr>
            <h3 style="color:#d97706;">📊 2. Excel 欄位對照說明</h3>
            <ul>
                <li><b>學號/項次</b>：<code>studentMec</code>（亦相容 <code>id</code>）</li>
                <li><b>中文姓名</b>：<code>studentName</code>（亦相容 <code>name</code>）</li>
                <li><b>英文姓名</b>：<code>englishName</code>（亦相容 <code>en_name</code>，選填）</li>
                <li><b>班級群組</b>：<code>class</code>（需與設定的班級群組代碼一致）</li>
                <li><b>小考成績</b>：<code>test_score</code></li>
                <li><b>讀本分數</b>：<code>BookScore(11)</code>（依選擇月份對應，模板變數可使用 <code>{{BookScore}}</code>）</li>
            </ul>
            <hr>
            <h3 style="color:#d97706;">🔗 3. 縮網址小工具與按鈕化篩選</h3>
            <ul>
                <li><b>縮網址 URL 小工具</b>：貼上長網址後點擊「縮短並複製」，系統會自動產生短網址並寫入剪貼簿，也可點擊「插入模板」直接加入訊息尾端。</li>
                <li><b>簡化篩選按鈕</b>：直接點擊「群發模式」、「小考未達標」、「小說未達標」切換按鈕即可即時過濾名單。</li>
            </ul>
            <hr>
            <h3 style="color:#dc2626;">❓ 4. 常見問題 Q&A</h3>
            <p><b>Q: 名字顯示「學員 1」？</b><br>A: 代表 Excel 找不到對應的 <code>studentName</code> 或 <code>name</code> 欄位，請點擊「📥 輸出/複製 Excel 範本」參考標準格式。</p>
            <p><b>Q: 為什麼列表沒有顯示任何學生？</b><br>A: 代表所有學生皆已達到設定的達標門檻；若需查看全班名單，請點亮左側「📢 群發模式」按鈕。</p>
        </div>
        """)
        layout.addWidget(help_text)

        bottom_bar = QHBoxLayout()
        ver_footer = QLabel(f"<span style='color:#64748b;'>版本號：{APP_VERSION}</span>")
        close_btn = QPushButton("關閉說明")
        close_btn.setStyleSheet("padding: 6px 18px; font-weight: bold;")
        close_btn.clicked.connect(self.accept)
        bottom_bar.addWidget(ver_footer)
        bottom_bar.addStretch()
        bottom_bar.addWidget(close_btn)
        layout.addLayout(bottom_bar)


# --- 歷史紀錄檢視視窗 ---
class HistoryDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("本機歷史紀錄檢視")
        self.resize(780, 520)
        
        layout = QVBoxLayout(self)
        layout.addWidget(QLabel("<b>已儲存的歷史批次紀錄 (history.json)：</b>"))
        
        self.history_list_widget = QListWidget()
        layout.addWidget(self.history_list_widget)
        
        self.detail_text = QTextEdit()
        self.detail_text.setReadOnly(True)
        self.detail_text.setPlaceholderText("點擊上方紀錄以檢視詳細內容與模板...")
        layout.addWidget(self.detail_text)
        
        self.load_history_file()
        self.history_list_widget.currentRowChanged.connect(self.show_detail)

    def load_history_file(self):
        if not os.path.exists("history.json"):
            self.history_list_widget.addItem("尚未發現 history.json 檔案（尚無歷史紀錄）。")
            return
        
        try:
            if os.path.getsize("history.json") == 0:
                self.history_list_widget.addItem("history.json 檔案內容為空。")
                return

            with open("history.json", "r", encoding="utf-8") as f:
                self.history_data = json.load(f)
                
            records = self.history_data.get("records", [])
            template = self.history_data.get("template", "無模板紀錄")
            
            item_desc = f"最新儲存批次 | 模板預覽: {template[:30]}... (共 {len(records)} 筆學員紀錄)"
            self.history_list_widget.addItem(item_desc)
            self.history_list_widget.setCurrentRow(0)
        except Exception as e:
            self.history_list_widget.addItem(f"讀取歷史紀錄發生錯誤: {str(e)}")

    def show_detail(self, row):
        if row < 0 or not os.path.exists("history.json") or os.path.getsize("history.json") == 0:
            return
        try:
            with open("history.json", "r", encoding="utf-8") as f:
                data = json.load(f)
            
            template = data.get("template", "")
            records = data.get("records", [])
            
            detail_str = f"【儲存的模板內容】\n{template}\n\n" + "="*45 + "\n【學員生成紀錄】\n"
            for rec in records:
                status_str = "[已處理]" if rec.get('processed', False) else "[未處理]"
                mec = rec.get('student_mec', rec.get('row_index', 'N/A'))
                detail_str += f"{status_str} 學號: {mec} | 班級: {rec.get('student_class', 'N/A')} | 姓名: {rec.get('student_name', 'N/A')} | 小考: {rec.get('test_score', 'N/A')} | 小說: {rec.get('book_score', 'N/A')}\n"
                detail_str += f"內容: {rec.get('generated_text', '')}\n" + "-"*35 + "\n"
                
            self.detail_text.setPlainText(detail_str)
        except Exception as e:
            self.detail_text.setPlainText(f"解析紀錄失敗: {str(e)}")


# --- 進階設定：視覺化班級群組區分與模板管理對話框 ---
class SettingsDialog(QDialog):
    def __init__(self, current_standards, current_templates, parent=None):
        super().__init__(parent)
        self.setWindowTitle("⚙️ 系統設定：班級群組區分與模板管理")
        self.resize(700, 620)
        
        # 深拷貝避免直接改動原物件
        self.standards = {
            k: {
                "test": v.get("test", 85),
                "book": v.get("book", 6),
                "groupName": v.get("groupName", f"{k} 班級群組")
            }
            for k, v in current_standards.items()
        }
        self.templates = current_templates.copy()
        
        layout = QVBoxLayout(self)
        
        # --- 1. 新增群組與班級區分區 ---
        group_box = QGroupBox("📊 班級群組區分與達標標準設定")
        group_box_layout = QVBoxLayout(group_box)

        add_bar = QHBoxLayout()
        self.new_cls_input = QLineEdit()
        self.new_cls_input.setPlaceholderText("班級代碼 (如: 300TH)")
        self.new_note_input = QLineEdit()
        self.new_note_input.setPlaceholderText("群組備註 (如: 週六高階班)")
        self.new_test_input = QLineEdit("85")
        self.new_test_input.setFixedWidth(60)
        self.new_test_input.setPlaceholderText("小考")
        self.new_book_input = QLineEdit("6")
        self.new_book_input.setFixedWidth(60)
        self.new_book_input.setPlaceholderText("小說")

        add_grp_btn = QPushButton("+ 新增群組")
        add_grp_btn.setStyleSheet("background-color: #f59e0b; color: #0f172a; font-weight: bold; padding: 5px 10px; border-radius: 4px;")
        add_grp_btn.clicked.connect(self.add_class_group)

        add_bar.addWidget(QLabel("代碼:"))
        add_bar.addWidget(self.new_cls_input)
        add_bar.addWidget(QLabel("備註:"))
        add_bar.addWidget(self.new_note_input)
        add_bar.addWidget(QLabel("小考:"))
        add_bar.addWidget(self.new_test_input)
        add_bar.addWidget(QLabel("小說:"))
        add_bar.addWidget(self.new_book_input)
        add_bar.addWidget(add_grp_btn)
        group_box_layout.addLayout(add_bar)

        # 群組清單表格（可直接修改數值與刪除）
        self.group_table = QTableWidget()
        self.group_table.setColumnCount(5)
        self.group_table.setHorizontalHeaderLabels(["班級代碼", "群組備註名稱", "小考達標", "小說達標", "操作"])
        self.group_table.horizontalHeader().setSectionResizeMode(0, QHeaderView.ResizeMode.ResizeToContents)
        self.group_table.horizontalHeader().setSectionResizeMode(1, QHeaderView.ResizeMode.Stretch)
        self.group_table.horizontalHeader().setSectionResizeMode(2, QHeaderView.ResizeMode.ResizeToContents)
        self.group_table.horizontalHeader().setSectionResizeMode(3, QHeaderView.ResizeMode.ResizeToContents)
        self.group_table.horizontalHeader().setSectionResizeMode(4, QHeaderView.ResizeMode.ResizeToContents)
        self.group_table.setMaximumHeight(165)
        group_box_layout.addWidget(self.group_table)
        self.render_group_table()

        layout.addWidget(group_box)
        
        # --- 2. 訊息模板管理區 ---
        tpl_box = QGroupBox("📝 訊息模板管理區")
        tpl_layout = QVBoxLayout(tpl_box)

        self.template_list_widget = QListWidget()
        self.template_list_widget.setMaximumHeight(100)
        for name in self.templates.keys():
            self.template_list_widget.addItem(name)
        tpl_layout.addWidget(self.template_list_widget)
        
        self.tpl_name_input = QLineEdit()
        self.tpl_name_input.setPlaceholderText("模板名稱")
        tpl_layout.addWidget(self.tpl_name_input)
        
        self.tpl_content_input = QTextEdit()
        self.tpl_content_input.setPlaceholderText("在此輸入模板內容... 支援變數: {studentName}, {class}, {test_score}, {BookScore}, {加強項目}")
        tpl_layout.addWidget(self.tpl_content_input)
        
        btn_layout = QHBoxLayout()
        self.add_tpl_btn = QPushButton("新增/更新模板")
        self.del_tpl_btn = QPushButton("刪除選定模板")
        btn_layout.addWidget(self.add_tpl_btn)
        btn_layout.addWidget(self.del_tpl_btn)
        tpl_layout.addLayout(btn_layout)

        layout.addWidget(tpl_box)
        
        # --- 底部確認列 ---
        bottom_layout = QHBoxLayout()
        self.save_btn = QPushButton("💾 儲存所有設定")
        self.save_btn.setStyleSheet("background-color: #2563eb; color: white; font-weight: bold; padding: 8px 16px; border-radius: 4px;")
        self.cancel_btn = QPushButton("取消")
        self.cancel_btn.setStyleSheet("padding: 8px 16px;")
        bottom_layout.addStretch()
        bottom_layout.addWidget(self.cancel_btn)
        bottom_layout.addWidget(self.save_btn)
        layout.addLayout(bottom_layout)
        
        self.template_list_widget.currentRowChanged.connect(self.load_template_to_edit)
        self.add_tpl_btn.clicked.connect(self.save_template)
        self.del_tpl_btn.clicked.connect(self.delete_template)
        self.save_btn.clicked.connect(self.accept_and_collect)
        self.cancel_btn.clicked.connect(self.reject)

        if self.template_list_widget.count() > 0:
            self.template_list_widget.setCurrentRow(0)

    def render_group_table(self):
        self.group_table.setRowCount(len(self.standards))
        for row_idx, (cls_name, info) in enumerate(self.standards.items()):
            cls_item = QTableWidgetItem(cls_name)
            cls_item.setFlags(cls_item.flags() & ~Qt.ItemFlag.ItemIsEditable)
            self.group_table.setItem(row_idx, 0, cls_item)

            note_item = QTableWidgetItem(str(info.get("groupName", f"{cls_name} 班級群組")))
            self.group_table.setItem(row_idx, 1, note_item)

            test_item = QTableWidgetItem(str(info.get("test", 85)))
            test_item.setTextAlignment(Qt.AlignmentFlag.AlignCenter)
            self.group_table.setItem(row_idx, 2, test_item)

            book_item = QTableWidgetItem(str(info.get("book", 6)))
            book_item.setTextAlignment(Qt.AlignmentFlag.AlignCenter)
            self.group_table.setItem(row_idx, 3, book_item)

            del_btn = QPushButton("刪除")
            del_btn.setStyleSheet("color: #dc2626; font-weight: bold; padding: 2px 6px;")
            del_btn.clicked.connect(lambda checked, c=cls_name: self.remove_class_group(c))
            self.group_table.setCellWidget(row_idx, 4, del_btn)

    def sync_table_edits_to_dict(self):
        for r in range(self.group_table.rowCount()):
            cls_name = self.group_table.item(r, 0).text().strip()
            note_val = self.group_table.item(r, 1).text().strip()
            try:
                t_val = float(self.group_table.item(r, 2).text().strip())
            except ValueError:
                t_val = 85.0
            try:
                b_val = float(self.group_table.item(r, 3).text().strip())
            except ValueError:
                b_val = 6.0
            if cls_name in self.standards:
                self.standards[cls_name] = {
                    "test": t_val,
                    "book": b_val,
                    "groupName": note_val or f"{cls_name} 班級群組"
                }

    def add_class_group(self):
        self.sync_table_edits_to_dict()
        cls_code = self.new_cls_input.text().strip().upper()
        if not cls_code:
            QMessageBox.warning(self, "提示", "請輸入班級代碼（例如：300TH）！")
            return
        if cls_code in self.standards:
            QMessageBox.warning(self, "提示", f"班級群組「{cls_code}」已存在，請直接於表格內修改數值！")
            return
        try:
            t_score = float(self.new_test_input.text().strip())
        except ValueError:
            t_score = 85.0
        try:
            b_score = float(self.new_book_input.text().strip())
        except ValueError:
            b_score = 6.0

        note = self.new_note_input.text().strip() or f"{cls_code} 班級群組"
        self.standards[cls_code] = {"test": t_score, "book": b_score, "groupName": note}
        self.new_cls_input.clear()
        self.new_note_input.clear()
        self.render_group_table()

    def remove_class_group(self, cls_name):
        self.sync_table_edits_to_dict()
        if len(self.standards) <= 1:
            QMessageBox.warning(self, "警告", "至少需要保留一個班級群組設定！")
            return
        if cls_name in self.standards:
            del self.standards[cls_name]
            self.render_group_table()

    def load_template_to_edit(self, row):
        if row >= 0:
            name = self.template_list_widget.item(row).text()
            self.tpl_name_input.setText(name)
            self.tpl_content_input.setPlainText(self.templates.get(name, ""))

    def save_template(self):
        name = self.tpl_name_input.text().strip()
        content = self.tpl_content_input.toPlainText()
        if not name:
            QMessageBox.warning(self, "警告", "模板名稱不可為空！")
            return
        self.templates[name] = content
        self.template_list_widget.clear()
        for t_name in self.templates.keys():
            self.template_list_widget.addItem(t_name)
        QMessageBox.information(self, "成功", f"模板「{name}」已成功儲存！")

    def delete_template(self):
        row = self.template_list_widget.currentRow()
        if row >= 0:
            name = self.template_list_widget.item(row).text()
            if len(self.templates) <= 1:
                QMessageBox.warning(self, "警告", "至少需要保留一個模板！")
                return
            del self.templates[name]
            self.template_list_widget.clear()
            for t_name in self.templates.keys():
                self.template_list_widget.addItem(t_name)
            self.tpl_name_input.clear()
            self.tpl_content_input.clear()

    def accept_and_collect(self):
        self.sync_table_edits_to_dict()
        self.accept()

    def get_updated_standards(self):
        return self.standards


# --- 背景處理執行緒 (QThread) ---
class BatchProcessThread(QThread):
    finished = pyqtSignal(list)
    error = pyqtSignal(str)

    def __init__(self, file_path, template_text, class_standards, default_test_score, default_book_score, selected_month, is_broadcast_mode, filter_test_unmet, filter_book_unmet):
        super().__init__()
        self.file_path = file_path
        self.template_text = template_text
        self.class_standards = class_standards
        self.default_test_score = default_test_score
        self.default_book_score = default_book_score
        self.selected_month = selected_month
        self.is_broadcast_mode = is_broadcast_mode
        self.filter_test_unmet = filter_test_unmet
        self.filter_book_unmet = filter_book_unmet

    def run(self):
        try:
            if self.file_path.lower().endswith('.csv'):
                df = pd.read_csv(self.file_path)
            else:
                df = pd.read_excel(self.file_path)
            
            df.columns = df.columns.str.strip().str.lower()
            df_columns_set = set(df.columns)
            df = df.fillna("")
            
            # 同時支援 BookScore(月份) 與舊版 book_score(月份)
            primary_book_col = f"bookscore({self.selected_month})".lower()
            legacy_book_col = f"book_score({self.selected_month})".lower()
            active_book_col = primary_book_col if primary_book_col in df_columns_set else legacy_book_col
            
            results = []
            pattern = re.compile(r'__(.*?)__|\{(.*?)\}')
            
            for index, row in df.iterrows():
                raw_score = str(row.get('test_score', '')).strip()
                try:
                    test_score = float(raw_score) if raw_score != '' else 0.0
                except ValueError:
                    test_score = 0.0
                
                raw_book_score = str(row.get(active_book_col, '')).strip()
                try:
                    book_score = float(raw_book_score) if raw_book_score != '' else 0.0
                except ValueError:
                    book_score = 0.0

                student_class = str(row.get('class', '預設班級')).strip()
                
                # 不分大小寫比對班級群組
                matched_key = next((k for k in self.class_standards.keys() if k.strip().lower() == student_class.lower()), None)
                cls_std = self.class_standards.get(matched_key, {}) if matched_key else {}
                pass_test_score = cls_std.get("test", self.default_test_score)
                pass_book_score = cls_std.get("book", self.default_book_score)
                
                is_test_passed = (test_score >= pass_test_score)
                is_book_passed = (book_score >= pass_book_score)
                
                # --- 篩選邏輯判斷 ---
                if self.is_broadcast_mode:
                    pass
                elif self.filter_test_unmet and self.filter_book_unmet:
                    if is_test_passed and is_book_passed:
                        continue
                elif self.filter_test_unmet:
                    if is_test_passed:
                        continue
                elif self.filter_book_unmet:
                    if is_book_passed:
                        continue
                else:
                    if is_test_passed and is_book_passed:
                        continue
                
                current_text = self.template_text
                matches = pattern.findall(current_text)
                for match in matches:
                    var_name = match[0] if match[0] else match[1]
                    tag = f"__{var_name}__" if match[0] else f"{{{var_name}}}"
                    lower_var_name = var_name.strip().lower()
                    
                    if "bookscore" in lower_var_name or "book_score" in lower_var_name:
                        target_col = active_book_col
                    elif lower_var_name in ("studentname", "name"):
                        target_col = "studentname" if "studentname" in df_columns_set else "name"
                    elif lower_var_name in ("englishname", "en_name"):
                        target_col = "englishname" if "englishname" in df_columns_set else "en_name"
                    else:
                        target_col = lower_var_name
                    
                    if target_col in df_columns_set:
                        col_idx = list(df.columns).index(target_col)
                        val = str(df.iloc[index, col_idx])
                        current_text = current_text.replace(tag, val)
                    else:
                        current_text = current_text.replace(tag, "")
                
                # 優先讀取 studentName，向下相容 name
                raw_name = str(row.get('studentname', '')).strip() or str(row.get('name', '')).strip()
                student_name = raw_name if raw_name else f"學員 {index+1}"
                
                english_name = str(row.get('englishname', '')).strip() or str(row.get('en_name', '')).strip()
                raw_mec = str(row.get('studentmec', '')).strip() or str(row.get('id', '')).strip()
                student_mec = raw_mec if raw_mec else str(index + 1)
                
                results.append({
                    "row_index": index + 1,
                    "student_mec": student_mec,
                    "student_name": student_name,
                    "english_name": english_name,
                    "student_class": student_class,
                    "test_score": test_score,
                    "pass_test_score": pass_test_score,
                    "book_score": book_score,
                    "pass_book_score": pass_book_score,
                    "is_test_passed": is_test_passed,
                    "is_book_passed": is_book_passed,
                    "generated_text": current_text,
                    "processed": False
                })
                
            self.finished.emit(results)
        except Exception as e:
            self.error.emit(str(e))


# --- 主視窗介面 ---
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle(f"批次模板生成小工具 {APP_VERSION}")
        self.resize(1360, 820)
        
        if os.path.exists("icon.png"):
            self.setWindowIcon(QIcon("icon.png"))
            
        self.excel_path = ""
        self.generated_data = []
        self.selected_class_filter = "ALL"
        
        self.class_standards = {
            "150TH": {"test": 85, "book": 6, "groupName": "150TH 班級群組"},
            "200TH": {"test": 80, "book": 4, "groupName": "200TH 班級群組"}
        }
        self.templates = {
            "預設英文學習狀況回報": (
                "家長您好，和您分享孩子近期的英文學習狀況。\n\n"
                "{studentName}最近三次小考成績從 70 分、80 分進步到{test_score} 分，單字掌握比之前穩定；課堂上也開始能用完整句子回答問題。\n\n"
                "目前需要加強的是\n\n"
                "🔺 {加強項目}。\n"
                "🔺 閱讀提升一個level的小說。\n"
                "🔺 本班講師規定目標，目前累積到{BookScore}分！\n\n"
                "另外，本週有一項錄音尚未繳交。\n"
                "📍老師檢查方式會先確認完成狀況，再檢查發音與流暢度。\n\n"
                "我們已與講師確認，接下來會先帶孩子示範一次故事摘要，與朗讀。請孩子於下週上課前完成小說閱讀及補交錄音。"
            ),
            "群發訊息": (
                "家長您好，提醒您{studentName}本週須參加{class}大會考唷！逾時十分鐘則不予入場考試!!"
            ),
            "短版提醒通知": (
                "家長您好，提醒您孩子本週英文小考成績為 {test_score} 分，小說分數為 {BookScore} 分，尚未達到班級標準，再請協助提醒孩子完成進度與複習唷！"
            )
        }
        
        self.init_ui()

    def init_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        root_layout = QVBoxLayout(central_widget)

        # --- 頂部標題與快速匯出列 ---
        top_bar = QHBoxLayout()
        title_lbl = QLabel(f"<b style='font-size:16px;'>🍎 批次模板生成小工具</b> <span style='background-color:#fef3c7; color:#92400e; padding:2px 8px; border-radius:8px; font-weight:bold; font-size:12px;'>{APP_VERSION}</span>")
        top_bar.addWidget(title_lbl)
        top_bar.addStretch()

        self.export_tpl_btn = QPushButton("📥 輸出/複製 Excel 範本")
        self.export_tpl_btn.setStyleSheet("""
            QPushButton {
                background-color: #d1fae5;
                color: #065f46;
                border: 1px solid #6ee7b7;
                border-radius: 5px;
                padding: 5px 12px;
                font-weight: bold;
            }
            QPushButton:hover { background-color: #a7f3d0; }
        """)
        self.export_tpl_btn.clicked.connect(self.export_template_excel)
        top_bar.addWidget(self.export_tpl_btn)
        root_layout.addLayout(top_bar)

        splitter = QSplitter(Qt.Orientation.Horizontal)
        root_layout.addWidget(splitter)

        # --- 左側：控制與模板輸入區 ---
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)
        left_layout.setContentsMargins(0, 0, 6, 0)

        # 1. 模板選擇與編輯
        tpl_select_layout = QHBoxLayout()
        tpl_select_layout.addWidget(QLabel("<b>選擇訊息模板：</b>"))
        self.tpl_combo = QComboBox()
        self.tpl_combo.addItems(list(self.templates.keys()))
        self.tpl_combo.currentIndexChanged.connect(self.on_template_changed)
        tpl_select_layout.addWidget(self.tpl_combo, 1)
        left_layout.addLayout(tpl_select_layout)

        self.template_input = QTextEdit()
        self.template_input.setPlainText(list(self.templates.values())[0])
        self.template_input.setMinimumHeight(145)
        left_layout.addWidget(self.template_input)

        # 2. 參數設定與班級群組區
        settings_group = QGroupBox("參數設定與班級群組管理")
        settings_layout = QVBoxLayout()

        # 已建立班級群組標籤列
        grp_preview_row = QHBoxLayout()
        self.group_tags_label = QLabel()
        self.group_tags_label.setWordWrap(True)
        self.update_group_tags_display()
        grp_preview_row.addWidget(self.group_tags_label, 1)

        self.open_settings_btn = QPushButton("⚙️ 群組與模板管理")
        self.open_settings_btn.setStyleSheet("""
            QPushButton {
                background-color: #fef3c7;
                color: #92400e;
                border: 1px solid #fcd34d;
                border-radius: 4px;
                padding: 4px 8px;
                font-weight: bold;
            }
            QPushButton:hover { background-color: #fde68a; }
        """)
        self.open_settings_btn.clicked.connect(self.open_settings_dialog)
        grp_preview_row.addWidget(self.open_settings_btn)
        settings_layout.addLayout(grp_preview_row)
        
        month_layout = QHBoxLayout()
        month_layout.addWidget(QLabel("對應讀本月份:"))
        self.month_combo = QComboBox()
        self.month_combo.addItems(["12","11","10", "9", "8", "7", "6", "5", "4", "3", "2", "1"])
        self.month_combo.setCurrentText("11")
        self.month_combo.currentIndexChanged.connect(self.on_month_changed)
        month_layout.addWidget(self.month_combo)
        settings_layout.addLayout(month_layout)

        default_score_layout = QHBoxLayout()
        default_score_layout.addWidget(QLabel("預設小考:"))
        self.default_test_input = QLineEdit("85")
        default_score_layout.addWidget(self.default_test_input)
        default_score_layout.addWidget(QLabel("預設小說:"))
        self.default_book_input = QLineEdit("6")
        default_score_layout.addWidget(self.default_book_input)
        settings_layout.addLayout(default_score_layout)

        # 化簡項目改為可切換按鈕形式 (Toggle Pills)
        toggle_row = QHBoxLayout()
        self.broadcast_btn = QPushButton("📢 群發模式")
        self.broadcast_btn.setCheckable(True)
        self.broadcast_btn.clicked.connect(self.on_mode_changed)

        self.filter_test_btn = QPushButton("🎯 小考未達標")
        self.filter_test_btn.setCheckable(True)
        self.filter_test_btn.clicked.connect(self.on_mode_changed)

        self.filter_book_btn = QPushButton("🎯 小說未達標")
        self.filter_book_btn.setCheckable(True)
        self.filter_book_btn.clicked.connect(self.on_mode_changed)

        toggle_style = """
            QPushButton {
                background-color: #f1f5f9;
                color: #475569;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                padding: 6px 8px;
                font-weight: bold;
            }
            QPushButton:checked {
                background-color: #2563eb;
                color: white;
                border: 1px solid #1d4ed8;
            }
            QPushButton:disabled {
                background-color: #e2e8f0;
                color: #94a3b8;
            }
        """
        self.broadcast_btn.setStyleSheet("""
            QPushButton {
                background-color: #f1f5f9;
                color: #475569;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                padding: 6px 8px;
                font-weight: bold;
            }
            QPushButton:checked {
                background-color: #f59e0b;
                color: #0f172a;
                border: 1px solid #d97706;
            }
        """)
        self.filter_test_btn.setStyleSheet(toggle_style)
        self.filter_book_btn.setStyleSheet(toggle_style)

        toggle_row.addWidget(self.broadcast_btn)
        toggle_row.addWidget(self.filter_test_btn)
        toggle_row.addWidget(self.filter_book_btn)
        settings_layout.addLayout(toggle_row)

        settings_group.setLayout(settings_layout)
        left_layout.addWidget(settings_group)

        # 3. 縮網址 URL 小工具區塊
        url_group = QGroupBox("🔗 縮網址 URL 小工具")
        url_layout = QVBoxLayout(url_group)

        url_input_row = QHBoxLayout()
        self.long_url_input = QLineEdit()
        self.long_url_input.setPlaceholderText("貼上長網址 (例如 Google 表單)...")
        self.long_url_input.returnPressed.connect(self.shorten_url)
        self.shorten_btn = QPushButton("縮短並複製")
        self.shorten_btn.setStyleSheet("background-color: #f59e0b; color: #0f172a; font-weight: bold; padding: 5px 10px; border-radius: 4px;")
        self.shorten_btn.clicked.connect(self.shorten_url)
        url_input_row.addWidget(self.long_url_input)
        url_input_row.addWidget(self.shorten_btn)
        url_layout.addLayout(url_input_row)

        url_result_row = QHBoxLayout()
        self.short_url_output = QLineEdit()
        self.short_url_output.setReadOnly(True)
        self.short_url_output.setPlaceholderText("縮短後的網址將顯示於此...")
        self.insert_url_btn = QPushButton("插入模板")
        self.insert_url_btn.setEnabled(False)
        self.insert_url_btn.clicked.connect(self.insert_short_url_to_template)
        url_result_row.addWidget(self.short_url_output)
        url_result_row.addWidget(self.insert_url_btn)
        url_layout.addLayout(url_result_row)

        left_layout.addWidget(url_group)

        # 4. 檔案操作與歷史紀錄區
        self.file_label = QLabel("尚未選擇 Excel 檔案")
        left_layout.addWidget(self.file_label)

        file_btn_layout = QHBoxLayout()
        self.load_btn = QPushButton("📂 選擇 Excel 檔案")
        self.load_btn.clicked.connect(self.select_excel_and_run)
        
        self.reload_same_btn = QPushButton("🔄 重新載入")
        self.reload_same_btn.setStyleSheet("""
            QPushButton {
                background-color: #fff2cc;
                color: #7f6000;
                border: 1px solid #d6b656;
                border-radius: 4px;
                padding: 6px;
                font-weight: bold;
            }
            QPushButton:hover { background-color: #ffe599; }
        """)
        self.reload_same_btn.clicked.connect(self.reload_same_excel)
        
        file_btn_layout.addWidget(self.load_btn)
        file_btn_layout.addWidget(self.reload_same_btn)
        left_layout.addLayout(file_btn_layout)

        db_btn_layout = QHBoxLayout()
        self.save_history_btn = QPushButton("💾 儲存歷史紀錄")
        self.save_history_btn.clicked.connect(self.save_to_local_db)
        self.view_history_btn = QPushButton("🕒 查看歷史紀錄")
        self.view_history_btn.clicked.connect(self.open_history_dialog)
        db_btn_layout.addWidget(self.save_history_btn)
        db_btn_layout.addWidget(self.view_history_btn)
        left_layout.addLayout(db_btn_layout)

        self.help_btn = QPushButton(f"🚨 操作說明與 Q&A ({APP_VERSION})")
        self.help_btn.setStyleSheet("""
            QPushButton {
                background-color: #fee2e2;
                color: #991b1b;
                border: 1px solid #fca5a5;
                border-radius: 4px;
                padding: 6px;
                font-weight: bold;
            }
            QPushButton:hover { background-color: #fecaca; }
        """)
        self.help_btn.clicked.connect(self.open_help_dialog)
        left_layout.addWidget(self.help_btn)

        splitter.addWidget(left_widget)

        # --- 右側：班級群組區分與結果列表區 ---
        right_widget = QWidget()
        right_layout = QVBoxLayout(right_widget)

        self.right_title_label = QLabel("<b>2. 未達標學生名單與即時確認區：</b>")
        right_layout.addWidget(self.right_title_label)

        # 班級群組區分切換頁籤列
        self.class_filter_bar = QHBoxLayout()
        self.class_filter_bar.setAlignment(Qt.AlignmentFlag.AlignLeft)
        right_layout.addLayout(self.class_filter_bar)
        self.rebuild_class_filter_buttons()
        
        self.result_table = QTableWidget()
        self.result_table.setColumnCount(6)
        self.result_table.setHorizontalHeaderLabels(["快速操作", "學號/項次", "班級群組", "學員姓名 (英)", "小考/小說成績", "生成預覽內容"])
        self.result_table.horizontalHeader().setSectionResizeMode(0, QHeaderView.ResizeMode.ResizeToContents)
        self.result_table.horizontalHeader().setSectionResizeMode(1, QHeaderView.ResizeMode.ResizeToContents)
        self.result_table.horizontalHeader().setSectionResizeMode(2, QHeaderView.ResizeMode.ResizeToContents)
        self.result_table.horizontalHeader().setSectionResizeMode(3, QHeaderView.ResizeMode.ResizeToContents)
        self.result_table.horizontalHeader().setSectionResizeMode(4, QHeaderView.ResizeMode.ResizeToContents)
        self.result_table.horizontalHeader().setSectionResizeMode(5, QHeaderView.ResizeMode.Stretch)
        right_layout.addWidget(self.result_table)

        self.copy_all_btn = QPushButton("一鍵複製全部未達標生成結果")
        self.copy_all_btn.setStyleSheet("padding: 8px; font-weight: bold;")
        self.copy_all_btn.clicked.connect(self.copy_all_results)
        right_layout.addWidget(self.copy_all_btn)

        splitter.addWidget(right_widget)
        splitter.setSizes([430, 930])

    def update_group_tags_display(self):
        tags_html = " ".join([
            f"<span style='background:#e2e8f0; color:#1e293b; padding:2px 6px; border-radius:4px; font-size:11px;'><b>{cls}</b> ({val['test']}/{val['book']})</span>"
            for cls, val in self.class_standards.items()
        ])
        self.group_tags_label.setText(f"已設群組: {tags_html}")

    def rebuild_class_filter_buttons(self):
        # 清空舊按鈕
        while self.class_filter_bar.count():
            item = self.class_filter_bar.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

        self.class_filter_bar.addWidget(QLabel("<b>班級群組區分：</b>"))

        all_classes = list(self.class_standards.keys())
        for rec in self.generated_data:
            c = rec["student_class"]
            if c and not any(existing.lower() == c.lower() for existing in all_classes):
                all_classes.append(c)

        options = [("ALL", f"全部班級 ({len(self.generated_data)})")]
        for cls in all_classes:
            cnt = sum(1 for r in self.generated_data if r["student_class"].lower() == cls.lower())
            options.append((cls, f"{cls} ({cnt})"))

        for key, label in options:
            btn = QPushButton(label)
            is_selected = (self.selected_class_filter.lower() == key.lower())
            if is_selected:
                btn.setStyleSheet("background-color: #f59e0b; color: #0f172a; font-weight: bold; padding: 4px 10px; border-radius: 4px;")
            else:
                btn.setStyleSheet("background-color: #e2e8f0; color: #334155; padding: 4px 10px; border-radius: 4px;")
            btn.clicked.connect(lambda checked, k=key: self.on_class_filter_selected(k))
            self.class_filter_bar.addWidget(btn)

    def on_class_filter_selected(self, class_key):
        self.selected_class_filter = class_key
        self.rebuild_class_filter_buttons()
        self.render_table()

    def get_filtered_data(self):
        if self.selected_class_filter == "ALL":
            return self.generated_data
        return [
            item for item in self.generated_data
            if item["student_class"].lower() == self.selected_class_filter.lower()
        ]

    # --- 縮網址功能 ---
    def shorten_url(self):
        raw_url = self.long_url_input.text().strip()
        if not raw_url:
            QMessageBox.warning(self, "提示", "請先輸入需要縮短的長網址！")
            return
        self.shorten_btn.setEnabled(False)
        self.shorten_btn.setText("縮短中...")
        self.url_thread = ShortenUrlThread(raw_url)
        self.url_thread.finished.connect(self.on_shorten_finished)
        self.url_thread.error.connect(self.on_shorten_error)
        self.url_thread.start()

    def on_shorten_finished(self, short_url):
        self.shorten_btn.setEnabled(True)
        self.shorten_btn.setText("縮短並複製")
        self.short_url_output.setText(short_url)
        self.insert_url_btn.setEnabled(True)
        QApplication.clipboard().setText(short_url)
        QMessageBox.information(self, "縮網址成功", f"短網址已生成並自動複製到剪貼簿：\n{short_url}")

    def on_shorten_error(self, err_msg):
        self.shorten_btn.setEnabled(True)
        self.shorten_btn.setText("縮短並複製")
        QMessageBox.warning(self, "縮網址失敗", err_msg)

    def insert_short_url_to_template(self):
        short_url = self.short_url_output.text().strip()
        if short_url:
            current = self.template_input.toPlainText()
            sep = "" if (not current or current.endswith("\n")) else "\n"
            self.template_input.setPlainText(f"{current}{sep}{short_url}")

    # --- 輸出/複製 Excel 範本 ---
    def export_template_excel(self):
        month = self.month_combo.currentText()
        book_col = f"BookScore({month})"
        headers = ["studentMec", "class", "studentName", "englishName", "test_score", book_col, "加強項目"]
        sample_rows = [
            ["123", "150TH", "周傑倫", "Jay", 53, 3, "小說,小考"],
            ["10450", "200TH", "昆琳", "Hannah", 84, 3, "小說,小考"]
        ]

        # 1. 複製 TSV 表格格式至剪貼簿，讓使用者可直接貼上 Excel
        tsv_lines = ["\t".join(headers)] + ["\t".join(map(str, r)) for r in sample_rows]
        QApplication.clipboard().setText("\n".join(tsv_lines))

        # 2. 詢問或直接儲存 Excel 檔案
        save_path, _ = QFileDialog.getSaveFileName(
            self, "儲存標準 Excel 範本", f"成績匯入範本_{month}月.xlsx", "Excel Files (*.xlsx)"
        )
        if save_path:
            try:
                df_sample = pd.DataFrame(sample_rows, columns=headers)
                df_sample.to_excel(save_path, index=False)
                QMessageBox.information(
                    self, "範本匯出成功",
                    f"已成功儲存範本至：\n{save_path}\n\n同時已將表格格式複製到剪貼簿，您也可直接在試算表中按 Ctrl+V 貼上！"
                )
            except Exception as e:
                QMessageBox.critical(self, "匯出失敗", f"儲存 Excel 範本時發生錯誤：\n{str(e)}")
        else:
            QMessageBox.information(
                self, "已複製範本格式",
                "已將標準欄位與範例資料複製到剪貼簿！\n您可以直接打開 Excel 或 Google 試算表按 Ctrl+V 貼上。"
            )

    def on_template_changed(self, index):
        tpl_name = self.tpl_combo.currentText()
        if tpl_name in self.templates:
            self.template_input.setPlainText(self.templates[tpl_name])
            if self.excel_path and os.path.exists(self.excel_path):
                self.reload_same_excel()

    def on_month_changed(self, index):
        if self.excel_path and os.path.exists(self.excel_path):
            self.reload_same_excel()

    def on_mode_changed(self):
        is_bcast = self.broadcast_btn.isChecked()
        self.filter_test_btn.setEnabled(not is_bcast)
        self.filter_book_btn.setEnabled(not is_bcast)

        if is_bcast:
            self.right_title_label.setText("<b>2. 全體學生群發名單與即時確認區 (群發模式)：</b>")
        elif self.filter_test_btn.isChecked() and self.filter_book_btn.isChecked():
            self.right_title_label.setText("<b>2. 未達標學生名單 (小考或小說未達標)：</b>")
        elif self.filter_test_btn.isChecked():
            self.right_title_label.setText("<b>2. 小考未達標學員名單：</b>")
        elif self.filter_book_btn.isChecked():
            self.right_title_label.setText("<b>2. 小說未達標學員名單：</b>")
        else:
            self.right_title_label.setText("<b>2. 未達標學生名單與即時確認區：</b>")
            
        if self.excel_path and os.path.exists(self.excel_path):
            self.reload_same_excel()

    def reload_same_excel(self):
        if not self.excel_path or not os.path.exists(self.excel_path):
            QMessageBox.warning(self, "提示", "目前尚未選擇任何 Excel 檔案，請先點擊「📂 選擇 Excel 檔案」！")
            return
        
        template_text = self.template_input.toPlainText()
        selected_month = self.month_combo.currentText()
        is_broadcast_mode = self.broadcast_btn.isChecked()
        filter_test_unmet = self.filter_test_btn.isChecked()
        filter_book_unmet = self.filter_book_btn.isChecked()
        
        try:
            default_test = float(self.default_test_input.text())
        except ValueError:
            default_test = 85.0

        try:
            default_book = float(self.default_book_input.text())
        except ValueError:
            default_book = 6.0
        
        self.thread = BatchProcessThread(
            self.excel_path, template_text, self.class_standards, 
            default_test, default_book, selected_month, is_broadcast_mode, filter_test_unmet, filter_book_unmet
        )
        self.thread.finished.connect(self.handle_process_finished)
        self.thread.error.connect(self.handle_process_error)
        self.reload_same_btn.setEnabled(False)
        self.reload_same_btn.setText("重新計算中...")
        self.thread.start()

    def open_settings_dialog(self):
        dialog = SettingsDialog(self.class_standards, self.templates, self)
        if dialog.exec() == QDialog.DialogCode.Accepted:
            self.class_standards = dialog.get_updated_standards()
            self.templates = dialog.templates
            self.update_group_tags_display()
            self.rebuild_class_filter_buttons()

            self.tpl_combo.blockSignals(True)
            self.tpl_combo.clear()
            self.tpl_combo.addItems(list(self.templates.keys()))
            self.tpl_combo.blockSignals(False)
            QMessageBox.information(self, "成功", "班級群組標準與模板已成功更新！")
            
            if self.excel_path and os.path.exists(self.excel_path):
                self.reload_same_excel()

    def open_help_dialog(self):
        dialog = HelpDialog(self)
        dialog.exec()

    def select_excel_and_run(self):
        file_name, _ = QFileDialog.getOpenFileName(self, "選擇 Excel / CSV 檔案", "", "Spreadsheet Files (*.xlsx *.xls *.csv)")
        if file_name:
            self.excel_path = file_name
            self.selected_class_filter = "ALL"
            self.file_label.setText(f"已選擇：{os.path.basename(file_name)}")
            self.reload_same_excel()

    def handle_process_finished(self, results):
        self.generated_data = results
        self.reload_same_btn.setEnabled(True)
        self.reload_same_btn.setText("🔄 重新載入")
        self.rebuild_class_filter_buttons()
        self.render_table()

    def render_table(self):
        filtered = self.get_filtered_data()
        self.result_table.setRowCount(len(filtered))

        group_label = "全部" if self.selected_class_filter == "ALL" else f"「{self.selected_class_filter}」班級群組"
        self.copy_all_btn.setText(f"一鍵複製{group_label}生成結果 ({len(filtered)} 筆)")

        for i, item in enumerate(filtered):
            # 第 0 欄：快速操作按鈕
            copy_btn = QPushButton()
            if item.get("processed", False):
                copy_btn.setText("已傳送 ✔")
                copy_btn.setStyleSheet("""
                    QPushButton {
                        background-color: #e2f0d9;
                        color: #385723;
                        border: 1px solid #c8e1b7;
                        border-radius: 4px;
                        padding: 4px 8px;
                        font-weight: bold;
                    }
                """)
            else:
                copy_btn.setText("📋 複製訊息")
                copy_btn.setStyleSheet("""
                    QPushButton {
                        background-color: #2563eb;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 4px 8px;
                        font-weight: bold;
                    }
                    QPushButton:hover { background-color: #1d4ed8; }
                """)
            copy_btn.clicked.connect(lambda checked, target=item: self.copy_single_and_mark(target))
            self.result_table.setCellWidget(i, 0, copy_btn)

            # 第 1~4 欄：學號、班級群組、姓名(英)、成績狀態
            self.result_table.setItem(i, 1, QTableWidgetItem(str(item["student_mec"])))
            self.result_table.setItem(i, 2, QTableWidgetItem(str(item["student_class"])))
            
            name_display = f"{item['student_name']} ({item['english_name']})" if item.get("english_name") else item["student_name"]
            self.result_table.setItem(i, 3, QTableWidgetItem(name_display))
            
            if self.broadcast_btn.isChecked():
                status_str = f"班級:{item['student_class']} (群發)"
            else:
                reasons = []
                if not item["is_test_passed"]:
                    reasons.append("單字未達標")
                if not item["is_book_passed"]:
                    reasons.append("小說未達標")
                reason_desc = " & ".join(reasons) if reasons else "皆達標"
                status_str = f"[{reason_desc}] 單字:{item['test_score']}/{item['pass_test_score']} | 書:{item['book_score']}/{item['pass_book_score']}"
                
            self.result_table.setItem(i, 4, QTableWidgetItem(status_str))
            
            # 第 5 欄：生成預覽內容
            preview_item = QTableWidgetItem(item["generated_text"].replace("\n", " "))
            if item.get("processed", False):
                for col in range(1, 6):
                    if self.result_table.item(i, col):
                        self.result_table.item(i, col).setBackground(QColor(220, 245, 220))
                preview_item.setText(f"[已處理] {preview_item.text()}")
            self.result_table.setItem(i, 5, preview_item)

    def copy_single_and_mark(self, target_item):
        QApplication.clipboard().setText(target_item["generated_text"])
        target_item["processed"] = True
        self.render_table()

    def handle_process_error(self, err_msg):
        self.reload_same_btn.setEnabled(True)
        self.reload_same_btn.setText("🔄 重新載入")
        QMessageBox.critical(self, "錯誤", f"讀取或解析檔案發生錯誤：\n{err_msg}")

    def save_to_local_db(self):
        if not self.generated_data:
            QMessageBox.warning(self, "警告", "目前沒有可儲存的生成結果！")
            return
        try:
            history_data = {
                "version": APP_VERSION,
                "template": self.template_input.toPlainText(),
                "records": self.generated_data
            }
            save_json_safely(history_data, "history.json")
            QMessageBox.information(self, "成功", "已透過原子寫入安全儲存至本機 history.json！")
        except Exception as e:
            QMessageBox.critical(self, "錯誤", f"儲存失敗：{str(e)}")

    def open_history_dialog(self):
        dialog = HistoryDialog(self)
        dialog.exec()

    def copy_all_results(self):
        filtered = self.get_filtered_data()
        if not filtered:
            QMessageBox.warning(self, "警告", "目前分頁沒有內容可複製！")
            return
        
        all_text = "\n\n--- 隔開 ---\n\n".join([item["generated_text"] for item in filtered])
        QApplication.clipboard().setText(all_text)
        group_label = "全部" if self.selected_class_filter == "ALL" else f"「{self.selected_class_filter}」班級群組"
        QMessageBox.information(self, "完成", f"已將{group_label}共 {len(filtered)} 筆生成內容複製到剪貼簿！")


if __name__ == '__main__':
    app = QApplication(sys.argv)
    if os.name == 'nt':
        ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID('mycompany.english.batch.tool.2.0')
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
