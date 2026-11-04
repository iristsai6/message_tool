import sys
import os
import json
import re
import tempfile
import ctypes
import pandas as pd
from PyQt6.QtCore import QThread, pyqtSignal, Qt
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QTextEdit, QLabel, QFileDialog, QTableWidget, 
    QTableWidgetItem, QMessageBox, QSplitter, QHeaderView, QLineEdit, QFormLayout, QGroupBox,
    QDialog, QListWidget, QComboBox, QCheckBox
)
from PyQt6.QtGui import QColor, QIcon

# --- 原子寫入 (Atomic Write) 函式 ---
def save_json_safely(data, target_file="history.json"):
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

# --- 歷史紀錄檢視視窗 ---
class HistoryDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("本機歷史紀錄檢視")
        self.resize(750, 500)
        
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
            
            item_desc = f"模板預覽: {template[:30]}... (共 {len(records)} 筆學員紀錄)"
            self.history_list_widget.addItem(item_desc)
        except Exception as e:
            self.history_list_widget.addItem(f"讀取歷史紀錄發生錯誤: {str(e)}")

    def show_detail(self, row):
        if not os.path.exists("history.json") or os.path.getsize("history.json") == 0:
            return
        try:
            with open("history.json", "r", encoding="utf-8") as f:
                data = json.load(f)
            
            template = data.get("template", "")
            records = data.get("records", [])
            
            detail_str = f"【儲存的模板內容】\n{template}\n\n" + "="*40 + "\n【學員生成紀錄】\n"
            for rec in records:
                status_str = "[已處理]" if rec.get('processed', False) else "[未處理]"
                detail_str += f"{status_str} 班級: {rec.get('student_class', 'N/A')} | 姓名: {rec.get('student_name', 'N/A')} | 小考成績: {rec.get('test_score', 'N/A')} | 小說分數: {rec.get('book_score', 'N/A')}\n"
                detail_str += f"內容: {rec.get('generated_text', '')}\n" + "-"*30 + "\n"
                
            self.detail_text.setPlainText(detail_str)
        except Exception as e:
            self.detail_text.setPlainText(f"解析紀錄失敗: {str(e)}")

