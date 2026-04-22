'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { guitarFlowApi } from '@/lib/api';
import { Music, ArrowRight, Loader2, Eye, EyeOff, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{ message: string, type: 'error' | 'success' | null }>({ message: '', type: null });
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', fullName: '', password: '' });
  const [reqs, setReqs] = useState({ length: false, upper: false, lower: false, number: false, special: false });

  useEffect(() => {
    const p = formData.password;
    setReqs({
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /\d/.test(p),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(p)
    });
  }, [formData.password]);

  const isValid = Object.values(reqs).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !isValid) return;
    setIsLoading(true);
    setAlert({ message: '', type: null });

    try {
      if (isLogin) {
        await guitarFlowApi.auth.login({ email: formData.email, password: formData.password });
      } else {
        await guitarFlowApi.auth.register(formData);
      }
      router.push('/studio');
    } catch (err: any) {
      const msg = err.response?.data?.message || "ERROR DE SERVIDOR";
      setAlert({ message: msg.toUpperCase(), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* CAMBIO CLAVE: 
       - overflow-y-auto: Habilita el scroll.
       - py-20: Da espacio arriba y abajo para que el contenido no se pegue a los bordes y el scroll tenga "aire".
    */
    <div className="min-h-screen w-full bg-[#0E0E0E] flex flex-col items-center justify-start lg:justify-center p-6 py-20 font-sans overflow-y-auto">
      <div className="max-w-md w-full space-y-10">
        <header className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E5C07B] rounded-3xl mb-4 shadow-[0_0_50px_rgba(229,192,123,0.2)]">
            <Music size={40} className="text-black" />
          </div>
          <h1 className="text-white text-5xl font-bold tracking-tighter uppercase leading-none">GuitarFlow</h1>
        </header>

        <div className="bg-zinc-900/30 p-10 rounded-[3.5rem] border border-zinc-800/50 space-y-8 backdrop-blur-md">
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-zinc-800">
            <button type="button" onClick={() => { setIsLogin(true); setAlert({message:'', type:null}); }} className={`flex-1 py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all ${isLogin ? 'bg-[#E5C07B] text-black shadow-lg' : 'text-zinc-500'}`}>LOGIN</button>
            <button type="button" onClick={() => { setIsLogin(false); setAlert({message:'', type:null}); }} className={`flex-1 py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all ${!isLogin ? 'bg-[#E5C07B] text-black shadow-lg' : 'text-zinc-500'}`}>REGISTER</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {alert.type && (
              <div className="p-4 border rounded-2xl flex gap-3 items-center bg-red-500/10 border-red-500/30 text-red-400 font-bold uppercase text-[9px]">
                <AlertCircle size={16} /> {alert.message}
              </div>
            )}
            
            {!isLogin && (
              <input required type="text" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-[#E5C07B]" placeholder="Nombre Completo" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            )}
            
            <input required type="email" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-[#E5C07B]" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />

            <div className="space-y-4">
              <div className="relative">
                <input required type={showPassword ? "text" : "password"} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-[#E5C07B] pr-12" placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-[#E5C07B]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {!isLogin && (
                <div className="grid grid-cols-1 gap-2.5 px-4 py-6 bg-black/20 rounded-3xl border border-zinc-900">
                  <ReqItem met={reqs.length} text="Mínimo 8 Caracteres" />
                  <ReqItem met={reqs.upper} text="Una Mayúscula" />
                  <ReqItem met={reqs.lower} text="Minúsculas" />
                  <ReqItem met={reqs.number} text="Un Número" />
                  <ReqItem met={reqs.special} text="Especial (: , . @ # $)" />
                </div>
              )}
            </div>

            <button disabled={isLoading || (!isLogin && !isValid)} type="submit" className="w-full bg-[#E5C07B] text-black font-bold py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all">
              {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')} 
              {!isLoading && <ArrowRight size={20} strokeWidth={3} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ReqItem({ met, text }: { met: boolean, text: string }) {
  return (
    <div className={`flex items-center gap-3 transition-all ${met ? 'text-[#E5C07B]' : 'text-zinc-700'}`}>
      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${met ? 'border-[#E5C07B] bg-[#E5C07B]/10' : 'border-zinc-800'}`}>
        {met && <Check size={10} strokeWidth={4} />}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest">{text}</span>
    </div>
  );
}