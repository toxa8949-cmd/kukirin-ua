// Шаблон email-листа для підтвердження замовлення.
// Inline CSS — більшість поштових клієнтів (Gmail, Apple Mail) не підтримують <style> або медіа-запити,
// тому використовуємо style="" на кожному елементі.

export type OrderEmailItem = {
  name: string;
  price: number;
  quantity: number;
};

export type OrderEmailData = {
  customerName: string;
  customerEmail?: string | null;
  phone: string;
  orderId: string;        // повний UUID
  total: number;
  items: OrderEmailItem[];
  notes?: string | null;  // details доставки і оплати
  siteUrl: string;        // https://kukirinstore.com.ua
  isAdminNotification?: boolean;
};

const COLORS = {
  bg:        '#FAFAF7',
  white:     '#FFFFFF',
  text:      '#1a1a1a',
  textMute:  '#4A4A48',
  textLight: '#6C6A65',
  border:    '#E8E6DE',
  orange:    '#FF6B00',
  orangeDk:  '#993C1D',
  black:     '#1a1a1a',
  footerBg:  '#F0EEE6',
};

function fmtPrice(n: number): string {
  return new Intl.NumberFormat('uk-UA').format(n);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderOrderConfirmationHtml(d: OrderEmailData): string {
  const shortId = d.orderId.slice(0, 8).toUpperCase();
  const trackUrl = `${d.siteUrl}/orders/track`;
  const itemsRows = d.items
    .map((it) => {
      const subtotal = it.price * it.quantity;
      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid ${COLORS.border};font-size:14px;color:${COLORS.text};vertical-align:top;">
            ${escapeHtml(it.name)}
            <div style="font-size:11px;color:${COLORS.textLight};margin-top:2px;">${it.quantity} × ${fmtPrice(it.price)} ₴</div>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid ${COLORS.border};font-size:14px;font-weight:500;color:${COLORS.orange};text-align:right;vertical-align:top;white-space:nowrap;">
            ${fmtPrice(subtotal)} ₴
          </td>
        </tr>`;
    })
    .join('');

  const notesBlock = d.notes
    ? `
      <tr>
        <td style="padding:0 32px 24px;">
          <div style="font-size:10px;letter-spacing:0.2em;color:${COLORS.textLight};margin-bottom:10px;">// ДЕТАЛІ ДОСТАВКИ</div>
          <div style="background:${COLORS.bg};border:1px solid ${COLORS.border};padding:14px 16px;font-size:13px;line-height:1.6;color:${COLORS.textMute};white-space:pre-line;">${escapeHtml(d.notes)}</div>
        </td>
      </tr>`
    : '';

  const adminBanner = d.isAdminNotification
    ? `
      <tr>
        <td style="background:${COLORS.orange};padding:14px 32px;color:#fff;font-size:12px;letter-spacing:0.15em;font-weight:600;">
          🛒 НОВЕ ЗАМОВЛЕННЯ — ${escapeHtml(d.customerName)} · ${escapeHtml(d.phone)} · ${fmtPrice(d.total)} ₴
        </td>
      </tr>`
    : '';

  const greeting = d.isAdminNotification
    ? `Замовлення від <strong>${escapeHtml(d.customerName)}</strong>`
    : `Дякуємо, ${escapeHtml(d.customerName.split(' ')[0] || d.customerName)}!`;

  const intro = d.isAdminNotification
    ? `Нове замовлення в системі. Зайдіть в адмінку, щоб підтвердити.`
    : `Ваше замовлення прийнято. Менеджер передзвонить протягом 15 хвилин у робочий час (9:30–16:30) і підтвердить деталі доставки.`;

  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Замовлення прийнято · kukirinstore.com.ua</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${COLORS.text};line-height:1.5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:${COLORS.white};border:1px solid ${COLORS.border};">
          ${adminBanner}

          <!-- HEADER -->
          <tr>
            <td style="background:${COLORS.black};padding:28px 32px;text-align:center;">
              <div style="color:${COLORS.orange};font-size:22px;font-weight:700;letter-spacing:0.05em;">kukirinstore.com.ua</div>
              <div style="color:#888;font-size:10px;letter-spacing:0.25em;margin-top:6px;">// ЗАМОВЛЕННЯ ПРИЙНЯТО</div>
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="padding:32px 32px 16px;">
              <h1 style="margin:0 0 10px;font-size:24px;font-weight:500;color:${COLORS.text};line-height:1.2;">${greeting}</h1>
              <p style="margin:0;font-size:14px;line-height:1.6;color:${COLORS.textMute};">${intro}</p>
            </td>
          </tr>

          <!-- ORDER NUMBER -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.bg};border:1px solid ${COLORS.border};">
                <tr>
                  <td style="padding:14px 16px;">
                    <div style="font-size:10px;letter-spacing:0.2em;color:${COLORS.orangeDk};margin-bottom:6px;">// НОМЕР ЗАМОВЛЕННЯ</div>
                    <div style="font-family:'SF Mono',Monaco,Consolas,monospace;font-size:14px;color:${COLORS.text};word-break:break-all;">${d.orderId}</div>
                    <div style="font-size:11px;color:${COLORS.textLight};margin-top:6px;">
                      Скорочений код для відстеження: <strong style="color:${COLORS.orange};">${shortId}</strong>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ITEMS -->
          <tr>
            <td style="padding:0 32px 24px;">
              <div style="font-size:10px;letter-spacing:0.2em;color:${COLORS.textLight};margin-bottom:10px;">// СКЛАД ЗАМОВЛЕННЯ</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemsRows}
                <tr>
                  <td style="padding:14px 0 0;font-size:14px;color:${COLORS.textMute};">Разом:</td>
                  <td style="padding:14px 0 0;text-align:right;font-size:24px;font-weight:500;color:${COLORS.orange};white-space:nowrap;">${fmtPrice(d.total)} ₴</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- TRACK BUTTON -->
          <tr>
            <td style="padding:0 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:8px 0;">
                    <a href="${trackUrl}" style="display:inline-block;background:${COLORS.orange};color:#fff;text-decoration:none;padding:14px 36px;font-size:12px;letter-spacing:0.12em;font-weight:600;border-radius:2px;">
                      ВІДСТЕЖИТИ СТАТУС
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:8px;font-size:11px;color:${COLORS.textLight};">
                    Введіть код ${shortId} та свій телефон
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${notesBlock}

          <!-- CONTACTS -->
          <tr>
            <td style="padding:20px 32px;background:${COLORS.bg};border-top:1px solid ${COLORS.border};">
              <div style="font-size:10px;letter-spacing:0.2em;color:${COLORS.orangeDk};margin-bottom:8px;">// ПИТАННЯ?</div>
              <div style="font-size:14px;color:${COLORS.text};margin-bottom:4px;">
                <a href="tel:+380958981007" style="color:${COLORS.orange};text-decoration:none;font-weight:500;">0 (95) 898-10-07</a>
              </div>
              <div style="font-size:12px;color:${COLORS.textLight};">щодня 9:30–16:30 · Київ, вул. Ревуцького, 40В</div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:16px 32px;background:${COLORS.footerBg};text-align:center;border-top:1px solid ${COLORS.border};">
              <div style="font-size:10px;color:${COLORS.textLight};letter-spacing:0.1em;">
                kukirinstore.com.ua · ОФІЦІЙНИЙ ДИСТРИБ'ЮТОР В УКРАЇНІ
              </div>
              <div style="margin-top:8px;font-size:10px;color:${COLORS.textLight};">
                <a href="${d.siteUrl}" style="color:${COLORS.textLight};text-decoration:underline;">kukirinstore.com.ua</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderOrderConfirmationText(d: OrderEmailData): string {
  const shortId = d.orderId.slice(0, 8).toUpperCase();
  const lines: string[] = [];
  if (d.isAdminNotification) {
    lines.push('🛒 НОВЕ ЗАМОВЛЕННЯ');
    lines.push('');
    lines.push(`Клієнт: ${d.customerName}`);
    lines.push(`Телефон: ${d.phone}`);
  } else {
    lines.push(`Дякуємо, ${d.customerName.split(' ')[0] || d.customerName}!`);
    lines.push('');
    lines.push('Ваше замовлення прийнято. Менеджер передзвонить протягом 15 хв.');
  }
  lines.push('');
  lines.push(`Номер замовлення: ${d.orderId}`);
  lines.push(`Код відстеження: ${shortId}`);
  lines.push('');
  lines.push('Склад замовлення:');
  for (const it of d.items) {
    lines.push(`  - ${it.name}  (${it.quantity} × ${fmtPrice(it.price)} ₴)`);
  }
  lines.push('');
  lines.push(`РАЗОМ: ${fmtPrice(d.total)} ₴`);
  if (d.notes) {
    lines.push('');
    lines.push('Деталі доставки:');
    lines.push(d.notes);
  }
  lines.push('');
  lines.push(`Відстежити статус: ${d.siteUrl}/orders/track`);
  lines.push('');
  lines.push('Контакти: 0 (95) 898-10-07 · щодня 9:30–16:30');
  lines.push('kukirinstore.com.ua · kukirinstore.com.ua');
  return lines.join('\n');
}
