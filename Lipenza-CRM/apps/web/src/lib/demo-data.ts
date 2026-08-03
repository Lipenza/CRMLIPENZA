/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MODO DEMO — datos de ejemplo para ver el CRM sin backend.
 *  Se activa con DEMO_MODE=1 (ver .env.local) y lo consume src/middleware.ts.
 *  Para conectar el backend real: apaga DEMO_MODE y borra este archivo + middleware.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const now = () => Date.now();
const iso = (minsAgo: number) => new Date(now() - minsAgo * 60_000).toISOString();
const days = (n: number) => n * 24 * 60;

const AGENT = { id: 'agent-1', name: 'Ana Gómez' };

// ── Clientes ────────────────────────────────────────────────────────────────
export const DEMO_CUSTOMERS = [
  { id: 'cust-1', name: 'María Fernanda Ríos', phone: '+57 300 214 5567', email: 'mafe.rios@gmail.com', city: 'Bogotá', department: 'Cundinamarca', originChannel: 'WHATSAPP', status: 'RECURRING', ltv: 540000, totalOrders: 4, tags: ['recompra', 'fiel'], notes: 'Sufre de artrosis de rodilla. Muy contenta con los resultados, ya va por el 4º kit.', firstContactAt: iso(days(120)), firstPurchaseAt: iso(days(110)), lastPurchaseAt: iso(days(8)) },
  { id: 'cust-2', name: 'Luz Adriana Gómez', phone: '+57 310 887 2210', email: 'luzagomez@hotmail.com', city: 'Medellín', department: 'Antioquia', originChannel: 'INSTAGRAM', status: 'ACTIVE', ltv: 166000, totalOrders: 1, tags: ['dolor rodilla'], notes: 'Primer pedido. Preguntó por tiempos de entrega a Medellín.', firstContactAt: iso(days(14)), firstPurchaseAt: iso(days(10)), lastPurchaseAt: iso(days(10)) },
  { id: 'cust-3', name: 'Carmen Elena Ortiz', phone: '+57 320 456 7788', email: null, city: 'Cali', department: 'Valle del Cauca', originChannel: 'WHATSAPP', status: 'AT_RISK', ltv: 320000, totalOrders: 2, tags: ['artritis'], notes: 'No compra hace 52 días. Enviar campaña de recompra.', firstContactAt: iso(days(90)), firstPurchaseAt: iso(days(80)), lastPurchaseAt: iso(days(52)) },
  { id: 'cust-4', name: 'Gloria Patricia Núñez', phone: '+57 315 223 9911', email: 'glorianunez@gmail.com', city: 'Barranquilla', department: 'Atlántico', originChannel: 'FACEBOOK', status: 'NEW', ltv: 0, totalOrders: 0, tags: ['interesada'], notes: 'Preguntó por precio y contraindicaciones. Aún no compra.', firstContactAt: iso(60), firstPurchaseAt: null, lastPurchaseAt: null },
  { id: 'cust-5', name: 'Rosa Helena Martínez', phone: '+57 301 774 1120', email: 'rhmartinez@gmail.com', city: 'Bucaramanga', department: 'Santander', originChannel: 'WHATSAPP', status: 'RECURRING', ltv: 720000, totalOrders: 5, tags: ['mayorista', 'fiel'], notes: 'Revende en su barrio. Pide 3 kits cada mes.', firstContactAt: iso(days(200)), firstPurchaseAt: iso(days(190)), lastPurchaseAt: iso(days(5)) },
  { id: 'cust-6', name: 'Sandra Milena Cardona', phone: '+57 312 990 3345', email: null, city: 'Pereira', department: 'Risaralda', originChannel: 'INSTAGRAM', status: 'ACTIVE', ltv: 166000, totalOrders: 1, tags: [], notes: '', firstContactAt: iso(days(20)), firstPurchaseAt: iso(days(18)), lastPurchaseAt: iso(days(18)) },
  { id: 'cust-7', name: 'Beatriz Aguirre', phone: '+57 300 112 6677', email: 'beatriz.aguirre@gmail.com', city: 'Bogotá', department: 'Cundinamarca', originChannel: 'WHATSAPP', status: 'LOST', ltv: 166000, totalOrders: 1, tags: ['no responde'], notes: 'Compró una vez y no volvió a responder.', firstContactAt: iso(days(160)), firstPurchaseAt: iso(days(150)), lastPurchaseAt: iso(days(150)) },
  { id: 'cust-8', name: 'Ana Lucía Torres', phone: '+57 318 445 8890', email: 'analucia.t@gmail.com', city: 'Cartagena', department: 'Bolívar', originChannel: 'WHATSAPP', status: 'ACTIVE', ltv: 249000, totalOrders: 2, tags: ['dolor espalda'], notes: 'Dolor lumbar crónico. Recompró a los 25 días.', firstContactAt: iso(days(40)), firstPurchaseAt: iso(days(35)), lastPurchaseAt: iso(days(9)) },
];

