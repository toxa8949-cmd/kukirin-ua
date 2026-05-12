import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LoginForm from '@/components/admin/LoginForm';
import PageShell from '@/components/kukirin/PageShell';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Вхід в адмінку' };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  // If already logged in AND is admin → straight to /admin.
  // Middleware already handles this for direct visits, but server-render guards
  // against stale auth cookies.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (isAdmin) redirect(next || '/admin');
  }

  const errorMessage =
    error === 'not_admin'
      ? 'Цей акаунт не має прав адміністратора.'
      : error === 'invalid'
        ? 'Невірний email або пароль.'
        : null;

  return (
    <PageShell
      breadcrumb="ADMIN · LOGIN"
      title="Вхід в адмінку"
      subtitle="Увійдіть, щоб керувати товарами, замовленнями та новинами."
    >
      <LoginForm initialError={errorMessage} nextPath={next} />
    </PageShell>
  );
}
