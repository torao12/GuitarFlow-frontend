'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Music2, Star, LayoutGrid, LogOut, PlusCircle, Home } from 'lucide-react';
import { guitarFlowApi } from '@/lib/api';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    guitarFlowApi.auth.logout();
    router.push('/');
  };

  const navItems = [
    { name: 'Home', href: '/studio', icon: Home },
    { name: 'Build', href: '/studio/builder', icon: PlusCircle },
    { name: 'Library', href: '/studio/my-progressions', icon: LayoutGrid },
    { name: 'Vault', href: '/studio/favorites', icon: Star },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white flex-col lg:flex-row overflow-hidden">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-72 border-r border-zinc-800/50 bg-[#0E0E0E] flex-col p-8 shrink-0">
        <div className="flex items-center gap-3 mb-16 px-4">
          <div className="w-10 h-10 bg-[#E5C07B] rounded-xl flex items-center justify-center text-black">
            <Music2 size={24}/>
          </div>
          <span className="font-black tracking-[0.2em] text-sm uppercase">GuitarFlow</span>
        </div>
        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${pathname === item.href ? 'bg-[#E5C07B] text-black shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'}`}>
              <item.icon size={18} /> {item.name}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 text-zinc-600 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest mt-auto border-t border-zinc-800/50 pt-8">
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </aside>

      {/* NAVBAR INFERIOR (Móvil) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0E0E0E]/90 backdrop-blur-xl border-t border-zinc-800 z-50 flex justify-around p-4 shadow-2xl">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`p-3 rounded-xl transition-all ${pathname === item.href ? 'text-[#E5C07B]' : 'text-zinc-500'}`}>
            <item.icon size={24} />
          </Link>
        ))}
        <button onClick={handleLogout} className="p-3 text-zinc-500"><LogOut size={24}/></button>
      </nav>

      {/* ÁREA DE CONTENIDO: Aquí el scroll es obligatorio */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A0A] pb-24 lg:pb-0 scroll-smooth">
        {children}
      </main>
    </div>
  );
}