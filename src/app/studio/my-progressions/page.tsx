'use client';
import React, { useState, useEffect } from 'react';
import { RefreshCw, Star, Loader2, Music2 } from 'lucide-react';
import { guitarFlowApi } from '@/lib/api';

export default function MyProgressionsPage() {
  const [progressions, setProgressions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await guitarFlowApi.listProgressions();
      // NOTA: Según tu Postman, la respuesta no trae 'isFavorite'
      setProgressions(res.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleFavorite = async (id: number) => {
    try {
      // Según Postman, es un POST al ID en la URL
      const res = await guitarFlowApi.addFavorite(id);
      alert(res.data.message); // Debería decir "Favorite added"
    } catch (e) { alert("Error al agregar a favoritos."); }
  };

  return (
    <div className="p-16 max-w-7xl mx-auto space-y-12">
      <h1 className="text-7xl font-extralight text-white tracking-tighter italic">My Creations.</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-40"><Loader2 className="animate-spin text-[#E5C07B]" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {progressions.map((prog) => (
            <div key={prog.progressionId} className="bg-zinc-900/30 border border-zinc-800/50 rounded-[4rem] p-12 hover:border-[#E5C07B]/40 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-4xl font-light text-white mb-2">{prog.workTitle}</h3>
                  <p className="text-[#E5C07B] text-[10px] font-black uppercase tracking-widest">{prog.keyName}</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleFavorite(prog.progressionId)} className="w-14 h-14 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-[#E5C07B] transition-all">
                    <Star size={20} />
                  </button>
                  {/* El botón de editar ahora usará el transponer de tu Postman */}
                  <button className="w-14 h-14 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white">
                    <RefreshCw size={20} />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto">
                {prog.chords.map((c: any, i: number) => (
                  <div key={i} className="bg-black/50 border border-zinc-800 px-6 py-4 rounded-2xl text-white text-xl font-light">{c.chordName}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}