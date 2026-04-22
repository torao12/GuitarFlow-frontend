'use client';
import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Play, RotateCcw, Pause, Trash2, Loader2, Plus, ChevronRight } from 'lucide-react';
import { guitarFlowApi } from '@/lib/api';
import { createGuitarSynth, strumChord, CHORD_LIBRARY } from '@/lib/audio';
import Fretboard from '@/components/studio/Fretboard';
import * as Tone from 'tone';

function BuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('id');
  const isInitialLoad = useRef(true);

  const [workTitle, setWorkTitle] = useState('Nueva Composición');
  const [keys, setKeys] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [availableChords, setAvailableChords] = useState<any[]>([]);
  const [progression, setProgression] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const guitar = useMemo(() => createGuitarSynth(), []);

  useEffect(() => {
    const init = async () => {
      try {
        const kRes = await guitarFlowApi.getKeys();
        setKeys(kRes.data);
        if (editId) {
          const pRes = await guitarFlowApi.listProgressions();
          const obra = pRes.data.find((p: any) => p.progressionId === Number(editId));
          if (obra) {
            setWorkTitle(obra.workTitle);
            setProgression(obra.chords);
            const keyMatch = kRes.data.find((k: any) => k.keyName === obra.keyName);
            if (keyMatch) setSelectedKey(Number(keyMatch.keyId || keyMatch.id));
          }
        }
        setTimeout(() => { isInitialLoad.current = false; }, 800);
      } catch (e) { console.error(e); }
    };
    init();
  }, [editId]);

  useEffect(() => {
    if (selectedKey) {
      guitarFlowApi.getChordsByKey(selectedKey).then(res => {
        setAvailableChords(res.data);
        if (!isInitialLoad.current) setProgression([]);
      });
    }
  }, [selectedKey]);

  const handleSave = async () => {
    if (!selectedKey || progression.length === 0) return;
    setIsLoading(true);
    try {
      await guitarFlowApi.createProgression({
        workTitle,
        baseKeyId: Number(selectedKey),
        chordIds: progression.map(c => Number(c.chordId || c.id))
      });
      router.push('/studio/my-progressions');
    } catch (e) { alert("Error al guardar en AWS"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0E0E0E] text-white overflow-x-hidden">
      {/* HEADER RESPONSIVE */}
      <header className="px-6 lg:px-12 py-6 lg:py-8 border-b border-zinc-800/50 flex flex-col md:flex-row justify-between items-center bg-[#0A0A0A] gap-4">
        <input value={workTitle} onChange={e => setWorkTitle(e.target.value)} className="bg-transparent text-xl font-bold text-[#E5C07B] outline-none border-b border-transparent focus:border-[#E5C07B] w-full md:w-80" />
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
          <select value={selectedKey || ""} onChange={e => setSelectedKey(Number(e.target.value))} className="w-full sm:w-auto bg-black border border-zinc-800 rounded-xl px-6 py-2 text-[10px] font-bold text-[#E5C07B]">
            <option value="">Tonalidad</option>
            {keys.map(k => <option key={k.keyId || k.id} value={k.keyId || k.id}>{k.keyName}</option>)}
          </select>
          <button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto bg-[#E5C07B] text-black px-10 py-4 rounded-full font-bold text-[10px] uppercase shadow-lg active:scale-95 transition-all">
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Persistir Obra'}
          </button>
        </div>
      </header>

      {/* CONTENIDO RESPONSIVE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* BANCO DE ACORDES: Abajo en móvil (o scroll lateral), lateral en PC */}
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-zinc-800/50 p-6 lg:p-8 space-y-10 bg-[#0A0A0A] overflow-y-auto lg:h-full max-h-[300px] lg:max-h-none shrink-0">
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
            {availableChords.map(chord => (
              <button key={chord.chordId} onClick={() => { setProgression([...progression, chord]); strumChord(chord.chordName, guitar); }} className="bg-zinc-900 border border-zinc-800 p-4 lg:p-6 rounded-[2rem] hover:border-[#E5C07B] text-left transition-all">
                <span className="block text-xl lg:text-2xl font-light mb-1">{chord.chordName}</span>
                <span className="text-[8px] lg:text-[9px] text-zinc-600 font-bold uppercase">{chord.musicalDegree}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* WORKSPACE */}
        <div className="flex-1 p-6 lg:p-12 space-y-12 overflow-y-auto bg-[#0E0E0E] pb-32 lg:pb-12">
          {/* LÍNEA DE PROGRESIÓN */}
          <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-8 items-center min-h-[180px] lg:min-h-[220px] px-2">
            {progression.map((chord, i) => (
              <button key={i} onClick={() => { setActiveIndex(i); strumChord(chord.chordName, guitar); }} className={`min-w-[150px] lg:min-w-[190px] rounded-[2.5rem] lg:rounded-[3rem] p-8 lg:p-10 relative transition-all border text-left shrink-0 ${activeIndex === i ? 'bg-[#E5C07B]/5 border-[#E5C07B] scale-105' : 'bg-zinc-900/40 border-zinc-800'}`}>
                <Trash2 size={16} className="absolute top-6 right-6 text-zinc-700 hover:text-red-500 z-10" onClick={(e) => { e.stopPropagation(); setProgression(progression.filter((_, idx) => idx !== i)); if(activeIndex===i) setActiveIndex(null); }} />
                <div className={`text-4xl lg:text-6xl font-light my-4 ${activeIndex === i ? 'text-[#E5C07B]' : 'text-white'}`}>{chord.chordName}</div>
                <div className="text-zinc-700 font-bold text-[8px] lg:text-[9px] uppercase">{chord.musicalDegree}</div>
              </button>
            ))}
          </div>

          {/* FRETBOARD (Scroll lateral para pantallas pequeñas) */}
          <div className="overflow-x-auto bg-zinc-900/20 p-4 lg:p-8 rounded-[2rem] border border-zinc-800">
            <Fretboard 
              activeNotes={activeIndex !== null && progression[activeIndex] ? CHORD_LIBRARY[progression[activeIndex].chordName]?.fretNotes || [] : []} 
              barre={activeIndex !== null && progression[activeIndex] ? CHORD_LIBRARY[progression[activeIndex].chordName]?.barre : undefined}
            />
          </div>
          
          {/* BOTONES DE REPRODUCCIÓN */}
          <div className="flex justify-center items-center gap-8 lg:gap-16 pt-6">
             <button onClick={() => { setProgression([]); setActiveIndex(null); }} className="text-zinc-700 hover:text-white transition-all"><RotateCcw size={28} className="lg:w-8 lg:h-8" /></button>
             <button onClick={async () => {
                if (Tone.context.state !== 'running') await Tone.start();
                setIsPlaying(true);
                let t = 0;
                progression.forEach((c, idx) => {
                  setTimeout(() => { strumChord(c.chordName, guitar); setActiveIndex(idx); }, t * 1000);
                  t += 1.8;
                });
                setTimeout(() => { setIsPlaying(false); setActiveIndex(null); }, progression.length * 1800);
             }} disabled={progression.length === 0 || isPlaying} className="w-24 h-24 lg:w-36 lg:h-36 rounded-full bg-white flex items-center justify-center text-black shadow-2xl active:scale-90 transition-all disabled:opacity-30">
               {isPlaying ? <Pause size={40} fill="black" className="lg:w-16 lg:h-16" /> : <Play size={40} fill="black" className="ml-2 lg:w-16 lg:h-16 lg:ml-3" />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0A0A0A] flex items-center justify-center text-[#E5C07B] uppercase tracking-[0.5em] text-[10px] font-black">Cargando Studio...</div>}>
      <BuilderContent />
    </Suspense>
  );
}