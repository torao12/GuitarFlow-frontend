'use client';
import React, { useState, useEffect } from 'react';
import { RefreshCw, Star, Loader2, Music2, X, Save } from 'lucide-react';
import { guitarFlowApi } from '@/lib/api';

export default function MyProgressionsPage() {
  const [progressions, setProgressions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para el Modal de Transposición
  const [showModal, setShowModal] = useState(false);
  const [selectedProg, setSelectedProg] = useState<any | null>(null);
  const [semitones, setSemitones] = useState(1);
  const [isTransposing, setIsTransposing] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await guitarFlowApi.listProgressions();
      // Recuperamos favoritos guardados localmente para parchear lo que el back no manda
      const savedFavs = JSON.parse(localStorage.getItem('gf_favs') || '[]');
      
      const dataWithFavs = res.data.map((p: any) => ({
        ...p,
        isFavorite: savedFavs.includes(p.progressionId)
      }));
      
      setProgressions(dataWithFavs);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  // FAVORITOS CON PERSISTENCIA LOCAL
  const handleToggleFavorite = async (prog: any) => {
    const id = prog.progressionId;
    const isCurrentlyFav = prog.isFavorite;

    // Actualización visual inmediata
    setProgressions(prev => prev.map(p => 
      p.progressionId === id ? { ...p, isFavorite: !isCurrentlyFav } : p
    ));

    try {
      let currentFavs = JSON.parse(localStorage.getItem('gf_favs') || '[]');
      
      if (isCurrentlyFav) {
        await guitarFlowApi.removeFavorite(id);
        currentFavs = currentFavs.filter((favId: number) => favId !== id);
      } else {
        await guitarFlowApi.addFavorite(id);
        if (!currentFavs.includes(id)) currentFavs.push(id);
      }
      
      localStorage.setItem('gf_favs', JSON.stringify(currentFavs));
    } catch (e) {
      // Revertir si falla el servidor
      setProgressions(prev => prev.map(p => 
        p.progressionId === id ? { ...p, isFavorite: isCurrentlyFav } : p
      ));
      alert("Error al sincronizar con AWS");
    }
  };

  // FUNCIÓN CORREGIDA (Nombre coincide con el botón)
  const handleExecuteTranspose = async () => {
    if (!selectedProg) return;
    setIsTransposing(true);
    try {
      await guitarFlowApi.transpose(
        selectedProg.progressionId, 
        semitones, 
        `${selectedProg.workTitle} (${semitones > 0 ? '+' : ''}${semitones}st)`
      );
      setShowModal(false);
      setSemitones(1);
      loadData();
    } catch (e) { 
      alert("Error en transposición"); 
    } finally {
      setIsTransposing(false);
    }
  };

  return (
    <div className="p-16 max-w-7xl mx-auto space-y-12 min-h-screen relative">
      <h1 className="text-7xl font-extralight text-white tracking-tighter italic">My Creations.</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {progressions.map((prog) => (
          <div key={prog.progressionId} className="bg-zinc-900/30 border border-zinc-800/50 rounded-[4rem] p-12 hover:border-[#E5C07B]/40 transition-all">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-2">
                <h3 className="text-4xl font-light text-white">{prog.workTitle}</h3>
                <p className="text-[#E5C07B] text-[10px] font-black uppercase tracking-widest">{prog.keyName}</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleToggleFavorite(prog)} 
                  className={`w-14 h-14 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center transition-all ${prog.isFavorite ? 'text-[#E5C07B]' : 'text-zinc-600 hover:text-white'}`}
                >
                  <Star size={20} fill={prog.isFavorite ? "#E5C07B" : "none"} />
                </button>
                <button 
                  onClick={() => { setSelectedProg(prog); setShowModal(true); }}
                  className="w-14 h-14 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {prog.chords?.map((c: any, i: number) => (
                <div key={i} className="bg-black/50 border border-zinc-800 px-6 py-4 rounded-3xl text-white text-xl font-light">{c.chordName}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE TRANSPOSICIÓN */}
      {showModal && selectedProg && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-[#0E0E0E] border border-zinc-800 w-full max-w-md rounded-[4rem] p-16 space-y-10 shadow-2xl">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-light text-white tracking-tight">Transponer</h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{selectedProg.workTitle}</p>
            </div>
            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-10">
                <button onClick={() => setSemitones(s => s - 1)} className="w-14 h-14 rounded-full border border-zinc-800 text-2xl hover:bg-white hover:text-black transition-all">-</button>
                <span className="text-6xl font-extralight text-[#E5C07B] w-24 text-center">{semitones}</span>
                <button onClick={() => setSemitones(s => s + 1)} className="w-14 h-14 rounded-full border border-zinc-800 text-2xl hover:bg-white hover:text-black transition-all">+</button>
              </div>
            </div>
            <button 
              onClick={handleExecuteTranspose} 
              disabled={isTransposing}
              className="w-full bg-[#E5C07B] text-black py-5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {isTransposing ? <Loader2 className="animate-spin" /> : 'Generar Nueva Versión'}
            </button>
            <button onClick={() => setShowModal(false)} className="w-full text-zinc-600 text-[10px] uppercase font-bold tracking-widest hover:text-white">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}