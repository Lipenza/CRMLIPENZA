/**
 * Registra las líneas de WhatsApp (bandejas) del CRM en la tabla meta_accounts.
 * Lee las credenciales de cada línea desde .env — nunca hardcodear tokens.
 *
 * Variables esperadas por línea (ej. SERVICIO):
 *   WA_SERVICIO_PHONE_ID = <phone_number_id de Meta>
 *   WA_SERVICIO_TOKEN    = <token permanente de esa línea>
 *   WA_SERVICIO_WABA     = <WhatsApp Business Account id>   (opcional)
 *   WA_SERVICIO_NUMBER   = +57...                            (opcional, visible)
 *
 *   npx tsx scripts/seed-meta-accounts.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LINES = [
  { key: 'SERVICIO',  name: 'WhatsApp Servicio al Cliente' },
  { key: 'RECOMPRA',  name: 'WhatsApp Recompra' },
  { key: 'LOGISTICO', name: 'WhatsApp Logístico' },
];

async function main() {
  let done = 0;
  for (const line of LINES) {
    const phoneNumberId = process.env[`WA_${line.key}_PHONE_ID`];
    const token         = process.env[`WA_${line.key}_TOKEN`];
    const wabaId        = process.env[`WA_${line.key}_WABA`]   || null;
    const phoneNumber   = process.env[`WA_${line.key}_NUMBER`] || null;

    if (!phoneNumberId || !token) {
      console.log(`• ${line.name}: sin credenciales en .env — omitida (agrega WA_${line.key}_PHONE_ID y WA_${line.key}_TOKEN)`);
      continue;
    }

    const existing = await prisma.metaAccount.findFirst({
      where: { accountId: phoneNumberId, channel: 'WHATSAPP' },
    });

    const data = {
      channel: 'WHATSAPP' as const,
      accountId: phoneNumberId,
      accountName: line.name,
      phoneNumber,
      wabaId,
      accessToken: token,
      isActive: true,
    };

    if (existing) {
      await prisma.metaAccount.update({ where: { id: existing.id }, data });
      console.log(`✓ ${line.name}: actualizada`);
    } else {
      await prisma.metaAccount.create({ data });
      console.log(`✓ ${line.name}: creada`);
    }
    done++;
  }

  // ── Instagram / Facebook (bandejas por canal) ──────────────────────────────
  // FB:  accountId = page_id (id que manda el webhook)
  // IG:  accountId = instagram_account_id (id que manda el webhook), pageId para enviar
  const social = [
    { channel: 'FACEBOOK'  as const, name: 'Facebook Messenger',  accountId: process.env.FB_PAGE_ID,     pageId: process.env.FB_PAGE_ID, instagramId: null,                         token: process.env.FB_TOKEN },
    { channel: 'INSTAGRAM' as const, name: 'Instagram Directo',   accountId: process.env.IG_ACCOUNT_ID,  pageId: process.env.IG_PAGE_ID, instagramId: process.env.IG_ACCOUNT_ID,    token: process.env.IG_TOKEN },
  ];
  for (const s of social) {
    if (!s.accountId || !s.token) {
      console.log(`• ${s.name}: sin credenciales en .env — omitida`);
      continue;
    }
    const existing = await prisma.metaAccount.findFirst({ where: { accountId: s.accountId, channel: s.channel } });
    const data = { channel: s.channel, accountId: s.accountId, accountName: s.name, pageId: s.pageId ?? null, instagramId: s.instagramId ?? null, accessToken: s.token, isActive: true };
    if (existing) {
      await prisma.metaAccount.update({ where: { id: existing.id }, data });
      console.log(`✓ ${s.name}: actualizada`);
    } else {
      await prisma.metaAccount.create({ data });
      console.log(`✓ ${s.name}: creada`);
    }
    done++;
  }

  console.log(`\n${done} cuenta(s) registrada(s) como bandejas.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => { console.error('ERROR:', e.message); await prisma.$disconnect(); process.exit(1); });
