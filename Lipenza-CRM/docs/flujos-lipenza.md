# Flujos Lipenza — Copys y plantillas de WhatsApp

Copys adaptados a Lipenza desde el Miro (`Lipenza - Flow`). Corregidos los restos de
Dermafol ("Dermafol ya está en tus manos" → Lipenza) y de la marca capilar
("cuidar tu cabello" → bienestar). Formato listo para crear en Meta (categoría +
cuerpo con variables `{{1}}`).

Variables: `{{1}}` nombre · `{{2}}`… según cada plantilla (ver params).

> Los flujos nacen **APAGADOS**. Se encienden el día de la migración de Lucid/Effi
> para evitar mensajes duplicados.

---

## 1) ADQUISICIÓN — recorrido del pedido
Motor: **ya implementado** (`order-flow.ts`). Solo faltan aprobar estas plantillas en Meta.

### `pedido_por_confirmar` · CONFIRMATION · params: nombre, producto, dirección, ciudad · botones: Confirmar / Tengo dudas
> Hola {{1}} 👋🌿 Tenemos listo tu pedido de {{2}} y estamos esperando despacharlo a {{3}}, {{4}} 📦💚 Solo necesitamos que confirmes tu pedido para ponerlo en camino cuanto antes — entre más rápido confirmes, más pronto llega a tus manos ✨ Cualquier duda también puedes decírnosla, ¡estamos aquí para ti! 🫶😊

### `pedido_recordatorio_confirmacion` · CONFIRMATION · params: producto, dirección, ciudad · (a los 90 min si no responde)
> Esperamos estés teniendo un hermoso día. Tenemos listo tu pedido de {{1}} y estamos esperando despacharlo a {{2}}, {{3}} 📦💚 Solo necesitamos que confirmes tu pedido para ponerlo en camino cuanto antes — entre más rápido confirmes, más pronto llega a tus manos ✨ ¡Estamos aquí para ti! 🫶😊

### `pedido_confirmado` · CONFIRMATION · (al pulsar Confirmar)
> ¡Muchas gracias por confirmar! 🤍 En un momento nuestro equipo logístico empacará tu pedido con todo el cuidado que merece, y por este mismo medio te enviaremos tu número de guía para que puedas rastrearlo cuando quieras 📦 ¡Estamos muy contentos de acompañarte en este proceso! 😊

### `pedido_dudas` · SUPPORT · (al pulsar Tengo dudas → lo atiende un humano)
> Perfecto. En un momento una de nuestras asesoras se pondrá en contacto contigo para resolver tus dudas con todo el amor del mundo 💛

### `pedido_despachado` · LOGISTICS · params: guía, transportadora
> ¡Qué alegría contarte que tu pedido ya fue despachado! Aquí tienes los datos para hacerle seguimiento 👇 📦 Guía: {{1}} 🚚 Transportadora: {{2}} Gracias por confiar en Lipenza — es un honor acompañarte en este proceso. Cualquier cosita que necesites, aquí estamos con mucho gusto 🤍

### `guia_de_uso` · UTILITY · (envío de la GUÍA tras despacho)
> Upsss… casi se nos olvida. En Lipenza queremos que realmente nuestros productos te funcionen, por eso creamos una guía completa con tips, manual de uso e información que te ayudará a que tus resultados sean excepcionales. Acá te la enviamos. Recuerda que estamos muy pendientes para cualquier duda 💚

### `pedido_en_transito` · LOGISTICS · params: nombre, guía, transportadora
> ¡Hola {{1}}! Tu pedido ya va en camino 🚚 Está rumbo a tu ciudad y cada vez más cerca de ti. Puedes seguirlo con la guía {{2}} en {{3}}. Ya te falta poquito para empezar tu tratamiento 💛

### `pedido_en_reparto` · LOGISTICS · params: nombre
> ¡{{1}}, hoy es el día! 🎉 Tu pedido ya está en reparto y el transportador va camino a tu dirección. Te recomendamos estar pendiente del teléfono por si necesitan ubicarte. ¡Ya casi lo tienes en tus manos!

### `pedido_entrega_oficina` · LOGISTICS · params: nombre, transportadora, guía
> Hola {{1}} 👋 Tu pedido ya llegó a la oficina de {{2}} más cercana y te está esperando. 📍 Guía: {{3}} Recuerda llevar tu documento de identidad al retirarlo. Si tienes dudas de cómo hacerlo, cuéntanos y con gusto te ayudamos.

### `pedido_entregado` · LOGISTICS · params: nombre  ⚠️ (corregido: Dermafol → Lipenza)
> ¡{{1}}, tu pedido ya fue entregado! 🎉 Nos alegra mucho saber que **Lipenza** ya está en tus manos. Ahora empieza lo más importante: la constancia. Toma las tabletas masticables todos los días, una en la mañana y una en la noche — así se ven los mejores resultados. Cualquier pregunta sobre cómo usarlo, aquí estamos contigo 💛

### `pedido_novedad` · LOGISTICS · params: nombre
> Hola {{1}}, te escribimos porque tu pedido presentó una novedad durante la entrega y no pudimos completarla. Puede ser algo tan sencillo como confirmar tu dirección o un dato de contacto. ¿Nos ayudas confirmando esta información para reprogramar la entrega lo antes posible? Queremos que tu pedido te llegue sin contratiempos.

### `pedido_devolucion` · SUPPORT · params: nombre
> Hola {{1}}, te contamos que tu pedido está en camino de vuelta a nuestra bodega. Nos gustaría saber por qué no pudiste recibir el producto — si tuviste alguna duda, inquietud o un problema con la transportadora — todo para seguir mejorando. Quedamos muy atentos y pendientes para ayudarte.

