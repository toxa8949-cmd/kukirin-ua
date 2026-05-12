import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import NewsForm from '@/components/admin/NewsForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Нова стаття' };

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/news" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
          <ArrowLeft size={12} /> До списку статей
        </Link>
        <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#FF8A33]">// NEWS · NEW</div>
        <h1 className="text-3xl font-medium tracking-tight">Нова стаття</h1>
      </div>

      <NewsForm mode="create" />
    </div>
  );
}
