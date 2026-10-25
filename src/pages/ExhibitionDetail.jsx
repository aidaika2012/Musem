import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useApp } from '../context/AppContext'
import { artworks } from '../data/artworks'
import { useTranslation } from '../i18n/useTranslation'
import Badge from '../components/ui/Badge'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import Button from '../components/ui/Button'
import Divider from '../components/ui/Divider'
import ImageLightbox from '../components/ui/ImageLightbox'
import LoadingState from '../components/ui/LoadingState'
import MediaCard from '../components/ui/MediaCard'
import MetadataGrid from '../components/ui/MetadataGrid'

export default function ExhibitionDetail() {
  const { id } = useParams()
  const { t, localize } = useTranslation()
  const { adminExhibitions: exhibitions, museumDataLoading } = useApp()
  const ex = exhibitions.find(item => String(item.id) === String(id))
  const heroRef    = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!ex) return
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, { scale: 1.06, duration: 1.2, ease: 'power3.out' })
      gsap.from(contentRef.current?.children ? [...contentRef.current.children] : [], {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.3,
      })
    })
    return () => ctx.revert()
  }, [ex])

  if (!ex && museumDataLoading) return <LoadingState label="Loading exhibition…" className="pt-28" />
  if (!ex) return (
    <div className="pt-28 px-6 text-center">
      <p className="font-serif text-3xl mb-4">{t('exd_not_found')}</p>
      <Link to="/exhibitions" className="btn-outline">{t('exd_back')}</Link>
    </div>
  )

  const item = localize(ex)
  const relatedArtworks    = artworks.filter(a => ex.artworks?.includes(a.id))
  const relatedExhibitions = exhibitions.filter(e => String(e.id) !== String(ex.id) && e.category === ex.category).slice(0, 2)

  return (
    <div className="pt-20 pb-24">
      <div className="overflow-hidden rounded-b-[3rem] h-[55vh] md:h-[70vh] relative">
        <img ref={heroRef} src={ex.cover} alt={ex.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 overlay-dark" />
        <div className="absolute bottom-10 left-8 md:left-16 text-white">
          <Badge variant="inverted" className="mb-2 bg-transparent px-0 py-0 text-white/70">{item.category}</Badge>
          <h1 className="font-serif text-4xl md:text-6xl xl:text-7xl leading-tight max-w-3xl">{item.title}</h1>
        </div>
      </div>

      <div className="px-6 md:px-16 max-w-[1400px] mx-auto mt-8 mb-14">
        <Breadcrumbs items={[
          { label: t('exd_breadcrumb_home'), to: '/' },
          { label: t('exd_breadcrumb_exh'), to: '/exhibitions' },
          { label: item.title },
        ]} />
      </div>

      <div ref={contentRef} className="px-6 md:px-16 max-w-[1400px] mx-auto">
        {/* Meta */}
        <MetadataGrid
          className="mb-14 rounded-3xl border border-[#e0d9d0] bg-white p-8"
          items={[
            { label: t('exd_dates'),    value: item.date },
            { label: t('exd_location'), value: item.location },
            { label: t('exd_curator'),  value: item.curator },
            { label: t('exd_category'), value: item.category },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-14 mb-16">
          <div>
            <p className="text-[#1a1a1a] text-lg leading-relaxed mb-8">{item.description}</p>
            <Button to="/booking">{t('exd_book')}</Button>
          </div>
          <div className="bg-[#f0ebe3] rounded-3xl p-8">
            <p className="section-label mb-3">{t('exd_about_curator')}</p>
            <p className="font-serif text-xl text-[#1a1a1a] mb-3">{item.curator}</p>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">{item.curatorBio}</p>
          </div>
        </div>

        {relatedArtworks.length > 0 && (
          <div className="mb-16">
            <p className="section-label mb-3">{t('exd_gallery')}</p>
            <h2 className="font-serif text-3xl mb-8">{t('exd_featured_artworks')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedArtworks.map(a => {
                const art = localize(a)
                return (
                <Link key={a.id} to={`/artworks/${a.id}`}>
                  <ImageLightbox src={a.image} alt={art.title} className="aspect-square rounded-2xl" />
                  <p className="mt-2 font-serif text-sm text-[#1a1a1a]">{art.title}</p>
                  <p className="text-[0.7rem] text-[#9b9490]">{a.artist}</p>
                </Link>
              )})}
            </div>
          </div>
        )}

        {relatedExhibitions.length > 0 && (
          <div>
            <Divider className="mb-10" />
            <p className="section-label mb-3">{t('exd_related_label')}</p>
            <h2 className="font-serif text-3xl mb-8">{t('exd_related_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedExhibitions.map(rel => {
                const relItem = localize(rel)
                return (
                <MediaCard
                  key={rel.id}
                  to={`/exhibitions/${rel.id}`}
                  image={rel.image}
                  alt={relItem.title}
                  eyebrow={`${relItem.category} · ${relItem.date}`}
                  title={relItem.title}
                  description={relItem.description}
                />
              )})}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
