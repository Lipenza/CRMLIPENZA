const FB_BASE = 'https://graph.facebook.com/v23.0';
const IG_BASE = 'https://graph.instagram.com/v23.0';

/**
 * Facebook Messenger: POST /{pageId}/messages con el token de la Página.
 * recipientId = PSID del cliente (guardado como externalId).
 */
export async function sendPageMessage(
  pageId: string, token: string, recipientId: string, text: string,
) {
  const res = await fetch(`${FB_BASE}/${pageId}/messages`, {
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

/**
 * Instagram (API con inicio de sesión de Instagram): POST graph.instagram.com/{ig-user-id}/messages
 * con el token de la cuenta de IG. recipientId = IGSID del cliente (guardado como externalId).
 */
export async function sendInstagramMessage(
  igUserId: string, token: string, recipientId: string, text: string,
) {
  const res = await fetch(`${IG_BASE}/${igUserId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    console.error('[Instagram] Error al enviar:', JSON.stringify(data.error || data));
    throw new Error(data.error?.message || `API de Instagram respondió ${res.status}`);
  }
  return data;
}
