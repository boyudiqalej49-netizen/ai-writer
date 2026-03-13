"use client";
import { useState, useRef } from "react";
 
const TRANSLATIONS = {
  zh: {
    name: "简体中文",
    badge: "✦ AI创作工坊",
    title1: "一键生成",
    title2: "小说 · 文案",
    subtitle: "输入想法，AI帮你写出完整内容",
    modeLabel: "创作类型",
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
    genreLabel: "题材类型",
    copyTypeLabel: "文案类型",
    postLabel: "目标平台",
    genres: ["言情", "悬疑", "玄幻", "都市", "历史", "科幻", "恐怖", "励志"],
    copyTypes: ["产品推广", "品牌故事", "活动营销", "朋友圈", "广告语", "软文"],
    postTypes: ["小红书", "抖音", "微信公众号", "微博", "视频号"],
    lengthLabel: "字数",
    styleLabel: "风格",
    extraLabel: "额外要求（选填）",
    extraPlaceholder: "例如：主角叫小月，结局要开心，语气要活泼...",
    lengths: [
      { v: "short", l: "短篇（500字）" },
      { v: "medium", l: "中篇（1500字）" },
      { v: "long", l: "长篇（3000字）" },
    ],
    styles: ["正式严肃", "轻松幽默", "文艺感性", "犀利直接", "温暖治愈", "悬疑紧张"],
    styleDefault: "不限风格",
    btnGenerate: "✨ 开始创作",
    btnGenerating: "⏳ 创作中...",
    btnCopy: "复制全文",
    btnCopied: "✓ 已复制",
    resultLabel: "创作结果",
    resultLabels: { novel: "📖 小说正文", copy: "✍️ 文案内容", script: "🎬 剧本内容", post: "📱 种草内容" },
    streaming: "正在创作...",
    placeholder1: "在左侧输入你的想法",
    placeholder2: "AI 将为你生成完整内容",
    tags: ["灵感无限", "流畅输出", "一键复制"],
    thinking: "AI 正在构思创作...",
    errEmpty: "请输入你的想法或创意",
    errFail: "生成失败：",
    errRetry: "请求失败，请稍后重试",
    lengthMap: { short: "500字左右", medium: "1500字左右", long: "3000字左右" },
    systemPrompts: {
      novel: "你是一位顶级小说作家，擅长各类题材。文字生动、情节紧凑、人物立体。直接输出小说正文，不要加任何说明或前缀。",
      copy: "你是顶级文案策划师，擅长各类营销文案。文案有感染力、转化率高。直接输出文案正文。",
      script: "你是专业编剧，擅长对话、场景、冲突。剧本真实有张力。直接输出剧本内容。",
      post: "你是自媒体爆款文案专家，深度了解小红书、抖音平台和用户心理。直接输出内容正文。",
    },
    userPrompts: {
      novel: (idea, sel, len, style, extra) => `根据以下想法，创作一篇完整小说。\n\n想法：${idea}\n题材：${sel||"不限"}\n字数：${len}\n风格：${style||"不限"}\n要求：${extra||"无"}\n\n直接从标题开始输出小说内容，要有吸引人的开头、起伏的情节、有力量的结尾。`,
      copy: (idea, sel, len, style, extra) => `根据以下需求，创作专业文案。\n\n需求：${idea}\n类型：${sel||"通用推广"}\n字数：${len}\n风格：${style||"不限"}\n要求：${extra||"无"}\n\n要求标题吸引眼球、痛点精准、卖点突出、有行动引导。`,
      script: (idea, sel, len, style, extra) => `根据以下想法创作剧本。\n\n故事：${idea}\n风格：${sel||"不限"}\n长度：${len}\n风格：${style||"不限"}\n要求：${extra||"无"}\n\n格式：场景说明 + 人物对话（角色名：台词）+ 动作指示，有明确的戏剧冲突。`,
      post: (idea, sel, len, style, extra) => `根据以下想法创作爆款自媒体内容。\n\n内容：${idea}\n平台：${sel||"小红书"}\n字数：${len}\n风格：${style||"不限"}\n要求：${extra||"无"}\n\n要求：开头3行抓眼球、多用换行和emoji、有干货或情感共鸣、结尾引导互动、附上5个话题标签。`,
    },
  },
  tw: {
    name: "繁體中文",
    badge: "✦ AI創作工坊",
    title1: "一鍵生成",
    title2: "小說 · 文案",
    subtitle: "輸入想法，AI幫你寫出完整內容",
    modeLabel: "創作類型",
    modes: [
      { id: "novel", label: "📖 小說", desc: "完整故事情節" },
      { id: "copy", label: "✍️ 文案", desc: "行銷推廣文字" },
      { id: "script", label: "🎬 劇本", desc: "對話場景腳本" },
      { id: "post", label: "📱 種草", desc: "社群媒體文案" },
    ],
    ideaLabel: "💡 你的想法 *",
    ideaPlaceholders: {
      novel: "例如：一個失憶偵探發現自己就是兇手...",
      copy: "例如：主打成分護膚的精華液，目標用戶25-35歲女性...",
      script: "例如：兩個多年未見的老友重逢，發現彼此都變了...",
      post: "例如：用番茄工作法讓效率翻倍的親身經歷...",
    },
    genreLabel: "題材類型",
    copyTypeLabel: "文案類型",
    postLabel: "目標平台",
    genres: ["言情", "懸疑", "玄幻", "都市", "歷史", "科幻", "恐怖", "勵志"],
    copyTypes: ["產品推廣", "品牌故事", "活動行銷", "社群貼文", "廣告語", "軟文"],
    postTypes: ["Instagram", "Facebook", "YouTube", "TikTok", "Threads"],
    lengthLabel: "字數",
    styleLabel: "風格",
    extraLabel: "額外要求（選填）",
    extraPlaceholder: "例如：主角叫小月，結局要開心，語氣要活潑...",
    lengths: [
      { v: "short", l: "短篇（500字）" },
      { v: "medium", l: "中篇（1500字）" },
      { v: "long", l: "長篇（3000字）" },
    ],
    styles: ["正式嚴肅", "輕鬆幽默", "文藝感性", "犀利直接", "溫暖療癒", "懸疑緊張"],
    styleDefault: "不限風格",
    btnGenerate: "✨ 開始創作",
    btnGenerating: "⏳ 創作中...",
    btnCopy: "複製全文",
    btnCopied: "✓ 已複製",
    resultLabel: "創作結果",
    resultLabels: { novel: "📖 小說正文", copy: "✍️ 文案內容", script: "🎬 劇本內容", post: "📱 種草內容" },
    streaming: "正在創作...",
    placeholder1: "在左側輸入你的想法",
    placeholder2: "AI 將為你生成完整內容",
    tags: ["靈感無限", "流暢輸出", "一鍵複製"],
    thinking: "AI 正在構思創作...",
    errEmpty: "請輸入你的想法或創意",
    errFail: "生成失敗：",
    errRetry: "請求失敗，請稍後重試",
    lengthMap: { short: "500字左右", medium: "1500字左右", long: "3000字左右" },
    systemPrompts: {
      novel: "你是一位頂級小說作家，擅長各類題材。文字生動、情節緊湊、人物立體。直接輸出小說正文，不要加任何說明或前綴。",
      copy: "你是頂級文案策劃師，擅長各類行銷文案。文案有感染力、轉化率高。直接輸出文案正文。",
      script: "你是專業編劇，擅長對話、場景、衝突。劇本真實有張力。直接輸出劇本內容。",
      post: "你是社群媒體爆款文案專家，深度了解各平台和用戶心理。直接輸出內容正文。",
    },
    userPrompts: {
      novel: (idea, sel, len, style, extra) => `根據以下想法，創作一篇完整小說。\n\n想法：${idea}\n題材：${sel||"不限"}\n字數：${len}\n風格：${style||"不限"}\n要求：${extra||"無"}\n\n直接從標題開始輸出小說內容，要有吸引人的開頭、起伏的情節、有力量的結尾。`,
      copy: (idea, sel, len, style, extra) => `根據以下需求，創作專業文案。\n\n需求：${idea}\n類型：${sel||"通用推廣"}\n字數：${len}\n風格：${style||"不限"}\n要求：${extra||"無"}\n\n要求標題吸引眼球、痛點精準、賣點突出、有行動引導。`,
      script: (idea, sel, len, style, extra) => `根據以下想法創作劇本。\n\n故事：${idea}\n風格：${sel||"不限"}\n長度：${len}\n風格：${style||"不限"}\n要求：${extra||"無"}\n\n格式：場景說明 + 人物對話（角色名：台詞）+ 動作指示，有明確的戲劇衝突。`,
      post: (idea, sel, len, style, extra) => `根據以下想法創作爆款社群內容。\n\n內容：${idea}\n平台：${sel||"Instagram"}\n字數：${len}\n風格：${style||"不限"}\n要求：${extra||"無"}\n\n要求：開頭3行抓眼球、多用換行和emoji、有乾貨或情感共鳴、結尾引導互動、附上5個話題標籤。`,
    },
  },
  en: {
    name: "English",
    badge: "✦ AI Writer Studio",
    title1: "Generate Instantly",
    title2: "Stories · Copies",
    subtitle: "Enter your idea, AI writes the full content",
    modeLabel: "Content Type",
    modes: [
      { id: "novel", label: "📖 Story", desc: "Full narrative" },
      { id: "copy", label: "✍️ Copywriting", desc: "Marketing content" },
      { id: "script", label: "🎬 Script", desc: "Dialogue & scenes" },
      { id: "post", label: "📱 Social Post", desc: "Instagram / TikTok" },
    ],
    ideaLabel: "💡 Your Idea *",
    ideaPlaceholders: {
      novel: "e.g. An amnesiac detective discovers he is the murderer...",
      copy: "e.g. A serum targeting skincare ingredients, for women 25-35...",
      script: "e.g. Two old friends reunite and realize they've both changed...",
      post: "e.g. How the Pomodoro technique doubled my productivity...",
    },
    genreLabel: "Genre",
    copyTypeLabel: "Copy Type",
    postLabel: "Platform",
    genres: ["Romance", "Mystery", "Fantasy", "Urban", "Historical", "Sci-Fi", "Horror", "Inspirational"],
    copyTypes: ["Product Promo", "Brand Story", "Event Marketing", "Social Post", "Tagline", "Native Ad"],
    postTypes: ["Instagram", "TikTok", "Twitter/X", "Facebook", "LinkedIn"],
    lengthLabel: "Length",
    styleLabel: "Style",
    extraLabel: "Extra Notes (Optional)",
    extraPlaceholder: "e.g. The hero's name is Alex, happy ending, upbeat tone...",
    lengths: [
      { v: "short", l: "Short (~300 words)" },
      { v: "medium", l: "Medium (~800 words)" },
      { v: "long", l: "Long (~1500 words)" },
    ],
    styles: ["Formal", "Casual & Funny", "Literary", "Sharp & Direct", "Warm & Cozy", "Suspenseful"],
    styleDefault: "Any Style",
    btnGenerate: "✨ Generate",
    btnGenerating: "⏳ Writing...",
    btnCopy: "Copy All",
    btnCopied: "✓ Copied",
    resultLabel: "Result",
    resultLabels: { novel: "📖 Story", copy: "✍️ Copy", script: "🎬 Script", post: "📱 Post" },
    streaming: "Writing...",
    placeholder1: "Enter your idea on the left",
    placeholder2: "AI will generate full content for you",
    tags: ["Endless Ideas", "Smooth Output", "One-Click Copy"],
    thinking: "AI is thinking...",
    errEmpty: "Please enter your idea or topic",
    errFail: "Generation failed: ",
    errRetry: "Request failed, please try again",
    lengthMap: { short: "around 300 words", medium: "around 800 words", long: "around 1500 words" },
    systemPrompts: {
      novel: "You are a top-tier fiction writer skilled in all genres. Write vivid prose with compelling plots and well-rounded characters. Output only the story text, no explanations or prefixes.",
      copy: "You are a world-class copywriter with expertise in marketing. Write persuasive, high-converting copy. Output only the copy text.",
      script: "You are a professional screenwriter skilled in dialogue, scenes, and conflict. Write realistic, gripping scripts. Output only the script.",
      post: "You are a viral social media content expert who understands platform psychology deeply. Output only the post content.",
    },
    userPrompts: {
      novel: (idea, sel, len, style, extra) => `Write a complete story based on the following.\n\nIdea: ${idea}\nGenre: ${sel||"Any"}\nLength: ${len}\nStyle: ${style||"Any"}\nNotes: ${extra||"None"}\n\nStart directly with the title and story. Include a compelling opening, rising action, and a powerful ending.`,
      copy: (idea, sel, len, style, extra) => `Write professional marketing copy based on the following.\n\nBrief: ${idea}\nType: ${sel||"General Promo"}\nLength: ${len}\nStyle: ${style||"Any"}\nNotes: ${extra||"None"}\n\nRequirements: eye-catching headline, precise pain points, clear benefits, strong call to action.`,
      script: (idea, sel, len, style, extra) => `Write a script based on the following.\n\nStory: ${idea}\nGenre: ${sel||"Any"}\nLength: ${len}\nStyle: ${style||"Any"}\nNotes: ${extra||"None"}\n\nFormat: scene descriptions + character dialogue (CHARACTER NAME: dialogue) + stage directions, with clear dramatic conflict.`,
      post: (idea, sel, len, style, extra) => `Write a viral social media post based on the following.\n\nContent: ${idea}\nPlatform: ${sel||"Instagram"}\nLength: ${len}\nStyle: ${style||"Any"}\nNotes: ${extra||"None"}\n\nRequirements: hook in first 3 lines, use line breaks and emojis, include value or emotional resonance, end with engagement CTA, add 5 relevant hashtags.`,
    },
  },
  id: {
    name: "Indonesia",
    badge: "✦ Studio Penulis AI",
    title1: "Buat Sekarang",
    title2: "Cerita · Konten",
    subtitle: "Masukkan ide, AI menulis konten lengkap untuk Anda",
    modeLabel: "Jenis Konten",
    modes: [
      { id: "novel", label: "📖 Cerita", desc: "Narasi lengkap" },
      { id: "copy", label: "✍️ Copywriting", desc: "Konten pemasaran" },
      { id: "script", label: "🎬 Skrip", desc: "Dialog & adegan" },
      { id: "post", label: "📱 Postingan", desc: "Instagram / TikTok" },
    ],
    ideaLabel: "💡 Ide Anda *",
    ideaPlaceholders: {
      novel: "mis. Seorang detektif amnesia menemukan bahwa dirinya sendiri adalah pembunuhnya...",
      copy: "mis. Serum perawatan kulit berbahan aktif, target wanita 25-35 tahun...",
      script: "mis. Dua sahabat lama bertemu kembali dan menyadari keduanya telah berubah...",
      post: "mis. Bagaimana teknik Pomodoro menggandakan produktivitas saya...",
    },
    genreLabel: "Genre",
    copyTypeLabel: "Jenis Copy",
    postLabel: "Platform",
    genres: ["Romantis", "Misteri", "Fantasi", "Urban", "Sejarah", "Sci-Fi", "Horor", "Inspiratif"],
    copyTypes: ["Promosi Produk", "Kisah Brand", "Pemasaran Event", "Postingan Sosial", "Tagline", "Native Ad"],
    postTypes: ["Instagram", "TikTok", "Twitter/X", "Facebook", "YouTube"],
    lengthLabel: "Panjang",
    styleLabel: "Gaya",
    extraLabel: "Catatan Tambahan (Opsional)",
    extraPlaceholder: "mis. Nama tokoh utama Alex, akhir bahagia, nada ceria...",
    lengths: [
      { v: "short", l: "Pendek (~300 kata)" },
      { v: "medium", l: "Sedang (~800 kata)" },
      { v: "long", l: "Panjang (~1500 kata)" },
    ],
    styles: ["Formal", "Santai & Lucu", "Sastrawi", "Tajam & Langsung", "Hangat & Nyaman", "Menegangkan"],
    styleDefault: "Gaya Bebas",
    btnGenerate: "✨ Buat Konten",
    btnGenerating: "⏳ Sedang menulis...",
    btnCopy: "Salin Semua",
    btnCopied: "✓ Tersalin",
    resultLabel: "Hasil",
    resultLabels: { novel: "📖 Cerita", copy: "✍️ Copy", script: "🎬 Skrip", post: "📱 Postingan" },
    streaming: "Sedang menulis...",
    placeholder1: "Masukkan ide Anda di sebelah kiri",
    placeholder2: "AI akan membuat konten lengkap untuk Anda",
    tags: ["Ide Tak Terbatas", "Output Lancar", "Salin Sekali Klik"],
    thinking: "AI sedang berpikir...",
    errEmpty: "Harap masukkan ide atau topik Anda",
    errFail: "Pembuatan gagal: ",
    errRetry: "Permintaan gagal, silakan coba lagi",
    lengthMap: { short: "sekitar 300 kata", medium: "sekitar 800 kata", long: "sekitar 1500 kata" },
    systemPrompts: {
      novel: "Anda adalah penulis fiksi kelas dunia yang ahli di semua genre. Tulis prosa yang vivid dengan alur yang menarik dan karakter yang kuat. Output hanya teks cerita, tanpa penjelasan atau awalan.",
      copy: "Anda adalah copywriter kelas dunia dengan keahlian pemasaran. Tulis copy yang persuasif dan berkonversi tinggi. Output hanya teks copy.",
      script: "Anda adalah penulis skenario profesional yang ahli dalam dialog, adegan, dan konflik. Tulis skrip yang realistis dan mencekam. Output hanya skrip.",
      post: "Anda adalah pakar konten media sosial viral yang memahami psikologi platform. Output hanya konten postingan.",
    },
    userPrompts: {
      novel: (idea, sel, len, style, extra) => `Tulis cerita lengkap berdasarkan berikut ini.\n\nIde: ${idea}\nGenre: ${sel||"Bebas"}\nPanjang: ${len}\nGaya: ${style||"Bebas"}\nCatatan: ${extra||"Tidak ada"}\n\nMulai langsung dengan judul dan cerita. Sertakan pembuka yang menarik, konflik yang membangun, dan akhir yang berkesan.`,
      copy: (idea, sel, len, style, extra) => `Tulis copy pemasaran profesional berdasarkan berikut ini.\n\nBrief: ${idea}\nJenis: ${sel||"Promosi Umum"}\nPanjang: ${len}\nGaya: ${style||"Bebas"}\nCatatan: ${extra||"Tidak ada"}\n\nPersyaratan: judul yang menarik perhatian, pain point yang tepat, manfaat yang jelas, call to action yang kuat.`,
      script: (idea, sel, len, style, extra) => `Tulis skrip berdasarkan berikut ini.\n\nCerita: ${idea}\nGenre: ${sel||"Bebas"}\nPanjang: ${len}\nGaya: ${style||"Bebas"}\nCatatan: ${extra||"Tidak ada"}\n\nFormat: deskripsi adegan + dialog karakter (NAMA KARAKTER: dialog) + petunjuk aksi, dengan konflik dramatis yang jelas.`,
      post: (idea, sel, len, style, extra) => `Tulis postingan media sosial viral berdasarkan berikut ini.\n\nKonten: ${idea}\nPlatform: ${sel||"Instagram"}\nPanjang: ${len}\nGaya: ${style||"Bebas"}\nCatatan: ${extra||"Tidak ada"}\n\nPersyaratan: hook di 3 baris pertama, gunakan baris baru dan emoji, sertakan nilai atau resonansi emosional, akhiri dengan CTA engagement, tambahkan 5 hashtag relevan.`,
    },
  },
};
 
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
 
