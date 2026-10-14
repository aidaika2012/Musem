import React, { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { getArtworkById, artworks } from '../data/artworks'
import { useApp } from '../context/AppContext'
import { useTranslation } from '../i18n/useTranslation'

export default function ArtworkDetail() {
  const { id } = useParams()
  const { t }  = useTranslation()
  const artwork = getArtworkById(id)
  const { isFavorite, toggleFavorite } = useApp()
  const imgRef  = useRef(null)
  const infoRef = useRef(null)

  useEffect(() => {
    if (!artwork) return
    const ctx = gsap.context(() => {
      gsap.from(imgRef.current,  { x: -60, opacity: 0, duration: 1, ease: 'power3.out' })
      gsap.from(infoRef.current?.children ? [...infoRef.current.children] : [], {
        y: 25, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.2,
      })
    })
    return () => ctx.revert()
  }, [artwork])

  if (!artwork) return (
    <div className="pt-28 px-6 text-center">
      <p className="font-serif text-3xl mb-4">{t('art_not_found')}</p>
      <Link to="/collection" className="btn-outline">← {t('nav_collection')}</Link>
    </div>
  )

  const related = artworks.filter(a => a.id !== artwork.id && a.category === artwork.category).slice(0, 3)
  const fav = isFavorite(artwork.id)

  const details = [
    { label: t('art_year'),       value: artwork.year },
    { label: t('art_material'),   value: artwork.material },
    { label: t('art_dimensions'), value: artwork.dimensions },
    { label: t('art_collection'), value: artwork.collection },
    { label: t('art_location'),   value: artwork.location },
    { label: t('art_category'),   value: artwork.category },
  ]

  return (
    <div className="pt-28 pb-24">
      <nav className="px-6 md:px-16 max-w-[1400px] mx-auto flex items-center gap-2 text-[0.72rem] tracking-[0.1em] uppercase text-[#9b9490] mb-10">
        <Link to="/" className="hover:text-[#1a1a1a]">{t('exd_breadcrumb_home')}</Link>
        <span>/</span>
        <Link to="/collection" className="hover:text-[#1a1a1a]">{t('nav_collection')}</Link>
        <span>/</span>
        <span className="text-[#1a1a1a]">{artwork.title}</span>
      </nav>

      <div className="px-6 md:px-16 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div ref={imgRef} className="sticky top-28">
          <div className="rounded-3xl overflow-hidden aspect-[4/5]">
            <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
          </div>
          <button onClick={() => toggleFavorite(artwork.id)}
            className={`mt-4 flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-medium tracking-[0.08em] uppercase transition-all duration-300
              ${fav ? 'bg-red-50 border-red-200 text-red-500' : 'border-[#e0d9d0] text-[#6b6b6b] hover:border-red-200 hover:text-red-400'}`}>
            <span>{fav ? '♥' : '♡'}</span>
            {fav ? t('art_saved') : t('art_save')}
          </button>
        </div>

        <div ref={infoRef}>
          <p className="section-label mb-2">{artwork.category}</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] leading-tight mb-2">{artwork.title}</h1>
          <p className="text-[#6b6b6b] text-lg mb-8">{artwork.artist}</p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {details.map(item => (
              <div key={item.label} className="bg-[#f0ebe3] rounded-2xl p-4">
                <p className="section-label mb-1">{item.label}</p>
                <p className="text-[#1a1a1a] text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-10">
            <h3 className="font-serif text-2xl mb-3">{t('art_about')}</h3>
            <p className="text-[#6b6b6b] text-base leading-relaxed">{artwork.description}</p>
          </div>

          <Link to="/booking" className="btn-ticket">{t('art_plan')}</Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="px-6 md:px-16 max-w-[1400px] mx-auto mt-20">
          <div className="divider mb-12" />
          <p className="section-label mb-3">{t('art_related_label')} {artwork.category}</p>
          <h2 className="font-serif text-3xl mb-8">{t('art_related_title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map(a => (
              <Link key={a.id} to={`/artworks/${a.id}`} className="group">
                <div className="img-zoom rounded-2xl overflow-hidden aspect-[4/5] mb-3">
                  <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                </div>
                <p className="font-serif text-lg text-[#1a1a1a] group-hover:text-[#c8a96e] transition-colors">{a.title}</p>
                <p className="text-[#9b9490] text-sm mt-1">{a.artist} · {a.year}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