# --- 進階設定與模板管理對話框 ---
class SettingsDialog(QDialog):
    def __init__(self, current_standards, current_templates, parent=None):
        super().__init__(parent)
        self.setWindowTitle("⚙️ 系統設定與模板管理")
        self.resize(600, 550)
        
        self.standards = current_standards.copy()
        self.templates = current_templates.copy()
        
        layout = QVBoxLayout(self)
        
        layout.addWidget(QLabel("<b>📊 各班級獨立標準設定 (格式: 班級:小考成績/小說分數)：</b>"))
        self.standards_input = QLineEdit()
        std_str_list = [f"{cls}:{val['test']}/{val['book']}" for cls, val in self.standards.items()]
        self.standards_input.setText(", ".join(std_str_list) if std_str_list else "150TH:85/6, 200TH:80/4")
        layout.addWidget(self.standards_input)
        
        layout.addWidget(QLabel("<small>範例：150TH:85/6, 200TH:80/4</small>"))
        layout.addSpacing(15)
        
        layout.addWidget(QLabel("<b>📝 訊息模板管理區：</b>"))
        self.template_list_widget = QListWidget()
        for name in self.templates.keys():
            self.template_list_widget.addItem(name)
        layout.addWidget(self.template_list_widget)
        
        self.tpl_name_input = QLineEdit()
        self.tpl_name_input.setPlaceholderText("新模板名稱")
        layout.addWidget(self.tpl_name_input)
        
        self.tpl_content_input = QTextEdit()
        self.tpl_content_input.setPlaceholderText("在此輸入模板內容...")
        layout.addWidget(self.tpl_content_input)
        
        btn_layout = QHBoxLayout()
        self.add_tpl_btn = QPushButton("新增/更新模板")
        self.del_tpl_btn = QPushButton("刪除選定模板")
        btn_layout.addWidget(self.add_tpl_btn)
        btn_layout.addWidget(self.del_tpl_btn)
        layout.addLayout(btn_layout)
        
        bottom_layout = QHBoxLayout()
        self.save_btn = QPushButton("儲存設定")
        self.cancel_btn = QPushButton("取消")
        bottom_layout.addWidget(self.save_btn)
        bottom_layout.addWidget(self.cancel_btn)
        layout.addLayout(bottom_layout)
        
        self.template_list_widget.currentRowChanged.connect(self.load_template_to_edit)
        self.add_tpl_btn.clicked.connect(self.save_template)
        self.del_tpl_btn.clicked.connect(self.delete_template)
        self.save_btn.clicked.connect(self.accept)
        self.cancel_btn.clicked.connect(self.reject)

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

    def get_updated_standards(self):
        standards = {}
        text = self.standards_input.text().strip()
        if text:
            parts = text.split(',')
            for part in parts:
                if ':' in part:
                    cls_name, val_part = part.split(':')
                    cls_name = cls_name.strip()
                    if '/' in val_part:
                        t_score, b_score = val_part.split('/')
                        try:
                            standards[cls_name] = {
                                "test": float(t_score.strip()),
                                "book": float(b_score.strip())
                            }
                        except ValueError:
                            continue
        return standards

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
            df = pd.read_excel(self.file_path)
            
            df.columns = df.columns.str.strip().str.lower()
            df_columns_set = set(df.columns)
            df = df.fillna("")
            
            book_score_col = f"book_score({self.selected_month})".lower()
            
            results = []
            pattern = re.compile(r'__(.*?)__|\{(.*?)\}')
            
            for index, row in df.iterrows():
                raw_score = str(row.get('test_score', '')).strip()
                try:
                    test_score = float(raw_score) if raw_score != '' else 0.0
                except ValueError:
                    test_score = 0.0
                
                raw_book_score = str(row.get(book_score_col, '')).strip()
                try:
                    book_score = float(raw_book_score) if raw_book_score != '' else 0.0
                except ValueError:
                    book_score = 0.0

                student_class = str(row.get('class', '預設班級')).strip()
                
                cls_std = self.class_standards.get(student_class, {})
                pass_test_score = cls_std.get("test", self.default_test_score)
                pass_book_score = cls_std.get("book", self.default_book_score)
                
                is_test_passed = (test_score >= pass_test_score)
                is_book_passed = (book_score >= pass_book_score)
                
                # --- 篩選邏輯判斷 ---
                if self.is_broadcast_mode:
                    # 群發模式：不進行任何成績過濾
                    pass
                elif self.filter_test_unmet and self.filter_book_unmet:
                    # 兩者都勾選：只要單字未達標 OR 小說未達標 就留下
                    if is_test_passed and is_book_passed:
                        continue
                elif self.filter_test_unmet:
                    # 僅勾選單字未達標：單字達標者直接跳過
                    if is_test_passed:
                        continue
                elif self.filter_book_unmet:
                    # 僅勾選小說未達標：小說達標者直接跳過
                    if is_book_passed:
                        continue
                else:
                    # 預設模式：兩者皆達標則跳過（任一未達標即列出）
                    if is_test_passed and is_book_passed:
                        continue
                
                current_text = self.template_text
                matches = pattern.findall(current_text)
                for match in matches:
                    var_name = match[0] if match[0] else match[1]
                    tag = f"__{var_name}__" if match[0] else f"{{{var_name}}}"
                    
                    lower_var_name = var_name.strip().lower()
                    
                    if "book_score" in lower_var_name:
                        target_col = book_score_col
                    else:
                        target_col = lower_var_name
                    
                    if target_col in df_columns_set:
                        col_idx = list(df.columns).index(target_col)
                        val = str(df.iloc[index, col_idx])
                        current_text = current_text.replace(tag, val)
                    else:
                        current_text = current_text.replace(tag, "")
                
                student_name = str(row.get('name', f"學員 {index+1}")).strip()
                if not student_name:
                    student_name = f"學員 {index+1}"
                
                results.append({
                    "row_index": index + 1,
                    "student_name": student_name,
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
        self.setWindowTitle("批次模板生成小工具")
        self.resize(1300, 780)
        
        # 🍎 設定視窗與工作列圖示 (圖示來源: Minecraft Golden Apple icon by Icons8)[cite: 5, 6]
        if os.path.exists("icon.png"):
            self.setWindowIcon(QIcon("icon.png"))
            
        self.excel_path = ""
        self.generated_data = []
        
        self.class_standards = {"150TH": {"test": 85, "book": 6}, "200TH": {"test": 80, "book": 4}}
        self.templates = {
            "預設英文學習狀況回報": (
                "家長您好，和您分享孩子近期的英文學習狀況。\n\n"
                "{name}最近三次小考成績從 70 分、80 分進步到{test_score} 分，單字掌握比之前穩定；課堂上也開始能用完整句子回答問題。\n\n"
                "目前需要加強的是\n\n"
                "🔺 {加強項目}。\n"
                "🔺 閱讀提升一個level的小說。\n"
                "🔺 本班講師規定目標，目前累積到{book_score}分！\n\n"
                "另外，本週有一項錄音尚未繳交。\n"
                "📍老師檢查方式會先確認完成狀況，再檢查發音與流暢度。\n\n"
                "我們已與講師確認，接下來會先帶孩子示範一次故事摘要，與朗讀。請孩子於下週上課前完成小說閱讀及補交錄音。"
            ),
            "群發訊息": (
                "家長您好，提醒您{name}本週須參加{class}大會考唷！逾時十分鐘則不予入場考試!!"
            ),
            "短版提醒通知": (
                "家長您好，提醒您孩子本週英文小考成績為 {test_score} 分，小說分數為 {book_score} 分，尚未達到班級標準，再請協助提醒孩子完成進度與複習唷！"
            )
        }
        
        self.init_ui()

    def init_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QHBoxLayout(central_widget)

        splitter = QSplitter(Qt.Orientation.Horizontal)
        main_layout.addWidget(splitter)

        # --- 左側：控制與模板輸入區 ---
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)

        tpl_select_layout = QHBoxLayout()
        tpl_select_layout.addWidget(QLabel("<b>選擇訊息模板：</b>"))
        self.tpl_combo = QComboBox()
        self.tpl_combo.addItems(list(self.templates.keys()))
        self.tpl_combo.currentIndexChanged.connect(self.on_template_changed)
        tpl_select_layout.addWidget(self.tpl_combo)
        left_layout.addLayout(tpl_select_layout)

        self.template_input = QTextEdit()
        self.template_input.setPlainText(list(self.templates.values())[0])
        left_layout.addWidget(self.template_input)

        settings_group = QGroupBox("參數設定與管理")
        settings_layout = QVBoxLayout()
        
        month_layout = QHBoxLayout()
        month_layout.addWidget(QLabel("對應讀本月份:"))
        self.month_combo = QComboBox()
        self.month_combo.addItems(["12","11","10", "9", "8", "7", "6", "5", "4", "3", "2", "1"])
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

        # 🎯 群發模式 CheckBox
        self.broadcast_checkbox = QCheckBox("啟用群發模式")
        self.broadcast_checkbox.stateChanged.connect(self.on_mode_changed)
        settings_layout.addWidget(self.broadcast_checkbox)

        # 🎯 獨立條件篩選 CheckBox 1：僅篩選小考未達標
        self.filter_test_checkbox = QCheckBox("🎯 僅篩選：小考未達標學員")
        self.filter_test_checkbox.stateChanged.connect(self.on_mode_changed)
        settings_layout.addWidget(self.filter_test_checkbox)

        # 🎯 獨立條件篩選 CheckBox 2：僅篩選小說未達標
        self.filter_book_checkbox = QCheckBox("🎯 僅篩選：小說未達標學員")
        self.filter_book_checkbox.stateChanged.connect(self.on_mode_changed)
        settings_layout.addWidget(self.filter_book_checkbox)

        self.open_settings_btn = QPushButton("⚙️ 開啟各班標準與模板管理設定")
        self.open_settings_btn.setStyleSheet("""
            QPushButton {
                background-color: #f2f2f2;
                color: #203764;
                border: 1px solid #b4c6e7;
                border-radius: 4px;
                padding: 6px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #d9e1f2;
            }
        """)
        self.open_settings_btn.clicked.connect(self.open_settings_dialog)
        settings_layout.addWidget(self.open_settings_btn)

        settings_group.setLayout(settings_layout)
        left_layout.addWidget(settings_group)

        self.file_label = QLabel("尚未選擇 Excel 檔案")
        left_layout.addWidget(self.file_label)

        file_btn_layout = QHBoxLayout()
        self.load_btn = QPushButton("選擇 Excel 檔案")
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
            QPushButton:hover {
                background-color: #ffe599;
            }
        """)
        self.reload_same_btn.clicked.connect(self.reload_same_excel)
        
        file_btn_layout.addWidget(self.load_btn)
        file_btn_layout.addWidget(self.reload_same_btn)
        left_layout.addLayout(file_btn_layout)

        self.save_history_btn = QPushButton("將結果儲存至本機資料庫 (Atomic Write)")
        self.save_history_btn.clicked.connect(self.save_to_local_db)
        left_layout.addWidget(self.save_history_btn)

        self.view_history_btn = QPushButton("查看本機歷史紀錄 (history.json)")
        self.view_history_btn.clicked.connect(self.open_history_dialog)
        left_layout.addWidget(self.view_history_btn)

        splitter.addWidget(left_widget)

        # --- 右側：預覽與結果列表區 ---
        right_widget = QWidget()
        right_layout = QVBoxLayout(right_widget)

        self.right_title_label = QLabel("<b>2. 未達標學生名單與即時確認區：</b>")
        right_layout.addWidget(self.right_title_label)
        
        self.result_table = QTableWidget()
        self.result_table.setColumnCount(6)
        self.result_table.setHorizontalHeaderLabels(["項次", "班級", "學員姓名", "小考/小說成績", "生成預覽內容", "快速操作"])
        self.result_table.horizontalHeader().setSectionResizeMode(0, QHeaderView.ResizeMode.ResizeToContents)
        self.result_table.horizontalHeader().setSectionResizeMode(1, QHeaderView.ResizeMode.ResizeToContents)
        self.result_table.horizontalHeader().setSectionResizeMode(2, QHeaderView.ResizeMode.ResizeToContents)
        self.result_table.horizontalHeader().setSectionResizeMode(3, QHeaderView.ResizeMode.ResizeToContents)
        self.result_table.horizontalHeader().setSectionResizeMode(4, QHeaderView.ResizeMode.Stretch)
        self.result_table.horizontalHeader().setSectionResizeMode(5, QHeaderView.ResizeMode.ResizeToContents)
        right_layout.addWidget(self.result_table)

        self.copy_all_btn = QPushButton("一鍵複製全部未達標生成結果")
        self.copy_all_btn.clicked.connect(self.copy_all_results)
        right_layout.addWidget(self.copy_all_btn)

        splitter.addWidget(right_widget)
        splitter.setSizes([450, 850])

    def on_template_changed(self, index):
        tpl_name = self.tpl_combo.currentText()
        if tpl_name in self.templates:
            self.template_input.setPlainText(self.templates[tpl_name])
            if self.excel_path and os.path.exists(self.excel_path):
                self.reload_same_excel()

    def on_month_changed(self, index):
        if self.excel_path and os.path.exists(self.excel_path):
            self.reload_same_excel()

    def on_mode_changed(self, state):
        if self.broadcast_checkbox.isChecked():
            self.right_title_label.setText("<b>2. 全體學生群發名單與即時確認區 (群發模式)：</b>")
            self.copy_all_btn.setText("一鍵複製全部群發生成結果")
        elif self.filter_test_checkbox.isChecked() and self.filter_book_checkbox.isChecked():
            self.right_title_label.setText("<b>2. 未達標學生名單 (小考或小說未達標)：</b>")
            self.copy_all_btn.setText("一鍵複製全部未達標生成結果")
        elif self.filter_test_checkbox.isChecked():
            self.right_title_label.setText("<b>2. 小考未達標：</b>")
            self.copy_all_btn.setText("一鍵複製全部未達標生成結果")
        elif self.filter_book_checkbox.isChecked():
            self.right_title_label.setText("<b>2. 小說未達標：</b>")
            self.copy_all_btn.setText("一鍵複製全部未達標生成結果")
        else:
            self.right_title_label.setText("<b>2. 未達標學生名單與即時確認區：</b>")
            self.copy_all_btn.setText("一鍵複製全部未達標生成結果")
            
        if self.excel_path and os.path.exists(self.excel_path):
            self.reload_same_excel()

    def reload_same_excel(self):
        if not self.excel_path or not os.path.exists(self.excel_path):
            QMessageBox.warning(self, "提示", "目前尚未選擇任何 Excel 檔案，請先點擊「選擇 Excel 檔案」！")
            return
        
        template_text = self.template_input.toPlainText()
        selected_month = self.month_combo.currentText()
        is_broadcast_mode = self.broadcast_checkbox.isChecked()
        filter_test_unmet = self.filter_test_checkbox.isChecked()
        filter_book_unmet = self.filter_book_checkbox.isChecked()
        
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
            self.tpl_combo.blockSignals(True)
            self.tpl_combo.clear()
            self.tpl_combo.addItems(list(self.templates.keys()))
            self.tpl_combo.blockSignals(False)
            QMessageBox.information(self, "成功", "各班標準與模板已成功更新！")
            
            if self.excel_path and os.path.exists(self.excel_path):
                self.reload_same_excel()

    def select_excel_and_run(self):
        file_name, _ = QFileDialog.getOpenFileName(self, "選擇 Excel 檔案", "", "Excel Files (*.xlsx *.xls)")
        if file_name:
            self.excel_path = file_name
            self.file_label.setText(f"已選擇：{os.path.basename(file_name)}")
            self.reload_same_excel()

    def handle_process_finished(self, results):
        self.generated_data = results
        self.reload_same_btn.setEnabled(True)
        self.reload_same_btn.setText("🔄 重新載入")
        self.load_btn.setText("選擇 Excel 檔案")
        self.render_table()

    def render_table(self):
        self.result_table.setRowCount(len(self.generated_data))
        for i, item in enumerate(self.generated_data):
            self.result_table.setItem(i, 0, QTableWidgetItem(str(item["row_index"])))
            self.result_table.setItem(i, 1, QTableWidgetItem(str(item["student_class"])))
            self.result_table.setItem(i, 2, QTableWidgetItem(str(item["student_name"])))
            
            if self.broadcast_checkbox.isChecked():
                status_str = f"班級:{item['student_class']} (群發)"
            else:
                reasons = []
                if not item["is_test_passed"]:
                    reasons.append("單字未達標")
                if not item["is_book_passed"]:
                    reasons.append("小說未達標")
                reason_desc = " & ".join(reasons) if reasons else "皆達標"
                status_str = f"[{reason_desc}] 單字:{item['test_score']}/{item['pass_test_score']} | 書:{item['book_score']}/{item['pass_book_score']}"
                
            self.result_table.setItem(i, 3, QTableWidgetItem(status_str))
            
            preview_item = QTableWidgetItem(item["generated_text"].replace("\n", " "))
            
            if item.get("processed", False):
                for col in range(5):
                    if self.result_table.item(i, col):
                        self.result_table.item(i, col).setBackground(QColor(220, 245, 220))
                preview_item.setText(f"[已處理] {preview_item.text()}")
            
            self.result_table.setItem(i, 4, preview_item)
            
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
                        background-color: #d9e1f2;
                        color: #1f3864;
                        border: 1px solid #b4c6e7;
                        border-radius: 4px;
                        padding: 4px 8px;
                        font-weight: bold;
                    }
                    QPushButton:hover {
                        background-color: #b4c6e7;
                    }
                """)
            
            copy_btn.clicked.connect(lambda checked, idx=i: self.copy_single_and_mark(idx))
            self.result_table.setCellWidget(i, 5, copy_btn)

    def copy_single_and_mark(self, index):
        if 0 <= index < len(self.generated_data):
            item = self.generated_data[index]
            clipboard = QApplication.clipboard()
            clipboard.setText(item["generated_text"])
            item["processed"] = True
            self.render_table()

    def handle_process_error(self, err_msg):
        self.reload_same_btn.setEnabled(True)
        self.reload_same_btn.setText("🔄 重新載入")
        self.load_btn.setText("選擇 Excel 檔案")
        QMessageBox.critical(self, "錯誤", f"讀取或解析 Excel 發生錯誤：\n{err_msg}")

    def save_to_local_db(self):
        if not self.generated_data:
            QMessageBox.warning(self, "警告", "目前沒有可儲存的生成結果！")
            return
        
        try:
            history_data = {
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
        if not self.generated_data:
            QMessageBox.warning(self, "警告", "沒有內容可複製！")
            return
        
        all_text = "\n\n--- 隔開 ---\n\n".join([item["generated_text"] for item in self.generated_data])
        clipboard = QApplication.clipboard()
        clipboard.setText(all_text)
        QMessageBox.information(self, "完成", "已將所有生成內容複製到剪貼簿！")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    
    if os.name == 'nt':
        ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID('mycompany.english.batch.tool.1.0')
        
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
