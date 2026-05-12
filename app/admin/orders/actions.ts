'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { ORDER_STATUSES, type OrderStatus } from './constants';

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

async function requireAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Не залогінений.' };
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) return { ok: false, error: 'Немає прав адміністратора.' };
  return { ok: true };
}

export async function updateOrderStatus(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const id = String(formData.get('id') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim() as OrderStatus;

  if (!id) return { ok: false, error: 'Відсутній id замовлення.' };
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, error: `Невідомий статус: ${status}` };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('orders')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update({ status } as any)
    .eq('id', id);

  if (error) {
    console.error('updateOrderStatus:', error);
    return { ok: false, error: `Не вдалось оновити: ${error.message}` };
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath('/admin');
  return { ok: true, id };
}

export async function appendOrderNote(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const id = String(formData.get('id') ?? '').trim();
  const note = String(formData.get('note') ?? '').trim();

  if (!id) return { ok: false, error: 'Відсутній id замовлення.' };
  if (!note) return { ok: false, error: 'Порожня нотатка.' };

  const supabase = createAdminClient();

  const { data: current } = await supabase
    .from('orders')
    .select('notes')
    .eq('id', id)
    .maybeSingle();

  const existing = (current as { notes: string | null } | null)?.notes ?? '';
  const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const newNotes = existing
    ? `${existing}\n--- ${stamp} ---\n${note}`
    : `--- ${stamp} ---\n${note}`;

  const { error } = await supabase
    .from('orders')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update({ notes: newNotes } as any)
    .eq('id', id);

  if (error) {
    console.error('appendOrderNote:', error);
    return { ok: false, error: `Не вдалось додати нотатку: ${error.message}` };
  }

  revalidatePath(`/admin/orders/${id}`);
  return { ok: true, id };
}
