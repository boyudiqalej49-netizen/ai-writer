"use client";
import { useState, useRef, useEffect } from "react";
import { ShieldCheck, Zap, Clock, Download } from "lucide-react"; 

const TRANSLATIONS = {
  zh: {
    name: "简体中文", badge: "✦ AI创作工坊", title1: "一键生成", title2: "小说 · 论文 · 绘图", subtitle: "输入想法，AI帮你写出高质量内容或画出大片", modeLabel: "创作类型",
    modes: [
      { id: "novel", label: "📖 小说", desc: "完整故故事情节" }, { id: "copy", label: "✍️ 文案", desc: "营销推广文字" }, { id: "script", label: "🎬 剧本", desc: "对话场景脚本" }, { id: "post", label: "📱 种草", desc: "小红书/抖音文案" }, { id: "paper", label: "🎓 论文", desc: "严谨学术文章" }, { id: "qa", label: "💬 问答", desc: "客观事实解答" }, { id: "image", label: "🎨 绘图", desc: "Flux 顶级画质" },
    ],
    ideaLabel: "💡 你的想法 / 问题 / 画面描述 *",
    ideaPlaceholders: { novel: "例如：一个失忆侦探发现自己就是凶手...", copy: "例如：主打成分护肤的精华液...", script: "例如：两个多年未见的老友重逢...", post: "例如：用番茄工作法让效率翻倍...", paper: "例如：探讨人工智能在医疗领域的伦理问题...", qa: "例如：量子力学的基本原理是什么？", image: "例如：一只穿着印尼传统服饰的猫在海边冲浪...", },
    genreLabel: "题材类型", copyTypeLabel: "文案类型", postLabel: "目标平台", paperLabel: "论文类型", qaLabel: "解答类型", imageLabel: "图片比例",
    genres: ["言情", "悬疑", "玄幻", "都市", "历史", "科幻", "恐怖", "励志"], copyTypes: ["产品推广", "品牌故事", "活动营销", "朋友圈", "广告语", "软文"], postTypes: ["小红书", "抖音", "微信公众号", "微博", "视频号"], paperTypes: ["期末论文", "开题报告", "文献综述", "学术期刊", "毕业设计"], qaTypes: ["通俗科普", "专业解析", "分点说明", "深入探讨", "简明扼要"], imageTypes: ["1:1 正方形", "16:9 宽屏", "9:16 竖屏", "4:3 复古"],
    lengthLabel: "字数/质量", styleLabel: "风格", extraLabel: "额外要求（选填）", extraPlaceholder: "例如：语气活泼，或者绘图时增加胶片感...",
    lengths: [ { v: "short", l: "短篇 / 标准" }, { v: "medium", l: "中篇 / 高清" }, { v: "long", l: "长篇 / 极速" } ],
    styles: ["正式严肃", "轻松幽默", "文艺感性", "犀利直接", "温暖治愈", "客观严谨", "写实摄影", "动漫插画", "数字艺术"], styleDefault: "不限风格",
    btnGenerate: "✨ 开始创作 / 绘图", btnStop: "⏹️ 停止生成", btnCopy: "复制全文", btnCopied: "✓ 已复制", btnDownload: "保存图片", resultLabel: "创作结果",
    resultLabels: { novel: "📖 小说正文", copy: "✍️ 文案内容", script: "🎬 剧本内容", post: "📱 种草内容", paper: "🎓 论文正文", qa: "💬 专业解答", image: "🎨 AI 生成画作" },
    streaming: "正在疾速处理...", placeholder1: "在左侧输入你的想法或画面描述", placeholder2: "AI 将为你生成高质量作品", tags: ["灵感无限", "真实客观", "零成本绘图"], thinking: "🎨 正在调集全球算力渲染大片，请稍后...", errEmpty: "请输入你的想法、问题或画面描述", errFail: "生成失败：", errRetry: "请求失败，请稍后重试", errAborted: "⚠️ 创作已中止", lengthMap: { short: "500字左右", medium: "1500字左右", long: "3000字左右" },
    systemPrompts: { novel: "顶级小说作家", copy: "策划专家", script: "编剧专家", post: "爆款专家", paper: "学术专家", qa: "百科专家" },
    userPrompts: {
      novel: (idea, sel, len, style, extra) => `创作小说：${idea}`, copy: (idea, sel) => `文案：${idea}`, script: (idea) => `剧本：${idea}`, post: (idea) => `内容：${idea}`, paper: (idea) => `论文主题：${idea}`, qa: (idea) => `问题：${idea}`,
    },
    vipTag: "专业版", timeRemaining: "剩余时间"
  },
  id: {
    name: "Indonesia", badge: "✦ AI Studio", title1: "Buat Otomatis", title2: "Teks · Esai · Gambar", subtitle: "Masukkan ide, AI menulis konten atau membuat gambar HD", modeLabel: "Jenis Konten",
    modes: [ { id: "novel", label: "📖 Cerita", desc: "Narasi lengkap" }, { id: "copy", label: "✍️ Copy", desc: "Konten pemasaran" }, { id: "script", label: "🎬 Skrip", desc: "Dialog & adegan" }, { id: "post", label: "📱 Sosial", desc: "Instagram/TikTok" }, { id: "paper", label: "🎓 Esai", desc: "Makalah Akademik" }, { id: "qa", label: "💬 Q&A", desc: "Jawaban Faktual" }, { id: "image", label: "🎨 Gambar", desc: "Kualitas Flux" } ],
    ideaLabel: "💡 Ide / Pertanyaan / Deskripsi *",
    ideaPlaceholders: { novel: "mis. Detektif amnesia...", copy: "mis. Serum wajah...", script: "mis. Teman lama...", post: "mis. Teknik Pomodoro...", paper: "mis. Etika AI...", qa: "mis. Teori relativitas?", image: "mis. Kucing berbaju adat Indonesia...", },
    btnGenerate: "✨ Mulai Buat", btnStop: "⏹️ Berhenti", btnCopy: "Salin", btnCopied: "✓ Tersalin", btnDownload: "Simpan Gambar",
    resultLabels: { novel: "📖 Cerita", copy: "✍️ Copy", script: "🎬 Skrip", post: "📱 Postingan", paper: "🎓 Makalah", qa: "💬 Jawaban", image: "🎨 Karya AI" },
   thinking: "🎨 Menghubungkan ke GPU global, mohon tunggu...", errAborted: "⚠️ Pembuatan dihentikan", vipTag: "PRO", timeRemaining: "Sisa Waktu"
  },
 tw: { name: "繁體中文", badge: "✦ AI創作工坊", title1: "一鍵生成", title2: "小說 · 論文 · 繪圖", subtitle: "輸入想法，AI幫你寫出完整內容或畫出大片", modeLabel: "創作類型", modes: [ { id: "novel", label: "📖 小說", desc: "完整故事" }, { id: "copy", label: "✍️ 文案", desc: "行銷文字" }, { id: "script", label: "🎬 劇本", desc: "腳本" }, { id: "post", label: "📱 種草", desc: "社群文案" }, { id: "paper", label: "🎓 論文", desc: "學術文章" }, { id: "qa", label: "💬 問答", desc: "事實解答" }, { id: "image", label: "🎨 繪圖", desc: "Flux 頂級" } ], ideaLabel: "💡 你的想法 / 問題 / 畫面描述 *", ideaPlaceholders: { novel: "例如：失憶偵探...", copy: "例如：精華液...", script: "例如：老友重逢...", post: "例如：效率翻倍...", paper: "例如：AI倫理...", qa: "例如：量子力學...", image: "例如：穿著印尼服飾的貓..." }, btnGenerate: "✨ 開始創作 / 繪圖", btnStop: "⏹️ 停止", btnCopy: "複製", btnCopied: "✓ 已複製", btnDownload: "保存圖片", resultLabels: { novel: "📖 小說正文", copy: "✍️ 文案內容", script: "🎬 劇本內容", post: "📱 種草內容", paper: "🎓 論文正文", qa: "💬 專業解答", image: "🎨 AI 繪圖" }, thinking: "🎨 正在調用全球算力渲染中...", errAborted: "⚠️ 創作已中止", vipTag: "專業版", timeRemaining: "剩餘時間" },
 en: { name: "English", badge: "✦ AI Writer Studio", title1: "Generate", title2: "Text · Essay · Image", subtitle: "Enter ideas, AI writes content or paints HD images", modeLabel: "Content Type", modes: [ { id: "novel", label: "📖 Story", desc: "Full narrative" }, { id: "copy", label: "✍️ Copy", desc: "Marketing" }, { id: "script", label: "🎬 Script", desc: "Dialogue" }, { id: "post", label: "📱 Social", desc: "Insta/TikTok" }, { id: "paper", label: "🎓 Essay", desc: "Academic" }, { id: "qa", label: "💬 Q&A", desc: "Factual" }, { id: "image", label: "🎨 Image", desc: "Flux AI" } ], ideaLabel: "💡 Your Idea / Prompt *", ideaPlaceholders: { novel: "e.g. Amnesiac detective...", copy: "e.g. Skin serum...", script: "e.g. Old friends...", post: "e.g. Pomodoro...", paper: "e.g. AI ethics...", qa: "e.g. Relativity?", image: "e.g. Cat in traditional dress..." }, btnGenerate: "✨ Generate", btnStop: "⏹️ Stop", btnCopy: "Copy", btnCopied: "✓ Copied", btnDownload: "Save Image", resultLabels: { novel: "📖 Story", copy: "✍️ Copy", script: "🎬 Script", post: "📱 Post", paper: "🎓 Essay", qa: "💬 Answer", image: "🎨 AI Art" }, thinking: "🎨 Connecting to global GPU nodes, please wait...", errAborted: "⚠️ Stopped", vipTag: "PRO", timeRemaining: "Time Left" }
};

