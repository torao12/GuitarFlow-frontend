'use client';
import React from 'react';
import { Search, Play, Star } from 'lucide-react';

export default function FavoritesPage() {
  return (
    <div className="p-16 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-5xl font-light text-white mb-3 tracking-tight">Favorites</h1>
          <p className="text-zinc-500 text-sm">9 Saved Progressions & Creative Sketches</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
          <input 
            type="text" 
            placeholder="Search saved..." 
            className="bg-panel-bg border border-border-subtle rounded-full py-3 pl-12 pr-6 text-sm text-white focus:border-gold-accent outline-none w-80"
          />
        </div>
      </header>

      {/* Featured Session */}
      <section className="mb-20">
        <h3 className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase mb-8 font-bold">Featured Session</h3>
        <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-border-subtle rounded-[3rem] p-10 flex justify-between items-center group cursor-pointer hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-10">
            <div className="w-20 h-20 bg-gold-accent rounded-[2rem] flex items-center justify-center shadow-[0_15px_30px_rgba(229,192,123,0.2)]">
              <Star size={36} fill="black" stroke="black" />
            </div>
            <div>
              <h4 className="text-3xl text-white font-medium mb-2">Midnight Jazz Drift</h4>
              <p className="text-sm text-gold-accent font-semibold tracking-wide">Key: E Major • 85 BPM</p>
              <div className="flex gap-4 mt-5">
                 {['Ebmaj7', 'Abmaj7', 'Gm7'].map(c => (
                   <span key={c} className="bg-black border border-border-subtle px-4 py-2 rounded-xl text-xs font-mono text-zinc-400">{c}</span>
                 ))}
              </div>
            </div>
          </div>
          <button className="bg-gold-accent text-black px-10 py-4 rounded-full font-bold text-xs flex items-center gap-3 hover:scale-105 transition-all">
            <Play size={18} fill="black" /> QUICK PLAY
          </button>
        </div>
      </section>

      {/* Grid de categorías */}
      <div className="grid grid-cols-3 gap-12">
        {['Electronic', 'Acoustic', 'Soul'].map((cat) => (
          <div key={cat}>
            <h3 className="text-[10px] tracking-[0.3em] text-zinc-600 uppercase mb-8 font-bold border-b border-border-subtle pb-4">{cat}</h3>
            <div className="space-y-4">
              <div className="bg-panel-bg border border-border-subtle rounded-2xl p-6 hover:bg-zinc-900/50 cursor-pointer transition-all">
                <h4 className="text-lg text-white mb-1">Arctic Ambient</h4>
                <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold">C Mixolydian • 110 BPM</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}