---

## 2) RETENCIÓN — postcompra (según unidades compradas)
Motor: **por implementar** (disparador `DAYS_AFTER_DELIVERY` con condición por unidades + día).

**Calendario por tier:**
- **1 unidad:** día 8, 15, 25, 30, 32, 33 + suscripción
- **2 unidades:** día 8, 15, 25, 30, 40, 50, 60, 61 + suscripción
- **3 unidades:** día 8, 15, 25, 30, 34, 60, 75, 89, 90 + suscripción

### `ret_seguimiento_uso` · UTILITY · params: nombre
> ¡Hola {{1}}! 👋 ¿Cómo vas con tu producto? 🌱⚡ Recuerda consumirlo todos los días, una tableta por la mañana y otra por la noche ⏰ para lograr mejores resultados.

### `ret_proceso_encuesta` · MARKETING · params: nombre · botón: link a formulario
> Hola {{1}} 💛 Queremos saber cómo va tu proceso: ¿has notado que las molestias han disminuido? Estamos aquí para acompañarte. Creamos un formulario breve — si lo completas tendrás un 5% de descuento en tu próxima compra 🌿

### `ret_invitacion_recompra` · MARKETING · params: nombre · botones: link web / hablar con asesor
> ¡Hora de continuar con tu siguiente mes de bienestar! 🌿 La constancia es lo que garantiza resultados reales; el efecto de la cúrcuma se construye con el tiempo. ¿Quieres que te ayudemos a renovar ahora mismo?

### `ret_recetario` · UTILITY · params: nombre · botón: enviar RECETARIO
> Seguimos contigo {{1}}! 🌟 Parte fundamental para mejores resultados es cómo te alimentas. Por eso preparamos un recetario completo para que, desde la alimentación, también cuides tu bienestar.

### `ret_recompra_promo` · MARKETING · params: nombre · botón: link con 10% OFF
> Te tenemos una sorpresita {{1}} 🎁 Haz hoy tu recompra con envío gratis + 10% OFF 🚀 Así mantienes tu ritual diario sin pausas. ¡Disponible solo por 24 horas!

### `ret_descuento_por_vencer` · MARKETING · params: nombre · botón: link con 10% OFF
> Hola {{1}} 💛 Tu descuento está a punto de vencer. Aprovecha el 10% + envío gratis para no detener tu proceso justo cuando está haciendo efecto.

### `ret_ultimo_recordatorio` · MARKETING · params: nombre · (tiers 2 y 3, último día)
> {{1}} 🚨 Este es tu último recordatorio: tu Lipenza está por acabarse y queremos que sigas cuidando tu bienestar día a día 💎 Haz tu recompra ahora con 10% de descuento + envío gratis. Válido por las próximas 24 horas.

### `ret_suscripcion` · MARKETING · botón: link suscripción
> 👉 ¿Quieres olvidarte de pedir cada mes? Suscríbete con 1 clic y recibe tu producto automáticamente con un descuento especial de fidelidad 💖
>
> Link: https://www.mercadopago.com.co/subscriptions/checkout?preapproval_plan_id=e39adc711a2f44438e7a6dfca1743b13

---

## 3) CARRITOS ABANDONADOS
Motor: **por implementar** (disparador `ABANDONED_CART` con esperas 45 min / 24 h / 55 h / 7 días).

### `carrito_1` · MARKETING · params: nombre, link_carrito · (inmediato → esperar 45 min)
> Hola {{1}} 👋 Vimos que dejaste tu tratamiento Lipenza en el carrito. ¿Se te fue la señal o tuviste algún problema para completar el pago? Aquí lo tienes guardado: {{2}} Si tienes alguna duda antes de decidir, aquí estamos con gusto.

### `carrito_2` · MARKETING · params: nombre · (a las 24 h · con IMAGEN TESTIMONIO)
> Hola {{1}} 💛 Sabemos que decidir no es fácil, sobre todo después de haber probado otras cosas sin resultado. Lipenza no es otro suplemento genérico de cúrcuma: trabaja desde adentro (inflamación) y desde afuera (movilidad y bienestar diario), justo donde empiezan las molestias articulares y musculares a partir de los 35-40. +1200 mujeres ya están en su ritual con Lipenza. Si tienes dudas de cómo funciona o si aplica para ti, cuéntanos y te ayudamos a decidir con calma.

### `carrito_3` · MARKETING · params: nombre, link_carrito_descuento · (a las 55 h)  ⚠️ (corregido: cabello → bienestar)
> {{1}}, para que no se quede pendiente: te dejamos 10% de descuento + envío gratis en tu tratamiento Lipenza, válido las próximas 24 horas. 👉 {{2}} No queremos que dejes pausado el momento de empezar a cuidar tu **bienestar** 💛

**Luego:** esperar 7 días → pasar el contacto a retargeting en Meta/TikTok Ads (para evitar fatiga y baja tasa de opt-out).

---

## Estado de implementación
| Flujo | Copys (Lipenza) | Motor en el CRM | Plantillas en Meta |
|---|---|---|---|
| Adquisición (pasos 1-8 + recordatorio) | ✅ este doc | ✅ ya existe | ⏳ crear/aprobar |
| Retención (1/2/3 unidades) | ✅ este doc | ⏳ por construir | ⏳ crear/aprobar |
| Carritos abandonados | ✅ este doc | ⏳ por construir | ⏳ crear/aprobar |

Todo se **activa en la migración** de Lucid/Effi.
