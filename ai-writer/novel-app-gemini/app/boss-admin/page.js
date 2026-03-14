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
            style={{ width: "100%", padding: "12px", background: "#222", border: "1px solid #444", color: "#fff", borderRadius: "8px", outline
