"use client";
import { useState, useRef } from "react";

const MODES = [
  { id: "novel", label: "📖 小说", desc: "完整故事情节" },
  { id: "copy", label: "✍️ 文案", desc: "营销推广文字" },
  { id: "script", label: "🎬 剧本", desc: "对话场景脚本" },
  { id: "post", label: "📱 种草", desc: "小红书/抖音文案" },
];

const NOVEL_GENRES = ["言情", "悬疑", "玄幻", "都市", "历史", "科幻", "恐怖", "励志"];
const COPY_TYPES = ["产品推广", "品牌故事", "活动营销", "朋友圈", "广告语", "软文"];
const LENGTHS = [
  { v: "short", l: "短篇（500字）" },
  { v: "medium", l: "中篇（1500字）" },
  { v: "long", l: "长篇（3000字）" },
];
const STYLES = ["正式严肃", "轻松幽默", "文艺感性", "犀利直接", "温暖治愈", "悬疑紧张"];

const S = {
  bg: "#0d0d14", surface: "#13131f", card: "#1c1c2e", border: "#2d2d45",
  accent: "#7c6ff7", accent2: "#f06292", gold: "#fbbf24",
  text: "#eeeef5", muted: "#6b6b90", success: "#34d399",
};

function Tag({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? "rgba(124,111,247,0.2)" : S.surface,
      border: `1px solid ${active ? S.accent : S.border}`,
      color: active ? S.accent : S.muted,
      padding: "5px 14px", borderRadius: 100, fontSize: 12,
      cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
    }}>{label}</button>
  );
}

function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <button onClick={copy} style={{
      background: done ? "rgba(52,211,153,0.1)" : "rgba(124,111,247,0.1)",
      border: `1px solid ${done ? S.success : "rgba(124,111,247,0.3)"}`,
      color: done ? S.success : S.accent,
      padding: "7px 18px", borderRadius: 8, fontSize: 13,
      cursor: "pointer", fontFamily: "inherit", border: "none",
      fontWeight: 500, transition: "all 0.2s",
    }}>{done ? "✓ 已复制" : "复制全文"}</button>
  );
}

