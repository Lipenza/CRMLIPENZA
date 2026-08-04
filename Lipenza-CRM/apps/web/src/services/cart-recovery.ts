import { prisma } from '@/lib/prisma';
import { sendWhatsAppTemplate } from './whatsapp';
import { credsFromAccount } from '@/lib/meta-accounts';

/**
 * Motor de RECUPERACIÓN DE CARRITOS (Shopify checkout abandonado).
 * El flujo "Carrito abandonado" (trigger ABANDONED_CART) define en `steps` la
 * secuencia por tiempo desde `abandonedAt`:
 *   0m → carrito_1 · 45m → (check recuperado) · 24h → carrito_2 · 55h → carrito_3 · 7d → retargeting Ads
 * Este motor corre en el cron: envía la plantilla del paso que vence, una sola vez,
 * y solo mientras el carrito siga OPEN (si la clienta compró, queda RECOVERED y se detiene).
 *
 * Nace inactivo: solo actúa sobre el flujo con isActive=true (se enciende en la migración,
 * junto con el webhook de checkouts de Shopify que crea los AbandonedCart).
 */

const MIN = 60_000, HOUR = 3_600_000, DAY = 86_400_000;
const WINDOW_MS = 6 * HOUR;   // ventana para cada paso: evita disparar pasos ya vencidos al activar/importar
const MAX_AGE_MS = 8 * DAY;   // solo carritos recientes (más allá del último paso ya no aplica)

const firstName = (n?: string | null) => (n || '').trim().split(/\s+/)[0] || '';
const KNOWN_VARS: Record<string, number> = { carrito_1: 2, carrito_2: 1, carrito_3: 2 };

/** "0m" | "45m" | "24h" | "55h" | "7d" → milisegundos (o null si no aplica). */
function offsetMs(after: string): number | null {
  const m = String(after || '').trim().match(/^(\d+)\s*([mhd])$/i);
  if (!m) return null;
  const n = Number(m[1]), u = m[2].toLowerCase();
  return u === 'm' ? n * MIN : u === 'h' ? n * HOUR : n * DAY;
}

async function defaultWaCreds() {
  const acc = await prisma.metaAccount.findFirst({
    where: { channel: 'WHATSAPP', isActive: true },
    orderBy: { createdAt: 'asc' },
  });
  return acc ? credsFromAccount(acc) : undefined;
}

/** Cliente del carrito: el vinculado, o uno encontrado/creado por teléfono (checkout de invitado). */
async function resolveCustomer(cart: any): Promise<{ id: string; name: string; phone: string; tags?: string[] } | null> {
  if (cart.customer) return cart.customer;
  const phone = (cart.phone || '').trim();
  if (!phone) return null;
  const existing = await prisma.customer.findUnique({ where: { phone } });
  if (existing) return existing;
  return prisma.customer.create({
    data: { phone, name: 'Cliente', email: cart.email || null, originChannel: 'WHATSAPP' as any, status: 'NEW' as any },
  });
}

/** Registra el envío saliente en la conversación de WhatsApp del cliente. */
async function recordOutbound(customerId: string, templateName: string, params: string[], wamid?: string) {
  let conversation = await prisma.conversation.findFirst({
    where: { customerId, channel: 'WHATSAPP', status: { not: 'RESOLVED' } },
  });
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { customerId, channel: 'WHATSAPP', status: 'OPEN', lastMessageAt: new Date() },
    });
  }
  const tpl = await prisma.messageTemplate.findFirst({ where: { name: templateName } });
  const body = tpl?.content
    ? tpl.content.replace(/\{\{(\d+)\}\}/g, (_, n) => params[Number(n) - 1] ?? `{{${n}}}`)
    : `[Plantilla ${templateName}]`;

  await prisma.message.create({
    data: { conversationId: conversation.id, direction: 'OUTBOUND', content: body, status: 'SENT', externalId: wamid ?? null },
  });
  await prisma.conversation.update({ where: { id: conversation.id }, data: { lastMessageAt: new Date() } });
}

export async function processCartRecovery(): Promise<{ enviados: number; retargeting: number }> {
  const flow = await prisma.flowTemplate.findFirst({
    where: { trigger: 'ABANDONED_CART' as any, isActive: true },
  });
  if (!flow) return { enviados: 0, retargeting: 0 };

  const steps = Array.isArray(flow.steps) ? (flow.steps as any[]) : [];
  const creds = await defaultWaCreds();
  const now = Date.now();
  let enviados = 0, retargeting = 0;

  const carts = await prisma.abandonedCart.findMany({
    where: { status: 'OPEN', abandonedAt: { gte: new Date(now - MAX_AGE_MS) } },
    include: { customer: true },
    orderBy: { abandonedAt: 'desc' },
    take: 2000,
  });

  for (const cart of carts) {
    const elapsed = now - new Date(cart.abandonedAt).getTime();

    for (const step of steps) {
      const off = offsetMs(step.after);
      if (off === null) continue;
      // El paso "vence" en una ventana acotada: no revive pasos ya pasados al activar/importar.
      if (!(elapsed >= off && elapsed < off + WINDOW_MS)) continue;

      // ── Paso de acción (7d → retargeting Ads): sin mensaje ──
      // Al marcar el carrito LOST deja de cargarse: no hace falta chequear duplicado.
      if (step.action === 'retargeting_ads') {
        const customer = await resolveCustomer(cart);
        if (customer && !customer.tags?.includes('retargeting-ads')) {
          await prisma.customer.update({ where: { id: customer.id }, data: { tags: { push: 'retargeting-ads' } } }).catch(() => {});
        }
        await prisma.abandonedCart.update({ where: { id: cart.id }, data: { status: 'LOST' } });
        if (customer) {
          await prisma.flowExecution.create({
            data: { flowTemplateId: flow.id, customerId: customer.id, cartId: cart.id, status: 'completed', completedAt: new Date(), metadata: { action: 'retargeting_ads' } },
          });
        }
        retargeting++;
        continue;
      }

      // ── Pasos con plantilla (carrito_1/2/3) ──
      if (!step.template) continue;

      const done = await prisma.flowExecution.findFirst({
        where: { flowTemplateId: flow.id, cartId: cart.id, metadata: { path: ['template'], equals: step.template } },
      });
      if (done) continue;

      const customer = await resolveCustomer(cart);
      if (!customer) continue; // sin teléfono no hay a quién escribir

      const tpl = await prisma.messageTemplate.findFirst({ where: { name: step.template } });
      const nVars = tpl?.variables?.length ?? KNOWN_VARS[step.template] ?? 1;
      const full = [firstName(customer.name), cart.checkoutUrl || ''];
      const params = full.slice(0, nVars);
      if (nVars >= 2 && !cart.checkoutUrl) continue; // la plantilla necesita el link y no lo hay

      try {
        const res = await sendWhatsAppTemplate(customer.phone, step.template, tpl?.language || 'es', params, creds);
        await prisma.flowExecution.create({
          data: { flowTemplateId: flow.id, customerId: customer.id, cartId: cart.id, status: 'sent', completedAt: new Date(), metadata: { template: step.template, after: step.after } },
        });
        await prisma.abandonedCart.update({
          where: { id: cart.id },
          data: { reminderSentAt: new Date(), reminderCount: { increment: 1 }, customerId: cart.customerId ?? customer.id },
        });
        await recordOutbound(customer.id, step.template, params, res?.messages?.[0]?.id);
        enviados++;
      } catch (e) {
        console.error('[Carrito] Falló el envío de', step.template, e);
      }
    }
  }

  return { enviados, retargeting };
}
