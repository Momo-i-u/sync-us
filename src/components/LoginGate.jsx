import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginGate({ onAuth }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    // 🛑 Prevent page refresh
    e.preventDefault(); 
    
    // 1. Get passwords securely from Environment Variables
    // (These are loaded from your local .env file during build)
    const envPassChunxiao = process.env.REACT_APP_PASS_CHUNXIAO;
    const envPassMax = process.env.REACT_APP_PASS_MAX;

    // 2. Auth Logic (Updated Mapping)
    // Chunxiao uses Max779911
    if (password === envPassChunxiao) {
      console.log("✅ Login Success: Chunxiao");
      onAuth('PARTNER'); // Chunxiao's Role
    } 
    // Max uses cxz_022000
    else if (password === envPassMax) {
      console.log("✅ Login Success: Max");
      onAuth('PRIMARY'); // Max's Role
    } 
    else {
      console.error("❌ Login Failed");
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-white">
          
          <div className="text-center mb-10 space-y-4">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg rotate-3 hover:rotate-6 transition-transform">
              <Lock className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Sync-Us</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Secure Access Required</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative">
            <div className="relative group">
              {/* ✅ Includes id, name, autoComplete to fix warnings */}
              <input 
                id="access-code"
                name="password"
                autoComplete="current-password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Access Code"
                className={`w-full bg-slate-50 border-2 rounded-2xl p-4 text-center text-lg font-bold tracking-[0.5em] text-slate-800 focus:outline-none transition-all placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-normal ${error ? 'border-red-400 bg-red-50 animate-pulse' : 'border-slate-100 focus:border-slate-900 focus:bg-white'}`}
                autoFocus
              />
              {error && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400">
                  <AlertCircle size={20} />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              Authenticate <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </form>
          
          <p className="text-center mt-8 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            End-to-End Encrypted Environment
          </p>
        </div>
      </div>
    </div>
  );
}