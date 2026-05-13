# KUKIRIN.UA — Світла тема (FINAL, протестовано)

## Що це

Повний пакет переписаних UI-файлів сайту з підтримкою світлої теми за
замовчуванням і темної через перемикач. Кожен файл — це **повна заміна**
існуючого у тебе.

**Перевірено `npx next build` локально — компілюється без помилок.**

## Як працює

- **За замовчуванням** — світла тема (фон `#FAFAF7`, текст `#1A1A1A`)
- **Темна** — вмикається через `<html data-theme="dark">`, кнопкою у кутку
- **Auto** — дивимось на ОС користувача
- Inline-script у `<head>` ставить тему ДО першого рендеру → жодного flash
- Кнопка теми — у **правому нижньому куті**, кругла, 3 стани:
  🖥 авто → ☀️ світла → 🌙 темна

## Список 25 файлів

```
app/globals.css                                  ← замінити
app/layout.tsx                                   ← замінити
app/catalog/page.tsx                             ← замінити
app/accessories/page.tsx                         ← замінити
app/account/page.tsx                             ← замінити
app/blog/page.tsx                                ← замінити
app/blog/[slug]/page.tsx                         ← замінити
app/cart/page.tsx                                ← замінити
app/category/[slug]/page.tsx                     ← замінити
app/checkout/page.tsx                            ← замінити
app/checkout/success/[orderNumber]/page.tsx      ← замінити
app/contacts/page.tsx                            ← замінити
app/delivery/page.tsx                            ← замінити
app/not-found.tsx                                ← замінити
app/privacy/page.tsx                             ← замінити
app/product/[slug]/page.tsx                      ← замінити
app/service/page.tsx                             ← замінити
app/terms/page.tsx                               ← замінити
app/test-drive/page.tsx                          ← замінити
app/warranty/page.tsx                            ← замінити

components/kukirin/KukirinHero.tsx               ← замінити
components/kukirin/KukirinModels.tsx             ← замінити
components/kukirin/KukirinFeatures.tsx           ← замінити
components/kukirin/KukirinCTA.tsx                ← замінити
components/kukirin/KukirinFooter.tsx             ← замінити
components/kukirin/PageShell.tsx                 ← замінити

components/cart/CartIcon.tsx                     ← замінити
components/cart/CartView.tsx                     ← замінити
components/cart/CheckoutForm.tsx                 ← замінити
components/cart/AddToCartButton.tsx              ← замінити

components/site/ThemeToggle.tsx                  ← новий (якщо немає)
```

Структура в ZIP така сама як у твоєму репо — `app/...` ↔ `app/...`,
`components/...` ↔ `components/...`.

## Як залити — ШВИДКИЙ ВАРІАНТ (рекомендую)

GitHub web UI не дозволяє завантажити цілу папку за раз, але дозволяє
**кілька файлів через drag&drop**.

1. Розпакуй ZIP локально → отримаєш папки `app/` і `components/`
2. У браузері відкрий https://github.com/toxa8949-cmd/kukirin-ua
3. Натисни **Add file → Upload files**
4. **Перетягни всю папку `app/` цілком** з твого компʼютера у вікно завантаження
5. GitHub автоматично збереже структуру вкладень
6. Commit message: `theme: light theme by default + dark mode toggle`
7. Натисни Commit changes
8. Те ж саме для папки `components/` — окремим commit

⚠️ Якщо drag&drop папки не працює (буває у Safari) — використовуй **Firefox** або **Chrome**.

## Як залити — РУЧНИЙ ВАРІАНТ (якщо drag&drop не йде)

Заходиш у кожен файл, копіюєш вміст, замінюєш у GitHub. Це 25 файлів × ~30 секунд = 12 хвилин.

**Порядок (важливо!):**
1. `components/site/ThemeToggle.tsx` (новий) — створи через `Add file → Create new file`
2. `components/kukirin/PageShell.tsx`
3. `components/kukirin/*` (Hero, Models, Features, CTA, Footer)
4. `components/cart/*`
5. `app/globals.css`
6. Всі сторінки в `app/`
7. **`app/layout.tsx` ОСТАННІМ** (бо імпортує ThemeToggle)

Якщо layout.tsx запушиш раніше за ThemeToggle.tsx — Vercel впаде з помилкою.

## Кеш Vercel

Після всіх commits **дочекайся Vercel Ready** (зелений значок).
На сайті відкрий **в інкогніто-вкладці** або зроби `Cmd+Shift+R` —
інакше побачиш старий кеш.

## Що далі — почисти

Після того як впевнишся що все працює:

1. У GitHub `app/kukirin-accents.css` → видали цей файл (старий артефакт)
2. Будь-які інші старі `kukirin-accents.*` чи `light-theme.*` файли — видали

## Smoke-test (обовʼязковий)

Після Ready пройди по всім ключовим сторінкам:
- [ ] `/` — головна (Hero, Models, Features, CTA, Footer)
- [ ] `/catalog` — каталог
- [ ] `/product/kukirin-g2-pro` — карточка товара
- [ ] `/blog` — список статей
- [ ] `/service` — сервіс (це там була проблема)
- [ ] `/cart` — кошик (порожній)
- [ ] `/checkout` — оформлення замовлення
- [ ] Кнопка тема — натисни кілька разів, обидві теми працюють?

Якщо щось виглядає дивно — скрін, виправлю точково.

## Кольорова палітра (на майбутнє)

```
Світла:                                Темна:
  фон сторінки:    #FAFAF7              #0A0A0A
  фон картки:      #FFFFFF              #0F0F0F
  фон футера:      #F0EEE6              #070707
  текст основний:  #1A1A1A              #FFFFFF
  текст 2-й:       #4A4A48              rgba(255,255,255,0.55)
  текст дрібний:   #6C6A65              rgba(255,255,255,0.40)
  бордюр:          #E8E6DE              rgba(255,255,255,0.10)
  оранжевий:       #FF6B00 (без змін)
  оранжевий темн.: #993C1D (для контр. тексту на світлому)
```

## Якщо щось не подобається

Можеш окремо просити переробити стилі — наприклад "зробити картки темнішими" або "інший відтінок оранжевого". Усі стилі через токени, поправлю за 1 хв.

## Якщо щось зламається

Зроби rollback одним commit-ом — у GitHub History для кожного файлу є кнопка
**Revert**. Не страшно, не втрачаєш роботу.
