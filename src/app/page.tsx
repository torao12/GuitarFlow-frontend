'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { guitarFlowApi } from '@/lib/api';
import { 
  Music, ArrowRight, Loader2, Eye, EyeOff, Check, 
  AlertCircle, Zap, Cloud, ShieldCheck 
} from 'lucide-react';

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
      const msg = err.response?.data?.message || "ERROR DE CONEXIÓN";
      setAlert({ message: msg.toUpperCase(), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0A0A0A]">
      {/* LADO IZQUIERDO: Contexto y Cards */}
      <section className="flex-1 p-8 lg:p-20 flex flex-col justify-center bg-zinc-900/20 border-b lg:border-b-0 lg:border-r border-zinc-800/50">
        <div className="max-w-2xl mx-auto space-y-12 py-10 lg:py-0">
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="w-14 h-14 bg-[#E5C07B] rounded-2xl flex items-center justify-center text-black shadow-lg">
                <Music size={32} />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-[0.3em] italic">GuitarFlow</h1>
            </div>
            <h2 className="text-5xl lg:text-8xl font-extralight tracking-tighter leading-none italic text-white">
              Composición <br/> <span className="text-[#E5C07B]">Digital.</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-md mx-auto lg:mx-0 font-light leading-relaxed">
              Crea, transpon y sincroniza tus progresiones en la nube de AWS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Zap, t: "Smart Builder", d: "Armonía diatónica real." },
              { icon: Cloud, t: "Sincronización", d: "Acceso total desde AWS." },
              { icon: ShieldCheck, t: "Vault", d: "Tus favoritos protegidos." },
              { icon: Music, t: "Transposición", d: "Cambia el tono al instante." }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] space-y-3">
                <item.icon className="text-[#E5C07B]" size={24} />
                <h4 className="font-bold text-[10px] uppercase tracking-widest">{item.t}</h4>
                <p className="text-zinc-500 text-xs font-light">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LADO DERECHO: Auth Form */}
      <section className="flex-1 flex items-start lg:items-center justify-center p-6 lg:p-20 bg-[#0E0E0E]">
        <div className="max-w-md w-full py-12 lg:py-0">
          <div className="bg-zinc-900/30 p-8 lg:p-12 rounded-[3.5rem] border border-zinc-800/50 space-y-8 backdrop-blur-md">
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-zinc-800">
              <button type="button" onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all ${isLogin ? 'bg-[#E5C07B] text-black' : 'text-zinc-500'}`}>LOGIN</button>
              <button type="button" onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all ${!isLogin ? 'bg-[#E5C07B] text-black' : 'text-zinc-500'}`}>REGISTER</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {alert.type && (
                <div className="p-4 border rounded-2xl flex gap-3 items-center bg-red-500/10 border-red-500/30 text-red-400">
                  <AlertCircle size={16} />
                  <p className="text-[9px] font-bold uppercase tracking-widest leading-tight">{alert.message}</p>
                </div>
              )}
              
              {!isLogin && (
                <input required type="text" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-[#E5C07B]" placeholder="Nombre Completo" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              )}
              
              <input required type="email" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-[#E5C07B]" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />

              <div className="space-y-4">
                <div className="relative">
                  <input required type={showPassword ? "text" : "password"} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-[#E5C07B]" placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {!isLogin && (
                  <div className="grid grid-cols-1 gap-2.5 px-6 py-6 bg-black/40 rounded-3xl border border-zinc-800">
                    <ReqItem met={reqs.length} text="8 Caracteres" />
                    <ReqItem met={reqs.upper} text="Mayúscula" />
                    <ReqItem met={reqs.lower} text="Minúscula" />
                    <ReqItem met={reqs.number} text="Número" />
                    <ReqItem met={reqs.special} text="Especial" />
                  </div>
                )}
              </div>

              <button disabled={isLoading || (!isLogin && !isValid)} type="submit" className="w-full bg-[#E5C07B] text-black font-bold py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all">
                {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')} 
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function ReqItem({ met, text }: { met: boolean, text: string }) {
  return (
    <div className={`flex items-center gap-3 transition-all ${met ? 'text-[#E5C07B]' : 'text-zinc-700'}`}>
      <div className={`w-3 h-3 rounded-full border ${met ? 'border-[#E5C07B] bg-[#E5C07B]' : 'border-zinc-800'}`} />
      <span className="text-[9px] font-bold uppercase tracking-widest">{text}</span>
    </div>
  );
}