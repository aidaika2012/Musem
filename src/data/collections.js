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
  },
]

export const getCollectionById = (id) =>
  collections.find((c) => c.id === Number(id))
