import { heroImg, galleryImg, exhibitImg, scienceImg } from '../assets/index.js'

export const exhibitions = [
  {
    id: 1,
    title: "Echoes of the Ancient World",
    category: "Ancient History",
    date: "15 Jan – 30 Apr 2026",
    location: "Gallery A, East Wing",
    image:  galleryImg,
    cover:  galleryImg,
    description:
      "Journey through the earliest civilisations of Mesopotamia, Egypt and the Indus Valley. Rare artefacts, cuneiform tablets and monumental sculptures tell the story of humanity's first great cities.",
    curator: "Dr. Aisha Karimova",
    curatorBio:
      "Senior Curator of Antiquities with 20 years of fieldwork across the Middle East and Central Asia.",
    featured: true,
    artworks: [2, 5, 8],
  },
  {
    id: 2,
    title: "Light & Shadow: Impressionist Visions",
    category: "Classical Art",
    date: "1 Feb – 15 Jun 2026",
    location: "Gallery B, West Wing",
    image:  heroImg,
    cover:  heroImg,
    description:
      "An intimate exploration of the Impressionist movement — from Monet's shimmering water lilies to Renoir's sun-dappled gardens. Over 60 masterworks on loan from collections across Europe.",
    curator: "Prof. Jean-Luc Moreau",
    curatorBio:
      "Art historian specialising in 19th-century French painting, author of 'The Broken Brush'.",
    featured: true,
    artworks: [1, 3, 6],
  },
  {
    id: 3,
    title: "Futures Unwritten",
    category: "Contemporary Art",
    date: "20 Mar – 31 Jul 2026",
    location: "Gallery C, North Wing",
    image:  exhibitImg,
    cover:  exhibitImg,
    description:
      "Fifteen international artists respond to the uncertainties of our era with immersive installations, video art and large-format painting. A meditation on technology, memory and the human condition.",
    curator: "Sofía Reyes",
    curatorBio:
      "Independent curator and critic, former artistic director of the Biennale de las Américas.",
    featured: true,
    artworks: [4, 7, 9],
  },
  {
    id: 4,
    title: "The Silk Road: Routes of Exchange",
    category: "Ancient History",
    date: "5 Apr – 20 Aug 2026",
    location: "Gallery D, South Wing",
    image:  scienceImg,
    cover:  scienceImg,
    description:
      "Trace the legendary trade routes that connected China to the Mediterranean. Rare textiles, ceramics, coins and manuscripts reveal the extraordinary cultural exchange that shaped the medieval world.",
    curator: "Dr. Wei Zhang",
    curatorBio:
      "Professor of Silk Road Studies at the National University, leading expert in Central Asian trade networks.",
    featured: false,
    artworks: [2, 8],
  },
  {
    id: 5,
    title: "Geometry of Dreams",
    category: "Modern Art",
    date: "10 May – 15 Sep 2026",
    location: "Gallery E, Upper Level",
    image:  galleryImg,
    cover:  galleryImg,
    description:
      "From Bauhaus to Brutalism — a sweeping survey of geometric abstraction across architecture, sculpture and design. The exhibition charts how pure form became the language of a new century.",
    curator: "Marina Hoffmann",
    curatorBio:
      "Architectural historian and design critic, contributor to Architectural Digest and Domus.",
    featured: false,
    artworks: [3, 6],
  },
  {
    id: 6,
    title: "Nomadic Horizons",
    category: "Cultural Heritage",
    date: "1 Jun – 30 Oct 2026",
    location: "Gallery F, Ground Floor",
    image:  exhibitImg,
    cover:  heroImg,
    description:
      "Celebrating the rich traditions of the nomadic peoples of Central Asia — felt arts, jewellery, epic oral poetry and ceremonial objects that embody a profound relationship with land and sky.",
    curator: "Anar Bekova",
    curatorBio:
      "Ethnographer and textile specialist, recipient of the UNESCO Cultural Heritage Award 2023.",
    featured: true,
    artworks: [1, 5, 9],
  },
]

export const getExhibitionById = (id) =>
  exhibitions.find((e) => e.id === Number(id))

export const getFeaturedExhibitions = () =>
  exhibitions.filter((e) => e.featured)
