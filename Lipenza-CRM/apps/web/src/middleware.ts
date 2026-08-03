import { NextRequest, NextResponse } from 'next/server';
import { demoResponse } from '@/lib/demo-data';

/**
 * MODO DEMO — intercepta las llamadas /api/* y responde con datos de ejemplo
 * cuando DEMO_MODE=1 (ver .env.local). Permite recorrer todo el CRM sin backend.
 * Al conectar Supabase/DB reales: pon DEMO_MODE=0 (o borra .env.local) y este
 * middleware deja pasar todo hacia las rutas reales.
 */
export async function middleware(req: NextRequest) {
  if (process.env.DEMO_MODE !== '1') return NextResponse.next();

  const { pathname } = req.nextUrl;
  const method = req.method;

  let body: any = undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    body = await req.clone().json().catch(() => undefined);
  }

  const data = demoResponse(pathname, method, body);
  if (data === undefined) return NextResponse.next();

  return NextResponse.json(data);
}

export const config = {
  matcher: '/api/:path*',
};
