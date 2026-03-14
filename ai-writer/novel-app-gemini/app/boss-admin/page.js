"use client";
import { useState } from "react";

export default function AdminMaker() {
  const [pwd, setPwd] = useState("");
  const [type, setType] = useState("limited");
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resultCdk, setResultCdk] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!pwd) { setError("请输入管理员密码！"); return; }
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
        setError(data.error || "生成失败");
      }
    } catch (err) {
      setError("网络请求失败");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultCdk);
    alert("卡密已复制，快发给客户吧！");
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ background: "#111", border: "1px solid #333", padding: "40px", borderRadius: "16px", width: "360px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "8px", color: "#7c6ff7" }}>💎 专属发卡控制台</h2>
        <p style={{ textAlign: "center", fontSize: "12px", color: "#666", marginBottom: "24px" }}>禁止外泄此页面地址</p>

        {/* 密码输入 */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: "#aaa", marginBottom: "6px", display: "block" }}>制卡密码</label>
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="输入老板密码" 
            style={{ width: "100%", padding: "12px", background: "#222", border: "1px solid #444", color: "#fff", borderRadius: "8px", outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* 类型选择 */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: "#aaa", marginBottom: "6px", display: "block" }}>卡密类型</label>
          <select value={type} onChange={(e) => setType(e.target.value)}
            style={{ width: "100%", padding: "12px", background: "#222", border: "1px solid #444", color: "#fff", borderRadius: "8px", outline: "none", boxSizing: "border-box", appearance: "none" }}>
            <option value="limited">限时月卡 / 体验卡</option>
            <option value="permanent">永久至尊卡</option>
          </select>
        </div>

        {/* 天数输入 (只有限时卡才显示) */}
        {type === "limited" && (
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "12px", color: "#aaa", marginBottom: "6px", display: "block" }}>有效天数</label>
            <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} min="1"
              style={{ width: "100%", padding: "12px", background: "#222", border: "1px solid #444", color: "#fff", borderRadius: "8px", outline: "none", boxSizing: "border-box" }} />
          </div>
        )}

        {error && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px", textAlign: "center", background: "rgba(239,68,68,0.1)", padding: "8px", borderRadius: "8px" }}>{error}</div>}

        <button onClick={handleGenerate} disabled={loading}
          style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#7c6ff7,#f06292)", border: "none", color: "#fff", fontWeight: "bold", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "正在连线数据库..." : "✨ 立即生成卡密"}
        </button>

        {/* 结果展示区 */}
        {resultCdk && (
          <div style={{ marginTop: "24px", padding: "16px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: "#34d399", marginBottom: "8px" }}>生成成功！</div>
            <div style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "1px", color: "#fff", marginBottom: "12px", fontFamily: "monospace" }}>{resultCdk}</div>
            <button onClick={copyToClipboard} style={{ background: "#34d399", color: "#000", border: "none", padding: "6px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
              一键复制
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
