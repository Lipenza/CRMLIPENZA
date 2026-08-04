# Revisión de app en Meta — Instagram (y Messenger) para el CRM Lipenza

Guía lista para enviar la app a revisión y obtener **Acceso Avanzado** a los permisos
de mensajería (para recibir DMs de clientes reales en el CRM).

## Prerrequisitos (ya cumplidos ✅)
- Negocio verificado ✅
- Política de privacidad: `https://crmlipenza.vercel.app/privacy` ✅
- App publicada (En vivo) ✅
- Cuenta de Instagram conectada (`@lipenza_col`) ✅

---

## Permisos a solicitar (Acceso Avanzado)
| Permiso | Para qué | Caso de uso |
|---|---|---|
| `instagram_business_manage_messages` | Recibir y responder DMs de Instagram | API de Instagram |
| `instagram_business_basic` | Datos básicos de la cuenta | API de Instagram |
| `pages_messaging` *(si conectas Messenger)* | Recibir/responder Messenger | Messenger |
| `human_agent` *(opcional)* | Responder manualmente hasta 7 días | Messenger/IG |

---

## Justificación (copia y pega en cada permiso)

**instagram_business_manage_messages / pages_messaging:**
> Lipenza es una marca de bienestar que atiende a sus clientes por Instagram, Facebook y WhatsApp. CRM LIPENZA es nuestra herramienta interna de atención al cliente: centraliza los mensajes directos que nuestros clientes nos envían para que nuestro equipo humano los lea y **responda manualmente** desde un solo lugar. Usamos este permiso únicamente para **recibir los mensajes entrantes de nuestros clientes y responderlos de forma manual** (atención humana, no automatizada masiva). No enviamos mensajes no solicitados. El acceso se limita a la cuenta de negocio de Lipenza y a la finalidad de atención al cliente.

**human_agent (si aplica):**
> Lo usamos para permitir que un agente humano de nuestro equipo responda los mensajes de los clientes dentro de la ventana de atención, cuando la respuesta requiere seguimiento manual.

---

## 🎥 Guion del video demostrativo (grábalo con pantalla)
Meta pide un video que muestre el permiso **en uso real**. Graba esto (2-3 min):

1. **Login al CRM:** abre `https://crmlipenza.vercel.app`, inicia sesión.
2. **Muestra la bandeja** (Bandeja) y explica en voz/subtítulo: "Este es nuestro CRM de atención al cliente."
3. **Desde una cuenta de prueba** (agregada como *Evaluador de Instagram*), envía un **DM** a `@lipenza_col`.
4. **Muestra el DM llegando** a la bandeja de Instagram del CRM.
5. **Responde desde el CRM** manualmente.
6. **Muestra la respuesta llegando** a la cuenta de prueba en Instagram.
7. Cierra: "Usamos el permiso solo para atención al cliente manual."

> Para que el DM llegue en la demo (app aún sin acceso avanzado), la cuenta que envía **debe ser Evaluador de Instagram** de la app (Roles → Evaluador de Instagram → aceptar invitación). Así funciona entre cuentas de prueba.

---

## Pasos para enviar (en Meta)
1. App **CRM LIPENZA** → caso de uso **API de Instagram** → **Configuración de la API**
2. Sección **"5. Completar la revisión de la app"** → **empezar la revisión**
3. Para cada permiso: pega la **justificación** + sube el **video** + describe el flujo
4. Completa datos de la app si faltan (ícono, categoría "Empresa", correo de contacto)
5. **Enviar solicitud**

⏱️ Meta suele responder en **1-5 días hábiles**. Si piden ajustes, reenvías.

---

## Después de la aprobación
- Instagram entrega DMs de **cualquier** cliente → entran solos al CRM
- Yo verifico que el circuito reciba/responda (ya está programado)
- Se puede activar junto con la migración