// ── Pedidos ─────────────────────────────────────────────────────────────────
const KIT = (n: number) => ([{ name: n === 1 ? 'Kit Lipenza x1 — Antiinflamatorio natural (60 caps)' : `Kit Lipenza x${n} — Tratamiento ${n} meses`, quantity: 1, price: n === 1 ? 166000 : n === 3 ? 249000 : 540000 }]);
export const DEMO_ORDERS = [
  { id: 'ord-1',  shopifyOrderNumber: '#1042', customerId: 'cust-4', status: 'PENDING_CONFIRMATION', totalAmount: 166000, currency: 'COP', trackingNumber: null, items: KIT(1), createdAt: iso(45),        estimatedDelivery: iso(-days(3)) },
  { id: 'ord-2',  shopifyOrderNumber: '#1041', customerId: 'cust-2', status: 'PENDING_CONFIRMATION', totalAmount: 166000, currency: 'COP', trackingNumber: null, items: KIT(1), createdAt: iso(days(1)),    estimatedDelivery: iso(-days(3)) },
  { id: 'ord-3',  shopifyOrderNumber: '#1039', customerId: 'cust-8', status: 'PREPARING',            totalAmount: 249000, currency: 'COP', trackingNumber: null, items: KIT(3), createdAt: iso(days(1)+120), estimatedDelivery: iso(-days(2)) },
  { id: 'ord-4',  shopifyOrderNumber: '#1037', customerId: 'cust-1', status: 'IN_TRANSIT',           totalAmount: 249000, currency: 'COP', trackingNumber: 'MS-889231', items: KIT(3), createdAt: iso(days(2)), estimatedDelivery: iso(-days(1)) },
  { id: 'ord-5',  shopifyOrderNumber: '#1035', customerId: 'cust-5', status: 'IN_TRANSIT',           totalAmount: 540000, currency: 'COP', trackingNumber: 'MS-889210', items: KIT(6), createdAt: iso(days(2)+60), estimatedDelivery: iso(-days(1)) },
  { id: 'ord-6',  shopifyOrderNumber: '#1030', customerId: 'cust-3', status: 'IN_DESTINATION',       totalAmount: 166000, currency: 'COP', trackingNumber: 'MS-887744', items: KIT(1), createdAt: iso(days(3)), estimatedDelivery: iso(-60) },
  { id: 'ord-7',  shopifyOrderNumber: '#1024', customerId: 'cust-1', status: 'DELIVERED',            totalAmount: 249000, currency: 'COP', trackingNumber: 'MS-885012', items: KIT(3), createdAt: iso(days(8)), deliveredAt: iso(days(6)) },
  { id: 'ord-8',  shopifyOrderNumber: '#1019', customerId: 'cust-5', status: 'DELIVERED',            totalAmount: 540000, currency: 'COP', trackingNumber: 'MS-884001', items: KIT(6), createdAt: iso(days(9)), deliveredAt: iso(days(7)) },
  { id: 'ord-9',  shopifyOrderNumber: '#1008', customerId: 'cust-7', status: 'FAILED_DELIVERY',      totalAmount: 166000, currency: 'COP', trackingNumber: 'MS-880900', items: KIT(1), createdAt: iso(days(12)), estimatedDelivery: iso(days(9)) },
  { id: 'ord-10', shopifyOrderNumber: '#1003', customerId: 'cust-3', status: 'RETURNED',             totalAmount: 166000, currency: 'COP', trackingNumber: 'MS-878200', items: KIT(1), createdAt: iso(days(20)) },
];

const custRef = (id: string) => {
  const c = DEMO_CUSTOMERS.find(x => x.id === id)!;
  return { id: c.id, name: c.name, phone: c.phone, city: c.city, ltv: c.ltv, totalOrders: c.totalOrders };
};

