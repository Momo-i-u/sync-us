import React, { useState } from 'react';
import { Send, Sparkles, Quote, Link as LinkIcon, Trash2, Loader2, Globe } from 'lucide-react';

export default function Stream({ items, onPost, onDelete, myId, userRole, loading }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onPost(input);
    setInput("");
  };

  // Logic to determine the partner's name based on current role
  const partnerName = userRole === 'PRIMARY' ? 'Chunxiao' : 'Max';

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- Input Section --- */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-100 to-blue-100 rounded-[2.6rem] blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
        <textarea 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share a research note or paste a link..."
          className="relative w-full bg-white/80 backdrop-blur-xl border-none rounded-[2.5rem] p-10 text-sm focus:ring-0 shadow-sm italic h-40 resize-none transition-all placeholder:text-slate-300"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="absolute bottom-8 right-8 p-5 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />}
        </button>
      </form>

      {/* --- Feed Section --- */}
      <div className="space-y-10">
        {items.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Archive Empty / Awaiting Sync</p>
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className={`group p-8 rounded-[3rem] bg-white border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${item.user_id === myId ? 'border-slate-50' : 'border-pink-50'}`}
            >
              {/* Header: Identity Label */}
              <div className="flex justify-between items-center mb-6 text-[9px] font-black uppercase tracking-widest text-slate-300">
                <span className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.user_id === myId ? 'bg-slate-300' : 'bg-pink-400 animate-pulse'}`} />
                  {item.user_id === myId ? 'Your Entry' : `${partnerName}'s Sync`}
                </span>
                <Sparkles size={14} className={item.preview_data ? "text-blue-400" : "text-slate-100"} />
              </div>

              {/* Content: Link Preview or Text */}
              {item.preview_data ? (
                <a 
                  href={item.preview_data.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex flex-col md:flex-row gap-8 group/link"
                >
                  {item.preview_data.image && (
                    <div className="w-full md:w-40 h-40 rounded-[2.5rem] overflow-hidden flex-shrink-0 shadow-lg border-4 border-white">
                      <img 
                        src={item.preview_data.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover group-hover/link:scale-110 transition-transform duration-700" 
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-3 py-2">
                    <h4 className="text-base font-black text-slate-800 group-hover/link:text-blue-600 transition-colors line-clamp-2 leading-tight">
                      {item.preview_data.title || "Untitled Resource"}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 italic">
                      {item.preview_data.description || "No description available for this encrypted node."}
                    </p>
                    <div className="pt-3 text-[10px] font-black text-blue-400 uppercase tracking-tighter flex items-center gap-2">
                      <Globe size={12} /> {new URL(item.preview_data.url).hostname}
                    </div>
                  </div>
                </a>
              ) : (
                <div className="relative py-4 px-2">
                  <Quote size={40} className="absolute -top-2 -left-6 text-slate-50 z-0" />
                  <p className="text-base text-slate-700 italic leading-relaxed relative z-10 tracking-tight font-medium">
                    {item.content}
                  </p>
                </div>
              )}

              {/* Footer: Metadata & Actions */}
              <div className="mt-10 pt-6 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                  {new Date(item.created_at).toLocaleDateString()} — {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button 
                  onClick={() => onDelete(item.id)} 
                  className="p-2 text-slate-100 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}