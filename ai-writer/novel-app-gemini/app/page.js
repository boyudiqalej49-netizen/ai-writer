"use client";
import { useState, useRef, useEffect } from "react";
import { ShieldCheck, Zap, Clock, Download } from "lucide-react"; 

const TRANSLATIONS = {
  zh: {
    name: "简体中文", badge: "✦ AI创作工坊", title1: "一键生成", title2: "小说 · 论文 · 绘图", subtitle: "输入想法，AI帮你写出高质量内容或画出大片", modeLabel: "创作类型",
    modes: [
      { id: "novel", label: "📖 小说", desc: "完整故事情节" }, { id: "copy", label: "✍️ 文案", desc: "营销推广文字" }, { id: "script", label: "🎬 剧本", desc: "对话场景脚本" }, { id: "post", label: "📱 种草", desc: "小红书/抖音文案" }, { id: "paper", label: "🎓 论文", desc: "严谨学术文章" }, { id: "qa", label: "💬 问答", desc: "客观事实解答" }, { id: "image", label: "🎨 绘图", desc: "Flux 顶级画质" },
    ],
    ideaLabel: "💡 你的想法 / 问题 / 画面描述 *",
    ideaPlaceholders: { novel: "例如：一个失忆侦探发现自己就是凶手...", copy: "例如：主打成分护肤的精华液...", script: "例如：两个多年未见的老友重逢...", post: "例如：用番茄工作法让效率翻倍...", paper: "例如：探讨人工智能在医疗领域的伦理问题...", qa: "例如：量子力学的基本原理是什么？", image: "例如：一个红色的苹果，写实风格...", },
    genreLabel: "题材类型", copyTypeLabel: "文案类型", postLabel: "目标平台", paperLabel: "论文类型", qaLabel: "解答类型", imageLabel: "图片比例",
    genres: ["言情", "悬疑", "玄幻", "都市", "历史", "科幻", "恐怖", "励志"], copyTypes: ["产品推广", "品牌故事", "活动营销", "朋友圈", "广告语", "软文"], postTypes: ["小红书", "抖音", "微信公众号", "微博", "视频号"], paperTypes: ["期末论文", "开题报告", "文献综述", "学术期刊", "毕业设计"], qaTypes: ["通俗科普", "专业解析", "分点说明", "深入探讨", "简明扼要"], imageTypes: ["1:1 正方形", "16:9 宽屏", "9:16 竖屏", "4:3 复古"],
    lengthLabel: "字数/质量", styleLabel: "风格", extraLabel: "额外要求（选填）", extraPlaceholder: "例如：语气活泼，或者绘图时增加胶片感...",
    lengths: [ { v: "short", l: "短篇 / 标准" }, { v: "medium", l: "中篇 / 高清" }, { v: "long", l: "长篇 / 极速" } ],
    styles: ["正式严肃", "轻松幽默", "文艺感性", "犀利直接", "温暖治愈", "客观严谨", "写实摄影", "动漫插画", "数字艺术"], styleDefault: "不限风格",
    btnGenerate: "✨ 开始创作 / 绘图", btnStop: "⏹️ 停止生成", btnCopy: "复制全文", btnCopied: "✓ 已复制", btnDownload: "保存图片", resultLabel: "创作结果",
    resultLabels: { novel: "📖 小说正文", copy: "✍️ 文案内容", script: "🎬 剧本内容", post: "📱 种草内容", paper: "🎓 论文正文", qa: "💬 专业解答", image: "🎨 AI 生成画作" },
    streaming: "正在疾速处理...", placeholder1: "在左侧输入你的想法或画面描述", placeholder2: "AI 将为你生成高质量作品", tags: ["灵感无限", "真实客观", "零成本绘图"], thinking: "🎨 正在调集全球算力渲染大片，请稍后...", errEmpty: "请输入你的想法、问题或画面描述", errFail: "生成失败：", errRetry: "请求失败，请稍后重试", errAborted: "⚠️ 创作已中止", lengthMap: { short: "500字左右", medium: "1500字左右", long: "3000字左右" },
    systemPrompts: { novel: "顶级小说作家", copy: "策划专家", script: "编剧专家", post: "爆款专家", paper: "学术专家", qa: "百科专家", image: "" },
    userPrompts: {
      novel: (idea) => `创作小说：${idea}`, copy: (idea) => `文案：${idea}`, script: (idea) => `剧本：${idea}`, post: (idea) => `内容：${idea}`, paper: (idea) => `论文：${idea}`, qa: (idea) => `解答：${idea}`,
    },
    vipTag: "专业版", timeRemaining: "剩余时间"
  },
  id: {
    name: "Indonesia", badge: "✦ AI Studio", title1: "Buat Otomatis", title2: "Teks · Esai · Gambar", subtitle: "Masukkan ide, AI menulis konten atau membuat gambar HD", modeLabel: "Jenis Konten",
    modes: [ { id: "novel", label: "📖 Cerita", desc: "Narasi lengkap" }, { id: "copy", label: "✍️ Copy", desc: "Konten pemasaran" }, { id: "script", label: "🎬 Skrip", desc: "Dialog & adegan" }, { id: "post", label: "📱 Sosial", desc: "Instagram/TikTok" }, { id: "paper", label: "🎓 Esai", desc: "Makalah Akademik" }, { id: "qa", label: "💬 Q&A", desc: "Jawaban Faktual" }, { id: "image", label: "🎨 Gambar", desc: "Kualitas Flux" } ],
    ideaLabel: "💡 Ide / Pertanyaan / Deskripsi *",
    ideaPlaceholders: { novel: "mis. Detektif amnesia...", copy: "mis. Serum wajah...", script: "mis. Teman lama...", post: "mis. Teknik Pomodoro...", paper: "mis. Etika AI...", qa: "mis. Teori relativitas?", image: "mis. Kucing berbaju adat Indonesia...", },
    genreLabel: "Genre", copyTypeLabel: "Tipe", postLabel: "Platform", paperLabel: "Tipe", qaLabel: "Format", imageLabel: "Rasio",
    genres: ["Romantis", "Misteri"], copyTypes: ["Promo", "Story"], postTypes: ["TikTok", "Ins"], paperTypes: ["Jurnal", "Skripsi"], qaTypes: ["Deep", "Brief"], imageTypes: ["1:1 Kotak", "16:9 Lebar", "9:16 Tegak"],
    lengthLabel: "Panjang/Kualitas", styleLabel: "Gaya", extraLabel: "Tambahan", extraPlaceholder: "mis. Nada formal...",
    lengths: [ { v: "short", l: "Pendek / Std" }, { v: "medium", l: "Sedang / HD" }, { v: "long", l: "Panjang / Cepat" } ],
    styles: ["Formal", "Lucu", "Realistis", "Anime"], styleDefault: "Bebas",
    btnGenerate: "✨ Mulai Buat", btnStop: "⏹️ Berhenti", btnCopy: "Salin", btnCopied: "✓ Tersalin", btnDownload: "Simpan Gambar", resultLabel: "Hasil",
    resultLabels: { novel: "📖 Cerita", copy: "✍️ Copy", script: "🎬 Skrip", post: "📱 Postingan", paper: "🎓 Makalah", qa: "💬 Jawaban", image: "🎨 Karya AI" },
    streaming: "Memproses...", placeholder1: "Masukkan ide Anda", placeholder2: "AI akan membuat untuk Anda", tags: ["Kreatif", "Faktual", "Gambar Gratis"],
    thinking: "🎨 Menghubungkan ke GPU global, mohon tunggu...", errEmpty: "Masukkan ide Anda", errFail: "Gagal: ", errRetry: "Gagal, coba lagi", errAborted: "⚠️ Pembuatan dihentikan", lengthMap: { short: "300 kata", medium: "800 kata", long: "1500 kata" },
    systemPrompts: { novel: "Penulis", copy: "Pemasar", script: "Sutradara", post: "Pakar", paper: "Akademisi", qa: "Pakar", image: "" },
    userPrompts: { novel: (idea) => `Cerita: ${idea}`, copy: (idea) => `Copy: ${idea}`, script: (idea) => `Skrip: ${idea}`, post: (idea) => `Post: ${idea}`, paper: (idea) => `Makalah: ${idea}`, qa: (idea) => `Jawaban: ${idea}` },
    vipTag: "PRO", timeRemaining: "Sisa Waktu"
  },
  tw: { name: "繁體中文", badge: "✦ AI創作工坊", title1: "一鍵生成", title2: "小說 · 論文 · 繪圖", subtitle: "輸入想法，AI幫你寫出完整內容或畫出大片", modeLabel: "創作類型", modes: [ { id: "novel", label: "📖 小說", desc: "完整故事" }, { id: "copy", label: "✍️ 文案", desc: "行銷文字" }, { id: "script", label: "🎬 劇本", desc: "腳本" }, { id: "post", label: "📱 種草", desc: "社群文案" }, { id: "paper", label: "🎓 論文", desc: "學術文章" }, { id: "qa", label: "💬 問答", desc: "事實解答" }, { id: "image", label: "🎨 繪圖", desc: "Flux 頂級" } ], ideaLabel: "💡 你的想法 / 問題 / 畫面描述 *", ideaPlaceholders: { novel: "例如：失憶偵探...", copy: "例如：精華液...", script: "例如：老友重逢...", post: "例如：效率翻倍...", paper: "例如：AI倫理...", qa: "例如：量子力學...", image: "例如：穿著印尼服飾的貓..." }, genreLabel: "題材類型", copyTypeLabel: "文案類型", postLabel: "目標平台", paperLabel: "論文類型", qaLabel: "解答類型", imageLabel: "圖片比例", genres: ["言情", "懸疑"], copyTypes: ["產品", "品牌"], postTypes: ["FB", "IG"], paperTypes: ["期刊", "畢業"], qaTypes: ["科普", "解析"], imageTypes: ["1:1 正方形", "16:9 寬屏", "9:16 豎屏"], lengthLabel: "字數/質量", styleLabel: "風格", extraLabel: "額外要求", extraPlaceholder: "例如：語氣活潑...", lengths: [ { v: "short", l: "短篇 / 標準" }, { v: "medium", l: "中篇 / 高清" }, { v: "long", l: "長篇 / 極速" } ], styles: ["正式", "幽默", "寫實", "動漫"], styleDefault: "不限", btnGenerate: "✨ 開始", btnStop: "⏹️ 停止", btnCopy: "複製", btnCopied: "✓ 已複製", btnDownload: "保存圖片", resultLabel: "結果", resultLabels: { novel: "📖 小說正文", copy: "✍️ 文案內容", script: "🎬 劇本內容", post: "📱 種草內容", paper: "🎓 論文正文", qa: "💬 專業解答", image: "🎨 AI 繪圖" }, streaming: "疾速處理中...", placeholder1: "輸入想法", placeholder2: "AI將生成內容", tags: ["靈感無限", "事實客觀", "免費繪圖"], thinking: "🎨 正在調用全球算力...", errEmpty: "請輸入想法", errFail: "失敗：", errRetry: "請稍後重試", errAborted: "⚠️ 已中止", lengthMap: { short: "500字", medium: "1500字", long: "3000字" }, systemPrompts: { novel: "作家", copy: "策劃", script: "編劇", post: "專家", paper: "學術", qa: "百科", image: "" }, userPrompts: { novel: (idea) => `小說：${idea}`, copy: (idea) => `文案：${idea}`, script: (idea) => `劇本：${idea}`, post: (idea) => `內容：${idea}`, paper: (idea) => `論文：${idea}`, qa: (idea) => `問答：${idea}` }, vipTag: "專業版", timeRemaining: "剩餘時間" },
  en: { name: "English", badge: "✦ AI Studio", title1: "Generate", title2: "Text · Paper · Art", subtitle: "Enter ideas, AI writes content or paints HD images", modeLabel: "Content Type", modes: [ { id: "novel", label: "📖 Story", desc: "Full narrative" }, { id: "copy", label: "✍️ Copy", desc: "Marketing" }, { id: "script", label: "🎬 Script", desc: "Dialogue" }, { id: "post", label: "📱 Social", desc: "Insta/TikTok" }, { id: "paper", label: "🎓 Essay", desc: "Academic" }, { id: "qa", label: "💬 Q&A", desc: "Factual" }, { id: "image", label: "🎨 Image", desc: "Flux AI" } ], ideaLabel: "💡 Your Idea / Prompt *", ideaPlaceholders: { novel: "e.g. Amnesiac detective...", copy: "e.g. Skin serum...", script: "e.g. Old friends...", post: "e.g. Pomodoro...", paper: "e.g. AI ethics...", qa: "e.g. Relativity?", image: "e.g. Cat in traditional dress..." }, genreLabel: "Genre", copyTypeLabel: "Type", postLabel: "Platform", paperLabel: "Type", qaLabel: "Format", imageLabel: "Ratio", genres: ["Romance", "Mystery"], copyTypes: ["Ad", "Story"], postTypes: ["TikTok", "Ins"], paperTypes: ["Journal", "Thesis"], qaTypes: ["Deep", "Brief"], imageTypes: ["1:1 Square", "16:9 Wide", "9:16 Port"], lengthLabel: "Length/Quality", styleLabel: "Style", extraLabel: "Extra", extraPlaceholder: "e.g. Formal tone...", lengths: [ { v: "short", l: "Short / Std" }, { v: "medium", l: "Medium / HD" }, { v: "long", l: "Long / Fast" } ], styles: ["Formal", "Funny", "Realistic", "Anime"], styleDefault: "Any", btnGenerate: "✨ Generate", btnStop: "⏹️ Stop", btnCopy: "Copy", btnCopied: "✓ Copied", btnDownload: "Save Image", resultLabel: "Result", resultLabels: { novel: "📖 Story", copy: "✍️ Copy", script: "🎬 Script", post: "📱 Post", paper: "🎓 Essay", qa: "💬 Answer", image: "🎨 AI Art" }, streaming: "Processing...", placeholder1: "Enter prompt", placeholder2: "AI will create", tags: ["Creative", "Factual", "Free Art"], thinking: "🎨 Connecting to global GPU nodes...", errEmpty: "Please enter idea", errFail: "Failed: ", errRetry: "Retry later", errAborted: "⚠️ Stopped", lengthMap: { short: "300 words", medium: "800 words", long: "1500 words" }, systemPrompts: { novel: "Writer", copy: "Marketer", script: "Director", post: "Expert", paper: "Scholar", qa: "Expert", image: "" }, userPrompts: { novel: (idea) => `Story: ${idea}`, copy: (idea) => `Copy: ${idea}`, script: (idea) => `Script: ${idea}`, post: (idea) => `Post: ${idea}`, paper: (idea) => `Essay: ${idea}`, qa: (idea) => `Answer: ${idea}` }, vipTag: "PRO", timeRemaining: "Time Left" }
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
    <button onClick={copy} style={{ background: done ? "rgba(52,211,153,0.1)" : "rgba(124,111,247,0.1)", color: done ? S.success : S.accent, padding: "7px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: "none", fontWeight: 500 }}>{done ? t.btnCopied : t.btnCopy}</button>
  );
}

const LANG_FLAGS = { zh: "🇨🇳", tw: "🇹🇼", en: "🇺🇸", id: "🇮🇩" };

export default function Home() {
  const [lang, setLang] = useState("zh");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.zh;
  const [timeLeft, setTimeLeft] = useState("");
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

  useEffect(() => {
    const timer = setInterval(() => {
      const cookies = document.cookie.split('; ');
      const userType = cookies.find(row => row.startsWith('user_type='))?.split('=')[1];
      const actTimeStr = cookies.find(row => row.startsWith('activation_time='))?.split('=')[1];
      if (userType === 'permanent') { setTimeLeft("∞ 永久有效"); return; }
      if (actTimeStr) {
        const diff = (parseInt(actTimeStr) + (30 * 24 * 3600 * 1000)) - Date.now();
        if (diff <= 0) { setTimeLeft("Expired"); window.location.reload(); }
        else { setTimeLeft(`${Math.floor(diff/86400000)}d ${Math.floor((diff%86400000)/3600000)}h`); }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    if (mode === "image") {
      const seed = Math.floor(Math.random() * 999999);
      const prompt = encodeURIComponent(`${idea} ${style} ${extraNote}`.trim());
      setOutput(`https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`);
      setLoading(false); return;
    }
    abortControllerRef.current = new AbortController();
    try {
      setStreaming(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: t.systemPrompts[mode], user: t.userPrompts[mode](idea, currentSel, "", style, extraNote) }),
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
            if (json.text) { full += json.text; setOutput(full); setWordCount(full.length); if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight; }
          } catch {}
        }
      }
    } catch (e) { setErr(e.name === 'AbortError' ? t.errAborted : t.errRetry); }
    finally { setLoading(false); setStreaming(false); }
  };

  return (
    <div style={{ background: S.bg, minHeight: "100vh", color: S.text, fontFamily: "system-ui" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        textarea:focus, select:focus { outline: none !important; border-color: #7c6ff7 !important; }
        .img-glow { box-shadow: 0 0 40px rgba(124,111,247,0.3); border: 1px solid rgba(124,111,247,0.2); }
      `}</style>
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 100, display: "flex", gap: 10 }}>
        <div style={{ background: "rgba(52,211,153,0.1)", color: S.success, padding: "8px 14px", borderRadius: 10, fontSize: 13 }}>{timeLeft}</div>
        <button onClick={() => setShowLangMenu(!showLangMenu)} style={{ background: S.card, border: `1px solid ${S.border}`, color: S.text, padding: "8px 14px", borderRadius: 10 }}>{LANG_FLAGS[lang]} ▾</button>
        {showLangMenu && <div style={{ position: "absolute", top: "110%", right: 0, background: S.card, border: `1px solid ${S.border}`, borderRadius: 10, overflow: "hidden" }}>
          {Object.keys(TRANSLATIONS).map(k => <button key={k} onClick={() => {setLang(k); setShowLangMenu(false);}} style={{ display: "block", width: "100%", padding: 10, background: "none", color: "#fff", border: "none" }}>{LANG_FLAGS[k]} {TRANSLATIONS[k].name}</button>)}
        </div>}
      </div>
      <div className="layout" style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px", display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h1>{t.title1}<br /><span style={{ color: S.accent }}>{t.title2}</span></h1>
          <div style={{ background: S.card, borderRadius: 14, padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {t.modes.map(m => (
              <button key={m.id} onClick={() => {setMode(m.id); setOutput("");}} style={{ padding: 10, background: mode === m.id ? S.accent : S.surface, border: "none", color: "#fff", borderRadius: 10, fontSize: 12 }}>{m.label}</button>
            ))}
          </div>
          <div style={{ background: S.card, borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <textarea value={idea} onChange={e => setIdea(e.target.value)} rows={4} placeholder={t.ideaPlaceholders[mode]} style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: 12, borderRadius: 10 }} />
            <div>{tagLabel}: <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>{currentTags.map(tag => <Tag key={tag} label={tag} active={currentSel === tag} onClick={() => setCurrentSel(tag)} />)}</div></div>
            {!loading ? <button onClick={generate} style={{ padding: 14, background: S.accent, border: "none", color: "#fff", borderRadius: 12, fontWeight: 700 }}>{t.btnGenerate}</button> : <button onClick={() => abortControllerRef.current?.abort()} style={{ padding: 14, background: S.stop, border: "none", color: "#fff", borderRadius: 12 }}>{t.btnStop}</button>}
            {err && <div style={{ color: "#f87171", fontSize: 12 }}>{err}</div>}
          </div>
        </div>
        <div className="right-panel" style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, display: "flex", flexDirection: "column", minHeight: 600 }}>
          <div style={{ padding: 20, borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between" }}>
            <b>{output ? t.resultLabels[mode] : t.resultLabel}</b>
            {output && mode === "image" && <button onClick={() => window.open(output)} style={{ color: S.accent }}>{t.btnDownload}</button>}
          </div>
          <div ref={outputRef} style={{ flex: 1, padding: 24, overflowY: "auto" }}>
            {mode === "image" && output ? <img src={output} className="img-glow" style={{ maxWidth: "100%", borderRadius: 16 }} /> : <div style={{ whiteSpace: "pre-wrap" }}>{output || (loading ? t.thinking : t.placeholder2)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
