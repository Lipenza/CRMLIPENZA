import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, unauthorized } from '@/lib/auth-server';
import { listWhatsAppAccounts } from '@/lib/meta-accounts';

// Líneas de WhatsApp activas → alimenta el selector de bandejas del inbox.
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const accounts = await listWhatsAppAccounts();
  return NextResponse.json({ data: accounts });
}
