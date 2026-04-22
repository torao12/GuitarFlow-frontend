'use client';
import React, { useState, useEffect, useMemo } from 'react';
import * as Tone from 'tone';
import { Play, RotateCcw, Pause, Save, Trash2, Loader2, Music2, ChevronRight } from 'lucide-react';
import { guitarFlowApi } from '@/lib/api';
import { createSynth, playChord } from '@/lib/audioEngine';
import Fretboard from '@/components/studio/Fretboard'; 

export default function BuilderPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [workTitle, setWorkTitle] = useState('Nueva Composición');
  const [keys, setKeys] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [availableChords, setAvailableChords] = useState<any[]>([]);
  const [progression, setProgression] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const synth = useMemo(() => (typeof window !== 'undefined' ? createSynth() : null), []);

  useEffect(() => {
    guitarFlowApi.getKeys().then(res => setKeys(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedKey) {
      guitarFlowApi.getChordsByKey(selectedKey).then(res => {
        setAvailableChords(res.data);
        setProgression([]);
        setActiveIndex(null);
      });
    }
  }, [selectedKey]);

  /**
   * LÓGICA DE VOICINGS REALES
   * Define las notas presionadas y si el acorde lleva cejilla.
   * Las notas en traste 0 se ignoran visualmente en el mástil.
   */
  const getChordData = (chordName: string) => {
    const library: Record<string, { notes: number[][], barre?: { fret: number, from: number, to: number } }> = {
      'C':  { notes: [[5, 3], [4, 2], [2, 1]] }, // Traste 0 en cuerdas 3 y 1 no se dibujan
      'Cm': { notes: [[5, 3], [4, 5], [3, 5], [2, 4]], barre: { fret: 3, from: 5, to: 1 } },
      'D':  { notes: [[3, 2], [2, 3], [1, 2]] },
      'Dm': { notes: [[3, 2], [2, 3], [1, 1]] },
      'E':  { notes: [[5, 2], [4, 2], [3, 1]] },
      'Em': { notes: [[5, 2], [4, 2]] },
      'F':  { notes: [[5, 3], [4, 3], [3, 2]], barre: { fret: 1, from: 6, to: 1 } },
      'G':  { notes: [[6, 3], [5, 2], [1, 3]] },
      'A':  { notes: [[4, 2], [3, 2], [2, 2]] },
      'Am': { notes: [[4, 2], [3, 2], [2, 1]] },
      'B':  { notes: [[4, 4], [3, 4], [2, 4]], barre: { fret: 2, from: 5, to: 1 } },
      'Bm': { notes: [[4, 4], [3, 4], [2, 3]], barre: { fret: 2, from: 5, to: 1 } },
      'Bdim': { notes: [[5, 2], [4, 3], [3, 4], [2, 3]] },
      'F#m': { notes: [[5, 4], [4, 4]], barre: { fret: 2, from: 6, to: 1 } },
      'G#m': { notes: [[5, 6], [4, 6]], barre: { fret: 4, from: 6, to: 1 } },
    };
    return library[chordName] || { notes: [] };
  };

  const handleSelectChord = (index: number, chordName: string) => {
    setActiveIndex(index);
    if (synth) playChord(chordName, synth);
  };

  const handleSave = async () => {
    if (progression.length === 0 || !selectedKey) return;
    setIsLoading(true);
    try {
      // POST /api/progressions con workTitle, baseKeyId y chordIds
      await guitarFlowApi.createProgression({
        workTitle,
        baseKeyId: selectedKey,
        chordIds: progression.map(c => c.chordId)
      });
      alert("Progresión guardada en el servidor de AWS.");
    } catch (error) {
      alert("Error al guardar: Verifica el título de la obra.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0E0E0E] text-white">
      <header className="px-12 py-8 border-b border-zinc-800/50 flex justify-between items-center bg-[#0A0A0A]">
        <div className="flex items-center gap-10">
          <div className="space-y-1">
            <input 
              value={workTitle} 
              onChange={(e) => setWorkTitle(e.target.value)}
              placeholder="Nombre de la obra..."
              className="bg-transparent text-xl font-bold tracking-[0.1em] text-[#E5C07B] uppercase outline-none border-b border-transparent focus:border-[#E5C07B] transition-all w-80"
            />
            <p className="text-[9px] text-zinc-600 font-black tracking-[0.3em] uppercase">Project Name</p>
          </div>
          
          <select 
            value={selectedKey || ""} 
            onChange={(e) => setSelectedKey(Number(e.target.value))}
            className="bg-black border border-zinc-800 rounded-xl px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-[#E5C07B] outline-none"
          >
            <option value="">Tonalidad Base</option>
            {keys.map(k => <option key={k.id} value={k.id}>{k.keyName}</option>)}
          </select>
        </div>

        <button 
          onClick={handleSave} 
          disabled={isLoading || progression.length === 0}
          className="bg-[#E5C07B] text-black px-10 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-[0_10px_30px_rgba(229,192,123,0.15)]"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Guardar en Studio'}
        </button>
      </header>

      <div className="flex-1 grid grid-cols-4 overflow-hidden">
        <aside className="border-r border-zinc-800/50 p-8 space-y-10 bg-[#0A0A0A] overflow-y-auto text-center">
          <h3 className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase font-black">Escala Seleccionada</h3>
          <div className="grid grid-cols-2 gap-4">
            {availableChords.map(chord => (
              <button 
                key={chord.chordId} 
                onClick={() => { setProgression([...progression, chord]); if(synth) playChord(chord.chordName, synth); }}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] hover:border-[#E5C07B] transition-all group"
              >
                <span className="block text-2xl font-light mb-1 group-hover:text-[#E5C07B]">{chord.chordName}</span>
                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{chord.musicalDegree}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="col-span-3 p-12 space-y-12 overflow-y-auto bg-gradient-to-b from-[#0E0E0E] to-[#0A0A0A]">
          <div className="flex gap-6 overflow-x-auto pb-8 items-center min-h-[220px] px-4">
            {progression.map((chord, i) => (
              <button 
                key={i} 
                onClick={() => handleSelectChord(i, chord.chordName)}
                className={`min-w-[190px] rounded-[3rem] p-10 relative transition-all border text-left group ${
                  activeIndex === i ? 'bg-[#E5C07B]/5 border-[#E5C07B] scale-105 shadow-[0_0_40px_rgba(229,192,123,0.05)]' : 'bg-zinc-900/40 border-zinc-800/50'
                }`}
              >
                <Trash2 
                  size={16} 
                  className="absolute top-8 right-8 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all" 
                  onClick={(e) => { e.stopPropagation(); setProgression(progression.filter((_, idx) => idx !== i)); if(activeIndex === i) setActiveIndex(null); }} 
                />
                <span className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.3em]">Bar {i + 1}</span>
                <div className={`text-6xl font-light my-4 tracking-tighter ${activeIndex === i ? 'text-[#E5C07B]' : 'text-white'}`}>{chord.chordName}</div>
                <div className="flex items-center gap-2 text-zinc-700 font-bold text-[9px] uppercase">{chord.musicalDegree} <ChevronRight size={10} /></div>
              </button>
            ))}
          </div>

          {/* FRETBOARD CON SOPORTE PARA CEJILLA Y FILTRO DE TRASTE 0 */}
          <section className="bg-zinc-900/20 border border-zinc-800/40 rounded-[4rem] p-16 relative">
            <h3 className="text-[9px] tracking-[0.6em] text-zinc-600 uppercase mb-14 font-black text-center">Fretboard Visualization</h3>
            <Fretboard 
              activeNotes={activeIndex !== null ? getChordData(progression[activeIndex].chordName).notes : []} 
              barre={activeIndex !== null ? getChordData(progression[activeIndex].chordName).barre : undefined}
            />
          </section>
          
          <div className="flex justify-center items-center gap-16 pt-6">
             <button onClick={() => { setProgression([]); setActiveIndex(null); }} className="text-zinc-700 hover:text-white transition-all"><RotateCcw size={32} /></button>
             <button 
               onClick={async () => {
                  await Tone.start();
                  setIsPlaying(true);
                  let time = 0;
                  progression.forEach((c, idx) => {
                    setTimeout(() => { playChord(c.chordName, synth); setActiveIndex(idx); }, time * 1000);
                    time += 1.5;
                  });
                  setTimeout(() => { setIsPlaying(false); setActiveIndex(null); }, progression.length * 1500);
               }}
               disabled={progression.length === 0}
               className="w-36 h-36 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-[0_0_80px_rgba(255,255,255,0.1)]"
             >
               {isPlaying ? <Pause size={64} fill="black" /> : <Play size={64} fill="black" className="ml-3" />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}