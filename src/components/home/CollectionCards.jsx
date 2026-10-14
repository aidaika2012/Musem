import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { collections } from '../../data/collections'
import { useTranslation } from '../../i18n/useTranslation'

gsap.registerPlugin(ScrollTrigger)

function CollectionCard({ col }) {
  const { t } = useTranslation()
  return (
    <Link to={`/collection/${col.id}`}
      className="group relative overflow-hidden rounded-3xl aspect-[3/4] block">
      <img src={col.image} alt={col.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]" />
      <div className="absolute inset-0 transition-all duration-500"
        style={{ background: 'linear-gradient(to bottom,rgba(0,0,0,.1) 0%,rgba(0,0,0,.6) 100%)' }} />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'rgba(0,0,0,.25)' }} />
      <span className="absolute top-6 left-6 text-white/50 font-serif text-sm">{col.number}</span>
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
        <p className="section-label text-white/60 mb-1">{col.subtitle}</p>
        <h3 className="font-serif text-white text-2xl md:text-3xl leading-tight mb-3">{col.title}</h3>
        <div className="flex items-center gap-2 text-white/80 text-sm font-medium tracking-[0.1em] uppercase
          opacity-0 group-hover:opacity-100 transition-all duration-400 -translate-y-2 group-hover:translate-y-0">
          {t('cc_explore')}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  )
}

export default function CollectionCards() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const gridRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
      })
      const cards = gridRef.current?.querySelectorAll('a')
      if (cards) {
        gsap.from(cards, {
          y: 60, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div ref={titleRef} className="mb-12">
        <p className="section-label mb-3">{t('cc_label')}</p>
        <h2 className="section-title">{t('cc_title')}</h2>
      </div>
      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {collections.map(col => <CollectionCard key={col.id} col={col} />)}
      </div>
    </section>
  )
}
