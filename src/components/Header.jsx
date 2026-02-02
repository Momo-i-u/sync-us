import React from 'react';
import { Heart, LogOut } from 'lucide-react'; // 1. Added LogOut icon

export default function Header({ userRole, myStatus, partnerStatus, onStatusChange, currentView, setView, onLogout }) { // 2. Added onLogout prop
  const isPrimary = userRole === 'PRIMARY';
  
  return (
    <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
      
      {/* --- Section 1: Identity --- */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white shadow-xl rounded-3xl border border-pink-50">
          <Heart className="text-pink-400 fill-pink-400" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase tracking-[0.1em]">Sync-Us</h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${partnerStatus === 'SYNC' ? 'bg-blue-400' : partnerStatus === 'ALONE' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            {isPrimary ? "Max's Mode: " : "Chunxiao's Mode: "}
            {partnerStatus === 'SYNC' ? 'High Connection' : partnerStatus === 'ALONE' ? 'Protected Space' : 'Steady'}
          </p>
        </div>
      </div>

      {/* --- Section 2: Status Switcher --- */}
      <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1 border border-slate-100 shadow-inner">
        {['STEADY', 'ALONE', 'SYNC'].map((s) => (
          <button key={s} onClick={() => onStatusChange(s)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${myStatus === s ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* --- Section 3: Nav & Logout --- */}
      <div className="flex items-center gap-3">
        <nav className="flex bg-white/80 backdrop-blur-sm p-1.5 rounded-[2rem] shadow-sm border border-slate-100">
          {['DASHBOARD', 'STREAM', 'VAULT'].map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black tracking-widest transition-all ${currentView === v ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
              {v}
            </button>
          ))}
        </nav>

        {/*  Logout Button */}
        <button 
          onClick={onLogout}
          className="p-4 bg-white rounded-full border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
          title="Disconnect Session"
        >
          <LogOut size={18} />
        </button>
      </div>

    </header>
  );
}