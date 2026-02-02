import React, { useState } from 'react';
import { Send, Sparkles, Quote, Link as LinkIcon, Trash2, Loader2 } from 'lucide-react';

export default function Stream({ items, onPost, onDelete, myId, userRole, loading }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onPost(input);
    setInput("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-700">
      <form onSubmit={handleSubmit} className="relative group">
        <textarea 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share a link or a research note..."
          className="w-full bg-white border-none rounded-[2.5rem] p-10 text-sm focus:ring-8 focus:ring-pink-50 shadow-sm italic h-40 resize-none transition-all"
        />
        <button type="submit" className="absolute bottom-8 right-8 p-5 bg-slate-900 text-white rounded-2xl hover:bg-pink-500 transition-all shadow-xl">
          {loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />}
        </button>
      </form>

      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.id} className={`p-8 rounded-[3rem] bg-white border shadow-sm transition-all hover:shadow-md ${item.user_id === myId ? 'border-slate-50' : 'border-pink-50'}`}>
            <div className="flex justify-between items-center mb-6 text-[9px] font-black uppercase tracking-widest text-slate-300">
              <span>{item.user_id === myId ? 'Your Entry' : `${userRole === 'PRIMARY' ? 'Max' : 'Chunxiao'}'s Sync`}</span>
              <Sparkles size={14} className={item.preview_data ? "text-blue-400" : "text-pink-400"} />
            </div>

            {item.preview_data ? (
              <a href={item.preview_data.url} target="_blank" rel="noreferrer" className="flex flex-col md:flex-row gap-6 group">
                {item.preview_data.image && (
                  <div className="w-full md:w-32 h-32 rounded-[2rem] overflow-hidden flex-shrink-0">
                    <img src={item.preview_data.image} alt="preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
                <div className="flex-1 space-y-2 py-1">
                  <h4 className="text-sm font-black text-slate-800 group-hover:text-blue-500 transition-colors line-clamp-1">{item.preview_data.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 italic">{item.preview_data.description}</p>
                  <div className="pt-2 text-[9px] font-bold text-blue-300 uppercase underline decoration-2 underline-offset-4 flex items-center gap-1">
                    <LinkIcon size={10} /> {new URL(item.preview_data.url).hostname}
                  </div>
                </div>
              </a>
            ) : (
              <div className="relative">
                <Quote size={32} className="absolute -top-4 -left-4 text-slate-50 opacity-50" />
                <p className="text-sm text-slate-600 italic leading-relaxed relative z-10">“{item.content}”</p>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between items-center text-[8px] font-bold text-slate-200 uppercase tracking-widest">
              {new Date(item.created_at).toLocaleString()}
              <button onClick={() => onDelete(item.id)} className="hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}