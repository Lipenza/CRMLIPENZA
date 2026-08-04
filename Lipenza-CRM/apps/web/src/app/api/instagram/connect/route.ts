import { NextRequest, NextResponse } from 'next/server';

// Inicia el flujo de conexión de Instagram (OAuth con inicio de sesión de Instagram).
// Redirige a la autorización de Instagram; al volver, /api/instagram/callback guarda la cuenta.
export async function GET(req: NextRequest) {
  const appId = process.env.IG_APP_ID;
  if (!appId) return NextResponse.json({ error: 'IG_APP_ID no configurado' }, { status: 500 });

  const origin = new URL(req.url).origin;
  const redirectUri = `${origin}/api/instagram/callback`;
  const scope = 'instagram_business_basic,instagram_business_manage_messages';

  const url =
    `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1` +
    `&client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}`;

  return NextResponse.redirect(url);
}
