# MUSEUM — React + Vite

Интерактивдүү музей веб-сайты — коллекциялар, көргөзмөлөр, карталар, брондоо, жана күйонун тили менен.

## Тез иштетүү

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # продакшен үчүн түүжмө
npm run lint       # ESLint
```

## Технологиялар

| Төркүм           | Китепчи                      |
|------------------|------------------------------|
| Фреймворк        | React 19 + Vite 8            |
| Стили            | Tailwind CSS 4               |
| Роутинг          | React Router DOM 7           |
| Анимациялар      | GSAP + ScrollTrigger, Framer Motion |
| Карталар         | Leaflet + React-Leaflet      |
| Авторизация/БД   | Firebase                     |
| Күйон тили       | Өзөйчү (AppContext)           |

## Каталог түрмөгү

```
src/
├── assets/          # Сурөттөр ES модуль катары импорттолот (чектемелерди түз башла тирек ссылкаларды колдонуңуз!)
│   └── index.js     # Боркул: heroImg, galleryImg, exhibitImg, scienceImg экспортторун берет
├── components/
│   ├── home/        # Hero, CollectionHighlight, CollectionCards, PlanVisit, FeaturedExhibitions, ExhibitionFilter
│   ├── layout/      # Layout (framer-motion барак алыстары)
│   ├── header/      # Header (навигация)
│   ├── footer/      # Footer
│   ├── card/        # Card
│   └── MuseumMap.jsx # Leaflet картасы — OpenStreetMap тайлы
├── context/
│   └── AppContext.jsx # Дүйнөлүк маалымат: пайдалануучу авторизациясы, түз эмне ұнаткан, брондоолор, тил
├── data/            # Түз маалымат: collections.js, exhibitions.js, artworks.js
├── i18n/
│   ├── translations.js  # EN + KG которотмолор (бир эле объект)
│   └── useTranslation.js  # t(key) хук, EN'ге ылайтуу
├── pages/           # Барактар (Home, Exhibitions, Collection, Visit, Booking, Contact ж.б.)
├── firebase.js      # Firebase конфигурациясы + auth
├── router.jsx       # createBrowserRouter конфигурациясы
├── App.jsx          # Түбөлүү: AppProvider > RouterProvider
└── main.jsx         # ReactDOM.createRoot кирелиш нүйү
```

## Негизги паттерндер

### Сурөттөр / Активдер
Сурөттөрдү ES модуль катары импорт кылыңыз, `file:///` же ырақтуу жолдорду колдонбого болбойт:

```jsx
import heroImg from '../assets/index.js'   // assets/index.js боркулунан
// же
import img from '../../assets/image.png'
```

Бардык активдер `src/assets/` каталогунда болушу керек. `index.js` боркулунда бардык импорттор бир жерде аныкаш кылынган, а мындай жерден импорт кылуу өнүктүр.

### Күйон тили
```jsx
import { useTranslation } from '../i18n/useTranslation'
const { t, language } = useTranslation()
t('nav_home')   // translations[language][key], EN'ге ылайтуу
```

### Анимациялар (GSAP)
Баардык анимациялуу бөлүмдөр `gsap.context` паттерни менен, тазалоо менен:

```jsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from(ref.current, { ...scrollTrigger... })
  }, sectionRef)
  return () => ctx.revert()   // дайыма тазалоо
}, [])
```

### Дүйнөлүк маалымат
Бардык маалымат `AppContext.jsx` файлында. `useApp()` аркылуу колдонуңуз:

```jsx
import { useApp } from '../context/AppContext'
const { user, favorites, toggleFavorite, language, setLanguage } = useApp()
```

### Роутинг
Роуттар `src/router.jsx` файлында `createBrowserRouter` менен түзөлгөн. Layout баардыгын Header + Footer менен жана framer-motion алыстары менен оберет.

## Жишөөлүү суроолор (FAQ)

**Ж: "script-src 'none'" CSP ката консолго чыккан?**
Ж: CSP бул жобонун кодуна жок (vite.config.js-де `server.headers` жок). Браузер көрсөтүү дүркүндүн экстеншендери, корпоративдүү прокси, же антивирус тарагынан келет. Инкогнит режимде сынаңыз, localhost учуу үчүн экстеншендерди өчүрүңүз, же vite.config.js-ге кошо алсыз:
```js
server: {
  headers: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' ws://localhost:5173;",
  },
}
```

**Ж: "Cannot read image (this model does not support image input)"?**
Ж: Бул код катасы эмне, модельдүүнүн шектөөсү. Азыркы AI модели сурөттөрдү окуй албойт. Көрсөтүү мүмкүнчүлүгү боюнча модельди өзгөртүңүз же сурөт мөөнөтүн текстте сипаттаңыз.

**Ж: 5173 порту алтын??**
Ж: `netstat -ano | findstr :5173` аркылуу PID-ни табтыңыз, ансыын `taskkill /PID <pid> /F`. Же Vite сунуш берген келеси портто иштөтүңүз.

**Ж: Күйон тили қай жерге кошуу?**
Ж: `src/i18n/translations.js`. Өзүнүздүн `EN` менен `KG` объекттерине қосуңуз.

**Ж: Жаңы активдүү кошуу қандай?**
Ж: Файлды `src/assets/` каталогуна коюңуз, `src/assets/index.js`-ге импортко кошуу, ансыын боркул менен импорт кылыңыз.

**Ж: Кийинкичелер кандай?**
Ж: `Playfair Display` (заголовоктар үчүн) жана `Inter` (мөтүн үчүн), `src/index.css`-де Google Fonts аркылуу импорттолгон. CSS токендер `@theme` блогунда аныксыып табык.

**Ж: Жаңы барак кошуу қандай?**
Ж: Компонентти `src/pages/` каталогуна жаратыңыз, `src/router.jsx`-ге роут кошуу. Автоматтуу түрдүн Layout менен оберилет.

**Ж: VSCode-тө Vite линтер каталары түспөй болсо?**
Ж: ESLint көрсөтүү программасын орнотуңуз. Конфигурация `eslint.config.js`-де, кошонулдук сыяқтуу жок.
