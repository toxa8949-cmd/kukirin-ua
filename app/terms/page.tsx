import PageShell from '@/components/kukirin/PageShell';

export const metadata = { title: 'Угода користувача' };

export default function TermsPage() {
  return (
    <PageShell breadcrumb="LEGAL · TERMS" title="Угода користувача" subtitle="Правила користування сайтом kukirinstore.com.ua і умови продажу електросамокатів.">
      <article className="max-w-3xl space-y-5 text-sm leading-relaxed text-[#4A4A48] dark:text-white/75">
        <p>Останнє оновлення: 11.05.2026</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">1. Загальні положення</h2>
        <p>Користуючись Сайтом, ви погоджуєтесь з умовами цієї Угоди. Якщо не згодні — будь ласка, не використовуйте Сайт.</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">2. Замовлення</h2>
        <p>Оформлення замовлення на Сайті є офертою. Договір купівлі-продажу вважається укладеним з моменту підтвердження замовлення нашим менеджером (телефоном, email або у Telegram).</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">3. Ціни</h2>
        <p>Ціни на Сайті вказані у гривнях і включають усі податки. Ми залишаємо за собою право змінювати ціни, але вже оформлене замовлення фіксується за ціною на момент підтвердження.</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">4. Доставка й оплата</h2>
        <p>Доставка здійснюється Новою Поштою або власною курʼєрською службою на умовах, описаних у розділі «Доставка й оплата». Оплата — при отриманні, картою онлайн або у розстрочку.</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">5. Повернення</h2>
        <p>Згідно зі ст. 9 Закону «Про захист прав споживачів», ви маєте право повернути товар протягом 14 днів за умови збереження товарного вигляду, пломб, документів і повної комплектації. Повернення транспортних електросамокатів обмежується технічно справним станом.</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">6. Гарантія</h2>
        <p>Усі товари мають офіційну гарантію виробника KUKIRIN та сервісну підтримку від нас. Деталі — у розділі «Гарантія».</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">7. Інтелектуальна власність</h2>
        <p>Усі тексти, фото, логотипи й дизайн Сайту належать kukirinstore.com.ua або використовуються за ліцензією. Копіювання без дозволу заборонене.</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">8. Контакти для запитань</h2>
        <p>Якщо у вас є запитання по Угоді — пишіть на <a href="mailto:info@kukirin.ua" className="text-[#FF6B00] hover:underline">info@kukirin.ua</a> або телефонуйте <a href="tel:+380800338899" className="text-[#FF6B00] hover:underline">0 800 33 88 99</a>.</p>
      </article>
    </PageShell>
  );
}
