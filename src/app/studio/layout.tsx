'use client';
import React from 'react';
import Link from 'next/link';
import { Home, Search, PenTool, Star, Plus, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const menu = [
    { icon: <Home size={22} />, label: 'Home', href: '/studio' },
    { icon: <Search size={22} />, label: 'Scale Finder', href: '/studio/scale-finder' },
    { icon: <PenTool size={22} />, label: 'Builder', href: '/studio/builder' },
    { icon: <Star size={22} />, label: 'Favorites', href: '/studio/favorites' },
  ];

  return (
    <div className="flex h-screen bg-[#0E0E0E] overflow-hidden">
      {/* Sidebar - GuitarFlow Branding */}
      <aside className="w-80 border-r border-zinc-800/50 flex flex-col p-12 bg-[#0A0A0A] z-10">
        <div className="mb-16">
          <h1 className="text-white text-3xl font-bold tracking-[0.2em] leading-none">GUITARFLOW</h1>
          <p className="text-[#E5C07B] text-[10px] tracking-[0.4em] font-black uppercase mt-2">Studio Session</p>
        </div>

        <nav className="flex-1 space-y-4">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-5 px-6 py-4 rounded-2xl transition-all ${pathname === item.href ? 'bg-zinc-900 text-[#E5C07B] shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/30'}`}>
              {item.icon} <span className="text-[15px] font-bold tracking-wide">{item.label}</span>
            </Link>
          ))}
          <Link href="/studio/new-progression" className="flex items-center gap-5 px-6 py-4 mt-12 rounded-2xl bg-[#E5C07B] text-black font-bold text-sm hover:scale-[1.02] transition-all shadow-[0_20px_40px_rgba(229,192,123,0.2)]">
            <Plus size={22} strokeWidth={3} /> New Progression
          </Link>
        </nav>

        {/* Botón de Salida reemplazando Settings/Support */}
        <div className="pt-12 border-t border-zinc-800/50">
          <Link href="/" className="flex items-center gap-5 px-6 py-4 text-[12px] font-bold tracking-[0.2em] uppercase text-zinc-600 hover:text-red-400 transition-colors">
            <LogOut size={20} /> Cerrar Sesión
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}