function CopyBtn({ text, t }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <button onClick={copy} style={{
      background: done ? "rgba(52,211,153,0.1)" : "rgba(124,111,247,0.1)",
      color: done ? S.success : S.accent,
      padding: "7px 18px", borderRadius: 8, fontSize: 13,
      cursor: "pointer", fontFamily: "inherit", border: "none",
      fontWeight: 500, transition: "all 0.2s",
    }}>{done ? t.btnCopied : t.btnCopy}</button>
  );
}
 
const LANG_FLAGS = { zh: "🇨🇳", tw: "🇹🇼", en: "🇺🇸", id: "🇮🇩" };
 
export default function Home() {
  const [lang, setLang] = useState("zh");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = TRANSLATIONS[lang];
 
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
 
    const lenLabel = t.lengthMap[length];
    const currentSel = mode === "novel" || mode === "script" ? genre : copyType;
 
    try {
      setStreaming(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: t.systemPrompts[mode],
          user: t.userPrompts[mode](idea, currentSel, lenLabel, style, extraNote),
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
    } catch (e) {
      setErr(t.errFail + e.message);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };
 
  const currentTags = mode === "novel" || mode === "script" ? t.genres : t.copyTypes;
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
        textarea:focus, select:focus { outline: none !important; border-color: #7c6ff7 !important; box-shadow: 0 0 0 3px rgba(124,111,247,0.15) !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #2d2d45; border-radius: 3px; }
        @media (max-width: 768px) {
          .layout { grid-template-columns: 1fr !important; }
          .right-panel { min-height: 400px !important; }
        }
      `}</style>
 
      {/* Language Switcher */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 100 }}>
        <button onClick={() => setShowLangMenu(!showLangMenu)} style={{
          background: S.card, border: `1px solid ${S.border}`, color: S.text,
          padding: "8px 14px", borderRadius: 10, cursor: "pointer",
          fontFamily: "inherit", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
        }}>
          {LANG_FLAGS[lang]} {t.name} ▾
        </button>
        {showLangMenu && (
          <div style={{
            position: "absolute", top: "110%", right: 0,
            background: S.card, border: `1px solid ${S.border}`,
            borderRadius: 10, overflow: "hidden", minWidth: 160,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}>
            {Object.entries(TRANSLATIONS).map(([key, val]) => (
              <button key={key} onClick={() => { setLang(key); setShowLangMenu(false); }} style={{
                width: "100%", padding: "10px 16px", background: lang === key ? "rgba(124,111,247,0.15)" : "transparent",
                border: "none", color: lang === key ? S.accent : S.text,
                cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                textAlign: "left", display: "flex", alignItems: "center", gap: 10,
              }}>
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
            <div style={{ display: "inline-block", background: "rgba(124,111,247,0.1)", border: "1px solid rgba(124,111,247,0.3)", color: S.accent, fontSize: 11, letterSpacing: 2, padding: "4px 14px", borderRadius: 100, marginBottom: 10 }}>{t.badge}</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.2, marginBottom: 4 }}>
              {t.title1}<br />
              <span style={{ background: "linear-gradient(135deg,#7c6ff7,#f06292)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.title2}</span>
            </h1>
            <p style={{ fontSize: 12, color: S.muted }}>{t.subtitle}</p>
          </div>
 
          <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 11, color: S.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{t.modeLabel}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {t.modes.map(m => (
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
 
          <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 6 }}>{t.ideaLabel}</label>
              <textarea value={idea} onChange={e => setIdea(e.target.value)} rows={4}
                placeholder={t.ideaPlaceholders[mode]}
                style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }} />
            </div>
 
            <div>
              <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 8 }}>
                {mode === "novel" || mode === "script" ? t.genreLabel : mode === "post" ? t.postLabel : t.copyTypeLabel}
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(mode === "post" ? t.postTypes : currentTags).map(tag => (
                  <Tag key={tag} label={tag} active={currentSel === tag} onClick={() => setCurrentSel(currentSel === tag ? "" : tag)} />
                ))}
              </div>
            </div>
 
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 6 }}>{t.lengthLabel}</label>
                <select value={length} onChange={e => setLength(e.target.value)} style={selectStyle}>
                  {t.lengths.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 6 }}>{t.styleLabel}</label>
                <select value={style} onChange={e => setStyle(e.target.value)} style={selectStyle}>
                  <option value="">{t.styleDefault}</option>
                  {t.styles.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
 
            <div>
              <label style={{ fontSize: 12, color: S.muted, display: "block", marginBottom: 6 }}>{t.extraLabel}</label>
              <textarea value={extraNote} onChange={e => setExtraNote(e.target.value)} rows={2}
                placeholder={t.extraPlaceholder}
                style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, color: S.text, padding: "9px 12px", borderRadius: 10, fontSize: 13, fontFamily: "inherit", resize: "none" }} />
            </div>
 
            {err && <div style={{ color: "#f87171", fontSize: 13, padding: "8px 12px", background: "rgba(248,113,113,0.08)", borderRadius: 8 }}>{err}</div>}
 
            <button onClick={generate} disabled={loading} style={{
              width: "100%", padding: 14, marginTop: "auto",
              background: loading ? "#2a2a3e" : "linear-gradient(135deg,#7c6ff7,#f06292)",
              border: "none", borderRadius: 12, color: "#fff", fontSize: 15,
              fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", opacity: loading ? 0.7 : 1, transition: "all 0.2s",
            }}>
              {loading ? t.btnGenerating : t.btnGenerate}
            </button>
          </div>
        </div>
 
        {/* RIGHT */}
        <div className="right-panel" style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 600 }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {output ? t.resultLabels[mode] : t.resultLabel}
              </div>
              {streaming && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: S.accent }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: S.accent, animation: "pulse 1s infinite" }} />
                  {t.streaming}
                </div>
              )}
            </div>
            {output && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: S.muted }}>{wordCount} {lang === "en" || lang === "id" ? "words" : "字"}</span>
                <CopyBtn text={output} t={t} />
              </div>
            )}
          </div>
 
          <div ref={outputRef} style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {!output && !loading && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: S.muted, gap: 16 }}>
                <div style={{ fontSize: 64, opacity: 0.15 }}>{mode === "novel" ? "📖" : mode === "copy" ? "✍️" : mode === "script" ? "🎬" : "📱"}</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, marginBottom: 6 }}>{t.placeholder1}</div>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>{t.placeholder2}</div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  {t.tags.map(tag => (
                    <div key={tag} style={{ fontSize: 12, color: S.accent, background: "rgba(124,111,247,0.08)", border: "1px solid rgba(124,111,247,0.15)", padding: "4px 12px", borderRadius: 100 }}>✦ {tag}</div>
                  ))}
                </div>
              </div>
            )}
 
            {loading && !output && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, border: `3px solid ${S.border}`, borderTopColor: S.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <div style={{ fontSize: 14, color: S.muted }}>{t.thinking}</div>
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
 
