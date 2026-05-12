import { createClient } from '@/lib/supabase/server';
import AdminNav from '@/components/admin/AdminNav';
import PageShell from '@/components/kukirin/PageShell';

export const dynamic = 'force-dynamic';

/**
 * Trusts middleware: by the time this layout runs, the user is guaranteed
 * to be an admin (middleware redirected non-admins to /admin/login already).
 *
 * We only fetch the user here for display (email in sidebar). We MUST NOT
 * redirect from here — that creates a redirect loop with middleware.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PageShell>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <AdminNav email={user?.email ?? null} />
        <div className="min-w-0">{children}</div>
      </div>
    </PageShell>
  );
}
