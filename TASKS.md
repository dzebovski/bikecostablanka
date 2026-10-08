# Bike Costa Blanca: трекер задач

> Єдине джерело правди для людей і AI-агентів.
> Правила: беремо задачу → ставимо `[~]` і своє ім'я/агента → закриваємо `[x]` з короткою нотаткою або посиланням на коміт.
> Статуси: `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked (вказати чим) · `[?]` потрібне рішення власника
> Контекст і факти про будинок: [docs/CONTEXT.md](docs/CONTEXT.md) · Підсумок і рішення: [docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md) · Промт нового лендінгу: [docs/LANDING_PROMPT_V2.md](docs/LANDING_PROMPT_V2.md) · Промт для верстки: [docs/BUILD_PROMPT.md](docs/BUILD_PROMPT.md) · Промт для impeccable (ритм + нижня панель): [docs/IMPECCABLE_PROMPT.txt](docs/IMPECCABLE_PROMPT.txt) (чистий текст для команди)

---

## 1. Задача

Отримувати **бронювання на 2+ тижні в міжсезоння (листопад–квітень)** для будинку в Ondara (Marina Alta, Costa Blanca) від велосипедистів-шосейників з Північної Європи.

Як:
1. Лендінг (Next.js на Vercel) з контентом про веловідпочинок, будинок і зимове проживання.
2. Трекінг наміру забронювати довгий період (`LongStayIntent`), а не просто кліку.
3. Тестова реклама (Meta + Google) з оптимізацією на `LongStayIntent`.

Головна метрика: кількість заброньованих ночей у листопаді–квітні. Проміжна: вартість `LongStayIntent`.

Позиціювання: *Your winter cycling base on the Costa Blanca. A real house in Ondara, with routes from the door, run by a local rider.*

Обмеження (не обіцяємо): прокату велосипедів, ремонту, гідів і турпакетів немає. Даємо маршрути, локальні поради й партнерів.

---

## 2. Аудиторія

**Гео:** UK, IE, NL, BE, DE, AT, CH, DK, SE, NO, FI.
**Вік:** 35–70.

| # | Сегмент | Тригер | Що показуємо |
|---|---|---|---|
| A | Шосейники-аматори, зимова база (35–55) | Вдома холодно й темно, треба накатати базу | Coll de Rates, маршрути від дверей, погода, зберігання велосипеда, пральна машина |
| B | Пари або друзі, де катається не кожен | Відпустка «для всіх» | Пляжі, Dénia/Jávea/Altea, ринки, ресторани |
| C | Зимові довгострокові гості: пенсіонери, напівпенсіонери | Перезимувати в теплі 1–3 місяці | Місячна ціна, опалення, побут, супермаркети, медицина |
| D | Remote workers, які катаються | Ранковий заїзд, потім робота | Wi-Fi, робоче місце, ритм дня |
| E | Тріатлоністи перед сезоном | Передсезонний кемп | Підйоми, плоскі ділянки, басейн і біг поруч |

Основний меседж: **A great cycling base, even if not everyone in your group rides.**

---

## 3. Конверсії й трекінг

Рішення: основна конверсія `LongStayIntent`. Параметри дат і гостей передаються на Airbnb.

- [ ] **3.1** Форма вибору дат на лендінгу: check-in, check-out, гості (мінімум 11 ночей; за замовчуванням 14). Дати, коротші за 11 ночей, блокуємо з підказкою.
- [ ] **3.2** Генерація URL Airbnb: `https://www.airbnb.com/rooms/1692875983935079214?check_in=YYYY-MM-DD&check_out=YYYY-MM-DD&adults=N` (EN-домен для іноземців; для `/uk` можна `airbnb.com.ua`).
- [ ] **3.3** Події (GA4 + Meta Pixel + Google Ads):
  - `view_dates`: користувач змінив дати
  - `click_book_airbnb` / Meta `InitiateCheckout` з `{ nights, guests, value, currency: 'EUR', check_in, locale }`
  - `LongStayIntent` (custom), якщо `nights >= 11` (= мінімальний термін), з тими самими параметрами → основна конверсія для реклами. `value` = орієнтовна вартість (`nights × €75`), щоб Meta могла оптимізувати на цінність (довші = цінніші).
  - Перевірено 2026-10-08: Airbnb підхоплює `check_in`/`check_out`/`adults` з URL і одразу показує total.
  - `generate_lead`: email за GPX або гайд
  - `click_book_direct`, якщо лишаємо Lodgify (див. 3.6)
