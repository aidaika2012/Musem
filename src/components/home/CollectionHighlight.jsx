import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '../../i18n/useTranslation'
import collectionImg from '../../assets/image copy.png'

gsap.registerPlugin(ScrollTrigger)

function useCounter(end, duration = 2.2, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / (duration * 1000), 1)
      setCount(Math.floor(p * end))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, end, duration])
  return count
}

function StatCounter({ stat, triggered, label }) {
  const raw = useCounter(stat.value, 2.2, triggered)
  const format = (n) => {
    if (stat.value >= 10000) return (n / 1000).toFixed(0) + 'K+'
    if (stat.value >= 1000)  return (n / 1000).toFixed(1) + 'K'
    return n.toString()
  }
  return (
    <div>
      <div className="font-serif text-5xl md:text-6xl text-[#1a1a1a] leading-none mb-1">
        {triggered ? format(raw) : '0'}
      </div>
      <div className="section-label mt-1">{label}</div>
    </div>
  )
}

export default function CollectionHighlight() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const textRef    = useRef(null)
  const imageRef   = useRef(null)
  const [triggered, setTriggered] = useState(false)

  const stats = [
    { value: 120000, label: t('stat_artworks') },
    { value: 48,     label: t('stat_galleries') },
    { value: 2500,   label: t('stat_history') },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        x: -60, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', onEnter: () => setTriggered(true) },
      })
      gsap.from(imageRef.current, {
        x: 60, opacity: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
      gsap.to(imageRef.current, {
        y: -40, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div ref={textRef}>
          <p className="section-label mb-4">{t('col_label')}</p>
          <h2 className="section-title mb-6">
            {t('col_title').split(' ').slice(0, -1).join(' ')}<br />
            <em className="italic">{t('col_title').split(' ').slice(-1)}</em>
          </h2>
          <p className="text-[#6b6b6b] text-base leading-relaxed max-w-md mb-10">{t('col_desc')}</p>
          <Link to="/collection" className="btn-outline mb-14 inline-flex">{t('col_explore')}</Link>
          <div className="grid grid-cols-3 gap-3 sm:gap-8 mt-8 pt-8 border-t border-[#e0d9d0]">
            {stats.map(s => <StatCounter key={s.label} stat={s} triggered={triggered} label={s.label} />)}
          </div>
        </div>
        <div ref={imageRef} className="relative">
          <div className="img-zoom rounded-3xl overflow-hidden aspect-[4/5]">
            <img src={collectionImg}
              alt="Museum collection" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-8 left-8 bg-[#f8f5f0]/90 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-sm">
            <p className="section-label mb-0.5">{t('col_on_view')}</p>
            <p className="font-serif text-lg text-[#1a1a1a]">{t('col_active')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
