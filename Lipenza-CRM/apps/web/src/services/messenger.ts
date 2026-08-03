const BASE = 'https://graph.facebook.com/v23.0';

/**
 * Envía un mensaje de texto por Facebook Messenger o Instagram DM.
 * Ambos usan la Página vinculada: POST /{pageId}/messages con el token de la Página.
 * recipientId = el PSID (Messenger) o IGSID (Instagram) del cliente (guardado como externalId).
 */
export async function sendPageMessage(
  pageId: string, token: string, recipientId: string, text: string,
) {
  const res = await fetch(`${BASE}/${pageId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: recipientId },
      messaging_type: 'RESPONSE',
      message: { text },
    }),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    console.error('[Messenger] Error al enviar:', JSON.stringify(data.error || data));
    throw new Error(data.error?.message || `API de Meta respondió ${res.status}`);
  }
  return data;
}
