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
    genres: ["言情", "悬疑", "玄幻", "都市", "历史", "科幻", "恐怖", "励志"], copyTypes: ["产品推广", "品牌故事", "活动营销", "朋友圈", "广告语", "软文"], postTypes: ["小红书", "抖音", "微信公众号", "微博", "视频号"], paperTypes: ["期末论文", "开题报告", "文献综述", "学术期刊", "毕业设计"], qaTypes: ["通俗科普", "专业解析", "分点说明", "深入探讨", "简明扼要"], imageTypes: ["1:1 正方形", "16:9 宽屏", "9:16 竖屏"],
    lengthLabel: "字数/质量", styleLabel: "风格", extraLabel: "额外要求（选填）", extraPlaceholder: "例如：语气活泼，或者绘图时增加胶片感...",
    lengths: [ { v: "short", l: "短篇 / 标准" }, { v: "medium", l: "中篇 / 高清" }, { v: "long", l: "长篇 / 极速" } ],
    styles: ["正式严肃", "轻松幽默", "文艺感性", "犀利直接", "温暖治愈", "客观严谨", "写实摄影", "动漫插画", "数字艺术"], styleDefault: "不限风格",
    btnGenerate: "✨ 开始创作 / 绘图", btnStop: "⏹️ 停止生成", btnCopy: "复制全文", btnCopied: "✓ 已复制", btnDownload: "保存图片", resultLabel: "创作结果",
    resultLabels: { novel: "📖 小说正文", copy: "✍️ 文案内容", script: "🎬 剧本内容", post: "📱 种草内容", paper: "🎓 论文正文", qa: "💬 专业解答", image: "🎨 AI 生成画作" },
    streaming: "正在疾速处理...", placeholder1: "在左侧输入你的想法或画面描述", placeholder2: "AI 将为你生成高质量作品", tags: ["灵感无限", "真实客观", "零成本绘图"], thinking: "🎨 正在调集全球算力渲染大片...", errEmpty: "请输入你的想法", errFail: "生成失败：", errRetry: "请求失败，请重试", errAborted: "⚠️ 创作已中止", lengthMap: { short: "500字左右", medium: "1500字左右", long: "3000字左右" },
    systemPrompts: { novel: "作家", copy: "策划", script: "编剧", post: "专家", paper: "学术", qa: "百科" },
    userPrompts: { novel: (idea) => `小说:${idea}`, copy: (idea) => `文案:${idea}`, script: (idea) => `剧本:${idea}`, post: (idea) => `种草:${idea}`, paper: (idea) => `论文:${idea}`, qa: (idea) => `回答:${idea}` },
    vipTag: "专业版", timeRemaining: "剩余时间"
  },
  tw: { name: "繁體中文", badge: "✦ AI創作工坊", title1: "一鍵生成", title2: "小說 · 論文 · 繪圖", subtitle: "輸入想法，AI幫你寫出完整內容", modes: [ { id: "novel", label: "📖 小說", desc: "情節" }, { id: "copy", label: "✍️ 文案", desc: "行銷" }, { id: "script", label: "🎬 劇本", desc: "腳本" }, { id: "post", label: "📱 種草", desc: "社群" }, { id: "paper", label: "🎓 論文", desc: "學術" }, { id: "qa", label: "💬 問答", desc: "解答" }, { id: "image", label: "🎨 繪圖", desc: "畫作" } ], resultLabels: { novel: "📖 小說正文", copy: "✍️ 文案內容", script: "🎬 劇本內容", post: "📱 種草內容", paper: "🎓 論文正文", qa: "💬 專業解答", image: "🎨 AI 生成畫作" }, thinking: "🎨 正在調用全球算力...", vipTag: "專業版", timeRemaining: "剩餘時間", btnGenerate: "✨ 開始", btnStop: "⏹️ 停止", btnCopy: "複製", btnCopied: "✓ 已複製", btnDownload: "保存" },
  en: { name: "English", badge: "✦ AI Writer", title1: "Instant", title2: "Write · Paper · Art", subtitle: "Enter ideas, AI does the rest", modes: [ { id: "novel", label: "📖 Story", desc: "Plot" }, { id: "copy", label: "✍️ Copy", desc: "Ads" }, { id: "script", label: "🎬 Script", desc: "Scene" }, { id: "post", label: "📱 Post", desc: "Social" }, { id: "paper", label: "🎓 Essay", desc: "Paper" }, { id: "qa", label: "💬 Q&A", desc: "Fact" }, { id: "image", label: "🎨 Image", desc: "Art" } ], resultLabels: { novel: "📖 Story", copy: "✍️ Copy", script: "🎬 Script", post: "📱 Post", paper: "🎓 Essay", qa: "💬 Answer", image: "🎨 AI Art" }, thinking: "🎨 AI rendering...", vipTag: "PRO", timeRemaining: "Time Left", btnGenerate: "✨ Create", btnStop: "⏹️ Stop", btnCopy: "Copy", btnCopied: "✓ Copied", btnDownload: "Save" },
  id: { name: "Indonesia", badge: "✦ AI Studio", title1: "Buat", title2: "Cerita · Esai · Foto", subtitle: "Masukkan ide, AI buat konten", modes: [ { id: "novel", label: "📖 Cerita", desc: "Alur" }, { id: "copy", label: "✍️ Copy", desc: "Iklan" }, { id: "script", label: "🎬 Skrip", desc: "Dialog" }, { id: "post", label: "📱 Post", desc: "Sosial" }, { id: "paper", label: "🎓 Esai", desc: "Makalah" }, { id: "qa", label: "💬 Q&A", desc: "Tanya" }, { id: "image", label: "🎨 Gambar", desc: "Seni" } ], resultLabels: { novel: "📖 Cerita", copy: "✍️ Copy", script: "🎬 Skrip", post: "📱 Post", paper: "🎓 Makalah", qa: "💬 Jawaban", image: "🎨 Karya AI" }, thinking: "🎨 AI membuat gambar...", vipTag: "PRO", timeRemaining: "Sisa Waktu", btnGenerate: "✨ Mulai", btnStop: "⏹️ Berhenti", btnCopy: "Salin", btnCopied: "✓ Tersalin", btnDownload: "Simpan" }
};

