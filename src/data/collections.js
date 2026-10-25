import { heroImg, galleryImg, exhibitImg, scienceImg } from '../assets/index.js'

export const collections = [
  {
    id: 1,
    title: "Classical Art",
    subtitle: "Renaissance to Romanticism",
    number: "01",
    count: "3,400 works",
    image: heroImg,
    description:
      "Five centuries of painting and sculpture from the great masters of Europe. Raphael, Vermeer, Rembrandt and Delacroix anchor a collection that traces Western art from 1400 to 1900.",
    stats: { artworks: "3,400+", period: "1400–1900", galleries: 12 },
    i18n: {
      KG: {
        title: "Классикалык Өнөр",
        subtitle: "Ренессанстан Романтизмге",
        count: "3,400 чыгарма",
        description: "Европанын улуу усталарынан беш кылымдык живопись жана скульптура. Рафаэль, Вермер, Рембрандт жана Делакруа 1400-дөн 1900-гө чейинки Батыш өнөрүн кыдырткан коллекцияны бекемдейт.",
      },
      RU: {
        title: "Классическое искусство",
        subtitle: "От Ренессанса до Романтизма",
        count: "3 400 работ",
        description: "Пять веков живописи и скульптуры великих мастеров Европы. Рафаэль, Вермер, Рембрандт и Делакруа составляют основу коллекции, прослеживающей западное искусство с 1400 по 1900 год.",
      },
      ZH: {
        title: "古典艺术",
        subtitle: "文艺复兴至浪漫主义",
        count: "3,400件作品",
        description: "来自欧洲大师五个世纪的绘画和雕塑。拉斐尔、维米尔、伦勃朗和德拉克洛瓦构成了追溯1400至1900年西方艺术的藏品核心。",
      },
    },
  },
  {
    id: 2,
    title: "Ancient History",
    subtitle: "Egypt · Mesopotamia · Greece",
    number: "02",
    count: "8,200 artefacts",
    image: galleryImg,
    description:
      "One of the finest collections of ancient artefacts outside the major capitals — spanning 5,000 years of human civilisation across the Near East, the Nile Valley and the ancient Mediterranean.",
    stats: { artworks: "8,200+", period: "3500 BCE–500 CE", galleries: 18 },
    i18n: {
      KG: {
        title: "Байыркы Тарых",
        subtitle: "Египет · Месопотамия · Грекия",
        count: "8,200 экспонат",
        description: "Ири башкалалардан тышкары эң мыкты байыркы экспонаттар коллекцияларынын бири — Жакын Чыгышта, Нил өрөөнүндө жана байыркы Жер Ортолук деңизде 5000 жылдык адамзат цивилизациясын камтыйт.",
      },
      RU: {
        title: "Древняя история",
        subtitle: "Египет · Месопотамия · Греция",
        count: "8 200 артефактов",
        description: "Одна из лучших коллекций древних артефактов за пределами крупных столиц — охватывающая 5000 лет человеческой цивилизации на Ближнем Востоке, в долине Нила и древнем Средиземноморье.",
      },
      ZH: {
        title: "古代历史",
        subtitle: "埃及·美索不达米亚·希腊",
        count: "8,200件文物",
        description: "主要首都以外最精美的古代文物藏品之一——跨越近东、尼罗河谷和古地中海5000年人类文明。",
      },
    },
  },
  {
    id: 3,
    title: "Modern Art",
    subtitle: "Bauhaus, Cubism, Abstraction",
    number: "03",
    count: "2,100 works",
    image: scienceImg,
    description:
      "The rupture with tradition: Picasso, Kandinsky, Mondrian and their contemporaries shattered the conventions of representation to forge a new visual language for a turbulent century.",
    stats: { artworks: "2,100+", period: "1900–1970", galleries: 9 },
    i18n: {
      KG: {
        title: "Заманбап Өнөр",
        subtitle: "Баухаус, Кубизм, Абстракция",
        count: "2,100 чыгарма",
        description: "Салт менен үзүлүш: Пикассо, Кандинский, Мондриан жана алардын замандаштары бурчтуу кылымга жаңы визуалдык тил кеңир чыгаруу үчүн сүрөттөөнүн конвенцияларын бузушту.",
      },
      RU: {
        title: "Современное искусство",
        subtitle: "Баухаус, Кубизм, Абстракция",
        count: "2 100 работ",
        description: "Разрыв с традицией: Пикассо, Кандинский, Мондриан и их современники разрушили условности изображения, создав новый визуальный язык для бурного века.",
      },
      ZH: {
        title: "现代艺术",
        subtitle: "包豪斯、立体主义、抽象主义",
        count: "2,100件作品",
        description: "与传统的决裂：毕加索、康定斯基、蒙德里安及其同时代人打破了再现的惯例，为动荡的世纪锻造了一种新的视觉语言。",
      },
    },
  },
  {
    id: 4,
    title: "Contemporary Art",
    subtitle: "From 1970 to Today",
    number: "04",
    count: "1,800 works",
    image: exhibitImg,
    description:
      "A living collection that grows with our times. Installation, performance, digital art and painting from the past five decades, with a strong focus on Central Asian and emerging global voices.",
    stats: { artworks: "1,800+", period: "1970–Present", galleries: 7 },
    i18n: {
      KG: {
        title: "Учурдагы Өнөр",
        subtitle: "1970-жылдан Бүгүнкү Күнгө",
        count: "1,800 чыгарма",
        description: "Замана менен өсүп жаткан жандуу коллекция. Борбордук Азия жана жаңы пайда болуп жаткан глобалдык үндөргө күчтүү басым менен акыркы беш он жылдыктагы орнотуу, аткаруу, санариптик өнөр жана живопись.",
      },
      RU: {
        title: "Актуальное искусство",
        subtitle: "С 1970 года по сегодняшний день",
        count: "1 800 работ",
        description: "Живая коллекция, растущая вместе с нашим временем. Инсталляция, перформанс, цифровое искусство и живопись за последние пять десятилетий с акцентом на центральноазиатские и новые мировые голоса.",
      },
      ZH: {
        title: "当代艺术",
        subtitle: "从1970年至今",
        count: "1,800件作品",
        description: "一个随时代成长的活态藏品。过去五十年的装置、表演、数字艺术和绘画，重点关注中亚和新兴全球声音。",
      },
    },
  },
]

export const getCollectionById = (id) =>
  collections.find((c) => c.id === Number(id))
