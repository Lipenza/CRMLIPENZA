/**
 * Crea en Meta las plantillas de WhatsApp de los flujos Lipenza (copys del Miro).
 * Usa el token + WABA de la línea WhatsApp Logístico (desde la base).
 * Las plantillas quedan en revisión (PENDING) hasta que Meta las apruebe.
 *
 *   npx tsx scripts/create-wa-templates.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE = 'https://graph.facebook.com/v23.0';

type Btn = { type: 'QUICK_REPLY'; text: string };
interface Tpl {
  name: string;
  category: 'UTILITY' | 'MARKETING';
  body: string;               // usa {{1}}, {{2}}…
  examples?: string[];        // un valor por variable
  buttons?: Btn[];
}

const TEMPLATES: Tpl[] = [
  // ── Adquisición ──
  { name: 'pedido_por_confirmar', category: 'UTILITY',
    body: 'Hola {{1}} 👋🌿 Tenemos listo tu pedido de {{2}} y estamos esperando despacharlo a {{3}}, {{4}} 📦💚 Solo necesitamos que confirmes tu pedido para ponerlo en camino cuanto antes. ¡Estamos aquí para ti! 🫶😊',
    examples: ['María', 'Kit Lipenza', 'Cra 10 #20-30', 'Bogotá'],
    buttons: [{ type: 'QUICK_REPLY', text: 'Confirmar' }, { type: 'QUICK_REPLY', text: 'Tengo dudas' }] },
  { name: 'pedido_recordatorio_confirmacion', category: 'UTILITY',
    body: 'Esperamos estés teniendo un hermoso día. Tenemos listo tu pedido de {{1}} para despacharlo a {{2}}, {{3}} 📦💚 Solo necesitamos que lo confirmes para ponerlo en camino cuanto antes ✨',
    examples: ['Kit Lipenza', 'Cra 10 #20-30', 'Bogotá'],
    buttons: [{ type: 'QUICK_REPLY', text: 'Confirmar' }, { type: 'QUICK_REPLY', text: 'Tengo dudas' }] },
  { name: 'pedido_confirmado', category: 'UTILITY',
    body: '¡Muchas gracias por confirmar! 🤍 En un momento nuestro equipo logístico empacará tu pedido con todo el cuidado que merece, y por este mismo medio te enviaremos tu número de guía para que lo rastrees cuando quieras 📦😊' },
  { name: 'pedido_dudas', category: 'UTILITY',
    body: 'Perfecto. En un momento una de nuestras asesoras se pondrá en contacto contigo para resolver tus dudas con todo el amor del mundo 💛' },
  { name: 'pedido_despachado', category: 'UTILITY',
    body: '¡Qué alegría contarte que tu pedido ya fue despachado! Aquí tienes los datos para el seguimiento 👇 📦 Guía: {{1}} 🚚 Transportadora: {{2}} Gracias por confiar en Lipenza, es un honor acompañarte 🤍',
    examples: ['MS-889231', 'Interrapidísimo'] },
  { name: 'guia_de_uso', category: 'UTILITY',
    body: 'Upsss… casi se nos olvida. En Lipenza queremos que nuestros productos realmente te funcionen, por eso creamos una guía completa con tips y manual de uso para que tus resultados sean excepcionales. Acá te la enviamos 💚' },
  { name: 'pedido_en_transito', category: 'UTILITY',
    body: '¡Hola {{1}}! Tu pedido ya va en camino 🚚 Está rumbo a tu ciudad. Puedes seguirlo con la guía {{2}} en {{3}}. Ya te falta poquito para empezar tu tratamiento 💛',
    examples: ['María', 'MS-889231', 'Interrapidísimo'] },
  { name: 'pedido_en_reparto', category: 'UTILITY',
    body: '¡{{1}}, hoy es el día! 🎉 Tu pedido ya está en reparto y el transportador va camino a tu dirección. Te recomendamos estar pendiente del teléfono. ¡Ya casi lo tienes en tus manos!',
    examples: ['María'] },
  { name: 'pedido_entrega_oficina', category: 'UTILITY',
    body: 'Hola {{1}} 👋 Tu pedido ya llegó a la oficina de {{2}} más cercana y te está esperando. 📍 Guía: {{3}} Recuerda llevar tu documento de identidad al retirarlo.',
    examples: ['María', 'Interrapidísimo', 'MS-889231'] },
  { name: 'pedido_entregado', category: 'UTILITY',
    body: '¡{{1}}, tu pedido ya fue entregado! 🎉 Nos alegra que Lipenza ya esté en tus manos. Ahora empieza lo más importante: la constancia. Toma las tabletas todos los días, una en la mañana y una en la noche 💛',
    examples: ['María'] },
  { name: 'pedido_novedad', category: 'UTILITY',
    body: 'Hola {{1}}, tu pedido presentó una novedad durante la entrega y no pudimos completarla. Puede ser algo sencillo como confirmar tu dirección o un dato de contacto. ¿Nos ayudas confirmando esta información para reprogramar la entrega?',
    examples: ['María'] },
  { name: 'pedido_devolucion', category: 'UTILITY',
    body: 'Hola {{1}}, tu pedido está en camino de vuelta a nuestra bodega. Nos gustaría saber por qué no pudiste recibirlo, para seguir mejorando. Quedamos muy atentos y pendientes para ayudarte.',
    examples: ['María'] },

  // ── Retención ──
  { name: 'ret_seguimiento_uso', category: 'UTILITY',
    body: '¡Hola {{1}}! 👋 ¿Cómo vas con tu producto? 🌱 Recuerda consumirlo todos los días, una tableta por la mañana y otra por la noche ⏰ para lograr mejores resultados.',
    examples: ['María'] },
  { name: 'ret_proceso_encuesta', category: 'MARKETING',
    body: 'Hola {{1}} 💛 Queremos saber cómo va tu proceso: ¿has notado que las molestias han disminuido? Creamos un formulario breve; si lo completas tendrás un 5% de descuento en tu próxima compra 🌿',
    examples: ['María'] },
  { name: 'ret_invitacion_recompra', category: 'MARKETING',
    body: '¡Hora de continuar con tu siguiente mes de bienestar! 🌿 La constancia garantiza resultados reales; el efecto de la cúrcuma se construye con el tiempo. ¿Quieres que te ayudemos a renovar ahora mismo?' },
  { name: 'ret_recetario', category: 'UTILITY',
    body: 'Seguimos contigo {{1}}! 🌟 Parte fundamental para mejores resultados es cómo te alimentas. Por eso preparamos un recetario completo para que también cuides tu bienestar desde la alimentación.',
    examples: ['María'] },
  { name: 'ret_recompra_promo', category: 'MARKETING',
    body: 'Te tenemos una sorpresita {{1}} 🎁 Haz hoy tu recompra con envío gratis + 10% OFF 🚀 Mantén tu ritual diario sin pausas. ¡Disponible solo por 24 horas!',
    examples: ['María'] },
  { name: 'ret_descuento_por_vencer', category: 'MARKETING',
    body: 'Hola {{1}} 💛 Tu descuento está a punto de vencer. Aprovecha el 10% + envío gratis para no detener tu proceso justo cuando está haciendo efecto.',
    examples: ['María'] },
  { name: 'ret_ultimo_recordatorio', category: 'MARKETING',
    body: 'Hola {{1}} 🚨 Último recordatorio: tu Lipenza está por acabarse y queremos que sigas cuidando tu bienestar 💎 Haz tu recompra ahora con 10% de descuento + envío gratis. Válido por 24 horas.',
    examples: ['María'] },
  { name: 'ret_suscripcion', category: 'MARKETING',
    body: '¿Quieres olvidarte de pedir cada mes? 👉 Suscríbete con 1 clic y recibe tu producto automáticamente con un descuento especial de fidelidad 💖' },

  // ── Carritos abandonados ──
  { name: 'carrito_1', category: 'MARKETING',
    body: 'Hola {{1}} 👋 Vimos que dejaste tu tratamiento Lipenza en el carrito. ¿Se te fue la señal o tuviste algún problema para completar el pago? Aquí lo tienes guardado: {{2}} Si tienes dudas antes de decidir, aquí estamos.',
    examples: ['María', 'https://lipenza.co/checkout/abc'] },
  { name: 'carrito_2', category: 'MARKETING',
    body: 'Hola {{1}} 💛 Sabemos que decidir no es fácil. Lipenza no es otro suplemento genérico de cúrcuma: trabaja desde adentro (inflamación) y desde afuera (movilidad y bienestar), justo donde empiezan las molestias articulares y musculares a partir de los 35-40. +1200 mujeres ya están en su ritual con Lipenza. Si tienes dudas, cuéntanos y te ayudamos a decidir con calma.',
    examples: ['María'] },
  { name: 'carrito_3', category: 'MARKETING',
    body: 'Hola {{1}}, para que no se quede pendiente: te dejamos 10% de descuento + envío gratis en tu tratamiento Lipenza, válido las próximas 24 horas. 👉 {{2}} No queremos que dejes pausado el momento de empezar a cuidar tu bienestar 💛',
    examples: ['María', 'https://lipenza.co/checkout/abc?desc=10'] },
];

async function main() {
  const acc = await prisma.metaAccount.findFirst({ where: { channel: 'WHATSAPP', accountName: { contains: 'Logístico' } } });
  if (!acc?.accessToken || !acc.wabaId) throw new Error('No hay línea de WhatsApp con WABA + token en la base.');
  const token = acc.accessToken, waba = acc.wabaId;

  // Adquisición = actualizaciones de pedido → van en la línea Logístico.
  // Retención/Carritos (MARKETING) se crean en la WABA de su línea (otro BM).
  const ADQ = new Set(['pedido_por_confirmar','pedido_recordatorio_confirmacion','pedido_confirmado','pedido_dudas','pedido_despachado','guia_de_uso','pedido_en_transito','pedido_en_reparto','pedido_entrega_oficina','pedido_entregado','pedido_novedad','pedido_devolucion']);
  const list = process.env.ALL === '1' ? TEMPLATES : TEMPLATES.filter(t => ADQ.has(t.name));
  console.log(`Creando ${list.length} plantillas en WABA ${waba}…\n`);

  let ok = 0, fail = 0;
  for (const t of list) {
    const components: any[] = [];
    const body: any = { type: 'BODY', text: t.body };
    if (t.examples?.length) body.example = { body_text: [t.examples] };
    components.push(body);
    if (t.buttons?.length) components.push({ type: 'BUTTONS', buttons: t.buttons });

    const res = await fetch(`${BASE}/${waba}/message_templates`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: t.name, language: 'es', category: t.category, components }),
    });
    const data = await res.json();
    if (res.ok && !data.error) {
      console.log(`✓ ${t.name.padEnd(32)} ${data.status || 'PENDING'} (${t.category})`);
      ok++;
    } else {
      const e = data.error || {};
      console.log(`✗ ${t.name.padEnd(32)} ${e.error_user_title || e.message || 'error'}`);
      fail++;
    }
  }
  console.log(`\nCreadas: ${ok} · Fallidas: ${fail} · Total: ${TEMPLATES.length}`);
  await prisma.$disconnect();
}

main().catch(async e => { console.error('ERROR:', e.message); await prisma.$disconnect(); process.exit(1); });
