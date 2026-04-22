'use client';
import { Plus, Search, Clock, Music2, Star } from 'lucide-react';
import Link from 'next/link';

export default function StudioDashboard() {
  return (
    <div className="p-16 max-w-7xl mx-auto space-y-20">
      <header className="space-y-6">
        <h1 className="text-7xl font-extralight text-white tracking-tight leading-none">
          Welcome back, <span className="text-[#E5C07B] font-normal italic">Maestro.</span>
        </h1>
        <p className="text-zinc-500 max-w-md text-xl leading-relaxed">
          Tu estudio está calibrado. La última vez exploraste texturas de <span className="text-white font-medium">Lidio Dominante</span> en Sol.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/studio/new-progression" className="group bg-zinc-900/30 p-12 rounded-[4rem] border border-zinc-800/50 hover:border-[#E5C07B] transition-all duration-500">
            <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mb-12 border border-zinc-800 group-hover:border-[#E5C07B] transition-all">
              <Plus className="text-[#E5C07B]" size={32} strokeWidth={3} />
            </div>
            <h3 className="text-3xl font-medium text-white mb-4">New Progression</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Crea desde cero con sugerencias armónicas calculadas algorítmicamente.</p>
          </Link>

          <Link href="/studio/scale-finder" className="group bg-zinc-900/30 p-12 rounded-[4rem] border border-zinc-800/50 hover:border-[#E5C07B] transition-all duration-500">
            <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mb-12 border border-zinc-800 group-hover:border-[#E5C07B] transition-all">
              <Search className="text-[#E5C07B]" size={32} strokeWidth={3} />
            </div>
            <h3 className="text-3xl font-medium text-white mb-4">Scale Finder</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Encuentra mapas armónicos compatibles basados en teoría de escalas diatónicas.</p>
          </Link>
        </div>

        <div className="bg-zinc-900/20 p-12 rounded-[4rem] border border-zinc-800/30 flex flex-col justify-between">
          <div className="space-y-12">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-[#E5C07B] rounded-full animate-pulse shadow-[0_0_15px_#E5C07B]" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-zinc-500 font-bold">Studio Active</span>
            </div>
            <div className="space-y-2">
              <div className="text-7xl font-light text-white tabular-nums tracking-tighter">11:42</div>
              <p className="text-[11px] text-[#E5C07B] uppercase tracking-[0.3em] font-bold">Midnight Session</p>
            </div>
          </div>
          
          <div className="pt-12 border-t border-zinc-800/50 space-y-6">
            <div className="flex items-center gap-3 text-zinc-600">
              <Star size={16} />
              <span className="text-[10px] uppercase font-bold tracking-widest">Featured Favorite</span>
            </div>
            <p className="text-lg text-zinc-400 italic font-serif leading-relaxed">"Midnight Jazz Drift"</p>
          </div>
        </div>
      </div>
    </div>
  );
}