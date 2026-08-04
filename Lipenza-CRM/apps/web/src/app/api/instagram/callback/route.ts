import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Callback de la conexión de Instagram: intercambia el code por un token de larga duración,
// lee el perfil y guarda/actualiza la cuenta como bandeja de Instagram.
export async function GET(req: NextRequest) {
  const { origin, searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const err  = searchParams.get('error_description') || searchParams.get('error');
  if (err)  return NextResponse.redirect(`${origin}/channels?error=${encodeURIComponent(err)}`);
  if (!code) return NextResponse.redirect(`${origin}/channels?error=sin_code`);

  const appId  = process.env.IG_APP_ID;
  const secret = process.env.IG_APP_SECRET;
  if (!appId || !secret) return NextResponse.redirect(`${origin}/channels?error=app_no_configurada`);

  const redirectUri = `${origin}/api/instagram/callback`;

  try {
    // 1) code -> token corto
    const form = new URLSearchParams({
      client_id: appId, client_secret: secret, grant_type: 'authorization_code',
      redirect_uri: redirectUri, code,
    });
    const shortRes = await fetch('https://api.instagram.com/oauth/access_token', { method: 'POST', body: form });
    const short = await shortRes.json();
    if (short.error_type || short.error || !short.access_token) {
      return NextResponse.redirect(`${origin}/channels?error=${encodeURIComponent(short.error_message || 'token_corto')}`);
    }

    // 2) token corto -> token largo (60 días)
    const longRes = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${secret}&access_token=${short.access_token}`);
    const long = await longRes.json();
    const token = long.access_token || short.access_token;

    // 3) perfil
    const meRes = await fetch(`https://graph.instagram.com/v23.0/me?fields=user_id,username,name&access_token=${token}`);
    const me = await meRes.json();
    const igUserId = me.user_id ? String(me.user_id) : String(short.user_id);

    // 4) guardar/actualizar cuenta
    const existing = await prisma.metaAccount.findFirst({ where: { channel: 'INSTAGRAM', accountId: igUserId } });
    const data = { channel: 'INSTAGRAM' as const, accountId: igUserId, instagramId: igUserId,
      accountName: me.username ? `Instagram · @${me.username}` : 'Instagram Directo', accessToken: token, isActive: true };
    if (existing) await prisma.metaAccount.update({ where: { id: existing.id }, data });
    else          await prisma.metaAccount.create({ data });

    // 5) suscribir la cuenta al webhook de mensajes
    await fetch(`https://graph.instagram.com/v23.0/${igUserId}/subscribed_apps?subscribed_fields=messages`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});

    return NextResponse.redirect(`${origin}/channels?connected=1`);
  } catch (e) {
    return NextResponse.redirect(`${origin}/channels?error=fallo_conexion`);
  }
}
