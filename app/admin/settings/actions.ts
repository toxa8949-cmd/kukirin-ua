'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export type ActionResult =
  | { ok: true; updated: number }
  | { ok: false; error: string };

async function requireAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Не залогінений.' };
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) return { ok: false, error: 'Немає прав адміністратора.' };
  return { ok: true };
}

export async function updateSiteSettings(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const supabase = createAdminClient();

  // Each setting is sent as `setting:<key>` from the form to avoid collisions.
  const updates: Array<{ key: string; value: string }> = [];
  for (const [name, val] of formData.entries()) {
    if (!name.startsWith('setting:')) continue;
    const key = name.slice('setting:'.length);
    if (!key) continue;
    updates.push({ key, value: String(val ?? '').trim() });
  }

  if (updates.length === 0) return { ok: false, error: 'Немає змін для збереження.' };

  // Update each row individually. They're few (~13), no need for batching.
  const now = new Date().toISOString();
  let updated = 0;
  for (const { key, value } of updates) {
    const { error } = await supabase
      .from('site_settings')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ value, updated_at: now } as any)
      .eq('key', key);
    if (error) {
      console.error(`updateSiteSettings[${key}]:`, error);
      return { ok: false, error: `Не вдалось оновити "${key}": ${error.message}` };
    }
    updated += 1;
  }

  // Revalidate all pages that might depend on settings.
  revalidatePath('/', 'layout');
  return { ok: true, updated };
}