// ── Conversaciones + mensajes ────────────────────────────────────────────────
const M = (id: string, dir: 'INBOUND' | 'OUTBOUND', content: string, minsAgo: number, extra: any = {}) =>
  ({ id, direction: dir, content, contentType: 'text', createdAt: iso(minsAgo), status: dir === 'OUTBOUND' ? 'READ' : 'DELIVERED', isInternal: false, sentBy: dir === 'OUTBOUND' ? AGENT : null, media: null, ...extra });

export const DEMO_CONVERSATIONS = [
  {
    id: 'conv-1', customerId: 'cust-4', channel: 'FACEBOOK', status: 'OPEN', tags: ['interesada'], isRead: false,
    lastMessageAt: iso(6), agent: null, customer: custRef('cust-4'),
    messages: [
      M('m1', 'OUTBOUND', '¡Hola Gloria! 🌿 Gracias por escribirnos a Lipenza. ¿En qué te podemos ayudar?', 40),
      M('m2', 'INBOUND', 'Hola, vi el anuncio. ¿Lipenza sirve para el dolor de rodilla? ¿Cuánto cuesta?', 20),
      M('m3', 'OUTBOUND', 'Sí 🙌 Lipenza es un antiinflamatorio natural (cúrcuma, jengibre y pimienta negra) ideal para dolor articular. El kit de 1 mes cuesta $166.000 con envío GRATIS y pago contra entrega.', 12),
      M('m4', 'INBOUND', '¿Y tiene contraindicaciones? Tomo pastillas para la tensión', 6),
    ],
  },
  {
    id: 'conv-2', customerId: 'cust-3', channel: 'WHATSAPP', status: 'OPEN', tags: ['artritis', 'recompra'], isRead: false,
    lastMessageAt: iso(75), agent: AGENT, customer: custRef('cust-3'),
    messages: [
      M('m5', 'OUTBOUND', 'Hola Carmen 👋 Han pasado unas semanas desde tu último pedido. ¿Cómo van esas articulaciones?', 180),
      M('m6', 'INBOUND', 'Hola! La verdad se me acabó hace rato y volví a sentir molestia en las manos 😕', 75),
    ],
  },
  {
    id: 'conv-3', customerId: 'cust-1', channel: 'WHATSAPP', status: 'IN_PROGRESS', tags: ['fiel'], isRead: true,
    lastMessageAt: iso(140), agent: AGENT, customer: custRef('cust-1'),
    messages: [
      M('m7', 'INBOUND', 'Buenas, quiero pedir otro kit de 3 meses 🙏', 200),
      M('m8', 'OUTBOUND', '¡Claro que sí María Fernanda! Te confirmo: Kit Lipenza x3 por $249.000, envío gratis a Bogotá. ¿Te lo despacho a la misma dirección?', 150),
      M('m9', 'INBOUND', 'Sí, la misma. Gracias!', 140),
    ],
  },
  {
    id: 'conv-4', customerId: 'cust-8', channel: 'WHATSAPP', status: 'IN_PROGRESS', tags: ['dolor espalda'], isRead: true,
    lastMessageAt: iso(days(1)), agent: AGENT, customer: custRef('cust-8'),
    messages: [
      M('m10', 'OUTBOUND', '¡Tu pedido Lipenza va en camino! 🚚 Guía: MS-885012. Llega en 2-3 días hábiles a Cartagena.', days(1) + 30),
      M('m11', 'INBOUND', 'Perfecto, muchas gracias 🙏', days(1)),
    ],
  },
  {
    id: 'conv-5', customerId: 'cust-2', channel: 'INSTAGRAM', status: 'OPEN', tags: [], isRead: false,
    lastMessageAt: iso(30), agent: null, customer: custRef('cust-2'),
    messages: [
      M('m12', 'INBOUND', 'Hola! ¿ya despacharon mi pedido? 😊', 30),
    ],
  },
  {
    id: 'conv-6', customerId: 'cust-5', channel: 'WHATSAPP', status: 'RESOLVED', tags: ['mayorista'], isRead: true,
    lastMessageAt: iso(days(5)), agent: AGENT, customer: custRef('cust-5'),
    messages: [
      M('m13', 'INBOUND', 'Necesito 3 kits para este mes 💪', days(5) + 120),
      M('m14', 'OUTBOUND', '¡Listo Rosa! 3 kits x6 despachados. Que te vaya excelente con las ventas 🌿', days(5) + 60),
      M('m15', 'INBOUND', 'Mil gracias, excelente servicio', days(5)),
    ],
  },
];

