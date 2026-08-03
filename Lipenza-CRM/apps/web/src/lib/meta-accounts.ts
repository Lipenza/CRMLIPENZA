import { prisma } from './prisma';
import type { WaCreds } from '@/services/whatsapp';

/**
 * Multi-número de WhatsApp.
 * Cada línea es una fila en meta_accounts:
 *   accountId    = phone_number_id de Meta (identificador de la línea)
 *   accountName  = nombre visible de la bandeja ("Ventas", "Soporte"…)
 *   phoneNumber  = número legible (+57…)
 *   wabaId       = WhatsApp Business Account id
 *   accessToken  = token permanente de esa línea
 */

/** Encuentra la línea a la que llegó un mensaje entrante (por phone_number_id). */
export async function accountByPhoneNumberId(phoneNumberId?: string | null) {
  if (!phoneNumberId) return null;
  return prisma.metaAccount.findFirst({
    where: { channel: 'WHATSAPP', accountId: phoneNumberId, isActive: true },
  });
}

/** Credenciales de una cuenta (para responder desde la línea correcta). */
export async function credsForAccount(metaAccountId?: string | null): Promise<WaCreds | undefined> {
  if (!metaAccountId) return undefined;
  const acc = await prisma.metaAccount.findUnique({ where: { id: metaAccountId } });
  if (!acc) return undefined;
  return { phoneNumberId: acc.accountId, token: acc.accessToken, wabaId: acc.wabaId };
}

export function credsFromAccount(acc: { accountId: string; accessToken: string | null; wabaId: string | null }): WaCreds {
  return { phoneNumberId: acc.accountId, token: acc.accessToken, wabaId: acc.wabaId };
}

/** Lista de líneas activas — alimenta el selector de bandejas del inbox. */
export async function listWhatsAppAccounts() {
  return prisma.metaAccount.findMany({
    where: { channel: 'WHATSAPP', isActive: true },
    orderBy: { createdAt: 'asc' },
    select: { id: true, accountName: true, phoneNumber: true, channel: true },
  });
}