- [ ] **3.4** UTM → зберігати в `sessionStorage` і передавати в події (source, campaign).
- [ ] **3.5** Cookie consent (ЄС, GDPR): Consent Mode v2 для Google, Pixel тільки після згоди.
- [ ] **3.6** `[?]` Рішення власника: старий сайт веде і на **Lodgify** (`bikecostablanca.lodgify.com`, «direct −5%»), і на Airbnb. Яка кнопка головна? Рекомендація: Airbnb як головна (довіра та відгуки), Lodgify як «Book direct & save» (на ній можна виміряти справжню покупку, якщо Lodgify дозволяє піксель).
- [ ] **3.7** Meta: custom conversion `LongStayIntent`. GA4: key event. Google Ads: імпорт конверсії.
- [ ] **3.8** Тестування подій: GA4 DebugView, Meta Events Manager → Test events.

---

## 4. Лендінг

**Стек:** Next.js (App Router, TS) + Tailwind + next-intl → Vercel. Репо: `github.com/dzebovski/bikecostablanka` (старий вміст видалено).

**Мови:** `en` (головна), `uk` (бекап), `de` (третя мова, рекомендація; див. 4.0).

### 4.0 Рішення
- [x] Третя мова: **німецька**, запуск другою хвилею (див. 5.0). Підтверджено власником 2026-10-08.
  - DE: Німеччина, Австрія, Швейцарія разом найбільший ринок шосейників у Північній Європі. Сильний Komoot. Багато німців зимує на Costa Blanca. Пошук `Rennrad Urlaub Costa Blanca` / `Trainingslager Spanien`. Німецькомовні гірше реагують на англомовну рекламу, тож переклад дає найбільший приріст охоплення.
  - FR: Валлонія і Франція. Франція не є «північною» і має свої теплі зимові регіони. Пріоритет нижчий.
  - NL читає англійською добре, тому нідерландську варто додати пізніше, якщо Бельгія чи Нідерланди дадуть конверсії.
- [x] Мінімальний термін: **11 ночей** (рішення власника, 2026-10-08).
- [x] Ціни: **як на Airbnb** (рішення власника). Ціни динамічні, тому на сайті не хардкодимо таблицю. Показуємо орієнтир «from ~€70/night on a 2-week stay» + живий total через кнопку з датами. Зріз 2026-10-08 (EUR, 2 гостя, з усіма зборами):
  - 1–15 Dec 2026 (14 ночей): **€999** (було €1,218 до тижневої знижки) ≈ €71/ніч
  - 2–13 Mar 2027 (11 ночей): **€1,155** ≈ €105/ніч
  - 5 Jan – 5 Feb 2027 (місяць): total не показано, перевірити календар або місячну знижку в кабінеті Airbnb
  - ⚠️ Рекомендація власнику: увімкнути **місячну знижку** на Airbnb, бо це головний аргумент для зимувальників.
- [?] Домен: переносимо `bikecostablanca.com` на Vercel чи спершу піддомен або превʼю?

### 4.1 Контент (етап 1)
- [ ] **4.1.1** Sitemap одного лендінгу (single page + сторінки маршрутів): Hero → Why Ondara in winter → Routes from the door → The house → Winter long stay (ціни) → Not riding? (Explore) → Getting here → Local partners → About the host → FAQ → Booking widget.
- [x] **4.1.2** EN-копірайт усіх секцій → `src/i18n/messages/en.json`. ⚠️ Перевірити: середні температури (17–21°C, Nov–Apr) за даними AEMET; текст «Your host» з власником.
- [ ] **4.1.3** UK-переклад → `src/i18n/messages/uk.json` + додати `uk` у `src/i18n/config.ts`, `src/i18n/dictionaries.ts`, `src/lib/airbnb.ts` (airbnb.com.ua).
- [ ] **4.1.4** DE-переклад → `src/i18n/messages/de.json` (так само додати `de` у конфіги; airbnb.de). Вичитати носієм або хоча б другою моделлю.
- [ ] **4.1.5** SEO: title/description на кожну мову, ключові запити (EN/DE/NL), hreflang, OG-зображення.
- [ ] **4.1.6** Лід-магніт: «Costa Blanca Winter Cycling Guide» (маршрути + GPX, погода, кафе, логістика), PDF або сторінка.
- [!] **4.1.7** Матеріали від власника: фото всіх кімнат, bike storage, робоче місце, зимові фото доріг, швидкість Wi-Fi, опалення, GPX-файли, фото власника, відгуки з Airbnb. Блокує: власник.

