import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { getExhibitionById, exhibitions } from '../data/exhibitions'
import { artworks } from '../data/artworks'
import { useTranslation } from '../i18n/useTranslation'

function GalleryImage({ src, alt }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}
        className="img-zoom rounded-2xl overflow-hidden aspect-square block w-full cursor-zoom-in">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6" onClick={() => setOpen(false)}>
          <img src={src} alt={alt} className="max-w-full max-h-full rounded-2xl object-contain" />
          <button onClick={() => setOpen(false)} className="absolute top-6 right-6 text-white/80 hover:text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}

export default function ExhibitionDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const ex = getExhibitionById(id)
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

  if (!ex) return (
    <div className="pt-28 px-6 text-center">
      <p className="font-serif text-3xl mb-4">{t('exd_not_found')}</p>
      <Link to="/exhibitions" className="btn-outline">{t('exd_back')}</Link>
    </div>
  )

  const relatedArtworks    = artworks.filter(a => ex.artworks?.includes(a.id))
  const relatedExhibitions = exhibitions.filter(e => e.id !== ex.id && e.category === ex.category).slice(0, 2)

  return (
    <div className="pt-20 pb-24">
      <div className="overflow-hidden rounded-b-[3rem] h-[55vh] md:h-[70vh] relative">
        <img ref={heroRef} src={ex.cover} alt={ex.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 overlay-dark" />
        <div className="absolute bottom-10 left-8 md:left-16 text-white">
          <p className="section-label text-white/70 mb-2">{ex.category}</p>
          <h1 className="font-serif text-4xl md:text-6xl xl:text-7xl leading-tight max-w-3xl">{ex.title}</h1>
        </div>
      </div>

      <div className="px-6 md:px-16 max-w-[1400px] mx-auto mt-8 mb-14">
        <nav className="flex items-center gap-2 text-[0.72rem] tracking-[0.1em] uppercase text-[#9b9490]">
          <Link to="/" className="hover:text-[#1a1a1a]">{t('exd_breadcrumb_home')}</Link>
          <span>/</span>
          <Link to="/exhibitions" className="hover:text-[#1a1a1a]">{t('exd_breadcrumb_exh')}</Link>
          <span>/</span>
          <span className="text-[#1a1a1a]">{ex.title}</span>
        </nav>
      </div>

      <div ref={contentRef} className="px-6 md:px-16 max-w-[1400px] mx-auto">
        {/* Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14 p-8 bg-white rounded-3xl border border-[#e0d9d0]">
          {[
            { label: t('exd_dates'),    value: ex.date },
            { label: t('exd_location'), value: ex.location },
            { label: t('exd_curator'),  value: ex.curator },
            { label: t('exd_category'), value: ex.category },
          ].map(item => (
            <div key={item.label}>
              <p className="section-label mb-1">{item.label}</p>
              <p className="text-[#1a1a1a] text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-14 mb-16">
          <div>
            <p className="text-[#1a1a1a] text-lg leading-relaxed mb-8">{ex.description}</p>
            <Link to="/booking" className="btn-ticket">{t('exd_book')}</Link>
          </div>
          <div className="bg-[#f0ebe3] rounded-3xl p-8">
            <p className="section-label mb-3">{t('exd_about_curator')}</p>
            <p className="font-serif text-xl text-[#1a1a1a] mb-3">{ex.curator}</p>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">{ex.curatorBio}</p>
          </div>
        </div>

        {relatedArtworks.length > 0 && (
          <div className="mb-16">
            <p className="section-label mb-3">{t('exd_gallery')}</p>
            <h2 className="font-serif text-3xl mb-8">{t('exd_featured_artworks')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedArtworks.map(a => (
                <Link key={a.id} to={`/artworks/${a.id}`}>
                  <GalleryImage src={a.image} alt={a.title} />
                  <p className="mt-2 font-serif text-sm text-[#1a1a1a]">{a.title}</p>
                  <p className="text-[0.7rem] text-[#9b9490]">{a.artist}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {relatedExhibitions.length > 0 && (
          <div>
            <div className="divider mb-10" />
            <p className="section-label mb-3">{t('exd_related_label')}</p>
            <h2 className="font-serif text-3xl mb-8">{t('exd_related_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedExhibitions.map(rel => (
                <Link key={rel.id} to={`/exhibitions/${rel.id}`}
                  className="group flex gap-5 bg-white rounded-2xl overflow-hidden border border-[#e0d9d0] hover:border-[#c8a96e] transition-all duration-300">
                  <div className="img-zoom w-40 flex-shrink-0">
                    <img src={rel.image} alt={rel.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex flex-col justify-center">
                    <p className="section-label mb-1">{rel.category}</p>
                    <h3 className="font-serif text-lg text-[#1a1a1a] group-hover:text-[#c8a96e] transition-colors">{rel.title}</h3>
                    <p className="text-[0.72rem] text-[#9b9490] mt-1">{rel.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
