'use client';
// v2
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { setAuth } from '@/lib/auth';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAuth(data.token, data.user);
      router.push('/dashboard');
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel: brand ── */}
      <div className="hidden lg:flex w-[45%] bg-[#06241A] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand opacity-10" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-brand opacity-8" />

        {/* Top: logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-100 border border-brand-200 p-1">
            <Image src="/lipenza-iso.png" alt="Lipenza" width={40} height={40} className="object-contain w-full h-full" />
          </div>
          <div>
            <p className="font-bold text-white text-[15px] leading-none">Lipenza</p>
            <p className="text-brand text-[10px] font-bold uppercase tracking-widest mt-0.5">CRM</p>
          </div>
        </div>

        {/* Center: headline */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-white font-bold text-4xl leading-tight">
              Gestiona cada<br />clienta con amor.
            </h2>
            <p className="text-[#9CA9B9] mt-4 text-[15px] leading-relaxed">
              Pipeline omnicanal · flujos automáticos · retención inteligente para tu marca de bienestar articular.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            {[
              { value: '31%', label: 'Tasa de recompra' },
              { value: '$166K', label: 'Ticket promedio' },
              { value: '127', label: 'Pedidos este mes' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-brand font-black text-2xl">{s.value}</p>
                <p className="text-[#9CA9B9] text-[11px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: tagline */}
        <p className="text-[#0A6340] text-xs relative z-10">Lipenza · Colombia · 2026</p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 bg-[#F0F7F3] flex items-center justify-center p-8">
        <div className="w-full max-w-[380px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-100 border border-brand-200 p-1">
              <Image src="/lipenza-iso.png" alt="Lipenza" width={40} height={40} className="object-contain w-full h-full" />
            </div>
            <div>
              <p className="font-bold text-[#0A6340] text-[15px] leading-none">Lipenza CRM</p>
              <p className="text-brand text-[10px] font-bold uppercase tracking-widest mt-0.5">Plataforma de clientes</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-[26px] font-bold text-[#0A6340] leading-tight">Bienvenida 👋</h1>
            <p className="text-[#0C6F42] text-sm mt-1">Accede a tu cuenta</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[13px] font-semibold text-[#0A6340] mb-1.5 block">Correo electrónico</label>
              <Input
                type="email"
                placeholder="admin@lipenza.co"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="bg-white border-[#E3EDE7] focus:border-brand focus:ring-brand/20 text-[#0A6340] placeholder:text-[#7FB79A]"
              />
            </div>

            <div>
              <label className="text-[13px] font-semibold text-[#0A6340] mb-1.5 block">Contraseña</label>
              <div className="relative">
                <Input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  className="pr-10 bg-white border-[#E3EDE7] focus:border-brand focus:ring-brand/20 text-[#0A6340]"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7FB79A] hover:text-brand transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-60 mt-2"
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
