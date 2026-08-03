/**
 * Crea el usuario administrador del CRM:
 *  1) usuario en Supabase Auth (email + password)
 *  2) fila en la tabla crm_users (rol ADMIN, activo)
 * Lee credenciales de .env — nunca hardcodear.
 *
 *   npx tsx scripts/seed-admin.ts
 */
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const url   = process.env.SUPABASE_URL;
  const key   = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.ADMIN_EMAIL;
  const pass  = process.env.ADMIN_PASSWORD;
  const name  = process.env.ADMIN_NAME || 'Administrador';

  if (!url || !key) throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
  if (!email || !pass) throw new Error('Faltan ADMIN_EMAIL o ADMIN_PASSWORD en .env');

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // 1) Usuario en Supabase Auth (idempotente: si ya existe, lo buscamos)
  let authUserId: string | undefined;
  const created = await supabase.auth.admin.createUser({
    email,
    password: pass,
    email_confirm: true,
    user_metadata: { name },
  });

  if (created.error) {
    if (/already|exists|registered/i.test(created.error.message)) {
      const { data: list } = await supabase.auth.admin.listUsers();
      authUserId = list?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())?.id;
      // asegurar la contraseña actual
      if (authUserId) await supabase.auth.admin.updateUserById(authUserId, { password: pass, email_confirm: true });
      console.log('• Usuario Auth ya existía — contraseña actualizada');
    } else {
      throw created.error;
    }
  } else {
    authUserId = created.data.user?.id;
    console.log('• Usuario creado en Supabase Auth');
  }

  // 2) Fila en crm_users (upsert por email)
  const user = await prisma.crmUser.upsert({
    where: { email },
    update: { name, role: 'ADMIN', isActive: true, authUserId },
    create: { email, name, role: 'ADMIN', isActive: true, authUserId },
  });

  console.log(`✓ Admin listo: ${user.email} (rol ${user.role})`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => { console.error('ERROR:', e.message); await prisma.$disconnect(); process.exit(1); });
