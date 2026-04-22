'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Play, RotateCcw, Pause, Trash2, Loader2, Plus, ChevronRight } from 'lucide-react';
import { guitarFlowApi } from '@/lib/api';
import { createGuitarSynth, strumChord, CHORD_LIBRARY } from '@/lib/audio';
import Fretboard from '@/components/studio/Fretboard';
import * as Tone from 'tone';

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('id');
  const isInitialLoad = useRef(true);

  const [workTitle, setWorkTitle] = useState('Nueva Obra');
  const [keys, setKeys] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [availableChords, setAvailableChords] = useState<any[]>([]);
  const [progression, setProgression] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const guitar = useMemo(() => createGuitarSynth(), []);

  // CARGA INICIAL: Tonalidades y Obra
  useEffect(() => {
    const load = async () => {
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
            if (keyMatch) setSelectedKey(Number(keyMatch.id));
          }
        }
        setTimeout(() => { isInitialLoad.current = false; }, 800);
      } catch (e) { console.error(e); }
    };
    load();
  }, [editId]);

  // CARGA DE ACORDES DIATÓNICOS
  useEffect(() => {
    if (selectedKey) {
      guitarFlowApi.getChordsByKey(selectedKey).then(res => {
        setAvailableChords(res.data);
        if (!isInitialLoad.current) {
          setProgression([]);
          setActiveIndex(null);
        }
      });
    }
  }, [selectedKey]);

  // GUARDADO: POST /api/progressions
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
    } catch (e) { alert("Error de validación en el servidor."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col h-full bg-[#0E0E0E] text-white">
      <header className="px-12 py-8 border-b border-zinc-800/50 flex justify-between items-center bg-[#0A0A0A]">
        <input value={workTitle} onChange={e => setWorkTitle(e.target.value)} className="bg-transparent text-xl font-bold text-[#E5C07B] outline-none border-b border-transparent focus:border-[#E5C07B] w-80" />
        <div className="flex gap-6 items-center">
          <select value={selectedKey || ""} onChange={e => setSelectedKey(Number(e.target.value))} className="bg-black border border-zinc-800 rounded-xl px-6 py-2 text-[10px] font-bold text-[#E5C07B]">
            <option value="">Tonalidad</option>
            {keys.map(k => <option key={k.id} value={k.id}>{k.keyName}</option>)}
          </select>
          <button onClick={handleSave} disabled={isLoading} className="bg-[#E5C07B] text-black px-10 py-4 rounded-full font-bold text-[10px] uppercase shadow-lg">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Persistir Obra'}
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-4 overflow-hidden">
        <aside className="border-r border-zinc-800/50 p-8 space-y-10 bg-[#0A0A0A] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {availableChords.map(chord => (
              <button key={chord.chordId} onClick={() => { setProgression([...progression, chord]); strumChord(chord.chordName, guitar); }} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] hover:border-[#E5C07B] text-left">
                <span className="block text-2xl font-light mb-1">{chord.chordName}</span>
                <span className="text-[9px] text-zinc-600 font-bold uppercase">{chord.musicalDegree}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="col-span-3 p-12 space-y-12 overflow-y-auto">
          <div className="flex gap-6 overflow-x-auto pb-8 items-center min-h-[220px]">
            {progression.map((chord, i) => (
              <button key={i} onClick={() => { setActiveIndex(i); strumChord(chord.chordName, guitar); }} className={`min-w-[190px] rounded-[3rem] p-10 border transition-all relative text-left ${activeIndex === i ? 'bg-[#E5C07B]/5 border-[#E5C07B] scale-105' : 'bg-zinc-900/40 border-zinc-800'}`}>
                <Trash2 size={16} className="absolute top-8 right-8 text-zinc-700 hover:text-red-500" onClick={(e) => { 
                  e.stopPropagation(); 
                  const newProg = progression.filter((_, idx) => idx !== i);
                  setProgression(newProg);
                  if (activeIndex === i) setActiveIndex(null); // RESET PARA EVITAR CRASH
                }} />
                <div className={`text-6xl font-light mb-4 ${activeIndex === i ? 'text-[#E5C07B]' : 'text-white'}`}>{chord.chordName}</div>
                <div className="text-zinc-700 font-bold text-[9px] uppercase">{chord.musicalDegree}</div>
              </button>
            ))}
          </div>

          {/* FIX: Uso de opcional chaining para evitar 'Cannot read properties of undefined' */}
          <Fretboard 
            activeNotes={activeIndex !== null && progression[activeIndex] ? CHORD_LIBRARY[progression[activeIndex].chordName]?.fretNotes || [] : []} 
            barre={activeIndex !== null && progression[activeIndex] ? CHORD_LIBRARY[progression[activeIndex].chordName]?.barre : undefined}
          />
          
          <div className="flex justify-center items-center gap-16 pt-6">
             <button onClick={() => { setProgression([]); setActiveIndex(null); }} className="text-zinc-700 hover:text-white transition-all"><RotateCcw size={32} /></button>
             <button onClick={async () => {
                await Tone.start();
                setIsPlaying(true);
                let time = 0;
                progression.forEach((c, idx) => {
                  setTimeout(() => { strumChord(c.chordName, guitar); setActiveIndex(idx); }, time * 1000);
                  time += 1.8;
                });
                setTimeout(() => { setIsPlaying(false); setActiveIndex(null); }, progression.length * 1800);
             }} disabled={progression.length === 0} className="w-36 h-36 rounded-full bg-white flex items-center justify-center text-black shadow-2xl">
               {isPlaying ? <Pause size={64} fill="black" /> : <Play size={64} fill="black" className="ml-3" />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}