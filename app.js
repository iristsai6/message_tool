const { useState, useEffect, useRef, useMemo } = React;

// --- SVG 圖示元件 ---
const SettingsIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>);
const RotateCwIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>);
const UploadIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>);
const SaveIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>);
const HistoryIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>);
const CopyIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>);
const CheckCircleIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const TrashIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);
const PlusIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const XIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const HelpCircleIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
const DownloadIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>);
const LinkIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>);
const BookOpenIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>);

// --- 預設資料 (v2.0.0 班級群組與 {BookScore} 變數) ---
const defaultStandards = {
    "150TH": { test: 85, book: 6, note: "進階班" },
    "200TH": { test: 80, book: 4, note: "基礎班" }
};

const defaultTemplates = {
    "預設英文學習狀況回報": "家長您好，和您分享孩子近期的英文學習狀況。\n\n{studentName}最近三次小考成績從 70 分、80 分進步到{test_score} 分，單字掌握比之前穩定；課堂上也開始能用完整句子回答問題。\n\n目前需要加強的是\n\n🔺 {加強項目}。\n🔺 閱讀提升一個level的小說。\n🔺 本班講師規定目標，目前累積到{BookScore}分！\n\n另外，本週有一項錄音尚未繳交。\n📍老師檢查方式會先確認完成狀況，再檢查發音與流暢度。\n\n我們已與講師確認，接下來會先帶孩子示範一次故事摘要，與朗讀。請孩子於下週上課前完成小說閱讀及補交錄音。",
    "群發訊息": "家長您好，提醒您{studentName}本週須參加{class}大會考唷！逾時十分鐘則不予入場考試!!",
    "短版提醒通知": "家長您好，提醒您孩子本週英文小考成績為 {test_score} 分，小說分數為 {BookScore} 分，尚未達到班級標準，再請協助提醒孩子完成進度與複習唷！"
};

