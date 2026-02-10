import React, { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';

export default function Header({ 
  logo, 
  userRole, 
  myStatus, 
  partnerStatus, 
  onStatusChange, 
  currentView, 
  setView, 
  onLogout, 
  latestMedia, // Pass the latest movie object here
  myId         // Pass the current user's ID
}) {
  const [isOrbExpanded, setIsOrbExpanded] = useState(false);
  const orbRef = useRef(null);
  
  // --- Badge Logic ---
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (!latestMedia) return;

    // 1. Get the last seen movie ID from local storage
    const lastSeenId = localStorage.getItem('cine_last_id');
    
    // 2. Check if the latest movie is mine (fallback to false if user_id missing)
    const isMine = latestMedia.user_id === myId;

    // 3. Show badge if: (ID is different) AND (It's NOT my movie)
    if (latestMedia.id.toString() !== lastSeenId && !isMine) {
      setHasNew(true);
    } else {
      setHasNew(false);
    }
  }, [latestMedia, myId]);

  const handleNavClick = (viewName) => {
    setView(viewName);
    // Clear badge when clicking Cinema
    if (viewName === 'CINEMA' && latestMedia) {
      localStorage.setItem('cine_last_id', latestMedia.id.toString());
      setHasNew(false);
    }
  };
  // -------------------

  useEffect(() => {
    function handleClickOutside(event) {
      if (orbRef.current && !orbRef.current.contains(event.target)) {
        setIsOrbExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOrbExpanded]);

  const isMax = userRole === 'PRIMARY';
  const partnerLabel = isMax ? "Chunxiao's status" : "Max's status";

  const states = [
    { id: 'STEADY', color: '#34d399', startAngle: 0, endAngle: 120 },
    { id: 'ALONE',  color: '#60a5fa', startAngle: 120, endAngle: 240 },
    { id: 'SYNC',   color: '#fbbf24', startAngle: 240, endAngle: 360 }
  ];

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    };
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
  };

  const partnerColor = states.find(s => s.id === partnerStatus)?.color || '#cbd5e1';

  const orbSize = isOrbExpanded ? 300 : 96;
  const logoSize = isOrbExpanded ? 140 : 56;
  const interactionRadius = isOrbExpanded ? 115 : 36;
  const center = orbSize / 2;

  return (
    <header className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8 z-50 relative">
      
      <div 
        ref={orbRef}
        className={`relative flex items-center gap-8 transition-all duration-500 ${isOrbExpanded ? 'z-50' : ''}`}
      >
        <div 
          className="relative flex items-center justify-center shrink-0 transition-all duration-500 cursor-pointer"
          style={{ width: `${orbSize}px`, height: `${orbSize}px` }}
          onClick={() => !isOrbExpanded && setIsOrbExpanded(true)}
        >
          <svg width={orbSize} height={orbSize} viewBox={`0 0 ${orbSize} ${orbSize}`} className="absolute inset-0 overflow-visible">
            <circle 
              cx={center} cy={center} r={center - 4} 
              fill="none" stroke={partnerColor} 
              strokeWidth={isOrbExpanded ? "6" : "2.5"} 
              className="opacity-25 transition-all duration-700" 
            />
            
            {states.map((s) => {
              const isSelected = myStatus === s.id;
              const arcPath = describeArc(center, center, interactionRadius, s.startAngle + (isOrbExpanded ? 3 : 5), s.endAngle - (isOrbExpanded ? 3 : 5));
              return (
                <g key={s.id} className={`${isOrbExpanded ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'}`}>
                  <path d={arcPath} fill="none" stroke={s.color} 
                    strokeWidth={isOrbExpanded ? (isSelected ? "34" : "24") : (isSelected ? "10" : "6")} 
                    strokeLinecap="round" 
                    className={`transition-all duration-500 ${isSelected ? 'opacity-100' : isOrbExpanded ? 'opacity-40 hover:opacity-100' : 'opacity-20'}`}
                    style={{ filter: isSelected ? `drop-shadow(0 0 ${isOrbExpanded ? '15px' : '6px'} ${s.color})` : 'none' }}
                  />
                  {isOrbExpanded && (
                    <path d={arcPath} fill="none" stroke="transparent" strokeWidth="60" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(s.id);
                        setIsOrbExpanded(false);
                      }} 
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Logo Container (Warm Minimalist) */}
          <div 
            className="relative bg-[#FFFDF0] shadow-xl rounded-[22%] flex items-center justify-center overflow-hidden z-20 border border-[#EBE3D5] transition-all duration-500 pointer-events-none"
            style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
          >
            {logo ? <img src={logo} alt="Kernel" className="w-full h-full object-cover scale-110" /> : <div className="w-full h-full bg-[#FAF9F6]" />}
          </div>
        </div>

        {/* Text Labels */}
        <div className={`flex flex-col gap-1 transition-all duration-300 ${isOrbExpanded ? 'opacity-0 scale-95' : 'opacity-100'}`}>
          <h1 className="text-2xl font-black text-[#3C3835] uppercase tracking-tighter leading-none mb-1">Sync-Us</h1>
          <div className="flex flex-col gap-1">
             <p className="text-[10px] font-black text-[#A8A29E] uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: partnerColor }} />
                {partnerLabel}: <span className="text-[#3C3835] font-bold">{partnerStatus}</span>
             </p>
             <p className="text-[10px] font-black text-[#A8A29E] uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: states.find(s => s.id === myStatus)?.color }} />
                My status: <span className="text-[#3C3835] font-bold">{myStatus}</span>
             </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Navigation */}
        <nav className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-[3rem] shadow-sm border border-[#EBE3D5]">
          {['DASHBOARD', 'STREAM', 'CINEMA', 'VAULT'].map(v => (
            <button key={v} onClick={() => handleNavClick(v)} 
              className={`relative px-7 py-3 rounded-[2.5rem] text-[10px] font-black tracking-widest transition-all ${currentView === v ? 'bg-[#2D2A26] text-white shadow-xl' : 'text-[#A8A29E] hover:text-[#3C3835]'}`}
            >
              {v}
              {/* Conditional Red Dot */}
              {v === 'CINEMA' && hasNew && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-sm" />
              )}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} title="Terminate Session" className="p-4 bg-white rounded-full border border-[#EBE3D5] text-[#D6D0C7] hover:text-rose-600 transition-all shadow-sm active:scale-95">
          <LogOut size={20} />
        </button>
      </div>

    </header>
  );
}