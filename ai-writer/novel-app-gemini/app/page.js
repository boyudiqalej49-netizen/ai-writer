"use client";
import React, { useState, useRef, useEffect } from "react";

const TRANSLATIONS = {
  zh: {
    name: "简体中文", badge: "✦ AI创作工坊", title1: "一键生成", title2: "小说 · 文案", subtitle: "输入想法，AI帮你写出完整内容",
    authLabel: "已激活：剩余 30 天", modeLabel: "创作类型",
    modes: [
      { id: "novel", label: "📖 小说", desc: "完整故事情节" },
      { id: "copy", label: "✍️ 文案", desc: "营销推广文字" },
      { id: "script", label: "🎬 剧本", desc: "对话场景脚本" },
      { id: "post", label: "📱 种草", desc: "小红书/抖音文案" },
    ],
    ideaLabel: "💡 你的想法 *",
    ideaPlaceholders: {
      novel: "例如：一个失忆侦探发现自己就是凶手...",
      copy: "例如：主打成分护肤的精华液，目标用户25-35岁女性...",
      script: "例如：两个多年未见的老友重逢，发现彼此都变了...",
      post: "例如：用番茄工作法让效率翻倍的亲身经历...",
    },
    genreLabel: "题材类型", copyTypeLabel: "文案类型", postLabel: "目标平台",
    genres: ["言情", "悬疑", "玄幻", "都市", "历史", "科幻", "恐怖", "励志"],
    copyTypes: ["产品推广", "品牌故事", "活动营销", "朋友圈", "广告语", "软文"],
    postTypes: ["小红书", "抖音", "微信公众号", "微博", "视频号"],
    lengthLabel: "字数", styleLabel: "风格", extraLabel: "额外要求（选填）",
    extraPlaceholder: "例如：主角叫小月，结局要开心，语气要活泼...",
    lengths: [{ v: "short", l: "短篇（500字）" }, { v: "medium", l: "中篇（1500字）" }, { v: "long", l: "长篇（3000字）" }],
    styles: ["正式严肃", "轻松幽默", "文艺感性", "犀利直接", "温暖治愈", "悬疑紧张"],
    styleDefault: "不限风格", btnGenerate: "✨ 开始创作", btnGenerating: "⏳ 创作中...", btnCopy: "复制全文", btnCopied: "✓ 已复制",
    resultLabel: "创作结果", resultLabels: { novel: "📖 小说正文", copy: "✍️ 文案内容", script: "🎬 剧本内容", post: "📱 种草内容" },
    streaming: "正在创作...", placeholder1: "在左侧输入你的想法", placeholder2: "AI 将为你生成完整内容",
    tags: ["灵感无限", "流畅输出", "一键复制"], thinking: "AI 正在构思创作...",
    errEmpty: "请输入你的想法创意", errFail: "生成失败：", errRetry: "请求失败，请稍后重试",
    lengthMap: { short: "500字左右", medium: "1500字左右", long: "3000字左右" },
    systemPrompts: {
      novel: "你是一位顶级小说作家，擅长各类题材。文字生动、情节紧凑、人物立体。直接输出小说正文，不要加任何说明或前缀。",
      copy: "你是顶级文案策划师，擅长各类营销文案。文案有感染力、转化率高。直接输出文案正文。",
      script: "你是专业编剧，擅长对话、场景、冲突。剧本真实有张力。直接输出剧本内容。",
      post: "你是自媒体爆款文案专家，深度了解小红书、抖音平台和用户心理。直接输出内容正文。",
    },
    userPrompts: {
      novel: (idea, sel, len, style, extra) => `根据以下想法，创作一篇完整小说。\n\n想法：${idea}\n题材：${sel||"不限"}\n字数：${len}\n风格：${style||"不限"}\n要求：${extra||"无"}\n\n直接从标题开始输出内容。`,
      copy: (idea, sel, len, style, extra) => `根据以下需求，创作专业文案。\n\n需求：${idea}\n类型：${sel||"通用推广"}\n字数：${len}\n风格：${style||"不限"}\n要求：${extra||"无"}`,
      script: (idea, sel, len, style, extra) => `根据以下想法创作剧本。\n\n故事：${idea}\n风格：${sel||"不限"}\n长度：${len}\n风格：${style||"不限"}\n要求：${extra||"无"}`,
      post: (idea, sel, len, style, extra) => `根据以下想法创作爆款自媒体内容。\n\n内容：${idea}\n平台：${sel||"小红书"}\n字数：${len}\n风格：${style||"不限"}\n要求：${extra||"无"}`,
    },
  },
  tw: { name: "繁體中文", badge: "✦ AI創作工坊", title1: "一鍵生成", title2: "小說 · 文案", subtitle: "輸入想法，AI幫你寫出完整內容", authLabel: "已激活：剩餘 30 天" /* 省略重复结构... */ },
  en: { name: "English", badge: "✦ AI Writer Studio", title1: "Generate", title2: "Stories & Copies", subtitle: "AI writes the full content for you", authLabel: "Activated: 30 Days Remaining" /* 省略重复结构... */ },
  id: { name: "Indonesia", badge: "✦ Studio Penulis AI", title1: "Buat Sekarang", title2: "Cerita & Konten", subtitle: "AI menulis konten lengkap untuk Anda", authLabel: "Aktif: Sisa 30 Hari" /* 省略重复结构... */ },
};

