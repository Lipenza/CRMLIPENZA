/**
 * Registra los flujos de RETENCIÓN (por unidades) y CARRITOS en /flows.
 * Nacen APAGADOS. El motor de ejecución de estos se construye/prueba en la migración;
 * por ahora quedan visibles con su calendario y plantillas.
 *
 *   npx tsx scripts/seed-flows-extra.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// steps: {day, template} para retención · {after, template} para carritos
const FLOWS = [
  {
    trigger: 'DAYS_AFTER_DELIVERY', name: 'Retención · 1 unidad',
    description: 'Postcompra 1 unidad: seguimiento, encuesta, recompra y descuentos (día 8→33) + suscripción.',
    conditions: [{ field: 'units', op: '=', value: 1 }],
    steps: [
      { day: 8,  template: 'ret_seguimiento_uso' },
      { day: 15, template: 'ret_proceso_encuesta' },
      { day: 25, template: 'ret_invitacion_recompra' },
      { day: 30, template: 'ret_recetario' },
      { day: 32, template: 'ret_recompra_promo' },
      { day: 33, template: 'ret_descuento_por_vencer' },
      { day: 33, template: 'ret_suscripcion' },
    ],
  },
  {
    trigger: 'DAYS_AFTER_DELIVERY', name: 'Retención · 2 unidades',
    description: 'Postcompra 2 unidades: seguimiento y recompra escalonada (día 8→61) + suscripción.',
    conditions: [{ field: 'units', op: '=', value: 2 }],
    steps: [
      { day: 8,  template: 'ret_seguimiento_uso' },
      { day: 15, template: 'ret_recetario' },
      { day: 25, template: 'ret_invitacion_recompra' },
      { day: 30, template: 'ret_proceso_encuesta' },
      { day: 40, template: 'ret_seguimiento_uso' },
      { day: 50, template: 'ret_recetario' },
      { day: 60, template: 'ret_recompra_promo' },
      { day: 61, template: 'ret_ultimo_recordatorio' },
      { day: 61, template: 'ret_suscripcion' },
    ],
  },
  {
    trigger: 'DAYS_AFTER_DELIVERY', name: 'Retención · 3 unidades',
    description: 'Postcompra 3 unidades: seguimiento y recompra escalonada (día 8→90) + suscripción.',
    conditions: [{ field: 'units', op: '=', value: 3 }],
    steps: [
      { day: 8,  template: 'ret_seguimiento_uso' },
      { day: 15, template: 'ret_recetario' },
      { day: 25, template: 'ret_invitacion_recompra' },
      { day: 30, template: 'ret_proceso_encuesta' },
      { day: 34, template: 'ret_seguimiento_uso' },
      { day: 60, template: 'ret_recetario' },
      { day: 75, template: 'ret_invitacion_recompra' },
      { day: 89, template: 'ret_recompra_promo' },
      { day: 90, template: 'ret_ultimo_recordatorio' },
      { day: 90, template: 'ret_suscripcion' },
    ],
  },
  {
    trigger: 'ABANDONED_CART', name: 'Carrito abandonado',
    description: 'Secuencia de recuperación: inmediato → 45 min → 24 h (testimonio) → 55 h (10% desc) → 7 días a retargeting Ads.',
    conditions: [],
    steps: [
      { after: '0m',  template: 'carrito_1' },
      { after: '45m', check: 'recuperado' },
      { after: '24h', template: 'carrito_2' },
      { after: '55h', template: 'carrito_3' },
      { after: '7d',  action: 'retargeting_ads' },
    ],
  },
];

async function main() {
  for (const f of FLOWS) {
    const existing = await prisma.flowTemplate.findFirst({ where: { name: f.name } });
    const data = { name: f.name, description: f.description, trigger: f.trigger as any, isActive: false, conditions: f.conditions as any, steps: f.steps as any };
    if (existing) { await prisma.flowTemplate.update({ where: { id: existing.id }, data }); console.log('actualizado  ', f.name); }
    else { await prisma.flowTemplate.create({ data }); console.log('creado       ', f.name, ' (apagado)'); }
  }
  await prisma.$disconnect();
}
main().catch(async e => { console.error('ERROR:', e.message); await prisma.$disconnect(); process.exit(1); });
