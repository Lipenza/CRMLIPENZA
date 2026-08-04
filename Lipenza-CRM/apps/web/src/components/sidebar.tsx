'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare, Users, ShoppingBag, BarChart3, Zap,
  FileText, LogOut, ShoppingCart, AtSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearAuth, getUser, AuthUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from './ui/avatar';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/dashboard',       icon: BarChart3,     label: 'Dashboard',  badge: 0 },
  { href: '/inbox',           icon: MessageSquare, label: 'Bandeja',    badge: 3 },
  { href: '/customers',       icon: Users,         label: 'Clientes',   badge: 0 },
  { href: '/orders',          icon: ShoppingBag,   label: 'Pedidos',    badge: 0 },
  { href: '/abandoned-carts', icon: ShoppingCart,  label: 'Carritos',   badge: 5 },
  { href: '/flows',           icon: Zap,           label: 'Flujos',     badge: 0 },
  { href: '/templates',       icon: FileText,      label: 'Plantillas', badge: 0 },
  { href: '/channels',        icon: AtSign,        label: 'Cuentas',    badge: 0 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => { setUser(getUser()); }, []);

  const initials = (n: string) => n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-white border-r border-gray-200 flex flex-col z-30">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-brand-50 flex items-center justify-center border border-brand-100 p-1">
            <Image
              src="/lipenza-iso.png"
              alt="Lipenza"
              width={32}
              height={32}
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900 leading-none">Lipenza</p>
            <p className="text-[10px] text-[#0F7D4B] font-semibold uppercase tracking-widest mt-0.5">CRM</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-[#0A6340] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </span>
              {badge > 0 && !active && (
                <span className="min-w-[20px] h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1.5">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-gray-50 group cursor-pointer transition-colors">
          <Avatar className="w-7 h-7 shrink-0">
            <AvatarFallback className="text-xs bg-brand-100 text-brand-700">
              {initials(user?.name || 'US')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate leading-none">{user?.name || 'Usuario'}</p>
            <p className="text-xs text-gray-400 capitalize mt-0.5">{user?.role?.toLowerCase() || 'agente'}</p>
          </div>
          <button
            onClick={() => { clearAuth(); router.push('/login'); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-gray-100"
          >
            <LogOut className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>
    </aside>
  );
}
