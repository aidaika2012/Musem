import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { collections } from '../data/collections'
import { artworks } from '../data/artworks'
import { useTranslation } from '../i18n/useTranslation'

gsap.registerPlugin(ScrollTrigger)

export default function Collection() {
  const { t } = useTranslation()
  const heroRef  = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.children ? [...heroRef.current.children] : [], {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      })
      gsap.from(statsRef.current?.children ? [...statsRef.current.children] : [], {
        y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
      })
    })
    return () => ctx.revert()
  }, [])

  const stats = [
    { n: '15,500+', label: t('col_total') },
    { n: '48',      label: t('col_gal') },
    { n: '4',       label: t('col_cols') },
    { n: '2,500+',  label: t('col_years') },
  ]

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div ref={heroRef} className="px-6 md:px-12 max-w-[1400px] mx-auto mb-16">
        <p className="section-label mb-3">{t('col_page_label')}</p>
        <h1 className="section-title mb-4">{t('col_page_title')}</h1>
        <p className="text-[#6b6b6b] text-lg max-w-2xl leading-relaxed mb-8">{t('col_page_desc')}</p>
        <div className="divider" />
      </div>

      <div ref={statsRef} className="px-6 md:px-12 max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-6 border border-[#e0d9d0] text-center">
            <p className="font-serif text-4xl text-[#1a1a1a] mb-1">{s.n}</p>
            <p className="section-label">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-6 md:px-12 max-w-[1400px] mx-auto space-y-6 mb-20">
        {collections.map(col => (
          <Link key={col.id} to={`/collection/${col.id}`}
            className="group flex flex-col md:flex-row overflow-hidden bg-white rounded-3xl border border-[#e0d9d0] hover:border-[#c8a96e] transition-all duration-400 hover:-translate-y-0.5 card-shadow">
            <div className="img-zoom w-full md:w-72 aspect-[4/3] md:aspect-auto flex-shrink-0">
              <img src={col.image} alt={col.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="section-label">{col.number}</span>
                  <span className="section-label">{col.count}</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] mb-1 group-hover:text-[#c8a96e] transition-colors">
                  {col.title}
                </h2>
                <p className="text-[#9b9490] text-sm mb-4">{col.subtitle}</p>
                <p className="text-[#6b6b6b] text-sm leading-relaxed max-w-lg">{col.description}</p>
              </div>
              <div className="flex items-center gap-3 mt-6 text-[0.72rem] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] group-hover:text-[#c8a96e] transition-colors">
                {t('col_explore_btn')}
                <span className="transition-transform duration-300 group-hover:translate-x-1.5 inline-block">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-label mb-2">{t('col_highlights')}</p>
            <h2 className="font-serif text-3xl">{t('col_from')}</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {artworks.map(a => (
            <Link key={a.id} to={`/artworks/${a.id}`} className="group">
              <div className="img-zoom rounded-2xl overflow-hidden aspect-[3/4] mb-3">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
              </div>
              <p className="font-serif text-sm text-[#1a1a1a] group-hover:text-[#c8a96e] transition-colors leading-snug">{a.title}</p>
              <p className="text-[0.7rem] text-[#9b9490] mt-0.5">{a.artist} · {a.year}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
