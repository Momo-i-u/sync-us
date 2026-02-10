import React, { useState } from 'react';
import { Layout, PlusCircle, Loader2, CheckCircle2, RotateCcw, Archive } from 'lucide-react';

// Added 'onUpdate' to handle finishing/restoring protocols
export default function Dashboard({ chapters, loading, onCreate, onOpen, onUpdate }) {
  
  // State to toggle between Active and Finished views
  const [showFinished, setShowFinished] = useState(false);

  const handleCreateClick = () => {
    const title = window.prompt("Enter the name for the new pipeline:");
    if (title && title.trim()) {
      onCreate(title); 
    }
  };

  // Toggle chapter finished status
  const toggleFinish = (e, chapter) => {
    e.stopPropagation(); // Prevent opening the chapter details
    if (onUpdate) {
      onUpdate(chapter.id, { is_finished: !chapter.is_finished });
    }
  };

  // Filter chapters based on current view
  // If is_finished is undefined, treat as false (active)
  const displayedChapters = chapters.filter(ch => 
    showFinished ? ch.is_finished : !ch.is_finished
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <section className="space-y-8">
        
        {/* --- Header Section with View Toggle --- */}
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-6">
            {/* Active View Toggle */}
            <button 
              onClick={() => setShowFinished(false)}
              className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 transition-colors ${!showFinished ? 'text-[#3C3835]' : 'text-[#A8A29E] hover:text-[#3C3835]'}`}
            >
              <Layout size={14}/> Active
            </button>
            
            {/* Finished View Toggle */}
            <button 
              onClick={() => setShowFinished(true)}
              className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 transition-colors ${showFinished ? 'text-[#3C3835]' : 'text-[#A8A29E] hover:text-[#3C3835]'}`}
            >
              <Archive size={14}/> Finished
            </button>
          </div>
          
          {/* Create New Pipeline Button */}
          <button 
            onClick={handleCreateClick} 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-[#2D2A26] text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.25em] hover:bg-black hover:scale-105 shadow-[0_15px_30px_rgba(45,42,38,0.15)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={14}/> : <PlusCircle size={14}/>} New Pipeline
          </button>
        </div>

        {/* --- Protocols Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {displayedChapters.length === 0 ? (
             <div className="col-span-full py-16 text-center">
               <p className="text-[10px] font-black text-[#A8A29E] uppercase tracking-widest">
                 No {showFinished ? 'finished' : 'active'} protocols found
               </p>
             </div>
           ) : (
             displayedChapters.map(ch => (
               <div 
                 key={ch.id} 
                 onClick={() => onOpen(ch.id)} 
                 className={`p-8 bg-white border border-[#EBE3D5] rounded-[2.5rem] shadow-[0_4px_20px_rgba(184,163,141,0.05)] hover:shadow-[0_25px_50px_rgba(184,163,141,0.15)] hover:-translate-y-1 transition-all duration-500 cursor-pointer group relative overflow-hidden ${showFinished ? 'opacity-60 grayscale-[0.8] hover:opacity-100 hover:grayscale-0' : ''}`}
               >
                  {/* Status Badge */}
                  <div className={`absolute top-0 right-0 px-5 py-1.5 text-[8px] font-black uppercase tracking-widest ${ch.consent_status === 'AGREED' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FFFBEB] text-[#F59E0B]'}`}>
                    {ch.consent_status}
                  </div>
                  
                  {/* Title & Action Button Row */}
                  <div className="flex justify-between items-start mb-5 gap-4">
                    <h4 className={`font-black text-sm uppercase tracking-wide transition-colors ${showFinished ? 'text-[#A8A29E] line-through decoration-2 decoration-[#EBE3D5]' : 'text-[#3C3835] group-hover:text-blue-500'}`}>
                      {ch.title}
                    </h4>
                    
                    {/* Finish / Restore Action Button */}
                    <button
                      onClick={(e) => toggleFinish(e, ch)}
                      title={showFinished ? "Restore to Active" : "Mark as Finished"}
                      className="p-2 rounded-full hover:bg-[#FAF9F6] text-[#A8A29E] hover:text-[#3C3835] transition-colors z-10 -mt-2 -mr-2"
                    >
                      {showFinished ? <RotateCcw size={16} /> : <CheckCircle2 size={16} />}
                    </button>
                  </div>
                  
                  {/* Progress Visualizer */}
                  <div className="w-full bg-[#FAF9F6] h-1.5 rounded-full overflow-hidden mb-3">
                    <div 
                      style={{ width: `${ch.progress}%` }} 
                      className={`h-full transition-all duration-[2000ms] ease-out shadow-[0_0_8px_rgba(96,165,250,0.5)] ${showFinished ? 'bg-slate-300' : 'bg-blue-400'}`}
                    ></div>
                  </div>
                  
                  <p className="text-[9px] font-black text-[#A8A29E] uppercase tracking-[0.2em]">
                    {ch.progress}% <span className="opacity-50">ꨄ︎</span>
                  </p>
               </div>
             ))
           )}
        </div>
      </section>
    </div>
  );
}