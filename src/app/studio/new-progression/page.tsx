'use client';
import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export default function NewProgressionPage() {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0E0E0E]">
      <div className="max-w-2xl w-full">
        <header className="mb-12 text-center">
          <h2 className="text-[#E5C07B] text-[10px] tracking-[0.4em] uppercase font-bold mb-3">New Progression</h2>
          <h1 className="text-4xl text-white font-light mb-4 tracking-tight">Session Setup</h1>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
            Define the harmonic foundation of your next composition. Choose your key, scale, and tempo to begin.
          </p>
        </header>

        <div className="bg-[#151515] p-10 rounded-[2.5rem] border border-zinc-800/50 space-y-10">
          {/* 1. Session Name */}
          <section>
            <label className="block text-[9px] tracking-[0.3em] text-zinc-500 uppercase font-bold mb-4">1. Session Name</label>
            <input 
              type="text" 
              placeholder="E.g. Midnight Nocturne" 
              className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-700 outline-none focus:border-[#E5C07B] transition-colors"
            />
          </section>

          {/* 2. Tonic Note Grid */}
          <section>
            <label className="block text-[9px] tracking-[0.3em] text-zinc-500 uppercase font-bold mb-4">2. Tonic Note</label>
            <div className="grid grid-cols-6 gap-2">
              {notes.map((note) => (
                <button 
                  key={note}
                  className={`py-3 rounded-lg text-sm font-medium border transition-all ${
                    note === 'C' ? 'bg-[#E5C07B] text-black border-[#E5C07B]' : 'bg-black text-zinc-500 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* 3. Scale Type */}
            <section>
              <label className="block text-[9px] tracking-[0.3em] text-zinc-500 uppercase font-bold mb-4">3. Scale Type</label>
              <select className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-[#E5C07B] appearance-none cursor-pointer">
                <option>Aeolian (Natural Minor)</option>
                <option>Ionian (Major)</option>
                <option>Dorian</option>
              </select>
            </section>

            {/* 4. Initial BPM */}
            <section>
              <label className="block text-[9px] tracking-[0.3em] text-zinc-500 uppercase font-bold mb-4">4. Initial BPM</label>
              <div className="bg-black border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                <input type="range" className="flex-1 accent-[#E5C07B]" defaultValue="118" />
                <span className="ml-4 text-white font-mono text-sm min-w-[60px] text-right">118 BPM</span>
              </div>
            </section>
          </div>

          {/* Auto-Suggestion Toggle */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-black rounded-lg border border-zinc-800">
                <Zap size={16} className="text-[#E5C07B]" />
              </div>
              <div>
                <p className="text-xs text-white font-bold tracking-wide">AUTO-SUGGESTION</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">Smart voicing enabled</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-[#E5C07B] rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>

          <button className="w-full bg-[#E5C07B] text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#d4b06a] transition-all group">
            START COMPOSING
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}