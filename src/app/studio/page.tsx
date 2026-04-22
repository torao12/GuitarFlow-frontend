'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, LayoutGrid, Star, ArrowRight, Music2, Clock } from 'lucide-react';
import { guitarFlowApi } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, favs: 0 });

  useEffect(() => {
    guitarFlowApi.listProgressions().then(res => {
      const favs = res.data.filter((p: any) => p.isFavorite || p.isFavorite === 1).length;
      setStats({ total: res.data.length, favs });
    }).catch(e => console.error(e));
  }, []);

  return (
    <div className="p-6 lg:p-16 max-w-7xl mx-auto space-y-8 lg:space-y-16">
      <header className="space-y-2">
        <h1 className="text-4xl lg:text-7xl font-extralight tracking-tighter italic">Studio Overview.</h1>
        <p className="text-zinc-500 text-xs lg:text-sm uppercase tracking-[0.4em] font-black">Tu flujo creativo en AWS</p>
      </header>

      {/* ACCESOS DIRECTOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
        {/* Nueva Composición */}
        <Link href="/studio/builder" className="group bg-[#E5C07B] p-8 lg:p-12 rounded-[3rem] text-black space-y-8 transition-transform hover:scale-[1.02]">
          <Plus size={48} className="group-hover:rotate-90 transition-transform duration-500" />
          <div>
            <h3 className="text-3xl font-light italic leading-none mb-2">Crear Progresión</h3>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Nuevo Workshop</p>
          </div>
        </Link>

        {/* Acceso a Biblioteca (Reemplaza Scale-Finder) */}
        <Link href="/studio/my-progressions" className="group bg-zinc-900 border border-zinc-800 p-8 lg:p-12 rounded-[3rem] space-y-8 transition-all hover:border-white">
          <LayoutGrid size={48} className="text-[#E5C07B]" />
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-3xl font-light italic leading-none mb-2">Biblioteca</h3>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Gestión de Obras</p>
            </div>
            <ArrowRight className="text-zinc-700 group-hover:text-white group-hover:translate-x-2 transition-all" />
          </div>
        </Link>

        {/* Favoritos */}
        <Link href="/studio/favorites" className="group bg-zinc-900 border border-zinc-800 p-8 lg:p-12 rounded-[3rem] space-y-8 transition-all hover:border-[#E5C07B]">
          <Star size={48} className="text-[#E5C07B]" fill="#E5C07B" />
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-3xl font-light italic leading-none mb-2">Vault</h3>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Tus Favoritos</p>
            </div>
            <span className="text-4xl font-extralight text-[#E5C07B]">{stats.favs}</span>
          </div>
        </Link>
      </div>

      {/* MINI STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl text-center">
          <p className="text-3xl font-light mb-1">{stats.total}</p>
          <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Obras Totales</p>
        </div>
        <div className="p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl text-center">
          <Clock size={20} className="mx-auto mb-2 text-zinc-700" />
          <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Última Sesión: Hoy</p>
        </div>
      </section>
    </div>
  );
}