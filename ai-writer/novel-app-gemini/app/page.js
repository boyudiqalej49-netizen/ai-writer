'use client'
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    // 检查是否有我们刚才在 middleware 里发的“通行证”
    const hasToken = document.cookie.includes('user_access_token=is_valid');
    setIsActivated(hasToken);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d14', color: '#eeeef5', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 顶部状态条 */}
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '16px 20px', backgroundColor: '#161620', borderRadius: '16px', border: '1px solid #2a2a35' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap color="#facc15" size={24} />
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>AI 智能写手</span>
        </div>
        
        {isActivated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '14px', backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
            <ShieldCheck size={16} />
            <b>专业版已激活</b>
          </div>
        )}
      </div>

      {/* 写作主区域 */}
      <div style={{ maxWidth: '800px', margin: '80px auto 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '2px' }}>开始您的创作</h1>
        <p style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '40px' }}>基于最新 AI 模型，为您提供专业写作支持</p>
        
        <textarea 
          placeholder="在此输入您的灵感..."
          style={{ width: '100%', height: '280px', backgroundColor: '#161620', border: '1px solid #2a2a35', borderRadius: '16px', padding: '24px', outline: 'none', color: '#fff', fontSize: '16px', resize: 'none', boxSizing: 'border-box', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
        />
        
        <button 
          style={{ marginTop: '30px', padding: '16px 48px', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '18px', transition: '0.2s' }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e5e5e5'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
        >
          立即生成内容
        </button>
      </div>

    </div>
  );
}
