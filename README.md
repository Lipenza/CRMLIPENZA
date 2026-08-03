# CRMLIPENZA

CRM omnicanal para **Lipenza** — bienestar articular y antiinflamatorio natural.
Gestión de conversaciones (WhatsApp / Instagram / Facebook), clientes, pedidos,
carritos abandonados, flujos automáticos y plantillas de mensajes.

## Stack
- **Next.js 14** (App Router) + React 18 + TypeScript
- **Tailwind CSS** con la paleta de marca Lipenza (verde bosque / verde vital) y tipografía **Urbanist**
- **Prisma** + **Supabase** (Postgres)
- Integraciones: Mastershop, WhatsApp Cloud API / Meta, Shopify (webhooks)

## Estructura
```
Lipenza-CRM/
  apps/web/        ← aplicación Next.js (raíz de despliegue en Vercel)
    src/           ← código (app router, componentes, servicios, lib)
    prisma/        ← esquema de base de datos
    public/        ← logos e isotipo Lipenza
```

## Desarrollo local

```bash
cd Lipenza-CRM/apps/web
npm install
cp .env.example .env   # completar credenciales reales (Supabase, DB, Mastershop, Meta)
npm run dev            # http://localhost:3000
```

### Modo demo (ver el CRM sin backend)
Con `DEMO_MODE=1` en `apps/web/.env.local`, un middleware sirve datos de ejemplo
en todas las pantallas — ideal para previsualizar sin base de datos.
Entra con cualquier correo/contraseña. Para usar el backend real, pon
`DEMO_MODE=0` (o borra `.env.local`).

## Despliegue (Vercel)
- **Root Directory:** `Lipenza-CRM/apps/web`
- Configurar las variables de entorno de `.env.example` en el panel de Vercel.
