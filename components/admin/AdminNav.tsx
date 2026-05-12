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
      <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-4">
        <div className="mb-1 text-[10px] tracking-[0.2em] text-[#FF8A33]">// ADMIN</div>
        {email && (
          <div className="mb-5 truncate text-xs text-white/55">{email}</div>
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
                    ? 'bg-[#FF6B00] text-black'
                    : 'text-white/75 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        <form action={signOut} className="mt-5 border-t border-white/10 pt-4">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-sm border border-white/15 px-3 py-2 text-sm text-white/70 hover:border-white/30 hover:text-white"
          >
            <LogOut size={14} /> Вийти
          </button>
        </form>
      </div>
    </aside>
  );
}
