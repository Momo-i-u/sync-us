import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import logo from './logo.png'; 

export default function LoginGate({ onAuth }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault(); 
    const envPassChunxiao = process.env.REACT_APP_PASS_CHUNXIAO;
    const envPassMax = process.env.REACT_APP_PASS_MAX;

    if (password === envPassChunxiao) {
      onAuth('PARTNER'); 
    } else if (password === envPassMax) {
      onAuth('PRIMARY'); 
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-6 font-sans select-none overflow-hidden">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-1000 relative z-10">
        
        <div className="flex flex-col items-center">
          
          {/* --- 高級感核心：重新設計的 Logo 展示區 --- */}
          {/* 增加 mb-24 让大 Logo 与输入框拉开距离，更显大气 */}
          <div className="relative mb-24 group">
            
            {/* Layer 1: 超大范围环境底光 (Atmospheric Glow) */}
            {/* 制造一种 Logo 发光照亮背景的感觉 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-100/30 blur-[120px] rounded-full opacity-60 pointer-events-none" />

            {/* Layer 2: 紧贴边缘的柔光光晕 (Halo Effect) */}
            <div className="absolute -inset-4 bg-gradient-to-b from-white/80 to-orange-50/20 blur-3xl rounded-[30%] opacity-80" />
            
            {/* Layer 3: 主容器 (The Jewel Case) */}
            {/* - 尺寸加大到 w-72 h-72 (288px)
               - 使用复合阴影：外部柔和长阴影 + 内部高光和环境光，制造陶瓷般的温润感
               - 边框极细且半透明，似有若无
            */}
            <div className="relative w-72 h-72 bg-[#FFFDF0] rounded-[26%] shadow-[0_30px_100px_-20px_rgba(184,163,141,0.2),inset_0_-2px_6px_rgba(0,0,0,0.02),inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center overflow-hidden border border-orange-100/40 transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]">
              {logo ? (
                <img 
                  src={logo} 
                  alt="Sync-Us Core" 
                  // 微调对比度，让画面更通透；悬停时极其缓慢地放大，增加呼吸感
                  className="w-full h-full object-cover scale-110 contrast-[1.03] transition-transform duration-[2000ms] ease-out group-hover:scale-[1.15]" 
                />
              ) : (
                <div className="w-full h-full bg-[#FFFDF0]" />
              )}
            </div>
          </div>

          {/* --- Input Section (保持不变，依然精致) --- */}
          <form onSubmit={handleLogin} className="w-full space-y-10 max-w-xs">
            <div className="relative group">
              <input 
                name="password"
                autoComplete="current-password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full bg-transparent border-b border-[#D6D0C7] py-4 text-center text-2xl font-light tracking-[0.6em] text-[#3C3835] focus:outline-none transition-all placeholder:text-[#D6D0C7]/70 placeholder:tracking-normal placeholder:font-extralight
                  ${error ? 'border-red-300 animate-shake text-red-400' : 'focus:border-[#3C3835]'}`}
                autoFocus
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#2D2A26] hover:bg-[#1A1816] text-[#FAF9F6]/90 p-5 rounded-full font-medium text-[11px] uppercase tracking-[0.4em] active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(45,42,38,0.2)] flex items-center justify-center gap-4 group overflow-hidden relative"
            >
              <span className="relative z-10">Authenticate</span>
              <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform opacity-30"/>
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}