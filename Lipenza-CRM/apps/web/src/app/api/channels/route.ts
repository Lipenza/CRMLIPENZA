import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, unauthorized } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

// Lista los canales conectados (WhatsApp / Instagram / Facebook).
// Para Instagram trae el PERFIL en vivo (usuario, nombre, foto) desde graph.instagram.com,
// que es lo que la revisión de Meta pide mostrar dentro de la app.
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const accounts = await prisma.metaAccount.findMany({ orderBy: { createdAt: 'asc' } });

  const data = await Promise.all(accounts.map(async (a) => {
    const base = {
      id: a.id,
      channel: a.channel,
      accountName: a.accountName,
      phoneNumber: a.phoneNumber,
      isActive: a.isActive,
      profile: null as null | { username?: string; name?: string; picture?: string; followers?: number; accountType?: string },
    };

    if (a.channel === 'INSTAGRAM' && a.accessToken) {
      try {
        const url = `https://graph.instagram.com/v23.0/me?fields=user_id,username,name,account_type,profile_picture_url,followers_count&access_token=${encodeURIComponent(a.accessToken)}`;
        const r = await fetch(url, { cache: 'no-store' });
        const p = await r.json();
        if (!p.error) {
          base.profile = {
            username: p.username,
            name: p.name,
            picture: p.profile_picture_url,
            followers: p.followers_count,
            accountType: p.account_type,
          };
        }
      } catch { /* perfil no disponible */ }
    }
    return base;
  }));

  return NextResponse.json({ data });
}
