import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Circle, Trash2, Calendar, Plus, Clock, ChevronDown, Edit2, Check } from 'lucide-react';

export default function ProtocolSidebar({ chapter, onClose, onUpdate, onDelete }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  
  // States for editing existing tasks
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");

  // States for editing Chapter Title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(chapter?.title || "");

  if (!chapter) return null;

  const milestones = chapter.milestones || [];
  const currentProgress = chapter.progress !== undefined 
    ? chapter.progress 
    : (milestones.length > 0 ? (milestones.filter(m => m.done).length / milestones.length) * 100 : 0);

  const getTaskCalendarUrl = (task, chapterTitle) => {
    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    const title = encodeURIComponent(`[SYNC-US] ${task.text}`);
    const details = encodeURIComponent(`Protocol: ${chapterTitle}\nStatus: ${chapter.consent_status}`);
    const dateFormatted = task.date ? task.date.replace(/-/g, '') : new Date().toISOString().split('T')[0].replace(/-/g, '');
    const dates = `${dateFormatted}/${dateFormatted}`; 
    return `${baseUrl}&text=${title}&details=${details}&dates=${dates}`;
  };

  const handleUpdateTitle = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onUpdate(chapter.id, { title: newTitle });
    setIsEditingTitle(false);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = { id: Date.now(), text: newTaskText, date: newTaskDate || null, done: false };
    onUpdate(chapter.id, { milestones: [...milestones, newTask] });
    setNewTaskText(""); setNewTaskDate(""); setIsAdding(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updated = milestones.map(m => 
      m.id === editingId ? { ...m, text: editText, date: editDate } : m
    );
    onUpdate(chapter.id, { milestones: updated });
    setEditingId(null);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-[100] flex flex-col border-l border-slate-100 transition-all animate-in slide-in-from-right duration-500">
      
      {/* --- Section 1: Header (With Title Edit) --- */}
      <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20 backdrop-blur-md">
        <div className="flex-1 mr-4">
          {isEditingTitle ? (
            <form onSubmit={handleUpdateTitle} className="flex gap-2">
              <input 
                autoFocus
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-white border-none rounded-lg px-3 py-1 text-xl font-black text-slate-800 uppercase tracking-tighter w-full shadow-sm focus:ring-2 focus:ring-blue-100"
              />
              <button type="submit" className="text-emerald-500 hover:scale-110 transition-transform"><Check size={20}/></button>
            </form>
          ) : (
            <div className="flex items-center gap-3 group">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{chapter.title}</h2>
              <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-500 transition-all">
                <Edit2 size={16}/>
              </button>
            </div>
          )}
        </div>
        <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 transition-all"><X size={20}/></button>
      </div>

      {/* --- Section 2: Progress Slider --- */}
      <div className="px-10 py-8 bg-white border-b border-slate-50 group">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Manual Phase Override</span>
          <span className="text-[11px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">{Math.round(currentProgress)}%</span>
        </div>
        <div className="relative h-6 flex items-center">
          <div className="absolute w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${currentProgress}%` }} />
          </div>
          <input type="range" min="0" max="100" value={currentProgress} onChange={(e) => onUpdate(chapter.id, { progress: parseInt(e.target.value) })} className="absolute w-full h-1.5 opacity-0 cursor-pointer z-10" />
          <div className="absolute w-4 h-4 bg-white border-4 border-amber-400 rounded-full shadow-md pointer-events-none transition-all duration-300" style={{ left: `calc(${currentProgress}% - 8px)` }} />
        </div>
      </div>

      <div className="p-10 flex-1 overflow-y-auto space-y-12">
        {/* --- Section 3: Consensus Protocol --- */}
        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Collaborative Agreement</label>
          <div className="flex gap-2">
            <button onClick={() => onUpdate(chapter.id, { consent_status: 'AGREED' })} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${chapter.consent_status === 'AGREED' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>Confirmed</button>
            <button onClick={() => { const note = prompt("Proposed Deviation:"); if(note) onUpdate(chapter.id, { consent_status: 'ALTERNATIVE', alternative_note: note }); }} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${chapter.consent_status === 'ALTERNATIVE' ? 'bg-amber-400 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>Alternative</button>
          </div>
          {chapter.alternative_note && (
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={14} className="text-amber-500 mt-1" />
              <p className="text-[11px] text-amber-800 font-medium italic">“{chapter.alternative_note}”</p>
            </div>
          )}
        </div>

        {/* --- Section 4: Node Topology (Tasks) --- */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 underline decoration-amber-200 decoration-4 underline-offset-4">Active Topology</label>
            {!isAdding && <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 shadow-lg active:scale-95 transition-all"><Plus size={14}/> New Node</button>}
          </div>

          {isAdding && (
            <form onSubmit={handleAddTask} className="p-6 bg-amber-50/40 border-2 border-amber-100 rounded-[2.2rem] space-y-4 animate-in zoom-in-95">
              <input autoFocus type="text" placeholder="Description..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="w-full bg-white border-none rounded-xl p-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-amber-200" />
              <div className="flex gap-2">
                <input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} className="flex-1 bg-white border-none rounded-xl p-4 text-xs font-black uppercase text-slate-500 appearance-none" />
                <button type="submit" className="px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-amber-500 transition-all">Add</button>
                <button type="button" onClick={() => setIsAdding(false)} className="px-3 text-slate-400 font-bold text-xs">✕</button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {milestones.map((m) => (
              <div key={m.id} className={`group p-6 rounded-[2.5rem] border transition-all duration-300 ${m.done ? 'bg-slate-50/50 border-transparent opacity-60' : 'bg-white border-slate-100 hover:border-amber-200 hover:shadow-xl'}`}>
                {editingId === m.id ? (
                  <form onSubmit={handleSaveEdit} className="space-y-4 animate-in fade-in duration-300">
                    <input autoFocus type="text" value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-100" />
                    <div className="flex gap-2">
                      <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="flex-1 bg-slate-50 border-none rounded-xl p-3 text-[10px] font-black uppercase text-slate-500" />
                      <button type="submit" className="p-3 bg-amber-400 text-white rounded-xl hover:bg-amber-500 transition-all"><Check size={16}/></button>
                      <button type="button" onClick={() => setEditingId(null)} className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-all"><X size={16}/></button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start gap-5">
                    <button onClick={() => { const updated = milestones.map(t => t.id === m.id ? {...t, done: !t.done} : t); onUpdate(chapter.id, { milestones: updated }); }}>
                      {m.done ? <CheckCircle2 className="text-emerald-400" size={24}/> : <Circle className="text-slate-200 group-hover:text-amber-400" size={24}/>}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-bold tracking-tight mb-2 ${m.done ? 'text-slate-300 line-through font-normal' : 'text-slate-700'}`}>{m.text}</p>
                      <div className="flex items-center gap-3">
                        {m.date && <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-tighter"><Clock size={10} /> {new Date(m.date + "T00:00:00").toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>}
                        {!m.done && <a href={getTaskCalendarUrl(m, chapter.title)} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-[9px] font-black text-blue-400 hover:text-blue-600 transition-all uppercase"><Calendar size={11} /> Google Calendar</a>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => { setEditingId(m.id); setEditText(m.text); setEditDate(m.date || ""); }} className="p-2 text-slate-200 hover:text-blue-400 transition-all"><Edit2 size={14}/></button>
                      <button onClick={() => { const filtered = milestones.filter(t => t.id !== m.id); onUpdate(chapter.id, { milestones: filtered }); }} className="p-2 text-slate-100 hover:text-red-400 transition-all"><Trash2 size={14}/></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Section 5: Dangerous Zone (Delete Chapter) --- */}
      <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4">
        <button 
          onClick={() => onDelete(chapter.id)}
          className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 flex items-center justify-center gap-2"
        >
          <Trash2 size={14}/> Terminate Protocol
        </button>
        <p className="text-[8px] font-black text-slate-200 uppercase tracking-[0.4em] text-center">Relational Kernel v2.3.0</p>
      </div>
    </div>
  );
}