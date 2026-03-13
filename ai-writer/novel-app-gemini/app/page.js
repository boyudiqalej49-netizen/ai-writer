'use client'
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    // 检查是否有授权 Cookie
    const hasToken = document.cookie.includes('user_access_token=is_valid');
    setIsActivated(hasToken);
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0d14] text-[#eeeef5] p-4 font-sans">
      {/* 顶部状态条 */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8 p-4 bg-[#161620] rounded-2xl border border-[#2a2a35]">
        <div className="flex items-center gap-2">
          <Zap className="text-yellow-400 w-5 h-5" />
          <span className="font-bold text-lg">AI 智能写手</span>
        </div>
        
        {isActivated && (
          <div className="flex items-center gap-1 text-green-400 text-sm bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
            <ShieldCheck size={16} />
            专业版已激活
          </div>
        )}
      </div>

      {/* 写作主区域 (这里保持你原来的写作逻辑即可) */}
      <div className="max-w-4xl mx-auto text-center mt-20">
        <h1 className="text-4xl font-bold mb-4">开始您的创作</h1>
        <p className="text-gray-400 mb-8">基于最新 AI 模型，为您提供专业写作支持</p>
        
        <textarea 
          placeholder="在此输入您的灵感..."
          className="w-full h-64 bg-[#161620] border border-[#2a2a35] rounded-2xl p-6 outline-none focus:border-blue-500 transition-all resize-none"
        />
        
        <button className="mt-6 px-10 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
          立即生成内容
        </button>
      </div>
    </main>
  );
}
