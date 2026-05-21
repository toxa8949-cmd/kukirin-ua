'use client';

import { useState, useTransition } from 'react';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { updateSiteSettings } from '@/app/admin/settings/actions';

type Row = {
  key: string;
  value: string;
  group_name: string;
  label: string;
  description: string | null;
};

type Group = { name: string; title: string; rows: Row[] };

export default function SettingsForm({ groups }: { groups: Group[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateSiteSettings(fd);
      if (res.ok) setSuccess(`Оновлено ${res.updated} параметрів.`);
      else setError(res.error);
    });
  }

  const inputCls =
    'w-full rounded-sm border border-[#E8E6DE] dark:border-white/15 bg-[#FAFAF7] dark:bg-[#0A0A0A] px-3 py-2 text-sm outline-none transition focus:border-[#FF6B00]';

  // Choose input type: address/about/copyright = textarea, the rest = single line.
  const isTextarea = (key: string) =>
    key === 'address' || key === 'footer_about' || key === 'copyright' || key === 'work_hours';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-2 rounded-sm border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {groups.map((g) => (
        <section
          key={g.name}
          className="space-y-4 rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5"
        >
          <div className="text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
            // {g.title.toUpperCase()}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {g.rows.map((r) => (
              <label key={r.key} className="block">
                <span className="mb-1 block text-xs text-[#4A4A48] dark:text-white/55">
                  {r.label || r.key}
                  <span className="ml-2 font-mono text-[10px] text-[#6C6A65] dark:text-white/30">
                    {r.key}
                  </span>
                </span>
                {isTextarea(r.key) ? (
                  <textarea
                    name={`setting:${r.key}`}
                    defaultValue={r.value}
                    rows={r.key === 'footer_about' ? 3 : 2}
                    className={`${inputCls} resize-y`}
                    placeholder={r.description ?? ''}
                  />
                ) : (
                  <input
                    name={`setting:${r.key}`}
                    defaultValue={r.value}
                    className={inputCls}
                    placeholder={r.description ?? ''}
                  />
                )}
                {r.description && (
                  <span className="mt-1 block text-[10px] text-[#6C6A65] dark:text-white/35">
                    {r.description}
                  </span>
                )}
              </label>
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white dark:text-black shadow-lg shadow-[#FF6B00]/20 hover:bg-[#FF8A33] disabled:opacity-60"
        >
          <Save size={14} /> {isPending ? 'ЗБЕРЕЖЕННЯ…' : 'ЗБЕРЕГТИ ВСІ'}
        </button>
      </div>
    </form>
  );
}
