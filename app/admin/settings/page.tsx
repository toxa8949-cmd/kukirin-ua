import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import SettingsForm from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Налаштування' };

type Row = {
  key: string;
  value: string;
  group_name: string;
  label: string;
  description: string | null;
  sort_order: number;
};

const GROUP_TITLE: Record<string, string> = {
  contacts: 'Контакти',
  social: 'Соцмережі',
  misc: 'Інше',
  seo: 'SEO',
};

const GROUP_ORDER = ['contacts', 'social', 'misc', 'seo'];

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('key, value, group_name, label, description, sort_order')
    .order('sort_order', { ascending: true });

  const rows = (data ?? []) as unknown as Row[];

  // Group by group_name preserving GROUP_ORDER.
  const grouped = new Map<string, Row[]>();
  for (const r of rows) {
    const g = r.group_name || 'misc';
    if (!grouped.has(g)) grouped.set(g, []);
    grouped.get(g)!.push(r);
  }
  const groupKeys = [
    ...GROUP_ORDER.filter((g) => grouped.has(g)),
    ...Array.from(grouped.keys()).filter((g) => !GROUP_ORDER.includes(g)),
  ];

  const groups = groupKeys.map((g) => ({
    name: g,
    title: GROUP_TITLE[g] ?? g,
    rows: grouped.get(g) ?? [],
  }));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
          <ArrowLeft size={12} /> На дашборд
        </Link>
        <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#FF8A33]">// SETTINGS</div>
        <h1 className="text-3xl font-medium tracking-tight">Налаштування сайту</h1>
        <p className="mt-2 text-sm text-white/55">
          Контакти, соцмережі та інші параметри, що показуються в хедері та футері.
        </p>
      </div>

      <SettingsForm groups={groups} />
    </div>
  );
}
