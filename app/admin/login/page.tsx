import LoginForm from '@/components/admin/LoginForm';
import PageShell from '@/components/kukirin/PageShell';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Вхід в адмінку' };

/**
 * Middleware handles the "already logged in → /admin" redirect, so this
 * page just renders the form. Adding another redirect here would loop.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

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
