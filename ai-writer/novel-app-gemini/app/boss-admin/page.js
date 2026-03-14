"use client";
import { useState } from "react";

// 🌐 双语翻译库
const T = {
  zh: {
    title: "💎 专属发卡控制台",
    warning: "禁止外泄此页面地址",
    pwdLabel: "制卡密码",
    pwdPlaceholder: "输入老板密码",
    typeLabel: "卡密类型",
    typeLimited: "限时月卡 / 体验卡",
    typePermanent: "永久至尊卡",
    daysLabel: "有效天数",
    btnGenerate: "✨ 立即生成卡密",
    btnGenerating: "正在连线数据库...",
    errNoPwd: "请输入管理员密码！",
    errNetwork: "网络请求失败",
    successMsg: "生成成功！",
    btnCopy: "一键复制",
    alertCopy: "卡密已复制，快发给客户吧！",
    langSwitch: "🇮🇩 Switch to Indonesian"
  },
  id: {
    title: "💎 Konsol Admin VIP",
    warning: "Dilarang membagikan tautan halaman ini",
    pwdLabel: "Kata Sandi Admin",
    pwdPlaceholder: "Masukkan sandi bos",
    typeLabel: "Jenis Lisensi",
    typeLimited: "Lisensi Terbatas (Hari)",
    typePermanent: "Lisensi Permanen (VIP)",
    daysLabel: "Masa Berlaku (Hari)",
    btnGenerate: "✨ Buat Lisensi Sekarang",
    btnGenerating: "Menghubungkan ke database...",
    errNoPwd: "Harap masukkan kata sandi admin!",
    errNetwork: "Gagal terhubung ke jaringan",
    successMsg: "Lisensi Berhasil Dibuat!",
    btnCopy: "Salin Lisensi",
    alertCopy: "Lisensi disalin, silakan kirim ke pelanggan!",
    langSwitch: "🇨🇳 切换至中文"
  }
};

export default function AdminMaker() {
  const [lang, setLang] = useState("zh"); // 默认中文
  const [pwd, setPwd] = useState("");
  const [type, setType] = useState("limited");
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resultCdk, setResultCdk] = useState("");
  const [error, setError] = useState("");

  const t = T[lang];

  const handleGenerate = async () => {
    if (!pwd) { setError(t.errNoPwd); return; }
    setError(""); setResultCdk(""); setLoading(true);

    try {
      const res = await fetch("/api/maker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPwd: pwd, type, days: type === "limited" ? days : null })
      });
      
      const data = await res.json();
      if (data.success) {
        setResultCdk(data.cdk);
      } else {
        setError(data.error || "生成失败 / Gagal");
      }
    } catch (err) {
      setError(t.errNetwork);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultCdk);
    alert(t.alertCopy);
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", position: "relative" }}>
      
      {/* 🌐 语言切换按钮 (放在右上角) */}
      <button 
        onClick={() => setLang(lang === "zh" ? "id" : "zh")}
        style={{ position: "absolute", top: 20, right: 20, background: "#111", border: "1px solid #333", color: "#fff", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", transition: "all 0.2s" }}
      >
        {t.langSwitch}
      </button>

      <div style={{ background: "#111", border: "1px solid #333", padding: "40px", borderRadius: "16px", width: "360px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "8px", color: "#7c6ff7" }}>{t.title}</h2>
        <p style={{ textAlign: "center", fontSize: "12px", color: "#666", marginBottom: "24px" }}>{t.warning}</p>

        {/* 密码输入 */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: "#aaa", marginBottom: "6px", display: "block" }}>{t.pwdLabel}</label>
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder={t.pwdPlaceholder} 
            style={{ width: "100%", padding: "12px", background: "#222", border: "1px solid #444", color: "#fff", borderRadius: "8px", outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* 类型选择 */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: "#aaa", marginBottom: "6px", display: "block" }}>{t.typeLabel}</label>
          <select value={type} onChange={(e) => setType(e.target.value)}
            style={{ width: "100%", padding: "12px", background: "#222", border: "1px solid #444", color: "#fff", borderRadius: "8px", outline: "none", boxSizing: "border-box", appearance: "none" }}>
            <option value="limited">{t.typeLimited}</option>
            <option value="permanent">{t.typePermanent}</option>
          </select>
        </div>

        {/* 天数输入 (只有限时卡才显示) */}
        {type === "limited" && (
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "12px", color: "#aaa", marginBottom: "6px", display: "block" }}>{t.daysLabel}</label>
            <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} min="1"
              style={{ width: "100%", padding: "12px", background: "#222", border: "1px solid #444", color: "#fff", borderRadius: "8px", outline: "none", boxSizing: "border-box" }} />
          </div>
        )}

        {error && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px", textAlign: "center", background: "rgba(239,68,68,0.1)", padding: "8px", borderRadius: "8px" }}>{error}</div>}

        <button onClick={handleGenerate} disabled={loading}
          style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#7c6ff7,#f06292)", border: "none", color: "#fff", fontWeight: "bold", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? t.btnGenerating : t.btnGenerate}
        </button>

        {/* 结果展示区 */}
        {resultCdk && (
          <div style={{ marginTop: "24px", padding: "16px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: "#34d399", marginBottom: "8px" }}>{t.successMsg}</div>
            <div style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "1px", color: "#fff", marginBottom: "12px", fontFamily: "monospace" }}>{resultCdk}</div>
            <button onClick={copyToClipboard} style={{ background: "#34d399", color: "#000", border: "none", padding: "6px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
              {t.btnCopy}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// --- 代码结束 ---
