'use client';
import { useEffect, useState } from 'react';
import { MessageSquare, Instagram, Facebook, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Channel {
  id: string;
  channel: 'WHATSAPP' | 'INSTAGRAM' | 'FACEBOOK';
  accountName: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  profile: null | { username?: string; name?: string; picture?: string; followers?: number; accountType?: string };
}

const CH = {
  WHATSAPP:  { label: 'WhatsApp',  Icon: MessageSquare, color: '#1A7A4A', bg: '#E8F8F0' },
  INSTAGRAM: { label: 'Instagram', Icon: Instagram,     color: '#9B2C6F', bg: '#FDE8F4' },
  FACEBOOK:  { label: 'Facebook',  Icon: Facebook,      color: '#1A4A9B', bg: '#E7EFFE' },
} as const;

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading]   = useState(true);
  const connected = typeof window !== 'undefined' && new URLSearchParams(location.search).get('connected');

  function load() {
    api.get<{ data: Channel[] }>('/api/channels')
      .then(r => setChannels(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  async function remove(c: Channel) {
    if (!confirm(`¿Desconectar "${c.accountName}"? Las conversaciones se conservan.`)) return;
    await api.delete(`/api/channels/${c.id}`).catch(() => {});
    load();
  }

  return (
    <div className="h-full overflow-y-auto bg-[#F6F9F7]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-extrabold text-[#0A6340]">Cuentas conectadas</h1>
          <a href="/api/instagram/connect"
             className="inline-flex items-center gap-2 bg-[#0A6340] hover:bg-[#063D28] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Conectar Instagram
          </a>
        </div>
        <p className="text-sm text-[#0C6F42] mb-6">Canales de mensajería vinculados al CRM (WhatsApp, Instagram y Facebook).</p>

        {connected && (
          <div className="mb-5 flex items-center gap-2 bg-[#E8F8F0] border border-[#B7DFD0] text-[#1A7A4A] text-sm font-medium px-4 py-3 rounded-xl">
            <CheckCircle2 className="w-4 h-4" /> Cuenta de Instagram conectada correctamente.
          </div>
        )}

        {loading ? (
          <p className="text-[#7FB79A] text-sm">Cargando cuentas…</p>
        ) : channels.length === 0 ? (
          <p className="text-[#7FB79A] text-sm">Aún no hay cuentas conectadas. Usa “Conectar Instagram” o registra tus líneas de WhatsApp.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {channels.map(c => {
              const cfg = CH[c.channel];
              return (
                <div key={c.id} className="bg-white border border-[#E3EDE7] rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    {c.channel === 'INSTAGRAM' && c.profile?.picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.profile.picture} alt="" className="w-11 h-11 rounded-full object-cover border border-[#E3EDE7]" />
                    ) : (
                      <span className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: cfg.bg, color: cfg.color }}>
                        <cfg.Icon className="w-5 h-5" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-[#0A6340] text-[15px] truncate">{c.accountName || cfg.label}</p>
                      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: cfg.color }}>{cfg.label}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${c.isActive ? 'bg-[#E8F8F0] text-[#1A7A4A]' : 'bg-gray-100 text-gray-400'}`}>
                        {c.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                      <button onClick={() => remove(c)} title="Desconectar"
                        className="text-gray-300 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Perfil de Instagram (lo que la revisión de Meta pide mostrar) */}
                  {c.channel === 'INSTAGRAM' && c.profile && (
                    <div className="space-y-1.5 text-sm border-t border-[#E3EDE7] pt-3">
                      {c.profile.username && <div className="flex justify-between"><span className="text-[#7FB79A]">Usuario</span><span className="font-semibold text-[#0A6340]">@{c.profile.username}</span></div>}
                      {c.profile.name && <div className="flex justify-between"><span className="text-[#7FB79A]">Nombre</span><span className="font-semibold text-[#0A6340]">{c.profile.name}</span></div>}
                      {typeof c.profile.followers === 'number' && <div className="flex justify-between"><span className="text-[#7FB79A]">Seguidores</span><span className="font-semibold text-[#0A6340]">{c.profile.followers.toLocaleString()}</span></div>}
                      {c.profile.accountType && <div className="flex justify-between"><span className="text-[#7FB79A]">Tipo</span><span className="font-semibold text-[#0A6340]">{c.profile.accountType}</span></div>}
                    </div>
                  )}

                  {c.channel === 'WHATSAPP' && c.phoneNumber && (
                    <div className="text-sm border-t border-[#E3EDE7] pt-3 flex justify-between">
                      <span className="text-[#7FB79A]">Número</span><span className="font-semibold text-[#0A6340]">{c.phoneNumber}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
