'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ClipboardList,
  Newspaper,
  LogOut,
} from 'lucide-react';
import { signOut } from '@/app/admin/actions';

const ITEMS = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Товари', icon: Package, exact: false },
  { href: '/admin/categories', label: 'Категорії', icon: FolderTree, exact: false },
  { href: '/admin/orders', label: 'Замовлення', icon: ClipboardList, exact: false },
  { href: '/admin/news', label: 'Новини', icon: Newspaper, exact: false },
];

export default function AdminNav({ email }: { email: string | null }) {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="sticky top-24 h-fit space-y-4 rounded-sm border border-white/10 bg-[#0F0F0F] p-4">
      <div>
        <div className="text-[9px] tracking-[0.2em] text-[#FF8A33]">// ADMIN</div>
        {email && (
          <div className="mt-1 truncate text-xs text-white/55" title={email}>
            {email}
          </div>
        )}
      </div>

      <ul className="space-y-1">
        {ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition ${
                  active
                    ? 'bg-[#FF6B00] text-black'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <form action={signOut} className="pt-2">
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs tracking-wide text-white/70 transition hover:border-white/30 hover:text-white"
        >
          <LogOut size={14} />
          Вийти
        </button>
      </form>
    </nav>
  );
}
