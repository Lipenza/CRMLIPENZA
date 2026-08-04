import { prisma } from '@/lib/prisma';
import { sendWhatsAppTemplate } from './whatsapp';
import { credsFromAccount } from '@/lib/meta-accounts';

/**
 * Motor de RETENCIÓN (postcompra).
 * Los flujos "Retención · N unidades" (trigger DAYS_AFTER_DELIVERY) definen, en `steps`,
 * qué plantilla enviar en cada día ({day, template}) y en `conditions` el tier de unidades.
 * Este motor, cada vez que corre el cron, revisa las órdenes ENTREGADAS y envía la
 * plantilla del día que corresponda, una sola vez por cliente/flujo/día.
 *
 * Nace inactivo: solo actúa sobre flujos con isActive=true (se encienden en la migración).
 */

const DAY = 86_400_000;

const firstName = (name?: string | null) => (name || '').trim().split(/\s+/)[0] || '';

/** Lee el tamaño del pack desde el texto de la variante/producto.
 *  Shopify vende Lipenza por variantes: "Paquete x 1/2/3", "Paquete de 4 unidades".
 *  También cubre "N frascos" / "N meses" (como aparece en la landing). 0 si no se detecta. */
function packSize(text: string): number {
  const s = (text || '').toLowerCase();
  let m = s.match(/x\s*(\d+)/);                         // "paquete x 3", "kit x3"
  if (m) return Number(m[1]);
  m = s.match(/(\d+)\s*(unidad|frasco|mes)/);           // "4 unidades", "2 frascos", "3 meses"
  if (m) return Number(m[1]);
  return 0;
}

/** Unidades compradas = tamaño del pack de la orden ancla (× cantidad).
 *  Los flujos cubren 1/2/3; un pack de 4+ recibe el de 3 meses (tope 3). */
function unitsOf(order: any): number {
  const items = Array.isArray(order?.items) ? order.items : [];
  let total = 0;
  for (const it of items) {
    const text = [it?.name, it?.title, it?.variant, it?.variant_title, it?.variantTitle, it?.sku, it?.description]
      .filter(Boolean).join(' ');
    const per = packSize(text) || 1;                    // si no se detecta el pack, asume 1 por unidad
    total += per * (Number(it?.quantity) || 1);
  }
  return total < 1 ? 1 : Math.min(total, 3);
}

/** Línea de WhatsApp por defecto para los envíos de retención (la primera activa). */
async function defaultWaCreds() {
  const acc = await prisma.metaAccount.findFirst({
    where: { channel: 'WHATSAPP', isActive: true },
    orderBy: { createdAt: 'asc' },
  });
  return acc ? credsFromAccount(acc) : undefined;
}

/** Registra el envío saliente en la conversación de WhatsApp del cliente. */
async function recordOutbound(customerId: string, templateName: string, nombre: string, wamid?: string) {
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
    ? tpl.content.replace(/\{\{(\d+)\}\}/g, (_, n) => (Number(n) === 1 ? nombre : `{{${n}}}`))
    : `[Plantilla ${templateName}]`;

  await prisma.message.create({
    data: { conversationId: conversation.id, direction: 'OUTBOUND', content: body, status: 'SENT', externalId: wamid ?? null },
  });
  await prisma.conversation.update({ where: { id: conversation.id }, data: { lastMessageAt: new Date() } });
}

export async function processRetention(): Promise<{ enviados: number }> {
  const flows = await prisma.flowTemplate.findMany({
    where: { trigger: 'DAYS_AFTER_DELIVERY' as any, isActive: true },
  });
  if (!flows.length) return { enviados: 0 };

  const creds = await defaultWaCreds();
  const now = Date.now();
  let enviados = 0;

  // Órdenes entregadas = ancla del "día postcompra".
  const orders = await prisma.order.findMany({
    where: { deliveredAt: { not: null } },
    include: { customer: true },
    orderBy: { deliveredAt: 'desc' },
    take: 2000,
  });

  for (const order of orders) {
    const days = Math.floor((now - new Date(order.deliveredAt as Date).getTime()) / DAY);
    if (days < 1 || days > 120) continue;
    const units = unitsOf(order);

    for (const flow of flows) {
      // Filtro por tier de unidades (condición {field:'units', value:N}).
      const conds = Array.isArray(flow.conditions) ? (flow.conditions as any[]) : [];
      const unitCond = conds.find(c => c?.field === 'units');
      if (unitCond && Number(unitCond.value) !== units) continue;

      // ¿Hay una plantilla programada para HOY (este día postcompra)?
      const steps = Array.isArray(flow.steps) ? (flow.steps as any[]) : [];
      const daySteps = steps.filter(s => Number(s?.day) === days && s?.template);
      if (!daySteps.length) continue;

      for (const step of daySteps) {
        // Dedup por (día + plantilla): una plantilla que se repite en otro día
        // (ej. ret_seguimiento_uso en día 8 y 40) sí se vuelve a enviar.
        const already = await prisma.flowExecution.findFirst({
          where: {
            flowTemplateId: flow.id,
            customerId: order.customerId,
            AND: [
              { metadata: { path: ['day'], equals: days } },
              { metadata: { path: ['template'], equals: step.template } },
            ],
          },
        });
        if (already) continue;

        try {
          const nombre = firstName(order.customer.name);
          const tpl = await prisma.messageTemplate.findFirst({ where: { name: step.template } });
          const nVars = tpl?.variables?.length ?? 1;
          const params = nVars >= 1 ? [nombre] : [];
          const res = await sendWhatsAppTemplate(order.customer.phone, step.template, tpl?.language || 'es', params, creds);

          await prisma.flowExecution.create({
            data: {
              flowTemplateId: flow.id, customerId: order.customerId, orderId: order.id,
              status: 'sent', completedAt: new Date(),
              metadata: { day: days, template: step.template, stage: 'retencion' },
            },
          });
          await recordOutbound(order.customerId, step.template, nombre, res?.messages?.[0]?.id);
          enviados++;
        } catch (e) {
          console.error('[Retención] Falló el envío de', step.template, e);
        }
      }
    }
  }

  return { enviados };
}
