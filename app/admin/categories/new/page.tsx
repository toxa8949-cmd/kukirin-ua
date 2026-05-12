import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CategoryForm from '@/components/admin/CategoryForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Нова категорія' };

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/categories" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
          <ArrowLeft size={12} /> До списку категорій
        </Link>
        <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#FF8A33]">// CATEGORIES · NEW</div>
        <h1 className="text-3xl font-medium tracking-tight">Нова категорія</h1>
      </div>

      <CategoryForm mode="create" />
    </div>
  );
}
