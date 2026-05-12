'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type SignInResult = { ok: true } | { ok: false; error: string };

export async function signIn(formData: FormData): Promise<SignInResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const nextRaw = String(formData.get('next') ?? '/admin');

  if (!email || !password) {
    return { ok: false, error: 'Введіть email і пароль.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('[signIn]', error.message);
    return { ok: false, error: 'Невірний email або пароль.' };
  }

  // Verify the user is in admins table.
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    // Sign them out — they shouldn't keep a session that can't access /admin.
    await supabase.auth.signOut();
    return { ok: false, error: 'Цей акаунт не має прав адміністратора.' };
  }

  // Only redirect to safe internal paths.
  const next = nextRaw.startsWith('/admin') ? nextRaw : '/admin';
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