### 4.2 Дизайн (етап 2): веде власник
- [x] **4.2.1** Дизайн-система «Cabin Journal»: https://claude.ai/artifact/L86s9zkwAQpujtyk35g2Mt
- [x] **4.2.1a** Промт для дизайну сторінки: [docs/DESIGN_PROMPT.md](docs/DESIGN_PROMPT.md). Рішення: Claude Design; підхід «будинок понад усе», як в Airbnb; компактні відступи + липкий блок бронювання + липка шапка; конверсії: дати → Airbnb (головна), WhatsApp/email господарю; ціна «from ~€70/night» + оцінка; слово-лого + EN/UK/DE.
- [x] **4.2.1b** 30 фото з Airbnb-оголошення → `public/images/house/` (оригінали 56 шт. у `../photos/airbnb/`, поза репо).
- [?] **4.2.1c** WhatsApp-номер і email для «Message Eugene» → env `NEXT_PUBLIC_CONTACT_WHATSAPP`, `NEXT_PUBLIC_CONTACT_EMAIL` (поки порожні, посилання приховані).
- [ ] **4.2.2** ~~Дизайн-система v6 (Newsreader, кут 72/4, сітка Raus)~~: власнику не сподобалось, відкочено до першої версії (v7 = v5).
- [!] **4.2.3** ~~Макет v3~~ відкочується до версії 9 (через історію версій на полотні). Потрібен інший підхід. Було: https://claude.ai/artifact/8UvkEJrYN93wv68mC6zvfn. Desktop, Mobile і стани бронювання перероблено за Raus: нижня жовта панель замість правої колонки, рядки фото, темна секція маршрутів, таблиця цін по місяцях, реальні відгуки. Лишилось: прототипи календаря відкривати вгору від панелі; фото для Bernia; ще кілька раундів шліфування (власник).
- [x] **4.2.4** iCal Airbnb → env `AIRBNB_ICAL_URL` (Vercel, Production). Підключити в календарі на етапі верстки.
- [ ] **4.2.2** Токени (кольори, типографіка, spacing) → `tailwind`/CSS variables.
- [ ] **4.2.3** Макет лендінгу: desktop + mobile.

- [x] **4.2.5** Макет v2 за `docs/LANDING_PROMPT_V2.md`: полотно https://claude.ai/artifact/8UvkEJrYN93wv68mC6zvfn, сторінка «Page 2» (артборди `V2-*`). Перевірено 2026-10-08, дрібні правки: у фінальному CTA та в цінах кнопка «Check dates» замість «Check availability →» / «See your exact price»; у календарі перша заброньована ніч доступна як день виїзду. Сторінка 1 — стара відхилена версія.
- [x] **4.2.6** Медіа власника з WhatsApp (4 відео, 3 фото) → `docs/reference/media/`.

### 4.3 Верстка (етап 3)
- [~] **4.3.0** Верстка за макетом v2 за промтом [docs/BUILD_PROMPT.md](docs/BUILD_PROMPT.md): гілка `landing-v2`, превʼю на Vercel. Зроблено: токени, усі секції V2-Desktop/V2-Mobile, `/en/photos`, 404, лайтбокс, модалка зручностей, логіка бронювання (`src/lib/booking.ts` + 12 тестів), 6 станів, desktop-поповер і мобільна шторка, `/api/availability` (iCal, кеш 1 год), події, Consent Mode v2 + банер. На проді з 2026-10-08 (merge у `main`), реальний iCal-фід працює.
- [x] **4.3.1** Скелет Next.js 16.4 (App Router, Cache Components) + Tailwind 4 + ESLint. i18n за офіційним патерном `app/[lang]` + словники, без бібліотек; `src/proxy.ts` редіректить `/` → `/en` за Accept-Language.
- [x] **4.3.2** Секції лендінгу (v2, гілка `landing-v2`): базова верстка з усім EN-контентом уже на проді (тимчасовий стиль до дизайн-системи). Фінальна верстка за макетом.
- [x] **4.3.3** Booking form `src/components/booking-form.tsx`: валідація мінімуму 11 ночей, URL Airbnb з датами, події `view_dates`, `click_book_airbnb`/`InitiateCheckout`, `LongStayIntent` (перевірено на проді 2026-10-08). Чекає ID пікселів (4.3.4).
- [~] **4.3.4** Аналітика (GA4, Meta Pixel, Google Ads tag) + consent: код готовий, теги вмикаються env-змінними `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GADS_ID` (+ опційно `NEXT_PUBLIC_GADS_LONGSTAY_LABEL`). Чекає ID.
- [~] **4.3.0a** Ритм сторінки + бронювання з правої колонки в липку нижню панель (як raus.life): промт [docs/IMPECCABLE_PROMPT.md](docs/IMPECCABLE_PROMPT.md), гілка `refine-rhythm-bar`, превʼю на Vercel. Зроблено: картку бронювання прибрано; desktop-панель `BookingBar` (marigold-пігулка 960px, поля + підсумок + одна кнопка, поповери відкриваються вгору від поля, стани в панелі над баром, ховається біля Final CTA, під модалками й cookie-банером), мобільний бар у тому ж стилі, Final CTA = та сама пігулка більша; події з бару з `source: bottom_bar`. Ритм: 4 розділи (Будинок, Катання, Проживання, Практичне), шкала відступів `--space-4…96` і ролі `--gap-head/content/section/chapter`, 12-колонкова сітка, заголовок «Reviews». Додано `PRODUCT.md` і `DESIGN.md`. Чекає перегляду власника.
- [ ] **4.3.5** Оптимізація зображень (`next/image`), Lighthouse ≥ 90 на мобільному.
- [ ] **4.3.6** Вбудовування Airbnb (офіційна картка «Share → Embed»), опційно як соціальний доказ. Головний CTA лишається на нашій кнопці, бо в iframe кліки не трекаються.

