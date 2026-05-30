import PageShell from '@/components/kukirin/PageShell';

export const metadata = { title: 'Політика конфіденційності' };

export default function PrivacyPage() {
  return (
    <PageShell breadcrumb="LEGAL · PRIVACY" title="Політика конфіденційності" subtitle="Як ми обробляємо ваші персональні дані відповідно до Закону України 'Про захист персональних даних'.">
      <article className="max-w-3xl space-y-5 text-sm leading-relaxed text-[#4A4A48] dark:text-white/75">
        <p>Останнє оновлення: 11.05.2026</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">1. Хто ми</h2>
        <p>Сайт kukirinstore.com.ua (далі — «Сайт») належить ФОП «kukirinstore.com.ua», ЄДРПОУ 12345678, який є офіційним дистрибʼютором електросамокатів KUKIRIN в Україні.</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">2. Які дані ми збираємо</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Імʼя, телефон, email — при оформленні замовлення або заявки на тест-драйв.</li>
          <li>Адреса доставки — для відправлення товару.</li>
          <li>Cookies і анонімні дані про відвідування — для аналітики й покращення сайту.</li>
        </ul>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">3. Для чого ми їх використовуємо</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Обробити замовлення, доставити товар, надати сервіс.</li>
          <li>Зʼязатись із вами щодо статусу замовлення.</li>
          <li>За вашою згодою — надсилати акції й корисні матеріали (можна відписатись у будь-який час).</li>
          <li>Виконати вимоги законодавства (податковий, бухгалтерський облік).</li>
        </ul>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">4. Кому передаємо дані</h2>
        <p>Тільки тим, без кого неможлива доставка/оплата: Новій Пошті, банкам (LiqPay/WayForPay), сервісним партнерам. Не продаємо, не передаємо третім особам у комерційних цілях.</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">5. Cookies</h2>
        <p>Ми використовуємо cookies для збереження кошика, мови інтерфейсу і знеособленої аналітики (Google Analytics, Meta Pixel). Ви можете відключити cookies у налаштуваннях браузера.</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">6. Ваші права</h2>
        <p>Ви маєте право отримати, виправити або видалити свої дані, обмежити обробку чи відкликати згоду. Напишіть на <a href="mailto:info@kukirin.ua" className="text-[#FF6B00] hover:underline">info@kukirin.ua</a> — ми виконаємо запит до 30 днів.</p>

        <h2 className="text-xl font-medium text-[#1a1a1a] dark:text-white">7. Зміни в політиці</h2>
        <p>Ми можемо оновлювати цей документ. Дата змін зазначається вгорі. Істотні зміни анонсуємо на сайті заздалегідь.</p>
      </article>
    </PageShell>
  );
}
