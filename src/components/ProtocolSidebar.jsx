import React from 'react';
import { X, AlertCircle, CheckCircle2, Circle, Trash2, Calendar, Share2, Plus } from 'lucide-react';

export default function ProtocolSidebar({ chapter, onClose, onUpdate }) {
  if (!chapter) return null;

  const getCalendarUrl = (ch) => {
    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    const eventTitle = encodeURIComponent(`[SYNC-US] ${ch.title}`);
    const taskList = ch.milestones?.map(m => `${m.done ? '✅' : '⭕'} ${m.text}`).join('%0A') || 'No nodes defined';
    const eventDetails = encodeURIComponent(`Status: ${ch.consent_status}\n\nTasks:\n${taskList}`);
    return `${baseUrl}&text=${eventTitle}&details=${eventDetails}`;
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-[100] flex flex-col border-l border-slate-100 transition-all animate-in slide-in-from-right duration-500">
      <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{chapter.title}</h2>
        <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
      </div>
      <div className="p-10 flex-1 overflow-y-auto space-y-12">
        
        {/* Consent Section */}
        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Collaborative Review</label>
          <div className="flex gap-2 mb-4">
            <button onClick={() => onUpdate(chapter.id, { consent_status: 'AGREED' })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${chapter.consent_status === 'AGREED' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'}`}>Agree</button>
            <button onClick={() => {
              const note = prompt("Suggest alternative plan:");
              onUpdate(chapter.id, { consent_status: 'ALTERNATIVE', alternative_note: note });
            }} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${chapter.consent_status === 'ALTERNATIVE' ? 'bg-amber-500 text-white' : 'bg-white text-slate-400'}`}>Alternative</button>
          </div>
          {chapter.alternative_note && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
              <AlertCircle size={14} className="text-amber-500 mt-0.5" />
              <p className="text-[11px] text-amber-700 italic">“{chapter.alternative_note}”</p>
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 underline decoration-pink-200 decoration-2">Topology Nodes</label>
            <button onClick={() => {
              const t = prompt("New Task Description:");
              if(t) onUpdate(chapter.id, { milestones: [...(chapter.milestones || []), { id: Date.now(), text: t, done: false }] });
            }} className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Plus size={16}/></button>
          </div>
          <div className="space-y-3">
            {(chapter.milestones || []).map((m) => (
              <div key={m.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-white">
                <button onClick={() => {
                  const updated = chapter.milestones.map(task => task.id === m.id ? {...task, done: !task.done} : task);
                  onUpdate(chapter.id, { milestones: updated });
                }}>{m.done ? <CheckCircle2 className="text-emerald-500" size={20}/> : <Circle className="text-slate-300" size={20}/>}</button>
                <span className={`text-xs font-medium flex-1 ${m.done ? 'text-slate-300 line-through' : 'text-slate-700'}`}>{m.text}</span>
                <button onClick={() => {
                  const filtered = chapter.milestones.filter(task => task.id !== m.id);
                  onUpdate(chapter.id, { milestones: filtered });
                }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Link */}
        <div className="pt-8 border-t border-slate-100">
          <a href={getCalendarUrl(chapter)} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-[2rem] shadow-xl hover:bg-blue-700 transition-all group">
            <div className="flex items-center gap-3"><Calendar size={20}/><span className="text-[11px] font-black uppercase tracking-widest">Add to Calendar</span></div>
            <Share2 size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}