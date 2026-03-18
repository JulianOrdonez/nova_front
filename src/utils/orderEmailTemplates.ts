import type { CartItem } from '@/types';

export interface OrderEmailInput {
  orderId: string;
  orderDateISO: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethodLabel: string;
  total: number;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes?: string;
}

function esc(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function fmtCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Subjects
// ─────────────────────────────────────────────────────────────────────────────

export function buildCustomerEmailSubject(orderId: string): string {
  return `✅ NOVA | Tu pedido #${orderId} fue recibido`;
}

export function buildNovaEmailSubject(orderId: string): string {
  return `🛒 NOVA | Nuevo pedido #${orderId} — Pendiente de procesamiento`;
}

/** @deprecated use buildCustomerEmailSubject instead */
export function buildOrderEmailSubject(orderId: string): string {
  return buildCustomerEmailSubject(orderId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Plain-text fallbacks
// ─────────────────────────────────────────────────────────────────────────────

export function buildOrderEmailText(input: OrderEmailInput): string {
  const lines = [
    `Pedido #${input.orderId}`,
    `Fecha: ${fmtDate(input.orderDateISO)}`,
    `Cliente: ${input.customerName}`,
    `Email: ${input.customerEmail}`,
    `Teléfono: ${input.customerPhone}`,
    `Dirección: ${input.shippingAddress}`,
    `Método de pago: ${input.paymentMethodLabel}`,
    '',
    'Productos:',
    ...input.items.map((i) => `  - ${i.productName}  x${i.quantity}  (${fmtCOP(i.unitPrice)} c/u)`),
    '',
    `Total: ${fmtCOP(input.total)}`,
    input.notes ? `Notas: ${input.notes}` : '',
  ].filter(Boolean);
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared layout helpers
// ─────────────────────────────────────────────────────────────────────────────

function buildItemRows(items: OrderEmailInput['items']): string {
  return items
    .map(
      (item, idx) => `
      <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
        <td style="padding:12px 16px;font-size:14px;color:#111827;border-bottom:1px solid #e5e7eb;">${esc(item.productName)}</td>
        <td style="padding:12px 16px;font-size:14px;color:#374151;text-align:center;border-bottom:1px solid #e5e7eb;">${item.quantity}</td>
        <td style="padding:12px 16px;font-size:14px;color:#374151;text-align:right;border-bottom:1px solid #e5e7eb;">${fmtCOP(item.unitPrice)}</td>
        <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#111827;text-align:right;border-bottom:1px solid #e5e7eb;">${fmtCOP(item.unitPrice * item.quantity)}</td>
      </tr>`
    )
    .join('');
}

const HEADER_STYLE = `padding:32px 32px 24px;background:linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0ea5e9 100%);`;

function buildLogoHeader(subtitle: string): string {
  return `
  <div style="${HEADER_STYLE}">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <span style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">NOVA</span>
          <span style="font-size:28px;font-weight:300;color:#7dd3fc;letter-spacing:-0.5px;">TECH</span>
        </td>
        <td align="right">
          <span style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">novatech.digital.col@gmail.com</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding-top:16px;">
          <span style="font-size:13px;color:#cbd5e1;">${subtitle}</span>
        </td>
      </tr>
    </table>
  </div>`;
}

function buildItemsTable(items: OrderEmailInput['items']): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
    <thead>
      <tr style="background:#f1f5f9;">
        <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#64748b;text-align:left;text-transform:uppercase;letter-spacing:.6px;border-bottom:2px solid #e2e8f0;">Producto</th>
        <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#64748b;text-align:center;text-transform:uppercase;letter-spacing:.6px;border-bottom:2px solid #e2e8f0;">Cant.</th>
        <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#64748b;text-align:right;text-transform:uppercase;letter-spacing:.6px;border-bottom:2px solid #e2e8f0;">P. Unit.</th>
        <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#64748b;text-align:right;text-transform:uppercase;letter-spacing:.6px;border-bottom:2px solid #e2e8f0;">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${buildItemRows(items)}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" style="padding:14px 16px;text-align:right;font-size:14px;font-weight:700;color:#374151;border-top:2px solid #e2e8f0;">TOTAL</td>
        <td style="padding:14px 16px;text-align:right;font-size:16px;font-weight:800;color:#0f172a;border-top:2px solid #e2e8f0;">${fmtCOP(items.reduce((s, i) => s + i.unitPrice * i.quantity, 0))}</td>
      </tr>
    </tfoot>
  </table>`;
}

function buildFooter(): string {
  return `
  <div style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} NOVA — Tecnología de calidad para ti</p>
    <p style="margin:0;font-size:11px;color:#cbd5e1;">novatech.digital.col@gmail.com</p>
  </div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Customer email — warm confirmation
// ─────────────────────────────────────────────────────────────────────────────

export function buildCustomerEmailHtml(input: OrderEmailInput): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;">
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:680px;margin:28px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">

  ${buildLogoHeader(`Pedido #${esc(input.orderId)} · ${fmtDate(input.orderDateISO)}`)}

  <div style="padding:32px;">
    <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a;">¡Gracias por tu compra, ${esc(input.customerName)}!</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Hemos recibido tu pedido correctamente. Nuestro equipo lo revisará y se pondrá en contacto contigo a la brevedad para confirmar el envío.
    </p>

    <div style="background:#f0f9ff;border-left:4px solid #0ea5e9;border-radius:8px;padding:14px 18px;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;color:#0369a1;font-weight:600;">Número de pedido: <span style="font-size:16px;">#${esc(input.orderId)}</span></p>
    </div>

    <h3 style="margin:0 0 12px;font-size:14px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;">Resumen del pedido</h3>
    ${buildItemsTable(input.items)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td width="48%" style="vertical-align:top;">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.6px;">Dirección de envío</p>
            <p style="margin:0;font-size:13px;color:#374151;line-height:1.6;">${esc(input.shippingAddress)}</p>
            <p style="margin:8px 0 0;font-size:13px;color:#374151;">📞 ${esc(input.customerPhone)}</p>
          </div>
        </td>
        <td width="4%"></td>
        <td width="48%" style="vertical-align:top;">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.6px;">Método de pago</p>
            <p style="margin:0;font-size:13px;color:#374151;">${esc(input.paymentMethodLabel)}</p>
            ${input.notes ? `<p style="margin:10px 0 0;font-size:12px;color:#64748b;"><strong>Notas:</strong> ${esc(input.notes)}</p>` : ''}
          </div>
        </td>
      </tr>
    </table>

    <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:12px;padding:16px 20px;text-align:center;">
      <p style="margin:0;font-size:14px;color:#065f46;">
        ✅ Tu pedido está en proceso. Te notificaremos cuando sea despachado.
      </p>
    </div>
  </div>

  ${buildFooter()}
</div>
</body></html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// NOVA internal email — detailed order for processing
// ─────────────────────────────────────────────────────────────────────────────

export function buildNovaEmailHtml(input: OrderEmailInput): string {
  const paymentBadgeColor = input.paymentMethodLabel.toLowerCase().includes('tarjeta')
    ? '#dbeafe:#2563eb'
    : input.paymentMethodLabel.toLowerCase().includes('transferencia')
    ? '#fef3c7:#d97706'
    : '#f3e8ff:#7c3aed';
  const [bgBadge, fgBadge] = paymentBadgeColor.split(':');

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;">
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:680px;margin:28px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">

  ${buildLogoHeader(`🛒 Nuevo pedido recibido — ${fmtDate(input.orderDateISO)}`)}

  <div style="padding:32px;">

    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:12px;padding:16px 20px;margin-bottom:28px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:28px;">📦</span>
      <div>
        <p style="margin:0;font-size:18px;font-weight:800;color:#0f172a;">Pedido #${esc(input.orderId)}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#92400e;">Pendiente de procesamiento — revisar y confirmar envío</p>
      </div>
    </div>

    <h3 style="margin:0 0 14px;font-size:14px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;">Datos del cliente</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:28px;">
      <tr>
        <td style="padding:6px 16px;font-size:13px;color:#64748b;width:36%;">Nombre completo</td>
        <td style="padding:6px 16px;font-size:13px;font-weight:600;color:#0f172a;">${esc(input.customerName)}</td>
      </tr>
      <tr style="background:#f1f5f9;">
        <td style="padding:6px 16px;font-size:13px;color:#64748b;">Correo electrónico</td>
        <td style="padding:6px 16px;font-size:13px;font-weight:600;color:#0f172a;">
          <a href="mailto:${esc(input.customerEmail)}" style="color:#0ea5e9;text-decoration:none;">${esc(input.customerEmail)}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 16px;font-size:13px;color:#64748b;">Teléfono</td>
        <td style="padding:6px 16px;font-size:13px;font-weight:600;color:#0f172a;">${esc(input.customerPhone)}</td>
      </tr>
      <tr style="background:#f1f5f9;">
        <td style="padding:6px 16px;font-size:13px;color:#64748b;">Dirección de envío</td>
        <td style="padding:6px 16px;font-size:13px;font-weight:600;color:#0f172a;">${esc(input.shippingAddress)}</td>
      </tr>
      <tr>
        <td style="padding:6px 16px;font-size:13px;color:#64748b;">Método de pago</td>
        <td style="padding:6px 16px;">
          <span style="background:${bgBadge};color:${fgBadge};font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;">${esc(input.paymentMethodLabel)}</span>
        </td>
      </tr>
      ${input.notes ? `<tr style="background:#f1f5f9;"><td style="padding:6px 16px;font-size:13px;color:#64748b;">Notas</td><td style="padding:6px 16px;font-size:13px;color:#374151;">${esc(input.notes)}</td></tr>` : ''}
    </table>

    <h3 style="margin:0 0 12px;font-size:14px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;">Productos ordenados</h3>
    ${buildItemsTable(input.items)}

    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:16px 20px;text-align:center;">
      <p style="margin:0;font-size:14px;color:#166534;font-weight:600;">
        Total a cobrar: ${fmtCOP(input.total)}
      </p>
      <p style="margin:6px 0 0;font-size:12px;color:#16a34a;">
        Responder a: <a href="mailto:${esc(input.customerEmail)}" style="color:#16a34a;">${esc(input.customerEmail)}</a>
      </p>
    </div>
  </div>

  ${buildFooter()}
</div>
</body></html>`;
}

/** @deprecated use buildCustomerEmailHtml instead */
export function buildOrderEmailHtml(input: OrderEmailInput): string {
  return buildCustomerEmailHtml(input);
}

// ─────────────────────────────────────────────────────────────────────────────
// Cart items mapper
// ─────────────────────────────────────────────────────────────────────────────

export function mapCartItemsToEmailItems(items: CartItem[]): OrderEmailInput['items'] {
  return items
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      productName: item.product?.name || `Producto #${item.productId}`,
      quantity: item.quantity,
      unitPrice: Number(item.product?.price || 0),
    }));
}
