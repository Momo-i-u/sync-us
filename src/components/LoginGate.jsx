import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export default function LoginGate({ onAuth }) {
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.REACT_APP_PASS_CHUNXIAO) {
      onAuth('PRIMARY');
    } else if (password === process.env.REACT_APP_PASS_MAX) {
      onAuth('PARTNER');
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaff] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner ${isError ? 'bg-red-50' : 'bg-pink-50'}`}>
          <Lock className={isError ? "text-red-400" : "text-pink-400"} size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-8 text-center">Sync-Us Node</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Identity Secret..." 
            className="w-full bg-slate-50 border-none rounded-2xl p-5 text-center text-sm font-mono" 
          />
          <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">Establish Link</button>
        </form>
      </div>
    </div>
  );
}