import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '../../i18n/useTranslation'
import MuseumMap from '../MuseumMap'
import visitImg from '../../assets/image copy 2.png'

gsap.registerPlugin(ScrollTrigger)

export default function PlanVisit() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const leftRef    = useRef(null)
  const contentRef = useRef(null)

  const hours = [
    { day: t('pv_tue_fri'),  time: '10:00 — 18:00' },
    { day: t('pv_sat_sun'),  time: '10:00 — 19:00' },
    { day: t('pv_monday'),   time: t('pv_closed') },
  ]

  const tickets = [
    { type: t('pv_adult'),    price: '800 KGS' },
    { type: t('pv_student'),  price: '400 KGS' },
    { type: t('pv_children'), price: t('pv_free') },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        x: -80, opacity: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
      gsap.from(contentRef.current, {
        x: 80, opacity: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ── Сол жак: музейдин сүрөтү + карта ── */}
        <div ref={leftRef} className="flex flex-col gap-5">
          {/* Museum photo */}
          <div className="img-zoom rounded-3xl overflow-hidden aspect-[16/10]">
            <img
              src={visitImg}
              alt="Museum interior"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Real interactive map */}
          <MuseumMap height="320px" />
        </div>

        {/* ── Оң жак: маалымат ── */}
        <div ref={contentRef} className="flex flex-col gap-10">
          <div>
            <p className="section-label mb-4">{t('pv_label')}</p>
            <h2 className="section-title mb-4">
              {t('pv_title').split(' ').slice(0, -1).join(' ')}<br />
              <em className="italic">{t('pv_title').split(' ').slice(-1)}</em>
            </h2>
          </div>

          {/* Opening hours */}
          <div>
            <h3 className="text-[0.7rem] font-medium tracking-[0.2em] uppercase text-[#1a1a1a] mb-4">
              {t('pv_hours_title')}
            </h3>
            <div className="flex flex-col gap-3">
              {hours.map(h => (
                <div key={h.day} className="flex justify-between items-center py-2 border-b border-[#e0d9d0]">
                  <span className="text-[#6b6b6b] text-sm">{h.day}</span>
                  <span className={`text-sm font-medium ${h.time === t('pv_closed') ? 'text-[#c8a96e]' : 'text-[#1a1a1a]'}`}>
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-[0.7rem] font-medium tracking-[0.2em] uppercase text-[#1a1a1a] mb-3">
              {t('pv_location_title')}
            </h3>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">
              Museum Avenue, 1<br />Bishkek, 720000<br />Kyrgyzstan
            </p>
          </div>

          {/* Tickets */}
          <div>
            <h3 className="text-[0.7rem] font-medium tracking-[0.2em] uppercase text-[#1a1a1a] mb-4">
              {t('pv_admission_title')}
            </h3>
            <div className="flex flex-col gap-2">
              {tickets.map(tk => (
                <div key={tk.type} className="flex justify-between items-center py-2 border-b border-[#e0d9d0]">
                  <span className="text-[#6b6b6b] text-sm">{tk.type}</span>
                  <span className="text-sm font-medium text-[#1a1a1a]">{tk.price}</span>
                </div>
              ))}
            </div>
          </div>

          <Link to="/booking" className="btn-ticket self-start text-sm mt-2">{t('pv_cta')}</Link>
        </div>
      </div>
    </section>
  )
}