const S = { bg: "#0d0d14", surface: "#13131f", card: "#1c1c2e", border: "#2d2d45", accent: "#7c6ff7", accent2: "#f06292", gold: "#fbbf24", text: "#eeeef5", muted: "#6b6b90", success: "#34d399", stop: "#ef4444" };

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

  const generate = async () => {
    if (!idea.trim()) return;
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
        body: JSON.stringify({ system: t.systemPrompts[mode], user: idea }),
        signal: abortControllerRef.current.signal 
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            if (json.text) { full += json.text; setOutput(full); setWordCount(full.length); }
          } catch {}
        }
      }
    } catch (e) { setErr(e.name === 'AbortError' ? t.errAborted : t.errRetry); }
    finally { setLoading(false); setStreaming(false); }
  };

  const stopGeneration = () => abortControllerRef.current?.abort();

  return (
    <div style={{ background: S.bg, minHeight: "100vh", color: S.text, padding: 20, fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        <div>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900 }}>{t.title1} <span style={{ color: S.accent }}>{t.title2}</span></h1>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button onClick={() => setLang("zh")}>🇨🇳</button><button onClick={() => setLang("id")}>🇮🇩</button>
              <div style={{ color: S.success, fontSize: 12 }}>{timeLeft}</div>
            </div>
          </div>
          <div style={{ background: S.card, padding: 15, borderRadius: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {t.modes.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{ padding: 10, background: mode === m.id ? S.accent : S.surface, border: "none", color: "#fff", borderRadius: 8, fontSize: 12 }}>{m.label}</button>
            ))}
          </div>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder={t.ideaPlaceholders[mode] || "Enter idea..."} style={{ width: "100%", height: 120, background: S.surface, color: "#fff", border: "1px solid "+S.border, borderRadius: 10, padding: 10 }} />
            {!loading ? (
              <button onClick={generate} style={{ padding: 15, background: S.accent, border: "none", color: "#fff", borderRadius: 10, fontWeight: 700 }}>{t.btnGenerate}</button>
            ) : (
              <button onClick={stopGeneration} style={{ padding: 15, background: S.stop, border: "none", color: "#fff", borderRadius: 10 }}>{t.btnStop}</button>
            )}
          </div>
        </div>
        <div style={{ background: S.card, borderRadius: 12, padding: 20, minHeight: 600 }}>
          <div style={{ borderBottom: "1px solid "+S.border, paddingBottom: 10, marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
            <b>{t.resultLabels[mode] || t.resultLabel}</b>
            {output && mode === "image" && <button onClick={() => window.open(output)}>Download</button>}
          </div>
          <div style={{ lineHeight: 1.8 }}>
            {mode === "image" && output ? (
              <img src={output} style={{ maxWidth: "100%", borderRadius: 12, boxShadow: "0 0 20px rgba(0,0,0,0.5)" }} />
            ) : (
              <div style={{ whiteSpace: "pre-wrap" }}>{output || (loading ? t.thinking : t.placeholder2)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
