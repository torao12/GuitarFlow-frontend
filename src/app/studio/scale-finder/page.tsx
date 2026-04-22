'use client';
import React from 'react';
import { Share2, Info } from 'lucide-react';
import Fretboard from '@/components/studio/Fretboard';
export default function ScaleFinderPage() {
  const intervals = [
    { n: 'G', t: 'Tonic' }, { n: 'Bb', t: 'Minor 3rd' }, { n: 'C', t: 'Perfect 4th' }, 
    { n: 'D', t: 'Perfect 5th' }, { n: 'F', t: 'Minor 7th' }
  ];

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12 bg-studio-bg">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-light text-white mb-3 tracking-tight">Scale Finder</h1>
          <p className="text-zinc-500 text-sm max-w-md">
            Explore harmonic landscapes. Dial in your tonic and mode to visualize the resonance across your instrument.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-border-subtle rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-panel-bg transition-all">
          <Share2 size={14} /> Share Map
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="bg-panel-bg p-8 rounded-[2.5rem] border border-border-subtle h-fit space-y-8">
          <h3 className="text-[9px] tracking-[0.3em] text-zinc-500 uppercase font-bold">Configuration</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[9px] text-zinc-600 uppercase mb-2 font-bold">Tonic Note</label>
              <select className="w-full bg-black border border-border-subtle rounded-xl p-3 text-sm text-white outline-none focus:border-gold-accent">
                <option>G</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] text-zinc-600 uppercase mb-2 font-bold">Scale Type</label>
              <select className="w-full bg-black border border-border-subtle rounded-xl p-3 text-sm text-white outline-none focus:border-gold-accent">
                <option>Pentatonic Minor</option>
              </select>
            </div>
            <button className="w-full bg-gold-accent text-black font-bold py-4 rounded-xl text-[10px] tracking-widest uppercase mt-4 hover:scale-[1.02] transition-transform">
              Update Layout
            </button>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-10">
          <section className="bg-panel-bg p-10 rounded-[3rem] border border-border-subtle">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[9px] tracking-[0.3em] text-zinc-500 uppercase font-bold">Scale DNA</h3>
              <Info size={14} className="text-zinc-700" />
            </div>
            <div className="flex justify-between max-w-3xl">
              {intervals.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-5">
                  <div className="w-20 h-20 rounded-full border-2 border-border-subtle bg-black flex items-center justify-center text-3xl font-light text-white hover:border-gold-accent transition-colors">
                    {item.n}
                  </div>
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-[0.2em]">{item.t}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-panel-bg p-10 rounded-[3rem] border border-border-subtle">
             <h3 className="text-[9px] tracking-[0.3em] text-zinc-500 uppercase font-bold mb-10">Active Analysis</h3>
             <Fretboard activeNotes={[[6, 3], [6, 6], [5, 3], [5, 5], [4, 3], [4, 5]]} />
          </section>
        </div>
      </div>
    </div>
  );
}