// ── Flujos automáticos ───────────────────────────────────────────────────────
export const DEMO_FLOWS = [
  { id: 'flow-1', name: 'Confirmación de pedido', description: 'Mensaje automático cuando entra un pedido nuevo para confirmar datos y dirección.', trigger: 'ORDER_CREATED', isActive: true, steps: [{}, {}], _count: { executions: 342 }, createdAt: iso(days(90)) },
  { id: 'flow-2', name: 'Aviso de despacho', description: 'Notifica al cliente con la guía de Mastershop cuando el pedido sale a reparto.', trigger: 'ORDER_DISPATCHED', isActive: true, steps: [{}], _count: { executions: 289 }, createdAt: iso(days(90)) },
  { id: 'flow-3', name: 'Recuperación de carrito', description: 'Recordatorio a quienes dejaron el checkout sin terminar la compra.', trigger: 'ABANDONED_CART', isActive: true, steps: [{}, {}, {}], _count: { executions: 156 }, createdAt: iso(days(60)) },
  { id: 'flow-4', name: 'Recompra a los 25 días', description: 'Invita a repedir antes de que se acabe el tratamiento del mes.', trigger: 'NO_REPURCHASE_DAYS', isActive: true, steps: [{}, {}], _count: { executions: 98 }, createdAt: iso(days(45)) },
  { id: 'flow-5', name: 'Seguimiento post-entrega', description: 'Pregunta por la experiencia 3 días después de entregar el pedido.', trigger: 'DAYS_AFTER_DELIVERY', isActive: false, steps: [{}], _count: { executions: 61 }, createdAt: iso(days(30)) },
  { id: 'flow-6', name: 'Novedad en entrega', description: 'Avisa al equipo y al cliente cuando la transportadora reporta una novedad.', trigger: 'ORDER_NOVELTY', isActive: true, steps: [{}, {}], _count: { executions: 27 }, createdAt: iso(days(20)) },
];

// ── Plantillas de mensaje ─────────────────────────────────────────────────────
export const DEMO_TEMPLATES = [
  { id: 'tpl-1', name: 'confirmacion_pedido', shortcut: 'confirmar', category: 'CONFIRMATION', content: 'Hola {{1}} ☕ Recibimos tu pedido Lipenza. ¿Confirmas el envío a {{2}}? Responde SÍ para despachar.', variables: ['1', '2'], status: 'APPROVED', channels: ['WHATSAPP'], language: 'es', createdAt: iso(days(80)) },
  { id: 'tpl-2', name: 'pedido_en_camino', shortcut: 'despacho', category: 'LOGISTICS', content: '¡Tu Lipenza está en camino! 🚚 Guía: {{1}}. Tiempo estimado: 2-3 días hábiles.', variables: ['1'], status: 'APPROVED', channels: ['WHATSAPP'], language: 'es', createdAt: iso(days(80)) },
  { id: 'tpl-3', name: 'recordatorio_recompra', shortcut: 'recompra', category: 'REPURCHASE', content: 'Hola {{1}} 🌿 Ya casi terminas tu tratamiento Lipenza. ¿Te preparamos el próximo kit para no interrumpir tus resultados?', variables: ['1'], status: 'APPROVED', channels: ['WHATSAPP', 'INSTAGRAM'], language: 'es', createdAt: iso(days(50)) },
  { id: 'tpl-4', name: 'carrito_abandonado', shortcut: 'carrito', category: 'PROMOTIONAL', content: 'Hola {{1}}, notamos que dejaste tu Lipenza en el carrito 🛒 Termina tu compra hoy y recibe envío GRATIS: {{2}}', variables: ['1', '2'], status: 'PENDING', channels: ['WHATSAPP'], language: 'es', createdAt: iso(days(20)) },
  { id: 'tpl-5', name: 'soporte_contraindicaciones', shortcut: 'soporte', category: 'SUPPORT', content: 'Hola {{1}}, Lipenza es 100% natural. Si tomas medicación permanente, te recomendamos consultar con tu médico. ¿Tienes alguna otra duda?', variables: ['1'], status: 'APPROVED', channels: ['WHATSAPP', 'INSTAGRAM', 'FACEBOOK'], language: 'es', createdAt: iso(days(40)) },
  { id: 'tpl-6', name: 'promo_2x1', shortcut: 'promo', category: 'PROMOTIONAL', content: '🔥 ¡Solo por hoy {{1}}! 2X1 en Lipenza. Menos inflamación, más movilidad. Aprovecha: {{2}}', variables: ['1', '2'], status: 'REJECTED', channels: ['WHATSAPP'], language: 'es', createdAt: iso(days(15)) },
];

