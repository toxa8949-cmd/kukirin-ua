import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminNav from '@/components/admin/AdminNav';
import PageShell from '@/components/kukirin/PageShell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense-in-depth: middleware already gates /admin/* but we re-check on
  // every server render so a stale cookie can never expose admin pages.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  if (error || !isAdmin) {
    redirect('/admin/login?error=not_admin');
  }

  return (
    <PageShell>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <AdminNav email={user.email ?? null} />
        <div className="min-w-0">{children}</div>
      </div>
    </PageShell>
  );
}
