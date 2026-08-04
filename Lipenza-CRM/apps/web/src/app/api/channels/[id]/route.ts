import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, unauthorized } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

// Elimina (desconecta) una cuenta/canal. Las conversaciones se conservan (sin línea).
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  // Soltar la referencia en las conversaciones para no romper la FK.
  await prisma.conversation.updateMany({ where: { metaAccountId: params.id }, data: { metaAccountId: null } });
  await prisma.metaAccount.delete({ where: { id: params.id } }).catch(() => {});

  return NextResponse.json({ ok: true });
}
