import PageShell from '@/components/kukirin/PageShell';
import { Calendar, ArrowRight } from 'lucide-react';

export const metadata = { title: 'Блог · поради й огляди' };

const POSTS = [
  { date: '12.05.2026', tag: 'ОГЛЯД', title: 'KUKIRIN G2 Pro проти G2 Master: який обрати у 2026', excerpt: 'Розбираємо різницю в мощності, запасі ходу і ціні, щоб ви не переплатили за непотрібні Вати.' },
  { date: '03.05.2026', tag: 'ПОРАДА', title: 'Як зимувати літій-іонний акумулятор самоката', excerpt: 'Прості правила зберігання батареї восени–взимку, щоб навесні вона видала ті самі 60 км запасу.' },
  { date: '21.04.2026', tag: 'ЗАКОН', title: 'Нові правила ПДР для електросамокатів 2026', excerpt: 'Де можна їздити, з якою швидкістю, чи потрібні шолом і ОСЦПВ — коротко по суті.' },
  { date: '08.04.2026', tag: 'СЕРВІС', title: 'Топ-5 поломок самокатів і як їх уникнути', excerpt: 'Контролер, гальма, дисплей, шини, болти. Розповідаємо, що і як перевіряти кожні 500 км.' },
  { date: '27.03.2026', tag: 'ГІД', title: 'Перший самокат: чек-лист новачка', excerpt: 'Що подивитись у документах, як перевірити батарею в магазині і не потрапити на сірий імпорт.' },
  { date: '15.03.2026', tag: 'ОГЛЯД', title: 'KUKIRIN G4 Max: 2000W flagship на тестах', excerpt: 'Заміряли реальні цифри: 0–30 за 3.4 с, реальний запас 72 км при +15°C і вазі райдера 80 кг.' },
];

export default function BlogPage() {
  return (
    <PageShell breadcrumb="BLOG · 6 СТАТЕЙ" title="Блог KUKIRIN" subtitle="Огляди моделей, поради по сервісу, новини законодавства і реальні тести.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {POSTS.map((p) => (
          <article key={p.title} className="group rounded-sm border border-white/10 bg-[#0F0F0F] p-5 transition hover:border-[#FF6B00]">
            <div className="mb-3 flex items-center gap-3 text-[10px] tracking-[0.2em] text-white/40">
              <span className="rounded-sm bg-[#FF6B00]/20 px-2 py-0.5 text-[#FF8A33]">{p.tag}</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {p.date}</span>
            </div>
            <h3 className="mb-2 text-lg font-medium leading-snug tracking-tight group-hover:text-[#FF6B00]">{p.title}</h3>
            <p className="mb-4 text-sm leading-relaxed text-white/55">{p.excerpt}</p>
            <span className="inline-flex items-center gap-1 text-xs text-white/60 group-hover:text-white">
              Читати <ArrowRight size={14} />
            </span>
          </article>
        ))}
      </div>
      <div className="mt-10 text-center text-xs text-white/45">// Скоро тут зʼявляться повноцінні статті з картинками і коментарями</div>
    </PageShell>
  );
}
