# Bike Costa Blanca: трекер задач

> Єдине джерело правди для людей і AI-агентів.
> Правила: беремо задачу → ставимо `[~]` і своє ім'я/агента → закриваємо `[x]` з короткою нотаткою або посиланням на коміт.
> Статуси: `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked (вказати чим) · `[?]` потрібне рішення власника
> Контекст і факти про будинок: [docs/CONTEXT.md](docs/CONTEXT.md)

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

- [ ] **3.1** Форма вибору дат на лендінгу: check-in, check-out, гості (за замовчуванням від 14 ночей).
- [ ] **3.2** Генерація URL Airbnb: `https://www.airbnb.com/rooms/1692875983935079214?check_in=YYYY-MM-DD&check_out=YYYY-MM-DD&adults=N` (EN-домен для іноземців; для `/uk` можна `airbnb.com.ua`).
- [ ] **3.3** Події (GA4 + Meta Pixel + Google Ads):
  - `view_dates`: користувач змінив дати
  - `click_book_airbnb` / Meta `InitiateCheckout` з `{ nights, guests, value, currency: 'EUR', check_in, locale }`
  - `LongStayIntent` (custom), якщо `nights >= 14`, з тими самими параметрами → основна конверсія для реклами
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
- [?] Третя мова: **німецька (рекомендовано)** чи французька?
  - DE: Німеччина, Австрія, Швейцарія разом найбільший ринок шосейників у Північній Європі. Сильний Komoot. Багато німців зимує на Costa Blanca. Пошук `Rennrad Urlaub Costa Blanca` / `Trainingslager Spanien`.
  - FR: Валлонія і Франція. Франція не є «північною» і має свої теплі зимові регіони. Пріоритет нижчий.
  - NL читає англійською добре, тому нідерландську варто додати пізніше, якщо Бельгія чи Нідерланди дадуть конверсії.
- [?] Мінімальний термін: на старому сайті **11 ночей**, у прототипі **15**, у рекламі «2+ тижні». Потрібна фінальна цифра.
- [?] Ціни: «from €60/night» (старий сайт), у прототипі €1,500/15 ночей, €2,400/міс, €2,000/міс на 2–3 міс. Які показуємо?
- [?] Домен: переносимо `bikecostablanca.com` на Vercel чи спершу піддомен або превʼю?

### 4.1 Контент (етап 1)
- [ ] **4.1.1** Sitemap одного лендінгу (single page + сторінки маршрутів): Hero → Why Ondara in winter → Routes from the door → The house → Winter long stay (ціни) → Not riding? (Explore) → Getting here → Local partners → About the host → FAQ → Booking widget.
- [ ] **4.1.2** EN-копірайт усіх секцій → `content/en.json` (джерело фактів: docs/CONTEXT.md).
- [ ] **4.1.3** UK-переклад → `content/uk.json`.
- [ ] **4.1.4** DE-переклад (після рішення 4.0) → `content/de.json`. Вичитати носієм або хоча б другою моделлю.
- [ ] **4.1.5** SEO: title/description на кожну мову, ключові запити (EN/DE/NL), hreflang, OG-зображення.
- [ ] **4.1.6** Лід-магніт: «Costa Blanca Winter Cycling Guide» (маршрути + GPX, погода, кафе, логістика), PDF або сторінка.
- [!] **4.1.7** Матеріали від власника: фото всіх кімнат, bike storage, робоче місце, зимові фото доріг, швидкість Wi-Fi, опалення, GPX-файли, фото власника, відгуки з Airbnb. Блокує: власник.

### 4.2 Дизайн (етап 2): веде власник
- [~] **4.2.1** Дизайн-референси та дизайн-система (власник, зараз).
- [ ] **4.2.2** Токени (кольори, типографіка, spacing) → `tailwind`/CSS variables.
- [ ] **4.2.3** Макет лендінгу: desktop + mobile.

### 4.3 Верстка (етап 3)
- [ ] **4.3.1** Скелет Next.js + next-intl (`/en`, `/uk`, `/de`), Tailwind, ESLint.
- [ ] **4.3.2** Секції лендінгу за макетом.
- [ ] **4.3.3** Booking widget (3.1–3.3).
- [ ] **4.3.4** Аналітика (GA4, Meta Pixel, Google Ads tag) + consent.
- [ ] **4.3.5** Оптимізація зображень (`next/image`), Lighthouse ≥ 90 на мобільному.
- [ ] **4.3.6** Вбудовування Airbnb (офіційна картка «Share → Embed»), опційно як соціальний доказ. Головний CTA лишається на нашій кнопці, бо в iframe кліки не трекаються.

### 4.4 Деплой (етап 4)
- [x] **4.4.1** Встановлено `gh` і `vercel` CLI.
- [x] **4.4.2** `gh` (dzebovski) і `vercel` (makrodzebiki-2550) авторизовані. Vercel MCP (plugin:vercel:vercel) підключено.
- [ ] **4.4.3** Підключити репо до Vercel, env-змінні (`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GADS_ID`).
- [ ] **4.4.4** Домен + редіректи зі старих URL (`/cycling-routes`, `/getting-here`, `/when-to-visit` …) на секції нового лендінгу.

---

## 5. Тестова реклама

Стартувати одразу після запуску лендінгу й перевірки подій (жовтень–листопад: бронювання на грудень–березень).

### 5.1 Meta (Instagram + Facebook)
- [ ] **5.1.1** Кампанія `BCB_Winter_LongStay`: ціль Sales (або Leads), оптимізація на `LongStayIntent`. Бюджет-тест **€15/день**, 14 днів.
- [ ] **5.1.2** Ad sets:
  - `Riders_EN`: UK, IE, Скандинавія, NL, BE · 35–60 · інтереси як Advantage+ підказка: Strava, Zwift, GCN, Rapha, Canyon, Specialized, Tour de France, road cycling, triathlon
  - `Riders_DE`: DE, AT, CH · ті самі інтереси · DE-креативи → `/de`
  - `Winterers_50+`: UK, NL, BE, DE, Скандинавія · 55–70 · інтереси: travel, Spain, retirement, cycling → секція long stay
- [ ] **5.1.3** Креативи (3–4 на ad set):
  1. Reel: підйом на Coll de Rates у січні, текст «+19°C in January»
  2. Контраст: «Amsterdam, +3°C, rain / Ondara, +19°C, sun»
  3. Карусель: 3 маршрути (км / м висоти) + будинок
  4. «Pogačar: 11:57 on Coll de Rates. Your host: 19:20. Your time?» (Strava-челендж)
  5. Для 50+: «Spend your winter here: monthly stays from €X»
- [ ] **5.1.4** Ремаркетинг: відвідувачі лендінгу за 30 днів без `LongStayIntent`.

### 5.2 Google Ads (Search)
- [ ] **5.2.1** Кампанія `BCB_Search_EN`, **€10–15/день**, конверсія `LongStayIntent`:
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
- 2026-10-08: створено трекер; зібрано контекст зі старого сайту та прототипу `old.zip`; репо очищено; встановлено `gh`, `vercel`.