// ── Carritos abandonados ─────────────────────────────────────────────────────
export const DEMO_CARTS = [
  { id: 'cart-1', customerId: 'cust-4', email: 'glorianunez@gmail.com', phone: '+57 315 223 9911', status: 'OPEN', checkoutUrl: 'https://lipenza.co/checkout/abc123', totalAmount: 166000, currency: 'COP', lineItems: KIT(1), reminderCount: 1, abandonedAt: iso(180), customer: custRef('cust-4') },
  { id: 'cart-2', customerId: 'cust-6', email: null, phone: '+57 312 990 3345', status: 'OPEN', checkoutUrl: 'https://lipenza.co/checkout/def456', totalAmount: 249000, currency: 'COP', lineItems: KIT(3), reminderCount: 0, abandonedAt: iso(days(1)), customer: custRef('cust-6') },
  { id: 'cart-3', customerId: null, email: 'nuevo.cliente@gmail.com', phone: '+57 300 555 1212', status: 'OPEN', checkoutUrl: 'https://lipenza.co/checkout/ghi789', totalAmount: 166000, currency: 'COP', lineItems: KIT(1), reminderCount: 2, abandonedAt: iso(days(2)), customer: null },
  { id: 'cart-4', customerId: 'cust-3', email: null, phone: '+57 320 456 7788', status: 'RECOVERED', checkoutUrl: 'https://lipenza.co/checkout/jkl012', totalAmount: 540000, currency: 'COP', lineItems: KIT(6), reminderCount: 1, abandonedAt: iso(days(4)), customer: custRef('cust-3') },
];

// ── Analytics del dashboard ──────────────────────────────────────────────────
function buildSeries() {
  const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const arr = [];
  const base = [3, 5, 4, 6, 8, 5, 7, 9, 6, 8, 11, 7, 9, 12];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now() - i * days(1) * 60_000);
    const orders = base[13 - i];
    arr.push({
      date: d.toISOString().slice(0, 10),
      label: `${d.getDate()} ${MONTHS[d.getMonth()]}`,
      orders,
      revenue: orders * 210000,
    });
  }
  return arr;
}

export function demoDashboard() {
  const series = buildSeries();
  const totalOrders = 127;
  const deliveredOrders = 98;
  const returnedOrders = 6;
  const pendingOrders = 11;
  const totalRevenue = 26890000;
  return {
    range: { from: series[0].date, to: series[series.length - 1].date, granularity: 'day' },
    sales: {
      totalOrders, deliveredOrders, returnedOrders, pendingOrders,
      totalRevenue,
      avgOrderValue: Math.round(totalRevenue / totalOrders),
      deliveryRate: (deliveredOrders / totalOrders) * 100,
      returnRate: (returnedOrders / totalOrders) * 100,
      ordersByStatus: [
        { status: 'DELIVERED', count: 98, revenue: 20580000 },
        { status: 'IN_TRANSIT', count: 9, revenue: 1890000 },
        { status: 'PENDING_CONFIRMATION', count: 8, revenue: 1330000 },
        { status: 'PREPARING', count: 4, revenue: 830000 },
        { status: 'FAILED_DELIVERY', count: 2, revenue: 330000 },
        { status: 'RETURNED', count: 6, revenue: 1000000 },
      ],
      series,
      ordersByCity: [
        { city: 'Bogotá', orders: 41 },
        { city: 'Medellín', orders: 28 },
        { city: 'Cali', orders: 19 },
        { city: 'Barranquilla', orders: 14 },
        { city: 'Bucaramanga', orders: 12 },
        { city: 'Cartagena', orders: 8 },
      ],
    },
    customers: { total: 214, newCustomers: 37, recurringCustomers: 66, atRiskCustomers: 18, repurchaseRate: 30.8 },
    messaging: { openConversations: 3, resolvedConversations: 41 },
  };
}

