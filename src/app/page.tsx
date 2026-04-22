'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Music, ArrowRight, UserPlus, LogIn, Search, PenTool, Layout } from 'lucide-react';

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    { icon: <Search className="text-[#E5C07B]" />, title: "Scale Finder", desc: "Mapea cualquier escala diatónica a lo largo de los 12 trastes instantáneamente." },
    { icon: <PenTool className="text-[#E5C07B]" />, title: "Smart Builder", desc: "Crea progresiones con sugerencias basadas en algoritmos de teoría musical pura." },
    { icon: <Layout className="text-[#E5C07B]" />, title: "Library", desc: "Organiza tus sketches por género: Electronic, Acoustic o Soul." }
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-zinc-400 font-sans selection:bg-[#E5C07B] selection:text-black">
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto pt-20 pb-32 px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-[10px] font-bold tracking-[0.3em] text-[#E5C07B]">
              <div className="w-2 h-2 bg-[#E5C07B] rounded-full animate-pulse" />
              AVAILABLE FOR MAESTROS
            </div>
            <h1 className="text-white text-7xl font-bold tracking-tighter leading-[0.9]">
              GUITAR<span className="text-[#E5C07B]">FLOW.</span>
            </h1>
            <p className="text-xl text-zinc-500 max-w-md leading-relaxed">
              Domina la armonía diatónica con un asistente diseñado para la fluidez creativa. Sin distracciones, solo música.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl border border-zinc-900 bg-zinc-900/20">
                <div className="mt-1">{f.icon}</div>
                <div>
                  <h4 className="text-white font-bold text-sm">{f.title}</h4>
                  <p className="text-xs text-zinc-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Form */}
        <div className="bg-zinc-900/30 p-12 rounded-[3.5rem] border border-zinc-800/50 space-y-10 backdrop-blur-xl relative">
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-zinc-800">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all ${isLogin ? 'bg-[#E5C07B] text-black shadow-lg' : 'text-zinc-500'}`}>LOGIN</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all ${!isLogin ? 'bg-[#E5C07B] text-black shadow-lg' : 'text-zinc-500'}`}>REGISTER</button>
          </div>

          <div className="space-y-5">
            {!isLogin && (
              <input type="text" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white focus:border-[#E5C07B] outline-none transition-all placeholder:text-zinc-800" placeholder="Nombre completo" />
            )}
            <input type="text" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white focus:border-[#E5C07B] outline-none transition-all placeholder:text-zinc-800" placeholder="Usuario o Email" />
            <input type="password" className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white focus:border-[#E5C07B] outline-none transition-all placeholder:text-zinc-800" placeholder="Contraseña" />
          </div>

          <Link href="/studio" className="w-full bg-[#E5C07B] text-black font-bold py-6 rounded-[2rem] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(229,192,123,0.2)]">
            {isLogin ? 'ACCEDER AL ESTUDIO' : 'CREAR CUENTA'} <ArrowRight size={20} strokeWidth={3} />
          </Link>
        </div>
      </main>
    </div>
  );
}