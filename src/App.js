import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Heart, X, Check, Coffee, Plus, Calendar, Share2, 
  Send, Sparkles, Lock, ShieldCheck, Layout, Activity, 
  PlusCircle, CheckCircle2, Circle, Trash2, HelpCircle, 
  AlertCircle, Edit3, Loader2, Link as LinkIcon, ExternalLink, Quote
} from 'lucide-react';

// --- PRODUCTION INITIALIZATION ---
// Note: On Vercel, set these in Settings -> Environment Variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ulgjeafybxlkzWfmXioe.supabase.co'; 
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_YlsxE_W6JjnBEYA5qGJ3zg_Apf_GRdt'; 
const supabase = createClient(supabaseUrl, supabaseKey);

const ACCESS_CODE = "1234"; 
const MAIN_DRIVE_ID = "1pA8RfbOh8QbY6EywJzXE08oILKwSyQpM";
const LINK_PREVIEW_KEY = process.env.REACT_APP_LINKPREVIEW_KEY || '09ece23be7502fcd778da84fec2597f2';

const MY_ID = 'User_Primary'; 
const PARTNER_ID = 'User_Partner';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [view, setView] = useState('DASHBOARD');
  const [myStatus, setMyStatus] = useState('STEADY');
  const [partnerStatus, setPartnerStatus] = useState('STEADY');
  const [chapters, setChapters] = useState([]);
  const [streamItems, setStreamItems] = useState([]);
  const [streamInput, setStreamInput] = useState("");
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Update browser tab title
  useEffect(() => {
    document.title = "Sync-Us | Shared Lab";
  }, []);

  useEffect(() => {
    if (localStorage.getItem('lab_access') === 'granted') setIsAuthenticated(true);
    if (isAuthenticated) {
      fetchData();
      
      const channel = supabase
        .channel('global_updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_protocols' }, (p) => {
            if (p.new.user_id === PARTNER_ID) setPartnerStatus(p.new.current_status);
            if (p.new.user_id === MY_ID) setMyStatus(p.new.current_status);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stream' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chapters' }, () => fetchData())
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [isAuthenticated]);

  async function fetchData() {
    const { data: ch } = await supabase.from('chapters').select('*').order('created_at', { ascending: false });
    const { data: st } = await supabase.from('user_protocols').select('*');
    const { data: sm } = await supabase.from('stream').select('*').order('created_at', { ascending: false });
    
    if (ch) setChapters(ch);
    if (sm) setStreamItems(sm);
    if (st) {
      const p = st.find(u => u.user_id === PARTNER_ID);
      const m = st.find(u => u.user_id === MY_ID);
      if (p) setPartnerStatus(p.current_status);
      if (m) setMyStatus(m.current_status);
    }
  }

  const changeMyStatus = async (newStatus) => {
    setMyStatus(newStatus);
    await supabase.from('user_protocols').update({ current_status: newStatus }).eq('user_id', MY_ID);
  };

  const handlePostStream = async (e) => {
    e.preventDefault();
    if (!streamInput.trim()) return;
    setLoading(true);
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundUrl = streamInput.match(urlRegex);
    let preview = null;

    if (foundUrl) {
      try {
        const res = await fetch(`https://api.linkpreview.net/?key=${LINK_PREVIEW_KEY}&q=${foundUrl[0]}`);
        if (res.ok) preview = await res.json();
      } catch (err) { console.error("Metadata fetch failed", err); }
    }

    await supabase.from('stream').insert([{
      content: streamInput.trim(),
      user_id: MY_ID,
      type: foundUrl ? 'link' : 'thought',
      preview_data: preview
    }]);

    setStreamInput("");
    fetchData();
    setLoading(false);
  };

  const handleCreateProject = async () => {
    const title = prompt("Initialize New Protocol Title:");
    if (!title) return;
    setLoading(true);
    await supabase.from('chapters').insert([{ title, progress: 0, milestones: [], consent_status: 'PENDING' }]);
    fetchData();
    setLoading(false);
  };

  const activeChapter = chapters.find(c => c.id === activeChapterId);
  const updateChapter = async (id, updates) => {
    await supabase.from('chapters').update(updates).eq('id', id);
    fetchData();
  };

  const getCalendarUrl = (ch) => {
    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    const eventTitle = encodeURIComponent(`[SYNC-US] ${ch.title}`);
    const taskList = ch.milestones?.map(m => `${m.done ? '✅' : '⭕'} ${m.text}`).join('%0A') || 'No nodes defined';
    const eventDetails = encodeURIComponent(`Status: ${ch.consent_status}\n\nTasks:\n${taskList}`);
    return `${baseUrl}&text=${eventTitle}&details=${eventDetails}`;
  };

  if (!isAuthenticated) return <LoginGate onAuth={() => setIsAuthenticated(true)} pass={passInput} setPass={setPassInput} />;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-600 font-sans">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        
        {/* --- HEADER: SYNC-US IDENTITY --- */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white shadow-xl rounded-3xl border border-pink-50"><Heart className="text-pink-400 fill-pink-400" size={24} /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase tracking-[0.1em]">Sync-Us</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${partnerStatus === 'SYNC' ? 'bg-blue-400' : partnerStatus === 'ALONE' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                Frequency: {partnerStatus === 'SYNC' ? 'High Connection' : partnerStatus === 'ALONE' ? 'Protected Space' : 'Steady'}
              </p>
            </div>
          </div>

          <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1 border border-slate-100 shadow-inner">
            {['STEADY', 'ALONE', 'SYNC'].map((s) => (
              <button key={s} onClick={() => changeMyStatus(s)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${myStatus === s ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}>
                {s}
              </button>
            ))}
          </div>

          <nav className="flex bg-white/80 backdrop-blur-sm p-1.5 rounded-[2rem] shadow-sm border border-slate-100">
            {['DASHBOARD', 'STREAM', 'VAULT'].map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black tracking-widest transition-all ${view === v ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{v}</button>
            ))}
          </nav>
        </header>

        {/* --- VIEW: DASHBOARD --- */}
        {view === 'DASHBOARD' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <section className="space-y-6">
              <div className="flex justify-between items-center px-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Layout size={14}/> Active Protocols</h3>
                <button onClick={handleCreateProject} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:scale-105 shadow-xl transition-all">
                  {loading ? <Loader2 className="animate-spin" size={14}/> : <PlusCircle size={14}/>} New Pipeline
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {chapters.map(ch => (
                   <div key={ch.id} onClick={() => setActiveChapterId(ch.id)} className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
                      <div className={`absolute top-0 right-0 px-4 py-1 text-[8px] font-black uppercase tracking-widest ${ch.consent_status === 'AGREED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{ch.consent_status}</div>
                      <h4 className="font-bold text-lg text-slate-800 uppercase mb-4 group-hover:text-pink-500">{ch.title}</h4>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden mb-2"><div style={{ width: `${ch.progress}%` }} className="bg-blue-400 h-full transition-all duration-1000"></div></div>
                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{ch.progress}% Completion</p>
                   </div>
                 ))}
              </div>
            </section>
          </div>
        )}

        {/* --- VIEW: STREAM --- */}
        {view === 'STREAM' && (
          <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-700">
            <form onSubmit={handlePostStream} className="relative group">
              <textarea 
                value={streamInput} 
                onChange={(e) => setStreamInput(e.target.value)}
                placeholder="Share a link or a research note..."
                className="w-full bg-white border-none rounded-[2.5rem] p-10 text-sm focus:ring-8 focus:ring-pink-50 shadow-sm italic h-40 resize-none transition-all"
              />
              <button type="submit" className="absolute bottom-8 right-8 p-5 bg-slate-900 text-white rounded-2xl hover:bg-pink-500 transition-all shadow-xl">
                {loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />}
              </button>
            </form>

            <div className="space-y-8">
              {streamItems.map((item) => (
                <div key={item.id} className={`p-8 rounded-[3rem] bg-white border shadow-sm transition-all hover:shadow-md ${item.user_id === MY_ID ? 'border-slate-50' : 'border-pink-50'}`}>
                  <div className="flex justify-between items-center mb-6 text-[9px] font-black uppercase tracking-widest text-slate-300">
                    <span>{item.user_id === MY_ID ? 'Your Entry' : "Max's Sync"}</span>
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
                    <button onClick={async () => { await supabase.from('stream').delete().eq('id', item.id); fetchData(); }} className="hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW: VAULT --- */}
        {view === 'VAULT' && (
          <div className="w-full h-[650px] rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl">
            <iframe src={`https://drive.google.com/embeddedfolderview?id=${MAIN_DRIVE_ID}#grid`} className="w-full h-full border-none" title="Sync-Us Vault" />
          </div>
        )}
      </div>

      {/* --- SIDEBAR: TASK MANAGER --- */}
      {activeChapter && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-[100] flex flex-col border-l border-slate-100 transition-all animate-in slide-in-from-right duration-500">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{activeChapter.title}</h2>
            <button onClick={() => setActiveChapterId(null)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
          </div>
          <div className="p-10 flex-1 overflow-y-auto space-y-12">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Collaborative Review</label>
              <div className="flex gap-2 mb-4">
                <button onClick={() => updateChapter(activeChapter.id, { consent_status: 'AGREED' })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${activeChapter.consent_status === 'AGREED' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'}`}>Agree</button>
                <button onClick={() => {
                  const note = prompt("Suggest alternative plan:");
                  updateChapter(activeChapter.id, { consent_status: 'ALTERNATIVE', alternative_note: note });
                }} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${activeChapter.consent_status === 'ALTERNATIVE' ? 'bg-amber-500 text-white' : 'bg-white text-slate-400'}`}>Alternative</button>
              </div>
              {activeChapter.alternative_note && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                  <AlertCircle size={14} className="text-amber-500 mt-0.5" />
                  <p className="text-[11px] text-amber-700 italic">“{activeChapter.alternative_note}”</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 underline decoration-pink-200 decoration-2">Topology Nodes</label>
                <button onClick={() => {
                  const t = prompt("New Task Description:");
                  if(t) updateChapter(activeChapter.id, { milestones: [...(activeChapter.milestones || []), { id: Date.now(), text: t, done: false }] });
                }} className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Plus size={16}/></button>
              </div>
              <div className="space-y-3">
                {(activeChapter.milestones || []).map((m) => (
                  <div key={m.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-white">
                    <button onClick={() => {
                      const updated = activeChapter.milestones.map(task => task.id === m.id ? {...task, done: !task.done} : task);
                      updateChapter(activeChapter.id, { milestones: updated });
                    }}>{m.done ? <CheckCircle2 className="text-emerald-500" size={20}/> : <Circle className="text-slate-300" size={20}/>}</button>
                    <span className={`text-xs font-medium flex-1 ${m.done ? 'text-slate-300 line-through' : 'text-slate-700'}`}>{m.text}</span>
                    <button onClick={() => {
                      const filtered = activeChapter.milestones.filter(task => task.id !== m.id);
                      updateChapter(activeChapter.id, { milestones: filtered });
                    }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400"><Trash2 size={14}/></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <a href={getCalendarUrl(activeChapter)} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-[2rem] shadow-xl hover:bg-blue-700 transition-all group">
                <div className="flex items-center gap-3"><Calendar size={20}/><span className="text-[11px] font-black uppercase tracking-widest">Add to Calendar</span></div>
                <Share2 size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoginGate({ onAuth, pass, setPass }) {
  return (
    <div className="min-h-screen bg-[#fcfaff] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
        <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"><Lock className="text-pink-400" size={32} /></div>
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-10">Sync-Us Access</h1>
        <form onSubmit={(e) => { e.preventDefault(); if(pass === ACCESS_CODE) onAuth(); }} className="space-y-4">
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Access Code..." className="w-full bg-slate-50 border-none rounded-2xl p-5 text-center text-sm font-mono shadow-inner" />
          <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">Establish Sync</button>
        </form>
      </div>
    </div>
  );
}