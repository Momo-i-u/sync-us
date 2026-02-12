import React, { useState } from 'react';
import { Film, ExternalLink, Search, Plus, Trash2, Check, X, Eye, EyeOff } from 'lucide-react';

export default function CineRegistry({ items, onAdd, onDelete, onUpdate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const OMDB_KEY = process.env.REACT_APP_OMDB_KEY;

  const searchMovies = async (val) => {
    setQuery(val);
    if (val.length < 3) return setResults([]);
    
    setLoading(true);
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${val}`);
      const data = await res.json();
      if (data.Search) {
        const uniqueResults = data.Search.filter((v, i, a) => a.findIndex(t => t.imdbID === v.imdbID) === i);
        setResults(uniqueResults.slice(0, 5));
      }
    } catch (err) { console.error("Search failed", err); }
    setLoading(false);
  };

  const handleSelect = (movie) => {
    // FIX: Added 'type' to match your Supabase column 'type'
    setSelectedMedia({
      title: movie.Title,
      imdb_id: movie.imdbID,
      poster: movie.Poster !== "N/A" ? movie.Poster : null,
      status: 'WATCHLIST',
      type: movie.Type || 'movie' 
    });
    setResults([]);
    setQuery(movie.Title);
  };

  const handleRegister = async () => {
    if (!selectedMedia) return;
    
    try {
      console.log("Pushing to onAdd:", selectedMedia);
      await onAdd(selectedMedia); // Ensure we await the parent function
      setSelectedMedia(null);
      setQuery("");
    } catch (error) {
      console.error("Failed to add to database:", error);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (a.status === 'WATCHED' && b.status !== 'WATCHED') return 1;
    if (a.status !== 'WATCHED' && b.status === 'WATCHED') return -1;
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="relative">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-4 bg-slate-50 px-6 rounded-2xl w-full">
            <Search size={18} className={loading ? "animate-pulse text-blue-400" : "text-slate-400"} />
            <input 
              id="movie-search"
              name="movie-search"
              value={query} 
              onChange={(e) => searchMovies(e.target.value)}
              placeholder="Search Movie or Show title..."
              className="w-full bg-transparent border-none py-4 text-sm font-bold focus:ring-0"
            />
            {query && (
              <button onClick={() => { setQuery(""); setResults([]); setSelectedMedia(null); }} className="text-slate-300 hover:text-slate-500 transition-colors">
                <X size={18} />
              </button>
            )}
          </div>
          
          <button 
            type="button"
            onClick={handleRegister}
            disabled={!selectedMedia}
            className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {selectedMedia ? <Check size={14}/> : <Plus size={14}/>} 
            Add Movie
          </button>
        </div>

        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-50">
            {results.map((m) => (
              <button 
                key={m.imdbID}
                onClick={() => handleSelect(m)}
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
              >
                <div className="w-10 h-14 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
                  {m.Poster !== "N/A" && <img src={m.Poster} alt="p" className="w-full h-full object-cover" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{m.Title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.Year}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedItems.map((item) => (
          <div 
            key={item.id || item.imdb_id} 
            className={`group bg-white p-6 rounded-[3rem] border transition-all flex items-center gap-6 shadow-sm hover:shadow-xl ${item.status === 'WATCHED' ? 'opacity-50 grayscale-[0.6]' : 'border-slate-50 hover:border-amber-100'}`}
          >
            <div className="w-20 h-28 bg-slate-50 rounded-[1.5rem] overflow-hidden flex-shrink-0 shadow-inner">
              {item.poster ? (
                <img src={item.poster} alt="poster" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200"><Film size={24}/></div>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="text-base font-black text-slate-800 uppercase tracking-tighter leading-tight mb-3">
                {item.title}
              </h4>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onUpdate(item.id, { status: item.status === 'WATCHED' ? 'WATCHLIST' : 'WATCHED' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${item.status === 'WATCHED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600'}`}
                >
                  {item.status === 'WATCHED' ? <Eye size={12}/> : <EyeOff size={12}/>}
                  {item.status === 'WATCHED' ? 'Watched' : 'Unwatched'}
                </button>

                <a 
                  href={`https://www.imdb.com/title/${item.imdb_id}`} 
                  target="_blank" rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-50 text-blue-400 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-blue-100 transition-all"
                >
                  IMDb <ExternalLink size={10} />
                </a>

                <button 
                  onClick={() => onDelete(item.id)} 
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-200 hover:text-red-400 transition-all ml-auto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}