import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getFeaturedExhibitions } from '../../data/exhibitions'
import { useTranslation } from '../../i18n/useTranslation'

gsap.registerPlugin(ScrollTrigger)

function ExhibitionCard({ ex, index }) {
  const { t } = useTranslation()
  return (
    <Link to={`/exhibitions/${ex.id}`}
      className="flex-shrink-0 w-[320px] md:w-[380px] group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-5">
        <img src={ex.image} alt={ex.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" />
        <span className="absolute top-4 left-4 text-white/60 font-serif text-sm">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <span className="section-label">{ex.category}</span>
        <span className="w-1 h-1 rounded-full bg-[#c0b9b0]" />
        <span className="section-label">{ex.date}</span>
      </div>
      <h3 className="font-serif text-2xl leading-tight mb-2 text-[#1a1a1a] group-hover:text-[#c8a96e] transition-colors duration-300">
        {ex.title}
      </h3>
      <p className="text-[#6b6b6b] text-sm leading-relaxed line-clamp-2 mb-4">{ex.description}</p>
      <span className="inline-flex items-center gap-2 text-[0.75rem] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] group-hover:text-[#c8a96e] transition-colors duration-300">
        {t('feat_view')}
        <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
      </span>
    </Link>
  )
}

export default function FeaturedExhibitions() {
  const { t } = useTranslation()
  const featured   = getFeaturedExhibitions()
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const trackRef   = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const scroll = (dir) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: dir * 400, behavior: 'smooth' })
    setTimeout(() => {
      setCanPrev(track.scrollLeft > 0)
      setCanNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 10)
    }, 350)
  }

  const handleTrackScroll = () => {
    const track = trackRef.current
    if (!track) return
    setCanPrev(track.scrollLeft > 0)
    setCanNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 10)
  }

  return (
    <section ref={sectionRef} className="py-20 overflow-hidden">
      <div ref={titleRef} className="flex items-center justify-between px-6 md:px-12 max-w-[1400px] mx-auto mb-10">
        <div>
          <p className="section-label mb-2">{t('feat_on_view')}</p>
          <h2 className="section-title">{t('feat_title')}</h2>
        </div>
        <div className="flex gap-3">
          {[{ dir: -1, label: '←', can: canPrev }, { dir: 1, label: '→', can: canNext }].map(({ dir, label, can }) => (
            <button key={dir} onClick={() => scroll(dir)} disabled={!can} aria-label={label}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300
                ${can ? 'border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a]'
                      : 'border-[#e0d9d0] text-[#c0b9b0] cursor-not-allowed'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div ref={trackRef} onScroll={handleTrackScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth px-6 md:px-12 pb-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
        {featured.map((ex, i) => <ExhibitionCard key={ex.id} ex={ex} index={i} />)}
        <div className="flex-shrink-0 w-6" />
      </div>
    </section>
  )
}
