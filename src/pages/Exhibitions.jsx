import React, { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { exhibitions } from '../data/exhibitions'
import { useTranslation } from '../i18n/useTranslation'

const CATS_EN = ['All', 'Classical Art', 'Ancient History', 'Modern Art', 'Contemporary Art', 'Cultural Heritage']

function ExhibitionCard({ ex }) {
  const { t } = useTranslation()
  return (
    <Link to={`/exhibitions/${ex.id}`}
      className="group block bg-white rounded-3xl overflow-hidden border border-[#e0d9d0] hover:border-[#c8a96e] transition-all duration-400 hover:-translate-y-1 card-shadow">
      <div className="img-zoom aspect-[16/10] overflow-hidden">
        <img src={ex.image} alt={ex.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="section-label">{ex.category}</span>
          <span className="w-1 h-1 rounded-full bg-[#c0b9b0]" />
          <span className="section-label">{ex.date}</span>
        </div>
        <h3 className="font-serif text-xl md:text-2xl text-[#1a1a1a] mb-2 group-hover:text-[#c8a96e] transition-colors leading-tight">
          {ex.title}
        </h3>
        <p className="text-[#6b6b6b] text-sm leading-relaxed line-clamp-2 mb-4">{ex.description}</p>
        <span className="inline-flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] group-hover:text-[#c8a96e] transition-colors">
          {t('exh_view')} <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
        </span>
      </div>
    </Link>
  )
}

export default function Exhibitions() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQ, setSearchQ] = useState('')
  const gridRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    setSearchQ(searchParams.get('q') || '')
    const cat = searchParams.get('category') || 'All'
    setActiveCategory(CATS_EN.includes(cat) ? cat : 'All')
  }, [searchParams])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [])

  const filtered = exhibitions.filter(ex => {
    const matchCat = activeCategory === 'All' || ex.category === activeCategory
    const matchQ   = !searchQ || ex.title.toLowerCase().includes(searchQ.toLowerCase())
    return matchCat && matchQ
  })

  // Category labels — always EN for data matching, display key translated
  const catLabels = [
    { key: 'All',              label: t('exh_cat_all') },
    { key: 'Classical Art',    label: 'Classical Art' },
    { key: 'Ancient History',  label: 'Ancient History' },
    { key: 'Modern Art',       label: 'Modern Art' },
    { key: 'Contemporary Art', label: 'Contemporary Art' },
    { key: 'Cultural Heritage',label: 'Cultural Heritage' },
  ]

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div ref={heroRef} className="px-6 md:px-12 max-w-[1400px] mx-auto mb-14">
        <p className="section-label mb-3">{t('exh_whats_on')}</p>
        <h1 className="section-title mb-6">{t('exh_title')}</h1>
        <div className="divider mb-10" />
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {catLabels.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveCategory(key)}
                className={`px-4 py-2 rounded-full text-[0.72rem] font-medium tracking-[0.1em] uppercase border transition-all duration-300
                  ${activeCategory === key
                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                    : 'bg-transparent text-[#6b6b6b] border-[#e0d9d0] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 border border-[#e0d9d0] rounded-full px-4 py-2 bg-white min-w-[260px]">
            <svg className="w-4 h-4 text-[#9b9490]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.65 4.65a7.5 7.5 0 0012 12z" />
            </svg>
            <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder={t('exh_search_ph')}
              className="bg-transparent text-sm text-[#1a1a1a] outline-none placeholder:text-[#c0b9b0] flex-1" />
            {searchQ && <button onClick={() => setSearchQ('')} className="text-[#9b9490] hover:text-[#1a1a1a]">✕</button>}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[1400px] mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-3xl text-[#1a1a1a] mb-3">{t('exh_no_results')}</p>
            <p className="text-[#6b6b6b]">{t('exh_no_results_sub')}</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(ex => <ExhibitionCard key={ex.id} ex={ex} />)}
          </div>
        )}
      </div>
    </div>
  )
}