// --- 聚光燈引導式教學彈窗組件 ---
function SpotlightTourModal({ onClose }) {
    const [step, setStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);

    const tourSteps = [
        {
            targetId: "tour-step-upload",
            icon: "📂",
            title: "第一步：匯入學員成績 Excel",
            desc: "點擊這裡的「選擇 Excel」上傳成績表（或點上方「輸出Excel 範本」下載標準格式）。更新檔案後隨時點「重新載入」即可套用最新資料。"
        },
        {
            targetId: "tour-step-params",
            icon: "🎯",
            title: "第二步：設定過濾條件與班級群組",
            desc: "選擇對應「讀本月份」，並使用下方膠囊按鈕切換「群發模式」、「小考未達標」或「小說未達標」。點「群組與模板管理」可自訂各班門檻。"
        },
        {
            targetId: "tour-step-template",
            icon: "📝",
            title: "第三步：選擇或微調訊息模板",
            desc: "從下拉選單切換通知模板，或直接在文字框修改內容。變數 {studentName}、{test_score}、{BookScore} 會自動替換為每位學員的實際成績。"
        },
        {
            targetId: "tour-step-results",
            icon: "🚀",
            title: "第四步：分群預覽與一鍵複製",
            desc: "符合條件的名單會即時顯示在右側，支援依「班級群組區分」頁籤篩選。點擊「複製訊息」會自動標記綠色已傳送，底部可一次複製全部結果。"
        }
    ];

    const current = tourSteps[step];
    const isLastStep = step === tourSteps.length - 1;

    useEffect(() => {
        const updatePosition = () => {
            const el = document.getElementById(current.targetId);
            if (el) {
                const rect = el.getBoundingClientRect();
                setTargetRect({
                    top: rect.top - 6,
                    left: rect.left - 6,
                    width: rect.width + 12,
                    height: rect.height + 12
                });
            } else {
                setTargetRect(null);
            }
        };

        const el = document.getElementById(current.targetId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        updatePosition();
        const timer1 = setTimeout(updatePosition, 120);
        const timer2 = setTimeout(updatePosition, 350);

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [step, current.targetId]);

    const getPopoverStyle = () => {
        if (!targetRect) {
            return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(360px, calc(100vw - 32px))' };
        }
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const cardW = Math.min(360, winW - 32);
        const estCardH = 265;
        const margin = 16;

        if (winW >= 1024) {
            if (targetRect.left < winW * 0.4) {
                const safeTop = Math.max(margin, Math.min(targetRect.top, winH - estCardH - margin));
                const safeLeft = Math.min(targetRect.left + targetRect.width + 20, winW - cardW - margin);
                return {
                    top: `${safeTop}px`,
                    left: `${safeLeft}px`,
                    width: `${cardW}px`
                };
            } else {
                const safeLeft = Math.max(margin, targetRect.left - cardW - 24);
                return {
                    top: '50%',
                    left: `${safeLeft}px`,
                    transform: 'translateY(-50%)',
                    width: `${cardW}px`
                };
            }
        }

        const targetBottom = targetRect.top + targetRect.height;
        const spaceBelow = winH - targetBottom;
        const spaceAbove = targetRect.top;

        let topPos;
        if (spaceBelow >= estCardH + margin) {
            topPos = targetBottom + 14;
        } else if (spaceAbove >= estCardH + margin) {
            topPos = targetRect.top - estCardH - 14;
        } else {
            topPos = Math.max(margin, winH - estCardH - margin);
        }

        return {
            top: `${Math.max(margin, Math.min(topPos, winH - estCardH - margin))}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${cardW}px`
        };
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
            {targetRect ? (
                <div
                    className="fixed rounded-xl border-2 border-amber-400 transition-all duration-300 ease-out pointer-events-none"
                    style={{
                        top: `${targetRect.top}px`,
                        left: `${targetRect.left}px`,
                        width: `${targetRect.width}px`,
                        height: `${targetRect.height}px`,
                        boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.78), 0 0 24px rgba(251, 191, 36, 0.65)'
                    }}
                />
            ) : (
                <div className="fixed inset-0 bg-slate-950/80" />
            )}

            <div
                style={getPopoverStyle()}
                className="fixed z-10 bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out"
            >
                <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                        功能導覽 {step + 1} / {tourSteps.length}
                    </span>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="關閉導覽">
                        <XIcon size={18} />
                    </button>
                </div>

                <div className="px-5 py-3">
                    <div className="flex items-center gap-2.5 mb-2">
                        <span className="text-2xl">{current.icon}</span>
                        <h3 className="text-base font-bold text-white">{current.title}</h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        {current.desc}
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 py-2.5">
                    {tourSteps.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setStep(idx)}
                            aria-label={`跳至第 ${idx + 1} 步`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                idx <= step
                                    ? 'w-6 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                                    : 'w-2 bg-slate-600 hover:bg-slate-500'
                            }`}
                        />
                    ))}
                </div>

                <div className="px-5 py-3 bg-slate-900/90 border-t border-slate-700 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="text-xs text-slate-400 hover:text-slate-200 transition-colors py-1"
                    >
                        略過導覽
                    </button>

                    <div className="flex items-center gap-2">
                        {step > 0 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
                            >
                                上一步
                            </button>
                        )}
                        <button
                            onClick={() => (isLastStep ? onClose() : setStep(step + 1))}
                            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold transition-colors shadow"
                        >
                            {isLastStep ? "完成導覽" : "下一步"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- 主應用程式 ---
function App() {
    const [standards, setStandards] = useState(defaultStandards);
    const [templates, setTemplates] = useState(defaultTemplates);
    
    const [currentTemplateName, setCurrentTemplateName] = useState("預設英文學習狀況回報");
    const [templateText, setTemplateText] = useState(defaultTemplates["預設英文學習狀況回報"]);
    
    const [month, setMonth] = useState("11");
    const [defaultTest, setDefaultTest] = useState("85");
    const [defaultBook, setDefaultBook] = useState("6");
    
    const [isBroadcast, setIsBroadcast] = useState(false);
    const [filterTest, setFilterTest] = useState(false);
    const [filterBook, setFilterBook] = useState(false);
    
    const [excelData, setExcelData] = useState([]);
    const [fileName, setFileName] = useState("");
    const [results, setResults] = useState([]);
    const [activeClassTab, setActiveClassTab] = useState("ALL");

    // 縮網址小工具狀態 (v2.0.0)
    const [longUrl, setLongUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [isShortening, setIsShortening] = useState(false);
    
    // 彈窗狀態
    const [showSettings, setShowSettings] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showTour, setShowTour] = useState(false);

    const fileInputRef = useRef(null);

    // --- 初始化從 LocalStorage 讀取資料 ---
    useEffect(() => {
        const savedStandards = localStorage.getItem('app_standards');
        const savedTemplates = localStorage.getItem('app_templates');
        if (savedStandards) setStandards(JSON.parse(savedStandards));
        if (savedTemplates) {
            const parsedTpls = JSON.parse(savedTemplates);
            setTemplates(parsedTpls);
            if (parsedTpls["預設英文學習狀況回報"]) {
                setCurrentTemplateName("預設英文學習狀況回報");
                setTemplateText(parsedTpls["預設英文學習狀況回報"]);
            } else {
                const firstKey = Object.keys(parsedTpls)[0];
                if (firstKey) {
                    setCurrentTemplateName(firstKey);
                    setTemplateText(parsedTpls[firstKey]);
                }
            }
        }

        // 初次開啟自動彈出聚光燈導覽
        const hasSeenTour = localStorage.getItem('app_seen_tour_v2');
        if (!hasSeenTour) {
            const timer = setTimeout(() => setShowTour(true), 400);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleCloseTour = () => {
        setShowTour(false);
        localStorage.setItem('app_seen_tour_v2', 'true');
    };

    // --- 防阻擋複製文字 ---
    const executeCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                alert("複製失敗，請檢查瀏覽器權限或手動複製。");
            }
            document.body.removeChild(textArea);
        }
    };

    // --- 輸出 / 複製 Excel 範本 (v2.0.0) ---
    const handleExportSampleExcel = async () => {
        const sampleRows = [
            {
                studentMec: "1001",
                class: "150TH",
                studentName: "王小明",
                englishName: "Kevin",
                test_score: 78,
                [`BookScore(${month})`]: 4,
                "加強項目": "單字拼寫與句型結構"
            },
            {
                studentMec: "1002",
                class: "200TH",
                studentName: "陳小美",
                englishName: "Amy",
                test_score: 92,
                [`BookScore(${month})`]: 2,
                "加強項目": "小說閱讀進度"
            }
        ];

        const headers = Object.keys(sampleRows[0]);
        const tsvText = [
            headers.join('\t'),
            ...sampleRows.map(r => headers.map(h => r[h]).join('\t'))
        ].join('\n');
        await executeCopy(tsvText);

        if (window.XLSX) {
            const ws = window.XLSX.utils.json_to_sheet(sampleRows);
            const wb = window.XLSX.utils.book_new();
            window.XLSX.utils.book_append_sheet(wb, ws, "學員成績範本");
            window.XLSX.writeFile(wb, `學員成績範本_${month}月.xlsx`);
        } else {
            alert("已將標準表頭格式複製到剪貼簿，可直接貼上 Excel！");
        }
    };

    // --- 縮網址 URL 小工具 (v2.0.0) ---
    const handleShortenUrl = async () => {
        const trimmed = longUrl.trim();
        if (!trimmed) return alert("請先輸入欲縮短的網址！");
        const formattedUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

        setIsShortening(true);
        try {
            const res = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(formattedUrl)}`);
            const data = await res.json();
            if (data.shorturl) {
                setShortUrl(data.shorturl);
                await executeCopy(data.shorturl);
            } else {
                throw new Error(data.errormessage || "縮網址轉換失敗");
            }
        } catch (err) {
            alert(`縮網址服務暫時無法連線（${err.message}），請確認網址格式是否正確。`);
        } finally {
            setIsShortening(false);
        }
    };

    const handleInsertShortUrl = () => {
        if (!shortUrl) return;
        setTemplateText(prev => `${prev}\n${shortUrl}`);
    };

    // --- 模板變更處理 ---
    const handleTemplateChange = (e) => {
        const name = e.target.value;
        setCurrentTemplateName(name);
        setTemplateText(templates[name] || "");
    };

    // --- Excel 處理邏輯 ---
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (evt) => {
            if (!window.XLSX) {
                alert("Excel 處理模組載入失敗，請檢查網路連線。");
                return;
            }
            const bstr = evt.target.result;
            const wb = window.XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = window.XLSX.utils.sheet_to_json(ws);
            setExcelData(data);
            setActiveClassTab("ALL");
        };
        reader.readAsBinaryString(file);
    };

    const reloadData = () => {
        if (excelData.length === 0) {
            alert("請先選擇 Excel 檔案！");
            return;
        }
        
        // 支援 BookScore(月份) 並向下相容 BookCount(月份) / book_score(月份)
        const bookScoreCol = `bookscore(${month})`.toLowerCase();
        const bookCountCol = `bookcount(${month})`.toLowerCase();
        const legacyBookCol = `book_score(${month})`.toLowerCase();
        const defT = parseFloat(defaultTest) || 85.0;
        const defB = parseFloat(defaultBook) || 6.0;

        const newResults = [];
        const pattern = /__(.*?)__|{(.*?)}/g;

        excelData.forEach((row, index) => {
            const lowerRow = {};
            Object.keys(row).forEach(k => lowerRow[k.toLowerCase().trim()] = row[k]);

            const rawTest = lowerRow['test_score'];
            const testScore = parseFloat(rawTest) || 0.0;

            const rawBook = lowerRow[bookScoreCol] !== undefined
                ? lowerRow[bookScoreCol]
                : (lowerRow[bookCountCol] !== undefined ? lowerRow[bookCountCol] : lowerRow[legacyBookCol]);
            const bookScore = parseFloat(rawBook) || 0.0;

            const studentClass = String(lowerRow['class'] || '預設班級').trim();
            const clsStd = standards[studentClass] || {};
            const passTestScore = clsStd.test !== undefined ? clsStd.test : defT;
            const passBookScore = clsStd.book !== undefined ? clsStd.book : defB;

            const isTestPassed = testScore >= passTestScore;
            const isBookPassed = bookScore >= passBookScore;

            let shouldKeep = false;
            if (isBroadcast) {
                shouldKeep = true;
            } else if (filterTest && filterBook) {
                if (!isTestPassed || !isBookPassed) shouldKeep = true;
            } else if (filterTest) {
                if (!isTestPassed) shouldKeep = true;
            } else if (filterBook) {
                if (!isBookPassed) shouldKeep = true;
            } else {
                if (!isTestPassed || !isBookPassed) shouldKeep = true;
            }

            if (!shouldKeep) return;

            // 替換模板變數
            let currentText = templateText;
            currentText = currentText.replace(pattern, (match, p1, p2) => {
                let varName = (p1 || p2).trim().toLowerCase();
                if (varName.includes('bookscore') || varName.includes('bookcount') || varName.includes('book_score')) {
                    return rawBook !== undefined ? String(rawBook) : '0';
                }
                if (varName === 'name') {
                    return lowerRow['studentname'] !== undefined ? String(lowerRow['studentname']) : (lowerRow['name'] || '');
                }
                return lowerRow[varName] !== undefined ? String(lowerRow[varName]) : '';
            });

            const studentName = String(lowerRow['studentname'] || lowerRow['name'] || `學員 ${index + 1}`).trim();
            const studentMec = lowerRow['studentmec'] || (index + 1);
            const englishName = lowerRow['englishname'] || '';

            newResults.push({
                studentMec,
                studentClass,
                studentName,
                englishName,
                testScore, passTestScore,
                bookScore, passBookScore,
                isTestPassed, isBookPassed,
                generatedText: currentText,
                processed: false
            });
        });

        setResults(newResults);
    };

    useEffect(() => {
        if (excelData.length > 0) {
            reloadData();
        }
    }, [excelData, templateText, month, defaultTest, defaultBook, isBroadcast, filterTest, filterBook, standards]);

    // --- 班級群組頁籤 ---
    const classTabs = useMemo(() => {
        const classes = Array.from(new Set(results.map(r => r.studentClass)));
        return ["ALL", ...classes];
    }, [results]);

    const displayedResults = useMemo(() => {
        if (activeClassTab === "ALL") return results;
        return results.filter(r => r.studentClass === activeClassTab);
    }, [results, activeClassTab]);

    const handleCopy = async (targetItem) => {
        await executeCopy(targetItem.generatedText);
        setResults(prev => prev.map(item =>
            item === targetItem ? { ...item, processed: true } : item
        ));
    };

    const handleCopyAll = async () => {
        if (displayedResults.length === 0) return;
        const allText = displayedResults.map(r => r.generatedText).join('\n\n--- 隔開 ---\n\n');
        await executeCopy(allText);
        alert(`已將目前顯示的 ${displayedResults.length} 筆生成內容複製到剪貼簿！`);
    };

    const saveToLocalDB = () => {
        if (results.length === 0) {
            alert("目前沒有可儲存的生成結果！");
            return;
        }
        try {
            const existingHistory = JSON.parse(localStorage.getItem('app_history') || '[]');
            const newRecord = {
                date: new Date().toLocaleString(),
                template: templateText,
                records: results
            };
            existingHistory.unshift(newRecord);
            localStorage.setItem('app_history', JSON.stringify(existingHistory));
            alert("已成功儲存至本機歷史紀錄！");
        } catch (e) {
            alert(`儲存失敗：${e.message}`);
        }
    };

    const rightTitle = useMemo(() => {
        if (isBroadcast) return "2. 全體學生群發名單與即時確認區 (群發模式)：";
        if (filterTest && filterBook) return "2. 未達標學生名單 (小考或小說未達標)：";
        if (filterTest) return "2. 小考未達標：";
        if (filterBook) return "2. 小說未達標：";
        return "2. 未達標學生名單與即時確認區：";
    }, [isBroadcast, filterTest, filterBook]);

    return (
        <div className="h-full flex flex-col p-4">
            {/* Header */}
            <header className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700 shrink-0">
                <div className="flex items-center gap-3">
                    <img
                        src="icon.png"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://img.icons8.com/color/48/minecraft-golden-apple.png"; }}
                        alt="icon"
                        className="w-8 h-8 rounded object-contain"
                    />
                    <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                        智慧批次模板生成小工具
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                            v2.0.0
                        </span>
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={handleExportSampleExcel}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors"
                    >
                        <DownloadIcon size={15} /> 輸出Excel 範本
                    </button>
                    <button
                        onClick={() => setShowTour(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/40 text-xs font-bold transition-colors"
                    >
                        <HelpCircleIcon size={15} /> 聚光燈導覽
                    </button>
                    <button 
                        onClick={() => setShowHelp(true)}
                        className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                        <BookOpenIcon size={15} /> 操作說明 & Q&A
                    </button>
                </div>
            </header>

            {/* Main Content Splitter */}
            <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
                
                {/* 左側面板 */}
                <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0 overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* 步驟 1：檔案操作區 */}
                    <div id="tour-step-upload" className="bg-slate-800/70 border border-slate-700 rounded-xl p-3.5 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. 成績檔案匯入</span>
                            <span className="text-xs text-amber-400/90 truncate max-w-[180px]">
                                {fileName ? fileName : "尚未選擇檔案"}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-200 hover:bg-white text-slate-900 font-semibold py-2 rounded-lg text-sm transition-colors"
                            >
                                <UploadIcon size={16} /> 選擇 Excel
                            </button>
                            <input type="file" accept=".xlsx, .xls" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                            
                            <button 
                                onClick={reloadData}
                                className="flex-1 flex items-center justify-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50 font-semibold py-2 rounded-lg text-sm transition-colors"
                            >
                                <RotateCwIcon size={16} /> 重新載入
                            </button>
                        </div>
                    </div>

                    {/* 步驟 2：參數設定與過濾條件 */}
                    <div id="tour-step-params" className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-3.5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. 參數設定與過濾條件</h3>
                        
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm">對應讀本月份:</label>
                            <select 
                                className="bg-slate-700 border border-slate-600 rounded p-1.5 px-3 text-sm outline-none"
                                value={month} onChange={e => setMonth(e.target.value)}
                            >
                                {["12","11","10","9","8","7","6","5","4","3","2","1"].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm whitespace-nowrap">預設小考:</label>
                            <input type="number" className="bg-slate-700 border border-slate-600 rounded p-1.5 w-full text-sm outline-none" value={defaultTest} onChange={e => setDefaultTest(e.target.value)} />
                            <label className="text-sm whitespace-nowrap ml-2">預設小說:</label>
                            <input type="number" className="bg-slate-700 border border-slate-600 rounded p-1.5 w-full text-sm outline-none" value={defaultBook} onChange={e => setDefaultBook(e.target.value)} />
                        </div>

                        {/* 膠囊切換按鈕區 (v2.0.0) */}
                        <div className="flex flex-wrap gap-2 mt-1">
                            <button
                                type="button"
                                onClick={() => setIsBroadcast(v => !v)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                    isBroadcast
                                        ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-sm'
                                        : 'bg-slate-900/70 text-slate-400 border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                📢 群發模式
                            </button>
                            <button
                                type="button"
                                disabled={isBroadcast}
                                onClick={() => setFilterTest(v => !v)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all disabled:opacity-40 ${
                                    filterTest && !isBroadcast
                                        ? 'bg-blue-500 text-white border-blue-400 shadow-sm'
                                        : 'bg-slate-900/70 text-slate-400 border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                🎯 小考未達標
                            </button>
                            <button
                                type="button"
                                disabled={isBroadcast}
                                onClick={() => setFilterBook(v => !v)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all disabled:opacity-40 ${
                                    filterBook && !isBroadcast
                                        ? 'bg-blue-500 text-white border-blue-400 shadow-sm'
                                        : 'bg-slate-900/70 text-slate-400 border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                🎯 小說未達標
                            </button>
                        </div>

                        <button 
                            onClick={() => setShowSettings(true)}
                            className="mt-1 w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-lg text-sm transition-colors border border-slate-600"
                        >
                            <SettingsIcon size={16} /> 群組與模板管理
                        </button>
                    </div>

                    {/* 步驟 3：模板選擇與編輯 */}
                    <div id="tour-step-template" className="flex flex-col gap-2 rounded-xl">
                        <label className="font-bold text-slate-300 text-sm">3. 選擇訊息模板：</label>
                        <select 
                            className="bg-slate-800 border border-slate-600 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-amber-500"
                            value={currentTemplateName}
                            onChange={handleTemplateChange}
                        >
                            {Object.keys(templates).map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                        <textarea 
                            className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm text-slate-200 h-40 resize-none outline-none focus:border-amber-500 mt-1 custom-scrollbar"
                            value={templateText}
                            onChange={(e) => setTemplateText(e.target.value)}
                        />
                    </div>

                    {/* 縮網址 URL 小工具 (v2.0.0) */}
                    <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-3.5 flex flex-col gap-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                            <LinkIcon size={14} className="text-amber-400" /> 縮網址 URL 小工具
                        </div>
                        <div className="flex gap-1.5">
                            <input
                                type="text"
                                placeholder="貼上長網址 (例如 Google 表單)..."
                                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                                value={longUrl}
                                onChange={e => setLongUrl(e.target.value)}
                            />
                            <button
                                onClick={handleShortenUrl}
                                disabled={isShortening}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 text-xs font-bold transition-colors shrink-0"
                            >
                                {isShortening ? "處理中" : "縮短"}
                            </button>
                        </div>
                        {shortUrl && (
                            <div className="flex items-center justify-between gap-2 bg-slate-900/90 border border-slate-700 rounded-lg px-2.5 py-1.5">
                                <span className="text-xs text-emerald-400 font-mono truncate">{shortUrl}</span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => executeCopy(shortUrl)}
                                        className="text-[11px] px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
                                    >
                                        複製
                                    </button>
                                    <button
                                        onClick={handleInsertShortUrl}
                                        className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40"
                                    >
                                        插入模板
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 歷史紀錄操作區 */}
                    <div className="flex flex-col gap-2 pb-2">
                        <button 
                            onClick={saveToLocalDB}
                            className="w-full flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 font-semibold py-2.5 rounded-lg text-sm transition-colors"
                        >
                            <SaveIcon size={17} /> 將結果儲存至歷史紀錄
                        </button>
                        
                        <button 
                            onClick={() => setShowHistory(true)}
                            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-colors"
                        >
                            <HistoryIcon size={17} /> 查看本機歷史紀錄
                        </button>
                    </div>
                </div>

                {/* 步驟 4：右側結果表格 */}
                <div id="tour-step-results" className="flex-1 flex flex-col overflow-hidden bg-slate-800 border border-slate-700 rounded-xl">
                    <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex flex-wrap items-center justify-between gap-3">
                        <span className="font-bold text-white">{rightTitle}</span>
                        
                        {/* 班級群組區分頁籤 */}
                        {results.length > 0 && (
                            <div className="flex items-center gap-1.5 overflow-x-auto">
                                {classTabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveClassTab(tab)}
                                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                                            activeClassTab === tab
                                                ? 'bg-amber-500 text-slate-900'
                                                : 'bg-slate-700/70 text-slate-300 hover:bg-slate-600'
                                        }`}
                                    >
                                        {tab === "ALL" ? `全部 (${results.length})` : tab}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse text-sm min-w-[800px] md:min-w-full">
                            <thead className="sticky top-0 bg-slate-900 border-b border-slate-700 shadow-md z-10">
                                <tr>
                                    <th className="p-3 w-20 text-center text-slate-400">學號/項次</th>
                                    <th className="p-3 w-24 text-slate-400">班級</th>
                                    <th className="p-3 w-40 text-slate-400">學員姓名 (英)</th>
                                    <th className="p-3 w-64 text-slate-400">小考/小說成績</th>
                                    <th className="p-3 text-slate-400">生成預覽內容</th>
                                    <th className="p-3 w-32 text-center text-slate-400">快速操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {displayedResults.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500">
                                            尚未載入資料或無符合條件之學員
                                        </td>
                                    </tr>
                                ) : (
                                    displayedResults.map((item, idx) => {
                                        let statusStr = "";
                                        if (isBroadcast) {
                                            statusStr = `班級:${item.studentClass} (群發)`;
                                        } else {
                                            const reasons = [];
                                            if (!item.isTestPassed) reasons.push("單字未達標");
                                            if (!item.isBookPassed) reasons.push("小說未達標");
                                            const reasonDesc = reasons.length ? reasons.join(" & ") : "皆達標";
                                            statusStr = `[${reasonDesc}] 單字:${item.testScore}/${item.passTestScore} | 書:${item.bookScore}/${item.passBookScore}`;
                                        }

                                        return (
                                            <tr key={item.studentMec + '-' + idx} className={`transition-colors ${item.processed ? 'bg-emerald-900/20' : 'hover:bg-slate-700/30'}`}>
                                                <td className="p-3 text-center text-slate-400">{item.studentMec}</td>
                                                <td className="p-3 font-semibold text-amber-400">{item.studentClass}</td>
                                                <td className="p-3 font-bold text-slate-200">
                                                    {item.studentName} {item.englishName ? `(${item.englishName})` : ''}
                                                </td>
                                                <td className="p-3 text-slate-300 text-xs leading-relaxed">{statusStr}</td>
                                                <td className="p-3 text-slate-300">
                                                    <div className="line-clamp-3 text-xs opacity-90 whitespace-pre-wrap">{item.generatedText}</div>
                                                </td>
                                                <td className="p-3 text-center">
                                                    {item.processed ? (
                                                        <button className="w-full flex items-center justify-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-1.5 rounded text-xs font-bold pointer-events-none">
                                                            <CheckCircleIcon size={14} /> 已傳送
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleCopy(item)}
                                                            className="w-full flex items-center justify-center gap-1 bg-blue-500 text-white py-1.5 rounded text-xs font-bold hover:bg-blue-600 transition-colors shadow-sm"
                                                        >
                                                            <CopyIcon size={14} /> 複製訊息
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-700 bg-slate-900/50">
                        <button 
                            onClick={handleCopyAll}
                            className="w-full bg-slate-200 hover:bg-white text-slate-900 font-bold py-3 rounded-xl transition-colors shadow-lg"
                        >
                            一鍵複製全部生成結果
                        </button>
                    </div>
                </div>
            </div>

            {showSettings && (
                <SettingsModal 
                    standards={standards} 
                    templates={templates} 
                    onClose={() => setShowSettings(false)} 
                    onSave={(newStds, newTpls) => {
                        setStandards(newStds);
                        setTemplates(newTpls);
                        localStorage.setItem('app_standards', JSON.stringify(newStds));
                        localStorage.setItem('app_templates', JSON.stringify(newTpls));
                        setShowSettings(false);
                    }}
                />
            )}

            {showHistory && (
                <HistoryModal onClose={() => setShowHistory(false)} />
            )}

            {showHelp && (
                <HelpModal 
                    onClose={() => setShowHelp(false)} 
                    onStartTour={() => { setShowHelp(false); setShowTour(true); }} 
                />
            )}

            {showTour && (
                <SpotlightTourModal onClose={handleCloseTour} />
            )}
        </div>
    );
}

// --- 視覺化班級群組與模板管理對話框 (v2.0.0) ---
function SettingsModal({ standards, templates, onClose, onSave }) {
    const firstTplKey = Object.keys(templates)[0] || "";
    const [localStds, setLocalStds] = useState(standards);
    const [newClassCode, setNewClassCode] = useState("");
    const [newClassNote, setNewClassNote] = useState("");
    const [newClassTest, setNewClassTest] = useState("85");
    const [newClassBook, setNewClassBook] = useState("6");

    const [localTpls, setLocalTpls] = useState(templates);
    const [selectedTpl, setSelectedTpl] = useState(firstTplKey);
    const [tplNameInput, setTplNameInput] = useState(firstTplKey);
    const [tplContentInput, setTplContentInput] = useState(templates[firstTplKey] || "");

    const handleAddGroup = () => {
        const cls = newClassCode.trim();
        if (!cls) return alert("請輸入班級代碼（例如 300TH）！");
        setLocalStds(prev => ({
            ...prev,
            [cls]: {
                test: parseFloat(newClassTest) || 0,
                book: parseFloat(newClassBook) || 0,
                note: newClassNote.trim()
            }
        }));
        setNewClassCode("");
        setNewClassNote("");
    };

    const handleUpdateGroupScore = (cls, field, val) => {
        setLocalStds(prev => ({
            ...prev,
            [cls]: {
                ...prev[cls],
                [field]: parseFloat(val) || 0
            }
        }));
    };

    const handleDeleteGroup = (cls) => {
        const copy = { ...localStds };
        delete copy[cls];
        setLocalStds(copy);
    };

    const handleSelectTpl = (name) => {
        setSelectedTpl(name);
        setTplNameInput(name);
        setTplContentInput(localTpls[name] || "");
    };

    const handleAddUpdate = () => {
        const name = tplNameInput.trim();
        if (!name) return alert("模板名稱不可為空！");
        setLocalTpls(prev => ({ ...prev, [name]: tplContentInput }));
        setSelectedTpl(name);
        alert(`模板「${name}」已暫存！記得點擊最下方儲存設定。`);
    };

    const handleDelete = () => {
        if (!selectedTpl) return;
        if (Object.keys(localTpls).length <= 1) return alert("至少需要保留一個模板！");
        const newTpls = { ...localTpls };
        delete newTpls[selectedTpl];
        setLocalTpls(newTpls);
        const firstKey = Object.keys(newTpls)[0];
        handleSelectTpl(firstKey);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-3xl flex flex-col overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2"><SettingsIcon size={20} className="text-amber-400"/> 班級群組與模板管理 (v2.0.0)</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><XIcon size={24} /></button>
                </div>
                
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 max-h-[68vh]">
                    {/* 視覺化班級群組設定 */}
                    <div className="flex flex-col gap-3">
                        <label className="block font-bold text-slate-200">📊 班級群組與達標門檻設定：</label>
                        
                        {/* 新增群組列 */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-900/70 p-3 rounded-xl border border-slate-700">
                            <input
                                type="text"
                                placeholder="班級代碼 (如 300TH)"
                                className="bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                                value={newClassCode}
                                onChange={e => setNewClassCode(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="群組備註 (選填)"
                                className="bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                                value={newClassNote}
                                onChange={e => setNewClassNote(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="小考標準"
                                className="bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                                value={newClassTest}
                                onChange={e => setNewClassTest(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="小說標準"
                                className="bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                                value={newClassBook}
                                onChange={e => setNewClassBook(e.target.value)}
                            />
                            <button
                                onClick={handleAddGroup}
                                className="col-span-2 sm:col-span-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                            >
                                <PlusIcon size={14} /> 新增群組
                            </button>
                        </div>

                        {/* 已建立群組卡片清單 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {Object.entries(localStds).map(([cls, val]) => (
                                <div key={cls} className="flex items-center justify-between gap-2 bg-slate-900/50 border border-slate-700 rounded-xl p-3">
                                    <div className="min-w-0">
                                        <div className="font-bold text-amber-400 text-sm truncate">{cls}</div>
                                        {val.note && <div className="text-[11px] text-slate-400 truncate">{val.note}</div>}
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="text-[11px] text-slate-400">小考</span>
                                        <input
                                            type="number"
                                            className="w-14 bg-slate-800 border border-slate-600 rounded px-1.5 py-1 text-xs text-center text-white"
                                            value={val.test}
                                            onChange={e => handleUpdateGroupScore(cls, 'test', e.target.value)}
                                        />
                                        <span className="text-[11px] text-slate-400">小說</span>
                                        <input
                                            type="number"
                                            className="w-12 bg-slate-800 border border-slate-600 rounded px-1.5 py-1 text-xs text-center text-white"
                                            value={val.book}
                                            onChange={e => handleUpdateGroupScore(cls, 'book', e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleDeleteGroup(cls)}
                                            className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                                            title="刪除群組"
                                        >
                                            <TrashIcon size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-slate-700"/>

                    {/* 模板管理 */}
                    <div className="flex flex-col gap-3">
                        <label className="block font-bold text-slate-200">📝 訊息模板管理區：</label>
                        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-60">
                            <div className="w-full md:w-1/3 h-32 md:h-auto border border-slate-700 rounded-lg overflow-y-auto custom-scrollbar bg-slate-900/50 p-2">
                                {Object.keys(localTpls).map(name => (
                                    <div 
                                        key={name} 
                                        onClick={() => handleSelectTpl(name)}
                                        className={`p-2 rounded cursor-pointer text-sm mb-1 truncate ${selectedTpl === name ? 'bg-amber-500 text-slate-900 font-bold' : 'hover:bg-slate-700 text-slate-300'}`}
                                    >
                                        {name}
                                    </div>
                                ))}
                            </div>
                            <div className="w-full md:w-2/3 flex flex-col gap-2 mt-2 md:mt-0">
                                <input 
                                    type="text" placeholder="新模板名稱" 
                                    className="bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 text-sm outline-none focus:border-amber-500"
                                    value={tplNameInput} onChange={e => setTplNameInput(e.target.value)}
                                />
                                <textarea 
                                    placeholder="在此輸入模板內容..." 
                                    className="flex-1 min-h-[120px] bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 text-sm resize-none outline-none focus:border-amber-500 custom-scrollbar"
                                    value={tplContentInput} onChange={e => setTplContentInput(e.target.value)}
                                />
                                <div className="flex gap-2 mt-1">
                                    <button onClick={handleAddUpdate} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-colors"><PlusIcon size={16}/> 新增/更新</button>
                                    <button onClick={handleDelete} className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-colors"><TrashIcon size={16}/> 刪除</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-700 flex justify-end gap-3 bg-slate-900">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors font-semibold">取消</button>
                    <button onClick={() => onSave(localStds, localTpls)} className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold transition-colors shadow-lg">儲存設定</button>
                </div>
            </div>
        </div>
    );
}

// --- 操作說明與常見問題 Q&A 對話框 (v2.0.0 完整版) ---
function HelpModal({ onClose, onStartTour }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState(0);

    const faqList = [
        {
            q: "Q1：為什麼切換「對應讀本月份」或重新載入後，小說分數顯示為 0 或空白？",
            a: "請確認 Excel 標題列包含 BookScore(月份)（例如 BookScore(11)），且訊息模板內使用 {BookScore} 變數。若瀏覽器曾儲存過舊版模板，請點選「群組與模板管理」，將舊變數 {BookCount} 修改為 {BookScore} 並儲存即可。"
        },
        {
            q: "Q2：為什麼學生明明有成績，卻被誤判為「未達標」？",
            a: "常見原因有兩個：1. Excel 中的 test_score 或讀本分數欄位留白、輸入全形數字或填入文字（如「缺考」），系統會防呆視為 0 分；2. Excel 的 class 班級名稱多打空白或大小寫不符（例如 150 TH 與設定的 150TH 不符），導致系統改套用「預設小考/小說分數」進行篩選。"
        },
        {
            q: "Q3：換一台電腦或改用其他瀏覽器開啟，自訂模板與歷史紀錄不見了？",
            a: "網頁版為了免安裝與保護隱私，所有自訂模板、班級門檻與歷史紀錄皆儲存在「當前瀏覽器的本機空間（LocalStorage）」中，不會上傳至雲端。請固定使用同一台電腦與瀏覽器操作，並避免在無痕模式使用或手動清除瀏覽器網站資料。"
        },
        {
            q: "Q4：上傳 Excel 時跳出「Excel 處理模組載入失敗」或縮網址功能無反應？",
            a: "網頁版需透過網路載入 Excel 解析套件（SheetJS）與連線至縮網址服務。請確認網路連線正常，並按 Ctrl + F5（Mac 為 Cmd + Shift + R）強制重新整理網頁；若學校或公司防火牆阻擋外部 CDN，建議切換至手機熱點測試。"
        },
        {
            q: "Q5：點擊「複製訊息」按鈕後，貼上時卻沒有內容？",
            a: "部分瀏覽器安全性設定或內嵌預覽視窗會限制網頁自動寫入剪貼簿。請確認網址列左側的網站權限是否允許「剪貼簿」存取；若仍受限，可直接從右側表格預覽框手動選取文字複製。"
        },
        {
            q: "Q6：擔心 Excel 欄位名稱打錯或格式不符怎麼辦？",
            a: "直接點擊網頁頂部的「輸出Excel 範本」按鈕，系統會自動下載標準 .xlsx 範例檔（包含 studentMec、class、studentName、englishName、test_score、BookScore(月份) 等標準表頭），並同步複製格式供直接貼上。"
        }
    ];

    const filteredFaqs = faqList.filter(
        item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/80 shrink-0">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        🚨 操作說明與常見問題 Q&A
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">v2.0.0</span>
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><XIcon size={24} /></button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-5 text-sm text-slate-300">
                    {/* 老師必看 3 條核心提醒 */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                        <h3 className="font-bold text-amber-400 text-sm mb-2">⚡ 老師必看：3 個最關鍵的使用提醒</h3>
                        <ul className="text-xs text-slate-200 space-y-1.5 list-disc pl-4 leading-relaxed">
                            <li><strong>欄位對齊：</strong>Excel 讀本欄位請命名為 <code className="text-amber-300 bg-slate-900 px-1 rounded">BookScore(月份)</code>，模板變數統一使用 <code className="text-amber-300 bg-slate-900 px-1 rounded">{"{BookScore}"}</code>（不確定可直接點「輸出Excel 範本」）。</li>
                            <li><strong>純數字填寫：</strong>成績欄請勿留白或填「缺考」等文字，否則系統將一律防呆視為 <code className="text-amber-300 bg-slate-900 px-1 rounded">0</code> 分並列入未達標名單。</li>
                            <li><strong>固定設備操作：</strong>自訂模板與歷史紀錄皆保存在<strong>當前瀏覽器本機</strong>，請固定使用同一台電腦與瀏覽器，切勿使用無痕模式或清除網站快取。</li>
                        </ul>
                    </div>

                    {/* 可搜尋＋摺疊展開 Q&A */}
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="font-bold text-slate-200 text-sm">❓ 常見問題排查（點擊展開解答）</h3>
                            <input
                                type="text"
                                placeholder="🔍 搜尋問題（如：分數、換電腦、複製）..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500 w-full sm:w-60"
                            />
                        </div>

                        <div className="space-y-2">
                            {filteredFaqs.length === 0 ? (
                                <div className="text-center text-xs text-slate-500 py-5 bg-slate-900/40 rounded-xl border border-slate-700/50">
                                    找不到符合「{searchQuery}」的相關問題。
                                </div>
                            ) : (
                                filteredFaqs.map((item, idx) => {
                                    const isOpen = openIndex === idx;
                                    return (
                                        <div key={idx} className={`border rounded-xl transition-colors overflow-hidden ${isOpen ? "bg-slate-900/90 border-amber-500/50" : "bg-slate-900/40 border-slate-700 hover:border-slate-600"}`}>
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : idx)}
                                                className="w-full text-left p-3.5 flex items-center justify-between gap-3 text-xs font-bold text-slate-100"
                                            >
                                                <span>{item.q}</span>
                                                <span className={`text-amber-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}>▼</span>
                                            </button>
                                            {isOpen && (
                                                <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80">
                                                    {item.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Excel 欄位對照表 */}
                    <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                        <h3 className="font-bold text-amber-400 text-xs mb-2">📌 Excel 欄位對應表</h3>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                            <li><code>studentMec</code>：學員編號或項次</li>
                            <li><code>class</code>：班級代碼（對應「群組與模板管理」設定之門檻）</li>
                            <li><code>studentName</code>：學員中文姓名（模板變數 <code>{"{studentName}"}</code>）</li>
                            <li><code>englishName</code>：學員英文姓名（選填）</li>
                            <li><code>test_score</code>：小考成績（模板變數 <code>{"{test_score}"}</code>）</li>
                            <li><code>BookScore(月份)</code>：當月小說讀本分數，如 <code>BookScore(11)</code>（模板變數 <code>{"{BookScore}"}</code>）</li>
                        </ul>
                    </div>

                    {/* v2.0.0 更新亮點 */}
                    <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                        <h3 className="font-bold text-emerald-400 text-xs mb-2">✨ v2.0.0 版本更新亮點</h3>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                            <li>支援聚光燈互動教學導覽，隨時可點擊右上角「聚光燈導覽」重溫操作流程。</li>
                            <li>整合「縮網址 URL 小工具」，縮短後自動複製並可一鍵插入通知模板。</li>
                            <li>支援「輸出Excel 範本」，點擊同時下載 <code>.xlsx</code> 並複製標準表頭。</li>
                            <li>支援班級群組視覺化管理與右側分群頁籤快速篩選。</li>
                        </ul>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-700 bg-slate-900 flex justify-between items-center shrink-0">
                    <button
                        onClick={onStartTour}
                        className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold transition-colors"
                    >
                        🔦 啟動聚光燈互動導覽
                    </button>
                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold">
                        關閉
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- 歷史紀錄檢視對話框組件 ---
function HistoryModal({ onClose }) {
    const [history, setHistory] = useState([]);
    const [selectedIdx, setSelectedIdx] = useState(null);

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem('app_history') || '[]');
            setHistory(data);
            if (data.length > 0) setSelectedIdx(0);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const selectedRecord = selectedIdx !== null ? history[selectedIdx] : null;

    let detailStr = "";
    if (selectedRecord) {
        detailStr = `【儲存時間】\n${selectedRecord.date}\n\n【儲存的模板內容】\n${selectedRecord.template}\n\n${"=".repeat(40)}\n【學員生成紀錄】\n`;
        selectedRecord.records.forEach(rec => {
            const statusStr = rec.processed ? "[已處理]" : "[未處理]";
            detailStr += `${statusStr} 學號: ${rec.studentMec || 'N/A'} | 班級: ${rec.studentClass || 'N/A'} | 姓名: ${rec.studentName || 'N/A'} | 小考成績: ${rec.testScore || 0} | 小說分數: ${rec.bookScore || 0}\n`;
            detailStr += `內容: ${rec.generatedText}\n${"-".repeat(30)}\n`;
        });
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2"><HistoryIcon size={20} className="text-blue-400"/> 本機歷史紀錄檢視</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><XIcon size={24} /></button>
                </div>
                
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    <div className="w-full md:w-1/3 h-1/3 md:h-full border-b md:border-b-0 md:border-r border-slate-700 overflow-y-auto custom-scrollbar p-3 bg-slate-900/30">
                        <div className="font-bold text-slate-300 mb-3 ml-1 text-sm">已儲存的歷史批次紀錄：</div>
                        {history.length === 0 ? (
                            <div className="text-slate-500 text-sm p-2">尚無歷史紀錄。</div>
                        ) : (
                            history.map((h, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => setSelectedIdx(i)}
                                    className={`p-3 rounded-lg cursor-pointer mb-2 border transition-colors ${selectedIdx === i ? 'bg-blue-500/20 border-blue-500/50 text-blue-100' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                >
                                    <div className="text-xs font-mono text-slate-500 mb-1">{h.date}</div>
                                    <div className="text-sm truncate">模板: {h.template.substring(0, 20)}...</div>
                                    <div className="text-xs mt-1 text-amber-400/80">共 {h.records.length} 筆紀錄</div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="w-full md:w-2/3 h-2/3 md:h-full p-4 bg-slate-900">
                        <textarea 
                            readOnly
                            className="w-full h-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-300 text-sm font-mono resize-none outline-none custom-scrollbar whitespace-pre-wrap"
                            value={detailStr}
                            placeholder="點擊左側紀錄以檢視詳細內容與模板..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
