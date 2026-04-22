'use client';
import { Plus, Search, Clock, Star, Play } from 'lucide-react';
import Link from 'next/link';

export default function StudioDashboard() {
  return (
    <div className="p-16 max-w-7xl mx-auto space-y-20">
      {/* Hero Welcome */}
      <header className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
        <h1 className="text-8xl font-extralight text-white tracking-tighter leading-none">
          Welcome back, <br />
          <span className="text-[#E5C07B] font-normal italic">Maestro.</span>
        </h1>
        <p className="text-zinc-500 max-w-lg text-2xl leading-relaxed">
          Tu estudio en <span className="text-white font-bold">GuitarFlow</span> está calibrado. Explora nuevas texturas armónicas.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Tarjeta Unificada: Builder */}
          <Link href="/studio/builder" className="group bg-zinc-900/30 p-14 rounded-[4rem] border border-zinc-800/50 hover:border-[#E5C07B] transition-all duration-500">
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-12 border border-zinc-800 group-hover:border-[#E5C07B] transition-all">
              <Plus className="text-[#E5C07B]" size={40} strokeWidth={3} />
            </div>
            <h3 className="text-4xl font-medium text-white mb-6">New Progression</h3>
            <p className="text-zinc-500 text-lg leading-relaxed">Empieza una sesión desde cero con sugerencias armónicas inteligentes.</p>
          </Link>

          <Link href="/studio/scale-finder" className="group bg-zinc-900/30 p-14 rounded-[4rem] border border-zinc-800/50 hover:border-[#E5C07B] transition-all duration-500">
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-12 border border-zinc-800 group-hover:border-[#E5C07B] transition-all">
              <Search className="text-[#E5C07B]" size={40} strokeWidth={3} />
            </div>
            <h3 className="text-4xl font-medium text-white mb-6">Scale Finder</h3>
            <p className="text-zinc-500 text-lg leading-relaxed">Encuentra mapas armónicos compatibles basados en teoría de escalas.</p>
          </Link>
        </div>

        {/* Panel de Estado del Estudio */}
        <div className="bg-zinc-900/20 p-12 rounded-[4rem] border border-zinc-800/30 flex flex-col justify-between shadow-2xl">
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-[#E5C07B] rounded-full animate-pulse shadow-[0_0_20px_#E5C07B]" />
              <span className="text-[12px] uppercase tracking-[0.4em] text-zinc-500 font-bold">Studio Active</span>
            </div>
            <div className="space-y-4">
              <div className="text-8xl font-light text-white tabular-nums tracking-tighter">11:42</div>
              <p className="text-[12px] text-[#E5C07B] uppercase tracking-[0.3em] font-bold">Midnight Session</p>
            </div>
          </div>
          
          <div className="pt-12 border-t border-zinc-800/50 space-y-8">
            <div className="flex items-center gap-3 text-zinc-500">
              <Star size={18} />
              <span className="text-[11px] uppercase font-bold tracking-[0.2em]">Featured Favorite</span>
            </div>
            <div>
              <h4 className="text-2xl text-white font-medium mb-4 italic">"Midnight Jazz Drift"</h4>
              <button className="flex items-center gap-2 text-[#E5C07B] text-sm font-bold hover:gap-4 transition-all">
                QUICK PLAY <Play size={14} fill="#E5C07B" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}