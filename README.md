# Light/Dark Theme — повний пакет

## Що в пакеті

```
app/globals.css                       ← ЗАМІНИТИ існуючий
app/layout.tsx                        ← ЗАМІНИТИ існуючий
components/site/ThemeToggle.tsx       ← НОВИЙ файл
```

3 файли. Жоден інший файл сайту чіпати не треба.

## Як працює

- Кнопка теми зʼявляється у **правому верхньому куті** будь-якої сторінки.
  Це floating-кнопка з blur-фоном, не потребує змін у Header.
- Циклічний клік: 🖥 auto → ☀️ light → 🌙 dark → 🖥 auto
- Вибір зберігається у `localStorage.kukirin-theme`.
- За замовч. **auto** — підлаштовується під ОС користувача.
- Inline-script у `<head>` запобігає flash при перезавантаженні.

## Як залити

### 1. `app/globals.css` (замінити)

GitHub → `app/globals.css` → олівець → виділи все → видали →
встав вміст з ZIP → Commit `theme: light/dark tokens`.

⚠️ Це **повна заміна**. Я взяв твій існуючий globals.css і додав
зверху CSS-токени теми. Усі анімації (streak, glitch, cursor,
pulse, fade) лишились ідентичними.

### 2. `app/layout.tsx` (замінити)

GitHub → `app/layout.tsx` → олівець → виділи все → видали →
встав вміст з ZIP → Commit `theme: enable toggle + no-flash script`.

Зміни:
- `suppressHydrationWarning` на `<html>`
- Inline-script у `<head>` для застосування теми до першого рендеру
- `<ThemeToggle />` у `<body>` (floating button)

### 3. `components/site/ThemeToggle.tsx` (новий файл)

Якщо папки `components/site/` ще немає — створи її через
Add file → Create new file → введи назву `components/site/ThemeToggle.tsx` →
встав вміст → Commit `theme: add toggle component`.

Якщо папка є — Add file → Upload files → перетягни файл.

## Порядок деплою

Не критичний, але рекомендую:
1. Спершу `components/site/ThemeToggle.tsx` (новий файл)
2. Потім `app/globals.css`
3. Останнім `app/layout.tsx` (бо він імпортує ThemeToggle)

Якщо запушити layout.tsx раніше ніж ThemeToggle — Vercel виб'є помилку
білда. Але це швидко виправляється — просто запушиш ThemeToggle після.

## Smoke-test

Після всіх трьох commits + Vercel Ready:

1. Відкрий `https://kukirin-ua-gpbw.vercel.app` у новій вкладці
2. У правому верхньому куті має бути кнопка з іконкою 🖥 (auto)
3. Натисни — стане ☀️ і сайт стане світлим
4. Натисни ще раз — стане 🌙 і темним
5. Натисни ще раз — повернеться 🖥 auto
6. Перезавантаж — обраний режим зберігається
7. Відкрий в інкогніто — за замовч. йде auto (як ОС)

## Якщо кнопка заважає

Можеш:
- Видалити `<ThemeToggle />` з `body` в layout.tsx — кнопка зникне
  (але JS логіка через `data-theme` лишиться, і можна вручну
  перемикати через DevTools).
- Або перенести у Header — скинеш мені Header і я вставлю.

## Якщо світла тема показує проблеми

Можливі сценарії:
- **Білий текст на білому** — десь у коді `text-white` без захисту.
  Скрін + URL сторінки → додам переозначення.
- **Чорний хедер на світлому** — якщо хедер має `bg-black` хардкодом.
  Скинь Header.tsx → переведу на токени.
- **Чорна футер-смуга** — те саме що з хедером.

## Як відкотити

Якщо взагалі не сподобається:
1. У GitHub → History для кожного з 3 файлів → Revert
2. Або просто видали `components/site/ThemeToggle.tsx` і відкоти globals.css + layout.tsx

## Адмінка

`/admin/*` зараз теж буде реагувати на тему. Якщо хочеш закріпити її
завжди темною — скажи, додам спеціальну логіку у скрипт.