const S = {
 bg: "#0d0d14", surface: "#13131f", card: "#1c1c2e", border: "#2d2d45",
 accent: "#7c6ff7", accent2: "#f06292", gold: "#fbbf24",
 text: "#eeeef5", muted: "#6b6b90", success: "#34d399", stop: "#ef4444"
};

function Tag({ label, active, onClick }) {
 return (
   <button onClick={onClick} style={{ background: active ? "rgba(124,111,247,0.2)" : S.surface, border: `1px solid ${active ? S.accent : S.border}`, color: active ? S.accent : S.muted, padding: "5px 14px", borderRadius: 100, fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>{label}</button>
 );
}

function CopyBtn({ text, t }) {
 const [done, setDone] = useState(false);
 const copy = () => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); };
 return (
   <button onClick={copy} style={{ background: done ? "rgba(52,211,153,0.1)" : "rgba(124,111,247,0.1)", color: done ? S.success : S.accent, padding: "7px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", border: "none", fontWeight: 500, transition: "all 0.2s" }}>{done ? t.btnCopied : t.btnCopy}</button>
 );
}

const LANG_FLAGS = { zh: "🇨🇳", tw: "🇹🇼", en: "🇺🇸", id: "🇮🇩" };

export default function Home() {
 const [lang, setLang] = useState("zh");
 const [showLangMenu, setShowLangMenu] = useState(false);
 const t = TRANSLATIONS[lang] || TRANSLATIONS.zh;

 const [timeLeft, setTimeLeft] = useState("");
 useEffect(() => {
   const timer = setInterval(() => {
     const cookies = document.cookie.split('; ');
     const userType = cookies.find(row => row.startsWith('user_type='))?.split('=')[1];
     const actTimeStr = cookies.find(row => row.startsWith('activation_time='))?.split('=')[1];
     const validDaysStr = cookies.find(row => row.startsWith('valid_days='))?.split('=')[1];
     if (userType === 'permanent') { setTimeLeft(lang === 'zh' || lang === 'tw' ? "∞ 永久有效" : "∞ Permanent"); return; }
     if (actTimeStr) {
       const activationTime = parseInt(actTimeStr);
       const validDays = validDaysStr ? parseInt(validDaysStr) : 30;
       const expiryTime = activationTime + (validDays * 24 * 60 * 60 * 1000);
       const diff = expiryTime - Date.now();
       if (diff <= 0) { setTimeLeft(lang === 'zh' || lang === 'tw' ? "已过期" : "Expired"); window.location.reload(); }
       else {
         const d = Math.floor(diff / (1000 * 60 * 60 * 24));
         const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
         const m = Math.floor((diff / (1000 * 60)) % 60);
         const s = Math.floor((diff / 1000) % 60);
         setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
       }
     }
   }, 1000);
   return () => clearInterval(timer);
 }, [lang]);

 const [mode, setMode] = useState("novel");
 const [idea, setIdea] = useState("");
 const [genre, setGenre] = useState("");
 const [copyType, setCopyType] = useState("");
 const [paperType, setPaperType] = useState("");
 const [qaType, setQaType] = useState("");
 const [imageRatio, setImageRatio] = useState("");
 const [length, setLength] = useState("medium");
 const [style, setStyle] = useState("");
 const [extraNote, setExtraNote] = useState("");
 const [loading, setLoading] = useState(false);
 const [output, setOutput] = useState("");
 const [streaming, setStreaming] = useState(false);
 const [err, setErr] = useState("");
 const [wordCount, setWordCount] = useState(0);
 const outputRef = useRef(null);
 const abortControllerRef = useRef(null);

 let currentTags = []; let currentSel = ""; let setCurrentSel = () => {}; let tagLabel = "";
 if (mode === "novel" || mode === "script") { currentTags = t.genres; currentSel = genre; setCurrentSel = setGenre; tagLabel = t.genreLabel; }
 else if (mode === "post") { currentTags = t.postTypes; currentSel = copyType; setCurrentSel = setCopyType; tagLabel = t.postLabel; }
 else if (mode === "paper") { currentTags = t.paperTypes; currentSel = paperType; setCurrentSel = setPaperType; tagLabel = t.paperLabel; }
 else if (mode === "qa") { currentTags = t.qaTypes; currentSel = qaType; setCurrentSel = setQaType; tagLabel = t.qaLabel; }
 else if (mode === "image") { currentTags = t.imageTypes; currentSel = imageRatio; setCurrentSel = setImageRatio; tagLabel = t.imageLabel; }
 else { currentTags = t.copyTypes; currentSel = copyType; setCurrentSel = setCopyType; tagLabel = t.copyTypeLabel; }

 const generate = async () => {
   if (!idea.trim()) { setErr(t.errEmpty); return; }
   setErr(""); setLoading(true); setOutput(""); setWordCount(0);

   // 🎨 免费绘图模式：极速渲染逻辑
   if (mode === "image") {
     const seed = Math.floor(Math.random() * 999999);
     // 直接拼接最终 URL 并显示，让浏览器去异步下载
     const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(idea + " " + style + " " + extraNote)}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`;
     setOutput(imageUrl);
     setLoading(false); // 绘图模式下不需要 loading 遮罩，因为图片本身在加载
     return;
   }

   // 📝 文字生成逻辑
   abortControllerRef.current = new AbortController();
   const lenLabel = t.lengthMap[length];
   try {
     setStreaming(true);
     const res = await fetch("/api/generate", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ system: t.systemPrompts[mode], user: t.userPrompts[mode](idea, currentSel, lenLabel, style, extraNote) }),
       signal: abortControllerRef.current.signal
      });
     if (!res.ok) throw new Error(t.errRetry);
     const reader = res.body.getReader(); const decoder = new TextDecoder(); let full = "";
     while (true) {
       const { done, value } = await reader.read(); if (done) break;
       const lines = decoder.decode(value).split("\n").filter(l => l.startsWith("data: "));
       for (const line of lines) {
         const data = line.slice(6); if (data === "[DONE]") continue;
         try {
           const json = JSON.parse(data);
           if (json.text) { full += json.text; setOutput(full); setWordCount(full.replace(/\s/g, "").length); if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight; }
         } catch {}
       }
     }
   } catch (e) {
     if (e.name === 'AbortError') setErr(t.errAborted);
     else setErr(t.errFail + e.message);
   } finally { setLoading(false); setStreaming(false); }
 };

 const stopGeneration = () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };

 const selectStyle = { width: "100%", background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: "9px 10px", borderRadius: 8, fontSize: 12, fontFamily: "inherit", outline: "none" };

 return (
   <div style={{ background: S.bg, minHeight: "100vh", color: S.text, fontFamily: "system-ui, 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>
     <style>{`        @keyframes spin { to { transform: rotate(360deg); } }        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }        * { box-sizing: border-box; }        textarea:focus, select:focus { outline: none !important; border-color: #7c6ff7 !important; box-shadow: 0 0 0 3px rgba(124,111,247,0.15) !important; }        ::-webkit-scrollbar { width: 6px; }        ::-webkit-scrollbar-thumb { background: #2d2d45; border-radius: 3px; }        .img-glow { box-shadow: 0 0 40px rgba(124,111,247,0.3); border: 1px solid rgba(124,111,247,0.2); transition: opacity 0.5s ease; }        @media (max-width: 768px) { .layout { grid-template-columns: 1fr !important; } .right-panel { min-height: 400px !important; } }      `}</style>

     {/* 顶部工具栏 */}
     <div style={{ position: "fixed", top: 16, right: 16, zIndex: 100, display: "flex", gap: 10 }}>
       {timeLeft && (
         <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: S.success, padding: "8px 14px", borderRadius: 10, fontSize: 13, display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(10px)" }}>
           <Clock size={14} /> <span style={{opacity: 0.8}}>{t.timeRemaining}:</span> <b style={{fontFamily: "monospace"}}>{timeLeft}</b>
         </div>
       )}
       <button onClick={() => setShowLangMenu(!showLangMenu)} style={{ background: S.card, border: `1px solid ${S.border}`, color: S.text, padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
         {LANG_FLAGS[lang]} {t.name} ▾
       </button>
       {showLangMenu && (
         <div style={{ position: "absolute", top: "110%", right: 0, background: S.card, border: `1px solid ${S.border}`, borderRadius: 10, overflow: "hidden", minWidth: 160, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
           {Object.entries(TRANSLATIONS).map(([key, val]) => (
             <button key={key} onClick={() => { setLang(key); setShowLangMenu(false); }} style={{ width: "100%", padding: "10px 16px", background: lang === key ? "rgba(124,111,247,0.15)" : "transparent", border: "none", color: lang === key ? S.accent : S.text, cursor: "pointer", fontSize: 13, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
               {LANG_FLAGS[key]} {val.name}
             </button>
           ))}
         </div>
       )}
     </div>

     <div className="layout" style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 60px", display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, minHeight: "100vh" }}>
       {/* LEFT */}
       <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
         <div>
           <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
             <div style={{ background: "rgba(124,111,247,0.1)", border: "1px solid rgba(124,111,247,0.3)", color: S.accent, fontSize: 11, letterSpacing: 2, padding: "4px 14px", borderRadius: 100 }}>{t.badge}</div>
             <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: S.gold, fontSize: 10, padding: "4px 10px", borderRadius: 100, display: "flex", alignItems: "center", gap: 4 }}><ShieldCheck size={12} /> {t.vipTag}</div>
           </div>
           <h1 style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.2, marginBottom: 4 }}>{t.title1}<br /><span style={{ background: "linear-gradient(135deg,#7c6ff7,#f06292)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.title2}</span></h1>
           <p style={{ fontSize: 12, color: S.muted }}>{t.subtitle}</p>
         </div>
         <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: 14 }}>
           <div style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{t.modeLabel}</div>
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
             {t.modes.map(m => (
               <button key={m.id} onClick={() => {setMode(m.id); setOutput("");}} style={{ padding: "10px 8px", background: mode === m.id ? "rgba(124,111,247,0.15)" : S.surface, border: `1px solid ${mode === m.id ? S.accent : S.border}`, borderRadius: 10, color: mode === m.id ? S.accent : S.muted, fontSize: 12, fontWeight: mode === m.id ? 700 : 400, cursor: "pointer" }}>
                 <div>{m.label}</div> <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>{m.desc}</div>
               </button>
             ))}
           </div>
         </div>
         <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
           <div>
             <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 6 }}>{t.ideaLabel}</label>
             <textarea value={idea} onChange={e => setIdea(e.target.value)} rows={4} placeholder={t.ideaPlaceholders[mode]} style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: "10px 12px", borderRadius: 10, fontSize: 13, lineHeight: 1.6 }} />
           </div>
           <div>
             <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 8 }}>{tagLabel}</label>
             <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{currentTags.map(tag => ( <Tag key={tag} label={tag} active={currentSel === tag} onClick={() => setCurrentSel(currentSel === tag ? "" : tag)} /> ))}</div>
           </div>
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
             <div>
               <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 6 }}>{t.lengthLabel}</label>
               <select value={length} onChange={e => setLength(e.target.value)} style={selectStyle}>{t.lengths.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}</select>
             </div>
             <div>
               <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 6 }}>{t.styleLabel}</label>
               <select value={style} onChange={e => setStyle(e.target.value)} style={selectStyle}><option value="">{t.styleDefault}</option>{t.styles.map(s => <option key={s} value={s}>{s}</option>)}</select>
             </div>
           </div>
           <div>
             <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 6 }}>{t.extraLabel}</label>
             <textarea value={extraNote} onChange={e => setExtraNote(e.target.value)} rows={2} placeholder={t.extraPlaceholder} style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: "9px 12px", borderRadius: 10, fontSize: 13, resize: "none" }} />
           </div>
           {err && <div style={{ color: err === t.errAborted ? "#fbbf24" : "#f87171", fontSize: 13, padding: "8px 12px", background: err === t.errAborted ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.08)", borderRadius: 8 }}>{err}</div>}
           {!loading ? (
             <button onClick={generate} style={{ width: "100%", padding: 14, marginTop: "auto", background: "linear-gradient(135deg,#7c6ff7,#f06292)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{t.btnGenerate}</button>
           ) : (
             <button onClick={stopGeneration} style={{ width: "100%", padding: 14, marginTop: "auto", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: 12, color: S.stop, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{t.btnStop}</button>
           )}
         </div>
       </div>
       {/* RIGHT */}
       <div className="right-panel" style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 600 }}>
         <div style={{ padding: "14px 20px", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
           <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{output ? t.resultLabels[mode] : t.resultLabel}</div>{streaming && ( <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: S.accent }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: S.accent, animation: "pulse 1s infinite" }} />{t.streaming}</div> )}</div>
           {output && ( <div style={{ display: "flex", alignItems: "center", gap: 12 }}>{mode !== "image" ? (<><span style={{ fontSize: 12, color: S.muted }}>{wordCount} {lang === "en" || lang === "id" ? "words" : "字"}</span><CopyBtn text={output} t={t} /></>) : (<button onClick={() => window.open(output, '_blank')} style={{ background: "rgba(124,111,247,0.1)", color: S.accent, padding: "7px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> {t.btnDownload}</button>)}</div> )}
         </div>
         <div ref={outputRef} style={{ flex: 1, overflowY: "auto", padding: 24 }}>
           {!output && !loading && ( <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: S.muted, gap: 16 }}><div style={{ fontSize: 64, opacity: 0.15 }}>{mode === "novel" ? "📖" : mode === "copy" ? "✍️" : mode === "script" ? "🎬" : mode === "post" ? "📱" : mode === "paper" ? "🎓" : mode === "image" ? "🎨" : "💬"}</div><div style={{ textAlign: "center" }}><div style={{ fontSize: 15, marginBottom: 6 }}>{t.placeholder1}</div><div style={{ fontSize: 13, opacity: 0.7 }}>{t.placeholder2}</div></div></div> )}
           {loading && mode !== "image" && ( <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}><div style={{ width: 48, height: 48, border: `3px solid ${S.border}`, borderTopColor: S.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><div style={{ fontSize: 14, color: S.muted }}>{t.thinking}</div></div> )}
           {output && (
             <div style={{ animation: "fadeIn 0.3s ease", lineHeight: 2, fontSize: 15, color: S.text }}>
               {mode === "image" ? (
                 <div style={{ textAlign: "center", padding: "20px 0" }}>
                   <img src={output} alt="AI Art" className="img-glow" style={{ maxWidth: "100%", borderRadius: 16, cursor: "zoom-in" }} onClick={() => window.open(output, '_blank')} />
                   <p style={{ marginTop: 20, fontSize: 13, color: S.muted, fontStyle: "italic" }}>✨ Flux Pro Render Engine (Free)</p>
                 </div>
               ) : ( <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{output}{streaming && <span style={{ display: "inline-block", width: 2, height: "1em", background: S.accent, marginLeft: 2, animation: "pulse 0.8s infinite", verticalAlign: "text-bottom" }} />}</div> )}
             </div>
           )}
         </div>
       </div>
     </div>
   </div>
 );
}

```

```