### 4.4 Деплой (етап 4)
- [x] **4.4.1** Встановлено `gh` і `vercel` CLI.
- [x] **4.4.2** `gh` (dzebovski) і `vercel` (makrodzebiki-2550) авторизовані. Vercel MCP (plugin:vercel:vercel) підключено.
- [~] **4.4.3** Vercel-проєкт `dzebovski/bikecostablanka` створено, GitHub підключено (push у `main` = прод-деплой). Прод: https://bikecostablanka.vercel.app. Лишилось: env-змінні (`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GADS_ID`).
- [ ] **4.4.4** Домен + редіректи зі старих URL (`/cycling-routes`, `/getting-here`, `/when-to-visit` …) на секції нового лендінгу.

---

## 5. Тестова реклама

Стартувати одразу після запуску лендінгу й перевірки подій (жовтень–листопад: бронювання на грудень–березень).

### 5.0 ГЕО першого тесту (підтверджено 2026-10-08)
Хвиля 1 лише англійською: не чекає перекладів, один набір креативів, чистий тест ринків.

| Ad set | Країни | Чому |
|---|---|---|
| `UK_IE` | UK, Ірландія | Найбільший ринок велотуризму на Costa Blanca, десятки прямих рейсів в ALC, англійська рідна |
| `Nordics` | Норвегія, Швеція, Данія, Фінляндія | Найдовша й найтемніша зима, висока купівельна спроможність, вільна англійська, велика скандинавська громада поруч (Albir, l'Alfàs del Pi) |
| `Benelux` | Нідерланди, Бельгія | Найвища щільність шосейників, Calpe і Dénia для них «свої», англійська на високому рівні |

Хвиля 2 (після 14 днів і перших даних): DE, AT, CH з німецькою версією `/de`.
Хвиля 3 (опційно): NL-переклад, якщо Benelux покаже найкращий CPA.
Не беремо в тест: Францію, Іспанію (локальний ринок), США (далеко, коротші відпустки).

### 5.1 Meta (Instagram + Facebook)
- [ ] **5.1.1** Кампанія `BCB_Winter_LongStay_W1`: ціль Sales, оптимізація на `LongStayIntent`. Бюджет-тест **€20/день** (CBO на 3 ad sets), 14 днів ≈ €280.
- [ ] **5.1.2** Ad sets (хвиля 1, усі EN → `/en`):
  - `UK_IE` · 35–65
  - `Nordics` · 35–65
  - `Benelux` · 35–65
  - Однакові інтереси як Advantage+ підказка: Strava, Zwift, GCN, Rapha, Canyon, Specialized, Tour de France, road cycling, triathlon
  - Хвиля 2: `DACH_DE` (DE, AT, CH, DE-креативи → `/de`) і `Winterers_55+` (UK, Nordics, NL, BE, DE · 55–70 · travel, Spain, retirement, cycling → секція long stay)
- [ ] **5.1.3** Креативи (3–4 на ad set):
  1. Reel: підйом на Coll de Rates у січні, текст «+19°C in January»
  2. Контраст: «Amsterdam, +3°C, rain / Ondara, +19°C, sun»
  3. Карусель: 3 маршрути (км / м висоти) + будинок
  4. «Pogačar: 11:57 on Coll de Rates. Your host: 19:20. Your time?» (Strava-челендж)
  5. Для 50+: «Spend your winter here: monthly stays from €X»
- [ ] **5.1.4** Ремаркетинг: відвідувачі лендінгу за 30 днів без `LongStayIntent`.

### 5.2 Google Ads (Search)
- [ ] **5.2.1** Кампанія `BCB_Search_EN`, **€10–15/день**, гео UK, IE, NO, SE, DK, FI, NL, BE (як 5.0), конверсія `LongStayIntent`:
  `cycling holiday costa blanca`, `calpe cycling villa`, `denia cycling accommodation`, `winter cycling spain`, `cycling training camp spain`, `coll de rates accommodation`, `long term rental costa blanca winter`
- [ ] **5.2.2** `BCB_Search_DE`: `rennrad urlaub costa blanca`, `trainingslager spanien rennrad`, `ferienhaus denia rennrad`, `überwintern costa blanca`
- [ ] **5.2.3** Мінус-слова: `hotel`, `tour`, `guided`, `package`, `rent bike` (ми не прокат), `job`
- [ ] **5.2.4** Розглянути NL (`fietsvakantie calpe`, `wielrennen costa blanca`, `overwinteren spanje`) після першого тесту.

### 5.3 Органіка (паралельно, без бюджету)
- [ ] **5.3.1** Strava Club «Bike Costa Blanca» + маршрути з посиланням на сайт.
- [ ] **5.3.2** Komoot Collection «Rides from Ondara» (DE/NL аудиторія).
- [ ] **5.3.3** Аутріч: 10 велоклубів UK/BE/NL + 5 тренерів, що проводять зимові кемпи.
- [ ] **5.3.4** 3–5 мікроблогерів: тиждень проживання за контент.

### 5.4 Аналіз
- [ ] **5.4.1** Через 14 днів: CPA `LongStayIntent` за ad set і мовами, перерозподіл бюджету.
- [ ] **5.4.2** Щотижня звіряти `LongStayIntent` з реальними запитами й бронюваннями в Airbnb/Lodgify, вести таблицю.

---

## Журнал
- 2026-10-08: гілка `refine-rhythm-bar`: бронювання в нижню панель (desktop і mobile в одному стилі), 4 розділи з одним правилом відступів, 12-колонкова сітка; lint, 12 тестів і build проходять; скріншоти «до/після» в `../refine-shots/`.
- 2026-10-08: проміряно ритм живого сайту; промт для impeccable: 4 розділи замість однакових секцій, одна шкала відступів, бронювання в нижню панель.
- 2026-10-08: лендінг v2 змерджено в `main` і задеплоєно на https://bikecostablanka.vercel.app. Живий фід: зайнято 27 Dec – 11 Jan (знімок цін казав «free 1–27 Dec», тепер вільно 1–26 Dec) і окремі ночі 23 Jan, 19 Mar → оновити `src/data/prices.ts`.
- 2026-10-08: верстка v2 у гілці `landing-v2` (Next.js 16.4), превʼю на Vercel. `AIRBNB_ICAL_URL` позначена Sensitive і є лише в Production, тому на превʼю календар у стані «Calendar unavailable».
- 2026-10-08: макет v2 (Page 2) перевірено й підправлено; написано промт для верстки `docs/BUILD_PROMPT.md`.
- 2026-10-08: зібрано всю інформацію (CONTEXT, PROJECT_SUMMARY), промт лендінгу v2, медіа з WhatsApp.
- 2026-10-08: макет v3 і DS v6 відхилено власником, відкат.
- 2026-10-08: макет v3 (аналіз Raus), дизайн-система v6, ціни й вільні дати по місяцях, iCal у Vercel.
- 2026-10-08: Next.js-застосунок з EN-контентом і формою бронювання задеплоєно на https://bikecostablanka.vercel.app. Підтверджено: DE як третя мова (хвиля 2), ГЕО хвилі 1.
- 2026-10-08: рішення власника: мінімум 11 ночей, ціни як на Airbnb. Запропоновано DE як третю мову і ГЕО хвилі 1 (UK/IE, Nordics, Benelux), чекає підтвердження.
- 2026-10-08: створено трекер; зібрано контекст зі старого сайту та прототипу `old.zip`; репо очищено; встановлено `gh`, `vercel`.
