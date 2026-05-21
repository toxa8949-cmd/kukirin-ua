'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Package,
  FolderTree,
  ClipboardList,
  Newspaper,
  Settings,
  LogOut,
} from 'lucide-react';
import { signOut } from '@/app/admin/actions';

const NAV = [
  { href: '/admin', label: 'Дашборд', icon: LayoutGrid, exact: true },
  { href: '/admin/products', label: 'Товари', icon: Package },
  { href: '/admin/categories', label: 'Категорії', icon: FolderTree },
  { href: '/admin/orders', label: 'Замовлення', icon: ClipboardList },
  { href: '/admin/news', label: 'Новини', icon: Newspaper },
  { href: '/admin/settings', label: 'Налаштування', icon: Settings },
];

export default function AdminNav({ email }: { email: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-56 lg:flex-shrink-0">
      <div className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-4">
        <div className="mb-1 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ADMIN</div>
        {email && (
          <div className="mb-5 truncate text-xs text-[#4A4A48] dark:text-white/55">{email}</div>
        )}
        <nav className="space-y-1">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition ${
                  active
                    ? 'bg-[#FF6B00] text-white dark:text-black'
                    : 'text-[#4A4A48] dark:text-white/75 hover:bg-[#FFFCF5] dark:bg-white/[0.04] hover:text-[#1a1a1a] dark:hover:text-[#1a1a1a] dark:text-white'
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        <form action={signOut} className="mt-5 border-t border-[#E8E6DE] dark:border-white/10 pt-4">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-sm border border-[#E8E6DE] dark:border-white/15 px-3 py-2 text-sm text-[#4A4A48] dark:text-white/70 hover:border-[#DCDAD0] dark:hover:border-white/30 hover:text-[#1a1a1a] dark:hover:text-[#1a1a1a] dark:text-white"
          >
            <LogOut size={14} /> Вийти
          </button>
        </form>
      </div>
    </aside>
  );
}