export default function Home() {
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
    if (!idea.trim()) { setErr("请输入你的想法或创意"); return; }
    setErr(""); setLoading(true); setOutput(""); setWordCount(0);

    const lengthMap = { short: "500字左右", medium: "1500字左右", long: "3000字左右" };
    const currentSel = mode === "novel" || mode === "script" ? genre : copyType;

    const prompts = {
      novel: {
        system: "你是一位顶级小说作家，擅长各类题材。文字生动、情节紧凑、人物立体。直接输出小说正文，不要加任何说明或前缀。",
        user: `根据以下想法，创作一篇完整小说。\n\n想法：${idea}\n题材：${currentSel || "不限"}\n字数：${lengthMap[length]}\n风格：${style || "不限"}\n要求：${extraNote || "无"}\n\n直接从标题开始输出小说内容，要有吸引人的开头、起伏的情节、有力量的结尾。`,
      },
      copy: {
        system: "你是顶级文案策划师，擅长各类营销文案。文案有感染力、转化率高。直接输出文案正文。",
        user: `根据以下需求，创作专业文案。\n\n需求：${idea}\n类型：${currentSel || "通用推广"}\n字数：${lengthMap[length]}\n风格：${style || "不限"}\n要求：${extraNote || "无"}\n\n要求标题吸引眼球、痛点精准、卖点突出、有行动引导。`,
      },
      script: {
        system: "你是专业编剧，擅长对话、场景、冲突。剧本真实有张力。直接输出剧本内容。",
        user: `根据以下想法创作剧本。\n\n故事：${idea}\n风格：${currentSel || "不限"}\n长度：${lengthMap[length]}\n风格：${style || "不限"}\n要求：${extraNote || "无"}\n\n格式：场景说明 + 人物对话（角色名：台词）+ 动作指示，有明确的戏剧冲突。`,
      },
      post: {
        system: "你是自媒体爆款文案专家，深度了解小红书、抖音平台和用户心理。直接输出内容正文。",
        user: `根据以下想法创作爆款自媒体内容。\n\n内容：${idea}\n平台：${currentSel || "小红书"}\n字数：${lengthMap[length]}\n风格：${style || "不限"}\n要求：${extraNote || "无"}\n\n要求：开头3行抓眼球、多用换行和emoji、有干货或情感共鸣、结尾引导互动、附上5个话题标签。`,
      },
    };

    try {
      setStreaming(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prompts[mode]),
      });

      if (!res.ok) throw new Error("请求失败，请稍后重试");

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
    } catch (e) {
      setErr("生成失败：" + e.message);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const currentTags = mode === "novel" || mode === "script" ? NOVEL_GENRES : COPY_TYPES;
  const currentSel = mode === "novel" || mode === "script" ? genre : copyType;
  const setCurrentSel = mode === "novel" || mode === "script" ? setGenre : setCopyType;

  const selectStyle = {
    width: "100%", background: S.surface, border: `1px solid ${S.border}`,
    color: S.text, padding: "9px 10px", borderRadius: 8,
    fontSize: 12, fontFamily: "inherit", outline: "none",
  };

  return (
    <div style={{ background: S.bg, minHeight: "100vh", color: S.text, fontFamily: "system-ui, 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        textarea:focus, input:focus, select:focus { outline: none !important; border-color: #7c6ff7 !important; box-shadow: 0 0 0 3px rgba(124,111,247,0.15) !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #2d2d45; border-radius: 3px; }
        @media (max-width: 768px) {
          .layout { grid-template-columns: 1fr !important; }
          .right-panel { min-height: 400px !important; }
        }
      `}</style>

      <div className="layout" style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 60px", display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, minHeight: "100vh" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(124,111,247,0.1)", border: "1px solid rgba(124,111,247,0.3)", color: S.accent, fontSize: 11, letterSpacing: 2, padding: "4px 14px", borderRadius: 100, marginBottom: 10 }}>✦ AI创作工坊</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.2, marginBottom: 4 }}>
              一键生成<br />
              <span style={{ background: "linear-gradient(135deg,#7c6ff7,#f06292)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>小说 · 文案</span>
            </h1>
            <p style={{ fontSize: 12, color: S.muted }}>输入想法，AI帮你写出完整内容</p>
          </div>

          {/* Mode */}
          <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>创作类型</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {MODES.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)} style={{
                  padding: "10px 8px", background: mode === m.id ? "rgba(124,111,247,0.15)" : S.surface,
                  border: `1px solid ${mode === m.id ? S.accent : S.border}`, borderRadius: 10,
                  color: mode === m.id ? S.accent : S.muted, fontSize: 12,
                  fontWeight: mode === m.id ? 700 : 400, cursor: "pointer", fontFamily: "inherit",
                }}>
                  <div>{m.label}</div>
                  <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 6 }}>💡 你的想法 *</label>
              <textarea value={idea} onChange={e => setIdea(e.target.value)} rows={4} placeholder={
                mode === "novel" ? "例如：一个失忆侦探发现自己就是凶手..." :
                mode === "copy" ? "例如：主打成分护肤的精华液，目标用户25-35岁女性..." :
                mode === "script" ? "例如：两个多年未见的老友重逢，发现彼此都变了..." :
                "例如：用番茄工作法让效率翻倍的亲身经历..."
              } style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }} />
            </div>

            <div>
              <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 8 }}>
                {mode === "novel" || mode === "script" ? "题材类型" : mode === "post" ? "目标平台" : "文案类型"}
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(mode === "post" ? ["小红书", "抖音", "微信公众号", "微博", "视频号"] : currentTags).map(t => (
                  <Tag key={t} label={t} active={currentSel === t} onClick={() => setCurrentSel(currentSel === t ? "" : t)} />
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 6 }}>字数</label>
                <select value={length} onChange={e => setLength(e.target.value)} style={selectStyle}>
                  {LENGTHS.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 6 }}>风格</label>
                <select value={style} onChange={e => setStyle(e.target.value)} style={selectStyle}>
                  <option value="">不限风格</option>
                  {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 6 }}>额外要求（选填）</label>
              <textarea value={extraNote} onChange={e => setExtraNote(e.target.value)} rows={2} placeholder="例如：主角叫小月，结局要开心，语气要活泼..." style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: "9px 12px", borderRadius: 10, fontSize: 13, fontFamily: "inherit", resize: "none" }} />
            </div>

            {err && <div style={{ color: "#f87171", fontSize: 13, padding: "8px 12px", background: "rgba(248,113,113,0.08)", borderRadius: 8 }}>{err}</div>}

            <button onClick={generate} disabled={loading} style={{
              width: "100%", padding: 14, marginTop: "auto",
              background: loading ? "#2a2a3e" : "linear-gradient(135deg,#7c6ff7,#f06292)",
              border: "none", borderRadius: 12, color: "#fff", fontSize: 15,
              fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", opacity: loading ? 0.7 : 1, transition: "all 0.2s",
            }}>
              {loading ? "⏳ 创作中..." : "✨ 开始创作"}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-panel" style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 600 }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {output ? (mode === "novel" ? "📖 小说正文" : mode === "copy" ? "✍️ 文案内容" : mode === "script" ? "🎬 剧本内容" : "📱 种草内容") : "创作结果"}
              </div>
              {streaming && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: S.accent }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: S.accent, animation: "pulse 1s infinite" }} />
                  正在创作...
                </div>
              )}
            </div>
            {output && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: S.muted }}>{wordCount} 字</span>
                <CopyBtn text={output} />
              </div>
            )}
          </div>

          <div ref={outputRef} style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {!output && !loading && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: S.muted, gap: 16 }}>
                <div style={{ fontSize: 64, opacity: 0.15 }}>{mode === "novel" ? "📖" : mode === "copy" ? "✍️" : mode === "script" ? "🎬" : "📱"}</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, marginBottom: 6 }}>在左侧输入你的想法</div>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>AI 将为你生成完整内容</div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  {["灵感无限", "流畅输出", "一键复制"].map(t => (
                    <div key={t} style={{ fontSize: 12, color: S.accent, background: "rgba(124,111,247,0.08)", border: "1px solid rgba(124,111,247,0.15)", padding: "4px 12px", borderRadius: 100 }}>✦ {t}</div>
                  ))}
                </div>
              </div>
            )}

            {loading && !output && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, border: `3px solid ${S.border}`, borderTopColor: S.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <div style={{ fontSize: 14, color: S.muted }}>AI 正在构思创作...</div>
              </div>
            )}

            {output && (
              <div style={{ animation: "fadeIn 0.3s ease", lineHeight: 2, fontSize: 15, whiteSpace: "pre-wrap", wordBreak: "break-word", color: S.text }}>
                {output}
                {streaming && <span style={{ display: "inline-block", width: 2, height: "1em", background: S.accent, marginLeft: 2, animation: "pulse 0.8s infinite", verticalAlign: "text-bottom" }} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
