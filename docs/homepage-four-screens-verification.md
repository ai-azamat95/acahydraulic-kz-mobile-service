# Проверка четырёх экранов ACA — 2026-11-06

## Реализация

Ветка `codex/homepage-four-screens-local-20261106`. Продолжена существующая реализация, не создан новый сайт. `client/src/pages/Home.tsx` явно экспортирует `HomePage`. Общая шапка, четыре семантические секции, scoped `home.css`, существующие footer, калькулятор, Dialog/B2BLeadForm и маршрутизация сохранены.

1. Бренд: тёмный фотографический фон, показатели владельца, телефон и форма описания поломки.
2. Ремонт: SVG по геоданным, направления из Астаны, Казахстан/Кыргызстан, отдельные подписи. Исправлены выход Усть-Каменогорска за границы и пересечения подписей, включая Кокшетау/Астану.
3. Запчасти: SVG-глобус и направления поставок, утверждённые группы брендов, каталог и WhatsApp-подбор.
4. Работы: реальное превью CAT M318 из материалов задания, ссылка на `spniTTX9ECI`, кейсы и социальные ссылки. Нет стартовых iframe.

Desktop использует широкую двухколоночную композицию; mobile — растущие по содержимому секции. Исправлен выход footer за ширину 768 px. Восстановлены ссылки на статьи о подборе по номеру/шильдику, ремонте или замене насоса и кейс SANY SY365H.

Старые source-based тесты переведены на реальный HomePage с проверкой его подключения. Проверка каталоговых landing-ссылок теперь проверяет итоговый SSR HTML. Генераторы каталога корректно заменяют весь root с новым footer. В калькулятор добавлен существующий React-managed маркер: общий DOM tracker больше не дублирует `form_whatsapp_click`. Названия событий, ID кабинетов и правила согласия не заменялись.

## Реальные результаты

Проверки выполнялись последовательно, не параллельными сборками:

- `pnpm check` — exit 0.
- `pnpm build` — exit 0.
- SSR: `node scripts/create-spa-route-copies.mjs`, затем merchant feed, industrial AI, case/video routes, `pnpm catalog:routes`, `pnpm catalog:landing-routes`, markdown alternates — exit 0. В `dist/public/index.html` присутствует `.home-v2` до JavaScript.
- `pnpm exec vitest run --pool=threads --poolOptions.threads.singleThread` — 12 файлов, 88/88 тестов.
- `node --test tests/*.test.mjs` — 275/275 тестов, 0 skipped.
- `catalog:verify-public`, `catalog:verify-seo`, `catalog:verify-landings`, `catalog:verify-phase3-copy`, `catalog:verify-site` — успешно. 258 landing pages; public-site проверил 12794 файла без supplier leaks.
- `python3 scripts/audit-seo.py dist/public --strict` — без issues; 12495 уникальных sitemap URL.

## Браузер и безопасность

Реальный Chromium 158.0.8127.18, финальный запуск на собранном SSR из `http://127.0.0.1:4176`, не только Vite. Проверены 360×800, 390×844, 768×1024, 1440×900, 1920×1080. На каждом: один h1, четыре секции, нет горизонтального скролла, SVG-подписи не пересекаются и не выходят за viewBox, форма открывается в границах экрана и закрывается Escape, меню открывается/закрывается Escape. Необработанных pageerror нет.

25 контактных сценариев: телефон, подбор запчасти, мобильный WhatsApp, B2B-форма и калькулятор при разрешённых обоих consent, запрещённых обоих, analytics-only, marketing-only и excluded visit. Проверено число вызовов GA/Yandex/TikTok/Ads, отсутствие общего WhatsApp-дубля у форм, `contact_intent_id`, `form_source` и отсутствие тестовых персональных данных в аналитике. Проверены обязательные поля, недопустимый телефон, чекбокс согласия, отказ/принятие условий калькулятора. Видео не создаёт контактное событие. Навигация services/catalog/cases и browser Back прошла.

Все внешние запросы и контактные переходы перехвачены. Ни заявок, ни сообщений, ни реальных аналитических событий не отправлялось. Это проверка локальных вызовов, не подтверждение приёма события рекламным кабинетом/DebugView. JSON доказательства: `homepage-four-screens-artifacts/browser-layout.json` и `browser-contacts.json`.

## Скриншоты

В `docs/homepage-four-screens-artifacts/` находятся восемь настоящих Chromium PNG:

- `390-home-brand.png`, `390-home-repair.png`, `390-home-parts.png`, `390-home-work.png`;
- `1440-home-brand.png`, `1440-home-repair.png`, `1440-home-parts.png`, `1440-home-work.png`.

Это снимки целых секций при viewport 390×844 и 1440×900; высота секции может превышать viewport. Согласие закрыто перед захватом.

## Ограничения — не считать визуальным approval

Vision API ранее вернул `400 model_not_found` (`5 mini` unsupported); повторные вызовы не делались. Полноценное визуальное сопоставление с четырьмя эталонами НЕ подтверждено. Скриншоты и геометрические DOM-проверки не заменяют ручную приёмку композиции, фактуры, карты/глобуса и цвета. Нужен просмотр владельцем перед production. Safari, реальные телефоны и доступность через screen reader отдельно не тестировались. Проверка browser pageerror не эквивалентна полному аудиту консоли.

Старый сервер 4173 возвращал устаревший build без `.home-v2`; этот неуспешный прогон отброшен, финальные JSON и все PNG перезаписаны успешным запуском на 4176 из текущего `dist/public`.

## Открыть локальную версию

Из корня репозитория: `python3 -m http.server 4176 --bind 127.0.0.1 --directory dist/public`, затем `http://127.0.0.1:4176/`. Это локальный адрес на Mac, не публичный preview. Для разработки: `pnpm exec vite --host 127.0.0.1 --port 5175 --strictPort`.

Повтор браузерных проверок (Playwright установлен отдельно, lockfile проекта не менялся):

```sh
PREVIEW_URL=http://127.0.0.1:4176 PLAYWRIGHT_MODULE=/tmp/aca-browser-tools/node_modules/playwright/index.mjs node scripts/verify-home-browser.mjs
PREVIEW_URL=http://127.0.0.1:4176 PLAYWRIGHT_MODULE=/tmp/aca-browser-tools/node_modules/playwright/index.mjs node scripts/verify-home-contacts.mjs
```

Push, PR, merge, публикация production и изменения рекламных кабинетов не выполнялись. Инструкция отката — `homepage-four-screens-rollback.md`.
