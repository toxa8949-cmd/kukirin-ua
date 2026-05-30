import 'server-only';
import { Resend } from 'resend';
import {
  renderOrderConfirmationHtml,
  renderOrderConfirmationText,
  type OrderEmailData,
} from './orderConfirmationTemplate';

/**
 * Відправити email-сповіщення про замовлення:
 *   - клієнту (якщо є customerEmail)
 *   - адміну (якщо ADMIN_NOTIFICATION_EMAIL встановлена)
 *
 * Якщо RESEND_API_KEY відсутній — функція тихо пропускає відправку
 * і логує warning. Замовлення в БД при цьому НЕ ламається.
 *
 * Env vars:
 *   RESEND_API_KEY — обовʼязково для роботи. Створюється в resend.com/api-keys.
 *   RESEND_FROM_EMAIL — наприклад "kukirinstore.com.ua <orders@kukirinstore.com.ua>".
 *     Домен має бути верифікований у Resend (DNS-записи SPF/DKIM).
 *     За замовчанням використовується дефолтний for testing 'onboarding@resend.dev'.
 *   ADMIN_NOTIFICATION_EMAIL — куди надсилати копію адміну (опційно).
 */
export async function sendOrderEmails(
  data: Omit<OrderEmailData, 'isAdminNotification'>,
): Promise<{ customerSent: boolean; adminSent: boolean; errors: string[] }> {
  const errors: string[] = [];
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[sendOrderEmails] RESEND_API_KEY not set — skip email send');
    return { customerSent: false, adminSent: false, errors: ['RESEND_API_KEY missing'] };
  }

  const from =
    process.env.RESEND_FROM_EMAIL ||
    'kukirinstore.com.ua <onboarding@resend.dev>'; // fallback для тестування до верифікації домена

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || null;
  const resend = new Resend(apiKey);
  const shortId = data.orderId.slice(0, 8).toUpperCase();

  let customerSent = false;
  let adminSent = false;

  // ─── Клієнту ───
  if (data.customerEmail) {
    try {
      const html = renderOrderConfirmationHtml({ ...data, isAdminNotification: false });
      const text = renderOrderConfirmationText({ ...data, isAdminNotification: false });

      const res = await resend.emails.send({
        from,
        to: data.customerEmail,
        subject: `Замовлення #${shortId} прийнято — kukirinstore.com.ua`,
        html,
        text,
        replyTo: process.env.RESEND_REPLY_TO || undefined,
      });

      if (res.error) {
        errors.push(`customer: ${res.error.message}`);
        console.error('[sendOrderEmails] customer send failed:', res.error);
      } else {
        customerSent = true;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`customer: ${msg}`);
      console.error('[sendOrderEmails] customer send threw:', e);
    }
  }

  // ─── Адміну ───
  if (adminEmail) {
    try {
      const html = renderOrderConfirmationHtml({ ...data, isAdminNotification: true });
      const text = renderOrderConfirmationText({ ...data, isAdminNotification: true });

      const res = await resend.emails.send({
        from,
        to: adminEmail,
        subject: `🛒 НОВЕ #${shortId} · ${data.customerName} · ${data.phone} · ${data.total.toLocaleString('uk-UA')} ₴`,
        html,
        text,
      });

      if (res.error) {
        errors.push(`admin: ${res.error.message}`);
        console.error('[sendOrderEmails] admin send failed:', res.error);
      } else {
        adminSent = true;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`admin: ${msg}`);
      console.error('[sendOrderEmails] admin send threw:', e);
    }
  }

  return { customerSent, adminSent, errors };
}
