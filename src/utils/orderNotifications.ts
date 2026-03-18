import emailjs from '@emailjs/browser';
import {
  buildCustomerEmailHtml,
  buildCustomerEmailSubject,
  buildNovaEmailHtml,
  buildNovaEmailSubject,
  type OrderEmailInput,
} from '@/utils/orderEmailTemplates';

/** Correo principal de NOVA para recibir y procesar pedidos */
const NOVA_EMAIL = 'novatech.digital.col@gmail.com';

// ─────────────────────────────────────────────────────────────────────────────
// EmailJS config
// Required env vars in .env.local:
//   NEXT_PUBLIC_EMAILJS_SERVICE_ID   — ID del servicio (ej. "service_xxxxxxx")
//   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY   — Public Key de tu cuenta EmailJS
//   NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID — Template para el cliente
//   NEXT_PUBLIC_EMAILJS_NOVA_TEMPLATE_ID     — Template para NOVA
//
// Ambos templates deben tener un campo "to_email" y un campo "html_content"
// con la variable {{{html_content}}} para renderizar HTML completo.
// ─────────────────────────────────────────────────────────────────────────────

interface EmailJsConfig {
  serviceId: string;
  publicKey: string;
  customerTemplateId: string;
  novaTemplateId: string;
}

function isPlaceholder(value: string): boolean {
  const v = value.trim();
  return !v || /XXXX|YOUR_|REPLACE/i.test(v);
}

function formatEmailJsError(err: unknown): string {
  if (err instanceof Error && err.message) {
    return err.message;
  }

  if (typeof err === 'object' && err !== null) {
    const maybe = err as { status?: number; text?: string; message?: string };
    const statusPart = typeof maybe.status === 'number' ? `status=${maybe.status}` : '';
    const textPart = maybe.text ? `text=${maybe.text}` : '';
    const msgPart = maybe.message ? `message=${maybe.message}` : '';
    const joined = [statusPart, textPart, msgPart].filter(Boolean).join(', ');
    if (joined) {
      return joined;
    }
  }

  return 'Error desconocido de EmailJS';
}

function getEmailJsConfig(): EmailJsConfig | null {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const customerTemplateId = process.env.NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID;
  const novaTemplateId = process.env.NEXT_PUBLIC_EMAILJS_NOVA_TEMPLATE_ID;

  if (!serviceId || !publicKey || !customerTemplateId || !novaTemplateId) {
    return null;
  }

  if (
    isPlaceholder(serviceId) ||
    isPlaceholder(publicKey) ||
    isPlaceholder(customerTemplateId) ||
    isPlaceholder(novaTemplateId)
  ) {
    return null;
  }

  return { serviceId, publicKey, customerTemplateId, novaTemplateId };
}

async function sendEmailJs(
  config: EmailJsConfig,
  templateId: string,
  toEmail: string,
  subject: string,
  htmlContent: string,
  payload: OrderEmailInput,
): Promise<void> {
  await emailjs.send(
    config.serviceId,
    templateId,
    {
      to_email: toEmail,
      to_name: payload.customerName,
      subject,
      html_content: htmlContent,
      reply_to: payload.customerEmail,
      order_id: payload.orderId,
      customer_name: payload.customerName,
      customer_phone: payload.customerPhone,
      shipping_address: payload.shippingAddress,
      payment_method: payload.paymentMethodLabel,
    },
    { publicKey: config.publicKey },
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export interface NotifyResult {
  /** true si al menos un email fue enviado vía EmailJS */
  sent: boolean;
  /** Razón por la que no se enviaron correos (solo cuando sent=false) */
  reason?: string;
}

/**
 * Envía dos correos después de completar un pedido:
 *  1. Al cliente — confirmación de compra
 *  2. A NOVA     — notificación interna para procesar el pedido
 *
 * Requiere configurar las variables de EmailJS en .env.local.
 * Si no están configuradas, loguea un aviso pero NO interrumpe el flujo del pedido.
 */
export async function notifyOrderByEmail(payload: OrderEmailInput): Promise<NotifyResult> {
  const config = getEmailJsConfig();

  if (!config) {
    console.warn(
      '[NOVA Emails] EmailJS no configurado. Agrega las variables NEXT_PUBLIC_EMAILJS_* en .env.local para activar el envío real de correos.',
    );
    return { sent: false, reason: 'EmailJS no configurado' };
  }

  const errors: string[] = [];

  // 1. Correo al cliente
  try {
    await sendEmailJs(
      config,
      config.customerTemplateId,
      payload.customerEmail,
      buildCustomerEmailSubject(payload.orderId),
      buildCustomerEmailHtml(payload),
      payload,
    );
  } catch (err) {
    console.warn('[NOVA Emails] Fallo envío al cliente:', formatEmailJsError(err));
    errors.push('cliente');
  }

  // 2. Correo a NOVA
  try {
    await sendEmailJs(
      config,
      config.novaTemplateId,
      NOVA_EMAIL,
      buildNovaEmailSubject(payload.orderId),
      buildNovaEmailHtml(payload),
      payload,
    );
  } catch (err) {
    console.warn('[NOVA Emails] Fallo envío a NOVA:', formatEmailJsError(err));
    errors.push('nova');
  }

  if (errors.length > 0) {
    console.warn(
      '[NOVA Emails] Revisa en EmailJS: service activo, template IDs correctos, variables to_email/subject/html_content y allowed origins (localhost o dominio actual).',
    );
    return { sent: errors.length < 2, reason: `Falló envío a: ${errors.join(', ')}` };
  }

  return { sent: true };
}
