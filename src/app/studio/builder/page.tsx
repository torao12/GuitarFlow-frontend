'use client';
import React, { useState } from 'react';
import { Play, Plus, Sliders, Music2, RotateCcw, Pause, Save } from 'lucide-react';
import Fretboard from '@/components/studio/Fretboard';

export default function BuilderPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#0E0E0E]">
      <header className="px-12 py-8 border-b border-zinc-800/50 flex justify-between items-center bg-[#0A0A0A]">
        <div className="flex items-center gap-10">
          <div>
            <h1 className="text-lg font-bold tracking-[0.2em] text-[#E5C07B] uppercase leading-none">GuitarFlow Builder</h1>
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">E MAJ7 • A13 • D# M7B5</p>
          </div>
          <div className="h-12 w-[1px] bg-zinc-800" /> 
          <div className="text-sm font-mono text-white flex gap-8">
            <span>96 BPM</span>
            <span className="text-zinc-600">0:12 / 1:45</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-zinc-500 hover:text-[#E5C07B] transition-all"><Save size={24} /></button>
          {/* Se eliminó Export MIDI */}
        </div>
      </header>

      {/* Contenido del Builder... */}
    </div>
  );
}