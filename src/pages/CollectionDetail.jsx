import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCollectionById } from '../data/collections'
import { artworks } from '../data/artworks'
import { useTranslation } from '../i18n/useTranslation'

export default function CollectionDetail() {
  const { id } = useParams()
  const { t }  = useTranslation()
  const col    = getCollectionById(id)

  if (!col) return (
    <div className="pt-28 px-6 text-center">
      <p className="font-serif text-3xl mb-4">{t('col_not_found')}</p>
      <Link to="/collection" className="btn-outline">{t('col_back')}</Link>
    </div>
  )

  const colArtworks = artworks.filter(a => a.category === col.title)

  return (
    <div className="pt-20 pb-24">
      <div className="relative h-[50vh] overflow-hidden rounded-b-[3rem]">
        <img src={col.image} alt={col.title} className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 overlay-dark" />
        <div className="absolute bottom-10 left-8 md:left-16 text-white">
          <p className="section-label text-white/70 mb-2">{col.number}</p>
          <h1 className="font-serif text-4xl md:text-6xl">{col.title}</h1>
          <p className="text-white/70 mt-2">{col.subtitle}</p>
        </div>
      </div>

      <div className="px-6 md:px-16 max-w-[1400px] mx-auto">
        <nav className="flex items-center gap-2 text-[0.72rem] tracking-[0.1em] uppercase text-[#9b9490] mt-8 mb-12">
          <Link to="/" className="hover:text-[#1a1a1a]">{t('exd_breadcrumb_home')}</Link>
          <span>/</span>
          <Link to="/collection" className="hover:text-[#1a1a1a]">{t('nav_collection')}</Link>
          <span>/</span>
          <span className="text-[#1a1a1a]">{col.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <p className="text-[#1a1a1a] text-lg leading-relaxed">{col.description}</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t('stat_artworks'), value: col.stats.artworks },
              { label: 'Period',           value: col.stats.period },
              { label: t('stat_galleries'),value: col.stats.galleries },
            ].map(s => (
              <div key={s.label} className="bg-[#f0ebe3] rounded-2xl p-5 text-center">
                <p className="font-serif text-2xl text-[#1a1a1a] mb-1">{s.value}</p>
                <p className="section-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="divider mb-12" />
        <p className="section-label mb-3">{t('col_works_label')}</p>
        <h2 className="font-serif text-3xl mb-10">{t('col_works_title')}</h2>

        {colArtworks.length === 0 ? (
          <div className="text-center py-16 text-[#6b6b6b]">
            <p className="font-serif text-2xl mb-2">{t('col_coming_soon')}</p>
            <p className="text-sm">{t('col_expanding')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {colArtworks.map(a => (
              <Link key={a.id} to={`/artworks/${a.id}`} className="group">
                <div className="img-zoom rounded-2xl overflow-hidden aspect-[4/5] mb-4">
                  <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                </div>
                <p className="font-serif text-xl text-[#1a1a1a] group-hover:text-[#c8a96e] transition-colors">{a.title}</p>
                <p className="text-[#9b9490] text-sm mt-1">{a.artist} · {a.year}</p>
                <p className="text-[#6b6b6b] text-sm mt-1">{a.material}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