const S = { bg: "#0d0d14", surface: "#13131f", card: "#1c1c2e", border: "#2d2d45", accent: "#7c6ff7", accent2: "#f06292", text: "#eeeef5", muted: "#6b6b90", success: "#34d399" };

function Tag({ label, active, onClick }) {
  return <button onClick={onClick} style={{ background: active ? "rgba(124,111,247,0.2)" : S.surface, border: `1px solid ${active ? S.accent : S.border}`, color: active ? S.accent : S.muted, padding: "5px 14px", borderRadius: 100, fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>{label}</button>;
}

function CopyBtn({ text, t }) {
  const [done, setDone] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); };
  return <button onClick={copy} style={{ background: done ? "rgba(52,211,153,0.1)" : "rgba(124,111,247,0.1)", color: done ? S.success : S.accent, padding: "7px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", border: "none", fontWeight: 500, transition: "all 0.2s" }}>{done ? t.btnCopied : t.btnCopy}</button>;
}

const LANG_FLAGS = { zh: "🇨🇳", tw: "🇹🇼", en: "🇺🇸", id: "🇮🇩" };

export default function Home() {
  const [lang, setLang] = useState("zh");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.zh;

  // 精准 Cookie 检测
  useEffect(() => {
    const check = () => {
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };
      if (getCookie('user_access_token') === 'is_valid') {
        setDaysRemaining(30);
      }
    };
    check();
    const t = setTimeout(check, 1000);
    return () => clearTimeout(t);
  }, []);

  const [mode, setMode] = useState("novel");
  const [idea, setIdea] = useState("");
  const [genre, setGenre] = useState("");
  const [copyType, setCopyType] = useState("");
  const [length, setLength] = useState("medium");
  const [style, setStyle] = useState("");
  const [extraNote, setExtraNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [err, setErr] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const outputRef = useRef(null);

  const generate = async () => {
    if (!idea.trim()) { setErr(t.errEmpty); return; }
    setErr(""); setLoading(true); setOutput(""); setWordCount(0);
    try {
      setStreaming(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: t.systemPrompts[mode],
          user: t.userPrompts[mode](idea, mode==="novel"||mode==="script"?genre:copyType, t.lengthMap[length], style, extraNote),
        }),
      });
      if (!res.ok) throw new Error(t.errRetry);
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
            if (json.text) {
              full += json.text;
              setOutput(full);
              setWordCount(full.replace(/\s/g, "").length);
              if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
            }
          } catch {}
        }
      }
    } catch (e) { setErr(t.errFail + e.message); } finally { setLoading(false); setStreaming(false); }
  };

  const currentTags = mode === "novel" || mode === "script" ? t.genres : t.copyTypes;
  const currentSel = mode === "novel" || mode === "script" ? genre : copyType;
  const setCurrentSel = mode === "novel" || mode === "script" ? setGenre : setCopyType;

  return (
    <div style={{ background: S.bg, minHeight: "100vh", color: S.text, fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        textarea:focus, select:focus { outline: none !important; border-color: #7c6ff7 !important; box-shadow: 0 0 0 3px rgba(124,111,247,0.15) !important; }
      `}</style>

      {/* Language Switcher */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 100 }}>
        <button onClick={() => setShowLangMenu(!showLangMenu)} style={{ background: S.card, border: `1px solid ${S.border}`, color: S.text, padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13 }}>{LANG_FLAGS[lang]} {t.name} ▾</button>
        {showLangMenu && <div style={{ position: "absolute", top: "110%", right: 0, background: S.card, border: `1px solid ${S.border}`, borderRadius: 10, overflow: "hidden", minWidth: 160, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
          {Object.keys(TRANSLATIONS).map(key => <button key={key} onClick={() => { setLang(key); setShowLangMenu(false); }} style={{ width: "100%", padding: "10px 16px", background: lang === key ? "rgba(124,111,247,0.15)" : "transparent", border: "none", color: lang === key ? S.accent : S.text, cursor: "pointer", textAlign: "left", fontSize: 13 }}>{LANG_FLAGS[key]} {TRANSLATIONS[key].name}</button>)}
        </div>}
      </div>

      <div className="layout" style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px", display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(124,111,247,0.1)", border: "1px solid rgba(124,111,247,0.3)", color: S.accent, fontSize: 11, padding: "4px 14px", borderRadius: 100, marginBottom: 10 }}>{t.badge}</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>{t.title1}<br /><span style={{ background: "linear-gradient(135deg,#7c6ff7,#f06292)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.title2}</span></h1>
            <p style={{ fontSize: 12, color: S.muted }}>{t.subtitle}</p>
            {daysRemaining && <div style={{ marginTop: 12, padding: "6px 12px", background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 8, animation: "fadeIn 0.5s ease" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: S.success }}></div><span style={{ fontSize: 11, color: S.success, fontWeight: 600 }}>{t.authLabel}</span></div>}
          </div>

          <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 11, color: S.muted, marginBottom: 10 }}>{t.modeLabel}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {t.modes.map(m => <button key={m.id} onClick={() => setMode(m.id)} style={{ padding: "10px 8px", background: mode === m.id ? "rgba(124,111,247,0.15)" : S.surface, border: `1px solid ${mode === m.id ? S.accent : S.border}`, borderRadius: 10, color: mode === m.id ? S.accent : S.muted, fontSize: 12, cursor: "pointer" }}><div>{m.label}</div><div style={{ fontSize: 10, opacity: 0.7 }}>{m.desc}</div></button>)}
            </div>
          </div>

          <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ fontSize: 12, color: S.muted }}>{t.ideaLabel}</label>
            <textarea value={idea} onChange={e => setIdea(e.target.value)} rows={4} placeholder={t.ideaPlaceholders[mode]} style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: "10px 12px", borderRadius: 10, fontSize: 13, resize: "none" }} />
            <label style={{ fontSize: 12, color: S.muted }}>{mode === "novel" || mode === "script" ? t.genreLabel : mode === "post" ? t.postLabel : t.copyTypeLabel}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{(mode === "post" ? t.postTypes : currentTags).map(tag => <Tag key={tag} label={tag} active={currentSel === tag} onClick={() => setCurrentSel(currentSel === tag ? "" : tag)} />)}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={{ fontSize: 12, color: S.muted }}>{t.lengthLabel}</label><select value={length} onChange={e => setLength(e.target.value)} style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: "8px", borderRadius: 8, fontSize: 12 }}>{t.lengths.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}</select></div>
              <div><label style={{ fontSize: 12, color: S.muted }}>{t.styleLabel}</label><select value={style} onChange={e => setStyle(e.target.value)} style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: "8px", borderRadius: 8, fontSize: 12 }}><option value="">{t.styleDefault}</option>{t.styles.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            </div>
            <button onClick={generate} disabled={loading} style={{ width: "100%", padding: 14, background: loading ? "#2a2a3e" : "linear-gradient(135deg,#7c6ff7,#f06292)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? t.btnGenerating : t.btnGenerate}</button>
          </div>
        </div>

        <div className="right-panel" style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, display: "flex", flexDirection: "column", minHeight: 600 }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{output ? t.resultLabels[mode] : t.resultLabel}</div>
            {output && <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 12, color: S.muted }}>{wordCount} 字</span><CopyBtn text={output} t={t} /></div>}
          </div>
          <div ref={outputRef} style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {!output && !loading && <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: S.muted, gap: 16 }}><div style={{ fontSize: 64, opacity: 0.15 }}>📖</div><div style={{ textAlign: "center" }}><div style={{ fontSize: 15 }}>{t.placeholder1}</div><div style={{ fontSize: 13 }}>{t.placeholder2}</div></div></div>}
            {loading && !output && <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}><div style={{ width: 48, height: 48, border: `3px solid ${S.border}`, borderTopColor: S.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><div>{t.thinking}</div></div>}
            {output && <div style={{ animation: "fadeIn 0.3s ease", lineHeight: 2, fontSize: 15, whiteSpace: "pre-wrap" }}>{output}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
