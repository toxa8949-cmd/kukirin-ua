'use client';

import { useState, useTransition } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { signIn } from '@/app/admin/actions';

type Props = {
  initialError: string | null;
  nextPath?: string;
};

export default function LoginForm({ initialError, nextPath }: Props) {
  const [error, setError] = useState<string | null>(initialError);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await signIn(form);
      if (!res?.ok) setError(res?.error ?? 'Невідома помилка.');
    });
  }

  const inputCls =
    'w-full rounded-sm border border-[#E8E6DE] dark:border-white/15 bg-white dark:bg-[#0F0F0F] px-4 py-3 text-sm text-[#1a1a1a] dark:text-white placeholder:text-[#6C6A65] dark:text-white/30 outline-none transition focus:border-[#FF6B00]';

  return (
    <div className="mx-auto max-w-md rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="hidden" name="next" value={nextPath ?? '/admin'} />
        <label className="block">
          <span className="mb-1 block text-xs text-[#4A4A48] dark:text-white/55">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className={inputCls}
            placeholder="admin@kukirin.ua"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[#4A4A48] dark:text-white/55">Пароль</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            className={inputCls}
            placeholder="••••••••"
          />
        </label>

        {error && (
          <div className="flex items-start gap-2 rounded-sm border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white dark:text-black transition hover:bg-[#FF8A33] disabled:opacity-60"
        >
          {isPending ? 'ВХІД…' : (
            <>
              <LogIn size={14} /> УВІЙТИ
            </>
          )}
        </button>
      </form>
      <p className="mt-4 text-[10px] leading-relaxed text-[#6C6A65] dark:text-white/35">
        Доступ тільки для адміністраторів. Доступ контролюється через{' '}
        <code className="text-[#4A4A48] dark:text-white/60">public.admins</code> у Supabase.
      </p>
    </div>
  );
}
