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
    { name: 'Dashboard', href: '/studio', icon: Home },
    { name: 'Constructor', href: '/studio/builder', icon: PlusCircle },
    { name: 'Mis Creaciones', href: '/studio/my-progressions', icon: LayoutGrid },
    { name: 'Favoritos', href: '/studio/favorites', icon: Star },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      <aside className="w-72 border-r border-zinc-800/50 bg-[#0E0E0E] flex flex-col p-8">
        <div className="flex items-center gap-3 mb-16 px-4">
          <div className="w-10 h-10 bg-[#E5C07B] rounded-xl flex items-center justify-center text-black font-bold">G</div>
          <span className="font-black tracking-[0.2em] text-sm uppercase italic">GuitarFlow</span>
        </div>

        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                pathname === item.href ? 'bg-[#E5C07B] text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 text-zinc-600 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest mt-auto border-t border-zinc-800/50 pt-8"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </aside>
      <main className="flex-1 overflow-auto bg-[#0A0A0A]">{children}</main>
    </div>
  );
}