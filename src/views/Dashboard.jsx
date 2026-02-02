import React from 'react';
import { Layout, PlusCircle, Loader2 } from 'lucide-react';

export default function Dashboard({ chapters, loading, onCreate, onOpen }) {
  
 
  const handleCreateClick = () => {

    const title = window.prompt("Enter the name for the new pipeline:");
    
    if (title && title.trim()) {
      onCreate(title); 
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section className="space-y-6">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Layout size={14}/> Active Protocols
          </h3>
          
          {/* ✅ onClick/disabled*/}
          <button 
            onClick={handleCreateClick} 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:scale-105 shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={14}/> : <PlusCircle size={14}/>} New Pipeline
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {chapters.map(ch => (
             <div 
               key={ch.id} 
               onClick={() => onOpen(ch.id)} 
               className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
             >
                <div className={`absolute top-0 right-0 px-4 py-1 text-[8px] font-black uppercase tracking-widest ${ch.consent_status === 'AGREED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {ch.consent_status}
                </div>
                
                <h4 className="font-bold text-lg text-slate-800 uppercase mb-4 group-hover:text-pink-500">
                  {ch.title}
                </h4>
                
                <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden mb-2">
                  <div style={{ width: `${ch.progress}%` }} className="bg-blue-400 h-full transition-all duration-1000"></div>
                </div>
                
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                  {ch.progress}% Completion
                </p>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}