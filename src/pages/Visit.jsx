import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '../i18n/useTranslation'
import MuseumMap from '../components/MuseumMap'
import visitImg from '../assets/image copy 2.png'

gsap.registerPlugin(ScrollTrigger)

export default function Visit() {
  const { t } = useTranslation()
  const heroRef     = useRef(null)
  const sectionsRef = useRef(null)

  const hours = [
    { day: t('pv_monday'),   time: t('pv_closed'), closed: true },
    { day: t('pv_tue_fri'),  time: '10:00 – 18:00' },
    { day: t('pv_sat_sun'),  time: '10:00 – 19:00' },
    { day: t('visit_public_holidays'), time: '11:00 – 17:00' },
  ]

  const tickets = [
    { type: t('pv_adult'),    price: '800 KGS' },
    { type: t('pv_student'),  price: '400 KGS' },
    { type: t('pv_senior'),   price: '400 KGS' },
    { type: t('pv_children'), price: t('pv_free') },
    { type: t('pv_family'),   price: '1,800 KGS' },
  ]

  const faqs = [
    { q: t('faq_1_q'), a: t('faq_1_a') },
    { q: t('faq_2_q'), a: t('faq_2_a') },
    { q: t('faq_3_q'), a: t('faq_3_a') },
    { q: t('faq_4_q'), a: t('faq_4_a') },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.children ? [...heroRef.current.children] : [], {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      })
      sectionsRef.current?.querySelectorAll('.reveal-section').forEach(s => {
        gsap.from(s, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: s, start: 'top 82%' } })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="px-6 md:px-12 max-w-[1400px] mx-auto">
        <div ref={heroRef} className="mb-16">
          <p className="section-label mb-3">{t('visit_label')}</p>
          <h1 className="section-title mb-6">{t('visit_title')}</h1>
          <p className="text-[#6b6b6b] text-lg max-w-xl leading-relaxed">{t('visit_desc')}</p>
          <div className="divider mt-10" />
        </div>

        <div ref={sectionsRef} className="space-y-8">
          {/* Hours + Tickets */}
          <div className="reveal-section grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-[#e0d9d0] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#f0ebe3] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#c8a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl">{t('visit_hours')}</h2>
              </div>
              {hours.map(h => (
                <div key={h.day} className="flex justify-between items-center py-3 border-b border-[#f0ebe3] last:border-0">
                  <span className="text-[#6b6b6b] text-sm">{h.day}</span>
                  <span className={`text-sm font-medium ${h.closed ? 'text-[#c8a96e]' : 'text-[#1a1a1a]'}`}>{h.time}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#1a1a1a] rounded-3xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#c8a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl">{t('visit_admission')}</h2>
              </div>
              {tickets.map(tk => (
                <div key={tk.type} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                  <span className="text-white/60 text-sm">{tk.type}</span>
                  <span className="text-sm font-medium text-white">{tk.price}</span>
                </div>
              ))}
              <Link to="/booking" className="mt-6 block w-full text-center py-3 rounded-full bg-[#c8a96e] text-[#1a1a1a] text-sm font-medium tracking-[0.1em] uppercase hover:bg-white transition-colors">
                {t('visit_book_online')}
              </Link>
            </div>
          </div>

          {/* Location */}
          <div className="reveal-section bg-white rounded-3xl border border-[#e0d9d0] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr]">
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#f0ebe3] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#c8a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="font-serif text-2xl">{t('visit_getting_here')}</h2>
                </div>
                <div className="space-y-5 text-sm text-[#6b6b6b]">
                  {[
                    { label: t('visit_address'),   value: 'Museum Avenue, 1\nBishkek 720000\nKyrgyzstan' },
                    { label: t('visit_transport'), value: t('visit_transport_desc') },
                    { label: t('visit_parking'),   value: t('visit_parking_desc') },
                    { label: t('visit_contact'),   value: '+996 312 000 000\ninfo@museum.kg' },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="font-medium text-[#1a1a1a] mb-1">{item.label}</p>
                      <p className="whitespace-pre-line">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="min-h-[380px] h-full">
                <MuseumMap height="100%" className="h-full rounded-none" />
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="reveal-section">
            <p className="section-label mb-3">{t('visit_faq')}</p>
            <h2 className="font-serif text-3xl mb-8">{t('visit_faq_title')}</h2>
            <div className="space-y-4">
              {faqs.map(faq => (
                <details key={faq.q} className="group bg-white rounded-2xl border border-[#e0d9d0] overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-medium text-[#1a1a1a] hover:text-[#c8a96e] transition-colors">
                    {faq.q}
                    <svg className="w-5 h-5 flex-shrink-0 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-[#6b6b6b] text-sm leading-relaxed">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="reveal-section bg-[#1a1a1a] rounded-3xl p-10 md:p-14 text-center text-white">
            <p className="section-label text-white/40 mb-4">{t('visit_ready')}</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">{t('visit_book_banner')}</h2>
            <Link to="/booking" className="inline-flex items-center gap-3 bg-[#c8a96e] text-[#1a1a1a] rounded-full px-8 py-4 text-sm font-medium tracking-[0.12em] uppercase hover:bg-white transition-colors">
              {t('visit_reserve')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
