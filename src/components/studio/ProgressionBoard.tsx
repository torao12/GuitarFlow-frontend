'use client';
import React from 'react';
import { Plus } from 'lucide-react';

export default function ProgressionBoard() {
  const bars = [
    { label: 'BAR 01', chord: 'Bb', type: 'Major Seventh' },
    { label: 'BAR 02', chord: 'Gm', type: 'Minor Ninth' },
    { label: 'BAR 03', chord: 'Eb', type: 'Lydian Major' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
      {bars.map((bar, index) => (
        <div 
          key={index} 
          className="min-w-[180px] bg-[#151515] border border-zinc-800 rounded-2xl p-6 hover:border-[#E5C07B] transition-all cursor-pointer group"
        >
          <span className="text-[9px] tracking-[0.2em] text-zinc-500 group-hover:text-[#E5C07B] uppercase font-bold">
            {bar.label}
          </span>
          <div className="text-4xl font-light text-white my-2 tracking-tight">
            {bar.chord}
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
            {bar.type}
          </div>
        </div>
      ))}
      
      {/* Botón para añadir acorde */}
      <button className="min-w-[180px] border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-600 hover:border-zinc-700 hover:text-zinc-400 transition-all group">
        <Plus size={24} strokeWidth={1.5} />
        <span className="text-[9px] uppercase tracking-[0.2em] mt-2 font-bold">Add Chord</span>
      </button>
    </div>
  );
}