// ── Router de respuestas demo ─────────────────────────────────────────────────
export function demoResponse(pathname: string, method: string, body: any): any | undefined {
  const p = pathname.replace(/\/$/, '');

  // Auth
  if (p === '/api/auth/login' && method === 'POST') {
    return { token: 'demo-token', user: { id: 'demo', name: 'Ana Gómez', email: 'admin@lipenza.co', role: 'ADMIN' } };
  }
  if (p === '/api/auth/me') {
    return { id: 'demo', name: 'Ana Gómez', email: 'admin@lipenza.co', role: 'ADMIN' };
  }

  // Analytics
  if (p === '/api/analytics/dashboard') return demoDashboard();

  // Conversaciones
  if (p === '/api/conversations' && method === 'GET') {
    return { data: DEMO_CONVERSATIONS, total: DEMO_CONVERSATIONS.length };
  }
  const convMatch = p.match(/^\/api\/conversations\/([^/]+)$/);
  if (convMatch && method === 'GET') {
    return DEMO_CONVERSATIONS.find(c => c.id === convMatch[1]) ?? DEMO_CONVERSATIONS[0];
  }
  if (convMatch && method === 'PATCH') {
    const c = DEMO_CONVERSATIONS.find(x => x.id === convMatch[1]);
    return { ...(c ?? {}), ...(body ?? {}) };
  }
  const msgMatch = p.match(/^\/api\/conversations\/([^/]+)\/messages$/);
  if (msgMatch && method === 'POST') {
    return {
      id: `m-${now()}`, direction: 'OUTBOUND', content: body?.content ?? '',
      contentType: body?.contentType ?? 'text', createdAt: new Date().toISOString(),
      status: 'SENT', isInternal: !!body?.isInternal, sentBy: AGENT, media: null, sendError: null,
    };
  }

  // Clientes
  if (p === '/api/customers' && method === 'GET') {
    const data = DEMO_CUSTOMERS.map(c => ({ ...c, _count: { orders: c.totalOrders, conversations: DEMO_CONVERSATIONS.filter(v => v.customerId === c.id).length } }));
    return { data, total: data.length, page: 1, limit: 50 };
  }
  const custMatch = p.match(/^\/api\/customers\/([^/]+)$/);
  if (custMatch && method === 'GET') {
    const c = DEMO_CUSTOMERS.find(x => x.id === custMatch[1]) ?? DEMO_CUSTOMERS[0];
    return {
      ...c,
      orders: DEMO_ORDERS.filter(o => o.customerId === c.id),
      conversations: DEMO_CONVERSATIONS.filter(v => v.customerId === c.id).map(v => ({ ...v, messages: v.messages.slice(-1) })),
    };
  }
  if (custMatch && method === 'PATCH') {
    const c = DEMO_CUSTOMERS.find(x => x.id === custMatch[1]);
    return { ...(c ?? {}), ...(body ?? {}) };
  }

  // Pedidos
  if (p === '/api/orders' && method === 'GET') {
    const data = DEMO_ORDERS.map(o => ({ ...o, customer: custRef(o.customerId) }));
    return { data, total: data.length };
  }
  if (p === '/api/orders/stats') {
    const byStatus: Record<string, number> = {};
    DEMO_ORDERS.forEach(o => { byStatus[o.status] = (byStatus[o.status] ?? 0) + 1; });
    return Object.entries(byStatus).map(([status, _count]) => ({ status, _count }));
  }
  if (/^\/api\/orders\/[^/]+\/status$/.test(p) && method === 'PATCH') return { ok: true, ...(body ?? {}) };

  // Carritos
  if (p === '/api/abandoned-carts') return { data: DEMO_CARTS, total: DEMO_CARTS.length };

  // Flujos
  if (p === '/api/flows' && method === 'GET') return DEMO_FLOWS;
  const flowToggle = p.match(/^\/api\/flows\/([^/]+)\/toggle$/);
  if (flowToggle) {
    const f = DEMO_FLOWS.find(x => x.id === flowToggle[1]);
    if (f) f.isActive = !f.isActive;
    return { ...(f ?? {}) };
  }

  // Plantillas
  if (p === '/api/templates' && method === 'GET') return DEMO_TEMPLATES;
  if (p === '/api/templates/sync') return { synced: DEMO_TEMPLATES.length };

  // Cualquier otro POST/PATCH/DELETE en demo → éxito silencioso
  if (method !== 'GET' && p.startsWith('/api/')) return { ok: true };

  return undefined;
}
