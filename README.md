# Логотип KUKIRIN — додано скрізь

## Що зроблено

Прибрав чорний фон з логотипа (Pillow + numpy), обрізав до контента,
згенерував усі потрібні розміри. Додав логотип у Header, Footer, Hero,
сторінку товара, і favicon вкладки браузера.

## Файли в пакеті

### Зображення → `public/`
```
logo-mark.png            ← тільки дракон (для іконки)
logo-full.png            ← дракон + текст KuKirin (для футера)
favicon.ico              ← вкладка браузера (multi-size 16/32/48)
apple-touch-icon.png     ← iOS home screen (180x180)
icon-192.png             ← PWA icon
icon-512.png             ← PWA icon high-res
```

### Код
```
components/kukirin/PageShell.tsx       ← Header і Footer тепер з <Logo>
app/product/[slug]/page.tsx            ← Великий дракон-watermark на картці товара
```

## Що ще змінилось

**Hero (`KukirinHero.tsx`)** — НЕ змінював, у тебе там вже стояв `<Logo variant="inline">`.

**Існуючий компонент `Logo.tsx`** — НЕ змінював, бо він і так правильний:
- `<Logo variant="mark">` — тільки дракон
- `<Logo variant="full">` — дракон + текст
- `<Logo variant="inline">` — дракон + текст "KUKIRIN.UA"

Файли `logo-mark.png` і `logo-full.png` тепер тільки **замінюються** новими з
прозорим фоном замість чорного.

## Як залити

1. Розпакуй ZIP
2. GitHub → Upload files → перетягни папку `public/`
3. GitHub запитає замінити існуючі `logo-mark.png`, `logo-full.png`,
   `favicon.ico`, `apple-touch-icon.png` — **так, замінити**
4. Окремо заміни `components/kukirin/PageShell.tsx`
5. Окремо заміни `app/product/[slug]/page.tsx`
6. Commit `feat: KUKIRIN logo across the site + favicon`

## Перевірено

```
npx next build → ✓ 35 сторінок успішно
```

## Що очікувати

**Header** — дракон + текст "KUKIRIN.UA" поруч (як було, але дракон тепер
з прозорим фоном)

**Footer** — повний логотип "KuKirin" (дракон + слово), розмір 56px,
зліва над описом

**Hero** — без змін (вже був з `<Logo>` компонентом)

**Картка товара (`/product/<slug>`)** — великий дракон в правому нижньому
куті, дуже прозорий (`opacity 6%` у світлій темі, `10%` у темній).
Не відволікає від фото, але додає брендовий акцент

**Вкладка браузера** — іконка з драконом замість стандартної

**iOS home screen** — якщо хто збереже сайт на головну, буде іконка дракона
на бежевому фоні (180×180)

## Якщо щось виглядає не так

- **Дракон у хедері занадто великий/малий** — у `PageShell.tsx` параметр
  `size={28}` → можеш зробити 24 або 32
- **Дракон у футері занадто великий** — `size={56}` → 40 або 48
- **Watermark на товарі занадто помітний** — у `app/product/[slug]/page.tsx`
  знайди `opacity-[0.06]` → зроби `opacity-[0.04]`
- **Виглядає не так як хотів** — скинь скрін, поправимо точково
