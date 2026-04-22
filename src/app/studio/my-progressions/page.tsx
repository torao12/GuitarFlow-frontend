'use client';
import React, { useState, useEffect } from 'react';
import { RefreshCw, Star, Loader2, Music2, Trash2, X, Save } from 'lucide-react';
import { guitarFlowApi } from '@/lib/api';

export default function MyProgressionsPage() {
  const [progressions, setProgressions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para el Modal de Transposición
  const [showTransposeModal, setShowTransposeModal] = useState(false);
  const [selectedProg, setSelectedProg] = useState<any | null>(null);
  const [semitones, setSemitones] = useState(1);
  const [isTransposing, setIsTransposing] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await guitarFlowApi.listProgressions();
      setProgressions(res.data);
    } catch (e) {
      console.error("Error al cargar:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // FAVORITOS: Toggle dinámico (POST para agregar / DELETE para quitar)
  const handleToggleFavorite = async (id: number, isCurrentlyFav: boolean) => {
    // Actualización optimista: Cambiamos la UI antes de la respuesta del server
    setProgressions(prev => prev.map(p => 
      p.progressionId === id ? { ...p, isFavorite: !isCurrentlyFav } : p
    ));

    try {
      if (isCurrentlyFav) {
        await guitarFlowApi.removeFavorite(id); // DELETE /api/favorites/:id
      } else {
        await guitarFlowApi.addFavorite(id);    // POST /api/favorites/:id
      }
    } catch (e) {
      // Si falla, revertimos el cambio visual
      setProgressions(prev => prev.map(p => 
        p.progressionId === id ? { ...p, isFavorite: isCurrentlyFav } : p
      ));
      alert("Error al sincronizar favoritos con el servidor.");
    }
  };

  // EJECUTAR TRANSPOSICIÓN (POST /api/progressions/:id/transpose)
  const handleExecuteTranspose = async () => {
    if (!selectedProg) return;
    setIsTransposing(true);
    try {
      await guitarFlowApi.transpose(
        selectedProg.progressionId,
        semitones,
        `${selectedProg.workTitle} (${semitones > 0 ? '+' : ''}${semitones} st)`
      );
      setShowTransposeModal(false);
      setSemitones(1);
      loadData(); // Recargamos para ver la nueva versión
    } catch (e) {
      alert("Error al transponer la obra.");
    } finally {
      setIsTransposing(false);
    }
  };

  return (
    <div className="p-16 max-w-7xl mx-auto space-y-12 relative min-h-screen">
      <header className="flex justify-between items-end border-b border-zinc-800 pb-10">
        <h1 className="text-7xl font-extralight text-white tracking-tighter italic">My Creations.</h1>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-40">
          <Loader2 className="animate-spin text-[#E5C07B]" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {progressions.map((prog) => (
            <div key={prog.progressionId} className="bg-zinc-900/30 border border-zinc-800/50 rounded-[3.5rem] p-10 hover:border-[#E5C07B]/40 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <h3 className="text-3xl font-light text-white">{prog.workTitle}</h3>
                  <p className="text-[#E5C07B] text-[10px] font-black uppercase tracking-[0.3em]">{prog.keyName}</p>
                </div>
                <div className="flex gap-3">
                  {/* BOTÓN FAVORITOS (Toggle) */}
                  <button 
                    onClick={() => handleToggleFavorite(prog.progressionId, !!prog.isFavorite)} 
                    className={`w-12 h-12 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center transition-all ${prog.isFavorite ? 'text-[#E5C07B]' : 'text-zinc-600 hover:text-white'}`}
                  >
                    <Star size={18} fill={prog.isFavorite ? "#E5C07B" : "none"} />
                  </button>
                  
                  {/* BOTÓN TRANSPONER (Abre Modal) */}
                  <button 
                    onClick={() => { setSelectedProg(prog); setShowTransposeModal(true); }}
                    className="w-12 h-12 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2">
                {prog.chords?.map((c: any, i: number) => (
                  <div key={i} className="bg-black/40 border border-zinc-800 px-5 py-3 rounded-2xl text-white font-light text-lg">
                    {c.chordName}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE TRANSPOSICIÓN */}
      {showTransposeModal && selectedProg && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-[#0E0E0E] border border-zinc-800 w-full max-w-md rounded-[4rem] p-16 space-y-10 shadow-2xl">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-light text-white tracking-tight">Transponer</h2>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{selectedProg.workTitle}</p>
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-10">
                <button 
                  onClick={() => setSemitones(s => s - 1)}
                  className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center text-2xl hover:bg-white hover:text-black transition-all"
                >-</button>
                <span className="text-6xl font-extralight text-[#E5C07B] w-20 text-center">{semitones}</span>
                <button 
                  onClick={() => setSemitones(s => s + 1)}
                  className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center text-2xl hover:bg-white hover:text-black transition-all"
                >+</button>
              </div>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em]">Ajuste de Semitonos</p>
            </div>

            <div className="space-y-4 pt-4">
              <button 
                onClick={handleExecuteTranspose}
                disabled={isTransposing}
                className="w-full bg-[#E5C07B] text-black py-5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                {isTransposing ? <Loader2 className="animate-spin" /> : <Save size={16} />}
                {isTransposing ? 'Procesando...' : 'Generar Nueva Versión'}
              </button>
              <button 
                onClick={() => setShowTransposeModal(false)}
                className="w-full py-2 text-zinc-600 text-[9px] font-black uppercase tracking-widest hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}