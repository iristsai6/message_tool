const { useState, useEffect, useRef, useMemo } = React;

const APP_VERSION = "v2.0.0";

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
const LinkIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>);
const DownloadIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>);
const FolderPlusIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>);
const BookOpenIcon = ({size=24, className=""}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>);

// --- 預設資料 ---
const defaultStandards = {
    "150TH": { test: 85, book: 6, groupName: "150TH 班級群組" },
    "200TH": { test: 80, book: 4, groupName: "200TH 班級群組" }
};

const defaultTemplates = {
    "預設英文學習狀況回報": "家長您好，和您分享孩子近期的英文學習狀況。\n\n{studentName}最近三次小考成績從 70 分、80 分進步到{test_score} 分，單字掌握比之前穩定；課堂上也開始能用完整句子回答問題。\n\n目前需要加強的是\n\n🔺 {加強項目}。\n🔺 閱讀提升一個level的小說。\n🔺 本班講師規定目標，目前累積到{BookScore}分！\n\n另外，本週有一項錄音尚未繳交。\n📍老師檢查方式會先確認完成狀況，再檢查發音與流暢度。\n\n我們已與講師確認，接下來會先帶孩子示範一次故事摘要，與朗讀。請孩子於下週上課前完成小說閱讀及補交錄音。",
    "群發訊息": "家長您好，提醒您{studentName}本週須參加{class}大會考唷！逾時十分鐘則不予入場考試!!",
    "短版提醒通知": "家長您好，提醒您孩子本週英文小考成績為 {test_score} 分，小說分數為 {BookScore} 分，尚未達到班級標準，再請協助提醒孩子完成進度與複習唷！"
};

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
    const [selectedClassFilter, setSelectedClassFilter] = useState("ALL");
    
    const [excelData, setExcelData] = useState([]);
    const [fileName, setFileName] = useState("");
    const [results, setResults] = useState([]);
    
    const [showSettings, setShowSettings] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showTour, setShowTour] = useState(false);

    // --- v2.0.0 新增：縮網址小工具狀態 ---
    const [longUrl, setLongUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [isShortening, setIsShortening] = useState(false);

    // --- 欄寬自由調整狀態 (action 置於第一欄) ---
    const [colWidths, setColWidths] = useState({
        action: 120,
        mec: 110,
        class: 100,
        name: 140,
        score: 200,
        preview: 350
    });

    const [expandedRows, setExpandedRows] = useState({});
    const [rowHeights, setRowHeights] = useState({});

    const toggleRowExpand = (idx) => {
        setExpandedRows(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const handleColResize = (e, key) => {
        const startX = e.clientX;
        const startWidth = colWidths[key];

        const onMouseMove = (moveEvent) => {
            const delta = moveEvent.clientX - startX;
            const newWidth = Math.max(60, startWidth + delta);
            setColWidths(prev => ({ ...prev, [key]: newWidth }));
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const handleRowResize = (e, index) => {
        const startY = e.clientY;
        const currentHeight = rowHeights[index] || 80;

        const onMouseMove = (moveEvent) => {
            const delta = moveEvent.clientY - startY;
            const newHeight = Math.max(45, currentHeight + delta);
            setRowHeights(prev => ({ ...prev, [index]: newHeight }));
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const fileInputRef = useRef(null);

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

        // 檢查是否為首次使用，自動開啟引導式彈窗
        const hasSeenTour = localStorage.getItem('app_has_seen_tour_v2_features');
        if (!hasSeenTour) {
            setShowTour(true);
        }
    }, []);

    const handleCloseTour = () => {
        setShowTour(false);
        localStorage.setItem('app_has_seen_tour_v2_features', 'true');
    };

    const handleTemplateChange = (e) => {
        const name = e.target.value;
        setCurrentTemplateName(name);
        setTemplateText(templates[name] || "");
    };

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
            setSelectedClassFilter("ALL");
        };
        reader.readAsBinaryString(file);
        e.target.value = null;
    };

    const reloadData = () => {
        if (excelData.length === 0) {
            alert("請先選擇 Excel 檔案！");
            return;
        }
        
        const bookScoreCol = `bookscore(${month})`.toLowerCase();
        const defT = parseFloat(defaultTest) || 85.0;
        const defB = parseFloat(defaultBook) || 6.0;

        const newResults = [];
        const pattern = /__(.*?)__|{(.*?)}/g;

        excelData.forEach((row, index) => {
            const lowerRow = {};
            Object.keys(row).forEach(k => lowerRow[k.toLowerCase().trim()] = row[k]);

            const studentMec = lowerRow['studentmec'] !== undefined ? lowerRow['studentmec'] : (index + 1);
            const studentName = String(lowerRow['studentname'] || lowerRow['name'] || `學員 ${index + 1}`).trim();
            const englishName = String(lowerRow['englishname'] || lowerRow['en_name'] || '').trim();
            const studentClass = String(lowerRow['class'] || '預設班級').trim();
            
            const testScore = parseFloat(row['test_score'] !== undefined ? row['test_score'] : lowerRow['test_score']) || 0.0;
            const rawBook = lowerRow[bookScoreCol] !== undefined ? lowerRow[bookScoreCol] : lowerRow[`book_score(${month})`];
            const bookScore = parseFloat(rawBook) || 0.0;

            // 尋找對應的班級群組標準（不分大小寫匹配）
            const matchedStdKey = Object.keys(standards).find(k => k.trim().toLowerCase() === studentClass.toLowerCase());
            const clsStd = matchedStdKey ? standards[matchedStdKey] : {};
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

            let currentText = templateText;
            currentText = currentText.replace(pattern, (match, p1, p2) => {
                let varName = (p1 || p2).trim().toLowerCase();
                let targetCol = varName.includes('bookscore') || varName.includes('book_score') ? bookScoreCol : varName;
                if (lowerRow[targetCol] !== undefined) return String(lowerRow[targetCol]);
                if (targetCol === bookScoreCol && lowerRow[`book_score(${month})`] !== undefined) {
                    return String(lowerRow[`book_score(${month})`]);
                }
                return row[(p1 || p2).trim()] !== undefined ? String(row[(p1 || p2).trim()]) : '';
            });

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
        setRowHeights({});
        setExpandedRows({});
    };

    useEffect(() => {
        if (excelData.length > 0) {
            reloadData();
        }
    }, [excelData, templateText, month, defaultTest, defaultBook, isBroadcast, filterTest, filterBook, standards]);

    // 依班級群組區分顯示的篩選清單
    const availableClassGroups = useMemo(() => {
        const set = new Set([...Object.keys(standards), ...results.map(r => r.studentClass)]);
        return Array.from(set).filter(Boolean);
    }, [standards, results]);

    const displayedResults = useMemo(() => {
        if (selectedClassFilter === "ALL") return results;
        return results.filter(r => r.studentClass.toLowerCase() === selectedClassFilter.toLowerCase());
    }, [results, selectedClassFilter]);

    const executeCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.warn("Clipboard API blocked, using fallback:", error);
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
                console.error('Fallback copy failed', err);
                alert("複製失敗，請檢查瀏覽器權限或手動複製。");
            }
            document.body.removeChild(textArea);
        }
    };

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
        const groupLabel = selectedClassFilter === "ALL" ? "全部" : `${selectedClassFilter} 班級群組`;
        alert(`已將「${groupLabel}」共 ${displayedResults.length} 筆生成內容複製到剪貼簿！`);
    };

// --- 縮網址功能 (Dropbox 專屬無警告頁直連 + 一般網址縮短) ---
        const handleShortenUrl = async () => {
            const rawUrl = longUrl.trim();
            if (!rawUrl) {
                alert("請先貼上要縮短的長網址！");
                return;
            }
            const formattedUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

            setIsShortening(true);
            setShortUrl("");
            try {
                // 1. 針對 Dropbox 分享連結（如 dropbox.com/scl/fi/...）：直接壓縮為本站專屬直連短網址，100% 繞過 v.gd/is.gd 強制英文警告頁
                const urlObj = new URL(formattedUrl);
                if (urlObj.hostname.includes("dropbox.com") && urlObj.pathname.includes("/scl/fi/")) {
                    const parts = urlObj.pathname.split("/scl/fi/")[1].split("/");
                    const docId = parts[0];
                    const fileName = parts[1] || "";
                    const rlkey = urlObj.searchParams.get("rlkey") || "";
                    const dl = urlObj.searchParams.get("dl") || "0";

                    const baseUrl = window.location.origin + window.location.pathname;
                    const shortParams = new URLSearchParams();
                    shortParams.set("d", docId);
                    if (fileName) shortParams.set("f", fileName);
                    if (rlkey) shortParams.set("r", rlkey);
                    if (dl !== "0") shortParams.set("dl", dl);

                    const directShortUrl = `${baseUrl}?${shortParams.toString()}`;
                    setShortUrl(directShortUrl);
                    await executeCopy(directShortUrl);
                    return;
                }

                // 2. 其他一般網址：透過 v.gd JSONP 縮短
                const vgdUrl = await new Promise((resolve, reject) => {
                    const callbackName = `jsonp_cb_${Date.now()}`;
                    const script = document.createElement("script");
                    const timeout = setTimeout(() => {
                        cleanup();
                        reject(new Error("Request timeout"));
                    }, 7000);

                    const cleanup = () => {
                        clearTimeout(timeout);
                        delete window[callbackName];
                        if (script.parentNode) script.parentNode.removeChild(script);
                    };

                    window[callbackName] = (data) => {
                        cleanup();
                        if (data && data.shorturl) resolve(data.shorturl);
                        else reject(new Error(data?.errormessage || "API error"));
                    };

                    script.src = `https://v.gd/create.php?format=json&url=${encodeURIComponent(formattedUrl)}&callback=${callbackName}`;
                    script.onerror = () => { cleanup(); reject(new Error("Script load error")); };
                    document.body.appendChild(script);
                });

                if (vgdUrl) {
                    setShortUrl(vgdUrl);
                    await executeCopy(vgdUrl);
                }
            } catch (err) {
                console.error("Shorten URL error:", err);
                alert("縮網址失敗，請確認網址格式是否正確！");
            } finally {
                setIsShortening(false);
            }
        };
    
    // --- v2.0.0 新增：輸出/複製 Excel 範本 ---
    const handleExportTemplateExcel = () => {
        const bookCol = `BookScore(${month})`;
        const sampleRows = [
            {
                studentMec: "123",
                class: "150TH",
                studentName: "周傑倫",
                englishName: "Jay",
                test_score: 53,
                [bookCol]: 3,
                "加強項目": "小說,小考"
            },
            {
                studentMec: "10450",
                class: "200TH",
                studentName: "昆琳",
                englishName: "Hannah",
                test_score: 84,
                [bookCol]: 3,
                "加強項目": "小說,小考"
            }
        ];

        const headers = ["studentMec", "class", "studentName", "englishName", "test_score", bookCol, "加強項目"];
        const tsvContent = [
            headers.join("\t"),
            ...sampleRows.map(r => headers.map(h => r[h]).join("\t"))
        ].join("\n");
        executeCopy(tsvContent);

        if (window.XLSX) {
            const ws = window.XLSX.utils.json_to_sheet(sampleRows, { header: headers });
            const wb = window.XLSX.utils.book_new();
            window.XLSX.utils.book_append_sheet(wb, ws, "成績範本");
            window.XLSX.writeFile(wb, `成績匯入範本_${month}月.xlsx`);
        }
        alert(`✅ 已下載「成績匯入範本_${month}月.xlsx」，並同時將表格欄位複製到剪貼簿，您也可直接在 Excel 中按 Ctrl+V 貼上！`);
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
            
            const updatedHistory = [newRecord, ...existingHistory].slice(0, 20);
            localStorage.setItem('app_history', JSON.stringify(updatedHistory));
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

    const totalTableWidth = colWidths.action + colWidths.mec + colWidths.class + colWidths.name + colWidths.score + colWidths.preview;

    return (
        <div className="flex-1 flex flex-col p-4 max-w-full">
            {/* Header */}
            <header className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-700 shrink-0">
                <div className="flex items-center gap-3">
                    <img 
                        src="icon.png" 
                        alt="App Icon" 
                        className="w-8 h-8 object-contain"
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                    <div className="w-8 h-8 rounded bg-amber-500 hidden items-center justify-center text-slate-900 font-bold">🍎</div>
                    <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                        批次模板生成小工具
                        <span className="text-xs font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full">{APP_VERSION}</span>
                    </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button 
                        onClick={() => setShowTour(true)}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
                        title="開啟聚光燈新手導覽"
                    >
                        <span>💡</span> 功能導覽
                    </button>
                    <button 
                        id="tour-step-export"
                        onClick={handleExportTemplateExcel}
                        className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
                        title="下載標準 Excel 範本並複製欄位格式供直接貼上"
                    >
                        <DownloadIcon size={15} /> 輸出Excel 範本
                    </button>
                    <button 
                        id="tour-step-guide"
                        onClick={() => setShowHelpModal(true)}
                        className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
                        title="檢視操作說明與常見問題 Q&A"
                    >
                        <BookOpenIcon size={15} /> 操作說明 & Q&A
                    </button>
                </div>
            </header>

            {/* Main Content Splitter */}
            <div className="flex flex-col lg:flex-row gap-6 flex-1 w-full">
                
                {/* 左側面板 */}
                <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0 pr-0 lg:pr-2">
                    
                    {/* 模板選擇與編輯 */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-300">選擇訊息模板：</label>
                        <select 
                            className="bg-slate-800 border border-slate-600 rounded-lg p-2 text-slate-200 outline-none focus:border-amber-500"
                            value={currentTemplateName}
                            onChange={handleTemplateChange}
                        >
                            {Object.keys(templates).map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                        <textarea 
                            className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 h-44 resize-none outline-none focus:border-amber-500 mt-1"
                            value={templateText}
                            onChange={(e) => setTemplateText(e.target.value)}
                        />
                    </div>

                    {/* 參數設定區 */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-3.5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">參數設定與班級群組</h3>
                            <button 
                                onClick={() => setShowSettings(true)}
                                className="text-xs flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 px-2.5 py-1 rounded-lg font-semibold transition-colors"
                            >
                                <FolderPlusIcon size={14} /> 群組與模板管理
                            </button>
                        </div>

                        {/* 目前已設定的班級群組預覽標籤 */}
                        <div className="flex flex-wrap gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-700/80">
                            {Object.entries(standards).map(([cls, val]) => (
                                <span key={cls} className="text-[11px] bg-slate-800 border border-slate-600 text-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <strong className="text-amber-400">{cls}</strong>
                                    <span className="text-slate-400">({val.test}/{val.book})</span>
                                </span>
                            ))}
                            <button 
                                onClick={() => setShowSettings(true)}
                                className="text-[11px] text-amber-400 hover:underline px-1.5 py-0.5 font-semibold"
                            >
                                + 新增群組
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-sm text-slate-300">對應讀本月份:</label>
                            <select 
                                className="bg-slate-700 border border-slate-600 rounded-lg p-1.5 px-3 outline-none text-sm font-semibold text-amber-400"
                                value={month} onChange={e => setMonth(e.target.value)}
                            >
                                {["12","11","10","9","8","7","6","5","4","3","2","1"].map(m => (
                                    <option key={m} value={m}>{m} 月</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-xs text-slate-400 whitespace-nowrap">預設小考:</label>
                            <input type="number" className="bg-slate-700 border border-slate-600 rounded-lg p-1.5 w-full outline-none text-sm text-center" value={defaultTest} onChange={e => setDefaultTest(e.target.value)} />
                            <label className="text-xs text-slate-400 whitespace-nowrap ml-1">預設小說:</label>
                            <input type="number" className="bg-slate-700 border border-slate-600 rounded-lg p-1.5 w-full outline-none text-sm text-center" value={defaultBook} onChange={e => setDefaultBook(e.target.value)} />
                        </div>

                        {/* 化簡項目改為按鈕/膠囊切換形式 */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsBroadcast(prev => !prev)}
                                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                                    isBroadcast 
                                    ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-sm' 
                                    : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                <span>{isBroadcast ? '✔' : '○'}</span> 群發模式
                            </button>
                            <button
                                type="button"
                                disabled={isBroadcast}
                                onClick={() => setFilterTest(prev => !prev)}
                                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                                    isBroadcast ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500 border-slate-800' :
                                    filterTest 
                                    ? 'bg-blue-500 text-white border-blue-400 shadow-sm' 
                                    : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                <span>{filterTest ? '✔' : '○'}</span> 小考未達標
                            </button>
                            <button
                                type="button"
                                disabled={isBroadcast}
                                onClick={() => setFilterBook(prev => !prev)}
                                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                                    isBroadcast ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500 border-slate-800' :
                                    filterBook 
                                    ? 'bg-blue-500 text-white border-blue-400 shadow-sm' 
                                    : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                <span>{filterBook ? '✔' : '○'}</span> 小說未達標
                            </button>
                        </div>
                    </div>

                    {/* 聚光燈步驟 3：縮網址 URL 小工具 */}
                    <div id="tour-step-shortener" className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-2.5">
                        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                            <LinkIcon size={15} className="text-amber-400" /> 縮網址 URL 小工具
                        </h3>
                        <div className="flex gap-1.5">
                            <input 
                                type="url" 
                                placeholder="貼上長網址 (例如 Google 表單)..."
                                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                                value={longUrl}
                                onChange={(e) => setLongUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleShortenUrl()}
                            />
                            <button 
                                onClick={handleShortenUrl}
                                disabled={isShortening}
                                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold px-3.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors"
                            >
                                {isShortening ? "縮短中..." : "縮短"}
                            </button>
                        </div>
                        {shortUrl && (
                            <div className="flex items-center justify-between bg-slate-900/90 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs">
                                <span className="text-emerald-400 font-mono truncate mr-2">{shortUrl}</span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button 
                                        onClick={() => {
                                            setTemplateText(prev => prev + (prev.endsWith('\n') || !prev ? '' : '\n') + shortUrl);
                                        }}
                                        className="text-amber-400 hover:text-amber-300 underline text-xs font-semibold"
                                        title="直接插入目前訊息模板尾端"
                                    >
                                        插入模板
                                    </button>
                                    <button 
                                        onClick={() => { executeCopy(shortUrl); alert("已複製短網址！"); }}
                                        className="text-slate-300 hover:text-white p-1"
                                        title="複製短網址"
                                    >
                                        <CopyIcon size={13} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 檔案操作區 */}
                    <div className="flex flex-col gap-2.5">
                        <div className="text-xs text-slate-400 truncate flex justify-between items-center">
                            <span>{fileName ? `已選擇：${fileName}` : "尚未選擇 Excel 檔案"}</span>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-200 hover:bg-white text-slate-900 font-semibold py-2 rounded-lg text-sm transition-colors"
                            >
                                <UploadIcon size={16} /> 選擇 Excel
                            </button>
                            <input type="file" accept=".xlsx, .xls, .csv, .json" className="hidden" ref={fileInputRef} onChange={handleFileUpload} /> 
                            
                            <button 
                                onClick={reloadData}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50 font-semibold py-2 rounded-lg text-sm transition-colors"
                            >
                                <RotateCwIcon size={16} /> 重新載入
                            </button>
                        </div>
                        
                        {/* 聚光燈步驟 4：歷史紀錄按鈕組 */}
                        <div id="tour-step-history" className="flex flex-col gap-2">
                            <button 
                                onClick={saveToLocalDB}
                                className="w-full flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 font-semibold py-2.5 rounded-lg text-sm transition-colors"
                            >
                                <SaveIcon size={16} /> 將結果儲存至歷史紀錄
                            </button>
                            
                            <button 
                                onClick={() => setShowHistory(true)}
                                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-colors"
                            >
                                <HistoryIcon size={16} /> 查看本機歷史紀錄
                            </button>
                        </div>
                    </div>
                </div>

                {/* 右側結果表格 */}
                <div className="flex-1 flex flex-col bg-slate-800 border border-slate-700 rounded-xl overflow-hidden min-h-[400px]">
                    <div className="p-3.5 border-b border-slate-700 font-bold text-white bg-slate-800/50 text-sm flex flex-wrap justify-between items-center gap-2 shrink-0">
                        <span>{rightTitle}</span>
                        <span className="text-xs font-normal text-slate-400">💡 提示：支援雙向捲動與欄寬/列高拖曳</span>
                    </div>

                    {/* 班級群組區分切換頁籤 */}
                    <div className="px-3.5 py-2 border-b border-slate-700/80 bg-slate-900/40 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
                        <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">班級群組區分：</span>
                        <button
                            onClick={() => setSelectedClassFilter("ALL")}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-colors ${
                                selectedClassFilter === "ALL"
                                ? "bg-amber-500 text-slate-900 shadow-sm"
                                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                            }`}
                        >
                            全部班級 ({results.length})
                        </button>
                        {availableClassGroups.map(cls => {
                            const count = results.filter(r => r.studentClass.toLowerCase() === cls.toLowerCase()).length;
                            const isActive = selectedClassFilter.toLowerCase() === cls.toLowerCase();
                            return (
                                <button
                                    key={cls}
                                    onClick={() => setSelectedClassFilter(cls)}
                                    className={`px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                                        isActive
                                        ? "bg-amber-500 text-slate-900 shadow-sm"
                                        : "bg-slate-800 text-amber-400/90 hover:bg-slate-700 border border-slate-700"
                                    }`}
                                >
                                    <span>{cls}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-900/20 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="flex-1 overflow-auto custom-scrollbar w-full">
                        <table className="text-left border-collapse text-sm table-fixed" style={{ width: `${totalTableWidth}px`, minWidth: '100%' }}>
                            <thead className="sticky top-0 bg-slate-900 border-b border-slate-700 shadow-md z-20">
                                <tr>
                                    <th className="py-2.5 px-3 text-center text-slate-400 font-medium relative select-none" style={{ width: `${colWidths.action}px` }}>
                                        快速操作
                                        <div className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-amber-500/50 transition-colors" onMouseDown={(e) => handleColResize(e, 'action')} title="拖曳調整欄寬" />
                                    </th>
                                    <th className="py-2.5 px-3 text-center text-slate-400 font-medium relative select-none" style={{ width: `${colWidths.mec}px` }}>
                                        學號/項次
                                        <div className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-amber-500/50 transition-colors" onMouseDown={(e) => handleColResize(e, 'mec')} title="拖曳調整欄寬" />
                                    </th>
                                    <th className="py-2.5 px-3 text-slate-400 font-medium relative select-none" style={{ width: `${colWidths.class}px` }}>
                                        班級群組
                                        <div className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-amber-500/50 transition-colors" onMouseDown={(e) => handleColResize(e, 'class')} title="拖曳調整欄寬" />
                                    </th>
                                    <th className="py-2.5 px-3 text-slate-400 font-medium relative select-none" style={{ width: `${colWidths.name}px` }}>
                                        學員姓名 (英)
                                        <div className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-amber-500/50 transition-colors" onMouseDown={(e) => handleColResize(e, 'name')} title="拖曳調整欄寬" />
                                    </th>
                                    <th className="py-2.5 px-3 text-slate-400 font-medium relative select-none" style={{ width: `${colWidths.score}px` }}>
                                        小考/小說成績
                                        <div className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-amber-500/50 transition-colors" onMouseDown={(e) => handleColResize(e, 'score')} title="拖曳調整欄寬" />
                                    </th>
                                    <th className="py-2.5 px-3 text-slate-400 font-medium relative select-none" style={{ width: `${colWidths.preview}px` }}>
                                        生成預覽內容 (可折疊)
                                        <div className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-amber-500/50 transition-colors" onMouseDown={(e) => handleColResize(e, 'preview')} title="拖曳調整欄寬" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {displayedResults.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500">
                                            {results.length === 0 ? "尚未載入資料或無符合條件之學員" : `目前「${selectedClassFilter}」班級群組無符合條件之學員`}
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

                                        const isExpanded = !!expandedRows[idx];
                                        const customHeight = rowHeights[idx] ? `${rowHeights[idx]}px` : 'auto';

                                        return (
                                            <tr 
                                                key={item.studentMec + '-' + idx} 
                                                style={{ height: customHeight }}
                                                className={`transition-colors relative align-top ${item.processed ? 'bg-emerald-900/20' : 'hover:bg-slate-700/30'}`}
                                            >
                                                <td className="py-2.5 px-3 text-center relative" style={{ width: `${colWidths.action}px` }}>
                                                    {item.processed ? (
                                                        <button className="w-full flex items-center justify-center gap-1 bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 py-1 rounded text-xs font-bold pointer-events-none">
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
                                                    <div className="absolute left-0 right-0 bottom-0 h-1.5 cursor-row-resize hover:bg-amber-500/60 transition-colors z-20" onMouseDown={(e) => handleRowResize(e, idx)} title="拖曳調整列高" />
                                                </td>

                                                <td className="py-2.5 px-3 text-center text-slate-400 text-xs font-mono truncate relative" style={{ width: `${colWidths.mec}px` }}>
                                                    {item.studentMec}
                                                    <div className="absolute left-0 right-0 bottom-0 h-1.5 cursor-row-resize hover:bg-amber-500/60 transition-colors z-20" onMouseDown={(e) => handleRowResize(e, idx)} title="拖曳調整列高" />
                                                </td>

                                                <td className="py-2.5 px-3 font-semibold text-xs truncate relative" style={{ width: `${colWidths.class}px` }}>
                                                    <span className="inline-block px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                                        {item.studentClass}
                                                    </span>
                                                    <div className="absolute left-0 right-0 bottom-0 h-1.5 cursor-row-resize hover:bg-amber-500/60 transition-colors z-20" onMouseDown={(e) => handleRowResize(e, idx)} title="拖曳調整列高" />
                                                </td>

                                                <td className="py-2.5 px-3 font-bold text-slate-200 text-xs truncate relative" style={{ width: `${colWidths.name}px` }}>
                                                    {item.studentName} {item.englishName ? `(${item.englishName})` : ''}
                                                    <div className="absolute left-0 right-0 bottom-0 h-1.5 cursor-row-resize hover:bg-amber-500/60 transition-colors z-20" onMouseDown={(e) => handleRowResize(e, idx)} title="拖曳調整列高" />
                                                </td>

                                                <td className="py-2.5 px-3 text-slate-300 text-xs leading-relaxed relative" style={{ width: `${colWidths.score}px` }}>
                                                    {statusStr}
                                                    <div className="absolute left-0 right-0 bottom-0 h-1.5 cursor-row-resize hover:bg-amber-500/60 transition-colors z-20" onMouseDown={(e) => handleRowResize(e, idx)} title="拖曳調整列高" />
                                                </td>

                                                <td className="py-2.5 px-3 text-slate-300 relative" style={{ width: `${colWidths.preview}px` }}>
                                                    <div className={`text-xs opacity-90 whitespace-pre-wrap custom-scrollbar pr-1 ${isExpanded ? '' : 'line-clamp-3'}`}>
                                                        {item.generatedText}
                                                    </div>
                                                    <button 
                                                        onClick={() => toggleRowExpand(idx)}
                                                        className="mt-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 inline-block focus:outline-none"
                                                    >
                                                        {isExpanded ? "▲ 收合內容" : "▼ 展開完整內容"}
                                                    </button>
                                                    <div className="absolute left-0 right-0 bottom-0 h-1.5 cursor-row-resize hover:bg-amber-500/60 transition-colors z-20" onMouseDown={(e) => handleRowResize(e, idx)} title="拖曳調整列高" />
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-3 border-t border-slate-700 bg-slate-900/50 shrink-0">
                        <button 
                            onClick={handleCopyAll}
                            className="w-full bg-slate-200 hover:bg-white text-slate-900 font-bold py-2.5 rounded-xl transition-colors shadow-lg text-sm"
                        >
                            {selectedClassFilter === "ALL" 
                                ? `一鍵複製全部未達標生成結果 (${displayedResults.length} 筆)` 
                                : `一鍵複製「${selectedClassFilter}」班級群組生成結果 (${displayedResults.length} 筆)`}
                        </button>
                    </div>
                </div>
            </div>

            {/* 設定 Modal */}
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

            {/* 歷史紀錄 Modal */}
            {showHistory && (
                <HistoryModal onClose={() => setShowHistory(false)} />
            )}

            {/* 聚光燈引導式教學彈窗 */}
            {showTour && (
                <SpotlightTourModal onClose={handleCloseTour} />
            )}

            {/* 🚨 操作說明 & 常見問題 Q&A Modal */}
            {showHelpModal && (
                <HelpModal onClose={() => setShowHelpModal(false)} />
            )}
        </div>
    );
}

// --- 操作說明 & 常見問題 Q&A 彈窗元件 ---
function HelpModal({ onClose }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState(0); // 預設展開第 1 題

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
            a: "直接點擊網頁中的「輸出Excel 範本」按鈕，系統會自動下載標準 .xlsx 範例檔（包含 studentMec、class、studentName、englishName、test_score、BookScore(月份) 等標準表頭），並同步複製格式供直接貼上。"
        }
    ];

    // 依關鍵字即時過濾 Q&A
    const filteredFaqs = faqList.filter(
        item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleAccordion = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
                
                {/* 標題列 (含版本號標示) */}
                <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/90 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <span className="text-xl">🚨</span>
                        <h2 className="text-lg font-bold text-white">操作說明與常見問題 Q&A</h2>
                        <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full">
                            {APP_VERSION}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <XIcon size={24} />
                    </button>
                </div>

                {/* 捲動內容區 */}
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-5">
                    
                    {/* 區塊一：新手 3 條核心懶人包 */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                        <h3 className="font-bold text-amber-400 text-sm mb-2 flex items-center gap-1.5">
                            ⚡ 老師必看：3 個最關鍵的使用提醒
                        </h3>
                        <ul className="text-xs text-slate-200 space-y-1.5 list-disc pl-4 leading-relaxed">
                            <li>
                                <strong>欄位對齊：</strong>Excel 讀本欄位請命名為 <code className="text-amber-300 bg-slate-900 px-1 rounded">BookScore(月份)</code>，模板變數請統一使用 <code className="text-amber-300 bg-slate-900 px-1 rounded">{"{BookScore}"}</code>（不確定可直接點「輸出Excel 範本」）。
                            </li>
                            <li>
                                <strong>純數字填寫：</strong>成績欄請勿留白或填「缺考」等文字，否則系統將一律防呆視為 <code className="text-amber-300 bg-slate-900 px-1 rounded">0</code> 分並列入未達標名單。
                            </li>
                            <li>
                                <strong>固定設備操作：</strong>自訂模板與歷史紀錄皆保存在<strong>當前瀏覽器本機</strong>，請固定使用同一台電腦與瀏覽器，切勿使用無痕模式或清除網站快取。
                            </li>
                        </ul>
                    </div>

                    {/* 區塊二：可搜尋＋摺疊展開 (Accordion) 常見問題 */}
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="font-bold text-slate-200 text-sm">❓ 常見問題排查（點擊展開解答）</h3>
                            <input
                                type="text"
                                placeholder="🔍 輸入關鍵字搜尋問題（如：分數、換電腦、複製）..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500 w-full sm:w-64"
                            />
                        </div>

                        <div className="space-y-2">
                            {filteredFaqs.length === 0 ? (
                                <div className="text-center text-xs text-slate-500 py-6 bg-slate-900/40 rounded-xl border border-slate-700/50">
                                    找不到符合「{searchQuery}」的相關問題，請嘗試其他關鍵字。
                                </div>
                            ) : (
                                filteredFaqs.map((item, idx) => {
                                    const isOpen = openIndex === idx;
                                    return (
                                        <div
                                            key={idx}
                                            className={`border rounded-xl transition-colors overflow-hidden ${
                                                isOpen
                                                    ? "bg-slate-900/90 border-amber-500/50"
                                                    : "bg-slate-900/40 border-slate-700 hover:border-slate-600"
                                            }`}
                                        >
                                            <button
                                                onClick={() => toggleAccordion(idx)}
                                                className="w-full text-left p-3.5 flex items-center justify-between gap-3 text-xs font-bold text-slate-100"
                                            >
                                                <span>{item.q}</span>
                                                <span className={`text-amber-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}>
                                                    ▼
                                                </span>
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

                    {/* 區塊三：Excel 欄位對照表與版本亮點 */}
                    <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 flex flex-col gap-2 text-xs text-slate-300">
                        <h3 className="font-bold text-amber-400 text-sm">📊 Excel 欄位對照與功能說明</h3>
                        <p>• <b>學號/項次</b>：請命名為 <code className="text-amber-300">studentMec</code></p>
                        <p>• <b>姓名欄位</b>：請命名為 <code className="text-amber-300">studentName</code>（英文名可選填 <code className="text-amber-300">englishName</code>）</p>
                        <p>• <b>班級欄位</b>：請命名為 <code className="text-amber-300">class</code>（需與「群組與模板管理」設定的班級群組名稱一致）</p>
                        <p>• <b>小考成績</b>：請命名為 <code className="text-amber-300">test_score</code>（模板變數 <code className="text-amber-300">{"{test_score}"}</code>）</p>
                        <p>• <b>讀本分數</b>：請命名為對應月份格式，例如 <code className="text-amber-300">BookScore(11)</code>（模板內請寫 <code className="text-amber-300">{"{BookScore}"}</code>）</p>
                    </div>

                </div>

                {/* 底部關閉按鈕 */}
                <div className="p-4 border-t border-slate-700 bg-slate-900 flex justify-between items-center shrink-0">
                    <span className="text-xs text-slate-500">智慧批次模板生成小工具 • Web Edition {APP_VERSION}</span>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold transition-colors"
                    >
                        我瞭解了
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- 聚光燈引導式教學彈窗組件 ---
function SpotlightTourModal({ onClose }) {
    const [step, setStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);

    const tourSteps = [
        {
            targetId: "tour-step-export",
            icon: "📥",
            title: "第一步：一鍵輸出 Excel 範本",
            desc: "第一次使用、還沒有建立成績表嗎？點擊「輸出Excel 範本」，系統會自動下載標準 .xlsx 檔案，並同步複製表頭格式，讓你直接貼上建立學員名單。",
            tip: "提示：範本已內建 studentMec、class、studentName、test_score 與當月 BookScore 欄位。"
        },
        {
            targetId: "tour-step-guide",
            icon: "📖",
            title: "第二步：隨時查閱操作說明 & Q&A",
            desc: "對變數語法（如 {studentName}、{BookScore}）或篩選規則有疑問時，隨時點擊這裡查看完整圖文說明、版本資訊與常見問題排解。",
            tip: "提示：若遇到 Excel 格式讀取異常，Q&A 區也有提供快速檢查清單。"
        },
        {
            targetId: "tour-step-shortener",
            icon: "🔗",
            title: "第三步：內建縮網址 URL 小工具",
            desc: "需要在通知中附上 Google 表單或線上測驗連結嗎？直接貼上長網址並點擊「縮短」，即可一鍵轉換為簡潔短網址並自動複製，還能直接插入訊息模板中。",
            tip: "提示：支援雙重備援機制，縮短後的網址可直接貼入家長通知使用。"
        },
        {
            targetId: "tour-step-history",
            icon: "💾",
            title: "第四步：儲存與查閱本機歷史紀錄",
            desc: "批次複製並發送完訊息後，點擊「將結果儲存至歷史紀錄」即可留存當次發送明細；日後需要核對或補發時，點擊「查看本機歷史紀錄」就能隨時調閱。",
            tip: "提示：所有紀錄皆安全儲存在瀏覽器本機空間，不會上傳至外部伺服器。"
        }
    ];

    const current = tourSteps[step];
    const isLastStep = step === tourSteps.length - 1;

    // 計算並追蹤目標元素在畫面上的座標（支援視窗縮放與捲動即時更新）
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

    // 計算彈窗的智慧閃避位置（確保在桌面與窄螢幕皆不遮住聚光燈且不超出畫面）
    const getPopoverStyle = () => {
        if (!targetRect) {
            return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(370px, calc(100vw - 32px))' };
        }
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const cardW = Math.min(370, winW - 32);
        const estCardH = 310;
        const margin = 16;

        // 若目標位於頂部 Header 區域（如輸出Excel 範本、操作說明 & Q&A）
        if (targetRect.top < 85) {
            const topPos = Math.min(targetRect.top + targetRect.height + 14, winH - estCardH - margin);
            const centerLeft = targetRect.left + targetRect.width / 2 - cardW / 2;
            const safeLeft = Math.max(margin, Math.min(centerLeft, winW - cardW - margin));
            return {
                top: `${topPos}px`,
                left: `${safeLeft}px`,
                width: `${cardW}px`
            };
        }

        // 桌面版寬螢幕 (>= 1024px)
        if (winW >= 1024) {
            if (targetRect.left < winW * 0.45) {
                const safeTop = Math.max(margin, Math.min(targetRect.top - 20, winH - estCardH - margin));
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

        // 手機 / 平板窄螢幕 (< 1024px)：自動上下閃避
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
            {/* 聚光燈亮框與四周暗幕 */}
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

            {/* 導覽說明卡片 */}
            <div
                style={getPopoverStyle()}
                className="fixed z-10 bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out"
            >
                {/* 頂部步驟標示 */}
                <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                        功能導覽 {step + 1} / {tourSteps.length}
                    </span>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="關閉導覽">
                        <XIcon size={18} />
                    </button>
                </div>

                {/* 步驟圖示、文字說明與小提示 */}
                <div className="px-5 py-3 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{current.icon}</span>
                        <h3 className="text-base font-bold text-white">{current.title}</h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        {current.desc}
                    </p>
                    {current.tip && (
                        <div className="bg-slate-900/80 border border-amber-500/25 rounded-lg px-3 py-2 text-[11px] text-amber-300/90 leading-relaxed">
                            💡 {current.tip}
                        </div>
                    )}
                </div>

                {/* 進度點點（達成以黃色呈現） */}
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

                {/* 底部操作列：左側略過鍵（淺灰色小字）+ 右側上/下一步 */}
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

// --- 設定對話框組件 ---
function SettingsModal({ standards, templates, onClose, onSave }) {
    const [groupList, setGroupList] = useState(() => 
        Object.entries(standards).map(([cls, val], idx) => ({
            id: Date.now() + idx,
            className: cls,
            groupNote: val.groupName || `${cls} 班級群組`,
            test: val.test ?? 85,
            book: val.book ?? 6
        }))
    );

    const [newClassName, setNewClassName] = useState("");
    const [newGroupNote, setNewGroupNote] = useState("");
    const [newTestScore, setNewTestScore] = useState("85");
    const [newBookScore, setNewBookScore] = useState("6");

    const [localTpls, setLocalTpls] = useState(templates);
    const [selectedTpl, setSelectedTpl] = useState(Object.keys(templates)[0] || "");
    const [tplNameInput, setTplNameInput] = useState(Object.keys(templates)[0] || "");
    const [tplContentInput, setTplContentInput] = useState(templates[Object.keys(templates)[0]] || "");

    const handleAddGroup = () => {
        const cls = newClassName.trim().toUpperCase();
        if (!cls) {
            alert("請輸入班級代碼（例如：300TU）！");
            return;
        }
        if (groupList.some(g => g.className.toUpperCase() === cls)) {
            alert(`班級群組「${cls}」已經存在，請直接於下方列表修改數值！`);
            return;
        }
        setGroupList(prev => [
            ...prev,
            {
                id: Date.now(),
                className: cls,
                groupNote: newGroupNote.trim() || `${cls} 班級群組`,
                test: parseFloat(newTestScore) || 0,
                book: parseFloat(newBookScore) || 0
            }
        ]);
        setNewClassName("");
        setNewGroupNote("");
    };

    const handleUpdateGroupField = (id, field, value) => {
        setGroupList(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
    };

    const handleRemoveGroup = (id) => {
        if (groupList.length <= 1) {
            alert("至少需要保留一個班級群組設定！");
            return;
        }
        setGroupList(prev => prev.filter(g => g.id !== id));
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
        alert(`模板「${name}」已暫存！記得點擊最下方「儲存設定」。`);
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

    const handleSaveAll = () => {
        const formattedStandards = {};
        groupList.forEach(g => {
            const cls = g.className.trim();
            if (cls) {
                formattedStandards[cls] = {
                    test: parseFloat(g.test) || 0,
                    book: parseFloat(g.book) || 0,
                    groupName: g.groupNote.trim() || `${cls} 班級群組`
                };
            }
        });
        onSave(formattedStandards, localTpls);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-3xl flex flex-col overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <SettingsIcon size={20} className="text-amber-400"/> 系統設定與班級群組管理
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><XIcon size={24} /></button>
                </div>
                
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 max-h-[68vh]">
                    {/* 📊 班級群組與獨立標準設定區 */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <label className="font-bold text-slate-200 flex items-center gap-2">
                                📊 班級群組區分與達標標準設定：
                            </label>
                            <span className="text-xs text-slate-400">可為不同班級建立獨立群組門檻</span>
                        </div>

                        {/* 新增群組列 */}
                        <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 flex flex-col sm:flex-row gap-2 items-end">
                            <div className="w-full sm:w-1/4">
                                <label className="block text-[11px] text-amber-400 font-semibold mb-1">班級代碼 (對應 Excel)</label>
                                <input 
                                    type="text" 
                                    placeholder="例如: 300TU" 
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-sm text-white outline-none focus:border-amber-500"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-1/3">
                                <label className="block text-[11px] text-slate-400 mb-1">群組備註名稱 (選填)</label>
                                <input 
                                    type="text" 
                                    placeholder="例如: 週六高階班" 
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-sm text-slate-200 outline-none focus:border-amber-500"
                                    value={newGroupNote}
                                    onChange={(e) => setNewGroupNote(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-1/6">
                                <label className="block text-[11px] text-slate-400 mb-1">小考標準</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-center text-white outline-none focus:border-amber-500"
                                    value={newTestScore}
                                    onChange={(e) => setNewTestScore(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-1/6">
                                <label className="block text-[11px] text-slate-400 mb-1">小說標準</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-center text-white outline-none focus:border-amber-500"
                                    value={newBookScore}
                                    onChange={(e) => setNewBookScore(e.target.value)}
                                />
                            </div>
                            <button 
                                type="button"
                                onClick={handleAddGroup}
                                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-3.5 py-1.5 rounded-lg text-sm flex items-center justify-center gap-1 whitespace-nowrap transition-colors"
                            >
                                <PlusIcon size={16} /> 新增群組
                            </button>
                        </div>

                        {/* 已建立的群組卡片清單 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-1">
                            {groupList.map((grp) => (
                                <div key={grp.id} className="bg-slate-900/60 border border-slate-700 rounded-xl p-3 flex flex-col gap-2 hover:border-slate-500 transition-colors">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold text-xs shrink-0">
                                                {grp.className}
                                            </span>
                                            <input 
                                                type="text"
                                                className="bg-transparent border-b border-transparent focus:border-slate-500 text-xs text-slate-300 outline-none truncate w-full"
                                                value={grp.groupNote}
                                                onChange={(e) => handleUpdateGroupField(grp.id, 'groupNote', e.target.value)}
                                                placeholder="輸入群組說明..."
                                            />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveGroup(grp.id)}
                                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                                            title="刪除此班級群組"
                                        >
                                            <TrashIcon size={15} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs pt-1 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 flex-1">
                                            <span className="text-slate-400">小考達標:</span>
                                            <input 
                                                type="number" 
                                                className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-center text-white font-semibold outline-none focus:border-amber-500"
                                                value={grp.test}
                                                onChange={(e) => handleUpdateGroupField(grp.id, 'test', e.target.value)}
                                            />
                                            <span className="text-slate-500">分</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-1">
                                            <span className="text-slate-400">小說達標:</span>
                                            <input 
                                                type="number" 
                                                className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-center text-white font-semibold outline-none focus:border-amber-500"
                                                value={grp.book}
                                                onChange={(e) => handleUpdateGroupField(grp.id, 'book', e.target.value)}
                                            />
                                            <span className="text-slate-500">分</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-slate-700"/>

                    {/* 📝 訊息模板管理區 */}
                    <div className="flex flex-col gap-3">
                        <label className="block font-bold text-slate-200">📝 訊息模板管理區：</label>
                        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-64">
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
                            <div className="w-full md:w-2/3 flex flex-col gap-2 mt-4 md:mt-0">
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
                    <button onClick={handleSaveAll} className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold transition-colors shadow-lg">儲存設定</button>
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
