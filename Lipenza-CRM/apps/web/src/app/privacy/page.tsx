export const metadata = {
  title: 'Política de Privacidad — Lipenza CRM',
  description: 'Política de privacidad y tratamiento de datos de Lipenza.',
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 96px', fontFamily: 'system-ui, sans-serif', color: '#0F241B', lineHeight: 1.65 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0A6340' }}>Política de Privacidad — Lipenza</h1>
      <p style={{ color: '#51665B' }}>Última actualización: 2026</p>

      <p>Lipenza (“nosotros”) opera este sistema de gestión de clientes (CRM) para atender y dar seguimiento
      a las conversaciones y pedidos de nuestros clientes. Esta política explica qué datos tratamos y cómo.</p>

      <h2 style={{ color: '#0A6340', marginTop: 28 }}>1. Datos que recopilamos</h2>
      <ul>
        <li>Datos de contacto: nombre, teléfono, correo y ciudad.</li>
        <li>Contenido de conversaciones por WhatsApp, Instagram y Facebook Messenger que el cliente nos envía.</li>
        <li>Información de pedidos y envíos.</li>
      </ul>

      <h2 style={{ color: '#0A6340', marginTop: 28 }}>2. Cómo usamos los datos</h2>
      <ul>
        <li>Responder consultas y brindar atención al cliente.</li>
        <li>Gestionar pedidos, envíos y postventa.</li>
        <li>Mejorar nuestro servicio.</li>
      </ul>
      <p>No vendemos ni compartimos tus datos con terceros para fines publicitarios.</p>

      <h2 style={{ color: '#0A6340', marginTop: 28 }}>3. Mensajería (WhatsApp / Instagram / Facebook)</h2>
      <p>Integramos las plataformas de mensajería de Meta únicamente para recibir y responder los mensajes
      que los clientes nos envían. El acceso se limita a esa finalidad y se rige por las políticas de Meta.</p>

      <h2 style={{ color: '#0A6340', marginTop: 28 }}>4. Conservación y seguridad</h2>
      <p>Conservamos los datos el tiempo necesario para la atención y obligaciones legales, con medidas
      técnicas razonables para protegerlos.</p>

      <h2 style={{ color: '#0A6340', marginTop: 28 }}>5. Tus derechos</h2>
      <p>Puedes solicitar acceso, corrección o eliminación de tus datos escribiéndonos por nuestros
      canales oficiales de atención.</p>

      <h2 style={{ color: '#0A6340', marginTop: 28 }}>6. Contacto</h2>
      <p>Para cualquier solicitud sobre tus datos, contáctanos a través de nuestros canales oficiales de Lipenza.</p>
    </main>
  );
}
