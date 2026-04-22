'use client';
import React, { useState, useEffect } from 'react';
import { Star, Loader2, Music2 } from 'lucide-react';
import { guitarFlowApi } from '@/lib/api';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavs = async () => {
      try {
        const res = await guitarFlowApi.listProgressions();
        // Filtro flexible para detectar 'true', 1 o el campo isFavorite
        const onlyFavs = res.data.filter((p: any) => 
          p.isFavorite === true || p.isFavorite === 1 || p.favorite === true
        );
        setFavorites(onlyFavs);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadFavs();
  }, []);

  return (
    <div className="p-16 max-w-7xl mx-auto space-y-16 min-h-screen">
      <header className="flex items-center gap-6 border-b border-zinc-800 pb-10">
        <Star fill="#E5C07B" className="text-[#E5C07B]" size={32} />
        <h1 className="text-7xl font-extralight text-white tracking-tighter italic">Vault.</h1>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-40"><Loader2 className="animate-spin text-[#E5C07B]" size={40} /></div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {favorites.map((prog) => (
            <div key={prog.progressionId} className="bg-zinc-900/40 border border-[#E5C07B]/20 rounded-[4rem] p-12">
              <h3 className="text-4xl font-light text-white mb-4">{prog.workTitle}</h3>
              <p className="text-[#E5C07B] text-[10px] font-black uppercase tracking-[0.4em] mb-6">{prog.keyName}</p>
              <div className="flex gap-4">
                {prog.chords.map((c: any, i: number) => (
                  <span key={i} className="text-white/60 font-bold">{c.chordName}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center flex flex-col items-center gap-6 opacity-20">
          <Music2 size={64} />
          <p className="text-zinc-500 uppercase tracking-[0.8em] font-black text-xs">Sin favoritos guardados</p>
        </div>
      )}
    </div>
  );
}